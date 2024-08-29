import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { Button } from '@workhall-pvt-lmt/wh-ui-library';
import ConfigModal from '../../../../../components/config_modal/ConfigModal';
import GeneralConfiguration from './general/GeneralConfiguration';
import { DATA_MANIPULATOR_STEP_CONFIGURATION } from './DataManipulator.strings';
import StatusDropdown from '../status_dropdown/StatusDropdown';
import { constructManipulatorStepData, constructManipulatorStepPostData, getManipulationValidationData } from './DataManipulator.utils';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../node_configuration/use_node_reducer/useNodeReducer';
import {
  cloneDeep,
  isEmpty,
} from '../../../../../utils/jsUtility';
import NodeConfigError from '../../../node_configuration/node_config_error/NodeConfigError';
import { DELETE_STEP_LABEL, EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { validate } from '../../../../../utils/UtilityFunctions';
import styles from './DataManipulator.module.scss';
import { getAccountConfigurationDetailsApiService } from '../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { NODE_CONFIG_TABS, NODE_RESPONSE_FIELD_KEYS } from '../../../node_configuration/NodeConfiguration.constants';
import { displayErrorBasedOnActiveTab, getErrorTabsList, saveStepCommonData, updateLoaderStatus } from '../../../node_configuration/NodeConfiguration.utils';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { manipulatorStepValidationSchema } from './DataManipulator.validate.schema';
import { CONFIG_BUTTON_ARRAY } from '../end_step/EndStepConfig.constants';

function DataManipulator(props) {
  const {
    stepId,
    updateFlowStateChange,
    metaData: { flowId },
    isLoadingNodeDetails,
    saveStepNode,
    isErrorInLoadingNodeDetails,
    getStepNodeDetails,
    onDeleteStepClick,
    steps = [],
    allSystemFields,
  } = props;

  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(NODE_CONFIG_TABS.GENERAL);

  const { state, dispatch } = useFlowNodeConfig();

  const { errorList = {}, stepStatus = EMPTY_STRING, stepName, mappingErrorList = {} } = state;

  let currentTabDetails = null;

  const getManipulatorNodeDetails = async () => {
    try {
      const apiStepDetails = await getStepNodeDetails(stepId);
        const stepData = constructManipulatorStepData(apiStepDetails);
        dispatch(
          nodeConfigDataChange({
            ...stepData,
            isLoadingNodeDetails: false,
            steps: steps,
          }),
        );
        updateLoaderStatus(false);
      } catch (e) {
        updateLoaderStatus(false);
        dispatch(
          nodeConfigDataChange({
            isLoadingNodeDetails: false,
            isErrorInLoadingNodeDetails: true,
          }),
        );
      }
  };

  useEffect(() => {
    if (!isEmpty(stepId)) {
      getManipulatorNodeDetails();
    }
  }, [stepId]);

  useEffect(() => {
    getAccountConfigurationDetailsApiService().then(
      (response) => {
        dispatch(
          nodeConfigDataChange({
            userProfileData: response,
          }),
        );
      },
      (error) => {
        console.log(error);
      },
    );
    }, []);

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

  const closeDataManipulatorConfiguration = () => {
    updateFlowStateChange({
      selectedStepType: null,
      activeStepId: null,
      isNodeConfigOpen: false,
    });
  };

    const validateManipulationDetails = (manipulationData, isSaveClicked = false) => {
      const data = !isEmpty(manipulationData) ? manipulationData : state?.manipulationDetails;
      console.log('get checked errors', data, manipulationData, state);
      const validationData = {
        ...getManipulationValidationData(cloneDeep(data) || [], state?.flowFields, t),
        ...(isSaveClicked) ? {
          ...saveStepCommonData(state),
        } : {},
      };
      const errorList = validate(validationData, manipulatorStepValidationSchema(t, isSaveClicked), t);
      return errorList;
    };

    const onDataChangeHandler = (data) => {
      console.log('get checked errors1', data);
      if (!isEmpty(errorList)) {
        const updatedErrorList = validateManipulationDetails(
          cloneDeep(data),
        );
        dispatch(
          nodeConfigDataChange({
              manipulationDetails: cloneDeep(data),
              errorList: updatedErrorList,
          }),
        );
      } else {
        dispatch(
          nodeConfigDataChange({
              manipulationDetails: cloneDeep(data),
          }),
        );
      }
    };

  if (!isLoadingNodeDetails) {
    if (isErrorInLoadingNodeDetails) {
      currentTabDetails = (
        <NodeConfigError />
      );
    } else if (tabIndex === NODE_CONFIG_TABS.GENERAL) {
      currentTabDetails = (
        <GeneralConfiguration
          onDataChangeHandler={onDataChangeHandler}
          allSystemFields={allSystemFields}
        />
      );
    } else if (tabIndex === NODE_CONFIG_TABS.ADDITIONAL) {
      currentTabDetails = (
        <StatusDropdown
          selectedValue={stepStatus}
          onChangeHandler={onStepNameChangeHandler}
          stepName={stepName}
          stepNameError={errorList?.stepName}
          onClickHandler={
            (value) => onStatusChangeHandler(NODE_RESPONSE_FIELD_KEYS.STEP_STATUS, value)}
        />
      );
    }
  }

    const handleServerErrors = (errorList) => {
      dispatch(nodeConfigDataChange({
        errorList,
      }));
    };

    const removeEmptyStrings = (obj) =>
      Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value !== ''),
    );

    const onSaveClicked = () => {
      const validationErrorList = validateManipulationDetails({}, true);
      const cleanedMappingErrorList = removeEmptyStrings(mappingErrorList);
      if (isEmpty(validationErrorList) && isEmpty(cleanedMappingErrorList)) {
        const postData = constructManipulatorStepPostData({ ...state, flow_id: flowId }, t);
        saveStepNode(
          postData,
          handleServerErrors,
        )
        .then((response) => {
          console.log('DataManipulatorResponse', response);
            updateFlowStateChange({
              isNodeConfigOpen: false,
              activeStepId: null,
            });
        })
        .catch((error) => {
          console.log('DataManipulatorerror', error);
        });
      } else {
        displayErrorBasedOnActiveTab(
          tabIndex,
          state?.stepType,
          validationErrorList,
          t,
        );
      }
      dispatch(nodeConfigDataChange({
        errorList: validationErrorList,
        isSaveClicked: true,
      }));
    };

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
    <ConfigModal
      isModalOpen
      errorTabList={state?.isSaveClicked && getErrorTabsList(
        state?.stepType,
        state?.errorList,
        state?.mappingErrorList,
      )}
      tabOptions={DATA_MANIPULATOR_STEP_CONFIGURATION(t).TAB_OPTIONS}
      onCloseClick={closeDataManipulatorConfiguration}
      modalBodyContent={currentTabDetails}
      modalTitle={DATA_MANIPULATOR_STEP_CONFIGURATION(t).TITLE}
      currentTab={tabIndex}
      onTabSelect={(value) => setTabIndex(value)}
      customModalClass={styles.CustomModalClass}
      footercontent={footerContent}
      footerButton={CONFIG_BUTTON_ARRAY(onSaveClicked, closeDataManipulatorConfiguration, t)}
    />
  );
}

export default DataManipulator;
