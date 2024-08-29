import { translateFunction } from '../../../utils/jsUtility';

export const PUBLISH_APP_STRINGS = (t = translateFunction) => {
    return {
        TITLE: t('app_strings.app_settings.title'),
        INHERT_SECURITY: {
            ID: 'is_inherit_from_app',
            OPTION: {
                label: t('app_strings.security.page_security.inherit_app_security_label'),
                value: 'inheritAppSecurity',
            },
        },
        PUBLISH_BUTTON: t('app_strings.publish_app.publish'),
        DISCARD_BUTTON: t('app_strings.publish_app.discard'),
        CANCEL_BUTTON: t('app_strings.publish_app.cancel'),
        SAVE_CLOSE: t('publish_settings.footer_buttons.save_and_close'),
        ARIA_LABELS: {
            CLOSE: 'app_strings.publish_app.close_aria_label',
        },
        MODAL_ID: 'publish_app_modal',
        APP_SECURITY_ID: 'app_security',
    };
};
