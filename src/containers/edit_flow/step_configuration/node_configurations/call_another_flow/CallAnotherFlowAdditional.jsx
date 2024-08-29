import React from 'react';
import { ETitleSize, Title, Checkbox } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import styles from './CallAnotherFlow.module.scss';
import { EXCEPTION_HANDLING_STRINGS } from './CallAnotherFlow.strings';
import StatusDropdown from '../status_dropdown/StatusDropdown';
import { WAITSTEP_CONFIG_STRINGS } from '../wait_step/WaitStepConfig.strings';
import { RESPONSE_FIELD_KEYS } from '../end_step/EndStepConfig.constants';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../node_configuration/use_node_reducer/useNodeReducer';
import { cloneDeep, isEmpty } from '../../../../../utils/jsUtility';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { validate } from '../../../../../utils/UtilityFunctions';
import { TRIGGER_CONSTANTS, TRIGGER_RESPONSE_KEYS } from './CallAnotherFlow.constants';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';

function CallAnotherFlowAddditional(props) {
  const {
    onCheckboxClick,
  } = props;
  const { t } = useTranslation();

  const {
    state,
    dispatch,
  } = useFlowNodeConfig();

  const {
    stepStatus,
    stepName,
    errorList,
    cancelWithParent,
  } = state;

  const { CANCEL_WITH_PARENT } = TRIGGER_RESPONSE_KEYS;

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
    console.log('onStepNameChangeEvent_trigger', e, 'value', value, 'errors', errors, 'id', id);
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
      <Title
        content={EXCEPTION_HANDLING_STRINGS(t).SUB_FLOW.LABEL}
        size={ETitleSize.xs}
        className={cx(gClasses.MB12, styles.TitleClass)}
      />
      <Checkbox
        id={TRIGGER_CONSTANTS.CANCEL_WITH_PARENT}
        details={EXCEPTION_HANDLING_STRINGS(t).SUB_FLOW.OPTION}
        isValueSelected={cancelWithParent}
        className={cx(gClasses.MB26, styles.CheckBoxClass)}
        onClick={() => onCheckboxClick(CANCEL_WITH_PARENT)}
      />
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

export default CallAnotherFlowAddditional;
