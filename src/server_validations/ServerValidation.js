import { translateFunction } from 'utils/jsUtility';
import {
  EMPTY_STRING,
  SERVER_ERROR_CODE_STRINGS,
  NETWORK_ERROR,
  VALIDATION_ERROR_TYPES,
  SERVER_ERROR_CODE_TYPE_STRINGS,
} from '../utils/strings/CommonStrings';
import { SERVER_ERROR_CODES, ADMIN_BLOCK, ACTIVE_BLOCK, COMMON_SERVER_ERROR_TYPES } from '../utils/ServerConstants';
import { BLOCK_GENERATE_OTP, VERIFY_BLOCK_OTP, IP_BLOCK } from '../containers/sign_up/SignUp.strings';
import { hasOwn, snakeCaseToSentenceCase } from '../utils/UtilityFunctions';
import { VALIDATION_CONSTANT } from './serverValidation.constant';

export const getCommonServerError = (server_error) => {
  if (server_error.data && server_error.data.errors && server_error.data.errors[0] && server_error.data.errors[0].type) {
    if (SERVER_ERROR_CODE_TYPE_STRINGS[server_error.data.errors[0].type]) {
      return SERVER_ERROR_CODE_TYPE_STRINGS[server_error.data.errors[0].type];
    } else if (server_error.data.errors[0].message) {
      return server_error.data.errors[0].message;
    }
    return server_error.data.errors[0].type;
  }
  return SERVER_ERROR_CODE_STRINGS[server_error.status];
};

export const getCommonServerErrorFromType = (type, field, t = translateFunction) => {
  switch (type) {
    case ADMIN_BLOCK:
      if (field === 'user_type') return t(VALIDATION_CONSTANT.ADMIN_USER_TYPE);
      if (field === 'is_active') return t(VALIDATION_CONSTANT.ADMIN_IS_ACTIVE);
      break;
    case ACTIVE_BLOCK:
      if (field === 'is_billing_owner') return t(VALIDATION_CONSTANT.IS_BILLING_OWNER);
      break;
    case COMMON_SERVER_ERROR_TYPES.PUBLISHED_ALREADY:
      return t(VALIDATION_CONSTANT.ALREADY_PUBLISHED);
    case COMMON_SERVER_ERROR_TYPES.INSTANCE_DELETED:
      if ((field === 'email') || (field === 'username_or_email') || (field === 'username')) {
        return EMPTY_STRING;
      } else {
        return t(VALIDATION_CONSTANT.INSTANCE_DELETED);
      }
    case COMMON_SERVER_ERROR_TYPES.DATE_BASE:
      if (field === 'due_date') return t(VALIDATION_CONSTANT.INVALID_DUE_DATE);
      break;
    default:
      return EMPTY_STRING;
  }
  return EMPTY_STRING;
};

const getFieldOnlyString = (field, t = translateFunction) => {
  if (field === 'confirm_password') {
    return t(VALIDATION_CONSTANT.PASSWORD_NOT_MATCH);
  } return t(VALIDATION_CONSTANT.SELECT_FROM_CURRENT_LIST);
};

