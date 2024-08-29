import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { Modal, Title, ModalStyleType, ModalSize, Text, ETextSize, Button, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import { Link } from 'react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import PlusIconNew from '../../../../assets/icons/PlusIconV2';
import styles from './CreateAppInstruction.module.scss';
import { APP_INSTRUCTION_LIST, CREATE_APP_INSTRUCTION } from './CreateAppInstruction.utils';

function CreateAppInstruction(props) {
    const { t } = useTranslation();
    const {
        className,
        onCloseInstructionModal,
        createModalClass,
    } = props;

    const appInstructionList = APP_INSTRUCTION_LIST(t).map((option) => (
        <div className={gClasses.MB24}>
        <Title
            content={option.COMPONENT_TITLE}
            className={cx(gClasses.FTwo16GrayV3, gClasses.FontWeight500, gClasses.MB8)}
        />
        <Text size={ETextSize.XS} content={option.COMPONENT_INFO} className={styles.InfoText} />
        <Link className={cx(gClasses.CenterV, gClasses.MT16, styles.CreateLink)} to={option.CREATE_LINK} target="_blank">
            <PlusIconNew className={cx(gClasses.MR4, styles.PlusIcon)} />
            {option.CREATE_LINK_TEXT}
        </Link>
        </div>
    ));

    const modalContent = (
        <>
            <Title
                content={t(CREATE_APP_INSTRUCTION.HEADER)}
                className={cx(gClasses.FTwo20GrayV3, gClasses.FontWeight500, styles.InstructionHeader)}
            />
            {appInstructionList}
            <div className={cx(gClasses.CenterH, gClasses.PT20)}>
            <Button
                type={EButtonType.PRIMARY}
                className={styles.SkipButton}
                buttonText={t(CREATE_APP_INSTRUCTION.SKIP_BTN_LABEL)}
                onClickHandler={onCloseInstructionModal}
            />
            </div>
        </>
    );

    return (
        <Modal
            id={CREATE_APP_INSTRUCTION.ID}
            modalStyle={ModalStyleType.dialog}
            className={cx(className, gClasses.CenterVH, gClasses.CursorDefault)}
            customModalClass={cx(styles.AppInstructionModal, createModalClass)}
            isModalOpen
            mainContent={modalContent}
            modalSize={ModalSize.sm}
        />
    );
}

export default CreateAppInstruction;
