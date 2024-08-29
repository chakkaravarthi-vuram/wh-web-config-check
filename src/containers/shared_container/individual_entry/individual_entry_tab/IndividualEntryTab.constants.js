const INDIVIDUAL_ENTRY_TABS_STRINGS = (t = () => {}) => {
  return {
    PAGE_OPTIONS: t('individual_entry.tab_builder.page_options'),
    CREATE_CUSTOM_PAGE: t('individual_entry.tab_builder.create_custom_page'),
    MAX_CUSTOM_ERROR: t('individual_entry.tab_builder.max_custom_error'),
    ENABLE_SYSTEM_PAGE: t('individual_entry.tab_builder.enable_system_page'),
    SYSTEM_PAGE: t('individual_entry.tab_builder.system_page'),
    PAGES: {
      TASKS: t('individual_entry.tab_builder.pages.tasks'),
      NOTES_REMAINDERS: t(
        'individual_entry.tab_builder.pages.notes_remainders',
      ),
      NOTES: t('individual_entry.tab_builder.pages.notes'),
      USER_SYSTEM_ACTION: t(
        'individual_entry.tab_builder.pages.user_system_action',
      ),
      DATA_AUDIT: t('individual_entry.tab_builder.pages.data_audit'),
      EXECUTION_SUMMARY: t(
        'individual_entry.tab_builder.pages.execution_summary',
      ),
    },
    BUTTONS: {
      ADD_PAGE: t('individual_entry.tab_builder.page_settings.add_page'),
      APPLY: t('common_strings.apply'),
      SAVE: t('common_strings.save'),
      CANCEL: t('common_strings.cancel'),
    },
    PAGE_SETTINGS: {
      TITLE: t('individual_entry.tab_builder.page_settings.title'),
      PAGE_NAME: {
        LABEL: t('individual_entry.tab_builder.page_settings.page_name.label'),
        PLACEHOLDER: t(
          'individual_entry.tab_builder.page_settings.page_name.placeholder',
        ),
      },
      PAGE_SECURITY: {
        LABEL: t('individual_entry.tab_builder.page_settings.page_security.label'),
        CUSTOMIZE: t('individual_entry.tab_builder.page_settings.page_security.customize'),
        DESC: {
          FIRST: t('individual_entry.tab_builder.page_settings.page_security.desc.first'),
          SECOND: t('individual_entry.tab_builder.page_settings.page_security.desc.second'),
        },
      },
      PAGE_VIEWERS: t(
        'individual_entry.tab_builder.page_settings.page_viewers',
      ),
    },
  };
};

export default INDIVIDUAL_ENTRY_TABS_STRINGS;
