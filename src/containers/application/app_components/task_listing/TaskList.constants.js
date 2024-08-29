import i18next from 'i18next';

export const TASK_LIST_TYPE = {
    OPEN: 'myTasks',
    ASSIGNED_TO_OTHERS: 'assignedToOthers',
    DRAFT_TASKS: 'draftTasks',
    COMPLETED_TASKS: 'completedTasks',
    SNOOZE_TASKS: 'snoozedTasks',
};

export const SORT_BY_COLUMN_KEY = {
  TASK_NAME: 'task_name',
  INITIATED_BY: 'initiated_by',
  ASSIGNEES: 'assignees',
  ASSIGNED_TO: 'assigned_to',
  ASSIGNED_ON: 'assigned_on',
  PUBLISHED_ON: 'published_on',
  LAST_EDITED_ON: 'last_updated_on',
  CLOSED_ON: 'closed_on',
  SNOOZE_TIME: 'snooze_time',
  DUE_DATE: 'due_date',
};

export const BE_TASK_LIST_TYPE = {
    OPEN: 'open',
    ASSIGNED_TO_OTHERS: 'assigned_to_others',
    COMPLETED_TASKS: 'completed',
};

export const BE_TO_FE_TASK_LIST_TYPE_MAPPING = {
    [BE_TASK_LIST_TYPE.OPEN]: TASK_LIST_TYPE.OPEN,
    [BE_TASK_LIST_TYPE.COMPLETED_TASKS]: TASK_LIST_TYPE.COMPLETED_TASKS,
    [BE_TASK_LIST_TYPE.ASSIGNED_TO_OTHERS]: TASK_LIST_TYPE.ASSIGNED_TO_OTHERS,
};

export const ASSIGNED_TO_OTHERS_TYPE = {
    OPEN: 'open',
    COMPLETED: 'completed',
};

export const PRIORITY = {
    DEADLINE_HIGH: 2,
    HIGH: 1,
    MEDIUM: 0,
    OVER_DUE: -1,
    NO_DUE: -2,
};

export const COLOR = {
    WHITE: '#ffff',
    GRAY_10: '#F2F4F7',
    GRAY_100: '#959BA3',
    ORANGE_10: '#FFFAEB',
    ORANGE_100: '#F79009',
    RED_10: '#FEF3F2',
    RED_50: '#fe6c6a',
    RED_100: '#F04438',
    BLACK_10: '#344054',
    BLACK_20: '#484D57',
};

export const TASK_TABLE_TYPE = {
    PAGINATED: 'paginated',
    DYNAMIC_PAGINATION: 'dynamic_pagination',
    INFINITE_SCROLL: 'infinite_scoll',
};

export const TABLE_ROW_COUNT = {
    PAGINATED: 8,
    INFINITE_SCROLL: 20,
};

