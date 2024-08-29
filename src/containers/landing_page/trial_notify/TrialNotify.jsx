import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import CloseIconNew from 'assets/icons/CloseIconNew';
import WarningTriangleIcon from 'assets/icons/WarningTriangle';
import { BUTTON_TYPE } from 'utils/Constants';
import Button from 'components/form_components/button/Button';
import { useTranslation } from 'react-i18next';
import styles from './TrialNotify.module.scss';
import { LANDING_PAGE_TOPICS } from '../main_header/common_header/CommonHeader.strings';

function TrialNotify(props) {
    const { onUpgradeClick, expiry_day_remaining, trialShowClose, is_billing_card_verified, onChangeCardDetails, acc_subscription_type } = props;
    const { t } = useTranslation();
    return (
        <div className={cx(BS.P_FIXED, gClasses.CenterVH, styles.Container, BS.JC_BETWEEN, gClasses.ZIndex6)}>
            <div className={gClasses.CenterV}>
                <WarningTriangleIcon className={cx(styles.WarningTrailIcon, gClasses.MR10, gClasses.ML20)} />
                {(!is_billing_card_verified && acc_subscription_type === 'subscription') ?
                (
                    <>
                        <div className={cx(gClasses.FTwo12, gClasses.MR20)}>Your card is not verified</div>
                        <Button buttonType={BUTTON_TYPE.AUTH_PRIMARY} className={cx(styles.ButtonContainer)} onClick={() => onChangeCardDetails()}>Verify Now</Button>
                    </>
                ) :
                (
                    <>
                        <div className={cx(gClasses.FTwo12, gClasses.MR20)}>{`${t(LANDING_PAGE_TOPICS.TRAIL_EXPIRES)} ${expiry_day_remaining} ${t(LANDING_PAGE_TOPICS.DAYS)}`}</div>
                        <Button buttonType={BUTTON_TYPE.AUTH_PRIMARY} className={cx(styles.ButtonContainer)} onClick={() => onUpgradeClick()}>
                        {/* Upgrade Now */}
                        {t(LANDING_PAGE_TOPICS.UPGRADE_NOW)}
                        </Button>
                    </>
                )}
            </div>
            <CloseIconNew className={cx(styles.CloseIcon, gClasses.MR20)} onClick={() => trialShowClose()} fillClass="#ff665f" />
        </div>
    );
}
export default TrialNotify;
