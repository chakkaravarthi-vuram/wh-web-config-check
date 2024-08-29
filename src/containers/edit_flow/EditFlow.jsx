import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames/bind';
import { clearAlertPopOverStatus, editDiscardExit, updateAlertPopverStatus, validate } from 'utils/UtilityFunctions';
import { clearVisibilityOperators, externalFieldsClear } from 'redux/actions/Visibility.Action';
import { fieldSuggestionClear } from 'redux/actions/FieldSuggestion.Action';
import { get, isEmpty, cloneDeep, isUndefined } from 'utils/jsUtility';
import { clearEditFlowData, updateFlowDataChange, updateFlowStateChange } from 'redux/reducer/EditFlowReducer';
import {
  getFlowDetailsByIdApi,
  saveFlowThunk,
  publishFlowThunk,
  discardFlowApi,
  deleteFlowApi,
  validateFlowThunk,
  checkFlowDependencyApiThunk,
} from 'redux/actions/EditFlow.Action';
import gClasses from 'scss/Typography.module.scss';
import { ADMIN_HOME } from 'urls/RouteConstants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { constructJoiObject } from 'utils/ValidationConstants';
import { BS } from 'utils/UIConstants';
import UpdateConfirmPopover from 'components/update_confirm_popover/UpdateConfirmPopover';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { DASHBOARD_ADMIN_VALIDATION_MESSAGE } from 'components/form_builder/section/form_fields/FormField.strings';
import DigramaticFlowView from './diagramatic_flow_view/DiagramaticFlowView';
import { FLOW_STRINGS, PUBLISH_TO_TEST_STRINGS } from './EditFlow.strings';
import styles from './EditFlow.module.scss';
import { calculateStepName, constructPostDataForCreateStep, getBasicUsernamesFromUserDetails, getCreateFlowValidateData, getFlowAddOnConfigValidateData, getReassigneeValidation, getSaveFlowPostDataWithSettingsTab, SECONDARY_ACTIONS_LIST } from './EditFlow.utils';
import { getCreateFlowSchema, validateFlowAddOnConfig } from './EditFlow.validation.schema';
import DeleteFlow from './flow_configuration/delete_flow/DeleteFlow';
import ErrorDisplay from './ErrorDisplay';
import ParallelStepConfiguration from './step_configuration/configurations/ParallelStepConfiguration';
import TestBedConfirmationScreen, { CONTENT_TYPE } from './test_bed/TestBedConfirmationScreen';
import { closeLinkDependencyPopup, closeFlowDependencyPopup, onDeleteStepLink } from './diagramatic_flow_view/DigramaticFlowView.utils';
import FlowSettingsConfiguration from './settings_configuration/SettingsConfiguration';
import DependencyHandler from '../../components/dependency_handler/DependencyHandler';
import { processDataFromPromptCreation } from '../../redux/actions/FlowCreationPrompt.Action';
import { clearFlowCreationPromptData } from '../../redux/reducer/EditFlowReducer';
import { routeNavigate } from '../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../utils/Constants';
import { EDIT_FLOW_STEP_TABS } from '../application/app_components/dashboard/flow/Flow.utils';
import EditBasicDetails from './EditBasicDetails';
import { createNewStepApiThunk, getAllFlowStepsById } from '../../redux/actions/EditFlow.Action';
import { checkStepDependencyApiThunk, getFlowStepDetailsApiThunk } from '../../redux/actions/FlowStepConfiguration.Action';
import { displayErrorToast } from '../../utils/flowErrorUtils';
import { SETTINGS_PAGE_TAB } from './settings_configuration/SettingsConfiguration.utils';
import { validatePolicy } from './security/policy_builder/PolicyBuilder.utils';
import { ALL_PUBLISHED_FLOWS, LIST_FLOW } from '../../urls/RouteConstants';
import NodeConfiguration from './node_configuration/NodeConfiguration';
import NodeDeleteConfiguration from './node_configuration/NodeDeleteConfiguration';
import ManageFlowFields from './manage_flow_fields/ManageFlowFields';
import { ManageFlowFieldsProvider } from './manage_flow_fields/use_manage_flow_fields_reducer/useManageFlowFieldsReducer';
import { MANAGE_FLOW_FIELD_INITIAL_STATE } from './manage_flow_fields/ManageFlowFields.constants';

