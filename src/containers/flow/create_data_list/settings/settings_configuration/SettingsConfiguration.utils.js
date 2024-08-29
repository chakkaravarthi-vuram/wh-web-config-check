// import { translate } from 'language/config';

export const SETTINGS_STRINGS = (translate) => {
   return {
  HEADER: {
    pageTitle: translate('publish_settings.header.page_title'),
    subTitle: translate('publish_settings.header.sub_title'),
  },
  PAGE_HEADERS: {
    SECURITY: translate('publish_settings.page_stepper_strings.security_settings'),
    DASHBOARD: translate('publish_settings.page_stepper_strings.dashboard_settings'),
    ADDON: translate('publish_settings.page_stepper_strings.other_settings'),
  },
  TRIGGER: {
    TITLE: 'Shortcut to Trigger Another Flow',
    SUB_TITLE:
      'Add the key fields to be displayed in the dashboard of this flow',
    CARD_TEXT: {
      // for common component
      ACTIONS: {
        ADD: 'Add Shortcut',
      },
    },
    EDIT_LABEL: 'Edit Trigger Shortcut',
    DELETE_LABEL: 'Delete Trigger Shortcut',
  },
};
};

export const getStepperDetails = (onClick, translate) => [
  {
    text: translate('publish_settings.page_stepper_strings.security_settings'),
    onClick: () => onClick(0),
  },
  {
    text: translate('publish_settings.page_stepper_strings.dashboard_settings'),
    onClick: () => onClick(1),
  },
  {
    text: translate('publish_settings.page_stepper_strings.addon_settings'),
    onClick: () => onClick(2),
  },
];
