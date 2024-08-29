import { v4 as uuidv4 } from 'uuid';
import {
  apiGetActionHistoryByInstanceId,
  getTaskData,
} from '../../axios/apiService/task.apiService';
import { setPointerEvent, updatePostLoader } from '../../utils/loaderUtils';
import jsUtility, { cloneDeep, isEmpty } from '../../utils/jsUtility';
import {
  generateGetServerErrorMessage,
  generatePostServerErrorMessage,
} from '../../server_validations/ServerValidation';
import {
  notesChanges,
  remaindersChanges,
  dataChange,
  taskChanges,
  systemActionChanges,
  pageBuilderDataChanges,
  flowInstanceChanges,
  flowClearInstance,
  flowInstanceBodyChanges,
  flowInstanceBodyStarted,
  editDatalistChange,
  versionHistoryChanges,
  dataAuditActionChanges,
  versionHistoryStarted,
} from '../reducer/IndividualEntryReducer';
import {
  addDataListNote,
  addNewRemainder,
  getDataListEntryDetailsById,
  getDataListEntryTaskDetails,
  getDatalistAuditData,
  getDatalistAuditDetails,
  getEditorsListData,
  getRemainderListApi,
  submitDataListEntry,
} from '../../axios/apiService/dataList.apiService';
import { apiGetInstanceSummaryByID } from '../../axios/apiService/flowList.apiService';
import { translate } from '../../language/config';
import { FORM_POPOVER_STATUS, MODULE_TYPES } from '../../utils/Constants';
import {
  updateErrorPopoverInRedux,
  generateApiErrorsAndHandleCatchBlock,
  showToastPopover,
  somethingWentWrongErrorToast,
  setLoaderAndPointerEvent,
  getUserProfileData,
} from '../../utils/UtilityFunctions';
import { DATALIST_LABELS } from '../../containers/data_list/listDataList/listDataList.strings';
import {
  deleteDashboardPage,
  getAllDashboardPages,
  getDashboardPageById,
  getDashboardField,
  putDashboardPages,
  reorderPagesApi,
  saveDashboardPageComponentOrField,
  saveDashboardPageTableComponentOrTableField,
  saveDashboardPages,
  updateSystemDashboardPagesApi,
  EntityFormToDashboardPage,
  getDashboardPageByIdForUserMode,
  deleteDashboardPageComponentApi,
  getDashboardComponentApi,
  getInstanceDetailsByID,
  getDatalistEntryBasicInfo,
  getGetDatalistHistoryByUUID,
} from '../../axios/apiService/individualEntry.apiService';
import {
  getAllDataFieldsApi,
  getDefaultReportByIdApi,
  getDefaultReportByUUIDApi,
} from '../../axios/apiService/dashboardConfig.apiService';
import {
  getAllUsers,
  getFlowShortCuts,
  getFlowTaskDetails,
  getTriggeredFlowNames,
  taskReassign,
} from '../../axios/apiService/flow.apiService';
import { store } from '../../Store';
import {
  DATALIST_SYSTEM_FIELD,
  FLOW_SYSTEM_FIELD,
  DATALIST_SYSTEM_FIELD_LIST,
  FLOW_SYSTEM_FIELD_LIST,
} from '../../utils/constants/systemFields.constant';
import {
  EMPTY_STRING,
  ERROR_TEXT,
  VALIDATION_ERROR_TYPES,
} from '../../utils/strings/CommonStrings';
import {
  getTabOptionsData,
  getSystemPagesFormAllPages,
  getFormDetails,
} from '../../containers/shared_container/individual_entry/IndividualEntry.utils';
import {
  constructTreeStructure,
  getSectionAndFieldsFromResponse,
  getSummaryFieldDataByMetaData,
  removeAllEmptyLayouts,
} from '../../containers/form/sections/form_layout/FormLayout.utils';
import {
  REQUEST_FIELD_KEYS,
  RESPONSE_FIELD_KEYS,
} from '../../utils/constants/form/form.constant';
import {
  FIELD_TYPE,
  PROPERTY_PICKER_ARRAY,
} from '../../utils/constants/form.constant';
import {
  getStateVariables,
  constructInformationFieldFormContent,
} from '../../containers/landing_page/my_tasks/task_content/TaskContent.utils';
import { INDIVIDUAL_ENTRY_TAB_TYPES } from '../../containers/shared_container/individual_entry/IndividualEntry.strings';
import { getRulesApi } from '../../axios/apiService/rule.apiService';
import { RULE_TYPE } from '../../utils/constants/rule/rule.constant';
import { deconstructExternalRulesForSummary } from '../../containers/shared_container/individual_entry/summary_builder/SummaryBuilder.utils';
import { setInitialFormVisibleFields } from '../../utils/formUtils';
import { constructDeletedRow } from '../../containers/data_list/view_data_list/data_list_audit/detailed_audit_view/DetailedAuditView.utils';
import { normalizer } from '../../utils/normalizer.utils';
import { updateProfileAction } from '../../containers/application/app_components/dashboard/datalist/Datalist.utils';
import { getTableUniqueColumnMessage } from '../../containers/landing_page/my_tasks/task_content/TaskContent.validation.schema';

export const getEntryTaskListApi = (params, setCancelToken) => (dispatch) => {
  dispatch(taskChanges({ isTaskLoading: true }));
  let entryTaskApi;
  if (params.data_list_uuid) {
    entryTaskApi = getDataListEntryTaskDetails;
  } else if (params.flow_uuid) {
    entryTaskApi = getFlowTaskDetails;
  }
  entryTaskApi(params, setCancelToken)
    .then((res) => {
      if (!jsUtility.isEmpty(res)) {
        dispatch(
          taskChanges({
            taskList: res.pagination_data || [],
            taskDocumentUrl: res?.document_url_details || [],
            taskListDetails: {
              page: res?.pagination_details[0].page,
              size: res?.pagination_details[0].size,
              totalCount: res?.pagination_details[0].total_count,
            },
          }),
        );
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const error = generateGetServerErrorMessage(err);
        dispatch(
          taskChanges({ common_server_error: error.common_server_error }),
        );
      }
    })
    .catch((err) => {
      console.log('get entry task list api error', err);
    })
    .finally(() => {
      dispatch(taskChanges({ isTaskLoading: false }));
    });
};

