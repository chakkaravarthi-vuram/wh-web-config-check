import { STEP_TYPE } from '../../../../../utils/Constants';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { SYSTEM_FIELDS } from '../../../../../utils/SystemFieldsConstants';
import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';

export const EMAIL_RECIPIENT_TYPE = {
    USERS_OR_TEAMS: 'users_or_teams',
    EMAIL_ADDRESS: 'email_address',
    FORM_FIELDS: 'form_fields',
    SYSTEM_FIELDS: 'system_fields',
    RULE: 'rule',
    FORM_REPORTING_MANAGER_ASSIGNEE: 'form_reporting_manager_recipient',
};

export const EMAIL_ACTIONS_INITIAL_STATE = {
    emailSubject: EMPTY_STRING,
    emailBody: EMPTY_STRING,
    emailAttachments: {
        fieldUuid: [],
        attachmentId: [],
    },
    recipients: [
        {
            recipientsType: EMAIL_RECIPIENT_TYPE.USERS_OR_TEAMS,
        },
    ],
    ccRecipients: [],
    parsedEmailSubject: null,
    parsedEmailBody: null,
};

export const SEND_EMAIL_INITIAL_STATE = {
    flowId: null,
    stepUuid: null,
    _id: null,
    stepName: null,
    coordinateInfo: {
        stepCoordinates: {
            x: 0,
            y: 0,
        },
    },
    stepType: STEP_TYPE.EMAIL_CONFIGURATION,
    stepStatus: DEFAULT_STEP_STATUS,
    isLoadingNodeDetails: true,
    isErrorInLoadingNodeDetails: false,
    emailActions: { ...EMAIL_ACTIONS_INITIAL_STATE },
    dynamicDocLabels: [],
    errorList: {},
    docFieldsList: [],
    userDefinedFields: [],
    systemFieldLabel: EMPTY_STRING,
    userFieldLabels: [],
    systemFieldLabels: [], // selected system field labels
    recipientsErrorList: {},
    ccRecipientsErrorList: {},
    uploadedFiles: [],
    docDetails: {},
    removedDocList: [],
    emailConfigRefUuid: null,
    isSaveClicked: false,
};

export const EMAIL_CONSTANTS = {
    EMAIL_SUBJECT: 'email_subject',
    EMAIL_BODY: 'email_body',
    DIRECT_RECIPIENT: 'direct_recipients',
    CC_RECIPIENTS: 'cc_recipients',
    RECIPIENTS: 'recipients',
    EXTERNAL_RECIPIENT: 'external_recipient',
    RECIPIENTS_FIELD_UUIDS: 'recipients_field_uuids',
    INITIATED_BY: ' created_by',
    PROCESSED_BY: 'completed_by',
    ACCEPTED_BY: 'accepted_by',
    ACCEPTED_ON: 'accepted_on',
    ASSIGNED_TO: 'assigned_to',
    ASSIGNED_ON: 'assigned_on',
    TASK_COMMENTS: 'task_comments',
    DUE_DATE: 'due_date',
    ACTION: 'action',
    COMPLETED_BY: 'completed_by',
    COMPLETED_ON: 'completed_on',
    CREATED_BY: 'created_by',
    CREATED_ON: 'created_on',
    INITIATED_ON: 'created_on',
    PROCESSED_ON: 'completed_on',
    ACTOR_REPORTING_MANAGER: 'actor_reporting_manager',
    USER_DEFINED_FIELD: 'user_defined_field',
    STATUS: 'status',
    FLOW_ID: 'flow_id',
    ATTACHMENT_ID: 'attachment_id',
    ENTITY: 'entity',
    ENTITY_ID: 'entity_id',
    REF_UUID: 'ref_uuid',
    UPLOADED_DOC_METADATA: 'uploaded_doc_metadata',
    REMOVED_DOC_LIST: 'removed_doc_list',
};

export const EMAIL_REQUEST_FIELD_KEYS = {
    EMAIL_ACTIONS: 'email_actions',
};

export const EMAIL_RESPONSE_FIELD_KEYS = {
    CC_RECIPIENTS: 'ccRecipients',
    RECIPIENTS: 'recipients',
    EXTERNAL_RECIPIENT: 'externalRecipient',
    RECIPIENTS_FORM_FIELD: 'recipientsFieldUuids',
    RECIPIENT_SYSTEM_FIELDS: 'recipientsSystemFields',
    EMAIL_ACTIONS: 'emailActions',
    EMAIL_BODY: 'emailBody',
    EMAIL_SUBJECT: 'emailSubject',
};

export const INITIAL_RECIPIENTS_DATA = [
    { recipientsType: EMAIL_RECIPIENT_TYPE.USERS_OR_TEAMS },
];

export const INITIAL_RULE_BASED_RECIPIENTS_DATA = [{
    condition_rule: null,
    ruleRecipient: INITIAL_RECIPIENTS_DATA,
}];

export const MAIL_RECIPIENT_OBJECT_KEYS = {
    type: 'recipientsType',
    userOrTeams: 'directRecipients',
    external: 'externalRecipient',
    formFields: 'recipientsFieldUuids',
    systemFields: 'recipientsSystemFields',
    ruleBased: 'rules',
    ruleBasedRecipient: 'ruleRecipient',
    formReportingManager: 'recipientsFieldUuids',
};

export const MAIL_RECIPIENT_RESPONSE_OBJECT_KEYS = {
    type: 'recipients_type',
    userOrTeams: 'direct_recipients',
    external: 'external_recipient',
    formFields: 'recipients_field_uuids',
    systemFields: 'recipients_system_fields',
    ruleBased: 'rules',
    ruleBasedRecipient: 'rule_recipient',
    formReportingManager: 'recipients_field_uuids',
};

export const ESCALATION_RECIPIENT_OBJECT_KEYS = {
    type: 'recipients_type',
    userOrTeams: 'direct_recipients',
    external: 'external_recipient',
    formFields: 'recipients_field_uuids',
    systemFields: 'recipients_system_fields',
    ruleBased: 'rules',
    ruleBasedRecipient: 'rule_recipient',
    parentKey: 'escalation_recipient',
    formReportingManager: 'recipients_field_uuids',
};

export const EMAIL_FORM_FIELDS = {
        label: 'User Field List',
        value: EMAIL_CONSTANTS.USER_DEFINED_FIELD,
        header: 'User Defined',
        isHeaderWithBg: true,
    };

export const EMAIL_FLOW_SYTEM_FIELDS = [
    {
        ...SYSTEM_FIELDS.INITIATED_BY,
        header: 'System defined',
        isHeaderWithBg: true,
    },
    SYSTEM_FIELDS.PROCESSED_BY,
    SYSTEM_FIELDS.FLOW_ID,
    // SYSTEM_FIELDS.CREATED_BY,
    SYSTEM_FIELDS.CREATED_ON,
    // SYSTEM_FIELDS.INITIATED_ON,
    SYSTEM_FIELDS.PROCESSED_ON,
];

export const INITIAL_ESCALATION_RECIPIENTS_DATA = [
    { recipients_type: EMAIL_RECIPIENT_TYPE.USERS_OR_TEAMS },
];

export const INITIAL_ESCALATION_RULE_BASED_RECIPIENTS_DATA = [{
    condition_rule: null,
    rule_recipient: INITIAL_ESCALATION_RECIPIENTS_DATA,
}];
