import { translateFunction } from 'utils/jsUtility';
import {
  // DRAFTS_REPORT_LIST,
  PUBLISHED_REPORT_LIST,
} from '../../urls/RouteConstants';
import { FIELD_TYPE } from '../../utils/constants/form.constant';

export const REPORT_SOURCE_TYPES = {
  FLOW: 1,
  DATALIST: 2,
  TASK: 3,
  CROSS_FLOW_DATALIST: 4,
};

export const LIST_API_TYPE = {
  FLOW: 1,
  DATA_LIST: 2,
  FIELD_LIST: 3,
};

export const DROPDOWN_TYPES = {
  PRIMARY_SOURCE: 1,
  SECONDARY_SOURCE: 2,
  PRIMARY_FIELD: 3,
  SECONDARY_FIELD: 4,
  PRIMARY_TYPE: 5,
  SECONDARY_TYPE: 6,
};

export const REPORT_CATEGORY_TYPES = {
  TABLE_ROLLUP: 1,
  TABLE_NON_ROLLUP: 2,
  CHART: 3,
  NUMERIC_ROLLUP: 4,
};

export const REPORT_VISUALIZATION_TYPES = {
  PIE: 1,
  HALF_PIE: 2,
  VERTICAL_BAR: 3,
  HORIZONTAL_BAR: 4,
  LINE: 5,
  STACKED: 6,
  CLUSTERED: 7,
  TABLE: 8,
  DONUT: 9,
  STAT: 10,
};

export const SINGLED_TYPES = [
  REPORT_VISUALIZATION_TYPES.PIE,
  REPORT_VISUALIZATION_TYPES.VERTICAL_BAR,
  REPORT_VISUALIZATION_TYPES.HORIZONTAL_BAR,
  REPORT_VISUALIZATION_TYPES.LINE,
  REPORT_VISUALIZATION_TYPES.DONUT,
];

export const CLUSTERED_TYPES = [
  REPORT_VISUALIZATION_TYPES.CLUSTERED,
  REPORT_VISUALIZATION_TYPES.STACKED,
  REPORT_VISUALIZATION_TYPES.LINE,
];

