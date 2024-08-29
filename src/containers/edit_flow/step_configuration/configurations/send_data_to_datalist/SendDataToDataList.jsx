import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import {
  ETextSize,
  InputTreeLayout,
  MultiDropdown,
  RadioGroup,
  SingleDropdown,
  Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { cloneDeep, isEmpty, has, get, set, unset, isArray, remove, uniqBy, find } from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import useApiCall from 'hooks/useApiCall';
import { getAllViewDataList } from 'axios/apiService/dataList.apiService';
import { getAllDataListFields } from 'axios/apiService/form.apiService';
import { FIELD_LIST_TYPE, FIELD_TYPE, FIELD_LIST_KEYS } from 'utils/constants/form.constant';
import {
  getDatalistSuggetion, getFormFieldOptionList,
  deleteEntryActionRelatedValidation,
  INITIAL_MAPPING_DATA_FLOW_TO_DL,
  NUMBER_FIELDS_WITH_MULTIPLE_OPERATION,
  getInitialStaticValueByType,
} from '../Configuration.utils';
import { getActionsListFromUtils } from '../send_email/SendEmail.utils';
import { SEND_DATA_TO_DATALIST_STRINGS } from '../Configuration.strings';
import styles from './SendDataToDataList.module.scss';
import PlusIcon from '../../../../../assets/icons/PlusIcon';
import { getDefaultKeyLabels } from '../../../../integration/Integration.utils';
import MappingRow from './RowComponent';
import { apiGetAllFieldsList } from '../../../../../axios/apiService/flow.apiService';
import { validateMappingFieldTypes } from '../../StepConfiguration.validations';

import { ACTION_TYPE_OPTIONS, ENTRY_ACTION_TYPE, SEND_DATA_TO_DATALIST, SEND_DATA_TO_DL_OPERANDS, SYSTEM_FIELDS_FOR_FLOW_DL_MAPPING } from '../Configuration.constants';
import { MAX_PAGINATION_SIZE } from '../../../../../utils/constants/form.constant';
import { getFieldType } from '../../StepConfiguration.utils';
import { getAccountConfigurationDetailsApiService } from '../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';

const cancelDataListFieldToken = {
  cancelToken: null,
};
const setDataListFieldCancelToken = (c) => { cancelDataListFieldToken.cancelToken = c; };

function SendDataToDataList(props) {
  const { stepData, onFlowStateChange } = props;
  const { flowData: { flow_id } } = cloneDeep(props);
  const {
    data_list_mapping_error_list = {},
    actions,
    active_data_list_mapping: {
      action_uuid = null,
      data_list_uuid = null,
      data_list_name,
      data_list_entry_action_type = null,
      entry_id_from_value = null,
      entryIdLabel,
      is_system_defined = false,
      system_defined_name = EMPTY_STRING,
      mapping = [],
      selectedActionLabels = [],
    },
    is_initiation,
  } = stepData;

  const { t } = useTranslation();
  const [dataListSearchText, setDataListSearchText] = useState(EMPTY_STRING);
  const [selectedDLFields, setSelectedDLFields] = useState([]);
  const [systemDefinedName, setSystemDefinedName] = useState(system_defined_name);
  const [isSystemDefined, setIsSystemDefined] = useState(is_system_defined);
  const [allowedCurrencyList, setAllowedCurrencyList] = useState([]);
  const [defaultCurrencyType, setDefaultCurrencyType] = useState(EMPTY_STRING);
  const { FIELD_KEYS } = SEND_DATA_TO_DATALIST;
  const { ALL_LABELS } = SEND_DATA_TO_DATALIST_STRINGS;

  const TABLE_HEADERS = [
    t(ALL_LABELS.CHOOSE_DATALIST_FIELD),
    t(ALL_LABELS.OPERATION),
    t(ALL_LABELS.VALUE_TYPE),
    t(ALL_LABELS.VALUE),
    EMPTY_STRING,
  ];
  // Data List Reducer
  const { data: allDataList, fetch: dataListFetch, clearData: clearDataList, isLoading: isDataListsLoading, hasMore: hasMoreDataList, page: dataListCurrentPage } = useApiCall({}, true);
  // Data List Field Reducer
  const { data: dataListFields, fetch: dataListFieldFetch, clearData: clearDataListFields, isLoading: isDataListsFieldsLoading } = useApiCall({}, true);
  // Flow field reducer
  const { data: flowFields, fetch: flowFieldFetch, clearData: clearFlowFields, isLoading: isFlowFieldsLoading } = useApiCall({}, true);

  const updateSelectedDLFieldsList = (mappingCloned = mapping) => {
    const selectedDLFieldsList = [];
    mappingCloned.forEach((mappingRowData) => {
      selectedDLFieldsList.push({
        path: mappingRowData.path,
        value: mappingRowData.data_list_field_uuid || mappingRowData.data_list_table_uuid,
      });
      if (mappingRowData?.[FIELD_KEYS.TABLE_COLUMN_MAPPING]) {
        mappingRowData[FIELD_KEYS.TABLE_COLUMN_MAPPING].forEach((childRow) => {
          selectedDLFieldsList.push({
            path: childRow.path,
            value: childRow.data_list_field_uuid,
          });
        });
      }
    });
    setSelectedDLFields(selectedDLFieldsList);
  };

  useEffect(() => {
    updateSelectedDLFieldsList();
  }, []);

  useEffect(() => {
    const flowFieldsParam = {
      page: 1,
      size: 1000,
      flow_id: flow_id,
      ignore_field_types: [FIELD_TYPE.INFORMATION],
      include_property_picker: 1,
    };
    flowFieldFetch(apiGetAllFieldsList(flowFieldsParam));
    return () => {
      clearFlowFields();
    };
  }, [flowFieldFetch, flow_id]);

  useEffect(() => {
    getAccountConfigurationDetailsApiService().then(
      (response) => {
        if (
          response.allowed_currency_types
        ) {
          setAllowedCurrencyList(response.allowed_currency_types);
          setDefaultCurrencyType(response.default_currency_type || '');
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  const loadDataLists = () => {
    setDataListSearchText(EMPTY_STRING);
    const dataListParams = {
      page: 1,
      size: MAX_PAGINATION_SIZE,
      include_system_data_list: 1,
    };
    clearDataList({ data: [], paginationDetails: {} });
    dataListFetch(getAllViewDataList(dataListParams, null));
  };

  useEffect(() => {
    if (data_list_entry_action_type !== ENTRY_ACTION_TYPE.DELETE && data_list_uuid) {
      const params = {
        page: 1,
        size: 1000,
        data_list_uuids: [data_list_uuid],
        is_edit_add_only: (isSystemDefined && (systemDefinedName === FIELD_LIST_KEYS.USERS) && data_list_entry_action_type === ENTRY_ACTION_TYPE.UPDATE) ? 0 : null,
        ignore_field_types: [FIELD_TYPE.INFORMATION],
      };
      dataListFieldFetch(getAllDataListFields(params, setDataListFieldCancelToken));
    }
    return () => {
      clearDataListFields();
    };
  }, [dataListFieldFetch, data_list_uuid, data_list_entry_action_type]);

  const onSearchDataList = (event) => {
    const dataListParams = {
      page: 1,
      size: MAX_PAGINATION_SIZE,
      include_system_data_list: 1,
      search: event.target.value,
    };
    if (isEmpty(dataListParams.search)) delete dataListParams.search;
    clearDataList({ data: [], paginationDetails: {} });
    dataListFetch(getAllViewDataList(dataListParams, null));
    setDataListSearchText(event.target.value);
  };

  const loadMoreDataList = () => {
    const dataListParams = {
      page: dataListCurrentPage + 1,
      size: MAX_PAGINATION_SIZE,
      include_system_data_list: 1,
      search: dataListSearchText,
    };
    if (isEmpty(dataListParams.search)) delete dataListParams.search;
    dataListFetch(getAllViewDataList(dataListParams));
  };

  const onConfigInputChangeHandlers = (id, value, list, label) => {
    const activeStepDetails = cloneDeep(stepData);
    const activeMapping = get(activeStepDetails, ['active_data_list_mapping']) || {};
    let updatedValue = value;
    let errorIdList = [id];
    switch (id) {
      case FIELD_KEYS.ACTION_UUID:
        updatedValue = activeMapping?.[id] || [];
        const selectedLabel = activeMapping?.selectedActionLabels || [];
        const index = updatedValue.findIndex((action) => action === value);
        if (index > -1) {
          updatedValue.splice(index, 1);
          selectedLabel.splice(index, 1);
        } else {
          updatedValue.push(value);
          selectedLabel.push(label);
        }
        activeMapping.selectedActionLabels = selectedLabel;
        break;
      case FIELD_KEYS.DATA_LIST_UUID:
        if ((activeMapping[id] !== updatedValue) && (activeMapping[FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE] !== ENTRY_ACTION_TYPE.DELETE)) {
          activeMapping[FIELD_KEYS.MAPPING] = [
            {
              ...INITIAL_MAPPING_DATA_FLOW_TO_DL,
              [FIELD_KEYS.OPERATION]: (activeMapping[FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE] === ENTRY_ACTION_TYPE.AUTO) ? SEND_DATA_TO_DL_OPERANDS.EQUAL_TO : null,
            },
          ];
          setSelectedDLFields([]);
        }
        if ([ENTRY_ACTION_TYPE.DELETE, ENTRY_ACTION_TYPE.UPDATE].includes(activeMapping[FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE])) {
          activeMapping.entry_id_from_value = null;
          activeMapping.entryIdLabel = null;
        }
        const selectedOption = list.find((data) => data.value === value);
        if (!isEmpty(selectedOption)) {
          const { is_system_defined, system_defined_name } = selectedOption;
          setIsSystemDefined(is_system_defined);
          setSystemDefinedName(system_defined_name);
          activeMapping.data_list_name = selectedOption.label;
        }
        break;
      case FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE:
        if ([ENTRY_ACTION_TYPE.AUTO, ENTRY_ACTION_TYPE.UPDATE].includes(value)) {
          activeMapping[FIELD_KEYS.MAPPING] = [
            {
              ...INITIAL_MAPPING_DATA_FLOW_TO_DL,
              [FIELD_KEYS.OPERATION]: (value === ENTRY_ACTION_TYPE.AUTO) ? SEND_DATA_TO_DL_OPERANDS.EQUAL_TO : null,
            },
          ];
          setSelectedDLFields([]);
          if (value === ENTRY_ACTION_TYPE.AUTO) {
            if (has(activeMapping, [FIELD_KEYS.ENTRY_ID_FORM_VALUE], false)) delete activeMapping[FIELD_KEYS.ENTRY_ID_FORM_VALUE];
            if (has(activeMapping, [FIELD_KEYS.ENTRY_ID_FROM], false)) delete activeMapping[FIELD_KEYS.ENTRY_ID_FROM];
          } else {
            activeMapping[FIELD_KEYS.ENTRY_ID_FORM_VALUE] = null;
            activeMapping[FIELD_KEYS.ENTRY_ID_FROM] = SEND_DATA_TO_DATALIST.ENTRY_ID.FORM_FIELD;
            activeMapping.entryIdLabel = null;
          }
        } else if (value === ENTRY_ACTION_TYPE.DELETE) {
          if (has(activeMapping, [FIELD_KEYS.MAPPING], false)) delete activeMapping[FIELD_KEYS.MAPPING];
          activeMapping[FIELD_KEYS.ENTRY_ID_FORM_VALUE] = null;
          activeMapping.entryIdLabel = null;
        }
        errorIdList = data_list_mapping_error_list;
        break;
      case FIELD_KEYS.ENTRY_ID_FORM_VALUE:
        activeMapping.entryIdLabel = label;
        break;
      default:
        break;
    }
    activeMapping[id] = updatedValue;
    if (!isEmpty(data_list_mapping_error_list)) {
      set(activeStepDetails, ['data_list_mapping_error_list'], deleteEntryActionRelatedValidation(errorIdList));
    }
    set(activeStepDetails, ['active_data_list_mapping'], activeMapping);
    onFlowStateChange({ activeStepDetails });
  };

  const getErrorMessage = (_id, idk = -1) => {
    if (data_list_mapping_error_list && !isEmpty(data_list_mapping_error_list)) {
      if (([FIELD_KEYS.DATA_LIST_FIELD_UUID, FIELD_KEYS.FLOW_FIELD_UUID, FIELD_KEYS.OPERATION]).includes(_id) && idk >= 0) {
        return data_list_mapping_error_list[`${FIELD_KEYS.MAPPING},${idk},${_id}`];
      } else {
        if (
          (_id === FIELD_KEYS.DATA_LIST_UUID) &&
          !isEmpty(data_list_uuid) &&
          isEmpty(data_list_name)
        ) {
          return t(SEND_DATA_TO_DATALIST_STRINGS.ALL_LABELS.DATALIST_DELETED);
        }
        return data_list_mapping_error_list[_id];
      }
    }
    return null;
  };

  const removeChildRowErrors = (errorList, currentRowPath) => {
    const clonedErrorList = {};
    Object.keys(errorList)?.forEach((errorKey) => {
      if (errorKey && !errorKey.includes(`${currentRowPath},${FIELD_KEYS.TABLE_COLUMN_MAPPING}`)) {
        set(clonedErrorList, errorKey, errorList[errorKey]);
      }
    });
    return clonedErrorList;
  };

  const onDeleteClickHandler = (path) => {
    path = path.split(',');
    const activeStepDetails = cloneDeep(stepData);
    set(activeStepDetails, ['active_data_list_mapping', FIELD_KEYS.MAPPING, ...path], { is_deleted: true });
    if (path?.includes(FIELD_KEYS.TABLE_COLUMN_MAPPING)) {
      const childRowPath = cloneDeep(path);
      childRowPath.pop();
      const childRows = get(activeStepDetails, ['active_data_list_mapping', FIELD_KEYS.MAPPING, ...childRowPath]);
      const validRows = (childRows || []).filter((data) => !data.is_deleted);
      if (isEmpty(validRows)) {
        set(activeStepDetails, ['active_data_list_mapping', FIELD_KEYS.MAPPING, ...childRowPath], []);
        let clonedErrorList = cloneDeep(data_list_mapping_error_list);
        childRowPath.pop();
        clonedErrorList = removeChildRowErrors(clonedErrorList, `${FIELD_KEYS.MAPPING},${childRowPath.join()}`);
        set(activeStepDetails, ['data_list_mapping_error_list'], clonedErrorList);
      }
    }
    updateSelectedDLFieldsList(activeStepDetails?.active_data_list_mapping?.mapping || []);
    onFlowStateChange({ activeStepDetails });
  };

  const onChangeStaticValue = (event, updatedDataParam = {}) => {
    const updatedData = cloneDeep(updatedDataParam) || {};

    if (!isEmpty(updatedData)) {
      if (updatedData?.[FIELD_KEYS.DATA_LIST_FIELD_TYPE] === FIELD_TYPE.DATA_LIST) {
        if (event?.target?.removeDlValue) {
          if (
            isArray(updatedData?.[FIELD_KEYS.STATIC]) &&
            updatedData?.[FIELD_KEYS.STATIC].find((datalistValue) => datalistValue.value === event?.target?.value)
          ) {
            remove(updatedData?.[FIELD_KEYS.STATIC], { value: event?.target?.value });
            if (isEmpty(updatedData?.[FIELD_KEYS.STATIC])) updatedData[FIELD_KEYS.STATIC] = null;
          }
        } else {
          if (isArray(updatedData?.[FIELD_KEYS.STATIC])) {
            updatedData[FIELD_KEYS.STATIC] = uniqBy([...updatedData[FIELD_KEYS.STATIC], event?.target], (value) => value.value);
          } else updatedData[FIELD_KEYS.STATIC] = [event?.target];
        }

        return updatedData?.[FIELD_KEYS.STATIC];
      } else if (updatedData?.[FIELD_KEYS.DATA_LIST_FIELD_TYPE] === FIELD_TYPE.USER_TEAM_PICKER) {
        if (event?.target?.value) {
          if (event?.target?.removeUserValue) {
            const id = cloneDeep(event.target.value);
            if (updatedData?.[FIELD_KEYS.STATIC]?.teams) {
              if (find(updatedData?.[FIELD_KEYS.STATIC].teams, { _id: id })) {
                remove(updatedData?.[FIELD_KEYS.STATIC].teams, { _id: id });
                if (updatedData?.[FIELD_KEYS.STATIC].teams.length === 0) delete updatedData?.[FIELD_KEYS.STATIC].teams;
              }
            }
            if (updatedData?.[FIELD_KEYS.STATIC]?.users) {
              if (find(updatedData?.[FIELD_KEYS.STATIC].users, { _id: id })) {
                remove(updatedData?.[FIELD_KEYS.STATIC].users, { _id: id });
                if (updatedData?.[FIELD_KEYS.STATIC].users.length === 0) delete updatedData?.[FIELD_KEYS.STATIC].users;
              }
            }
          } else {
            const team_or_user = event.target.value;
            if (!updatedData?.[FIELD_KEYS.STATIC]) updatedData[FIELD_KEYS.STATIC] = {};
            if (team_or_user.is_user) {
              if (updatedData?.[FIELD_KEYS.STATIC]?.users) {
                if (!find(updatedData?.[FIELD_KEYS.STATIC].users, { _id: team_or_user._id })) updatedData?.[FIELD_KEYS.STATIC].users.push(team_or_user);
              } else {
                updatedData[FIELD_KEYS.STATIC].users = [];
                updatedData[FIELD_KEYS.STATIC].users.push(team_or_user);
              }
            } else if (!team_or_user.is_user) {
              if (team_or_user.user_type) {
                if (updatedData?.[FIELD_KEYS.STATIC] && updatedData?.[FIELD_KEYS.STATIC].users) {
                  if (!find(updatedData?.[FIELD_KEYS.STATIC].users, { _id: team_or_user._id })) updatedData?.[FIELD_KEYS.STATIC].users.push(team_or_user);
                } else {
                  updatedData[FIELD_KEYS.STATIC].users = [];
                  updatedData[FIELD_KEYS.STATIC].users.push(team_or_user);
                }
              } else {
                if (updatedData?.[FIELD_KEYS.STATIC] && updatedData?.[FIELD_KEYS.STATIC].teams) {
                  if (!find(updatedData?.[FIELD_KEYS.STATIC].teams, { _id: team_or_user._id })) updatedData?.[FIELD_KEYS.STATIC].teams.push(team_or_user);
                } else {
                  updatedData[FIELD_KEYS.STATIC].teams = [];
                  updatedData?.[FIELD_KEYS.STATIC].teams.push(team_or_user);
                }
              }
            }
          }
          return updatedData?.[FIELD_KEYS.STATIC];
        }
      }

      return event?.target?.value;
    }

    return EMPTY_STRING;
  };

  const clearAllStaticValueErrors = (errorList = {}, path) => {
    const clonedErrorList = cloneDeep(errorList);
    const _id = `${FIELD_KEYS.MAPPING},${path},${FIELD_KEYS.STATIC}`;
    Object.keys(errorList).forEach((key) => {
      const index = key?.indexOf(_id);
      if (index === 0) {
        delete clonedErrorList[key];
      }
    });

    return clonedErrorList;
  };

  const onFieldChangeHandler = (event, path, type, fieldsList) => {
    let selectedField;
    const allFields = fieldsList;
    path = path.split(',');
    const currentRowPath = `mapping,${path.join()}`;
    const activeStepDetails = cloneDeep(stepData);
    const mappingData = get(
      activeStepDetails,
      ['active_data_list_mapping', FIELD_KEYS.MAPPING, ...path],
      {},
    );
    const updatedData = cloneDeep(mappingData);
    let clonedErrorList = cloneDeep(data_list_mapping_error_list);

    if (type !== FIELD_KEYS.STATIC) {
      updatedData[type] = event.target.value;
    }

    if (type === FIELD_KEYS.FLOW_FIELD_UUID) {
      selectedField = allFields?.find(
        (field) =>
          (field.field_uuid === event.target.value) ||
          (field.table_uuid === event.target.value),
      );
      if (isEmpty(selectedField)) {
        updatedData[FIELD_KEYS.VALUE_TYPE] = 'system';
        selectedField = SYSTEM_FIELDS_FOR_FLOW_DL_MAPPING?.find((field) => field.value === event.target.value);
      }
      updatedData[FIELD_KEYS.FLOW_FIELD] = selectedField;
      if (selectedField.table_uuid && path.length === 1) {
        delete updatedData[FIELD_KEYS.FLOW_FIELD_UUID];
        updatedData[FIELD_KEYS.FLOW_FIELD_TYPE] = FIELD_LIST_TYPE.TABLE;
        if (mappingData[FIELD_KEYS.FLOW_TABLE_UUID] !== event.target.value) {
          updatedData[FIELD_KEYS.TABLE_COLUMN_MAPPING] = [];
          clonedErrorList = removeChildRowErrors(clonedErrorList, currentRowPath);
        }
        updatedData[FIELD_KEYS.FLOW_TABLE_UUID] = event.target.value;
      } else {
        updatedData[FIELD_KEYS.FLOW_FIELD_TYPE] = getFieldType(selectedField);
      }
    } else if (type === FIELD_KEYS.DATA_LIST_FIELD_UUID) {
      selectedField = allFields?.find(
        (field) =>
          field.field_uuid === event.target.value ||
          field.table_uuid === event.target.value,
      );

      if (
        updatedData[FIELD_KEYS.VALUE_TYPE] === FIELD_KEYS.STATIC
      ) {
        updatedData[FIELD_KEYS.STATIC] = getInitialStaticValueByType(selectedField?.field_type, defaultCurrencyType);
      }
      if (
        (
          FIELD_TYPE.FILE_UPLOAD === selectedField?.field_type ||
          (selectedField?.table_uuid && path?.length === 1)
        ) &&
        updatedData[FIELD_KEYS.VALUE_TYPE] === FIELD_KEYS.STATIC
      ) {
        updatedData[FIELD_KEYS.VALUE_TYPE] = FIELD_KEYS.DYNAMIC;
        delete updatedData[FIELD_KEYS.STATIC];
      }

      updatedData[FIELD_KEYS.DATA_LIST_FIELD] = selectedField;
      updatedData[FIELD_KEYS.DATA_LIST_FIELD_TYPE] = selectedField.field_type;
      unset(clonedErrorList, [`${currentRowPath},${FIELD_KEYS.DATA_LIST_FIELD_UUID}`]);
      unset(clonedErrorList, [`${currentRowPath},${FIELD_KEYS.DATA_LIST_FIELD}`]);
      unset(clonedErrorList, [`${currentRowPath},${FIELD_KEYS.DATA_LIST_TABLE_UUID}`]);
      if (selectedField.table_uuid && path.length === 1) {
        delete updatedData[FIELD_KEYS.DATA_LIST_FIELD_UUID];
        updatedData[FIELD_KEYS.DATA_LIST_FIELD_TYPE] = FIELD_LIST_TYPE.TABLE;
        updatedData[FIELD_KEYS.DATA_LIST_FIELD] = {
          ...selectedField,
          field_type: FIELD_LIST_TYPE.TABLE,
        };
        if (mappingData[FIELD_KEYS.DATA_LIST_TABLE_UUID] !== event.target.value) {
          updatedData[FIELD_KEYS.TABLE_COLUMN_MAPPING] = [];
          clonedErrorList = removeChildRowErrors(clonedErrorList, currentRowPath);
        }
        updatedData[FIELD_KEYS.DATA_LIST_TABLE_UUID] = event.target.value;
      } else {
        delete updatedData[FIELD_KEYS.DATA_LIST_TABLE_UUID];
        delete updatedData[FIELD_KEYS.FLOW_TABLE_UUID];
        delete updatedData[FIELD_KEYS.TABLE_COLUMN_MAPPING];
        clonedErrorList = removeChildRowErrors(clonedErrorList, currentRowPath);
      }
      if (
        (data_list_entry_action_type === ENTRY_ACTION_TYPE.UPDATE) &&
        (!NUMBER_FIELDS_WITH_MULTIPLE_OPERATION.includes(updatedData[FIELD_KEYS.DATA_LIST_FIELD_TYPE])) &&
        (updatedData[FIELD_KEYS.OPERATION] !== SEND_DATA_TO_DL_OPERANDS.EQUAL_TO)
      ) {
        updatedData[FIELD_KEYS.OPERATION] = (path.length > 1) ? SEND_DATA_TO_DL_OPERANDS.EQUAL_TO : null;
      }

      clonedErrorList = clearAllStaticValueErrors(clonedErrorList, path);
    } else if (type === FIELD_KEYS.VALUE_TYPE) {
      updatedData[FIELD_KEYS.FLOW_FIELD_UUID] = null;
      delete updatedData[FIELD_KEYS.FLOW_FIELD_TYPE];
      delete updatedData[FIELD_KEYS.FLOW_FIELD];
      delete updatedData[FIELD_KEYS.FLOW_TABLE_UUID];
      if (event.target.value === FIELD_KEYS.STATIC) {
        delete updatedData[FIELD_KEYS.FLOW_FIELD_UUID];
        if (!isEmpty(updatedData[FIELD_KEYS.DATA_LIST_FIELD_TYPE])) {
          updatedData[FIELD_KEYS.STATIC] = getInitialStaticValueByType(updatedData[FIELD_KEYS.DATA_LIST_FIELD_TYPE], defaultCurrencyType);
        }
      } else {
        delete updatedData[FIELD_KEYS.STATIC];
        clonedErrorList = clearAllStaticValueErrors(clonedErrorList, path);
      }
    } else if (type === FIELD_KEYS.STATIC) {
      updatedData[FIELD_KEYS.STATIC] = onChangeStaticValue(event, updatedData);
      clonedErrorList = clearAllStaticValueErrors(clonedErrorList, path);
    }

    if (!isEmpty(updatedData[FIELD_KEYS.DATA_LIST_FIELD]) && !isEmpty(updatedData[FIELD_KEYS.FLOW_FIELD])) {
      const fieldTypeErrors = validateMappingFieldTypes({
        parentFlowField: updatedData[FIELD_KEYS.DATA_LIST_FIELD],
        parentFieldType: updatedData[FIELD_KEYS.DATA_LIST_FIELD_TYPE],
        childFlowField: updatedData[FIELD_KEYS.FLOW_FIELD],
        childFieldType: updatedData[FIELD_KEYS.FLOW_FIELD_TYPE],
        matchCategory: SEND_DATA_TO_DATALIST.FIELD_MATCH_CATEGORY,
      }, t);
      if (isEmpty(fieldTypeErrors)) {
        unset(clonedErrorList, [`${currentRowPath},${FIELD_KEYS.DATA_LIST_FIELD_TYPE}`]);
        unset(clonedErrorList, [`${currentRowPath},${FIELD_KEYS.FLOW_FIELD_TYPE}`]);
      } else {
        set(clonedErrorList, [`${currentRowPath},${FIELD_KEYS.DATA_LIST_FIELD_TYPE}`], fieldTypeErrors?.parentFieldTypeError);
        set(clonedErrorList, [`${currentRowPath},${FIELD_KEYS.FLOW_FIELD_TYPE}`], fieldTypeErrors?.childFieldTypeError);
      }
    }
    if (updatedData[FIELD_KEYS.DATA_LIST_TABLE_UUID]) {
      if (updatedData[FIELD_KEYS.FLOW_TABLE_UUID]) {
        updatedData[FIELD_KEYS.MAPPING_TYPE] = FIELD_KEYS.TABLE_TO_TABLE_MAPPING_TYPE;
      } else updatedData[FIELD_KEYS.MAPPING_TYPE] = FIELD_KEYS.DIRECT_TO_TABLE_MAPPING_TYPE;
    } else updatedData[FIELD_KEYS.MAPPING_TYPE] = FIELD_KEYS.DIRECT_MAPPING_TYPE;

    if (path.includes(FIELD_KEYS.TABLE_COLUMN_MAPPING)) {
      updatedData[FIELD_KEYS.UPDATE_TYPE] = FIELD_KEYS.ADD_NEW_ROW;
    }

    if (has(clonedErrorList, [`${currentRowPath},${type}`])) {
      unset(clonedErrorList, [`${currentRowPath},${type}`]);
    }
    set(
      activeStepDetails,
      ['active_data_list_mapping', FIELD_KEYS.MAPPING, ...path],
      {
        ...updatedData,
      },
    );
    set(activeStepDetails, ['data_list_mapping_error_list'], clonedErrorList);
    updateSelectedDLFieldsList(activeStepDetails?.active_data_list_mapping?.mapping || []);
    onFlowStateChange({ activeStepDetails });
  };

  const onAddNewRow = (path) => {
    const activeStepDetails = cloneDeep(stepData);
    const clonedErrorList = cloneDeep(data_list_mapping_error_list);
    path = path.split(',');
    const isChild = path.includes(FIELD_KEYS.TABLE_COLUMN_MAPPING);
    set(
      activeStepDetails,
      ['active_data_list_mapping', FIELD_KEYS.MAPPING, ...path],
      {
        ...INITIAL_MAPPING_DATA_FLOW_TO_DL,
        [FIELD_KEYS.OPERATION]: (data_list_entry_action_type === ENTRY_ACTION_TYPE.AUTO) ? SEND_DATA_TO_DL_OPERANDS.EQUAL_TO : null,
        [FIELD_KEYS.MAPPING_TYPE]: FIELD_KEYS.DIRECT_MAPPING_TYPE,
        path: path.join(),
        [FIELD_KEYS.MAPPING_ORDER]: path[path.length - 1],
      },
    );
    if (isChild) {
      const parentPath = cloneDeep(path);
      (parentPath || []).splice(path.length - 1, 1);
      if (clonedErrorList?.[`${FIELD_KEYS.MAPPING},${parentPath.join()}`]) {
        delete clonedErrorList[`${FIELD_KEYS.MAPPING},${parentPath.join()}`];
      }
    } else if (clonedErrorList?.[FIELD_KEYS.MAPPING]) {
      unset(clonedErrorList, [FIELD_KEYS.MAPPING]);
    }
    set(activeStepDetails, ['data_list_mapping_error_list'], clonedErrorList);
    onFlowStateChange({ activeStepDetails });
  };

  const onChangeHandlers = ({ type, path, event, allFieldsList }) => {
    switch (type) {
      case FIELD_KEYS.DELETE:
        return onDeleteClickHandler(path);
      case FIELD_KEYS.DATA_LIST_FIELD_UUID:
      case FIELD_KEYS.FLOW_FIELD_UUID:
      case FIELD_KEYS.OPERATION:
      case FIELD_KEYS.VALUE_TYPE:
      case FIELD_KEYS.STATIC:
        return onFieldChangeHandler(event, path, type, allFieldsList);
      case 'add_more_child':
        return onAddNewRow(path);
      default:
        break;
    }
    return null;
  };

  const mappingSection = (([ENTRY_ACTION_TYPE.AUTO, ENTRY_ACTION_TYPE.UPDATE].includes(data_list_entry_action_type)) ?
    (
      <div>
        <InputTreeLayout
          tableHeaders={TABLE_HEADERS}
          headerClassName={cx(styles.TableHeader)}
          headerStyles={[styles.DataListField, styles.OperatorField, styles.ValueField, styles.FlowField, styles.DeleteColumn]}
          data={mapping || []}
          showAddMore={false}
          depth={0}
          maxDepth={1}
          AddMoreIcon={() => <PlusIcon className={cx(styles.Icon, gClasses.MY_AUTO)} />}
          parentDetails={{}}
          onChangeHandlers={onChangeHandlers}
          RowComponent={MappingRow}
          errorList={data_list_mapping_error_list}
          keyLabels={getDefaultKeyLabels(t, FIELD_KEYS.TABLE_COLUMN_MAPPING, FIELD_KEYS.DATA_LIST_FIELD_TYPE, null, null, true)}
          additionalRowComponentProps={{
            allDataListFields: dataListFields,
            isLoadingDataListFields: isDataListsFieldsLoading,
            allflowFields: flowFields,
            isLoadingFlowFields: isFlowFieldsLoading,
            entryActionType: data_list_entry_action_type,
            isDataListSelected: !isEmpty(data_list_uuid),
            mappingData: mapping || [],
            selectedDLFields,
            staticValueParentId: flow_id,
            allowedCurrencyList,
            defaultCurrencyType,
          }}
        />
        <Text content={data_list_mapping_error_list?.[FIELD_KEYS.MAPPING]} size={ETextSize.XS} className={gClasses.red22} />
      </div>
    ) :
    null
  );

  const radioInstruction = (data_list_entry_action_type === ENTRY_ACTION_TYPE.AUTO ? (
    <Text
      className={cx(
        gClasses.FTwo12GrayV9,
        gClasses.MT10,
      )}
      content={t(ALL_LABELS.AUTO_TYPE_INSTRUCTION)}
    />
  ) : null);

  const formFields = (([ENTRY_ACTION_TYPE.UPDATE, ENTRY_ACTION_TYPE.DELETE].includes(data_list_entry_action_type)) ?
    (
      <SingleDropdown
        id={FIELD_KEYS.ENTRY_ID_FORM_VALUE}
        dropdownViewProps={{
          labelName: t(ALL_LABELS.CHOOSE_FORM_FIELD),
          selectedLabel: entryIdLabel,
        }}
        optionList={getFormFieldOptionList(flowFields, (isSystemDefined && (systemDefinedName === FIELD_LIST_KEYS.USERS)) ? FIELD_TYPE.USER_TEAM_PICKER : FIELD_TYPE.DATA_LIST)}
        selectedValue={entry_id_from_value}
        placeholder={t(ALL_LABELS.CHOOSE_FORM_FIELD)}
        onClick={(value, label, list) => onConfigInputChangeHandlers(FIELD_KEYS.ENTRY_ID_FORM_VALUE, value, list, label)}
        errorMessage={getErrorMessage(FIELD_KEYS.ENTRY_ID_FORM_VALUE)}
        isLoadingOptions={isFlowFieldsLoading}
      />
    ) : null);

  return (
    <div className={cx(gClasses.DisplayFlex, gClasses.FlexDirectionColumn, gClasses.gap24)}>
      <Text content={t(ALL_LABELS.CONDITION_AND_DATALIST)} size={ETextSize.LG} />
      <div className={styles.ChooseSource}>
        <MultiDropdown
          id={FIELD_KEYS.ACTION_UUID}
          dropdownViewProps={{
            labelName: t(ALL_LABELS.BUTTON_ACTION_FIELD),
            selectedLabel: selectedActionLabels.join(', '),
            placeholder: t(ALL_LABELS.CHOOSE_ACTION_BUTTON),
            errorMessage: getErrorMessage(FIELD_KEYS.ACTION_UUID),
          }}
          optionList={getActionsListFromUtils(actions, is_initiation)}
          onClick={(value, label) => onConfigInputChangeHandlers(FIELD_KEYS.ACTION_UUID, value, [], label)}
          selectedListValue={action_uuid}
          required
        />
        <SingleDropdown
          id={FIELD_KEYS.DATA_LIST_UUID}
          dropdownViewProps={{
            labelName: t(ALL_LABELS.CHOOSE_DATALIST),
            selectedLabel: data_list_name,
            onClick: loadDataLists,
            onKeyDown: loadDataLists,
          }}
          optionList={getDatalistSuggetion(allDataList)}
          onClick={(value, label, list) => onConfigInputChangeHandlers(FIELD_KEYS.DATA_LIST_UUID, value, list)}
          selectedValue={data_list_uuid}
          placeholder={t(ALL_LABELS.CHOOSE_DATALIST)}
          errorMessage={getErrorMessage(FIELD_KEYS.DATA_LIST_UUID)}
          className={gClasses.MB15}
          required
          isLoadingOptions={isDataListsLoading}
          searchProps={{
            searchPlaceholder: t(ALL_LABELS.CHOOSE_DATALIST),
            searchValue: dataListSearchText,
            onChangeSearch: onSearchDataList,
          }}
          infiniteScrollProps={{
            dataLength: allDataList?.length || MAX_PAGINATION_SIZE,
            next: loadMoreDataList,
            hasMore: hasMoreDataList,
            scrollableId: `scrollable-${FIELD_KEYS.DATA_LIST_UUID}`,
          }}
        />
      </div>
      <RadioGroup
        id={FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE}
        labelText={t(ALL_LABELS.CHOOSE_ACTION_TYPE)}
        selectedValue={data_list_entry_action_type}
        options={ACTION_TYPE_OPTIONS(t)}
        onChange={(event, id, value) => onConfigInputChangeHandlers(FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE, value)}
        errorMessage={getErrorMessage(FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE)}
      />
      {radioInstruction}
      {formFields}
      {mappingSection}
    </div>
  );
}

export default SendDataToDataList;

SendDataToDataList.defaultProps = {
  onFlowDataChange: null,
};
SendDataToDataList.propTypes = {
  onFlowDataChange: PropTypes.func,
};
