import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import ConfigModal from '../../../../../components/config_modal/ConfigModal';
import {
  CALL_ANOTHER_FLOW_STRINGS,
  TRIGGER_CONFIG_TAB,
} from './CallAnotherFlow.strings';
import CallAnotherFlowGeneral from './CallAnotherFlowGeneral';
import CallAnotherFlowAddditional from './CallAnotherFlowAdditional';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../node_configuration/use_node_reducer/useNodeReducer';
import { isEmpty } from '../../../../../utils/jsUtility';
import { TRIGGER_RESPONSE_KEYS, TRIGGER_STEP_INITIAL_STATE } from './CallAnotherFlow.constants';
import { dataLossAlertPopover, displayErrorBasedOnActiveTab, getErrorTabsList, saveStepCommonData } from '../../../node_configuration/NodeConfiguration.utils';
import { DELETE_STEP_LABEL, EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { validate } from '../../../../../utils/UtilityFunctions';
import {
  formatGetCallSubFlowData,
  getTriggerNodePostData,
  triggerStepValidateData,
} from './CallAnotherFlow.utils';
import NodeConfigError from '../../../node_configuration/node_config_error/NodeConfigError';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';
import styles from './CallAnotherFlow.module.scss';
import { triggerMappingSchema, triggerStepValidationSchema } from './CallAnotherFlow.validation.schema';
import { CONFIG_BUTTON_ARRAY } from '../end_step/EndStepConfig.constants';
import { getAccountConfigurationDetailsApiService } from '../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { VALIDATION_CONSTANT } from '../../../../../utils/constants/validation.constant';

function CallAnotherFlow(props) {
  const {
    stepId,
    metaData,
    isLoadingNodeDetails,
    isErrorInLoadingNodeDetails,
    getStepNodeDetails,
    saveStepNode,
    updateFlowStateChange,
    onDeleteStepClick,
    steps,
    allSystemFields,
  } = props;

  const {
    IS_MNI,
  } = TRIGGER_RESPONSE_KEYS;

  const { t } = useTranslation();

  const {
    state,
    dispatch,
  } = useFlowNodeConfig();

  const { mniUuid } = state;

  const [currentTab, setCurrentTab] = useState(NODE_CONFIG_TABS.GENERAL);

  const onCloseTriggerModal = () => {
    updateFlowStateChange({
      isNodeConfigOpen: false,
      activeStepId: null,
    });
    dispatch(
      nodeConfigDataChange({
        ...TRIGGER_STEP_INITIAL_STATE,
      },
    ));
  };

  const getCallSubFlowNodeDetails = async () => {
    try {
      const response = await getStepNodeDetails(stepId);
      const accountConfigData =
        await getAccountConfigurationDetailsApiService();

      const staticValueDetails = {
        maximumFileSize: accountConfigData?.maximum_file_size,
        allowedExtensions: accountConfigData?.allowed_extensions,
        allowedCurrencyList: accountConfigData?.allowed_currency_types,
        defaultCurrencyType: accountConfigData?.default_currency_type,
        defaultCountryCode: accountConfigData?.default_country_code,
      };
      const formattedResponse = formatGetCallSubFlowData(response);
      console.log('responseGetTriggerNodedetails', response);
      const errorList = {};
      if (formattedResponse?.childFlowUuid && !formattedResponse?.childFlowName) {
        errorList.childFlowUuid = t(VALIDATION_CONSTANT.CHILD_FLOW_DELETED);
      }
      dispatch(
        nodeConfigDataChange({
          ...formattedResponse,
          ...staticValueDetails,
          errorList,
        }),
      );
    } catch (error) {
      console.log(error, 'CallAnotherFlow_getAPIError');
    }
  };

  useEffect(() => {
    getCallSubFlowNodeDetails();
  }, []);

  console.log('state_callAnotherFlow', state, 'props', props);

  const handleServerErrors = (errorList) => {
    dispatch(nodeConfigDataChange({
      errorList,
    }));
  };

  const onSaveTriggerStep = () => {
    const commonStepData = saveStepCommonData(state);
    const triggerStepData = triggerStepValidateData(state);
    const dataToBeValidated = { ...commonStepData, ...triggerStepData };
    const errorList = validate(dataToBeValidated, triggerStepValidationSchema(t));
    const mappingErrorList = validate(dataToBeValidated?.mapping, triggerMappingSchema(t));
    if (state?.childFlowUuid && !state?.childFlowName) {
      errorList.childFlowUuid = t(VALIDATION_CONSTANT.CHILD_FLOW_DELETED);
    }
    console.log('onSaveTriggerStep_errorList', errorList, 'dataToBeValidated', dataToBeValidated, 'triggerStepData', triggerStepData);
    if (isEmpty(errorList) && isEmpty(mappingErrorList)) {
      const postData = getTriggerNodePostData(state);
      console.log('postData_trigger', postData);
      saveStepNode(
        postData,
        handleServerErrors,
      )
        .then((response) => {
          console.log('saveStepResponse', response);
          onCloseTriggerModal();
        })
        .catch((error) => {
          console.log('saveStepTriggerError', error);
        });
    } else {
      displayErrorBasedOnActiveTab(
        currentTab,
        state?.stepType,
        errorList,
        t,
        mappingErrorList,
      );
    }
    dispatch(nodeConfigDataChange({
      errorList,
      mappingErrorList,
      isSaveClicked: true,
    }));
  };

  const onCheckboxClick = (id) => {
    const currentValue = state?.[id];
    if (id === IS_MNI) {
      if (!isEmpty(mniUuid)) {
        dataLossAlertPopover({
          title: 'Data Loss',
          subTitle: 'Do you need to proceed?',
          onYesHandlerAdditionalFunc: () => {
            dispatch(nodeConfigDataChange({
              [id]: !currentValue,
              [TRIGGER_RESPONSE_KEYS.ITERATE_FIELD_UUID]: EMPTY_STRING,
              [`${TRIGGER_RESPONSE_KEYS.ITERATE_FIELD_UUID}Label`]: EMPTY_STRING,
              [TRIGGER_RESPONSE_KEYS.MAPPING]: [],
            }));
          },
        });
      } else {
        dispatch(
          nodeConfigDataChange({
            [id]: !currentValue,
            [TRIGGER_RESPONSE_KEYS.ITERATE_FIELD_UUID]: EMPTY_STRING,
            [`${TRIGGER_RESPONSE_KEYS.ITERATE_FIELD_UUID}Label`]: EMPTY_STRING,
            [TRIGGER_RESPONSE_KEYS.MAPPING]: [],
          }),
        );
      }
    } else {
      dispatch(
        nodeConfigDataChange({
          [id]: !currentValue,
        }),
      );
    }
  };

  let modalContent = null;
  if (!isLoadingNodeDetails) {
    if (isErrorInLoadingNodeDetails) {
      modalContent = (
        <NodeConfigError />
      );
    } else if (currentTab === NODE_CONFIG_TABS.GENERAL) {
      modalContent = (
        <CallAnotherFlowGeneral
          metaData={metaData}
          onCheckboxClick={onCheckboxClick}
          steps={steps}
          allSystemFields={allSystemFields}
        />
      );
    } else {
      modalContent = (
        <CallAnotherFlowAddditional
          onCheckboxClick={onCheckboxClick}
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
        onClickHandler={() => onDeleteStepClick(state?._id)}
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
      modalTitle={CALL_ANOTHER_FLOW_STRINGS(t).MODAL_TITLE}
      modalBodyContent={modalContent}
      onCloseClick={onCloseTriggerModal}
      tabOptions={TRIGGER_CONFIG_TAB(t)}
      footercontent={footerContent}
      onTabSelect={(value) => {
        setCurrentTab(value);
      }}
      customModalClass={styles.CustomModalClass}
      currentTab={currentTab}
      footerButton={CONFIG_BUTTON_ARRAY(onSaveTriggerStep, onCloseTriggerModal, t)}
    />
  );
}
export default CallAnotherFlow;
