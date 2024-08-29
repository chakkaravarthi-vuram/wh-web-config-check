import { EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import { translateFunction } from '../../../utils/jsUtility';
import { CANCEL_LABEL, EMPTY_STRING, SAVE_LABEL } from '../../../utils/strings/CommonStrings';

export const STATUS_VALIDATION_STRINGS = (t = translateFunction) => {
    return {
        INVALID_STEP_STATUS: t('end_step_configuration_strings.status_validation_strings.invalid_status_string'),
        DUPLICATE_STEP_STATUS: t('end_step_configuration_strings.status_validation_strings.duplicate_status'),
    };
};

export const STEP_STATUS_STRINGS = (t = translateFunction) => {
    return {
        CREATED_TITLE: t('toast_messages.created'),
        CREATED_SUCCESS_SUBTITLE: t('toast_messages.status_dropdown.created_success_subtitle'),
        CREATION_FAILURE_TITLE: t('toast_messages.status_dropdown.creation_failure_title'),
        CREATION_FAILURE_SUBTITLE: t('toast_messages.status_dropdown.creation_failure_subtitle'),
    };
};

export const CONFIG_BUTTON_ARRAY = (onSaveClickHandler, onCloseClick, t = translateFunction) => [
    {
        buttonText: t(CANCEL_LABEL),
        onButtonClick: onCloseClick,
        buttonType: EButtonType.TERTIARY,
        buttonClassName: EMPTY_STRING,
    }, {
        buttonText: t(SAVE_LABEL),
        onButtonClick: onSaveClickHandler,
        buttonType: EButtonType.PRIMARY,
        buttonClassName: EMPTY_STRING,
    },
];

export const NODE_VALIDATION_STRINGS = (t = translateFunction) => {
    return {
        TAB_CHANGE: {
            TITLE: t('flow_strings.step_configuration.validation_errors.tab_change_validation.title'),
            SUBTITLE: t('flow_strings.step_configuration.validation_errors.tab_change_validation.subtitle'),
        },
    };
};

export const STEP_NAME_AND_STATUS_STRINGS = (t = translateFunction) => {
    return {
        TITLE: t('flow_strings.step_configuration.stepNameAndStatus'),
        STEP_NAME: {
            ID: 'stepName',
            LABEL: t('flow_strings.step_configuration.stepName.label'),
            PLACEHOLDER: t('flow_strings.step_configuration.stepName.placeholder'),
        },
        STATUS: {
            ID: 'stepStatus',
            LABEL: t('flow_strings.step_configuration.status.label'),
            CREATE_STATUS: {
                ID: 'newCategory',
                BUTTON_LABEL: t('flow_strings.step_configuration.status.create_status.button_label'),
                STEP_STATUS_LABEL: t('flow_strings.step_configuration.status.create_status.label'),
            },
            SEARCH_STATUS: {
                PLACEHOLDER: t('flow_strings.step_configuration.status.search_status.placeholder'),
                LABEL: t('flow_strings.step_configuration.status.search_status.label'),
                NO_RESULTS: t('teams.no_search_team_data.title'),
            },
        },
    };
};
