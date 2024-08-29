import { TASK_ACTION_HISTORY } from '../actions/ActionConstants';

const initialState = {
    total_count: 0,
    remaining_count: 0,
    rendered_count: 0,
    lstActionHistory: {
        pagination_details: [{
            total_count: 0,
            page: 1,
            size: 8,
        }],
        pagination_data: [],
        document_url_details: [],
        isLoading: false,
        isInifiniteScrollLoading: false,
    },
    lstActionHistory1: {
        pagination_details: [],
        pagination_data: [],
        document_url_details: [],
    },
};

export default function TaskActionHistoryReducer(state = initialState, action) {
    switch (action.type) {
        case TASK_ACTION_HISTORY.STARTED:
            return {
                ...state,
                lstActionHistory: {
                    ...state.lstActionHistory,
                    ...(action?.payload?.page === 1) ?
                    {
                        isLoading: true,
                    } :
                    {
                        isInifiniteScrollLoading: true,
                    },
                },
            };
        case TASK_ACTION_HISTORY.SUCCESS:
            return {
                ...state,
                isLoading: false,
                lstActionHistory: {
                    pagination_data:
                    [...state.lstActionHistory.pagination_data, ...action.payload.pagination_data],
                    pagination_details: action.payload.pagination_details,
                    document_url_details: action.payload.document_url_details || [],
                    isInifiniteScrollLoading: false,
                },
                total_count: action.payload.pagination_details[0].total_count,
                rendered_count: action.payload.pagination_data.length +
                                state.lstActionHistory.pagination_data.length,
                remaining_count: action.payload.pagination_details[0].total_count -
                                (action.payload.pagination_data.length +
                                    state.lstActionHistory.pagination_data.length),
            };
        case TASK_ACTION_HISTORY.FAILURE:
            return {
                ...state,
                isLoading: false,
                lstActionHistory: {
                    ...state.lstActionHistory,
                    isLoading: true,
                    isInifiniteScrollLoading: false,
                },
            };
        case TASK_ACTION_HISTORY.CANCEL:
            return {
                ...state,
                isLoading: false,
            };
        case TASK_ACTION_HISTORY.CLEAR:
            return {
                ...state,
                ...initialState,
            };
        default:
            return state;
    }
}
