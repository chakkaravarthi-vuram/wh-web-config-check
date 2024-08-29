import { ACCOUNT_SETTINGS } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  account_name: EMPTY_STRING,
  account_domain: EMPTY_STRING,
  acc_logo: null,
  primary_color: EMPTY_STRING,
  account_industry: [],
  industry_type: [],
  industry_list: [],
  button_color: EMPTY_STRING,
  enable_button: false,
  is_default_theme: true,
  admin_theme: {
    highlight: '#1A4AC8',
    widgetBg: '#FFFFFF',
    appBg: '#EEF1F3 ',
    activeColor: '#217CF5',
  },
  error_list: [],
  server_error: [],
  common_server_error: EMPTY_STRING,
  is_data_loading: false,
  is_image_loading: null,
  colorCodeError: [],
  document_details: {},
};

export default function AccountSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case ACCOUNT_SETTINGS.STARTED:
      return {
        ...state,
        is_data_loading: true,
      };
    case ACCOUNT_SETTINGS.SUCCESS:
      return {
        ...state,
        server_error: [],
        is_data_loading: false,
      };
    case ACCOUNT_SETTINGS.FAILURE:
      return {
        ...state,
        is_data_loading: false,
        isIndustryListInfiniteScrollLoading: false,
      };
    case ACCOUNT_SETTINGS.CANCEL:
      return {
        ...state,
        is_data_loading: false,
      };
    case ACCOUNT_SETTINGS.DATA_CHANGE:
      console.log('INDUSTRY UPDATING', action.payload);
      return {
        ...state,
        ...action.payload,
      };
    case ACCOUNT_SETTINGS.CLEAR:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
}