export const reassignEntryApiThunk = (data, callbackFunction) => (dispatch) => {
  taskReassign(data)
    .then((res) => {
      if (res) {
        if (!jsUtility.isEmpty(res?.errors[0])) {
          showToastPopover(
            'Task Reassign Failed',
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          if (res.errors[0].error_reason.includes('reassign_assignees')) {
            const errorList = {
              reassign_to:
                'Selected User(s) or Team(s) Already having the tasks',
            };
            dispatch(taskChanges({ reassignTask: { errorList: errorList } }));
          }
        } else {
          showToastPopover(
            'Task has been reassigned successfully',
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
          if (callbackFunction) callbackFunction?.(true);
        }
      }
    })
    .catch((err) => {
      if (jsUtility.has(err, ['code']) && err.code === 'ERR_CANCELED') return;
      showToastPopover(
        'Task Reassign Failed',
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    });
};

// get entry notes
export const getInstanceNotesListApiThunk = (params) => (dispatch) => {
  apiGetActionHistoryByInstanceId(params)
    .then((res) => {
      if (!jsUtility.isEmpty(res)) {
        const notesData = {
          notesList: res.pagination_data,
          notesListDocumentDetails: res.document_url_details,
          notesTotalCount: res.pagination_details[0].total_count,
          isNotesListLoading: false,
        };
        dispatch(notesChanges(notesData));
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(notesChanges({ notesError: errors.common_server_error }));
      }
    })
    .catch((error) => {
      console.log('get notes list api error', error);
    });
};

// get entry remainder
export const getInstanceRemainderListApiThunk = (params) => (dispatch) => {
  getRemainderListApi(params)
    .then((res) => {
      if (!jsUtility.isEmpty(res)) {
        const notesData = {
          remaindersList: res.pagination_data,
          remainderTotalCount: res.pagination_details[0].total_count,
          isRemainderListLoading: false,
        };
        dispatch(remaindersChanges(notesData));
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(remaindersChanges({ notesError: errors.common_server_error }));
      }
    })
    .catch((error) => {
      console.log('get remainder list api error', error);
    });
};

// add entry notes
export const addNewNoteApiThunk = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    addDataListNote(data)
      .then((response) => {
        if (response) {
          showToastPopover(
            translate('error_popover_status.notes_added'),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
          const params = {
            page: 1,
          };
          if (!jsUtility.isEmpty(data.data_list_entry_id)) {
            params.data_list_entry_id = data.data_list_entry_id;
          } else if (!jsUtility.isEmpty(data.instance_id)) {
            params.instance_id = data.instance_id;
            params.action_history_type = 'note';
          }
          dispatch(getInstanceNotesListApiThunk(params));
          resolve(true);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(
            notesChanges({
              addNewNote: { notesErrorList: errors.common_server_error },
            }),
          );
          resolve(false);
        }
      })
      .catch((error) => {
        const errors = generatePostServerErrorMessage(
          error,
          {},
          DATALIST_LABELS,
        );
        showToastPopover(
          translate('error_popover_status.somthing_went_wrong'),
          errors.state_error
            ? errors.state_error.category
            : translate('error_popover_status.try_again_later'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        reject(error);
      });
  });

// add entry remainder
export const addNewRemainderApiThunk = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    addNewRemainder(data)
      .then((response) => {
        if (response) {
          showToastPopover(
            translate('error_popover_status.reminder_added'),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
          const params = {
            data_list_entry_id: data.schedule_data.data_list_entry_id,
            page: 1,
            data_list_uuid: data.schedule_data.data_list_uuid,
          };
          dispatch(getInstanceRemainderListApiThunk(params));
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(
            remaindersChanges({
              addNewRemainder: {
                remaindersErrorList: errors.common_server_error,
              },
            }),
          );
        }
      })
      .catch((error) => {
        const { server_error } = store.getState().DataListReducer;
        reject(error);
        const errorData = {
          error,
          server_error,
        };
        const apiFailureAction = {
          dispatch,
          action: remaindersChanges,
        };
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors[0].field === 'scheduled_date_time' &&
          error.response.data.errors[0].type === 'number.min'
        ) {
          showToastPopover(
            translate('error_popover_status.set_reminder'),
            translate('error_popover_status.selected_time'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        generateApiErrorsAndHandleCatchBlock(
          errorData,
          apiFailureAction,
          false,
          true,
        );
      });
  });

export const getDashboardPageByIdThunk =
  (pageId, isReadOnly = false) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(dataChange({ isCustomPageDataLoading: true }));
      getDashboardPageById(pageId)
        .then((response) => {
          if (!jsUtility.isEmpty(response)) {
            let pageMetadata = response;
            if (isReadOnly) {
              pageMetadata = getFormDetails(
                response,
                response.document_url_details,
                true,
              );
            } else if (
              response.type === INDIVIDUAL_ENTRY_TAB_TYPES.PAGE_BUILDER
            ) {
              const { sections, fields } = getSectionAndFieldsFromResponse(
                response?.form_metadata?.sections || [],
                MODULE_TYPES.SUMMARY,
              );
              pageMetadata.formMetadata = { sections, fields };
              pageMetadata.formUUID = pageMetadata?.form_metadata?.form_uuid;
              delete pageMetadata.form_metadata;
            }
            dispatch(
              dataChange({
                isCustomPageDataLoading: false,
                pageMetadata,
                selectedFlowStep: response?.step_uuid,
                currentFlowStep: response?.step_uuid,
                isInitialCustomSummary: !!isEmpty(response?.formMetadata?.fields),
              }),
            );
            resolve(true);
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            reject(errors);
          }
        })
        .catch((error) => {
          if (error && error.code === 'ERR_CANCELED') return;
          dispatch(dataChange({ isCustomPageDataLoading: false }));
          const errors = generateGetServerErrorMessage(error);
          reject(errors);
        });
    });

export const getAllDashboardPagesThunk =
  (params, isInitialPage, type, isUserMode = false, isReadOnly = false) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(dataChange({ isPagesLoading: true }));
      getAllDashboardPages(params, isUserMode)
        .then((response) => {
          if (!jsUtility.isEmpty(response)) {
            let updatedResponse = response;
            if (type === 'data list') {
              updatedResponse = response.filter(
                (item) => item.type !== 'execution_summary',
              );
            }
            const updateData = {
              dashboard_id: params.dashboard_id,
              pagesList: getTabOptionsData(updatedResponse),
              isPagesLoading: false,
              systemPages: getSystemPagesFormAllPages(updatedResponse),
            };
            if (isInitialPage) {
              const [currentPageDetails] = updateData.pagesList;
              if (currentPageDetails) {
                updateData.currentPageDetails = currentPageDetails;
              }
              if (!isUserMode) {
                dispatch(
                  getDashboardPageByIdThunk(
                    currentPageDetails.value,
                    isReadOnly,
                  ),
                );
              }
            }
            dispatch(dataChange(updateData));
            resolve(updateData.pagesList[0]);
          } else {
            // const err = {
            //   response: {
            //     status: 500,
            //   },
            // };
            // const errors = generateGetServerErrorMessage(err);
            // reject(errors);
            const updateData = {
              isDashboardPageAuthorized: false,
            };
            dispatch(dataChange(updateData));
          }
        })
        .catch((error) => {
          if (error && error.code === 'ERR_CANCELED') return;
          dispatch(dataChange({ isPagesLoading: false }));
          const errors = generateGetServerErrorMessage(error);
          reject(errors);
        });
    });

export const getDashboardPageByIdForUserModeThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(dataChange({ isCustomPageDataLoading: true }));
    getDashboardPageByIdForUserMode(params)
      .then((response) => {
        if (!jsUtility.isEmpty(response)) {
          const pageMetadata = getFormDetails(
            response,
            response.document_url_details,
            true,
            true,
          );
          const infoFieldFormState = constructInformationFieldFormContent({
            sections: response.form_metadata.sections,
            activeFormContent: response.active_form_content,
            documentUrlDetails: response?.document_url_details,
            userProfileData: {},
            isSummary: true,
            dependencyEntityFields:
              response?.form_metadata?.fields?.dependent_entity_fields,
          });
          pageMetadata.informationFieldFormContent =
            infoFieldFormState.infoFieldFormState;
          dispatch(
            dataChange({
              isCustomPageDataLoading: false,
              pageMetadata,
            }),
          );
          resolve(true);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          reject(errors);
        }
      })
      .catch((error) => {
        if (error && error.code === 'ERR_CANCELED') return;
        dispatch(dataChange({ isCustomPageDataLoading: false, pageMetadata: {} }));
        const errors = generateGetServerErrorMessage(error);
        reject(errors);
      });
  });

