import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import ConfigModal from '../../../../../components/config_modal/ConfigModal';
import { cloneDeep, isEmpty } from '../../../../../utils/jsUtility';
import { DELETE_STEP_LABEL, EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import SendEmailGeneral from './general/SendEmailGeneral';
import SendEmailAdditional from './additional/SendEmailAdditional';
import { SEND_EMAIL_CONFIG_CONSTANTS } from './SendEmailConfig.string';
import {
  ALLOW_MAIL_BODY_STEP_SYSTEM_FIELDS,
  ALLOW_MAIL_BODY_SYSTEM_FIELDS,
  ALLOW_MAIL_SUBJECT_SYSTEM_FIELDS,
  ASSIGNEES_FLOW_SYSTEM_FIELDS,
  ASSIGNEES_STEP_SYSTEM_FIELDS,
  NODE_CONFIG_TABS,
} from '../../../node_configuration/NodeConfiguration.constants';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../node_configuration/use_node_reducer/useNodeReducer';
import { constructInsertFieldsList, displayErrorBasedOnActiveTab, formatAllFieldsList, getErrorTabsList, getSystemFieldsList, saveStepCommonData, validateAssigneesData } from '../../../node_configuration/NodeConfiguration.utils';
import {
  constructGetApiEmailActions,
  constructSendEmailPostData,
  emailActionValidateData,
  getParsedValueForEmailTemplate,
  getStaticDocValue,
} from './SendEmailConfig.utils';
import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';
import { validate } from '../../../../../utils/UtilityFunctions';
import { emailNodeValidationSchema } from './SendEmailConfig.validation.schema';
import { EMAIL_CONSTANTS, MAIL_RECIPIENT_OBJECT_KEYS, SEND_EMAIL_INITIAL_STATE } from './SendEmailConfig.constants';
import NodeConfigError from '../../../node_configuration/node_config_error/NodeConfigError';
import styles from './SendEmailConfig.module.scss';
import { CONFIG_BUTTON_ARRAY } from '../end_step/EndStepConfig.constants';
import useApiCall from '../../../../../hooks/useApiCall';
import { apiGetAllFieldsList } from '../../../../../axios/apiService/flow.apiService';
import { FIELD_LIST_TYPE, FIELD_TYPE, INITIAL_PAGE } from '../../../../../utils/constants/form.constant';

function SendEmailConfig(props) {
  const {
    emailActionId,
    saveStepNode,
    getStepNodeDetails,
    steps = [],
    metaData,
    stepId,
    isLoadingNodeDetails,
    isErrorInLoadingNodeDetails,
    onDeleteStepClick,
    updateFlowStateChange,
    isAddOnConfig,
    actions,
    closeAddOnConfig,
    allSystemFields,
  } = props;

  const [isFieldsLoaded, setIsFieldsLoaded] = useState(false);
  const { data: allFields, fetch: getAllFields, isLoading: isLoadingAllFields } = useApiCall({}, true, formatAllFieldsList);

  const { t } = useTranslation();
  const id = isAddOnConfig ? emailActionId : stepId;
  const editorRef = useRef(null);
  const emailSubjectRef = useRef(null);
  const [tabIndex, setTabIndex] = useState(NODE_CONFIG_TABS.GENERAL);
  const [sendEmailLocalState, setSendEmailLocalState] = useState(
    {
      subject: EMPTY_STRING,
      description: EMPTY_STRING,
      dynamicDocFields: [],
      dynamicDocFieldsLabel: [],
    },
  );
  const { SEND_EMAIL_TAB, TITLE, ADDON_CONFIG_TITLE } = SEND_EMAIL_CONFIG_CONSTANTS(t);
  let currentTabDetails = null;

  const {
    state,
    dispatch,
  } = useFlowNodeConfig();
  const {
    emailActions = {},
    parsedEmailSubject,
    parsedEmailBody,
    emailActions: {
      emailSubject,
      emailBody,
    },
  } = state;
  console.log('state_sendemailConfig', state, 'props', props);

  const recipientSystemFields = getSystemFieldsList({
    allSystemFields,
    allowedSystemFields: ASSIGNEES_FLOW_SYSTEM_FIELDS,
    steps,
    allowedStepSystemFields: ASSIGNEES_STEP_SYSTEM_FIELDS,
  });

  const closeSendEmail = () => {
    if (isAddOnConfig) {
      closeAddOnConfig();
    } else {
      updateFlowStateChange({
        isNodeConfigOpen: false,
        activeStepId: null,
        selectedStepType: null,
      });
    }
    dispatch(
      nodeConfigDataChange({
        ...SEND_EMAIL_INITIAL_STATE,
      },
      ));
  };

  const getAllFieldsList = () => {
    const params = {
        page: INITIAL_PAGE,
        size: 1000,
        sort_by: 1,
        flow_id: metaData?.flowId,
        field_list_type: FIELD_LIST_TYPE.DIRECT,
        ignore_field_types: [
          FIELD_TYPE.FILE_UPLOAD,
          FIELD_TYPE.INFORMATION,
          FIELD_TYPE.TABLE,
          FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
          FIELD_TYPE.USER_PROPERTY_PICKER,
        ],
        include_property_picker: 1,
    };
    getAllFields(apiGetAllFieldsList(params));
    setIsFieldsLoaded(true);
};

  const insertFieldsList = constructInsertFieldsList({
    allFields,
    steps,
    allSystemFields,
    allowedSystemFields: ALLOW_MAIL_BODY_SYSTEM_FIELDS,
    t,
    allowedStepSystemFields: ALLOW_MAIL_BODY_STEP_SYSTEM_FIELDS,
  });

  const subjectInsertFieldsList = constructInsertFieldsList({
    allFields,
    steps,
    allSystemFields,
    allowedSystemFields: ALLOW_MAIL_SUBJECT_SYSTEM_FIELDS,
    t,
  });

  const getSendEmailNodeDetails = async () => {
    if (!isEmpty(id)) {
      try {
        const response = await getStepNodeDetails(id);
        const { docList: uploadedFiles, refUuid: emailConfigRefUuid } = getStaticDocValue(response?.document_url_details);
        const { emailActions } = constructGetApiEmailActions(
          isAddOnConfig ? response?.flow_step?.email_actions : response?.email_actions?.[0],
          response?.field_details || response?.field_metadata,
          recipientSystemFields,
          actions,
          cloneDeep(insertFieldsList),
        );
        console.log(emailActions, 'response_getSendEmailNodeDetails', response, 'uploadedFiles', uploadedFiles);
        dispatch(nodeConfigDataChange({
          flowId: metaData.flowId,
          stepUuid: metaData?.stepUuid || response.step_uuid,
          stepId: stepId,
          stepName: response?.step_name,
          stepType: response?.step_type,
          stepOrder: response?.step_order,
          stepStatus: response?.step_status || DEFAULT_STEP_STATUS,
          emailActions: emailActions,
          uploadedFiles,
          emailConfigRefUuid,
        }));
      } catch (error) {
        console.log(error, 'SendEmail_getAPIError');
      }
    } else {
      dispatch(nodeConfigDataChange({
        flowId: metaData.flowId,
        stepId: stepId,
        stepUuid: metaData.stepUuid,
      }));
    }
  };

  useEffect(() => {
    if (isFieldsLoaded && !isLoadingAllFields) {
      getSendEmailNodeDetails();
    }
  }, [isFieldsLoaded, isLoadingAllFields]);

  useEffect(() => {
    getAllFieldsList();
  }, []);

  const onChangeHandler = (event) => {
    const sendEmailData = cloneDeep(sendEmailLocalState);
    const {
      target: { id, value },
    } = event;
    sendEmailData[id] = value;
    setSendEmailLocalState(sendEmailData);
  };

  const handleServerErrors = (errorList) => {
    dispatch(nodeConfigDataChange({
      errorList,
    }));
  };

  const updateRecipientsData = (recipientsData, id) => {
    const clonedActions = cloneDeep(emailActions);
    const additionalData = {};
    clonedActions[id] = recipientsData;
    if (!isEmpty(state?.[`${id}ErrorList`])) {
      const { errorList } = validateAssigneesData(recipientsData, { ...MAIL_RECIPIENT_OBJECT_KEYS, parentKey: id }, id === EMAIL_CONSTANTS.RECIPIENTS, t);
      additionalData[`${id}ErrorList`] = errorList;
    }
    dispatch(
      nodeConfigDataChange({
        ...additionalData,
        emailActions: clonedActions,
      }),
    );
  };

  const onSaveSendEmail = () => {
    const commonStepData = isAddOnConfig ?
      {
        stepId: state.stepId,
        stepUuid: state.stepUuid,
      } :
      saveStepCommonData(state);
    const emailActionData = emailActionValidateData(
      emailActions,
      isAddOnConfig,
      {
        emailSubjectRef,
        emailBodyRef: editorRef,
        allFieldsList: allFields || [],
        insertFieldsList,
        parsedEmailSubject,
        parsedEmailBody,
        tabIndex,
      });
    const dataToBeValidated = { ...commonStepData, emailActions: emailActionData };
    const errorList = validate(dataToBeValidated, emailNodeValidationSchema(isAddOnConfig, t));
    const { errorList: recipientsErrorList } = validateAssigneesData(emailActions?.recipients, { ...MAIL_RECIPIENT_OBJECT_KEYS, parentKey: 'recipients' }, true, t);
    const { errorList: ccRecipientsErrorList } = validateAssigneesData(emailActions?.ccRecipients, { ...MAIL_RECIPIENT_OBJECT_KEYS, parentKey: 'ccRecipients' }, false, t);
    console.log('errorListSaveemail', emailActionData, errorList, 'dataToBeValidated', dataToBeValidated, 'recipientsErrorList', recipientsErrorList, 'ccRecipientsErrorList', ccRecipientsErrorList);
    dispatch(
      nodeConfigDataChange({
        errorList: errorList,
        recipientsErrorList,
        ccRecipientsErrorList,
        isSaveClicked: true,
      }),
    );
    if (isEmpty(errorList) &&
      isEmpty(recipientsErrorList) &&
      isEmpty(ccRecipientsErrorList)
    ) {
      const postData = constructSendEmailPostData(
        state,
        isAddOnConfig,
        {
          emailSubjectRef,
          emailBodyRef: editorRef,
          allFieldsList: allFields || [],
          insertFieldsList,
          parsedEmailSubject,
          parsedEmailBody,
          tabIndex,
        },
      );
      saveStepNode(postData, handleServerErrors)
        .then(() => {
          closeSendEmail();
        })
        .catch((error) => {
          console.log('saveStepSendEmailError', error);
        });
    } else if (!isAddOnConfig) {
      displayErrorBasedOnActiveTab(
        tabIndex,
        state?.stepType,
        { ...errorList, ...recipientsErrorList, ...ccRecipientsErrorList },
        t,
      );
    }
  };

  if (!isLoadingNodeDetails) {
    if (isErrorInLoadingNodeDetails) {
      currentTabDetails = (
        <NodeConfigError />
      );
    } else {
      if (tabIndex === NODE_CONFIG_TABS.ADDITIONAL) {
        currentTabDetails = (
          <SendEmailAdditional />
        );
      } else {
        currentTabDetails = (
          <SendEmailGeneral
            steps={steps}
            metaData={metaData}
            onChangeHandler={onChangeHandler}
            recipientSystemFields={recipientSystemFields}
            updateRecipientsData={updateRecipientsData}
            isAddOnConfig={isAddOnConfig}
            actions={actions}
            editorRef={editorRef}
            emailSubjectRef={emailSubjectRef}
            allFields={allFields}
            isLoadingAllFields={isLoadingAllFields}
            insertFieldsList={insertFieldsList}
            subjectInsertFieldsList={subjectInsertFieldsList}
          />
        );
      }
    }
  }

  const footerContent = !isAddOnConfig && (
    <div className={gClasses.MRA}>
      <Button
        buttonText={t(DELETE_STEP_LABEL)}
        noBorder
        className={styles.DeleteStepButton}
        onClickHandler={() => onDeleteStepClick(id)}
      />
    </div>
  );

  const onTabSelect = (tabValue) => {
    if (tabValue === NODE_CONFIG_TABS.ADDITIONAL) {
      const parsedEmailSubject = getParsedValueForEmailTemplate(
        emailSubject,
        emailSubjectRef,
        allFields || [],
        insertFieldsList?.[1]?.subMenuItems,
        true,
      )?.htmlContent || EMPTY_STRING;

      const parsedEmailBody = getParsedValueForEmailTemplate(
        emailBody,
        editorRef,
        allFields || [],
        insertFieldsList?.[1]?.subMenuItems,
      )?.htmlContent || EMPTY_STRING;

      dispatch(
        nodeConfigDataChange({
          parsedEmailSubject,
          parsedEmailBody,
        }),
      );
    } else {
      dispatch(
        nodeConfigDataChange({
          parsedEmailSubject: null,
          parsedEmailBody: null,
        }),
      );
    }

    setTabIndex(tabValue);
  };

  return (
    <ConfigModal
      isModalOpen
      errorTabList={state?.isSaveClicked && getErrorTabsList(
        state?.stepType,
        state?.errorList,
      )}
      customModalClass={styles.SendEmailModal}
      modalBodyContent={currentTabDetails}
      onCloseClick={closeSendEmail}
      modalTitle={isAddOnConfig ? ADDON_CONFIG_TITLE : TITLE}
      tabOptions={SEND_EMAIL_TAB}
      hideTabs={isAddOnConfig}
      currentTab={tabIndex}
      onTabSelect={onTabSelect}
      footercontent={footerContent}
      footerButton={CONFIG_BUTTON_ARRAY(onSaveSendEmail, closeSendEmail, t)}
    />
  );
}

export default SendEmailConfig;
