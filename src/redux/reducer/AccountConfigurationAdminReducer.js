import {
  ACCOUNT_CONFIGURATION_ADMIN,
  AUTH_ACCOUNT_CONFIGURATION_ADMIN,
} from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  enable_button: false,
  session_timeout: EMPTY_STRING,
  mobile_session_timeout: EMPTY_STRING,
  remember_me_days: EMPTY_STRING,
  password_expiry_days: EMPTY_STRING,
  maximum_file_size: 0,
  doc_expiry_time: 0,
  is_remember_me_enabled: false,
  is_password_expiry_enabled: false,
  error_list: [],
  server_error: [],
  common_server_error: EMPTY_STRING,
  default_currency_type: EMPTY_STRING,
  allowed_currency_types: [],
  currency_search_value: EMPTY_STRING,
  allowed_extensions: [],
  extension_search_value: EMPTY_STRING,
  other_settings: {},
  is_data_loading: false,
  is_auth_data_loading: false,
  default_country_code: null,
  is_mfa_enabled: false,
  mfa_details: {
    allowed_mfa_methods: [],
  },
  mfa_enforced_teams: [],
};

export default function AccountConfigurationAdminReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case ACCOUNT_CONFIGURATION_ADMIN.STARTED:
      return {
        ...state,
        is_data_loading: true,
      };

    case AUTH_ACCOUNT_CONFIGURATION_ADMIN.STARTED:
      return {
        ...state,
        is_auth_data_loading: true,
      };

    case ACCOUNT_CONFIGURATION_ADMIN.SUCCESS:
      return {
        ...state,
        is_data_loading: false,
        is_auth_data_loading: false,
        common_server_error: null,
        enable_button: false,
        ...action.payload,
        other_settings: { ...state.other_settings, ...action.payload },
      };

    case ACCOUNT_CONFIGURATION_ADMIN.UPDATE:
      return {
        ...state,
        is_data_loading: false,
        is_auth_data_loading: false,
        common_server_error: null,
        enable_button: false,
        other_settings: { ...state.other_settings, ...action.payload },
      };

    case ACCOUNT_CONFIGURATION_ADMIN.FAILURE:
      return {
        ...state,
        is_data_loading: false,
        is_auth_data_loading: false,
        common_server_error: action.payload.common_server_error,
        server_error: action.payload.common_server_error,
      };
    case ACCOUNT_CONFIGURATION_ADMIN.CANCEL:
      return {
        ...state,
        is_data_loading: false,
        is_auth_data_loading: false,
      };
    case ACCOUNT_CONFIGURATION_ADMIN.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };

    case ACCOUNT_CONFIGURATION_ADMIN.CLEAR:
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
}
