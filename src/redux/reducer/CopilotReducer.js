import { createSlice } from '@reduxjs/toolkit';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const updateCopilotReducer = 'updateCopilotReducer';

export const initialCopilotReducer = {
  isLoading: false,
  errors: {},
  search: EMPTY_STRING,
  task: {
    isLoading: false,
    data: {
      list: [],
      details: [],
    },
    errors: {},
  },
  chat: {
    isLoading: false,
    data: {
      list: [],
      details: {
        context_uuid: EMPTY_STRING,
      },
    },
    errors: {},
  },
};

export const CopilotSlice = createSlice({
  name: updateCopilotReducer,
  initialState: initialCopilotReducer,
  reducers: {
    setCopilotDataChange: (state, action) => {
      return {
        ...state,
        ...action.payload.data,
      };
    },
    startCopilotLoader: (state) => {
      state.isLoading = true;
    },
    stopCopilotLoader: (state) => {
      state.isLoading = false;
    },
    setCopilotError: (state, action) => {
      state.errors = action.payload.data;
    },
    clearCopilot: () => initialCopilotReducer,

    setCopilotTaskDataChange: (state, action) => {
      state.task.data = action.payload.data;
    },
    startCopilotTaskLoader: (state) => {
      state.task.isLoading = true;
    },
    stopCopilotTaskLoader: (state) => {
      state.task.isLoading = false;
    },
    setCopilotTaskError: (state, action) => {
      state.task.errors = action.payload.data;
    },
    clearCopilotTask: (state) => {
      state.task = initialCopilotReducer.task;
    },

    setCopilotChatDataChange: (state, action) => {
      state.chat.data = action.payload.data;
    },
    setCopilotChatContextId: (state, action) => {
      state.chat.data.details.context_uuid = action.payload;
    },
    startCopilotChatLoader: (state) => {
      state.chat.isLoading = true;
    },
    stopCopilotChatLoader: (state) => {
      state.chat.isLoading = false;
    },
    setCopilotChatError: (state, action) => {
      state.chat.errors = action.payload;
    },
    clearCopilotChat: (state) => {
      state.chat = initialCopilotReducer.chat;
    },
  },
});

export const {
  setCopilotDataChange,
  startCopilotLoader,
  stopCopilotLoader,
  clearCopilot,
  setCopilotError,

  setCopilotTaskDataChange,
  startCopilotTaskLoader,
  stopCopilotTaskLoader,
  setCopilotTaskError,
  clearCopilotTask,

  setCopilotChatDataChange,
  setCopilotChatContextId,
  startCopilotChatLoader,
  stopCopilotChatLoader,
  setCopilotChatError,
  clearCopilotChat,
} = CopilotSlice.actions;

export default CopilotSlice.reducer;
