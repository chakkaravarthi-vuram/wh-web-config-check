import React from 'react';
import { Modal, DialogSize, ModalStyleType, Title, Text, ETitleAlign, ETextSize, ETitleSize, ETitleHeadingLevel, Button, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import AlertCircle from '../../../assets/icons/application/AlertCircle';
import CloseIconNew from '../../../assets/icons/CloseIconNew';
import { GET_APP_LIST_LABEL } from '../app_listing/AppList.constants';
import { UTIL_COLOR } from '../../../utils/Constants';
import styles from './DeleteConfirmModal.module.scss';
import DeleteDataListIcon from '../../../assets/icons/DeleteDataListsIcon';

function DeleteConfirmModal(props) {
    const { id, onCloseModal, content, firstLine, secondLine, onDelete, isModalOpen, cancelButton, DeleteButton, isMfaConfirmationModal, languageStyle, isDeleteDataList, modalContainerClass, contentClassName, buttonClassName, cancelButtonStyles, mainContentClassName, isDeleteFlow, deleteRadioGroupComponent } = props;
    const { t } = useTranslation();
    const APP_LIST_LABEL = GET_APP_LIST_LABEL(t);
    return (
        <Modal
            id={id}
            modalStyle={ModalStyleType.dialog}
            dialogSize={(isMfaConfirmationModal || isDeleteFlow) ? DialogSize.md : DialogSize.sm}
            className={gClasses.CursorAuto}
            customModalClass={isDeleteDataList && cx(gClasses.Width400, styles.ModalClassName)}
            mainContentClassName={mainContentClassName}
            mainContent={
            (
                <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.ALIGN_ITEM_CENTER, gClasses.P16, modalContainerClass)}>
                    { isDeleteDataList ? null :
                    <div className={cx(BS.D_FLEX, BS.JC_END, gClasses.MB8, BS.W100)}>
                    <button onClick={onCloseModal}><CloseIconNew /></button>
                    </div>}

                    { isDeleteDataList ? <div className={gClasses.MB10}><DeleteDataListIcon /></div> : <div className={styles.AlertCircle}><AlertCircle /></div> }
                    <Title
                    content={content}
                    alignment={ETitleAlign.middle}
                    headingLevel={ETitleHeadingLevel.h5}
                    size={ETitleSize.xs}
                    className={cx(gClasses.MB16, contentClassName)}
                    />
                    <Text
                    content={firstLine}
                    size={ETextSize.SM}
                    className={(gClasses.MB8, isMfaConfirmationModal && gClasses.ML20, languageStyle)}
                    />
                    <Text
                    content={secondLine}
                    size={ETextSize.SM}
                    className={gClasses.MB8}
                    />
                    {isDeleteFlow && deleteRadioGroupComponent()}
                    <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.MT16, gClasses.MB32, isMfaConfirmationModal && gClasses.ML300, buttonClassName)}>
                    <Button
                        buttonText={cancelButton || APP_LIST_LABEL.DELETE_MODAL_NO_ACTION}
                        onClickHandler={onCloseModal}
                        type={EButtonType.OUTLINE_SECONDARY}
                        className={cx(styles.MdCancelBtn, gClasses.MR16, cancelButtonStyles)}
                    />
                    <Button
                        buttonText={DeleteButton || APP_LIST_LABEL.DELETE_MODAL_YES_ACTION}
                        onClickHandler={onDelete}
                        colorSchema={{ activeColor: UTIL_COLOR.RED_600 }}
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

export default DeleteConfirmModal;
