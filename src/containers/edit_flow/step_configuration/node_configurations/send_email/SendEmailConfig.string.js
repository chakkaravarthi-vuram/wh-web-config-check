import { translateFunction } from '../../../../../utils/jsUtility';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';
import { EMAIL_CONSTANTS, EMAIL_RECIPIENT_TYPE, EMAIL_RESPONSE_FIELD_KEYS } from './SendEmailConfig.constants';

const { EMAIL_ACTIONS, EMAIL_BODY, EMAIL_SUBJECT } = EMAIL_RESPONSE_FIELD_KEYS;

export const SUBJECT_SYSTEM_FIELDS_ALLOWED = [
    EMAIL_CONSTANTS.FLOW_ID,
    EMAIL_CONSTANTS.CREATED_BY,
    EMAIL_CONSTANTS.CREATED_ON,
    EMAIL_CONSTANTS.PROCESSED_BY,
    EMAIL_CONSTANTS.PROCESSED_ON,
    EMAIL_CONSTANTS.STATUS,
];

export const RECIPIENT_STRINGS = (t = translateFunction) => {
    return {
        SEARCH_USER_OR_TEAM: t('flows.send_email_strings.search_user_or_team'),
        NO_USER_TEAM_FOUND: t('flows.send_email_strings.no_user_team_found'),
        ADD_CONDITION: t('join_parallel_paths.common_strings.add_condition'),
        EMAIL_ADDRESS: t('flow_config_strings.recipient_option_list.external_recipient'),
        ERRORS: {
            INVALID_EMAIL: t('flow_config_strings.errors.invalid_email_address'),
            EMAIL_ADDRESS_REQUIRED: t('flow_config_strings.errors.email_address_required'),
        },
    };
};

export const emailSubjectErrorId = `${EMAIL_ACTIONS},${EMAIL_SUBJECT}`;
export const emailBodyErrorId = `${EMAIL_ACTIONS},${EMAIL_BODY}`;

export const EMAIL_LABELS = (t = translateFunction) => {
    return {
        EMAIL_SUBJECT: t('flow_config_strings.send_email_config.email_subject_label'),
        EMAIL_BODY: t('flow_config_strings.send_email_config.email_body_label'),
        INSERT_FIELD: t('flows.send_email_strings.insert_field'),
        SEARCH_FIELD: t('information_widget.insert_field.field_dropdown.search_placeholder'),
        FORM_FIELDS: t('flows.document_generation_strings.editor_strings.form_fields_label'),
        SYSTEM_FIELDS: t('flows.document_generation_strings.editor_strings.system_fields_label'),
    };
};

const SEND_EMAIL_CONFIG_CONSTANTS = (t = translateFunction) => {
    return {
        TITLE: t('flow_strings.step_configuration.send_email.title'),
        ADDON_CONFIG_TITLE: t('flow_strings.step_configuration.send_email.addon_config_title'),
        CHOOSE_FIELD: t('flows.send_email_strings.choose_field'),
        SEARCH_DOCUMENT_FIELDS: t('flows.send_email_strings.search_document_fields'),
        SEND_EMAIL_TAB: [
            {
                labelText: t('flow_strings.step_configuration.send_email.tab.general'),
                value: NODE_CONFIG_TABS.GENERAL,
                tabIndex: NODE_CONFIG_TABS.GENERAL,
            },
            {
                labelText: t('flow_strings.step_configuration.send_email.tab.additional'),
                value: NODE_CONFIG_TABS.ADDITIONAL,
                tabIndex: NODE_CONFIG_TABS.ADDITIONAL,
            },
        ],
        GENERAL: {
            EMAIL_RECIPIENTS: t('flow_strings.step_configuration.send_email.general.email_recipent'),
            TO: t('flow_strings.step_configuration.send_email.general.to'),
            CC: t('flow_strings.step_configuration.send_email.general.cc'),
            EMAIL_CONTENT: t('flow_strings.step_configuration.send_email.general.email_content'),
            MAIL_SUBJECT: t('flow_strings.step_configuration.send_email.general.mail_subject'),
            MAIL_SUBJECT_PLACEHOLDER: t('flow_strings.step_configuration.send_email.general.mail_subject_placeholder'),
            INSERT_FIELD: t('flow_strings.step_configuration.send_email.general.insert_field'),
            MAIL_DESRIPTION: t('flow_strings.step_configuration.send_email.general.mail_description'),
            STATIC_ATTACHMENTS: t('flow_strings.step_configuration.send_email.general.static_attachments'),
            DYNAMIC_ATTACHMENTS: t('flow_strings.step_configuration.send_email.general.dynamic_attachments'),
            DYNAMIC_ATTACHEMNTS_PLACEHOLDER: t('flow_strings.step_configuration.send_email.general.dynamic_attachments_placeholder'),
            USER_STEP_NAME: t('flow_strings.step_configuration.send_email.general.user_step_name'),
            EMAIL_PLACEHOLDER: t('flow_strings.step_configuration.send_email.general.enter_email_placeholder'),
            ADD_RECIPIENTS: t('flow_strings.step_configuration.send_email.general.add_recipients'),
            ADD: t('flow_strings.step_configuration.send_email.general.add'),
            BUTTON_ACTION: t('flow_strings.step_configuration.send_email.general.button_action'),
        },
    };
};

export const RECIPIENTS_TYPE_OPTIONS = (t = translateFunction) => [
    {
        label: t('flow_strings.step_configuration.send_email.general.teams_or_users'),
        value: EMAIL_RECIPIENT_TYPE.USERS_OR_TEAMS,
    }, {
        label: t('flow_strings.step_configuration.send_email.general.enter_email_address'),
        value: EMAIL_RECIPIENT_TYPE.EMAIL_ADDRESS,
    }, {
        label: t('flow_strings.step_configuration.send_email.general.user_fields'),
        value: EMAIL_RECIPIENT_TYPE.FORM_FIELDS,
    },
    {
        label: t('flow_strings.step_configuration.send_email.general.system_fields'),
        value: EMAIL_RECIPIENT_TYPE.SYSTEM_FIELDS,
    },
    {
        label: t('flow_strings.step_configuration.send_email.general.rule_based'),
        value: EMAIL_RECIPIENT_TYPE.RULE,
    },
    {
        label: t('flow_strings.step_configuration.send_email.general.form_reporting_manager'),
        value: EMAIL_RECIPIENT_TYPE.FORM_REPORTING_MANAGER_ASSIGNEE,
    },
];

export {
    SEND_EMAIL_CONFIG_CONSTANTS,
};
