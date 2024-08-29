import React from 'react';
import { Modal, DialogSize, ModalStyleType, Title, Text, ETitleAlign, ETextSize, ETitleSize, ETitleHeadingLevel, Button, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../scss/Typography.module.scss';
import { BS } from '../../../../utils/UIConstants';

import AlertCircle from '../../../../assets/icons/application/AlertCircle';
import CloseIconNew from '../../../../assets/icons/CloseIconNew';
import { GET_APP_LIST_LABEL } from '../../../application/app_listing/AppList.constants';
import { UTIL_COLOR } from '../../../../utils/Constants';
import styles from './ConfirmModal.module.scss';

function ConfirmModal(props) {
    const { id, onCloseModal, content, firstLine, secondLine, onDelete, isModalOpen, okButtonName, cancelButtonName } = props;
    const { t } = useTranslation();
    const APP_LIST_LABEL = GET_APP_LIST_LABEL(t);
    return (
        <Modal
            id={id}
            modalStyle={ModalStyleType.dialog}
            dialogSize={DialogSize.md}
            mainContentClassName={cx(gClasses.CursorAuto, styles.HideVerticalScroll)}
            mainContent={
            (
                <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.ALIGN_ITEM_CENTER, gClasses.P16)}>
                    <div className={cx(BS.D_FLEX, BS.JC_END, gClasses.MB8, BS.W100)}>
                    <button onClick={onCloseModal}><CloseIconNew /></button>
                    </div>

                    <div className={styles.AlertCircle}><AlertCircle /></div>
                    <Title
                    content={content}
                    alignment={ETitleAlign.middle}
                    headingLevel={ETitleHeadingLevel.h5}
                    size={ETitleSize.xs}
                    className={gClasses.MB16}
                    />
                    <Text
                    content={firstLine}
                    size={ETextSize.SM}
                    className={gClasses.MB8}
                    />
                    <Text
                    content={secondLine}
                    size={ETextSize.SM}
                    className={gClasses.MB8}
                    />
                    <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.MT16, gClasses.MB32)}>
                    <Button
                        buttonText={cancelButtonName || APP_LIST_LABEL.DELETE_MODAL_NO_ACTION}
                        onClickHandler={onCloseModal}
                        type={EButtonType.OUTLINE_SECONDARY}
                        className={cx(styles.MdCancelBtn, gClasses.MR16)}
                    />
                    <Button
                        buttonText={okButtonName || APP_LIST_LABEL.DELETE_MODAL_YES_ACTION}
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

export default ConfirmModal;
