import { APP_MIN_MAX_CONSTRAINT } from '../../../utils/Constants';
import { translateFunction } from '../../../utils/jsUtility';
import { CHARACTERS_STRING, DESCRIPTION_PLACEHOLDER_PART1, NAME_PLACEHOLDER_PART1 } from '../../../utils/strings/CommonStrings';

export const CREATE_APP_STRINGS = (t = translateFunction) => {
    return {
        TITLE: t('app_strings.create_app.title'),
        DESCRIPTION: t('app_strings.create_app.description'),
        APP_NAME: {
            ID: t('app_strings.create_app.app_name.id'),
            LABEL: t('app_strings.create_app.app_name.label'),
            PLACEHOLDER: `${t(NAME_PLACEHOLDER_PART1)} ${APP_MIN_MAX_CONSTRAINT.APP_NAME_MAX_VALUE} ${t(CHARACTERS_STRING)}`,
            EXIST_ERROR: t('app_strings.create_app.app_name.exist_error'),
            ALPHANUMBERIC_ERROR: t('app_strings.create_app.app_name.alpha_name'),
        },
        APP_DESCRIPTION: {
            ID: t('app_strings.create_app.app_description.id'),
            LABEL: t('app_strings.create_app.app_description.label'),
            PLACEHOLDER: `${t(DESCRIPTION_PLACEHOLDER_PART1)} ${APP_MIN_MAX_CONSTRAINT.APP_DESCRIPTION_MAX_VALUE} ${t(CHARACTERS_STRING)}`,
        },
        APP_URL: {
            ID: 'url_path',
            SUB_ID: t('app_strings.create_app.app_url.subId'),
            LABEL: t('app_strings.create_app.app_url.label'),
            EXIST_ERROR: t('app_strings.create_app.app_url.exist_error'),
        },
        APP_ADMINS: {
            ID: t('app_strings.create_app.app_admins.id'),
            LABEL: t('app_strings.create_app.app_admins.label'),
            INVALID_ADMINS_ERROR_MESSAGE: t('app_strings.create_app.app_admins.invalid_admins_error_message'),
        },
        APP_VIEWERS: {
            ID: t('app_strings.create_app.app_viewers.id'),
            LABEL: t('app_strings.create_app.app_viewers.label'),
            INVALID_VIEWER_ERROR_MESSAGE: t('app_strings.create_app.app_viewers.invalid_viewers_error_message'),
        },
        NEXT: t('app_strings.create_app.next'),
        CANCEL: t('app_strings.create_app.cancel'),
        BASIC_SETTINGS: {
            TITLE: t('app_strings.app_tab_headers.edit_basic_details'),
            DISCARD: t('app_strings.text_styling.cancel'),
            SAVE: t('app_strings.app_basic_settings.save'),
        },
        SECURITY_SETTINGS: {
            TITLE: t('app_strings.app_settings.title'),
            DISCARD: t('app_strings.app_settings.discard'),
            SAVE: t('app_strings.app_settings.save'),
        },
        APP_ERROR_MESSAGES: {
            APP_ERROR: t('app_errors.app_error'),
            APP_ERROR_COMPONENT_SUBTEXT: t('app_errors.app_error_component_subtext'),
            APP_ERROR_CONFIG_SUBTEXT: t('app_errors.app_error_config_subtext'),
            PAGE_ERROR: t('app_errors.page_error'),
            PAGE_ERROR_TEAMS_DELETED: t('app_errors.page_error_teams_deleted'),
            PAGE_ERROR_URL_SUBTEXT: t('app_errors.page_error_url_subtext'),
            PAGE_ERROR_MISSING_SUBTEXT: t('app_errors.page_error_missing_subtext'),
            PAGE_ERROR_CONFIG_SUBTEXT: t('app_errors.page_error_config_subtext'),
            ADMIN_ERROR: t('app_errors.error_in_app_admins'),
            VIEWER_ERROR: t('app_errors.error_in_app_viewers'),
            ADMIN_ERROR_SUBTEXT: t('app_errors.error_in_app_admins_subtext'),
            VIEWER_ERROR_SUBTEXT: t('app_errors.error_in_app_viewers_subtext'),
          },
    };
};
