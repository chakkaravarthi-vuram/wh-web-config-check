import { updateFlowStateChange } from 'redux/reducer/EditFlowReducer';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { EToastPosition, EToastType, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import { STEP_TYPE } from './Constants';

import { store } from '../Store';
import jsUtils, { isEmpty, cloneDeep, get, translateFunction, has, uniq } from './jsUtility';
import { VALIDATION_CONSTANT } from './constants/validation.constant';
import { SOMEONE_EDITING } from './ServerValidationUtils';
import { updateSomeoneIsEditingPopover } from '../containers/edit_flow/EditFlow.utils';

export const displayErrorToast = (errorObj = {}) => toastPopOver({
  ...errorObj,
  toastType: EToastType.error,
  toastPosition: EToastPosition.BOTTOM_LEFT,
});

export const handleCommonErrors = (error) => {
  if (
    error?.response?.data?.errors?.[0].type === SOMEONE_EDITING
  ) {
    updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
    return true;
  }
  return false;
};

export const clearStepDetailError = (stepId, errorToBeRemoved) => (dispatch) => {
  const { detailedFlowErrorInfo = [] } = jsUtils.cloneDeep(store.getState().EditFlowReducer);
  const currentStepErrorIndex = detailedFlowErrorInfo?.findIndex((error) => (error.id === stepId));
  if (currentStepErrorIndex > -1) {
    const errorMessages = detailedFlowErrorInfo[currentStepErrorIndex]?.errors || [];
    if (!isEmpty(errorMessages)) {
      const removeIndex = errorMessages.findIndex((error) => error === errorToBeRemoved);
      if (removeIndex > -1) {
        detailedFlowErrorInfo[currentStepErrorIndex]?.errors?.splice(removeIndex, 1);
      }
    }
  }
  dispatch(updateFlowStateChange({ detailedFlowErrorInfo }));
};

export const getErrorDetailsForCreateStep = (error, t = translateFunction) => {
  const errorMessage = {};
  if (error?.[0]?.type === 'exist' && error?.[0]?.field.includes('step_name')) {
    errorMessage.stepName = t(VALIDATION_CONSTANT.STEP_NAME_EXIST);
  }
  displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.NEW_STEP_FAILURE);
  return errorMessage;
};

export const getErrorDetailsForSaveStep = (error, stepType = STEP_TYPE.USER_STEP, t = translateFunction) => {
  const data = {};
  const { field } = error;
  const errorMessage = {};
  switch (error.type) {
    case 'exist':
      if (field.includes('step_name')) {
        errorMessage.stepName = t(VALIDATION_CONSTANT.STEP_NAME_EXIST);
      }
      break;

    // old cases
    case 'object.and':
      if (error.missing && error.missing[0] === 'step_uuid') {
        data.toastMessage = FLOW_STRINGS.SERVER_RESPONSE.CONFIGURATIONS_NOT_ADDED;
      }
      break;
    case 'any.unknown':
      if (field.includes('form')) {
        errorMessage.form = t(VALIDATION_CONSTANT.ERROR_IN_FORM_CONFIG);
      }
      break;
    case 'invalid':
      if (field.includes('actions')) {
        if (stepType === STEP_TYPE.USER_STEP) {
          errorMessage.actions = t(VALIDATION_CONSTANT.FORWARD_BUTTON_ACTION_CONFIGURATION);
        } else {
          errorMessage.connectors = t(VALIDATION_CONSTANT.CONNECTING_STEP_REQUIRED);
        }
      } else if (field.includes('flow_uuid')) {
        errorMessage.childFlowUuid = t(VALIDATION_CONSTANT.CHILD_FLOW_DELETED);
      } else if (field.includes('data_list_uuid')) {
        errorMessage['dataListMapping,dataListUuid'] = t(VALIDATION_CONSTANT.DATA_LIST_DELETED);
      }
      break;
    case 'array.unique':
      if (field.includes('actions')) {
        errorMessage.connectors = t(VALIDATION_CONSTANT.UNIQUE_ACTION_LABELS);
      }
      break;
    case 'array.min':
      if (field.includes('actions')) {
        if (stepType === STEP_TYPE.INTEGRATION) {
          if (error?.limit === 2) {
            errorMessage.errorMessage = t(VALIDATION_CONSTANT.FAILURE_BUTTON_ACTION_CONFIGURATION);
          }
        } else {
          if (stepType === STEP_TYPE.USER_STEP) {
            errorMessage.actions = t(VALIDATION_CONSTANT.BUTTON_ACTION_DETAILS_REQUIRED);
          } else {
            errorMessage.connectors = t(VALIDATION_CONSTANT.CONNECTING_STEP_REQUIRED);
          }
        }
      } else if (field.includes('step_assignees')) {
        if (stepType !== STEP_TYPE.START_STEP) {
          errorMessage.stepAssignees = t(VALIDATION_CONSTANT.STEP_ACTOR_CONFIGURATION);
        } else {
          errorMessage.initiators = t(VALIDATION_CONSTANT.STEP_ACTOR_CONFIGURATION);
        }
      } else if (field.includes('form')) {
        errorMessage.form = t(VALIDATION_CONSTANT.ERROR_IN_FORM_CONFIG);
      }
      break;
    default:
      break;
  }
  return {
    errorMessage,
    data,
  };
};

