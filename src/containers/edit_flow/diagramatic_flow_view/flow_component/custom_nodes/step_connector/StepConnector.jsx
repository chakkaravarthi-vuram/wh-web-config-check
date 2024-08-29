import React from 'react';
import cx from 'classnames';
import { Handle, Position } from 'reactflow';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import ParallelFlowIcon from 'assets/icons/flow/ParallelFlowIcon';
import { STEP_TYPE } from 'utils/Constants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import Tooltip from 'components/tooltip/Tooltip';
import { BS } from 'utils/UIConstants';
import JoinParallelStepIcon from 'assets/icons/flow/JoinParallelStepIcon';
import { isEmpty } from 'utils/jsUtility';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import styles from '../step_card/StepCard.module.scss';
import AddFlow from '../../AddFlow';

function StepConnector({ id, type, data, xPos, yPos }) {
    const { updateFlowStateChange, stepId, displayDropdown, stepIndex, label, isInitialStep,
        connectedSteps, labelError } = data;
    const { t } = useTranslation();
    const onClick = () => {
        updateFlowStateChange({
            isSystemStepConfigModalOpen: true,
            selectedSystemStepType: type,
            selectedSystemStepId: stepId,
            activeStepId: stepId,
            selectedSystemStepUuid: id,
            selectedSystemStepIndex: stepIndex,
        });
    };

    const displayDropdownNode = ({ ref, xAdd, yAdd }) => {
        displayDropdown({ x: xPos + xAdd, y: yPos + yAdd }, ref, isInitialStep, stepId, connectedSteps);
    };
    return (
        <>
            <div id={id}>
                <div className={cx(BS.D_FLEX)}>
                <div
                    className={cx(styles.StepConnector, !isEmpty(labelError) && styles.ErrorClass, gClasses.CenterVH, type === STEP_TYPE.JOIN_STEP && styles.JoinStepIcon)}
                    onClick={onClick}
                    onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick}
                    tabIndex={0}
                    role="button"
                    id={`step-connector-${id}`}
                >
                    {type === STEP_TYPE.JOIN_STEP ? <JoinParallelStepIcon /> :
                    <ParallelFlowIcon /> }
                    <Handle type="target" position={Position.Top} id={`${id}-top`} />
                    <Handle type="source" position={Position.Bottom} id={`${id}-bottom`} />
                </div>
                </div>
                <div className={styles.VerticalConnector} />
                <AddFlow
                    displayDropdownNode={displayDropdownNode}
                    className={BS.TEXT_CENTER}
                    xAdd={200}
                    yAdd={200}
                />
                <Tooltip content={label} id={`step-connector-${id}`} isCustomToolTip />
            </div>
            {console.log('label error step connector', labelError)}
            {!isEmpty(labelError) &&
                <Tooltip
                    id={`step-connector-${id}`}
                    content={labelError}
                    isCustomToolTip
                    displayList
                    listTitle={t(FLOW_STRINGS.WARNING_TITLE)}
                    customInnerClasss={styles.ErrorInfo}
                    customArrowClass={styles.TooltipArrow}
                    listTitleClass={styles.TitleClass}
                />
            }
        </>
    );
}

export default StepConnector;
