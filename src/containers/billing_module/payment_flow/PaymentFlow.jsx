import React, { useEffect } from 'react';
import Modal from 'components/form_components/modal/Modal';
import { connect } from 'react-redux';
import { ChangePayScreen, clearPayProfileData } from 'redux/reducer/BillingModuleReducer';
import { getAllSubscriptionListThunk } from 'redux/actions/BillingModule.Action';
import styles from './PaymentFlow.module.scss';
import { CURRENT_PAY_SCREEN } from '../BillingModule.string';
import BillingPlans from './billing_plans/BillingPlans';
import SetPaymentProfile from './setting_payment_profile/SetPaymentProfile';
import SetPaymentMethod from './set_payment_method/SetPaymentMethod';
import { getUserProfileData } from '../../../utils/UtilityFunctions';

function PaymentFlowLayout(props) {
    const { isModalOpen, currentPayScreen, changeExistingPayScreen, onCloseClick, expiry_day_remaining, is_account_expired, signOut, getAllSubscriptionDetails, clearStatePayProfile } = props;
    const userProfileData = getUserProfileData();

    useEffect(() => {
        getAllSubscriptionDetails();
        return () => {
            clearStatePayProfile();
        };
    }, []);

    const getCurrentPaymentScreen = () => {
        let currentScreen;
        switch (currentPayScreen) {
            case CURRENT_PAY_SCREEN.PLANS_SELECT_SCREEN:
                currentScreen = <BillingPlans onCloseClick={onCloseClick} changeExistingPayScreen={changeExistingPayScreen} expiry_day_remaining={expiry_day_remaining} is_account_expired={is_account_expired} signOut={signOut} />;
                break;
            case CURRENT_PAY_SCREEN.PAY_PROFILE_SCREEN:
                currentScreen = <SetPaymentProfile changeExistingPayScreen={changeExistingPayScreen} userProfileData={userProfileData} />;
                break;
            case CURRENT_PAY_SCREEN.PAY_METHODs_SCREEN:
                currentScreen = <SetPaymentMethod changeExistingPayScreen={changeExistingPayScreen} onCloseClick={onCloseClick} userProfileData={userProfileData} />;
                break;
            default:
                break;
        }
        return currentScreen;
    };

    return (
        isModalOpen &&
        <Modal
            id="billing_pay_flow"
            contentClass={styles.ContainerClass}
            containerClass={styles.ContentClass}
            isModalOpen={isModalOpen}
            centerVH
            escCloseDisabled
        >
                {getCurrentPaymentScreen()}
        </Modal>
    );
}

const mapStateToProps = (state) => {
    return {
        currentPayScreen: state.BillingModuleReducer.currentPayScreen,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeExistingPayScreen: (param) => dispatch(ChangePayScreen(param)),
        getAllSubscriptionDetails: () => dispatch(getAllSubscriptionListThunk()),
        clearStatePayProfile: () => dispatch(clearPayProfileData()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(PaymentFlowLayout);
