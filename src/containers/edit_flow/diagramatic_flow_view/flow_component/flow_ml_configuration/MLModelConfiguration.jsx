import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../scss/Typography.module.scss';
import ModalLayout from '../../../../../components/form_components/modal_layout/ModalLayout';
import { BS } from '../../../../../utils/UIConstants';
import Button, {
  BUTTON_TYPE,
} from '../../../../../components/form_components/button/Button';
import { updateFlowDataChange } from '../../../../../redux/reducer/EditFlowReducer';
import { keydownOrKeypessEnterHandle, validate, getFieldLabelWithRefName } from '../../../../../utils/UtilityFunctions';
import { cloneDeep, isEmpty, set, get } from '../../../../../utils/jsUtility';
import modalStyles from '../../../../../components/form_components/modal_layout/CustomClasses.module.scss';
import { store } from '../../../../../Store';
import { DELETE_STEP_LABEL } from '../../../../../utils/strings/CommonStrings';
import {
  ML_INTEGRATION,
  STEPPER_CONFIG_LIST,
} from './MLModelConfiguration.constants';
import styles from './MLModelConfiguration.module.scss';
import BasicMLModalIntegration from './basic_ml_modal_configuration/BasicMLModalIntegration';
import NewStepper from '../../../step_configuration/step_components/new_stepper/NewStepper';
import MLModelRequestConfiguration from './ml_model_request_config/MLModelRequestConfiguration';
import AdditionalConfig from '../flow_integration_configuration/additional_config/AdditionalConfig';
import { constructInitialMLIntegrationPostData, getMLIntegerationInitalValidationData, getMLIntegerationRequestValidationData, constructMLSaveResponseIntegrationPostData, constructMLRequestPageIntegrationPostData, getMLIntegrationRequestBodyData, constructMLResponsePostData, constructMLSaveActionIntegrationPostData, constructMLResponseValidateData } from '../../../step_configuration/StepConfiguration.utils';
import { getModelDetailsThunk } from '../../../../../redux/actions/MlModelList.Action';
import { basicMLIntegerationSchema, requestMLIntegerationSchema, requestBodyMLValidationSchema, saveResponseMLValidationSchema } from '../../../step_configuration/StepConfiguration.validations';
import MLIntegrationSaveResponse from './ml_save_response/MLIntegrationSaveResponse';
import { getFlowStepDetailsApiThunk } from '../../../../../redux/actions/FlowStepConfiguration.Action';
import { ACTION_TYPE } from '../../../../../utils/constants/action.constant';
import { INITIAL_ACTION_VALUE, calculateActionButtonName, getConnectedStepsFromActions } from '../../../EditFlow.utils';
import { INTEGRATION_FAILURE_ACTION } from '../flow_integration_configuration/FlowIntegrationConfiguration.constants';
import { setPointerEvent, updatePostLoader } from '../../../../../utils/loaderUtils';
import { normalizer } from '../../../../../utils/normalizer.utils';
import { FOOTER_PARAMS_ID, FOOTER_PARAMS_POST_DATA_ID } from '../../../../form/form_builder/form_footer/FormFooter.constant';
import { INTEGRATION_CONSTANTS } from '../../../../integration/Integration.constants';
import { displayErrorToast } from '../../../../../utils/flowErrorUtils';
import { FLOW_STRINGS } from '../../../EditFlow.strings';
import { TEST_INTEGRATION_STRINGS } from '../../../../integration/Integration.strings';
import { STEP_TYPE } from '../../../../../utils/Constants';

