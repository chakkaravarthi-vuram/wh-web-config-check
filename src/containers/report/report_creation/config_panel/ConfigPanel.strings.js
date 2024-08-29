import { FIELD_TYPE } from '../../../../utils/constants/form.constant';

export const SORT_BY_VALUE = {
  ASC: 'asc',
  DSC: 'dsc',
};

const CONFIG_PANEL_STRINGS = (t = () => {}) => {
  return {
    SECTIONS: {
      VISUALIZATION: t('report.config_panel.visualization'),
      COLUMNS: t('report.config_panel.columns'),
      X_AXIS: t('report.config_panel.x_axis'),
      Y_AXIS: t('report.config_panel.y_axis'),
      DEFAULT_FILTER: t('report.config_panel.default_filter'),
      ADDITIONAL_CONFIGURATION: t(
        'report.config_panel.additional_configuration',
      ),
      USER_FILTER: t('report.config_panel.user_filter'),
    },
    REPORT_VISUALIZATION_STRINGS: {
      PIE: t('report.config_panel.pie'),
      HALF_PIE: t('report.config_panel.half_pie'),
      VERTICAL_BAR: t('report.config_panel.vertical_bar'),
      HORIZONTAL_BAR: t('report.config_panel.horizontal_bar'),
      LINE: t('report.config_panel.line'),
      STACKED: t('report.config_panel.stacked'),
      CLUSTERED: t('report.config_panel.clustered'),
      TABLE: t('report.config_panel.table'),
      DONUT: t('report.config_panel.donut'),
      STAT: t('report.config_panel.stat'),
    },
    DATA_FIELDS: t('report.config_panel.data_fields'),
    SYSTEM_FIELDS: t('report.config_panel.system_fields'),
    SEARCH_FIELD: t('report.config_panel.search_field'),
    NO_RESULT_FOUND: t('common_strings.no_results_found'),
    FIELD_CONFIG: {
      TITLE: t('report.config_panel.field_config.title'),
      OF: t('report.config_panel.field_config.of'),
      DD_MONTH_YEAR: {
        ID: 'ddMonthYearSelectedValue',
        LABEL: t('report.config_panel.field_config.dd_month_year.label'),
        PLACEHOLDER: t(
          'report.config_panel.field_config.dd_month_year.placeholder',
        ),
      },
      MEASURE_OPTION: {
        ID: 'measureOption',
        LABEL: t('report.config_panel.field_config.measure_option.label'),
      },
      FILED_DISPLAY_NAME: {
        ID: 'fieldDisplayNameSelectedValue',
        LABEL: t('report.config_panel.field_config.field_display_name.label'),
        PLACEHOLDER: t(
          'report.config_panel.field_config.field_display_name.placeholder',
        ),
        REF: t('report.config_panel.field_config.field_display_name.ref'),
      },
      RANGE: {
        LABEL: t('report.config_panel.field_config.range.label'),
        VALUE: 'range',
      },
      ROUNDUP_VALUE: {
        LABEL: t('report.config_panel.field_config.roundup_value.label'),
        VALUE: 'is_roundup',
        PLACEHOLDER: t(
          'report.config_panel.field_config.roundup_value.placeholder',
        ),
        REQUIRED: t('report.config_panel.field_config.roundup_value.required'),
        OPTION_LIST: [
          {
            label: t(
              'report.config_panel.field_config.roundup_value.option_list.whole_number',
            ),
            value: 0,
          },
          {
            label: t(
              'report.config_panel.field_config.roundup_value.option_list.1_decimal_point',
            ),
            value: 1,
          },
          {
            label: t(
              'report.config_panel.field_config.roundup_value.option_list.2_decimal_point',
            ),
            value: 2,
          },
          {
            label: t(
              'report.config_panel.field_config.roundup_value.option_list.3_decimal_point',
            ),
            value: 3,
          },
        ],
      },
      BREAK_DOWN: {
        LABEL: t('report.config_panel.field_config.break_down.label'),
        VALUE: 'breakDown',
      },
      UNIQUE_COMBINATION: {
        LABEL: t('report.config_panel.field_config.unique_combination.label'),
        VALUE: 'uniqueCombination',
      },
      UNIQUE_VALUE: {
        LABEL: t('report.config_panel.field_config.unique_value.label'),
        VALUE: 'distinct_value',
      },
      SKIP_NULL_VALUES: {
        LABEL: t('report.config_panel.field_config.skip_null_values.label'),
        VALUE: 'skipNullValues',
      },
    },
    BUTTONS: {
      DISCARD: t('report.config_panel.buttons.discard'),
      APPLY: t('report.config_panel.buttons.apply'),
      ADD_FIELD: t('report.config_panel.buttons.add_field'),
      ADD_FILTER: t('report.config_panel.buttons.add_filter'),
    },
    SHOW_TOTAL: {
      LABEL: t('report.config_panel.show_total'),
      VALUE: 'show_total',
    },
    SORT_BY: {
      ID: 'sort_by',
      LABEL: t('report.config_panel.sort_by.label'),
      OPTION_LIST: [],
      PLACEHOLDER: t('report.config_panel.sort_by.placeholder'),
    },
    SORT_BY_ORDER: {
      ID: 'sort_by_order',
      LABEL: t('report.config_panel.sort_by_order.label'),
      OPTION_LIST: [
        {
          label: t('report.config_panel.sort_by_order.asc'),
          value: SORT_BY_VALUE.ASC,
        },
        {
          label: t('report.config_panel.sort_by_order.dsc'),
          value: SORT_BY_VALUE.DSC,
        },
      ],
    },
    FIELD_HEADER: {
      TEXT: t('report.config_panel.fields_header.text_fields'),
      NUMBER: t('report.config_panel.fields_header.number_fields'),
      SINGLE_SELECTION: t(
        'report.config_panel.fields_header.single_selection_fields',
      ),
      MULTI_SELECTION: t(
        'report.config_panel.fields_header.multi_selection_fields',
      ),
      CURRENCY: t('report.config_panel.fields_header.currency_fields'),
      DATE: t('report.config_panel.fields_header.date_fields'),
      DATE_TIME: t('report.config_panel.fields_header.date_time_fields'),
      TABLES: t('report.config_panel.fields_header.tables'),
    },
  };
};