export const saveDashboardPageApiThunk =
  (postData, dashboardId, clearPageState, isReadOnlyMode) => (dispatch) =>
    new Promise((resolve, reject) => {
      setPointerEvent(true);
      updatePostLoader(true);
      saveDashboardPages(postData)
        .then((response) => {
          clearPageState();
          const currentPageData = {
            value: response?._id,
            labelText: response?.name,
            order: response?.order,
            uuid: response?.page_uuid,
            tabIndex: response?._id,
            isInherit: response?.security?.is_inherit_from_parent,
            viewers: response?.security?.viewers,
            type: response?.type,
            disableDelete: response?.type !== 'custom',
          };
          dispatch(dataChange({ currentPageDetails: currentPageData }));
          dispatch(getAllDashboardPagesThunk({ dashboard_id: dashboardId }));
          dispatch(getDashboardPageByIdThunk(response?._id, isReadOnlyMode));
          showToastPopover(
            'Success',
            'New custom page added',
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
          setPointerEvent(false);
          updatePostLoader(false);
          resolve(true);
        })
        .catch((errors) => {
          if (
            errors?.response?.data?.errors?.[0]?.type === 'any.invalid' ||
            errors?.response?.data?.errors?.[0]?.type === 'exist'
          ) {
            const { pageSettings } = store.getState().IndividualEntryReducer;
            dispatch(
              dataChange({
                pageSettings: {
                  ...pageSettings,
                  errorList: { name: 'Page Name already exists' },
                },
              }),
            );
            showToastPopover(
              'Page Name already exists',
              EMPTY_STRING,
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          } else if (
            errors?.response?.data?.errors?.[0]?.type === 'LimitExceededError'
          ) {
            showToastPopover(
              'Custom Page Limit Exceeded',
              'A maximum of 6 custom pages are allowed.',
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          }
          setPointerEvent(false);
          updatePostLoader(false);
          reject(errors);
        });
    });

export const getIndividualDefaultReportByIdThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    getDefaultReportByIdApi(params)
      .then((res) => {
        resolve(res);
        dispatch(dataChange({ dashboardId: res?._id }));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const reorderPagesApiThunk =
  (postData, clearPageState) => (dispatch) => {
    setPointerEvent(false);
    updatePostLoader(true);
    reorderPagesApi(postData)
      .then(async () => {
        clearPageState();
        dispatch(
          getAllDashboardPagesThunk({ dashboard_id: postData?.dashboard_id }),
        );
        showToastPopover(
          'Pages Successfully Reordered',
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
        setPointerEvent(false);
        updatePostLoader(false);
      })
      .catch((error) => {
        console.log('api reorderPagesApiThunk error', error);
        setPointerEvent(false);
        updatePostLoader(false);
      });
  };

export const editPagesApiThunk =
  (postData, pageId, dashboardId, clearPageState) => (dispatch) => {
    setPointerEvent(false);
    updatePostLoader(true);
    putDashboardPages(postData, pageId)
      .then(async () => {
        clearPageState();
        dispatch(getAllDashboardPagesThunk({ dashboard_id: dashboardId }));
        showToastPopover(
          'Page Updated Successfully',
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
        setPointerEvent(false);
        updatePostLoader(false);
      })
      .catch((error) => {
        console.log('api editPagesApiThunk error', error);
        setPointerEvent(false);
        updatePostLoader(false);
      });
  };
export const getAllShortcutUsersApiThunk = (params) => (dispatch) => {
  dispatch(systemActionChanges({ isShortcutsUsersLoading: true }));
  getAllUsers(params)
    .then((res) => {
      const { shortcutUserDetails = [] } =
        store.getState().IndividualEntryReducer.systemActionTrigger;
      const updatedUserDetails =
        params?.page === 1
          ? [...(res.pagination_data || [])]
          : [...shortcutUserDetails, ...res.pagination_data];
      dispatch(
        systemActionChanges({
          isShortcutsUsersLoading: false,
          userDocumentDetails: res.document_url_details,
          shortcutUserDetails: updatedUserDetails,
          hasMore:
            updatedUserDetails.length < res.pagination_details[0].total_count,
          shortcutUserPaginationDetails: res.pagination_details,
          shortcutUserTotalCount: res.pagination_details[0].total_count,
        }),
      );
    })
    .catch((err) => {
      if (jsUtility.has(err, ['code']) && err.code === 'ERR_CANCELED') return;
      dispatch(systemActionChanges({ isShortcutsUsersLoading: false }));
    });
};

export const getFlowShortCutsApiThunk = (params) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  dispatch(systemActionChanges({ isShortcutsLoading: true }));
  getFlowShortCuts(params)
    .then((res) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (!isEmpty(res)) {
        dispatch(
          systemActionChanges({
            isShortcutsLoading: false,
            totalShortcutsCount: res.pagination_details[0].total_count,
            shortcutsList: res.pagination_data,
          }),
        );
      } else {
        // const err = {
        //   response: {
        //     status: 500,
        //   },
        // };
        // const errors = generateGetServerErrorMessage(err);
      }
    })
    .catch((error) => {
      if (
        error.response.data.errors.some(
          (eachError) => eachError.type !== 'AuthorizationError',
        )
      ) {
        showToastPopover(
          translate('error_popover_status.somthing_went_wrong'),
          translate('error_popover_status.try_again_later'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
      setPointerEvent(false);
      updatePostLoader(false);
      dispatch(systemActionChanges({ isShortcutsLoading: false }));
    });
};

export const getAllTriggerNamesThunk = (params) => (dispatch) =>
  new Promise((resolve) => {
    dispatch(systemActionChanges({ isTriggerDetailsLoading: true }));
    getTriggeredFlowNames(params)
      .then((response) => {
        dispatch(
          systemActionChanges({
            trigger_shortcut_details: response,
            isTriggerDetailsLoading: false,
          }),
        );
        resolve();
      })
      .catch(() => {
        dispatch(
          systemActionChanges({
            trigger_shortcut_details: [],
            isTriggerDetailsLoading: false,
          }),
        );
      });
  });

export const dataListAuditDataApi = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    getDatalistAuditData(params)
      .then((response) => {
        const { dataAudit } = store.getState().IndividualEntryReducer;
        dispatch(
          dataAuditActionChanges({
            ...response,
            ...dataAudit,
          }),
        );
        resolve(response);
        setPointerEvent(false);
        updatePostLoader(false);
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const { server_error } = store.getState().CreateDataListReducer;
        const errorData = {
          error,
          server_error,
        };
        generateApiErrorsAndHandleCatchBlock(errorData, {}, false, true);
        reject(error);
      });
  });
export const dataListAuditDetailes = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    getDatalistAuditDetails(params)
      .then((response) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const { dataAudit } = store.getState().IndividualEntryReducer;
        dispatch(
          dataAuditActionChanges({
            dataAudit: {
              ...response,
              ...dataAudit,
            },
          }),
        );
        resolve(response);
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        reject(error);
      });
  });
export const editorsListDataApi = (params) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    getEditorsListData(params)
      .then((response) => {
        setPointerEvent(false);
        updatePostLoader(false);
        resolve(response);
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        reject(error);
      });
  });

export const deletePagesApiThunk =
  (postData, dashboardId, clearPageState) => (dispatch) =>
    new Promise((resolve, reject) => {
      setPointerEvent(false);
      updatePostLoader(true);
      deleteDashboardPage(postData)
        .then(async (res) => {
          clearPageState();
          dispatch(
            getAllDashboardPagesThunk({ dashboard_id: dashboardId }, true),
          );
          showToastPopover(
            'Custom Page Deleted Successfully',
            EMPTY_STRING,
            FORM_POPOVER_STATUS.DELETE,
            true,
          );
          setPointerEvent(false);
          updatePostLoader(false);
          resolve(res);
        })
        .catch((error) => {
          setPointerEvent(false);
          updatePostLoader(false);
          reject(error);
        });
    });

export const getIndividualDefaultReportByUuidThunk = (params) => () =>
  new Promise((resolve, reject) => {
    getDefaultReportByUUIDApi(params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getAllDataFieldThunk = (params) => (dispatch) => {
  getAllDataFieldsApi(params)
    .then((res) => {
      const { pagination_data } = res;
      const dataFieldList = pagination_data.map((data) => {
        const field = {
          fieldId: data._id,
          allowMultiple: data.allow_multiple,
          fieldListType: data.field_list_type,
          fieldName: data?.field_name || EMPTY_STRING,
          fieldType: data.field_type,
          fieldUUID: data.field_uuid,
          referenceName: data.reference_name,
          required: data.required,
          label: data.label,
          chocieValues: data?.choice_values,
        };
        if (data.field_type === FIELD_TYPE.DATA_LIST) {
          field.selectedDataListUuid = data?.data_list_details?.data_list_uuid;
        } else if (data.field_type === FIELD_TYPE.USER_TEAM_PICKER) {
          field.selectedDataListUuid =
            store?.getState()?.UserProfileReducer?.user_data_list_uuid;
        } else if (
          [
            FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
            FIELD_TYPE.USER_PROPERTY_PICKER,
          ].includes(data.field_type)
        ) {
          field.selectedDataListUuid =
            data?.property_picker_details?.data_list_uuid;
          field.dataListPickerFieldUUID =
            data?.property_picker_details?.reference_field_uuid;
          field.datalistPickerFieldType =
            data?.property_picker_details?.reference_field_type;
          field.datalistPickerFieldName = data.field_name;
          field.datalistPickerUUID =
            data?.property_picker_details?.source_field_uuid;
        }
        return field;
      });
      let systemField = [];
      if (params.data_list_id) {
        systemField = jsUtility.cloneDeep(DATALIST_SYSTEM_FIELD_LIST);
        systemField.push(jsUtility.cloneDeep(DATALIST_SYSTEM_FIELD.LINK));
      } else if (params.flow_id) {
        systemField = jsUtility
          .cloneDeep(FLOW_SYSTEM_FIELD_LIST)
          .filter(
            (system) =>
              ![
                FLOW_SYSTEM_FIELD.OPEN_WITH.id,
                FLOW_SYSTEM_FIELD.ACTIVE_TASK.id,
                FLOW_SYSTEM_FIELD.ACTIVE_TASK_OWNER.id,
                FLOW_SYSTEM_FIELD.STEP_NAME.id,
              ].includes(system.id),
          );
        systemField.push(jsUtility.cloneDeep(FLOW_SYSTEM_FIELD.LINK));
      }
      const systemFieldList = jsUtility.cloneDeep(systemField).map((data) => {
        let fieldId = data.id;
        if (params.flow_id && fieldId === FLOW_SYSTEM_FIELD.ID.id) {
          fieldId = 'flow_id';
        } else if (
          params.data_list_id &&
          fieldId === DATALIST_SYSTEM_FIELD.ID.id
        ) {
          fieldId = 'system_identifier';
        }
        const field = {
          fieldId: fieldId,
          fieldListType: data.field_list_type,
          fieldName: data.label,
          fieldType: data.field_type,
          fieldUUID: fieldId,
          referenceName: data?.label?.toLowerCase()?.replaceAll(' ', '_'),
          required: false,
          label: data.label,
        };
        return field;
      });
      dispatch(
        pageBuilderDataChanges({
          dataFields: dataFieldList,
          systemFields: systemFieldList,
        }),
      );
    })
    .catch((err) => {
      console.log('getAllDataFieldThunk error', err);
    });
};

export const saveDashboardPageComponentOrFieldThunk = (params) => () =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    saveDashboardPageComponentOrField(params)
      .then((res) => {
        setPointerEvent(false);
        updatePostLoader(false);
        resolve(res);
      })
      .catch((err) => {
        setPointerEvent(false);
        updatePostLoader(false);
        reject(err);
      });
  });

// Flow instance
export const getInstanceSummaryByID = (_id) => (dispatch) => {
  dispatch(
    flowInstanceChanges({
      isInstanceLoading: true,
      isInstanceSummaryLoading: true,
    }),
  );
  apiGetInstanceSummaryByID(_id)
    .then((res) => {
      if (res) {
        res.instance_summary.map((instanceSummary) => {
          instanceSummary.isShow = false;
          instanceSummary.instanceBodyData = {};
          return instanceSummary;
        });
        dispatch(flowInstanceChanges(res));
      }
    })
    .catch((err) => {
      const err_obj = {
        instanceSummary: {},
        instanceSummaryError: err,
        isInstanceSummaryLoading: false,
      };
      dispatch(flowInstanceChanges(err_obj));
    });
};

export const flowDashboardSetInstanceSummaryAction =
  (instanceSummary) => (dispatch) => {
    dispatch(flowInstanceChanges(instanceSummary));
    return Promise.resolve();
  };

const throwError = (err, isGet) => {
  if (isGet) {
    const getError = generateGetServerErrorMessage(err);
    const commonServerError = getError.common_server_error
      ? getError.common_server_error
      : EMPTY_STRING;
    if (
      !(
        err.response &&
        err.response.data &&
        err.response.data.errors &&
        (err.response.data.errors[0].type === 'not_exist' ||
          err.response.data.errors[0].type === 'string.guid')
      )
    ) {
      updateErrorPopoverInRedux(ERROR_TEXT.UPDATE_FAILURE, commonServerError);
    }

    const err_obj = {
      preMountLoading: false,
      isLoading: false,
      isInstanceDetailsLoading: false,
      isInstanceSummaryLoading: false,
      isInstanceBodyDataLoading: false,
      isDashboardFilterLoading: false,
      common_server_error: err,
    };
    return flowInstanceChanges(err_obj);
  }
  return null;
};

export const getInstanceTaskDetailsById =
  (params, instanceSummary, index) => (dispatch) => {
    dispatch(flowInstanceBodyStarted());
    getTaskData(params)
      .then((res) => {
        if (res) {
          const updatedSummary = cloneDeep(instanceSummary);
          updatedSummary.instance_summary[index].instanceBodyData = res;
          updatedSummary.isInstanceBodyDataLoading = false;
          updatedSummary.isInstanceLoading = false;
          dispatch(flowInstanceBodyChanges(updatedSummary));
        }
      })
      .catch((err) => {
        dispatch(throwError(err, true));
      });
  };

export const flowDashboardClearInstanceSummaryAction = () => (dispatch) => {
  dispatch(flowClearInstance());
  return Promise.resolve();
};

export const updateSystemDashboardPagesApiThunk = (postData) => (dispatch) => {
  setPointerEvent(false);
  updatePostLoader(true);
  updateSystemDashboardPagesApi(postData)
    .then(async () => {
      showToastPopover(
        'System Pages Visiblity Updated',
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SUCCESS,
        true,
      );
      dispatch(
        getAllDashboardPagesThunk({ dashboard_id: postData?.dashboard_id }),
      );
      setPointerEvent(false);
      updatePostLoader(false);
    })
    .catch((error) => {
      console.log('api updateSystemDashboardPagesApiThunk error', error);
      setPointerEvent(false);
      updatePostLoader(false);
    });
};

// Table Component Or Field.
export const saveDashboardPageTableComponentOrTableFieldThunk =
  (params) => () =>
    new Promise((resolve, reject) => {
      setPointerEvent(true);
      updatePostLoader(true);
      saveDashboardPageTableComponentOrTableField(params)
        .then((res) => {
          setPointerEvent(false);
          updatePostLoader(false);
          resolve(res);
        })
        .catch((err) => {
          setPointerEvent(false);
          updatePostLoader(false);
          reject(err);
        });
    });

export const getDashboardFieldThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(dataChange({ isPagesLoading: true }));
    getDashboardField(params)
      .then((response) => {
        if (!jsUtility.isEmpty(response)) {
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          reject(errors);
        }
      })
      .catch((error) => {
        if (error && error.code === 'ERR_CANCELED') return;
        dispatch(dataChange({ isPagesLoading: false }));
        const errors = generateGetServerErrorMessage(error);
        reject(errors);
      });
  });

