import { USER_MANAGEMENT_ADMIN } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  tab_index: 1,
  page: 1,
  user_type: null,
  sort_by: 1,
  user_auto_suggestion: EMPTY_STRING,
  new_card_user_auto_suggestion: null,
  user_list: [],
  // is_add_button_clicked: false,
  modal_status: 3,
  total_items_count: 0,
  cardCount: 0,
  user_status_index: 1,
  user_list_sort_index: null,
  sort_field: 'username',
  isEditable: false,
  is_data_loading: true,
  isMemberListLoading: true,
  server_error: {},
  document_details: [],
};

export default function UserManagementAdminReducer(state = initialState, action) {
  switch (action.type) {
    case USER_MANAGEMENT_ADMIN.STARTED:
      return {
        ...state,
        // is_data_loading: true,
        isMemberListLoading: true,
      };

    case USER_MANAGEMENT_ADMIN.FAILURE:
      return {
        ...state,
        is_data_loading: false,
        isMemberListLoading: false,
        common_server_error: action.payload.common_server_error,
        server_error: action.payload.common_server_error,
      };

    case USER_MANAGEMENT_ADMIN.SUCCESS:
      return {
        ...state,
        is_data_loading: false,
        isMemberListLoading: false,
        common_server_error: null,
        ...action.payload,
      };

    case USER_MANAGEMENT_ADMIN.UPDATE:
      return {
        ...state,
        is_data_loading: false,
        isMemberListLoading: false,
        common_server_error: null,
        other_settings: action.payload,
      };

    case USER_MANAGEMENT_ADMIN.CANCEL:
      return {
        ...state,
        is_data_loading: false,
        isMemberListLoading: false,
      };
    case USER_MANAGEMENT_ADMIN.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };

    case USER_MANAGEMENT_ADMIN.CLEAR:
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
}
