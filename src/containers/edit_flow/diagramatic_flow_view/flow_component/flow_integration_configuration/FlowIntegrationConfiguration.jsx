import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import { BS } from 'utils/UIConstants';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import { keydownOrKeypessEnterHandle, validate } from 'utils/UtilityFunctions';
import { cloneDeep, get, isEmpty, set } from 'utils/jsUtility';
import {
  constructInitialIntegrationPostData,
  constructIntegrationStepSaveData,
  constructRequestPageIntegrationPostData,
  constructSaveResponseIntegrationPostData,
  constructSaveResponsePostData,
  getIntegerationInitalValidationData,
  getIntegerationRequestValidationData,
  getIntegrationRequestBodyData,
  INTEGRATION_METHOD_TYPES,
} from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { basicIntegerationSchema, requestBodyValidationSchema, requestIntegerationSchema, saveResponseValidationSchema } from 'containers/edit_flow/step_configuration/StepConfiguration.validations';
import { ACTION_TYPE } from 'utils/constants/action.constant';
import NewStepper from 'containers/edit_flow/step_configuration/step_components/new_stepper/NewStepper';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { useDispatch, useSelector } from 'react-redux';
import { INTEGRATION_CONSTANTS, getStepperDetails, INTEGRATION_FAILURE_ACTION } from './FlowIntegrationConfiguration.constants';
import styles from './FlowIntegrationConfiguration.module.scss';
import BasicIntegerationConfiguration from './basic_integration_configuration/BasicIntegrationConfiguration';
import IntegerationRequestConfiguration from './integration_request_configuration/IntegrationRequestConfiguration';
import TestIntegration from './test_integration/TestIntegration';
import SaveResponse from './save_response/SaveResponse';
import AdditionalConfig from './additional_config/AdditionalConfig';
import { DELETE_STEP_LABEL } from '../../../../../utils/strings/CommonStrings';
import DependencyHandler from '../../../../../components/dependency_handler/DependencyHandler';
import { getFlowStepDetailsApiThunk } from '../../../../../redux/actions/FlowStepConfiguration.Action';
import { updatePostLoader, setPointerEvent } from '../../../../../utils/UtilityFunctions';
import { normalizer } from '../../../../../utils/normalizer.utils';
import { FOOTER_PARAMS_ID, FOOTER_PARAMS_POST_DATA_ID } from '../../../../form/form_builder/form_footer/FormFooter.constant';
import { displayErrorToast } from '../../../../../utils/flowErrorUtils';
import { FLOW_STRINGS } from '../../../EditFlow.strings';
import { calculateActionButtonName, getConnectedStepsFromActions, INITIAL_ACTION_VALUE } from '../../../EditFlow.utils';
import { STEP_TYPE } from '../../../../../utils/Constants';

