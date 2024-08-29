import i18next from 'i18next';
import FaqStackIcon from '../../assets/icons/app_builder_icons/FaqStackIcon';
import FaqTaskIcon from '../../assets/icons/app_builder_icons/FaqTaskIcon';
import { DEV_USER, HOME } from '../../urls/RouteConstants';
import DatalistIconNew from '../../assets/icons/DatalistIconNew';
import { ALL_DATALISTS, ALL_FLOWS } from '../../utils/strings/CommonStrings';

export const APPLICATION_STRINGS = (t = i18next.t) => {
    return {
        APP_LISTING: {
            SHOWING: t('app_strings.app_listing.showing'),
            APPS: t('app_strings.app_listing.apps'),
            FILTER: t('app_strings.app_listing.filter'),
            TAB: {
                OPTIONS: [
                    {
                        labelText: t('app_strings.app_listing.publised'),
                        value: '0',
                        tabIndex: 0,
                    },
                    {
                        labelText: t('app_strings.app_listing.draft'),
                        value: '1',
                        tabIndex: 1,
                    },
                ],
            },
        },
        HEADER: {
            PROFILE_DROPDOWN: {
                WORKSPACE: t('app_strings.header.profile_dropdown.workspace'),
                VIEW_PROFILE: t('app_strings.header.profile_dropdown.view_profile'),
                MY_DOWNLOADS: t('app_strings.header.profile_dropdown.my_downloads'),
                SETTINGS: t('app_strings.header.profile_dropdown.settings'),
                SUPPORT: t('app_strings.header.profile_dropdown.support'),
                DOCUMENTATION: t('app_strings.header.profile_dropdown.documentation'),
                LOGOUT: t('app_strings.header.profile_dropdown.logout'),
                MODES: [
                    {
                        title: t('app_strings.header.profile_dropdown.modes.normal.title'),
                        description: t('app_strings.header.profile_dropdown.modes.normal.description'),
                        mode: 'normal',
                        route: `${HOME}`,
                    },
                    {
                        title: t('app_strings.header.profile_dropdown.modes.developer.title'),
                        description: t('app_strings.header.profile_dropdown.modes.developer.description'),
                        mode: 'developer',
                        route: `${DEV_USER}`,
                    },
                ],
            },
        },
        FREQ_USED: [
            {
                label: 'Timesheet Activities',
                link: '',
                icon: FaqStackIcon,
                hovered: false,
            }, {
                label: 'Design Team Work Bucket',
                link: '',
                icon: FaqStackIcon,
                hovered: false,
            }, {
                label: 'Leave Request',
                link: '',
                icon: FaqStackIcon,
                hovered: false,
            }, {
                label: 'Submit Leave Request',
                link: '',
                icon: FaqTaskIcon,
                hovered: false,
            },
        ],
        TEXT_STYLING: {
            TITLE: t('app_strings.text_styling.title'),
            CANCEL: t('app_strings.text_styling.cancel'),
            SAVE: t('app_strings.text_styling.save'),
            DELETE: t('app_strings.text_styling.delete'),
            BACKGROUND_COLOR: t('app_strings.text_styling.background_color'),
            FORMATTER: t('app_strings.text_styling.formatter'),
        },
        SYSTEM_DIRECTORY: {
            ID: 'System_Directory',
            FLOWS: t('app_strings.system_directory.flows'),
            DATALISTS: t('app_strings.system_directory.datalists'),
            TITLE: t('app_strings.system_directory.title'),
            START: t('app_strings.system_directory.start'),
            ADD: t('app_strings.system_directory.add'),
            ADD_TASK: t('flow_dashboard.add_task.title'),
            PLACEHOLDER_FLOW: t('app_strings.system_directory.placeholder_flow'),
            PLACEHOLDER_DL: t('app_strings.system_directory.placeholder_dl'),
            PLACEHOLDER_TEAMS: t('app_strings.system_directory.placeholder_teams'),
            CREATE_TEAM: t('teams.teams_translation.create_team'),
            NO_TEAMS: t('teams.no_teams_data.title'),
            CREATE_YOUR_FIRST_TEAM: t('teams.no_teams_data.sub_title'),
            NO_TEAMS_ON_SEARCH: t('teams.no_search_team_data.title'),
            TRY_SEARCHING: t('teams.no_search_team_data.subtitle'),
            TAB_OPTIONS: [
                { labelText: t('app_strings.system_directory.flows'), tabIndex: '1', value: '1' },
                { labelText: t('app_strings.system_directory.datalists'), tabIndex: '2', value: '2' },
                { labelText: t('app_strings.system_directory.my_teams'), tabIndex: '3', value: '3' },
            ],
        },
        ERROR_VALIDATION: {
            ORDER_SUCCESS: t('app_strings.validation.order_success'),
            ORDER_FAILED: t('app_strings.validation.order_failed'),
        },
    };
};

