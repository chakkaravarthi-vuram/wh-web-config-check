export const FILTER_TYPES = {
  DATE: {
    EQUAL: 'equals',
    DATE_IN_RANGE: 'inDateRange',
    FROM_DATE_TO_TODAY: 'fromDateToToday',
    BEFORE: 'beforeDate',
    CURRENT_YEAR_TO_DATE: 'yearToDate',
    CURRENT_MONTH: 'currentMonth',
    NEXT_MONTH: 'nextMonth',
    LAST_7_DAYS: 'last7Days',
    LAST_30_DAYS: 'last30Days',
    TODAY: 'today',
    ALL_PAST_DAYS: 'allPastDates',
    ALL_FUTURE_DAYS: 'allFutureDates',
  },
  NUMBER: {
    EQUAL: 'equals',
    BETWEEN: 'between',
    GREATER_THAN: 'gt',
    GREATER_THAN_EQUALS_TO: 'gte',
    LESS_THAN: 'lt',
    LESS_THAN_EQUALS_TO: 'lte',
    NOT_EQUAL_TO: 'notEquals',
    EMPTY: 'isEmpty',
  },
  SINGLE_LINE: {
    EQUAL: 'equals',
    CONTAINS: 'contains',
  },
};

const FILTER_STRINGS = (translate = () => {}) => {
  return {
    BUTTONS: {
      APPLY_FILTER: translate('filter_strings.buttons.apply_filter'),
      APPLY: translate('filter_strings.buttons.apply'),
      CLEAR_FILTERS: translate('filter_strings.buttons.clear_filter'),
      FILTER: translate('filter_strings.buttons.filter'),
      ADD_FILTER: translate('filter_strings.buttons.add_filter'),
      APPLIED: translate('filter_strings.buttons.applied'),
      ADD_NEW: translate('filter_strings.buttons.add_new'),
    },
    SEARCH: {
      ID: 'SearchFormField',
      LABEL: translate('filter_strings.search.label'),
      PLACEHOLDER: translate('filter_strings.search.placeholder'),
    },
    FIELDS: {
      DATE: {
        EQUAL: {
          LABEL: translate('filter_strings.fields.equal'),
          TYPE: FILTER_TYPES.DATE.EQUAL,
        },
        BETWEEN: {
          LABEL: translate('filter_strings.fields.between'),
          TYPE: FILTER_TYPES.DATE.DATE_IN_RANGE,
        },
        FROM_DATE_TO_TODAY: {
          LABEL: translate('filter_strings.fields.date.from_date_to_today'),
          TYPE: FILTER_TYPES.DATE.FROM_DATE_TO_TODAY,
        },
        BEFORE: {
          LABEL: translate('filter_strings.fields.date.before'),
          TYPE: FILTER_TYPES.DATE.BEFORE,
        },
        CURRENT_YEAR_TO_DATE: {
          LABEL: translate('filter_strings.fields.date.current_year_to_date'),
          TYPE: FILTER_TYPES.DATE.CURRENT_YEAR_TO_DATE,
        },
        CURRENT_MONTH: {
          LABEL: translate('filter_strings.fields.date.current_month'),
          TYPE: FILTER_TYPES.DATE.CURRENT_MONTH,
        },
        NEXT_MONTH: {
          LABEL: translate('filter_strings.fields.date.next_month'),
          TYPE: FILTER_TYPES.DATE.NEXT_MONTH,
        },
        LAST_7_DAYS: {
          LABEL: translate('filter_strings.fields.date.last_7_days'),
          TYPE: FILTER_TYPES.DATE.LAST_7_DAYS,
        },
        LAST_30_DAYS: {
          LABEL: translate('filter_strings.fields.date.last_30_days'),
          TYPE: FILTER_TYPES.DATE.LAST_30_DAYS,
        },
        TODAY: {
          LABEL: translate('filter_strings.fields.date.today'),
          TYPE: FILTER_TYPES.DATE.TODAY,
        },
        ALL_PAST_DAYS: {
          LABEL: translate('filter_strings.fields.date.all_past_days'),
          TYPE: FILTER_TYPES.DATE.ALL_PAST_DAYS,
        },
        ALL_FUTURE_DAYS: {
          LABEL: translate('filter_strings.fields.date.all_future_days'),
          TYPE: FILTER_TYPES.DATE.ALL_FUTURE_DAYS,
        },
      },
      NUMBER: {
        EQUAL: {
          LABEL: translate('filter_strings.fields.equal'),
          TYPE: FILTER_TYPES.NUMBER.EQUAL,
        },
        BETWEEN: {
          LABEL: translate('filter_strings.fields.between'),
          TYPE: FILTER_TYPES.NUMBER.BETWEEN,
        },
        GREATER_THAN: {
          LABEL: translate('filter_strings.fields.number.greater_than'),
          TYPE: FILTER_TYPES.NUMBER.GREATER_THAN,
        },
        GREATER_THAN_EQUALS_TO: {
          LABEL: translate(
            'filter_strings.fields.number.greater_than_equals_to',
          ),
          TYPE: FILTER_TYPES.NUMBER.GREATER_THAN_EQUALS_TO,
        },
        LESS_THAN: {
          LABEL: translate('filter_strings.fields.number.less_than'),
          TYPE: FILTER_TYPES.NUMBER.LESS_THAN,
        },
        LESS_THAN_EQUALS_TO: {
          LABEL: translate('filter_strings.fields.number.less_than_equals_to'),
          TYPE: FILTER_TYPES.NUMBER.LESS_THAN_EQUALS_TO,
        },
        NOT_EQUAL_TO: {
          LABEL: translate('filter_strings.fields.number.not_equals_to'),
          TYPE: FILTER_TYPES.NUMBER.NOT_EQUAL_TO,
        },
        EMPTY: {
          LABEL: translate('filter_strings.fields.number.empty'),
          TYPE: FILTER_TYPES.NUMBER.EMPTY,
        },
      },
      SINGLE_LINE: {
        EQUAL: {
          LABEL: translate('filter_strings.fields.equal'),
          TYPE: FILTER_TYPES.SINGLE_LINE.EQUAL,
        },
        CONTAINS: {
          LABEL: translate('filter_strings.fields.single_line.contains'),
          TYPE: FILTER_TYPES.SINGLE_LINE.CONTAINS,
        },
      },
      USER_TEAM_PICKER: {
        LOGGED_IN_USER: {
          DETAILS: {
            label: translate(
              'filter_strings.fields.user_team_picker.logged_in_user.details',
            ),
            value: 'loggedInUser',
          },
        },
        NO_TEAMS_ON_SEARCH: translate('teams.no_search_team_data.title'),
      },
    },
    DATA_FIELDS: translate('filter_strings.data_fields'),
    SYSTEM_FIELDS: translate('filter_strings.system_fields'),
    SEARCH_FIELD: translate('filter_strings.search_field'),
    ADD_FILTER_BUTTONS: {
      DISCARD: translate('filter_strings.add_filter_buttons.discard'),
      APPLY: translate('filter_strings.add_filter_buttons.apply'),
    },
    SYSTEM_FIELD: translate('filter_strings.system_field'),
    DATALIST_FIELD: translate('filter_strings.datalist_field'),
    ERROR_MESSAGES: {
      FIELD_REQUIRED: translate('filter_strings.error_messages.field_required'),
      AT_LEAST_ONE_OPTION: translate(
        'filter_strings.error_messages.at_least_one_option',
      ),
      START_DATE: translate('filter_strings.error_messages.start_date'),
      END_DATE: translate('filter_strings.error_messages.end_date'),
      START_DATE_LESS: translate('filter_strings.error_messages.start_date_less'),
      END_DATE_GREATER: translate('filter_strings.error_messages.end_date_greater'),
      DIFFERENT_DATE: translate('filter_strings.error_messages.different_date'),
      START_NUMBER: translate('filter_strings.error_messages.start_number'),
      END_NUMBER: translate('filter_strings.error_messages.end_number'),
      START_NUMBER_LESS: translate('filter_strings.error_messages.start_number_less'),
      END_NUMBER_GREATER: translate('filter_strings.error_messages.end_number_greater'),
    },
  };
};

