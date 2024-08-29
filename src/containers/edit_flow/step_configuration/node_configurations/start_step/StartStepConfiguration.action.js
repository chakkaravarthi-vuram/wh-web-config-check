import { saveStartStepApi } from '../../../../../axios/apiService/flow.apiService';
import { updatePostLoader } from '../../../../../utils/UtilityFunctions';
import { isEmpty, translateFunction, cloneDeep, set, get } from '../../../../../utils/jsUtility';
import { normalizer } from '../../../../../utils/normalizer.utils';
import { START_NODE_REQUEST_FIELD_KEYS, START_NODE_RESPONSE_FIELD_KEYS } from './StartStepConfig.constants';
import { constructServerValidationMessage } from './StartStepConfiguration.utils';
import { store } from '../../../../../Store';
import { constructDetailedFlowErrorList, displayErrorToast, handleSaveStepNodeErrors } from '../../../../../utils/flowErrorUtils';
import { FLOW_STRINGS } from '../../../EditFlow.strings';
import { updateSomeoneIsEditingPopover } from '../../../EditFlow.utils';
import { SOMEONE_EDITING } from '../../../../../utils/ServerValidationUtils';
import { VALIDATION_ERROR_TYPES } from '../../../../../utils/strings/CommonStrings';
import { nodeConfigDataChange } from '../../../node_configuration/use_node_reducer/useNodeReducer';

export const saveStartStepApiThunk = ({ data, updateFlowStateChange, handleErrors, dispatch, stateData, t = translateFunction }) =>
  new Promise((resolve, reject) => {
    updatePostLoader(true);

    saveStartStepApi(data)
      .then((response) => {
        updatePostLoader(false);
        const normalizedStateData = normalizer(
          { ...stateData, ...response },
          START_NODE_REQUEST_FIELD_KEYS,
          START_NODE_RESPONSE_FIELD_KEYS,
        );

        const { serverError, invalidUserTeamList } = constructServerValidationMessage(normalizedStateData, t);
        const { flowData } = cloneDeep(store.getState().EditFlowReducer);
        let { detailedFlowErrorInfo = [] } = cloneDeep(store.getState().EditFlowReducer);
        const stepIndex = flowData?.steps?.findIndex((step) => step._id === data._id);
        if (stepIndex > -1) {
          set(flowData, ['steps', stepIndex], {
            ...flowData.steps[stepIndex],
            ...data,
          });
        }
        dispatch(
          nodeConfigDataChange({
            serverError,
            invalidUserTeamList,
          }),
        );
        if (data.step_uuid) {
          detailedFlowErrorInfo = constructDetailedFlowErrorList(response.validation_message, flowData.steps, translateFunction, detailedFlowErrorInfo, data.step_uuid);
        }
        if (isEmpty(serverError)) {
          updateFlowStateChange({
            isNodeConfigOpen: false,
            flowData,
            detailedFlowErrorInfo,
          });
        } else {
          dispatch(
            updateFlowStateChange({
              flowData,
              detailedFlowErrorInfo,
            }),
          );
        }
        resolve(response);
      })
      .catch((error) => {
        updatePostLoader(false);
        const errorData = get(error, ['response', 'data', 'errors'], []);
        switch (errorData[0]?.type) {
            case SOMEONE_EDITING:
                updateSomeoneIsEditingPopover(errorData?.message);
                break;
            case VALIDATION_ERROR_TYPES.LIMIT:
                displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.LIMIT_EXCEEDED);
                break;
            default:
                handleSaveStepNodeErrors({ errors: errorData, stepType: data.step_type, callback: handleErrors });
                break;
        }
        reject(error);
      });
  });
