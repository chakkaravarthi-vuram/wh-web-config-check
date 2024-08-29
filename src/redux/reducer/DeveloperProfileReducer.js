import { ACTION_CONSTANTS } from '../actions/ActionConstants';

const initialState = {
  flowCreatorProfile: {
    isFlowCreator: false,
  },
};
const developerProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.FLOW_CREATOR_PROFILE_ACTION:
      return {
        ...state,
        flowCreatorProfile: action.payload,
      };
    case ACTION_CONSTANTS.UPDATE_LOGO_ACTION:
      return {
        ...state,
        flowCreatorProfile: { ...state.flowCreatorProfile, acc_logo: action.payload },
      };
    case ACTION_CONSTANTS.UPDATE_FLOW_CREATOR_PROFILE_PIC:
      return {
        ...state,
        flowCreatorProfile: { ...state.flowCreatorProfile, profile_pic: action.payload },
      };
    case ACTION_CONSTANTS.USER_LOGOUT_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default developerProfileReducer;