export const GET_TASK_LIST_CONSTANTS = (t = i18next.t) => {
 return {
    TAB: {
    OPTION: [
        {
            labelText: t('task_content.landing_page.task_info.task_type.my_tasks'),
            value: '0',
            tabIndex: 0,
            route: TASK_LIST_TYPE.OPEN,
        },
        {
            labelText: t('task_content.landing_page.task_info.task_type.assigned_to_others'),
            value: '1',
            tabIndex: 1,
            route: TASK_LIST_TYPE.ASSIGNED_TO_OTHERS,
        },
        {
            labelText: t('task_content.landing_page_translation.draft_tasks'),
            value: '2',
            tabIndex: 2,
            route: TASK_LIST_TYPE.DRAFT_TASKS,
        },
        {
            labelText: t('task_content.landing_page.task_info.task_type.my_completed_tasks'),
            value: '3',
            tabIndex: 3,
            route: TASK_LIST_TYPE.COMPLETED_TASKS,
        },
        {
            labelText: t('task_content.landing_page.task_info.task_type.snoozed_tasks'),
            value: '4',
            tabIndex: 4,
            route: TASK_LIST_TYPE.SNOOZE_TASKS,
        },
    ],
    VALUE: Object.values(TASK_LIST_TYPE),
    },
    FILTER: {
        LABEL: 'Filter',
        TASK_TYPE: {
            ID: 'task_type',
            PLACEHOLDER: t('task_config_strings.filter.task_type.label'),
            OPTIONS: [
                {
                    label: t('task_config_strings.filter.assigned_to.self_label'),
                    value: 'assigned_to_me',
                },
                {
                    label: t('task_config_strings.filter.assigned_to.team_label'),
                    value: 'assigned_to_group',
                },
            ],
            USER_OPTIONS: [
                {
                    label: t('task_content.landing_page_translation.assigned_to_me'),
                    value: 'assigned_to_me',
                },
                {
                    label: t('task_content.landing_page_translation.assigned_to_group'),
                    value: 'assigned_to_group',
                },
            ],
        },
        ASSIGNED_ON: {
            ID: 'assigned_on',
            PLACEHOLDER: t('task_config_strings.filter.assigned_on'),
            OPTIONS: [
                { label: t('task_content.landing_page_translation.today'), value: '0' },
                { label: t('task_content.landing_page_translation.last_7_days'), value: '-7' },
                { label: t('task_content.landing_page_translation.last_30_days'), value: '-30' },
                { label: t('task_content.landing_page_translation.more_than_30_days'), value: '30' },
            ],
        },
        DUE_ON: {
            ID: 'due_type',
            PLACEHOLDER: t('task_config_strings.filter.due_on'),
            OPTIONS: [
                { label: t('task_content.landing_page_translation.over_due'), value: 'overdue' },
                { label: t('task_content.landing_page_translation.due_today'), value: 'due_today' },
                { label: t('task_content.landing_page_translation.due_3_days'), value: 'due_within' },
                { label: t('task_content.landing_page_translation.due_3_to_7_days'), value: 'due_between' },
                { label: t('task_content.landing_page_translation.due_after_7_days'), value: 'due_after' },
                { label: t('task_content.landing_page_translation.no_due'), value: 'no_due' },
            ],
        },
        SHOW_BY: {
            ID: 'show_by',
            PLACEHOLDER: '',
            OPTIONS: [
                { label: t('task_content.landing_page_translation.open'), value: ASSIGNED_TO_OTHERS_TYPE.OPEN },
                { label: t('task_content.landing_page_translation.completed'), value: ASSIGNED_TO_OTHERS_TYPE.COMPLETED },
            ],
        },
    },
    ALL_COLUMN_LIST: {
        TASK_NAME: {
            label: t('list_header.task.task_name'),
            key: 'task_name',
            value: 'task_name',
        },
        CREATED_BY: {
            label: t('list_header.task.created_by'),
            key: 'created_by',
            value: 'created_by',
        },
        ASSIGNED_TO: {
            label: t('list_header.task.assigned_to'),
            key: 'assigned_to',
            value: 'assigned_to',
        },
        CREATED_ON: {
            label: t('list_header.task.created_on'),
            key: 'created_on',
            value: 'created_on',
        },
        ASSIGNED_ON: {
            label: t('list_header.task.assigned_on'),
            key: 'assigned_on',
            value: 'assigned_on',
        },
        LAST_EDITED_ON: {
            label: t('list_header.task.last_edited_on'),
            key: 'last_edited_on',
            value: 'last_edited_on',
        },
        COMPLETED_ON: {
            label: t('list_header.task.completed_on'),
            key: 'completed_on',
            value: 'completed_on',
        },
        SNOOZE_UNTIL: {
            label: t('list_header.task.snoozed_until'),
            key: 'snooze_until',
            value: 'snooze_until',
        },
        DUE_DATE: {
            label: t('list_header.task.due_date'),
            key: 'due_date',
            value: 'due_date',
        },
    },
    LABEL: {
        SHOWING: t('app_strings.app_listing.showing'),
        TASKS: t('landing_page.main_header.common_header.tasks'),
        FILTER: t('task_content.landing_page_translation.filter'),
        SAVE: t('app_strings.app_settings.save'),
        APPLY: t('app_strings.app_settings.apply'),
        CANCEL: t('app_strings.app_settings.cancel'),
        CLEAR_ALL: t('app_strings.app_settings.clear_all'),
        NO_TASK_FOUND: t('app_strings.task.no_task'),
        CREATE_FIRST_TASK: t('app_strings.task.create_task_instruction'),
        CREATE_TASK: t('app_strings.task.create_task'),
        OF: t('app_strings.task.of'),
        NO_DUE_DATE: t('app_strings.no_due_date'),
        SHOW_BY: t('app_strings.app_listing.show_by'),
        SEARCH: t('app_strings.app_listing.search'),
    },
    EMPTY_MESSAGE: {
        MY_TASKS: t('task_content.no_search_data_text.my_tasks'),
        ASSIGNED_TO_OTHERS_OPEN: t('task_content.no_search_data_text.assigned_to_others_open'),
        ASSIGNED_TO_OTHERS_COMPLETED: t('task_content.no_search_data_text.assigned_to_others_completed'),
        COMPLETED_TASKS: t('task_content.no_search_data_text.completed_tasks'),
        SNOOZED_TASKS: t('task_content.no_search_data_text.snoozed_tasks'),
        DRAFT_TASKS: t('task_content.no_search_data_text.draft_tasks'),
    },
};
};