function FlowIntegrationConfiguration(props) {
  const {
    currentIntegrationData = {},
    saveStepAPI,
    onDeleteStepClick,
    deleteAction,
    saveStepAction,
  } = props;
  const {
    isLoadingStepDetails,
    flowData,
    flowData: {
      integerationList = [],
      integrationParentId,
      dependency_data,
      dependency_name,
    },
  } = useSelector((state) => state.EditFlowReducer);
  const dispatch = useDispatch();
  const { integration_error_list } = cloneDeep(currentIntegrationData);
  const [currentPage, setCurrentPage] = useState(0);
  const { BASIC_CONFIGURATION, REQUEST_CONFIGURATION, ADDITIONAL_CONFIGURATION } = INTEGRATION_CONSTANTS;
  const [successActions, setSuccessActionsData] = useState([]);
  const [successActionsErrorList, setSuccessActionsErrorList] = useState({});
  const { t } = useTranslation();
  let headerContent = true;
  let modalContent = null;

  useEffect(() => {
    if (currentIntegrationData._id) {
      dispatch(getFlowStepDetailsApiThunk({ stepId: currentIntegrationData._id }, t));
    }
  }, []);

  useEffect(() => {
    const actions = [];
    (currentIntegrationData?.actions || []).forEach((action) => {
      if ([ACTION_TYPE.FORWARD, ACTION_TYPE.END_FLOW].includes(action?.[FOOTER_PARAMS_POST_DATA_ID.ACTION_TYPE])) {
        actions.push(normalizer(action, FOOTER_PARAMS_POST_DATA_ID, FOOTER_PARAMS_ID));
      }
    });
    setSuccessActionsData(actions);
  }, [isLoadingStepDetails]);

  const updateFlowData = (data) => {
    dispatch(updateFlowDataChange(data));
  };

  const updateIntegerationData = (updatedIntegerationData) => {
    updateFlowData({ activeIntegrationData: updatedIntegerationData });
  };

  const updateActions = (actions) => {
    setSuccessActionsData(actions);
    const errorList = cloneDeep(successActionsErrorList);
    const normalizedActions = (actions || []).map((a) =>
      normalizer(a, FOOTER_PARAMS_ID, FOOTER_PARAMS_POST_DATA_ID),
    );
    // update actions in activeStepDetails
    const updatedIntegerationData = cloneDeep(currentIntegrationData);
    updatedIntegerationData.actions = normalizedActions;
    const failureAction = updatedIntegerationData.actions.find(({ action_type }) => action_type === ACTION_TYPE.FORWARD_ON_FAILURE);
    if (!isEmpty(failureAction)) {
      normalizedActions.push(failureAction);
    }
    updatedIntegerationData.connected_steps = getConnectedStepsFromActions(normalizedActions);

    if (actions?.length > 0) {
      delete errorList.add_actions;
    }
    const updatedFlowData = cloneDeep(flowData);
    set(updatedFlowData, ['activeIntegrationData'], updatedIntegerationData);
    if (updatedIntegerationData._id) {
      const currentStepIndex = updatedFlowData?.steps.findIndex((step) => step._id === updatedIntegerationData._id);
      if (currentStepIndex > -1) {
        set(updatedFlowData, ['steps', currentStepIndex], updatedIntegerationData);
      }
    }
    updateFlowData(updatedFlowData);
    setSuccessActionsErrorList(errorList);
  };

  const cancelOrCloseDependency = () => {
    const clonedFlowData = cloneDeep(flowData);
    clonedFlowData.dependency_data = {};
    clonedFlowData.dependency_type = EMPTY_STRING;
    clonedFlowData.dependency_name = EMPTY_STRING;
    clonedFlowData.showFieldDependencyDialog = {
      isVisible: false,
      isIntegrationDependency: false,
    };
    updateFlowData(clonedFlowData);
  };

  const handleCloseClick = (updatedFlowData = flowData) => {
    updatedFlowData = cloneDeep(updatedFlowData);
    updatedFlowData.isIntegrationConfigurationModalOpen = false;
    updatedFlowData.integerationList = [];
    updatedFlowData.activeIntegrationData = {};
    updatedFlowData.allbodyLstAllFields = [];
    updatedFlowData.allresponseLstAllFields = [];
    updatedFlowData.mappedIntegrationResponseFields = [];
    updateFlowData(updatedFlowData);
  };

  const deleteForwardFailureAction = async (failureAction, flowData) => {
    let updatedFlowData = cloneDeep(flowData);
    updatedFlowData = await deleteAction({
      postData: {
        action_uuid: failureAction.action_uuid,
        _id: currentIntegrationData._id,
        step_uuid: currentIntegrationData.step_uuid,
        flow_id: flowData.flow_id,
      },
      flowData: updatedFlowData,
    });
    return updatedFlowData;
  };
  const validateAndSaveBasicDetails = async (updatedFlowData, clonedIntegerationData, isSaveAndClose) => {
    const errorList = validate(
      getIntegerationInitalValidationData(cloneDeep(clonedIntegerationData)),
      basicIntegerationSchema(t),
    );
    if (isEmpty(errorList)) {
      set(clonedIntegerationData, ['integration_error_list'], {});
      set(updatedFlowData, ['activeIntegrationData'], clonedIntegerationData);
      try {
        const postData = constructInitialIntegrationPostData(clonedIntegerationData, updatedFlowData);
        postData.integration_details.is_required_check = false;
        updatedFlowData = await saveStepAPI({ postData, isNewStep: !postData._id, activeStepDetails: clonedIntegerationData });
        console.log(cloneDeep(updatedFlowData), 'updatedFlowDataupdatedFlowDataupdatedFlowDataupdatedFlowDataupdatedFlowData');
        if (updatedFlowData?.activeIntegrationData) {
          if (integrationParentId && !postData._id) {
            const parentStepIndex = updatedFlowData?.steps.findIndex((step) => (step._id === integrationParentId));
            if (parentStepIndex > -1) {
              const parentStep = updatedFlowData.steps[parentStepIndex];
              let newActionData = {
                ...INITIAL_ACTION_VALUE,
                action_name: calculateActionButtonName(parentStep?.actions, 'Submit'),
                next_step_uuid: [updatedFlowData?.activeIntegrationData?.step_uuid],
              };
              if (!isEmpty(parentStep.actions)) {
                if (parentStep.step_type === STEP_TYPE.USER_STEP) {
                  parentStep.actions.push(newActionData);
                } else {
                  let nextStepUuidList = parentStep?.actions?.[0]?.next_step_uuid || [];
                  if (parentStep.step_type === STEP_TYPE.JOIN_STEP) {
                    nextStepUuidList = [updatedFlowData?.activeIntegrationData?.step_uuid];
                  } else {
                    nextStepUuidList.push(updatedFlowData?.activeIntegrationData?.step_uuid);
                  }
                  set(parentStep, ['actions', 0, 'next_step_uuid'], nextStepUuidList);
                  newActionData = parentStep?.actions?.[0] || {};
                }
              } else {
                parentStep.actions = [newActionData];
              }
              const uniqueConnectedSteps = getConnectedStepsFromActions(parentStep?.actions);
              parentStep.connected_steps = uniqueConnectedSteps;
              set(updatedFlowData, ['steps', parentStepIndex], parentStep);
              updatedFlowData = await saveStepAction({
                postData: {
                  actions: newActionData,
                  connected_steps: uniqueConnectedSteps,
                  _id: parentStep._id,
                  step_uuid: parentStep.step_uuid,
                  flow_id: flowData.flow_id,
                },
                flowDataCopy: updatedFlowData,
                returnUpdatedData: true,
              });
            }
          }
          if (isSaveAndClose) handleCloseClick(updatedFlowData);
          else {
            updateFlowData(updatedFlowData);
            setCurrentPage(1);
          }
        }
        setPointerEvent(false);
        updatePostLoader(false);
      } catch (e) {
        updateFlowData(updatedFlowData);
        setPointerEvent(false);
        updatePostLoader(false);
      }
    } else {
      clonedIntegerationData.integration_error_list = {
        ...clonedIntegerationData.integration_error_list,
        ...errorList,
      };
      updateFlowData({ activeIntegrationData: clonedIntegerationData });
    }
  };

  const validateRequestIntegrationData = async (updatedFlowData, clonedIntegerationData, isSaveAndClose) => {
    const formattedValidationData = getIntegerationRequestValidationData(clonedIntegerationData);
    const errorList = validate(formattedValidationData, requestIntegerationSchema(t));
    const reqbody = getIntegrationRequestBodyData(clonedIntegerationData?.request_body, 'value') || [];
    const requestBodyError = validate(reqbody, requestBodyValidationSchema(t));
    set(clonedIntegerationData, ['integration_error_list', 'requestBodyErrorList'], {
      ...clonedIntegerationData?.integration_error_list?.requestBodyErrorList || {},
      ...requestBodyError,
    });
    set(clonedIntegerationData, ['integration_error_list', 'requestError'], {
      ...clonedIntegerationData?.integration_error_list?.requestError || {},
      ...errorList,
    });
    if (isEmpty(errorList) && isEmpty(requestBodyError)) {
      const postData = constructRequestPageIntegrationPostData({ ...clonedIntegerationData, request_body: reqbody }, updatedFlowData);
      set(updatedFlowData, ['activeIntegrationData'], clonedIntegerationData);
      try {
        updatedFlowData = await saveStepAPI({ postData });
        if (isSaveAndClose) handleCloseClick(updatedFlowData);
        else {
          updateFlowData(updatedFlowData);
          setCurrentPage(2);
        }
        setPointerEvent(false);
        updatePostLoader(false);
      } catch (e) {
        updateFlowData(updatedFlowData);
        setPointerEvent(false);
        updatePostLoader(false);
      }
    } else {
      updateFlowData({ activeIntegrationData: clonedIntegerationData });
    }
  };

  const validateAndSaveResponseData = async (updatedFlowData, clonedIntegerationData, isSaveAndClose) => {
    const saveResponseError = validate(cloneDeep(currentIntegrationData)?.response_format || [], saveResponseValidationSchema);
    if (
      currentIntegrationData?.event_details?.method === INTEGRATION_METHOD_TYPES.GET &&
      isEmpty(saveResponseError) &&
      isEmpty(constructSaveResponsePostData(cloneDeep(currentIntegrationData)?.response_format))
    ) {
      saveResponseError.response_format = t(INTEGRATION_CONSTANTS.SAVE_RESPONSE_CONFIGURATION.ERROR_MESSAGES.NO_MAPPING);
    }
    set(clonedIntegerationData, ['integration_error_list', 'saveResponseErrorList'], saveResponseError);
    if (isEmpty(saveResponseError)) {
      set(updatedFlowData, ['activeIntegrationData'], clonedIntegerationData);
      const reqbody = getIntegrationRequestBodyData(cloneDeep(currentIntegrationData)?.request_body, REQUEST_CONFIGURATION.QUERY.VALUE.ID) || [];
      const postData = constructSaveResponseIntegrationPostData(
        { ...cloneDeep(currentIntegrationData), request_body: reqbody }, cloneDeep(flowData), currentPage);
      try {
        updatedFlowData = await saveStepAPI({ postData });
        setPointerEvent(false);
        updatePostLoader(false);
        if (!isSaveAndClose) setCurrentPage(4);
        else handleCloseClick();
      } catch (e) {
        updateFlowData(updatedFlowData);
        setPointerEvent(false);
        updatePostLoader(false);
      }
    } else {
      updateFlowData({ activeIntegrationData: clonedIntegerationData });
    }
  };

  const validateAndSaveAdditionalConfig = async (updatedFlowData, clonedIntegerationData) => {
    let failureAction = {};
    const additionConfigErrorList = {};
    let errorMessage = {};
    if (successActions.length === 0) {
      errorMessage = {
        ...FLOW_STRINGS.SERVER_RESPONSE.STEP_CONFIGURATION_VALIDATION(t),
        subtitle: t(INTEGRATION_CONSTANTS.ACTION_REQUIRED_ERROR),
      };
      setSuccessActionsErrorList({ add_actions: errorMessage });
    } else {
      const errorList = cloneDeep(successActionsErrorList);
      delete errorList?.add_actions;
      setSuccessActionsErrorList(errorList);
    }
    if (clonedIntegerationData?.failure_action === INTEGRATION_FAILURE_ACTION.ASSIGN_TO_STEP) {
      const failureActionIndex = clonedIntegerationData?.actions?.findIndex(({ action_type }) => action_type === ACTION_TYPE.FORWARD_ON_FAILURE);
      if (failureActionIndex > -1) {
        failureAction = clonedIntegerationData?.actions[failureActionIndex];
        if (isEmpty(get(failureAction, ['next_step_uuid']))) {
          additionConfigErrorList.failureAction = t(ADDITIONAL_CONFIGURATION.FAILURE_OPTIONS.ASSIGN_STEP_ERROR);
          errorMessage = FLOW_STRINGS.SERVER_RESPONSE.STEP_CONFIGURATION_VALIDATION(t);
        }
      } else {
        additionConfigErrorList.failureAction = t(ADDITIONAL_CONFIGURATION.FAILURE_OPTIONS.ASSIGN_STEP_ERROR);
        errorMessage = FLOW_STRINGS.SERVER_RESPONSE.STEP_CONFIGURATION_VALIDATION(t);
      }
    }
    set(clonedIntegerationData, ['integration_error_list', 'additionConfigErrorList'], additionConfigErrorList);
    if (isEmpty(errorMessage)) {
      set(updatedFlowData, ['activeIntegrationData'], clonedIntegerationData);
      const postData = constructIntegrationStepSaveData(clonedIntegerationData, updatedFlowData);
      const oldStepDetails = updatedFlowData.steps?.find((step) => (step._id === postData._id));
      try {
        updatedFlowData = await saveStepAPI({ postData });
        let oldFailureAction = {};
        if (oldStepDetails?.failure_action === INTEGRATION_FAILURE_ACTION.ASSIGN_TO_STEP) {
          oldFailureAction = oldStepDetails?.actions?.find((action) => action.action_type === ACTION_TYPE.FORWARD_ON_FAILURE) || {};
        }
        if (currentIntegrationData?.failure_action === INTEGRATION_FAILURE_ACTION.CONTINUE) {
          if (!isEmpty(oldFailureAction)) {
            updatedFlowData = await deleteForwardFailureAction(oldFailureAction, updatedFlowData);
          }
        } else {
          if (!isEmpty(failureAction) && (!failureAction.action_uuid || (oldFailureAction?.next_step_uuid?.[0] !== failureAction?.next_step_uuid?.[0]))) {
            const uniqueConnectedSteps = getConnectedStepsFromActions(clonedIntegerationData?.actions);
            updatedFlowData = await saveStepAction({
              postData: {
                actions: failureAction,
                connected_steps: uniqueConnectedSteps,
                _id: clonedIntegerationData._id,
                step_uuid: clonedIntegerationData.step_uuid,
                flow_id: flowData.flow_id,
              },
              flowDataCopy: updatedFlowData,
              returnUpdatedData: true,
            });
          }
        }
        handleCloseClick(updatedFlowData);
        updatePostLoader(false);
        setPointerEvent(false);
      } catch (e) {
        updatePostLoader(false);
        setPointerEvent(false);
        console.log(e);
      }
    } else {
      displayErrorToast(errorMessage);
      updateFlowData({ activeIntegrationData: clonedIntegerationData });
    }
  };

  const saveIntegerationStep = async (currentPage, isSaveAndClose = false) => {
    const updatedFlowData = cloneDeep(flowData);
    const clonedIntegerationData = cloneDeep(currentIntegrationData);
    switch (currentPage) {
      case 0:
        return validateAndSaveBasicDetails(updatedFlowData, clonedIntegerationData, isSaveAndClose);
      case 1:
        return validateRequestIntegrationData(updatedFlowData, clonedIntegerationData, isSaveAndClose);
      case 2:
        if (!isSaveAndClose) {
          return setCurrentPage(3);
        } else {
          return handleCloseClick();
        }
      case 3:
        return validateAndSaveResponseData(updatedFlowData, clonedIntegerationData, isSaveAndClose);
      case 4:
        return validateAndSaveAdditionalConfig(updatedFlowData, clonedIntegerationData);
      default:
        return null;
    }
  };

  const onDeleteIntegration = () => {
    onDeleteStepClick(currentIntegrationData?._id);
  };

  const cancelButton = (
    <span
      className={cx(styles.CancelButton, gClasses.MR15)}
      onClick={() => handleCloseClick()}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && handleCloseClick()}
      role="button"
      tabIndex={0}
    >
      {t(BASIC_CONFIGURATION.BUTTONS.CANCEL.LABEL)}
    </span>
  );

  const backButton = (
    <span
      className={cx(styles.BackButton, gClasses.MR15)}
      onClick={() => setCurrentPage(currentPage - 1)}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && setCurrentPage(currentPage - 1)}
      role="button"
      tabIndex={0}
    >
      {t(BASIC_CONFIGURATION.BUTTONS.BACK.LABEL)}
    </span>
  );

  const deleteButton = (
    <div
      className={cx(styles.DeleteButton, gClasses.MR15)}
      onClick={onDeleteIntegration}
      onKeyDown={onDeleteIntegration}
      role="button"
      tabIndex={0}
    >
      {t(DELETE_STEP_LABEL)}
    </div>
  );
  const saveButton = (
    <div
      className={cx(styles.BackButton, gClasses.MR15, styles.SaveButton, gClasses.CenterVH)}
      onClick={() => saveIntegerationStep(currentPage, true)}
      onKeyDown={() => saveIntegerationStep(currentPage, true)}
      role="button"
      tabIndex={0}
    >
      {t(BASIC_CONFIGURATION.BUTTONS.SAVE.LABEL)}
    </div>
  );
  const nextButton = (
    <Button
      buttonType={BUTTON_TYPE.PRIMARY}
      className={cx(styles.NextButton)}
      onClick={() => saveIntegerationStep(currentPage)}
      disabled={isLoadingStepDetails}
      nextArrow={currentPage > 0 && currentPage < 4}
    // onClick={() => currentPage === 0 ? setCurrentPage(1) : saveIntegerationStep(currentPage)}
    >
      {currentPage === 4 ?
        t(BASIC_CONFIGURATION.BUTTONS.SAVE_INTEGRATION.LABEL) :
        currentPage === 0 ?
          t(BASIC_CONFIGURATION.BUTTONS.CONTINUE.LABEL) :
          t(BASIC_CONFIGURATION.BUTTONS.NEXT.LABEL)
      }
    </Button>
  );

  const stepperDetails = getStepperDetails(t);
  console.log('checkkk crrentPage', currentPage);
  if (currentPage !== 0) {
    headerContent = (
      <div className={cx(gClasses.FTwo18GrayV3, gClasses.FontWeight500)}>
        {t(REQUEST_CONFIGURATION.TITLE)}
        <NewStepper
          stepperDetails={stepperDetails}
          currentProgress={currentPage}
          savedProgress={currentPage}
          className={styles.StepperClass}
          stepIndexClass={gClasses.CenterVH}
        />
      </div>
    );
  }
  switch (currentPage) {
    case 0:
      modalContent = (
        <BasicIntegerationConfiguration
          integerationList={integerationList}
          currentIntegrationData={currentIntegrationData}
          updateIntegerationData={updateIntegerationData}
          integration_error_list={integration_error_list}
        />
      );
      break;
    case 1:
      modalContent = (
        <IntegerationRequestConfiguration
          eventDetails={currentIntegrationData?.event_details}
          currentIntegrationData={currentIntegrationData}
          flowData={cloneDeep(flowData)}
          updateIntegerationData={updateIntegerationData}
          integration_error_list={integration_error_list}
        />
      );
      break;
    case 2:
      modalContent = (
        <TestIntegration
          eventDetails={currentIntegrationData?.event_details}
          currentIntegrationData={currentIntegrationData}
          flowData={cloneDeep(flowData)}
          updateIntegerationData={updateIntegerationData}
          integration_error_list={integration_error_list}
        />
      );
      break;
    case 3:
      modalContent = (
        <SaveResponse
          eventDetails={currentIntegrationData?.event_details}
          currentIntegrationData={currentIntegrationData}
          flowData={cloneDeep(flowData)}
          updateIntegerationData={updateIntegerationData}
          integration_error_list={integration_error_list}
        />
      );
      break;
    case 4:
      modalContent = (
        <AdditionalConfig
          eventDetails={currentIntegrationData?.event_details}
          currentIntegrationData={currentIntegrationData}
          flowData={cloneDeep(flowData)}
          updateIntegerationData={updateIntegerationData}
          updateActions={updateActions}
          integration_error_list={integration_error_list}
          successActions={successActions}
          actionErrorList={successActionsErrorList}
        />
      );
      break;
    default: break;
  }

  const footerContent = (
    <div
      className={cx(
        BS.D_FLEX,
        BS.W100,
        currentPage > 0 ? BS.JC_BETWEEN : BS.JC_END,
        BS.ALIGN_ITEM_CENTER,
        gClasses.PL30,
      )}
    >
      <div className={cx(gClasses.CenterV, BS.W100)}>
        {currentPage > 0 && backButton}
        {currentIntegrationData?._id && deleteButton}
      </div>
      <div
        className={cx(
          BS.D_FLEX,
          BS.JC_END,
          BS.ALIGN_ITEM_CENTER,
          gClasses.PR30,
        )}
      >
        {cancelButton}
        {currentPage > 0 && saveButton}
        {nextButton}
      </div>
    </div>
  );

  console.log('wasdfsdf', currentPage, 'currentIntegrationDataconfig', currentIntegrationData, 'currentID', currentIntegrationData?._id);

  return (
    <>
      <ModalLayout
        id={INTEGRATION_CONSTANTS.ID}
        modalContainerClass={cx(styles.ContentModal, gClasses.ModalContentClassWithoutPadding, gClasses.ZIndex6)}
        isModalOpen
        onCloseClick={() => handleCloseClick()}
        headerClassName={styles.AddIntegrationHeader}
        headerContent={headerContent}
        footerClassName={modalStyles.ModalFooter}
        mainContent={modalContent}
        mainContentClassName={styles.MainContent}
        footerContent={footerContent}
        extraSpace={64}
      />
      {
        flowData?.showFieldDependencyDialog?.isIntegrationDependency && (
          <DependencyHandler
            onDeleteClick={() => { }}
            onCancelDeleteClick={cancelOrCloseDependency}
            dependencyHeaderTitle={dependency_name}
            dependencyData={dependency_data}
          />
        )
      }
    </>
  );
}

export default FlowIntegrationConfiguration;
