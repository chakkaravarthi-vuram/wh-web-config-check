import React, { useContext, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { isNull } from 'lodash';

// STYLES
import { withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import { modifyAndUpdateServerErrorInExpression, validateExpressionAndUpdateField } from 'components/query_builder/QueryBuilder.utils';
import { getReferenceId } from 'redux/actions/FlowDashboard.Action';
import UpdateConfirmPopover from 'components/update_confirm_popover/UpdateConfirmPopover';
import { FORM_TITLE_TYPES } from 'components/form_components/form_title/FormTitle';
import { getTaskMetadataApiThunk } from 'redux/actions/TaskActions';
import { formDetailsValidateSchemaWithStrictSectionAndFieldList, saveFieldValidateSchema } from 'validation/form/form.validation.schema';
import { FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import { accountConfigurationDataChangeAction } from 'redux/actions/AccountConfigurationAdmin.Action';
import { recursiveValidationSchema } from 'containers/edit_flow/EditFlow.validation.schema';
import { FORM_BUILDER_STRINGS, EMPTY_STRING, FORM_POPOVER_STRINGS } from 'utils/strings/CommonStrings';
import styles from './Task.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';

// COMPONENTS
import BasicDetails from './basic_details/BasicDetails';

// CONSTANTS AND STRINGS
import { ADD_TASK, ADD_TASK_FORM, BASIC_DETAILS, TASK_DISCARD_POPOVER } from './Task.strings';
import { BS } from '../../../../utils/UIConstants';
// import * as formBuilderUtils from '../../../../utils/formUtils';

// REDUX ACTIONS AND SELECTORS
import {
  deleteFormPostApiAction,
  deleteTaskApiThunk,
  getFormDetailsByTaskMetadataIdThunk,
  getRuleDetailsByIdInFieldVisibility,
  getTaskAssigneeSuggestionApiThunk,
  publishTaskApiThunk,
  saveFormApiThunk,
  saveRuleForFieldApiThunk,
  saveTaskApiThunk,
  deleteFormBuilderApiThunk,
  deleteFormApi,
  getInstanceDetailsByID,
  saveFieldApiThunk,
  saveTableApiThunk,
} from '../../../../redux/actions/CreateTask.Action';
import {
  setFormVisibilityAction,
  createTaskClearState,
  createTaskSetState,
  setFieldData,
  setEntireField,
  setFieldListData,
  setSectionDataAction,
  setErrorListData,
  setDefaultRuleFieldData,
  setVisibilityFieldData,
  setDataInsideBatchTask,
  setTaskReferenceDocuments,
  setFieldListValidation,
  setDataListSelectorErrorListData,
} from '../../../../redux/reducer/CreateTaskReducer';
// UTILS
import {
  getOverallTaskDetailsValidateData,
  checkAndDisplaySectionTitleError,
  getSaveTaskValidateSchema,
  getBasicDetailsValidateData,
  getTaskDetailsAPIData,
  getTaskDetailsValidateData,
  getRecursiveDetails,
  PostFormFieldAndAutocompleteSuggestionAPI,
  getSaveFieldDetailsAPIData,
  getFieldDataForValidation,
  getSaveTableDetailsAPIData,
  formatValidationMessages,
} from '../../../task/task/Task.utils';

import jsUtils, {
  isEmpty,
  cloneDeep,
  get,
  set,
  cleanObject,
  isUndefined,
} from '../../../../utils/jsUtility';
import {
  clearAlertPopOverStatus,
  keydownOrKeypessEnterHandle,
  mergeObjects,
  setPointerEvent,
  updateAlertPopverStatus,
  validate,
  setUserProfileData as setGlobalUserProfileData,
  showToastPopover,
  isBasicUserMode,
} from '../../../../utils/UtilityFunctions';
import {
  basicDetailsValidateSchema,
  saveBasicDetailsValidateSchema,
  taskDetailsValidateSchema,
  taskDetailsValidateSchemaWithOneSection,
  overallTaskDetailsValidateSchema,
  overallTaskDetailsValidateSchemaWithoutForm,
  saveTaskSchema,
} from '../../../task/task/Task.validation.schema';
import Breadcrumb from '../../../../components/form_components/breadcrumb/Breadcrumb';
import FormTitle from '../../../../components/form_components/form_title/FormTitle';
// import Form from '../../../task/task/form/Form';
import { FORM_POPOVER_STATUS, MODULE_TYPES } from '../../../../utils/Constants';
import {
  DEFAULT_RULE_KEYS,
  FIELD_KEYS,
  GET_SECTION_INITIAL_DATA,
  VISIBILITY_CONFIG_FIELDS,
} from '../../../../utils/constants/form.constant';
import {

  saveFormRule,
} from '../../../../utils/formUtils';
import { visibilityExternalFieldsThunk, externalFieldsClear, clearVisibilityOperators, updateExternalFieldsFromDeletedFieldUUID } from '../../../../redux/actions/Visibility.Action';
import {
  deleteFormFieldOrFieldListApiAction,
  checkDependencyAndDeleteFieldApiAction,
  checkDependencyAndDeleteSectionApiAction,
} from '../../../../redux/actions/Form.Action';
import { getTabElements, getTaskAPIData } from './Task.utils';
import {
  getFieldFromState,
} from '../../../../redux/selectors/CreateTask.selector';
import { TASK_STRINGS } from '../../../task/task/Task.strings';
import { store } from '../../../../Store';
import { getLookupListApiThunk } from '../../../../redux/actions/LookUp.Action';
import useCreateTask from '../../../../hooks/useTask.hook';
import { updatePostLoader } from '../../../../utils/loaderUtils';
import { getAccountConfigurationDetailsApiService } from '../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { constructTreeStructure, getParentNodeUuidFromTree, getSectionFieldsFromLayout } from '../../../form/sections/form_layout/FormLayout.utils';
import { FIELD_ACTION_TYPE, FORM_TYPE } from '../../../form/Form.string';
import { REQUEST_SAVE_FORM } from '../../../../utils/constants/form/form.constant';
import { saveTable } from '../../../../axios/apiService/form.apiService';
import { saveField } from '../../../../axios/apiService/createTask.apiService';
import Form from '../../../form/Form';
import { getEntryTaskList } from '../../../shared_container/individual_entry/entry_tasks/EntryTasks.utils';
import ThemeContext from '../../../../hoc/ThemeContext';

function Task(props) {
  const {
    flowName,
    flowUuid,
    state,
    flowId,
    referenceId,
    isReferenceIdLoading,
    recursive_data,
    setBatchData,
    has_auto_trigger,
    is_recursive,
    setState,
    isEditTask,
    onCloseIconClick,
    isMobile,
    id,
    isModalOpen,
    flowInstanceId,
    clearTaskState,
  } = props;
  const {
    task_name,
    task_description,
    assignees,
    member_team_search_value,
    due_date,
    is_assign_to_individual_assignees,
    error_list,
    server_error,
    // sections,
    assigneeSuggestionList,
    isFormVisible,
    isAssigneeSuggestionLoading,
  } = state;

  const { t } = useTranslation();
  const history = useHistory();
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const isBasicUser = isBasicUserMode(history);
  const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
  const [systemIdentifier, setSystemIdentifier] = useState(referenceId);
  const [userProfileData, setUserProfileData] = useState({});
  useEffect(
    () => () => {
      const { clearExternalFields, clearVisibilityOperators } = props;
      clearExternalFields();
      clearVisibilityOperators();
    },
    [],
  );

  const { location } = props;
  useEffect(() => {
    const { setState, getFormDetailsByTaskMetadataId, getInstanceDetailsById, getTaskMetadataApi, setAccountConfigurationData } =
      props;
    setState({ ref_uuid: uuidv4() });
    getAccountConfigurationDetailsApiService().then((response) => {
      setUserProfileData(response);
      setGlobalUserProfileData(response);
      const _response = {
        allowed_extensions: jsUtils.get(response, ['allowed_extensions'], []),
      };
      setAccountConfigurationData(_response);
    });
    if (location?.state?.taskDetails) {
      const {
        state: { taskDetails },
      } = location;
      getInstanceDetailsById(taskDetails.instance_id)
        .then((response) => {
          setSystemIdentifier(response.system_identifier);
        })
        .catch(() => { });
      if (taskDetails.task_reference_documents) {
        getTaskMetadataApi({ _id: taskDetails._id }, true);
        // setState({ files: getTaskReferenceDocumentsFileObject(taskDetails.task_reference_documents, location.state.document_url_details) })
      }
      let due_date = '';
      if (taskDetails.due_date) due_date = taskDetails.due_date.pref_tz_datetime;
      if (taskDetails.collect_data) {
        getFormDetailsByTaskMetadataId(taskDetails._id);
      }
      const assignees = {};
      if (taskDetails.assignees?.teams) assignees.teams = [...taskDetails.assignees.teams];
      if (taskDetails.assignees?.users) assignees.users = [...taskDetails.assignees.users];
      setState({
        assignees,
        task_name: taskDetails.task_name || '',
        task_description: taskDetails.task_description || '',
        due_date,
        task_details: { ...taskDetails },
        isFormVisible: taskDetails.collect_data,
        sections: [],
        form_details: {},
        auto_trigger_details: taskDetails.auto_trigger_details || {},
        is_assign_to_individual_assignees: taskDetails.is_assign_to_individual_assignees,
      });
    } else {
      const { setState } = props;
      setState({ files: [], entityId: null, task_reference_documents: [], task_details: {} });
    }
  }, [location.pathname]);

  const {
    saveFormCallback,
  } = useCreateTask({ ...props, t });

  const getValidation = (state = {}) => {
    const { sections = [] } = state;
    const validated_error_list = validate({ sections }, formDetailsValidateSchemaWithStrictSectionAndFieldList(t));
    return validated_error_list || {};
  };

  const saveFormAPI = (
    sectionId,
    fieldListIndex,
    fieldId,
    isDnDSaveForm = false,
    isConfigPopupOpen = false,
    updatePostFormFieldsValues = false,
    emptyPostData,
    isSaveField,
  ) => {
    // api call for saving form
    setPointerEvent(true);
    const { saveFormApiCall, saveFieldApiCall, saveTableApiCall } = props;
    const { sections } = store.getState().CreateTaskReducer;
    const state = store.getState().CreateTaskReducer;
    const state_data = cloneDeep(state);

    let formData = {};
    if (isSaveField) {
      formData = {
        data: emptyPostData
          ? null
          : getSaveFieldDetailsAPIData(
            { ...state_data, sections: sections },
            sectionId - 1,
            fieldListIndex,
            fieldId - 1,
          ),
      };
    } else if (!fieldId && (fieldListIndex || fieldListIndex === 0)) {
      formData = {
        data: emptyPostData
          ? null
          : getSaveTableDetailsAPIData(
            { ...state_data, sections: sections },
            sectionId - 1,
            fieldListIndex,
          ),
      };
    } else {
      formData = {
        data: emptyPostData
          ? null
          : getTaskDetailsAPIData(
            { ...state_data, sections: sections },
            sectionId - 1,
            fieldListIndex,
            fieldId - 1,
          ),
      };
    }

    if (sectionId && !isDnDSaveForm) {
      formData.sectionIndex = sectionId;
    }
    if ((fieldListIndex || fieldListIndex === 0) && !isDnDSaveForm) {
      formData.fieldListIndex = fieldListIndex + 1;
    }
    if (fieldId && !isDnDSaveForm) {
      formData.fieldIndex = fieldId;
    }
    if (isSaveField) {
      return saveFieldApiCall(
        formData,
        isConfigPopupOpen,
        updatePostFormFieldsValues,
        false,
        saveFormCallback,
      );
    } else if (!fieldId && (fieldListIndex || fieldListIndex === 0)) {
      return saveTableApiCall(
        formData,
        isConfigPopupOpen,
        updatePostFormFieldsValues,
        false,
        saveFormCallback,
      );
    } else {
      return saveFormApiCall(
        formData,
        isConfigPopupOpen,
        updatePostFormFieldsValues,
      );
    }
  };

  const onSectionAddButtonClick = () => {
    const {
      state,
      state: { sections },
      setState,
    } = props;

    const newSections = [...sections];
    if (jsUtils.isEmpty(state.sectionTitleError)) {
      newSections.push(GET_SECTION_INITIAL_DATA('', sections.length + 1));
    }
    setState({
      sections: newSections,
      // section_name: EMPTY_STRING,
    });
  };

  const onCloseClick = async () => {
    clearTaskState();
    await onCloseIconClick();
  };

  const publishTaskApi = async (response) => {
    if (response) {
      const { publishTaskApiCall, history } = props;
      const data = {
        task_metadata_uuid: response.task_metadata_uuid,
      };
      // const validated_error_list = getValidation(state);
      // if (isEmpty(validated_error_list)) {
        await publishTaskApiCall(data, history, onCloseClick);
      // } else {
      //   setPointerEvent(false);
      //   setErrorList(validated_error_list);
      // }
    }
  };

  const updateSectionTitleError = () => {
    const { state } = props;
    checkAndDisplaySectionTitleError(jsUtils.cloneDeep(state));
  };

  const postDataDocumentProcess = async (postData, state_data) => {
    const { dispatch } = props;
    if (jsUtils.has(postData, ['data', 'document_details'])) {
      const documentDetails =
      jsUtils.isEmpty(jsUtils.get(state_data, ['task_details', 'document_url_details'], [])) ?
      jsUtils.get(postData, ['data', 'document_details', 'uploaded_doc_metadata'], []) :
      jsUtils.get(state_data, ['task_details', 'document_url_details'], []).concat(
        jsUtils.get(postData, ['data', 'document_details', 'uploaded_doc_metadata'], []),
      );
      await dispatch(createTaskSetState({
        task_details: { ...cloneDeep(state_data).task_details,
        document_url_details: documentDetails,
      },
      }));
    }
  };

  const saveTaskApi = async (
    withoutTaskIdOrPublish = null,
    sectionIndex = null,
    fieldListIndex = null,
    fieldIndex = null,
    updatePostFormFieldsValues = false,
    isConfigPopupOpen = false,
    saveTaskPostData = null,
    setCollectData,
    isSaveField = false,
    isSaveAndClose = false,
  ) => {
    const { state, dispatch, flowInstanceId } = props;
    const state_data = cloneDeep(state);
    // api call for saving form
    setPointerEvent(true);
    const postData = {
      data:
        saveTaskPostData ||
        getTaskAPIData(
          cloneDeep(state_data),
          null,
          { flowUuid, flowInstanceId },
          setCollectData,
          (
            isSaveAndClose ?
            !isEmpty(state_data.sections) :
            null
          ),
        ),
    };
    await postDataDocumentProcess(postData, cloneDeep(state_data));
    if (sectionIndex && fieldListIndex && fieldIndex) {
      postData.sectionId = sectionIndex;
      postData.fieldListId = fieldListIndex;
      postData.fieldId = fieldIndex;
    }
    if (postData.data) postData.data.is_reminder_task = false;
    if (isSaveAndClose) postData.data.is_save_close = true;
    return dispatch(
      saveTaskApiThunk(
        postData,
        withoutTaskIdOrPublish,
        () =>
          saveFormAPI(
            sectionIndex,
            fieldListIndex,
            fieldIndex,
            false,
            isConfigPopupOpen,
            updatePostFormFieldsValues,
            null,
            isSaveField,
          ),
        publishTaskApi,
      ),
    );
  };

  const onSaveFormField = (
    sectionIndex,
    fieldListIndex,
    fieldIndex,
    isConfigPopupOpen,
  ) => {
    const { state, setErrorList, setState, datalist_selector_error_list } = props;
    const { form_details } = state;
    let field = fieldIndex
                  ? getFieldFromState(
                    state,
                    sectionIndex - 1,
                    fieldListIndex,
                    fieldIndex - 1,
                    true,
                  )
                  : jsUtils.get(state, [
                    'sections',
                    sectionIndex - 1,
                    'field_list',
                    fieldListIndex,
                  ]);
   const { allSections: validatedSection, has_validation } = validateExpressionAndUpdateField(
        field,
        sectionIndex - 1,
        fieldListIndex,
        fieldIndex - 1,
        !fieldIndex,
        cloneDeep(get(state, ['sections'], [])),
    );
    setState({
      sections: validatedSection,
    });
    const errorList = {
     ...(validate(
            getSaveTaskValidateSchema(jsUtils.cloneDeep(state)),
            saveTaskSchema,
          ) || {}),
    ...(validate(
            getTaskDetailsValidateData(jsUtils.cloneDeep(state)),
            taskDetailsValidateSchema(t),
          ) || {}),
    };

    PostFormFieldAndAutocompleteSuggestionAPI(state);
    setState({
      isFieldSuggestionEnabled: false,
      disableFieldTypeSuggestion: true,
      initialTaskLabel: EMPTY_STRING,
      field_type_data: [],
    });

    const newState = store.getState().CreateTaskReducer;
    const isTableField = fieldIndex && getFieldFromState(newState, sectionIndex - 1, fieldListIndex, fieldIndex - 1, true);
    const selectedFieldList = jsUtils.get(newState, ['sections', sectionIndex - 1, 'field_list', fieldListIndex]);
     // get field from validated section.
     field = fieldIndex ?
     jsUtils.get(validatedSection, [sectionIndex - 1, 'field_list', fieldListIndex, 'fields', fieldIndex - 1], field)
       : jsUtils.get(validatedSection, [sectionIndex - 1, 'field_list', fieldListIndex]);

    return new Promise((resolve) =>
      setErrorList(errorList).then(() => {
        const { setErrorList } = props;
        if (jsUtils.isEmpty(errorList) && !has_validation && jsUtils.isEmpty(datalist_selector_error_list)) {
          const { state } = props;
          let isSaveField = true;
          if (selectedFieldList && selectedFieldList.field_list_type === FIELD_TYPES.TABLE) {
            if (!isTableField) {
              isSaveField = false;
            }
          }

          let errorTaskDetailsValidate = {};
          if (isSaveField) {
            const fieldValidate = validate(
              getFieldDataForValidation(jsUtils.cloneDeep(field)),
              saveFieldValidateSchema(t),
            );
            Object.keys(fieldValidate).map((errorKey) => {
              errorTaskDetailsValidate[`sections,${sectionIndex - 1},field_list,${fieldListIndex},fields,${fieldIndex - 1},${errorKey}`] = fieldValidate[errorKey];
              return null;
            });
          } else {
            errorTaskDetailsValidate = validate(
              getTaskDetailsValidateData(jsUtils.cloneDeep(state)),
              state.sections.length === 1
              ? taskDetailsValidateSchemaWithOneSection(t)
              : taskDetailsValidateSchema(t),
            );
          }

          return setErrorList(errorTaskDetailsValidate).then(() => {
            const {
              // error_list,
              saveRuleForFieldApi,
              setDefaultRuleValue,
              setVisibilityFieldValue,
              flowInstanceId,
            } = props;
            if (jsUtils.isEmpty(errorTaskDetailsValidate)) {
              if (form_details && form_details.task_metadata_id) {
                const metadata = {
                  task_metadata_id: form_details.task_metadata_id,
                  form_uuid: form_details.form_uuid,
                };

                let isSaveField = true;
                if (selectedFieldList && selectedFieldList.field_list_type === FIELD_TYPES.TABLE) {
                  if (!isTableField) {
                    isSaveField = false;
                  }
                }

                return saveFormRule(metadata, field, async (ruleData, id) =>
                  saveRuleForFieldApi(
                    ruleData,
                    id,
                    sectionIndex - 1,
                    fieldListIndex,
                    fieldIndex ? fieldIndex - 1 : null,
                  ), isSaveField || isUndefined(fieldIndex) || isNull(fieldIndex)).then(
                  (response) => {
                    if (response.success) {
                      return saveFormAPI(
                        sectionIndex,
                        fieldListIndex,
                        fieldIndex,
                        false,
                        isConfigPopupOpen,
                        true,
                        true,
                        isSaveField,
                      ).then((status) => resolve(status));
                    }
                    if (response.visibilityField) {
                      setVisibilityFieldValue(
                        VISIBILITY_CONFIG_FIELDS.ERRORS,
                        { ...response.error },
                        sectionIndex - 1,
                        fieldListIndex,
                        fieldIndex - 1,
                      );
                    } else if (response.defaultValue) {
                      setDefaultRuleValue(
                        DEFAULT_RULE_KEYS.ERRORS,
                        { ...response.error },
                        sectionIndex - 1,
                        fieldListIndex,
                        fieldIndex - 1,
                      );
                    }
                    return resolve(false);
                  },
                  (error) => {
                    const { allSections: validatedSections } = modifyAndUpdateServerErrorInExpression(
                      error,
                      cloneDeep(field[FIELD_KEYS.RULE_EXPRESSION]),
                      sectionIndex - 1,
                      fieldListIndex,
                      fieldIndex - 1,
                      !fieldIndex,
                      cloneDeep(get(state, ['sections'], [])),
                      );
                      setState({
                        sections: validatedSections,
                      });
                    resolve(false);
                  },
                );
              }
              let isSaveField = true;
              if (selectedFieldList && selectedFieldList.field_list_type === FIELD_TYPES.TABLE) {
                if (!isTableField) {
                  isSaveField = false;
                }
              }

              const saveTaskPostData = getTaskAPIData(
                cloneDeep(state),
                null,
                { flowUuid, flowInstanceId },
                true,
              );
              return saveTaskApi(
                'withoutTaskId',
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                true,
                isConfigPopupOpen,
                saveTaskPostData,
                null,
                isSaveField,
              ).then(
                () => resolve(true),
                () => resolve(false),
              );
            }
            updateSectionTitleError();
            return resolve(false);
          });
        }
        return resolve(false);
      }));
  };

  const {
    teamOrUserSelectHandler,
    teamOrUserRemoveHandler,
    assigneeListUpdateHandler,
    onDueDateChangeHandler,
    onTaskDetailsChangeHandler,
    onTaskTypeChangeHandler,
    onTaskNameBlurHandler,
    setMemberOrTeamSearchValue,
    setErrorMessage,
  } = useCreateTask({ ...props, t }, onSaveFormField, 'flow', flowId);

  const onAddFormHandler = async () => {
    const { state, dispatch } = props;
    const { isFormVisible } = state;
    // On add form click if form already present add section else add form
    if (isFormVisible) {
      onSectionAddButtonClick();
    } else {
      const { setFormVisibility, setErrorList } = props;
      const errorList = validate(
        getBasicDetailsValidateData(jsUtils.cloneDeep(state)),
        basicDetailsValidateSchema(t),
      );
      await setErrorList(errorList);

      if (isEmpty(errorList)) {
        const saveTaskApiData = getTaskAPIData(
          cloneDeep(state),
          null,
          { flowUuid, flowInstanceId },
          null,
          true,
        );
        saveTaskApi(null, null, null, null, false, false, saveTaskApiData).then(
          async () => {
            const newSections = [
              ...state.sections,
              GET_SECTION_INITIAL_DATA(
                t(FORM_BUILDER_STRINGS.DEFAULT_SECTION_NAME),
                state.sections.length + 1,
              ),
            ];

            const formData = {
              data: getTaskDetailsAPIData({ ...state, sections: newSections }),
            };
            dispatch(saveFormApiThunk(formData, false, false, true)).then((response) => {
              const sections = response?.sections?.map((section) => {
                return {
                  ...section,
                  layout: constructTreeStructure(section?.contents),
                };
              });
              if (!isEmpty(sections)) {
                dispatch(createTaskSetState({
                  sections: sections,
                  fields: {},
                  form_details: response,
                }))
                .then(() => setFormVisibility(true));
              }
            });
            // await setState({ sections: newSections });
            // setFormVisibility(true);
          },
          () => {
            updatePostLoader(false);
            setPointerEvent(false);
          },
        );
      }
    }
  };

  const deleteFormHandler = async () => {
    const { state, deleteFormBuilder } = props;
    const { task_details } = state;
    await deleteFormBuilder({ task_metadata_id: task_details._id });
  };

  const onTaskPublished = async () => {
    const { state, setState, saveFormApiCall } = props;
    const { sections, form_details } = state;
    // eslint-disable-next-line no-use-before-define
    const error = validateTaskDetails(sections);
    if (isEmpty(cleanObject(error))) {
        if (
          !isEmpty(state.form_details) &&
          (isEmpty(state.sections))
        ) {
          try {
            await deleteFormApi(get(state, ['task_details', '_id']));
          } catch (err) {
            return showToastPopover(
              'Something went wrong',
              'Please try again',
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          }
        }
        try {
          if (sections && form_details && form_details.sections) {
            sections.some((eachSection, index) => {
              if (eachSection.section_name !== form_details.sections[index].section_name) {
                const formData = {
                  data: getTaskDetailsAPIData({
                    ...state, sections: sections,
                  }),
                };

                saveFormApiCall(
                  formData,
                  false,
                  false,
                  true,
                );
                return true;
              }
              return false;
            });
          }
        } catch (e) {
          console.log('error', e);
        }
        // const validated_error_list = getValidation(jsUtils.cloneDeep(state));
        // if (isEmpty(validated_error_list)) {
          saveTaskApi('publish').then((status) => {
            const { clearTaskState } = props;
            if (status === true || (status && status.success)) {
              clearTaskState();
              // onAddTaskClosed();
              }
          });
        // } else if (get(Object.values(validated_error_list), [0])) {
        // }
        // setState({ error_list: error });
    } else {
     setState({ error_list: error });
    }
    return true;
  };

  const onPublishButtonClicked = (event) => {
    if (event) event.preventDefault();
    const { state, setState } = props;
    const { error_list, form_details } = state;
    if (!isEmpty(form_details)) {
      onTaskPublished();
    } else {
      const validationError = validate(
        getBasicDetailsValidateData(cloneDeep(state)),
        basicDetailsValidateSchema(t),
      );
      const datePickerError = get(error_list, BASIC_DETAILS.DUE_DATE.ID);
      const recursiveError = validate(
        getRecursiveDetails(cloneDeep(state)),
        recursiveValidationSchema,
      );
      setState({
        error_list: datePickerError
          ? {
            ...validationError,
            ...recursiveError,
            [BASIC_DETAILS.DUE_DATE.ID]: datePickerError,
          }
          : { ...recursiveError, ...validationError },
      }).then(() => {
        if (
          isEmpty(validationError) &&
          isEmpty(cleanObject(datePickerError)) &&
          isEmpty(recursiveError) &&
          isEmpty(getValidation(jsUtils.cloneDeep(state)))
        ) {
          saveTaskApi('publish').then((status) => {
            const { clearTaskState, onAddTaskClosed, dispatch } = props;
            if (flowUuid && flowInstanceId) {
              const params = {};
              params.flow_uuid = flowUuid;
              params.instance_id = flowInstanceId;
              getEntryTaskList(params, dispatch);
            }
            if (status === true || (status && status.success)) {
            clearTaskState();
            onAddTaskClosed();
            }
          });
        } else {
          showToastPopover(
            t(FORM_POPOVER_STRINGS.CHECK_DETAILS_TO_PROCEED),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
      });
    }
  };

  const onDayClick = (value, isMultiple) => {
    let days = [];
    if (isMultiple) {
      days = [...recursive_data.on_days];
      // else {
      if (days.includes(value)) {
        days.splice(days.indexOf(value), 1);
        setBatchData({ on_days: days });
      } else {
        // days = days.push(value);
        setBatchData({ on_days: [...recursive_data.on_days, value] });
      }
      // }
    } else {
      let days = recursive_data.on_day;
      if (days.includes(value)) {
        days.splice(days.indexOf(value), 1);
        setBatchData({ on_days: days });
      } else {
        days = [value];
        setBatchData({ on_day: days });
      }
    }
  };

  const onDiscardPopUpYesHandler = () => {
    const { dispatch } = props;
    if (!jsUtils.isUndefined(state.task_details)) {
      if (state.task_details?.task_metadata_uuid) {
        dispatch(deleteTaskApiThunk({
          task_metadata_uuid: state.task_details.task_metadata_uuid,
        })).then(() => {
            clearAlertPopOverStatus();
            onCloseClick();
        });
      } else {
          clearAlertPopOverStatus();
          onCloseClick();
      }
    }
  };

  const onCancelButtonClick = () => {
    // createTaskExit(history, taskDescription);
    updateAlertPopverStatus({
      isVisible: true,
      customElement: (
        <UpdateConfirmPopover
          onYesHandler={onDiscardPopUpYesHandler}
          onNoHandler={() => clearAlertPopOverStatus()}
          title={t(TASK_DISCARD_POPOVER.TITLE)}
          subTitle={t(TASK_DISCARD_POPOVER.SUBTITLE)}
        />
      ),
    });
  };

  const onSaveButtonClick = () => {
    const { state, setErrorList, saveFormApiCall } = props;
    const { sections, form_details } = state;
    const validationError = validate(
      getBasicDetailsValidateData(cloneDeep(state)),
      saveBasicDetailsValidateSchema(t),
    );
    const datePickerError = get(error_list, BASIC_DETAILS.DUE_DATE.ID);
    const recursiveError = validate(
      getRecursiveDetails(cloneDeep(state)),
      recursiveValidationSchema,
    );
    setState({
      error_list: datePickerError
        ? {
          ...validationError,
          ...recursiveError,
          [BASIC_DETAILS.DUE_DATE.ID]: datePickerError,
        }
        : { ...recursiveError, ...validationError },
    }).then(() => {
      if (
        isEmpty(validationError) &&
        isEmpty(cleanObject(datePickerError)) &&
        isEmpty(recursiveError)
      ) {
        // createTaskExit(history, () => {
          try {
            if (sections && form_details && form_details.sections) {
              sections.some((eachSection, index) => {
                if (eachSection.section_name !== form_details.sections[index].section_name) {
                  const formData = {
                    data: getTaskDetailsAPIData({
                      ...state, sections: sections,
                    }),
                  };
                  saveFormApiCall(
                    formData,
                    false,
                    false,
                    true,
                  );
                  return true;
                }
                return false;
              });
            }
            showToastPopover(
              TASK_STRINGS.DRAFT_TASK_SUBMIT_SUCCESS(t).title,
              TASK_STRINGS.DRAFT_TASK_SUBMIT_SUCCESS(t).subTitle,
              FORM_POPOVER_STATUS.SUCCESS,
              true,
            );
          } catch (e) {
            console.log('error', e);
          }
        saveTaskApi(
           null,
           null,
           null,
           null,
           false,
           false,
           null,
           null,
           false,
           true,
        ).then((status) => {
          if (status && status.success === false) {
            setErrorList({ ...status?.error?.state_error });
            return false;
          }
          if (status === true || (status && status.success)) onCloseClick();
          return true;
        });
        // });
      }
    });
  };

  const { publishButton, saveButton, cancelButton } = getTabElements(
    onPublishButtonClicked,
    onSaveButtonClick,
    onCancelButtonClick,
    isEditTask,
    isMobile,
    t,
    colorSchema,
  );

  const validateTaskDetails = (updatedSections = []) => {
    const { state } = props;
    const { form_details, sections } = state;
    const sectionsData = !isEmpty(updatedSections) ? cloneDeep(updatedSections) : cloneDeep(sections);
    let validationSchema = null;
    const flattenedSectionWithFields = [];
    if (!jsUtils.isEmpty(form_details)) {
      if (sectionsData && sectionsData.length >= 1) {
        validationSchema = overallTaskDetailsValidateSchema(t);
        sectionsData?.forEach((eachSection) => {
          const sectionFields = [];
          eachSection?.layout?.forEach((eachLayout) => {
            const fields = getSectionFieldsFromLayout(eachLayout);
            sectionFields.push(...fields);
          });
          flattenedSectionWithFields.push({
            section_name: eachSection?.section_name,
            section_order: eachSection?.section_order,
            section_uuid: eachSection?.section_uuid,
            is_section_show_when_rule: eachSection?.is_section_show_when_rule,
            fields: sectionFields,
          });
        });
      } else {
        validationSchema = overallTaskDetailsValidateSchemaWithoutForm(t);
      }
    } else {
      validationSchema = overallTaskDetailsValidateSchemaWithoutForm(t);
    }

    const errorList = formatValidationMessages(validate(
      {
        ...getOverallTaskDetailsValidateData(jsUtils.cloneDeep(state)),
        ...(!isEmpty(flattenedSectionWithFields)) &&
        { sections: flattenedSectionWithFields },
      },
      validationSchema,
    ), cloneDeep(flattenedSectionWithFields)) || [];
    return errorList;
  };

  const updateSections = (sections, validateSection = false, sectionUUID = EMPTY_STRING) => {
    const { setState, state = {} } = props;
    let { error_list = {} } = cloneDeep(state);
    let error = {};
    if (validateSection) {
      if (sectionUUID) {
        let sectionHasError = false;
        Object.keys(error_list)?.forEach((key) => {
          if (key === `${sectionUUID},${REQUEST_SAVE_FORM.SECTION_NAME}`) {
            sectionHasError = true;
            delete error_list[`${sectionUUID},${REQUEST_SAVE_FORM.SECTION_NAME}`];
          }
        });
        if (sectionHasError) {
          const sectionIndex = sections.findIndex((eachSection) => eachSection.section_uuid === sectionUUID);
          if (sectionIndex > -1) {
            error = validateTaskDetails([cloneDeep(get(sections, [sectionIndex], {}))]);
          }
        }
      } else {
        error = validateTaskDetails(cloneDeep(sections));
        error_list = {};
      }
    }
    setState({
      sections: sections,
      error_list: { ...error_list, ...error },
    });
  };

  const validatePostSaveField = (sectionData, sectionUUID) => {
    const { setState, state } = props;
    const { error_list, sections } = cloneDeep(state);
    const sectionIndex = sections.findIndex((eachSection) => eachSection.section_uuid === sectionUUID);
    if (sectionIndex > -1) {
        set(sections, [sectionIndex], {
            ...get(sections, [sectionIndex], {}),
            ...(sectionData || {}),
        });
    }
    const error = validateTaskDetails(cloneDeep({
      ...get(sections, [sectionIndex], {}),
      ...(sectionData || {}),
    }));
    Object.keys(error_list)?.forEach((key) => {
      if (key.includes(sectionUUID)) delete error_list[key];
    });
    setState({ error_list: { ...error_list, ...error } });
  };

  const saveFieldHandler = (data, path, sectionUUID, sectionData, onSuccess, onError) => {
    if (sectionData) {
      const { parentNodeUuid, fieldOrder } = getParentNodeUuidFromTree(sectionData, path);
      const fieldNodeUuid = data?.node_uuid || uuidv4();
      const postData = {
        ...data,
        task_metadata_id: state?.task_details?._id,
        form_uuid: state?.form_details?.form_uuid,
        node_uuid: fieldNodeUuid,
        parent_node_uuid: parentNodeUuid,
        section_uuid: sectionUUID,
        is_field_show_when_rule: data.is_field_show_when_rule || false,
        is_save: false,
        order: fieldOrder,
        validations: data.validations || {},
      };
      saveField(postData)
      .then((res) => onSuccess?.(res, fieldNodeUuid, validatePostSaveField))
      .catch((err) => onError?.(err));
    }
  };

  const saveTableHandler = (data, path, sectionUUID, sectionData, onSuccess, onError) => {
    const metadata = {
      task_metadata_id: state?.task_details?._id,
      form_uuid: state?.form_details?.form_uuid,
      section_uuid: sectionUUID,
    };
    if (!isEmpty(sectionData)) {
      const { parentNodeUuid } = getParentNodeUuidFromTree(sectionData, path);
      const nodeUUID = data?.node_uuid || uuidv4();
      const postData = {
        ...data,
        ...metadata,
        parent_node_uuid: parentNodeUuid,
        node_uuid: nodeUUID,
      };
      saveTable(postData)
      .then((res) => onSuccess?.(res, nodeUUID, validatePostSaveField))
      .catch((err) => onError?.(err));
    }
  };

  const onSaveField = (type, data, path, sectionUUID, sectionData, onSuccess, onError) => {
      switch (type) {
        case FIELD_ACTION_TYPE.FIELD:
          saveFieldHandler(data, path, sectionUUID, sectionData, onSuccess, onError);
          break;
        case FIELD_ACTION_TYPE.TABLE:
          saveTableHandler(data, path, sectionUUID, sectionData, onSuccess, onError);
         break;
        default: break;
      }
  };

  const removeFormBuilder = async () => {
    updateAlertPopverStatus({
      isVisible: true,
      customElement: (
        <UpdateConfirmPopover
          onYesHandler={async () => {
            await deleteFormHandler();
            clearAlertPopOverStatus();
          }}
          onNoHandler={() => clearAlertPopOverStatus()}
          title={t(FORM_POPOVER_STRINGS.REMOVE_FORM_BUILDER_TITLE)}
          subTitle={t(FORM_POPOVER_STRINGS.REMOVE_FORM_BUILDER_SUBTITLE)}
        />
      ),
    });
  };

  const getFormBuilderView = () => (
      <>
        <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.MT15)}>
          <FormTitle type={FORM_TITLE_TYPES.TYPE_7}>
            {t(TASK_STRINGS.TASK_SUB_TITLES.FORM_BUILDER.LABEL)}
          </FormTitle>
          <div
            className={cx(styles.RemoveForm, gClasses.CursorPointer, gClasses.ClickableElement, gClasses.MB5)}
            onClick={removeFormBuilder}
            tabIndex={0}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && removeFormBuilder()}
            role="button"
          >
            {t(TASK_STRINGS.TASK_SUB_TITLES.REMOVE_FORM_BUILDER.LABEL)}
          </div>
        </div>
        <Form
          moduleType={MODULE_TYPES.TASK}
          saveField={onSaveField}
          formType={FORM_TYPE.CREATION_FORM}
          metaData={{
            formUUID: state?.form_details?.form_uuid,
            moduleId: state?.task_details?._id,
          }}
          sections={state.sections || []}
          fields={state.fields || {}}
          onFormConfigUpdate={updateSections}
          errorList={cloneDeep(state?.error_list)}
          showSectionName={state?.form_details?.show_section_name || false}
          userProfileData={userProfileData}
        />
      </>
    );

  const getAddFormView = () => (
    <div
      role="presentation"
      className={cx(
        gClasses.DashedBorder,
        BS.D_FLEX,
        styles.AddForm,
        gClasses.CenterVH,
        gClasses.CursorPointer,
        gClasses.MT8,
      )}
    // onClick={onAddFormHandler}
    >
      <span>
        <span
          className={cx(styles.CreateForm, gClasses.CursorPointer)}
          onClick={onAddFormHandler}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onAddFormHandler()}
        >
          {t(ADD_TASK_FORM.ADD_FORM_BUTTON)}
        </span>
        {t(TASK_STRINGS.ADD_FORM_BUTTON)}
      </span>
    </div>
  );

  const getFormView = (isFormVisible, formBuilderView, addFormView) => {
    const { state } = props;
    let formView = null;
    if (isFormVisible) {
      formView =
        state.sections.length > 0 || state.isFormDataLoading
          ? formBuilderView
          : addFormView;
    } else {
      formView = addFormView;
    }
    return formView;
  };

  const addFormView = getAddFormView();
  const formBuilderView = getFormBuilderView();
  const formView = getFormView(!state.isFormDataLoading && isFormVisible, formBuilderView, addFormView);
  const breadcrumbList = [{ text: t(ADD_TASK.FLOW_NAME) }, { text: t(ADD_TASK.CREATE_TASK) }];

  return (
    <ModalLayout
      id={id}
      isModalOpen={isModalOpen}
      onCloseClick={onCloseClick}
      headerClassName={styles.ModalHeader}
      closeIconClass={styles.CloseIcon}
      headerContent={(
        <div className={cx(styles.Header, BS.JC_BETWEEN, BS.D_FLEX)}>
          <Breadcrumb list={breadcrumbList} />
        </div>
      )}
      mainContent={(
        <div className={cx(styles.ContentContainer, gClasses.MB70)}>
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT15)}>
              <div>
                <div className={cx(gClasses.FTwo12GrayV2)}>
                  {t(ADD_TASK.FLOW_NAME)}
                </div>
                <div className={cx(gClasses.FTwo13GrayV3, gClasses.TextTransformCap)}>{flowName}</div>
              </div>
              <div>
                <div className={cx(gClasses.FTwo12GrayV2)}>
                  {t(ADD_TASK.REFERENCE_ID)}
                </div>
                <div className={gClasses.FTwo13GrayV3}>
                  {isReferenceIdLoading || state.isInstanceDataLoading ? (
                    <Skeleton width={100} height={15} />
                  ) : (
                    systemIdentifier || getReferenceId()
                  )}
                </div>
              </div>
          </div>
            <BasicDetails
              teamOrUserSelectHandler={teamOrUserSelectHandler}
              assignees={assignees}
              member_team_search_value={member_team_search_value}
              setMemberOrTeamSearchValue={setMemberOrTeamSearchValue}
              teamOrUserRemoveHandler={teamOrUserRemoveHandler}
              assigneeListUpdateHandler={assigneeListUpdateHandler}
              error_list={error_list}
              onDueDateChangeHandler={onDueDateChangeHandler}
              dueDate={due_date}
              taskName={task_name}
              taskDescription={task_description}
              errors={mergeObjects(error_list, server_error)}
              onChangeHandler={onTaskDetailsChangeHandler}
              onTaskNameBlurHandler={onTaskNameBlurHandler}
              taskType={is_assign_to_individual_assignees}
              onTaskTypeChangeHandler={onTaskTypeChangeHandler}
              setErrorMessage={setErrorMessage}
              assigneeSuggestionData={{
                assigneeSuggestionList,
                isAssigneeSuggestionLoading,
              }}
              onDayClick={onDayClick}
              recursive_data={recursive_data}
              setBatchData={setBatchData}
              setDataInsideRedux={setState}
              has_auto_trigger={has_auto_trigger}
              is_recursive={is_recursive}
              instanceId={flowInstanceId}
              flowUuid={flowUuid}
            />
            {formView}
            {/* <FileUploadDrop // commented out to move other items in new_ui branch to release
              files={files}
              userDetails={userDetails}
              isLoading={state.isFormDataLoading}
              removeTaskReferenceDocument={removeTaskReferenceDocument}
              dropHandler={dropHandler}
              dragOverHandler={dragOverHandler}
            />   {/* <FileUploadDrop // commented out to move other items in new_ui branch to release
              files={files}
              userDetails={userDetails}
              isLoading={state.isFormDataLoading}
              removeTaskReferenceDocument={removeTaskReferenceDocument}
              dropHandler={dropHandler}
              dragOverHandler={dragOverHandler}
            /> */}
        </div>
      )}
      footerContent={(
        <div
          className={cx(
            BS.D_FLEX,
            BS.JC_BETWEEN,
            BS.W100,
          )}
        >
          <div className={gClasses.CenterV}>
            {saveButton}
            {cancelButton}
          </div>
          <div className={gClasses.CenterV}>{publishButton}</div>
        </div>
      )}
    />
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setState: (value) => dispatch(createTaskSetState(value)),
    clearTaskState: () => {
      dispatch(createTaskClearState());
    },
    setFieldListValidation: (...params) => dispatch(setFieldListValidation(...params)),
    setTaskReferenceAttachments: (files) => dispatch(setTaskReferenceDocuments(files)),
    publishTaskApiCall: (data, obj, onCloseIconClick) => {
      dispatch(publishTaskApiThunk(data, obj, onCloseIconClick));
    },
    deleteFormBuilder: (data) => {
      dispatch(deleteFormBuilderApiThunk(data));
    },
    getTaskMetadataApi: (value, setAttachment) => {
      dispatch(getTaskMetadataApiThunk(value, setAttachment));
    },
    deleteTaskApiCall: (data) => {
      dispatch(deleteTaskApiThunk(data));
    },
    getTaskAssigneeSuggestionApi: (obj) =>
      dispatch(getTaskAssigneeSuggestionApiThunk(obj)),
    saveFieldApiCall: (...params) => dispatch(saveFieldApiThunk(...params)),
    saveTableApiCall: (...params) => dispatch(saveTableApiThunk(...params)),
    saveFormApiCall: (...params) => dispatch(saveFormApiThunk(...params)),
    deleteFormFieldOrFieldListApi: (...params) =>
      dispatch(deleteFormFieldOrFieldListApiAction(...params)),
    checkDependencyAndDeleteFieldApi: (...params) =>
      dispatch(checkDependencyAndDeleteFieldApiAction(...params)),
    setFormVisibility: (value) => dispatch(setFormVisibilityAction(value)),
    deleteFormApiCall: (value) => dispatch(deleteFormPostApiAction(value)),
    getVisibilityExternalFields: (...params) =>
      dispatch(visibilityExternalFieldsThunk(...params)),
    setField: (...params) => dispatch(setFieldData(...params)),
    setEntireField: (...params) => dispatch(setEntireField(...params)),
    setFieldList: (...params) => dispatch(setFieldListData(...params)),
    setSection: (...params) => dispatch(setSectionDataAction(...params)),
    setErrorList: (errorList) => dispatch(setErrorListData(errorList)),
    setDataListSelectorErrorList: (errorList) => dispatch(setDataListSelectorErrorListData(errorList)),
    setDefaultRuleValue: (
      id,
      value,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      toggle,
      isInitial,
    ) =>
      dispatch(
        setDefaultRuleFieldData(
          id,
          value,
          sectionIndex,
          fieldListIndex,
          fieldIndex,
          () => {},
          toggle,
          isInitial,
        ),
      ),
    setVisibilityFieldValue: (
      id,
      value,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
    ) =>
      dispatch(
        setVisibilityFieldData(
          id,
          value,
          sectionIndex,
          fieldListIndex,
          fieldIndex,
        ),
      ),
    getFormDetailsByTaskMetadataId: (metadataId) =>
      dispatch(getFormDetailsByTaskMetadataIdThunk(metadataId)),
    getInstanceDetailsById: (id) => dispatch(getInstanceDetailsByID(id)),
    saveRuleForFieldApi: (ruleData, id, sectionId, fieldListIndex, fieldId) =>
      dispatch(
        saveRuleForFieldApiThunk(
          ruleData,
          id,
          sectionId,
          fieldListIndex,
          fieldId,
        ),
      ),
    onGetLookupList: (params, isPaginatedData, isSearch) =>
      dispatch(getLookupListApiThunk(params, isPaginatedData, isSearch)),
    setBatchData: (recursive_data) => {
      dispatch(setDataInsideBatchTask(recursive_data));
    },
    clearExternalFields: () => dispatch(externalFieldsClear()),
    clearVisibilityOperators: () => dispatch(clearVisibilityOperators()),
    getRuleDetailsByIdInFieldVisibilityApi: (
      ruleId,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      avoidExpressionUpdate,
    ) =>
      dispatch(
        getRuleDetailsByIdInFieldVisibility(
          ruleId,
          sectionIndex,
          fieldListIndex,
          fieldIndex,
          avoidExpressionUpdate,
        ),
      ),
    onUpdateExternalFieldsFromDeletedFieldUUID: (field_uuid) => dispatch(updateExternalFieldsFromDeletedFieldUUID(field_uuid)),
    setAccountConfigurationData: (response) => {
      dispatch(accountConfigurationDataChangeAction(response));
    },
    checkDependencyAndDeleteSectionApi: (...params) =>
      dispatch(checkDependencyAndDeleteSectionApiAction(...params)),
    dispatch,
  };
};

