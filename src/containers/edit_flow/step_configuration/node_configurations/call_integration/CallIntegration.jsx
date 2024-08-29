import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import { Button } from '@workhall-pvt-lmt/wh-ui-library';
import ConfigModal from '../../../../../components/config_modal/ConfigModal';
import GeneralConfiguration from './general/GeneralConfiguration';
import { CALL_INTEGRATION_STRINGS } from './CallIntegration.strings';
import ErrorHandling from './error_handling/ErrorHandling';
import CallIntegrationAdditional from './additional/CallIntegrationAdditional';
import {
  nodeConfigDataChange,
  useFlowNodeConfig,
} from '../../../node_configuration/use_node_reducer/useNodeReducer';
import {
  constructIntegrationPostData,
  constructIntegrationStateData,
  getIntegrationRequestBodyData,
  integrationValidateData,
} from './CallIntegration.utils';
import {
  INSERT_SYSTEM_FIELDS,
  NODE_CONFIG_TABS,
} from '../../../node_configuration/NodeConfiguration.constants';
import {
  displayErrorBasedOnActiveTab,
  getErrorTabsList,
  updateLoaderStatus,
} from '../../../node_configuration/NodeConfiguration.utils';
import NodeConfigError from '../../../node_configuration/node_config_error/NodeConfigError';
import { CALL_INTEGRATION_CONSTANTS } from './CallIntegration.constants';
import { validate } from '../../../../../utils/UtilityFunctions';
import {
  eventHeadersValidationSchema,
  integerationValidationSchema,
  queryParamValidationSchema,
  relativePathValidationSchema,
  requestBodyValidationSchema,
  saveResponseValidationSchema,
} from './CallIntegration.validation.schema';
import { CONFIG_BUTTON_ARRAY } from '../end_step/EndStepConfig.constants';
import { DELETE_STEP_LABEL } from '../../../../../utils/strings/CommonStrings';
import styles from '../send_email/SendEmailConfig.module.scss';
import { getAccountConfigurationDetailsApiService } from '../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { VALIDATION_CONSTANT } from '../../../../../utils/constants/validation.constant';

