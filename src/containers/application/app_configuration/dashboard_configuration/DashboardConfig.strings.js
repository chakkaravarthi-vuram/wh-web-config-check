import { translateFunction } from '../../../../utils/jsUtility';
import { APP_CONFIGURATION_DASHBOARD_TYPE } from '../AppConfiguration.constants';

export const TYPE_OPTION_LIST = (t = translateFunction) => [
  {
    label: t('create_dashboard_strings.flow'),
    value: APP_CONFIGURATION_DASHBOARD_TYPE.FLOW,
    isCheck: false,
  },
  {
    label: t('app_strings.validation.datalist'),
    value: APP_CONFIGURATION_DASHBOARD_TYPE.DATA_LIST,
    isCheck: false,
  },
];

export const NO_DATA_FOUND_STRINGS = (t) => {
  return {
    NO_FLOWS_FOUND: t('app_strings.flow_dashboard.empty_message'),
    NO_DATALISTS_FOUND: t('app_strings.dl_dashboard.empty_message'),
  };
};
