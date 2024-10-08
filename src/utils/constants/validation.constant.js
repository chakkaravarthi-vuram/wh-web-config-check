import { translate } from '../../language/config';

export const UNSAFE_NUMBER_MESSAGE = {
  'number.unsafe': 'Number maximum Integer limit exceeded. Please enter a smaller number',
};

export const dummyText = 'dummy';

export const VALIDATION_CONSTANT = {
  PASSWORD_REQUIRED: 'validation_constants.messages.password_required',
  STEP_ACTOR_INVALID: 'error_popover_status.invalid_users_teams',
  STEP_ACTOR_REQUIRED: 'validation_constants.messages.step_actor_required',
  STEP_ACTOR_CONFIGURATION: 'validation_constants.messages.step_actor_configuration',
  ESCALATION_RECIPIENT_CONFIGURATION: 'validation_constants.messages.escalation_recipient_configuration',
  RECIPIENT_CONFIGURATION: 'validation_constants.messages.recipient_configuration',
  INITIATORS_CONFIGURATION: 'validation_constants.messages.initiators_configuration',
  WAIT_NODE_CONFIGURATION: 'validation_constants.messages.wait_node_configuration',
  BRANCH_CONFIG: 'validation_constants.messages.branch_config',
  JOIN_CONFIG: 'validation_constants.messages.join_config',
  UPDATE_DL_CONFIG: 'validation_constants.messages.update_dl_config',
  EMAIL_CONFIGURATION: 'validation_constants.messages.email_config',
  INTEGRATION_CONFIG: 'validation_constants.messages.integration_config',
  ML_INTEGRATION_CONFIG: 'validation_constants.messages.ml_integration_config',
  CALL_SUB_FLOW_CONFIG: 'validation_constants.messages.call_sub_flow_config',
  DATA_MANIPULATOR_CONFIG: 'validation_constants.messages.data_manipulator_config',
  DOCUMENT_GENERATE_CONFIG: 'validation_constants.messages.document_generation',
  OPTIONS_REQUIRED: 'validation_constants.messages.options_required',
  CURRENCY_DEFAULT_VALUE_REQUIRED: 'validation_constants.messages.currency_default_value_required',
  IS_REQUIRED: 'validation_constants.utility_constant.is_required',
  ATLEAST_ONE_ALPHABET_OR_NUMBER_REQUIRED: 'validation_constants.messages.atleast_one_alphabet_or_number_required',
  INVALID_PASSWORD: 'validation_constants.messages.invalid_password',
  MUST_BE_ONLY_CHARACTERS: 'validation_constants.utility_constant.must_be_only_characters',
  SPECIAL_CHARACTERS_NOT_ALLOWED: 'validation_constants.utility_constant.special_characters_not_allowed',
  PASSWORD_MISMATCH: 'validation_constants.messages.Password_mismatch',
  ATLEAST_ONE_STEP_REQUIRED: 'validation_constants.messages.atleast_one_step_required',
  ATLEAST_ONE_TEAM_MEMBER_REQUIRED: 'validation_constants.messages.atleast_one_team_member_required',
  ASSIGN_ONE_USER_OR_TEAM_FOR_TASK: 'validation_constants.messages.assign_one_user_or_team_for_task',
  ATLEAST_ONE_ACTOR_REQUIRED: 'validation_constants.messages.atleast_one_actor_required',
  ATLEAST_ONE_VIEWER_REQUIRED: 'validation_constants.messages.atleast_one_viewer_required',
  ATLEAST_ONE_OWNER_REQUIRED: 'validation_constants.messages.atleast_one_owner_required',
  ATLEAST_ONE_ADDER_REQUIRED: 'validation_constants.messages.atleast_one_adder_required',
  SAME_NEW_PASSWORD: 'validation_constants.messages.same_new_password',
  GREATER_THAN_OR_EQUAL_TO_ONE: 'validation_constants.utility_constant.greater_than_or_equal_to_one',
  HOLD_DUPLICATE: 'validation_constants.utility_constant.hold_duplicate',
  GREATER_THAN_START_TIME: 'validation_constants.utility_constant.greater_than_start_time',
  DOMAIN_VALIDATION: 'validation_constants.utility_constant.domain_validation',
  VALID_EMAIL: 'validation_constants.utility_constant.valid_email',
  VALID_LINK: 'validation_constants.utility_constant.valid_link',
  DUPLICATE_VALUE: 'validation_constants.messages.duplicate_value',
  MUST_BE_ONE_OF: 'validation_constants.utility_constant.must_be_one_of',
  VALID_TEAMS_OR_USERS: 'validation_constants.messages.contains_valid_teams_or_users',
  MUST_BE_ATLEAST: 'validation_constants.utility_constant.must_be_atleast',
  MUST_BE_LESS_THAN_OR_EQUAL: 'validation_constants.utility_constant.must_be_less_than_or_equal',
  MUST_BE_GREATER_THAN_OR_EQUAL: 'validation_constants.utility_constant.greater_tha',
  DIGITS_LONG: 'validation_constants.utility_constant.digits_long',
  CHARACTERS_LONG: 'validation_constants.utility_constant.characters_long',
  DIGITS: 'validation_constants.utility_constant.digits',
  CUSTOM_EMAIL_VALIDATION: 'validation_constants.messages.custom_email_validation',
  CUSTOM_VALID_LINK: 'validation_constants.messages.custom_valid_link',
  CUSTOM_VALID_EMAIL: 'validation_constants.messages.custom_valid_email',
  NO_COMPLETE_TASK: 'validation_constants.server_error_constant.no_complete_task',
  NO_SELF_TASK: 'validation_constants.server_error_constant.no_self_task',
  NO_ASSIGN_TO_OTHERS_TASK: 'validation_constants.server_error_constant.no_assigned_to_others_task',
  NO_OPEN_TASK: 'validation_constants.server_error_constant.no_open_task',
  ATLEAST_ONE_FORM_FIELD: 'validation_constants.server_error_constant.atleast_one_form_field',
  BUTTON_ACTION_DETAILS_REQUIRED: 'validation_constants.server_error_constant.button_action_details_required',
  FORWARD_BUTTON_ACTION_CONFIGURATION: 'validation_constants.server_error_constant.forward_button_action_configuration',
  FAILURE_BUTTON_ACTION_CONFIGURATION: 'validation_constants.server_error_constant.failure_button_action_configuration',
  CONNECTING_STEP_REQUIRED: 'validation_constants.server_error_constant.connectimg_step_required',
  CHILD_FLOW_DELETED: 'validation_constants.server_error_constant.child_flow_deleted',
  DATA_LIST_DELETED: 'validation_constants.server_error_constant.data_list_deleted',
  INTEGRATION_EVENT_DELETED: 'validation_constants.server_error_constant.integration_event_deleted',
  INTEGRATION_DELETED: 'validation_constants.server_error_constant.integration_deleted',
  UNIQUE_ACTION_LABELS: 'validation_constants.server_error_constant.unique_action_labels',
  STEP_BUTTON_ACTION_MISSING: 'validation_constants.server_error_constant.step_button_action_missing',
  EMAIL_ACTION_MISSING: 'validation_constants.server_error_constant.email_action_missing',
  INVALID_EMAIL_RECIPIENT: 'validation_constants.server_error_constant.invalid_email_recipient',
  INVALID_ESCALATION_RECIPIENT: 'validation_constants.server_error_constant.invalid_escalation_recipient',
  Document_GENERATION_ACTION_MISSING: 'validation_constants.server_error_constant.document_generation_action_missing',
  SEND_DATA_TO_DATALIST_ACTION_MISSING: 'validation_constants.server_error_constant.send_data_to_datalist_action_missing',
  FIELDS_DELETED: 'validation_constants.server_error_constant.fields_deleted',
  SAVE_FLOW_FAILED: 'validation_constants.server_error_constant.save_flow_failed',
  STEP_NAME_EXIST: 'validation_constants.server_error_constant.step_name_exist',
  NOT_FLOW_STEP: 'validation_constants.server_error_constant.not_flow_step', // unused
  TASK_DISCARD_CONFIRMATION: 'validation_constants.server_error_constant.task_discard_confirmation',
  CLOSE_CONFIRMATION: 'validation_constants.server_error_constant.close_confirmation',
  CHANGES_SAVED_AS_DRAFT: 'validation_constants.server_error_constant.changes_saved_as_draft',
  SAVE_CURRENT_CHANGES: 'validation_constants.server_error_constant.save_current_changes',
  INVALID_FILE: 'validation_constants.server_error_constant.invalid_file',
  FILE_MISMATCH: 'validation_constants.server_error_constant.file_type_not_match',
  ALLOWED_TYPES: 'validation_constants.server_error_constant.allowed_types',
  ALLOWED_SPECIFIC_FILE_TYPES: 'validation_constants.server_error_constant.specific_allowed_file_types',
  FILE_SIZE_EXCEED: 'validation_constants.server_error_constant.file_size_exceed',
  LESS_FILE_SIZE: 'validation_constants.server_error_constant.less_file_size',
  MB: 'validation_constants.utility_constant.mb',
  MISSING_REQUIRED_FIELD: 'validation_constants.server_error_constant.missing_required_field',
  ADD_ROW: 'validation_constants.utility_constant.add_row', // unused
  YES: 'validation_constants.utility_constant.yes',
  NO: 'validation_constants.utility_constant.no',
  VALID_LINK_TEXT: 'validation_constants.messages.valid_link_text',
  VALID_EMAIL_TEXT: 'validation_constants.messages.valid_email_text',
  LENGTH_MUST_BE_LESS_THAN_OR_EQUAL: 'validation_constants.utility_constant.length_must_be_less_or_equal',
  LENGTH_MUST_BE_ATLEAST: 'validation_constants.utility_constant.length_must_be_atleast',
  SEND_DATALIST_FIELDS_DELETED: 'validation_constants.server_error_constant.send_datalist_fields_deleted',
  INVALID: 'validation_constants.utility_constant.invalid',
  INVALID_CHARACTERS: 'validation_constants.utility_constant.invalid_characters',
  MAXIMUM_FILE_SIZE: 'validation_constants.utility_constant.maximum_file_size',
  DATA_LIST_SELECTOR_FIELDS_DELETED: 'validation_constants.server_error_constant.datalist_selector_fields_deleted',
  DATA_LIST_PROPERTY_PICKER_FIELD_DELETED: 'validation_constants.server_error_constant.datalist_property_picker_field_deleted',
  ERROR_IN_FORM_CONFIG: 'validation_constants.server_error_constant.error_in_form_configuration',
  INSTRUCTION: translate('form_field_strings.other_config.instruction.instruction_label'),
  PLACEHOLDER: translate('form_field_strings.other_config.placeholder'),
  HELPER_TOOL_TIP: translate('form_field_strings.other_config.helper_tool_tip_label'),
  ATLEAST_ONE_ITEMS: 'form_field_strings.other_config.instruction.atleast_one_items',
};