export const setErrorInfo = (error, stepData, t) => {
  const errorInfo = {};
      if (error.field.includes('initiators')) {
        errorInfo.message = t(VALIDATION_CONSTANT.INITIATORS_CONFIGURATION);
        return errorInfo;
      }
      if (error.field.includes('assignees')) {
        errorInfo.message = t(VALIDATION_CONSTANT.STEP_ACTOR_CONFIGURATION);
        return errorInfo;
      }
      if (error.field.includes('escalation_recipients')) {
        errorInfo.message = t(VALIDATION_CONSTANT.ESCALATION_RECIPIENT_CONFIGURATION);
        return errorInfo;
      }
      if (error.field.includes('cc_recipients') || error.field.includes('recipients')) {
        errorInfo.message = t(VALIDATION_CONSTANT.RECIPIENT_CONFIGURATION);
        return errorInfo;
      }
      if (error.field.includes('connected_steps')) {
        errorInfo.message = t(VALIDATION_CONSTANT.CONNECTING_STEP_REQUIRED);
        return errorInfo;
      }
      if (error.field.includes('form_metadata')) {
        errorInfo.message = t(VALIDATION_CONSTANT.ERROR_IN_FORM_CONFIG);
        return errorInfo;
      }
      if (error.field.includes('data_list_mapping')) {
        errorInfo.message = t(VALIDATION_CONSTANT.UPDATE_DL_CONFIG);
        return errorInfo;
      }
      if (error.field.includes('manipulation_details')) {
        errorInfo.message = t(VALIDATION_CONSTANT.DATA_MANIPULATOR_CONFIG);
        return errorInfo;
      }
      if (
        error.field.includes('trigger_details') ||
        error.field.includes('is_async') ||
        error.field.includes('is_mni') ||
        error.field.includes('child_flow_uuid')
      ) {
        errorInfo.message = t(VALIDATION_CONSTANT.CALL_SUB_FLOW_CONFIG);
        return errorInfo;
      }
      if (error.field.includes('branch_config')) {
        errorInfo.message = t(VALIDATION_CONSTANT.BRANCH_CONFIG);
        return errorInfo;
      }
      if (error.field.includes('email_actions')) {
        errorInfo.message = t(VALIDATION_CONSTANT.EMAIL_CONFIGURATION);
        return errorInfo;
      }
      if (error.field.includes('timer_details')) {
        errorInfo.message = t(VALIDATION_CONSTANT.WAIT_NODE_CONFIGURATION);
        return errorInfo;
      }
      if (error.field.includes('document_generation')) {
        errorInfo.message = t(VALIDATION_CONSTANT.DOCUMENT_GENERATE_CONFIG);
        return errorInfo;
      }
      if (error.field.includes('join_config')) {
        errorInfo.message = t(VALIDATION_CONSTANT.JOIN_CONFIG);
        return errorInfo;
      }
      if (error.field.includes('integration_details') || error.field.includes('error_actions')) {
        errorInfo.message = stepData.step_type === STEP_TYPE.INTEGRATION ? t(VALIDATION_CONSTANT.INTEGRATION_CONFIG) : t(VALIDATION_CONSTANT.ML_INTEGRATION_CONFIG);
        return errorInfo;
      }
      if (error.field.includes('actions')) {
        errorInfo.message = t(t(VALIDATION_CONSTANT.FORWARD_BUTTON_ACTION_CONFIGURATION));
        return errorInfo;
      }
      return errorInfo;
};

