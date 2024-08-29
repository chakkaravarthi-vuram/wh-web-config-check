import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { ACTION_CONSTANTS } from '../actions/ActionConstants';

const initialState = {
  role: null,
  account_domain: EMPTY_STRING,
  user_id: EMPTY_STRING,
  acc_locale: EMPTY_STRING,
};
const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.ROLE_ACTION:
      return {
        ...state,
        role: action.payload,
      };
    // case ACTION_CONSTANTS.UPDATE_USER_TYPE:
    //   console.log(action.payload)
    //   return {
    //     ...state,
    //     role: { ...state.adminProfile, user_type: action.payload },
    //   };
    case ACTION_CONSTANTS.ROLE_ACTION_DOMAIN_NAME:
      return {
        ...state,
        account_domain: action.payload.account_domain,
        user_id: action.payload.user_id,
      };
    case ACTION_CONSTANTS.ROLE_ACTION_ACOUNT_LOCALE:
      return {
        ...state,
        acc_locale: action.payload,
      };
    case ACTION_CONSTANTS.PRIMARY_LOCALE:
      return {
        ...state,
        primary_locale: action.payload,
      };
    case ACTION_CONSTANTS.APP_HEADER_TYPE:
      return {
        ...state,
        app_header_type: action.payload,
      };
    case ACTION_CONSTANTS.IS_SHOW_APP_TASKS:
      return {
        ...state,
        is_show_app_tasks: action.payload,
      };
    case ACTION_CONSTANTS.IS_COPILOT_ENABLED:
      return {
        ...state,
        is_copilot_enabled: action.payload,
      };
    case ACTION_CONSTANTS.ENABLE_PROMPT:
      return {
        ...state,
        enable_prompt: action.payload,
      };
    case ACTION_CONSTANTS.USER_LOGOUT_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default roleReducer;