const mapStateToProps = (state) => {
  return {
    state: state.CreateTaskReducer,
    taskFormSections: state.CreateTaskReducer.sections,
    error_list: state.CreateTaskReducer.error_list,
    datalist_selector_error_list: state.CreateTaskReducer.datalist_selector_error_list,
    addFormFieldsDropdownVisibilityData:
      state.CreateTaskReducer.addFormFieldsDropdownVisibilityData,
    lookUpListCurrentPage: state.LookUpReducer.lookUpListCurrentPage,
    lookUpListDataCountPerCall: state.LookUpReducer.lookUpListDataCountPerCall,
    lookUpList: state.LookUpReducer.lookUpList,
    lookupHasMore: state.LookUpReducer.hasMore,
    isReferenceIdLoading: state.CreateTaskReducer.isReferenceIdLoading,
    recursive_data: state.CreateTaskReducer?.auto_trigger_details?.recursive_data,
    is_recursive: state.CreateTaskReducer?.auto_trigger_details?.is_recursive,
    has_auto_trigger: state.CreateTaskReducer.has_auto_trigger,
    ref_uuid: state.CreateTaskReducer.ref_uuid,
    files: state.CreateTaskReducer.files,
    removed_doc_list: state.CreateTaskReducer.removed_doc_list,
    entityId: state.CreateTaskReducer.entityId,
  };
};

Task.defaultProps = {};
Task.propTypes = {
  state: propTypes.objectOf(propTypes.any).isRequired,
  taskFormSections: propTypes.arrayOf(propTypes.any).isRequired,
  flowInstanceId: propTypes.string.isRequired,
  flowName: propTypes.string.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Task));
