import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { Button, Modal, ModalSize, ModalStyleType, TextArea, TextInput, Title, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';

import styles from '../../EditFlow.module.scss';
import CloseIcon from '../../../../assets/icons/task/CloseIcon';
import { BASIC_CONFIG_STRINGS } from '../StepConfiguration.utils';
import jsUtility, { isEmpty } from '../../../../utils/jsUtility';
import { updateFlowStateChange } from '../../../../redux/reducer/EditFlowReducer';
import { validate } from '../../../../utils/UtilityFunctions';
import { stepDetailsSchema } from '../StepConfiguration.validations';

function EditStepDetails(props) {
    const {
        isModalOpen,
        stepDetails,
        onCloseStepDetails,
        updateFlowState,
        stepDetails: { error_list = {} },
        saveStepBasicDetails,
    } = props;
    const { t } = useTranslation();
    console.log('editStepDetailshbsd', stepDetails);

    const [currentStepName, setStepName] = useState(stepDetails?.step_name);
    const [currentStepDesc, setStepDesc] = useState(stepDetails?.step_description);

    const { FIELDS } = BASIC_CONFIG_STRINGS;
    const currentData = {
        step_name: currentStepName,
        step_description: currentStepDesc,
    };

    useEffect(() => {
        setStepName(stepDetails?.step_name);
        setStepDesc(stepDetails?.step_description);
    }, []);

    const onChangeHandler = (e, id) => {
        const value = e?.target?.value;
        console.log('valueonChangeHandlerStep', value, 'currentStepName', currentStepName, 'currentStepDesc', currentStepDesc);
        const clonedDetails = jsUtility.cloneDeep(stepDetails);
        const clonedErrors = jsUtility.cloneDeep(error_list);

        switch (id) {
            case FIELDS.STEP_NAME.ID:
                // updateFlowState({ current_step_name: value });
                setStepName(value);
                currentData.step_name = value;
                break;
            case FIELDS.STEP_DESCRIPTION.ID:
                setStepDesc(value);
                currentData.step_description = value;
                break;
            default: break;
        }
        if (!isEmpty(clonedErrors?.[id])) {
            const stepNameErrors = validate(
                currentData,
                stepDetailsSchema(t),
            );
            if (!stepNameErrors?.[id]) {
                delete clonedErrors[id];
            }
            clonedDetails.error_list = { ...clonedErrors, ...(stepNameErrors || {}) };
            console.log('editStepDetailshbsdsErrors', stepNameErrors, 'error_list', clonedDetails.error_list);
            updateFlowState({ activeStepDetails: clonedDetails });
        }
    };

    const onSaveStepDetails = () => {
        const clonedDetails = jsUtility.cloneDeep(stepDetails);
        const clonedErrors = jsUtility.cloneDeep(error_list);
        const stepNameErrors = validate(
            currentData,
            stepDetailsSchema(t),
        );
        if (isEmpty(stepNameErrors)) {
            saveStepBasicDetails({ step_name: currentStepName, step_description: currentStepDesc });
        } else {
            clonedDetails.error_list = { ...clonedErrors, ...stepNameErrors };
        }
        updateFlowState({ activeStepDetails: clonedDetails });
    };

    const onModalClose = () => {
        const clonedDetails = jsUtility.cloneDeep(stepDetails);
        const clonedErrors = jsUtility.cloneDeep(error_list);
        delete clonedErrors[FIELDS.STEP_NAME.ID];
        delete clonedErrors[FIELDS.STEP_DESCRIPTION.ID];
        clonedDetails.error_list = { ...clonedErrors };
        updateFlowState({ activeStepDetails: clonedDetails });
        onCloseStepDetails();
    };

    const header = (
        <button
            className={cx(gClasses.PositionAbsolute, styles.CloseIcon)}
            onClick={onModalClose}
        >
            <CloseIcon />
        </button>
    );

    const main = (
        <div>
            <Title
                content="Edit Step Details"
                className={cx(styles.ModalTitle, gClasses.MB24)}
            />
            <TextInput
                id={FIELDS.STEP_NAME.ID}
                placeholder={t(FIELDS.STEP_NAME.PLACEHOLDER)}
                labelText={t(FIELDS.STEP_NAME.LABEL)}
                className={cx(gClasses.MB16)}
                value={currentStepName}
                onChange={(e) => onChangeHandler(e, FIELDS.STEP_NAME.ID)}
                errorMessage={error_list[FIELDS.STEP_NAME.ID]}
                required
            />
            <TextArea
                id={FIELDS.STEP_DESCRIPTION.ID}
                placeholder={t(FIELDS.STEP_DESCRIPTION.PLACEHOLDER)}
                labelText={t(FIELDS.STEP_DESCRIPTION.LABEL)}
                className={cx(gClasses.MB16)}
                inputInnerClassName={styles.Description}
                value={currentStepDesc}
                onChange={(e) => onChangeHandler(e, FIELDS.STEP_DESCRIPTION.ID)}
                errorMessage={error_list[FIELDS.STEP_DESCRIPTION.ID]}
            />
        </div>
    );

    const footer = (
        <div className={cx(gClasses.RightH, styles.EditStepFooter)}>
            <div className={gClasses.DisplayFlex}>
                <Button
                    type={EButtonType.PRIMARY}
                    buttonText={t(BASIC_CONFIG_STRINGS.SAVE_LABEL)}
                    onClickHandler={onSaveStepDetails}
                />
            </div>
        </div>
    );

    return (
        <Modal
            id="edit_step_name_details"
            modalStyle={ModalStyleType.modal}
            modalSize={ModalSize.md}
            isModalOpen={isModalOpen}
            headerContent={header}
            mainContent={main}
            mainContentClassName={styles.EditStepMain}
            footerContent={footer}
        />
    );
}

const mapDispatchToProps = {
    updateFlowState: updateFlowStateChange,
};

export default connect(null, mapDispatchToProps)(EditStepDetails);