function EditFlow(props) {
  const history = useHistory();
  const { t } = useTranslation();

  const [isLoadingError, setIsLoadingError] = useState(false);
  // const [blockNavigation, setNavigationBlockerStatus] = useState(true);
  const [isEditInProgress, setIsEditInProgress] = useState(true);
  const [searchStep, setSearchStep] = useState(EMPTY_STRING);
  // const { ERRORS } = FLOW_CONFIG_STRINGS;
  const {
    flowData,
    isEditFlowView,
    isDraft,
    isErrorInGettingFlowData,
    editFlowInitialLoading,
    updateFlowDataChange,
    secondaryAction,
    activeStepDetails,
    // flowIdFromProps,
    isSystemStepConfigModalOpen,
    flowSettingsModalVisibility,
    currentSettingsPage,
    showTestBedConfirmation,
    dependency_data,
    isNodeConfigOpen,
    dependency_name,
    locale_list,
    onFlowDataChange,
  } = props;
  const {
    // saved_flow_name,
    flow_name,
    isFlowModalDisabled,
    flow_uuid,
    showLinkDependencyDialog,
    showFlowDependencyDialog,
    deleteFlowParams = {},
    linkSource,
    linkTarget,
    showStepDependencyDialog,
  } = flowData;

  const flowUuid = get(history, ['location', 'state', 'flow_uuid']);
  const reduxDispatch = useDispatch();

  // const isFromCreateFlow = get(history, ['location', 'state', 'isFromCreateFlow'], flowIdFromProps);
  let modalContent = null;
  let mainComponent = null;
  let secondaryActionModal = null;
  let systemStepConfigModal = null;
  let stepConfigViewComponent = null;
  let bottomActionButtons = null;

  useEffect(() => {
    const { getFlowDetailsByIdApiAction, processDataFromPromptCreation } = props;
    if (flowUuid) {
      const { promptStepsData, isFromPromptCreation } = props;
      if (isFromPromptCreation && promptStepsData) {
        processDataFromPromptCreation();
      } else {
        getFlowDetailsByIdApiAction({
          flow_uuid: flowUuid,
        });
      }
    } else {
      routeNavigate(history, ROUTE_METHOD.REPLACE, ADMIN_HOME, null, null);
    }
    return () => {
      const {
        flowClearData,
        fieldSuggestionClearData,
        visbilityOperatorsClearData,
        clearExternalFields,
        clearFlowCreationPromptData,
      } = props;
      flowClearData();
      clearExternalFields();
      visbilityOperatorsClearData();
      fieldSuggestionClearData();
      clearFlowCreationPromptData();
    };
  }, []);

  useEffect(() => {
    if (isErrorInGettingFlowData) {
      setIsLoadingError(true);
    }
  }, [isErrorInGettingFlowData]);

  const loadFlowDataAgain = () => {
    setIsLoadingError(false);
    const { isFlowInitialDataLoaded, flow_id } = flowData;
    const { getAllFlowStepsById, getFlowDetailsByIdApiAction } = props;
    if (isFlowInitialDataLoaded) getAllFlowStepsById(flow_id, flow_uuid, flowData);
    else getFlowDetailsByIdApiAction({ flow_uuid: flowUuid });
  };
  const onUserStepClick = async (index, label) => {
    const { updateFlowStateChange, getFlowStepDetailsApi } = props;
    const { steps = [] } = cloneDeep(flowData);
    let activeStepDetails = cloneDeep(steps[index]);
    activeStepDetails.progress = 0;
    if (label) {
      activeStepDetails.step_name = label;
    } else {
      const stepDetailsResponse = await getFlowStepDetailsApi({ stepId: activeStepDetails._id, label, step_type: activeStepDetails.step_type }, t);
      if (!isEmpty(stepDetailsResponse)) {
        activeStepDetails = {
          ...stepDetailsResponse,
          step_name: stepDetailsResponse.step_name || label,
          progress: EDIT_FLOW_STEP_TABS.CREATE_FORM,
          isLoadingStepDetails: false,
        };
      }
      console.log(activeStepDetails, 'njndjnjd');
    }
    updateFlowStateChange({
      activeStepDetails,
      isLoadingStepDetails: false,
    });
  };

  const closeDiscardConfirmation = () => {
    clearAlertPopOverStatus();
    if (isEditFlowView) {
      editDiscardExit(history);
      return;
    }
    routeNavigate(history, ROUTE_METHOD.GO_BACK, null, null, null);
  };

  const discardFlowClicked = () => {
    const { discardFlowApi } = props;
    if (!isUndefined(flowData.flow_id)) {
      discardFlowApi({
        flow_id: flowData.flow_id,
      }, closeDiscardConfirmation);
    }
  };

  const handleSecondaryActionChange = (selectedAction) => {
    const { updateFlowStateChange } = props;
    updateFlowStateChange({ secondaryAction: selectedAction });
    if (selectedAction === SECONDARY_ACTIONS_LIST.DISCARD) {
      updateAlertPopverStatus({
        isVisible: true,
        customElement: (
          <UpdateConfirmPopover
            onYesHandler={discardFlowClicked}
            onNoHandler={() => clearAlertPopOverStatus()}
            title={t(FLOW_STRINGS.DISCARD.TITLE)}
            subTitle={t(FLOW_STRINGS.DISCARD.SUBTITLE)}
            titleStyle={gClasses.WhiteSpaceNoWrap}
            labelStyle={gClasses.AlignCenter}
          />
        ),
      });
    }
  };

  const closeDeleteConfirmation = () => {
    if (isEditFlowView) {
      editDiscardExit(history);
      return;
    }
    routeNavigate(history, ROUTE_METHOD.GO_BACK, null, null, null);
  };

  const deleteFlow = (deleteFlowParams) => {
    const { deleteFlowApi } = props;
    deleteFlowApi(deleteFlowParams, closeDeleteConfirmation);
  };

  const deleteFlowClicked = (type) => {
    const { deleteFlowApi, checkFlowDependencyApi } = props;
    const params = {
      flow_uuid,
      delete_with_instance: type === FLOW_STRINGS.DELETE_FLOW(t).RADIO_GROUP_OPTION_LIST[0].value,
    };
    checkFlowDependencyApi({
      _id: flowData.flow_id,
    },
      'Flow',
      params,
      () => deleteFlowApi(params, closeDeleteConfirmation));
  };

  const publishFlow = async (isTestFlow = false) => {
    const { publishFlowAPI } = props;
    const { flow_uuid } = flowData;
    await publishFlowAPI({ flow_uuid }, isTestFlow, history, t);
  };

  // const setFlowSettingsModalHandler = (status = true) => {
  //   const { updateFlowStateChange } = props;
  //   updateFlowStateChange({
  //     flowSettingsModalVisibility: status,
  //     currentSettingsPage: SETTINGS_PAGE_TAB.SECURITY,
  //     flowData: {
  //       ...flowData,
  //       policyList: flowData?.policyListMetaData || [],
  //       entityViewers: cloneDeep(flowData?.entityViewersMetaData) || {},
  //       is_row_security_policy: !isEmpty(flowData?.policyListMetaData),
  //     },
  //   });
  //   setIsEditInProgress(!status);
  // };

  // const onStepNextButtonClicked = () => {
  //   const { flowData } = store.getState().EditFlowReducer;
  //   const clonedFlowData = cloneDeep(flowData);
  //   const { validateFlowAPI } = props;
  //   const { flow_uuid } = flowData;
  //   if (clonedFlowData.steps && clonedFlowData.steps.length > 0) {
  //     const firstStep = clonedFlowData.steps[0];
  //     if (!firstStep.step_name) {
  //       displayErrorToast({
  //         title: t(ERRORS.STEP_REQUIRED),
  //         subtitle: t(ERRORS.ADD_ATLEAST_ONE_STEP),
  //       });
  //     } else {
  //       validateFlowAPI({ flow_uuid }, t)
  //         .then((isValid) => {
  //           if (isValid) {
  //             setFlowSettingsModalHandler();
  //           }
  //         });
  //     }
  //   } else {
  //     displayErrorToast({
  //       title: t(ERRORS.STEP_REQUIRED),
  //       subtitle: t(ERRORS.ADD_ATLEAST_ONE_STEP),
  //     });
  //   }
  // };

  const saveFlowClicked = async () => {
    try {
      const { saveFlowAPI } = props;
      const saveFlowPostData = getSaveFlowPostDataWithSettingsTab(currentSettingsPage, flowData);
      const isSuccess = await saveFlowAPI({
        data: {
          ...saveFlowPostData,
          is_save_close: true,
        },
      });
      if (isSuccess) {
        routeNavigate(history, ROUTE_METHOD.PUSH, ADMIN_HOME, null, null);
      } else {
        displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.CONFIGURATIONS_NOT_ADDED_SAVE_FLOW(t));
      }
    } catch (e) {
      displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.CONFIGURATIONS_NOT_ADDED_SAVE_FLOW(t));
    }
  };

  const saveFlowBasicDetails = async (isSaveAndClose) => {
    const { saveFlowAPI } = props;
    const validateData = getCreateFlowValidateData(flowData);
    const error_list = validate(validateData, constructJoiObject(getCreateFlowSchema(t)));
    updateFlowDataChange({ error_list: error_list });
    if (isEmpty(error_list)) {
      if (isSaveAndClose) {
        setIsEditInProgress(false);
      }
      try {
        const isSuccess = await saveFlowAPI({
          data: validateData,
        });
        if (isSuccess) {
          if (isSaveAndClose) {
            routeNavigate(history, ROUTE_METHOD.REPLACE, `${LIST_FLOW}${ALL_PUBLISHED_FLOWS}`);
          } else {
            handleSecondaryActionChange();
            onFlowDataChange({ saved_flow_name: flow_name });
          }
        } else {
          setIsEditInProgress(true);
        }
      } catch (e) {
        console.log(e);
        setIsEditInProgress(true);
      }
    }
  };

  const addNewNode = async (newNodeParams = {}, connectorDetails = {}) => {
    const clonedFlowData = cloneDeep(flowData);
    const { flow_id, flow_uuid } = clonedFlowData;
    if (isEmpty(newNodeParams.stepName)) {
      newNodeParams.stepName = calculateStepName(newNodeParams.stepType);
    }
    const nodeParams = constructPostDataForCreateStep(newNodeParams);
    const res = reduxDispatch(createNewStepApiThunk({
      params: { flow_id, flow_uuid, ...nodeParams },
      connectorDetails,
    }));
    return res;
  };

  // const promptBeforeLeaving = (location) => {
  //   if ((location.pathname !== SIGNIN) && blockNavigation) {
  //     handleBlockedNavigation(
  //       t,
  //       () => {
  //         setNavigationBlockerStatus(false);
  //       },
  //       history,
  //       location,
  //     );
  //   } else return true;
  //   return false;
  // };

  const onGoBackClickHandler = () => {
    const { updateFlowStateChange } = props;
    updateFlowStateChange({ showTestBedConfirmation: false });
  };

  const onPublishClicked = async (isPublishTest) => {
    const { currentSettingsPage, flowData } = props;
    const clonedFlowData = cloneDeep(flowData);
    let errors = {};
    if (currentSettingsPage === SETTINGS_PAGE_TAB.ADDON) {
      errors = validate(getFlowAddOnConfigValidateData(flowData), constructJoiObject(validateFlowAddOnConfig(t)));
    }
    clonedFlowData.error_list = {};
    await updateFlowDataChange(clonedFlowData);
    if (isEmpty(errors)) {
      const { saveFlowAPI, updateFlowStateChange } = props;
      let postData = getCreateFlowValidateData(clonedFlowData);
      if (currentSettingsPage === SETTINGS_PAGE_TAB.ADDON) {
        postData = {
          ...postData,
          ...getFlowAddOnConfigValidateData(clonedFlowData),
        };
      }
      saveFlowAPI({
        data: postData,
        publishFlowFunc: isPublishTest ?
          () => { updateFlowStateChange({ showTestBedConfirmation: true }); } :
          async () => { await publishFlow(); },
        isPublishTest,
      });
    }
  };

  const onDeleteStepClick = async (stepId) => {
    console.log('deleteStepClicked from StepCard', stepId);
    const { checkStepDependency } = props;
    const flow_data = cloneDeep(flowData);
    const checkFormDependencyParams = {
      _id: stepId,
    };
    const stepDetails = flow_data.steps.find((step) => stepId === step._id);
    if (stepDetails) {
      if (stepDetails.step_uuid) {
        checkStepDependency(
          checkFormDependencyParams,
          'Step',
          stepDetails.step_name,
        );
      }
    }
  };

  const updatePublishSettingsTab = async (nextPage = null, currentPage = currentSettingsPage, clonedFlowData = flowData) => {
    clonedFlowData = cloneDeep(clonedFlowData);
    let errorList = {};
    let postData = {};

    if (nextPage === SETTINGS_PAGE_TAB.SECURITY || currentPage === SETTINGS_PAGE_TAB.SECURITY) {
      postData = { send_policy_fields: true };
    }

    switch (currentPage) {
      case SETTINGS_PAGE_TAB.SECURITY:
        const ownersError = getBasicUsernamesFromUserDetails(clonedFlowData?.owners?.users || []);
        const reassignedOwnersError = getReassigneeValidation(clonedFlowData?.reassignedOwners);
        if (!isEmpty(ownersError)) {
          errorList.owners = `${ownersError} ${DASHBOARD_ADMIN_VALIDATION_MESSAGE} `;
        } else {
          delete clonedFlowData?.error_list?.owners;
        }
        if (!isEmpty(reassignedOwnersError)) {
          errorList.reassignedOwners = reassignedOwnersError;
        } else {
          delete clonedFlowData?.error_list?.reassignedOwners;
        }
        delete clonedFlowData?.error_list?.viewers;

        if (clonedFlowData?.is_row_security_policy) {
          const { validatedPolicyList, isAnyPolicyHasValidation, userFieldPolicyErrorList, commonErrorList } = validatePolicy(clonedFlowData?.policyList);
          clonedFlowData.policyList = validatedPolicyList;
          clonedFlowData.securityPolicyErrorList = commonErrorList;
          clonedFlowData.policyListHasValidation = isAnyPolicyHasValidation;
          clonedFlowData.userFieldPolicyErrorList = userFieldPolicyErrorList;
          if (isAnyPolicyHasValidation) {
            const { updateFlowStateChange } = props;
            return updateFlowStateChange({
              currentSettingsPage: currentPage,
              flowData: clonedFlowData,
            });
          }
        }
        break;
      case SETTINGS_PAGE_TAB.DASHBOARD:
        if (!isEmpty(clonedFlowData.defaultReportFieldErrorList)) {
          errorList.defaultReportFieldErrorList = clonedFlowData.defaultReportFieldErrorList;
        }
        if (!isEmpty(clonedFlowData.triggerDetailsServerError)) {
          errorList.triggerDetailsServerError = clonedFlowData.triggerDetailsServerError;
        }
        break;
      case SETTINGS_PAGE_TAB.ADDON:
        errorList = validate(getFlowAddOnConfigValidateData(flowData), constructJoiObject(validateFlowAddOnConfig(t)));
        break;
      default:
        break;
    }
    clonedFlowData.error_list = {
      ...(clonedFlowData.error_list || {}),
      ...(errorList || {}),
    };
    if (isEmpty(errorList)) {
      try {
        const { saveFlowAPI } = props;

        postData = {
          ...postData,
          ...getSaveFlowPostDataWithSettingsTab(currentPage, flowData),
        };

        await saveFlowAPI({
          data: postData,
          changeSettingsPage: true,
          nextPage,
          moveToNextTab: updatePublishSettingsTab,
          clonedFlowData,
          currentSettingsPage: currentPage,
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      const { updateFlowStateChange } = props;
      updateFlowStateChange({ currentSettingsPage: currentPage });
      updateFlowDataChange({ error_list: errorList });
    }
    return null;
  };

  if (isFlowModalDisabled) {
    if (flowSettingsModalVisibility) {
      const saveButton = (
        <Button
          className={cx(gClasses.FTwo13, styles.CommonButtonClass)}
          onClick={() => saveFlowClicked()}
          buttonType={BUTTON_TYPE.OUTLINE_PRIMARY}
        >
          {t(FLOW_STRINGS.ACTION_BUTTONS.SAVE_AND_CLOSE)}
        </Button>
      );
      const publishButton = (
        <Button
          className={cx(styles.CommonButtonClass, styles.PrimaryButtonClass, gClasses.MR20)}
          buttonType={BUTTON_TYPE.PRIMARY}
          onClick={() => onPublishClicked()}
        >
          {t(FLOW_STRINGS.ACTION_BUTTONS.PUBLISH)}
        </Button>
      );
      const testPublishButton = (
        <Button
          className={cx(gClasses.MR15, styles.CommonButtonClass)}
          buttonType={BUTTON_TYPE.OUTLINE_PRIMARY}
          onClick={() => onPublishClicked(true)}
        >
          {t(FLOW_STRINGS.ACTION_BUTTONS.PUBLISH_FOR_TESTING)}
        </Button>
      );
      const backButton = (
        <Button
          buttonType={BUTTON_TYPE.SECONDARY}
          className={cx(gClasses.MR15, styles.CommonButtonClass, styles.DirectionIcon)}
          onClick={() => updatePublishSettingsTab(currentSettingsPage - 1)}
          previousArrow
        >
          {t(FLOW_STRINGS.ACTION_BUTTONS.BACK)}
        </Button>
      );
      const nextButton = (
        <Button
          className={cx(gClasses.MR15, styles.CommonButtonClass, styles.PrimaryButtonClass)}
          buttonType={BUTTON_TYPE.PRIMARY}
          onClick={() => updatePublishSettingsTab(currentSettingsPage + 1)}
          nextArrow
        >
          {t(FLOW_STRINGS.ACTION_BUTTONS.NEXT)}
        </Button>
      );

      const localeList = locale_list?.filter((locale) => locale.language !== 'English');

      const settingsLastPage = isEmpty(localeList) ? 2 : 3;

      bottomActionButtons = (
        <div className={cx(gClasses.CenterV, styles.ButtonContainer, BS.W100, BS.D_FLEX, BS.JC_BETWEEN)}>
          <div className={cx(BS.D_FLEX, BS.JC_START)}>
            {currentSettingsPage !== SETTINGS_PAGE_TAB.SECURITY && backButton}
            {saveButton}
          </div>
          <div className={cx(BS.D_FLEX, BS.JC_END)}>
            {
              (currentSettingsPage === settingsLastPage) ? (
                <>
                  {testPublishButton}
                  {publishButton}
                </>
              ) : (
                nextButton
              )
            }
          </div>
        </div>
      );

      stepConfigViewComponent = (
        <FlowSettingsConfiguration updateStepperTab={updatePublishSettingsTab} bottomActionButtons={bottomActionButtons} currentSettingsPage={currentSettingsPage} isEditFlowView={isEditFlowView} />
      );
    }
    let flowViewComponent = null;
    if (isErrorInGettingFlowData) {
      flowViewComponent = (
        <div className={cx(BS.D_FLEX, BS.JC_CENTER)}>
          <ErrorDisplay onButtonClick={loadFlowDataAgain} />
        </div>
      );
    } else if (editFlowInitialLoading) {
      flowViewComponent = (
        <>
          <div className={gClasses.MB20}>
            <Skeleton height={50} />
          </div>
          <div className={gClasses.MB20}>
            <Skeleton height={50} />
          </div>
          <div className={gClasses.MB20}>
            <Skeleton height={50} />
          </div>
        </>
      );
    } else {
      flowViewComponent = (
        <DigramaticFlowView
          onStepClick={onUserStepClick}
          addNewNode={addNewNode}
          onDeleteStepClick={onDeleteStepClick}
        />
      );
    }
    // const secondaryProps = {
    //   displaySecondaryActions: true,
    //   subMenuList: getEditFlowSecondaryActionMenu(flowData.status, flowData.version, t),
    //   primaryCTALabel: FLOW_STRINGS.ACTION_BUTTONS.PUBLISH,
    //   primaryCTAClicked: onStepNextButtonClicked,
    //   secondaryCTALabel: FLOW_STRINGS.ACTION_BUTTONS.SAVE_AND_CLOSE,
    //   secondaryCTAClicked: () => saveFlowBasicDetails(true),
    //   subMenuItemClicked: handleSecondaryActionChange,
    // };

    // const header = (
    //   <Header
    //     pageTitle={isFromCreateFlow ? t(FLOW_STRINGS.CREATE_FLOW_TITLE) : t(FLOW_STRINGS.EDIT_FLOW_TITLE)}
    //     fieldLabel={t(FLOW_STRINGS.FLOW_NAME_TITLE)}
    //     fieldValue={saved_flow_name}
    //     fieldClassName={gClasses.PL15}
    //     headerValueClass={styles.FlowName}
    //     headerLabelClass={gClasses.WhiteSpaceNoWrap}
    //     subMenuClassName={gClasses.MR2}
    //     className={cx(gClasses.MT2, gClasses.MB2)}
    //     isLoading={editFlowInitialLoading || isLoadingError}
    //     {...secondaryProps}
    //   />
    // );
    mainComponent = (
      <div className={styles.FlowModalContainer}>
        {stepConfigViewComponent}
        <div>
          {/* {header} */}
          {flowViewComponent}
        </div>
      </div>
    );
  }
  if (secondaryAction === SECONDARY_ACTIONS_LIST.DELETE) {
    secondaryActionModal = (
      <DeleteFlow
        id="delete_flow_modal"
        isModalOpen
        flowUuid={flow_uuid}
        isDraft={isDraft}
        onCloseClick={() => handleSecondaryActionChange()}
        onCancelClick={() => handleSecondaryActionChange()}
        onClick={deleteFlowClicked}
      />
    );
  }

  if (secondaryAction === SECONDARY_ACTIONS_LIST.MANAGE_FLOW_FIELDS) {
    secondaryActionModal = (
      <ManageFlowFieldsProvider initialState={MANAGE_FLOW_FIELD_INITIAL_STATE}>
        <ManageFlowFields
          onCloseClick={() => handleSecondaryActionChange()}
          flowId={flowData?.flow_id}
        />
      </ManageFlowFieldsProvider>

    );
  }

  if (secondaryAction === SECONDARY_ACTIONS_LIST.EDIT_BASIC_DETAILS) {
    secondaryActionModal = (
      <EditBasicDetails
        isModalOpen
        onCloseClick={() => handleSecondaryActionChange()}
        onContinueClickHandler={() => saveFlowBasicDetails(false)}
        flowData={flowData}
        onFlowDataChange={onFlowDataChange}
      />
    );
  }
  if (isSystemStepConfigModalOpen) {
    systemStepConfigModal = (
      <ParallelStepConfiguration
        isModalOpen
        setSearchStep={setSearchStep}
        searchStep={searchStep}
      />
    );
  }

  if (showTestBedConfirmation) {
    modalContent = {
      header: (
        <div className={cx(gClasses.ModalHeader, gClasses.PY10)}>
          {PUBLISH_TO_TEST_STRINGS(t).TITLE}
        </div>
      ),
      content: (
        <div className={gClasses.PY15}>
          <TestBedConfirmationScreen
            onGoBackClickHandler={() => onGoBackClickHandler()}
            primaryCtaClicked={() => publishFlow(true)}
            strings={PUBLISH_TO_TEST_STRINGS(t)}
            contentType={CONTENT_TYPE.FAQ}
          />
        </div>
      ),
    };
  }

  const nodeConfigModal = isNodeConfigOpen && (
    <NodeConfiguration
      activeStepDetails={activeStepDetails}
      setSearchStep={setSearchStep}
      searchStep={searchStep}
      onDeleteStepClick={onDeleteStepClick}
    />
  );

  const enablePrompt = (secondaryAction === 0) &&
    isEditInProgress && !isLoadingError &&
    !editFlowInitialLoading && !isEmpty(flowUuid);
  console.log(enablePrompt, secondaryAction, isEditInProgress, showLinkDependencyDialog, 'prompt before leaving');
  return (
    <>
      {/* <Prompt when={enablePrompt} message={promptBeforeLeaving} /> */}
      {showTestBedConfirmation && !isEmpty(modalContent) &&
        (
          <ModalLayout
            id="flow_settings_modal"
            isModalOpen={showTestBedConfirmation}
            onCloseClick={() => {
              onGoBackClickHandler();
            }}
            headerContent={modalContent.header}
            mainContent={modalContent.content}
            footerContent={modalContent.footer}
            currentStep={currentSettingsPage}
            scrollOnStepChange
          />
        )}
      {systemStepConfigModal}
      {secondaryActionModal}
      {nodeConfigModal}
      {mainComponent}
      {
        showLinkDependencyDialog && (
          <DependencyHandler
            onDeleteClick={() => onDeleteStepLink(linkSource, linkTarget)}
            onCancelDeleteClick={closeLinkDependencyPopup}
            dependencyHeaderTitle={dependency_name}
            dependencyData={dependency_data}
          />
        )
      }
      {
        showFlowDependencyDialog && (
          <DependencyHandler
            onDeleteClick={() => deleteFlow(deleteFlowParams)}
            onCancelDeleteClick={closeFlowDependencyPopup}
            dependencyHeaderTitle={dependency_name}
            dependencyData={dependency_data}
          />
        )
      }
      {
        showStepDependencyDialog && (
          <NodeDeleteConfiguration />
        )
      }
    </>
  );
}

const mapStateToProps = ({ EditFlowReducer, LocaleLookUpReducer }) => {
  return {
    flowData: EditFlowReducer.flowData,
    isErrorInGettingFlowData: EditFlowReducer.isErrorInGettingFlowData,
    isEditFlowView: EditFlowReducer.isEditFlowView,
    isDraft: EditFlowReducer.isDraft,
    isNodeConfigOpen: EditFlowReducer.isNodeConfigOpen,
    editFlowInitialLoading: EditFlowReducer.editFlowInitialLoading,
    serverFlowData: EditFlowReducer.serverFlowData,
    activeStepDetails: EditFlowReducer.activeStepDetails,
    secondaryAction: EditFlowReducer.secondaryAction,
    isSystemStepConfigModalOpen: EditFlowReducer.isSystemStepConfigModalOpen,
    flowSettingsModalVisibility: EditFlowReducer.flowSettingsModalVisibility,
    currentSettingsPage: EditFlowReducer.currentSettingsPage,
    showTestBedConfirmation: EditFlowReducer.showTestBedConfirmation,
    dependency_data: EditFlowReducer.flowData.dependency_data,
    dependency_name: EditFlowReducer.flowData.dependency_name,
    detailedFlowErrorInfo: EditFlowReducer.detailedFlowErrorInfo,
    locale_list: LocaleLookUpReducer.locale_list,
    promptStepsData: EditFlowReducer.promptStepsData,
    isFromPromptCreation: EditFlowReducer.isFromPromptCreation,
  };
};
const mapDispatchToProps = {
  flowClearData: clearEditFlowData,
  updateFlowDataChange,
  updateFlowStateChange,
  clearExternalFields: externalFieldsClear,
  visbilityOperatorsClearData: clearVisibilityOperators,
  fieldSuggestionClearData: fieldSuggestionClear,
  getFlowDetailsByIdApiAction: getFlowDetailsByIdApi,
  saveFlowAPI: saveFlowThunk,
  publishFlowAPI: publishFlowThunk,
  validateFlowAPI: validateFlowThunk,
  discardFlowApi: discardFlowApi,
  deleteFlowApi: deleteFlowApi,
  getAllFlowStepsById: getAllFlowStepsById,
  onFlowDataChange: updateFlowDataChange,
  checkFlowDependencyApi: checkFlowDependencyApiThunk,
  processDataFromPromptCreation: processDataFromPromptCreation,
  clearFlowCreationPromptData: clearFlowCreationPromptData,
  getFlowStepDetailsApi: getFlowStepDetailsApiThunk,
  checkStepDependency: checkStepDependencyApiThunk,
};

const MemorizedEditFlow = React.memo(EditFlow);
export default connect(mapStateToProps, mapDispatchToProps)(MemorizedEditFlow);
