import { cloneDeep } from '../../utils/jsUtility';
import {
  TASK_ASSIGNEES_COMPLETED,
  TASK_ASSIGNEES_RESPONSE,
  TASK_CONTENT_ACTION,
  TASK_RESPONSE_SUMMARY_ACTION,
  TASK_FORM_DETAILS_ACTION,
  TASK_METADATA,
} from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
// import { TASK_CONTENT_STRINGS } from '../../containers/landing_page/LandingPage.strings';
// import { TASK_TAB_INDEX } from '../../containers/landing_page/LandingPage.strings';

const initialState = {
  active_task_details: {
    task_log_info: {},
    form_metadata: {},
    metadata_info: {},
  },
  action: {},
  activeTask: {},
  taskMetadata: {},
  assignee_task_details: {},
  is_buttons_enabled: true,
  common_server_error: EMPTY_STRING,
  taskValidationSchema: null,
  error_list: {},
  server_error: {},
  non_form_error_list: {},
  nonFormFiles: {},
  formUploadData: {},
  temporaryFormUploadData: {},
  due_days: 2,
  tab_index: 1,
  isTaskDataLoading: false,
  isCompletedAssigneesLoading: false,
  show_accept_reject: false,
  show_reassign: false,
  selected_task_assignee: null,
  document_details: {}, // holds current step uploaded docuemnts, until the form submit.
  isTaskHistoryModalOpen: false,
  hideTaskList: false,
  initiateFlowTask: false,
  file_ref_uuid: [],
  unSuccessfullFileUploads: [],
  removed_doc_list: [],
  table_schemas: [],
  completedAssignees: [],
  individualResponseSelectedValue: null,
  isTaskResponseSummaryLoading: false,
  taskResponseSummary: {},
  isResponseCardDataLoading: false,
  taskFormDetails: {},
  isTaskFormDetailsLoading: false,
  initialLoading: false,
  initialCompletedAssigneesLoading: false,
  setInitialLoading: false,
  assign_to_others: false,
  assigneesCount: 0,
  cancelledCount: 0,
  reviewers: {},
  reviewersSearchValue: '',
  action_error_list: {},
  cancelTask: {
    isCancelTaskDialogVisible: false,
    isCancelTaskModalOpen: false,
    cancelTaskForm: {
      cancel_reason: '',
      error_list: {},
      server_error: {},
    },
  },
  addOrRemoveAssignee: {
    isModalVisible: false,
    isInitialLoading: true,
    isTableLoading: false,
    assigneeList: [],
    searchSelectedUsers: [],
    searchBarText: '',
    activePage: 1,
    itemsCountPerPage: 5,
    totalItemsCount: null,
  },
  respondantsSummary: {
    activePage: 1,
    itemsCountPerPage: 5,
    totalItemsCount: null,
    allInstances: [],
  },
  referenceId: null,
  navigationLink: null,
  member_team_search_value: null,
  selectedTestAssignee: {},
  test_bed_error_list: {},
  document_url_details: [], // holds already uploaded docuemnts from previous step
  isAdhocComment: false,
  adhoc_comments: EMPTY_STRING,
  isCommentPosted: false,
  individualResponseSelectedInstanceId: null,
  taskAssignee: [],
};

export const initState = cloneDeep(initialState);

