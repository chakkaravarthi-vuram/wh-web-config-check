import React from 'react';
import { Handle, Position } from 'reactflow';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { BS } from 'utils/UIConstants';
import Tooltip from 'components/tooltip/Tooltip';
import SendBackIcon from 'assets/icons/parallel_flow/other_actions/SendBackIcon';
import AssignReviewIcon from 'assets/icons/parallel_flow/other_actions/AssignReviewIcon';
import CancelIcon from 'assets/icons/parallel_flow/other_actions/CancelIcon';
import SettingsIconNew from 'assets/icons/parallel_flow/SettingsIconNew';
import { isEmpty } from 'utils/jsUtility';
import SchedulerClockIcon from 'assets/icons/parallel_flow/SchedulerClockIcon';
import NoSchedulerIcon from 'assets/icons/parallel_flow/NoSchedulerIcon';
import { FLOW_STRINGS, STEP_CARD_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import AssigneeGroups from '../assignee_group/AssigneeGroup';
import AddFlow from '../../AddFlow';
import styles from './StepCard.module.scss';
import { CUSTOM_NODE_LABELS } from '../../FlowComponent.constants';
import { EDIT_FLOW_STEP_TABS } from '../../../../../application/app_components/dashboard/flow/Flow.utils';

function StepCard({ id, type, data, xPos, yPos }) {
    const { t } = useTranslation();
    const { stepId, isInitialStep, label, topHandle, bottomHandle, first_name, last_name, onClick, stepIndex, assigneesList, displayDropdown, connectedSteps, secondaryActions, labelError, assigneeLabels, savedProgress,
        hasSource, isRecursive } = data;
    console.log('isInitialStep1 ', isInitialStep, topHandle, bottomHandle, 'data', data, 'type', type, 'isRecursive', isRecursive);
    console.log('first_name', first_name, 'last_name', last_name);
    let secondaryActionsView = null;
    if (!isEmpty(secondaryActions)) {
        secondaryActionsView = (
            <div className={styles.AdditionalData}>
                <div className={styles.OtherActions}>
                    <div className={styles.ActionLabel}>
                        {STEP_CARD_STRINGS(t).OTHER_ACTIONS}
                    </div>
                    <div className={cx(gClasses.MT5, BS.D_FLEX)}>
                        {secondaryActions.isSendBackAdded && (
                            <div className={cx(styles.IconContainer, gClasses.CenterVH)} title={secondaryActions.sendBackButtonLabel}>
                                <SendBackIcon />
                            </div>
                        )}
                        {secondaryActions.isReviewActionAdded && (
                            <div className={cx(styles.IconContainer, gClasses.CenterVH)} title={secondaryActions.reviewButtonLabel}>
                                <AssignReviewIcon />
                            </div>
                        )}
                        {secondaryActions.isCancelAdded && (
                            <div className={cx(styles.IconContainer, gClasses.CenterVH)} title={secondaryActions.cancelButtonLabel}>
                                <CancelIcon className={styles.CancelIcon} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    const onCardClick = (e, isStartNodeSettingsClicked) => {
        if (keydownOrKeypessEnterHandle(e)) {
            if (isStartNodeSettingsClicked) {
                onClick({ type: CUSTOM_NODE_LABELS.START_NODE_SETTINGS, stepIndex, isInitialStep });
            } else {
                onClick({ type, stepIndex, isInitialStep });
            }
        }
        return null;
    };
    const displayDropdownNode = ({ ref, xAdd, yAdd }) => {
        displayDropdown({ x: xPos + xAdd, y: yPos + yAdd }, ref, isInitialStep, stepId, connectedSteps);
    };

    let nodeStatusStyle = null;

    if (!isEmpty(labelError)) {
        nodeStatusStyle = styles.ErrorNode;
    } else if (savedProgress < EDIT_FLOW_STEP_TABS.SET_ASSIGNEE) { // fixed https://workhall.atlassian.net/browse/ETF-8030
        nodeStatusStyle = styles.InProgressNode;
    } else {
        nodeStatusStyle = styles.CompletedNode;
    }

    return (
        <>
            <div
                id={`node-step-${id}`}
                className={cx(styles.Node)}
            >
                <Handle type="target" position={Position.Top} id={`${id}-top`} className={(isInitialStep && !hasSource) && styles.HideHandle} />
                {isInitialStep &&
                    <div className={styles.StartNode}>
                        <div className={cx(gClasses.CenterV, BS.JC_BETWEEN)}>
                            <div className={gClasses.CenterV}>
                                {isRecursive ? <SchedulerClockIcon className={gClasses.MR8} />
                                : <NoSchedulerIcon className={gClasses.MR8} /> }
                                {STEP_CARD_STRINGS(t).START_FLOW_TEXT}
                            </div>
                            <div
                                className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}
                                onClick={() => onClick({ type: CUSTOM_NODE_LABELS.START_NODE_SETTINGS, stepIndex })}
                                onKeyDown={(e) => onCardClick(e, isInitialStep)}
                                tabIndex={0}
                                role="button"
                                id={`node-step-settings-icon-${id}`}
                            >
                                <SettingsIconNew className={styles.StartNodeSettings} />
                            </div>
                        </div>
                    </div>
                }
                <div className={cx(styles.AllStepContent, nodeStatusStyle, isInitialStep && styles.removeTopBorder)}>
                  <div className={styles.StepDetail}>
                    <div className={BS.D_FLEX}>
                        <div className={styles.StepName} id={`node-step-name-${id}`}>
                            {label}
                        </div>
                        <Tooltip id={`node-step-name-${id}`} content={label} isCustomToolTip />
                    </div>
                    {
                        !isEmpty(assigneesList) && (
                            <div className={cx(BS.D_FLEX, gClasses.PT5, gClasses.PR10)}>
                                <AssigneeGroups assigneesList={assigneesList} assigneeLabels={assigneeLabels} />
                            </div>
                        )
                    }
                  </div>
                    {secondaryActionsView}
                    <div className={cx(
                        styles.EditStepIcons,
                    )}
                    >
                    <div className={cx(styles.StepIconContainer, BS.D_FLEX)}>
                        <div
                            className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}
                            onClick={() => onClick({ type, stepIndex, isInitialStep })}
                            onKeyDown={onCardClick}
                            tabIndex={0}
                            role="button"
                            id={`node-step-settings-icon-${id}`}
                        >
                            <SettingsIconNew className={styles.SettingsIcon} />
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            {console.log('label error stepCard', labelError)}
            { !isEmpty(labelError) && <Tooltip id={`node-step-${id}`} content={labelError} isCustomToolTip displayList listTitle={t(FLOW_STRINGS.WARNING_TITLE)} customInnerClasss={styles.ErrorInfo} customArrowClass={styles.TooltipArrow} listTitleClass={styles.TitleClass} /> }
            <div className={styles.VerticalConnector} />
                    <>
                        <AddFlow
                            displayDropdownNode={displayDropdownNode}
                            className={BS.TEXT_CENTER}
                            xAdd={200}
                            yAdd={200}
                        />
                        <Handle type="source" position={Position.Bottom} id={`${id}-bottom`} />
                    </>
        </>
    );
}

export default StepCard;
