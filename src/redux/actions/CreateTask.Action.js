import { translate } from 'language/config';
import { getFormDetailsByTaskMetadataId } from 'axios/apiService/task.apiService';
import { getDataListEntryDetailsById } from 'axios/apiService/dataList.apiService';
import { apiGetInstanceDetailsByID } from 'axios/apiService/flowList.apiService';
import {
  getDataFromRuleFields,
  getSelectedOperatorInfo,
} from 'utils/rule_engine/RuleEngine.utils';
import { QUERY_BUILDER_INITIAL_STATE } from 'components/query_builder/QueryBuilder.strings';
import { getVisibilityExternalFieldsData } from 'redux/reducer';
import { getFormattedDateFromUTC } from 'utils/dateUtils';
import { getCurrentUserId } from 'utils/userUtils';
import { EXPRESSION_TYPE } from 'utils/constants/rule/rule.constant';
import { EMPTY_STRING, FORM_POPOVER_STRINGS, SOMEONE_IS_EDITING, VALIDATION_ERROR_TYPES } from 'utils/strings/CommonStrings';
import { saveTable } from 'axios/apiService/form.apiService';
import { v4 as uuidv4 } from 'uuid';
import {
  setPointerEvent,
  updatePostLoader,
  updateErrorPopoverInRedux,
  updateEditConfirmPopOverStatus,
  showToastPopover,
} from '../../utils/UtilityFunctions';
import { store } from '../../Store';
import {
  publishTask,
  saveTask,
  saveForm,
  getTaskAssigneeSuggestionApi,
  deleteTask,
  deleteFormBuilder,
  saveField,
  saveSection,
  validateFormApi,
} from '../../axios/apiService/createTask.apiService';
import { TASK_STRINGS } from '../../containers/task/task/Task.strings';
import {
  fieldAutoCompleteStarted,
  getAllFieldsTaskFailedAction,
  getAllFieldsTaskStartedAction,
  getAllFieldsTaskSuccessAction,
  refreshTaskListApiStarted,
  ruleFieldTypeChangeTaskFailed,
  ruleFieldTypeChangeTaskStarted,
  ruleFieldTypeChangeTaskSucess,
} from './TaskActions';
import {
  generatePostServerErrorMessage,
  generateGetServerErrorMessage,
} from '../../server_validations/ServerValidation';
import {
  FIELD_TYPES,
} from '../../components/form_builder/FormBuilder.strings';
import {
  getInitialTaskAssigneeSuggestionList,
  getSaveFieldDetailsAPIData,
  getSaveTableDetailsAPIData,
  getTaskDetailsAPIData,
} from '../../containers/task/task/Task.utils';
import {
  apiSaveRule,
  deleteForm,
  apiGetAllFieldsList,
  apiGetRuleOperatorsByFieldType,
  apiGetRuleDetailsById,
} from '../../axios/apiService/flow.apiService';
import { FORM_POPOVER_STATUS, FLOW_MIN_MAX_CONSTRAINT } from '../../utils/Constants';
import jsUtils, {
  nullCheck,
  cloneDeep,
  get,
  isEmpty,
  has,
} from '../../utils/jsUtility';
import {
  createTaskSetState,
  saveRuleAction,
  assigneeSuggestionApiStarted,
  setEntireField,
} from '../reducer/CreateTaskReducer';
import { getArrOperatorData } from './CreateDataList.action';
import {
  saveFormApiResponseProcess,
  isSectionNameChanged,
  getTableColConditionList,
} from '../../utils/formUtils';
import { FIELD_KEYS, FIELD_LIST_TYPE, GET_SECTION_INITIAL_DATA } from '../../utils/constants/form.constant';
import { externalFieldDataChange, setOperators, updateTableColConditionList } from './Visibility.Action';
import { externalFieldsDataChange } from './DefaultValueRule.Action';
import { handleSyntaxError } from './FormulaBuilder.Actions';
import { getNewRowWithColumns } from '../../containers/form/layout/Layout.utils';
import { COLUMN_LAYOUT } from '../../containers/form/sections/form_layout/FormLayout.string';
import { FORM_LAYOUT_TYPE } from '../../containers/form/Form.string';
import { getSectionAndFieldsFromResponse } from '../../containers/form/sections/form_layout/FormLayout.utils';