export const setErrorInfo2 = (error, step_order, step_type = '', stepData, t = translateFunction) => {
  console.log('setErrorInfosetErrorInfosetErrorInfosetErrorInfosetErrorInfo');
  switch (error.type) {
    case 'object.and':
      if (error.missing && error.missing[0] === 'step_uuid') {
        displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.CONFIGURATIONS_NOT_ADDED);
      }
      return null;
    case 'any.unknown':
      if (error.field.includes('form')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.ERROR_IN_FORM_CONFIG),
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      break;
    case 'invalid':
      if (error.field.includes('actions')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = step_type === STEP_TYPE.USER_STEP ? {
          errorMessage: t(VALIDATION_CONSTANT.FORWARD_BUTTON_ACTION_CONFIGURATION),
        } :
          {
            errorMessage: t(VALIDATION_CONSTANT.CONNECTING_STEP_REQUIRED),
          };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      if (error.field.includes('flow_uuid')) {
        const errorMessageInfo = error.message;
        const errorInfo = {
        };
        if (step_order) {
          errorInfo.errorMessage = t(VALIDATION_CONSTANT.CHILD_FLOW_DELETED);
          errorInfo.step_order = step_order;
        }
        console.log('step_ordertrigger errorInfo', errorInfo, error, errorMessageInfo);
        return errorInfo;
      }
      break;
    case 'array.unique':
      console.log('case handled', error);
      if (error.field.includes('actions')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.UNIQUE_ACTION_LABELS),
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        console.log('errorinfo', errorInfo);
        return errorInfo;
      }
      break;
    case 'array.min':
      if (error.field.includes('actions')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = step_type === STEP_TYPE.USER_STEP ? {
          errorMessage: t(VALIDATION_CONSTANT.BUTTON_ACTION_DETAILS_REQUIRED),
        } :
          {
            errorMessage: t(VALIDATION_CONSTANT.CONNECTING_STEP_REQUIRED),
          };
        if (step_type === STEP_TYPE.INTEGRATION) {
          if (error?.limit === 2) {
            errorInfo.errorMessage = t(VALIDATION_CONSTANT.FAILURE_BUTTON_ACTION_CONFIGURATION);
          }
        }
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      if (error.field.includes('step_assignees')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.STEP_ACTOR_CONFIGURATION),
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      if (error.field.includes('form')) {
        console.log('error field satis', error.field);
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.ERROR_IN_FORM_CONFIG),
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }

      break;
    case 'array.includesRequiredUnknowns':
      console.log('error.fielderror.field', error.field, error.field.includes('data_list_mapping'));
      if (error.field.includes('action_type') || error.field.includes('action_uuid')) {
        const errorFieldInfo = error.field.split('.');
        let errorInfo = {
          errorMessage: 'Invalid actions',
        };
        if (error.field.includes('email_actions')) {
          const emailIndex = stepData?.email_actions[errorFieldInfo[1]];
          if (emailIndex && !isEmpty(stepData?.email_actions[emailIndex]?.action_type)) {
            errorInfo = {
              errorMessage: 'Invalid actions in Email configuration',
            };
          } else {
            errorInfo = {
              errorMessage: 'Email action is required',
            };
          }
        }
        if (error.field.includes('document_generation')) {
          const docGenerationIndex = stepData?.document_generation[errorFieldInfo[1]];
          if (docGenerationIndex && !isEmpty(stepData?.document_generation[docGenerationIndex]?.action_type)) {
            errorInfo = {
              errorMessage: 'Invalid actions in Document Generation configuration',
            };
          } else {
            errorInfo = {
              errorMessage: 'Document Generation action is required',
            };
          }
        }
        if (error.field.includes('data_list_mapping')) {
          const datalistMappingIndex = stepData?.data_list_mapping[errorFieldInfo[1]];
          if (datalistMappingIndex && !isEmpty(stepData?.data_list_mapping[datalistMappingIndex]?.action_type)) {
            errorInfo = {
              errorMessage: 'Invalid actions in Send Data to Datalist configuration',
            };
          } else {
            errorInfo = {
              errorMessage: 'Send Data to Datalist action is required',
            };
          }
        }
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      break;
    case 'any.required':
      if (error.field.includes('form')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.ERROR_IN_FORM_CONFIG),
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      if (error.field.includes('assignees') || (error.field.includes('step_assignees'))) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.STEP_ACTOR_CONFIGURATION),
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      if (error.field.includes('email_actions')) {
        if (error.field.includes('recipients')) {
          const errorFieldInfo = error.field.split('.');
          const errorInfo = {
            errorMessage: 'Email recipients are invalid',
          };
          if (step_order) {
            errorInfo.step_order = step_order;
          } else if (errorFieldInfo && errorFieldInfo[1]) {
            errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
          }
          console.log('Action required error', errorInfo);
          return errorInfo;
        }
      }
      if (error.field.includes('escalations')) {
        if (error.field.includes('recipients')) {
          const errorFieldInfo = error.field.split('.');
          const errorInfo = {
            errorMessage: 'Escalation recipients are invalid',
          };
          if (step_order) {
            errorInfo.step_order = step_order;
          } else if (errorFieldInfo && errorFieldInfo[1]) {
            errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
          }
          console.log('Action required error', errorInfo);
          return errorInfo;
        }
      }
      if (error.field.includes('actions')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.STEP_BUTTON_ACTION_MISSING),
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        console.log('Action required error', errorInfo);
        return errorInfo;
      }
      if (error.field.includes('integration')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          // errorMessage: 'Connecting step of the button action is missing, check and continue',
        };
        if (error?.indexes?.includes('query_params')) {
          errorInfo.errorMessage = FLOW_STRINGS.SERVER_RESPONSE.INTEGRATION_QUERY_PARAM_CONFIFURATION_ERROR;
        }
        if (error?.indexes?.includes('relative_path')) {
          errorInfo.errorMessage = FLOW_STRINGS.SERVER_RESPONSE.INTEGRATION_RELATIVE_PATH_CONFIFURATION_ERROR;
        }
        if (error?.indexes?.includes('body')) {
          errorInfo.errorMessage = FLOW_STRINGS.SERVER_RESPONSE.INTEGRATION_REQUESST_BODY_CONFIFURATION_ERROR;
        }
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        console.log('Action required error', errorInfo);
        return errorInfo;
      }
      break;
    case 'any.invalid':
      if (error.field.includes('step_assignees')) {
        const errorFieldInfo = error.field.split('.');
        if (errorFieldInfo.length === 7) errorFieldInfo.splice(0, 2);
        const errorUser = get(stepData, errorFieldInfo);
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID),
          invalidAssignees: errorUser,
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      } else {
        const errorFieldInfo = error.field.split('.');
        if (error?.field?.includes('recipients')) {
          let errorMessage = null;
          if (error?.field.includes('email_actions')) {
            errorMessage = 'Error in Email Recipient configuration';
          } else if (error?.field.includes('escalation')) {
            errorMessage = 'Error in Escalation Recipient configuration';
          }
          const errorInfo = {
            errorMessage,
          };
          if (step_order) {
            errorInfo.step_order = step_order;
          } else if (errorFieldInfo && errorFieldInfo[1]) {
            errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
          }
          return errorInfo;
        }
      }
      break;
    case 'any.only':
      if (error.field.includes('step_assignees')) {
        const errorFieldInfo = error.field.split('.');
        if (errorFieldInfo.length === 7) errorFieldInfo.splice(0, 2);
        const errorUser = get(stepData, errorFieldInfo);
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID),
          invalidAssignees: errorUser,
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      if (error.field.includes('form')) {
        const errorFieldInfo = error.field.split('.');
        if (errorFieldInfo.length === 7) errorFieldInfo.splice(0, 2);
        const errorUser = get(stepData, errorFieldInfo);
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.ERROR_IN_FORM_CONFIG),
          invalidAssignees: errorUser,
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      if (error.field.includes('escalations') && error.field.includes('recipients')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.INVALID_ESCALATION_RECIPIENT),
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      if (error.field.includes('email_actions')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          errorMessage: error.field.includes('recipients') ?
            t(VALIDATION_CONSTANT.INVALID_EMAIL_RECIPIENT) :
            t(VALIDATION_CONSTANT.EMAIL_ACTION_MISSING),
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      if (error.field.includes('document_generation')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.Document_GENERATION_ACTION_MISSING),
        };
        if (error.field.includes('data_fields')) {
          errorInfo.errorMessage = FLOW_STRINGS.SERVER_RESPONSE.DOCUMENT_GENERATION.DATA_FIELDS;
        }
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      if (error.field.includes('data_list_mapping')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.SEND_DATA_TO_DATALIST_ACTION_MISSING),
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      break;
    case 'not_exist':
    case 'trigger.config.error':
      const errorFieldInfo = error.field.split('.');
      if (error.field.includes('trigger_uuid')) {
        const errorMessageInfo = error.message;
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.FIELDS_DELETED),
        };
        if (errorMessageInfo && errorMessageInfo.includes('field uuid')) {
          errorInfo.step_order = step_order;
        }
        console.log('trigger errorInfo', errorInfo, error, errorMessageInfo);
        return errorInfo;
      }
      if (error.field.includes('integration')) {
        if (error?.indexes?.includes('event_uuid') || error?.indexes?.includes('connector_uuid')) {
          if (error?.type.includes('not_exist')) {
            const errorInfo = {
              errorMessage: FLOW_STRINGS.SERVER_RESPONSE.INTEGRATION_CONFIFURATION_ERROR,
            };
            if (step_order) {
              errorInfo.step_order = step_order;
            } else if (errorFieldInfo && errorFieldInfo[1]) {
              errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
            }
            return errorInfo;
          }
        }
      }
      break;
    case 'object.unknown':
      if (error.field.includes('integration')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          // errorMessage: 'Connecting step of the button action is missing, check and continue',
        };
        if (error?.indexes?.includes('query_params')) {
          errorInfo.errorMessage = FLOW_STRINGS.SERVER_RESPONSE.INTEGRATION_QUERY_PARAM_CONFIFURATION_ERROR;
        }
        if (error?.indexes?.includes('relative_path')) {
          errorInfo.errorMessage = FLOW_STRINGS.SERVER_RESPONSE.INTEGRATION_RELATIVE_PATH_CONFIFURATION_ERROR;
        }
        if (error?.indexes?.includes('body')) {
          errorInfo.errorMessage = FLOW_STRINGS.SERVER_RESPONSE.INTEGRATION_REQUESST_BODY_CONFIFURATION_ERROR;
        }
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        console.log('Action required error', errorInfo);
        return errorInfo;
      }
      break;
    // case 'trigger.config.error':
    //   if (error.field.includes('trigger_uuid')) {
    //     const errorFieldInfo = error.field.split('.');
    //     const errorInfo = {
    //       errorMessage: 'One/more fields have been deleted',
    //     };
    //     if (errorFieldInfo && errorFieldInfo[1]) {
    //       errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
    //     }
    //     console.log('trigger errorInfo', errorInfo, error);
    //     return errorInfo;
    //   }
    //   break;
    case 'flow_datalist.config.error':
      if (error.field.includes('mapping_uuid')) {
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.SEND_DATALIST_FIELDS_DELETED),
        };
        return errorInfo;
      }
      break;
    default:
      if (error.field.includes('form')) {
        const errorFieldInfo = error.field.split('.');
        const errorInfo = {
          errorMessage: t(VALIDATION_CONSTANT.ERROR_IN_FORM_CONFIG),
        };
        if (step_order) {
          errorInfo.step_order = step_order;
        } else if (errorFieldInfo && errorFieldInfo[1]) {
          errorInfo.step_order = parseInt(errorFieldInfo[1], 10) + 1;
        }
        return errorInfo;
      }
      return null;
  }
  return null;
};
export const constructIntegrationFieldDependency = (stepId, depndencyData) => (dispatch) => {
  const clonedFlowData = cloneDeep(store.getState().EditFlowReducer.flowData);
  clonedFlowData.dependency_data = depndencyData;
  clonedFlowData.dependency_type = 'Field';
  clonedFlowData.dependency_name = 'Save response fields';
  clonedFlowData.showFieldDependencyDialog = {
    isVisible: true,
    isIntegrationDependency: true,
  };
  dispatch(updateFlowStateChange({ flowData: clonedFlowData }));
};

