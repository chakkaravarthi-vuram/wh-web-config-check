import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import CloseIconV2 from 'assets/icons/CloseIconV2';
import WarningTriangleIcon from 'assets/icons/WarningTriangle';
import { CURRENT_PAY_SCREEN } from 'containers/billing_module/BillingModule.string';
import { clearPayProfileData, setPaymentProfileState } from 'redux/reducer/BillingModuleReducer';
import { getDropdownBillCurrency } from 'containers/billing_module/BillingModule.utils';
import { useTranslation } from 'react-i18next';
import { keydownOrKeypessEnterHandle } from '../../../../utils/UtilityFunctions';
import styles from './BillingPlans.module.scss';
import { BS } from '../../../../utils/UIConstants';
import { BUTTON_TYPE } from '../../../../utils/Constants';
import Button from '../../../../components/form_components/button/Button';
import BILLING_PLANS_STRING, { COST_SALES_CONDITION, FREE_SALES_CONDITION } from './BillingPlans.string';

function BillingPlans(props) {
    const { onCloseClick, changeExistingPayScreen, subscription_list, expiry_day_remaining, is_account_expired, signOut, setPaymentStateChange, clearStatePayProfile } = props;
    const { t } = useTranslation();
    const onClickHandler = (cost_details, sub_id) => {
        setPaymentStateChange({ currency_list: getDropdownBillCurrency(cost_details), current_subscription_number: sub_id });
        changeExistingPayScreen(CURRENT_PAY_SCREEN.PAY_PROFILE_SCREEN);
    };

    const onCloseClickHandler = () => {
        clearStatePayProfile();
        onCloseClick();
    };

    return (
        <div className={cx(styles.PlanContainer, BS.D_FLEX, BS.FLEX_COLUMN)}>
            {!is_account_expired ? (
                <div className={cx(styles.ModalCloseContainer, gClasses.CursorPointer, gClasses.CenterVH)}>
                    <CloseIconV2 className={styles.CloseIcon} onClick={() => onCloseClickHandler()} />
                </div>
                ) :
            <div className={cx(styles.PlanSignOut, gClasses.FontWeight500, gClasses.FTwo13BlueV2, gClasses.CursorPointer)} onClick={() => signOut()} onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && signOut()} role="button" tabIndex={0}>{t(BILLING_PLANS_STRING.SIGN_OUT)}</div> }
            <div className={cx(styles.TitleContainer, gClasses.PT30)}>
                <h2 className={cx(gClasses.FTwo24GrayV3, gClasses.FontWeight600)}>{!is_account_expired ? t(BILLING_PLANS_STRING.UPGRADE_PLAN) : t(BILLING_PLANS_STRING.TRIAL_EXPIRED)}</h2>
                <p className={cx(gClasses.MT10, gClasses.FTwo12GrayV53)}>{t(BILLING_PLANS_STRING.UPGRADE_SUB_HEADING)}</p>
            </div>
            <div className={styles.PlanSubContainer}>
            <div className={cx(gClasses.MT30, styles.PlanCardContainer, gClasses.CenterH, gClasses.MR15, gClasses.ML15)}>
                <div className={cx(styles.PlanCard, BS.FLEX_COLUMN, is_account_expired ? styles.ExpiredBorder : styles.TrialBorder)}>
                    <div className={cx(styles.CurrentPlan, gClasses.FontWeight500, gClasses.FTwo12, gClasses.CenterVH, is_account_expired ? styles.ExpiredColor : styles.TrailRemainButton)}>{t(BILLING_PLANS_STRING.CURRENT_PLAN)}</div>
                    <div className={cx(styles.PlanCardTitleContainer, gClasses.MT50)}>
                        <h5 className={cx(gClasses.FTwo18GrayV3, gClasses.FontWeight700, gClasses.MB0)}>{t(BILLING_PLANS_STRING.FREE_TRIAL)}</h5>
                        <p className={cx(styles.PlanCardTitleInfo, gClasses.FTwo12, gClasses.FontWeight500, gClasses.MB0)}>{t(BILLING_PLANS_STRING.BEST_FOR_PERSONAL)}</p>
                    </div>
                    <div className={cx(styles.PlanPriceContainer, gClasses.CenterH, gClasses.MT15, gClasses.MB15)}>
                        <p className={cx(gClasses.FontWeight500, gClasses.MR4, gClasses.MB0)}>{BILLING_PLANS_STRING.RUPEES}</p>
                        <h2 className={cx(gClasses.FontWeight500, gClasses.MB0)}>{BILLING_PLANS_STRING.ZERO}</h2>
                    </div>
                    <div className={cx(styles.PlanContentContainer, BS.TEXT_CENTER, gClasses.PB20)}>
                        <h4 className={cx(gClasses.FTwo12GrayV3, gClasses.FontWeight600, gClasses.PT10, gClasses.MB10)}>{t(BILLING_PLANS_STRING.PER_MEMBER_7)}</h4>
                        {FREE_SALES_CONDITION(t).map((free_data) => (
                            <p className={cx(gClasses.MB5, gClasses.FontWeight500)} key={free_data}>{free_data}</p>
                        ))}
                    </div>
                    <div className={cx(gClasses.CenterH, gClasses.MT20, gClasses.MB20, styles.ButtonContainer)}>
                        <div className={cx(styles.Button, styles.CustomPlanButton, is_account_expired ? styles.TrailExpiredButton : styles.TrailRemainButton, gClasses.FontWeight500, gClasses.CenterVH)}>
                            <WarningTriangleIcon className={cx(is_account_expired ? styles.WarningExpireIcon : styles.WarningTrailIcon, gClasses.MR10)} />
                                {is_account_expired ? t(BILLING_PLANS_STRING.YOUR_TRIAL_EXPIRED) : `${expiry_day_remaining} ${t(BILLING_PLANS_STRING.REMAINING_DAYS)}`}
                        </div>
                    </div>
                    <div className={cx(styles.gradientBorder, is_account_expired ? styles.gradietTialExpired : styles.gradientTrialRemaining)} />
                </div>
                {subscription_list?.map((list) => (
                    <div className={cx(styles.PlanCard, BS.FLEX_COLUMN)} key={list._id}>
                        <div className={cx(styles.PlanCardTitleContainer, gClasses.MT50)}>
                            <h5 className={cx(gClasses.FTwo18GrayV3, gClasses.FontWeight700, gClasses.MB0)}>{t(BILLING_PLANS_STRING.STANDARD_PLAN)}</h5>
                            <p className={cx(styles.PlanCardTitleInfo, gClasses.FTwo12, gClasses.FontWeight500, gClasses.MB0)}>{t(BILLING_PLANS_STRING.DESCRIPTION)}</p>
                        </div>
                        <div className={cx(styles.PlanPriceContainer, gClasses.MT15, gClasses.MB15)}>
                            <h3 className={cx(gClasses.MB8, gClasses.FTwo18)}>{t(BILLING_PLANS_STRING.CONTACT_SALES)}</h3>
                            <div className={cx(gClasses.FTwo12, gClasses.FontWeight500)}>{BILLING_PLANS_STRING.SALE_MAIL_ID}</div>
                            {/* <p className={cx(gClasses.FontWeight500, gClasses.MR4, gClasses.MB0)}>{BILLING_PLANS_STRING.RUPEES}</p>
                            <h2 className={cx(gClasses.FontWeight500, gClasses.MB0)}>{list.cost_details[0].value}</h2>
                            <h3 className={cx(gClasses.FontWeight500, gClasses.MB0)}>{BILLING_PLANS_STRING.OR}</h3>
                            <p className={cx(gClasses.FontWeight500, gClasses.MR4, gClasses.MB0)}>{` ${BILLING_PLANS_STRING.DOLLAR}`}</p>
                            <h2 className={cx(gClasses.FontWeight500, gClasses.MB0)}>{list.cost_details[1].value}</h2> */}
                        </div>
                        <div className={cx(styles.PlanContentContainer, BS.TEXT_CENTER, gClasses.PB20)}>
                            <h4 className={cx(gClasses.FTwo12GrayV3, gClasses.FontWeight600, gClasses.PT10, gClasses.MB10)}>{t(BILLING_PLANS_STRING.PER_MEMBER_PER_MONTH)}</h4>
                            {COST_SALES_CONDITION(t).map((sale_points) => (
                                <p className={cx(gClasses.MB5, gClasses.FontWeight500)} key={sale_points}>{sale_points}</p>
                            ))}
                        </div>
                        <div className={cx(gClasses.CenterH, gClasses.MT20, gClasses.MB20, styles.ButtonContainer)}>
                            <Button buttonType={BUTTON_TYPE.AUTH_PRIMARY} className={cx(styles.Button)} onClick={() => onClickHandler(list.cost_details, list._id)}>
                                {t(BILLING_PLANS_STRING.UPGRADE_NOW)}
                            </Button>
                        </div>
                        <div className={cx(styles.gradientBorder, styles.gradientCol)} />
                    </div>
                ))}
            </div>
            {!is_account_expired && <div className={cx(gClasses.MT30, styles.WillLater, gClasses.FontWeight500, gClasses.MB10, gClasses.CursorPointer)} onClick={() => onCloseClickHandler()} onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseClickHandler()} role="button" tabIndex={0}>{t(BILLING_PLANS_STRING.WILL_UPGRADE)}</div>}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        subscription_list: state.BillingModuleReducer.subscription_list,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPaymentStateChange: (data) => dispatch(setPaymentProfileState(data)),
        clearStatePayProfile: () => dispatch(clearPayProfileData()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(BillingPlans);
