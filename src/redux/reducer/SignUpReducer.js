import { SIGN_UP } from '../actions/ActionConstants';
import { SIGN_UP_STEP } from '../../containers/sign_up/SignUp.strings';

const initialState = {
  active_step: SIGN_UP_STEP.LANDING,
  email: null,
  uuid: null,
  error_for_otp: null,
  otp_expiration_time: null,
  is_data_loading: false,
};

export default function SignUpReducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_UP.STARTED:
      return {
        ...state,
        is_data_loading: true,
      };
    case SIGN_UP.SUCCESS:
      return {
        ...state,
        ...action.payload,
        error_for_otp: null,
        is_data_loading: false,
      };
    case SIGN_UP.FAILURE:
      return {
        ...state,
        ...action.payload,
        is_data_loading: false,
      };
    case SIGN_UP.CANCEL:
      return {
        ...state,
        is_data_loading: false,
      };
    case SIGN_UP.SET_STATE:
      return { ...state, ...action.payload };
    case SIGN_UP.CLEAR:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