export const handleSaveStepNodeErrors = ({ errors, stepType, callback }) => {
  let consolidatedrrorMessages = {};
  let errorPopupMessage = FLOW_STRINGS.SERVER_RESPONSE.SAVE_NODE_FAILURE;
  (errors || []).forEach((error) => {
    const { data, errorMessage } = getErrorDetailsForSaveStep(error, stepType);
    if (data.toastMessage) {
      errorPopupMessage = data.toastMessage;
    }
    consolidatedrrorMessages = {
      ...consolidatedrrorMessages,
      ...errorMessage,
    };
  });
  if (!isEmpty(consolidatedrrorMessages)) {
    callback?.(consolidatedrrorMessages);
  }
  displayErrorToast(errorPopupMessage);
};

// handles server error or server valdiation message for save step
export const constructDetailedFlowErrorInfo = ({ errors, step_order, step_id }, t = translateFunction) => (dispatch) => {
  if (errors.response) {
    const server_response = errors.response;
    if (server_response.data && server_response.data.errors) {
      const { detailedFlowErrorInfo = [], flowData } = jsUtils.cloneDeep(store.getState().EditFlowReducer);
      const currentStepData = step_id ? flowData.steps.find((stepData) => stepData._id === step_id) : {};
      const currentStepErrorIndex = step_id ? detailedFlowErrorInfo.findIndex((error) => (error.id === step_id)) : -1;
      if ((currentStepErrorIndex > -1) && (jsUtils.has(detailedFlowErrorInfo, [currentStepErrorIndex, 'errors']))) {
        detailedFlowErrorInfo[currentStepErrorIndex].errors = [];
        server_response.data.errors.forEach((errorData) => {
          const errorInfo = setErrorInfo(errorData, step_order, '', currentStepData, t);

          if (!jsUtils.isEmpty(errorInfo)) {
            if (currentStepErrorIndex > -1) {
              const errorExistsIndex = detailedFlowErrorInfo[currentStepErrorIndex].errors.findIndex((errorMsg) => errorMsg === errorInfo.errorMessage);
              if (errorExistsIndex === -1) {
                detailedFlowErrorInfo[currentStepErrorIndex].errors.push(errorInfo.errorMessage);
              }
              if (!isEmpty(errorInfo.invalidAssignees)) {
                if (isEmpty(detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees)) {
                  detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees = [errorInfo.invalidAssignees];
                } else {
                  detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees = jsUtils.uniq([
                    ...detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees,
                    errorInfo.invalidAssignees,
                  ]);
                }
              }
            }
          }
        });
      }
      // else if (validateStepAssigneesAlone && currentStepData.step_assignees) {
      //   const isInactiveAssigneeError = server_response.data.errors.some((error) => error.field.includes('step_assignees'));
      //   if (isInactiveAssigneeError) {
      //     server_response.data.errors.forEach((errorData) => {
      //       if (errorData.field.includes('step_assignees')) {
      //       const errorInfo = setErrorInfo(errorData, step_order, '', currentStepData, t);
      //       currentStepErrorIndex = step_id ? detailedFlowErrorInfo.findIndex((error) => (error.id === step_id)) : -1;
      //       if (!jsUtils.isEmpty(errorInfo)) {
      //         if (currentStepErrorIndex > -1) {
      //           if (!jsUtils.has(detailedFlowErrorInfo, [currentStepErrorIndex, 'errors'])) detailedFlowErrorInfo[currentStepErrorIndex].errors = [];
      //             if (!isEmpty(errorInfo.invalidAssignees)) {
      //               if (isEmpty(detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees)) {
      //                 detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees = [errorInfo.invalidAssignees];
      //               } else {
      //                 detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees = jsUtils.uniq([
      //                   ...detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees,
      //                   errorInfo.invalidAssignees,
      //                 ]);
      //               }
      //             }
      //             const assigneeErrorIndex = detailedFlowErrorInfo[currentStepErrorIndex].errors.findIndex((errorMsg) => (errorMsg === t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID)));
      //             if (assigneeErrorIndex === -1) {
      //               detailedFlowErrorInfo[currentStepErrorIndex].errors.push(errorInfo.errorMessage);
      //             }
      //         } else {
      //           detailedFlowErrorInfo.push({
      //             id: step_id,
      //             errors: [errorInfo.errorMessage],
      //             ...(!isEmpty(errorInfo.invalidAssignees) ? { invalidAssignees: [errorInfo.invalidAssignees] } : {}),
      //           });
      //         }
      //       }
      //     }
      //     });
      //   }
      // } else {
      if (flowData.activeIntegrationData) {
        server_response.data.errors.forEach((errorData) => {
          if (errorData?.field === 'step_name' && errorData?.type === 'exist') {
            dispatch(updateFlowStateChange({ activeIntegrationServerError: t(VALIDATION_CONSTANT.STEP_NAME_EXIST) }));
          }
        });
      }
      if (flowData.activeMLIntegrationData) {
        server_response.data.errors.forEach((errorData) => {
          if (errorData?.field === 'step_name' && errorData?.type === 'exist') {
            dispatch(updateFlowStateChange({ activeMLIntegrationServerError: t(VALIDATION_CONSTANT.STEP_NAME_EXIST) }));
          }
        });
      }
      server_response?.data?.errors?.forEach((error) => {
        if (error?.type === 'field_dependency') {
          dispatch(constructIntegrationFieldDependency(step_id, error.values));
        }
      });
      // }
      console.log('disdis', detailedFlowErrorInfo, step_order, step_id);
      dispatch(updateFlowStateChange({ detailedFlowErrorInfo }));
    }
  }
};

