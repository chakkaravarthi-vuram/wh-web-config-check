import React, { useEffect } from 'react';
import Modal from 'components/form_components/modal/Modal';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import PaymentLoadingIcon from 'assets/icons/PaymentLoaderIcon';
import { getPaymentUrlThunk } from 'redux/actions/BillingModule.Action';
import { useTranslation } from 'react-i18next';
import styles from './PaymentRedirect.module.scss';
import { BS } from '../../../utils/UIConstants';
import { BILLING_CONSTANTS_VALUES } from '../BillingModule.string';

function PaymentRedirectScreen(props) {
    const { getPayUrlDetails } = props;
    const { acc_locale } = useSelector((state) => state.RoleReducer);
    const { t } = useTranslation();
    useEffect(() => {
        getPayUrlDetails({ locale: acc_locale });
    }, []);

    return (
        <Modal
            id="payment_success"
            contentClass={styles.ContainerClass}
            containerClass={styles.ContentClass}
            isModalOpen
            centerVH
            escCloseDisabled
        >
            <div className={cx(gClasses.CenterVH, BS.FLEX_COLUMN, BS.JC_CENTER, styles.Container)}>
                <div className={cx(gClasses.FTwoBlueV5, gClasses.MT30)}>{t(BILLING_CONSTANTS_VALUES.REDIRECT)}</div>
                <PaymentLoadingIcon />
            </div>
        </Modal>
      );
}

const mapDispatchToProps = (dispatch) => {
    return {
        getPayUrlDetails: (params) => dispatch(getPaymentUrlThunk(params)),
    };
};

export default withRouter(connect(null, mapDispatchToProps)(PaymentRedirectScreen));