export const FILTER_OPTION_VALUES = {
  APPLIED: 'applied',
  ADD_NEW: 'add_new',
};

export const FILTER_OPTIONS = (t) => [
  {
    label: FILTER_STRINGS(t).BUTTONS.APPLIED,
    value: FILTER_OPTION_VALUES.APPLIED,
  },
  {
    label: FILTER_STRINGS(t).BUTTONS.ADD_NEW,
    value: FILTER_OPTION_VALUES.ADD_NEW,
  },
];

export const ONLY_SELECT_NUMBER_FIELD = [FILTER_TYPES.NUMBER.EMPTY];

export const ONLY_SELECT_DATE_FIELD = [
  FILTER_TYPES.DATE.CURRENT_MONTH,
  FILTER_TYPES.DATE.NEXT_MONTH,
  FILTER_TYPES.DATE.LAST_7_DAYS,
  FILTER_TYPES.DATE.LAST_30_DAYS,
  FILTER_TYPES.DATE.TODAY,
  FILTER_TYPES.DATE.ALL_PAST_DAYS,
  FILTER_TYPES.DATE.ALL_FUTURE_DAYS,
];

export const ONLY_SELECT_FIELDS = [
  ...ONLY_SELECT_NUMBER_FIELD,
  ...ONLY_SELECT_DATE_FIELD,
];

export const SINGLE_INPUT_NUMBER_FIELD = [
  FILTER_TYPES.NUMBER.EQUAL,
  FILTER_TYPES.NUMBER.GREATER_THAN,
  FILTER_TYPES.NUMBER.GREATER_THAN_EQUALS_TO,
  FILTER_TYPES.NUMBER.LESS_THAN,
  FILTER_TYPES.NUMBER.LESS_THAN_EQUALS_TO,
  FILTER_TYPES.NUMBER.NOT_EQUAL_TO,
];

export const SINGLE_INPUT_DATE_FIELD = [
  FILTER_TYPES.DATE.EQUAL,
  FILTER_TYPES.DATE.CURRENT_YEAR_TO_DATE,
  FILTER_TYPES.DATE.BEFORE,
  FILTER_TYPES.DATE.FROM_DATE_TO_TODAY,
];

export default FILTER_STRINGS;
