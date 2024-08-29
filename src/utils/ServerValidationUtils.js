const ERROR_TYPE_VALIDATION_ERROR = 'ValidationError';
const ERROR_TYPE_INVALID_CREDENTIALS_ERROR = 'InvalidCredentialsError';
const ERROR_TYPE_INVALID_ENCRYPT_DATA_ERROR = 'InvalidEncryptDataError';
const ERROR_TYPE_INVALID_ENCRYPT_SESSION_ERROR = 'InvalidEncryptSessionError';
const ERROR_TYPE_INVALID_TOKEN_ERROR = 'InvalidTokenError';
const ERROR_TYPE_AUTHORIZATION_ERROR = 'AuthorizationError';
const ERROR_TYPE_URL_NOT_FOUND_ERROR = 'UrlNotFoundError';
const ERROR_TYPE_INVALID_HTTP_METHOD_ERROR = 'InvalidHttpMethodError';
const ERROR_TYPE_UNACCEPTABLE_REQUEST_ERROR = 'UnacceptableRequestError';
const ERROR_TYPE_TOKEN_EXPIRED_ERROR = 'TokenExpiredError';
const ERROR_TYPE_CSRF_TOKEN_ERROR = 'CsrfTokenError';
const ERROR_TYPE_SYNTAX_ERROR = 'SyntaxError';
const ERROR_TYPE_API_CALL_ERROR = 'APICallError';
export const ERROR_TYPE_TRIAL_EXPIRATION_ERROR = 'TrialExpirationError';
const ERROR_TYPE_LIMIT_EXCEEDED_ERROR = 'LimitExceededError';
const ERROR_TYPE_TEST_FLOW_NOT_EXIST = 'TestFlowNotExist';
const ERROR_TYPE_CONFLICT_ERROR = 'ConflictError';
const ERROR_TYPE_CUSTOM = 'custom';
export const ERROR_TYPE_EXIST_ERROR = 'exist';
const ERROR_TYPE_EXPIRED_ERROR = 'expired';
const ERROR_TYPE_BLOCK_UPDATE_ERROR = 'block.update';
const ERROR_TYPE_INVALID_ERROR = 'invalid';
const ERROR_TYPE_INVALID_ACCESS_ERROR = 'invalid_access';
const ERROR_TYPE_MISSING_ERROR = 'missing';
const ERROR_TYPE_NOT_USED_ERROR = 'not_used';
const ERROR_TYPE_NOT_GENERATED_ERROR = 'not_generated';
const ERROR_TYPE_NOT_VERIFIED_ERROR = 'not_verified';
const ERROR_TYPE_DEPENDENCY_ERROR = 'dependency';
const ERROR_TYPE_MIN_USER_LIMIT_ERROR = 'min.user.limit';
const ERROR_TYPE_MIN_LEN_ERROR = 'string.min';
const ERROR_TYPE_MAX_LEN_ERROR = 'string.max';
const ERROR_TYPE_EMAIL_FORMAT_ERROR = 'string.email';
const ERROR_TYPE_PATTERN_NAME_ERROR = 'string.pattern.name';
export const ERROR_TYPE_PATTERN_BASE_ERROR = 'string.pattern.base';
const ERROR_TYPE_INSUFFICIENT_PARAMETER_ERROR = 'any.required';
const ERROR_TYPE_NOT_EXIST_ERROR = 'not_exist';
const ERROR_TYPE_ALLOW_ONLY_ERROR = 'any.allowOnly';
const ERROR_TYPE_PAST_PWD_LIMIT_ERROR = 'past.pwd.limit';
const ERROR_TYPE_ARRAY_UNIQUE_ERROR = 'array.unique';
const ERROR_TYPE_EMPTY_ERROR = 'any.empty';
const ERROR_TYPE_UNKNOWN_PARAM_ERROR = 'object.unknown';
const ERROR_TYPE_NUMBER_MAX = 'number.max';
const ERROR_TYPE_NUMBER_MIN = 'number.min';
const ERROR_TYPE_FILE_INVALID_ERROR = 'file.invalid';
const ERROR_TYPE_DATE_INVALID_ERROR = 'date.invalid';
const ERROR_TYPE_IP_BLOCK_ERROR = 'ip.block';
const ERROR_TYPE_GENERATE_BLOCK_ERROR = 'generate.block';
const ERROR_TYPE_VERIFY_BLOCK_ERROR = 'verify.block';
const ERROR_TYPE_USER_ADMIN_BLOCK_ERROR = 'admin.block';
const ERROR_TYPE_USER_ACTIVE_BLOCK_ERROR = 'active.block';
const ERROR_TYPE_ANY_REQUIRED_ERROR = 'any.required';
const ERROR_TYPE_ARRAY_BASE_ERROR = 'array.base';
const ERROR_TYPE_NUMBER_BASE_ERROR = 'number.base';
const ERROR_TYPE_BOOLEAN_BASE_ERROR = 'boolean.base';
const ERROR_TYPE_STRING_BASE_ERROR = 'string.base';
const ERROR_TYPE_ARRAY_MIN_ERROR = 'array.min';
const ERROR_TYPE_OBJECT_XOR_ERROR = 'object.xor';
export const ERROR_TYPE_STRING_GUID_ERROR = 'string.guid';
const ERROR_TYPE_ALTERNATIVES_MATCH_ERROR = 'alternatives.match';
const ERROR_TYPE_UPDATE_IN_PROGRESS = 'update_in_progress';
const ERROR_TYPE_FLOW_TO_DATALIST_CONFIG_ERROR =
  'proc_datalist.config.error';