export const updateSomeoneIsEditingPopover = (errorMessage) => {
  const state = store.getState().CreateTaskReducer;
  const { time, isMoreThanHoursLimit } = getFormattedDateFromUTC(errorMessage.edited_on, SOMEONE_IS_EDITING);
  const isCurrentUser = getCurrentUserId() === errorMessage.user_id;
  let editSubtitle = null;
  if (isCurrentUser) {
    editSubtitle = translate('error_popover_status.editing_another_screen');
  } else {
    editSubtitle = `${errorMessage.full_name} (${errorMessage.email}) ${translate('error_popover_status.is_editing')}`;
  }
  updateEditConfirmPopOverStatus({
    title: translate('error_popover_status.error_in_task'),
    subTitle: editSubtitle,
    secondSubTitle: isCurrentUser ? EMPTY_STRING : `${translate('error_popover_status.last_edited')} ${time}`,
    status: FORM_POPOVER_STATUS.SERVER_ERROR,
    isVisible: false,
    isEditConfirmVisible: true,
    type: 'Task',
    enableDirectEditing: isCurrentUser && isMoreThanHoursLimit,
    params: {
      task_metadata_id: state.task_details._id,
      task_metadata_uuid: state.task_details.task_metadata_uuid,
    },
  });
};

export const deleteFormApi = (taskId) =>
  new Promise((resolve, reject) => {
    setPointerEvent(true);
    updatePostLoader(true);
    deleteForm({ task_metadata_id: taskId }).then(
      (res) => resolve(res),
      (error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors[0].type === 'someone_editing'
        ) {
          updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
        } else if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.errors.length
        ) {
          reject(error);
        }
      },
    );
  });

export const deleteFormBuilderApiThunk = (data) => (dispatch) => new Promise((resolve) => {
  deleteFormBuilder(data)
    .then((response) => {
      console.log('delete form success', response);
      const state = store.getState().CreateTaskReducer;
      let { sections } = state;
      sections = [];
      setPointerEvent(false);
      updatePostLoader(false);
      showToastPopover(
        FORM_POPOVER_STRINGS.FORM_BUILDER_REMOVED_SUCCESS,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SUCCESS,
        true,
      );
      dispatch(
        createTaskSetState({
          isFormAccordionVisible: false,
          sections,
          // form_details: state.form_details,
          isFormVisible: false,
          form_details: {},
        }),
      );
      resolve(true);
    }).catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.errors[0].type === 'someone_editing'
      ) {
        updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
      }
    });
});

export const publishTaskApiThunk = (data, history, onCloseIconClick = undefined, updateTOdoTask, mlUrlParam) => (dispatch) => {
  publishTask(data, mlUrlParam)
    .then(() => {
      dispatch(refreshTaskListApiStarted());
      showToastPopover(
        TASK_STRINGS.TASK_SUBMIT_SUCCESSFUL_UPDATE.title,
        TASK_STRINGS.TASK_SUBMIT_SUCCESSFUL_UPDATE.subTitle,
        FORM_POPOVER_STATUS.SUCCESS,
        true,
      );
      dispatch(
        createTaskSetState({
          isTaskPublished: true,
        }),
      );
      setPointerEvent(false);
      updatePostLoader(false);
      onCloseIconClick();
      updateTOdoTask();
    })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.errors[0].type === 'someone_editing'
      ) {
        updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
      } else if (error?.response?.data?.errors[0]?.field?.includes('data_list')) {
        showToastPopover(
          'Error in field',
          'Check the field configuration',
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        dispatch(
          createTaskSetState({
            server_error: error.response.data.errors,
          }),
        );
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.errors &&
        error.response.data.errors[0].type === 'not_exist' &&
        error.response.data.errors[0].field === 'form_id'
      ) {
        updateErrorPopoverInRedux(
          TASK_STRINGS.PUBLISH_TASK_ERROR_UPDATE,
          TASK_STRINGS.PUBLISH_TASK_ERROR_UPDATE_SUBTITLE,
        );
      } else if (error?.response?.data?.errors[0]?.type === VALIDATION_ERROR_TYPES.LIMIT) {
          showToastPopover(
            'Limit exceeded',
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
      if (error && error.response && error.response.data) {
        dispatch(
          createTaskSetState({
            server_error: error.response.data.errors,
          }),
        );
      }
    });
};

