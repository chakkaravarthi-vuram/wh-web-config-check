import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { EToastType, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import DeleteConfirmModal from '../../../application/delete_comfirm_modal/DeleteConfirmModal';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from '../DatalistLanding.module.scss';
import { DATALISTS_STRINGS } from '../DatalistsLanding.constant';
import { discardDataListApi } from '../../../../axios/apiService/dataList.apiService';
import { somethingWentWrongErrorToast } from '../../../../utils/UtilityFunctions';

function DiscardDraftDataLists(props) {
    const { onClose, dataListID, onDiscard } = props;
    const { t } = useTranslation();

    const discardDataList = () => {
        const params = { data_list_id: dataListID };
        discardDataListApi(params).then((res) => {
            if (res) {
                toastPopOver({
                    toastType: EToastType.success,
                    title: t(DATALISTS_STRINGS.DISCARD_DRAFT_DATALISTS.DISCARD_DATALIST_SUCCESS_TITLE),
                });
                onDiscard(false);
                onClose();
            }
        }).catch((err) => {
            console.log('discard dl err', err);
            somethingWentWrongErrorToast();
        });
    };

    return (
        <DeleteConfirmModal
            isModalOpen
            content={t(DATALISTS_STRINGS.DISCARD_DRAFT_DATALISTS.DISCARD_DRAFT_DATALISTS_HEADER)}
            firstLine={t(DATALISTS_STRINGS.DISCARD_DRAFT_DATALISTS.DISCARD_DRAFT_DATALISTS)}
            cancelButton={t(DATALISTS_STRINGS.DISCARD_DRAFT_DATALISTS.CANCEL_BUTTON)}
            DeleteButton={t(DATALISTS_STRINGS.DISCARD_DRAFT_DATALISTS.DELETE_BUTTON)}
            isDeleteDataList
            modalContainerClass={gClasses.P32}
            mainContentClassName={styles.ModalClassName}
            contentClassName={cx(gClasses.FontWeightBold, styles.HeadingColor, gClasses.MB8)}
            languageStyle={cx(gClasses.CenterV, gClasses.TextAlignCenter, styles.TextColor)}
            buttonClassName={cx(gClasses.JusEnd, gClasses.W100Important, gClasses.MB0)}
            cancelButtonStyles={styles.CancelButton}
            onCloseModal={onClose}
            onDelete={discardDataList}
        />
    );
}

export default DiscardDraftDataLists;
