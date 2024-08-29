import React, { useContext, useEffect, useRef, useState } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ETabVariation, WorkHallPageLoader } from '@workhall-pvt-lmt/wh-ui-library';
import { v4 as uuidv4 } from 'uuid';
import {
  cloneDeep,
  get,
  isEmpty,
  set,
  unset,
} from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import {
  updateFlowDataChange,
  updateFlowStateChange,
} from 'redux/reducer/EditFlowReducer';
import { updatePostLoader, validate } from 'utils/UtilityFunctions';
import { BS } from 'utils/UIConstants';
import { useHistory } from 'react-router-dom';
import AdditionalConfiguration from './configurations/AdditionalConfiguration';
import styles from './StepConfiguration.module.scss';
import {
  STEP_ACTION_VALUE,
  constructDueDateData,
  getBasicDetailSaveStepPostData,
  getStepConfigSecondaryActionMenu,
  getValidationDataForAdditionalConfig,
  getStepOrderData,
} from './StepConfiguration.utils';
import {
  setAssigneeAdditionalDetailsSchema,
  validateAdditionalConfigSchema,
} from './StepConfiguration.validations';
import Form from '../../form/Form';
import Header from '../../../components/header_and_body_layout/Header';
import { EDIT_FLOW_STEP_TABS, FLOW_HEADER_TAB_OPTIONS } from '../../application/app_components/dashboard/flow/Flow.utils';
import { MODULE_TYPES } from '../../../utils/Constants';
import { FIELD_ACTION_TYPE, FORM_TYPE } from '../../form/Form.string';
import SetAssignee from './set_assignee/SetAssignee';
import { getParentNodeUuidFromTree, getSectionAndFieldsFromResponse, getSectionFieldsFromLayout } from '../../form/sections/form_layout/FormLayout.utils';
import FormHeader from '../../form/form_builder/form_header/FormHeader';
import FormFooter from '../../form/form_builder/form_footer/FormFooter';
import { saveField, validateFormApi } from '../../../axios/apiService/createTask.apiService';
import { getFormDetailsApi, saveTable } from '../../../axios/apiService/form.apiService';
import { normalizer } from '../../../utils/normalizer.utils';
import { REQUEST_SAVE_FORM } from '../../../utils/constants/form/form.constant';
import { FOOTER_PARAMS_ID, FOOTER_PARAMS_POST_DATA_ID } from '../../form/form_builder/form_footer/FormFooter.constant';
import { getUserProfileData, isBasicUserMode, setPointerEvent, setUserProfileData } from '../../../utils/UtilityFunctions';
import { getAccountConfigurationDetailsApiService } from '../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { constructJoiObject } from '../../../utils/ValidationConstants';
import { formatValidationMessages } from '../../task/task/Task.utils';
import { layoutSectionSchema } from '../../../validation/form/form.validation.schema';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { FormHeaderConfigurationSchema } from '../../form/form_builder/form_header/form_header_configuration/FormHeader.schema';
import { validateActions } from '../../form/form_builder/form_footer/FormFooter.utils';
import {
  getUserStepDetailsApiThunk,
  saveStepAPIThunk,
} from '../../../redux/actions/FlowStepConfiguration.Action';
import { VALIDATION_CONSTANT } from '../../../utils/constants/validation.constant';
import { clearStepDetailError, displayErrorToast } from '../../../utils/flowErrorUtils';
import { FLOW_STRINGS } from '../EditFlow.strings';
import jsUtility, { has, isBoolean } from '../../../utils/jsUtility';
import RightArrowSeperatorIcon from '../../../assets/icons/flow/step_configuration/RightArrowSeperatorIcon';
import EditStepDetails from './edit_step_details/EditStepDetails';
import { TASK_CATEGORY_FLOW_TASK } from '../../../utils/taskContentUtils';
import { ASSIGNEES_FLOW_SYSTEM_FIELDS, ASSIGNEES_STEP_SYSTEM_FIELDS } from '../node_configuration/NodeConfiguration.constants';
import { getSystemFieldsList, validateAssigneesData } from '../node_configuration/NodeConfiguration.utils';
import { USER_STEP_ASSIGNEE_OBJECT_KEYS } from './set_assignee/SetAssignee.utils';
import { updateSomeoneIsEditingPopover } from '../EditFlow.utils';
import { SOMEONE_EDITING } from '../../../utils/ServerValidationUtils';
import ThemeContext from '../../../hoc/ThemeContext';
import { updateStepOrderApiThunk } from '../../../redux/actions/EditFlow.Action';

