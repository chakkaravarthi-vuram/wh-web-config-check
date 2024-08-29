import { ACTION_CONSTANTS } from '../actions/ActionConstants';

import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  alertStatus: {
    status: EMPTY_STRING,
    title: EMPTY_STRING,
    subTitle: EMPTY_STRING,
    isButtonVisible: false,
    buttonTitle: EMPTY_STRING,
    isVisible: false,
  },
};
const alertPopoverReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.ALERT_POPOVER_STATUS_ACTION:
      return {
        ...state,
        alertStatus: action.payload,
      };
    case ACTION_CONSTANTS.CLEAR_ALERT_POPOVER_STATUS_ACTION:
      return initialState;
    case ACTION_CONSTANTS.USER_LOGOUT_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default alertPopoverReducer;
