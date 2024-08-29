export const DATALIST_ENTRY_ACTIONS = Object.freeze({
  ADD_DATA: 1,
  VIEW_DETAILS: 2,
  ADD_TASKS: 6,
  BULK_UPLOAD: 7,
});

export const DATA_LIST_STRINGS = (translate = () => {}) => {
  return {
    ADD: translate('datalist.datalist_strings.add'),
    EDIT_DATA_LIST: 1,
    BULK_UPLOAD: 2,
    TRUNCATE_ALL_VALUES: 3,
    DASHBOARD: {
      HEADER: {
        ADD_NEW_BUTTON: {
          LABEL: translate(
            'datalist.datalist_strings.dashboard.header.add_new_button',
          ),
        },
      },
    },
  };
};

export const PD_TAB = {
  ALL: {
    TITLE: 'All',
    TAB_INDEX: 1,
  },
  SAVED_SEARCHES: {
    TITLE: 'Saved Searches',
    TAB_INDEX: 2,
  },
  TASKS: {
    TITLE: 'Tasks',
    TAB_INDEX: 3,
  },
};

export const DATA_LIST_WARNING_MESSAGE = {
  TITLE_NAME: 'datalist.data_list_warning_message.title_name',
  MAIN_DESCRIPTION: 'datalist.data_list_warning_message.main_description',
  SUB_DESCRIPTION: 'datalist.data_list_warning_message.sub_description',
  CONFIRMATION_NAME: 'datalist.data_list_warning_message.confirmation_name',
  CANCEL_CONFIRMATION_NAME:
    'datalist.data_list_warning_message.cancel_confirmation_name',
};

export const DATALIST_NO_DATA = (translate) => {
  return {
    title: translate('datalist.datalist_dashboard.datalist_no_data.title'),
    subTitle: translate(
      'datalist.datalist_dashboard.datalist_no_data.sub_title',
    ),
  };
};
