import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import {
  updateFlowDataChange,
  updateFlowStateChange,
} from 'redux/reducer/EditFlowReducer';
import Input from 'components/form_components/input/Input';
import {
  getAllStepsListThunk,
  updateStepCoordinatesAfterLinkChange,
} from 'redux/actions/EditFlow.Action';
import { STEP_TYPE } from 'utils/Constants';
import { set, cloneDeep, isEmpty, isEqual, get, uniqBy } from 'utils/jsUtility';
import { validate } from 'utils/UtilityFunctions';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import RadioGroup from 'components/form_components/radio_group/RadioGroup';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { INITIAL_ACTION_VALUE } from '../../EditFlow.utils';
import styles from './Configuration.module.scss';
import { BRANCH_STEP, PARALLEL_STEP_CONFIG } from './Configuration.strings';
import {
  endStepDetailsValidateSchema,
  joinStepDetailsValidateSchema,
  parallelStepDetailsValidateSchema,
  stepNameValidationSchema,
} from '../StepConfiguration.validations';
import {
  constructSystemStepSaveData,
  getIgnoreStepTypeList,
  getJoinStepSaveValidateData,
  getParallelStepSaveValidateData,
} from '../StepConfiguration.utils';
import { DELETE_STEP_LABEL } from '../../../../utils/strings/CommonStrings';
import { JOIN_STEP_CONDITIONS } from '../../EditFlow.constants';
import { checkStepDependencyApiThunk, saveActionThunk, saveStepAPIThunk } from '../../../../redux/actions/FlowStepConfiguration.Action';
import { updatePostLoader, setPointerEvent } from '../../../../utils/UtilityFunctions';
import { ACTION_TYPE } from '../../../../utils/constants/action.constant';

