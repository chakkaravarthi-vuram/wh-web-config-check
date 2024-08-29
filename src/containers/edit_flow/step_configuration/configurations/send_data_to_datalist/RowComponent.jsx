import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { cloneDeep, get, isEmpty, set } from 'utils/jsUtility';
import { ETextSize, SingleDropdown, Text } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import styles from './SendDataToDataList.module.scss';
import { getFieldTypeOptions, getGroupedSystemFieldListForMapping } from '../../../../integration/add_integration/workhall_api/WorkhallApi.utils';
import { FEILD_LIST_DROPDOWN_TYPE, getGroupedFieldListForMapping, getOptionListForStaticValue } from '../../StepConfiguration.utils';
import { SEND_DATA_TO_DATALIST_STRINGS } from '../Configuration.strings';
import FieldPicker from '../../../../../components/field_picker/FieldPicker';
import { getOperation, getValueTypes } from '../Configuration.utils';
import Trash from '../../../../../assets/icons/application/Trash';
import { FIELD_PICKER_DROPDOWN_TYPES } from '../../../../../components/field_picker/FieldPicker.utils';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { generateEventTargetObject } from '../../../../../utils/generatorUtils';
import { ENTRY_ACTION_TYPE, SEND_DATA_TO_DATALIST, SYSTEM_FIELDS_FOR_FLOW_DL_MAPPING } from '../Configuration.constants';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import StaticValue from '../../../../../components/static_value_new/StaticValue';
import { FIELD_MAPPING_ERRORS } from '../../../../../components/flow_trigger_configuration/field_mapping/FieldMapping.constants';

