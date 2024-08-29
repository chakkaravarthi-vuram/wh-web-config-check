import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import Modal from 'components/form_components/modal/Modal';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { MoonLoader } from 'react-spinners';
import PaymentFailureIcon from 'assets/icons/PayFailure';
import { setPaymentRedirectShow } from 'redux/reducer/BillingModuleReducer';
import { useTranslation } from 'react-i18next';
import { BUTTON_TYPE, ROUTE_METHOD } from '../../../utils/Constants';
import styles from './PaymentSuccess.module.scss';
import { BS } from '../../../utils/UIConstants';
import PaySuccessIcon from '../../../assets/icons/PaySuccessIcon';
import Button from '../../../components/form_components/button/Button';
import { getAllSearchParams } from '../../../utils/taskContentUtils';
import { getPaymentStatusThunk, tryAgainBillingPayment } from '../../../redux/actions/BillingModule.Action';
import { BILLING, HOME } from '../../../urls/RouteConstants';
import { BILLING_CONSTANTS_VALUES } from '../BillingModule.string';
import { routeNavigate } from '../../../utils/UtilityFunctions';

function PaymentSuccess(props) {
    const { history, getPaymentStatus, payment_status, status_loading, setPaymentRedirectShow } = props;
    const { t } = useTranslation();
    const redirectToHome = () => {
        routeNavigate(history, ROUTE_METHOD.PUSH, HOME, null, null);
    };

    useEffect(() => {
        const query = getAllSearchParams(new URLSearchParams(get(history, ['location', 'search'])));
        if (query && query.session_id) {
            getPaymentStatus({ session_id: query.session_id }, redirectToHome);
        }
    }, []);

    const exitPage = () => {
        routeNavigate(history, ROUTE_METHOD.PUSH, BILLING, null, null);
    };

    const onChangeCardDetails = () => {
        routeNavigate(history, ROUTE_METHOD.PUSH, HOME, null, null);
        setPaymentRedirectShow(true);
    };

    const PaymentSuccessPage = () => {
        let pay_page = null;
        if (!status_loading) {
            payment_status ? pay_page = (
                <div className={cx(gClasses.CenterVH, BS.TEXT_CENTER, BS.FLEX_COLUMN, styles.Container)}>
                    <div className={cx(gClasses.CenterV, BS.FLEX_COLUMN)}>
                        <h2 className={cx(gClasses.MT50, gClasses.MB30, gClasses.FTwo30GrayV3, gClasses.FontWeight700)}>{t(BILLING_CONSTANTS_VALUES.TRANSACTION_SUCCESSFUL)}</h2>
                        <PaySuccessIcon />
                        <div className={cx(gClasses.MT30, styles.InfoContainer, gClasses.MB30)}>
                            <h5 className={cx(gClasses.FTwo12GrayV3, gClasses.MB10)}>{t(BILLING_CONSTANTS_VALUES.MORE_PRODUCTIVE)}</h5>
                        </div>
                        <Button className={cx(styles.Button, gClasses.MB40)} buttonType={BUTTON_TYPE.PRIMARY} onClick={() => exitPage()}>{t(BILLING_CONSTANTS_VALUES.CONTINUE)}</Button>
                    </div>
                </div>
            ) : pay_page = (
                <div className={cx(gClasses.CenterVH, BS.TEXT_CENTER, BS.FLEX_COLUMN, styles.Container)}>
                    <div className={cx(gClasses.CenterV, BS.FLEX_COLUMN)}>
                        <h2 className={cx(gClasses.MT50, gClasses.MB30, gClasses.FTwo30GrayV3, gClasses.FontWeight700)}>{t(BILLING_CONSTANTS_VALUES.TRANSACTION_FAILED)}</h2>
                        <PaymentFailureIcon />
                        <div className={cx(gClasses.MT30, styles.InfoContainer, gClasses.MB30)}>
                            <h5 className={cx(gClasses.FTwo18GrayV3, gClasses.MB10, gClasses.FontWeight600)}>{t(BILLING_CONSTANTS_VALUES.FAILURE_REASON)}</h5>
                        </div>
                        <div className={cx(BS.D_FLEX, BS.JC_CENTER, styles.FailButtonContainer, gClasses.MT10)}>
                            <Button buttonType={BUTTON_TYPE.OUTLINE_PRIMARY} className={cx(styles.FailButton, gClasses.MB20)} onClick={() => onChangeCardDetails()}>{t(BILLING_CONSTANTS_VALUES.CHANGE_CARD_DETAILS)}</Button>
                            {/* <Button buttonType={BUTTON_TYPE.AUTH_PRIMARY} className={cx(styles.FailButton, gClasses.MB40)} onClick={() => onTryAgainClick()}>TRY AGAIN!</Button> */}
                        </div>
                    </div>
                </div>
            );
        } else {
            pay_page = (
                <div className={cx(gClasses.CenterVH, BS.TEXT_CENTER, BS.FLEX_COLUMN, styles.Container)}>
                    <MoonLoader size={60} />
                </div>
            );
        }
        return pay_page;
    };

    return (
        <Modal
            id="payment_success"
            contentClass={styles.ContainerClass}
            containerClass={styles.ContentClass}
            isModalOpen
            centerVH
            escCloseDisabled
        >
            {PaymentSuccessPage()}
        </Modal>
    );
}

const mapStateToProps = (state) => {
    return {
        payment_status: state.BillingModuleReducer.setPaymentProfile.payment_status,
        status_loading: state.BillingModuleReducer.setPaymentProfile.payment_status_loading,
        pay_method_id: state.BillingModuleReducer.setPaymentProfile.payment_method_status_id,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getPaymentStatus: (data, func) => dispatch(getPaymentStatusThunk(data, func)),
        tryAgainHandle: (data) => dispatch(tryAgainBillingPayment(data)),
        setPaymentRedirectShow: (value) => dispatch(setPaymentRedirectShow(value)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PaymentSuccess));
