import { RESPONSE_FIELD_KEYS } from '../../../../utils/constants/form/form.constant';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';

export const ACTION_LIST = {
    ERROR_CHANGE: 'error_change',
    DATA_CHANGE: 'data_change',
    CLEAR_REDUCER: 'clear',
  };

export const FIELD_INITIAL_STATE = {
    [RESPONSE_FIELD_KEYS.FIELD_NAME]: EMPTY_STRING,
    [RESPONSE_FIELD_KEYS.FIELD_TYPE]: EMPTY_STRING,
    [RESPONSE_FIELD_KEYS.READ_ONLY]: false,
    [RESPONSE_FIELD_KEYS.REQUIRED]: false,
    validationData: {},
    instructions: EMPTY_STRING,
    helpText: EMPTY_STRING,
    placeholder: EMPTY_STRING,
    defaultValue: EMPTY_STRING,
    ruleId: EMPTY_STRING,
    hideFieldIfNull: false,
    errorList: {},
};
export const fieldReducer = (state, action) => {
    const payload = action?.payload;
    switch (action.type) {
      case ACTION_LIST.DATA_CHANGE:
         return {
           ...state,
           ...(payload || {}),
         };
        case ACTION_LIST.ERROR_CHANGE:
            return {
            ...state,
            errorList: payload || {},
            };
      case ACTION_LIST.CLEAR_REDUCER:
          return FIELD_INITIAL_STATE;
      default: break;
    }
    return state;
  };
