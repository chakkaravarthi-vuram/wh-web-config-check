import { USER_SETTINGS_TAB_INDEX } from '../../containers/user_settings/UserSettings.strings';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { USER_SETTINGS } from '../actions/ActionConstants';

const initialState = {
  tab_index: USER_SETTINGS_TAB_INDEX.PROFILE,
  isLoadingApiKeys: false,
  isErrorInLoadingApiKeys: false,
  apiKeyList: [],
  isEditApiKeyOpen: false,
  isViewApiKeyOpen: false,
  apiKeyData: {
    name: EMPTY_STRING,
    scope: EMPTY_STRING,
  },
  isSingleCardClicked: false,
  error_list: {},
};

export default function UserSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case USER_SETTINGS.DATA_CHANGE:
      console.log('usersettingsDataChange');
      return {
        ...state,
        ...action.payload,
      };

    case USER_SETTINGS.CLEAR:
      return {
        ...initialState,
      };

    default:
      return state;
  }
}
