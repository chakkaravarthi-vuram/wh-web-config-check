import { WEBPAGE_EMBED_WHITELIST } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  webpage_embed_whitelist: [],
  error_list: {},
  server_error: {},
  common_server_error: EMPTY_STRING,
};

export default function WebpageEmbedWhitelistSettingReducer(state = initialState, action) {
  switch (action.type) {
    case WEBPAGE_EMBED_WHITELIST.STARTED:
      return {
        ...state,
        is_data_loading: true,
      };
    case WEBPAGE_EMBED_WHITELIST.SUCCESS:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: null,
        webpage_embed_whitelist: action.payload,
      };

    case WEBPAGE_EMBED_WHITELIST.UPDATE:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: null,
        ...action.payload,
      };

    case WEBPAGE_EMBED_WHITELIST.FAILURE:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: action.payload.common_server_error,
        server_error: action.payload.server_error,
      };
    case WEBPAGE_EMBED_WHITELIST.CANCEL:
      return {
        ...state,
        is_data_loading: false,
      };
    case WEBPAGE_EMBED_WHITELIST.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };

    case WEBPAGE_EMBED_WHITELIST.CLEAR:
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
}
