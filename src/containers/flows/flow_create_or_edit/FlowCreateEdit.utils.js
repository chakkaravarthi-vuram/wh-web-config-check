import { updateFlowStateChange } from '../../../redux/reducer/EditFlowReducer';
import { store } from '../../../Store';
import { STEP_TYPE } from '../../../utils/Constants';
import { VALIDATION_CONSTANT } from '../../../utils/constants/validation.constant';
import { constructDetailedFlowErrorList } from '../../../utils/flowErrorUtils';
import { isEmpty, cloneDeep } from '../../../utils/jsUtility';
import { DOT, EMPTY_STRING, VALIDATION_ERROR_TYPES } from '../../../utils/strings/CommonStrings';
import { getResponseTriggerDetails } from '../../data_lists/data_lists_create_or_edit/DatalistsCreateEdit.utils';
import { FLOW_ACTIONS } from '../useFlow';
import { FLOW_CREATE_EDIT_CONSTANTS } from './FlowCreateOrEdit.constant';

export const formatPublishError = (err, options, validateFlowStepsAlone = false) => {
  const { dispatch, reduxDispatch, t } = options;
  const errors = { ...err };
  const flowDiagramErrors = {
    detailedFlowErrorInfo: [],
    stepsWithoutLinks: [],
    stepsWithUnusedLinks: [],
  };
  const dashboardErrors = {
    dataReportErrors: {},
    individualEntryErrors: {
      formErrors: [],
    },
  };
  const clonedFlowData = cloneDeep(store.getState().EditFlowReducer.flowData);
  const { steps } = clonedFlowData;
  let isErrorInFlowSteps = false;
  if (!isEmpty(err.security)) {
    // security tab
    const initatorsError = err.security?.find((error) => error.field.includes('security.initiators'));
    if (initatorsError) {
      if (!isErrorInFlowSteps) {
        isErrorInFlowSteps = true;
      }
      const startStep = steps.find((step) => step.step_type === STEP_TYPE.START_STEP) || {};
      flowDiagramErrors.detailedFlowErrorInfo.push({
        stepUuid: startStep.step_uuid,
        id: startStep._id,
        errors: [
          t(VALIDATION_CONSTANT.INITIATORS_CONFIGURATION),
        ],
      });
    }
    if (!isEmpty(err.security)) {
      const { ERRORS } = FLOW_CREATE_EDIT_CONSTANTS(t);
      const securityErrors = {};
      err.security.forEach?.((e) => {
          const { field = EMPTY_STRING, type = EMPTY_STRING } = e;
          if (field.includes('owners') && type === 'object.missing') {
              securityErrors.owners = ERRORS.OWNERS_REQUIRED;
          }
      });
      !validateFlowStepsAlone && dispatch(FLOW_ACTIONS.UPDATE_SECURITY, { errorList: securityErrors });
    }
  }
  if (!isEmpty(err.flow_details)) {
    if (!isErrorInFlowSteps) {
      isErrorInFlowSteps = true;
    }
    flowDiagramErrors.detailedFlowErrorInfo = constructDetailedFlowErrorList(err.flow_details, steps, t, flowDiagramErrors.detailedFlowErrorInfo);
  }
  if (!isEmpty(err.connected_steps)) {
    if (!isErrorInFlowSteps) {
      isErrorInFlowSteps = true;
    }
    err.connected_steps?.forEach((errorData) => {
      if (errorData?.field === 'step_uuid' && errorData?.type === 'invalid') {
        if (errorData.message.includes('These steps are disconnected - ')) {
          const errorMessageStepUuids = errorData.message.replace('These steps are disconnected - ',
            '').replace('[', '').replace(']', '').split(',');
          flowDiagramErrors.stepsWithoutLinks = errorMessageStepUuids;
        }
        if (errorData.message.includes('These steps has unused connected steps - ')) {
          const errorMessageStepUuids = errorData.message.replace('These steps has unused connected steps - ',
            '').replace('[', '').replace(']', '').split(',');
          flowDiagramErrors.stepsWithUnusedLinks = errorMessageStepUuids;
        }
      }
    });
  }
  console.log(flowDiagramErrors, 'flowDiagramErrorsflowDiagramErrorsflowDiagramErrors');
  reduxDispatch(updateFlowStateChange({ ...flowDiagramErrors }));

  if (validateFlowStepsAlone) {
    return { errors, dashboardErrors, isErrorInFlowSteps };
  }
    // add on tab
    if (!isEmpty(err.add_on_config)) {
        const { ERRORS } = FLOW_CREATE_EDIT_CONSTANTS(t);
        const addOnErrors = {};
        err.add_on_config.forEach?.((e) => {
            const { field = EMPTY_STRING } = e;
            const [key, idx] = field.split(DOT);
            if (key === 'custom_identifier') {
                addOnErrors.customIdentifier = ERRORS.UNIQUE_IDENTIFIER_DELETED;
            } else if (key === 'task_identifier') {
                addOnErrors[`taskIdentifier,${idx}`] = ERRORS.TASK_IDENTIFIER_DELETED;
            }
        });
        dispatch(FLOW_ACTIONS.UPDATE_ADD_ON, { errorList: addOnErrors });
    }

    if (!isEmpty(err.related_actions)) {
        // related actions tab
    }

    if (!isEmpty(err.dashboard)) {
      err.dashboard.forEach((errorObj) => {
        if (errorObj.field.includes('report.table_columns')) {
          if ([VALIDATION_ERROR_TYPES.ONLY].includes(errorObj.type)) {
            dashboardErrors.dataReportErrors[errorObj.field?.split(DOT)?.[3]] = 'Field Deleted';
          }
        }
        if (
          (errorObj?.field || EMPTY_STRING).includes('form_metadata') &&
          (errorObj?.field || EMPTY_STRING).includes('dashboard_metadata.pages')
        ) {
          dashboardErrors.individualEntryErrors.formErrors.push(errorObj);
        }
      });
    }

    return { errors, dashboardErrors };
};

export const formatParentTrigger = (triggers) => {
    if (isEmpty(triggers)) return [];

    return triggers.map((t) => {
      const _t = { ...t };
      delete _t.child_flow_name;
      delete _t._id;
      delete _t.flow_id;
      delete _t.trigger_type;
      delete _t.flow_uuid;
      delete _t.status;
      return _t;
    });
};

export const deconstructBasicFlowData = (res) => {
  const flowData = {
    id: res._id,
    uuid: res.flow_uuid,
    name: res.flow_name,
    description: res.flow_description || EMPTY_STRING,
    status: res.status,
    stepStatuses: res.step_statuses || [],
    version: res.version,
    hasRelatedFlows: res.has_related_flows || false,
    hasAutoTrigger: res.has_auto_trigger || false,
    relatedActions: {
      triggers: getResponseTriggerDetails(res.trigger_details || []),
    },
  };
  return flowData;
};
