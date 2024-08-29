import React from 'react';
import { Handle, Position } from 'reactflow';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { ACTION_TYPE } from 'utils/constants/action.constant';
import styles from './ActionCard.module.scss';

function ActionCard({ id, data }) {
    const { isInitialStep, label, topHandle, bottomHandle, actionType } = data;
    console.log('isInitialStep ', isInitialStep, topHandle, bottomHandle, 'label', label, 'actionType', actionType);
    let actionClass = null;
    switch (actionType) {
        case ACTION_TYPE.SEND_BACK:
            actionClass = styles.Reject;
            break;
        // case ACTION_TYPE.NEXT:
        //     actionClass = styles.Next;
        //     break;
        case ACTION_TYPE.END_FLOW:
            actionClass = styles.End;
            break;
        case ACTION_TYPE.FORWARD:
            actionClass = styles.Next;
            break;
        case ACTION_TYPE.ASSIGN_REVIEW:
            actionClass = styles.Next;
            break;
        default: break;
    }
    return (
        <div id={id} className={cx(styles.Action, actionClass)}>
            <Handle type="target" position={Position.Top} id={`${id}-top`} />
            <div title={label} className={gClasses.CenterH}>
                <span className={gClasses.Ellipsis}>
                    {label}
                </span>
            </div>
            <Handle type="source" position={Position.Bottom} id={`${id}-bottom`} />
            {/* <Handle type="target" position={Position.Left} id={`${id}-left`} /> */}
            <Handle type="source" position={Position.Right} id={`${id}-right`} />
        </div>
    );
}

export default ActionCard;
