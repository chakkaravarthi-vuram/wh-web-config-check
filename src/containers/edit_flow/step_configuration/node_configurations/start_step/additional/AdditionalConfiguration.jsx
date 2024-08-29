import { Text, Checkbox, ECheckboxSize } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import React from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { START_STEP_CONFIGURATION_STRINGS } from '../StartStepConfiguration.strings';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { START_NODE_RESPONSE_FIELD_KEYS } from '../StartStepConfig.constants';
import StatusDropdown from '../../status_dropdown/StatusDropdown';
import { useFlowNodeConfig } from '../../../../node_configuration/use_node_reducer/useNodeReducer';

function AdditionalConfiguration(props) {
  const { onCheckChangeHandler, onStatusChangeHandler, onStepNameChangeHandler } = props;

  const { t } = useTranslation();

  const { state } = useFlowNodeConfig();

  const { allowCallByFlow, allowCallByApi, stepStatus, stepName, errorList } = state;

  const { PERMISSION } = START_STEP_CONFIGURATION_STRINGS(t).ADDITIONAL;

  return (
    <div>
      <Text
        className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3)}
        content={PERMISSION.TITLE}
      />
      <Checkbox // Allow sub flow
        id={START_NODE_RESPONSE_FIELD_KEYS.SYSTEM_INITIATION}
        className={cx(gClasses.CenterV, gClasses.MT12)}
        isValueSelected={allowCallByFlow}
        details={PERMISSION.SUB_FLOW.OPTION}
        size={ECheckboxSize.LG}
        onClick={(value) => onCheckChangeHandler(value, START_NODE_RESPONSE_FIELD_KEYS.CALL_BY_FLOW)}
        checkboxViewLabelClassName={cx(
          gClasses.FTwo13GrayV90,
          gClasses.CheckboxClass,
        )}
        errorMessage={EMPTY_STRING}
      />
      <Checkbox // Allow external source
        id={START_NODE_RESPONSE_FIELD_KEYS.EXTERNAL_SYSTEM_INITIATION}
        className={cx(gClasses.CenterV, gClasses.MT12)}
        isValueSelected={allowCallByApi}
        details={PERMISSION.EXTERNAL.OPTION}
        size={ECheckboxSize.LG}
        onClick={(value) => onCheckChangeHandler(value, START_NODE_RESPONSE_FIELD_KEYS.CALL_BY_API)}
        checkboxViewLabelClassName={cx(
          gClasses.FTwo13GrayV90,
          gClasses.CheckboxClass,
        )}
        errorMessage={EMPTY_STRING}
      />

      <div className={gClasses.MT20}>
        <StatusDropdown
          selectedValue={stepStatus}
          onChangeHandler={onStepNameChangeHandler}
          stepName={stepName}
          stepNameError={errorList?.stepName}
          onClickHandler={
            (value) => onStatusChangeHandler(START_NODE_RESPONSE_FIELD_KEYS.STEP_STATUS, value)}
        />
      </div>
    </div>
  );
}

export default AdditionalConfiguration;
