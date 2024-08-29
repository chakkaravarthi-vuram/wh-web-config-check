import React from 'react';
import cx from 'classnames/bind';
import Modal from 'components/form_components/modal/Modal';
import gClasses from 'scss/Typography.module.scss';
import { ACCOUNT_INFO_STRINGS } from 'containers/landing_page/account_info/AccountInfoModal.string';
import CloseIconV2 from 'assets/icons/CloseIconV2';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import styles from './AccountStatus.module.scss';
import { BS } from '../../../../utils/UIConstants';

function AccountStatusModal(props) {
  const {
    signOut,
    planShow,
    onAccountClose,
    expiry_day_remaining,
    is_account_expired,
  } = props;
  const { t } = useTranslation();
  const signOutInitiate = () => {
    signOut();
  };

  return (
    planShow &&
    <Modal
      id="account_status_flow"
      contentClass={styles.ContainerClass}
      containerClass={styles.ContentClass}
      isModalOpen={planShow}
      centerVH
      onCloseClick={() => onAccountClose()}
      escCloseDisabled
    >
      <div
        className={cx(gClasses.CenterVH, BS.FLEX_COLUMN, styles.MainContainer)}
      >
        {!is_account_expired && (
          <div
            className={cx(
              styles.ModalCloseContainer,
              gClasses.CursorPointer,
              gClasses.CenterVH,
            )}
          >
            <CloseIconV2
              className={styles.CloseIcon}
              onClick={() => onAccountClose()}
            />
          </div>
        )}
        <div className={cx(BS.TEXT_CENTER, gClasses.MB30)}>
          {is_account_expired ? (
            <div
              className={cx(
                gClasses.FTwo24GrayV3,
                gClasses.FontWeight600,
                gClasses.MT50,
                gClasses.MB10,
                BS.TEXT_CENTER,
              )}
            >
              Account Expired
            </div>
          ) : (
            <div
              className={cx(
                gClasses.FTwo24GrayV3,
                gClasses.FontWeight600,
                gClasses.MT50,
                gClasses.MB10,
                BS.TEXT_CENTER,
              )}
            >
              {`Account Expires in ${expiry_day_remaining} days`}
            </div>
          )}
          <div
            className={cx(
              gClasses.FTwo13GrayV53,
              gClasses.FontWeight500,
              BS.TEXT_CENTER,
            )}
          >
            {' '}
            Please contact
            <span className={styles.Email}>ask@workhall.com</span>
            {' '}
          </div>
        </div>
        <div className={cx(BS.TEXT_CENTER, gClasses.MT30)}>
          <div
            className={cx(
              gClasses.FTwo14BlueV2,
              gClasses.FontWeight600,
              gClasses.MT20,
              gClasses.CursorPointer,
            )}
            role="button"
            tabIndex={0}
            onClick={() => signOutInitiate()}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) &&
              signOutInitiate()}
          >
            {t(ACCOUNT_INFO_STRINGS.SIGN_OUT)}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AccountStatusModal;
