import { EXTERNAL_SIGNIN, LAYOUT } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  isDataLoading: true,
  common_server_error: EMPTY_STRING,
  showPageNotFound: false,
  showUnauthorized: false,
};

export default function LayoutReducer(state = initialState, action) {
  switch (action.type) {
    case LAYOUT.STARTED:
      return {
        ...state,
        isDataLoading: true,
      };
    case LAYOUT.SUCCESS:
      return {
        ...state,
        isDataLoading: false,
      };
    case LAYOUT.FAILURE:
      return {
        ...state,
        common_server_error: action.payload,
        isDataLoading: false,
      };
    case EXTERNAL_SIGNIN.STARTED: {
      return {
        ...state,
        isDataLoading: true,
      };
    }
    case EXTERNAL_SIGNIN.SUCCESS:
      return {
        ...state,
      };
    case EXTERNAL_SIGNIN.FAILURE:
      return {
        ...state,
        common_server_error: action.payload,
        isDataLoading: false,
      };
    case LAYOUT.CANCEL:
      return {
        ...state,
        isDataLoading: false,
      };
    case LAYOUT.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };
    case LAYOUT.CLEAR:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