export const generateMessageFromType = (type, label, limit, field = null, t = translateFunction) => {
  console.log('generateMessageFromType', type, label, limit, field);
  switch (type) {
    case VALIDATION_ERROR_TYPES.EXIST:
      // if (field === 'data_list_name') return `${VALIDATION_CONSTANT.DATALIST_NAME} ${VALIDATION_CONSTANT.ALREADY_EXIST}`;
      return `${label} ${t(VALIDATION_CONSTANT.ALREADY_EXIST)}`;
    case VALIDATION_ERROR_TYPES.NOT_EXIST:
      return `${label} ${t(VALIDATION_CONSTANT.NOT_EXIST)}`;
    case VALIDATION_ERROR_TYPES.INVALID_EMAIL:
      return `${label} ${t(VALIDATION_CONSTANT.VALID_EMAIL)}`;
    case VALIDATION_ERROR_TYPES.REQUIRED:
      return `${label} ${t(VALIDATION_CONSTANT.REQUIRED)}`;
    case VALIDATION_ERROR_TYPES.MINIMUM:
      return `${label} ${t(VALIDATION_CONSTANT.MIN_OF)} ${limit} ${t(VALIDATION_CONSTANT.CHARACTERS)}`;
    case VALIDATION_ERROR_TYPES.MAXIMUM:
      return `${label} ${t(VALIDATION_CONSTANT.MAX_OF)} ${limit} ${t(VALIDATION_CONSTANT.CHARACTERS)}`;
    case VALIDATION_ERROR_TYPES.NUMBER_MAX:
      return `${label} ${t(VALIDATION_CONSTANT.MAX_OF)} ${limit}`;
    case VALIDATION_ERROR_TYPES.REGEX:
      if (field === 'email') return `${label} ${t(VALIDATION_CONSTANT.VALID_EMAIL)}`;
      else if (field === 'flow_name' || field === 'data_list_name' || field === 'task_name') return t('app_strings.create_app.app_name.alpha_name');
      return `${t(VALIDATION_CONSTANT.INVALID)} ${label}`;
    case VALIDATION_ERROR_TYPES.INVALID:
      if (field.includes('step_assignees')) {
        return field;
        // return !isEmpty(indexes) ? `${field}.indexes-${indexes.join('-')}` : 'Invalid Step Assignees';
      }
      if (field.includes('.users')) return t(VALIDATION_CONSTANT.INVALID_REPORTING_MANAGER);
      return `${t(VALIDATION_CONSTANT.INVALID)} ${label}`;
    case VALIDATION_ERROR_TYPES.INTEGER:
      return `${label} ${t(VALIDATION_CONSTANT.MUST_BE_AN_INTEGER)}`;
    case VALIDATION_ERROR_TYPES.USED_PASSWORD:
      return t(VALIDATION_CONSTANT.PASSWORD_ALREADY_USED);
    case BLOCK_GENERATE_OTP:
      return t(VALIDATION_CONSTANT.BLOCK_GENERATE_OTP);
    case VERIFY_BLOCK_OTP:
      return t(VALIDATION_CONSTANT.VERIFY_BLOCK_OTP);
    case IP_BLOCK:
      return t(VALIDATION_CONSTANT.IP_BLOCK);
    case VALIDATION_ERROR_TYPES.DATE_LESS:
      return `${label} ${t(VALIDATION_CONSTANT.DATE_LESS)}`;
    case VALIDATION_ERROR_TYPES.STRING_EMPTY:
      return `${label} ${t(VALIDATION_CONSTANT.IS_REQUIRED)}`;
    case VALIDATION_ERROR_TYPES.ONLY:
      return field ? getFieldOnlyString(field, t) : '';
    case VALIDATION_ERROR_TYPES.UNIQUE:
      return `${field} ${t(VALIDATION_CONSTANT.UNIQUE)}`;
    default:
      return EMPTY_STRING;
  }
};

export const generateError = (error_server, state_error, labels, splitLabel, isIntegrationStep = false, t = translateFunction) => {
  const error_state = state_error;
  let dependencyError = null;
  if (error_server.response) {
    const server_response = error_server.response;
    // Error on fields from server
    if (server_response.status === SERVER_ERROR_CODES.VALIDATION_ERROR) {
      if (server_response.data && server_response.data.errors) {
        server_response.data.errors.forEach((data) => {
          if (data.field) {
            const keys = data.field.split('.') || [];
            const key = (keys[0] === 'steps') ? data.field : keys[0];
            error_state[key] = generateMessageFromType(
              data.type,
              ((data.type === 'string.min') && (data.field === 'data_list_name')) ? t(VALIDATION_CONSTANT.DATALIST_NAME) : labels[data.field] || (splitLabel && labels[data.field.split('.').pop()]) || snakeCaseToSentenceCase(data.field), // if params label not exist, it takes field name as label
              data.limit,
              data.field,
              t,
            );
            if (isIntegrationStep) {
              if (key === 'field_id') dependencyError = data.values;
            }
          }
          return null;
        });
      } else return null;
      return {
        common_server_error: getCommonServerErrorFromType(
          server_response.data.errors[0].type,
          server_response.data.errors[0].field,
        ),
        state_error: error_state,
        ...(isIntegrationStep ? { integrationError: dependencyError } : null),
      };
    }

    // Common server error like something went wrong....
    return {
      common_server_error: getCommonServerError(server_response),
      state_error: null,
    };
  }

  // Cancelled request
  if (hasOwn(error_server, 'message')) {
    if (error_server.message === 'Network Error') {
      return {
        common_server_error: 'Network Error',
        state_error: null,
      };
    }
    return {
      common_server_error: EMPTY_STRING,
      state_error: null,
    };
  }

  // Network issues
  return {
    common_server_error: NETWORK_ERROR,
    state_error: null,
  };
};