function CallIntegration(props) {
  const {
    updateFlowStateChange,
    stepId,
    isLoadingNodeDetails,
    isErrorInLoadingNodeDetails,
    getStepNodeDetails,
    saveStepNode,
    metaData,
    steps = [],
    onDeleteStepClick,
    isMLIntegration,
    allSystemFields = {},
  } = props;

  const { t } = useTranslation();
  const { state, dispatch } = useFlowNodeConfig();

  const { TITLE, TABS } = CALL_INTEGRATION_STRINGS(t);

  const [currentTab, setCurrentTab] = useState(NODE_CONFIG_TABS.GENERAL);

  const getUpdateNodeDetails = async () => {
    try {
      const response = await getStepNodeDetails(stepId);
      const accountConfigData =
        await getAccountConfigurationDetailsApiService();

      const stateData = constructIntegrationStateData(response, isMLIntegration);
      Promise.resolve(stateData).then((data) => {
        const stepStatusValue = isEmpty(data?.stepStatus)
          ? CALL_INTEGRATION_CONSTANTS.DEFAULT_STEP_STATUS
          : data?.stepStatus; // default should be in progress for every node(check)
        const errorList = {};
        if (data?.eventUuid && !data?.eventName) {
          errorList.eventUuid = t(VALIDATION_CONSTANT.INTEGRATION_EVENT_DELETED);
        }
        if (data?.connectorUuid && !data?.connectorName) {
          errorList.connectorUuid = t(VALIDATION_CONSTANT.INTEGRATION_DELETED);
        }
        dispatch(
          nodeConfigDataChange({
            ...data,
            stepStatus: stepStatusValue,
            maximumFileSize: accountConfigData?.maximum_file_size,
            allowedExtensions: accountConfigData?.allowed_extensions,
            allowedCurrencyTypes: accountConfigData?.allowed_currency_types,
            defaultCurrencyType: accountConfigData?.default_currency_type,
            defaultCurrencyCode: accountConfigData?.default_country_code,
            isLoadingNodeDetails: false,
            errorList,
          }),
        );
        console.log('Call Integration - data', data);
      });
      updateLoaderStatus(false);
    } catch (error) {
      console.log(error, 'call integration Step get API Error');
    }
  };

  useEffect(() => {
    getUpdateNodeDetails();
  }, []);

  const onCloseModal = () => {
    updateFlowStateChange({
      isNodeConfigOpen: false,
    });
  };

  const validateData = (updatedData) => {
    const commonDataToBeValidated = integrationValidateData(updatedData);
    commonDataToBeValidated.isMLIntegration = isMLIntegration;
    const commonErrorList = validate(
      commonDataToBeValidated,
      integerationValidationSchema(t),
    );
    if (updatedData?.eventUuid && !updatedData?.eventName) {
      commonErrorList.eventUuid = t(VALIDATION_CONSTANT.INTEGRATION_EVENT_DELETED);
    }
    if (updatedData?.connectorUuid && !updatedData?.connectorName) {
      commonErrorList.connectorUuid = t(VALIDATION_CONSTANT.INTEGRATION_DELETED);
    }
    const eventHeaderError = validate(
      commonDataToBeValidated?.eventHeaders || [],
      eventHeadersValidationSchema(t),
    );

    const relativePathError = validate(
      commonDataToBeValidated?.relativePath || [],
      relativePathValidationSchema(t),
    );

    const queryParamError = validate(
      commonDataToBeValidated?.queryParams || [],
      queryParamValidationSchema(t),
    );

    const reqbody =
      getIntegrationRequestBodyData(updatedData?.requestBody, true) || [];

    const requestBodyError = validate(reqbody, requestBodyValidationSchema(t));

    const responseFormatError = validate(
      updatedData?.responseFormat || [],
      saveResponseValidationSchema(t),
    );

    console.log(
      'Call Integration Validate Data',
      reqbody,
      updatedData?.responseBody,
      requestBodyError,
      responseFormatError,
      commonDataToBeValidated,
    );
    return {
      commonErrorList,
      eventHeaderError,
      relativePathError,
      queryParamError,
      requestBodyError,
      responseFormatError,
    };
  };

  const handleServerErrors = (errorList) => {
    dispatch(
      nodeConfigDataChange({
        errorList,
      }),
    );
  };

  const onSaveClickHandler = () => {
    const {
      commonErrorList,
      eventHeaderError,
      relativePathError,
      queryParamError,
      requestBodyError,
      responseFormatError,
    } = validateData(state);

    console.log(
      'Call Integration Error List',
      commonErrorList,
      eventHeaderError,
      relativePathError,
      queryParamError,
      requestBodyError,
      responseFormatError,
    );

    if (
      isEmpty(commonErrorList) &&
      isEmpty(eventHeaderError) &&
      isEmpty(relativePathError) &&
      isEmpty(queryParamError) &&
      isEmpty(requestBodyError) &&
      isEmpty(responseFormatError)
    ) {
      const postData = constructIntegrationPostData(state, isMLIntegration);
      saveStepNode(postData, handleServerErrors)
        .then((response) => {
          updateFlowStateChange({
            isNodeConfigOpen: false,
          });
          console.log('Call Integration Response', response);
        })
        .catch((error) => {
          console.log('Call Integration Error', error);
        });
    } else {
      displayErrorBasedOnActiveTab(
        currentTab,
        state?.stepType,
        commonErrorList,
        t,
        {
          ...eventHeaderError,
          ...relativePathError,
          ...queryParamError,
          ...requestBodyError,
          ...responseFormatError,
        },
      );
    }
    dispatch(
      nodeConfigDataChange({
        errorList: commonErrorList,
        eventHeaderErrorList: eventHeaderError,
        relativePathErrorList: relativePathError,
        queryParamErrorList: queryParamError,
        requestBodyErrorList: requestBodyError,
        responseFormatErrorList: responseFormatError,
        isSaveClicked: true,
      }),
    );
  };

  let currentComponent = null;

  if (!isLoadingNodeDetails) {
    if (isErrorInLoadingNodeDetails) {
      currentComponent = <NodeConfigError />;
    } else {
      switch (currentTab) {
        case NODE_CONFIG_TABS.GENERAL:
          currentComponent = (
            <GeneralConfiguration
              metaData={metaData}
              systemFieldParams={{
                allSystemFields,
                allowedSystemFields: INSERT_SYSTEM_FIELDS,
                allowedStepSystemFields: INSERT_SYSTEM_FIELDS,
                steps: steps,
              }}
              steps={steps}
              isMLIntegration={isMLIntegration}
            />
          );
          break;
        case NODE_CONFIG_TABS.ERROR_HANDLING:
          currentComponent = <ErrorHandling />;
          break;
        case NODE_CONFIG_TABS.ADDITIONAL:
          currentComponent = <CallIntegrationAdditional />;
          break;
        default:
          break;
      }
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
    <ConfigModal
      isModalOpen
      errorTabList={state?.isSaveClicked && getErrorTabsList(
        state?.stepType,
        state?.errorList,
        {
          ...state?.eventHeaderErrorList,
          ...state?.relativePathErrorList,
          ...state?.queryParamErrorList,
          ...state?.requestBodyErrorList,
          ...state?.responseFormatErrorList,
        },
      )}
      modalTitle={TITLE}
      modalBodyContent={currentComponent}
      customModalClass={styles.CustomModalClass}
      onCloseClick={onCloseModal}
      tabOptions={TABS}
      onTabSelect={(value) => setCurrentTab(value)}
      currentTab={currentTab}
      footercontent={footerContent}
      footerButton={CONFIG_BUTTON_ARRAY(onSaveClickHandler, onCloseModal, t)}
    />
  );
}

export default CallIntegration;
