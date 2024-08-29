import React from 'react';
import { Modal, DialogSize, ModalStyleType, Title, ETitleAlign, ETitleSize, ETitleHeadingLevel, Button, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import AlertCircle from '../../../assets/icons/application/AlertCircle';
import { GET_APP_LIST_LABEL } from '../app_listing/AppList.constants';
import { UTIL_COLOR } from '../../../utils/Constants';
import styles from './DeleteConfirmModalAnyway.module.scss';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { APP_DELETE_ANYWAY } from '../application.strings';

function DeleteConfirmModalAnyway(props) {
    const { id, onCloseModal, content, onDelete, deletePopperData } = props;
    const { full_name, isCurrentUserDelete, currentUserMessage } = deletePopperData;
    const { t } = useTranslation();
    const APP_LIST_LABEL = GET_APP_LIST_LABEL(t);
    return (
        <Modal
            id={id}
            modalStyle={ModalStyleType.dialog}
            dialogSize={DialogSize.sm}
            className={gClasses.CursorAuto}
            mainContent={
            (
                <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.ALIGN_ITEM_CENTER, gClasses.P16)}>
                    <div className={cx(styles.AlertCircle, gClasses.MT30)}><AlertCircle /></div>
                    <Title
                    content={content || GET_APP_LIST_LABEL(t).DELETE_MODAL_TITLE}
                    alignment={ETitleAlign.middle}
                    headingLevel={ETitleHeadingLevel.h5}
                    size={ETitleSize.xs}
                    className={gClasses.MB16}
                    />
                    <div className={cx(gClasses.CenterVH, gClasses.MB8, styles.UserNameErrorContainer)}>
                        <p className={cx(gClasses.FTwo13)}>
                            {isCurrentUserDelete ? currentUserMessage :
                            <>
                                {t(APP_DELETE_ANYWAY.CURRENTLY)}
                                {' '}
                                <span>{full_name}</span>
                                {' '}
                                {t(APP_DELETE_ANYWAY.IS_EDITING)}
                            </>}
                        </p>
                    </div>
                    <p className={cx(gClasses.FTwo13, styles.DeleteQuestion)}>
                        {t(APP_DELETE_ANYWAY.ARE_YOU_SURE)}
                    </p>
                    <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.MT16, gClasses.MB32)}>
                    <Button
                        buttonText={APP_LIST_LABEL.DELETE_MODAL_NO_ACTION}
                        onClickHandler={onCloseModal}
                        type={EMPTY_STRING}
                        className={cx(styles.MdCancelBtn, gClasses.MR16)}
                    />
                    <Button
                        buttonText={t(APP_DELETE_ANYWAY.YES_DELETE)}
                        onClickHandler={() => onDelete({ delete_anyway: true })}
                        colorSchema={{ activeColor: UTIL_COLOR.RED_600 }}
                        className={styles.MdDeleteBtn}
                        type={EButtonType.PRIMARY}
                    />
                    </div>
                </div>)
            }
            isModalOpen
        />
    );
}

export default DeleteConfirmModalAnyway;
