import { CHAT_STRINGS } from 'components/chat_components/chat_window/ChatTranslation.strings';
import { SIDE_NAV_BAR } from 'containers/landing_page/main_header/common_header/CommonHeader.strings';
import { ACTION_CONSTANTS } from '../actions/ActionConstants';
import { ADMIN_SETTINGS } from '../../containers/admin_settings/AdminSettingsTranslation.strings';
import { USER_PROFILE } from '../../containers/user_settings/user_profile/UserProfileTranslation.strings';
import { LOGGED_IN_NAVBAR } from '../../components/logged_in_nav_bar/LoggedInNavbarTranlsation.strings';
import { FLOW_T_STRINGS } from '../../containers/flows/FlowTranslations.strings';
import { CHANGE_PASSWORD } from '../../containers/user_settings/change_password/ChangePasswordTranslation.strings';
import { CREATE_TASK } from '../../containers/task/task/TaskTranslation.string';
import { LANDING_PAGE } from '../../containers/landing_page/LandingPageTranslation.strings';

const initialState = {
  languageSettings: {
    language: 'English',
    strings: {
      ADMIN_SETTINGS,
      USER_PROFILE,
      SIDE_NAV_BAR,
      LOGGED_IN_NAVBAR,
      FLOWS: FLOW_T_STRINGS,
      CHANGE_PASSWORD,
      CREATE_TASK,
      CHAT_STRINGS,
      LANDING_PAGE,
    },
  },
};
const localizationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.UPDATE_LANGUAGE_ACTION:
      return {
        ...state,
        languageSettings: action.payload,
      };
    // case ACTION_CONSTANTS.UPDATE_USER_TYPE:
    //   console.log(action.payload)
    //   return {
    //     ...state,
    //     role: { ...state.adminProfile, user_type: action.payload },
    //   };
    case ACTION_CONSTANTS.USER_LOGOUT_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default localizationReducer;
