import React, { useContext, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { cloneDeep, get } from 'lodash';
import { useTranslation } from 'react-i18next';

import ConditionalWrapper from 'components/conditional_wrapper/ConditionalWrapper';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import { externalFieldReducerDataChange } from 'redux/actions/Visibility.Action';
import { externalFieldsDataChange } from 'redux/actions/DefaultValueRule.Action';
import { clearFormulaBuilderValues } from 'redux/reducer/FormulaBuilderReducer';
import BasicConfig from './basic_config/BasicConfig';
import OtherConfig from './other _config/OtherConfig';
import ValidationConfig from './validation_config/ValidationConfig';
import Button, { BUTTON_TYPE } from '../../form_components/button/Button';
import { BS } from '../../../utils/UIConstants';
import styles from './FieldConfig.module.scss';
import {
  FIELD_CONFIG,
  FF_DROPDOWN_LIST,
  FIELD_CONFIGS_TABS,
  FIELD_CONFIGS,
  IMPORT_INSTRUCTION,
} from '../FormBuilder.strings';
import gClasses from '../../../scss/Typography.module.scss';
import HelpIcon from '../../../assets/icons/HelpIcon';
import Tab, { TAB_TYPE } from '../../tab/Tab';
import FormBuilderContext from '../FormBuilderContext';
import {
  FIELD_CONFIG_BUTTONS,
  FIELD_KEYS,
  FIELD_LIST_TYPE,
  FIELD_OR_FIELD_LIST,
  FORM_FIELD_CONFIG_TYPES,
  FORM_PARENT_MODULE_TYPES,
} from '../../../utils/constants/form.constant';
import VisibilityConfigTask from './visibility_config/VisibilityConfigTask';
import jsUtils from '../../../utils/jsUtility';
import { FIELD_VIEW_TYPE } from '../section/form_fields/FormField.strings';
import { HEADER_AND_BODY_LAYOUT } from '../../form_components/modal/Modal.strings';
import { updateTableColConditionList } from '../../../redux/actions/Visibility.Action';

function FieldConfig(props) {
  const {
    isTaskForm,
    taskId,
    stepOrder,
    isDataListForm,
    parentModuleType,
    deleteFormFieldHandler,
  } = useContext(FormBuilderContext);
  const {
    fieldListType,
    sectionIndex,
    fieldListIndex,
    fieldIndex,
    fieldType,
    referenceName,
    onCloseClickHandler,
    onLabelChangeHandler,
    onLookupFieldChangeHandler,
    onReferenceNameChangeHandler,
    onReferenceNameBlurHandler,
    onLabelBlurHandler,
    onDefaultChangeHandler,
    onRequiredClickHandler,
    onReadOnlyClickHandler,
    onOtherConfigChangeHandler,
    onOtherConfigBlurHandler,
    onValidationConfigChangeHandler,
    onValidationConfigBlurHandler,
    onSaveFormField,
    sectionId,
    fieldId,
    error_list,
    datalist_selector_error_list,
    fieldData,
    tableUuid,
    onAddValues,
    isTableField,
    onDefaultRuleOperatorDropdownHandler,
    onDefaultLValueRuleHandler,
    onDefaultRValueRuleHandler,
    onDefaultExtraOptionsRuleHandler,
    onDefaultRuleOperatorInfoHandler,
    onDefaultValueRuleHandler,
    onFieldIsShowWhenRule,
    onHideFieldIfNull,
    onFieldVisibleRule,
    onTabChangeHandler,
    getDefaultRuleDetailsByIdApiThunk,
    onVisibilityFieldChangeHandler,
    getRuleDetailsByIdInFieldVisibilityApi,
    onDataListChangeHandler,
    onDataListPropertyPickerChangeHandler,
    blockDeleteAndTabChange,
    getNewInputId,
    isPopUpOpen,
    clearFieldMetadata,
    clearDefaultValueExternalFields,
    clearFormulaBuilderValues,
    onSetDataListSelectorErrorList,
    onSetDataListPropertyPickerErrorList,
    updateTableColConditionList,
  } = props;
  const { t } = useTranslation();
  const { dataListData } = cloneDeep(props);
  const buttonContainerCompRef = useRef(null);
  const headerContainerRef = useRef(null);
  const contentContainerRef = useRef(null);
  const currentComponentContainerRef = useRef(null);
  const [isNewField, setIsNewField] = useState(!get(fieldData, ['field_uuid'], null));
  useEffect(() => {
    setIsNewField(!get(fieldData, ['field_uuid'], null));
    return () => {
      clearFieldMetadata();
      clearDefaultValueExternalFields();
      clearFormulaBuilderValues();
      updateTableColConditionList();
    };
  }, []);

  useEffect(() => {
    if (
      headerContainerRef.current &&
      contentContainerRef.current &&
      buttonContainerCompRef.current
    ) {
      let listHeight = 0;
      listHeight =
        contentContainerRef.current.clientHeight -
        (buttonContainerCompRef.current.clientHeight +
          headerContainerRef.current.clientHeight);
      if (currentComponentContainerRef.current) {
        currentComponentContainerRef.current.style.height = `${listHeight}px`;
      }
    }
  });

  const { TITLE: configTitle } = FF_DROPDOWN_LIST(t).find(
    (fieldObj) => fieldObj.ID === fieldType.value,
  ) || {
    TITLE: 'Add column',
  };

  const [tab_index, setTabIndex] = useState(
    FIELD_CONFIGS.BASIC_CONFIG.TAB_INDEX,
  );
  let current_component = null;

  const importInstruction = fieldData.is_imported
    ? `${IMPORT_INSTRUCTION.IMPORT_FROM} ${
        fieldData.origin_step_order
      } - ${(fieldData.read_only
        ? FIELD_VIEW_TYPE.READONLY
        : FIELD_VIEW_TYPE.EDITABLE
      ).toLowerCase()}`
    : null;

  const getFieldConfigTabs = (tabIndex) => {
    switch (tabIndex) {
      case FIELD_CONFIGS.BASIC_CONFIG.TAB_INDEX:
        return (
          <BasicConfig
            fieldListType={fieldListType}
            sectionId={sectionId}
            fieldListIndex={fieldListIndex}
            tableUuid={tableUuid}
            fieldId={fieldId}
            fieldType={fieldType.value}
            fieldText={fieldType.text}
            dataListUuid={dataListData?.data_list_uuid}
            referenceName={referenceName}
            onLabelChangeHandler={(event) => {
              onLabelChangeHandler(event);
            }}
            onLookupFieldChangeHandler={(event) => {
              onLookupFieldChangeHandler(event);
            }}
            onReferenceNameChangeHandler={(event) => {
              onReferenceNameChangeHandler(event);
            }}
            onReferenceNameBlurHandler={(event) => {
              onReferenceNameBlurHandler(event);
            }}
            onLabelBlurHandler={(event) => {
              onLabelBlurHandler(event);
            }}
            onDefaultChangeHandler={(event) => {
              onDefaultChangeHandler(event);
            }}
            onDataListChangeHandler={onDataListChangeHandler}
            onSetDataListSelectorErrorList={onSetDataListSelectorErrorList}
            onDataListPropertyPickerChangeHandler={onDataListPropertyPickerChangeHandler}
            onSetDataListPropertyPickerErrorList={onSetDataListPropertyPickerErrorList}
            onValidationConfigChangeHandler={onValidationConfigChangeHandler}
            onRequiredClickHandler={onRequiredClickHandler}
            onReadOnlyClickHandler={onReadOnlyClickHandler}
            onAddValues={onAddValues}
            error_list={error_list}
            datalist_selector_error_list={datalist_selector_error_list}
            fieldData={fieldData}
            isTableField={isTableField}
            onDefaultRuleOperatorDropdownHandler={
              onDefaultRuleOperatorDropdownHandler
            }
            onDefaultLValueRuleHandler={onDefaultLValueRuleHandler}
            onDefaultRValueRuleHandler={onDefaultRValueRuleHandler}
            onDefaultExtraOptionsRuleHandler={onDefaultExtraOptionsRuleHandler}
            onDefaultRuleOperatorInfoHandler={onDefaultRuleOperatorInfoHandler}
            onDefaultValueRuleHandler={onDefaultValueRuleHandler}
            getDefaultRuleDetailsByIdApiThunk={
              getDefaultRuleDetailsByIdApiThunk
            }
            onlyAllowDropdownValueChange={blockDeleteAndTabChange}
            getNewInputId={getNewInputId}
            isRequired={fieldData.required}
            isNewField={isNewField}
            getRuleDetailsById={(avoidExpressionUpdate = false) =>
              fieldData[FIELD_KEYS.FIELD_SHOW_WHEN_RULE] && getRuleDetailsByIdInFieldVisibilityApi(
                fieldData[FIELD_KEYS.FIELD_SHOW_WHEN_RULE],
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                avoidExpressionUpdate,
              )
            }
          />
        );
      case FIELD_CONFIGS.VALIDATION.TAB_INDEX:
        return (
          <ValidationConfig
            fieldType={fieldType.value}
            error_list={error_list}
            fieldData={fieldData}
            onDefaultChangeHandler={(value) =>
              onDefaultChangeHandler({
                target: {
                  value,
                  id: FIELD_CONFIG.BASIC_CONFIG.DEFAULT_CURRENCY_TYPE.ID,
                },
              })
            }
            onValidationConfigChangeHandler={onValidationConfigChangeHandler}
            onValidationConfigBlurHandler={onValidationConfigBlurHandler}
            sectionIndex={sectionIndex}
            fieldListIndex={fieldListIndex}
            fieldIndex={fieldIndex}
            isTableField={isTableField}
            isTaskForm={isTaskForm}
            taskId={taskId}
            stepOrder={stepOrder}
            isDataListForm={isDataListForm}
          />
        );
      case FIELD_CONFIGS.VISIBILITY.TAB_INDEX:
        switch (parentModuleType) {
          case FORM_PARENT_MODULE_TYPES.FLOW:
          case FORM_PARENT_MODULE_TYPES.DATA_LIST:
            return (
              <VisibilityConfigTask
                getRuleDetailsById={(avoidExpressionUpdate = false) =>
                  getRuleDetailsByIdInFieldVisibilityApi(
                    fieldData[FIELD_KEYS.FIELD_SHOW_WHEN_RULE],
                    sectionIndex,
                    fieldListIndex,
                    fieldIndex,
                    avoidExpressionUpdate,
                  )
                }
                serverEntityUuid={fieldData.field_uuid}
                ruleId={fieldData[FIELD_KEYS.FIELD_SHOW_WHEN_RULE]}
                isShowWhenRule={fieldData.is_field_show_when_rule}
                onShowWhenRule={onFieldIsShowWhenRule}
                onHideFieldIfNull={onHideFieldIfNull}
                hideFieldIfNull={fieldData.hide_field_if_null}
                isVisible={fieldData.is_visible}
                onFieldVisibleRule={onFieldVisibleRule}
                onVisibilityChangeHandler={onVisibilityFieldChangeHandler}
                fieldType={fieldData.field_type}
                fieldListType={fieldListType}
                tableUuid={tableUuid}
                readOnly={fieldData.read_only}
                previous_expression={fieldData[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION] || {}}
                expression={fieldData[FIELD_KEYS.RULE_EXPRESSION] || {}}
                rule_expression_has_validation={fieldData[FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION]}
              />
            );
          case FORM_PARENT_MODULE_TYPES.TASK:
            return (
              <VisibilityConfigTask
                getRuleDetailsById={(avoidExpressionUpdate = false) =>
                  getRuleDetailsByIdInFieldVisibilityApi(
                    fieldData[FIELD_KEYS.FIELD_SHOW_WHEN_RULE],
                    sectionIndex,
                    fieldListIndex,
                    fieldIndex,
                    avoidExpressionUpdate,
                  )
                }
                ruleId={fieldData[FIELD_KEYS.FIELD_SHOW_WHEN_RULE]}
                serverEntityUuid={fieldData.field_uuid}
                isShowWhenRule={fieldData.is_field_show_when_rule}
                onShowWhenRule={onFieldIsShowWhenRule}
                onHideFieldIfNull={onHideFieldIfNull}
                hideFieldIfNull={fieldData.hide_field_if_null}
                isVisible={fieldData.is_visible}
                onFieldVisibleRule={onFieldVisibleRule}
                onVisibilityChangeHandler={onVisibilityFieldChangeHandler}
                fieldType={fieldData.field_type}
                fieldListType={fieldListType}
                tableUuid={tableUuid}
                readOnly={fieldData.read_only}
                previous_expression={fieldData[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION] || {}}
                expression={fieldData[FIELD_KEYS.RULE_EXPRESSION] || {}}
                rule_expression_has_validation={fieldData[FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION]}
              />
            );
          default:
            break;
        }
        break;
      case FIELD_CONFIGS.OTHER_SETTINGS.TAB_INDEX:
        return (
          <OtherConfig
            sectionId={sectionId}
            fieldListIndex={fieldListIndex}
            tableUuid={tableUuid}
            fieldId={fieldId}
            fieldType={fieldType.value}
            error_list={error_list}
            fieldData={fieldData}
            onOtherConfigChangeHandler={onOtherConfigChangeHandler}
            onOtherConfigBlurHandler={onOtherConfigBlurHandler}
            isTableField={isTableField}
            onDefaultChangeHandler={(event) => {
              onDefaultChangeHandler(event);
            }}
            onValidationConfigChangeHandler={onValidationConfigChangeHandler}
            onDefaultRuleOperatorDropdownHandler={
              onDefaultRuleOperatorDropdownHandler
            }
            onDefaultLValueRuleHandler={onDefaultLValueRuleHandler}
            onDefaultRValueRuleHandler={onDefaultRValueRuleHandler}
            onDefaultExtraOptionsRuleHandler={onDefaultExtraOptionsRuleHandler}
            onDefaultRuleOperatorInfoHandler={onDefaultRuleOperatorInfoHandler}
            onDefaultValueRuleHandler={onDefaultValueRuleHandler}
            getDefaultRuleDetailsByIdApiThunk={
              getDefaultRuleDetailsByIdApiThunk
            }
          />
        );
      default:
        break;
    }
    return null;
  };

  const onTabChange = async (index) => {
    if (index === tab_index) return false;
    await onTabChangeHandler({ currentIndex: tab_index, index })
    .then((status) => {
      if (status) return setTabIndex(index);
      return false;
    });
    return false;
  };

  current_component = getFieldConfigTabs(tab_index);

  const header = (
    <div className={cx(styles.header)} ref={headerContainerRef}>
      <div className={cx(BS.D_FLEX, BS.FLEX_ROW, BS.JC_BETWEEN)}>
        <div className={gClasses.CenterV}>
          <div className={cx(gClasses.ModalHeader, styles.HeaderSelect)}>
            {configTitle}
          </div>
          <HelpIcon
            className={cx(gClasses.ML5)}
            title={FIELD_CONFIG(t).HEADER_TOOLTIP}
            id="fieldConfigHelp"
            ariaLabel="Field config help"
          />

          {importInstruction ? (
            <div
              className={cx(
                gClasses.Italics,
                gClasses.FTwo12RedV8,
                gClasses.ML10,
              )}
            >
              {importInstruction}
            </div>
          ) : null}
        </div>
      </div>
      <Tab
        className={cx(gClasses.MT5, {
          [BS.D_NONE]:
            FIELD_CONFIGS_TABS(
              jsUtils.get(fieldData, ['field_type']),
              blockDeleteAndTabChange,
            ).length === 0,
        })}
        tabIList={FIELD_CONFIGS_TABS(
          jsUtils.get(fieldData, ['field_type']),
          blockDeleteAndTabChange,
        )}
        setTab={onTabChange}
        selectedIndex={tab_index}
        type={TAB_TYPE.TYPE_5}
        isLanguageConvert
      />
    </div>
  );
  const setDefaultIndex = () => {
    setTabIndex(FIELD_CONFIGS.BASIC_CONFIG.TAB_INDEX);
  };

  const deleteButtonWrapperFn = (children) => (
    <div className={gClasses.CenterV}>
          {children}
          <Button
            buttonType={BUTTON_TYPE.CANCEL}
            className={cx(gClasses.ML15, styles.BtnCommonConfig)}
            onClick={() => {
              deleteFormFieldHandler(
                FIELD_OR_FIELD_LIST.FIELD,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
              );
            }}
          >
            {t(FIELD_CONFIG_BUTTONS.DEL_FIELD_BUTTON)}
          </Button>
    </div>
  );

  const footer = (
    <>
      <ConditionalWrapper
          condition={!blockDeleteAndTabChange && fieldListType === FIELD_LIST_TYPE.TABLE}
          wrapper={deleteButtonWrapperFn}
      >
          <Button
            buttonType={BUTTON_TYPE.SECONDARY}
            className={cx(BS.TEXT_NO_WRAP, gClasses.MT2, styles.SecondaryButton)}
            onClick={() => {
              onCloseClickHandler(
                FORM_FIELD_CONFIG_TYPES.FIELD,
                fieldListType,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
              );
            }}
          >
            {t(FIELD_CONFIG_BUTTONS.DISCARD)}
          </Button>
      </ConditionalWrapper>
      <Button
        buttonType={BUTTON_TYPE.PRIMARY}
        className={cx(
          styles.Save,
          gClasses.FTwo10,
        )}
        onClick={() => onSaveFormField(sectionId, fieldId)}
      >
        {t(FIELD_CONFIG_BUTTONS.SAVE)}
      </Button>
    </>
  );
  return (
      <ModalLayout
        id="field-config-modal"
        modalContainerClass={styles.ModalContainerClass}
        mainContentClassName={styles.MainContentClass}
        headerContent={header}
        headerClassName={gClasses.PB0}
        footerContent={footer}
        isModalOpen={isPopUpOpen}
        mainContent={current_component}
        backgroundScrollElementId={HEADER_AND_BODY_LAYOUT}
        unmountCall={setDefaultIndex}
        onCloseClick={() => {
          onCloseClickHandler(
            FORM_FIELD_CONFIG_TYPES.FIELD,
            fieldListType,
            sectionIndex,
            fieldListIndex,
            fieldIndex,
          );
        }}
      />
  );
}

const mapStateToProps = (state) => {
  return {
    allFieldsDetails: state.EditFlowReducer.all_fields_details,
    server_error: state.EditFlowReducer.server_error,
    dataListData: state.CreateDataListReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearFieldMetadata: () => dispatch(externalFieldReducerDataChange({
      externalFields: {
        pagination_details: [],
        hasMore: false,
      },
      field_metadata: [],
     })),
    clearDefaultValueExternalFields: () => dispatch(externalFieldsDataChange({
      externalFields: {
        pagination_details: [],
        pagination_data: [],
      },
      field_metadata: [],
     })),
     updateTableColConditionList: (list) => dispatch(updateTableColConditionList(list)),
     clearFormulaBuilderValues: () => dispatch(clearFormulaBuilderValues(['lstFunctions'])),
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FieldConfig);
FieldConfig.defaultProps = {
  error_list: {},
  fieldData: {},
  onAddValues: null,
  // deleteFormField: null,
  onDefaultChangeHandler: null,
  onRequiredClickHandler: null,
  onReadOnlyClickHandler: null,
  onOtherConfigChangeHandler: null,
  onOtherConfigBlurHandler: null,
  onValidationConfigChangeHandler: null,
  onValidationConfigBlurHandler: null,
  onSaveFormField: null,
  onCloseClickHandler: null,
  onLabelChangeHandler: null,
  onLabelBlurHandler: null,
  isTableField: false,
  blockDeleteAndTabChange: false,
  getNewInputId: null,
  isPopUpOpen: false,
};
FieldConfig.propTypes = {
  fieldType: PropTypes.shape({
    value: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  onCloseClickHandler: PropTypes.func,
  onLabelChangeHandler: PropTypes.func,
  onLabelBlurHandler: PropTypes.func,
  sectionId: PropTypes.number.isRequired,
  fieldId: PropTypes.number.isRequired,
  error_list: PropTypes.objectOf(PropTypes.any),
  onDefaultChangeHandler: PropTypes.func,
  onRequiredClickHandler: PropTypes.func,
  onReadOnlyClickHandler: PropTypes.func,
  onOtherConfigChangeHandler: PropTypes.func,
  onOtherConfigBlurHandler: PropTypes.func,
  onValidationConfigChangeHandler: PropTypes.func,
  onValidationConfigBlurHandler: PropTypes.func,
  onSaveFormField: PropTypes.func,
  fieldData: PropTypes.objectOf(PropTypes.any),
  onAddValues: PropTypes.func,
  // deleteFormField: PropTypes.func,
  isTableField: PropTypes.bool,
  blockDeleteAndTabChange: PropTypes.bool,
  getNewInputId: PropTypes.func,
  isPopUpOpen: PropTypes.bool,
};