export const saveTaskApiThunk = (postData, withoutTaskIdOrPublish, saveFormAPI, publishTaskApi, mlUrlParam, initialCallData) =>
  async (dispatch) => {
    let saveApiResponse;
    let editError = false;
    let saveApiError = {};
    setPointerEvent(true);
    updatePostLoader(true);

    const isInitial = !isEmpty(initialCallData);
    if (isInitial) {
      postData.data = {
        ...postData.data,
        ...initialCallData,
      };
    }
    await saveTask(isInitial ? initialCallData : postData.data, mlUrlParam).then((response) => {
      saveApiResponse = response;
    }).catch(async (error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      const errorData = jsUtils.get(error, ['response', 'data', 'errors', 0], null);
      const type = errorData?.type;
      const field = errorData?.field;
      if (type === VALIDATION_ERROR_TYPES.INVALID && field?.includes('assignees')) {
        showToastPopover(
          translate(FORM_POPOVER_STRINGS.INVALID_ASSIGNEES),
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      } else {
      if (jsUtils.get(error, ['response', 'data', 'errors', 0, 'type'], null) === 'someone_editing') {
        editError = true;
        updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
      } else {
        saveApiError = generatePostServerErrorMessage(
          error,
          {},
          { users: 'users', assignees: 'assignees', teams: 'teams' },
          true,
        );
        if (isEmpty(saveApiError?.state_error?.task_name)) {
          showToastPopover(
            TASK_STRINGS.SAVE_TASK_ERROR_UPDATE.title,
            saveApiError.common_server_error,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        if (!isEmpty(saveApiError?.state_error?.task_name)) {
          dispatch(
            createTaskSetState({
              error_list: { ...saveApiError.state_error },
            }),
          );
        }
      }
    }
    });
    if (editError) return { success: false, error: { ...{ someone_editing: 'Error in task, someone is editing' } } };
    if (!jsUtils.isEmpty(saveApiError)) return { success: false, error: { ...saveApiError } };
    const documentDetails =
      jsUtils.isEmpty(jsUtils.get(saveApiResponse, ['document_url_details'], [])) ?
        jsUtils.get(store.getState().CreateTaskReducer, ['task_details', 'document_url_details'], []) :
        jsUtils.isEmpty(jsUtils.get(saveApiResponse, ['document_url_details'], [])).concat(
          ...jsUtils.get(store.getState().CreateTaskReducer, ['task_details', 'document_url_details'], []),
        );
    saveApiResponse.document_url_details = documentDetails;
    dispatch(
      createTaskSetState({
        task_details: saveApiResponse,
      }),
    );
    if (withoutTaskIdOrPublish === 'withoutTaskId' && !editError) {
      return saveFormAPI();
    } else if (withoutTaskIdOrPublish === 'publish' && !editError) {
      return publishTaskApi(saveApiResponse, mlUrlParam);
    }
    setPointerEvent(false);
    updatePostLoader(false);
    return true;
  };

export const deleteTaskApiThunk = (data) => (dispatch) => new Promise(
  (resolve, reject) => {
    deleteTask(data)
    .then(() => {
      const state = cloneDeep(store.getState().CreateTaskReducer);
      let { sections } = state;
      if (!jsUtils.isUndefined(state.form_details)) {
        delete state.form_details?.form_uuid;
      }
      sections = [];
      setPointerEvent(false);
      updatePostLoader(false);
      dispatch(
        createTaskSetState({
          isFormAccordionVisible: false,
          sections,
          form_details: state.form_details,
        }),
      );
      resolve();
    }).catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.errors[0].type === 'someone_editing'
      ) {
        updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
      }
      reject(error);
    });
  },
);

