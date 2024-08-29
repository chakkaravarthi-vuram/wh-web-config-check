import { createAction, createReducer } from '@reduxjs/toolkit';
import { INFORMATION_WIDGET } from '../actions/ActionConstants';

export const WIDGET_INIT_STATE = {
  isAllFieldsLoading: true,
  allFieldsListPaginationDetails: {},
  allFieldsList: [],
  allFieldsListErrorList: {},
  allFieldsHasMore: false,
  allFieldsCurrentPage: 1,
  allFieldsTotalCount: 1,
};

export const updateWidgetDataChange = createAction(
  INFORMATION_WIDGET.INFORMATION_WIDGET_DATA_CHANGE,
  (payload) => {
    return { payload };
  },
);

const InformationWidgetReducer = createReducer(WIDGET_INIT_STATE, (builder) => {
  builder.addCase(updateWidgetDataChange, (state, { payload }) => {
    return {
      ...state,
      ...payload,
    };
  });
});

export default InformationWidgetReducer;
