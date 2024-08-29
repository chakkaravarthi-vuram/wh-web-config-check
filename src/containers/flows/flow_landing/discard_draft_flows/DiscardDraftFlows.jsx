import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { EToastType, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import DeleteConfirmModal from '../../../application/delete_comfirm_modal/DeleteConfirmModal';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from '../FlowLanding.module.scss';
import { DELETE_DISCARD_FLOW_STRINGS } from '../FlowLanding.constant';
import { discardFlow } from '../../../../axios/apiService/flow.apiService';
import { somethingWentWrongErrorToast } from '../../../../utils/UtilityFunctions';

function DiscardDraftFlow(props) {
    const { metaData, onClose, onDiscard } = props;
    const { t } = useTranslation();
    const { DISCARD_DRAFT } = DELETE_DISCARD_FLOW_STRINGS(t);

    const discardFlowFunction = () => {
        const data = { flow_id: metaData.flowId };
        discardFlow(data)
          .then(() => {
            toastPopOver({
              toastType: EToastType.success,
              title: DISCARD_DRAFT.SUCCESS_TITLE,
            });
            onDiscard(false);
            onClose();
           })
          .catch((err) => {
            console.log('xyz discard err', err);
            somethingWentWrongErrorToast();
          });
    };

    return (
        <DeleteConfirmModal
        isModalOpen
        content={DISCARD_DRAFT.TITLE}
        firstLine={DISCARD_DRAFT.SUBTITLE}
        cancelButton={DISCARD_DRAFT.CANCEL_BUTTON}
        DeleteButton={DISCARD_DRAFT.DELETE_BUTTON}
        isDeleteDataList
        modalContainerClass={gClasses.P32}
        mainContentClassName={styles.ModalClassName}
        contentClassName={cx(gClasses.FontWeightBold, styles.HeadingColor, gClasses.MB8)}
        languageStyle={cx(gClasses.CenterV, gClasses.TextAlignCenter, styles.TextColor)}
        buttonClassName={cx(gClasses.JusEnd, gClasses.W100Important, gClasses.MB0)}
        cancelButtonStyles={styles.CancelButton}
        onCloseModal={onClose}
        onDelete={discardFlowFunction}
        />
    );
}

export default DiscardDraftFlow;