const saveFormErrorCatch = (error, dispatch) => {
          setPointerEvent(false);
          updatePostLoader(false);
          const all_error_data = get(error, ['response', 'data', 'errors'], []);
          if (all_error_data.length > 0 && all_error_data[0].type === 'someone_editing') {
            updateSomeoneIsEditingPopover(all_error_data[0].message);
          } else if (error?.response?.data?.errors[0]?.field?.includes('data_list')) {
            showToastPopover(
              'Error in field',
              'Check the field configuration',
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            dispatch(
              createTaskSetState({
                server_error: error.response.data.errors,
              }),
            );
          } else if (
            all_error_data.length > 0 && all_error_data[0].indexes && all_error_data[0].indexes.includes('section_name')
            ) {
             if ((all_error_data[0].type === 'string.min') || (all_error_data[0].type === 'string.max')) {
              showToastPopover(
                `${translate('error_popover_status.section_name_length')} ${FLOW_MIN_MAX_CONSTRAINT.SECTION_NAME_MIN_VALUE} ${translate('error_popover_status.to')} ${FLOW_MIN_MAX_CONSTRAINT.SECTION_NAME_MAX_VALUE} ${translate('error_popover_status.character_long')}`,
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
             }
          } else if (all_error_data.length) {
                dispatch(
                  createTaskSetState({
                    server_error: all_error_data,
                  }),
                );
                const errors = jsUtils.compact(all_error_data.map((error) => error.message || null) || []);

                if (!isEmpty(errors) && errors && errors[0]) {
                  showToastPopover(
                    'Error',
                    errors[0],
                    FORM_POPOVER_STATUS.SERVER_ERROR,
                    true,
                  );
              }
          }
};

export const saveFormApiThunk =
  (postData, isConfigPopupOpen, updatePostFormFieldsValues, isTaskSubmitted, mlUrlParam) => (dispatch) =>
    new Promise((resolve) => {
      if (isEmpty(postData.data)) {
        postData.data = getTaskDetailsAPIData(
          store.getState().CreateTaskReducer,
          postData.sectionId - 1,
          postData.fieldListId - 1,
          postData.fieldId - 1,
        );
      }

      const rowNodeUuid = uuidv4();
      const sectionColumns = getNewRowWithColumns(COLUMN_LAYOUT.TWO)?.children?.map((column) => {
        return {
          parent_node_uuid: rowNodeUuid,
          node_uuid: column?.node_uuid,
          type: FORM_LAYOUT_TYPE.COLUMN,
          order: column.order,
        };
      });

      postData.data.sections[0].contents = [
        {
          node_uuid: rowNodeUuid,
          parent_node_uuid: null,
          type: FORM_LAYOUT_TYPE.ROW,
          order: 1,
        },
        ...sectionColumns,
      ];
      postData.data.sections[0].no_of_columns = COLUMN_LAYOUT.TWO;
      // delete postData?.data?.sections[0]?.is_section_show_when_rule;
      delete postData?.data?.sections?.[0]?.field_list;
      // delete postData?.data?.task_metadata_id;
      delete postData?.data?.task_metadata_uuid;
      console.log('asdfasdfasffds', postData);
      saveForm(postData.data, mlUrlParam)
        .then((response) => {
          setPointerEvent(false);
          updatePostLoader(false);
          if (isTaskSubmitted) {
            return resolve(response);
          }
          const form_details = response;
          let sections = cloneDeep(store.getState().CreateTaskReducer.sections);
          sections = saveFormApiResponseProcess(
            sections,
            postData.sectionIndex - 1,
            postData.fieldListIndex - 1,
            postData.fieldIndex - 1,
            form_details,
            isConfigPopupOpen,
          );
          if (updatePostFormFieldsValues) {
            const sectionIndex = postData.sectionIndex - 1;
            const fieldIndex = postData.fieldIndex - 1;
            const fieldListIndex = postData.fieldListIndex - 1;
            if (
              nullCheck(
                response,
                `sections.${sectionIndex}.field_list.${fieldListIndex}.fields.${fieldIndex}`,
              ) &&
              nullCheck(
                sections,
                `${sectionIndex}.field_list.${fieldListIndex}.fields.${fieldIndex}`,
              )
            ) {
              const postFieldData =
                response.sections[sectionIndex].field_list[fieldListIndex]
                  .fields[fieldIndex];
              if (
                postFieldData.field_type === FIELD_TYPES.CHECKBOX ||
                postFieldData.field_type === FIELD_TYPES.DROPDOWN ||
                postFieldData.field_type === FIELD_TYPES.RADIO_GROUP
              ) {
                sections[sectionIndex].field_list[fieldListIndex].fields[
                  fieldIndex
                ].values = postFieldData.values.join();
              }
            }
          }

          return dispatch(
            createTaskSetState({
              form_details,
              sections,
              error_list: {},
              server_error: [],
            }),
          ).then(() => resolve(true));
        })
        .catch((error) => {
          saveFormErrorCatch(error, dispatch);
          return resolve(false);
        });
    });

export const validateFormApiThunk = (params, callBackFn) => (dispatch) =>
  new Promise(() => {
    console.log('check params', params);
    validateFormApi(params).then((errors) => {
      console.log('validateFOrmAPI true', params);
      if (typeof errors !== 'boolean') {
        const sections = cloneDeep(store.getState().CreateTaskReducer.sections);
        const serverErrors = {};
        errors?.forEach((eachError) => {
          const key = eachError?.field?.split('.');
          if (!isEmpty(key)) {
            if (has(key, 1) && has(key, 3)) {
              if (sections?.[key[1]]?.contents?.[key[3]]) {
                const errorField = sections?.[key[1]]?.contents?.[key[3]];
                serverErrors[errorField.field_uuid] = eachError.indexes;
              }
            }
          }
        });
        if (isEmpty(serverErrors)) callBackFn?.();
        else dispatch(createTaskSetState({ error_list: serverErrors }));
      } else callBackFn?.();
    }).catch((data) => {
      console.log('validate form err', data);
      const errors = {};
      const error_type = get(data?.errors, [0, 'type'], EMPTY_STRING);
      data?.errors?.forEach((eachError) => {
          errors[eachError.field] = eachError.field;
      });
      if (error_type === 'someone_editing') {
        updateSomeoneIsEditingPopover(get(data?.errors, [0, 'message'], {}));
      }
      dispatch(createTaskSetState({ error_list: errors }));
    });
  });

export const saveSectionApiThunk =
(postData, isConfigPopupOpen, updatePostFormFieldsValues, isTaskSubmitted, mlUrlParam) => (dispatch) =>
  new Promise((resolve) => {
    console.log('asdfasdfasffds', postData);
    delete postData?.data?.task_metadata_uuid;
    postData.data.is_section_show_when_rule = false;
    postData.data.section_name = postData?.data?.sections?.[0].section_name;
    delete postData?.data?.sections;
    saveSection(postData.data, mlUrlParam)
      .then((response) => {
        setPointerEvent(false);
        updatePostLoader(false);
        // if (isTaskSubmitted) {
        //   return resolve(response);
        // }
        const form_details = response;
        let sections = cloneDeep(store.getState().CreateTaskReducer.sections);
        sections = saveFormApiResponseProcess(
          sections,
          postData.sectionIndex - 1,
          postData.fieldListIndex - 1,
          postData.fieldIndex - 1,
          form_details,
          isConfigPopupOpen,
        );

        return dispatch(
          createTaskSetState({
            form_details,
            sections,
            error_list: {},
            server_error: [],
          }),
        ).then(() => resolve(true));
      })
      .catch((error) => {
        saveFormErrorCatch(error, dispatch);
        return resolve(false);
      });
  });

export const saveFieldApiThunk =
  (postData, isConfigPopupOpen, updatePostFormFieldsValues, isTaskSubmitted, saveFormCallback) => (dispatch) =>
    new Promise((resolve) => {
      if (isEmpty(postData.data)) {
        postData.data = getSaveFieldDetailsAPIData(
          store.getState().CreateTaskReducer,
          postData.sectionIndex - 1,
          postData.fieldListIndex - 1,
          postData.fieldIndex - 1,
        );
      }
      saveField(postData.data)
        .then((response) => {
          if (isTaskSubmitted) {
            return resolve(true);
          }
          const form_details = response;
          let sections = cloneDeep(store.getState().CreateTaskReducer.sections);
          sections = saveFormApiResponseProcess(
            sections,
            postData.sectionIndex - 1,
            postData.fieldListIndex - 1,
            postData.fieldIndex - 1,
            form_details,
            isConfigPopupOpen,
            true, // isSaveField
          );
          if (updatePostFormFieldsValues) {
            const sectionIndex = postData.sectionIndex - 1;
            const fieldIndex = postData.fieldIndex - 1;
            const fieldListIndex = postData.fieldListIndex - 1;
            if (
              nullCheck(
                response,
                `sections.${sectionIndex}.field_list.${fieldListIndex}.fields.${fieldIndex}`,
              ) &&
              nullCheck(
                sections,
                `${sectionIndex}.field_list.${fieldListIndex}.fields.${fieldIndex}`,
              )
            ) {
              const postFieldData =
                response.sections[sectionIndex].field_list[fieldListIndex]
                  .fields[fieldIndex];
              if (
                postFieldData.field_type === FIELD_TYPES.CHECKBOX ||
                postFieldData.field_type === FIELD_TYPES.DROPDOWN ||
                postFieldData.field_type === FIELD_TYPES.RADIO_GROUP
              ) {
                sections[sectionIndex].field_list[fieldListIndex].fields[
                  fieldIndex
                ].values = postFieldData.values.join();
              }
            }
          }

          return dispatch(
            createTaskSetState({
              form_details,
              sections,
              error_list: {},
              server_error: [],
            }),
          ).then(() => {
            if (isSectionNameChanged(sections, form_details) && saveFormCallback) saveFormCallback(sections, form_details);
            else {
              setPointerEvent(false);
              updatePostLoader(false);
             }
            resolve(true);
          });
        })
        .catch((error) => {
          setPointerEvent(false);
          updatePostLoader(false);
          const errors = get(error, ['response', 'data', 'errors'], []);
          const error_type = get(errors, [0, 'type'], EMPTY_STRING);

          if (error_type === 'someone_editing') {
            updateSomeoneIsEditingPopover(errors[0].message);
          } else if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.errors.length &&
            error.response.data.errors[0].validation_message &&
            error.response.data.errors[0].validation_message ===
            'cyclicDependency'
          ) {
            showToastPopover(
              translate('error_popover_status.cyclic_dependency'),
              translate('error_popover_status.cannot_set_rule'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          } else if (errors.length > 0) {
            dispatch(
              createTaskSetState({
                server_error: errors,
              }),
            );
            const errorMessages = jsUtils.compact(error.response.data.errors.map((error) => error.message || null) || []);
            handleSyntaxError(errors, dispatch, true);
            if (!isEmpty(errorMessages) && errorMessages && errorMessages[0]) {
              showToastPopover(
                translate('error_popover_status.error'),
                errorMessages[0],
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
             }
            console.log('response.data.errors', error.response.data.errors);
          }
          return resolve(false);
        });
    });

export const saveTableApiThunk =
(postData, isConfigPopupOpen, updatePostFormFieldsValues, isTaskSubmitted) => (dispatch) =>
  new Promise((resolve) => {
    if (isEmpty(postData.data)) {
      postData.data = getSaveTableDetailsAPIData(
        store.getState().CreateTaskReducer,
        postData.sectionIndex - 1,
        postData.fieldListIndex - 1,
      );
    }
    saveTable(postData.data)
    .then((response) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (isTaskSubmitted) {
        return resolve(response);
      }
      const form_details = response;
      let sections = cloneDeep(store.getState().CreateTaskReducer.sections);
      sections = saveFormApiResponseProcess(
        sections,
        postData.sectionIndex - 1,
        postData.fieldListIndex - 1,
        postData.fieldIndex - 1,
        form_details,
        isConfigPopupOpen,
      );
      if (updatePostFormFieldsValues) {
        const sectionIndex = postData.sectionIndex - 1;
        const fieldIndex = postData.fieldIndex - 1;
        const fieldListIndex = postData.fieldListIndex - 1;
        if (
          nullCheck(
            response,
            `sections.${sectionIndex}.field_list.${fieldListIndex}.fields.${fieldIndex}`,
          ) &&
          nullCheck(
            sections,
            `${sectionIndex}.field_list.${fieldListIndex}.fields.${fieldIndex}`,
          )
        ) {
          const postFieldData =
            response.sections[sectionIndex].field_list[fieldListIndex]
              .fields[fieldIndex];
          if (
            postFieldData.field_type === FIELD_TYPES.CHECKBOX ||
            postFieldData.field_type === FIELD_TYPES.DROPDOWN ||
            postFieldData.field_type === FIELD_TYPES.RADIO_GROUP
          ) {
            sections[sectionIndex].field_list[fieldListIndex].fields[
              fieldIndex
            ].values = postFieldData.values.join();
          }
        }
      }

      return dispatch(
        createTaskSetState({
          form_details,
          sections,
          error_list: {},
          server_error: [],
        }),
      ).then(() => resolve(true));
    })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const errors = get(error, ['response', 'data', 'errors'], []);
        const error_type = get(errors, [0, 'type'], EMPTY_STRING);

        if (error_type === 'someone_editing') {
          updateSomeoneIsEditingPopover(errors[0].message);
        } else if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.errors.length &&
          error.response.data.errors[0].validation_message &&
          error.response.data.errors[0].validation_message ===
          'cyclicDependency'
        ) {
          showToastPopover(
            translate('error_popover_status.cyclic_dependency'),
            translate('error_popover_status.cannot_set_rule'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        } else if (errors.length > 0) {
          dispatch(
            createTaskSetState({
              server_error: errors,
            }),
          );
          const errorMessages = jsUtils.compact(error.response.data.errors.map((error) => error.message || null) || []);
          handleSyntaxError(errors, dispatch, true);
          if (!isEmpty(errorMessages) && errorMessages && errorMessages[0]) {
            showToastPopover(
              translate('error_popover_status.error'),
              errorMessages[0],
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            }
          console.log('response.data.errors', error.response.data.errors);
        }
        return resolve(false);
      });
  });

export const deleteFormFieldAndFieldListApiAction =
  (postData, prevSectionsData) => (dispatch) =>
    new Promise((resolve) => {
      saveForm(postData)
        .then(() => {
          setPointerEvent(false);
          updatePostLoader(false);
          return dispatch(
            createTaskSetState({
              sections: postData.sections,
              error_list: {},
              server_error: [],
            }),
          ).then(() => resolve(true));
        })
        .catch((error) => {
          setPointerEvent(false);
          updatePostLoader(false);
          showToastPopover(
            translate('error_popover_status.error'),
            translate('error_popover_status.error_in_delete_field'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors[0].type === 'someone_editing'
          ) {
            updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
          } else if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.errors.length
          ) {
            dispatch(
              createTaskSetState({
                server_error: error.response.data.errors,
              }),
            );
          }
          dispatch(
            createTaskSetState({
              sections: prevSectionsData,
              error_list: {},
              server_error: [],
            }),
          );
          return resolve(true);
        });
    });

export const deleteFormPostApiAction = (data) => async () => {
  try {
    await deleteForm(data);
  } catch (err) {
    console.log(err);
    if (
      err.response &&
      err.response.data &&
      err.response.data.errors[0].type === 'someone_editing'
    ) {
      updateSomeoneIsEditingPopover(err.response.data.errors[0].message);
    }
  }
  return true;
};

export const getTaskAssigneeSuggestionApiThunk = (data) => (dispatch) => {
  dispatch(assigneeSuggestionApiStarted());
  getTaskAssigneeSuggestionApi(data)
    .then((res) => {
      setPointerEvent(false);
      updatePostLoader(false);
      dispatch(
        createTaskSetState({
          isAssigneeSuggestionLoading: false,
          assigneeSuggestionList: !jsUtils.isEmpty(res.user_or_team_ids)
            ? getInitialTaskAssigneeSuggestionList(res.user_or_team_ids)
            : null,
        }),
      );
    })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      dispatch(
        createTaskSetState({
          isAssigneeSuggestionLoading: false,
          server_error: get(error, ['response', 'data', 'errors'], {}),
        }),
      );
    });
};

export const saveRuleForFieldApiThunk =
  (ruleData, id, sectionIndex, fieldListIndex, fieldIndex = null) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        apiSaveRule(ruleData)
          .then((res) => {
            dispatch(
              saveRuleAction(res, id, sectionIndex, fieldListIndex, fieldIndex),
            );
            resolve(true);
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.errors[0].type === 'someone_editing'
            ) {
              updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
            } else if (
              error &&
              error.response &&
              error.response.data &&
              error.response.data.errors.length &&
              error.response.data.errors[0].validation_message &&
              error.response.data.errors[0].validation_message ===
              'cyclicDependency'
            ) {
              showToastPopover(
                translate('error_popover_status.cyclic_dependency'),
                translate('error_popover_status.cannot_set_rule'),
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            } else {
              showToastPopover(
                translate('error_popover_status.save_rule'),
                translate('error_popover_status.rules_not_set'),
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            }
            reject(error);
          });
      });

