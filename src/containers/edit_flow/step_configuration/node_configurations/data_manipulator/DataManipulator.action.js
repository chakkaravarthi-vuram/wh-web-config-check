import { saveStep } from '../../../../../axios/apiService/flow.apiService';
import { updatePostLoader } from '../../../../../utils/UtilityFunctions';
import { store } from '../../../../../Store';
import { cloneDeep, set } from '../../../../../utils/jsUtility';

export const saveDataManipulator = (data, updateFlowStateChange) =>
  new Promise((resolve, reject) => {
    updatePostLoader(true);

    saveStep(data)
      .then((response) => {
        updatePostLoader(false);
        const { flowData } = cloneDeep(store.getState().EditFlowReducer);
        const stepIndex = flowData?.steps?.findIndex((step) => step._id === data._id);
        if (stepIndex > -1) {
            set(flowData, ['steps', stepIndex], {
                ...flowData.steps[stepIndex],
                ...data,
            });
        }
        console.log('catch error', updateFlowStateChange);
          updateFlowStateChange({
            isNodeConfigOpen: false,
            flowData,
          });
        resolve(response);
      })
      .catch((error) => {
        console.log('catch error', error);
        updatePostLoader(false);
        reject(error);
      });
  });