export const entityFormToDashboardPageThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(dataChange({ isCustomPageDataLoading: true }));
    EntityFormToDashboardPage(params)
      .then((response) => {
        if (!jsUtility.isEmpty(response)) {
          const pageMetadata = response;
          const { sections, fields } = getSectionAndFieldsFromResponse(
            response?.form_metadata?.sections || [],
            MODULE_TYPES.SUMMARY,
          );
          pageMetadata.formMetadata = { sections, fields };
          pageMetadata.formUUID = pageMetadata.form_metadata.form_uuid;
          delete pageMetadata.form_metadata;
          dispatch(
            dataChange({
              isCustomPageDataLoading: false,
              pageMetadata: response,
              selectedFlowStep: response?.step_uuid,
              currentFlowStep: response?.step_uuid,
              isInitialCustomSummary: !!isEmpty(response?.formMetadata?.fields),
            }),
          );
          resolve(true);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          reject(errors);
        }
      })
      .catch((error) => {
        if (error && error.code === 'ERR_CANCELED') return;
        dispatch(dataChange({ isCustomPageDataLoading: false }));
        const errors = generateGetServerErrorMessage(error);
        reject(errors);
      });
  });

export const deleteDashboardPageComponentThunk = (params, onSuccess) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    deleteDashboardPageComponentApi(params)
      .then((response) => {
        setPointerEvent(false);
        updatePostLoader(false);
        onSuccess?.();
        resolve(response);
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        reject(error);
      });
  });

