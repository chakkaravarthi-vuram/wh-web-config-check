import { ACTION_CONSTANTS } from '../actions/ActionConstants';

const initialState = {
  adminProfile: {
    isAdmin: false,
  },
};
const adminProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.ADMIN_PROFILE_ACTION:
      return {
        ...state,
        adminProfile: action.payload,
      };
    case ACTION_CONSTANTS.UPDATE_ADMIN_PROFILE_ACTION:
      return {
        ...state,
        adminProfile: {
          ...state.adminProfile,
          ...action.payload.userProfileData,
        },
      };
    case ACTION_CONSTANTS.UPDATE_LOGO_ACTION:
      return {
        ...state,
        adminProfile: { ...state.adminProfile, acc_logo: action.payload },
      };
    case ACTION_CONSTANTS.UPDATE_PIC_SIZE:
      return {
        ...state,
        adminProfile: {
          ...state.adminProfile,
          maximum_file_size: action.payload,
        },
      };
    case ACTION_CONSTANTS.UPDATE_ADMIN_PROFILE_PIC:
      return {
        ...state,
        adminProfile: { ...state.adminProfile, profile_pic: action.payload },
      };
    case ACTION_CONSTANTS.USER_LOGOUT_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default adminProfileReducer;
