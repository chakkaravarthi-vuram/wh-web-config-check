/**
 * @author rajkumarj
 * @email rajkumarj@vuram.com
 * @create date 2020-05-05 12:52:11
 * @modify date 2020-05-05 12:52:11
 * @desc [description]
 */
// React and npm imports
import React, { useEffect, useState, useContext } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import cloneDeep from 'lodash/cloneDeep';

import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { isNull, isUndefined } from 'lodash';
import useCreateTask from 'hooks/useTask.hook';
import UpdateConfirmPopover from 'components/update_confirm_popover/UpdateConfirmPopover';
import { FORM_TITLE_TYPES } from 'components/form_components/form_title/FormTitle';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import { modifyAndUpdateServerErrorInExpression, validateExpressionAndUpdateField } from 'components/query_builder/QueryBuilder.utils';
import { attachmentApiCallAndGenerateData } from 'utils/attachmentUtils';
import { saveFieldValidateSchema } from 'validation/form/form.validation.schema';
import { globalFormulaBuilderEvaluateThunk } from 'redux/actions/FormulaBuilder.Actions';
import { FORMULA_BUILDER } from 'components/formula_builder/FormulaBuilder.strings';
import { checkForDefaultValueValidation } from 'utils/rule_engine/RuleEngine.utils';
import { accountConfigurationDataChangeAction } from 'redux/actions/AccountConfigurationAdmin.Action';
import {
  DOCUMENT_TYPES,
  EMPTY_STRING,
  ENTITY,
  FORM_BUILDER_STRINGS,
  FORM_POPOVER_STRINGS,
} from 'utils/strings/CommonStrings';
import { Button as LibraryButton, EButtonType, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { store } from '../../../Store';

// Components
import BasicDetails from './basic_details/BasicDetails';
// import Form from './form/Form';
import Form from '../../form/Form';
import Button from '../../../components/form_components/button/Button';
import Breadcrumb from '../../../components/form_components/breadcrumb/Breadcrumb';
import FormTitle from '../../../components/form_components/form_title/FormTitle';
import FileUploadDrop from '../../../components/file_upload_drop/FileUploadDrop';
import * as ROUTE_CONSTANTS from '../../../urls/RouteConstants';

// Assets and fucntions

import {
  checkAndDisplaySectionTitleError,
  getBasicDetailsValidateData,
  getOverallTaskDetailsValidateData,
  getSaveTaskValidateSchema,
  getTaskDetailsValidateData,
  getTaskAPIData,
  getTaskDetailsAPIData,
  PostFormFieldAndAutocompleteSuggestionAPI,
  getSaveFieldDetailsAPIData,
  getFieldDataForValidation,
  getSaveTableDetailsAPIData,
  formatValidationMessages,
  getSaveFormTaskMetadata,
  getTaskUserAndTeamIDs,
} from './Task.utils';
import {
  validate,
  mergeObjects,
  setPointerEvent,
  isMobileScreen,
  // isGeneratedRefName,
  updatePostLoader,
  updateAlertPopverStatus,
  clearAlertPopOverStatus,
  getUserProfileData,
  setUserProfileData as setGlobaleUserProfileData,
  keydownOrKeypessEnterHandle,
  isSvgContentSuspicious,
  showToastPopover,
  isBasicUserMode,
} from '../../../utils/UtilityFunctions';
import { M_T_STRINGS } from '../../landing_page/LandingPage.strings';
import {
  taskDetailsValidateSchema,
  saveTaskSchema,
  overallTaskDetailsValidateSchema,
  overallTaskDetailsValidateSchemaWithoutForm,
  basicDetailsValidateSchema,
  saveBasicDetailsValidateSchema,
  taskDetailsValidateSchemaWithOneSection,
  basicDetailsValidateSchemaForTaskCreation,
} from './Task.validation.schema';

import {
  publishTaskApiThunk,
  validateFormApiThunk,
  saveTaskApiThunk,
  deleteTaskApiThunk,
  saveFormApiThunk,
  getTaskAssigneeSuggestionApiThunk,
  deleteFormPostApiAction,
  saveRuleForFieldApiThunk,
  deleteFormApi,
  fieldAutoCompleteApiThunk,
  getFormDetailsByTaskMetadataIdThunk,
  getRuleDetailsByIdInFieldVisibility,
  deleteFormBuilderApiThunk,
  saveFieldApiThunk,
  saveTableApiThunk,
} from '../../../redux/actions/CreateTask.Action';
import {
  createTaskSetState,
  createTaskClearState,
  setFormVisibilityAction,
  setFieldData,
  setFieldListData,
  setDefaultRuleFieldData,
  setErrorListData,
  setEntireField,
  setSectionDataAction,
  setVisibilityFieldData,
  setAdditionalErrorListData,
  openFieldConfig,
  setTaskReferenceDocuments,
  setFieldListValidation,
  setDataListSelectorErrorListData,
} from '../../../redux/reducer/CreateTaskReducer';
import jsUtils, {
  cleanObject,
  get,
  isEmpty,
  unset,
  set,
} from '../../../utils/jsUtility';

// Css
import styles from './Task.module.scss';
import gClasses from '../../../scss/Typography.module.scss';

// Strings and constants
import { BS } from '../../../utils/UIConstants';
import { TASK_DISCARD_POPOVER, TASK_STRINGS, getBreadcrumbList } from './Task.strings';
import { BUTTON_TYPE, FORM_POPOVER_STATUS, MODULE_TYPES, SVG_FORMAT } from '../../../utils/Constants';
import {
  FIELD_CONFIGS, FIELD_TYPES,
} from '../../../components/form_builder/FormBuilder.strings';
import {
  FIELD_KEYS,
  FIELD_LIST_KEYS,
  DEFAULT_RULE_KEYS,
  GET_SECTION_INITIAL_DATA,
  VISIBILITY_CONFIG_FIELDS,
} from '../../../utils/constants/form.constant';
import * as formBuilderUtils from '../../../utils/formUtils';

import {
  getFieldFromState,
} from '../../../redux/selectors/CreateTask.selector';
import { visibilityExternalFieldsThunk, externalFieldsClear, clearVisibilityOperators, updateExternalFieldsFromDeletedFieldUUID } from '../../../redux/actions/Visibility.Action';
import {
  checkDependencyAndDeleteFieldApiAction, checkDependencyAndDeleteSectionApiAction,
  deleteFormFieldOrFieldListApiAction,
} from '../../../redux/actions/Form.Action';
import { getLookupListApiThunk } from '../../../redux/actions/LookUp.Action';
import { getAccountConfigurationDetailsApiService } from '../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { getActiveTaskListDataThunk, getSignedUrlApiThunk, getTaskMetadataApiThunk } from '../../../redux/actions/TaskActions';
import WarningNewIcon from '../../../assets/icons/WarningNewIcon';
import { saveField } from '../../../axios/apiService/createTask.apiService';
import { FIELD_ACTION_TYPE, FORM_TYPE } from '../../form/Form.string';
import { constructTreeStructure, getParentNodeUuidFromTree, getSectionAndFieldsFromResponse, getSectionFieldsFromLayout } from '../../form/sections/form_layout/FormLayout.utils';
import { REQUEST_SAVE_FORM } from '../../../utils/constants/form/form.constant';
import { saveTable } from '../../../axios/apiService/form.apiService';
import { saveFormWithField } from '../../../axios/apiService/createTaskFromPrompt.apiService';
import ThemeContext from '../../../hoc/ThemeContext';

function Task(props) {
  const locationHistory = useHistory();
  const [isMobileView, setMobileView] = useState(isMobileScreen());
  const [userProfileData, setUserProfileData] = useState({});
  const [isFileUploadInProgress, setFileUploadInProgress] = useState(false);
  const { t } = useTranslation();
  let isSaveCloseClicked = false;

  const history = useHistory();
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const isBasicUser = isBasicUserMode(history);
  const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;

  const mobileViewScreen = () => {
    setMobileView(isMobileScreen());
  };

  const setFileUploadStatus = (status) => {
    setFileUploadInProgress(status);
  };
  const userDetails = getUserProfileData();

  const { location, onCloseClick, isEditTask, taskCreationUuid } = props;
  useEffect(() => {
    const { setState, getFormDetailsByTaskMetadataId, getTaskMetadataApi } = props;
    if (location?.state?.taskDetails) {
      const {
        state: { taskDetails },
      } = location;

      const initialCallData = {
        task_name: taskDetails?.task_name,
        task_metadata_uuid: taskDetails?.task_metadata_uuid,
        assignees: getTaskUserAndTeamIDs(taskDetails?.assignees),
        has_auto_trigger: taskDetails?.has_auto_trigger,
        collect_data: taskDetails?.collect_data,
        ...(!isEmpty(taskDetails?.task_description) ? { task_description: taskDetails?.task_description } : {}),
        ...(!isEmpty(taskDetails?.task_reference_documents) ? { task_reference_documents: taskDetails?.task_reference_documents } : {}),
      };
      // eslint-disable-next-line no-use-before-define
      saveTaskApi(null, null, null, null, false, false, null, false, null, initialCallData);
      if (taskDetails.task_reference_documents) {
        getTaskMetadataApi({ _id: taskDetails._id }, true);
      }
      let due_date = '';
      if (taskDetails.due_date) { due_date = taskDetails.due_date.pref_tz_datetime; }
      if (taskDetails.collect_data) {
        getFormDetailsByTaskMetadataId(taskDetails._id);
      }
      const assignees = {};
      if (taskDetails.assignees?.teams) { assignees.teams = [...taskDetails.assignees.teams]; }
      if (taskDetails.assignees?.users) { assignees.users = [...taskDetails.assignees.users]; }
      setState({
        assignees: assignees || {},
        task_name: taskDetails.task_name || '',
        task_description: taskDetails.task_description || '',
        due_date,
        task_details: { ...taskDetails },
        isFormVisible: taskDetails.collect_data,
        sections: [],
        form_details: {},
        is_assign_to_individual_assignees: taskDetails.is_assign_to_individual_assignees,
      });
    } else {
      const { setState } = props;
      setState({ files: [], entityId: null, task_reference_documents: [], task_details: {} });
    }
  }, [location.pathname]);
  const { state } = props;
  const {
    task_name,
    task_description,
    error_list,
    server_error,
    assignees,
    member_team_search_value,
    due_date,
    isFormVisible,
    files,
    is_assign_to_individual_assignees,
    assigneeSuggestionList,
    isAssigneeSuggestionLoading,
  } = state;

  const onCloseIconClick = () => {
    console.log('filescheck onCloseIconClick');
    console.log('onCloseClick', onCloseClick);
    onCloseClick();
  };

  const onDiscardPopUpYesHandler = () => {
    const { dispatch } = props;
    if (!jsUtils.isUndefined(state.task_details)) {
      if (state.task_details?.task_metadata_uuid) {
        dispatch(deleteTaskApiThunk({
          task_metadata_uuid: state.task_details.task_metadata_uuid,
        })).then(() => {
          clearAlertPopOverStatus();
          onCloseIconClick();
        });
      } else {
          clearAlertPopOverStatus();
          onCloseIconClick();
      }
    }
  };
  const onCancelButtonClick = () => {
    updateAlertPopverStatus({
      isVisible: true,
      customElement: (
        <UpdateConfirmPopover
          onYesHandler={onDiscardPopUpYesHandler}
          onNoHandler={clearAlertPopOverStatus}
          title={t(TASK_DISCARD_POPOVER.TITLE)}
          subTitle={t(TASK_DISCARD_POPOVER.SUBTITLE)}
        />
      ),
    });
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
    });
  };

  const setErrorMessage = (errorObject) => {
    const { state, setErrorList } = props;
    const { error_list } = state;
    const mergedErrorList = cleanObject({ ...error_list, ...errorObject });
    setErrorList(mergedErrorList);
  };

  const {
    saveFormCallback,
  } = useCreateTask({ ...props, t });

  const saveFormAPI = (
    sectionId,
    fieldListIndex,
    fieldId,
    isDnDSaveForm = false,
    isConfigPopupOpen = false,
    updatePostFormFieldsValues = false,
    _sections,
    emptyPostData,
    isSaveField,
  ) => {
    // api call for saving form
    setPointerEvent(true);
    const { state, saveFormApiCall, saveFieldApiCall, saveTableApiCall } = props;
    const state_data = cloneDeep(state);
    const { sections } = store.getState().CreateTaskReducer;
    let formData = {};
    if (isSaveField) {
      formData = {
        data: emptyPostData
          ? null
          : getSaveFieldDetailsAPIData(
              { ...state_data, sections: _sections || sections },
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
              { ...state_data, sections: _sections || sections },
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
      );
    } else {
      return saveFormApiCall(
        formData,
        isConfigPopupOpen,
        updatePostFormFieldsValues,
      );
    }
  };
  const updateTodoTask = () => {
    const { location } = props;
    if (location.pathname === ROUTE_CONSTANTS.CREATE_EDIT_TASK || location.pathname === ROUTE_CONSTANTS.HOME) {
      const { updateTodoTaskApi } = props;
      const data = {
        page: 1,
        size: 3,
      };
      updateTodoTaskApi(data, M_T_STRINGS.TASK_LIST.GET_TASK_LIST);
    }
  };

  const publishTaskApi = async (taskDetails = state.task_details, mlUrlParam) => {
    const { publishTaskApiCall, history, setErrorList } = props;
    const data = {
      task_metadata_uuid: taskDetails.task_metadata_uuid,
    };
    // const validated_error_list = getValidation(state);
    const validated_error_list = {};
    console.log('fsdfdsf', validated_error_list);
    if (isEmpty(validated_error_list)) {
      await publishTaskApiCall(data, history, onCloseIconClick, updateTodoTask, mlUrlParam);
    } else {
      setPointerEvent(false);
      setErrorList(validated_error_list);
      showToastPopover(
        Object.values(validated_error_list)[0],
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
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
    isSaveField = false,
    isMlParam,
    initialCallData = null,
  ) => {
    const { state, dispatch, ref_uuid, files } = props;
    console.log('filescheck', ref_uuid, files);
    console.log('filescheck =======>');
    const state_data = cloneDeep(state);
    const { sections } = state_data;
    let currentField = {};
    // api call for saving form
    setPointerEvent(true);
    const postData = {
      data: saveTaskPostData ||
             getTaskAPIData(
               cloneDeep(state_data),
               null,
               (
                 isSaveCloseClicked ?
                 !isEmpty(sections) :
                 null
                )),
    };
    await postDataDocumentProcess(postData, cloneDeep(state_data));
    console.log('filescheck =======>after postDataDocumentProcess', postData);
    if (sectionIndex && fieldListIndex && fieldIndex) {
      postData.sectionId = sectionIndex;
      postData.fieldListId = fieldListIndex;
      postData.fieldId = fieldIndex;
    }
    console.log('filescheck =======>after condition check inbetween', postData);
    if (postData.data) {
      console.log('filescheck =======>ainside if', postData);
      postData.data.is_reminder_task = false;
      postData.data.has_auto_trigger = false;
      console.log('filescheck =======>end of if', postData);
    }
    console.log('filescheck =======>after condition check', postData);
    if (isSaveCloseClicked) postData.data.is_save_close = true;
    console.log('filescheck', withoutTaskIdOrPublish);
    console.log('filescheck sdkfdskfhdskj', sectionIndex, fieldListIndex, fieldIndex, false, isConfigPopupOpen, updatePostFormFieldsValues, null, null, isSaveField);
    return dispatch(
      saveTaskApiThunk(
        postData,
        withoutTaskIdOrPublish,
        () => {
          console.log('filescheck after saveTaskApiThunk');
          currentField = get(sections, [sectionIndex - 1, 'field_list', fieldListIndex, 'fields', fieldIndex - 1], {});
          console.log('filescheck after currentField', currentField);
          const { has_validation_error } = checkForDefaultValueValidation(currentField);
          console.log('filescheck has_validation_error', has_validation_error);
          if (!has_validation_error) {
            console.log('filescheck sdkfdskfhdskj', sectionIndex, fieldListIndex, fieldIndex, false, isConfigPopupOpen, updatePostFormFieldsValues, null, null, isSaveField);
            saveFormAPI(
              sectionIndex,
              fieldListIndex,
              fieldIndex,
              false,
              isConfigPopupOpen,
              updatePostFormFieldsValues,
              null,
              null,
              isSaveField,
            );
          }
        },
        publishTaskApi,
        isMlParam,
        initialCallData,
      ),
    );
  };

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

  const onCreateTaskButtonClicked = async (event) => {
    if (isFileUploadInProgress) {
      showToastPopover(
        `${t('common_strings.attachment')} ${FORM_POPOVER_STRINGS.FILE_UPLOAD_IN_PROGRESS}`,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      return;
    }
    if (event) event.preventDefault();
    const { state, validateForm, dispatch } = props;
    const { form_details, task_details } = state;
    console.log('fgdsgfds', validateForm, !jsUtils.isEmpty(form_details));
    const error = validateTaskDetails();
    console.log('errorerrorerrorerror', jsUtils.isEmpty(cleanObject(error)), jsUtils.isEmpty(error_list));
    if (jsUtils.isEmpty(cleanObject(error)) && jsUtils.isEmpty(error_list)) {
      const saveTaskPostData = getTaskAPIData(cloneDeep(state));
      if (
        !isEmpty(state.form_details) &&
        isEmpty(state.sections)
      ) {
        saveTaskPostData.collect_data = false;
        try {
          await deleteFormApi(get(state, ['task_details', '_id']));
        } catch (err) {
          showToastPopover(
            'Something went wrong',
            'Please try again',
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
      }
      if (!isEmpty(state.sections)) {
        dispatch(validateFormApiThunk(
            { task_metadata_id: task_details._id },
            () => saveTaskApi('publish', null, null, false, false, false, saveTaskPostData, false, props?.history?.location?.state?.mlAction && taskCreationUuid),
          ));
      } else saveTaskApi('publish', null, null, false, false, false, saveTaskPostData, false, props?.history?.location?.state?.mlAction && taskCreationUuid);
    } else {
      const { setState } = props;
      setState({ error_list: error });
    }
  };

  const updateSectionTitleError = (errors) => {
    checkAndDisplaySectionTitleError({ error_list: errors });
  };

  const onSaveFormField = (
    sectionIndex,
    fieldListIndex,
    fieldIndex,
    isConfigPopupOpen,
  ) => {
    const { state, setErrorList, setState, datalist_selector_error_list } = props;
    const { form_details, additional_error_list } = state;
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

    PostFormFieldAndAutocompleteSuggestionAPI(state);
    setState({
      isFieldSuggestionEnabled: false,
      disableFieldTypeSuggestion: true,
      initialTaskLabel: EMPTY_STRING,
      field_type_data: [],
    });
    const errorList = {
      ...validate(
        getSaveTaskValidateSchema(jsUtils.cloneDeep(state)),
        saveTaskSchema,
      ),
      ...additional_error_list,
      ...validate(
        getTaskDetailsValidateData(jsUtils.cloneDeep(state)),
        taskDetailsValidateSchema(t),
      ),
    };
    console.log('TASK SAVE FORM', errorList);

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
        if (jsUtils.isEmpty(errorList) && jsUtils.isEmpty(datalist_selector_error_list)) {
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
              taskDetailsValidateSchema(t),
            );
          }

          console.log('TASK SAVE FORM PROMISE', errorTaskDetailsValidate);
          return setErrorList(errorTaskDetailsValidate).then(() => {
            const {
              saveRuleForFieldApi,
              setState,
              setDefaultRuleValue,
              setVisibilityFieldValue,
            } = props;
            if (jsUtils.isEmpty(errorTaskDetailsValidate) && !has_validation) {
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
                return formBuilderUtils
                  .saveFormRule(metadata, field, async (ruleData, id) =>
                    saveRuleForFieldApi(
                      ruleData,
                      id,
                      sectionIndex - 1,
                      fieldListIndex,
                      fieldIndex ? fieldIndex - 1 : null,
                    ), isSaveField || isUndefined(fieldIndex) || isNull(fieldIndex))
                  .then(
                    (response) => {
                      if (response.success) {
                        return saveFormAPI(
                          sectionIndex,
                          fieldListIndex,
                          fieldIndex,
                          false,
                          isConfigPopupOpen,
                          true,
                          null,
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

              const saveTaskPostData = getTaskAPIData(cloneDeep(state));
              saveTaskPostData.collect_data = true;
              return saveTaskApi(
                'withoutTaskId',
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                true,
                isConfigPopupOpen,
                saveTaskPostData,
                isSaveField,
              ).then(
                (status) => resolve(status),
                () => resolve(false),
              );
            }
            updateSectionTitleError(errorTaskDetailsValidate);
            return resolve(false);
          });
        }
        return resolve(false);
      }));
  };

  const onTabChange = async (
    { currentIndex, index },
    sectionIndex,
    fieldListIndex,
    fieldIndex = null,
  ) => {
    const { state, setErrorList } = props;
    if (currentIndex === FIELD_CONFIGS.VALIDATION.TAB_INDEX || currentIndex === FIELD_CONFIGS.OTHER_SETTINGS.TAB_INDEX) {
      const errorList = validate(
        getTaskDetailsValidateData(state),
        state.sections.length === 1
          ? (taskDetailsValidateSchemaWithOneSection(t))
          : taskDetailsValidateSchema(t),
      );
      if (!jsUtils.isEmpty(errorList)) {
        setErrorList(errorList);
        return false;
      }
    }
    if (currentIndex === FIELD_CONFIGS.BASIC_CONFIG.TAB_INDEX) {
      const errorList = validate(
        getTaskDetailsValidateData(state),
        state.sections.length === 1
          ? taskDetailsValidateSchemaWithOneSection(t)
          : taskDetailsValidateSchema(t),
      );
      if (!jsUtils.isEmpty(errorList)) {
        setErrorList(errorList);
        if (
          formBuilderUtils.basicConfigErrorExist(
            errorList,
            sectionIndex,
            fieldListIndex,
            fieldIndex,
          )
        ) { return false; }
      }
    }
    if (
      currentIndex === FIELD_CONFIGS.OTHER_SETTINGS.TAB_INDEX &&
      fieldIndex !== null
    ) {
      const currentField = jsUtils.get(state, [
        'sections',
        sectionIndex,
        'field_list',
        fieldListIndex,
        'fields',
        fieldIndex,
      ]);
      const is_advanced_expression = jsUtils.get(state, [
        'sections',
        sectionIndex,
        'field_list',
        fieldListIndex,
        'fields',
        fieldIndex,
        FIELD_KEYS.IS_ADVANCED_EXPRESSION,
      ], false);
      if (currentField[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]) {
        unset(currentField, ['draft_default_value', 'errors']);
        const { validation_error: error } = checkForDefaultValueValidation(currentField);
        if (!isEmpty(error)) {
          const { setDefaultRuleValue } = props;
          setDefaultRuleValue(
            DEFAULT_RULE_KEYS.ERRORS,
            error,
            sectionIndex,
            fieldListIndex,
            fieldIndex,
          );
          return false;
        }

        const { setDefaultRuleValue, dispatch } = props;
        let has_error = false;
        if (is_advanced_expression) {
          const formulaCode = jsUtils.get(
            currentField,
            [FIELD_KEYS.DEFAULT_DRAFT_VALUE, DEFAULT_RULE_KEYS.INPUT],
            EMPTY_STRING,
            );
            const { INCORRECT_SYNTAX } = FORMULA_BUILDER(t).VALIDATION.LABEL;
          await dispatch(globalFormulaBuilderEvaluateThunk(formulaCode))
          .then(() => true)
          .catch(({ error }) => {
              if (!isEmpty(error)) {
                has_error = true;
                const serverErrorMessage = jsUtils.get(Object.values(error), [0], EMPTY_STRING);
                const message = serverErrorMessage ? `${INCORRECT_SYNTAX}: ${serverErrorMessage}` : INCORRECT_SYNTAX;
                setDefaultRuleValue(
                  DEFAULT_RULE_KEYS.ERRORS,
                  { [DEFAULT_RULE_KEYS.INPUT]: message },
                   sectionIndex,
                   fieldListIndex,
                   fieldIndex);
              }
            });
          return !has_error;
        }
      }
    }

    if (currentIndex === FIELD_CONFIGS.VISIBILITY.TAB_INDEX) {
      const fieldData =
        fieldIndex !== null
          ? jsUtils.get(state, [
              'sections',
              sectionIndex,
              'field_list',
              fieldListIndex,
              'fields',
              fieldIndex,
            ])
          : jsUtils.get(state, [
              'sections',
              sectionIndex,
              'field_list',
              fieldListIndex,
            ]);
      if (
        fieldIndex !== null
          ? fieldData[FIELD_KEYS.IS_SHOW_WHEN_RULE]
          : fieldData[FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE]
      ) {
        const { setState } = props;
        const { allSections: validatedSections, has_validation } = validateExpressionAndUpdateField(
          fieldData,
          sectionIndex,
          fieldListIndex,
          fieldIndex,
          jsUtils.isNull(fieldIndex),
          jsUtils.cloneDeep(jsUtils.get(state, ['sections'], [])),
         );
          setState({
          sections: validatedSections,
          });
          if (has_validation) return false;
      }
    }
    if (
      (index === FIELD_CONFIGS.VISIBILITY.TAB_INDEX || index === FIELD_CONFIGS.VALIDATION.TAB_INDEX || index === FIELD_CONFIGS.BASIC_CONFIG.TAB_INDEX) &&
      !jsUtils.isEmpty(state.task_details._id) &&
      (jsUtils.isEmpty(state.form_details) ||
        state.form_details.sections[sectionIndex] ||
        (fieldIndex !== null
          ? !jsUtils.get(state, [
              'sections',
              sectionIndex,
              'field_list',
              fieldListIndex,
              'fields',
              fieldIndex,
              'field_uuid',
            ])
          : !jsUtils.get(state, [
              'sections',
              sectionIndex,
              'field_list',
              fieldListIndex,
              'table_uuid',
            ])))
    ) {
      const errorList = validate(
        getTaskDetailsValidateData(state),
        state.sections.length === 1
          ? taskDetailsValidateSchemaWithOneSection(t)
          : taskDetailsValidateSchema(t),
      );
      if (jsUtils.isEmpty(errorList)) {
        if (fieldListIndex !== null && fieldIndex === null) {
          const status = await onSaveFormField(
            sectionIndex + 1,
            fieldListIndex,
            fieldIndex !== null ? fieldIndex + 1 : null,
            true,
          );
          if (status) return true;
        }
        return true;
      }
      setErrorList(errorList);
      return false;
    }
    return true;
  };

  const {
    teamOrUserRemoveHandler,
    teamOrUserSelectHandler,
    onDueDateChangeHandler,
    onTaskDetailsChangeHandler,
    onTaskTypeChangeHandler,
    onTaskNameBlurHandler,
    setMemberOrTeamSearchValue,
    removeTaskReferenceDocument,
  } = useCreateTask(
    { ...props, t },
    onSaveFormField,
    'task',
    jsUtils.get(state, ['task_details', '_id']),
    onTabChange,
  );

  const onSaveButtonClick = () => {
    const { state, dispatch, setErrorList, saveFormApiCall } = props;
    const { sections, form_details } = state;
    const validationError = validate(
      getBasicDetailsValidateData(jsUtils.cloneDeep(state)),
      saveBasicDetailsValidateSchema(t),
    );
    dispatch(createTaskSetState({ error_list: validationError }));
    if (isEmpty(validationError)) {
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
              console.log('abcd success', formData);
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
      isSaveCloseClicked = true;
      saveTaskApi().then((status) => {
        console.log('check status', status);
        if (status && status.success === false) {
          setErrorList({ ...status?.error?.state_error });
          return false;
        } else if (status === true || (status && status.success)) onCloseIconClick();
        return true;
      });
    }
  };

  const getTabElements = () => {
    const elements = {
      currentComponent: null,
      backButton: null,
      nextButton: null,
      saveButton: null,
      cancelButton: null,
    };
    const { SAVE_DRAFT, CREATE, CANCEL } = TASK_STRINGS.ACTION_BUTTONS;
    elements.nextButton = (
      <LibraryButton
        buttonType={EButtonType.PRIMARY}
        onClick={(event) => onCreateTaskButtonClicked(event)}
        className={cx(BS.TEXT_NO_WRAP)}
        buttonText={t(CREATE)}
        colorSchema={colorSchema}
      />
    );
    elements.saveButton = (
      <Button
        buttonType={BUTTON_TYPE.SECONDARY}
        className={cx(BS.TEXT_NO_WRAP, modalStyles.SecondaryButton)}
        onClick={async () => {
          isSaveCloseClicked = true;
          onSaveButtonClick();
        }}
      >
        {t(SAVE_DRAFT)}
      </Button>
    );
    elements.cancelButton = (
      <Button
        buttonType={BUTTON_TYPE.LIGHT}
        className={cx(!isMobileView ? gClasses.ML10 : cx(gClasses.ML5, gClasses.MR5), modalStyles.SecondaryButton)}
        onClick={onCancelButtonClick}
      >
        {t(CANCEL)}
      </Button>
    );

    return elements;
  };
  const onAddFormHandler = async (isMlTaskCreation) => {
    console.log('filescheck addform handler');
    const { state, dispatch } = props;
    const { isFormVisible } = state;
    // On add form click if form already present add section else add form
    console.log('filescheck addform handler isFormVisible', isFormVisible);
    if (isFormVisible) {
      onSectionAddButtonClick();
    } else {
      const { setFormVisibility, setErrorList } = props;
      console.log('filescheck addform handler else basicDetailsValidateSchemaForTaskCreation');
      let errorList = null;
      if (props?.history?.location?.state?.mlAction) {
      errorList = validate(
        getBasicDetailsValidateData(jsUtils.cloneDeep(state)),
        basicDetailsValidateSchemaForTaskCreation(t),
      );
    } else {
         errorList = validate(
          getBasicDetailsValidateData(jsUtils.cloneDeep(state)),
          basicDetailsValidateSchema(t),
        );
      }
      console.log('filescheck errorList', errorList);
      await setErrorList(errorList);
      if (isEmpty(errorList)) {
        console.log('filescheck no error');
        const saveTaskApiData = cloneDeep(getTaskAPIData(cloneDeep(state), null, true, isMlTaskCreation));
        delete saveTaskApiData.has_auto_trigger;
        console.log('filescheck saveTaskApiData', saveTaskApiData);
        saveTaskApi(null, null, null, null, false, false, saveTaskApiData, false, isMlTaskCreation && taskCreationUuid)
          .then(() => {
            const newSections = [
              ...state.sections,
            ];
            if (!props?.history?.location?.state?.mlAction) {
              console.log('filescheck additinal section check');
              newSections.push(GET_SECTION_INITIAL_DATA(
                t(FORM_BUILDER_STRINGS.DEFAULT_SECTION_NAME),
                state.sections.length + 1,
              ));
            } else if (props?.history?.location?.state?.mlAction && newSections.length < 1) {
              console.log('filescheck additinal section check 2');
              newSections.push(GET_SECTION_INITIAL_DATA(
                t(FORM_BUILDER_STRINGS.DEFAULT_SECTION_NAME),
                state.sections.length + 1,
              ));
            }

            if (isMlTaskCreation && taskCreationUuid) {
                const metadata = getSaveFormTaskMetadata(state);
                const data = { sections: newSections, task_metadata_id: metadata?.task_metadata_id };
                saveFormWithField(data).then((response) => {
                  const { sections, fields } = getSectionAndFieldsFromResponse(response?.sections);
                  if (!isEmpty(sections)) {
                    dispatch(createTaskSetState({
                      sections: sections,
                      fields: fields,
                      form_details: response,
                    }))
                    .then(() => setFormVisibility(true));
                  }
                });
            } else {
              const formData = {
                data: getTaskDetailsAPIData({ ...state, sections: newSections }),
              };
              dispatch(saveFormApiThunk(formData, false, false, true, false))
              .then((response) => {
                const sections = response?.sections?.map((section) => {
                  return {
                    ...section,
                    layout: constructTreeStructure(section?.contents),
                  };
                });
                if (!isEmpty(sections)) {
                  dispatch(createTaskSetState({
                    sections: sections,
                    form_details: response,
                  }))
                  .then(() => setFormVisibility(true));
                }
              });
            }
          })
          .catch(() => {
            console.log('filescheck error');
            setPointerEvent(false);
            updatePostLoader(false);
            showToastPopover(
              'Something went wrong',
              'Please try again after sometime',
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          });
      } else {
        showToastPopover(
          'Please check if appropriate details are filled to proceed',
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    }
  };

  useEffect(() => {
    const { setState, setAccountConfigurationData } = props;
    if (props?.history?.location?.state?.mlAction) {
      console.log('filescheck use effect');
      const { sections } = store.getState().CreateTaskReducer;
      console.log('filescheck sections ', sections);
      onAddFormHandler(true);
    }
    getAccountConfigurationDetailsApiService().then((response) => {
      setUserProfileData(response);
      setGlobaleUserProfileData(response);
      const _response = {
        allowed_extensions: jsUtils.get(response, ['allowed_extensions'], []),
      };
      setAccountConfigurationData(_response);
    });
    setState({ ref_uuid: uuidv4() });
    return () => {
      const { clearState, clearExternalFields, clearVisibilityOperators } = props;
      if (clearState) {
        clearState();
      }
      clearExternalFields();
      clearVisibilityOperators();
      window.removeEventListener('resize', mobileViewScreen);
    };
  }, []);

  const deleteFormHandler = async () => {
    const { state = {}, deleteFormBuilder } = props;
    const { task_details = {} } = state;
    await deleteFormBuilder({ task_metadata_id: task_details?._id });
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

  const getAddFormView = () => (
    <div
      role="presentation"
      className={cx(
        gClasses.DashedBorder,
        BS.D_FLEX,
        styles.AddForm,
        gClasses.CenterVH,
        gClasses.MT8,
      )}
    >
      <span>
          <span
          tabIndex={0}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onAddFormHandler()}
          role="button"
          className={cx(styles.CreateForm, gClasses.CursorPointer)}
          onClick={() => onAddFormHandler()}
          >
            {t(TASK_STRINGS.ACTION_BUTTONS.ADD_FORM)}
          </span>
          {t(TASK_STRINGS.ADD_FORM_BUTTON)}
      </span>
    </div>
  );
  const dropHandler = async (ev) => {
    const { dispatch, state, ref_uuid, setTaskReferenceAttachments, setState } = props;
    ev.preventDefault();
    const fileWithSvgError = [];
    const fileList = ev.dataTransfer ? ev.dataTransfer.files : ev.target.files;
    const filess = Object.values(fileList);
    // eslint-disable-next-line no-restricted-syntax
    for (const [index, file] of filess.entries()) {
      // await waitFor(50);
      // eslint-disable-next-line no-await-in-loop
      const isSafeSvg = await isSvgContentSuspicious(file, window, t, false);
      if (!isSafeSvg) fileWithSvgError.push(file?.name);
      if (!file?.type?.includes(SVG_FORMAT) || isSafeSvg) {
      setFileUploadStatus(true);
      setPointerEvent(true);
      updatePostLoader(true);
      const { entityId } = store.getState().CreateTaskReducer;
      const fileData = {};
      fileData.file = file;
      const fileRefUUID = uuidv4();
      fileData.fileName = fileData.file.name;
      // eslint-disable-next-line no-await-in-loop
      await attachmentApiCallAndGenerateData(
        getSignedUrlApiThunk,
        dispatch,
        state,
        entityId,
        fileData.file,
        DOCUMENT_TYPES.TASK_REFERENCE_DOCUMENTS,
        ENTITY.TASK_METADATA,
        fileRefUUID,
        null,
        null,
        null,
        userProfileData,
        ref_uuid,
        setTaskReferenceAttachments,
        locationHistory,
        setState,
        files,
        t,
        setFileUploadStatus,
        index,
        filess?.length,
      );
      fileData.file_uuid = fileRefUUID;
    }
    if (index === filess.length - 1 && !isEmpty(fileWithSvgError)) showToastPopover(t('user_settings_strings.file_upload_failed'), `${t('user_settings_strings.suspicious_file_found')} in ${fileWithSvgError.join(', ')}.`, FORM_POPOVER_STATUS.SERVER_ERROR, true);
    setPointerEvent(false);
    updatePostLoader(false);
  }
  };

  const dragOverHandler = (ev) => {
    ev.preventDefault();
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

  const getFormBuilderView = () => {
    const {
      state,
    } = props;
    console.log('getSEctioncehck', state.sections, state.fields, state);
    return (
      <>
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <FormTitle type={FORM_TITLE_TYPES.TYPE_7} className={gClasses.MT15}>
            {t(TASK_STRINGS.TASK_SUB_TITLES.FORM_BUILDER.LABEL)}
          </FormTitle>
          <div
            className={cx(styles.RemoveForm, gClasses.CursorPointer, gClasses.ClickableElement, gClasses.MT5)}
            tabIndex={0}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onAddFormHandler()}
            role="button"
            onClick={removeFormBuilder}
          >
            {t(TASK_STRINGS.TASK_SUB_TITLES.REMOVE_FORM_BUILDER.LABEL)}
          </div>
        </div>
        {/* <Form
          onSectionTitleChangeHandler={onSectionTitleChangeHandler}
          sectionTitle={section_name}
          sectionTitleError={sectionTitleError}
          onSectionAddButtonClick={onSectionAddButtonClick}
          sections={sections}
          getNewInputId={onAddFormFieldHandler}
          onLabelChangeHandler={onLabelChangeHandler}
          onReferenceNameChangeHandler={onReferenceNameChangeHandler}
          onReferenceNameBlurHandler={onReferenceNameBlurHandler}
          onLabelBlurHandler={onLabelBlurHandler}
          onDefaultChangeHandler={onDefaultChangeHandler}
          onRequiredClickHandler={onRequiredClickHandler}
          onReadOnlyClickHandler={onReadOnlyClickHandler}
          onOtherConfigChangeHandler={onOtherConfigChangeHandler}
          // onOtherConfigBlurHandler={onOtherConfigBlurHandler}
          onValidationConfigChangeHandler={onValidationConfigChangeHandler}
          // onValidationConfigBlurHandler={onValidationConfigBlurHandler}
          error_list={error_list}
          datalist_selector_error_list={datalist_selector_error_list}
          server_error={server_error}
          onSaveFormField={onSaveFormField}
          deleteFormFieldHandler={deleteFormFieldHandler}
          onAddValues={onAddValues}
          onAddedSectionTitleChangeHandler={onAddedSectionTitleChangeHandler}
          onDeleteSectionHandler={onDeleteSectionHandler}
          onEditFieldClick={onEditFieldClick}
          hideFormBuilderTitle
          showOnlyNewFormFieldsDropdown
          onFieldDragEndHandler={onFieldDragEndHandler}
          onSectionDragEndHandler={onSectionDragEndHandler}
          onDefaultValueRuleHandler={onDefaultValueRuleHandler}
          onDefaultRuleOperatorDropdownHandler={
            onDefaultRuleOperatorDropdownHandler
          }
          onDefaultLValueRuleHandler={onDefaultLValueRuleHandler}
          onDefaultRValueRuleHandler={onDefaultRValueRuleHandler}
          onDefaultExtraOptionsRuleHandler={onDefaultExtraOptionsRuleHandler}
          onDefaultRuleOperatorInfoHandler={onDefaultRuleOperatorInfoHandler}
          taskId={jsUtils.get(task_details, ['_id'])}
          onTableNameChangeHandler={onTableNameChangeHandler}
          onTableNameBlurHandler={onTableNameBlurHandler}
          onTableReferenceNameChangeHandler={onTableReferenceNameChangeHandler}
          onFormFieldChangeHandler={onFormFieldChangeHandler}
          onFormFieldOpenAndCloseHandler={onFormFieldOpenAndCloseHandler}
          getVisibilityExternalFields={getVisibilityExternalFields}
          deleteFormFieldFromDependencyConfig={
            deleteFormFieldFromDependencyConfig
          }
          dependencyConfigCloseHandler={dependencyConfigCloseHandler}
          dependencyConfigData={formBuilderUtils.getDependencyConfigData(
            FORM_PARENT_MODULE_TYPES.TASK,
            state,
          )}
          addFormFieldsDropdownVisibilityData={
            addFormFieldsDropdownVisibilityData
          }
          setAddFormFieldsDropdownVisibility={(visibility) =>
            setState({ addFormFieldsDropdownVisibilityData: visibility })
          }
          setAdditionalErrorList={setAdditionalErrorList}
          lookupListDropdown={lookupDropdown}
          lookupLoadDataHandler={loadDataHandler}
          onLookupFieldChangeHandler={onLookupFieldChangeHandler}
          isFormDataLoading={state.isFormDataLoading}
          getRuleDetailsByIdInFieldVisibilityApi={
            getRuleDetailsByIdInFieldVisibilityApi
          }
          userDetails={userProfileData}
          onDefaultValueCalculationTypeHandler={onDefaultValueCalculationTypeHandler}
          onDefaultRuleAdvanceCodeInputHandler={onDefaultRuleAdvanceCodeInputHandler}
          onDefaultRuleAdvanceCodeErrortHandler={
            onDefaultRuleAdvanceCodeErrortHandler
          }
          disableDefaultValueConfig={isEmpty(jsUtils.get(state, ['form_details'], {}))}
          onSectionTitleBlurHandler={onSectionTitleBlurHandler}
          onUserSelectorDefaultValueChangeHandler={onUserSelectorDefaultValueChangeHandler}
        /> */}
        <Form
          moduleType={MODULE_TYPES.TASK}
          saveField={onSaveField}
          formType={FORM_TYPE.CREATION_FORM}
          metaData={{
            formUUID: state?.form_details?.form_uuid,
            moduleId: state?.task_details?._id,
          }}
          sections={state.sections || []}
          fields={state.fields}
          onFormConfigUpdate={updateSections}
          errorList={cloneDeep(state?.error_list)}
          showSectionName={state?.form_details?.show_section_name || false}
          userProfileData={userProfileData}
        />
      </>
    );
  };
  const getFormView = (isFormVisible, formBuilderView, addFormView) => {
    const { state } = props;
    let formView = null;
    if (isFormVisible) {
      formView =
        state?.sections?.length > 0 || state.isFormDataLoading
          ? formBuilderView
          : addFormView;
    } else {
      formView = addFormView;
    }
    return formView;
  };

  const errors = mergeObjects(error_list, server_error);
  const { nextButton, saveButton, cancelButton } = getTabElements();
  const addFormView = getAddFormView();
  const formBuilderView = getFormBuilderView();
  const formView = getFormView(!state.isFormDataLoading && isFormVisible, formBuilderView, addFormView);
  const breadcrumbList = getBreadcrumbList(locationHistory, isEditTask, t);

  return (
    <ModalLayout
      id="adhoc_create_task_modal"
      isModalOpen
      onCloseClick={onCloseIconClick}
      contentClass={cx(styles.ContentModal, gClasses.ModalContentClassWithoutPadding, gClasses.ZIndex6)}
      headerClassName={styles.ModalHeader}
      closeIconClass={styles.CloseIcon}
      headerContent={(
        <div className={cx(styles.Header, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER, BS.D_FLEX)}>
          <Breadcrumb list={breadcrumbList} />
        </div>
      )}
      mainContent={(
        <div className={cx(styles.Container, BS.JC_END)}>
          {props?.history?.location?.state?.mlAction && (
          <div className={cx(gClasses.CenterV, BS.W100, styles.WarnContainer, gClasses.MB4)}>
            <WarningNewIcon />
            <Text content={t('app_strings.search_warning')} className={cx(gClasses.FTwo13RedV27, gClasses.ML12)} fontClass={gClasses.FontWeight500} />
          </div>)}
          <div className={cx(styles.ContentContainer, gClasses.MB70)}>
            <BasicDetails
              teamOrUserSelectHandler={teamOrUserSelectHandler}
              assignees={assignees}
              member_team_search_value={member_team_search_value}
              setMemberOrTeamSearchValue={setMemberOrTeamSearchValue}
              teamOrUserRemoveHandler={teamOrUserRemoveHandler}
              error_list={error_list}
              onDueDateChangeHandler={onDueDateChangeHandler}
              dueDate={due_date}
              taskName={task_name}
              taskDescription={task_description}
              errors={errors}
              onChangeHandler={onTaskDetailsChangeHandler}
              onTaskNameBlurHandler={onTaskNameBlurHandler}
              taskType={is_assign_to_individual_assignees}
              onTaskTypeChangeHandler={onTaskTypeChangeHandler}
              setErrorMessage={setErrorMessage}
              isActive
              assigneeSuggestionData={{
                assigneeSuggestionList,
                isAssigneeSuggestionLoading,
              }}
            />
            {formView}
            <FileUploadDrop
              files={files}
              userDetails={userDetails}
              isLoading={state.isFormDataLoading}
              removeTaskReferenceDocument={removeTaskReferenceDocument}
              dropHandler={dropHandler}
              dragOverHandler={dragOverHandler}
            />
          </div>
        </div>
      )}
      footerContent={(
        <div className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
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
            <div className={gClasses.CenterV}>{nextButton}</div>
        </div>
        </div>
      )}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    state: state.CreateTaskReducer,
    sections: state.CreateTaskReducer.sections,
    error_list: state.CreateTaskReducer.error_list,
    datalist_selector_error_list: state.CreateTaskReducer.datalist_selector_error_list,
    addFormFieldsDropdownVisibilityData:
      state.CreateTaskReducer.addFormFieldsDropdownVisibilityData,
    lookUpListCurrentPage: state.LookUpReducer.lookUpListCurrentPage,
    lookUpListDataCountPerCall: state.LookUpReducer.lookUpListDataCountPerCall,
    lookUpList: state.LookUpReducer.lookUpList,
    lookupHasMore: state.LookUpReducer.hasMore,
    ref_uuid: state.CreateTaskReducer.ref_uuid,
    files: state.CreateTaskReducer.files,
    removed_doc_list: state.CreateTaskReducer.removed_doc_list,
    entityId: state.CreateTaskReducer.entityId,
    userId: state.RoleReducer.user_id,
    taskCreationUuid: state.CreateTaskReducer.task_creation_uuid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setState: (value) => dispatch(createTaskSetState(value)),
    setTaskReferenceAttachments: (files) => dispatch(setTaskReferenceDocuments(files)),
    clearState: () => {
      dispatch(createTaskClearState());
    },
    validateForm: (params) => {
      validateFormApiThunk(params);
    },
    publishTaskApiCall: (data, obj, onCloseIconClick, updateTOdoTask, mlUrlParam) => {
      dispatch(publishTaskApiThunk(data, obj, onCloseIconClick, updateTOdoTask, mlUrlParam));
    },
    deleteFormBuilder: (data) => {
      dispatch(deleteFormBuilderApiThunk(data));
    },
    deleteTaskApiCall: (data) => {
      dispatch(deleteTaskApiThunk(data));
    },
    getTaskMetadataApi: (value, setAttachment) => {
      dispatch(getTaskMetadataApiThunk(value, setAttachment));
    },
    getTaskAssigneeSuggestionApi: (obj) =>
      dispatch(getTaskAssigneeSuggestionApiThunk(obj)),
    saveFormApiCall: (...params) => dispatch(saveFormApiThunk(...params)),
    saveFieldApiCall: (...params) => dispatch(saveFieldApiThunk(...params)),
    saveTableApiCall: (...params) => dispatch(saveTableApiThunk(...params)),
    deleteFormFieldOrFieldListApi: (...params) =>
      dispatch(deleteFormFieldOrFieldListApiAction(...params)),
    checkDependencyAndDeleteFieldApi: (...params) =>
      dispatch(checkDependencyAndDeleteFieldApiAction(...params)),
    setFormVisibility: (value) => dispatch(setFormVisibilityAction(value)),
    deleteFormApiCall: (value) => dispatch(deleteFormPostApiAction(value)),
    getVisibilityExternalFields: (...params) =>
      dispatch(visibilityExternalFieldsThunk(...params)),
    setField: (...params) => dispatch(setFieldData(...params)),
    openFieldConfigAction: (sectionIndex, fieldListIndex, fieldIndex) =>
      dispatch(openFieldConfig(sectionIndex, fieldListIndex, fieldIndex)),
    setEntireField: (...params) => dispatch(setEntireField(...params)),
    setFieldList: (...params) => dispatch(setFieldListData(...params)),
    setFieldListValidation: (...params) => dispatch(setFieldListValidation(...params)),
    setSection: (...params) => dispatch(setSectionDataAction(...params)),
    setErrorList: (errorList) => dispatch(setErrorListData(errorList)),
    setDataListSelectorErrorList: (errorList) => dispatch(setDataListSelectorErrorListData(errorList)),
    setAdditionalErrorList: (errorList) =>
      dispatch(setAdditionalErrorListData(errorList)),
    setDefaultRuleValue: (
      id,
      value,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      toggle,
      isInitial,
    ) => dispatch(
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
    checkDependencyAndDeleteSectionApi: (...params) =>
      dispatch(checkDependencyAndDeleteSectionApiAction(...params)),
    getFormDetailsByTaskMetadataId: (metadataId) =>
      dispatch(getFormDetailsByTaskMetadataIdThunk(metadataId)),
    fieldAutoCompleteApi: (firstWord) =>
      dispatch(fieldAutoCompleteApiThunk(firstWord)),
    onGetLookupList: (params, isPaginatedData, isSearch) =>
      dispatch(getLookupListApiThunk(params, isPaginatedData, isSearch)),
    updateTodoTaskApi: (data, type) =>
      dispatch(getActiveTaskListDataThunk(data, type)),
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
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Task, 20),
);

Task.defaultProps = {
  error_list: {},
  history: {},
  member_team_search_value: EMPTY_STRING,
  sections: [],
};
Task.propTypes = {
  state: PropTypes.objectOf(PropTypes.any).isRequired,
  setState: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
  publishTaskApiCall: PropTypes.func.isRequired,
  deleteTaskApiCall: PropTypes.func.isRequired,
  saveFormApiCall: PropTypes.func.isRequired,
  setFormVisibility: PropTypes.func.isRequired,
  setField: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  error_list: PropTypes.objectOf(PropTypes.any),
  history: PropTypes.objectOf(PropTypes.any),
  member_team_search_value: PropTypes.string,
  setSection: PropTypes.func.isRequired,
  setErrorList: PropTypes.func.isRequired,
  sections: PropTypes.arrayOf(PropTypes.any),
};
