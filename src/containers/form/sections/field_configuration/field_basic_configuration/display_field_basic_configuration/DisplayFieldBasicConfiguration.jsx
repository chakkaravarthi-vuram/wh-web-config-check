import React, { useRef, useState, useEffect } from 'react';
import {
  SingleDropdown,
  TableWithPagination,
  Text,
  TextInput,
  TableColumnWidthVariant,
  Button,
  EButtonSizeType,
  EPopperPlacements,
  DropdownList,
  Checkbox,
  NestedDropdown,
  Size,
  Variant,
  // Label,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { useSelector } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import Edit from 'assets/icons/application/EditV2';
import Trash from 'assets/icons/application/Trash';
import Plus from 'assets/icons/configuration_rule_builder/Plus';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';
import jsUtility from '../../../../../../utils/jsUtility';
import {
  FIELD_LIST_TYPE,
  FIELD_TYPE,
} from '../../../../../../utils/constants/form.constant';
import { useClickOutsideDetector } from '../../../../../../utils/UtilityFunctions';
import {
  FIELD_LIST,
  FIELD_LIST_OBJECT,
} from '../../basic_configuration/BasicConfiguration.constants';
import { getAllDataFieldsApi } from '../../../../../../axios/apiService/dashboardConfig.apiService';
import {
  FIELD_CONFIG_TABS,
  FIELD_CONFIGURATIONS_CONSTANTS,
} from '../../FieldConfiguration.constants';
import styles from '../../FieldConfiguration.module.scss';
import { validateFieldConfigurationTab } from '../../FieldConfiguration.utils';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from '../../../../../../components/form_components/helper_message/HelperMessage';
import { ARIA_ROLES } from '../../../../../../utils/UIConstants';
import { FORM_ACTIONS, FORM_LAYOUT_TYPE } from '../../../../Form.string';
import { COMMA, HYPHEN } from '../../../../../../utils/strings/CommonStrings';
import { VALUE_CONFIG_TYPE } from '../../../../../shared_container/individual_entry/summary_builder/Summary.constants';
import { RULE_TYPE } from '../../../../../../utils/constants/rule/rule.constant';
import LeftDirArrowIcon from '../../../../../../assets/icons/app_builder_icons/LeftDirArrow';
import ChevronRight from '../../../../../../assets/icons/ChevronRight';

function DisplayFieldBasicConfiguration(props) {
  const {
    fieldDetails,
    setFieldDetails,
    onDeleteHandler,
    metaData,
    fields,
    dispatch,
  } = props;
  const { errorList = {} } = fieldDetails;
  const { t } = useTranslation();
  const addColumnRef = useRef(null);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [tableFieldList, setTableFieldList] = useState([]);
  const [datalistPickerFieldList, setDatalistPickerFieldList] = useState([]);
  const [selectedTable, setSelectedTable] = useState();
  const {
    GENERAL: { FIELD_DISPLAY },
  } = FIELD_CONFIGURATIONS_CONSTANTS(t);
  const isEditField = !jsUtility.isEmpty(
    fieldDetails[RESPONSE_FIELD_KEYS.FIELD_UUID],
  );
  const isTableField =
    fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.TABLE;
  const isTableColumn =
    fieldDetails[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] === 'table';
  const selectedFieldUUID =
    isEditField && isTableColumn && fieldDetails?.showProperty
      ? fieldDetails?.selectedFieldUUID
      : fieldDetails[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID];
  const selectedExternalRuleUUID =
    fieldDetails[RESPONSE_FIELD_KEYS.SELECTED_EXTERNAL_RULE_UUID];
  const fieldSourceType = fieldDetails[RESPONSE_FIELD_KEYS.FIELD_SOURCE_TYPE];
  const isExternalSource = fieldSourceType === VALUE_CONFIG_TYPE.EXTERNAL_DATA;

  // const getChoiceValues = () => {
  //   if (fieldSourceType === 'dynamic') {
  //     if (fieldDetails?.fieldUUID) {
  //       return fieldDetails?.otherFieldDetail?.find((field) => field?.field_uuid === fieldDetails?.selectedFieldUuid)?.choice_values;
  //     } else {
  //       return fieldDetails?.choiceValues;
  //     }
  //   } else return [];
  // };

  const isDatalistPickerDisplay =
    [
      FIELD_TYPE.DATA_LIST,
      FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
      FIELD_TYPE.USER_TEAM_PICKER,
      FIELD_TYPE.USER_PROPERTY_PICKER,
    ].includes(fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE]) &&
    fieldDetails?.showProperty;
  useClickOutsideDetector(
    addColumnRef,
    () => {
      if (showColumnDropdown) {
        setShowColumnDropdown(false);
      }
    },
    [fieldDetails, showColumnDropdown],
  );

  const { dataFields, systemFields, externalRules } = useSelector(
    (state) => state.IndividualEntryReducer.pageBuilder,
  );

  useEffect(() => {
    if (
      (isTableField || isTableColumn) &&
      (tableFieldList.length === 0 ||
        fieldDetails?.tableFieldList?.length === 0)
    ) {
      // if table field is choosen from external field list
      if (fieldSourceType === VALUE_CONFIG_TYPE.EXTERNAL_DATA && isTableField) {
        const externalFields =
          externalRules.find((r) => r.ruleUUID === selectedExternalRuleUUID)
            ?.fields || [];
        const selectedField = externalFields.find(
          (f) => f.fieldUUID === selectedFieldUUID,
        );
        setTableFieldList(selectedField?.columnMapping || []);
        return;
      }

      const params = {
        table_uuid: isTableColumn
          ? fieldDetails?.selectedTableUUID
          : selectedFieldUUID,
      };
      if (!jsUtility.isEmpty(metaData.dataListId)) {
        params.data_list_id = metaData.dataListId;
      } else if (!jsUtility.isEmpty(metaData.flowId)) {
        params.flow_id = metaData.flowId;
      }
      getAllDataFieldsApi({
        page: 1,
        size: 1000,
        field_list_type: 'table',
        sort_by: 1,
        include_property_picker: 1,
        ...params,
      }).then((res) => {
        const { pagination_data } = res;
        const tableFields = pagination_data.map((data) => {
          const field = {
            fieldId: data._id,
            allowMultiple: data.allow_multiple,
            fieldListType: data.field_list_type,
            fieldName: data.field_name,
            fieldType: data.field_type,
            fieldUUID: data.field_uuid,
            referenceName: data.reference_name,
            required: data.required,
            label: data.label,
            value: data.field_uuid,
          };
          return field;
        });
        setTableFieldList(tableFields);
      });
    }
  }, [
    isTableField,
    selectedFieldUUID,
    isTableColumn,
    fieldDetails?.selectedTableUUID,
  ]);

  useEffect(() => {
    const externalRule = externalRules.find(
      (r) => r.ruleUUID === selectedExternalRuleUUID,
    );
    const isDLExternalSource =
      externalRule?.ruleType === RULE_TYPE.DATA_LIST_QUERY;
    if (
      !selectedExternalRuleUUID ||
      !externalRule?.isMultipleEntry ||
      !isDLExternalSource
    ) {
      return;
    }

    const selectedField = externalRule.fields?.find(
      (f) => f.fieldUUID === selectedFieldUUID,
    );
    // if a Table is DND, then no need of construction of table with the remaining direct fields;
    if (selectedField?.fieldType === FIELD_TYPE.TABLE) return;

    const externalFields = externalRule.fields || [];
    const extraParams = {};
    if (!fieldDetails.fieldUUID) {
      extraParams.fieldType = FIELD_TYPE.TABLE;
      extraParams.fieldListType = FIELD_LIST_TYPE.DIRECT;
      extraParams.fieldName = 'Table';
    }
    setTableFieldList(externalFields);
    setFieldDetails({ ...fieldDetails, ...extraParams, isMultipleEntry: true });
  }, [selectedExternalRuleUUID]);

  useEffect(() => {
    if (isDatalistPickerDisplay && fieldDetails?.selectedDataListUuid) {
      const params = {
        page: 1,
        size: 1000,
        field_list_type: 'direct',
        sort_by: 1,
        include_tables: 1,
        data_list_uuids: [fieldDetails?.selectedDataListUuid],
      };
      getAllDataFieldsApi(params).then((res) => {
        const { pagination_data } = res;
        const tableFields = pagination_data.map((data) => {
          const field = {
            label: data.field_name,
            value: data.field_uuid,
            fieldId: data._id,
            fieldListType: data.field_list_type,
            fieldType: data.field_type,
          };
          return field;
        });
        setDatalistPickerFieldList(tableFields);
      });
    }
  }, [isDatalistPickerDisplay, fieldDetails?.selectedDataListUuid]);

  const onChangeHandler = (value, id) => {
    let updatedValue;
    const extraParams = {};
    if (id === RESPONSE_FIELD_KEYS.FIELD_SOURCE_TYPE) {
      updatedValue = value;
      extraParams[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID] = EMPTY_STRING;
      extraParams[RESPONSE_FIELD_KEYS.SELECTED_EXTERNAL_RULE_UUID] =
        EMPTY_STRING;
      extraParams[RESPONSE_FIELD_KEYS.FIELD_NAME] = EMPTY_STRING;
      extraParams.isMultipleEntry = false;
    } else if (id === RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID) {
      updatedValue = value;
      const externalFields =
        externalRules.find((r) => r.ruleUUID === selectedExternalRuleUUID)
          ?.fields || [];
      const selectedField = [
        ...dataFields,
        ...systemFields,
        ...externalFields,
      ].find((data) => data[RESPONSE_FIELD_KEYS.FIELD_UUID] === value);
      extraParams[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] =
        selectedField[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES];
      extraParams[RESPONSE_FIELD_KEYS.FIELD_TYPE] =
        selectedField[RESPONSE_FIELD_KEYS.FIELD_TYPE];
      extraParams[RESPONSE_FIELD_KEYS.FIELD_NAME] =
        selectedField[RESPONSE_FIELD_KEYS.FIELD_NAME];
      if (
        [
          FIELD_TYPE.DATA_LIST,
          FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
          FIELD_TYPE.USER_TEAM_PICKER,
          FIELD_TYPE.USER_PROPERTY_PICKER,
        ].includes(selectedField[RESPONSE_FIELD_KEYS.FIELD_TYPE])
      ) {
        extraParams.selectedDataListUuid = selectedField.selectedDataListUuid;
        if (
          [
            FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
            FIELD_TYPE.USER_PROPERTY_PICKER,
          ].includes(selectedField[RESPONSE_FIELD_KEYS.FIELD_TYPE])
        ) {
          extraParams.showProperty = true;
          extraParams.dataListPickerFieldUUID =
            selectedField.dataListPickerFieldUUID;
          extraParams.datalistPickerFieldType =
            selectedField.datalistPickerFieldType;
          extraParams.datalistPickerFieldName =
            selectedField.datalistPickerFieldName;
          extraParams.datalistPickerUUID = selectedField.datalistPickerUUID;
        } else {
          extraParams.showProperty = false;
          extraParams.dataListPickerFieldUUID = EMPTY_STRING;
          extraParams.datalistPickerFieldType = EMPTY_STRING;
          extraParams.datalistPickerFieldName = EMPTY_STRING;
          extraParams.datalistPickerUUID = EMPTY_STRING;
        }
      } else {
        extraParams.selectedDataListUuid = EMPTY_STRING;
      }
      setTableFieldList([]);
    } else if (id === RESPONSE_FIELD_KEYS.FIELD_NAME) {
      if (isDatalistPickerDisplay) {
        id = 'datalistPickerFieldName';
      }
      updatedValue = value;
    } else if (id === RESPONSE_FIELD_KEYS.SELECTED_EXTERNAL_RULE_UUID) {
      updatedValue = value;
      extraParams[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID] = EMPTY_STRING;
      extraParams[RESPONSE_FIELD_KEYS.FIELD_NAME] = EMPTY_STRING;
      extraParams[RESPONSE_FIELD_KEYS.FIELD_TYPE] = EMPTY_STRING;
      extraParams.isMultipleEntry = false;
    }
    const updateFieldData = {
      ...fieldDetails,
      ...extraParams,
      [id]: updatedValue,
    };
    const errorListData = validateFieldConfigurationTab(
      FIELD_CONFIG_TABS.GENERAL,
      updateFieldData,
      t,
    );
    setFieldDetails({ ...updateFieldData, errorList: errorListData });
  };

  const getTableRowText = (dataText) => (
    <Text
      content={dataText}
      className={cx(gClasses.FTwo12BlackV18, gClasses.FontWeight500)}
    />
  );

  const tableActionButtons = (
    tableField,
    tableFieldData,
    index,
    isEditable = false,
  ) => {
    const onEditSelectedField = () => {
      const path = [
        fieldDetails?.path,
        `${index}_${FORM_LAYOUT_TYPE.FIELD}`,
      ].join(COMMA);
      dispatch?.(FORM_ACTIONS.ACTIVE_FIELD_COLUMN_DATA_CHANGE, {
        fieldData: {
          ...tableFieldData,
          path,
          selectedTableUUID: selectedFieldUUID,
          tableFieldList,
        },
      });
    };

    const onDeleteSelectedField = async () => {
      if (!jsUtility.isEmpty(tableField.child_field_uuid)) {
        const path = [
          fieldDetails?.path,
          `${index}_${FORM_LAYOUT_TYPE.FIELD}`,
        ].join(COMMA);
        onDeleteHandler({ ...tableFieldData, path });
      }
      const tableChildDataClone =
        jsUtility.cloneDeep(
          fieldDetails[RESPONSE_FIELD_KEYS.TABLE_CHILD_DATA],
        ) || [];
      const deletedFieldLists = tableChildDataClone.filter(
        (field) => field.child_data !== tableField.child_data,
      );
      setFieldDetails({
        ...fieldDetails,
        [RESPONSE_FIELD_KEYS.TABLE_CHILD_DATA]: deletedFieldLists,
      });
    };

    return (
      <div className={cx(gClasses.CenterV, gClasses.JusEnd)}>
        {isEditable && (
          <Button
            icon={<Edit className={styles.EditIcon} />}
            size={EButtonSizeType.SM}
            iconOnly
            type={EMPTY_STRING}
            className={styles.ButtonContainer}
            onClickHandler={() => onEditSelectedField()}
          />
        )}
        <Button
          icon={<Trash />}
          size={EButtonSizeType.SM}
          iconOnly
          type={EMPTY_STRING}
          className={styles.ButtonContainer}
          onClickHandler={() => onDeleteSelectedField()}
        />
      </div>
    );
  };

  // Sample Data for Dependant Apps Tables
  const getTableFieldListData = () => {
    const tableDataList = [];
    const tableFields = [];
    // For External source (multiple entry) table fields
    tableFieldList.forEach((field) => {
      if (field.columnMapping) tableFields.push(...field.columnMapping);
      else tableFields.push(field);
    });

    (fieldDetails[RESPONSE_FIELD_KEYS.TABLE_CHILD_DATA] || []).forEach(
      (data, index) => {
        let tableFieldData = {};
        let isEditable = false;
        let tableName;

        if (!jsUtility.isEmpty(data.child_field_uuid)) {
          tableFieldData = fields[data.child_field_uuid];
          isEditable = true;
        } else {
          tableFieldData = tableFields.find(
            (field) => field.fieldUUID === data.child_data,
          );
        }

        // for external source table columns (multiple entry) attach the tableName before fieldName
        if (isExternalSource) {
          tableName =
            tableFieldData?.tableName ||
            tableFields.find((f) => data.child_data.endsWith(f.fieldUUID))?.tableName;
        }

        if (!jsUtility.isEmpty(tableFieldData)) {
          const tableData = {
            id: tableFieldData.fieldUUID,
            component: [
              getTableRowText(`${tableName ? `${tableName}.` : EMPTY_STRING}${tableFieldData.fieldName}`),
              getTableRowText(FIELD_LIST_OBJECT(t)?.[tableFieldData.fieldType]),
              tableActionButtons(data, tableFieldData, index, isEditable),
            ],
          };
          tableDataList.push(tableData);
        }
      },
    );
    return tableDataList;
  };

  const getDefinedField = () => {
    let optionList = [];
    let ruleOptionList = [];
    let labelName = EMPTY_STRING;
    switch (fieldSourceType) {
      case VALUE_CONFIG_TYPE.USER_DEFINED_FIELD:
        const isBox = fieldDetails.path?.includes(FORM_LAYOUT_TYPE.BOX);
        labelName = FIELD_DISPLAY.CHOOSE_FIELD.USER_DEFINED_FIELD;
        (isTableColumn
          ? fieldDetails?.tableFieldList || tableFieldList
          : dataFields
        ).forEach((data) => {
          if (
            isBox &&
            data[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.TABLE
          ) {
            return;
          }
          const option = {
            label: data[RESPONSE_FIELD_KEYS.FIELD_NAME] || HYPHEN,
            value: data[RESPONSE_FIELD_KEYS.FIELD_UUID],
            isCheck: selectedFieldUUID === data[RESPONSE_FIELD_KEYS.FIELD_UUID],
          };
          optionList.push(option);
        });
        break;
      case VALUE_CONFIG_TYPE.SYSTEM_FIELD:
        labelName = FIELD_DISPLAY.CHOOSE_FIELD.SYSTEM_DEFINED_FIELD;
        optionList = systemFields.map((data) => {
          const option = {
            label: data[RESPONSE_FIELD_KEYS.FIELD_NAME],
            value: data[RESPONSE_FIELD_KEYS.FIELD_UUID],
            isCheck: selectedFieldUUID === data[RESPONSE_FIELD_KEYS.FIELD_UUID],
          };
          return option;
        });
        break;
      case VALUE_CONFIG_TYPE.EXTERNAL_DATA:
        labelName = FIELD_DISPLAY.CHOOSE_FIELD.EXTERNAL_DATA_FIELD;
        ruleOptionList = externalRules.map((rule) => {
          const option = {
            label: rule.label,
            value: rule.value,
            isCheck: selectedExternalRuleUUID === rule.value,
          };
          return option;
        });
        if (selectedExternalRuleUUID) {
          const selectedRule = externalRules.find(
            (rule) => rule.value === selectedExternalRuleUUID,
          );
          optionList = selectedRule?.fields.map((field) => {
            const option = {
              label: field.label,
              value: field.value,
              isCheck:
                selectedFieldUUID === field[RESPONSE_FIELD_KEYS.FIELD_UUID],
            };
            return option;
          });
        }
        break;
      case VALUE_CONFIG_TYPE.RULE:
        labelName = FIELD_DISPLAY.CHOOSE_FIELD.RULE;
        optionList = [];
        break;
      default:
        break;
    }
    return { labelName, optionList, ruleOptionList };
  };

  const onSelectTableField = (value) => {
    const tableChildDataClone =
      jsUtility.cloneDeep(fieldDetails[RESPONSE_FIELD_KEYS.TABLE_CHILD_DATA]) ||
      [];
    tableChildDataClone.push({
      child_data: value,
    });
    setFieldDetails({
      ...fieldDetails,
      [RESPONSE_FIELD_KEYS.TABLE_CHILD_DATA]: tableChildDataClone,
    });
  };

  const onChangeShowPropertyPicker = () => {
    const closeFieldDetails = jsUtility.cloneDeep(fieldDetails);
    closeFieldDetails.showProperty = !fieldDetails?.showProperty;
    if (!closeFieldDetails.showProperty) {
      delete closeFieldDetails.dataListPickerFieldUUID;
      delete closeFieldDetails.datalistPickerLabel;
      delete closeFieldDetails.datalistPickerFieldType;
    }
    setFieldDetails(closeFieldDetails);
  };

  const onChangePickerProperty = (value) => {
    const closeFieldDetails = jsUtility.cloneDeep(fieldDetails);
    const dataListPickerField = datalistPickerFieldList.find(
      (field) => field.value === value,
    );
    closeFieldDetails.dataListPickerFieldUUID = dataListPickerField.value;
    closeFieldDetails.datalistPickerFieldName = dataListPickerField.label;
    closeFieldDetails.datalistPickerFieldType = dataListPickerField.fieldType;
    setFieldDetails(closeFieldDetails);
  };

  const getAddColumnDropdown = () => {
    const optionList = (selectedTable?.columnMapping || tableFieldList)?.filter(
      (field) =>
        !(fieldDetails[RESPONSE_FIELD_KEYS.TABLE_CHILD_DATA] || []).some(
          (data) => data.child_data?.endsWith(field.fieldUUID),
        ),
    );
    const modifiedOptionList = optionList?.map((option) => {
      if (option?.fieldType === FIELD_TYPE.TABLE) {
        return {
          ...option,
          icon: <ChevronRight />,
          optionLabelClassName: styles.TableLabel,
          optionIconClassName: styles.TableIcon,
        };
      } else return option;
    });

    return (
      <NestedDropdown
        totalViews={2}
        className={gClasses.W50}
        popperPlacement={EPopperPlacements.BOTTOM_END}
        dropdownViewProps={{
          size: Size.md,
          hideDropdownIcon: true,
          variant: Variant.borderLess,
          customDropdownView: (
            <div
              className={cx(
                gClasses.FTwo13BlueV39,
                gClasses.CenterV,
                gClasses.FontWeight500,
              )}
            >
              <Plus className={gClasses.MR8} />
              {FIELD_DISPLAY.ADD_TABLE_COLUMN}
            </div>
          ),
        }}
        onClose={() => setSelectedTable(null)}
      >
        {({ close, nextView, prevView }) => {
          const backBtn = selectedTable && (
            <button
              className={styles.BackBtn}
              onClick={() => {
                setSelectedTable(null);
                prevView();
              }}
            >
              <LeftDirArrowIcon className={gClasses.MR5} />
              {selectedTable?.label}
            </button>
          );

          return (
            <div className={cx(styles.SummaryFieldNestedDropdown)}>
              {backBtn}
              <DropdownList
                className={styles.DropdownList}
                optionList={modifiedOptionList}
                onClick={(value) => {
                  const field = tableFieldList.find(
                    (f) => f.fieldUUID === value,
                  );
                  if (field?.fieldType === FIELD_TYPE.TABLE) {
                    setSelectedTable(field);
                    nextView();
                    return;
                  }
                  onSelectTableField(value);
                  setSelectedTable(null);
                  close();
                }}
                searchProps={{
                  searchPlaceholder: t('common_strings.search'),
                }}
              />
            </div>
          );
        }}
      </NestedDropdown>
    );
  };

  const { labelName, optionList, ruleOptionList } = getDefinedField();

  return (
    <div>
      <div
        className={cx(
          gClasses.W50,
          gClasses.DisplayFlex,
          gClasses.FlexDirectionColumn,
          gClasses.gap12,
        )}
      >
        <Text
          content={FIELD_DISPLAY.TITLE}
          className={cx(gClasses.FTwo16GrayV3, gClasses.FontWeight500)}
        />
        <SingleDropdown
          dropdownViewProps={{
            labelName: FIELD_DISPLAY.FIELD_VALUE_SOURCE.LABEL,
            labelClassName: styles.FieldLabel,
            disabled: isEditField,
          }}
          required
          onClick={(selectedValue) =>
            onChangeHandler(
              selectedValue,
              RESPONSE_FIELD_KEYS.FIELD_SOURCE_TYPE,
            )
          }
          optionList={FIELD_DISPLAY.FIELD_VALUE_SOURCE.OPTIONS}
          selectedValue={fieldSourceType}
          errorMessage={errorList?.[RESPONSE_FIELD_KEYS.FIELD_SOURCE_TYPE]}
        />

        {isExternalSource &&
          !isTableColumn && ( // External rule dropdown
            <SingleDropdown
              dropdownViewProps={{
                labelName: FIELD_DISPLAY.CHOOSE_FIELD.EXTERNAL_RULE,
                labelClassName: styles.FieldLabel,
                disabled: isEditField,
              }}
              optionList={ruleOptionList}
              selectedValue={selectedExternalRuleUUID}
              onClick={(selectedValue) =>
                onChangeHandler(
                  selectedValue,
                  RESPONSE_FIELD_KEYS.SELECTED_EXTERNAL_RULE_UUID,
                )
              }
              required
              errorMessage={
                errorList?.[RESPONSE_FIELD_KEYS.SELECTED_EXTERNAL_RULE_UUID]
              }
            />
          )}

        {fieldSourceType && (
          <>
            {!fieldDetails.isMultipleEntry &&
              (isExternalSource ? selectedExternalRuleUUID : true) && (
                <SingleDropdown
                  dropdownViewProps={{
                    labelName: labelName,
                    labelClassName: styles.FieldLabel,
                    disabled: isEditField,
                  }}
                  optionList={optionList}
                  selectedValue={selectedFieldUUID}
                  onClick={(selectedValue) =>
                    onChangeHandler(
                      selectedValue,
                      RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID,
                    )
                  }
                  required
                  errorMessage={
                    errorList?.[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID]
                  }
                />
              )}
            {fieldSourceType === VALUE_CONFIG_TYPE.USER_DEFINED_FIELD &&
              [
                FIELD_TYPE.DATA_LIST,
                FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
                FIELD_TYPE.USER_TEAM_PICKER,
                FIELD_TYPE.USER_PROPERTY_PICKER,
              ].includes(fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE]) && (
                <>
                  {[FIELD_TYPE.DATA_LIST, FIELD_TYPE.USER_TEAM_PICKER].includes(
                    fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE],
                  ) && (
                    <Checkbox
                      details={{
                        label: FIELD_DISPLAY.SHOW_PROPERTY_FOR_PICKER,
                        value: 'picker',
                      }}
                      isValueSelected={fieldDetails?.showProperty}
                      onClick={onChangeShowPropertyPicker}
                      errorMessage={errorList?.showProperty}
                      disabled={isEditField}
                    />
                  )}
                  {isDatalistPickerDisplay && (
                    <SingleDropdown
                      dropdownViewProps={{
                        labelName: FIELD_DISPLAY.CHOOSE_PICKER_PROPERTY,
                        labelClassName: styles.FieldLabel,
                        disabled: isEditField,
                      }}
                      optionList={datalistPickerFieldList}
                      selectedValue={fieldDetails?.dataListPickerFieldUUID}
                      onClick={onChangePickerProperty}
                      required
                      errorMessage={errorList?.dataListPickerFieldUUID}
                    />
                  )}
                </>
              )}
            {(!jsUtility.isEmpty(selectedFieldUUID) ||
              fieldDetails.isMultipleEntry) && (
              <>
                <TextInput
                  labelText={FIELD_DISPLAY.FIELD_LABEL.LABEL}
                  labelClassName={styles.FieldLabel}
                  required
                  placeholder={FIELD_DISPLAY.FIELD_LABEL.PLACEHOLDER}
                  value={
                    isDatalistPickerDisplay
                      ? fieldDetails?.datalistPickerFieldName
                      : fieldDetails[RESPONSE_FIELD_KEYS.FIELD_NAME]
                  }
                  onChange={(event) =>
                    onChangeHandler(
                      event?.target?.value,
                      RESPONSE_FIELD_KEYS.FIELD_NAME,
                    )
                  }
                  errorMessage={
                    (isDatalistPickerDisplay
                      ? errorList?.datalistPickerFieldName
                      : errorList?.[RESPONSE_FIELD_KEYS.FIELD_NAME]) || null
                  }
                />
                <SingleDropdown
                  dropdownViewProps={{
                    labelName: FIELD_DISPLAY.FIELD_TYPE,
                    labelClassName: styles.FieldLabel,
                    disabled: true,
                  }}
                  optionList={FIELD_LIST?.(t)}
                  selectedValue={
                    isDatalistPickerDisplay
                      ? fieldDetails?.datalistPickerFieldType
                      : fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE]
                  }
                  errorMessage={
                    isDatalistPickerDisplay
                      ? errorList?.datalistPickerFieldType
                      : errorList?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]
                  }
                  required
                />
                {/* {!isEmpty(getChoiceValues()) && FIELD_GROUPING.SELECTION_FIELDS.includes(fieldDetails?.fieldType) &&
                <div>
                <Label labelName="Selection Options" isRequired />
                <div className={styles.OptionListContainer}>
                  <div className={cx(gClasses.DisplayFlex)}>
                    <Label labelName="Label" className={gClasses.W100} isRequired />
                    <Label labelName="Value" className={gClasses.W100} isRequired />
                  </div>
                  {getChoiceValues()?.map((choice) => (
                    <div className={cx(gClasses.DisplayFlex)}>
                      <TextInput
                        className={gClasses.W100}
                        value={choice?.label || choice.toString()}
                        readOnly
                      />
                      <TextInput
                        className={gClasses.W100}
                        value={choice?.value || choice.toString()}
                        readOnly
                      />
                    </div>
                  ))}
                </div>
                </div>
                } */}
              </>
            )}
          </>
        )}
      </div>
      {isTableField &&
        ((fieldSourceType !== null && !jsUtility.isEmpty(selectedFieldUUID)) ||
          fieldDetails.isMultipleEntry) && ( // when it is multiple entry external source, then handle it fields as table
          <>
            <TableWithPagination
              tableClassName={styles.TableDependantApps}
              header={[
                {
                  label: FIELD_DISPLAY.TABLE_COLUMN.COLUMN_NAME,
                  widthWeight: 3,
                },
                {
                  label: FIELD_DISPLAY.TABLE_COLUMN.COLUMN_TYPE,
                  widthWeight: 3,
                },
                { label: EMPTY_STRING },
              ]}
              data={getTableFieldListData()}
              widthVariant={TableColumnWidthVariant.CUSTOM}
            />

            {getAddColumnDropdown()}

            {fieldDetails?.errorList?.tableChildData && (
              <HelperMessage
                message={errorList?.tableChildData}
                className={gClasses.MT15}
                type={HELPER_MESSAGE_TYPE.ERROR}
                noMarginBottom
                role={ARIA_ROLES.ALERT}
              />
            )}
          </>
        )}
    </div>
  );
}

export default DisplayFieldBasicConfiguration;