export const generatePostServerErrorMessage = (error_server, state_error, labels, splitLabel, t = translateFunction) => {
  const error_state = state_error;
  console.log('generatePostServerErrorMessage 1', error_server, state_error, labels, splitLabel, t);
  if (error_server.response) {
    console.log('generatePostServerErrorMessage 2', error_server.response, error_server, state_error, labels, splitLabel, t);
    const server_response = error_server.response;
    // Error on fields from server
    if (server_response.status === SERVER_ERROR_CODES.VALIDATION_ERROR) {
      console.log('generatePostServerErrorMessage 3', error_server.response, server_response?.data, server_response?.data?.errors);
      if (server_response.data && server_response.data.errors) {
        console.log('server_response.data', server_response.data);
        server_response.data.errors.forEach((data) => {
          if ((typeof data?.field === String) || (typeof data?.field === 'string')) {
            console.log('server_response.data', data, typeof data?.field, generateMessageFromType(
              data.type,
              ((data.type === 'exist' || 'string.min') && (data.field === 'data_list_name')) ? t(VALIDATION_CONSTANT.DATALIST_NAME) : labels[data.field] || (splitLabel && labels[data.field.split('.').pop()]) || snakeCaseToSentenceCase(data.field), // if params label not exist, it takes field name as label
              data.limit,
              data.field,
              t,
            ));
            error_state[data.field] = generateMessageFromType(
              data.type,
              ((data.type === 'exist' || 'string.min') && (data.field === 'data_list_name')) ? t(VALIDATION_CONSTANT.DATALIST_NAME) : labels[data.field] || (splitLabel && labels[data.field.split('.').pop()]) || snakeCaseToSentenceCase(data.field), // if params label not exist, it takes field name as label
              data.limit,
              data.field,
              t,
            );
          }
          return null;
        });
      } else return null;
      console.log('generatePostServerErrorMessage 4', getCommonServerErrorFromType(
        server_response.data.errors[0].type,
        server_response.data.errors[0].field,
      ));
      return {
        common_server_error: getCommonServerErrorFromType(
          server_response.data.errors[0].type,
          server_response.data.errors[0].field,
        ),
        state_error: error_state,
      };
    }
    console.log('generatePostServerErrorMessage 5', getCommonServerError(server_response));
    // Common server error like something went wrong....
    return {
      common_server_error: getCommonServerError(server_response),
      state_error: null,
    };
  }

  // Cancelled request
  if (hasOwn(error_server, 'message')) {
    if (error_server.message === 'Network Error') {
      return {
        common_server_error: 'Network Error',
        state_error: null,
      };
    }
    return {
      common_server_error: EMPTY_STRING,
      state_error: null,
    };
  }

  // Network issues
  return {
    common_server_error: NETWORK_ERROR,
    state_error: null,
  };
};

export const generateGetServerErrorMessage = (error_server) => {
  if (hasOwn(error_server, 'response') && error_server.response) {
    const server_response = error_server.response;
    return {
      common_server_error: SERVER_ERROR_CODE_STRINGS[server_response.status],
    };
  }
  if (hasOwn(error_server, 'message')) {
    return {
      common_server_error: EMPTY_STRING,
    };
  }
  return {
    common_server_error: NETWORK_ERROR,
  };
};

export const generateNormalizerValidationError = (dispatch, api) => {
  const error = {
    response: {
      status: 500,
    },
  };
  dispatch(api(error));
};
