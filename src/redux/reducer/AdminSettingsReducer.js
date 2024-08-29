import { ADMIN_SETTINGS } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  is_data_loading: false,
  admin_setting_tab_index: 1,
  common_server_error: EMPTY_STRING,
  server_error: [],
};

export default function AdminSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case ADMIN_SETTINGS.STARTED:
      return {
        ...state,
        is_data_loading: true,
      };

    case ADMIN_SETTINGS.FAILURE:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: action.payload.common_server_error,
        server_error: action.payload.common_server_error,
      };
    case ADMIN_SETTINGS.STATE_CHANGE:
      return {
        ...state,
        admin_setting_tab_index: action.payload,
      };
    default:
      return state;
  }
}
