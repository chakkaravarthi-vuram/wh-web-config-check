import { v4 as uuidv4 } from 'uuid';
import { translate } from 'language/config';
import {
  getAllDraftDataListApiService,
} from 'axios/apiService/listDataList.apiService';
import { constructDeletedRow } from 'containers/data_list/view_data_list/data_list_audit/detailed_audit_view/DetailedAuditView.utils';
import { getTableUniqueColumnMessage } from 'containers/landing_page/my_tasks/task_content/TaskContent.validation.schema';
import { createElementAllFlow } from 'containers/landing_page/flows/Flow.utils';
import { LIST_TYPE } from 'components/list_headers/ListHeader';
import {
  CancelToken,
  generateApiErrorsAndHandleCatchBlock,
  getUserProfileData,
  setPointerEvent,
  showToastPopover,
  updatePostLoader,
} from '../../utils/UtilityFunctions';
import { store } from '../../Store';
import {
  getAllDataListEntriesFailedAction,
  getAllDataListEntriesStartedAction,
  getAllDataListFailedAction,
  getAllOtherDataListFailedAction,
  getAllOtherDataListInfiniteScrollStartedAction,
  getAllOtherDataListStartedAction,
  getAllOtherDataListSuccessAction,
  getAllRecentDataListFailedAction,
  getAllRecentDataListStartedAction,
  getAllRecentDataListSuccessAction,
  getDataListEntryDetailsFailedAction,
  getDataListEntryDetailsStartedAction,
  getDataListEntryDetailsSuccessAction,
  submitDataListEntryFailedAction,
  submitDataListEntryStartedAction,
  submitDataListEntrySuccessAction,
  getDataListEntryTaskDetailsStarted,
  getDataListEntryTaskDetailsSuccess,
  getDataListEntryTaskDetailsFailed,
  getDataListListingApiSuccessAction,
  setPopperVisibilityTruncateAll,
  addDataListChangeAction,
} from '../reducer/DataListReducer';
import jsUtils, { cloneDeep, get, isEmpty, removeDuplicateFromArrayOfObjects } from '../../utils/jsUtility';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import {
  getAllDataList,
  getDataListEntryDetailsById,
  submitDataListEntry,
  getDataListEntryTaskDetails,
  truncateDatalistApi,
} from '../../axios/apiService/dataList.apiService';
import {
  EMPTY_STRING,
  VALIDATION_ERROR_TYPES,
} from '../../utils/strings/CommonStrings';
import {
  FIELD_TYPE, PROPERTY_PICKER_ARRAY,
} from '../../utils/constants/form.constant';
import { setReferenceIdLoading } from '../reducer/CreateTaskReducer';
import { setInitialFormVisibleFields } from '../../utils/formUtils';
import { constructTreeStructure, removeAllEmptyLayouts } from '../../containers/form/sections/form_layout/FormLayout.utils';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../../utils/constants/form/form.constant';
import { normalizer } from '../../utils/normalizer.utils';
import { getStateVariables } from '../../containers/landing_page/my_tasks/task_content/TaskContent.utils';
import { updateProfileAction } from '../../containers/application/app_components/dashboard/datalist/Datalist.utils';
import { getAllDevDatalistApiService } from '../../axios/apiService/listDataList.apiService';

const dlListCancelToken = new CancelToken();

// data list
export const getAllDataListApi =
  (params, type, isPaginatedData = false) =>
  (dispatch) => {
    if (type === 'isRecent') {
      dispatch(getAllRecentDataListStartedAction());
    } else if (type === 'isOthers') {
      if (isPaginatedData) {
        dispatch(getAllOtherDataListInfiniteScrollStartedAction());
      } else dispatch(getAllOtherDataListStartedAction());
    }
    setPointerEvent(true);
    getAllDataList(params)
      .then((res) => {
        setPointerEvent(false);
        if (!jsUtils.isEmpty(res)) {
          const data = {
            list: res.data_list,
            total_count: res.data_list_count,
            isPaginatedData,
          };
          if (type === 'isRecent') {
            dispatch(getAllRecentDataListSuccessAction(data));
          } else if (type === 'isOthers') {
            dispatch(getAllOtherDataListSuccessAction(data));
          }
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          if (type === 'isRecent') {
            dispatch(
              getAllRecentDataListFailedAction(errors.common_server_error),
            );
          } else if (type === 'isOthers') {
            dispatch(
              getAllOtherDataListFailedAction(errors.common_server_error),
            );
          }
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
          action: getAllDataListFailedAction,
        };
        generateApiErrorsAndHandleCatchBlock(
          errorData,
          apiFailureAction,
          false,
          true,
        );
      });
  };

