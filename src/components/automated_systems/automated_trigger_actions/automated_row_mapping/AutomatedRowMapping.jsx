import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';

import gClasses from '../../../../scss/Typography.module.scss';
import FieldPicker from '../../../field_picker/FieldPicker';
import {
  FLOW_ACTION_VALUE_TYPE,
  AUTOMATED_SYSTEM_KEYS,
  SYSTEM_FIELDS_FOR_AUTOMATION_SYSTEM,
} from '../../AutomatedSystems.constants';
import { generateEventTargetObject } from '../../../../utils/generatorUtils';
import { getStaticValueErrors, getValueTypeForAutomation } from '../../AutomatedSystems.utils';
import { FIELD_TYPE } from '../../../../utils/constants/form.constant';
import StaticValue from '../../../static_value_new/StaticValue';
import {
  FEILD_LIST_DROPDOWN_TYPE,
  getGroupedFieldListForMapping,
  getOptionListForStaticValue,
} from '../../../../containers/edit_flow/step_configuration/StepConfiguration.utils';
import {
  getFieldTypeOptions,
  getGroupedSystemFieldListForMapping,
} from '../../../../containers/integration/add_integration/workhall_api/WorkhallApi.utils';
import { FIELD_PICKER_DROPDOWN_TYPES } from '../../../field_picker/FieldPicker.utils';
import styles from '../../AutomatedSystems.module.scss';
import { cloneDeep, get, isEmpty } from '../../../../utils/jsUtility';
import Trash from '../../../../assets/icons/application/Trash';
import { VALIDATION_CONSTANT } from '../../../../utils/constants/validation.constant';
import { AUTOMATED_SYSTEM_CONSTANTS } from '../../AutomatedSystems.strings';

function filterOutOptionListTitle(fields, FIELD_PICKER_DROPDOWN_TYPES) {
  return fields.filter((field) => field?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE);
}

