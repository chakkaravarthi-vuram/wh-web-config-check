import { createSlice } from '@reduxjs/toolkit';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { BETWEEN_DATE_TYPE } from '../../containers/shared_container/individual_entry/user_and_system_actions/Shortcuts/ShortCut.strings';

const initialTasks = {
  isTaskLoading: false,
  taskList: [],
  taskDocumentUrl: [],
  taskListDetails: {
    page: 1,
    size: 5,
    totalCount: 0,
  },
  reassignTask: {
    reassignedUsers: {
      teams: [],
      users: [],
    },
    reassignReason: EMPTY_STRING,
    errorList: {},
  },
};
const initialNotesAndRemainder = {
  notes: {
    notesList: [],
    notesListDocumentDetails: [],
    notesTotalCount: 0,
    isNotesListLoading: false,
    notesError: {},
    addNewNote: {
      notes: EMPTY_STRING,
      attachments: null,
      notesId: EMPTY_STRING,
      notesErrorList: {},
    },
  },
  remainder: {
    remaindersList: [],
    remainderTotalCount: 0,
    isRemainderListLoading: false,
    remainderError: {},
    addNewRemainder: {
      remainder_message: EMPTY_STRING,
      scheduledDate: EMPTY_STRING,
      is_recursive: false,
      remainderUserList: [],
      remainderErrorList: {},
    },
  },
};

const initialIndividualEntryReducerState = {
  isLoading: false,
  pagesList: [],
  currentPageDetails: {},
  instanceDetails: {},
  pageMetadata: {},
  systemPages: [],
  pageData: [],
  isPagesLoading: false,
  isCustomPageDataLoading: false,
  sameAsEntryForm: true,
  selectedFlowStep: EMPTY_STRING,
  currentFlowStep: EMPTY_STRING,
  flowStepList: [],
  isSummaryFormConfirmationModal: false,
  isDashboardPageAuthorized: true,
  isInitialCustomSummary: false,
  pageSettings: {
    pageName: EMPTY_STRING,
    order: EMPTY_STRING,
    allowCustomViewers: false,
    errorList: {},
    isEdit: false,
    currentPageId: EMPTY_STRING,
    pageType: EMPTY_STRING,
    pageViewers: { users: [], teams: [] },
  },
  moduleDetails: {},
  pageBuilder: {
    dataFields: [],
    systemFields: [],
    externalRules: [],
  },
  tasks: {},
  notesAndRemainders: {},
  systemActionTrigger: {
    isTriggerDetailsLoading: false,
    trigger_details: [],
    trigger_shortcut_details: [],
    totalShortcutsCount: 0,
    isShortcutsLoading: false,
    isShortcutsUsersLoading: false,
    userDocumentDetails: [],
    shortcutUserDetails: [],
    shortcutUserPaginationDetails: [],
    shortcutUserTotalCount: 0,
    isLoadingShorcuts: false,
    shortcutSearchValue: EMPTY_STRING,
    shortcutDateFilterData: {
      startDate: EMPTY_STRING,
      endDate: EMPTY_STRING,
    },
    filterStartDate: EMPTY_STRING,
    filterEndDate: EMPTY_STRING,
    initialDateOperator: BETWEEN_DATE_TYPE,
    shortcutFilterErrors: {},
    allShortcutFilters: [],
    selectedShortcutUsers: [],
    selectedShortcutNames: [],
    appliedFilterCount: 0,
    innerFilterCount: 0,
    shortcutFilterDateOperator: BETWEEN_DATE_TYPE,
  },
  dataAudit: {
    auditListHashMore: true,
    auditListItem: [],
    auditPage: 1,
    dataListAuditDetail: {},
    isDataListAuditDataLoading: false,
    totalCount: 0,
    hasMoreAuditData: true,
    isIntialLoading: true,
    filterquerryLoading: true,
    listLoading: false,
    auditEditorsFieldList: [],
    audiEditorsLists: [],
    selectedFieldName: null,
    selectedEditorName: null,
    dataListAuditDetails: {},
    dataListAuditfields: {},
    auditedTabelRows: [],
    tabelfieldEditedLists: [],
    isAuditDetailsLoading: false,
    auditResponseError: {},
    isIntialEntry: true,
  },
  flow_summary: {
    isInstanceLoading: true,
    instanceSummary: {},
    instanceSummaryError: null,
    isInstanceSummaryLoading: true,
    isInstanceBodyDataLoading: true,
    preMountLoading: true,
    isLoading: false,
    isInstanceDetailsLoading: false,
    isDashboardFilterLoading: false,
    common_server_error: {},
    instanceDetails: {
      initiated_on: { utc_tz_datetime: EMPTY_STRING },
      initiated_by: { first_name: EMPTY_STRING, last_name: EMPTY_STRING },
    },
  },
  editDatalist: {
    datalistEntryDetails: {},
    isDatalistEntryLoading: false,
  },
  datalist_version_history: {
    isVersionHistoryLoading: true,
    versionHistory: {},
    isVersionHistoryError: null,
    common_server_error: {},
  },
};

