// import { translate } from 'language/config';
import { translateFunction } from 'utils/jsUtility';

export const STATIC_VALUE_CONSANTS = (t = translateFunction) => {
 return {
    INPUT_PLACEHOLDER: t('flow_trigger.static_value_constants.input_placeholder'),
    EMAIL_PLACEHOLDER: t('flow_trigger.static_value_constants.email_placeholder'),
    NUMBER_PLACEHOLDER: t('flow_trigger.static_value_constants.number_placeholder'),
    PHONE_PLACEHOLDER: t('flow_trigger.static_value_constants.phone_placeholder'),
    SELECTION_PLACEHOLDER: t('flow_trigger.static_value_constants.selection_placeholder'),
    LINK_PLACEHOLDER: t('flow_trigger.static_value_constants.link_placeholder'),
    FILE_PLACEHOLDER: t('flow_trigger.static_value_constants.file_placeholder'),
    CURRENCY_PLACEHOLDER: t('flow_trigger.static_value_constants.currency_placeholder'),
    INFORMATION: {
        PLACEHOLDER: t('flow_trigger.static_value_constants.input_placeholder'),
        ADD: t('flow_trigger.static_value_constants.information.add_information'),
        EDIT_VIEW: t('flow_trigger.static_value_constants.information.edit_view_information'),
        CANCEL: t('publish_settings.dashboard_settings.metrics.buttons.cancel'),
        SAVE: t('publish_settings.dashboard_settings.metrics.buttons.save'),
        REQUIRED_ERROR: t('flow_trigger.static_value_constants.information.required_error'),
        MAX_LIMIT_ERROR: t('flow_trigger.static_value_constants.information.max_character_error'),
    },
 };
};