export const REPORT_STRINGS = (t = translateFunction) => {
  return {
    REPORT_LISTINGS: {
      SHOWING: t('report.report_listing.showing'),
      REPORTS: t('report.report_listing.reports'),
      ID: 'reportListings',
      TAB: {
        OPTIONS: [
          {
            labelText: t('report.report_listing.published'),
            value: PUBLISHED_REPORT_LIST,
            tabIndex: PUBLISHED_REPORT_LIST,
          },
          // {
          //   labelText: t('report.report_listing.drafts'),
          //   value: DRAFTS_REPORT_LIST,
          //   tabIndex: DRAFTS_REPORT_LIST,
          // },
        ],
      },
      REPORT_LIST_COLUMN_HEADER: {
        REPORT_NAME: t('report.report_listing.report_name'),
        PRIMARY_SOURCE: t('report.report_listing.primary_source'),
        REPORT_VIEW: t('report.report_listing.report_view'),
        ADMINS: t('report.report_listing.admins'),
      },
      EMPTY_MESSAGE: {
        TITLE: t('report.report_listing.empty_title'),
        SUB_TITLE: t('report.report_listing.empty_sub_title'),
        CREATE_REPORT_ACTION: t('report.report_listing.create_report'),
      },
    },
    REPORT_CONFIG: {
      ID: 'reportConfigModal',
      HEADER_CONTENT: {
        CLOSE_ARIA_LABEL: t('report.report_config.close_aria_label'),
      },
      MAIN_CONTENT: {
        TITLE_CREATE: t('report.report_config.create_report'),
        TITLE_EDIT: t('report.report_config.edit_report'),
        DESCRIPTION: t('report.report_config.description'),
        NAME: {
          ID: 'reportConfigName',
          LABEL: t('report.report_config.name.label'),
          PLACEHOLDER: t('report.report_config.name.placeholder'),
        },
        TITTLE_PRIMARY: t('report.report_config.title_primary'),
      },
    },
    REPORT_CREATION: {
      REPORT: t('report.report_creation.report'),
      CREATE_REPORT: t('report.report_creation.create_report'),
      EDIT_REPORT: t('report.report_creation.edit_report'),
      PUBLISH_REPORT: t('report.report_creation.publish_report'),
      SAVE_AND_CLOSE: t('report.report_creation.save_and_close'),
      CANCEL: t('report.report_creation.cancel'),
      SAVE_REPORT: t('report.report_creation.save_report'),
      SAVE: t('report.report_creation.save'),
      UNTITLED_REPORT: t('report.report_creation.untitled_report'),
      TABLE_COLUMN: t('report.table_column'),
      OPTION_LIST: {
        EDIT_BASIC_DETAILS: t('report.report_creation.edit_basic_details'),
        EDIT_SECURITY: t('report.report_creation.edit_security'),
        DELETE_REPORT: t('report.report_creation.delete_report'),
      },
      SECURITY: {
        BASIC_DETAILS: t('report.report_creation.security.basic_details'),
        NAME: {
          ID: 'report_name',
          LABEL: t('report.report_creation.security.name.label'),
          PLACEHOLDER: t('report.report_creation.security.name.placeholder'),
        },
        DESCRIPTION: {
          ID: 'report_description',
          LABEL: t('report.report_creation.security.description.label'),
          PLACEHOLDER: t(
            'report.report_creation.security.description.placeholder',
          ),
        },
        ADMINS: {
          ID: 'report_admins',
          LABEL: t('report.report_creation.security.admins.label'),
        },
        VIEWERS: {
          ID: 'report_viewers',
          LABEL: t('report.report_creation.security.viewers.label'),
        },
      },
    },
    REPORTVIEW: [
      {
        label: t('report.report_view.chart_view'),
        value: REPORT_CATEGORY_TYPES.CHART,
        description: t('report.report_view.chart_description'),
      },
      {
        label: t('report.report_view.tabular_rollup'),
        value: REPORT_CATEGORY_TYPES.TABLE_ROLLUP,
        description: t('report.report_view.tabular_rollup_description'),
      },
      {
        label: t('report.report_view.rollup_numeric'),
        value: REPORT_CATEGORY_TYPES.NUMERIC_ROLLUP,
        description: t('report.report_view.rollup_numeric_description'),
      },
      {
        label: t('report.report_view.non_tabular_rollup'),
        value: REPORT_CATEGORY_TYPES.TABLE_NON_ROLLUP,
        description: t('report.report_view.non_tabular_rollup_description'),
      },
    ],
    SOURCE_TYPE: [
      {
        value: LIST_API_TYPE.FLOW,
        label: t('report.source_type.flow'),
        isCheck: false,
      },
      {
        value: LIST_API_TYPE.DATA_LIST,
        label: t('report.source_type.data_list'),
        isCheck: false,
      },
    ],
    REPORT_PREVIEW: {
      INPUT_NEEDED: t('report.report_preview.input_needed'),
      SELECT_DATA_SOURCE: t('report.report_preview.select_data_source'),
      NO_DATA_FOUND: t('report.report_preview.no_data_found'),
      ADD_MORE_DATA: t('report.report_preview.add_more_data'),
      CANT_DISPLAY_LIST: t('report.report_preview.cant_display_list'),
      SOME_DATA_MISSING: t('report.report_preview.some_data_missing'),
      CHANGE_DATA_SOURCE: t('report.report_preview.change_data_source'),
      TABLE_INSTANCE_DATA: t('report.report_preview.table_instance_data'),
      DRILL_DOWN_BACK: t('report.report_preview.drill_down_back'),
    },
    DELETE_REPORT: {
      ID: 'delete_report',
      DELETE_MODAL_TITLE: t('report.delete_report.delete_modal_title'),
      DELETE_MODAL_SUB_TITLE_FIRST: t(
        'report.delete_report.delete_modal_sub_title_first',
      ),
      DELETE_MODAL_SUB_TITLE_SECOND: t(
        'report.delete_report.delete_modal_sub_title_second',
      ),
      DELETE_MODAL_YES_ACTION: t('report.delete_report.delete'),
      DELETE_MODAL_NO_ACTION: t('report.delete_report.cancel'),
    },
    PRIMARY_FIELD: {
      PLACEHOLDER: t('report.primary_field.placeholder'),
      LABEL: t('report.primary_field.label'),
    },
    SECONDARY_FIELD: {
      PLACEHOLDER: t('report.secondary_field.placeholder'),
      LABEL: t('report.secondary_field.label'),
    },
    PRIMARY_SOURCE: {
      LABEL: t('report.primary_source.label'),
      PLACEHOLDER: t('report.primary_source.placeholder'),
    },
    SOURCES: {
      FLOW: t('report.sources.flow'),
      DATA_LIST: t('report.sources.data_list'),
    },
    SEARCH: t('report.search'),
    TYPE: t('report.type'),
    SELECT: t('report.select'),
    OTHER_DATA_SOURCE: t('report.other_data_source'),
    REPORT_VIEW: t('report.report_view2'),
    DELETE: t('report.delete'),
    NEXT: t('report.next'),
    CANCEL: t('report.cancel'),
    BUTTON: t('report.button'),
    ADD_MORE_DATA_SOURCE: t('report.add_more_data_source'),
    ERRORS: {
      INVALID_DATE: t('report.errors.invalid_date'),
      INVALID_ACCESS_TITLE: t('report.errors.invalid_access_title'),
      INVALID_ACCESS_TEXT: t('report.errors.invalid_access_text'),
      INVALID_SECONDARY_SOURCE: t(
        'report.errors.invalid_secondary_data_source',
      ),
      SOURCE_DELETED: t('report.errors.source_deleted'),
      SOURCE_MAP_DELETED: t('report.errors.source_map_deleted'),
      SAME_REPORT_NAME_POPOVER: t('report.errors.same_report_name_popover'),
      REPORT_ALREADY_EXISTS: t('report.errors.report_already_exists'),
      FIELD_DELETED_FROM_SOURCE: t('report.errors.field_deleted_from_source'),
      SOMETHING_WENT_WRONG: t('report.errors.something_went_wrong'),
      SOME_DATA_FIELD_MISSING: t('report.errors.some_data_field_missing'),
      SOME_FLOW_OR_DATA_MISSING: t('report.errors.some_flow_or_data_missing'),
      DO_NOT_SELECT_SAME_FIELD: t('report.errors.do_not_select_same_field'),
    },
  };
};