const IndividualEntryReducerSlice = createSlice({
  name: 'IndividualEntry',
  initialState: initialIndividualEntryReducerState,
  reducers: {
    dataChange: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    leadAndClearReducer: () => initialIndividualEntryReducerState,
    tasksLoadAndClear: (state, action) => {
      if (action.payload) {
        state.tasks = initialTasks;
      } else {
        state.tasks = {};
      }
    },
    taskChanges: (state, action) => {
      state.tasks = { ...state.tasks, ...action.payload };
    },
    notesAndRemainderLoadAndClear: (state, action) => {
      if (action.payload) {
        state.notesAndRemainders = initialNotesAndRemainder;
      } else {
        state.notesAndRemainders = {};
      }
    },
    notesChanges: (state, action) => {
      state.notesAndRemainders.notes = {
        ...state.notesAndRemainders.notes,
        ...action.payload,
      };
    },
    remaindersChanges: (state, action) => {
      state.notesAndRemainders.remainder = {
        ...state.notesAndRemainders.remainder,
        ...action.payload,
      };
    },
    systemActionChanges: (state, action) => {
      return {
        ...state,
        systemActionTrigger: {
          ...state.systemActionTrigger,
          ...action.payload,
        },
      };
    },
    dataAuditActionChanges: (state, action) => {
      return {
        ...state,
        dataAudit: {
          ...state.dataAudit,
          ...action.payload,
        },
      };
    },
    pageBuilderDataChanges: (state, action) => {
      state.pageBuilder = {
        ...state.pageBuilder,
        ...action.payload,
      };
    },
    flowInstanceChanges: (state, action) => {
      return {
        ...state,
        flow_summary: {
          ...state.flow_summary,
          instanceSummary: action.payload,
          isInstanceSummaryLoading: false,
        },
      };
    },
    flowInstanceBodyChanges: (state, action) => {
      return {
        ...state,
        flow_summary: {
          ...state.flow_summary,
          instanceSummary: action.payload,
          isInstanceBodyDataLoading: false,
        },
      };
    },
    flowInstanceBodyStarted: (state) => {
      return {
        ...state,
        flow_summary: {
          ...state.flow_summary,
          isInstanceBodyDataLoading: true,
        },
      };
    },
    flowClearInstance: (state) => {
      return {
        ...state,
        flow_summary: {
          ...state.flow_summary,
          instanceSummary:
            initialIndividualEntryReducerState.flow_summary.instanceSummary,
          isInstanceSummaryLoading: false,
        },
      };
    },
    editDatalistChange: (state, action) => {
      state.editDatalist = {
        ...state.editDatalist,
        ...action.payload,
      };
    },
    editDatalistClear: (state) => {
      state.editDatalist = {
        datalistEntryDetails: {},
        isDatalistEntryLoading: false,
      };
    },
    versionHistoryStarted: (state) => {
      return {
        ...state,
        datalist_version_history: {
          ...state.datalist_version_history,
          isVersionHistoryLoading: true,
        },
      };
    },
    versionHistoryChanges: (state, action) => {
      return {
        ...state,
        datalist_version_history: {
          ...state.datalist_version_history,
          versionHistory: action.payload,
          isVersionHistoryLoading: false,
        },
      };
    },
  },
});

export const {
  dataChange,
  leadAndClearReducer,
  tasksLoadAndClear,
  taskChanges,
  notesAndRemainderLoadAndClear,
  notesChanges,
  remaindersChanges,
  systemActionChanges,
  dataAuditActionChanges,
  pageBuilderDataChanges,
  flowInstanceChanges,
  flowClearInstance,
  flowInstanceBodyChanges,
  flowInstanceBodyStarted,
  editDatalistChange,
  editDatalistClear,
  versionHistoryChanges,
  versionHistoryStarted,
} = IndividualEntryReducerSlice.actions;

export default IndividualEntryReducerSlice.reducer;
