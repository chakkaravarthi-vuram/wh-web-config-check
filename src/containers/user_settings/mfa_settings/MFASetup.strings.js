import { t } from 'i18next';
import { ALLOWED_MFA_METHOD } from '../../mfa/mfa_authentication_methods/MfaAuthenticationMethods.constants';

export const MFA_STRINGS = {
    TITLE: 'mfa.title',
    DESCRIPTION: 'mfa.description',
    TOTP_DESCRIPTION: 'mfa.totp_description',
    EOTP_DESCRIPTION: 'mfa.eotp_description',
    MFA_STATUS_TITLE: 'mfa.mfa_status_title',
    MFA_STATUS_DISABLED_TEXT: 'mfa.mfa_status_disabled_text',
    MFA_STATUS_ENABLED_TEXT: 'mfa.mfa_status_enabled_text',
    MFA_STATUS_ACTIVATED: 'mfa.mfa_status_activated',
    MFA_STATUS_IN_ACTIVATED: 'mfa.mfa_status_in_activated',
    ENABLE_MFA_BTN_TEXT: 'mfa.enable_mfa_btn_text',
    DISABLE_MFA_BTN_TEXT: 'mfa.disable_mfa_btn_text',
    CANCEL_BTN_TEXT: 'mfa.cancel_btn_text',
    MFA_TOOLTIP_CONTENT: 'mfa.mfa_tooltip_content',
    ENABLE_MFA: {
        GROUP_NAME: 'mfa_method',
        AUTHENTICATION_METHOD_LABEL: 'mfa.authentication_method_label',
        ID: 'mfa_method',
    },
    DISABLE_MFA: {
        DISABLE_MFA_MODAL_CONTENT_LINE1: 'mfa.reset_mfa_string.modal_content_line1',
        DISABLE_MFA_MODAL_CONTENT_LINE2: 'mfa.reset_mfa_string.modal_content_line2',
        DISABLE_MFA_MODAL_DISABLE_BTN_TEXT: 'mfa.reset_mfa_string.modal_content_disable_btn',
        DISABLE_MFA_MODAL_CANCEL_BTN_TEXT: 'mfa.reset_mfa_string.modal_content_cancel_btn',
    },
    MFA_POPOVER_MESSAGE: {
        USER_ENABLE_DISABLE_SUCCESS_TITLE: 'mfa.mfa_popover_strings.user_enable_disable_success_title',
        USER_ENABLE_DISABLE_SUCCESS_SUBTITLE: 'mfa.mfa_popover_strings.user_enable_disable_success_subtitle',
        USER_ENABLE_DISABLE_ERROR_TITLE: 'mfa.mfa_popover_strings.user_enable_disable_error_title',
        VERIFY_MFA_SUCCESS_TITLE: 'mfa.mfa_popover_strings.verify_mfa_success_title',
        VERIFY_MFA_SUCCESS_ENABLE_SUBTITLE: 'mfa.mfa_popover_strings.verify_mfa_success_enable_subtitle',
        VERIFY_MFA_SUCCESS_DISABLE_SUBTITLE: 'mfa.mfa_popover_strings.verify_mfa_success_disable_subtitle',
        VERIFY_MFA_ERROR_TITLE: 'mfa.mfa_popover_strings.verify_mfa_error_title',
        VERIFY_MFA_ERROR_SUBTITLE: 'mfa.mfa_popover_strings.verify_mfa_error_subtitle',
        MFA_CODES: {
            CODE: 'mfa.mfa_popover_strings.mfa_codes.code',
            URL: 'mfa.mfa_popover_strings.mfa_codes.url',
        },
    },
    MFA_AUTHENTICATION_METHOD_RADIO: {
        OPTION_LIST: [
            {
                label: t('mfa.mfa_method.totp_method'),
                value: ALLOWED_MFA_METHOD.ALLOWED_MFA_METHOD_ID.TOTP_METHOD,
            },
            {
                label: t('mfa.mfa_method.email_otp_method'),
                value: ALLOWED_MFA_METHOD.ALLOWED_MFA_METHOD_ID.EMAIL_OTP_METHOD,
            },
        ],
    },
    MFA_OTP_TIMER: '30',
};
