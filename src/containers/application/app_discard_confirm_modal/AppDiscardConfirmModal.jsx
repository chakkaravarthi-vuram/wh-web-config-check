import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, DialogSize, ModalStyleType, Title, ETitleAlign, ETitleSize, ETitleHeadingLevel, Button, EButtonType, Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import AlertCircle from '../../../assets/icons/application/AlertCircle';
import CloseIconNew from '../../../assets/icons/CloseIconNew';
import styles from './AppDiscardConfirmModal.module.scss';
import { CANCEL_LABEL, DISCARD, DISCARD_APP } from '../../../utils/strings/CommonStrings';

function AppDiscardConfirmModal(props) {
    const { t } = useTranslation();
    const { id, onCloseModal, content, onAcceptClick, isModalOpen } = props;
    return (
        <Modal
            id={id}
            modalStyle={ModalStyleType.dialog}
            dialogSize={DialogSize.sm}
            className={gClasses.CursorAuto}
            mainContent={
            (
                <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.ALIGN_ITEM_CENTER, gClasses.P16)}>
                    <div className={cx(BS.D_FLEX, BS.JC_END, gClasses.MB8, BS.W100)}>
                    <button onClick={onCloseModal}><CloseIconNew /></button>
                    </div>

                    <div className={cx(styles.AlertCircle, gClasses.CenterVH)}><AlertCircle /></div>
                    <Title
                        content={t(DISCARD_APP)}
                        alignment={ETitleAlign.middle}
                        headingLevel={ETitleHeadingLevel.h5}
                        size={ETitleSize.xs}
                        className={gClasses.MB16}
                    />
                    <Text
                        content={content}
                        size={ETextSize.SM}
                        className={cx(gClasses.MB8, BS.TEXT_CENTER)}
                    />
                    <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.MT16, gClasses.MB32)}>
                    <Button
                        buttonText={t(CANCEL_LABEL)}
                        onClickHandler={onCloseModal}
                        type={EButtonType.OUTLINE_SECONDARY}
                        className={cx(styles.MdCancelBtn, gClasses.MR16)}
                    />
                    <Button
                        buttonText={t(DISCARD)}
                        onClickHandler={onAcceptClick}
                        className={styles.MdDeleteBtn}
                        type={EButtonType.PRIMARY}
                    />
                    </div>
                </div>)
            }
            isModalOpen={isModalOpen}
        />
    );
}

export default AppDiscardConfirmModal;
