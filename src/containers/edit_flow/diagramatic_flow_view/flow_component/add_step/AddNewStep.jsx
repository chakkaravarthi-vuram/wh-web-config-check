import React, { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { BS } from 'utils/UIConstants';
import EditableLabel from 'components/form_components/editable_label/EditableLabel';
import gClasses from 'scss/Typography.module.scss';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import SettingsIconNew from 'assets/icons/parallel_flow/SettingsIconNew';
import { isEmpty } from 'utils/jsUtility';
import { generateEventTargetObject } from 'utils/generatorUtils';
import Tooltip from 'components/tooltip/Tooltip';
// import { Input } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './AddNewStep.module.scss';
import AddFlow from '../AddFlow';
import StepGate from '../custom_nodes/step_gate/StepGate';
import stepCardStyles from '../custom_nodes/step_card/StepCard.module.scss';

function AddNewStep({ id, type, data, xPos, yPos }) {
    const { t } = useTranslation();
    const { className, stepIndex, isInitialStep, onChange, onClickIcon, tempLabel, label, labelError, displayDropdown, stepId, connectedSteps, displayConnector } = data;
    const handleIconClick = (event) => {
        event.stopPropagation();
        onClickIcon({ type, stepIndex, label: tempLabel });
    };
    const [stepName, setStepName] = useState(tempLabel);
    useEffect(() => {
        setStepName(tempLabel);
    }, []);

    const onChangeHandler = (event) => {
        onChange(event, stepIndex);
        setStepName(event.target.value);
    };

    const onBlurHandler = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            onChange(event, stepIndex, true);
        }
    };
    const displayDropdownNode = ({ ref, xAdd, yAdd }) => {
        if (!isEmpty(label)) {
            displayDropdown({ x: xPos + xAdd, y: yPos + yAdd }, ref, isInitialStep, stepId, connectedSteps);
        } else {
            onChange(generateEventTargetObject(id, tempLabel), stepIndex, true);
        }
    };
    return (
        <div>
            <div className={cx(styles.AddContainer, className, labelError && styles.ErrorContainer, BS.D_FLEX)} id={`add-new-step-${id}`} onBlur={onBlurHandler}>
                {!isInitialStep && <Handle type="target" position={Position.Top} />}
                <div className={cx(gClasses.CenterV, BS.JC_BETWEEN, BS.W100)}>
                    <EditableLabel
                        placeholder={t(FLOW_STRINGS.STEPS.INITIAL_CONFIGURATION_STEP.STEP_NAME_PLACEHOLDER)}
                        textClasses={gClasses.FTwo14}
                        className={styles.StepLabel}
                        onChangeHandler={onChangeHandler}
                        value={stepName}
                        noLabelPadding
                    />
                    {/* <Input
                        placeholder={t(FLOW_STRINGS.STEPS.INITIAL_CONFIGURATION_STEP.STEP_NAME_PLACEHOLDER)}
                        onChange={onChangeHandler}
                        content={stepName}
                        innerClassName={gClasses.FTwo14}
                        className={styles.StepLabel}
                    /> */}
                    <div
                        onClick={handleIconClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && handleIconClick(e)}
                        className={cx(gClasses.CenterV, gClasses.CursorPointer, gClasses.H100)}
                    >
                        <SettingsIconNew className={styles.SettingsIcon} />
                    </div>
                </div>
            </div>
            {!isEmpty(labelError) && <Tooltip content={labelError} id={`add-new-step-${id}`} isCustomToolTip />}
            <div className={stepCardStyles.VerticalConnector} />
            {
                displayConnector ? (

                    <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, stepCardStyles.Connector)}>
                        <StepGate
                            displayDropdownNode={displayDropdownNode}
                            stepId={id}
                        />
                    </div>
                ) : (
                    <>
                        <AddFlow
                            displayDropdownNode={displayDropdownNode}
                            className={cx(BS.TEXT_CENTER, isEmpty(label) && gClasses.DisabledField)}
                            xAdd={200}
                            yAdd={200}
                        />
                        <Handle type="source" position={Position.Bottom} id={`${id}-bottom`} />
                    </>
                )
            }
        </div>
    );
}

export default AddNewStep;
