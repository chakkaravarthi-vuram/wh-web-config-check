import { translateFunction } from '../../../utils/jsUtility';

export const APP_SECURITY_STRINGS = (t = translateFunction) => {
    return {
        TITLE: t('app_strings.app_settings.title'),
        APP_ADMINS: {
            ID: t('app_strings.create_app.app_admins.id'),
            LABEL: t('app_strings.create_app.app_admins.label'),
        },
        CONTINUE: t('app_strings.create_app.continue'),
        DISCARD: t('app_strings.create_app.discard'),
        APP_ADMINS_REQUIRED: t('app_strings.app_security.app_admins_required'),
        APP_VIEWERS_REQUIRED: t('app_strings.app_security.app_viewers_required'),
        PAGE_VIEWERS_REQUIRED: t('app_strings.app_security.page_viewer_required'),
    };
};