export const getVisibilityConfigOperatorsByFieldTypeInTask =
  (fieldTypes, selectedFieldUuid, sectionCount, fieldsCount) => (dispatch) => {
    dispatch(ruleFieldTypeChangeTaskStarted());
    apiGetRuleOperatorsByFieldType(fieldTypes)
      .then((res) => {
        const lstOperandData = res;
        const { sections } = jsUtils.cloneDeep(
          store.getState().CreateTaskReducer,
        );
        const fieldType = fieldTypes[0];

        const lstOperator = getArrOperatorData(lstOperandData, fieldType);
        if (lstOperator !== undefined && lstOperator !== null) {
          sections[sectionCount].fields[fieldsCount].arrOperatorData =
            lstOperator;
        }

        sections[sectionCount].fields[fieldsCount].l_field = selectedFieldUuid;
        sections[sectionCount].fields[fieldsCount].l_selectedFieldValue =
          fieldType;
        dispatch(ruleFieldTypeChangeTaskSucess(sections));
      })
      .catch((err) => {
        const errors = generateGetServerErrorMessage(err);
        dispatch(ruleFieldTypeChangeTaskFailed(errors));
      });
  };

export const getAllFieldsTaskList =
  (params, currentFieldUuid = '') =>
    (dispatch) => {
      dispatch(getAllFieldsTaskStartedAction());
      apiGetAllFieldsList(params)
        .then((res) => {
          console.log('action.payload', res);
          const { pagination_data, pagination_details } = res;
          console.log('action.payload', pagination_data);
          if (pagination_data && pagination_data.length) {
            const taskData = jsUtils.cloneDeep(
              store.getState().CreateTaskReducer,
            );
            const fields = [];
            pagination_data.forEach((fieldData) => {
              if (
                !(currentFieldUuid && fieldData.field_uuid === currentFieldUuid)
              ) {
                fields.push({
                  ...fieldData,
                  label: fieldData.reference_name,
                  value: fieldData.field_uuid,
                });
              }
            });
            if (jsUtils.isObject(taskData.lstPaginationData)) {
              if (taskData.lstPaginationData.page < pagination_details[0].page) {
                taskData.lstAllFields = [...taskData.lstAllFields, ...fields];
                taskData.lstPaginationData = { ...pagination_details[0] };
              } else if (pagination_details[0].page === 1) {
                taskData.lstAllFields = [...fields];
                taskData.lstPaginationData = { ...pagination_details[0] };
              }
            } else {
              taskData.lstAllFields = [...fields];
              [taskData.lstPaginationData] = pagination_details || [];
            }
            console.log('action.payload', taskData);
            dispatch(getAllFieldsTaskSuccessAction(taskData));
          }
        })
        .catch((error) => {
          const errors = generateGetServerErrorMessage(error);
          dispatch(getAllFieldsTaskFailedAction(errors));
        });
    };

