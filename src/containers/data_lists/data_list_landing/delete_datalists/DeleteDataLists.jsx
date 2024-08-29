import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { EToastType, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../DatalistLanding.module.scss';
import DeleteConfirmModal from '../../../application/delete_comfirm_modal/DeleteConfirmModal';
import gClasses from '../../../../scss/Typography.module.scss';
import { DATALISTS_STRINGS } from '../DatalistsLanding.constant';
import { somethingWentWrongErrorToast } from '../../../../utils/UtilityFunctions';
import { deleteDataListApi } from '../../../../axios/apiService/dataList.apiService';

function DeleteDatalist(props) {
    const { onClose, dataListUUID, onDelete } = props;
    const { t } = useTranslation();

    const deleteDataList = () => {
        const params = { data_list_uuid: dataListUUID };
        deleteDataListApi(params).then((res) => {
            if (res) {
                toastPopOver({
                    toastType: EToastType.info,
                    title: t(DATALISTS_STRINGS.DELETE_DATALIST_SUCCESS_TITLE),
                });
                onDelete();
            }
        }).catch((err) => {
            console.log('delete dl err', err);
            somethingWentWrongErrorToast();
        });
    };

    return (
        <DeleteConfirmModal
        isModalOpen
        content={t(DATALISTS_STRINGS.DELETE_DATALIST_HEADER)}
        firstLine={t(DATALISTS_STRINGS.DELETE_DATALIST)}
        cancelButton={t(DATALISTS_STRINGS.CANCEL_BUTTON)}
        DeleteButton={t(DATALISTS_STRINGS.DELETE_BUTTON)}
        isDeleteDataList
        modalContainerClass={gClasses.P32}
        mainContentClassName={styles.ModalClassName}
        contentClassName={cx(gClasses.FontWeightBold, styles.HeadingColor, gClasses.MB8)}
        languageStyle={cx(gClasses.CenterV, gClasses.TextAlignCenter, styles.TextColor)}
        buttonClassName={cx(gClasses.JusEnd, gClasses.W100Important, gClasses.MB0)}
        cancelButtonStyles={styles.CancelButton}
        onCloseModal={onClose}
        onDelete={deleteDataList}
        />
    );
}

export default DeleteDatalist;
