import { ACTION_CONSTANTS } from '../actions/ActionConstants';

import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  formStatus: {
    status: EMPTY_STRING,
    title: EMPTY_STRING,
    subTitle: EMPTY_STRING,
    isVisible: false,
    isModal: false,
    isEditConfirmVisible: false,
    params: {},
    type: EMPTY_STRING,
    ariaHidden: false,
  },
};
const formStatusPopoverReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.FORM_POPOVER_STATUS_ACTION:
      return {
        ...state,
        formStatus: { ...state.formStatus, ...action.payload },
      };
    case ACTION_CONSTANTS.EDIT_CONFIRM_POPOVER_STATUS_ACTION:
      return {
        ...state,
        formStatus: { ...state.formStatus, ...action.payload },
      };
    case ACTION_CONSTANTS.USER_LOGOUT_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default formStatusPopoverReducer;
