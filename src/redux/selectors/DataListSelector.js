import { formatValidationData } from 'utils/formUtils';
import { constructSchemaFromData } from '../../containers/landing_page/my_tasks/task_content/TaskContent.validation.schema';
import jsUtils from '../../utils/jsUtility';
import { hasOwn } from '../../utils/UtilityFunctions';

export const getDataListSchemaSelector = (dataListDetails, userProfileData, workingDaysArray, formData, fieldBasedValidationSectionData, t) => {
  const { form_metadata } = dataListDetails;
  if (form_metadata.sections) {
    return constructSchemaFromData(
      form_metadata.sections,
      false,
      form_metadata.fields.form_visibility,
      undefined,
      userProfileData,
      workingDaysArray,
      formData,
      fieldBasedValidationSectionData,
      t,
    );
  }
  return {};
};
export const getValidationTableAddRowData = (tableFieldList, addDataListFormData) => {
  const tableField = jsUtils.cloneDeep(tableFieldList);
  const addDataListDataForm = jsUtils.cloneDeep(addDataListFormData);
  const tableDataArray = jsUtils
    .get(addDataListDataForm, [tableField.table_uuid], [])
    .flatMap((tableRow) => {
      let isTableEmpty = true;
      Object.keys(tableRow).forEach((key) => {
        const fieldTypeIndex = tableField.fields.findIndex(
          (field) => field.field_uuid === key,
        );
        if (
          fieldTypeIndex !== -1 &&
          ((tableRow[key] !== null &&
            tableRow[key] !== '' &&
            !(typeof tableRow[key] === 'object')) ||
            (tableRow[key] &&
              typeof tableRow[key] === 'object' &&
              tableRow[key].value !== null &&
              tableRow[key].value !== ''))
        ) {
          isTableEmpty = false;
          const fieldType =
            tableField.fields[fieldTypeIndex].field_type;
          tableRow[key] = formatValidationData(tableRow[key], fieldType);
        } else if (tableRow[key] === null || tableRow[key] !== '') {
          jsUtils.unset(tableRow, [key]);
        }
      });
      return isTableEmpty ? [{}] : tableRow;
    });
  return { [tableField.table_uuid]: tableDataArray };
};

export const getDataListFormDataSelector = (dataListState) => {
  const { particularDataListEntryDetails } = dataListState;
  const { form_metadata } = particularDataListEntryDetails;
  if (form_metadata.sections) {
    return particularDataListEntryDetails.addDataListFormData;
  }
  return {};
};

export const getDataListDocumentUrlDetailsSelector = (dataListState) => {
  const { particularDataListEntryDetails } = dataListState;
  const { document_url_details } = particularDataListEntryDetails;
  if (document_url_details) return document_url_details;
  return {};
};

export const getDataListEntryDetailsSelector = (dataListState, LanguageAndCalendarAdminReducer) => {
  const {
    particularDataListEntryDetails,
    activeEntry,
    particularDataListDetails,
    entryListSearchText,
    entryListSortIndex,
    entryListDataCountPerCall,
    entryListPage,
    isDataListEntryLoading,
    isDataListDashboardLoading,
  } = dataListState;
  // return particularDataListEntryDetails;
  const data = {};
  const { form_metadata, document_url_details } = particularDataListEntryDetails;
  if (document_url_details);
  data.documentUrlDetails = document_url_details;
  if (form_metadata.sections) {
    data.addDataListFormData = particularDataListEntryDetails.addDataListFormData;
  }
  data.allDataListEntryData = particularDataListEntryDetails;
  data.dataListDetails = particularDataListDetails;
  const params = {};
  if (!jsUtils.isEmpty(entryListSearchText)) params.search = entryListSearchText;
  if (!jsUtils.isEmpty(entryListSortIndex)) params.search = entryListSortIndex;
  params.page = entryListPage;
  params.size = entryListDataCountPerCall;
  // return params;
  data.dataListEntriesListParams = params;
  data.isDataLoading = isDataListEntryLoading;
  data.isDataListDashboardLoading = isDataListDashboardLoading;
  data.working_days = LanguageAndCalendarAdminReducer.working_days;
  data.dataListEntryDetails = particularDataListEntryDetails;
  data.activeEntry = activeEntry;
  return data;
};

export const getParticularDataListDetailsSelector = (dataListState) => {
  const { particularDataListDetails } = dataListState;
  return particularDataListDetails;
};

export const getAllRecentDataListSelector = (dataListState) => {
  const { allRecentDataList } = dataListState;
  return allRecentDataList;
};

export const getAllOthersDataListSelector = (dataListState) => {
  const { allOthersDataList } = dataListState;
  return allOthersDataList;
};

export const getAllDataListRecentParamsSelector = (dataListState) => {
  const params = {};
  const { searchText } = dataListState;
  if (!jsUtils.isEmpty(searchText)) params.search = searchText;
  params.sort_field = 'last_updated_on';
  params.sort_by = -1;
  return params;
};

