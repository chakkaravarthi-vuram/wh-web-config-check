import React from 'react';
import cx from 'classnames';
import { Handle, Position } from 'reactflow';
import { useTranslation } from 'react-i18next';
import { BS } from 'utils/UIConstants';
import globalClasses from 'scss/Typography.module.scss';
import SuccessIcon from 'assets/icons/flow/SuccessIcon';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import Tooltip from 'components/tooltip/Tooltip';
import { isEmpty } from 'utils/jsUtility';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import styles from '../step_card/StepCard.module.scss';

function EndFlowCard({ id, type, data }) {
    const { label, stepId, stepIndex, updateFlowStateChange, labelError } = data;
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
    return (
        <>
            <div
                id={`node-step-${id}`}
                className={cx(styles.EndFlowNode, !isEmpty(labelError) && styles.ErrorClass)}
                onClick={onClick}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick()}
                tabIndex={0}
                role="button"
            >
                <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
                <div className={BS.D_FLEX} id={`end-flow-${id}`}>
                <div className={globalClasses.PR10}>
                <SuccessIcon className={styles.SuccessIcon} />
                </div>
                <div className={(styles.EndCardLabel)}>
                {label}
                </div>
                </div>
                </div>
                <Tooltip content={label} id={`end-flow-${id}`} isCustomToolTip />
                <Handle type="target" position={Position.Top} id={`${id}-top`} />
            </div>
            {!isEmpty(labelError) &&
                <Tooltip
                    id={`node-step-${id}`}
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

export default EndFlowCard;
