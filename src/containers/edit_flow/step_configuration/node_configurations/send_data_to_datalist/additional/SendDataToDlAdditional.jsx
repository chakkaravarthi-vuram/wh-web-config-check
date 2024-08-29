import React from 'react';
import { useTranslation } from 'react-i18next';
import StatusDropdown from '../../status_dropdown/StatusDropdown';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../../node_configuration/use_node_reducer/useNodeReducer';
import { generateEventTargetObject } from '../../../../../../utils/generatorUtils';
import { RESPONSE_FIELD_KEYS } from '../SendDataToDl.constants';
import { deleteErrorListWithId } from '../SendDataToDl.utils';
import jsUtility from '../../../../../../utils/jsUtility';
import { SEND_DATA_TO_DL_CONFIG_CONSTANTS } from '../SendDataToDl.string';

function SendDataToDlAdditional() {
    const { state, dispatch } = useFlowNodeConfig();
    const { stepName, stepStatus, errorList } = state;
    const { t } = useTranslation();

    const onChangeHandler = (event) => {
        const { id, value } = event.target;
        const modifiedErrorList = deleteErrorListWithId(errorList, [id]);
        dispatch(nodeConfigDataChange({ [id]: value, errorList: modifiedErrorList }));
    };

    console.log('additionaltabstate', state);
    const stepStatusValue = jsUtility.isEmpty(stepStatus) ? SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).ADDITIONAL.DEFAULT_STEP_STATUS : stepStatus;

    return (
        <div>
            <StatusDropdown
                stepName={stepName}
                onChangeHandler={onChangeHandler}
                onClickHandler={(value) => onChangeHandler(generateEventTargetObject(RESPONSE_FIELD_KEYS.STEP_STATUS, value))}
                selectedValue={stepStatusValue}
                stepNameError={errorList?.stepName}
                stepStatusError={errorList?.stepStatus}
            />
        </div>
    );
}

export default SendDataToDlAdditional;