export default function TaskContentReducer(state = initialState, action) {
  switch (action.type) {
    case TASK_CONTENT_ACTION.STARTED:
      return {
        ...state,
        isTaskDataLoading: true,
      };
    case TASK_CONTENT_ACTION.SUCCESS:
      return {
        ...state,
        isTaskDataLoading: false,
        common_server_error: null,
        server_error: {},
        ...action.payload,
      };
    // user details
    case TASK_CONTENT_ACTION.FAILURE:
      return {
        ...state,
        isTaskDataLoading: false,
        common_server_error: action.payload,
      };
    case TASK_CONTENT_ACTION.SERVER_ERROR:
      return {
        ...state,
        common_server_error: action.payload.common_server_error,
        server_error: action.payload.server_error,
      };
    case TASK_CONTENT_ACTION.CANCEL:
      return {
        ...state,
        isTaskDataLoading: false,
      };
    case TASK_CONTENT_ACTION.DATA_CHANGE: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case TASK_CONTENT_ACTION.CLEAR:
      return {
        ...initialState,
        reviewers: {},
      };
    case TASK_CONTENT_ACTION.REQUIRED_TASK_ACTION:
      return {
        ...state,
        show_accept_reject: action.payload.show_accept_reject,
      };
    case TASK_CONTENT_ACTION.SET_TAB_INDEX:
      return {
        ...state,
        tab_index: action.payload,
      };
    case TASK_CONTENT_ACTION.HIDE_TASK_LIST_STARTED:
      return {
        ...state,
        hideTaskList: true,
        initiateFlowTask: true,
      };
    case TASK_CONTENT_ACTION.UPDATE_ACTIONS:
      return {
        ...state,
        // form_metadata: { ...state.active_task_details.form_metadata, actions: action.payload },
        active_task_details: {
          ...state.active_task_details,
          form_metadata: {
            ...state.active_task_details.form_metadata,
            actions: action.payload,
          },
        },
      };
    case TASK_CONTENT_ACTION.UPDATE_FIELD:
      return {
        ...state,
        active_task_details: {
          ...state.active_task_details,
          form_metadata: {
            ...state.active_task_details.form_metadata,
            fields: {
              ...state.active_task_details.form_metadata.fields,
              form_visibility: {
                ...state.active_task_details.form_metadata.fields
                  .form_visibility,
                visible_fields: action.payload.visibleFields || {},
                visible_tables: action.payload.visibleTables || {},
                visible_disable_fields: action.payload.visibleDisableFields || {},
              },
            },
            actions: {
              ...(state.active_task_details.form_metadata?.actions || {}),
              button_visibility: action.payload.visibleButtons || {},
            },
          },
        },
      };
    case TASK_CONTENT_ACTION.HIDE_TASK_LIST_COMPLETED:
      return {
        ...state,
        hideTaskList: false,
      };
    case TASK_ASSIGNEES_COMPLETED.STARTED: {
      return {
        ...state,
        isCompletedAssigneesLoading: true,
        initialCompletedAssigneesLoading: true,
      };
    }
    case TASK_ASSIGNEES_COMPLETED.SUCCESS: {
      const initialSelectedValue = action.payload.taskLogId;
      const { individualResponseSelectedInstanceId, taskAssignee } = action.payload;
      const { refresh } = action.payload;
      let initialLoading;
      if (refresh && !state.isTaskDataLoading) initialLoading = false;
      else initialLoading = state.initialLoading;
      return {
        ...state,
        isCompletedAssigneesLoading: false,
        common_server_error: null,
        server_error: {},

        completedAssignees: [...action.payload.completedAssignees],
        completedAssigneesDocumentUrlDetails:
          action.payload.completedAssigneesDocumentUrlDetails,
        individualResponseSelectedValue: initialSelectedValue,
        initialCompletedAssigneesLoading:
          !!action.payload.initialCompletedAssigneesLoading,
        initialLoading,
        setInitialLoading: state.isTaskDataLoading,
        individualResponseSelectedInstanceId: individualResponseSelectedInstanceId,
        taskAssignee: taskAssignee,
      };
    }
    case TASK_ASSIGNEES_COMPLETED.FAILURE: {
      return {
        ...state,
        isCompletedAssigneesLoading: false,
        common_server_error: action.payload,
        initialLoading: state.isTaskDataLoading ? state.initialLoading : false,
        setInitialLoading: state.isTaskDataLoading,
        initialCompletedAssigneesLoading: false,
      };
    }
    case TASK_RESPONSE_SUMMARY_ACTION.STARTED:
      return {
        ...state,
        isTaskResponseSummaryLoading: true,
      };
    case TASK_RESPONSE_SUMMARY_ACTION.SUCCESS:
      return {
        ...state,
        isTaskResponseSummaryLoading: false,
        initialLoading: state.isTaskDataLoading ? state.initialLoading : false,
        setInitialLoading: state.isTaskDataLoading,
        taskResponseSummary: action.payload,
      };
    case TASK_RESPONSE_SUMMARY_ACTION.FAILURE:
      return {
        ...state,
        initialLoading: state.isTaskDataLoading ? state.initialLoading : false,
        setInitialLoading: state.isTaskDataLoading,
        isTaskResponseSummaryLoading: false,
      };
    case TASK_RESPONSE_SUMMARY_ACTION.CLEAR:
      return {
        ...state,
        taskResponseSummary: {},
        isTaskResponseSummaryLoading: false,
        initialLoading: state.isTaskDataLoading ? state.initialLoading : false,
        setInitialLoading: state.isTaskDataLoading,
      };
    case TASK_ASSIGNEES_RESPONSE.STARTED: {
      return {
        ...state,
        isResponseCardDataLoading: true,
      };
    }
    case TASK_ASSIGNEES_RESPONSE.SUCCESS: {
      return {
        ...state,
        isResponseCardDataLoading: false,
        initialLoading: state.isTaskDataLoading ? state.initialLoading : false,
        setInitialLoading: state.isTaskDataLoading,
        ...action.payload,
        initialCompletedAssigneesLoading: false,
      };
    }
    case TASK_ASSIGNEES_RESPONSE.FAILURE:
      return {
        ...state,
        isResponseCardDataLoading: false,
        initialLoading: state.isTaskDataLoading ? state.initialLoading : false,
        setInitialLoading: state.isTaskDataLoading,
        common_server_error: action.payload,
        initialCompletedAssigneesLoading: false,
      };
    case TASK_METADATA.STARTED: {
      return {
        ...state,
        isTaskDataLoading: true,
      };
    }
    case TASK_METADATA.SUCCESS: {
      return {
        ...state,
        isTaskDataLoading: false,
        taskMetadata: { ...action.payload },
        assigneesCount: action.payload.total_tasks,
        cancelledCount: action.payload.cancelled_tasks,
        initialLoading:
          state.initialLoading && state.setInitialLoading
            ? false
            : state.initialLoading,
        setInitialLoading: false,
      };
    }
    case TASK_METADATA.FAILURE: {
      return {
        ...state,
        isTaskDataLoading: false,
        initialLoading:
          state.initialLoading && state.setInitialLoading
            ? false
            : state.initialLoading,
        setInitialLoading: false,
        common_server_error: action.payload,
      };
    }
    case TASK_FORM_DETAILS_ACTION.STARTED:
      return {
        ...state,
        isTaskFormDetailsLoading: true,
      };
    case TASK_FORM_DETAILS_ACTION.SUCCESS:
      return {
        ...state,
        isTaskFormDetailsLoading: false,
        initialLoading: state.isTaskDataLoading ? state.initialLoading : false,
        setInitialLoading: state.isTaskDataLoading,
        taskFormDetails: action.payload,
      };
    case TASK_FORM_DETAILS_ACTION.FAILURE:
      return {
        ...state,
        isTaskFormDetailsLoading: false,
        initialLoading: state.isTaskDataLoading ? state.initialLoading : false,
        setInitialLoading: state.isTaskDataLoading,
      };
    case TASK_FORM_DETAILS_ACTION.CLEAR:
      return {
        ...state,
        taskFormDetails: {},
        isTaskFormDetailsLoading: false,
        initialLoading: state.isTaskDataLoading ? state.initialLoading : false,
        setInitialLoading: state.isTaskDataLoading,
      };
    case TASK_CONTENT_ACTION.SET_CANCEL_TASK_MODAL_VISIBILITY:
      return {
        ...state,
        cancelTask: {
          ...state.cancelTask,
          isCancelTaskModalOpen: action.payload,
        },
      };
    case TASK_CONTENT_ACTION.SET_CANCEL_TASK_DIALOG_VISIBILITY:
      return {
        ...state,
        cancelTask: {
          ...state.cancelTask,
          isCancelTaskDialogVisible: action.payload,
        },
      };
    case TASK_CONTENT_ACTION.SET_CANCEL_TASK_MESSAGE:
      return {
        ...state,
        cancelTask: {
          ...state.cancelTask,
          cancelTaskForm: {
            cancel_reason: action.payload,
          },
        },
      };
    case TASK_CONTENT_ACTION.SET_DATA_CANCEL_FORM:
      return {
        ...state,
        cancelTask: {
          ...state.cancelTask,
          cancelTaskForm: {
            ...state.cancelTask.cancelTaskForm,
            ...action.payload,
          },
        },
      };
    case TASK_CONTENT_ACTION.CLEAR_TASK_CANCEL_DATA:
      return {
        ...state,
        cancelTask: {
          ...state.cancelTask,
          cancelTaskForm: {
            ...initialState.cancelTask.cancelTaskForm,
          },
        },
      };
    case TASK_CONTENT_ACTION.FORM_UPLOAD_FIELD_CHANGE:
      return {
        ...state,
        formUploadData: {
          ...state.formUploadData,
          ...action.payload,
        },
      };
    case TASK_CONTENT_ACTION.FORM_TABLE_UPLOAD_FIELD_CHANGE: {
      const {
        payload: { objValue, tableRow, tableId, id },
      } = action;
      const newTableData = [...state.formUploadData[tableId]];
      newTableData[tableRow] = { ...newTableData[tableRow], [id]: objValue };
      return {
        ...state,
        formUploadData: {
          ...state.formUploadData,
          [tableId]: newTableData,
        },
      };
    }
    case TASK_CONTENT_ACTION.TASK_CONTENT_ADD_OR_REMOVE_ASSIGNEE_SET_DATA:
      const { key, value } = action.payload;
      return {
        ...state,
        addOrRemoveAssignee: {
          ...state.addOrRemoveAssignee,
          [key]: value,
        },
      };
    case TASK_CONTENT_ACTION.TASK_CONTENT_ADD_OR_REMOVE_ASSIGNEE_CLEAR_DATA:
      return {
        ...state,
        addOrRemoveAssignee: {
          ...initialState.addOrRemoveAssignee,
        },
      };
    case TASK_CONTENT_ACTION.TASK_CONTENT_RESPONDANTS_SUMMARY_DATA_CHANGE: {
      return {
        ...state,
        respondantsSummary: {
          ...state.respondantsSummary,
          ...action.payload,
        },
      };
    }
    case TASK_CONTENT_ACTION.MEMBER_TEAM_SEARCH_VALUE: {
      return {
        ...state,
        member_team_search_value: action.payload,
      };
    }
    case TASK_CONTENT_ACTION.SELECTED_ASSIGNEE_DATA: {
      return {
        ...state,
        selectedTestAssignee: action.payload,
      };
    }
    case TASK_CONTENT_ACTION.UPDATE_ACTIVE_TASK: {
      return {
        ...state,
        activeTask: { ...state.activeTask, ...action.payload },
      };
    }
    default:
      return state;
  }
}
