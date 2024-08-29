import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import ConfigModal from '../../../../../components/config_modal/ConfigModal';
import { CONFIG_BUTTON_ARRAY, ENDSTEP_CONFIG_TAB } from '../end_step/EndStepConfig.constants';
import StatusDropdown from '../status_dropdown/StatusDropdown';
import {
  JOIN_NODE_OBJECT_KEYS,
  JOIN_NODE_REQUEST_KEYS,
  JOIN_NODE_RESPONSE_KEYS,
  JOIN_PARALLEL_PATHS_STRINGS,
} from './JoinParallelPaths.constants';
import FieldValueRuleConfig from '../../../../form_configuration/field_value/field_value_rule_config/FieldValueRuleConfig';
import { MODULE_TYPES } from '../../../../../utils/Constants';
import { DELETE_STEP_LABEL, EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { RULE_TYPE } from '../../../../../utils/constants/rule/rule.constant';
import GeneralConfiguration from './general/GeneralConfiguration';
import {
  NODE_CONFIG_TABS,
  NODE_RESPONSE_FIELD_KEYS,
} from '../../../node_configuration/NodeConfiguration.constants';
import NodeConfigError from '../../../node_configuration/node_config_error/NodeConfigError';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../node_configuration/use_node_reducer/useNodeReducer';
import styles from './JoinParallelPaths.module.scss';
import { formatJoinParallelPathsApiData, getFormattedStepDetails, joinStepValidationData, saveJoinNodePostData } from './JoinParallelPaths.utils';
import { normalizer } from '../../../../../utils/normalizer.utils';
import { getInputSteps } from '../../../../../axios/apiService/form.apiService';
import { validate } from '../../../../../utils/UtilityFunctions';
import { joinParallelPathValidationSchema } from './JoinParallelPaths.validation.schema';
import { displayErrorBasedOnActiveTab, getErrorTabsList } from '../../../node_configuration/NodeConfiguration.utils';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { cloneDeep, isEmpty } from '../../../../../utils/jsUtility';

function JoinParallelPaths(props) {
  const {
    stepId,
    isLoadingNodeDetails,
    isErrorInLoadingNodeDetails,
    getStepNodeDetails,
    updateFlowStateChange,
    steps,
    onDeleteStepClick,
    saveStepNode,
    metaData,
  } = props;
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(NODE_CONFIG_TABS.GENERAL);
  const [isAddConditionModalOpen, SetIsAddConditionModalOpen] = useState(false);

  const {
    state,
    dispatch,
  } = useFlowNodeConfig();

  const onCloseModal = () => {
    updateFlowStateChange({
      isNodeConfigOpen: false,
    });
  };
  const onClose = () => {
    SetIsAddConditionModalOpen(false);
  };

  const updateJoinConfig = (data, errorList) => {
    dispatch(
      nodeConfigDataChange({
        joinConfig: data,
        errorList,
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
    console.log('onStepNameChangeEvent_Parallel', e, 'value', value, 'errors', errors, 'id', id);
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

  const currentJoinNodeDetails = steps?.find((eachStep) => eachStep?._id === stepId);
  const stepUuid = currentJoinNodeDetails?.step_uuid;

  const getStepsList = async (data) => {
    try {
      const response = await getInputSteps(data);
      const rawData = normalizer(
        { stepsList: response },
        JOIN_NODE_REQUEST_KEYS,
        JOIN_NODE_RESPONSE_KEYS,
      );
      const stepsList = rawData?.stepsList;
      const formattedStepDetails = getFormattedStepDetails(stepsList);
      dispatch(nodeConfigDataChange({ stepsList: formattedStepDetails }));
      return formattedStepDetails;
    } catch (e) {
      console.log('getStepsListerror', e);
      return [];
    }
  };

  const onStatusChangeHandler = (id, value) => {
    dispatch(
      nodeConfigDataChange({
        [id]: value,
      }),
    );
  };

  const getJoinNodeDetails = async () => {
    try {
      const formattedStepDetails = await getStepsList({ flow_id: metaData.flowId, step_uuid: stepUuid });
      const response = await getStepNodeDetails(stepId);
      dispatch(nodeConfigDataChange({
        ...formatJoinParallelPathsApiData(response, formattedStepDetails),
      }));
    } catch (error) {
      console.log(error, 'CallAnotherFlow_getAPIError');
    }
  };

  const handleServerErrors = (errorList) => {
    dispatch(nodeConfigDataChange({
      errorList,
    }));
  };

  const onSaveClicked = () => {
    const validSteps = cloneDeep(state?.stepsList || []).map((step) => step.stepUuid);
    const errorList = validate(joinStepValidationData(state), joinParallelPathValidationSchema(t, validSteps));
    dispatch(nodeConfigDataChange({
      errorList,
      isSaveClicked: true,
    }));
    if (isEmpty(errorList)) {
      const postData = saveJoinNodePostData({ ...state, flow_id: metaData.flowId }, t);
      saveStepNode(postData, handleServerErrors)
        .then(() => {
          updateFlowStateChange({
            isNodeConfigOpen: false,
            activeStepId: null,
          });
        })
        .catch((error) => {
          console.log('save step error', error);
        });
    } else {
      displayErrorBasedOnActiveTab(currentTab, state?.stepType, errorList, t);
    }
  };

  useEffect(() => {
    getJoinNodeDetails();
  }, []);

  let currentTabDetails = null;
  if (!isLoadingNodeDetails) {
    if (isErrorInLoadingNodeDetails) {
      currentTabDetails = (
        <NodeConfigError />
      );
    } else if (currentTab === NODE_CONFIG_TABS.GENERAL) {
      currentTabDetails = (
        <GeneralConfiguration
          configData={state?.joinConfig}
          stepUuid={state?.stepUuid}
          metaData={metaData}
          updateJoinConfig={updateJoinConfig}
          stepsList={state?.stepsList}
          errorList={state?.errorList}
          parentKey={JOIN_NODE_OBJECT_KEYS.parentKey}
          index={0}
        />
      );
    } else {
      currentTabDetails = (
        <StatusDropdown
          selectedValue={state?.stepStatus}
          onChangeHandler={onStepNameChangeHandler}
          stepName={state?.stepName}
          stepNameError={state?.errorList?.stepName}
          onClickHandler={(value) =>
            onStatusChangeHandler(NODE_RESPONSE_FIELD_KEYS.STEP_STATUS, value)
          }
        />
      );
    }
  }

  const footerContent = (
    <div className={gClasses.MRA}>
      <Button
        buttonText={t(DELETE_STEP_LABEL)}
        noBorder
        className={styles.DeleteStepButton}
        onClickHandler={() => onDeleteStepClick(stepId)}
      />
    </div>
  );

  return (
    <>
      <ConfigModal
        isModalOpen
        errorTabList={state?.isSaveClicked && getErrorTabsList(
          state?.stepType,
          state?.errorList,
        )}
        modalTitle={JOIN_PARALLEL_PATHS_STRINGS(t).MODAL_TITLE}
        modalBodyContent={currentTabDetails}
        onCloseClick={onCloseModal}
        tabOptions={ENDSTEP_CONFIG_TAB(t)}
        onTabSelect={(value) => setCurrentTab(value)}
        currentTab={currentTab}
        footercontent={footerContent}
        footerButton={CONFIG_BUTTON_ARRAY(onSaveClicked, onCloseModal, t)}
      />
      {
        isAddConditionModalOpen && (
          <FieldValueRuleConfig
            isModalOpen={isAddConditionModalOpen}
            moduleType={MODULE_TYPES.FLOW}
            ruleType={RULE_TYPE.DEFAULT_VALUE}
            setIsModalOpen={SetIsAddConditionModalOpen}
            onClose={onClose}
            metaData={{}}
            fields={[]}
            fieldData={{}}
            sectionUUID={EMPTY_STRING}
            overAllLayout={[]}
            onSave={null}
            onDelete={null}
            dispatch={() => { }}
            noOfFields={0}
          />
        )
      }
    </>
  );
}

export default JoinParallelPaths;
