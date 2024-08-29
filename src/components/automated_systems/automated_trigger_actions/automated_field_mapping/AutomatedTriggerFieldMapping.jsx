import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { InputTreeLayout } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';

import gClasses from 'scss/Typography.module.scss';
import style from '../../AutomatedSystems.module.scss';
import {
  FIELD_MAPPING_ROW_INITIAL_STATE,
  FLOW_ACTION_VALUE_TYPE,
  AUTOMATED_SYSTEM_KEYS,
  SYSTEM_FIELDS_FOR_AUTOMATION_SYSTEM,
} from '../../AutomatedSystems.constants';
import { COMMA, EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import PlusAddIcon from '../../../../assets/icons/PlusAddIcon';
import { getDefaultKeyLabels } from '../../../../containers/integration/Integration.utils';
import AutomatedRowMapping from '../automated_row_mapping/AutomatedRowMapping';
import { getAccountConfigurationDetailsApiService } from '../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import useApiCall from '../../../../hooks/useApiCall';
import { FIELD_TYPE } from '../../../../utils/constants/form.constant';
import { apiGetAllFieldsList } from '../../../../axios/apiService/flow.apiService';
import { getAllDataListFields } from '../../../../axios/apiService/form.apiService';
import {
  cloneDeep,
  get,
  unset,
  set,
  isEmpty,
} from '../../../../utils/jsUtility';

import { getInitialStaticValueByType } from '../../../../containers/edit_flow/step_configuration/configurations/Configuration.utils';
import { getFieldType } from '../../../../containers/edit_flow/step_configuration/StepConfiguration.utils';
import { validateMappingFieldTypes } from '../../../../containers/edit_flow/step_configuration/StepConfiguration.validations';
import { SEND_DATA_TO_DATALIST } from '../../../../containers/edit_flow/step_configuration/configurations/Configuration.constants';
import { AUTOMATED_SYSTEM_CONSTANTS } from '../../AutomatedSystems.strings';

const cancelDataListFieldToken = {
  cancelToken: null,
};
const setDataListFieldCancelToken = (c) => {
  cancelDataListFieldToken.cancelToken = c;
};

function AutomatedTriggerFieldMapping(props) {
  const { metaData, flowId, errorList, mappingData, onChangeHandler, onUpdateError } = props;
  const { dataListId, dataListUUID } = metaData;
  const { t } = useTranslation();
  const {
    COMMON_AUTOMATED_STRINGS: {
      FIELDS_IN_DATALIST,
      FIELDS_IN_FLOW,
      VALUE_TYPE: VALUE_TYPE_LABEL,
      ADD_COLUMN,
      ADD_MORE_FIELDS,
    },
  } = AUTOMATED_SYSTEM_CONSTANTS(t);
  const {
    TABLE_COLUMN_MAPPING,
    FLOW_FIELD_TYPE,
    FLOW_FIELD_DATA,
    FLOW_FIELD_UUID,
    FLOW_TABLE_UUID,
    DELETE,
    TRIGGER_MAPPING,
    DATA_LIST_FIELD_UUID,
    DATA_LIST_TABLE_UUID,
    DATA_LIST_FIELD_DATA,
    DATA_LIST_FIELD_TYPE,
    VALUE_TYPE,
    STATIC_VALUE,
  } = AUTOMATED_SYSTEM_KEYS;

  const TABLE_HEADERS = [
    FIELDS_IN_FLOW,
    VALUE_TYPE_LABEL,
    FIELDS_IN_DATALIST,
    EMPTY_STRING,
  ];

  // state
  const [allowedCurrencyList, setAllowedCurrencyList] = useState([]);
  const [defaultCurrencyType, setDefaultCurrencyType] = useState(EMPTY_STRING);
  const [defaultCountryCode, setDefaultCountryCode] = useState(EMPTY_STRING);

  //  Data list field reducer
  const {
    data: dataListFields,
    fetch: dataListFieldFetch,
    clearData: clearDataListFields,
    isLoading: isDataListsFieldsLoading,
  } = useApiCall({}, true);
  // Flow field reducer
  const {
    data: flowFields,
    fetch: flowFieldFetch,
    clearData: clearFlowFields,
    isLoading: isFlowFieldsLoading,
  } = useApiCall({}, true);

  // set environment allowed currency list and default currency type.
  useEffect(() => {
    getAccountConfigurationDetailsApiService().then(
      (response) => {
        if (response.allowed_currency_types) {
          setAllowedCurrencyList(response.allowed_currency_types);
          setDefaultCurrencyType(response.default_currency_type || '');
          setDefaultCountryCode(response.default_country_code);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  // Query Flow Fields
  useEffect(() => {
    const param = {
      page: 1,
      size: 1000,
      flow_id: flowId,
      ignore_field_types: [FIELD_TYPE.INFORMATION],
      include_property_picker: 1,
    };
    flowId && flowFieldFetch(apiGetAllFieldsList(param));
    return () => {
      clearFlowFields();
    };
  }, [flowFieldFetch, flowId]);

  // Query Data List Fields
  useEffect(() => {
    const param = {
      page: 1,
      size: 1000,
      // data_list_uuids: [dataListUUID],
      data_list_id: dataListId,
      ignore_field_types: [FIELD_TYPE.INFORMATION],
      include_property_picker: 1,
    };
    dataListId && dataListFieldFetch(
      getAllDataListFields(param, setDataListFieldCancelToken),
    );
    return () => {
      clearDataListFields();
    };
  }, [flowFieldFetch, dataListId]);

  // Default keys and Custom label for action link inside the TreeLayout component.
  const defaultKeyLabels = getDefaultKeyLabels(
    t,
    TABLE_COLUMN_MAPPING,
    FLOW_FIELD_TYPE,
    ADD_COLUMN,
    ADD_MORE_FIELDS,
  );

  // Utils
  const removeChildRowErrors = (errorList, currentRowPath) => {
    const clonedErrorList = {};
    Object.keys(errorList)?.forEach((errorKey) => {
      if (
        errorKey &&
        !errorKey.includes(`${currentRowPath},${TABLE_COLUMN_MAPPING}`)
      ) {
        set(clonedErrorList, errorKey, errorList[errorKey]);
      }
    });
    return clonedErrorList;
  };
  const clearAllStaticValueErrors = (path, errorList = {}) => {
    const clonedErrorList = cloneDeep(errorList);
    const _id = `flowActions,${TRIGGER_MAPPING},${path},${STATIC_VALUE}`;
    Object.keys(errorList).forEach((key) => {
      const index = key?.indexOf(_id);
      if (index === 0) {
        delete clonedErrorList[key];
      }
    });

    return clonedErrorList;
  };

  // Handler
  const onAddRow = (path) => {
    const clonedErrorList = cloneDeep(errorList);
    path = path.split(',');
    const isChild = path.includes(TABLE_COLUMN_MAPPING);
    const clonedMapping = cloneDeep(mappingData) || [];

    set(clonedMapping, path, {
      ...FIELD_MAPPING_ROW_INITIAL_STATE,
      path: path.join(),
    });
    if (isChild) {
      const parentPath = cloneDeep(path);
      (parentPath || []).splice(path.length - 1, 1);
      if (clonedErrorList?.[`flowActions,${TRIGGER_MAPPING},${parentPath.join()}`]) {
        delete clonedErrorList[`flowActions,${TRIGGER_MAPPING},${parentPath.join()}`];
      }
    } else if (clonedErrorList?.[`flowActions,${TRIGGER_MAPPING}`]) {
      unset(clonedErrorList, ['flowActions', TRIGGER_MAPPING]);
    }
    // Set Error List - clonedErrorList;
    onUpdateError?.(clonedErrorList);
    onChangeHandler?.(clonedMapping);
  };
  const onDelete = (path) => {
    path = path.split(',');
    const clonedMapping = cloneDeep(mappingData);
    set(clonedMapping, path, { is_deleted: true });
    if (path?.includes(TABLE_COLUMN_MAPPING)) {
      const childRowPath = cloneDeep(path);
      childRowPath.pop();
      const childRows = get(clonedMapping, childRowPath);
      const validRows = (childRows || []).filter((data) => !data.is_deleted);
      if (isEmpty(validRows)) {
        set(clonedMapping, childRowPath, []);
        let clonedErrorList = cloneDeep(errorList);
        childRowPath.pop();
        clonedErrorList = removeChildRowErrors(
          clonedErrorList,
          `flowActions,${TRIGGER_MAPPING},${childRowPath.join()}`,
        );
        // Set Error
        onUpdateError?.(clonedErrorList);
      }
    }
    onChangeHandler?.(clonedMapping);
  };

    /**
   * Handles the change event for a DATA_LIST field type.
   */
    const handleDataListChange = (event, updatedData) => {
      const { target } = event;
      const { removeDlValue } = target;
      const staticValue = updatedData?.STATIC_VALUE || [];

      if (removeDlValue) {
        const valueToRemove = target?.value;
        updatedData.STATIC_VALUE = staticValue.filter((value) => value !== valueToRemove);

        if (isEmpty(updatedData.STATIC_VALUE)) {
          updatedData.STATIC_VALUE = null;
        }
      } else {
        updatedData.STATIC_VALUE = [...staticValue, target];
      }
    };

    /**
     * Handles the change event for a USER_TEAM_PICKER field type.
     */
    const handleUserTeamPickerChange = (event, updatedData) => {
      const { target } = event;
      const { removeUserValue, value } = target;
      const staticValue = updatedData?.STATIC_VALUE ?? {};

      const pushToStaticValue = (teamOrUser) => {
        if (teamOrUser.is_user || (teamOrUser.user_type && !teamOrUser.is_user)) {
          if (!staticValue.users || !staticValue.users.some((user) => user._id === teamOrUser._id)) {
            updatedData.STATIC_VALUE.users = [...(updatedData.STATIC_VALUE.users || []), teamOrUser];
          }
        } else if (!staticValue.teams || !staticValue.teams.some((team) => team._id === teamOrUser._id)) {
            updatedData.STATIC_VALUE.teams = [...(updatedData.STATIC_VALUE.teams || []), teamOrUser];
          }
      };

      const removeProperty = (property, id) => {
        if (property) {
          property = property.filter((item) => item._id !== id);
          if (isEmpty(property)) {
            return undefined;
          }
        }
        return property;
      };

      if (value) {
        if (removeUserValue) {
          const id = value;

          updatedData.STATIC_VALUE.teams = removeProperty(staticValue.teams, id);
          updatedData.STATIC_VALUE.users = removeProperty(staticValue.users, id);
        } else {
          const teamOrUser = value;

          if (!staticValue) {
            updatedData.STATIC_VALUE = {};
          }

          pushToStaticValue(teamOrUser);
        }
      }
    };

    const handleNumberChange = (event, updatedData) => {
      const { value } = event.target;
      updatedData.STATIC_VALUE = value ? Number(value) : '';
    };

  /**
   * Handles the change event for a static value in a form.
   * Updates the value based on the type of the field and returns the updated value.
   */
  const onStaticValueChange = (event, rowData) => {
    const updatedData = cloneDeep(rowData) || {};

    if (!isEmpty(updatedData)) {
      const fieldType = updatedData?.FLOW_FIELD_TYPE;

      if (fieldType === FIELD_TYPE.DATA_LIST) {
        handleDataListChange(event, updatedData);
      } else if (fieldType === FIELD_TYPE.USER_TEAM_PICKER) {
        handleUserTeamPickerChange(event, updatedData);
      } else if (fieldType === FIELD_TYPE.NUMBER) {
        handleNumberChange(event, updatedData);
      }

      return updatedData?.STATIC_VALUE || event?.target?.value;
    }

    return EMPTY_STRING;
  };

  const onFieldChange = (event, path, type, allFieldsList) => {
    const pathArray = path.split(COMMA);
    const currentRowPath = `${TRIGGER_MAPPING},${pathArray.join()}`;

    const clonedMapping = cloneDeep(mappingData);
    const existingRowData = get(clonedMapping, pathArray, {});
    const updatedRowData = { ...existingRowData };
    let clonedErrorList = cloneDeep(errorList);

    const eventValue = event.target.value;

    if (type !== STATIC_VALUE) {
      updatedRowData[type] = eventValue;
    }

    const findSelectedField = () => allFieldsList.find(
      (field) => field.field_uuid === eventValue || field.table_uuid === eventValue,
    );

    const handleFlowFieldUuid = (selectedField) => {
      if (updatedRowData[VALUE_TYPE] === FLOW_ACTION_VALUE_TYPE.STATIC) {
        updatedRowData[STATIC_VALUE] = getInitialStaticValueByType(
          selectedField?.field_type,
          defaultCurrencyType,
        );
      }

      if (
        (FIELD_TYPE.FILE_UPLOAD === selectedField?.field_type ||
          (selectedField?.table_uuid && pathArray.length === 1)) &&
        updatedRowData[VALUE_TYPE] === FLOW_ACTION_VALUE_TYPE.STATIC
      ) {
        updatedRowData[VALUE_TYPE] = FLOW_ACTION_VALUE_TYPE.DYNAMIC;
        delete updatedRowData[STATIC_VALUE];
      }

      updatedRowData[FLOW_FIELD_DATA] = selectedField;
      updatedRowData[FLOW_FIELD_TYPE] = selectedField.field_type;

      unset(clonedErrorList, [`flowActions,${currentRowPath},${FLOW_FIELD_UUID}`]);
      unset(clonedErrorList, [`flowActions,${currentRowPath},${FLOW_TABLE_UUID}`]);
      unset(clonedErrorList, [`flowActions,${currentRowPath},${FLOW_FIELD_DATA}`]);

      if (selectedField?.table_uuid && pathArray.length === 1) {
        delete updatedRowData[FLOW_FIELD_UUID];
        updatedRowData[FLOW_FIELD_TYPE] = FIELD_TYPE.TABLE;
        updatedRowData[FLOW_FIELD_DATA] = {
          ...selectedField,
          field_type: FIELD_TYPE.TABLE,
        };
        if (existingRowData[FLOW_TABLE_UUID] !== eventValue) {
          updatedRowData[TABLE_COLUMN_MAPPING] = [];
          clonedErrorList = removeChildRowErrors(clonedErrorList, currentRowPath);
        }
        updatedRowData[FLOW_TABLE_UUID] = eventValue;
      } else {
        delete updatedRowData[FLOW_TABLE_UUID];
        delete updatedRowData[DATA_LIST_TABLE_UUID];
        delete updatedRowData[TABLE_COLUMN_MAPPING];
        clonedErrorList = removeChildRowErrors(clonedErrorList, currentRowPath);
      }

      clonedErrorList = clearAllStaticValueErrors(pathArray, clonedErrorList);
    };

    const handleDataListFieldUuid = (selectedField) => {
      if (isEmpty(selectedField)) {
        updatedRowData[VALUE_TYPE] = FLOW_ACTION_VALUE_TYPE.SYSTEM;
        selectedField = SYSTEM_FIELDS_FOR_AUTOMATION_SYSTEM?.find(
          (field) => field.value === eventValue,
        );
      }
      updatedRowData[DATA_LIST_FIELD_DATA] = selectedField;

      if (selectedField?.table_uuid && pathArray.length === 1) {
        delete updatedRowData[DATA_LIST_FIELD_UUID];
        updatedRowData[DATA_LIST_FIELD_TYPE] = FIELD_TYPE.TABLE;
        if (existingRowData[DATA_LIST_TABLE_UUID] !== eventValue) {
          updatedRowData[TABLE_COLUMN_MAPPING] = [];
          clonedErrorList = removeChildRowErrors(clonedErrorList, currentRowPath);
        }
        updatedRowData[DATA_LIST_TABLE_UUID] = eventValue;
      } else {
        updatedRowData[DATA_LIST_FIELD_TYPE] = getFieldType(selectedField);
      }
    };

    const handleValueType = () => {
      updatedRowData[DATA_LIST_FIELD_UUID] = null;
      delete updatedRowData[DATA_LIST_FIELD_TYPE];
      delete updatedRowData[DATA_LIST_FIELD_DATA];
      delete updatedRowData[DATA_LIST_TABLE_UUID];

      if (eventValue === FLOW_ACTION_VALUE_TYPE.STATIC) {
        delete updatedRowData[DATA_LIST_FIELD_UUID];
        if (!isEmpty(updatedRowData[FLOW_FIELD_TYPE])) {
          updatedRowData[STATIC_VALUE] = getInitialStaticValueByType(
            updatedRowData[FLOW_FIELD_TYPE],
            defaultCurrencyType,
          );
        }
      } else {
        delete updatedRowData[STATIC_VALUE];
        clonedErrorList = clearAllStaticValueErrors(pathArray, clonedErrorList);
      }
    };

    const handleStaticValue = () => {
      updatedRowData[STATIC_VALUE] = onStaticValueChange(event, updatedRowData);
      clonedErrorList = clearAllStaticValueErrors(pathArray, clonedErrorList);
    };

    let selectedField = null;
    switch (type) {
      case FLOW_FIELD_UUID:
        selectedField = findSelectedField();
        handleFlowFieldUuid(selectedField);
        break;
      case DATA_LIST_FIELD_UUID:
        selectedField = findSelectedField();
        handleDataListFieldUuid(selectedField);
        break;
      case VALUE_TYPE:
        handleValueType();
        break;
      case STATIC_VALUE:
        handleStaticValue();
        break;
      default:
        break;
    }

    if (
      !isEmpty(updatedRowData[DATA_LIST_FIELD_DATA]) &&
      !isEmpty(updatedRowData[FLOW_FIELD_DATA])
    ) {
      unset(clonedErrorList, [`flowActions,${currentRowPath},${type}`]);

      const fieldTypeErrors = validateMappingFieldTypes(
        {
          parentFlowField: updatedRowData[DATA_LIST_FIELD_DATA],
          parentFieldType: updatedRowData[DATA_LIST_FIELD_TYPE],
          childFlowField: updatedRowData[FLOW_FIELD_DATA],
          childFieldType: updatedRowData[FLOW_FIELD_TYPE],
          matchCategory: SEND_DATA_TO_DATALIST.FIELD_MATCH_CATEGORY,
        },
        t,
      );

      if (isEmpty(fieldTypeErrors)) {
        unset(clonedErrorList, [`flowActions,${currentRowPath},${FLOW_FIELD_UUID}`]);
        unset(clonedErrorList, [`flowActions,${currentRowPath},${DATA_LIST_FIELD_UUID}`]);
      } else {
        set(clonedErrorList, [`flowActions,${currentRowPath},${DATA_LIST_FIELD_UUID}`], fieldTypeErrors?.parentFieldTypeError);
        set(clonedErrorList, [`flowActions,${currentRowPath},${FLOW_FIELD_UUID}`], fieldTypeErrors?.childFieldTypeError);
      }
    }

    set(clonedMapping, pathArray, updatedRowData);

    // Update mapping state.
    onChangeHandler?.(clonedMapping);
    // Update error state.
    onUpdateError?.(clonedErrorList);
  };

  const onTriggerChangeHandler = ({ type, path, event, allFieldsList }) => {
    switch (type) {
      case DELETE:
        onDelete(path);
        break;
      case FLOW_FIELD_UUID:
      case DATA_LIST_FIELD_UUID:
      case VALUE_TYPE:
      case STATIC_VALUE:
        onFieldChange(event, path, type, allFieldsList);
        break;
      case defaultKeyLabels.addKey:
        onAddRow(path);
        break;
      default:
        break;
    }

    console.log('safkbaksjfl', event);
  };

  const renderAddMoreIcon = () => (
    <PlusAddIcon className={cx(style.Icon, gClasses.MY_AUTO)} />
  );

  return (
    <InputTreeLayout
      tableHeaders={TABLE_HEADERS}
      headerClassName={gClasses.Gap8}
      headerRowClass={style.InputTreeHeaderRow}
      innerTableClass={style.InputTreeInnerContainer}
      headerStyles={[
        style.FlowField,
        style.ValueBy,
        style.DlField,
        style.DeleteColumn,
      ]}
      data={mappingData}
      showAddMore={false}
      depth={0}
      maxDepth={1}
      AddMoreIcon={renderAddMoreIcon}
      parentDetails={{}}
      onChangeHandlers={onTriggerChangeHandler}
      RowComponent={AutomatedRowMapping}
      errorList={errorList}
      keyLabels={getDefaultKeyLabels(
        t,
        TABLE_COLUMN_MAPPING,
        FLOW_FIELD_TYPE,
        ADD_COLUMN,
        ADD_MORE_FIELDS,
      )}
      additionalRowComponentProps={{
        dataListFieldList: dataListFields,
        isDataListFieldListLoading: isDataListsFieldsLoading,
        flowFieldList: flowFields,
        isFlowFieldList: isFlowFieldsLoading,
        mappingData: mappingData,
        dataListId: null,
        allowedCurrencyList,
        defaultCurrencyType,
        defaultCountryCode,
        dataListUUID,
      }}
    />
  );
}

export default AutomatedTriggerFieldMapping;
AutomatedTriggerFieldMapping.propTypes = {
  metaData: PropTypes.shape({
    dataListId: PropTypes.string.isRequired,
    dataListUUID: PropTypes.string.isRequired,
  }).isRequired,
  flowId: PropTypes.string.isRequired,
  errorList: PropTypes.object.isRequired,
  mappingData: PropTypes.array.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  onUpdateError: PropTypes.func.isRequired,
};