function FlowIntegrationConfiguration(props) {
  const {
    currentMLIntegrationData,
    updateFlowData,
    isMlIntegrationModalOpen,
    flowData,
    dispatch,
    activeMLIntegrationData,
    mlIntegrationParentId,
    saveStepAPI,
    getFlowStepDetailsApi,
    saveStepAction,
    deleteAction,
    onDeleteStepClick,
  } = props;
  console.log('saveMLIntegrationStep', props);
  const [currentPage, setCurrentPage] = useState(0);
  const { t } = useTranslation();
  const stepperDetails = STEPPER_CONFIG_LIST(t);
  const { ml_integration_error_list } = cloneDeep(currentMLIntegrationData);
  const [successActions, setSuccessActionsData] = useState([]);
  const [successActionsErrorList, setSuccessActionsErrorList] = useState({});
  const { ADDITIONAL_CONFIGURATION } = INTEGRATION_CONSTANTS;

  useEffect(() => {
    if (currentMLIntegrationData._id) {
      getFlowStepDetailsApi({ stepId: currentMLIntegrationData._id }, t);
    }
  }, []);

  useEffect(() => {
    const actions = [];
    (activeMLIntegrationData?.actions || []).forEach((action) => {
      if ([ACTION_TYPE.FORWARD, ACTION_TYPE.END_FLOW].includes(action?.[FOOTER_PARAMS_POST_DATA_ID.ACTION_TYPE])) {
        actions.push(normalizer(action, FOOTER_PARAMS_POST_DATA_ID, FOOTER_PARAMS_ID));
      }
    });
    setSuccessActionsData(actions);
  }, [activeMLIntegrationData?.actions]);

  let headerContent = true;
  let modalContent = null;

  const handleCloseClick = () => {
    const updatedFlowData = cloneDeep(flowData);
    updatedFlowData.isMlIntegrationModalOpen = false;
    updatedFlowData.activeMLIntegrationData = {};
    updatedFlowData.allbodyLstAllFields = [];
    updateFlowData(updatedFlowData);
  };

  const updateMLIntegrationData = (updatedMLIntegrationData) => {
    const clonedMLIntegrationData = cloneDeep(updatedMLIntegrationData);
    if (clonedMLIntegrationData._id) {
      const { steps } = cloneDeep(flowData);
      const currentStepIndex = cloneDeep(flowData).steps.findIndex(
        (step) => step._id === clonedMLIntegrationData._id,
      );
      steps[currentStepIndex] = clonedMLIntegrationData;
      updateFlowData({ steps: steps });
      updateFlowData({ activeMLIntegrationData: clonedMLIntegrationData });
    } else {
      updateFlowData({ activeMLIntegrationData: clonedMLIntegrationData });
    }
  };

  const updateActions = (actions) => {
    setSuccessActionsData(actions);
    const errorList = cloneDeep(successActionsErrorList);
    const normalizedActions = (actions || []).map((a) =>
      normalizer(a, FOOTER_PARAMS_ID, FOOTER_PARAMS_POST_DATA_ID),
    );
    // update actions in activeStepDetails
    const updatedIntegerationData = cloneDeep(activeMLIntegrationData);
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
    set(updatedFlowData, ['activeMLIntegrationData'], updatedIntegerationData);
    if (updatedIntegerationData._id) {
      const currentStepIndex = updatedFlowData?.steps.findIndex((step) => step._id === updatedIntegerationData._id);
      if (currentStepIndex > -1) {
        set(updatedFlowData, ['steps', currentStepIndex], updatedIntegerationData);
      }
    }
    updateFlowData(updatedFlowData);
    setSuccessActionsErrorList(errorList);
  };

  const constructMLIntegrationData = (response, flowData) => {
    const { activeMLIntegrationData } = cloneDeep(flowData);
    const newData = response?.events?.body.map((obj, index) => {
      if (!isEmpty(flowData?.activeMLIntegrationData?.ml_integration_details?.body)) {
        const updatedReqBody = flowData?.activeMLIntegrationData?.ml_integration_details?.body?.find((req_body) => req_body.key === obj.key_uuid) || {};
        const value = flowData?.activeMLIntegrationData?.field_details.find((value) => value.field_uuid === updatedReqBody?.value) || {};
        return {
          ...obj,
          path: index,
          value: updatedReqBody?.value,
          field_details: { field_name: value?.field_name, field_uuid: value?.field_uuid, label: getFieldLabelWithRefName(value?.field_name, value?.reference_name) },
          type: updatedReqBody?.type,
        };
      } else {
        return {
          ...obj,
          path: index,
        };
      }
    });
    activeMLIntegrationData.request_body = newData;
    const listOfObjects = Object.keys(response?.events?.sample_response).map((key) => { return { [key]: response?.events?.sample_response[key], response_key: key, response_type: response?.events?.sample_response[key] }; });
    // const newObject = { response_key: 'entire_response', response_type: 'object' };
    // listOfObjects.push(newObject);
    const responseKey = Object.keys(listOfObjects).map((key) => { return { value: listOfObjects[key].response_key, label: listOfObjects[key].response_key }; });
    activeMLIntegrationData.response_key_option = responseKey;
    const responseType = Object.keys(listOfObjects).map((key) => { return { value: listOfObjects[key].response_type, label: listOfObjects[key].response_type }; });
    activeMLIntegrationData.response_type_option = responseType;
    activeMLIntegrationData.sample_response = listOfObjects;
    activeMLIntegrationData.key_option = { response_key_option: responseKey, response_type_option: responseType };
    if (!isEmpty(flowData?.activeMLIntegrationData?.ml_integration_details?.response_format)) {
      const updatedResDataList = [];
      listOfObjects?.forEach((obj, index) => {
        const updatedResBody = flowData?.activeMLIntegrationData?.ml_integration_details?.response_format?.find((req_body) => req_body.mapping_info === obj.response_key) || {};
        const value = flowData?.activeMLIntegrationData?.field_details.find((value) => value.field_uuid === updatedResBody?.field_uuid) || {};
        value.field_list_type = TEST_INTEGRATION_STRINGS.RELATIVE_PATH.VALUE.TYPES.EXPRESSION;
        let updatedResdata = {};
        if (!isEmpty(updatedResBody)) {
          updatedResdata = {
            field_uuid: updatedResBody?.field_uuid,
            response_key: updatedResBody?.mapping_info,
            response_type: updatedResBody?.mapping_field_type,
            path: `${index}`,
            is_deleted: false,
            field_value: updatedResBody?.field_uuid,
            field_details: { ...value, label: getFieldLabelWithRefName(value?.field_name, value?.reference_name) },
            field_type: value?.field_type,
            new_field: false,
          };
          updatedResDataList.push(updatedResdata);
        }
      });
      activeMLIntegrationData.response_format = updatedResDataList;
    } else {
      activeMLIntegrationData.response_format = [{
        path: '0',
        response_key: responseKey && responseKey[0]?.value,
        response_type: responseType && responseType[0]?.value,
        is_deleted: false,
        new_field: false,
      }];
    }
    return activeMLIntegrationData;
  };

  const validateAndSaveBasicDetails = async (updatedFlowData, activeMLIntegrationData, isSaveAndClose) => {
    set(updatedFlowData, ['isRequestLoading'], true);
    updateFlowData(updatedFlowData);
    const errorList = validate(
      getMLIntegerationInitalValidationData(cloneDeep(activeMLIntegrationData)),
      basicMLIntegerationSchema(t),
    );
    if (isEmpty(errorList)) {
      set(activeMLIntegrationData, ['ml_integration_error_list'], {});
      set(updatedFlowData, ['activeMLIntegrationData'], activeMLIntegrationData);
      try {
        const postData = constructInitialMLIntegrationPostData(activeMLIntegrationData, updatedFlowData);
        postData.ml_integration_details.is_required_check = false;
        updatedFlowData = await saveStepAPI({ postData, isNewStep: !postData._id, activeStepDetails: activeMLIntegrationData });
        if (updatedFlowData) {
          const procedure_data = cloneDeep(
            store.getState().EditFlowReducer.flowData,
          );
          const params = {
            model_code: procedure_data?.activeMLIntegrationData?.ml_integration_details?.model_code,
          };
          dispatch(getModelDetailsThunk(params))
            .then((res) => {
              const constructedMLIntegrationData = constructMLIntegrationData(res, updatedFlowData);
              set(updatedFlowData, ['isRequestLoading'], false);
              set(updatedFlowData, ['activeMLIntegrationData'], constructedMLIntegrationData);
              updateFlowData(updatedFlowData);
            });
          if (mlIntegrationParentId && !postData._id) {
            const parentStepIndex = updatedFlowData?.steps.findIndex((step) => (step._id === mlIntegrationParentId));
            if (parentStepIndex > -1) {
              const parentStep = updatedFlowData.steps[parentStepIndex];
              let newActionData = {
                ...INITIAL_ACTION_VALUE,
                action_name: calculateActionButtonName(parentStep?.actions, 'Submit'),
                next_step_uuid: [updatedFlowData?.activeMLIntegrationData?.step_uuid],
              };
              if (!isEmpty(parentStep.actions)) {
                if (parentStep.step_type === STEP_TYPE.USER_STEP) {
                  parentStep.actions.push(newActionData);
                } else {
                  let nextStepUuidList = parentStep?.actions?.[0]?.next_step_uuid || [];
                  if (parentStep.step_type === STEP_TYPE.JOIN_STEP) {
                    nextStepUuidList = [updatedFlowData?.activeMLIntegrationData?.step_uuid];
                  } else {
                    nextStepUuidList.push(updatedFlowData?.activeMLIntegrationData?.step_uuid);
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
          setCurrentPage(1);
          console.log(cloneDeep(updatedFlowData), 'updatedFlowDataupdatedFlowData');
        }
        setPointerEvent(false);
        updatePostLoader(false);
      } catch (e) {
        updateFlowData(updatedFlowData);
        setPointerEvent(false);
        updatePostLoader(false);
      }
    } else {
      activeMLIntegrationData.ml_integration_error_list = {
        ...activeMLIntegrationData.ml_integration_error_list,
        ...errorList,
      };
      updateFlowData({ activeMLIntegrationData: activeMLIntegrationData });
    }
  };

  const validateRequestIntegrationData = async (updatedFlowData, clonedMLIntegerationData, isSaveAndClose) => {
    const validationData = getMLIntegerationRequestValidationData(cloneDeep(clonedMLIntegerationData));
    const errorList = validate(
      validationData,
      requestMLIntegerationSchema(t),
    );
    const reqbody = getMLIntegrationRequestBodyData(cloneDeep(clonedMLIntegerationData)?.request_body) || [];
    const requestBodyError = validate(reqbody, requestBodyMLValidationSchema(t));
    if (isEmpty(errorList) && isEmpty(requestBodyError)) {
      setCurrentPage(2);
    }
    set(clonedMLIntegerationData, ['ml_integration_error_list', 'requestBodyErrorList'], {
      ...clonedMLIntegerationData?.ml_integration_error_list?.requestBodyErrorList || {},
      ...requestBodyError,
    });
    set(clonedMLIntegerationData, ['ml_integration_error_list', 'requestError'], {
      ...clonedMLIntegerationData?.ml_integration_error_list?.requestError || {},
      ...errorList,
    });
    if (isEmpty(errorList) && isEmpty(requestBodyError)) {
      const postData = constructMLRequestPageIntegrationPostData(
        { ...cloneDeep(clonedMLIntegerationData), request_body: reqbody },
        updatedFlowData);

      set(updatedFlowData, ['activeMLIntegrationData'], clonedMLIntegerationData);
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
      updateFlowData({ activeMLIntegrationData: clonedMLIntegerationData });
    }
  };

  const validateAndSaveResponseData = async (updatedFlowData, clonedMLIntegerationData, isSaveAndClose) => {
    const resData = constructMLResponsePostData(cloneDeep(currentMLIntegrationData));
    const validatedResData = constructMLResponseValidateData(cloneDeep(currentMLIntegrationData));
    const saveResponseError = validate(validatedResData, saveResponseMLValidationSchema);
    console.log('resData', resData, saveResponseError);
    if (isEmpty(resData) && isEmpty(saveResponseError)) {
      saveResponseError.response_format = t(INTEGRATION_CONSTANTS.ERROR_MESSAGES.NO_MAPPING);
    }
    if (isEmpty(saveResponseError)) {
      setCurrentPage(3);
    }
    set(clonedMLIntegerationData, ['ml_integration_error_list', 'saveResponseErrorList'], {
      ...clonedMLIntegerationData?.ml_integration_error_list?.saveResponseErrorList || {},
      ...saveResponseError,
    });
    if (isEmpty(saveResponseError)) {
      set(updatedFlowData, ['activeMLIntegrationData'], clonedMLIntegerationData);
      const reqbody = getMLIntegrationRequestBodyData(cloneDeep(currentMLIntegrationData)?.request_body) || [];
      const postData = constructMLSaveResponseIntegrationPostData(
        { ...cloneDeep(currentMLIntegrationData), request_body: reqbody },
        cloneDeep(flowData),
        currentPage);
      set(updatedFlowData, ['activeMLIntegrationData'], clonedMLIntegerationData);

      try {
        updatedFlowData = await saveStepAPI({ postData });
        if (isSaveAndClose) handleCloseClick(updatedFlowData);
        else {
          updateFlowData(updatedFlowData);
          setCurrentPage(3);
        }
        setPointerEvent(false);
        updatePostLoader(false);
      } catch (e) {
        updateFlowData(updatedFlowData);
        setPointerEvent(false);
        updatePostLoader(false);
      }
    } else {
      clonedMLIntegerationData.ml_integration_error_list = { ...ml_integration_error_list, saveResponseError };
      updateFlowData({ activeMLIntegrationData: clonedMLIntegerationData });
    }
  };

  const deleteForwardFailureAction = async (failureAction, flowData) => {
    let updatedFlowData = cloneDeep(flowData);
    updatedFlowData = await deleteAction({
      postData: {
        action_uuid: failureAction.action_uuid,
        _id: activeMLIntegrationData._id,
        step_uuid: activeMLIntegrationData.step_uuid,
        flow_id: flowData.flow_id,
      },
      flowData: updatedFlowData,
    });
    return updatedFlowData;
  };
  const validateAndSaveAdditionalConfig = async (updatedFlowData, clonedMLIntegerationData) => {
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
    // if (clonedMLIntegerationData?.failure_action === INTEGRATION_FAILURE_ACTION.ASSIGN_TO_STEP) {
    const failureActionIndex = clonedMLIntegerationData?.actions?.findIndex(({ action_type }) => action_type === ACTION_TYPE.FORWARD_ON_FAILURE);
    if (failureActionIndex > -1) {
      failureAction = clonedMLIntegerationData?.actions[failureActionIndex];
      if (isEmpty(get(failureAction, ['next_step_uuid']))) {
        additionConfigErrorList.failureAction = t(ADDITIONAL_CONFIGURATION.FAILURE_OPTIONS.ASSIGN_STEP_ERROR);
        errorMessage = FLOW_STRINGS.SERVER_RESPONSE.STEP_CONFIGURATION_VALIDATION(t);
      }
    }
    set(clonedMLIntegerationData, ['ml_integration_error_list', 'additionConfigErrorList'], additionConfigErrorList);
    if (isEmpty(errorMessage)) {
      set(updatedFlowData, ['activeMLIntegrationData'], clonedMLIntegerationData);
      const reqbody = getMLIntegrationRequestBodyData(cloneDeep(currentMLIntegrationData)?.request_body) || [];
      const postData = constructMLSaveActionIntegrationPostData(
        { ...cloneDeep(currentMLIntegrationData), request_body: reqbody },
        cloneDeep(flowData),
        currentPage);
      const oldStepDetails = updatedFlowData.steps?.find((step) => (step._id === postData._id));
      try {
        updatedFlowData = await saveStepAPI({ postData });
        let oldFailureAction = {};
        console.log(clonedMLIntegerationData, 'clonedMLIntegerationData', oldFailureAction, oldStepDetails);
        if (clonedMLIntegerationData?.failure_action === INTEGRATION_FAILURE_ACTION.ASSIGN_TO_STEP) {
          oldFailureAction = oldStepDetails?.actions?.find((action) => action.action_type === ACTION_TYPE.FORWARD_ON_FAILURE) || {};
        }
        if (clonedMLIntegerationData?.failure_action === INTEGRATION_FAILURE_ACTION.CONTINUE) {
          oldFailureAction = oldStepDetails?.actions?.find((action) => action.action_type === ACTION_TYPE.FORWARD_ON_FAILURE) || {};
          if (!isEmpty(oldFailureAction)) {
            updatedFlowData = await deleteForwardFailureAction(oldFailureAction, updatedFlowData);
          }
        } else {
          if (!isEmpty(failureAction)) {
            if (!failureAction.action_uuid || (oldFailureAction?.next_step_uuid?.[0] !== failureAction?.next_step_uuid?.[0])) {
              const uniqueConnectedSteps = getConnectedStepsFromActions(clonedMLIntegerationData?.actions);
              updatedFlowData = await saveStepAction({
                postData: {
                  actions: failureAction,
                  connected_steps: uniqueConnectedSteps,
                  _id: clonedMLIntegerationData._id,
                  step_uuid: clonedMLIntegerationData.step_uuid,
                  flow_id: flowData.flow_id,
                },
                flowDataCopy: updatedFlowData,
                returnUpdatedData: true,
              });
            }
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
      updateFlowData({ activeMLIntegrationData: clonedMLIntegerationData });
    }
  };

  const onDeleteIntegration = () => {
    onDeleteStepClick(currentMLIntegrationData?._id);
  };

  const saveMLIntegrationStep = async (currentPage, isSaveAndClose = false) => {
    const updatedFlowData = cloneDeep(flowData);
    const clonedMLIntegerationData = cloneDeep(activeMLIntegrationData);
    console.log('saveMLIntegrationStep', updatedFlowData);
    switch (currentPage) {
      case 0:
        return validateAndSaveBasicDetails(updatedFlowData, clonedMLIntegerationData, isSaveAndClose);
      case 1:
        return validateRequestIntegrationData(updatedFlowData, clonedMLIntegerationData, isSaveAndClose);
      case 2:
        return validateAndSaveResponseData(updatedFlowData, clonedMLIntegerationData, isSaveAndClose);
      case 3:
        return validateAndSaveAdditionalConfig(updatedFlowData, clonedMLIntegerationData);
      default:
        return null;
    }
  };

  const cancelButton = (
    <span
      className={cx(styles.CancelButton, gClasses.MR15)}
      onClick={() => handleCloseClick()}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && handleCloseClick()}
      role="button"
      tabIndex={0}
    >
      {t(ML_INTEGRATION.BUTTONS.CANCEL)}
    </span>
  );

  const backButton = (
    <span
      className={cx(styles.BackButton, gClasses.MR15)}
      onClick={() => setCurrentPage(currentPage - 1)}
      onKeyDown={(e) =>
        keydownOrKeypessEnterHandle(e) && setCurrentPage(currentPage - 1)
      }
      role="button"
      tabIndex={0}
    >
      {t(ML_INTEGRATION.BUTTONS.BACK)}
    </span>
  );

  const deleteButton = (
    <div
      className={cx(styles.DeleteButton, gClasses.MR15)}
      role="button"
      tabIndex={0}
      onClick={onDeleteIntegration}
      onKeyDown={onDeleteIntegration}
    >
      {t(DELETE_STEP_LABEL)}
    </div>
  );
  const saveButton = (
    <div
      className={cx(
        styles.BackButton,
        gClasses.MR15,
        styles.SaveButton,
        gClasses.CenterVH,
      )}
      onClick={() => saveMLIntegrationStep(currentPage, true)}
      onKeyDown={() => saveMLIntegrationStep(currentPage, true)}
      role="button"
      tabIndex={0}
    >
      {t(ML_INTEGRATION.BUTTONS.SAVE_AND_CLOSE)}
    </div>
  );
  const nextButton = (
    <Button
      buttonType={BUTTON_TYPE.PRIMARY}
      className={cx(styles.NextButton)}
      onClick={() => saveMLIntegrationStep(currentPage)}
      nextArrow={currentPage > 0 && currentPage < 3}
    >
      {currentPage === 3
        ? t(ML_INTEGRATION.BUTTONS.SAVE)
        : currentPage === 0
          ? t(ML_INTEGRATION.BUTTONS.CONTINUE)
          : t(ML_INTEGRATION.BUTTONS.NEXT)}
    </Button>
  );

  switch (currentPage) {
    case 0:
      modalContent = (
        <BasicMLModalIntegration
          MLModelsList={activeMLIntegrationData?.MLModelList}
          currentMLIntegrationData={activeMLIntegrationData}
          updateMLIntegrationData={updateMLIntegrationData}
          ml_integration_error_list={ml_integration_error_list}
        />
      );
      break;
    case 1:
      headerContent = (
        <div className={cx(gClasses.FTwo18GrayV3, gClasses.FontWeight500)}>
          {t(t(ML_INTEGRATION.INTEGRATION_CONFIG.TITLE))}
          <NewStepper
            stepperDetails={stepperDetails}
            currentProgress={currentPage}
            savedProgress={currentPage}
            className={styles.StepperClass}
            stepIndexClass={gClasses.CenterVH}
          />
        </div>
      );
      modalContent = (
        <MLModelRequestConfiguration
          eventDetails={flowData?.event_details}
          currentMLIntegrationData={activeMLIntegrationData}
          flowData={cloneDeep(flowData)}
          updateMLIntegrationData={updateMLIntegrationData}
          ml_integration_error_list={ml_integration_error_list}
          activeMLIntegrationData={activeMLIntegrationData}
        />
      );
      break;
    case 2:
      headerContent = (
        <div className={cx(gClasses.FTwo18GrayV3, gClasses.FontWeight500)}>
          {t(t(ML_INTEGRATION.INTEGRATION_CONFIG.TITLE))}
          <NewStepper
            stepperDetails={stepperDetails}
            currentProgress={currentPage}
            savedProgress={currentPage}
            className={styles.StepperClass}
            stepIndexClass={gClasses.CenterVH}
          />
        </div>
      );
      modalContent = (
        <MLIntegrationSaveResponse
          eventDetails={flowData?.event_details}
          currentMLIntegrationData={activeMLIntegrationData}
          flowData={cloneDeep(flowData)}
          updateMLIntegrationData={updateMLIntegrationData}
          ml_integration_error_list={ml_integration_error_list}
        />
      );
      break;
    case 3:
      headerContent = (
        <div className={cx(gClasses.FTwo18GrayV3, gClasses.FontWeight500)}>
          {t(t(ML_INTEGRATION.INTEGRATION_CONFIG.TITLE))}
          <NewStepper
            stepperDetails={stepperDetails}
            currentProgress={currentPage}
            savedProgress={currentPage}
            className={styles.StepperClass}
            stepIndexClass={gClasses.CenterVH}
          />
        </div>
      );
      modalContent = (
        <AdditionalConfig
          eventDetails={flowData?.event_details}
          currentIntegrationData={activeMLIntegrationData}
          flowData={cloneDeep(flowData)}
          updateIntegerationData={updateMLIntegrationData}
          updateActions={updateActions}
          ml_integration_error_list={ml_integration_error_list}
          successActions={successActions}
          actionErrorList={successActionsErrorList}
        />
      );
      break;
    default:
      break;
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
        {deleteButton}
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
  console.log('ml_integration_error_list', ml_integration_error_list);
  return (
    <ModalLayout
      id={ML_INTEGRATION.ID}
      modalContainerClass={cx(
        styles.ContentModal,
        gClasses.ModalContentClassWithoutPadding,
        gClasses.ZIndex6,
      )}
      isModalOpen={isMlIntegrationModalOpen}
      onCloseClick={() => handleCloseClick()}
      headerClassName={styles.ModalHeaderClass}
      headerContent={headerContent}
      footerClassName={modalStyles.ModalFooter}
      mainContent={modalContent}
      mainContentClassName={styles.MainContent}
      footerContent={footerContent}
      extraSpace={64}
    />
  );
}

const mapStateToProps = ({ EditFlowReducer, MlModelListReducer }) => {
  return {
    isMlIntegrationModalOpen:
      EditFlowReducer.flowData.isMlIntegrationModalOpen,
    activeMLIntegrationData:
      EditFlowReducer.flowData.activeMLIntegrationData,
    flowData: EditFlowReducer.flowData,
    mlIntegrationParentId:
      EditFlowReducer.flowData.mlIntegrationParentId,
    modelData: MlModelListReducer.modelData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFlowData: (...params) => {
      dispatch(updateFlowDataChange(...params));
    },
    getModelDetailsThunkApi: (params) => {
      dispatch(getModelDetailsThunk(params));
    },
    getFlowStepDetailsApi: (...params) => {
      dispatch(getFlowStepDetailsApiThunk(...params));
    },
    dispatch,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(FlowIntegrationConfiguration),
);
