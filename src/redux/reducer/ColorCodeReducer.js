import { ACTION_CONSTANTS } from '../actions/ActionConstants';
import { DEFAULT_COLORS_CONSTANTS } from '../../utils/UIConstants';

const initialState = {
  colorCodes: {
    primaryColor: DEFAULT_COLORS_CONSTANTS.PRIMARY,
    secondaryColor: DEFAULT_COLORS_CONSTANTS.SECONDARY,
    buttonColor: DEFAULT_COLORS_CONSTANTS.BUTTON,
  },
};
const colorCodeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.COLOR_CODE_ACTION:
      return {
        ...state,
        // colorCodes: action.payload,
      };
    case ACTION_CONSTANTS.USER_LOGOUT_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default colorCodeReducer;