export const fieldAutoCompleteApiThunk = (word) => (dispatch) => {
  console.log('getFieldAutocomplete thunk', word);
  dispatch(fieldAutoCompleteStarted());
  const data_format = {
    text: word,
  };
  console.log('getFieldAutocomplete thunk after dispatch', data_format);
};

export const getFormDetailsByTaskMetadataIdThunk =
  (taskMetadataId) => (dispatch) =>
    new Promise((resolve) => {
      dispatch(createTaskSetState({ isFormDataLoading: true }));
      getFormDetailsByTaskMetadataId({ task_metadata_id: taskMetadataId })
        .then((formDetails) => {
          const { sections, fields } = getSectionAndFieldsFromResponse(formDetails.sections || []);
          dispatch(
            createTaskSetState({
              isFormDataLoading: false,
              form_details: { ...formDetails },
              sections: sections || [GET_SECTION_INITIAL_DATA()],
              fields,
            }),
          );
          resolve(true);
        })
        .catch(() => {
          dispatch(createTaskSetState({ isFormDataLoading: false }));
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.please_try_after_some_time'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          resolve(true);
        });
    });

export const getDataListEntryDetailsByIdApi = (params) => (dispatch) =>
  new Promise((resolve) => {
    dispatch(createTaskSetState({ isInstanceDataLoading: true }));
    getDataListEntryDetailsById(params)
      .then((response) => {
        dispatch(createTaskSetState({ isInstanceDataLoading: false }));
        resolve(response);
      })
      .catch(() => {
        dispatch(createTaskSetState({ isInstanceDataLoading: false }));
        resolve('N/A');
      });
  });