export const FIELD_TAB_TYPES = {
  SOURCE: -1,
  SYSTEM_AND_DATA_FIELDS: 0,
  FIELD_LIST: 1,
  FIELD_CONFIG: 2,
  TABLE_FIELD: 3,
};

export const GROUP_FIELD_TYPES = {
  TEXT: [
    FIELD_TYPE.SINGLE_LINE,
    FIELD_TYPE.PARAGRAPH,
    FIELD_TYPE.EMAIL,
    FIELD_TYPE.PHONE_NUMBER,
    FIELD_TYPE.SCANNER,
    FIELD_TYPE.ADDRESS,
  ],
  NUMBER: [FIELD_TYPE.NUMBER, FIELD_TYPE.PERCENTAGE, FIELD_TYPE.RATING],
  SINGLE_SELECTION: [
    FIELD_TYPE.YES_NO,
    FIELD_TYPE.DROPDOWN,
    FIELD_TYPE.RADIO_GROUP,
    FIELD_TYPE.CUSTOM_LOOKUP_CHECKBOX,
    FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
    FIELD_TYPE.CUSTOM_LOOKUP_RADIOBUTTON,
  ],
  MULTI_SELECTION: [
    FIELD_TYPE.CHECKBOX,
    FIELD_TYPE.LINK,
    FIELD_TYPE.DATA_LIST,
    FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
    FIELD_TYPE.USER_TEAM_PICKER,
    FIELD_TYPE.USER_PROPERTY_PICKER,
    FIELD_TYPE.TEAMS,
  ],
  CURRENCY: [FIELD_TYPE.CURRENCY],
  DATE: [FIELD_TYPE.DATE],
  DATE_TIME: [FIELD_TYPE.DATETIME, FIELD_TYPE.TIME],
  TABLE: [FIELD_TYPE.TABLE],
};

export default CONFIG_PANEL_STRINGS;
