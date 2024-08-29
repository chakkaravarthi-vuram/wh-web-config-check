import { DATA_ENCRYTION_REDUCER_CONSTANTS } from '../actions/ActionConstants';

const initialState = {
  requestData: {},
  requestParams: {},
};

export default function EncryptionDataReducer(state = initialState, action) {
  switch (action.type) {
    case DATA_ENCRYTION_REDUCER_CONSTANTS.DATA_SUCCESS:
      return {
        ...state,
        requestData: action.payload,
      };
    case DATA_ENCRYTION_REDUCER_CONSTANTS.PARAMS_SUCCESS:
      return {
        ...state,
        requestParams: action.payload,
      };

    case DATA_ENCRYTION_REDUCER_CONSTANTS.CLEAR:
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
}