export const getAllDataListOtherParamsSelector = (dataListState) => {
  const params = {};
  const { searchText } = dataListState;
  if (!jsUtils.isEmpty(searchText)) params.search = searchText;
  // params.sort_field = 'last_updated_on';
  // params.sort_by = -1;
  return params;
};

export const getDataListEntriesListParamsSelector = (dataListState) => {
  const params = {};
  const {
    entryListSearchText,
    entryListSortIndex,
    entryListDataCountPerCall,
    entryListPage,
  } = dataListState;
  if (!jsUtils.isEmpty(entryListSearchText)) params.search = entryListSearchText;
  if (!jsUtils.isEmpty(entryListSortIndex)) params.search = entryListSortIndex;
  params.page = entryListPage;
  params.size = entryListDataCountPerCall;
  return params;
};

export const getDataListDetailsSelector = (dataListState) => {
  const { particularDataListDetails } = dataListState;
  return particularDataListDetails;
};
export const getDataListIdSelector = (state) => {
  const { particularDataListDetails } = state;
  const dataListId = particularDataListDetails._id;
  return dataListId;
};

export const getDataListEntriesListSelector = (dataListState) => {
  const { allDataListEntries } = dataListState;
  return allDataListEntries;
};

export const getRecentDataListPaginationDetailsSelector = (dataListState) => {
  const {
    totalRecentDataListCount,
    renderedRecentDataListCount,
    recentDataListCurrentPage,
  } = dataListState;
  return {
    totalRecentDataListCount,
    renderedRecentDataListCount,
    recentDataListCurrentPage,
  };
};

export const getOtherDataListPaginationDetailsSelector = (dataListState) => {
  const {
    totalOtherDataListCount,
    renderedOtherDataListCount,
    otherDataListCurrentPage,
  } = dataListState;
  return {
    totalOtherDataListCount,
    renderedOtherDataListCount,
    otherDataListCurrentPage,
  };
};

export const getNotesListPaginationDetailsSelector = (dataListState) => {
  const {
    notesTotalCount,
    notesListCurrentPage,
    renderedNotesListCount,
    notesListDataCountPerCall,
  } = dataListState;
  console.log(
    'pagination details',
    notesTotalCount,
    notesListCurrentPage,
    renderedNotesListCount,
    notesListDataCountPerCall,
  );
  return {
    notesTotalCount,
    notesListCurrentPage,
    renderedNotesListCount,
    notesListDataCountPerCall,
  };
};

export const getRemainderListPaginationDetailsSelector = (dataListState) => {
  const {
    remainderTotalCount,
    remainderListCurrentPage,
    renderedRemainderListCount,
    remainderListDataCountPerCall,
  } = dataListState;
  console.log(
    'pagination details',
    remainderTotalCount,
    remainderListCurrentPage,
    renderedRemainderListCount,
    remainderListDataCountPerCall,
  );
  return {
    remainderTotalCount,
    remainderListCurrentPage,
    renderedRemainderListCount,
    remainderListDataCountPerCall,
  };
};

export const getDataListEntryTaskParamsSelector = (dataListState) => {
  const params = {};
  const { activePage, itemCountPerPage } = dataListState;
  params.page = activePage;
  params.size = itemCountPerPage;
  return params;
};
export const getDataListEntryTasksListSelector = (dataListState) => {
  const { allDataListEntryTaskEntries } = dataListState;
  return allDataListEntryTaskEntries;
};
export const getCustomerIdentifier = (state) => hasOwn(
  state.DataListReducer.particularDataListDetails,
  'custom_identifier',
)
  ? hasOwn(
    state.DataListReducer.particularDataListDetails.custom_identifier,
    'field_uuid',
  )
    ? state.DataListReducer.particularDataListDetails.custom_identifier
      .field_uuid
    : null
  : null;

export const getLandingPageDataListSchemaSelector = (DataListReducer) => {
  const { searchText } = DataListReducer;
  const params = {};
  if (!jsUtils.isEmpty(searchText)) params.search = searchText;
  return {
    serverError: DataListReducer.common_server_error,
    allDataList: DataListReducer.allOthersDataList,
    dataListParams: params,
    isDataLoading: DataListReducer.isLandingPageOtherDataListLoading,
    isDataListInfiniteScrollLoading: DataListReducer.isLandingPageOtherDataListInfiniteScrollLoading,
    remainingOtherDataListCount: DataListReducer.remainingOtherDataListCount,
    otherDataListHasMore: DataListReducer.otherDataListHasMore,
    totalOtherDataListCount: DataListReducer.totalOtherDataListCount,
    otherDataListCurrentPage: DataListReducer.otherDataListCurrentPage,
  };
};

export default getDataListSchemaSelector;
