import i18next from 'i18next';
import { GET_TASK_CONFIG_CONSTANT, TASK_COMPONENT_CONFIG_KEYS } from './TaskConfiguration.constants';
import jsUtility from '../../../../utils/jsUtility';
import { GET_TASK_LIST_CONSTANTS } from '../../app_components/task_listing/TaskList.constants';

export const constructLabelForSelectedColumn = (selectedColumn = [], t = i18next.t) => {
  const { SORT_COLUMN_KEY_TO_OPTION_MAP } = GET_TASK_CONFIG_CONSTANT(t);
  const labelArray = [];
  if (jsUtility.isEmpty(selectedColumn)) return [];

  selectedColumn.forEach((eachColumnKey) => {
      const currentColumnLabel = jsUtility.get(SORT_COLUMN_KEY_TO_OPTION_MAP, [eachColumnKey], null)?.label;
      if (currentColumnLabel) labelArray.push(currentColumnLabel);
  });

  return labelArray;
};
export const constructFlowOrDataListLabel = (read_preference_data = {}) => {
   const data_list_metadata = jsUtility.get(read_preference_data, ['data_list_metadata'], []);
   const flow_metadata = jsUtility.get(read_preference_data, ['flow_metadata'], []);
   const labelArray = [];
   if (jsUtility.isEmpty(flow_metadata) && jsUtility.isEmpty(data_list_metadata)) return [];

   flow_metadata.forEach((each_flow) => {
    const currentFlow = jsUtility.pick(each_flow, ['flow_name', 'flow_uuid'], null);
    if (!jsUtility.isEmpty(currentFlow)) {
        labelArray.push({
              label: currentFlow?.flow_name,
              value: currentFlow?.flow_uuid,
              type: 'flow',
            });
      }
   });

   data_list_metadata.forEach((each_dl) => {
    const currentDl = jsUtility.pick(each_dl, ['data_list_name', 'data_list_uuid'], null);
    if (!jsUtility.isEmpty(currentDl)) {
      labelArray.push({
            label: currentDl?.data_list_name,
            value: currentDl?.data_list_uuid,
            type: 'datalist',
          });
    }
   });
   return labelArray;
};

export const getFlowOrDataListObjectBasedOnType = (key, label, value) => {
  if (![TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS, TASK_COMPONENT_CONFIG_KEYS.DATA_LISTS_UUIDS].includes(key)) return {};
  return {
    label,
    value,
    type: (key === TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS) ? 'flow' : 'datalist',
   };
};

export const getUUIDfromMetadata = (read_preference_data) => {
  const data_list_metadata = jsUtility.get(read_preference_data, ['data_list_metadata'], []);
  const flow_metadata = jsUtility.get(read_preference_data, ['flow_metadata'], []);

  const flow_uuids = [];
  const data_list_uuids = [];

  flow_metadata.forEach((each_flow) => flow_uuids.push(each_flow?.flow_uuid));
  data_list_metadata.forEach((each_dl) => data_list_uuids.push(each_dl?.data_list_uuid));

  return { flow_uuids, data_list_uuids };
};

export const sortColumns = (selected_column = []) => {
  const { ALL_COLUMN_LIST } = GET_TASK_LIST_CONSTANTS(i18next.t);
  const customObject = {
    [ALL_COLUMN_LIST.TASK_NAME.value]: ALL_COLUMN_LIST.TASK_NAME,
    [ALL_COLUMN_LIST.CREATED_BY.value]: ALL_COLUMN_LIST.CREATED_BY,
    [ALL_COLUMN_LIST.ASSIGNED_TO.value]: ALL_COLUMN_LIST.ASSIGNED_TO,
    [ALL_COLUMN_LIST.ASSIGNED_ON.value]: ALL_COLUMN_LIST.ASSIGNED_ON,
    [ALL_COLUMN_LIST.COMPLETED_ON.value]: ALL_COLUMN_LIST.COMPLETED_ON,
    [ALL_COLUMN_LIST.DUE_DATE.value]: ALL_COLUMN_LIST.DUE_DATE,
  };
  const baseSortOrder = Object.values(customObject).map((column) => column.value);
  const sortedData = selected_column.sort((a, b) => {
        const indexOfA = baseSortOrder.indexOf(a);
        const indexOfB = baseSortOrder.indexOf(b);

        return indexOfA - indexOfB;
  });

  const label = [];
  const value = [];
  if (Array.isArray(sortedData)) {
    sortedData.forEach((eachValue) => {
      const column = customObject[eachValue];
      label.push(column.label);
      value.push(column.value);
    });
  }

  return {
    label,
    value,
  };
};
