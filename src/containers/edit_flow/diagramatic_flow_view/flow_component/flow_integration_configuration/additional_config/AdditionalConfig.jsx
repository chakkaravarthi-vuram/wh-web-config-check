import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateFlowDataChange, updateFlowStateChange } from 'redux/reducer/EditFlowReducer';
import { getAllStepsListThunk } from 'redux/actions/EditFlow.Action';
import gClasses from 'scss/Typography.module.scss';
import CheckboxGroup from 'components/form_components/checkbox_group/CheckboxGroup';
import { ACTION_TYPE } from 'utils/constants/action.constant';
import RadioGroup, { RADIO_GROUP_TYPE } from 'components/form_components/radio_group/RadioGroup';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { STEP_TYPE } from 'utils/Constants';
import HelperMessage, { HELPER_MESSAGE_TYPE } from 'components/form_components/helper_message/HelperMessage';
import { ARIA_ROLES } from 'utils/UIConstants';
import { cloneDeep, set, unset, isEmpty } from 'utils/jsUtility';
import { INTEGRATION_CONSTANTS, INTEGRATION_FAILURE_ACTION } from '../FlowIntegrationConfiguration.constants';
import styles from './AdditionalConfig.module.scss';
import configStyles from '../FlowIntegrationConfiguration.module.scss';
import FormFooter from '../../../../../form/form_builder/form_footer/FormFooter';
import { getTriggerMappingFields } from '../../../../../../redux/actions/FlowStepConfiguration.Action';
import { calculateActionButtonName, getConnectedStepsFromActions, INITIAL_ACTION_VALUE } from '../../../../EditFlow.utils';

