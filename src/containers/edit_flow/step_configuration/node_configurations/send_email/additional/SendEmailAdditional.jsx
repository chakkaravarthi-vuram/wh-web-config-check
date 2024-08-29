import React from 'react';
import { useTranslation } from 'react-i18next';
import StatusDropdown from '../../status_dropdown/StatusDropdown';
import { WAITSTEP_CONFIG_STRINGS } from '../../wait_step/WaitStepConfig.strings';
import { RESPONSE_FIELD_KEYS } from '../../end_step/EndStepConfig.constants';
import { cloneDeep, isEmpty } from '../../../../../../utils/jsUtility';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../../node_configuration/use_node_reducer/useNodeReducer';
import { constructJoiObject } from '../../../../../../utils/ValidationConstants';
import { basicNodeValidationSchema } from '../../../../node_configuration/NodeConfiguration.schema';
import { validate } from '../../../../../../utils/UtilityFunctions';

function SendEmailAdditional() {
    const { t } = useTranslation();
    const {
        state,
        dispatch,
    } = useFlowNodeConfig();

    const {
        stepStatus,
        stepName,
        errorList,
    } = state;

    const onStatusChangeHandler = (id, value) => {
        dispatch(
          nodeConfigDataChange({
            [id]: value,
          }),
        );
    };

    const onStepNameChangeHandler = (e, isOnBlur) => {
        const { target: { id } } = e;
        let { target: { value } } = e;
        let errors = {};
        const { errorList = {} } = cloneDeep(state);
        if (isOnBlur) {
          value = value?.trim?.();
        }
        if (errorList?.[id] || isOnBlur) {
          errors = validate({ stepName: value?.trim?.() }, constructJoiObject({ [id]: basicNodeValidationSchema(t)?.[id] }));
        }
        console.log('onEmailStepNameChangeEvent', e, 'value', value, 'errors', errors);
        if (isEmpty(errors)) {
          delete errorList?.[id];
        }
        dispatch(
          nodeConfigDataChange({
            [id]: value,
            errorList: {
              ...errorList,
              ...errors,
            },
          }),
        );
    };

    return (
        <div>
            <StatusDropdown
                contentTitle={WAITSTEP_CONFIG_STRINGS(t).ADDITIONAL_TAB_CONTENTS.TITLE}
                selectedValue={stepStatus}
                onChangeHandler={onStepNameChangeHandler}
                stepName={stepName}
                stepNameError={errorList?.stepName}
                onClickHandler={(value) =>
                    onStatusChangeHandler(RESPONSE_FIELD_KEYS.STEP_STATUS, value)
                }
            />
        </div>
    );
}

export default SendEmailAdditional;