// data list entry task
export const getDataListEntryTaskListApi = (params) => (dispatch) => {
  dispatch(getDataListEntryTaskDetailsStarted());
  setPointerEvent(true);
  updatePostLoader(true);
  getDataListEntryTaskDetails(params)
    .then((res) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (!jsUtils.isEmpty(res)) {
        const { allDataListEntryTaskEntries } = store.getState().DataListReducer;
        const allTasks = [...allDataListEntryTaskEntries || [], ...res.pagination_data || []];
        dispatch(
          getDataListEntryTaskDetailsSuccess({
            allDataListEntryTaskEntries: res.pagination_data,
            allDatalistEntryTasks: removeDuplicateFromArrayOfObjects(allTasks, '_id'),
            dataListEntryTaskCount: res.pagination_details[0].total_count,
            dataListEntryTaskDocumentUrl: res.document_url_details,
          }),
        );
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const error = generateGetServerErrorMessage(err);
        dispatch(getDataListEntryTaskDetailsFailed(error.common_server_error));
      }
    })
    .catch((err) => {
      if (err && err.code === 'ERR_CANCELED') return;
      const { server_error } = store.getState().DataListReducer;
      const error_data = {
        error: err,
        server_error,
      };
      const apiFailureAction = {
        dispatch,
        action: getDataListEntryTaskDetailsFailed,
      };
      generateApiErrorsAndHandleCatchBlock(
        error_data,
        apiFailureAction,
        false,
        true,
      );
    });
};

