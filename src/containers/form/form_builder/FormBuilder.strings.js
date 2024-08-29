export const SUMMARY_FORM_STRINGS = (t = () => {}) => {
  return {
    SAME_DATA: {
      FLOW: t('individual_entry.config_panel.same_data.flow'),
      DATALIST: t('individual_entry.config_panel.same_data.datalist'),
    },
    CONFIRM_MODEL: {
      MAIN_CONTENT: t(
        'individual_entry.config_panel.same_data.confirm_model_content',
      ),
      FIRST_LIST: '',
      SECOND_LINE: t('someone_is_editing_error.continue_editing'),
      CANCEL_BUTTON: t('someone_is_editing_error.cancel'),
      EDIT_BUTTON: t('someone_is_editing_error.edit_anyway'),
    },
    SELECT_STEP: {
      LABEL: t('individual_entry.config_panel.select_step.label'),
      ALL_STEPS: t('individual_entry.config_panel.select_step.all_steps'),
    },
    TABS: {
      DESIGN_ELEMENTS: t('individual_entry.config_panel.tabs.design_elements'),
      FIELDS: t('individual_entry.config_panel.tabs.fields'),
    },
  };
};
