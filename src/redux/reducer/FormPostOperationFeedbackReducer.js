import { ACTION_CONSTANTS } from '../actions/ActionConstants';

const initialState = {
  //   isVisible: false,
  //   type: null,
  //   message: EMPTY_STRING,
  //   index: 0,
  feedbacks: [],
};
const FormPostOperationFeedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.FORM_FEEDBACK_ADD:
      return {
        ...state,
        feedbacks: [...state.feedbacks, action.payload],
      };
    case ACTION_CONSTANTS.FORM_FEEDBACK_UPDATE:
      return { ...state, feedbacks: action.payload };
    default:
      return state;
  }
};

export default FormPostOperationFeedbackReducer;
