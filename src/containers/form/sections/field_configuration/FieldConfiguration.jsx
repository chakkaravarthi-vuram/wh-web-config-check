import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { Button, Chip, EButtonType, EChipSize, ETabVariation, Modal, ModalSize, ModalStyleType, Tab } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FIELD_CONFIGURATION_STRINGS, FIELD_TYPES, TABLE_FIELD_SOURCE_TYPE } from './FieldConfiguration.strings';
import styles from './FieldConfiguration.module.scss';
import BasicConfiguration from './basic_configuration/BasicConfiguration';
import CloseIconNew from '../../../../assets/icons/CloseIconNew';
import { cloneDeep, isEmpty, get } from '../../../../utils/jsUtility';
import ValidationAndVisibilityConfiguration from './validation_and_visibility_configuration/ValidationAndVisibilityConfiguration';
import AdditionalConfiguration from './additional_configuration/AdditionalConfiguration';
import FieldValueConfiguration from './field_value_configuration/FieldValueConfiguration';
import { FIELD_INITIAL_STATE } from './FieldConfigurationReducer';
import { FIELD_CONFIG_TABS, FIELD_CONFIGURATIONS_CONSTANTS, SUMMARY_CONFIG_TABS } from './FieldConfiguration.constants';
import { getTableFieldChildData, validateFieldConfigurationTab } from './FieldConfiguration.utils';
import { FORM_ACTIONS, FORM_LAYOUT_TYPE } from '../../Form.string';
import { MODULE_TYPES, UTIL_COLOR } from '../../../../utils/Constants';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../utils/constants/form/form.constant';
import { VALIDATION_CONFIG_STRINGS } from './validation_and_visibility_configuration/validation_configuration/ValidationConfiguration.strings';
import { FIELD_GROUPING } from './basic_configuration/BasicConfiguration.utils';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from './basic_configuration/BasicConfiguration.strings';
import DependencyHandler from '../../../../components/dependency_handler/DependencyHandler';
import { getModuleIdByModuleType } from '../../Form.utils';
import { getFieldDetailsApiThunk, listDependencyApiThunk } from '../../../../redux/actions/Form.Action';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../../../utils/constants/form.constant';
import ColumnConfiguration from './column_configuration/ColumnConfiguration';
import { FIELD_LIST_OBJECT } from './basic_configuration/BasicConfiguration.constants';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { getLayoutByPath, getTableColumnFromLayout } from '../form_layout/FormLayout.utils';
import ConfigurationModal from '../../../../components/configuration_modal/ConfigurationModal';
import FieldBasicConfiguration from './field_basic_configuration/FieldBasicConfiguration';
import FieldAdditionalConfiguration from './field_additional_configuration/FieldAdditionalConfiguration';
import { getDashboardComponentThunk } from '../../../../redux/actions/IndividualEntry.Action';
import { updatePostLoader, validate } from '../../../../utils/UtilityFunctions';
import { savePageComponentValidateSchema } from '../../../shared_container/individual_entry/IndividualEntry.validation.schema';
import { setPointerEvent } from '../../../../utils/loaderUtils';
import { getExternalSourceData } from './column_configuration/external_source_column_configuration/ExternalSourceColumnConfiguration.utils';
import BlueLoadingSpinnerIcon from '../../../../assets/BlueLoadingSpinner';

