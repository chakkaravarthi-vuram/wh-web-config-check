import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Input from 'components/form_components/input/Input';
import TextArea from 'components/form_components/text_area/TextArea';

import gClasses from 'scss/Typography.module.scss';
import { mergeObjects } from 'utils/UtilityFunctions';
import FormTitle from 'components/form_components/form_title/FormTitle';
import jsUtils, { cloneDeep } from 'utils/jsUtility';
import { getTaskAssigneeSuggestion } from 'axios/apiService/taskAssigneeSuggestion.apiService';
import { createTaskSetState } from 'redux/reducer/CreateTaskReducer';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import styles from './BasicInfo.module.scss';
import { BASIC_CONFIG_STRINGS } from '../../StepConfiguration.utils';

function BasicInfo(props) {
  const { t } = useTranslation();
  const { STEP_TITLE, STEP_DESCRIPTION, SUB_TITLE } =
    FLOW_STRINGS.STEPS.STEP.BASIC_INFO_AND_ACTORS.BASIC_INFO;
  const { flow_data, stepData, onFlowDataChange, dispatch, server_error } = props;
  const flowData = cloneDeep(flow_data);

  const stepIndex = flowData.steps.findIndex(
    (data) => data._id === stepData._id,
  );

  const errors = mergeObjects(
    flowData.error_list,
    server_error,
  );
  const onStepNameChangeHandler = (event) => {
    flowData.steps[stepIndex].step_name = event.target.value;
    if (!jsUtils.isEmpty(flowData.error_list)) {
      if (flowData.error_list.step_name) {
        delete flowData.error_list.step_name;
      }
    }
    onFlowDataChange(flowData);

    const postData = {
      text: `${flowData.steps[stepIndex].step_name} ${flowData.steps[stepIndex].step_description}`,
    };
    getTaskAssigneeSuggestion(postData)
      .then((res) => {
        if (res) {
          dispatch(createTaskSetState({ suggestedTaskAssignee: res }));
        }
      })
      .catch(() => console.log('basisinfo ml error'));
  };
  const onStepDescriptionChangeHandler = (event) => {
    flowData.steps[stepIndex].step_description = event.target.value;
    if (!jsUtils.isEmpty(flowData.error_list)) {
      if (flowData.error_list.step_description) {
        delete flowData.error_list.step_description;
      }
    }
    onFlowDataChange(flowData);
  };
  return (
    <>
      <FormTitle className={cx(gClasses.MT10, styles.TitleClass)}>
        {t(SUB_TITLE)}
      </FormTitle>
      <Input
        placeholder={t(STEP_TITLE.PLACEHOLDER)}
        label={t(STEP_TITLE.LABEL)}
        onChangeHandler={onStepNameChangeHandler}
        value={flowData.steps[stepIndex].step_name}
        errorMessage={errors.step_name}
        isRequired
        labelMessage={t(STEP_TITLE.HELPER_TOOLTIP_MESSAGE)}
        id={STEP_TITLE.ID}
        helperTooltipMessage={t(BASIC_CONFIG_STRINGS.FIELDS.STEP_NAME.TOOLTIP)}
        helperToolTipId={`stepNameTooltip${stepIndex + 1}`}
        className={styles.InputClass}
        inputContainerClasses={gClasses.BackgroundWhite}
      />
      <TextArea
        placeholder={t(STEP_DESCRIPTION.PLACEHOLDER)}
        label={t(STEP_DESCRIPTION.LABEL)}
        onChangeHandler={onStepDescriptionChangeHandler}
        value={flowData.steps[stepIndex].step_description}
        errorMessage={errors.step_description}
        className={styles.InputClass}
        innerClass={cx(styles.DescriptionClass, gClasses.BackgroundWhite)}
        hideMessage={!errors.step_description}
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    flow_data: state.EditFlowReducer.flowData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFlowDataChange: (flowData) => {
      dispatch(updateFlowDataChange(flowData));
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicInfo);
BasicInfo.defaultProps = {};
BasicInfo.propTypes = {};
