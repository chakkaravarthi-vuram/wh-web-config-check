import { HOLIDAY_LIST } from '../actions/ActionConstants';

const initialState = {
    holiday_list: [],
};

export default function HolidayListReducer(state = initialState, action) {
    switch (action.type) {
        case HOLIDAY_LIST.DATA_CHANGE:
            return {
                // ...state,
                holiday_list: action.payload,
            };
        default:
            return state;
    }
}
