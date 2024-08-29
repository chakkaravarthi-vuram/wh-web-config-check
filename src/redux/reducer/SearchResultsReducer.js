/* eslint-disable default-param-last */
import SEARCH_STRINGS from 'containers/multi_category_search/MultiCategorySearch.strings';
import { SEARCH_CONSTANTS } from 'utils/Constants';
import { SEARCH_RESULT } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
    searchText: EMPTY_STRING,
    isSearchDataLoading: false,
    taskResults: {
        type: SEARCH_CONSTANTS.ALLOW_TASK_ONLY,
        title: SEARCH_STRINGS.TASK,
        isLoading: false,
        list: [],
    },
    flowResults: {
        type: SEARCH_CONSTANTS.ALLOW_FLOW_ONLY,
        title: SEARCH_STRINGS.FLOW,
        isLoading: false,
        list: [],
    },
    datalistResults: {
        type: SEARCH_CONSTANTS.ALLOW_DATALIST_ONLY,
        title: SEARCH_STRINGS.DATALIST,
        isLoading: false,
        list: [],
    },
    userResults: {
        type: SEARCH_CONSTANTS.ALLOW_USER_ONLY,
        title: SEARCH_STRINGS.USERS,
        isLoading: false,
        list: [],
    },
    teamResults: {
        type: SEARCH_CONSTANTS.ALLOW_TEAM_ONLY,
        title: SEARCH_STRINGS.TEAMS,
        isLoading: false,
        list: [],
    },
};

export default function SearchResultsReducer(state = initialState, action) {
    switch (action.type) {
        case SEARCH_RESULT.SEARCH_TEXT:
            return {
                ...state,
                searchText: action.payload,
            };
        case SEARCH_RESULT.SEARCH_TASK_FAILURE:
            return {
                ...state,
                isSearchDataLoading: false,
                common_server_error: action.payload.common_server_error,
                server_error: action.payload.common_server_error,
                taskResults: {
                    type: SEARCH_CONSTANTS.ALLOW_TASK_ONLY,
                    list: [],
                },
                flowResults: {
                    type: SEARCH_CONSTANTS.ALLOW_FLOW_ONLY,
                    list: [],
                },
                datalistResults: {
                    type: SEARCH_CONSTANTS.ALLOW_DATALIST_ONLY,
                    list: [],
                },
                userResults: {
                    type: SEARCH_CONSTANTS.ALLOW_USER_ONLY,
                    list: [],
                },
                teamResults: {
                    type: SEARCH_CONSTANTS.ALLOW_TEAM_ONLY,
                    list: [],
                },
            };
        case SEARCH_RESULT.SEARCH_CLEAR:
            return initialState;
        case SEARCH_RESULT.SEARCH_GLOBAL_DATA:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}