// handle server validation messages of all steps
export const handleAllStepErrors = (err, steps, t = translateFunction) => {
  const server_response = err.response;
  const detailedFlowErrorInfo = [];
  let brokenSteps = [];
  if (server_response?.data?.errors) {
    const errList = (server_response.data.errors) || [];
    errList.forEach((errorData) => {
      if (errorData.field && (errorData.field.includes('step'))) {
        if (errorData && errorData.field === 'step_uuid' && errorData.type === 'invalid' &&
          errorData.message.includes('These steps are disconnected - ')) {
          const errorMessageStepUuids = errorData.message.replace('These steps are disconnected - ',
            '').replace('[', '').replace(']', '').split(',');
          brokenSteps = errorMessageStepUuids;
        } else {
          const keys = errorData.field.split('.');
          const step_id = steps[keys[1]]?._id;
          const errorInfo = setErrorInfo(errorData, steps[keys[1]]?.step_order, steps[keys[1]]?.step_type, steps[keys[1]], t);
          if (!jsUtils.isEmpty(errorInfo)) {
            const currentStepErrorIndex = detailedFlowErrorInfo.findIndex((error) => (error.id === step_id));
            if (currentStepErrorIndex > -1) {
              if (!jsUtils.has(detailedFlowErrorInfo, [currentStepErrorIndex, 'errors'])) detailedFlowErrorInfo[currentStepErrorIndex].errors = [];
              if (errorInfo.errorMessage === t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID)) {
                if (!isEmpty(errorInfo.invalidAssignees)) {
                  if (isEmpty(detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees)) {
                    detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees = [errorInfo.invalidAssignees];
                  } else {
                    detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees = jsUtils.uniq([
                      ...detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees,
                      errorInfo.invalidAssignees,
                    ]);
                  }
                }
                const assigneeErrorIndex = detailedFlowErrorInfo[currentStepErrorIndex].errors.findIndex((errorMsg) => (errorMsg === t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID)));
                if (assigneeErrorIndex === -1) {
                  detailedFlowErrorInfo[currentStepErrorIndex].errors.push(errorInfo.errorMessage);
                }
              } else {
                const errorExistsIndex = detailedFlowErrorInfo[currentStepErrorIndex].errors.findIndex((errorMsg) => errorMsg === errorInfo.errorMessage);
                if (errorExistsIndex === -1) {
                  detailedFlowErrorInfo[currentStepErrorIndex].errors.push(errorInfo.errorMessage);
                }
              }
            } else {
              detailedFlowErrorInfo.push({
                id: step_id,
                errors: [errorInfo.errorMessage],
                ...(!isEmpty(errorInfo.invalidAssignees) ? { invalidAssignees: [errorInfo.invalidAssignees] } : {}),
              });
            }
          }
        }
      }
    });
  }
  return { detailedFlowErrorInfo, brokenSteps };
};