export const getInstanceDetailsByID = (_id) => (dispatch) => {
  dispatch(createTaskSetState({ isInstanceDataLoading: true }));
  return new Promise((resolve) =>
    apiGetInstanceDetailsByID(_id)
      .then((res) => {
        if (res) {
          dispatch(createTaskSetState({ isInstanceDataLoading: false }));
          resolve(res);
        }
      })
      .catch(() => {
        dispatch(createTaskSetState({ isInstanceDataLoading: false }));
        resolve('N/A');
      }));
};

export const getRuleDetailsByIdInFieldVisibility =
  (ruleId, sectionIndex, fieldListIndex, fieldIndex = null, avoidExpressionUpdate = false) =>
    (dispatch) =>
      new Promise((resolve) => {
        apiGetRuleDetailsById(ruleId)
          .then((res) => {
            const sections = jsUtils.cloneDeep(
              store.getState().CreateTaskReducer.sections,
            );
            const {
              rule_details: { rule },
              field_metadata,
              conditional_operator_details,
            } = res;
            const fieldData =
              fieldIndex !== null
                ? sections[sectionIndex].field_list[fieldListIndex].fields[
                fieldIndex
                ]
                : sections[sectionIndex].field_list[fieldListIndex];

                if (fieldData) {
                  if ((fieldIndex !== null) && sections[sectionIndex].field_list[fieldListIndex].field_list_type === FIELD_LIST_TYPE.TABLE) {
                    const tableCol = getTableColConditionList(rule.expression, [], field_metadata);
                    dispatch(updateTableColConditionList(tableCol));
                  }
                  if (!avoidExpressionUpdate) {
                  fieldData[FIELD_KEYS.RULE_EXPRESSION] = { ...QUERY_BUILDER_INITIAL_STATE, expression: rule.expression };
                  fieldData[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION] = cloneDeep(fieldData[FIELD_KEYS.RULE_EXPRESSION]);
                  }
                  const externalFields = getVisibilityExternalFieldsData(store.getState());
                  dispatch(setOperators([], conditional_operator_details));
                  dispatch(externalFieldDataChange(externalFields, field_metadata));
              }
              dispatch(createTaskSetState({ sections: [...sections] }));
             resolve({});
          })
          .catch((err) => {
            resolve(false);
            console.log(err);
          });
      });