function ParallelStepConfiguration(props) {
    const { t } = useTranslation();
    const {
        className,
        isModalOpen,
        stepId,
        stepsList = [],
        flowId,
        stepIndex,
        stepType,
        steps,
        newStepNameError,
        forceToggleDropdown,
        searchStep,
        setSearchStep,
    } = props;
    const [initialDetails] = useState(steps[stepIndex]);
    const [stepNameError, setStepNameError] = useState(EMPTY_STRING);
    const [searchStepError, setSearchStepError] = useState(EMPTY_STRING);
    const [dropdownError, setDropdownError] = useState(EMPTY_STRING);
    const [joinStepCountError, setJoinStepCountError] = useState(EMPTY_STRING);

  const isParallelStep = stepType === STEP_TYPE.PARALLEL_STEP;

  useEffect(() => {
    const { getAllSteps } = props;
    const currentStep = steps.find((eachStep) => eachStep._id === stepId);
    console.log(currentStep, 'dsnjndsjcjkdsnjkc');
    getAllSteps(
      flowId,
      stepId,
      undefined,
      true,
      currentStep?.coordinate_info || {},
      getIgnoreStepTypeList(stepType),
    );
  }, []);

  const onStepNameChange = (e, isOnBlur) => {
    let { value } = e.target;
    const { updateFlowDataChange, steps } = props;
    const stepsData = cloneDeep(steps);
    stepsData[stepIndex].step_name = value;
    if (isOnBlur) {
      value = (value || EMPTY_STRING).trim();
    }
    if (!isEmpty(stepNameError)) {
      const errors =
        validate(
          { step_name: (value || EMPTY_STRING).trim() },
          stepNameValidationSchema(),
        ) || {};
      setStepNameError(errors.step_name);
    }
    updateFlowDataChange({ steps: stepsData });
  };

  const onCloseBtnClick = () => {
    const { updateFlowStateChange, updateFlowDataChange } = props;
    const stepsData = cloneDeep(steps);
    stepsData[stepIndex] = initialDetails;
    updateFlowDataChange({
      steps: stepsData,
      showFieldDependencyDialog: false,
      showStepDependencyDialog: false,
      showFormDependencyDialog: false,
    });
    updateFlowStateChange({
      isSystemStepConfigModalOpen: false,
      selectedSystemStepType: null,
      selectedSystemStepId: null,
      activeStepId: null,
      selectedSystemStepUuid: null,
      selectedSystemStepIndex: null,
      [FLOW_STRINGS.SERVER_RESPONSE.NEW_STEP_ERROR_KEYS
        .FROM_SYSTEM_STEP_CONFIG]: EMPTY_STRING,
    });
  };

  const getSelectedSteps = (e) => {
    setDropdownError(EMPTY_STRING);
    const { value, step_type } = e.target;
    const actions = steps[stepIndex].actions || [];
    let connected_steps = cloneDeep(steps[stepIndex].connected_steps) || [];
    const { updateFlowDataChange } = props;
    const stepsData = cloneDeep(steps);
    let actionsValue = {};
    if (actions.length > 0) {
      [actionsValue] = cloneDeep(actions);
    } else {
      actionsValue = cloneDeep(INITIAL_ACTION_VALUE);
    }
    if (isParallelStep) {
      if (!actionsValue.next_step_uuid.includes(value)) {
        actionsValue.next_step_uuid.push(value);
        connected_steps.push({
          step_uuid: value,
          style: 'step',
        });
      } else {
        actionsValue.next_step_uuid.splice(
          actionsValue.next_step_uuid.indexOf(value),
          1,
        );
        const connectedStepIndex = connected_steps.indexOf(
          connected_steps.find((step) => step.step_uuid === value),
        );
        if (connectedStepIndex > -1) { connected_steps.splice(connectedStepIndex, 1); }
      }
    } else {
      actionsValue.next_step_uuid = [value];
      if (step_type === STEP_TYPE.END_FLOW) {
        actionsValue.action_type = ACTION_TYPE.END_FLOW;
      }
      connected_steps = [
        {
          step_uuid: value,
          style: 'step',
        },
      ];
    }
    set(stepsData, [stepIndex, 'actions'], [actionsValue]);
    const uniqueConnectedSteps = uniqBy(connected_steps, (s) => s.step_uuid);
    set(stepsData, [stepIndex, 'connected_steps'], uniqueConnectedSteps);
    console.log(stepsData, stepIndex, actionsValue, 'dsjfhskhfkdhskjf');
    updateFlowDataChange({
      steps: stepsData,
    });
  };

  const updateSearchStep = (event) => {
    console.log(
      'onSearchStepName newStepNameError',
      newStepNameError,
      event.target.value,
    );
    const { value } = event.target;
    setSearchStep(value);
    if (searchStepError) {
      const errors =
        validate(
          { step_name: (value || EMPTY_STRING).trim() },
          stepNameValidationSchema,
        ) || {};
      setSearchStepError(errors.step_name);
    }
    if (newStepNameError) {
      const { updateFlowStateChange } = props;
      updateFlowStateChange({
        [FLOW_STRINGS.SERVER_RESPONSE.NEW_STEP_ERROR_KEYS
          .FROM_SYSTEM_STEP_CONFIG]: EMPTY_STRING,
      });
    }
  };

  const createStep = () => {
    setDropdownError(EMPTY_STRING);
    const value = (searchStep || EMPTY_STRING).trim();
    const errors =
      validate(
        { step_name: (value || EMPTY_STRING).trim() },
        stepNameValidationSchema,
      ) || {};
    setSearchStepError(errors.step_name);
    if (isEmpty(errors)) {
      const { createNewStep } = props;
      createNewStep({ stepType: STEP_TYPE.USER_STEP, stepName: value, connectToStep: stepId, dontSave: true });
    }
  };

  const onDropdownVisibility = useCallback((isDropdownVisible) => {
    if (!isDropdownVisible) {
      const { updateFlowStateChange } = props;
      setSearchStep(EMPTY_STRING);
      setSearchStepError(EMPTY_STRING);
      updateFlowStateChange({
        [FLOW_STRINGS.SERVER_RESPONSE.NEW_STEP_ERROR_KEYS
          .FROM_SYSTEM_STEP_CONFIG]: EMPTY_STRING,
      });
    }
  }, []);

  const onDeleteStepHandler = () => {
    const { checkStepDependency } = props;
    const checkFormDependencyParams = {
      _id: stepId,
    };
    checkStepDependency(
      checkFormDependencyParams,
      'Step',
      steps[stepIndex].step_name,
      true,
    );
  };

  const validateAndSave = async () => {
    let errorList = {};
    let stepNameError = EMPTY_STRING;
    let actionsError = EMPTY_STRING;
    let joinStepCountError = EMPTY_STRING;
    let { flowData: updatedFlowData } = cloneDeep(props);
    let dataToBeValidated = null;
    let validationSchema = null;
    if (stepType === STEP_TYPE.PARALLEL_STEP) {
        dataToBeValidated = getParallelStepSaveValidateData(steps, stepIndex);
        validationSchema = parallelStepDetailsValidateSchema(t);
    } else if (stepType === STEP_TYPE.JOIN_STEP) {
      dataToBeValidated = getJoinStepSaveValidateData(steps, stepIndex);
      validationSchema = joinStepDetailsValidateSchema(t);
    } else {
      dataToBeValidated = { step_name: steps[stepIndex].step_name };
      validationSchema = endStepDetailsValidateSchema(t);
    }
    errorList = validate(
      dataToBeValidated,
      validationSchema,
    );
    if (isEmpty(errorList)) {
      const { saveStepAPI } = props;
      let saveStepData = {};
      let saveActionData = {};
      if ([STEP_TYPE.PARALLEL_STEP, STEP_TYPE.JOIN_STEP].includes(stepType)) {
        const updatedActionData = get(steps, [stepIndex, 'actions', 0, 'next_step_uuid'], []);
        const oldActionData = get(initialDetails, ['actions', 0, 'next_step_uuid'], []);

        if (!isEqual(oldActionData, updatedActionData)) {
          const actionData = cloneDeep(steps[stepIndex]?.actions?.[0] || {});
          if (actionData.action_type === ACTION_TYPE.END_FLOW) {
            delete actionData?.is_next_step_rule;
          }
          const connectedSteps = [];
          if (actionData?.next_step_uuid) {
            (actionData.next_step_uuid || []).forEach((step) => {
              connectedSteps.push({
                step_uuid: step,
                style: 'step',
              });
            });
          }
          saveActionData = {
            actions: actionData,
            connected_steps: connectedSteps,
          };
        }
      }
      if (
        (initialDetails.step_name !== steps[stepIndex].step_name) ||
        (
          (stepType === STEP_TYPE.JOIN_STEP) && (
            !isEqual(initialDetails.join_condition, steps[stepIndex]?.join_condition)
          )
        )
      ) {
        saveStepData = constructSystemStepSaveData(
          steps[stepIndex],
          { flow_id: flowId, steps },
        );
        if (stepType === STEP_TYPE.JOIN_STEP) {
          saveStepData = {
            ...saveStepData,
            join_condition: steps[stepIndex]?.join_condition || {
              type: JOIN_STEP_CONDITIONS.ALL,
            },
          };
        }
      }
      try {
        if (!isEmpty(saveStepData)) {
          const res = await saveStepAPI({ postData: saveStepData });
          console.log('save step res ', res);
        }
        if (!isEmpty(saveActionData)) {
          const { saveActionThunk } = props;
          const saveActionRes = await saveActionThunk({
            postData: {
              ...saveActionData,
              _id: steps[stepIndex]._id,
              step_uuid: steps[stepIndex].step_uuid,
              flow_id: flowId,
            },
            flowDataCopy: updatedFlowData,
            returnUpdatedData: true,
          });
          if (!isEmpty(saveActionRes)) {
            updatedFlowData = saveActionRes;
          }
        }
        const { updateFlowStateChange } = props;
        updateFlowStateChange({
          flowData: updatedFlowData,
          resetFocusInFlowComponent: true,
          isSystemStepConfigModalOpen: false,
          selectedSystemStepType: null,
          selectedSystemStepId: null,
          activeStepId: null,
          selectedSystemStepUuid: null,
          selectedSystemStepIndex: null,
        });
        updatePostLoader(false);
        setPointerEvent(false);
      } catch (e) {
        updatePostLoader(false);
        setPointerEvent(false);
        console.log(e);
      }
    } else {
      Object.keys(errorList).forEach((key) => {
        if (key === 'step_name') stepNameError = errorList[key];
        else if (key.includes('actions')) {
          if (stepType === STEP_TYPE.PARALLEL_STEP) {
            actionsError = PARALLEL_STEP_CONFIG.BRANCH_PARALLEL.ACTIONS_ERROR;
          } else actionsError = PARALLEL_STEP_CONFIG.JOIN_TYPE.ACTIONS_ERROR;
        } else if (key === 'join_condition') {
          joinStepCountError = PARALLEL_STEP_CONFIG.JOIN_TYPE.STEP_COUNT_ERROR;
        }
      });
    }
    setStepNameError(stepNameError);
    setDropdownError(actionsError);
    setJoinStepCountError(joinStepCountError);
  };

  const getJoinFlowStepsCount = (value) => {
    setJoinStepCountError(EMPTY_STRING);
    const { updateFlowDataChange, steps } = props;
    const stepsData = cloneDeep(steps);
    if (value === JOIN_STEP_CONDITIONS.ALL) {
      stepsData[stepIndex].join_condition = { type: value };
    } else if (value === JOIN_STEP_CONDITIONS.ANY) {
      stepsData[stepIndex].join_condition = { type: value, step_count: 1 };
    }
    updateFlowDataChange({ steps: stepsData });
  };

  const header = (
    <div className={cx(styles.header)}>
      <div className={cx(BS.D_FLEX, BS.FLEX_ROW, BS.JC_BETWEEN)}>
        <div className={gClasses.CenterV}>
          <div className={cx(gClasses.ModalHeader, gClasses.CursorPointer)}>
            {t(PARALLEL_STEP_CONFIG.HEADER)}
          </div>
        </div>
      </div>
    </div>
  );
    const footer = (
        <div className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
            <div
                className={cx(
                    BS.D_FLEX,
                    BS.JC_BETWEEN,
                    BS.W100,
                )}
            >
                <div className={gClasses.CenterV}>
                    <Button
                        buttonType={BUTTON_TYPE.DELETE}
                        className={cx(BS.TEXT_NO_WRAP, styles.DeleteButton)}
                        onClick={onDeleteStepHandler}
                    >
                        {t(DELETE_STEP_LABEL)}
                    </Button>
                </div>
                <div className={gClasses.CenterV}>
                    <Button
                        buttonType={BUTTON_TYPE.PRIMARY}
                        className={cx(BS.TEXT_NO_WRAP, styles.SaveButton)}
                        onClick={validateAndSave}
                    >
                       {t(PARALLEL_STEP_CONFIG.FOOTER.SAVE)}
                    </Button>
                </div>
            </div>
        </div>
    );
    const selectedStep = steps[stepIndex];
    const joinConditionType = selectedStep?.join_condition?.type;
    const selectedStepsList = (selectedStep && selectedStep.actions && selectedStep.actions[0] && selectedStep.actions[0].next_step_uuid) || [];
    const modalContent = (
        <div>
            <Input
                label={PARALLEL_STEP_CONFIG.INPUT.LABEL}
                placeholder={PARALLEL_STEP_CONFIG.INPUT.PLACEHOLDER}
                value={selectedStep && selectedStep.step_name}
                onChangeHandler={onStepNameChange}
                onBlurHandler={(e) => onStepNameChange(e, true)}
                errorMessage={stepNameError}
            />
            {
                (stepType !== STEP_TYPE.END_FLOW) && (
                    <Dropdown
                        isForceDropDownClose={forceToggleDropdown}
                        strictForceDropdownClose={forceToggleDropdown}
                        label={isParallelStep ? PARALLEL_STEP_CONFIG.MULTI_DROPDOWN.LABEL : PARALLEL_STEP_CONFIG.SINGLE_DROPDOWN.LABEL}
                        placeholder={isParallelStep ? PARALLEL_STEP_CONFIG.MULTI_DROPDOWN.PLACEHOLDER : PARALLEL_STEP_CONFIG.SINGLE_DROPDOWN.PLACEHOLDER}
                        optionList={stepsList}
                        selectedValue={isParallelStep ? selectedStepsList : selectedStepsList[0]}
                        onChange={(event) => {
                            console.log('eventtt onChange 1332', event);
                            getSelectedSteps(event);
                        }}
                        isMultiSectionDropdown
                        dropdownListCreateLabel={BRANCH_STEP.CREATE_LABEL}
                        dropdownListChooseLabel={BRANCH_STEP.CHOOSE_LABEL}
                        dropdownListNotFoundLabel={BRANCH_STEP.NO_DATA}
                        ButtonLabelMultiSectionDropdown={BRANCH_STEP.BUTTON_TEXT}
                        isMultiSelectWithMultiSection={isParallelStep}
                        disableFocusFilter
                        onButtonClick={createStep}
                        inputValue={searchStep}
                        onInputChangeHandler={updateSearchStep}
                        dropdownVisibility={onDropdownVisibility}
                        errorMessage={dropdownError || newStepNameError}
                        textError={newStepNameError}
                        waitForApiResponse
                        stopPropagationFromButton
                        buttonId={PARALLEL_STEP_CONFIG.MULTI_DROPDOWN.BUTTON_ID}
                        // showDropdownListIfError
                    />
                )
            }
            {
                (stepType === STEP_TYPE.JOIN_STEP) && (
                    <RadioGroup
                        optionList={PARALLEL_STEP_CONFIG.JOIN_TYPE.OPTIONS}
                        label={PARALLEL_STEP_CONFIG.JOIN_TYPE.LABEL}
                        onClick={getJoinFlowStepsCount}
                        errorMessage={joinStepCountError}
                        selectedValue={joinConditionType}
                    />
                )
            }
        </div>
    );
  return (
    <ModalLayout
      id="step_configuration"
      className={className}
      headerContent={header}
      footerContent={footer}
      footerClassName={styles.ModalFooter}
      isModalOpen={isModalOpen}
      mainContent={modalContent}
      onCloseClick={onCloseBtnClick}
    />
  );
}

const mapStateToProps = ({ EditFlowReducer }) => {
    return {
        stepId: EditFlowReducer.selectedSystemStepId,
        stepsList: EditFlowReducer.flowData.stepsList,
        flowId: EditFlowReducer.flowData.flow_id,
        stepIndex: EditFlowReducer.selectedSystemStepIndex,
        steps: EditFlowReducer.flowData.steps,
        stepType: EditFlowReducer.selectedSystemStepType,
        showStepDependencyDialog: EditFlowReducer.flowData.showStepDependencyDialog,
        flowData: EditFlowReducer.flowData,
        newStepNameError: EditFlowReducer[FLOW_STRINGS.SERVER_RESPONSE.NEW_STEP_ERROR_KEYS.FROM_SYSTEM_STEP_CONFIG],
    };
};

const mapDispatchToProps = {
  getAllSteps: getAllStepsListThunk,
  updateFlowStateChange,
  updateFlowDataChange,
  saveStepAPI: saveStepAPIThunk,
  checkStepDependency: checkStepDependencyApiThunk,
  updateStepCoordinatesAfterLinkChange: updateStepCoordinatesAfterLinkChange,
  saveActionThunk,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ParallelStepConfiguration);
