import { getDomainName } from 'utils/jsUtility';
import { store } from '../../../Store';
import { FORM_POPOVER_STATUS } from '../../../utils/Constants';
import { getLogoSize } from '../../../utils/UtilityFunctions';
import { ADMIN_SETTINGS_CONSTANT } from '../AdminSettings.constant';

let A_S_STRINGS =
  store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS
    .ACCOUNT_SETTINGS;

export const getAccountSettingsStrings = () => {
  return {
    ACCOUNT_NAME: {
      ID: 'account_name',
      LABEL: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.ACCOUNT_NAME.LABEL,
      PLACEHOLDER: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.ACCOUNT_NAME.PLACEHOLDER,
    },
    ACCOUNT_DOMAIN: {
      ID: 'account_domain',
      LABEL: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.ACCOUNT_DOMAIN.LABEL,
      PLACEHOLDER: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.ACCOUNT_DOMAIN.PLACEHOLDER,
      SUFFIX: `.${getDomainName(window.location.hostname)}`,
    },
    ACCOUNT_LOGO: {
      ID: 'acc_logo',
      LABEL: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.SUB_TITLE,
      PROPERTY: 'base64',
      ALERT: A_S_STRINGS.ACCOUNT_LOGO_ALERT,
      LINK_LABEL: A_S_STRINGS.ACCOUNT_LOGO_LINK_LABEL,
    },
    ACCOUNT_FAVICON: {
      ID: 'acc_favicon',
      LABEL: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.SUB_TITLE_FAVICON,
      PROPERTY: 'base64',
      ALERT: A_S_STRINGS.ACCOUNT_LOGO_ALERT,
      LINK_LABEL: A_S_STRINGS.ACCOUNT_LOGO_LINK_LABEL,
      INSTRUCTION: 'File size needs to be less than 60KB. Accepted file types: .ico. Ensure that .ico is added to the allowed file types.',
    },
    ACCOUNT_LOGO_URL: {
      ID: 'acc_logo_url',
    },
    ACCOUNT_LOGO_SIZE: {
      VALUE: getLogoSize(),
    },
    ACCOUNT_LOGO_ASPECT: 3 / 1,
    ACCOUNT_LOGO_MIN_WIDTH: 200,
    PRIMARY_COLOR: {
      ID: 'primary_color',
      LABEL: A_S_STRINGS.PRIMARY_COLOR_LABEL,
    },
    SECONDARY_COLOR: {
      ID: 'secondary_color',
      LABEL: A_S_STRINGS.SECONDARY_COLOR_LABEL,
    },
    BUTTON_COLOR: {
      ID: 'button_color',
      LABEL: A_S_STRINGS.BUTTON_COLOR_LABEL,
    },
    SAVE: {
      ID: 'save',
      LABEL: ADMIN_SETTINGS_CONSTANT.COMMON_STRINGS.SAVE,
    },
    CANCEL: {
      ID: 'cancel',
      LABEL: ADMIN_SETTINGS_CONSTANT.COMMON_STRINGS.CANCEL,
    },
    ACCOUNT_DETAILS: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.ACCOUNT_DETAILS,
    BRANDING_AND_THEME: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.TITLE,
    CHANGE_LOGO: A_S_STRINGS.CHANGE_LOGO,
    NOTE: A_S_STRINGS.NOTE,
    SUCCESSFUL_UPDATE: {
      title: A_S_STRINGS.SUCCESSFUL_UPDATE_TITLE,
      subTitle: A_S_STRINGS.SUCCESSFUL_UPDATE_SUBTITLE,
      status: FORM_POPOVER_STATUS.SUCCESS,
      isVisible: true,
    },
    UPDATE_FAILURE: {
      title: A_S_STRINGS.UPDATE_FAILURE_TITLE,
      status: FORM_POPOVER_STATUS.SERVER_ERROR,
      isVisible: true,
    },
    ENABLE_TASK: {
      ENABLE_TASK_ID: 'is_show_app_tasks',
      TITLE: ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.ENABLE_TASK_TITLE,
      DESCRIPTION: ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.ENABLE_TASK_DESCRIPTION,
    },
    ENABLE_TASk_OPTION: [{ label: 'Enable', value: 1 }],

  };
};

export const THEME_MODAL_TITLE = {
  HIGHLIGHT: 'Swatches - Highlight',
  WIDGETBG: 'Swatches - Widget BG',
  BACKGROUND: 'Swatches - Background',
  BUTTON: 'Swatches - Button/Link',
};