export const SOMEONE_EDITING = 'someone_editing';
const ERROR_TYPE_ALREADY_PUBLISHED = 'already_published';
const ERROR_TYPE_TRIGGER_CONFIG_ERROR = 'trigger.config.error';
const ERROR_TYPE_INTEGRATION_ERROR = 'integration.error';
const ERROR_TYPE_TEAM_DEPENDENCY_ERROR = 'team_dependency';
const ERROR_TYPE_FIELD_DEPENDENCY_ERROR = 'field_dependency';
const ERROR_TYPE_FORM_DEPENDENCY_ERROR = 'form_dependency';
const ERROR_TYPE_STEP_DEPENDENCY_ERROR = 'step_dependency';
const ERROR_TYPE_RULE_DEPENDENCY_ERROR = 'rule_dependency';
// const ERROR_CODE_CSRF_TOKEN_ERROR = 'EBADCSRFTOKEN';

function handleError(errorType) {
  switch (errorType) {
    case ERROR_TYPE_VALIDATION_ERROR:
      // Handle ValidationError
      break;
    case ERROR_TYPE_INVALID_CREDENTIALS_ERROR:
      // Handle InvalidCredentialsError
      break;
    case ERROR_TYPE_INVALID_ENCRYPT_DATA_ERROR:
      // Handle InvalidEncryptDataError
      break;
    case ERROR_TYPE_INVALID_ENCRYPT_SESSION_ERROR:
      // Handle InvalidEncryptSessionError
      break;
    case ERROR_TYPE_INVALID_TOKEN_ERROR:
      // Handle InvalidTokenError
      break;
    case ERROR_TYPE_AUTHORIZATION_ERROR:
      // Handle AuthorizationError
      break;
    case ERROR_TYPE_URL_NOT_FOUND_ERROR:
      // Handle UrlNotFoundError
      break;
    case ERROR_TYPE_INVALID_HTTP_METHOD_ERROR:
      // Handle InvalidHttpMethodError
      break;
    case ERROR_TYPE_UNACCEPTABLE_REQUEST_ERROR:
      // Handle UnacceptableRequestError
      break;
    case ERROR_TYPE_TOKEN_EXPIRED_ERROR:
      // Handle TokenExpiredError
      break;
    case ERROR_TYPE_CSRF_TOKEN_ERROR:
      // Handle CsrfTokenError
      break;
    case ERROR_TYPE_SYNTAX_ERROR:
      // Handle SyntaxError
      break;
    case ERROR_TYPE_API_CALL_ERROR:
      // Handle APICallError
      break;
    case ERROR_TYPE_TRIAL_EXPIRATION_ERROR:
      // Handle TrialExpirationError
      break;
    case ERROR_TYPE_LIMIT_EXCEEDED_ERROR:
      // Handle LimitExceededError
      break;
    case ERROR_TYPE_TEST_FLOW_NOT_EXIST:
      // Handle TestFlowNotExist
      break;
    case ERROR_TYPE_CONFLICT_ERROR:
      // Handle ConflictError
      break;
    case ERROR_TYPE_CUSTOM:
      // Handle custom error
      break;
    case ERROR_TYPE_EXIST_ERROR:
      // Handle exist error
      break;
    case ERROR_TYPE_EXPIRED_ERROR:
      // Handle expired error
      break;
    case ERROR_TYPE_BLOCK_UPDATE_ERROR:
      // Handle block update error
      break;
    case ERROR_TYPE_INVALID_ERROR:
      // Handle invalid error
      break;
    case ERROR_TYPE_INVALID_ACCESS_ERROR:
      // Handle invalid access error
      break;
    case ERROR_TYPE_MISSING_ERROR:
      // Handle missing error
      break;
    case ERROR_TYPE_NOT_USED_ERROR:
      // Handle not used error
      break;
    case ERROR_TYPE_NOT_GENERATED_ERROR:
      // Handle not generated error
      break;
    case ERROR_TYPE_NOT_VERIFIED_ERROR:
      // Handle not verified error
      break;
    case ERROR_TYPE_DEPENDENCY_ERROR:
      // Handle dependency error
      break;
    case ERROR_TYPE_MIN_USER_LIMIT_ERROR:
      // Handle min user limit error
      break;
    case ERROR_TYPE_MIN_LEN_ERROR:
      // Handle string min length error
      break;
    case ERROR_TYPE_MAX_LEN_ERROR:
      // Handle string max length error
      break;
    case ERROR_TYPE_EMAIL_FORMAT_ERROR:
      // Handle string email format error
      break;
    case ERROR_TYPE_PATTERN_NAME_ERROR:
      // Handle string pattern name error
      break;
    case ERROR_TYPE_PATTERN_BASE_ERROR:
      // Handle string pattern base error
      break;
    case ERROR_TYPE_INSUFFICIENT_PARAMETER_ERROR:
      // Handle insufficient parameter error
      break;
    case ERROR_TYPE_NOT_EXIST_ERROR:
      // Handle not exist error
      break;
    case ERROR_TYPE_ALLOW_ONLY_ERROR:
      // Handle allow only error
      break;
    case ERROR_TYPE_PAST_PWD_LIMIT_ERROR:
      // Handle past password limit error
      break;
    case ERROR_TYPE_ARRAY_UNIQUE_ERROR:
      // Handle array unique error
      break;
    case ERROR_TYPE_EMPTY_ERROR:
      // Handle empty error
      break;
    case ERROR_TYPE_UNKNOWN_PARAM_ERROR:
      // Handle unknown parameter error
      break;
    case ERROR_TYPE_NUMBER_MAX:
      // Handle number max error
      break;
    case ERROR_TYPE_NUMBER_MIN:
      // Handle number min error
      break;
    case ERROR_TYPE_FILE_INVALID_ERROR:
      // Handle file invalid error
      break;
    case ERROR_TYPE_DATE_INVALID_ERROR:
      // Handle date invalid error
      break;
    case ERROR_TYPE_IP_BLOCK_ERROR:
      // Handle IP block error
      break;
    case ERROR_TYPE_GENERATE_BLOCK_ERROR:
      // Handle generate block error
      break;
    case ERROR_TYPE_VERIFY_BLOCK_ERROR:
      // Handle verify block error
      break;
    case ERROR_TYPE_USER_ADMIN_BLOCK_ERROR:
      // Handle user admin block error
      break;
    case ERROR_TYPE_USER_ACTIVE_BLOCK_ERROR:
      // Handle user active block error
      break;
    case ERROR_TYPE_ANY_REQUIRED_ERROR:
      // Handle any required error
      break;
    case ERROR_TYPE_ARRAY_BASE_ERROR:
      // Handle array base error
      break;
    case ERROR_TYPE_NUMBER_BASE_ERROR:
      // Handle number base error
      break;
    case ERROR_TYPE_BOOLEAN_BASE_ERROR:
      // Handle boolean base error
      break;
    case ERROR_TYPE_STRING_BASE_ERROR:
      // Handle string base error
      break;
    case ERROR_TYPE_ARRAY_MIN_ERROR:
      // Handle array min error
      break;
    case ERROR_TYPE_OBJECT_XOR_ERROR:
      // Handle object XOR error
      break;
    case ERROR_TYPE_STRING_GUID_ERROR:
      // Handle string GUID error
      break;
    case ERROR_TYPE_ALTERNATIVES_MATCH_ERROR:
      // Handle alternatives match error
      break;
    case ERROR_TYPE_UPDATE_IN_PROGRESS:
      // Handle update in progress error
      break;
    case ERROR_TYPE_FLOW_TO_DATALIST_CONFIG_ERROR:
      // Handle flow to datalist config error
      break;
    case SOMEONE_EDITING:
      // Handle someone editing error
      break;
    case ERROR_TYPE_ALREADY_PUBLISHED:
      // Handle already published error
      break;
    case ERROR_TYPE_TRIGGER_CONFIG_ERROR:
      // Handle trigger config error
      break;
    case ERROR_TYPE_INTEGRATION_ERROR:
      // Handle integration error
      break;
    case ERROR_TYPE_TEAM_DEPENDENCY_ERROR:
      // Handle team dependency error
      break;
    case ERROR_TYPE_FIELD_DEPENDENCY_ERROR:
      // Handle field dependency error
      break;
    case ERROR_TYPE_FORM_DEPENDENCY_ERROR:
      // Handle form dependency error
      break;
    case ERROR_TYPE_STEP_DEPENDENCY_ERROR:
      // Handle step dependency error
      break;
    case ERROR_TYPE_RULE_DEPENDENCY_ERROR:
      // Handle rule dependency error
      break;
    // case ERROR_CODE_CSRF_TOKEN_ERROR:
    //   // Handle rule dependency error
    //   break;
    default:
      // Handle unknown error type
      break;
  }
}

handleError(ERROR_TYPE_VALIDATION_ERROR);
