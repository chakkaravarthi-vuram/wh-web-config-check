import { ADMIN_SETTINGS_CONSTANT } from 'containers/admin_settings/AdminSettings.constant';
import { LANDING_PAGE_VALIDATION } from '../LandingPageTranslation.strings';

const getAccountDropdownInfo = () => {
    return {
      LANGUAGE: {
        LABEL: LANDING_PAGE_VALIDATION.LANGUAGE_LABEL,
        ID: 'acc_language',
        PLACEHOLDER: LANDING_PAGE_VALIDATION.LANGUAGE_PLACEHOLDER,
      },
      LOCALE_DROPDOWN: {
        LABEL: LANDING_PAGE_VALIDATION.LOCALE_DROPDOWN_LABEL,
        ID: 'acc_locale',
        PLACEHOLDER: LANDING_PAGE_VALIDATION.LOCALE_DROPDOWN_PLACEHOLDER,
      },
      TIMEZONE_DROPDOWN: {
        LABEL: LANDING_PAGE_VALIDATION.TIMEZONE_DROPDOWN_LABEL,
        ID: 'acc_timezone',
        PLACEHOLDER: LANDING_PAGE_VALIDATION.TIMEZONE_DROPDOWN_PLACEHOLDER,
      },
      INDUSTRY_DROPDOWN: {
        LABEL: LANDING_PAGE_VALIDATION.INDUSTRY_DROPDOWN_LABEL,
        ID: 'industry',
        PLACEHOLDER: LANDING_PAGE_VALIDATION.INDUSTRY_DROPDOWN_PLACEHOLDER,
      },
      COUNTRY: {
        LABEL: LANDING_PAGE_VALIDATION.COUNTRY_LABEL,
        ID: 'country',
        PLACEHOLDER: LANDING_PAGE_VALIDATION.COUNTRY_PLACEHOLDER,
      },
    };
};

export const ACCOUNT_DROPDOWN_STRING = getAccountDropdownInfo();

export const ACCOUNT_INFO_STRINGS = {
    TITLE: 'sign_up.account_info_strings.title',
    DESCRIPTION: 'sign_up.account_info_strings.description',
    ACCOUNT_SETTING: 'sign_up.account_info_strings.account_setting',
    WORKHALL_URL: 'sign_up.account_info_strings.workhall_url',
    COMPANY_NAME: LANDING_PAGE_VALIDATION.COMPANY_NAME,
    COMPANY_NAME_ID: 'company_name',
    COMPANY_NAME_PLACEHOLDER: 'sign_up.account_info_strings.company_name_placeholder',
    COMPANY_LOGO: LANDING_PAGE_VALIDATION.COMPANY_LOGO,
    COMPANY_LOGO_ID: 'company_logo',
    FILE_UPLOAD_INFO_1: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.INSTRUCTION_MESSAGE_1,
    FILE_UPLOAD_INFO_2: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.INSTRUCTION_MESSAGE_2,
    FILE_UPLOAD_INFO_3: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.INSTRUCTION_MESSAGE_3,
    FILE_UPLOAD_INFO_4: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.INSTRUCTION_MESSAGE_4,
    FILE_UPLOAD_INFO_5: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.INSTRUCTION_MESSAGE_5,
    FILE_ACCEPTED_TYPE: 'admin_settings.account_settings.account_info_modal.file_accepted_type',
    LANGUAGE_TIMEZONE: 'sign_up.account_info_strings.language_timezone',
    SAVE_BUTTON: 'sign_up.account_info_strings.save_button',
    SIGN_OUT: 'sign_up.account_info_strings.sign_out',
    PREFIX: 'https://',
    SUFFIX: '.workhall.io',
};