export const getDashboardComponentThunk = (params) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    getDashboardComponentApi(params)
      .then((res) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const fieldData = getSummaryFieldDataByMetaData(res.field_details);
        if (!jsUtility.isEmpty(res.other_field_detail)) {
          fieldData.otherFieldDetail =
            res.other_field_detail;
        }
        if (!jsUtility.isEmpty(res.rule_details)) {
          fieldData[RESPONSE_FIELD_KEYS.RULE_NAME] =
            res.rule_details[0].rule_name;
        }
        if (!jsUtility.isEmpty(res.data_list)) {
          fieldData.selectedDataListUuid = res.data_list.data_list_uuid;
        }
        if (
          [
            fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE],
            res.other_field_detail?.[0]?.field_type,
          ].includes(FIELD_TYPE.USER_TEAM_PICKER)
        ) {
          fieldData.selectedDataListUuid =
            store?.getState()?.UserProfileReducer?.user_data_list_uuid;
        }
        if (!jsUtility.isEmpty(res?.document_url_details?.[0])) {
          const documentDetails = res?.document_url_details[0];
          const documents = {
            file: {
              name: `${documentDetails.original_filename.filename}.${documentDetails.original_filename.content_type}`,
              size: documentDetails.original_filename.file_size,
              type: documentDetails.original_filename.type,
            },
            fileId: documentDetails.document_id,
            fileName: `${documentDetails.original_filename.filename}.${documentDetails.original_filename.content_type}`,
            res_uuid: documentDetails.original_filename.ref_uuid,
            status: 2,
            type: documentDetails.original_filename.type,
            url: documentDetails.signedurl,
          };
          fieldData.documentData = { documents: [documents] };
        }
        resolve(fieldData);
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        if (error && error.code === 'ERR_CANCELED') return;
        const errors = generateGetServerErrorMessage(error);
        reject(errors);
      });
  });
