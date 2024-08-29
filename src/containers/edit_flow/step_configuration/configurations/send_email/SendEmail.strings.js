import { translate } from 'language/config';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';

export const SEND_EMAIL_STRINGS = {
  AUTOMATED_ACTION: 'Automated Action',
  SYSTEM_FIELD: 'System field',
  FIELD_TYPE: { FORM_FIELD: 'FormField', SYSTEM_FIELD: 'SystemField' },
  CONFIGURE:
    translate('flows.send_email_strings.configure'),
  SEND_EMAIL: translate('flows.send_email_strings.send_email'),
  SEND_EMAIL_INSTRUCTION:
    translate('flows.send_email_strings.send_email_instruction'),
  EMAIL_TO: translate('flows.send_email_strings.email_to'),
  CHOOSE_USER_OR_TEAMS: translate('flows.send_email_strings.choose_users_or_teams'),
  CHOOSE_STEP: translate('flows.send_email_strings.choose_step'),
  CHOOSE_STEP_ID: 'to_recipients_other_step_id',
  CHOOSE_USER_PICKER_FIELD: translate('flows.send_email_strings.choose_user_picker_field'),
  CHOOSE_USER_PICKER_FIELD_ID: 'to_recipients_field_uuid',
  CHOOSE_FIELD: 'flows.send_email_strings.choose_field',
  EMAIL_CC: translate('flows.send_email_strings.email_cc'),
  EMAIL_NAME_LABEL: translate('flows.send_email_strings.email_name_label'),
  EMAIL_NAME_ID: 'email_name',
  EMAIL_NAME_PLACEHOLDER:
  translate('flows.send_email_strings.email_name_placeholder'),
  EMAIL_SUBJECT_LABEL: 'flows.send_email_strings.email_subject_label',
  EMAIL_SUBJECT_ID: 'email_subject',
  EMAIL_SUBJECT_PLACEHOLDER: 'flows.send_email_strings.email_subject_placeholder',
  EMAIL_BODY_ID: 'email_body',
  EMAIL_BODY_LABEL: 'flows.send_email_strings.email_body_label',
  EMAIL_BODY_PLACEHOLDER: 'flows.send_email_strings.email_body_placeholder',
  TO_RECIPIENTS_REQUIRED: translate('flows.send_email_strings.to_recipients_required'),
  RECIPIENT_TYPE: 'recipients_type',
  ACTION_TYPE: 'action_uuid',
  ACTION_TYPE_LABEL:
  translate('flows.send_email_strings.action_type_label'),
  SYSTEM_FIELD_OPTIONS_LIST: (t) => [
    { id: 'identifier', label: t('flows.system_field_options_list.flow_id'), value: 'flow_id', type: 'system' },
    { id: 'initiated_by', label: t('flows.system_field_options_list.created_by'), value: 'created_by', type: 'system' },
    { id: 'initiated_on', label: t('flows.system_field_options_list.created_on'), value: 'created_on', type: 'system' },
    { id: 'completed_by', label: t('flows.system_field_options_list.completed_by'), value: 'completed_by', type: 'system' },
    { id: 'flow_link', label: t('flows.system_field_options_list.flow_link'), value: 'flow_link', type: 'system' },
    { id: 'comments', label: t('flows.system_field_options_list.task_comments'), value: 'task_comments', type: 'system' },
  ],
  SYSTEM_FIELD_LIST: ['identifier', 'initiated_by', 'initiated_on', 'completed_by', 'flow_link', 'flow_link', 'comments', 'flow_id', 'flow_id', 'created_by', 'created_on', 'task_comments'],
  INSERT_FIELD: 'flows.send_email_strings.insert_field',
  ATTACHMENTS: 'flows.send_email_strings.attachments',
  ATTACHMENTS_ID: 'Attachment_id',
  ATTACHMENT_CONTENT: 'flows.send_email_strings.attachment_content',
  ATTACH_FROM_FORM_FIELDS_ID: 'Attachment_form_field_id',
  ATTACH_FROM_FORM_FIELDS_PLACEHOLDER: 'flows.send_email_strings.attach_from_form_field_placeholder',
  ATTACH_FROM_FORM_FIELDS_LABEL: 'flows.send_email_strings.attach_from_form_field_label',
  ATTACHMENT_TOOLTIP: translate('flows.send_email_strings.attachment_tooltip'),
};
export const RECIPIENT_TYPES = {
  DIRECT_RECIPIENT: 'direct_recipient',
  OTHER_STEP_RECIPIENT: 'other_step_recipient',
  RULE_RECIPIENT: 'rule_recipient',
  FORM_FIELD_RECIPIENT: 'form_field_recipient',
};

export const IGNORE_MAIL_FIELD_IMPORT_TYPES = [
  FIELD_TYPE.FILE_UPLOAD,
  FIELD_TYPE.TABLE,
  FIELD_TYPE.INFORMATION,
  FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
  FIELD_TYPE.USER_PROPERTY_PICKER,
];

export const RECIPIENT_TYPE_OPTION_LIST = [
  {
    label: 'Users/Teams',
    value: 'direct_recipient',
  },
  {
    label: 'User who completed any of the previous steps',
    value: 'other_step_recipient',
  },
  {
    label: 'From form',
    value: 'form_field_recipient',
  },
];

export const RECIPIENT_TYPE_FIRST_STEP_OPTION_LIST = [
  {
    label: 'Users/Teams',
    value: 'direct_recipient',
  },
  {
    label: 'From form',
    value: 'form_field_recipient',
  },
];

export default SEND_EMAIL_STRINGS;