export const THEME_COLOR_TYPE = {
  HIGHLIGHT: 'Highlight',
  WIDGET: 'Widget BG',
  BACKGROUND: 'Background',
  BUTTON: 'Button/Link',
};

export const COLOR_THEME_OPTIONS = [
  {
    label: 'Default',
    value: true,
    description: 'Workhall default theme',
  },
  {
    label: 'Custom',
    value: false,
    description: 'Personalise based on your branding',
    // disabled: true,
  },
];

export const HIGHLIGHT_SWATCHES = ['#1A4AC8', '#E48A63', '#E3A343', '#E1D146', '#CBD850', '#69C5A4', '#4A9EE0', '#576AD6', '#844ACE', '#B74FC9', '#E44A7F', '#E3665D'];
export const APP_BG_SWATCHES = ['#EEF1F3', '#FFFFFF', '#ECECD3', '#EEE4D6', '#EBD7DE', '#D4EBEB', '#D2E5D2', '#D9DCE9', '#E3D4E5', '#E5DCE7', '#E9D9DE', '#E8D5D3'];
export const WIDGET_BG_SWATCHES = ['#FFFFFF', '#FFFFEC', '#FFFFED', '#FFF8EE', '#FFF5F9', '#F3FDFD', '#F1FFF1', '#F8F9FF', '#FDF4FE', '#FDF4FF', '#FFF6F9', '#FFF6F5'];
export const BUTTON_SWATCHES = ['#217CF5', '#E48A63', '#E3A343', '#E1D146', '#CBD850', '#69C5A4', '#4A9EE0', '#576AD6', '#844ACE', '#B74FC9', '#E44A7F', '#E3665D'];

export const BUTTON_EDGE_LABEL = 'Field / Button Edge';
export const FONTS_OPTION_LIST = [
  {
    label: 'Inter',
    value: 'inter',
    isCheck: true,
  },
  {
    label: 'Roboto',
    value: 'roboto',
    isCheck: false,
  },
];

export const THEME_ID = {
  HIGHLIGHT: 'highlight',
  WIDGET: 'widgetbg',
  BACKGROUND: 'appbg',
  BUTTON: 'activeColor',
};

export const ADMIN_THEME_TYPE = {
  ID: 'is_default_theme',
  LABEL: 'Theme',
};

export const FONT_FAMILY_LABEL = 'Font Family';
export const ADMIN_THEME_COLORS = {
  LABEL: 'Colors',
  ID: 'admin_theme',
};

export const DEFAULT_FONT_FAMILY = 'inter';
export const DEFAULT_FIELD_EDGE = 'semi-rounded';

export const BUTTON_EDGE_TYPE = [
  {
    label: 'Squared',
    value: 'squared',
  },
  {
    label: 'Semi-Rounded',
    value: 'semirounded',
  },
  {
    label: 'Rounded',
    value: 'rounded',
  },
];

export const INDUSTRY_TYPE = {
  INDUSTRY_TYPE_ID: 'industry_type',
  INDUSTRY_TYPE_LABEL: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.ACCOUNT_INDUSTRY.LABEL,
  INDUSTRY_TYPE_PLACEHOLDER: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.ACCOUNT_INDUSTRY.PLACEHOLDER,
};

export const ACCOUNT_SETTINGS_FORM = getAccountSettingsStrings();

store.subscribe(() => {
  A_S_STRINGS =
    store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS
      .ACCOUNT_SETTINGS;
});

export const FIELD_ERRORS = Object.freeze({
  ACCOUNT_NAME: (t) => {
    return {
    IS_EMPTY: `${t(A_S_STRINGS.ACCOUNT_NAME_LABEL)} ${t(A_S_STRINGS.IS_REQUIRED)}`,
    };
  },
  INDUSTRY_TYPE: (t) => {
    return {
    IS_EMPTY: t(A_S_STRINGS.SELECT_INDUSTRY),
    };
  },
  ACCOUNT_FAVICON: (t) => {
    return {
      IS_EMPTY: `${t(getAccountSettingsStrings().ACCOUNT_FAVICON.LABEL)} ${t(A_S_STRINGS.IS_REQUIRED)}`,
      };
  },
});

export default ACCOUNT_SETTINGS_FORM;