export const getInstanceDetailsByIDThunk = (params) => (dispatch) => {
  dispatch(dataChange({ isPagesLoading: true }));
  return new Promise((resolve, reject) => {
    const { data_list_uuid } = params;
    let getInstanceDetails = null;
    if (data_list_uuid) {
      getInstanceDetails = getDatalistEntryBasicInfo;
    } else {
      getInstanceDetails = getInstanceDetailsByID;
    }
    getInstanceDetails(params)
      .then((res) => {
        if (res) {
          const updateData = {
            instanceDetails: {
              is_editable: undefined,
              is_deletable: undefined,
              ...res,
            },
            isPagesLoading: false,
          };
          dispatch(dataChange(updateData));
          resolve();
        }
      })
      .catch((err) => {
        dispatch(
          dataChange({
            isPagesLoading: false,
            isDashboardPageAuthorized: false,
          }),
        );
        dispatch(throwError(err, true));
        reject();
      });
  });
};

const valueCancelToken = null;
export const getExternalRulesThunk =
  (pageId, params = {}) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      const _params = {
        page: 1,
        size: 50,
        rule_type: [RULE_TYPE.DATA_LIST_QUERY, RULE_TYPE.INTEGRATION_FORM],
        page_id: pageId,
        ...params,
      };
      getRulesApi(_params, valueCancelToken)
        .then((response) => {
          const externalRules = deconstructExternalRulesForSummary(response);
          dispatch(pageBuilderDataChanges({ externalRules }));
          resolve(externalRules);
        })
        .catch((error) => {
          console.log('api getExternalRulesThunk error', error);
          somethingWentWrongErrorToast();
          reject(error);
        });
    });