const { ALL_COLUMN_LIST } = GET_TASK_LIST_CONSTANTS(i18next.t);
export const GET_COLUMN_KEY_AND_SORT_KEY_MAPPING = {
    [TASK_LIST_TYPE.OPEN]: {
       [ALL_COLUMN_LIST.TASK_NAME.key]: SORT_BY_COLUMN_KEY.TASK_NAME,
       [ALL_COLUMN_LIST.CREATED_BY.key]: SORT_BY_COLUMN_KEY.INITIATED_BY,
       [ALL_COLUMN_LIST.ASSIGNED_ON.key]: SORT_BY_COLUMN_KEY.ASSIGNED_ON,
       [ALL_COLUMN_LIST.DUE_DATE.key]: SORT_BY_COLUMN_KEY.DUE_DATE,
    },
    [TASK_LIST_TYPE.ASSIGNED_TO_OTHERS]: {
       [ASSIGNED_TO_OTHERS_TYPE.OPEN]: {
        [ALL_COLUMN_LIST.TASK_NAME.key]: SORT_BY_COLUMN_KEY.TASK_NAME,
        [ALL_COLUMN_LIST.ASSIGNED_TO.key]: SORT_BY_COLUMN_KEY.ASSIGNEES,
        [ALL_COLUMN_LIST.ASSIGNED_ON.key]: SORT_BY_COLUMN_KEY.PUBLISHED_ON,
        [ALL_COLUMN_LIST.DUE_DATE.key]: SORT_BY_COLUMN_KEY.DUE_DATE,
        },
       [ASSIGNED_TO_OTHERS_TYPE.COMPLETED]: {
        [ALL_COLUMN_LIST.TASK_NAME.key]: SORT_BY_COLUMN_KEY.TASK_NAME,
        [ALL_COLUMN_LIST.ASSIGNED_TO.key]: SORT_BY_COLUMN_KEY.ASSIGNEES,
        [ALL_COLUMN_LIST.ASSIGNED_ON.key]: SORT_BY_COLUMN_KEY.PUBLISHED_ON,
        [ALL_COLUMN_LIST.COMPLETED_ON.key]: SORT_BY_COLUMN_KEY.CLOSED_ON,
       },
    },
    [TASK_LIST_TYPE.DRAFT_TASKS]: {
       [ALL_COLUMN_LIST.TASK_NAME.key]: SORT_BY_COLUMN_KEY.TASK_NAME,
       [ALL_COLUMN_LIST.ASSIGNED_TO.key]: SORT_BY_COLUMN_KEY.ASSIGNEES,
       [ALL_COLUMN_LIST.LAST_EDITED_ON.key]: SORT_BY_COLUMN_KEY.LAST_EDITED_ON,
    },
    [TASK_LIST_TYPE.COMPLETED_TASKS]: {
       [ALL_COLUMN_LIST.TASK_NAME.key]: SORT_BY_COLUMN_KEY.TASK_NAME,
       [ALL_COLUMN_LIST.ASSIGNED_TO.key]: SORT_BY_COLUMN_KEY.ASSIGNED_TO,
       [ALL_COLUMN_LIST.COMPLETED_ON.key]: SORT_BY_COLUMN_KEY.CLOSED_ON,
    },
    [TASK_LIST_TYPE.SNOOZE_TASKS]: {
       [ALL_COLUMN_LIST.TASK_NAME.key]: SORT_BY_COLUMN_KEY.TASK_NAME,
       [ALL_COLUMN_LIST.SNOOZE_UNTIL.key]: SORT_BY_COLUMN_KEY.SNOOZE_TIME,
       [ALL_COLUMN_LIST.CREATED_ON.key]: SORT_BY_COLUMN_KEY.ASSIGNED_ON,
       [ALL_COLUMN_LIST.DUE_DATE.key]: SORT_BY_COLUMN_KEY.DUE_DATE,
    },
};
export const HOME_COMPONENT = 'home';

export const TASK_LIST_INFINITE_SCROLL_ID = 'wh_task_list';

export const TASK_CREATE_NOR_ALLOWED_TYPES = [TASK_LIST_TYPE.SNOOZE_TASKS, TASK_LIST_TYPE.COMPLETED_TASKS];
