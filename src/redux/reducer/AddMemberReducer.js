import { ADD_MEMBER } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  role: EMPTY_STRING,
  user_type: EMPTY_STRING,
  reporting_manager: null,
  datalist_info: null,
  business_unit: EMPTY_STRING,
  mobile_number_country_code: EMPTY_STRING,
  mobile_number_country: EMPTY_STRING,
  first_name: EMPTY_STRING,
  last_name: EMPTY_STRING,
  username: EMPTY_STRING,
  email: EMPTY_STRING,
  phone_number: EMPTY_STRING,
  mobile_number: EMPTY_STRING,
  error_list: [],
  server_error: [],
  common_server_error: EMPTY_STRING,
  selected_value: null,
  is_data_loading: true,
  suggestion_list: [],
  role_list: [],
  business_unit_list: [],
  roles: EMPTY_STRING,
  business_units: EMPTY_STRING,
  new_role_error: [],
  business_unit_error: [],
  reporting_manager_search_value: EMPTY_STRING,
  not_reporting: false,
  enable_button: false,
  is_add_role_loading: false,
  is_add_business_unit_loading: false,
};

export default function AddMemberReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_MEMBER.STARTED:
      return {
        ...state,
        is_data_loading: true,
      };

    case ADD_MEMBER.FAILURE:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: action.payload.common_server_error,
        server_error: action.payload.server_error,
      };

    case ADD_MEMBER.SUCCESS:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: null,
        ...action.payload,
      };

    case ADD_MEMBER.UPDATE:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: null,
        ...action.payload,
      };

    case ADD_MEMBER.ADD_ROLE_STARTED:
      return {
        ...state,
        is_add_role_loading: true,
      };

    case ADD_MEMBER.ADD_BUSINESS_UNIT_STARTED:
      return {
        ...state,
        is_add_business_unit_loading: true,
      };

    case ADD_MEMBER.CANCEL:
      return {
        ...state,
        is_data_loading: false,
      };
    case ADD_MEMBER.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };

    case ADD_MEMBER.CLEAR:
      return {
        ...state,
        ...initialState,
        server_error: [],
      };
    case ADD_MEMBER.CLEAR_REPORTING_MANAGER:
      return {
        ...state,
        reporting_manager: null,
      };
    default:
      return state;
  }
}