export const constructDetailedFlowErrorList = (errors, steps, t, detailedFlowErrorInfo = [], stepUuid = null) => {
  if (stepUuid) {
    const currentStepErrorIndex = detailedFlowErrorInfo.findIndex((error) => (error.stepUuid === stepUuid));
    if (currentStepErrorIndex > -1) {
      detailedFlowErrorInfo.splice(currentStepErrorIndex, 1);
    }
  }
  if (stepUuid && isEmpty(errors)) {
    return detailedFlowErrorInfo;
  }
  errors.forEach((errorData) => {
    const keys = errorData?.field.split('.') || [];
    const stepDetails = steps?.[Number(keys[1])] || {};
    const errorInfo = setErrorInfo(errorData, stepDetails, t);
    if (!isEmpty(errorInfo)) {
      const currentStepErrorIndex = detailedFlowErrorInfo.findIndex((error) => (error.id === stepDetails._id));
      if (currentStepErrorIndex > -1) {
        if (!has(detailedFlowErrorInfo, [currentStepErrorIndex, 'errors'])) detailedFlowErrorInfo[currentStepErrorIndex].errors = [];
        if (errorInfo.message === t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID)) {
          if (!isEmpty(errorInfo.invalidAssignees)) {
            if (isEmpty(detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees)) {
              detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees = [errorInfo.invalidAssignees];
            } else {
              detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees = uniq([
                ...detailedFlowErrorInfo[currentStepErrorIndex].invalidAssignees,
                errorInfo.invalidAssignees,
              ]);
            }
          }
          const assigneeErrorIndex = detailedFlowErrorInfo[currentStepErrorIndex].errors.findIndex((errorMsg) => (errorMsg === t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID)));
          if (assigneeErrorIndex === -1) {
            detailedFlowErrorInfo[currentStepErrorIndex].errors.push(errorInfo.message);
          }
        } else {
          const errorExistsIndex = detailedFlowErrorInfo[currentStepErrorIndex].errors.findIndex((errorMsg) => errorMsg === errorInfo.message);
          if (errorExistsIndex === -1) {
            detailedFlowErrorInfo[currentStepErrorIndex].errors.push(errorInfo.message);
          }
        }
      } else {
        detailedFlowErrorInfo.push({
          id: stepDetails?._id,
          stepUuid: stepDetails?.step_uuid,
          errors: [errorInfo.message],
          ...(!isEmpty(errorInfo.invalidAssignees) ? { invalidAssignees: [errorInfo.invalidAssignees] } : {}),
        });
      }
    }
  });
  return detailedFlowErrorInfo;
};

export default constructDetailedFlowErrorInfo;