function StepConfiguration(props) {
  const { t } = useTranslation();
  const {
    stepDetails = {},
    flow_data,
    flow_data: { flow_name },
    saveStepAPI,
    updateFlowState,
    isStepInfoVisible,
    isNavOpen,
    isLoadingStepDetails,
    stepId,
    getFlowStepDetailsApi,
    steps = [],
    addNewNode,
    allSystemFields,
    parentFlowName,
  } = props;
  console.log('activeStepDetails', stepDetails, 'StepConfiguration_props', props, 'flow_data', flow_data);
  const scrollRef = useRef();
  const history = useHistory();
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const isBasicUser = isBasicUserMode(history);
  const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
  const [formData, setFormData] = useState({ sections: [], formUUID: '', fields: {}, actions: [], loading: true });
  const [formErrorList, setFormErrorList] = useState({});
  const [isStepDetailsOpen, setStepDetailsOpen] = useState(false);
  const [errorTabList] = useState([]);
  const flowData = cloneDeep(flow_data);
  const flowName = jsUtility.truncate(flow_name, { length: 25 });
  const assigneeSystemFields = getSystemFieldsList({
    allSystemFields,
    allowedSystemFields: ASSIGNEES_FLOW_SYSTEM_FIELDS,
    steps,
    allowedStepSystemFields: ASSIGNEES_STEP_SYSTEM_FIELDS,
    ignoreStep: stepDetails.step_uuid,
  });

  const metaData = {
    formUUID: formData.formUUID,
    moduleId: flowData.flow_id,
    moduleUUID: flowData.flow_uuid,
    stepId: stepDetails._id,
    stepUUID: stepDetails.step_uuid,
    isInitiation: stepDetails.is_subsequent_step && stepDetails.step_type === 'user_step',
  };

  const getFormDetails = (stepDetails) => {
    getFormDetailsApi({ step_id: stepDetails?._id })
    .then((data) => {
      const { sections, fields } = getSectionAndFieldsFromResponse(data.sections || []);
      const actions = (stepDetails.actions || []).map((action) =>
        normalizer(action, FOOTER_PARAMS_POST_DATA_ID, FOOTER_PARAMS_ID),
      );
      const _formData = {
        sections,
        fields,
        formUUID: data.form_uuid,
        actions,
        title: stepDetails.title || '',
        description: stepDetails.description || '',
        loading: false,
        showSectionName: data?.show_section_name || false,
      };
      setFormData(_formData);
    })
    .catch((err) => {
      console.log('xyz err', err);
      setFormData((p) => { return { ...p, loading: false }; });
    });
  };

  const onUserStepClick = async (label) => {
    const { steps = [] } = cloneDeep(flowData);
    const currentStepIndex = steps.findIndex((eachStep) => eachStep._id === stepId);
    let activeStepDetails = cloneDeep(steps[currentStepIndex]);
    activeStepDetails.progress = 0;
    if (label) {
      activeStepDetails.step_name = label;
    } else {
      const stepDetailsResponse = await getFlowStepDetailsApi({
        stepId: activeStepDetails._id,
        label,
        step_type: activeStepDetails.step_type,
      }, t, assigneeSystemFields);
      if (!isEmpty(stepDetailsResponse)) {
        activeStepDetails = {
          ...stepDetailsResponse,
          step_name: stepDetailsResponse.step_name || label,
          progress: EDIT_FLOW_STEP_TABS.CREATE_FORM,
          isLoadingStepDetails: false,
        };
      }
      getFormDetails(activeStepDetails);
    }
    updateFlowState({
      activeStepDetails,
      isLoadingStepDetails: false,
    });
  };

  useEffect(() => {
    if (stepId) {
      setFormData((p) => { return { ...p, loading: true }; });
      getAccountConfigurationDetailsApiService().then(setUserProfileData);
      onUserStepClick();
    }
  }, [stepId]);

  useEffect(() => {
    if (scrollRef?.current) {
      // scroll to top for the each progress change
      scrollRef.current.scrollTo({ behavior: 'smooth', top: 0 });
    }
  }, [stepDetails?.progress]);

  const validateFormDetails = (updatedSections = []) => {
    const { sections } = formData;
    const sectionsData = !isEmpty(updatedSections) ? cloneDeep(updatedSections) : cloneDeep(sections);
    const flattenedSectionWithFields = [];
        (sectionsData || []).forEach((eachSection) => {
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
    const errorList = formatValidationMessages(validate(
      { sections: flattenedSectionWithFields },
      constructJoiObject({ sections: layoutSectionSchema(t) }),
    ), cloneDeep(flattenedSectionWithFields)) || [];
    return errorList;
  };

  const validatePostSaveField = (sectionData, sectionUUID) => {
    const error_list = cloneDeep(formErrorList);
    const sections = cloneDeep(formData.sections);
    const sectionIndex = sections.findIndex((eachSection) => eachSection.section_uuid === sectionUUID);
    const error = validateFormDetails(cloneDeep([{
      ...get(sections, [sectionIndex], {}),
      ...(sectionData || {}),
    }]));
    Object.keys(error_list)?.forEach((key) => {
      if (key.includes(sectionUUID)) delete error_list[key];
    });
    Object.keys(error)?.forEach((key) => {
      if (key.includes(sectionUUID)) delete error[key];
    });
    setFormErrorList({ ...error_list, ...error });
  };

  const updateSections = (sections, validateSection = false, sectionUUID = EMPTY_STRING, fields = {}) => {
    let error_list = cloneDeep(formErrorList);
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
            error = validateFormDetails([cloneDeep(get(sections, [sectionIndex], {}))]);
          }
        }
      } else {
        error = validateFormDetails(cloneDeep(sections));
        error_list = {};
      }
    }
    const updatedFormData = { sections };
    if (!isEmpty(fields)) updatedFormData.fields = fields;
    setFormData((p) => { return { ...p, ...updatedFormData }; });
    setFormErrorList({ ...error_list, ...error });
  };

  const updateActions = (actions, options) => {
    setFormData((p) => { return { ...p, actions }; });
    const errorList = cloneDeep(formErrorList);
    const normalizedActions = (actions || []).map((a) =>
      normalizer(a, FOOTER_PARAMS_ID, FOOTER_PARAMS_POST_DATA_ID),
    );
    // update actions in activeStepDetails
    const activeStepDetails = cloneDeep(stepDetails);
    activeStepDetails.actions = normalizedActions;

    // update actions in steps[]
    const clonedFlowData = cloneDeep(flowData);
    const stepIndex = clonedFlowData?.steps.findIndex((eachStep) => eachStep._id === stepId);
    set(clonedFlowData, ['steps', stepIndex, 'actions'], normalizedActions);
    const { addedAction, updatedAction, deletedAction, removedSystemEnds, connectedSteps, coordinateInfo } = options;
    // if an Action is added/updated/deleted then, update connectedSteps from save action response in activeStepDetails and steps[]
    if (addedAction || updatedAction || deletedAction) {
      activeStepDetails.connected_steps = cloneDeep(connectedSteps);
      if (deletedAction) {
        clonedFlowData.steps[stepIndex].connected_steps = connectedSteps;
      }
    }
    if (!isEmpty(coordinateInfo)) {
      activeStepDetails.coordinate_info = coordinateInfo;
    }
    if (!isEmpty(removedSystemEnds)) {
      // if an Action is deleted then, calculate connected_steps with the remaining actions;
      clonedFlowData.steps = clonedFlowData.steps.filter?.((s) => !removedSystemEnds.includes(s.step_uuid));
      if (clonedFlowData.steps.length > 0) {
        clonedFlowData.steps.forEach((step, stepIndex) => {
          const { connected_steps } = step;
          const connectedStepIndex = connected_steps && connected_steps.findIndex((connectedStep) => removedSystemEnds.includes(connectedStep.destination_step));
          if (connectedStepIndex > -1) {
            connected_steps.splice(connectedStepIndex, 1);
            clonedFlowData.steps[stepIndex].connected_steps = connected_steps;
          }
        });
        const { updateStepOrderApi } = props;
        // As system ends have been removed, update step orders
        const stepOrderPostData = getStepOrderData(cloneDeep(clonedFlowData));
        stepOrderPostData.step_details?.forEach((stepOrder) => {
          const stepIndex = clonedFlowData?.steps?.findIndex((step) => step._id === stepOrder.step_id);
          if (stepIndex > -1) {
            clonedFlowData.steps[stepIndex].step_order = stepOrder.step_order;
          }
        });
        updateStepOrderApi(
          stepOrderPostData,
        );
      }
    }

    if (actions?.length > 0) {
      delete errorList.add_actions;
    }

    updateFlowState({ activeStepDetails, flowData: clonedFlowData });
    setFormErrorList(errorList);
  };

  const updateFormHeader = (headerData) => {
    setFormData((p) => { return { ...p, ...headerData }; });
    if (headerData.title) {
      const error_list = cloneDeep(formErrorList);
      delete error_list.form_title;
      setFormErrorList({ ...error_list });
    }
  };

  const saveFieldHandler = (data, path, sectionUUID, sectionData, onSuccess, onError) => {
    if (sectionData) {
      const { parentNodeUuid, fieldOrder } = getParentNodeUuidFromTree(sectionData, path);
      const fieldNodeUuid = data?.node_uuid || uuidv4();
      const postData = {
        ...data,
        step_id: stepDetails?._id,
        flow_id: flowData?.flow_id,
        form_uuid: formData.formUUID,
        node_uuid: fieldNodeUuid,
        parent_node_uuid: parentNodeUuid,
        section_uuid: sectionUUID,
        is_field_show_when_rule: data.is_field_show_when_rule || false,
        is_save: false,
        order: fieldOrder,
        validations: data.validations || {},
      };
      saveField(postData).then((res) => {
        onSuccess?.(res, fieldNodeUuid, validatePostSaveField);
      }).catch((err) => {
        onError?.(err);
        console.log('xyz saveField error !', err);
      });
    }
  };

  const saveTableHandler = (data, path, sectionUUID, sectionData, onSuccess, onError) => {
    const metadata = {
      step_id: stepDetails?._id,
      flow_id: flowData?.flow_id,
      form_uuid: formData?.formUUID,
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

  const validateSetAssigneePage = () => {
    const additionalError = validate(
      { due_data: constructDueDateData(stepDetails.due_data, stepDetails.step_status) },
      setAssigneeAdditionalDetailsSchema(t),
    );
    const { errorList: assigneesErrorList } = validateAssigneesData(stepDetails.step_assignees, USER_STEP_ASSIGNEE_OBJECT_KEYS, true, t);
    return {
      additionalError,
      assigneesErrorList,
    };
  };

  const onNextClick = async ({
    isSaveAndClose,
    currentTabIndex = stepDetails.progress,
    // goToLastStep = false,
    isValidatingMoreThanOneTab = false,
    updatedStepDetails = stepDetails,
    validateStep = false,
  }) => {
    let saveStepData = {};
    const activeStepDetails = cloneDeep(updatedStepDetails);
    let errorList = {};
    let isValidationPassed = false;
    let isErrorInForms = false;
    switch (currentTabIndex) {
      case EDIT_FLOW_STEP_TABS.CREATE_FORM:
        const headerData = {
          form_title: formData.title ? formData.title.trim() : '',
          form_description: formData.description ? formData.description.trim() : '',
        };
        const headerErrors = validate(headerData, FormHeaderConfigurationSchema(t));
        const formErrors = validateFormDetails();
        const actionErrors = validateActions(formData.actions, t);
        const errors = { ...formErrors, ...headerErrors, ...actionErrors };
        setFormErrorList(errors);
        if (isEmpty(errors)) {
          isValidationPassed = true;
        }
        if (!isEmpty(headerErrors) || !isEmpty(formErrors)) {
          isErrorInForms = true;
        }
        break;
      case EDIT_FLOW_STEP_TABS.SET_ASSIGNEE: // valdiate  assignee, due date, escalation
        if (isSaveAndClose && !validateStep) {
          isValidationPassed = true;
        } else {
          const setAssigneeErrors = validateSetAssigneePage();
          const { additionalError, assigneesErrorList } = setAssigneeErrors;
          if (isEmpty(additionalError) && isEmpty(assigneesErrorList)) {
            isValidationPassed = true;
          }
          set(activeStepDetails, 'error_list', additionalError);
          set(activeStepDetails, `${USER_STEP_ASSIGNEE_OBJECT_KEYS.parentKey}ErrorList`, assigneesErrorList);
        }
        break;
      case EDIT_FLOW_STEP_TABS.ADD_ON_CONFIGURATION:
        errorList = validate(
          getValidationDataForAdditionalConfig(stepDetails),
          validateAdditionalConfigSchema(t),
        );
        if (isEmpty(errorList)) {
          isValidationPassed = true;
        }
        set(activeStepDetails, 'error_list', errorList);
        break;
      default:
        break;
    }
    if (isValidationPassed) {
      if (currentTabIndex === EDIT_FLOW_STEP_TABS.CREATE_FORM) {
        const params = { flow_id: metaData.moduleId, step_id: metaData.stepId };
        const { sections } = formData;
        try {
          const data = await validateFormApi(params);
          console.log('xyz res', data);
          const serverErrors = {};
          if (!isBoolean(data)) {
            data?.forEach((eachError) => {
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
            setFormErrorList((p) => { return { ...p, ...serverErrors }; });
            if (!isEmpty(serverErrors)) {
              displayErrorToast({
                title: t('validation_constants.server_error_constant.error_in_form_field_configuration'),
                subtitle: t('error_popover_status.correct_the_validation_and_proceed'),
              });
            }
          } else {
            const { clearStepDetailError } = props;
            clearStepDetailError(stepId, t(VALIDATION_CONSTANT.ERROR_IN_FORM_CONFIG));
          set(activeStepDetails, 'progress', EDIT_FLOW_STEP_TABS.SET_ASSIGNEE);
          if (activeStepDetails.savedProgress < EDIT_FLOW_STEP_TABS.SET_ASSIGNEE) {
            activeStepDetails.savedProgress = EDIT_FLOW_STEP_TABS.CREATE_FORM;
          }
          const updatedFlowData = cloneDeep(flowData);
          const stepIndex = updatedFlowData?.steps?.findIndex((step) => step._id === activeStepDetails._id);
          if (stepIndex > -1) {
            set(updatedFlowData, ['steps', stepIndex], activeStepDetails);
          }
          if (!isValidatingMoreThanOneTab) {
          if (isSaveAndClose) {
            updateFlowState({
              activeStepDetails: {},
              isNodeConfigOpen: false,
              selectedStepType: null,
              activeStepId: null,
              savingStepData: false,
              flowData: updatedFlowData,
            });
          } else {
            if (activeStepDetails.savedProgress >= EDIT_FLOW_STEP_TABS.SET_ASSIGNEE) {
              saveStepData = getBasicDetailSaveStepPostData(
                activeStepDetails,
                flowData,
              );
              try {
                await saveStepAPI({
                  postData: saveStepData,
                  nextTabIndex: currentTabIndex + 1,
                  isSaveAndClose,
                  dontUpdateData: isValidatingMoreThanOneTab,
                  activeStepDetails,
                  validateCurrentTab: validateStep || !isSaveAndClose,
                  updatedFlowData,
                });
              } catch (e) {
                console.log(e);
              }
            } else {
              updateFlowState({ activeStepDetails, flowData: updatedFlowData });
            }
          }
          }
        }
        } catch (res) {
          console.error('xyz error validateFormApi', res);
          const errors = {};
          const errorData = get(res, ['errors'], []);
          if (errorData?.[0]?.type === SOMEONE_EDITING) {
            updateSomeoneIsEditingPopover(errorData?.[0]?.message);
          } else {
            res?.errors?.forEach((eachError) => {
                errors[eachError.field] = eachError.field;
            });
          }
          setFormErrorList((p) => { return { ...p, ...errors }; });
          displayErrorToast({ title: t('server_error_code_string.somthing_went_wrong') });
          if (validateStep || !isSaveAndClose) {
            return null;
          }
        }
      } else {
      saveStepData = getBasicDetailSaveStepPostData(
        activeStepDetails,
        flowData,
      );
        try {
          await saveStepAPI({
            postData: saveStepData,
            nextTabIndex: currentTabIndex + 1,
            isSaveAndClose,
            dontUpdateData: isValidatingMoreThanOneTab,
            activeStepDetails,
            validateCurrentTab: validateStep || !isSaveAndClose,
          });
        } catch (e) {
          console.log(e);
        }
    }
      // make save API call and if it is success update progress
      if (isValidatingMoreThanOneTab) {
        return onNextClick({
          currentTabIndex: currentTabIndex + 1,
          isValidatingMoreThanOneTab: false,
          updatedStepDetails: activeStepDetails,
        });
      }
    } else {
      if (currentTabIndex === EDIT_FLOW_STEP_TABS.CREATE_FORM) {
        if (isErrorInForms) displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.FORM_CONFIGURATION_VALIDATION);
      } else displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.STEP_CONFIGURATION_VALIDATION(t));
      set(activeStepDetails, 'progress', currentTabIndex);
      setPointerEvent(false);
      updatePostLoader(false);
      return updateFlowState({ activeStepDetails });
    }
    return null;
  };

  const onCancelClick = () => {
    updateFlowState({
      isEditFlowView: false,
      activeStepDetails: {},
      selectedStepType: null,
      activeStepId: null,
      isNodeConfigOpen: false,
    });
  };

  const saveStepHandler = () => {
    onNextClick({
      isSaveAndClose: true,
      validateStep: true,
    });
  };

  const saveStepBasicDetails = async (updatedData = {}) => {
    const activeStepDetails = cloneDeep(stepDetails);
    const mergedData = { ...activeStepDetails, ...updatedData };
    const saveStepData = getBasicDetailSaveStepPostData(
      mergedData,
      flowData,
    );
    try {
      const isSuccess = await saveStepAPI({
        postData: saveStepData,
      });
      return isSuccess;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const setAssigneeData = (data) => {
    const activeStepDetails = cloneDeep(stepDetails);
    set(activeStepDetails, USER_STEP_ASSIGNEE_OBJECT_KEYS.parentKey, data);
    if (!isEmpty(activeStepDetails?.[`${USER_STEP_ASSIGNEE_OBJECT_KEYS.parentKey}ErrorList`])) {
      const { errorList: assigneesErrorList } = validateAssigneesData(data, USER_STEP_ASSIGNEE_OBJECT_KEYS, true, t);
      set(activeStepDetails, `${USER_STEP_ASSIGNEE_OBJECT_KEYS.parentKey}ErrorList`, assigneesErrorList);
    }
    updateFlowState({ activeStepDetails });
  };

  const onFlowTabChange = async (nextTabIndex) => {
    const activeStepDetails = cloneDeep(stepDetails);
    const currentTabIndex = stepDetails.progress;
    if (nextTabIndex === currentTabIndex) return null;
    if (nextTabIndex < currentTabIndex) {
      if (currentTabIndex === EDIT_FLOW_STEP_TABS.ADD_ON_CONFIGURATION) {
        set(activeStepDetails, ['progress'], nextTabIndex);
        const errorList = cloneDeep(activeStepDetails.error_list);
        unset(errorList, 'email_actions');
        unset(errorList, 'document_generation');
        unset(errorList, 'data_list_mapping');
        activeStepDetails.error_list = errorList;
        const additionalConfiguration = cloneDeep(get(activeStepDetails, ['additional_configuration'], {}));
        set(flowData, ['error_list'], errorList);
        if (isEmpty(activeStepDetails?.email_actions)) {
          set(additionalConfiguration, ['send_email_condition'], false);
        }
        if (isEmpty(activeStepDetails?.data_list_mapping)) {
          set(additionalConfiguration, ['send_data_to_datalist_condition'], false);
        }
        if (isEmpty(activeStepDetails?.document_generation)) {
          set(additionalConfiguration, ['document_generation_condition'], false);
        }
        set(activeStepDetails, ['additional_configuration'], additionalConfiguration);
        updateFlowState({ activeStepDetails });
      }
      if (currentTabIndex === EDIT_FLOW_STEP_TABS.SET_ASSIGNEE) {
        let isValidationPassed = false;
        const setAssigneeErrors = validateSetAssigneePage();
        const { additionalError, assigneesErrorList } = setAssigneeErrors;
        if (isEmpty(additionalError) && isEmpty(assigneesErrorList)) {
          isValidationPassed = true;
        }
        set(activeStepDetails, 'error_list', additionalError);
        set(activeStepDetails, `${USER_STEP_ASSIGNEE_OBJECT_KEYS.parentKey}ErrorList`, assigneesErrorList);
        if (isValidationPassed) {
          const isSuccess = await saveStepBasicDetails({});
          if (isSuccess) {
            set(activeStepDetails, ['progress'], nextTabIndex);
            updateFlowState({ activeStepDetails });
          }
        } else {
          updateFlowState({ activeStepDetails });
        }
      }
    } else {
      const tabsToBePassed = nextTabIndex - currentTabIndex;
      if (tabsToBePassed === 1) {
        onNextClick({});
      } else {
        onNextClick({
          isValidatingMoreThanOneTab: true,
        });
      }
    }
    return null;
  };

  let currentComponent = null;
  let componentClass = null;
  const { isTrialDisplayed } = props;
  switch (stepDetails.progress) {
    case EDIT_FLOW_STEP_TABS.CREATE_FORM:
      const headerData = {
        title: formData.title,
        description: formData.description,
      };
      if (formData.loading) {
        currentComponent = <WorkHallPageLoader color={colorSchema?.activeColor && colorSchema?.activeColor} className={gClasses.H100} />;
        break;
      }
      currentComponent =
        formData.sections.length !== 0 ? (
          <Form
            moduleType={MODULE_TYPES.FLOW}
            saveField={onSaveField}
            formType={FORM_TYPE.CREATION_FORM}
            metaData={{ ...metaData, taskCategory: TASK_CATEGORY_FLOW_TASK }}
            sections={formData.sections}
            onFormConfigUpdate={updateSections}
            errorList={cloneDeep(formErrorList)}
            fields={formData.fields}
            showSectionName={formData?.showSectionName || false}
            userProfileData={getUserProfileData()}
            getFormHeader={() => (
              <FormHeader
                errorList={formErrorList}
                metaData={metaData}
                headerData={headerData}
                onHeaderUpdate={updateFormHeader}
                stepDetails={stepDetails}
              />
            )}
            getFormFooter={() => (
              <FormFooter
                metaData={metaData}
                actions={formData.actions}
                stepList={[]}
                errorList={formErrorList}
                stepDetails={stepDetails}
                onCreateStep={() => {}}
                onFormActionUpdate={updateActions}
                flowData={flowData}
                addNewNode={addNewNode}
              />
            )}
          />
        ) : null;
      break;
    case EDIT_FLOW_STEP_TABS.SET_ASSIGNEE:
      currentComponent = (
        <SetAssignee
          metadata={{
            flowId: flowData.flow_id,
            stepUUID: stepDetails.step_uuid,
            formUUID: formData.formUUID,
          }}
          assigneeSystemFields={assigneeSystemFields}
          allSystemFields={allSystemFields}
          stepDetails={stepDetails}
          setAssigneeData={setAssigneeData}
          isNavOpen={isNavOpen}
        />
      );
      componentClass = gClasses.OverflowYAutoImportant;
      break;
    case EDIT_FLOW_STEP_TABS.ADD_ON_CONFIGURATION:
      currentComponent = (
        <AdditionalConfiguration
          stepData={stepDetails}
          onFlowStateChange={updateFlowState}
          steps={steps}
          allSystemFields={allSystemFields}
          metaData={{
            flowId: flowData.flow_id,
            ...metaData,
          }}
        />
      );
      break;
    default:
      currentComponent = <WorkHallPageLoader color={colorSchema?.activeColor && colorSchema?.activeColor} className={gClasses.H100} />;
      break;
  }

  const onCloseStepDetails = () => {
    setStepDetailsOpen(false);
  };

  const saveStepNameAndDesc = async (updatedData) => {
    const isSuccess = await saveStepBasicDetails(updatedData);
    if (isSuccess) {
      const clonedFlowData = cloneDeep(flow_data);
      const activeStepDetails = cloneDeep(stepDetails);
      const mergedData = { ...activeStepDetails, ...updatedData };
      const stepIndex = clonedFlowData?.steps?.findIndex((step) => step._id === activeStepDetails._id);
      if (stepIndex > -1) {
        set(clonedFlowData, ['steps', stepIndex], mergedData);
      }
      updateFlowState({ activeStepDetails: mergedData, flowData: clonedFlowData });
      onCloseStepDetails();
    }
  };

  const handleSaveAndClose = async () => {
    const isSuccess = await saveStepBasicDetails({}, true);
    if (isSuccess) {
      updateFlowState({
        activeStepDetails: {},
        selectedStepType: null,
        activeStepId: null,
        isNodeConfigOpen: false,
      });
    }
  };

  const handleSecondaryActionChange = (selectedAction) => {
    switch (selectedAction) {
      case STEP_ACTION_VALUE.DELETE_STEP:
        const { onDeleteStepClick } = props;
        onDeleteStepClick(stepId);
        break;
      case STEP_ACTION_VALUE.EDIT_NAME_DETAILS:
        setStepDetailsOpen(true);
        break;
      default:
        break;
    }
  };

  const secondaryProps = {
    displaySecondaryActions: true,
    subMenuList: getStepConfigSecondaryActionMenu(t),
    primaryCTALabel: FLOW_STRINGS.ACTION_BUTTONS.SAVE_STEP,
    primaryCTAClicked: saveStepHandler,
    secondaryCTALabel: FLOW_STRINGS.ACTION_BUTTONS.CANCEL,
    secondaryCTAClicked: onCancelClick,
    subMenuItemClicked: handleSecondaryActionChange,
    tertiaryCTALabel: FLOW_STRINGS.ACTION_BUTTONS.SAVE_AND_CLOSE,
    tertiaryCTAClicked: handleSaveAndClose,
  };

  const stepName = stepDetails.step_name;

  const stepDetailsModal = isStepDetailsOpen && (
    <EditStepDetails
      isModalOpen
      stepDetails={stepDetails}
      onCloseStepDetails={onCloseStepDetails}
      saveStepBasicDetails={saveStepNameAndDesc}
    />
  );

  return (
  <>
    <div className={cx(styles.ConfigContainer, BS.W100, isTrialDisplayed && styles.TrialHeight)}>
      <div
        className={cx(
          styles.CreationContainer,
          gClasses.DisplayFlex,
          gClasses.FlexDirectionColumn,
          !isStepInfoVisible && styles.maxWidth,
        )}
      >
        <div>
          <Header
            pageTitle={parentFlowName}
            sourceName={flowName}
            fieldLabel={t(FLOW_STRINGS.CONFIGURE_STEP)}
            headerLabelClass={styles.HeaderLabel}
            fieldValue={stepName}
            tertiaryBtnClass={styles.SaveCloseBtn}
            SeparatorIcon={RightArrowSeperatorIcon}
            tabDisplayCount={3}
            tabOptions={FLOW_HEADER_TAB_OPTIONS(t)}
            primaryBtnClass={styles.SaveCloseBtn}
            secondaryBtnClass={styles.CancelBtn}
            innerTabClass={cx(
              styles.EditHeaderTab,
            )}
            tabIconClassName={styles.EditHeaderIconClass}
            errorTabList={errorTabList}
            primaryButtonDisabled={stepDetails.savedProgress < 1}
            selectedTabIndex={stepDetails.progress}
            variation={ETabVariation.stepper}
            onTabItemClick={onFlowTabChange}
            bottomSelectionClass={isNavOpen ? styles.TabNavOpen : styles.ActiveTab}
            textClass={styles.TabText}
            fieldClassName={gClasses.PL15}
            subMenuClassName={gClasses.MR2}
            completedTab={stepDetails.savedProgress}
            className={styles.TabWidth}
            {...secondaryProps}
            isLoading={isLoadingStepDetails || formData?.loading}
          />
        </div>
        <div
          ref={scrollRef}
          className={cx(styles.ComponentContainer, componentClass)}
        >
          {currentComponent}
        </div>
      </div>
    </div>
    {stepDetailsModal}
  </>
  );
}
const mapStateToProps = ({
  EditFlowReducer,
  RoleReducer,
  CreateTaskReducer,
  NavBarReducer,
}) => {
  return {
    isLoadingStepDetails: EditFlowReducer.isLoadingStepDetails,
    server_error: EditFlowReducer.server_error,
    flow_data: EditFlowReducer.flowData,
    isNavOpen: NavBarReducer.isNavOpen,
    isStepInfoVisible: EditFlowReducer.isStepInfoVisible,
    userId: RoleReducer.user_id,
    createTaskState: CreateTaskReducer,
    isTrialDisplayed: NavBarReducer.isTrialDisplayed,
    detailedFlowErrorInfo: EditFlowReducer.detailedFlowErrorInfo,
    stepDetails: EditFlowReducer.activeStepDetails,
  };
};

const mapDispatchToProps = {
  updateFlowData: updateFlowDataChange,
  updateFlowState: updateFlowStateChange,
  saveStepAPI: saveStepAPIThunk,
  updateStepOrderApi: updateStepOrderApiThunk,
  clearStepDetailError,
  getFlowStepDetailsApi: getUserStepDetailsApiThunk,
};

const MemorizedStepConfiguration = React.memo(StepConfiguration);
export default connect(mapStateToProps, mapDispatchToProps)(MemorizedStepConfiguration);