export const getDataListEntryDetailsByIdApi =
  (params, history, isAudit) =>
  (dispatch) => {
    dispatch(getDataListEntryDetailsStartedAction());
    setPointerEvent(true);
    updatePostLoader(true);
    return new Promise((resolve, reject) =>
      getDataListEntryDetailsById(params, isAudit)
        .then(async (response) => {
          const { isEditable } = cloneDeep(store.getState().DataListReducer);
          setPointerEvent(false);
          updatePostLoader(false);
          dispatch(setReferenceIdLoading(false));
          if (!jsUtils.isEmpty(response)) {
            if (
              !jsUtils.isEmpty(response.form_metadata) &&
              !jsUtils.isEmpty(response.form_metadata.sections)
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
              // sections.forEach((section) => {
              //   if (section.field_list) {
              //     section.field_list.forEach((eachFieldList) => {
              //       eachFieldList.fields.forEach((field) => {
              //         if (
              //           !jsUtils.isEmpty(
              //             response.active_form_content[field.field_uuid],
              //           ) &&
              //           field.field_type === FIELD_TYPE.FILE_UPLOAD
              //         ) {
              //           const fileDetails = jsUtils.find(
              //             response.document_url_details,
              //             {
              //               document_id:
              //                 response.active_form_content[field.field_uuid],
              //             },
              //           );
              //           if (fileDetails && fileDetails.signedurl) {
              //             response.active_form_content[
              //               field.field_uuid
              //             ] = `${fileDetails.original_filename.filename} (${fileDetails.original_filename.content_type} )`;
              //           }
              //         } else if (
              //           PROPERTY_PICKER_ARRAY.includes(field.field_type) &&
              //           getFieldType(field) === FIELD_TYPE.FILE_UPLOAD
              //         ) {
              //           response.active_form_content[field.field_uuid] =
              //             getDefaultValue(
              //               response.active_form_content,
              //               field.field_uuid,
              //               [field.field_uuid],
              //               response.document_url_details,
              //             );
              //           response.addDataListFormData[field.field_uuid] =
              //             response.active_form_content[field.field_uuid];
              //         }
              //       });
              //     });
              //   }
              // });

              response = setInitialFormVisibleFields(response);
            }
          // new form update related changes
          const activeEntry = { informationFieldFormContent: {} };
          activeEntry.fields = {};
          activeEntry.activeFormData = {};
          activeEntry.formMetaData = {
            dependentFields: response.form_metadata?.fields?.dependent_fields || [],
            formVisibility: response.form_metadata?.fields?.form_visibility || {},
          };
          activeEntry.documentDetails = {};
          activeEntry.documentURLDetails = response.document_url_details;
          activeEntry.sections = (response.form_metadata?.sections || []).map((section) => {
            const clonedSection = cloneDeep(section);
            clonedSection.layout = removeAllEmptyLayouts(constructTreeStructure(section.contents));
            section.field_metadata.forEach((f) => {
              const field = normalizer(f, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS);
              field.isExistingSystemField = response?.entry_user_id;
              if ((field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.DATE) ||
              (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.DATETIME)) {
                field.originalValidationData = f?.[REQUEST_FIELD_KEYS.VALIDATIONS];
              }

              const fieldUUID = field[RESPONSE_FIELD_KEYS.FIELD_UUID];
              activeEntry.fields[fieldUUID] = field;
              // if field has a default value, add that to activeFormData
              if (field[RESPONSE_FIELD_KEYS.DEFAULT_VALUE] &&
                (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] !== FIELD_TYPE.USER_TEAM_PICKER)) {
                activeEntry.activeFormData[fieldUUID] = field[RESPONSE_FIELD_KEYS.DEFAULT_VALUE];
              }

              if (PROPERTY_PICKER_ARRAY.includes(field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE])) {
                const referenceFieldType = field?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE];
                if ((referenceFieldType === FIELD_TYPE.DROPDOWN) ||
                (referenceFieldType === FIELD_TYPE.RADIO_GROUP) ||
                (referenceFieldType === FIELD_TYPE.CHECKBOX)) {
                  section?.field_metadata?.forEach((eachField) => {
                    if (eachField?.[REQUEST_FIELD_KEYS.FIELD_UUID] === field?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[RESPONSE_FIELD_KEYS.REFERENCE_FIELD_UUID]) {
                      field[RESPONSE_FIELD_KEYS.CHOICE_VALUES] = eachField?.[REQUEST_FIELD_KEYS.CHOICE_VALUES];
                    }
                  });
                }
              }

              if (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.DATA_LIST) {
                field[RESPONSE_FIELD_KEYS.CHOICE_VALUE_OBJ] = {};
                const displayFields = field?.[RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS]?.[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS] || [];
                displayFields.forEach((uuid) => {
                  const displayField = section?.field_metadata?.find((eachField) => eachField?.[REQUEST_FIELD_KEYS.FIELD_UUID] === uuid);
                    if (displayField) {
                      const choiceValues = get(displayField, [REQUEST_FIELD_KEYS.CHOICE_VALUES], []);
                      const choiceObj = {};
                      choiceValues.forEach((c) => {
                        choiceObj[c.value.toString()] = c.label;
                      });
                      if (!isEmpty(choiceObj)) field[RESPONSE_FIELD_KEYS.CHOICE_VALUE_OBJ][uuid] = choiceObj;
                    }
                });
              }
            });
            return clonedSection;
          });
          activeEntry.activeFormData = getStateVariables(
            response.form_metadata.sections,
            response.active_form_content,
            response.document_url_details,
            getUserProfileData() || {},
            false,
          );

          // activeEntry.activeFormData = constructActiveFormDataFromResponse(
          //   { ...activeEntry.activeFormData, ...response.active_form_content },
          //   activeEntry.fields,
          //   { documentDetails: response.document_url_details },
          // );

            dispatch(
              getDataListEntryDetailsSuccessAction({
                ...response,
                activeEntry,
                ...(isAudit) && { is_editable: isEditable },
                ref_uuid: uuidv4(), // for file upload
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
              getDataListEntryDetailsFailedAction(errors.common_server_error),
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
            action: getDataListEntryDetailsFailedAction,
          };
          generateApiErrorsAndHandleCatchBlock(
            errorData,
            apiFailureAction,
            false,
            true,
          );
          reject(jsUtils.get(error, ['response', 'data', 'errors', '0'], ''));
        }),
    );
  };

