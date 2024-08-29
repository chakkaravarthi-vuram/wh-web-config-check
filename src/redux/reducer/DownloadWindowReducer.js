import { createAction, createReducer } from '@reduxjs/toolkit';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { DOWNLOAD_WINDOW } from '../actions/ActionConstants';

export const downloadWindowApiStarted = createAction(DOWNLOAD_WINDOW.STARTED);
export const downloadWindowApiStop = createAction(DOWNLOAD_WINDOW.STOP);
export const downloadWindowClear = createAction(DOWNLOAD_WINDOW.CLEAR);

export const downloadWindowApiFailure = createAction(
  DOWNLOAD_WINDOW.FAILURE,
  (error) => {
    return {
      payload: error,
    };
  },
);

export const downloadWindowApiSuccess = createAction(
  DOWNLOAD_WINDOW.SUCCESS,
  (downloadWindowData) => {
    return {
      payload: downloadWindowData,
    };
  },
);

export const downloadWindowDataChange = createAction(
  DOWNLOAD_WINDOW.DATA_CHANGE,
  (id, value) => {
    return {
      payload: {
        id,
        value,
      },
    };
  },
);

const initialState = {
  isLoadingDownloadList: true,
  isDownloadNotificationsModalOpen: false,
  downloadNotificationTotalCount: 0,
  download_list: [],
  isDownloadActivityOpen: false,
  retryDownloadData: {
    type: EMPTY_STRING,
    task_metadata_uuid: EMPTY_STRING,
    flowOrDatalistId: EMPTY_STRING,
    queryData: {},
  },
  server_error: {},
};

const DownloadWindowReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(downloadWindowDataChange, (state, action) => {
      return {
        ...state,
        [action.payload.id]: action.payload.value,
      };
    })
    .addCase(downloadWindowClear, (state) => {
      return {
        ...state,
        ...initialState,
      };
    })
    .addCase(downloadWindowApiStarted, (state) => {
      state.isLoadingDownloadList = true;
    })
    .addCase(downloadWindowApiStop, (state) => {
      state.isLoadingDownloadList = false;
    })
    .addCase(downloadWindowApiSuccess, (state, action) => {
      state.isLoadingDownloadList = false;
      state.server_error = {};
      state.download_list = [];
      state.download_list = action.payload;
    })
    .addCase(downloadWindowApiFailure, (state, action) => {
      state.download_list = [];
      state.isLoadingDownloadList = false;
      state.server_error = { ...action.payload };
    });
});

export default DownloadWindowReducer;
