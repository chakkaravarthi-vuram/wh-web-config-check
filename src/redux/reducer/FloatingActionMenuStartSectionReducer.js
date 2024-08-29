import { FLOATING_ACTION_MENU_START_SECTION } from '../actions/ActionConstants';

const initialState = {
    isLoading: true,
    isPaginatedData: false,
    initiateFlowList: [],
    isInitiateFlowListInfiniteScrollLoading: false,
    initiateFlowListCurrentPage: 1,
    initiateFlowListDataCountPerCall: 0,
    renderedInitiateFlowListCount: 0,
    initiateFlowTotalCount: 0,
    initiateFlowListDocumentDetails: [],
    common_server_error: null,
    server_error: {},
    lstInitiateFlows: {
        pagination_details: [],
        pagination_data: [],
    },
};

export default function FloatingActionMenuStartSectionReducer(state = initialState, action) {
    switch (action.type) {
        case FLOATING_ACTION_MENU_START_SECTION.STARTED:
            console.log('API CALL STARTED', action.payload);
            return {
                ...state,
                isLoading: true,
            };
        case FLOATING_ACTION_MENU_START_SECTION.DATA_CHANGE:
            console.log('API CALL DATA CHANGE', action.payload);
            return {
                ...state,
                ...action.payload,
            };
        case FLOATING_ACTION_MENU_START_SECTION.GET_FLOW_LIST_INFINITE_SCROLL_STARTED:
            console.log('API CALL INFINITE SCROLL', action.payload);
            return {
                ...state,
                isInitiateFlowListInfiniteScrollLoading: true,
            };
        case FLOATING_ACTION_MENU_START_SECTION.SUCCESS:
            console.log('API CALL SUCCESS ACTION', action.payload);
            return {
                ...state,
                isLoading: false,
                lstInitiateFlows: action.payload,
                isInitiateFlowListInfiniteScrollLoading: false,
                initiateFlowList: state.isPaginatedData ? [...state.initiateFlowList, ...action.payload.pagination_data]
                : action.payload.pagination_data,
                renderedInitiateFlowListCount: state.initiateFlowList.length,
                initiateFlowTotalCount: action.payload.pagination_details[0].total_count,
                initiateFlowListCurrentPage: action.payload.pagination_details[0].page,
            };
        case FLOATING_ACTION_MENU_START_SECTION.FAILURE:
            console.log('API CALL FAILURE', action.payload);
            return {
                ...state,
                isLoading: false,
                isInitiateFlowListInfiniteScrollLoading: false,
            };
        case FLOATING_ACTION_MENU_START_SECTION.CANCEL:
            console.log('API CALL CANCEL', action.payload);
            return {
                ...state,
                isLoading: false,
            };
        case FLOATING_ACTION_MENU_START_SECTION.CLEAR:
            console.log('API CALL SECTION CLEAR', action.payload);
            return {
                ...initialState,
            };
        case FLOATING_ACTION_MENU_START_SECTION.SET_SEARCH_TEXT:
            console.log('API CALL SEARCH TEXT', action.payload);
            return {
                ...state,
                searchText: action.payload.searchText,
            };
        default:
            return state;
    }
}
