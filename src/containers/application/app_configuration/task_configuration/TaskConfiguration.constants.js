import i18next from 'i18next';
import { BE_TASK_LIST_TYPE, GET_TASK_LIST_CONSTANTS } from '../../app_components/task_listing/TaskList.constants';

const TYPE_OF_TASK_KEY = {
    ALL: 'all',
    FLOW_OR_DATA_LIST: 'flow_or_data_list',
};

export const FLOW_LABEL = 'create_dashboard_strings.flow';
export const DL_LABEL = 'app_strings.pages.link.links.headers.choose_datalist';

const TASK_COMPONENT_CONFIG_KEYS = {
    TYPE: 'type',
    TYPE_OF_TASK: 'type_of_task',
    FLOW_UUIDS: 'flow_uuids',
    DATA_LISTS_UUIDS: 'data_list_uuids',
    ASSIGNED_TO: 'assigned_to',
    DUE_ON: 'due_on',
    DUE_DATE: 'due_date',
    DUE_DATE_END: 'due_end_date',
    ASSIGNED_ON: 'assigned_on',
    SORT_FIELD: 'sort_field',
    SORT_BY: 'sort_by',
    SELECT_COLUMNS: 'select_columns',
 };

const GET_TASK_CONFIG_CONSTANT = (t = i18next.t) => {
  const { FILTER: { DUE_ON, ASSIGNED_ON, TASK_TYPE }, ALL_COLUMN_LIST } = GET_TASK_LIST_CONSTANTS(t);
  return {
    FILTER: {
        DUE_ON: {
            ID: TASK_COMPONENT_CONFIG_KEYS.DUE_ON,
            LABEL: t('task_config_strings.filter.due_on'),
            PLACEHOLDER: DUE_ON.PLACEHOLDER,
            OPTIONS: DUE_ON.OPTIONS,
        },
        ASSIGNED_ON: {
            ID: TASK_COMPONENT_CONFIG_KEYS.ASSIGNED_ON,
            LABEL: t('task_config_strings.filter.assigned_on'),
            PLACEHOLDER: ASSIGNED_ON.PLACEHOLDER,
            OPTIONS: ASSIGNED_ON.OPTIONS,
        },
        ASSIGNED_TO: {
            ID: TASK_COMPONENT_CONFIG_KEYS.ASSIGNED_TO,
            LABEL: t('task_config_strings.filter.assigned_to.label'),
            PLACEHOLDER: t('task_config_strings.filter.assigned_to.placeholder'),
            OPTIONS: TASK_TYPE.OPTIONS,
        },
        TYPE_OF_TASK: {
            ID: TASK_COMPONENT_CONFIG_KEYS.TYPE_OF_TASK,
            LABEL: t('task_config_strings.filter.type_of_task.label'),
            PLACEHOLDER: t('task_config_strings.filter.type_of_task.placeholder'),
            OPTIONS: [
                {
                    label: t('task_config_strings.filter.type_of_task.all_tasks'),
                    value: TYPE_OF_TASK_KEY.ALL,
                },
                {
                    label: t('task_config_strings.filter.type_of_task.flow_dl_task'),
                    value: TYPE_OF_TASK_KEY.FLOW_OR_DATA_LIST,
                },
            ],
        },
        SELECT_COLUMN: {
            ID: TASK_COMPONENT_CONFIG_KEYS.SELECT_COLUMNS,
            LABEL: t('task_config_strings.filter.select_column.label'),
            PLACEHOLDER: t('task_config_strings.filter.select_column.label'),
            OPTIONS: [
                { ...ALL_COLUMN_LIST.TASK_NAME, disabled: true },
                ALL_COLUMN_LIST.CREATED_BY,
                ALL_COLUMN_LIST.ASSIGNED_TO,
                ALL_COLUMN_LIST.ASSIGNED_ON,
                ALL_COLUMN_LIST.COMPLETED_ON,
                ALL_COLUMN_LIST.DUE_DATE,
            ],
            [BE_TASK_LIST_TYPE.OPEN]: [
                { ...ALL_COLUMN_LIST.TASK_NAME, disabled: true },
                ALL_COLUMN_LIST.CREATED_BY,
                ALL_COLUMN_LIST.ASSIGNED_ON,
                ALL_COLUMN_LIST.DUE_DATE,
            ],
            [BE_TASK_LIST_TYPE.ASSIGNED_TO_OTHERS]: [
                { ...ALL_COLUMN_LIST.TASK_NAME, disabled: true },
                ALL_COLUMN_LIST.ASSIGNED_TO,
                ALL_COLUMN_LIST.ASSIGNED_ON,
                ALL_COLUMN_LIST.COMPLETED_ON,
                ALL_COLUMN_LIST.DUE_DATE,
            ],
            [BE_TASK_LIST_TYPE.COMPLETED_TASKS]: [
                { ...ALL_COLUMN_LIST.TASK_NAME, disabled: true },
                ALL_COLUMN_LIST.ASSIGNED_TO,
                ALL_COLUMN_LIST.COMPLETED_ON,
            ],
        },
        LABEL_FIELD: {
            ID: 'label',
            PLACEHOLDER: t('task_config_strings.filter.label_field.placeholder'),
            LABEL: t('task_config_strings.filter.label_field.label'),
        },
        TASK_TYPE: {
            ID: TASK_COMPONENT_CONFIG_KEYS.TYPE,
            LABEL: t('task_config_strings.filter.task_type.label'),
            PLACEHOLDER: t('task_config_strings.filter.task_type.placeholder'),
            OPTIONS: [
                {
                    label: t('task_config_strings.filter.task_type.open_tasks'),
                    value: BE_TASK_LIST_TYPE.OPEN,
                },
                {
                    label: t('task_config_strings.filter.task_type.completed_tasks'),
                    value: BE_TASK_LIST_TYPE.COMPLETED_TASKS,
                },
                {
                    label: t('task_config_strings.filter.task_type.assigned_to_others'),
                    value: BE_TASK_LIST_TYPE.ASSIGNED_TO_OTHERS,
                },
            ],
        },
        SORT_FILED: {
            ID: TASK_COMPONENT_CONFIG_KEYS.SORT_FIELD,
            LABEL: t('task_config_strings.filter.sort_field.label'),
            PLACEHOLDER: t('task_config_strings.filter.sort_field.placeholder'),
        },
        SORT: {
            ID: TASK_COMPONENT_CONFIG_KEYS.SORT_BY,
            OPTIONS: [
                { id: 'asc',
                label: t('task_config_strings.filter.sort.ascending_label'),
                value: 1,
            },
                {
                    id: 'desc',
                    label: t('task_config_strings.filter.sort.desc_label'),
                    value: -1,
                },
            ],
        },
        FLOW_OR_DATALIST: {
            LABEL: t('task_config_strings.filter.flow_or_dl.label'),
            PLACEHOLDER: t('task_config_strings.filter.flow_or_dl.label'),
        },
     },
    SORT_COLUMN_KEY_TO_OPTION_MAP: {
      [ALL_COLUMN_LIST.TASK_NAME.value]: ALL_COLUMN_LIST.TASK_NAME,
      [ALL_COLUMN_LIST.ASSIGNED_ON.value]: ALL_COLUMN_LIST.ASSIGNED_ON,
      [ALL_COLUMN_LIST.ASSIGNED_TO.value]: ALL_COLUMN_LIST.ASSIGNED_TO,
      [ALL_COLUMN_LIST.COMPLETED_ON.value]: ALL_COLUMN_LIST.COMPLETED_ON,
      [ALL_COLUMN_LIST.CREATED_BY.value]: ALL_COLUMN_LIST.CREATED_BY,
      [ALL_COLUMN_LIST.CREATED_ON.value]: ALL_COLUMN_LIST.CREATED_ON,
      [ALL_COLUMN_LIST.DUE_DATE.value]: ALL_COLUMN_LIST.DUE_DATE,
      [ALL_COLUMN_LIST.LAST_EDITED_ON.value]: ALL_COLUMN_LIST.LAST_EDITED_ON,
     },
    LABEL: {
        USER_FILTER: t('task_config_strings.user_filter_label'),
        APPLIED_TASK_WILL_AFFECT_THE_TASK_LIST: t('task_config_strings.applied_task_will_affect_the_task_list'),
        DEFAULT_SORT: t('task_config_strings.default_sort_label'),
    },
  };
};

export { BE_TASK_LIST_TYPE, TYPE_OF_TASK_KEY, GET_TASK_CONFIG_CONSTANT, TASK_COMPONENT_CONFIG_KEYS };