export const getDefaultRuleByIdApiThunk =
  (ruleId, sectionIndex, fieldListIndex, fieldIndex, fieldType, onlyUpdateFieldMetadata = false) => (dispatch) =>
    new Promise((resolve, reject) => {
      apiGetRuleDetailsById(ruleId)
        .then((res) => {
          const {
            rule_details: {
              rule: { expression, expression_type, decimal_point, concat_with },
            },
            field_metadata,
            default_operator_details,
          } = res;
          let ruleData = {};
          if (expression_type !== EXPRESSION_TYPE.FORMULA_EXPRESSION) {
            const selectedOperatorInfo = getSelectedOperatorInfo(
              default_operator_details,
              expression.operator,
              fieldType,
            );
            const { sections } = store.getState().CreateTaskReducer;
            ruleData = getDataFromRuleFields(expression, expression_type, {
              decimal_point,
              concat_with,
            });
            const field = jsUtils.cloneDeep(
              jsUtils.get(
                sections,
                [
                  sectionIndex,
                  'field_list',
                  fieldListIndex,
                  'fields',
                  fieldIndex,
                ],
                null,
              ),
            );
            if (field) {
              if (!onlyUpdateFieldMetadata) {
                jsUtils.set(field, ['draft_default_rule'], {
                  ...ruleData,
                });
              }
              jsUtils.set(
                field,
                ['draft_default_rule', 'operator'],
                expression.operator,
              );
              jsUtils.set(
                field,
                ['draft_default_rule', 'operatorInfo'],
                selectedOperatorInfo,
              );
              jsUtils.set(
                field,
                [FIELD_KEYS.PREVIOUS_DRAFT_DRAFT_RULE],
                get(field, [FIELD_KEYS.DEFAULT_DRAFT_VALUE]),
              );
              dispatch(
                setEntireField(field, sectionIndex, fieldListIndex, fieldIndex),
              );
            }
          dispatch(externalFieldsDataChange({
            field_metadata: (field_metadata || []),
          }));
        }
          resolve(ruleData);
        })
        .catch((err) => {
          reject(err);
          console.log(err);
        });
    });
