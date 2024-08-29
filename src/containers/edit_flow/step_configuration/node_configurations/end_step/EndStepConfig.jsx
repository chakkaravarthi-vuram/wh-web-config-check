import React, { useState, useEffect } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import {
  Button,
  Checkbox,
  ECheckboxSize,
  RadioGroup,
  RadioGroupLayout,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import styles from './EndStepConfig.module.scss';
import ConfigModal from '../../../../../components/config_modal/ConfigModal';
import {
  ENDSTEP_RADIO_OPTIONS,
  ENDSTEP_CONFIG_TAB,
  ENDSTEP_CONFIG_STRINGS,
  CONFIG_BUTTON_ARRAY,
  RESPONSE_FIELD_KEYS,
  TERMINATE_FLOW_TYPE,
} from './EndStepConfig.constants';
import StatusDropdown from '../status_dropdown/StatusDropdown';
import { constructEndStepPostData, endStepCommonValidateData } from './EndStepConfig.utils';
import { validate } from '../../../../../utils/UtilityFunctions';
import { endStepValidationSchema } from './EndStepConfiguration.validation.schema';
import { CANCEL_INSTANCE, NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';
import { DEFAULT_END_STEP_STATUS } from '../../../EditFlow.constants';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../node_configuration/use_node_reducer/useNodeReducer';
import {
  displayErrorBasedOnActiveTab,
  getErrorTabsList,
} from '../../../node_configuration/NodeConfiguration.utils';
import NodeConfigError from '../../../node_configuration/node_config_error/NodeConfigError';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { cloneDeep, isEmpty } from '../../../../../utils/jsUtility';

function EndStepConfig(props) {
  const { updateFlowStateChange, stepId, onDeleteStepClick, getStepNodeDetails, saveStepNode,
    isLoadingNodeDetails,
    isErrorInLoadingNodeDetails,
    } = props;
  const { t } = useTranslation();
  const { state, dispatch } = useFlowNodeConfig();
  const [currentTab, setCurrentTab] = useState(NODE_CONFIG_TABS.GENERAL);
  const END_STEP_CONFIG = ENDSTEP_CONFIG_STRINGS(t);
  let tabContent = null;

  const getEndNodeDetails = async () => {
    try {
      const response = await getStepNodeDetails(stepId);
      console.log(response, 'End Step get API details');
      dispatch(nodeConfigDataChange({
        flowId: response?.flow_id,
        stepUuid: response?.step_uuid,
        stepId: response?._id,
        stepName: response?.step_name,
        stepOrder: response?.step_order,
        terminateFlow: response.terminate_flow || false,
        terminateType: response?.terminate_type || TERMINATE_FLOW_TYPE.COMPLETE,
      },
      ));
    } catch (error) {
      console.log(error, 'End Step get API Error');
    }
  };

  useEffect(() => {
    getEndNodeDetails();
  }, []);

  const onRadioChangeHandler = (id, value) => {
    dispatch(nodeConfigDataChange({
      [id]: value,
    }));
  };

  const validateData = (updatedData) => {
    const commonDataToBeValidated = endStepCommonValidateData(updatedData);
    const commonErrorList = validate(commonDataToBeValidated, endStepValidationSchema(t));
    return commonErrorList;
  };

  const handleServerErrors = (errorList) => {
    dispatch(nodeConfigDataChange({
      errorList,
    }));
  };

  const onSaveClickHandler = () => {
    const errorList = validateData(state);
    dispatch(nodeConfigDataChange({
      errorList: errorList,
      isSaveClicked: true,
    }));
    if (isEmpty(errorList)) {
      const postData = constructEndStepPostData(state);
      saveStepNode(postData, handleServerErrors)
        .then((response) => {
          console.log('saveendnodeApiResponse', response);
          updateFlowStateChange({ isNodeConfigOpen: false });
        })
        .catch((error) => {
          console.log('saveendnodeApiError', error);
        });
    } else {
      displayErrorBasedOnActiveTab(currentTab, state?.stepType, errorList, t);
    }
  };

  const onStatusChangeHandler = (id, value) => {
    dispatch(
      nodeConfigDataChange({
        [id]: value,
      }),
    );
  };

  const onChangeHandler = (e, isOnBlur) => {
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

  const updateCancelNode = () => {
    dispatch(nodeConfigDataChange({ terminateFlow: !state?.terminateFlow }));
  };

  const onCloseClick = () => {
    updateFlowStateChange({
      selectedStepType: null,
      activeStepId: null,
    });
  };

  if (!isLoadingNodeDetails) {
    if (isErrorInLoadingNodeDetails) {
      tabContent = (
        <NodeConfigError />
      );
    } else {
      if (currentTab === NODE_CONFIG_TABS.GENERAL) {
        tabContent = (
          <>
            <Checkbox
              id={RESPONSE_FIELD_KEYS.TERMINATE_FLOW}
              className={cx(gClasses.MT10, gClasses.MB16)}
              isValueSelected={state?.terminateFlow}
              details={CANCEL_INSTANCE(t).OPTION}
              size={ECheckboxSize.SM}
              onClick={updateCancelNode}
            />
            {
              state?.terminateFlow && (
                <RadioGroup
                  id={RESPONSE_FIELD_KEYS.TERMINATE_TYPE}
                  labelText={END_STEP_CONFIG.GENERAL_TAB_CONTENT.RADIO_GROUP_LABEL}
                  labelClassName={cx(styles.ContentSubTitleClass)}
                  options={ENDSTEP_RADIO_OPTIONS(t)}
                  radioContainerStyle={styles.Gap8Imp}
                  selectedValue={state?.terminateType}
                  onChange={(event, id, value) => onRadioChangeHandler(id, value)}
                  layout={RadioGroupLayout.stack}
                  optionLabelClass={styles.RadioLabelClass}
                />
              )
            }
          </>
        );
      } else {
        tabContent = (
          <StatusDropdown
            instruction={END_STEP_CONFIG.ADDITIONl_CONFIG_CONTENT.DROPDOWN_INSTRUCTION}
            selectedValue={DEFAULT_END_STEP_STATUS}
            hideStatusDropdown
            contentTitle={END_STEP_CONFIG.ADDITIONl_CONFIG_CONTENT.TITLE_CONTENT}
            onChangeHandler={onChangeHandler}
            stepName={state?.stepName}
            stepNameError={state?.errorList?.stepName}
            onClickHandler={
              (value) => onStatusChangeHandler(RESPONSE_FIELD_KEYS.STEP_STATUS, value)}
          />
        );
      }
    }
  }

  const footercontent = (
    <div className={gClasses.MRA}>
      <Button
        buttonText={END_STEP_CONFIG.DELETE_STEP}
        noBorder
        className={styles.DeleteStepButton}
        onClickHandler={() => onDeleteStepClick(stepId)}
      />
    </div>
  );

  return (
    <ConfigModal
      isModalOpen
      errorTabList={state?.isSaveClicked && getErrorTabsList(
        state?.stepType,
        state?.errorList,
      )}
      modalTitle={END_STEP_CONFIG.END_STEP}
      modalBodyContent={tabContent}
      footercontent={footercontent}
      tabOptions={ENDSTEP_CONFIG_TAB(t)}
      onTabSelect={(value) => setCurrentTab(value)}
      currentTab={currentTab}
      footerButton={CONFIG_BUTTON_ARRAY(onSaveClickHandler, onCloseClick, t)}
      onCloseClick={onCloseClick}
    />
  );
}

export default EndStepConfig;
