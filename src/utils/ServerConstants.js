export const AXIOS_DEFAULT_TIMEOUT = window.location.host.includes('workhall.cloud') ? 0 : 30000; // Changed for near prod testing

export const AXIOS_DEFAULT_TIMEOUT_FOR_REPORT_ENGINE = 0; // Changed to 0 to remove timeout for report engine API calls;

export const CALL_EXCLUDE_URLS = ['/signin', '/signup'];

export const SERVER_ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  PAGE_NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SOMETHING_WENT_WRONG: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  URL_NOT_FOUND_ERROR: 1000,
  AXIOS_TIMEOUT: 'ECONNABORTED',
  TOO_MANY_REQUEST: 429,
  UNPROCESSABLE_ENTITY: 422,
  BE_DOMAIN_ALREADY_SIGNED_IN: 1406,
  AUTH_REPORT_DOMAIN_ALREADY_SIGNED_IN: 2406,
  REQUEST_FAILED: 424,
};

export const SERVER_ERROR_CODE_TYPES = {
  INVALID_CREDENTIALS_ERROR: 'InvalidCredentialsError',
  CSRF_TOKEN_ERROR: 'CsrfTokenError',
  AUTH_ERROR: 'AuthorizationError',
  URL_NOT_FOUND: 'UrlNotFoundError',
  INVALID_ACTIVE_SESSION: 'InvalidActiveSessionError',
};

export const ADMIN_BLOCK = 'admin.block';

export const ACTIVE_BLOCK = 'active.block';

export const ERR_CANCELED = 'ERR_CANCELED';

export const COMMON_SERVER_ERROR_TYPES = {
  PUBLISHED_ALREADY: 'already_published',
  INSTANCE_DELETED: 'not_exist',
  DATE_BASE: 'date.base',
  UNAUTHORIZED: 'Unauthorized',
  NOT_EXIST: 'NotExist',
};

export const UNAUTHORIZED_CONTEXT = {
  TASK: 'Unauthorized Task',
};
