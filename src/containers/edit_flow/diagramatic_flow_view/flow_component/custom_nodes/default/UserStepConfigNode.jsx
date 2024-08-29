import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { STEP_TYPE } from '../../../../../../utils/Constants';
import { isEmpty } from '../../../../../../utils/jsUtility';
import { validate } from '../../../../../../utils/UtilityFunctions';
import { constructJoiObject, FLOW_STEP_NAME_VALIDATION } from '../../../../../../utils/ValidationConstants';
import { NODE_BE_KEYS } from '../../../../node_configuration/NodeConfiguration.constants';
import AddUserStep from '../../flow_node_dropdown/AddUserStep';
import styles from './DefaultNode.module.scss';
import { ADD_NEW_STEP_STRINGS } from '../../flow_node_dropdown/FlowNodeDropDown.constants';

function UserStepConfig({ id, data }) {
    const {
        addNewNode,
        removeNode,
        position,
    } = data;
    const [newStepName, setNewStepName] = useState(null);
    const [newStepNameError, setNewStepNameError] = useState(null);
    const { t } = useTranslation();

    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef?.current) {
            containerRef.current.focus();
        }
    }, [containerRef]);

    const createNewStepAndConnect = async (params) => {
        const res = await addNewNode(params);
        if (res.isSuccess) {
            return removeNode({});
        }
        if (res?.errors?.stepName) {
            setNewStepNameError(res?.errors?.stepName);
        }
        return false;
    };

    const stepNameChangeHandler = (e, isOnBlur) => {
        let { target: { value } } = e;
        let stepNameError = null;
        setNewStepName(value);
        if (!isEmpty(newStepNameError) || isOnBlur) {
            value = value.trim();
            const errors = validate({ stepName: value }, constructJoiObject({ stepName: FLOW_STEP_NAME_VALIDATION.required().label(ADD_NEW_STEP_STRINGS(t).USER_STEP_NAME) }));
            if (errors) {
                stepNameError = errors.stepName;
            }
            setNewStepNameError(stepNameError);
        }
    };
    const createNewUserStep = async () => {
        const errors = validate({ stepName: newStepName?.trim() }, constructJoiObject({ stepName: FLOW_STEP_NAME_VALIDATION.required().label(ADD_NEW_STEP_STRINGS(t).USER_STEP_NAME) }));
        if (isEmpty(errors)) {
            await createNewStepAndConnect({ stepType: STEP_TYPE.USER_STEP, stepName: newStepName, coordinateInfo: { [NODE_BE_KEYS.STEP_COORDINATES]: position } });
        } else {
            setNewStepNameError(errors.stepName);
        }
    };

    const onBlurHandler = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            removeNode({});
        }
    };

    return (
        <div
            id={id}
            ref={containerRef}
            role="menu"
            tabIndex={0}
            onBlur={onBlurHandler}
            className={styles.UserStepNode}
        >
            <AddUserStep
                stepNameChangeHandler={stepNameChangeHandler}
                createNewUserStep={createNewUserStep}
                newStepNameError={newStepNameError}
                newStepName={newStepName}
                removeNode={removeNode}
                showCancel
            />
        </div>
    );
}

export default UserStepConfig;
