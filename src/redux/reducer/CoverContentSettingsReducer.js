import { COVER_CONTENT_SETTINGS } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { COVER_IMAGE_OR_MESSAGE } from '../../containers/admin_settings/cover_content_settings/CoverContentSettings.strings';
import { PICKER_STRINGS } from '../../components/form_components/gradient_picker/GradientPicker.strings';

const initialState = {
  serverData: {},
  is_cover: false,
  cover_type: COVER_IMAGE_OR_MESSAGE.TYPE.TYPES[0].value,
  cover_message: EMPTY_STRING,
  cover_color: PICKER_STRINGS.COLOR_LIST[0],
  acc_cover_pic: null,
  is_acc_cover_pic_loading: null,
  acc_cover_pic_ref_uuid: EMPTY_STRING,
  acc_cover_pic_url: EMPTY_STRING,
  cover_start_dt: EMPTY_STRING,
  cover_end_dt: EMPTY_STRING,
  cover_duration: {
    from_date: EMPTY_STRING,
    from_time: EMPTY_STRING,
    to_date: EMPTY_STRING,
    to_time: EMPTY_STRING,
  },
  enableButton: false,
  error_list: [],
  server_error: [],
  common_server_error: EMPTY_STRING,
  isDataLoading: false,
  is_image_loading: null,
  document_details: {},
  cover_date_type: EMPTY_STRING,
};

export default function CoverContentSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case COVER_CONTENT_SETTINGS.STARTED:
      return {
        ...state,
        // server_error: [],
        // common_server_error: EMPTY_STRING,
        isDataLoading: true,
      };
    case COVER_CONTENT_SETTINGS.SUCCESS:
      return {
        ...state,
        // error_list: [],
        // server_error: [],
        isDataLoading: false,
        ...action.payload,
      };
    case COVER_CONTENT_SETTINGS.FAILURE:
      return {
        ...state,
        ...action.payload.error,
        isDataLoading: false,
      };
    case COVER_CONTENT_SETTINGS.CANCEL:
      return {
        ...state,
        isDataLoading: false,
      };
    case COVER_CONTENT_SETTINGS.SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    case COVER_CONTENT_SETTINGS.CLEAR:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
