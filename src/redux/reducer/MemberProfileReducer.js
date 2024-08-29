import { ACTION_CONSTANTS } from '../actions/ActionConstants';

const initialState = {
  memberProfile: {
    isMember: false,
  },
};
const memberProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.MEMBER_PROFILE_ACTION:
      return {
        ...state,
        memberProfile: action.payload,
      };
    case ACTION_CONSTANTS.UPDATE_MEMBER_PROFILE_PIC:
      return {
        ...state,
        memberProfile: { ...state.memberProfile, profile_pic: action.payload },
      };
    case ACTION_CONSTANTS.USER_LOGOUT_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default memberProfileReducer;
