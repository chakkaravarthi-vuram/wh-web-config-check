export const FIELD_WIDTH = {
  AUTO: 'auto', // none
  SMALL: 'small', // 3
  MEDIUM: 'medium', // 5
  LARGE: 'large', // 7
};

const DASHBOARD_CONFIG_STRINGS = (t = () => {}) => {
  return {
    CONFIG_PANEL: {
      FIELDS: {
        TABLE_COLUMNS: {
          ID: 'table_column',
          LABEL: t('dashboard_config.config_panel.fields.table_column.label'),
          ADD_COLUMN: t(
            'dashboard_config.config_panel.fields.table_column.add_column',
          ),
          NO_RESULT_FOUND: t(
            'dashboard_config.config_panel.fields.table_column.no_result_found',
          ),
          DATA_FIELDS: t('configuration_strings.all_labels.data_field'),
          SYSTEM_FIELDS: t('configuration_strings.all_labels.System_fields'),
        },
        SORTING: {
          LABEL: t('dashboard_config.config_panel.fields.sorting.label'),
          SORT_BY_ID: 'sort_by',
          SORT_ORDER_ID: 'sort_order',
          SORT_ORDER_OPTIONS: [
            {
              label: 'ASC',
              value: 1,
            },
            {
              label: 'DSC',
              value: -1,
            },
          ],
        },
        ADDITIONAL_CONFIG: {
          ID: 'additional_config',
          LABEL: t(
            'dashboard_config.config_panel.fields.additional_config.label',
          ),
          INPUT_NAME: t(
            'dashboard_config.config_panel.fields.additional_config.name',
          ),
          ENABLE_TASK: {
            LABEL: t(
              'dashboard_config.config_panel.fields.additional_config.enable_task',
            ),
            VALUE: 'show_task_list',
            ID: 'report_name',
          },
          ENABLE_DOWNLOAD: {
            LABEL: t(
              'dashboard_config.config_panel.fields.additional_config.enable_download',
            ),
            VALUE: 'show_download',
          },
          ENABLE_START_ADD_NEW: {
            LABEL: t(
              'dashboard_config.config_panel.fields.additional_config.enable_start_add_new',
            ),
            VALUE: 'show_submit',
            ID: 'submit_button_label',
          },
        },
      },
      TABLE_COLUMN_CONFIG: {
        TITLE: t('dashboard_config.config_panel.table_column_config.title'),
        GENERAL: {
          TITLE: t(
            'dashboard_config.config_panel.table_column_config.general.title',
          ),
          COLUMN_DETAILS: {
            TITLE: t(
              'dashboard_config.config_panel.table_column_config.general.column_details.title',
            ),
            SOURCE_FIELD: {
              ID: 'source_field',
              LABEL: t(
                'dashboard_config.config_panel.table_column_config.general.column_details.source_field',
              ),
            },
            LABEL: {
              ID: 'label',
              LABEL: t(
                'dashboard_config.config_panel.table_column_config.general.column_details.label',
              ),
            },
          },
          COLUMN_WIDTH: {
            ID: 'column_width',
            TITLE: t(
              'dashboard_config.config_panel.table_column_config.general.column_width.title',
            ),
            OPTIONS: [
              {
                label: t(
                  'dashboard_config.config_panel.table_column_config.general.column_width.options.auto',
                ),
                value: FIELD_WIDTH.AUTO,
              },
              {
                label: t(
                  'dashboard_config.config_panel.table_column_config.general.column_width.options.small',
                ),
                value: FIELD_WIDTH.SMALL,
              },
              {
                label: t(
                  'dashboard_config.config_panel.table_column_config.general.column_width.options.medium',
                ),
                value: FIELD_WIDTH.MEDIUM,
              },
              {
                label: t(
                  'dashboard_config.config_panel.table_column_config.general.column_width.options.large',
                ),
                value: FIELD_WIDTH.LARGE,
              },
            ],
          },
        },
        BUTTONS: {
          CANCEL: t(
            'dashboard_config.config_panel.table_column_config.buttons.cancel',
          ),
          SAVE: t(
            'dashboard_config.config_panel.table_column_config.buttons.save',
          ),
        },
      },
    },
    PREVIEW: {
      TAB: {
        TASKS: t('dashboard_config.preview.tab.tasks'),
      },
      TASK_TABLE_HEADER: {
        RECORD_ID: t('dashboard_config.preview.task_table_header.record_id'),
        TASK_NAME: t('dashboard_config.preview.task_table_header.task_name'),
        OPEN_WITH: t('dashboard_config.preview.task_table_header.open_with'),
        PENDING_SINCE: t(
          'dashboard_config.preview.task_table_header.pending_since',
        ),
      },
    },
  };
};
export const DRAG_AND_DROP_TABLE_COLUMN = 'TABLE_COLUMN';

export const TAB_VALUES = {
  ALL_REQUEST: 1,
  TASKS: 2,
};

export default DASHBOARD_CONFIG_STRINGS;
