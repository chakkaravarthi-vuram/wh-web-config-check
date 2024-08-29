import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { ACTION_CONSTANTS } from '../actions/ActionConstants';

const initialState = {
  isVisible: false,
  title: EMPTY_STRING,
  onConfirm: null,
};
const ConfirmPopoverReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.CONFIRM_POPOVER_ACTION:
      return {
        ...state,
        ...action.payload,
      };
    case ACTION_CONSTANTS.CONFIRM_POPOVER_CLEAR:
      return initialState;
    default:
      return state;
  }
};

export default ConfirmPopoverReducer;