function AutomatedRowMapping(props) {
  const {
    currentRow = {},
    onChangeHandlers = null,
    path,
    errorList = {},
    additionalRowComponentProps = {},
  } = props;

  const {
    dataListUUID,
    dataListFieldList = [],
    isDataListFieldListLoading = false,
    flowFieldList = [],
    isFlowFieldList = false,
    mappingData = [],
    dataListId = null, // currenct data list id
    selectedFlowFields = [],
    allowedCurrencyList,
    defaultCurrencyType,
    defaultCountryCode,
  } = additionalRowComponentProps;

  const { t } = useTranslation();
  const {
    COMMON_AUTOMATED_STRINGS: {
      CHOOSE_FLOW_FIELD,
      CHOOSE_DL_FIELD,
      ENTER_STATIC_VALUE,
    },
  } = AUTOMATED_SYSTEM_CONSTANTS(t);
  const {
    DATA_LIST_FIELD_UUID,
    DATA_LIST_FIELD_DATA,
    VALUE_TYPE,
    DATA_LIST_FIELD_TYPE,
    FLOW_FIELD_DATA,
    FLOW_FIELD_TYPE,
    FLOW_TABLE_UUID,
    STATIC_VALUE,
    FLOW_FIELD_UUID,
    TABLE_COLUMN_MAPPING,
    DELETE,
    TRIGGER_MAPPING,
    FLOW_ACTIONS,
  } = AUTOMATED_SYSTEM_KEYS;

  const disableFlowField = false; // !isDataListSelected || (isChildKeysAllowed && !parentDataListTableUuid)

  function getSystemFields(currentRow, FIELD_TYPE, SYSTEM_FIELDS_FOR_AUTOMATION_SYSTEM) {
    return currentRow?.[FLOW_FIELD_TYPE] === FIELD_TYPE.TABLE ? [] : SYSTEM_FIELDS_FOR_AUTOMATION_SYSTEM;
  }

  // Determining System Field Based On flow fiedl type.
  const systemFields = getSystemFields(currentRow, FIELD_TYPE, SYSTEM_FIELDS_FOR_AUTOMATION_SYSTEM);

  let parentDataListTableUuid = null;
  let parentFlowTableUuid = null;

  // Data List Related Field Group
  let isDlDataFieldsOnly =
    currentRow[VALUE_TYPE] === FLOW_ACTION_VALUE_TYPE.DYNAMIC;
  const isDlSystemFieldsOnly =
    currentRow[VALUE_TYPE] === FLOW_ACTION_VALUE_TYPE.SYSTEM;

  let dlFieldTypeFilter =
    currentRow?.[FLOW_FIELD_TYPE] === FIELD_TYPE.TABLE
      ? FEILD_LIST_DROPDOWN_TYPE.TABLES
      : FEILD_LIST_DROPDOWN_TYPE.DIRECT;

  // Check whether the field is table column and set the table uuid for both flow and data list.
  const isChildKeysAllowed = path.includes(TABLE_COLUMN_MAPPING);
  const cloneMapping = cloneDeep(mappingData);
  if (isChildKeysAllowed) {
    let pathArr = cloneDeep(path);
    pathArr = pathArr.split(',');
    (pathArr || []).splice(pathArr.length - 2, 2);
    parentDataListTableUuid = get(cloneMapping, [...pathArr, DATA_LIST_FIELD_DATA, 'table_uuid'], null);
    parentFlowTableUuid = get(cloneMapping, [...pathArr, FLOW_FIELD_DATA, 'table_uuid'], null);
    if (parentDataListTableUuid) {
      dlFieldTypeFilter = FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS;
      isDlDataFieldsOnly = true;
    }
  }

  // Data list field grouping.
  const dlDataFields = getGroupedFieldListForMapping(
    parentDataListTableUuid,
    dataListFieldList,
    [],
    dlFieldTypeFilter,
    t,
  );

  const dlSystemFields = getGroupedSystemFieldListForMapping(systemFields, []);

  const dlDataFieldsWithoutTitle = filterOutOptionListTitle(dlDataFields, FIELD_PICKER_DROPDOWN_TYPES);
  const dlSystemFieldsWithoutTitle = filterOutOptionListTitle(dlSystemFields, FIELD_PICKER_DROPDOWN_TYPES);

  // Flow related field grouping.
  const selectedFlowFieldsUUID = selectedFlowFields.map(({ value }) => value);

  const flowListDataFields = getGroupedFieldListForMapping(
    parentFlowTableUuid,
    flowFieldList,
    selectedFlowFieldsUUID, // use this to avoid repeatation
    parentFlowTableUuid
      ? FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS
      : FEILD_LIST_DROPDOWN_TYPE.ALL,
    t,
  );

  function getErrorPath(...args) {
    return args.join(',');
  }

  function getError(path, errorList) {
    return errorList[path];
  }

  const flowErrorPath = getErrorPath(FLOW_ACTIONS, TRIGGER_MAPPING, path, FLOW_FIELD_UUID);
  const dlErrorPath = getErrorPath(FLOW_ACTIONS, TRIGGER_MAPPING, path, DATA_LIST_FIELD_UUID);
  const staticValuePath = getErrorPath(FLOW_ACTIONS, TRIGGER_MAPPING, path, STATIC_VALUE);

  // Generic - Error Retrieval.
  let flowFieldError = getError(flowErrorPath, errorList);
  let dlFieldError = getError(dlErrorPath, errorList);

  // Type Based - Error Retrieval
  if (currentRow[DATA_LIST_FIELD_DATA] && currentRow[FLOW_FIELD_DATA]) {
    flowFieldError = flowFieldError || getError(getErrorPath(FLOW_ACTIONS, TRIGGER_MAPPING, path, FLOW_FIELD_TYPE), errorList);
    dlFieldError = dlFieldError || getError(getErrorPath(FLOW_ACTIONS, TRIGGER_MAPPING, path, DATA_LIST_FIELD_TYPE), errorList);
  }

  // Server Based - Error Retrieval
  if (isEmpty(flowFieldError) && (errorList[`${TRIGGER_MAPPING},${path},${FLOW_FIELD_DATA}`] || errorList[`${TRIGGER_MAPPING},${path},${FLOW_TABLE_UUID}`])) {
    dlFieldError = t(VALIDATION_CONSTANT.FIELDS_DELETED);
  }

  return (
    <div className={styles.FieldMapping}>
      <div className={styles.FlowField}>
        <FieldPicker
          id={FLOW_FIELD_UUID}
          onChange={(event) =>
            onChangeHandlers({
              event,
              type: FLOW_FIELD_UUID,
              path,
              allFieldsList: flowListDataFields,
            })
          }
          optionList={flowListDataFields}
          isExactPopperWidth
          errorMessage={flowFieldError}
          selectedOption={currentRow?.[FLOW_FIELD_DATA]}
          selectedValue={currentRow?.[FLOW_FIELD_UUID]}
          placeholder={CHOOSE_FLOW_FIELD}
          isLoading={isFlowFieldList}
          disabled={disableFlowField}
          isDataFieldsOnly
          enableSearch
        />
      </div>
      <div className={styles.ValueBy}>
        <SingleDropdown
          id={VALUE_TYPE}
          placeholder={ENTER_STATIC_VALUE}
          selectedValue={currentRow[VALUE_TYPE]}
          onClick={(value) =>
            onChangeHandlers({
              type: VALUE_TYPE,
              path,
              event: generateEventTargetObject(VALUE_TYPE, value),
            })
          }
          optionList={getValueTypeForAutomation(
            t,
            currentRow?.[DATA_LIST_FIELD_TYPE],
            currentRow?.[FLOW_FIELD_DATA],
            dataListUUID,
          )}
          hideLabel
          // errorMessage={errorList[`${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.VALUE_TYPE}`]}
          dropdownViewProps={{
            disabled: currentRow?.[FLOW_FIELD_TYPE] === FIELD_TYPE.TABLE,
          }}
        />
      </div>
      { currentRow?.[VALUE_TYPE] !== FLOW_ACTION_VALUE_TYPE.MAP_ENTRY ?
      <div className={styles.DlField}>
        {currentRow?.[VALUE_TYPE] === FLOW_ACTION_VALUE_TYPE.STATIC ? (
          <StaticValue
            childFieldDetails={currentRow?.[FLOW_FIELD_DATA]}
            fieldType={currentRow?.[FLOW_FIELD_TYPE]}
            onStaticValueChange={(event) =>
              onChangeHandlers({
                type: STATIC_VALUE,
                path,
                event,
              })
            }
            staticValue={currentRow?.[STATIC_VALUE]}
            staticValueError={getStaticValueErrors(staticValuePath, errorList, currentRow?.[FLOW_FIELD_TYPE], t)}
            dropdownOptionList={getOptionListForStaticValue(
              currentRow?.[FLOW_FIELD_DATA],
            )}
            parentId={dataListId}
            allowedCurrencyList={allowedCurrencyList}
            defaultCurrencyType={defaultCurrencyType}
            defaultCountryCode={defaultCountryCode}
            id={STATIC_VALUE}
          />
        ) : (
          <FieldPicker
            id={DATA_LIST_FIELD_UUID}
            onChange={(event) =>
              onChangeHandlers({
                event,
                type: DATA_LIST_FIELD_UUID,
                path,
                allFieldsList: dlDataFields,
              })
            }
            optionList={dlDataFields}
            errorMessage={dlFieldError}
            isExactPopperWidth
            selectedOption={currentRow?.[DATA_LIST_FIELD_DATA]}
            selectedValue={currentRow?.[DATA_LIST_FIELD_UUID]}
            initialOptionList={getFieldTypeOptions({
              fieldsCount: dlDataFieldsWithoutTitle?.length,
              systemFieldsCount: dlSystemFieldsWithoutTitle?.length,
            })}
            systemFieldList={dlSystemFields}
            placeholder={CHOOSE_DL_FIELD}
            isLoading={isDataListFieldListLoading}
            isDataFieldsOnly={
              isDlDataFieldsOnly ||
              currentRow[VALUE_TYPE] === FLOW_ACTION_VALUE_TYPE.DYNAMIC
            }
            isSystemFieldsOnly={isDlSystemFieldsOnly}
            enableSearch
          />
        )}
      </div>
      : <div className={styles.DlField} />
      }
      <button
          onClick={() => onChangeHandlers({ type: DELETE, path })}
          className={cx(gClasses.TopV, styles.DeleteColumn, gClasses.MT7)}
      >
          <Trash className={gClasses.MR12} />
      </button>
    </div>
  );
}

export default AutomatedRowMapping;
AutomatedRowMapping.propTypes = {
  currentRow: PropTypes.object,
  onChangeHandlers: PropTypes.func,
  path: PropTypes.string.isRequired,
  errorList: PropTypes.object,
  additionalRowComponentProps: PropTypes.object,
};
