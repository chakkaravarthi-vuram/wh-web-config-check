import { isEmpty, get } from '../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

export const getComponentInfoErrorMessage = (error_list = {}, key = EMPTY_STRING) => {
   if (isEmpty(error_list) || isEmpty(key)) return EMPTY_STRING;

   const error_key = `component_info,${key}`;
   console.log('jhsdvbkjfl', error_key);
   return get(error_list, [error_key], EMPTY_STRING);
};

export const getReportData = (read_preference_data = {}) => {
  const report_metadata = get(read_preference_data, ['report_metadata'], []);
  return get(report_metadata, [0], {}) || {};
};

export const getDashboardSourceData = (source_uuid = null, read_preference_data = {}) => {
  const flow_metadata = get(read_preference_data, ['flow_metadata'], []) || [];
  const data_list_metadata = get(read_preference_data, ['data_list_metadata'], []) || [];
  let source_data = {};
  if (!isEmpty(flow_metadata)) {
     const data = flow_metadata.find((flow) => flow.flow_uuid === source_uuid);

     if (data) {
      source_data = {
         _id: data?._id,
         label: data?.flow_name,
         uuid: data?.flow_uuid,
      };
    }
  }
  if (!isEmpty(data_list_metadata)) {
   const data = data_list_metadata.find((data_list) => data_list.data_list_uuid === source_uuid);

    if (data) {
      source_data = {
         _id: data?._id,
         label: data?.data_list_name,
         uuid: data?.data_list_uuid,
      };
   }
  }
  return source_data;
};

export const APP_CONFIG_HEADERS = {
   TASK: 'app_config_headers.task',
   LINK: 'app_config_headers.link',
   DASHBOARD: 'app_config_headers.dashboard',
   IMAGE: 'app_config_headers.image',
   TEXT: 'app_config_headers.text',
   REPORTS: 'app_config_headers.reports',
   WEBPAGE_EMBED: 'app_config_headers.webpage_embed',
};

export const DELETE_COMPONENT_LABEL = 'app_strings.delete_component';
export const BUTTONS = {
   CANCEL: 'app_strings.cancel',
   APPLY: 'app_strings.apply',
   SAVE: 'parallel_step_config.footer.save',
};
