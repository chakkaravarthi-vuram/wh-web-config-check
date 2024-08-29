import React from 'react';
import { Handle, Position } from 'reactflow';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import Tooltip from 'components/tooltip/Tooltip';
import SettingsIconNew from 'assets/icons/parallel_flow/SettingsIconNew';
import { isEmpty, cloneDeep } from 'utils/jsUtility';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import IntegrationIcon from 'assets/icons/parallel_flow/flow_dropdown/IntegrationIcon';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import { store } from 'Store';
import AddFlow from '../../AddFlow';
import styles from '../step_card/StepCard.module.scss';
import { FLOW_DROPDOWN_STRINGS } from '../../flow_dropdown/FlowDropdown.strings';

function InegrationStepCard({ id, data, xPos, yPos }) {
    const { stepId, isInitialStep, label, displayDropdown,
        connectedSteps, labelError, savedProgress, hasSource } = data;
    const { t } = useTranslation();

    const onClick = () => {
        const { flowData } = cloneDeep(store.getState().EditFlowReducer);
        const stepIndex = flowData?.steps?.findIndex((step) => (step._id === stepId));
        if (stepIndex > -1) {
            store.dispatch(updateFlowDataChange({
                isIntegrationConfigurationModalOpen: true,
                activeIntegrationData: flowData.steps[stepIndex],
            }));
        }
    };

    const displayDropdownNode = ({ ref, xAdd, yAdd }) => {
        displayDropdown({ x: xPos + xAdd, y: yPos + yAdd }, ref, isInitialStep, stepId, connectedSteps);
    };

    let nodeStatusStyle = null;

    if (!isEmpty(labelError)) {
        nodeStatusStyle = styles.ErrorNode;
    } else if (savedProgress > 0 && savedProgress < 3) {
        nodeStatusStyle = styles.InProgressNode;
    } else {
        nodeStatusStyle = styles.CompletedNode;
    }
    console.log('connectedSteps', connectedSteps);
    return (
        <>
            <div
                id={`node-step-${id}`}
                className={cx(styles.Node)}
            >
                <Handle type="target" position={Position.Top} id={`${id}-top`} className={(isInitialStep && !hasSource) && styles.HideHandle} />
                <div className={styles.IntegrationNode}>
                    <div className={cx(gClasses.CenterV, BS.JC_BETWEEN)}>
                        <div className={gClasses.CenterV}>
                            <IntegrationIcon />
                            <div className={gClasses.ML2}>
                                {t(FLOW_DROPDOWN_STRINGS.INTEGRATION)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx(styles.AllStepContent, nodeStatusStyle)}>
                    <div className={styles.StepDetail}>
                        <div className={BS.D_FLEX}>
                            <div className={styles.StepName} id={`node-step-name-${id}`}>
                                {label}
                            </div>
                            <Tooltip id={`node-step-name-${id}`} content={label} isCustomToolTip />
                        </div>
                    </div>
                    <div className={cx(
                        styles.EditStepIcons,
                        connectedSteps.length > 1 ? styles.IconPosition :
                            connectedSteps.length < 1 ? null : styles.PositionStyle1,
                    )}
                    >
                        <div className={cx(styles.StepIconContainer, BS.D_FLEX)}>
                            <div
                                className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}
                                onClick={() => onClick()}
                                onKeyDown={onClick}
                                tabIndex={0}
                                role="button"
                                id={`node-step-settings-icon-${id}`}
                            >
                                <SettingsIconNew className={styles.SettingsIcon} />
                            </div>
                            {/* <Tooltip id={`node-step-settings-icon-${id}`} content="Configure Step" isCustomToolTip /> */}
                        </div>
                    </div>
                </div>
            </div>
            {!isEmpty(labelError) && <Tooltip id={`node-step-${id}`} content={labelError} isCustomToolTip displayList listTitle={t(FLOW_STRINGS.WARNING_TITLE)} customInnerClasss={styles.ErrorInfo} customArrowClass={styles.TooltipArrow} listTitleClass={styles.TitleClass} />}
            <div className={styles.VerticalConnector} />
            {
                 connectedSteps.length < 1 && (
                    <AddFlow
                        displayDropdownNode={displayDropdownNode}
                        className={BS.TEXT_CENTER}
                        xAdd={200}
                        yAdd={200}
                    />
                )
            }
            {connectedSteps.length <= 1 &&
                <Handle type="source" position={Position.Bottom} id={`${id}-bottom`} />
            }

        </>
    );
}

export default InegrationStepCard;
