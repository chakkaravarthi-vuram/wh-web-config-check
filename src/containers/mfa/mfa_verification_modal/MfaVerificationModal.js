import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { Modal, ModalSize, ModalStyleType } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './MfaVerificationModal.module.scss';
import MFASetup from '../../user_settings/mfa_settings/MFASetup';
import { BS } from '../../../utils/UIConstants';
import gClasses from '../../../scss/Typography.module.scss';
import { keydownOrKeypessEnterHandle } from '../../../utils/UtilityFunctions';
import { MFA_VERIFICATION_STRINGS } from './MfaVerificationModal.strings';

function MfaVerificationModal(props) {
    const { t } = useTranslation();
    const { isModalOpen, signOut, getAuthorizationDetailsApi, isDisableSignout = false } = props;

    return (
        isModalOpen &&
        <div className={cx(styles.PlanContainer, BS.D_FLEX, BS.FLEX_COLUMN)}>
          <Modal
            id="verification_modal"
            modalSize={ModalSize.md}
            isModalOpen={isModalOpen}
            headerContent={(
              <div>
              {!isDisableSignout && (
                 <div className={cx(gClasses.FontWeight500, gClasses.FloatR, gClasses.PT20, gClasses.PR20, gClasses.FTwo13BlueV2, gClasses.CursorPointer)} onClick={() => signOut()} onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && signOut()} role="button" tabIndex={0}>
                 {t(MFA_VERIFICATION_STRINGS.SIGN_OUT)}
                 </div>
              )}
              </div>

            )}
            mainContent={<MFASetup isVerificationModal isMFAEnforcedValidation getAuthorizationDetailsApi={getAuthorizationDetailsApi} />}
            modalStyle={ModalStyleType.dialog}
            mainContentClassName={styles.MfaMainContent}
          />
        </div>
    );
}

export default MfaVerificationModal;
