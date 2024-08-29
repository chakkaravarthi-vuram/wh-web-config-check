import { ACTION_CONSTANTS } from '../actions/ActionConstants';

const initialState = {
  postLoaderStatus: {
    isVisible: false,
    progress: 0,
  },
};
const postLoaderStatus = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.POST_LOADER_ACTION:
      return {
        ...state,
        postLoaderStatus: action.payload,
      };
    default:
      return state;
  }
};

export default postLoaderStatus;