export const addNewDataListEntryApiThunk =
  (data, data_list_uuid, isEditView, profileData) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(submitDataListEntryStartedAction());
      setPointerEvent(true);
      updatePostLoader(true);
      submitDataListEntry(data)
        .then((response) => {
          setPointerEvent(false);
          updatePostLoader(false);
          if (response) {
            dispatch(submitDataListEntrySuccessAction());
            if (isEditView) {
              const state = store.getState();
              dispatch(updateProfileAction(profileData, state, data));
            }
            resolve();
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            dispatch(
              submitDataListEntryFailedAction(errors.common_server_error),
            );
            reject(err);
          }
        })
        .catch((error) => {
          setPointerEvent(false);
          updatePostLoader(false);
          if (error?.response?.data?.errors[0]?.type === VALIDATION_ERROR_TYPES.LIMIT) {
            return showToastPopover(
              'Limit exceeded',
              EMPTY_STRING,
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          }
          const { server_error } = store.getState().DataListReducer;
          const errorData = {
            error,
            server_error,
          };
          const apiFailureAction = {
            dispatch,
            action: submitDataListEntryFailedAction,
          };
          if (
            error.response &&
            error.response.data &&
            !jsUtils.isEmpty(error.response.data.errors)
          ) {
            let errorList = {};
            const errorListFromServer = jsUtils.get(
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
                  const entryData = jsUtils.cloneDeep(
                    store.getState().DataListReducer
                      .particularDataListEntryDetails,
                  );
                  const { addDataListFormData } = jsUtils.cloneDeep(entryData);
                  if (errorKeys.length === 2) {
                    // task field error
                    errorList = {
                      ...errorList,
                      [errorKeys[0]]: translate('error_popover_status.invalid_users'),
                    };
                  } else {
                    // table field error
                    const [tableUuid, rowIndex, fieldUuid] = errorKeys;
                    if (!jsUtils.isEmpty(tableUuid)) {
                      const postDataTableRow = jsUtils.get(data, [
                        tableUuid,
                        rowIndex,
                      ]);
                      const tableData = addDataListFormData[tableUuid] || [];
                      const index = tableData.findIndex(
                        (rowData) => postDataTableRow._id === rowData._id,
                      );
                      if (index > -1) {
                        const tableRow = tableData[index];
                        if (!jsUtils.isEmpty(tableRow)) {
                          const errorListKey = [
                            tableUuid,
                            tableRow.temp_row_uuid,
                            fieldUuid,
                          ].join(',');
                          errorList = {
                            ...errorList,
                            [errorListKey]: translate('error_popover_status.invalid_users'),
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
                  !jsUtils.isEmpty(tableUuid) &&
                  !jsUtils.isEmpty(fieldUuid) &&
                  indexes === 'Unique Column Error'
                ) {
                  const selectedTable = data[tableUuid];
                  const [uniqueColumnValidationMessage, notUniqueIndices] =
                    getTableUniqueColumnMessage(
                      selectedTable,
                      fieldUuid,
                      false,
                    );

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
            if (!jsUtils.isEmpty(errorList)) {
              dispatch(
                addDataListChangeAction({
                  isDataLoading: false,
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

export const getAllDataListDraftThunk = (params) => (dispatch) => {
  dispatch(
    getAllDataListEntriesStartedAction({
      isLoadMoreHandler: params.page > 1,
    }),
  );
  getAllDraftDataListApiService(params)
    .then((response) => {
      if (!jsUtils.isEmpty(response)) {
        let datalistListUpdated = [];
        if (params.page === 1) {
          datalistListUpdated = response.pagination_data;
        } else {
          const { data_list } = jsUtils.cloneDeep(
            store.getState().DataListReducer,
          );
          const reponseDataList = response.pagination_data;
          data_list.push(...reponseDataList);
          datalistListUpdated = data_list;
        }
        const remainingDatalistCount =
          response.pagination_details[0].total_count -
          datalistListUpdated.length;

        dispatch(
          getDataListListingApiSuccessAction({
            data_list: datalistListUpdated,
            total_count: response.pagination_details[0].total_count,
            remainingDatalistCount,
            size: params.size,
            document_url_details: response.document_url_details,
            hasMore: remainingDatalistCount > 0,
          }),
        );
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(
          getAllDataListEntriesFailedAction(errors.common_server_error),
        );
      }
    })
    .catch((error) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.errors[0].type.includes('string') &&
        error.response.data.errors[0].field === 'data_list_uuid'
      ) {
        const errors = generateGetServerErrorMessage(error);
        dispatch(
          getAllDataListEntriesFailedAction(errors.common_server_error),
        );
        showToastPopover(
          translate('error_popover_status.invalid_url'),
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    });
};

export const getAllDevDataListApiThunk = (params, type) =>
  (dispatch) => {
    if (type === LIST_TYPE.DATA_LIST) {
      dispatch(getAllOtherDataListStartedAction());
    } else {
      dispatch(
        getAllDataListEntriesStartedAction({
          isLoadMoreHandler: params.page > 1,
        }),
      );
    }
    getAllDevDatalistApiService(params, dlListCancelToken)
      .then((response) => {
        if (!jsUtils.isEmpty(response)) {
          if (type === LIST_TYPE.DATA_LIST) {
            const sizeAfterCalculation = createElementAllFlow(
              response.pagination_data,
              LIST_TYPE.DATA_LIST,
            );
            params.size = sizeAfterCalculation;
            const data = {
              list: response?.pagination_data?.slice(0, sizeAfterCalculation),
              total_count: response?.pagination_details?.[0]?.total_count,
            };
            dispatch(getAllOtherDataListSuccessAction(data));
          } else {
            let datalistListUpdated = [];
            if (params.page === 1) {
              datalistListUpdated = response.pagination_data;
            } else {
              const { data_list } = jsUtils.cloneDeep(
                store.getState().DataListReducer,
              );
              const reponseDataList = response.pagination_data;
              data_list.push(...reponseDataList);
              datalistListUpdated = data_list;
            }
            dispatch(
              getDataListListingApiSuccessAction({
                data_list: datalistListUpdated,
                size: params.size,
                hasMore: response.pagination_details[0].total_count > datalistListUpdated.length,
                total_count: response.pagination_details[0].total_count,
                document_url_details: response.document_url_details,
              }),
            );
          }
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          if (type === LIST_TYPE.DATA_LIST) {
            const apiFailureAction = {
              dispatch,
              action: getAllOtherDataListFailedAction,
            };
            generateApiErrorsAndHandleCatchBlock(
              errors,
              apiFailureAction,
              false,
              true,
            );
          } else {
            dispatch(
              getAllDataListEntriesFailedAction(errors.common_server_error),
            );
          }
        }
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors[0].type.includes('string') &&
          error.response.data.errors[0].field === 'data_list_uuid'
        ) {
          showToastPopover(
            translate('error_popover_status.invalid_url'),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
      });
  };

export const truncateAllEntryThunk = (param, reloadDashboard) => (dispatch) => {
  updatePostLoader(true);
  truncateDatalistApi(param)
    .then((response) => {
      if (response) {
        showToastPopover(translate('error_popover_status.entries_truncate'), translate('error_popover_status.datalist_entry_truncated'), FORM_POPOVER_STATUS.DELETE, true);
        reloadDashboard();
        updatePostLoader(false);
        dispatch(setPopperVisibilityTruncateAll(false));
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(getAllDataListEntriesFailedAction(errors.common_server_error));
      }
    })
    .catch((error) => {
      updatePostLoader(false);
      dispatch(setPopperVisibilityTruncateAll(false));
      if (error && error.response && error.response.data) {
        showToastPopover(
          translate('error_popover_status.somthing_went_wrong_try_again'),
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    });
};