export const AGGREGATE_TYPE = {
  NONE: 'none',
  COUNT: 'count',
  SUM: 'sum',
  AVG: 'avg',
};

export const NOT_EXIST_FIELDS = ['datalist id', 'flow id'];

export const USER_AND_TEAM_DATA = {
  USERS: ['email', 'first_name', 'last_name', 'is_user', '_id', 'user_type'],
  TEAMS: ['team_name', 'team_type', 'is_active', 'is_user', '_id'],
};

export const DATA_LIST_FIELD_DATA = ['value', 'label'];

export const AGGREGATE_SUM_AVG_TYPE = [AGGREGATE_TYPE.SUM, AGGREGATE_TYPE.AVG];

export const REPORT_SORT_OPTIONS = (t) => ([
  {
    label: t('report.report_listing.sort_option_latest'),
    sortField: 'published_on',
    sortBy: -1,
    value: t('report.report_listing.sort_option_latest'),
  }, {
    label: t('report.report_listing.sort_option_oldest'),
    sortField: 'published_on',
    sortBy: 1,
    value: t('report.report_listing.sort_option_oldest'),
  },
  {
    label: t('report.report_listing.sort_options_name_asc'),
    sortField: 'report_name',
    sortBy: 1,
    value: t('report.report_listing.sort_options_name_asc'),
  }, {
    label: t('report.report_listing.sort_option_name_desc'),
    sortField: 'report_name',
    sortBy: -1,
    value: t('report.report_listing.sort_option_name_desc'),
  },
]);

export const REPORT_LIST_CONSTANTS = (t) => {
  return {
    SEARCH: t('landing_page_header.common.search_placeholder'),
    VALUE_KEY: 'value',
  };
};

export const DASHBOARD_FIELDS = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.DATE,
  FIELD_TYPE.DATETIME,
  FIELD_TYPE.CURRENCY,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
  FIELD_TYPE.RADIO_GROUP,
  FIELD_TYPE.YES_NO,
  FIELD_TYPE.PHONE_NUMBER,
  FIELD_TYPE.EMAIL,
  FIELD_TYPE.SCANNER,
];