export const getDataListEntryDetailsByIdApi =
  (params, isAudit = false) =>
  (dispatch) => {
    dispatch(editDatalistChange({ isDatalistEntryLoading: true }));
    setLoaderAndPointerEvent(true);
    return new Promise((resolve, reject) =>
      getDataListEntryDetailsById(params, isAudit)
        .then(async (response) => {
          setLoaderAndPointerEvent(false);
          if (!jsUtility.isEmpty(response)) {
            if (
              !jsUtility.isEmpty(response.form_metadata) &&
              !jsUtility.isEmpty(response.form_metadata.sections)
            ) {
              if (isAudit) {
                constructDeletedRow(
                  response.audit_data,
                  response.active_form_content,
                );
              }
              const { sections } = response;
              response.addDataListFormData = sections;
              response.initialAddDataListFormData = {
                ...response.addDataListFormData,
              };

              response = setInitialFormVisibleFields(response);
            }
            // new form update related changes
            const activeEntry = { informationFieldFormContent: {} };
            activeEntry.fields = {};
            activeEntry.activeFormData = {};
            activeEntry.formMetaData = {
              dependentFields:
                response.form_metadata?.fields?.dependent_fields || [],
              formVisibility:
                response.form_metadata?.fields?.form_visibility || {},
            };
            activeEntry.documentDetails = {};
            activeEntry.documentURLDetails = response.document_url_details;
            activeEntry.sections = (response.form_metadata?.sections || []).map(
              (section) => {
                const clonedSection = jsUtility.cloneDeep(section);
                clonedSection.layout = removeAllEmptyLayouts(
                  constructTreeStructure(section.contents),
                );
                section.field_metadata.forEach((f) => {
                  const field = normalizer(
                    f,
                    REQUEST_FIELD_KEYS,
                    RESPONSE_FIELD_KEYS,
                  );
                  field.isExistingSystemField = response?.entry_user_id;
                  if (
                    field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] ===
                      FIELD_TYPE.DATE ||
                    field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] ===
                      FIELD_TYPE.DATETIME
                  ) {
                    field.originalValidationData =
                      f?.[REQUEST_FIELD_KEYS.VALIDATIONS];
                  }

                  const fieldUUID = field[RESPONSE_FIELD_KEYS.FIELD_UUID];
                  activeEntry.fields[fieldUUID] = field;
                  // if field has a default value, add that to activeFormData
                  if (
                    field[RESPONSE_FIELD_KEYS.DEFAULT_VALUE] &&
                    field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] !==
                      FIELD_TYPE.USER_TEAM_PICKER
                  ) {
                    activeEntry.activeFormData[fieldUUID] =
                      field[RESPONSE_FIELD_KEYS.DEFAULT_VALUE];
                  }

                  if (
                    PROPERTY_PICKER_ARRAY.includes(
                      field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE],
                    )
                  ) {
                    const referenceFieldType =
                      field?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[
                        RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE
                      ];
                    if (
                      referenceFieldType === FIELD_TYPE.DROPDOWN ||
                      referenceFieldType === FIELD_TYPE.RADIO_GROUP ||
                      referenceFieldType === FIELD_TYPE.CHECKBOX
                    ) {
                      section?.field_metadata?.forEach((eachField) => {
                        if (
                          eachField?.[REQUEST_FIELD_KEYS.FIELD_UUID] ===
                          field?.[
                            RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS
                          ]?.[RESPONSE_FIELD_KEYS.REFERENCE_FIELD_UUID]
                        ) {
                          field[RESPONSE_FIELD_KEYS.CHOICE_VALUES] =
                            eachField?.[REQUEST_FIELD_KEYS.CHOICE_VALUES];
                        }
                      });
                    }
                  }

                  if (
                    field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] ===
                    FIELD_TYPE.DATA_LIST
                  ) {
                    field[RESPONSE_FIELD_KEYS.CHOICE_VALUE_OBJ] = {};
                    const displayFields =
                      field?.[RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS]?.[
                        RESPONSE_FIELD_KEYS.DISPLAY_FIELDS
                      ] || [];
                    displayFields.forEach((uuid) => {
                      const displayField = section?.field_metadata?.find(
                        (eachField) =>
                          eachField?.[REQUEST_FIELD_KEYS.FIELD_UUID] === uuid,
                      );
                      if (displayField) {
                        const choiceValues = jsUtility.get(
                          displayField,
                          [REQUEST_FIELD_KEYS.CHOICE_VALUES],
                          [],
                        );
                        const choiceObj = {};
                        choiceValues.forEach((c) => {
                          choiceObj[c.value.toString()] = c.label;
                        });
                        if (!jsUtility.isEmpty(choiceObj)) {
                          field[RESPONSE_FIELD_KEYS.CHOICE_VALUE_OBJ][uuid] =
                            choiceObj;
                        }
                      }
                    });
                  }
                });
                return clonedSection;
              },
            );
            activeEntry.activeFormData = getStateVariables(
              response.form_metadata.sections,
              response.active_form_content,
              response.document_url_details,
              getUserProfileData() || {},
              false,
            );

            dispatch(
              editDatalistChange({
                datalistEntryDetails: {
                  ...response,
                  activeEntry,
                  ...(isAudit && { is_editable: true }),
                  ref_uuid: uuidv4(), // for file upload
                },
                isDatalistEntryLoading: false,
              }),
            );

            resolve(response);
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            dispatch(
              editDatalistChange({
                server_error: errors.common_server_error,
                isDatalistEntryLoading: false,
              }),
            );
          }
        })
        .catch((error) => {
          const { server_error } = store.getState().CreateDataListReducer;
          const errorData = {
            error,
            server_error,
          };
          const apiFailureAction = {
            dispatch,
            action: editDatalistChange,
          };
          setLoaderAndPointerEvent(false);
          generateApiErrorsAndHandleCatchBlock(
            errorData,
            apiFailureAction,
            false,
            true,
          );
          reject(jsUtility.get(error, ['response', 'data', 'errors', '0'], ''));
        }),
    );
  };

