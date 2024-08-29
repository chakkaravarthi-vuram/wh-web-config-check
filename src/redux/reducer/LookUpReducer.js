import {
  createAction,
  createReducer,
} from '@reduxjs/toolkit';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { LOOKUP } from '../actions/ActionConstants';
import jsUtils from '../../utils/jsUtility';

const initState = {
  common_server_error: null,
  server_error: {},
  lookUpList: [],
  serverLookUpList: [],
  lookUpTotalCount: 0,
  isPaginatedData: false,
  renderedlookUpListCount: 0,
  lookUpListDataCountPerCall: 5,
  lookUpListCurrentPage: 1,
  islookUpListInfiniteScrollLoading: false,
  islookUpListLoading: true,
  isAddNewlookUpModalOpen: false,
  hasMore: false,
  addNewLookup: {
    lookUpErrorList: {},
    isError: false,
    lookup_name: EMPTY_STRING,
    lookup_type: EMPTY_STRING,
    lookup_value: [],
    isAddNewlookUpPostLoading: false,
    isEditable: false,
    lookupId: EMPTY_STRING,
  },
};
export const addNewlookUpStateChangeAction = createAction(
  LOOKUP.ADD_LOOKUP_STATE_CHANGE,
  (data) => {
    return {
      payload: data,
    };
  },
);
export const toggleAddNewLookupModalVisibility = createAction(
  LOOKUP.TOGGLE_ADD_LOOKUP_MODAL_VISIBILITY,
);
export const clearAddNewLookupReduxData = createAction(LOOKUP.CLEAR_LOOKUP);

export const addNewLookupStartedAction = createAction(
  LOOKUP.ADD_NEW_LOOKUP_STARTED,
);

export const addNewLookupSuccessAction = createAction(
  LOOKUP.ADD_NEW_LOOKUP_SUCCESS,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const addNewLookupFailureAction = createAction(
  LOOKUP.ADD_NEW_LOOKUP_FAILURE,
  (error) => {
    return {
      payload: error,
    };
  },
);

const lookUpReducer = createReducer(initState, (builder) => {
  builder
    .addCase(addNewlookUpStateChangeAction, (state, action) => {
      console.log('### lookUp sorted action', action.payload);
      state.addNewLookup = {
        ...state.addNewLookup,
        ...action.payload,
      };
      console.log('### lookUp sorted state', state.addNewLookup, state.lookUpListDataCountPerCall);
    })
    .addCase(toggleAddNewLookupModalVisibility, (state) => {
      console.log('visibility reducer called', state.isAddNewlookUpModalOpen);
      state.isAddNewlookUpModalOpen = !state.isAddNewlookUpModalOpen;
      console.log('visibility reducer called done', state.isAddNewlookUpModalOpen);
    })
    .addCase(addNewLookupSuccessAction, (state, action) => {
      state.addNewLookup = {
        lookup_name: EMPTY_STRING,
        lookup_type: EMPTY_STRING,
        lookup_value: [],
        isAddNewlookUpPostLoading: false,
      };
      const pagination_detail = jsUtils.get(action, ['payload', 'pagination_details', 0], {});
      if (state.lookUpListCurrentPage > 1) state.isPaginatedData = true;
      state.islookUpListLoading = false;
      state.renderedlookUpListCount = action.payload.pagination_data.length;
      state.lookUpTotalCount = pagination_detail.total_count;
      state.lookUpListCurrentPage = pagination_detail.page;
      state.lookUpListDataCountPerCall = pagination_detail.size;
      const rendered = pagination_detail.size * pagination_detail.page;
      const total = pagination_detail.total_count;
      if (rendered >= total) state.hasMore = false;
      else state.hasMore = true;
      if (action.payload.isPaginated) {
        if (pagination_detail.page > 1) {
          state.lookUpList = [...state.lookUpList, ...action.payload.pagination_data];
        } else {
          state.lookUpList = [...action.payload.pagination_data];
        }
      } else {
        state.lookUpList = [...action.payload.pagination_data];
      }
      state.serverLookUpList = state.lookUpList;
      console.log('INDUSTRY HAS MORE', state.hasMore, total, rendered);
      console.log('coneterawer UPDATED STATE', state.lookUpList, action.payload);
    })
    .addCase(addNewLookupFailureAction, (state, action) => {
      console.log('action.payload is', action.payload);
      state.addNewLookup.isAddNewlookUpPostLoading = false;
      state.islookUpListLoading = true;
      state.common_server_error = action.payload.common_server_error;
      state.addNewLookup.lookUpErrorList = action.payload.server_error;
      state.server_error = action.payload.server_error;
      console.log('action.payload is', state.addNewLookup.lookUpErrorList);
    })
    .addCase(clearAddNewLookupReduxData, (state) => {
      state.addNewLookup = {
        lookup_name: EMPTY_STRING,
        lookup_type: EMPTY_STRING,
        lookup_value: [],
        isAddNewlookUpPostLoading: false,
      };
    });
});
export default lookUpReducer;
