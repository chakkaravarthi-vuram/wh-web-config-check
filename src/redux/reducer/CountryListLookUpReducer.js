import { ACTION_CONSTANTS } from '../actions/ActionConstants';

const initialState = {
    country_list: [],
};

const CountryLookUpReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_CONSTANTS.COUNTRY_LIST_SET:
            return {
                ...state,
                country_list: action.payload,
            };
        default:
            return state;
    }
};
export default CountryLookUpReducer;
