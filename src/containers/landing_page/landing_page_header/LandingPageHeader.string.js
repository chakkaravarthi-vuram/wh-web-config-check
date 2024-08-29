import {
    ALL_PUBLISHED_FLOWS, FLOW_DRAFT_MANAGED_BY_YOU, LIST_FLOW,
    DATALIST_OVERVIEW, LIST_DATA_LIST, MY_DRAFT_DATALIST, MY_PUBLISHED_DATALIST,
    PUBLISHED_REPORT_LIST, TASKS,
} from '../../../urls/RouteConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import ADMIN_ACCOUNTS_STRINGS from '../../admin_panel/admin_pages/AdminPages.string';
import { ADMIN_SETTINGS_CONSTANT } from '../../admin_settings/AdminSettings.constant';
import { TASK_LIST_TYPE } from '../../application/app_components/task_listing/TaskList.constants';
import { INTEGRATION_LIST_HEADERS } from '../../integration/Integration.strings';
import { AI_ASSIST_TYPE } from './landing_page_ai_assist/AiAssist.constants';

export const LANDING_PAGE_HEADER_CONSTANT = (t) => {
    return {
        COMMON: {
            TAB_INDEX: 'tab_index',
            QUERY: 'query',
            NOTIFICATION: 'notifications',
            SEARCH_BAR: 'Search bar',
            NINE_PLUS: '9+',
            BACK_TO: 'Back to',
            SORT_BY_LABEL: t('landing_page_header.common.sort_by'),
        },
        APPS: {
            title: t('landing_page_header.app.title'),
            type: 'APPS',
            description: t('app_strings.create_modal.apps.description'),
            hideSubHeader: false,
            aiAssistType: AI_ASSIST_TYPE.APP,
            aiAssistButtonText: t('landing_page_header.ai_prompt.button.app'),
            tabOptions: [
                {
                    labelText: t('app_strings.app_listing.publised'),
                    value: 0,
                    tabIndex: 0,
                },
                {
                    labelText: t('app_strings.app_listing.draft'),
                    value: 1,
                    tabIndex: 1,
                },
            ],
            actionButtonText: t('landing_page_header.app.create_button'),
            actionButtonSearchParam: 'app',
        },
        TASKS: {
            title: t('landing_page_header.tasks.title'),
            type: 'TASKS',
            description: t('app_strings.create_modal.task.description'),
            hideSubHeader: false,
            aiAssistType: AI_ASSIST_TYPE.TASK,
            aiAssistButtonText: t('landing_page_header.ai_prompt.button.task'),
            tabOptions: [
                {
                    labelText: t('task_content.landing_page.task_info.task_type.my_tasks'),
                    value: 1,
                    tabIndex: 1,
                    route: `${TASKS}/${TASK_LIST_TYPE.OPEN}`,
                },
                {
                    labelText: t('task_content.landing_page.task_info.task_type.assigned_to_others'),
                    value: 3,
                    tabIndex: 3,
                    route: `${TASKS}/${TASK_LIST_TYPE.ASSIGNED_TO_OTHERS}`,
                },
                {
                    labelText: t('task_content.landing_page_translation.draft_tasks'),
                    value: 5,
                    tabIndex: 5,
                    route: `${TASKS}/${TASK_LIST_TYPE.DRAFT_TASKS}`,
                },
                {
                    labelText: t('task_content.landing_page.task_info.task_type.my_completed_tasks'),
                    value: 2,
                    tabIndex: 2,
                    route: `${TASKS}/${TASK_LIST_TYPE.COMPLETED_TASKS}`,
                },
                {
                    labelText: t('task_content.landing_page.task_info.task_type.snoozed_tasks'),
                    value: 6,
                    tabIndex: 6,
                    route: `${TASKS}/${TASK_LIST_TYPE.SNOOZE_TASKS}`,
                },
            ],
            actionButtonText: t('landing_page_header.tasks.create_button'),
            actionButtonSearchParam: 'task',
        },
        DATALISTS: {
            title: t('landing_page_header.datalist.title'),
            type: 'DATALISTS',
            description: t('app_strings.create_modal.datalist.description'),
            hideSubHeader: false,
            aiAssistType: AI_ASSIST_TYPE.DATA_LIST,
            aiAssistButtonText: t('landing_page_header.ai_prompt.button.datalist'),
            tabOptions: [
                {
                    labelText: t('datalist.list_datalist.all_data_lists'),
                    value: 1,
                    tabIndex: 1,
                    route: `${LIST_DATA_LIST}${DATALIST_OVERVIEW}`,
                },
                {
                    labelText: t('datalist.list_datalist.data_lists_i_own'),
                    value: 2,
                    tabIndex: 2,
                    route: `${LIST_DATA_LIST}${MY_PUBLISHED_DATALIST}`,
                },
                {
                    labelText: t('datalist.list_datalist.drafts'),
                    value: 3,
                    tabIndex: 3,
                    route: `${LIST_DATA_LIST}${MY_DRAFT_DATALIST}`,
                },
            ],
            actionButtonText: t('landing_page_header.datalist.create_button'),
            actionButtonSearchParam: 'datalist',
        },
        FLOWS: {
            title: t('landing_page_header.flows.title'),
            type: 'FLOWS',
            description: t('app_strings.create_modal.flows.description'),
            hideSubHeader: false,
            aiAssistType: AI_ASSIST_TYPE.FLOW,
            aiAssistButtonText: t('landing_page_header.ai_prompt.button.flow'),
            tabOptions: [
                {
                    labelText: t('flow.list_flow.flow_dropdown.published_flows'),
                    value: 1,
                    tabIndex: 1,
                    route: `${LIST_FLOW}${ALL_PUBLISHED_FLOWS}`,
                },
                {
                    labelText: t('flow.list_flow.flow_dropdown.drafts'),
                    value: 3,
                    tabIndex: 3,
                    route: `${LIST_FLOW}${FLOW_DRAFT_MANAGED_BY_YOU}`,
                },
            ],
            actionButtonText: t('landing_page_header.flows.create_button'),
            actionButtonSearchParam: 'flow',
        },
        REPORTS: {
            title: t('landing_page_header.reports.title'),
            type: 'REPORTS',
            description: t('app_strings.create_modal.report.description'),
            hideSubHeader: false,
            selectedTab: PUBLISHED_REPORT_LIST,
            tabOptions: [
                {
                labelText: t('report.report_listing.published'),
                value: PUBLISHED_REPORT_LIST,
                tabIndex: PUBLISHED_REPORT_LIST,
                },
            ],
            actionButtonText: t('landing_page_header.reports.create_button'),
            actionButtonSearchParam: '',
        },
        INTEGRATION: {
            title: t('landing_page_header.integration.title'),
            type: 'INTEGRATION',
            description: t('app_strings.create_modal.integration.description'),
            hideSubHeader: false,
            tabOptions: [
                {
                    labelText: INTEGRATION_LIST_HEADERS(t).EXTERNAL_API,
                    value: 1,
                    tabIndex: 1,
                  },
                  {
                    labelText: INTEGRATION_LIST_HEADERS(t).WORKHALL_API,
                    value: 2,
                    tabIndex: 2,
                  },
                  {
                    labelText: INTEGRATION_LIST_HEADERS(t).DB_CONNECTOR,
                    value: 7,
                    tabIndex: 7,
                  },
                  {
                    labelText: INTEGRATION_LIST_HEADERS(t).API_CREDENTIALS,
                    value: 6,
                    tabIndex: 6,
                  },
                  {
                    labelText: INTEGRATION_LIST_HEADERS(t).DRAFTS,
                    value: 3,
                    tabIndex: 3,
                  },
            ],
            actionButtonText: '',
            actionButtonSearchParam: '',
        },
        ML_MODEL: {
            title: t('landing_page_header.ml_model.title'),
            type: 'ML_MODEL',
            description: t('app_strings.create_modal.user.description'),
            hideSubHeader: true,
            tabOptions: [],
            actionButtonText: EMPTY_STRING,
        },
        TEAMS: {
            title: t('landing_page_header.teams.title'),
            type: 'TEAMS',
            description: t('app_strings.create_modal.team.description'),
            hideSubHeader: false,
            tabOptions: [
                {
                    labelText: t('team.listing.header.organisational'),
                    value: '2',
                    tabIndex: '2',
                },
                {
                    labelText: t('team.listing.header.system'),
                    value: '1',
                    tabIndex: '1',
                },
            ],
            actionButtonText: t('landing_page_header.teams.create_button'),
            actionButtonSearchParam: 'teams',
        },
        ADMIN_SETTINGS: {
            title: t('landing_page_header.admin_settings.title'),
            type: 'ADMIN_SETTINGS',
            description: t('landing_page_header.admin_settings.decription'),
            hideSubHeader: false,
            tabOptions: [
                {
                    labelText: t(ADMIN_SETTINGS_CONSTANT.SETTINGS.TITLE),
                    value: 1,
                    tabIndex: 1,
                  },
                  {
                    labelText: t(ADMIN_SETTINGS_CONSTANT.USER_MANAGEMENT.TITLE),
                    value: 2,
                    tabIndex: 2,
                  },
                  {
                    labelText: t(ADMIN_SETTINGS_CONSTANT.USAGE_DASHBOARD.TITLE),
                    value: 3,
                    tabIndex: 3,
                  },
                  {
                    labelText: t(ADMIN_SETTINGS_CONSTANT.LIBRARY_MANAGEMENT.TITLE),
                    value: 4,
                    tabIndex: 4,
                  },
            ],
            actionButtonText: EMPTY_STRING,
        },
        SUPER_ADMIN: {
            title: t('landing_page_header.super_admin.title'),
            type: 'SUPER_ADMIN',
            description: t('landing_page_header.super_admin.decription'),
            tabOptions: [
                {
                    labelText: t(ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.LABEL),
                    value: ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.TAB_INDEX,
                    tabIndex: ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.TAB_INDEX,
                },
                {
                    labelText: t(ADMIN_ACCOUNTS_STRINGS.DASHBOARD.LABEL),
                    value: ADMIN_ACCOUNTS_STRINGS.DASHBOARD.TAB_INDEX,
                    tabIndex: ADMIN_ACCOUNTS_STRINGS.DASHBOARD.TAB_INDEX,
                },
            ],
            actionButtonText: t('landing_page_header.super_admin.create_button'),
        },
        HOME: {
            title: t('landing_page_header.home.title'),
            type: 'HOME',
            hideSubHeader: true,
            breadcrumbOptions: [],
            tabOptions: [],
            actionButtonText: EMPTY_STRING,
        },
        MODULE: {
            APPS: 'APPS',
            TASKS: 'TASKS',
            DATALISTS: 'DATALISTS',
            FLOWS: 'FLOWS',
            REPORTS: 'REPORTS',
            INTEGRATION: 'INTEGRATION',
            ML_MODEL: 'ML_MODEL',
            TEAMS: 'TEAMS',
            ADMIN_SETTINGS: 'ADMIN_SETTINGS',
            SUPER_ADMIN: 'SUPER_ADMIN',
        },
    };
};