export const addNewDataListEntryApiThunk = (data, profileData) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(editDatalistChange({ isDatalistEntryLoading: true }));
    setLoaderAndPointerEvent(true);
    submitDataListEntry(data)
      .then((response) => {
        dispatch(editDatalistChange({ isDatalistEntryLoading: false }));
        setLoaderAndPointerEvent(false);
        if (response) {
          const state = store.getState();
          dispatch(updateProfileAction(profileData, state, data));
          resolve();
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(
            editDatalistChange({ server_error: errors.common_server_error }),
          );
          reject(err);
        }
      })
      .catch((error) => {
        dispatch(editDatalistChange({ isDatalistEntryLoading: false }));
        setLoaderAndPointerEvent(false);
        if (
          error?.response?.data?.errors[0]?.type ===
          VALIDATION_ERROR_TYPES.LIMIT
        ) {
          return showToastPopover(
            'Limit exceeded',
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        const { server_error } =
          store.getState().IndividualEntryReducer.editDatalist;
        const errorData = {
          error,
          server_error,
        };
        const apiFailureAction = {
          dispatch,
          action: editDatalistChange,
        };
        if (
          error.response &&
          error.response.data &&
          !jsUtility.isEmpty(error.response.data.errors)
        ) {
          let errorList = {};
          const errorListFromServer = jsUtility.get(
            error,
            ['response', 'data', 'errors'],
            [],
          );
          errorListFromServer.forEach(({ field, type, indexes }) => {
            if (type === 'invalid') {
              const errorKeys = typeof field === String ? field.split('.') : [];
              if (
                errorKeys.length &&
                errorKeys[errorKeys.length - 1] === 'users'
              ) {
                const entryData = jsUtility.cloneDeep(
                  store.getState().IndividualEntryReducer.editDatalist
                    .datalistEntryDetails,
                );
                const { addDataListFormData } = jsUtility.cloneDeep(entryData);
                if (errorKeys.length === 2) {
                  // task field error
                  errorList = {
                    ...errorList,
                    [errorKeys[0]]: translate(
                      'error_popover_status.invalid_users',
                    ),
                  };
                } else {
                  // table field error
                  const [tableUuid, rowIndex, fieldUuid] = errorKeys;
                  if (!jsUtility.isEmpty(tableUuid)) {
                    const postDataTableRow = jsUtility.get(data, [
                      tableUuid,
                      rowIndex,
                    ]);
                    const tableData = addDataListFormData[tableUuid] || [];
                    const index = tableData.findIndex(
                      (rowData) => postDataTableRow._id === rowData._id,
                    );
                    if (index > -1) {
                      const tableRow = tableData[index];
                      if (!jsUtility.isEmpty(tableRow)) {
                        const errorListKey = [
                          tableUuid,
                          tableRow.temp_row_uuid,
                          fieldUuid,
                        ].join(',');
                        errorList = {
                          ...errorList,
                          [errorListKey]: translate(
                            'error_popover_status.invalid_users',
                          ),
                        };
                      }
                    }
                  }
                }
              }
            } else if (type === 'custom') {
              const errorKeys = field ? field.split('.') : EMPTY_STRING || [];
              const [tableUuid, fieldUuid] = errorKeys;
              if (
                !jsUtility.isEmpty(tableUuid) &&
                !jsUtility.isEmpty(fieldUuid) &&
                indexes === 'Unique Column Error'
              ) {
                const selectedTable = data[tableUuid];
                const [uniqueColumnValidationMessage, notUniqueIndices] =
                  getTableUniqueColumnMessage(selectedTable, fieldUuid, false);

                if (uniqueColumnValidationMessage) {
                  errorList = {
                    ...errorList,
                    [tableUuid]: uniqueColumnValidationMessage,
                    [`${tableUuid}non_unique_indices`]: notUniqueIndices,
                  };
                }
              }
            }
          });
          if (!jsUtility.isEmpty(errorList)) {
            dispatch(
              editDatalistChange({
                isDatalistEntryLoading: false,
                error_list: errorList,
              }),
            );
          } else {
            generateApiErrorsAndHandleCatchBlock(
              errorData,
              apiFailureAction,
              false,
              true,
            );
          }
        } else {
          generateApiErrorsAndHandleCatchBlock(
            errorData,
            apiFailureAction,
            false,
            true,
          );
        }
        reject(error);
        return null;
      });
  });
export const getGetDatalistVersionHistoryByUUID = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    dispatch(
      versionHistoryStarted(),
    );
    getGetDatalistHistoryByUUID(params)
      .then((response) => {
        response.map((versionHistory) => {
          versionHistory.isShow = false;
          return versionHistory;
        });
        const updatedResponse = (response) => response.sort((a, b) => b.version - a.version);
        dispatch(versionHistoryChanges(updatedResponse));
        resolve(response);
        setPointerEvent(false);
        updatePostLoader(false);
      })
      .catch((error) => {
        const err_obj = {
          versionHistory: {},
          isVersionHistoryError: error,
          isVersionHistoryLoading: false,
        };
        reject(error);
        dispatch(versionHistoryChanges(err_obj));
      });
  });
