import { translate } from 'language/config';

export const PAGINATION_STRINGS = {
  SHOW: translate('pagination_strings.show'),
  OF: translate('pagination_strings.of'),
  USERS: translate('pagination_strings.users'),
  HYPHEN: '-',
  PAGINATION: translate('pagination_strings.pagination'),
  FLOWS: translate('pagination_strings.flows'),
  DATA_LISTS: translate('pagination_strings.data_list'),
  RESPONSES: translate('pagination_strings.response'),
};
export const ICON_STRINGS = {
  NEXT: translate('pagination_strings.icon_strings.next'),
  PREVIOUS: translate('pagination_strings.icon_strings.previous'),
  MOVE_BEGIN: translate('pagination_strings.icon_strings.move_begin'),
  MOVE_END: translate('pagination_strings.icon_strings.move_end'),
};
export const CLASS_NAMES = {
  PREV_PAGE: 'mdi mdi-chevron-left align-middle',
  FIRST_PAGE: 'mdi mdi-chevron-double-left align-middle',
  NEXT_PAGE: 'mdi mdi-chevron-right align-middle',
  LAST_PAGE: 'mdi mdi-chevron-double-right align-middle',
};

export const PAGE_KEYS = {
  FIRST: 'first',
  LAST: 'last',
};

export const ROWS_PER_PAGE = {
ROW_LABEL: translate('pagination_strings.rows_per_page'),
};

export const CUSTOMER_TOOLTIP = {
  OPEN_LABEL: translate('pagination_strings.customer_tooltip.open_label'),
  CREATE_TASK: translate('pagination_strings.customer_tooltip.create_task'),
  CHANGES_SAVED_AS_DRAFT: 'pagination_strings.customer_tooltip.changes_saved_as_draft',
};

export const POP_OVER_STATUS = {
CREATE_TASK_EXIT: {
  SUB_TITLE: translate('pop_over_status.create_task_exit.sub_title'),
},
DEFAULT_ALERT: {
SUB_TITLE: translate('pop_over_status.default_alert.sub_title'),
},
CREATE_TEAM_EXIT: {
  TITLE: translate('pop_over_status.create_team_exit.title'),
},
FILE_SIZE_EXCEED: {
  TITLE: translate('pop_over_status.file_size_exceed.title'),
  SUB_TITLE: translate('pop_over_status.file_size_exceed.sub_title'),
},
};