export const APP_VALIDATION = {
    SOME_DATA: 'app_strings.validation.some_data',
    LABEL: 'common_strings.label_constant',
    LABEL_MAX_ERROR_MESSAGE: 'common_strings.label_max_error_message',
    MAX_TEXT_STYLING_COMP: 'app_strings.validation.text_comp_validation',
    DASHBOARD: 'app_strings.validation.dashboard',
    DASHBOARD_TYPE: 'app_strings.validation.dashboard_type',
    IMAGE: 'app_strings.validation.image',
    NAME: 'app_strings.validation.name',
    URL: 'app_strings.validation.url',
    REPORT: 'app_strings.validation.report',
    FLOW: 'app_strings.validation.flow',
    DATALIST: 'app_strings.validation.datalist',
    WEBPAGE_EMBEDDING: 'app_strings.validation.webpage_embedding',
    EMBED_URL_NOT_VERIFIED: 'app_strings.validation.embed_url_not_verified',
    PAGE_NAME: 'app_strings.validation.page_name',
    PAGE_URL: 'app_strings.validation.page_url',
    PAGE_VIEWER: 'app_strings.validation.page_viewers',
    PAGE_VIEWERS_REQUIRED: 'app_strings.validation.page_viewers_required',
    APP_VIEWERS: 'app_strings.validation.app_viewers',
    APP_URL_LIMIT: 'app_strings.validation.app_url_limit',
    PAGE_URL_LIMIT: 'app_strings.validation.page_url_limit',
    PAGE_URL_EXIST: 'app_strings.validation.page_url_exist',
    PAGE_NAME_EXIST: 'app_strings.validation.page_name_exist',
};

export const APP_HOME_STRINGS = {
    CREATE_TASK_TEXT_ERROR: 'app_strings.home.create_task_text_error',
    SEARCH_PLACEHOLDER: 'app_strings.home.search_placeholder',
};

export const BUTTON_LABELS = {
    SAVE_AND_CLOSE: 'flows.step_footer_button.save_and_close',
    PUBLISH_APP: 'app_strings.publish_app.title',
};

export const APP_DISCARD_CONFIRMATION = 'app_strings.app_header.app_discard_message';

export const COUNT_NINE_PLUS = '9+';

export const APP_DELETE_ANYWAY = {
    DELETED_SUCCESS: 'app_strings.app_delete_anyway.app_deleted_successfully',
    CURRENTLY: 'app_strings.app_delete_anyway.currently',
    IS_EDITING: 'app_strings.app_delete_anyway.is_editing',
    ARE_YOU_SURE: 'app_strings.app_delete_anyway.are_you_sure',
    YES_DELETE: 'app_strings.app_delete_anyway.yes_delete',
};

export const PUBLISH_APP_KEY_ADDRESS = {
    VIEWERS: 'viewers',
    ADMINS: 'admins',
    USERS: 'users',
    TEAMS: 'teams',
};

export const ALLOWED_APP_TEAM_TYPE = [1, 2];

export const ALL_DEVELOPERS_TEAM_CODE = [103];

export const ALLOWED_APP_USER_TYPE = [1, 3];

export const APP_CREATION_NLP = {
    PLACEHOLDER: 'landing_page_header.ai_prompt.prompt_description.app',
    FAILURE: 'prompt.app.failure',
};
export const STATIC_CHIP_LIST = {
    KEYS: {
        TAB_INDEX: 'tabIndexes',
        SHOW_SYSTEM_DIRECTORY: 'showSystemDirectory',
    },
    OPTIONS: [
        { labelText: ALL_FLOWS, tabIndex: '1', value: '1', icon: FaqStackIcon },
        { labelText: ALL_DATALISTS, tabIndex: '2', value: '2', icon: DatalistIconNew },
    ],
};