function MappingRow(props) {
  const {
    currentRow = {},
    onChangeHandlers,
    path,
    errorList = {},
    additionalRowComponentProps = {},
  } = props;
  const { t } = useTranslation();
  const {
    allDataListFields = [],
    isLoadingDataListFields = false,
    allflowFields = [],
    isLoadingFlowFields = false,
    entryActionType = null,
    isDataListSelected = false,
    mappingData = [],
    selectedDLFields = [],
    staticValueParentId = EMPTY_STRING,
    allowedCurrencyList,
    defaultCurrencyType,
  } = additionalRowComponentProps;

  const { FIELD_KEYS, VALIDATION_CONSTANTS } = SEND_DATA_TO_DATALIST;
  const { ALL_LABELS, VALIDATION_MESSAGE } = SEND_DATA_TO_DATALIST_STRINGS;

  const systemFields = (currentRow?.[FIELD_KEYS.DATA_LIST_FIELD_TYPE] === FIELD_LIST_TYPE.TABLE) ? [] : SYSTEM_FIELDS_FOR_FLOW_DL_MAPPING;
  let parentDataListTableUuid = null;
  let parentFlowTableUuid = null;
  let isFlowDataFieldsOnly = [FIELD_KEYS.TABLE_TO_TABLE_MAPPING_TYPE, FIELD_KEYS.DIRECT_TO_TABLE_MAPPING_TYPE].includes(currentRow?.[FIELD_KEYS.MAPPING_TYPE]);
  const isFlowSystemFieldsOnly = currentRow[FIELD_KEYS.VALUE_TYPE] === FIELD_KEYS.SYSTEM;
  const isChildKeysAllowed = path.includes(FIELD_KEYS.TABLE_COLUMN_MAPPING);
  let flowFieldTypeFilter = (currentRow?.[FIELD_KEYS.DATA_LIST_FIELD_TYPE] === FIELD_LIST_TYPE.TABLE) ? FEILD_LIST_DROPDOWN_TYPE.TABLES : FEILD_LIST_DROPDOWN_TYPE.DIRECT;
  if (isChildKeysAllowed) {
    let pathArr = cloneDeep(path);
    pathArr = pathArr.split(',');
    (pathArr || []).splice(pathArr.length - 2, 2);
    parentDataListTableUuid = get(mappingData, [...pathArr, FIELD_KEYS.DATA_LIST_FIELD, FIELD_KEYS.TABLE_UUID], null);
    parentFlowTableUuid = get(mappingData, [...pathArr, FIELD_KEYS.FLOW_FIELD, FIELD_KEYS.TABLE_UUID], null);
    if (parentFlowTableUuid) {
      flowFieldTypeFilter = FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS;
      isFlowDataFieldsOnly = true;
    }
  }
  const flowDataFields = getGroupedFieldListForMapping(
    parentFlowTableUuid,
    allflowFields,
    [],
    flowFieldTypeFilter,
    t,
  );
  const flowSystemFields = getGroupedSystemFieldListForMapping(systemFields, []);
  const flowDataFieldsWithoutTitle = flowDataFields?.filter((eachField) => eachField?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE);
  const flowSystemFieldsWithoutTitle = flowSystemFields?.filter((eachField) => eachField?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE);

  const selectedDLFieldsUuid = [];
  (selectedDLFields || []).forEach(({ value }) => selectedDLFieldsUuid.push(value));
  const dataListDataFields = getGroupedFieldListForMapping(
    parentDataListTableUuid,
    allDataListFields,
    selectedDLFieldsUuid, // use this to avoid repeatation
    parentDataListTableUuid ? FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS : FEILD_LIST_DROPDOWN_TYPE.ALL,
    t,
  );

  let flowFieldError = errorList[`${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.FLOW_FIELD_UUID}`];
  let dlFieldError = errorList[`${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.DATA_LIST_FIELD_UUID}`];

  if (currentRow[FIELD_KEYS.DATA_LIST_FIELD] && currentRow[FIELD_KEYS.FLOW_FIELD] && errorList[`${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.DATA_LIST_FIELD_TYPE}`]) {
    flowFieldError = errorList[`${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.FLOW_FIELD_TYPE}`];
    dlFieldError = errorList[`${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.DATA_LIST_FIELD_TYPE}`];
  }
  if (isEmpty(dlFieldError) && (errorList[`${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.DATA_LIST_FIELD}`] || errorList[`${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.DATA_LIST_TABLE_UUID}`])) {
    dlFieldError = t(SEND_DATA_TO_DATALIST_STRINGS.ALL_LABELS.FIELD_DELETED);
  }

  const childFieldDetails = currentRow?.[FIELD_KEYS.DATA_LIST_FIELD];
  const childFieldType = get(childFieldDetails, ['field_type'], FIELD_TYPE.SINGLE_LINE);
  const staticValueId = `${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.STATIC}`;

  const getErrors = (error, errorId) => {
    if (childFieldType === FIELD_TYPE.CURRENCY) {
        if (errorId.includes(VALIDATION_CONSTANTS.CURRENCY_TYPE)) return t(FIELD_MAPPING_ERRORS.CURRENCY_TYPE_REQUIRED);
        if (errorId.includes(VALIDATION_CONSTANTS.VALUE)) return t(FIELD_MAPPING_ERRORS.CURRENCY_VALUE_REQUIRED);
        return error;
    }

    return error;
  };

  const getStaticValueErrors = (_id) => {
    const errors = [];
    Object.keys(errorList).forEach((errorId) => {
      const index = errorId.indexOf(_id);

      if (index === 0) {
        if (childFieldType === FIELD_TYPE.LINK) {
          const errorIdIndices = errorId.split(',');
          const currentErrorKey = errorIdIndices[errorIdIndices.length - 1];
          const currentErrorIndex = Number(errorIdIndices[errorIdIndices.length - 2]);

          if (currentErrorKey === VALIDATION_CONSTANTS.LINK_TEXT) {
            set(errors, [currentErrorIndex, VALIDATION_CONSTANTS.LINK_TEXT], errorList[errorId]);
          } else if (currentErrorKey === VALIDATION_CONSTANTS.LINK_URL) {
            set(errors, [currentErrorIndex, VALIDATION_CONSTANTS.LINK_URL], errorList[errorId]);
          }
        } else {
            errors.push(getErrors(errorList[errorId], errorId));
        }
      }
    });

    if (childFieldType === FIELD_TYPE.LINK) return errors;

    return errors[0] || EMPTY_STRING;
  };

  return (
    <>
      <div className={cx(gClasses.DisplayFlex)}>
        <div className={cx(styles.DataListField, gClasses.MR24)}>
          <FieldPicker
            id={FIELD_KEYS.DATA_LIST_FIELD_UUID}
            onChange={(event) => onChangeHandlers({
              event,
              type: FIELD_KEYS.DATA_LIST_FIELD_UUID,
              path,
              allFieldsList: dataListDataFields,
            })}
            optionList={dataListDataFields}
            isExactPopperWidth
            errorMessage={dlFieldError}
            selectedOption={currentRow?.[FIELD_KEYS.DATA_LIST_FIELD]}
            selectedValue={currentRow?.[FIELD_KEYS.DATA_LIST_FIELD_UUID] || currentRow?.[FIELD_KEYS.DATA_LIST_TABLE_UUID]}
            placeholder={t(ALL_LABELS.CHOOSE_DATALIST_FIELD)}
            isLoading={isLoadingDataListFields}
            disabled={!isDataListSelected || (isChildKeysAllowed && !parentDataListTableUuid)}
            isDataFieldsOnly
            enableSearch
          />
        </div>
        <div className={cx(styles.OperatorField, gClasses.MR24)}>
          <SingleDropdown
            id={FIELD_KEYS.OPERATION}
            placeholder={t(ALL_LABELS.OPERATION)}
            selectedValue={currentRow[FIELD_KEYS.OPERATION]}
            dropdownViewProps={{
              disabled: (entryActionType === ENTRY_ACTION_TYPE.AUTO),
              className: gClasses.InputHeight36,
            }}
            onClick={(value) => onChangeHandlers({
              type: FIELD_KEYS.OPERATION,
              path,
              event: generateEventTargetObject(FIELD_KEYS.OPERATION, value),
            })}
            optionList={getOperation(currentRow, entryActionType, !isEmpty(parentDataListTableUuid), t)}
            hideLabel
            errorMessage={errorList[`${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.OPERATION}`]}
          />
        </div>
        <div className={cx(styles.ValueField, gClasses.MR24)}>
          <SingleDropdown
            id={FIELD_KEYS.VALUE_TYPE}
            placeholder={t(ALL_LABELS.VALUE_TYPE)}
            selectedValue={currentRow[FIELD_KEYS.VALUE_TYPE]}
            onClick={(value) => onChangeHandlers({
              type: FIELD_KEYS.VALUE_TYPE,
              path,
              event: generateEventTargetObject(FIELD_KEYS.VALUE_TYPE, value),
            })}
            optionList={getValueTypes(t, currentRow?.[FIELD_KEYS.DATA_LIST_FIELD_TYPE])}
            hideLabel
            errorMessage={errorList[`${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.VALUE_TYPE}`]}
            dropdownViewProps={{
              disabled: currentRow?.[FIELD_KEYS.DATA_LIST_FIELD_TYPE] === FIELD_TYPE.TABLE,
            }}
          />
        </div>
        {
          currentRow?.[FIELD_KEYS.VALUE_TYPE] === FIELD_KEYS.STATIC ? (
            <div className={cx(styles.FlowField, gClasses.MR24)}>
              <StaticValue
                childFieldDetails={childFieldDetails}
                fieldType={childFieldType}
                onStaticValueChange={(event) => onChangeHandlers({
                  type: FIELD_KEYS.STATIC,
                  path,
                  event,
                })}
                staticValue={currentRow?.[FIELD_KEYS.STATIC]}
                staticValueError={getStaticValueErrors(`${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.STATIC}`)}
                dropdownOptionList={getOptionListForStaticValue(childFieldDetails)}
                parentId={staticValueParentId}
                allowedCurrencyList={allowedCurrencyList}
                defaultCurrencyType={defaultCurrencyType}
                id={staticValueId}
              />
            </div>
          ) : (
            <div className={cx(styles.FlowField, gClasses.MR24)}>
              <FieldPicker
                id={FIELD_KEYS.FLOW_FIELD_UUID}
                onChange={(event) => onChangeHandlers({
                  event,
                  type: FIELD_KEYS.FLOW_FIELD_UUID,
                  path,
                  allFieldsList: flowDataFields,
                })}
                optionList={flowDataFields}
                errorMessage={flowFieldError}
                isExactPopperWidth
                selectedOption={currentRow?.[FIELD_KEYS.FLOW_FIELD]}
                selectedValue={currentRow?.[FIELD_KEYS.FLOW_FIELD_UUID] || currentRow?.[FIELD_KEYS.FLOW_TABLE_UUID]}
                initialOptionList={getFieldTypeOptions({ fieldsCount: flowDataFieldsWithoutTitle?.length, systemFieldsCount: flowSystemFieldsWithoutTitle?.length })}
                systemFieldList={flowSystemFields}
                placeholder={t(ALL_LABELS.CHOOSE_FLOW_FIELD)}
                isLoading={isLoadingFlowFields}
                isDataFieldsOnly={isFlowDataFieldsOnly || currentRow[FIELD_KEYS.VALUE_TYPE] === FIELD_KEYS.DYNAMIC}
                isSystemFieldsOnly={isFlowSystemFieldsOnly}
                enableSearch
              />
            </div>
          )
        }

        <button
          onClick={() =>
            onChangeHandlers({
              type: FIELD_KEYS.DELETE,
              path,
            })
          }
          className={cx(gClasses.TopV, styles.DeleteColumn)}
        >
          <Trash className={cx(gClasses.MR12)} />
        </button>
      </div>
      {
        (errorList[`${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.TABLE_COLUMN_MAPPING}`]) && (
          <Text className={cx(gClasses.red22)} content={t(VALIDATION_MESSAGE.TABLE_COLUMN_MAPPING)} size={ETextSize.XS} />
        )
      }
    </>
  );
}

export default MappingRow;
