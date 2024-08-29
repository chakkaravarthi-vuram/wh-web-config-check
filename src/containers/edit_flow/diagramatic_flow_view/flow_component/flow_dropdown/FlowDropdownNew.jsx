import React, {
    useState,
} from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import AutoPositioningPopper, { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import Input from 'components/form_components/input/Input';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { isEmpty } from 'utils/jsUtility';
import { STEP_TYPE } from 'utils/Constants';
import { calculateStepName } from 'containers/edit_flow/EditFlow.utils';
import { ACTION_TYPE } from 'utils/constants/action.constant';
import { store } from 'Store';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import { NEW_TRIGGER_STEP_DATA } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import styles from './FlowDropdown.module.scss';
import { FLOW_DROPDOWN_LIST, FLOW_DROPDOWN_COMPONENT_ID, OTHER_OPTIONS_LIST } from './FlowDropdown.constants';
import { FLOW_DROPDOWN_STRINGS } from './FlowDropdown.strings';
import { CUSTOM_COMPONENTS_ID } from '../FlowComponent.constants';
import { NEW_INTEGRATION_DATA } from '../flow_integration_configuration/FlowIntegrationConfiguration.constants';
import { getModelListThunk } from '../../../../../redux/actions/MlModelList.Action';
import { NEW_ML_INTEGRATION_DATA } from '../flow_ml_configuration/MLModelConfiguration.constants';

function FlowDropdown({ id, data }) {
    const { className, onChangeOption, referenceElement, removeNode, connectToStep,
            stepsList, fetchingAllStepsData, connectedSteps, serverError, removeStepNameServerError,
            stepType } = data;
    const { t } = useTranslation();
    const { flowData } = store.getState().EditFlowReducer;
    const [subMenuPopperReference, setSubMenuRef] = useState(null);
    const [subMenuOption, setSubMenuOption] = useState(false);
    const [stepName, setStepName] = useState(null);
    const [stepNameError, setStepNameError] = useState(null);
    const [selectedStep, setSelectedStep] = useState(null);
    const [stepSelectionError, setStepSelectionError] = useState(null);
    const connectedStepIds = connectedSteps.map((step) => step.step_uuid);
    const filteredStepsList = (stepsList && connectedSteps) ? stepsList.filter((step) => !connectedStepIds.includes(step.value)) : stepsList || [];
    const filteredStepsListForParallel = filteredStepsList.filter((step) =>
    step.step_type === STEP_TYPE.PARALLEL_STEP || step.step_type === STEP_TYPE.USER_STEP ||
    step.step_type === STEP_TYPE.FLOW_TRIGGER || step.step_type === STEP_TYPE.INTEGRATION);
    const optionClicked = (e, option) => {
        e.stopPropagation();
        setSubMenuOption(option.TYPE);
        if (option.TYPE === STEP_TYPE.LINK_STEP) {
            const { getAllSteps } = data;
            getAllSteps(connectToStep);
        } else if ([STEP_TYPE.PARALLEL_STEP, STEP_TYPE.JOIN_STEP, STEP_TYPE.END_FLOW].includes(option.TYPE)) {
            const newActionType = option.TYPE === STEP_TYPE.END_FLOW ? ACTION_TYPE.END_FLOW : ACTION_TYPE.FORWARD;
            console.log('newActionType set', newActionType, option);
            calculateStepName(option.TYPE, (stepName) => {
                onChangeOption({
                    stepType: option.TYPE,
                    stepName,
                    connectToStep,
                    createNewAction: true,
                    newActionType,
                    actionRootString: 'Submit',
                });
            }, t);
        } else if (option.TYPE === STEP_TYPE.FLOW_TRIGGER) {
            store.dispatch(updateFlowDataChange({
                isFlowTriggerConfigurationModalOpen: true,
                activeTriggerData: NEW_TRIGGER_STEP_DATA,
                flowDropdownNode: null,
                triggerParentId: connectToStep,
            }));
        } else if (option.TYPE === STEP_TYPE.INTEGRATION) {
            store.dispatch(updateFlowDataChange({
                isIntegrationConfigurationModalOpen: true,
                activeIntegrationData: NEW_INTEGRATION_DATA,
                flowDropdownNode: null,
                integrationParentId: connectToStep,
            }));
        } else if (option.TYPE === STEP_TYPE.ML_MODELS) {
            const newMlntegrationData = NEW_ML_INTEGRATION_DATA;
            store.dispatch(getModelListThunk())
                .then((res) => {
                    store.dispatch(updateFlowDataChange({
                        isMlIntegrationModalOpen: true,
                        mlModelIntegrationStepID: null,
                        mlIntegrationParentId: connectToStep,
                        activeMLIntegrationData: { MLModelList: res, ...newMlntegrationData },
                        currentMLModelStepID: null,
                        flowDropdownNode: null,
                    }));
                });
        }
    };

    const handleStepNameChange = (e, isOnBlur = false) => {
        let { value } = e.target;
        if (isOnBlur) value = (value || EMPTY_STRING).trim();
        else if (!isEmpty(serverError)) removeStepNameServerError();
        if (stepNameError) { // || isOnBlur) {
            setStepNameError(EMPTY_STRING);
        }
        setStepName(value);
    };

    const createStepClicked = () => {
        if (isEmpty(stepNameError)) {
            onChangeOption({
                stepType: subMenuOption,
                stepName,
                connectToStep,
                createNewAction: true,
                newActionType: ACTION_TYPE.FORWARD,
                actionRootString: 'Submit',
            });
        }
    };

    const updateSelectedStep = (e) => {
        const { value } = e.target;
        console.log(e.target, 'fnjgknkjdnkjnfjkd');
        setStepSelectionError(null);
        setSelectedStep(value);
    };

    const otherOptionsMenu = OTHER_OPTIONS_LIST.map((option) =>
            <div
                className={cx(styles.OptionContainer, styles.OtherOption)}
                id={option.ID}
                key={option.ID}
                onClick={(e) => optionClicked(e, option)}
                role="menuitem"
                tabIndex="0"
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && optionClicked(e, option)}

            >
                <div className={gClasses.CenterV}>
                    {option.ICON}
                    <div className={cx(styles.OptionLabel, gClasses.ML10)}>
                        {option.TITLE}
                    </div>
                </div>
            </div>,
    );

    const linkExistingStep = (e) => {
        e.stopPropagation();
        if (!isEmpty(selectedStep)) {
            const selectedStepData = filteredStepsList.find((step) => step.value === selectedStep);
            const newActionType = selectedStepData.step_type === STEP_TYPE.END_FLOW ? ACTION_TYPE.END_FLOW : ACTION_TYPE.FORWARD;
            onChangeOption({
                stepType: subMenuOption,
                stepName: selectedStep,
                connectToStep,
                createNewAction: true,
                newActionType,
                actionRootString: 'Submit',
            });
        } else setStepSelectionError(FLOW_DROPDOWN_STRINGS.STEP_SELETCTION_ERROR);
    };
    console.log('connectToStep stepList', connectToStep, stepsList, stepType);
    const dropdownList = FLOW_DROPDOWN_LIST.map((option) => {
        if (option.ID === FLOW_DROPDOWN_COMPONENT_ID.SEQUENCE || option.ID === FLOW_DROPDOWN_COMPONENT_ID.PARALLEL_HEADER) {
            return (
                <div
                    id={option.ID}
                    className={cx(styles.SectionTitle, gClasses.CursorDefault)}
                    key={option.ID}
                >
                    {option.TITLE}
                </div>
            );
        }
        const disableOption = (
            (stepType === STEP_TYPE.PARALLEL_STEP) &&
            ([FLOW_DROPDOWN_COMPONENT_ID.JOIN_STEP, FLOW_DROPDOWN_COMPONENT_ID.END].includes(option.ID))
        );
        const menuItemRef = (subMenuOption === option.TYPE) ? setSubMenuRef : null;
        return (
            <div
                className={cx(styles.OptionContainer, disableOption && styles.DisabledOption)}
                ref={menuItemRef}
                disabled={disableOption}
                onClick={(e) => !disableOption && optionClicked(e, option)}
                role="menuitem"
                tabIndex="0"
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && !disableOption && optionClicked(e, option)}
                id={option.ID}
                key={option.ID}
            >
                <div className={cx(gClasses.CenterV, BS.JC_BETWEEN)}>
                    <div className={gClasses.CenterV}>
                        <div className={cx(styles.Icons, gClasses.CenterV)}>
                            {option.ICON}
                        </div>
                        <div className={cx(styles.OptionLabel, gClasses.ML10, gClasses.CenterV)}>
                            {option.TITLE}
                        </div>
                    </div>
                    {option.RIGHT_ARROW ? (
                        <div className={cx(gClasses.RightArrow, styles.RightArrow)} />
                    ) : null}
                </div>
            </div>
        );
    });
    let subMenu = null;
    console.log('subMenuOptionsubMenuOption', subMenuOption);
    if (subMenuOption) {
        if (subMenuOption === STEP_TYPE.LINK_STEP) {
            let subMenuDropdownList = filteredStepsList;
            if (stepType === STEP_TYPE.PARALLEL_STEP) subMenuDropdownList = filteredStepsListForParallel;
            subMenu = (
                <div className={styles.SideMenu} id={CUSTOM_COMPONENTS_ID.SUBMENU_DROPDOWN}>
                    <Dropdown
                        label={FLOW_DROPDOWN_STRINGS.SUBDROPDOWN_CTA}
                        placeholder={FLOW_DROPDOWN_STRINGS.SUBDROPDOWN_PLACEHOLDER}
                        optionList={subMenuDropdownList}
                        onChange={updateSelectedStep}
                        errorMessage={stepSelectionError}
                        isDataLoading={fetchingAllStepsData}
                        selectedValue={selectedStep}
                        showNoDataFoundOption
                        enableOnClick
                    />
                    <Button
                        buttonType={BUTTON_TYPE.PRIMARY}
                        className={styles.ApplyBtn}
                        onClick={linkExistingStep}
                    >
                        {FLOW_DROPDOWN_STRINGS.SUBDROPDOWN_CTA}
                    </Button>
                </div>
            );
        } else if (subMenuOption === STEP_TYPE.PARALLEL_STEP ||
                   subMenuOption === STEP_TYPE.JOIN_STEP ||
                   subMenuOption === STEP_TYPE.END_FLOW) {
                    subMenu = null;
        } else if (subMenuOption === STEP_TYPE.OTHERS) {
            subMenu = (
            //     <div className={styles.Trigger}>
            //         <div className={cx(gClasses.CenterV, BS.H100)}>
            //             <TriggerIcon className={gClasses.MR7} />
            //             Call Another Flow
            //         </div>
            //     </div>
                <div className={cx(styles.Container)}>
                    {otherOptionsMenu}
                </div>
            );
        } else if (subMenuOption === STEP_TYPE.USER_STEP) {
            subMenu = (
                <div className={styles.SideMenu} id={CUSTOM_COMPONENTS_ID.SUBMENU_INPUT}>
                    <Input
                        placeholder={FLOW_DROPDOWN_STRINGS.SUBINPUT_PLACEHOLDER}
                        label={FLOW_DROPDOWN_STRINGS.SUBINPUT_LABEL}
                        onChangeHandler={handleStepNameChange}
                        value={stepName}
                        errorMessage={stepNameError || serverError}
                        onBlurHandler={(e) => handleStepNameChange(e, true)}
                        disabled={flowData.isCreateNewStepLoading}
                        className={styles.MarginBottom}
                    />
                    <Button
                        buttonType={BUTTON_TYPE.PRIMARY}
                        className={styles.ApplyBtn}
                        onClick={createStepClicked}
                        disabled={flowData.isCreateNewStepLoading}
                    >
                        {FLOW_DROPDOWN_STRINGS.SUBINPUT_CTA}
                    </Button>
                </div>
            );
        }
    }
    const preventClosingOfDropdown = (e) => {
        const dropdown = document.getElementById(CUSTOM_COMPONENTS_ID.SUBMENU_DROPDOWN);
        const input = document.getElementById(CUSTOM_COMPONENTS_ID.SUBMENU_INPUT);
        if ((dropdown && dropdown.contains(e.target)) || (input && input.contains(e.target))) e.stopPropagation();
        else removeNode && removeNode();
    };

    return (
        <div
            // ref={popperContainerRef}
            tabIndex={-1}
            role="presentation"
            id={id}
            onClick={preventClosingOfDropdown}
            className="nowheel" // to allow scrolling
        >
            <AutoPositioningPopper
                className={gClasses.ZIndex1}
                placement={POPPER_PLACEMENTS.BOTTOM}
                fallbackPlacements={POPPER_PLACEMENTS.TOP}
                isPopperOpen
                style={{ position: 'unset !important' }}
                onBlur={removeNode}
                referenceElement={referenceElement}
            >
                <div className={cx(styles.Container, className)}>
                    {dropdownList}
                </div>
            </AutoPositioningPopper>
            <div
                role="presentation"
                tabIndex={-1}
            >
                <AutoPositioningPopper
                    // className={gClasses.ZIndex1}
                    isPopperOpen={!isEmpty(subMenuOption)}
                    referenceElement={subMenuPopperReference}
                    placement={POPPER_PLACEMENTS.RIGHT_START}
                    fallbackPlacements={POPPER_PLACEMENTS.LEFT_START}
                >
                    {subMenu}
                </AutoPositioningPopper>
            </div>
        </div>
    );
}
export default FlowDropdown;
