import React from 'react';
import StatusDropdown from '../../status_dropdown/StatusDropdown';
import {
  nodeConfigDataChange,
  useFlowNodeConfig,
} from '../../../../node_configuration/use_node_reducer/useNodeReducer';
import { generateEventTargetObject } from '../../../../../../utils/generatorUtils';
import { RESPONSE_FIELD_KEYS } from '../CallIntegration.constants';

function CallIntegrationAdditional() {
  const { state, dispatch } = useFlowNodeConfig();
  const { stepName, stepStatus, errorList } = state;

  const onChangeHandler = (event) => {
    const { id, value } = event.target;
    dispatch(nodeConfigDataChange({ [id]: value }));
  };

  return (
    <div>
      <StatusDropdown
        stepName={stepName}
        onChangeHandler={onChangeHandler}
        onClickHandler={(value) =>
          onChangeHandler(
            generateEventTargetObject(RESPONSE_FIELD_KEYS.STEP_STATUS, value),
          )
        }
        selectedValue={stepStatus}
        stepNameError={errorList?.stepName}
        stepStatusError={errorList?.stepStatus}
      />
    </div>
  );
}

export default CallIntegrationAdditional;