function FieldConfiguration(props) {
  const {
    fieldData = {},
    tableData = {},
    fields = {},
    sectionUUID = null,
    overAllLayout = [],
    onSave,
    onDelete,
    dispatch,
    moduleType = MODULE_TYPES.FLOW,
    metaData = {},
    noOfFields,
    dependencyData,
    setDependencyData,
    tableUtils, // { isNew: boolean, tableFieldSource: inline|external, isTableField: boolean }
   } = props;

  const isTableField = tableUtils?.isTableField;
  const isComponentField = [
    FIELD_TYPE.RICH_TEXT,
    FIELD_TYPE.IMAGE,
    FORM_LAYOUT_TYPE.LAYOUT,
    FIELD_TYPE.BUTTON_LINK,
  ].includes(fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE]);
  const isSummaryForm = moduleType === MODULE_TYPES.SUMMARY;
  const ACTIVE_FIELD_DATA_CHANGE = (isTableField) ?
                              FORM_ACTIONS.ACTIVE_FIELD_COLUMN_DATA_CHANGE :
                              FORM_ACTIONS.ACTIVE_FIELD_DATA_CHANGE;

  const { t } = useTranslation();
  const {
    TITLE,
    BUTTONS,
  } = FIELD_CONFIGURATIONS_CONSTANTS(t);
  const [tab, setTab] = useState(isSummaryForm ? FIELD_CONFIG_TABS.GENERAL : FIELD_CONFIG_TABS.BASIC_CONFIG);
  const [removedRuleUUID, setRemovedRuleUUID] = useState();
  const [isFocused, setIsFocused] = useState({ visibility: false, isSave: false });
  const [loading, setLoading] = useState(true);

  // API CALL FUNCTION
  const getField = async () => {
    setLoading(true);
    if (moduleType === MODULE_TYPES.SUMMARY) {
      const moduleObj = {
        page_id: metaData.pageId,
        field_id: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_ID],
      };
      const data = await getDashboardComponentThunk(moduleObj, { tableData });
      if (fieldData[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] === 'table') {
        data.selectedTableUUID = fieldData.selectedTableUUID;
        data.tableFieldList = fieldData.tableFieldList;
      }
      const tableChildDataList = getTableFieldChildData(fieldData, fields);
      if (!isEmpty(tableChildDataList)) {
        data[RESPONSE_FIELD_KEYS.TABLE_CHILD_DATA] = tableChildDataList;
      }
      // eslint-disable-next-line no-use-before-define
      onFieldDataChangeHandler({
        ...fieldData,
        ...data,
      });
      setLoading(false);
    } else {
      const moduleObj = getModuleIdByModuleType(metaData, moduleType);
      delete moduleObj.step_id;
      const data = await getFieldDetailsApiThunk({
        ...moduleObj,
        form_uuid: metaData?.formUUID,
        field_id: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_ID],
      }, moduleType);

      const consolidatedFieldData = {
        ...fieldData,
        [RESPONSE_FIELD_KEYS.EDIT_REFERENCE_NAME]: false,
        [RESPONSE_FIELD_KEYS.TEMPORARY_REFERENCE_NAME]: EMPTY_STRING,
        ...data?.fieldDetails,
        dataList: data?.dataList || {},
        otherFieldDetail: data?.otherFieldDetail || [],
        ruleDetails: data?.ruleDetails || [],
        validationData: data?.fieldDetails?.validations || {},
        documentURLDetails: data?.document_url_details || {},
        infoFieldImageRefUUID: get(data?.document_url_details, [0, 'original_filename', 'ref_uuid'], null), // used when image is uploaded in info field
      };

      if (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE) {
        const constructedExternalSourceData = getExternalSourceData(consolidatedFieldData, consolidatedFieldData?.columns);
        if (!isEmpty(constructedExternalSourceData)) consolidatedFieldData[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA] = constructedExternalSourceData?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA];
     }
      // eslint-disable-next-line no-use-before-define
      onFieldDataChangeHandler(consolidatedFieldData);
      setLoading(false);
    }
  };

  const getInitialSetUpFieldData = () => {
    const consolidatedFieldData = {
      ...FIELD_INITIAL_STATE,
      ...fieldData,
      [RESPONSE_FIELD_KEYS.IS_NEW_FIELD]: true,
    };

    if ([FIELD_TYPES.DATE, FIELD_TYPES.DATETIME].fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
       consolidatedFieldData[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] = {
        ...fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
        [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE]: VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[0].value,
      };
    }

    if (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.USER_TEAM_PICKER) {
      consolidatedFieldData[RESPONSE_FIELD_KEYS.DEFAULT_VALUE] = {
        [RESPONSE_FIELD_KEYS.VALUE_TYPE]: RESPONSE_FIELD_KEYS.REPLACE,
      };
    }

    if (FIELD_GROUPING.SELECTION_FIELDS.includes(fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE])) {
      consolidatedFieldData[RESPONSE_FIELD_KEYS.VALUE_TYPE] = BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_TYPES[0].VALUE;
    }
    return consolidatedFieldData;
  };

  useEffect(() => {
     if (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID]) {
        getField();
     } else {
        dispatch(ACTIVE_FIELD_DATA_CHANGE, { fieldData: getInitialSetUpFieldData() });
        setLoading(false);
     }
  }, []);

  const getTableColumns = () => {
    let columns = [];
    if (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE) {
      const layout = getLayoutByPath(overAllLayout, fieldData?.path);
      columns = getTableColumnFromLayout(layout, cloneDeep(fields), sectionUUID);
    }
    return columns;
  };

  const tableColumns = getTableColumns();

  const extraParam = {};
  if (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE) {
    extraParam.columns = tableColumns;
  }

  // Field Change Handler
  const onFieldDataChangeHandler = (updatedFieldData, noErrorCheck = false, setError = false) => {
    let errorList = fieldData[RESPONSE_FIELD_KEYS.ERROR_LIST];
    if (!isEmpty(errorList) && !noErrorCheck) {
      const cloneUpdatedFieldData = cloneDeep(updatedFieldData);
      if (isSummaryForm) {
        cloneUpdatedFieldData.sectionUUID = sectionUUID;
        delete cloneUpdatedFieldData.selectedTableUUID;
        delete cloneUpdatedFieldData.tableFieldList;
        delete cloneUpdatedFieldData.selectedDataListUuid;
        delete cloneUpdatedFieldData[RESPONSE_FIELD_KEYS.RULE_NAME];
        delete cloneUpdatedFieldData.selectedFieldUUID;
      }
      errorList = validateFieldConfigurationTab(tab, cloneUpdatedFieldData, t, isSummaryForm);
    } else errorList = {};
    if (setError) errorList = updatedFieldData?.[RESPONSE_FIELD_KEYS.ERROR_LIST];
    dispatch(ACTIVE_FIELD_DATA_CHANGE, {
      fieldData: {
       ...updatedFieldData,
       errorList,
       },
    });
  };

  // Tab Change Handler
  const onFormFieldTabChange = (newTab) => {
    const field = { ...fieldData, ...extraParam };
    const errorList = validateFieldConfigurationTab(tab, field, t);
    if (isEmpty(errorList)) {
      dispatch(FORM_ACTIONS.ACTIVE_FIELD_ERROR_LIST, { error: {} });
      setTab(newTab);
    } else {
      dispatch(FORM_ACTIONS.ACTIVE_FIELD_ERROR_LIST, { error: errorList });
    }
  };

  // Save Field
  const onSaveFormField = (updatedTechRefnameData = {}) => {
    setIsFocused({ isSave: false, visibility: false });
    // to make onClick event of onSave have precedence over onBlur event of tech ref name
    const field = { ...fieldData, ...extraParam, ...updatedTechRefnameData };
    const errorList = validateFieldConfigurationTab(tab, field, t);
    if (isEmpty(errorList)) {
        let field = fieldData;
        field[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] = (isTableField) ?
             FIELD_LIST_TYPE.TABLE : FIELD_LIST_TYPE.DIRECT;
        if (!isEmpty(updatedTechRefnameData)) field = { ...field, ...updatedTechRefnameData };

        onSave(
            field,
            sectionUUID,
            {
              path: fieldData?.path,
              dropType: fieldData?.dropType,
            },
        );
    } else dispatch(FORM_ACTIONS.ACTIVE_FIELD_ERROR_LIST, { error: errorList });
  };

  const onSaveComponentFields = (field = fieldData) => {
    const cloneFields = cloneDeep(field);
    cloneFields.sectionUUID = sectionUUID;
    delete cloneFields.selectedTableUUID;
    delete cloneFields.tableFieldList;
    delete cloneFields.selectedDataListUuid;
    delete cloneFields.selectedFieldUUID;
    delete cloneFields[RESPONSE_FIELD_KEYS.RULE_NAME];
    if (
      !isEmpty(cloneFields?.datalistPickerFieldName) &&
      [
        FIELD_TYPE.DATA_LIST,
        FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
        FIELD_TYPE.USER_TEAM_PICKER,
        FIELD_TYPE.USER_PROPERTY_PICKER,
      ].includes(
        cloneFields.fieldType,
      ) &&
      cloneFields?.showProperty
    ) {
      cloneFields[RESPONSE_FIELD_KEYS.FIELD_NAME] =
        cloneFields?.datalistPickerFieldName;
    }
    const errorList = validate(cloneFields, savePageComponentValidateSchema(t));
    setPointerEvent(false);
    updatePostLoader(false);
    if (isEmpty(errorList)) {
      onSave(cloneFields, sectionUUID, {
        path: fieldData?.path,
        dropType: fieldData?.dropType,
      });
      dispatch(FORM_ACTIONS.ACTIVE_FIELD_ERROR_LIST, { error: errorList });
    } else {
      dispatch(FORM_ACTIONS.ACTIVE_FIELD_ERROR_LIST, { error: errorList });
    }
  };

  const saveTableForUUID = () => {
    onSave(
      fieldData,
      sectionUUID,
      {
        path: fieldData?.path,
        dropType: fieldData?.dropType,
      },
    );
  };

  // Close Handler
  const onCloseClickHandler = () => {
    const ACTIVE_FIELD_CLEAR = (isTableField) ? FORM_ACTIONS.ACTIVE_COLUMN_CLEAR :
                                 FORM_ACTIONS.ACTIVE_FIELD_CLEAR;
    dispatch(ACTIVE_FIELD_CLEAR);
  };

  // Delete Handler
  const onDeleteHandler = () => {
    onDelete(fieldData, sectionUUID, { path: fieldData?.path }, onCloseClickHandler);
  };

  // Delete Handler
  const onDeleteTableColumnHandler = (fieldDetails = fieldData) => {
    onDelete(fieldDetails, sectionUUID, { path: fieldDetails?.path }, () => dispatch(FORM_ACTIONS.ACTIVE_COLUMN_CLEAR));
  };

  const getModalTitle = () => {
    let title = FIELD_CONFIGURATION_STRINGS(t).TITLE;
    const type = FIELD_LIST_OBJECT(t)?.[fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]];

    title += (type) ? ` : ${type}` : EMPTY_STRING;
    if (isTableField) {
      if (tableUtils?.isNew) {
        if (tableUtils?.tableFieldSourceType === TABLE_FIELD_SOURCE_TYPE.EXTERNAL) {
          title += ' - Add column from external source';
        } else {
          title += ' - Add column';
        }
     } else if (tableUtils?.tableFieldSourceType === TABLE_FIELD_SOURCE_TYPE.EXTERNAL) {
       title += ' - Edit column from external source';
     } else {
       title += ' - Edit column';
     }
    } else if (isSummaryForm) {
      switch (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
        case FIELD_TYPE.RICH_TEXT:
          title = TITLE.RICH_TEXT;
          break;
        case FIELD_TYPE.IMAGE:
          title = TITLE.IMAGE;
          break;
        case FIELD_TYPE.BUTTON_LINK:
          title = TITLE.BUTTON_LINK;
          break;
        default:
          title = TITLE.FIELD_DISPLAY;
          break;
      }
    }
    return title;
  };

  // Components - Header
  const getFieldConfigurationHeader = () => (
      <>
        <div className={styles.NewFieldHeader}>
          <div className={gClasses.DisplayFlex}>
          <span className={styles.NewFieldHeaderText}>
            {getModalTitle()}
          </span>
          {fieldData?.[RESPONSE_FIELD_KEYS.FORM_COUNT] > 1 && (
            <Chip
              text={FIELD_CONFIGURATION_STRINGS(t).SHARED_PROPERTY_TEXT}
              backgroundColor={UTIL_COLOR.YELLOW_50}
              textColor={UTIL_COLOR.YELLOW_700}
              size={EChipSize.sm}
              className={gClasses.ML8}
            />
          )}
          </div>
          <CloseIconNew
            onClick={onCloseClickHandler}
            className={styles.NewFieldCloseIcon}
          />
        </div>
        {!isSummaryForm && (
        <div className={styles.TabUnderline}>
          <Tab
            options={
                      (fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.TABLE) ?
                      FIELD_CONFIGURATION_STRINGS(t).TABLE_FIELD_CONFIG_TAB :
                      FIELD_CONFIGURATION_STRINGS(t).FIELD_CONFIG_TAB
                    }
            tabDisplayCount={4}
            selectedTabIndex={tab}
            onClick={(newTab) => onFormFieldTabChange(newTab)}
            variation={ETabVariation.primary}
            className={styles.FormFieldTabStyle}
            bottomSelectionClass={styles.SelectedTab}
            textClass={styles.FormFieldConfigTabText}
            tabContainerClass={gClasses.Zindex0Imp}
          />
        </div>
        )}
      </>
    );

  const getColumnConfig = () => (
    <div className={gClasses.MT16}>
      <ColumnConfiguration
        moduleType={moduleType}
        fields={fields}
        fieldData={fieldData}
        tablePath={fieldData?.path}
        saveTable={saveTableForUUID}
        overAllLayout={overAllLayout}
        sectionUUID={sectionUUID}
        dispatch={dispatch}
      />
    </div>
  );

  const getMoreDependency = (id, path, type, key = '_id') => {
    if (dependencyData[0]?.message) {
      listDependencyApiThunk({ [key]: id, type }, path, dependencyData[0]?.message, setDependencyData);
    }
  };

  // Components - Body
  const getFieldConfigurationBody = () => {
    if (loading) {
      return (
        <div className={cx(gClasses.H100, gClasses.DFlexCenter)}>
          <BlueLoadingSpinnerIcon />
        </div>
      );
    }

    let tabContent = null;
    const TABLE_VALIDATION_KEY = RESPONSE_VALIDATION_KEYS[FIELD_TYPE.TABLE];
    const fieldUUID = fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID];

    switch (tab) {
      case FIELD_CONFIG_TABS.BASIC_CONFIG: {
        const isUniqueColumn = fieldUUID && (
          get(tableUtils, ['validations', TABLE_VALIDATION_KEY.UNIQUE_COLUMN_UUID], null) === fieldUUID
        );
        tabContent = (
          <BasicConfiguration
            fieldDetails={fieldData}
            setFieldDetails={onFieldDataChangeHandler}
            metaData={metaData}
            moduleType={moduleType}
            tableColumnConfig={getColumnConfig()}
            isTable={tableUtils?.isTableField || false}
            isUniqueColumn={isUniqueColumn}
          />
        );
        break;
      }
      case FIELD_CONFIG_TABS.VALUE_CONFIG:
        tabContent = (
          <FieldValueConfiguration
            setFieldDetails={onFieldDataChangeHandler}
            tableData={tableData}
            fieldDetails={fieldData}
            moduleType={moduleType}
            metaData={metaData}
            removedRuleUUID={removedRuleUUID}
            setRemovedRuleUUID={setRemovedRuleUUID}
            tableUUID={tableUtils?.isTableField ? fieldData[RESPONSE_FIELD_KEYS.TABLE_UUID] : ''}
            isTableField={tableUtils?.isTableField || false}
            tableExternalRule={tableUtils?.externalSourceRule}
          />
        );
        break;
      case FIELD_CONFIG_TABS.VALIDATION_VISIBILITY_CONFIG:
        tabContent = (
          <ValidationAndVisibilityConfiguration
            setFieldDetails={onFieldDataChangeHandler}
            fieldDetails={fieldData}
            moduleType={moduleType}
            metaData={metaData}
            noOfFields={noOfFields}
            tableColumns={tableColumns}
            tableUUID={tableUtils?.isTableField ? fieldData[RESPONSE_FIELD_KEYS.TABLE_UUID] : ''}
            isTableField={tableUtils?.isTableField || false}
          />
        );
        break;
      case FIELD_CONFIG_TABS.ADDITIONAL_CONFIG:
        tabContent = isSummaryForm ? (
          <FieldAdditionalConfiguration
            fieldDetails={fieldData}
            setFieldDetails={onFieldDataChangeHandler}
            moduleType={moduleType}
            metaData={metaData}
          />
        ) : (
          <AdditionalConfiguration
            setFieldDetails={onFieldDataChangeHandler}
            fieldDetails={fieldData}
            moduleType={moduleType}
            metaData={metaData}
            tableColumns={tableColumns}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            onSaveFormFieldFunction={onSaveFormField}
          />
        );
        break;
      case FIELD_CONFIG_TABS.GENERAL:
        tabContent = (
          <FieldBasicConfiguration
            fieldDetails={fieldData}
            setFieldDetails={onFieldDataChangeHandler}
            metaData={metaData}
            onSaveField={onSaveComponentFields}
            onDeleteHandler={onDeleteTableColumnHandler}
            fields={fields}
            dispatch={dispatch}
            moduleType={moduleType}
          />
        );
        break;
      default: break;
    }

    if (!tabContent) return null;

    if (isSummaryForm) return tabContent;

    return (
      <div className={styles.FormFieldConfigurationContainer}>
        <div className={cx(gClasses.PY24, gClasses.PX48)}>
          {tabContent}
        </div>
      </div>
    );
  };

  // Components - Footer
  const getFieldConfigurationFooter = () => (
    <div className={styles.NewFieldFooter}>
      {(fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID] && !fieldData?.[RESPONSE_FIELD_KEYS.IS_SYSTEM_DEFINED]) ?
      <Button
        buttonText="Delete"
        type={EButtonType.OUTLINE_SECONDARY}
        className={styles.DeleteFormField}
        onClickHandler={() => onDeleteHandler()}
        noBorder
      /> : <div />}
      <div className={styles.SaveAndCancelButtons}>
        <Button
          buttonText="Cancel"
          type={EButtonType.OUTLINE_SECONDARY}
          className={styles.Cancel}
          onClickHandler={onCloseClickHandler}
          noBorder
        />
        <Button
          onMouseDown={() => setIsFocused({ ...isFocused, isSave: true })}
          buttonText="Save"
          type={EButtonType.PRIMARY}
          onClickHandler={onSaveFormField}
        />
      </div>
    </div>
  );

  const CONFIG_BUTTON_ARRAY = [
    {
      buttonText: BUTTONS.CANCEL,
      onButtonClick: () => onCloseClickHandler(),
      buttonType: EButtonType.TERTIARY,
      buttonClassName: EMPTY_STRING,
    }, {
      buttonText: BUTTONS.SAVE,
      onButtonClick: () => isSummaryForm ? onSaveComponentFields() : onSaveFormField(),
      buttonType: EButtonType.PRIMARY,
      buttonClassName: EMPTY_STRING,
    },
  ];

  return (
    <>
      {isSummaryForm ? (
        <ConfigurationModal
          isModalOpen
          onCloseClick={onCloseClickHandler}
          modalTitle={getModalTitle()}
          modalBodyContent={getFieldConfigurationBody()}
          tabOptions={SUMMARY_CONFIG_TABS(t)}
          currentTab={tab}
          footerButton={CONFIG_BUTTON_ARRAY}
          badgeName={!isComponentField && TITLE.PAGE}
          deleteButton={fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID] &&
            !fieldData?.[RESPONSE_FIELD_KEYS.IS_SYSTEM_DEFINED] && (
              <Button
                buttonText={BUTTONS.DELETE}
                type={EButtonType.OUTLINE_SECONDARY}
                className={styles.DeleteFormField}
                onClickHandler={() => onDeleteHandler()}
                noBorder
              />
            )}
          onTabSelect={(value) => setTab(value)}
        />
      ) : (
      <Modal
        isModalOpen
        headerContent={getFieldConfigurationHeader()}
        mainContent={getFieldConfigurationBody()}
        footerContent={getFieldConfigurationFooter()}
        modalStyle={ModalStyleType.modal}
        modalSize={ModalSize.md}
      />
      )}
      {!isEmpty(dependencyData) &&
      <DependencyHandler
        onCancelDeleteClick={() => setDependencyData({})}
        onDeleteClick={() => onDelete(fieldData, sectionUUID, { path: fieldData?.path }, () => {
          setDependencyData({});
          onCloseClickHandler();
        }, true)}
        dependencyHeaderTitle="Field"
        dependencyData={dependencyData[0]?.message}
        getMoreDependency={getMoreDependency}
      />}
    </>
  );
}

export default FieldConfiguration;

FieldConfiguration.propTypes = {
  fieldData: PropTypes.object,
  tableData: PropTypes.object,
  fields: PropTypes.object,
  sectionUUID: PropTypes.string,
  overAllLayout: PropTypes.array,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
  dispatch: PropTypes.func,
  moduleType: PropTypes.string,
  metaData: PropTypes.object,
  noOfFields: PropTypes.number,
  dependencyData: PropTypes.object,
  setDependencyData: PropTypes.func,
  tableUtils: PropTypes.object,
};
