import { CREATE_SEARCH_PARAMS, HOME } from '../../../../urls/RouteConstants';
import { translateFunction } from '../../../../utils/jsUtility';
import { getDevRoutePath } from '../../../../utils/UtilityFunctions';

export const CREATE_APP_INSTRUCTION = {
    ID: 'create_app_instruction',
    HEADER: 'app_strings.create_app_instruction.header',
    DL_TITLE: 'configuration_strings.all_labels.data_list',
    DL_INFO: 'app_strings.create_app_instruction.dl_info',
    CREATE_DL_LINK: 'side_nav_bar.create_datalist',
    FLOW_TITLE: 'create_dashboard_strings.flow',
    FLOW_INFO: 'app_strings.create_app_instruction.flow_info',
    CREATE_FLOW_LINK: 'side_nav_bar.create_flow',
    SKIP_BTN_LABEL: 'button_labels.skip',
};

export const APP_INSTRUCTION_LIST = (t = translateFunction) => [
    {
        COMPONENT_TITLE: t('configuration_strings.all_labels.data_list'),
        COMPONENT_INFO: t('app_strings.create_app_instruction.dl_info'),
        CREATE_LINK_TEXT: t('side_nav_bar.create_datalist'),
        CREATE_LINK: `${getDevRoutePath(HOME)}?${new URLSearchParams({ create: CREATE_SEARCH_PARAMS.DATALITS }).toString()}`,
    },
    {
        COMPONENT_TITLE: t('create_dashboard_strings.flow'),
        COMPONENT_INFO: t('app_strings.create_app_instruction.flow_info'),
        CREATE_LINK_TEXT: t('side_nav_bar.create_flow'),
        CREATE_LINK: `${getDevRoutePath(HOME)}?${new URLSearchParams({ create: CREATE_SEARCH_PARAMS.FLOW }).toString()}`,
    },
];