function AddditionConfig(props) {
  const { currentIntegrationData = {}, flowData, updateIntegerationData, integration_error_list = {},
    getAllSteps, detailedFlowErrorInfo = [],
    updateActions,
    successActions,
    actionErrorList,
  } = props;
  console.log('updateFailureFlow', props);
  const { additionConfigErrorList = {} } = integration_error_list;
  const { stepsList = [] } = flowData;
  const { ADDITIONAL_CONFIGURATION } = INTEGRATION_CONSTANTS;

  const metaData = {
    moduleId: flowData.flow_id,
    moduleUUID: flowData.flow_uuid,
    stepId: currentIntegrationData._id,
    stepUUID: currentIntegrationData.step_uuid,
  };
  const { actions = [] } = cloneDeep(currentIntegrationData);
  const failureAction = actions.find((eachAction) => eachAction.action_type === ACTION_TYPE.FORWARD_ON_FAILURE);

  const updateFailureFlow = (value) => {
    const clonedIntegrationData = cloneDeep(currentIntegrationData);
    clonedIntegrationData.failure_action = value;
    if (value === INTEGRATION_FAILURE_ACTION.CONTINUE) {
      unset(clonedIntegrationData, ['integration_error_list', 'additionConfigErrorList', 'failureAction']);
    }
    updateIntegerationData(clonedIntegrationData);
  };

  const onSelectFailureStep = (e) => {
    const { value } = e.target;
    const clonedIntegerationData = cloneDeep(currentIntegrationData);
    if (isEmpty(failureAction)) {
      const newActionData = cloneDeep({
        ...cloneDeep(INITIAL_ACTION_VALUE),
        action_name: calculateActionButtonName(clonedIntegerationData?.actions, 'Submit'),
        action_type: ACTION_TYPE.FORWARD_ON_FAILURE,
      });
      delete newActionData.button_position;
      delete newActionData.allow_comments;
      delete newActionData.button_color;
      clonedIntegerationData.actions.push(newActionData);
    }
    const failureActionIndex = clonedIntegerationData?.actions?.findIndex(({ action_type }) => action_type === ACTION_TYPE.FORWARD_ON_FAILURE);
    if (failureActionIndex > -1) {
      set(clonedIntegerationData, ['actions', failureActionIndex, 'next_step_uuid'], [value]);
    }
    clonedIntegerationData.connected_steps = getConnectedStepsFromActions(clonedIntegerationData?.actions);
    updateIntegerationData(clonedIntegerationData);
  };

  const setTestBedRun = (value) => {
    console.log('setTestBedRunsetTestBedRun', value);
    const clonedIntegerationData = cloneDeep(currentIntegrationData);
    clonedIntegerationData.skip_during_testbed = !clonedIntegerationData.skip_during_testbed;
    updateIntegerationData(clonedIntegerationData);
  };

  useEffect(() => {
    getAllSteps(flowData.flow_id, currentIntegrationData?._id, null, false, {}, [STEP_TYPE.END_FLOW]);
    const errorIndex = detailedFlowErrorInfo?.findIndex((eachError) => eachError.id === currentIntegrationData._id);
    if (errorIndex > -1) {
      const clonedIntegrationData = cloneDeep(currentIntegrationData);
      set(clonedIntegrationData,
        ['integration_error_list', 'additionConfigErrorList', 'failureAction'],
        ADDITIONAL_CONFIGURATION.FAILURE_OPTIONS.ASSIGN_STEP_ERROR);
      updateIntegerationData(clonedIntegrationData);
    }
  }, []);

  console.log('currentStepListcurrentStepList', failureAction, failureAction?.action_next_step_name);
  return (
    <>
      <div className={cx(gClasses.FTwo18GrayV3, gClasses.MB15, gClasses.FontWeight500, configStyles.BodyHeader)}>
        {ADDITIONAL_CONFIGURATION.HEADING}
      </div>
      <div className={cx(styles.TestBedRun, gClasses.CenterV)}>
        <CheckboxGroup
          id={ADDITIONAL_CONFIGURATION.TEST_BED.ID}
          optionList={ADDITIONAL_CONFIGURATION.TEST_BED.OPTION_LIST}
          checkboxClasses={styles.TestRunCheck}
          selectedValues={currentIntegrationData?.skip_during_testbed ? [1] : []}
          hideLabel
          onClick={(value) => setTestBedRun(value)}
          checkboxViewLabelClassName={cx(styles.TestLabel)}
        />
      </div>
      <FormFooter
        metaData={metaData}
        actions={successActions}
        stepList={[]}
        errorList={actionErrorList}
        stepDetails={currentIntegrationData}
        onCreateStep={() => { }}
        onFormActionUpdate={updateActions}
        moduleType={STEP_TYPE.INTEGRATION}
        flowData={flowData}
      />
      <div>
        {additionConfigErrorList?.forwardAction &&
          <HelperMessage
            message={additionConfigErrorList?.forwardAction}
            type={HELPER_MESSAGE_TYPE.ERROR}
            noMarginBottom
            // className={styles.ErrorContainer}
            role={ARIA_ROLES.ALERT}
          />
        }
      </div>
      <div className={gClasses.MT20}>
        <RadioGroup
          id={ADDITIONAL_CONFIGURATION.FAILURE_OPTIONS.ID}
          label={ADDITIONAL_CONFIGURATION.FAILURE_OPTIONS.LABEL}
          optionList={ADDITIONAL_CONFIGURATION.FAILURE_OPTIONS.OPTIONS}
          onClick={(value) => value !== currentIntegrationData?.failure_action && updateFailureFlow(value)}
          selectedValue={currentIntegrationData?.failure_action || INTEGRATION_FAILURE_ACTION.CONTINUE}
          type={RADIO_GROUP_TYPE.TYPE_2}
          radioLabelClass={cx(gClasses.FTwo12BlackV13, gClasses.FontWeight500)}
          radioButtonClasses={styles.FormFieldRadio}
          radioSelectedStyle={styles.RadioSelectedStyle}
        />
      </div>
      {currentIntegrationData?.failure_action === INTEGRATION_FAILURE_ACTION.ASSIGN_TO_STEP &&
        <div className={gClasses.MT20}>
          <Dropdown
            hideLabel
            id={ADDITIONAL_CONFIGURATION.CHOOSE_ASSIGN_STEP.ID}
            placeholder={ADDITIONAL_CONFIGURATION.CHOOSE_ASSIGN_STEP.PLACEHOLDER}
            optionList={stepsList}
            onChange={(e) =>
              e?.target?.label !== failureAction?.action_next_step_name && onSelectFailureStep(e)}
            selectedValue={stepsList.find((s) => s.value === failureAction?.next_step_uuid?.[0])?.label}
            errorMessage={additionConfigErrorList?.failureAction}
            setSelectedValue
            strictlySetSelectedValue
            isRequired
            loadData={() => getAllSteps(flowData.flow_id, currentIntegrationData?._id, null, false, {}, [STEP_TYPE.END_FLOW])}
          />
        </div>
      }
    </>
  );
}

const mapStateToProps = ({ EditFlowReducer }) => {
  return {
    integerationList: EditFlowReducer.flowData.integerationList,
    integration_details: EditFlowReducer.flowData.integration_details,
    confirm_test: EditFlowReducer.flowData.confirm_test,
    flowData: EditFlowReducer.flowData,
    detailedFlowErrorInfo: EditFlowReducer.detailedFlowErrorInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFlowData: (...params) => {
      dispatch(updateFlowDataChange(...params));
    },
    onGetAllFieldsByFilter: (
      paginationData,
      setStateKey,
      mapping,
    ) => {
      dispatch(
        getTriggerMappingFields(
          paginationData,
          setStateKey,
          mapping,
        ),
      );
    },
    updateFlowStateChange,
    getAllSteps: (...params) => {
      dispatch(getAllStepsListThunk(...params));
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddditionConfig));
