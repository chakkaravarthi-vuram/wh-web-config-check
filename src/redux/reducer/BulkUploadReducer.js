import {
  createAction,
  createReducer,
} from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { BULK_UPLOAD } from '../actions/ActionConstants';
import jsUtils from '../../utils/jsUtility';

const initState = {
  bulkDataListEntries: [],
  dataListId: null,
  formId: null,
  validationMessage: [],
  isLoading: false,
  error: {},
};

export const bulkUploadCompleted = createAction(BULK_UPLOAD.BULK_UPLOAD_COMPLETED, (uploadData) => {
    return {
      payload: {
        bulkDataListEntries: uploadData.bulk_data_list_entries?.map((eachEntry) => {
          return {
            ...eachEntry,
            _id: uuidv4(),
          };
        }),
        dataListId: uploadData.data_list_id,
        formId: uploadData.form_id,
        validationMessage: uploadData.validationMessage,
        isLoading: false,
      },
    };
  });

export const bulkDataListEntryRowDelete = createAction(BULK_UPLOAD.BULK_DATA_LIST_ENTRY_ROW_DELETE, (index) => {
    return {
      payload: {
        index,
      },
    };
  });

export const bulkDataListEntryChange = createAction(BULK_UPLOAD.BULK_DATA_LIST_ENTRY_CHANGE, (index, value, fieldUuid) => {
    return {
      payload: {
        index,
        value,
        fieldUuid,
      },
    };
  });

export const bulkDataListEntryValidationChange = createAction(BULK_UPLOAD.BULK_DATA_LIST_ENTRY_VALIDATION_CHANGE, (index, fieldUuid, validationMessage) => {
    return {
      payload: {
        index,
        fieldUuid,
        validationMessage,
      },
    };
  });
export const bulkUploadStarted = createAction(BULK_UPLOAD.BULK_UPLOAD_STARTED);

export const bulkUploadFailed = createAction(
  BULK_UPLOAD.BULK_UPLOAD_FAILURE,
  (error) => {
    return {
      error: { ...error },
    };
  },
);

export const setBulkUploadValidationMessage = createAction(
  BULK_UPLOAD.BULK_DATA_LIST_ENTRY_VALIDATION,
  (validation) => {
    return {
      payload: {
        validation,
      },
    };
  },
);

const bulkUploadReducer = createReducer(initState, (builder) => {
  builder.addCase(bulkUploadCompleted, (state, action) => {
    {
      state = {
        ...state,
        ...action.payload,
      };
      return state;
    }
  })
    .addCase(bulkDataListEntryChange, (state, action) => {
      const { payload: { index, fieldUuid, value } } = action;
      if (state.bulkDataListEntries[index]) {
        state.bulkDataListEntries[index][fieldUuid] = value;
      }
      if (state.validationMessage && state.validationMessage[index]) {
        delete state.validationMessage[index][fieldUuid];
      }
      if (jsUtils.isEmpty(state.validationMessage[index])) delete state.validationMessage[index];
    })
    .addCase(bulkUploadStarted, (state) => {
      state.isLoading = false;
    })
    .addCase(bulkUploadFailed, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    })
    .addCase(bulkDataListEntryRowDelete, (state, action) => {
      const { payload: { index } } = action;
      if (state.bulkDataListEntries.length > index && state.bulkDataListEntries.length) {
        const tempEntries = [...state.bulkDataListEntries];
        tempEntries.splice(index, 1);
        jsUtils.unset(state.validationMessage, [index]);
        if (!jsUtils.isEmpty(state.validationMessage)) {
          const errorIndexes = Object.keys(state.validationMessage);
          errorIndexes.forEach((errorIndex) => {
            if (errorIndex > index) {
              jsUtils.set(state, ['validationMessage', Number(errorIndex) - 1], state.validationMessage[Number(errorIndex)]);
              jsUtils.unset(state, ['validationMessage', Number(errorIndex)]);
            }
          });
        }
        state.bulkDataListEntries = [...tempEntries];
        return state;
      }
      return null;
    })
    .addCase(setBulkUploadValidationMessage, (state, action) => {
      const { payload: { validation } } = action;
      state.validationMessage = { ...validation };
    })
    .addCase(bulkDataListEntryValidationChange, (state, action) => {
      const { payload: { index, validationMessage, fieldUuid } } = action;
      if (jsUtils.isEmpty(validationMessage)) {
        jsUtils.unset(state.validationMessage, [index, fieldUuid]);
        if (jsUtils.isEmpty(jsUtils.get(state.validationMessage, [index]))) {
          delete state.validationMessage[index];
        }
      } else {
        jsUtils.set(state.validationMessage, [index, fieldUuid], validationMessage);
      }
    });
});

export const getBulkUploadData = (state) => state.bulkDataListEntries;
export const isUploading = (state) => state.isLoading;
export const getBulkUploadValidationMessage = (state) => state.validationMessage;
export const getBulkUploadError = (state) => state.error;

export default bulkUploadReducer;
