import React from 'react';
import cx from 'classnames/bind';
import { Handle, Position } from 'reactflow';
import gClasses from 'scss/Typography.module.scss';
import GateIcon from 'assets/icons/parallel_flow/GateIcon';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateFlowStateChange } from 'redux/reducer/EditFlowReducer';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import styles from './StepGate.module.scss';
import AddFlow from '../../AddFlow';

function StepGate(props) {
    const { className, displayDropdownNode, updateFlowState, stepId, isIntegrationStep = false } = props;
    const onClick = () => {
        updateFlowState({
            isConditionConfigurationModalOpen: true,
            conditionConfigurationStepId: stepId,
        });
    };
    return (
        <>
            <div
                className={cx(isIntegrationStep ? styles.IntegrationContainer : styles.Container, gClasses.CenterVH, className, gClasses.CursorPointer, gClasses.ClickableElement)}
                onClick={onClick}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick()}
                role="presentation"
            >
                <GateIcon
                    className={styles.Icon}
                />
                {/* <Handle type="target" position={Position.Left} className={styles.LeftHandle} /> */}
                <Handle type="source" position={Position.Bottom} className={styles.BottomHandle} id={`${stepId}-bottom`} />
            </div>
            {!isIntegrationStep &&
                <AddFlow
                    className={styles.AddButton}
                    displayDropdownNode={displayDropdownNode}
                    xAdd={250}
                    yAdd={200}
                />
            }
        </>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateFlowState: (value) => {
            dispatch(updateFlowStateChange(value));
        },
    };
};

export default withRouter(
    connect(null, mapDispatchToProps)(StepGate, 20),
);
