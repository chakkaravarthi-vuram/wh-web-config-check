import React from 'react';
import { Handle, Position } from 'reactflow';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { BS } from 'utils/UIConstants';
import Tooltip from 'components/tooltip/Tooltip';
import SettingsIconNew from 'assets/icons/parallel_flow/SettingsIconNew';
import { isEmpty } from 'utils/jsUtility';
import AnotherFlowIcon from 'assets/icons/parallel_flow/AnotherFlowIcon';
import { store } from 'Store';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import styles from '../step_card/StepCard.module.scss';
import AddFlow from '../../AddFlow';

function AnotherFlowCard({ id, type, data, xPos, yPos }) {
    const { stepId, isInitialStep, label, topHandle, bottomHandle, first_name, last_name, stepIndex,
            labelError, hasSource, displayDropdown, connectedSteps } = data;
    console.log('isTriggerStep ', isInitialStep, topHandle, bottomHandle, labelError);
    console.log('first_name', first_name, 'last_name', last_name);
    const onClick = () => {
        console.log('onClickonClickonClickonClick');
        store.dispatch(updateFlowDataChange({
        isFlowTriggerConfigurationModalOpen: true,
        anotherFlowConfigurationStepId: stepId,
    }));
    };
    const { t } = useTranslation();

    const displayDropdownNode = ({ ref, xAdd, yAdd }) => {
        displayDropdown({ x: xPos + xAdd, y: yPos + yAdd }, ref, isInitialStep, stepId, connectedSteps);
    };

    let nodeStatusStyle = null;
    if (!isEmpty(labelError)) {
        nodeStatusStyle = styles.ErrorNode;
    }

    return (
        <>
            <div
                id={`node-step-${id}`}
                className={cx(styles.AnotherFlowNode, nodeStatusStyle)}
            >
                <Handle type="target" position={Position.Top} id={`${id}-top`} className={(isInitialStep && !hasSource) && styles.HideHandle} />
                <div className={cx(styles.AnotherFlowDetail,
                    )}
                >
                    <div className={BS.D_FLEX}>
                        <div>
                            <AnotherFlowIcon />
                        </div>
                        <div className={cx(styles.AnotherFlowName)} id={`node-step-name-${id}`}>
                            {label}
                        </div>
                        <Tooltip id={`node-step-name-${id}`} content={label} isCustomToolTip />
                    </div>
                </div>
                <div className={cx(
                    styles.EditStepIcons,
                    connectedSteps.length > 0 && styles.B0,
                )}
                >
                    <div className={cx(BS.D_FLEX, styles.StepIconContainer)}>
                        <div
                            className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}
                            onClick={() => onClick({ type, stepIndex })}
                            onKeyDown={onClick}
                            tabIndex={0}
                            role="button"
                            id={`node-step-settings-icon-${id}`}
                        >
                            <SettingsIconNew className={styles.SettingsIcon} />
                        </div>
                    </div>
                </div>
            </div>
            {console.log('label error triggerNode', labelError)}
            { !isEmpty(labelError) &&
                <Tooltip
                    id={`node-step-${id}`}
                    content={labelError}
                    isCustomToolTip
                    displayList
                    listTitle={t(FLOW_STRINGS.WARNING_TITLE)}
                    customInnerClasss={styles.TriggerNodeError}
                    customArrowClass={styles.TooltipArrow}
                    listTitleClass={styles.TitleClass}
                />
            }
            {/* <Handle type="source" position={Position.Bottom} id={`${id}-bottom`}  /> */}
            <>
                {
                    connectedSteps.length < 1 && (
                        <>
                            <div className={styles.VerticalConnector} />
                            <AddFlow
                                displayDropdownNode={displayDropdownNode}
                                className={BS.TEXT_CENTER}
                                xAdd={200}
                                yAdd={200}
                            />
                        </>
                    )
                }
                <Handle type="source" position={Position.Bottom} id={`${id}-bottom`} />
            </>
        </>
    );
}

export default AnotherFlowCard;
