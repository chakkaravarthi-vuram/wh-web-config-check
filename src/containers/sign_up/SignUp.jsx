import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from 'components/auth_layout/AuthLayout.module.scss';
import { useTranslation } from 'react-i18next';
import BasicDetails from './basic_details/BasicDetails';
import OtpVerification from './otp_verification/OtpVerification';
import AdditionalDetails from './additional_details/AdditionalDetails';
import CustomLink from '../../components/form_components/link/Link';
import { signUpSetStateAction, signUpClearStateAction } from '../../redux/actions/SignUp.Action';
import {
  SIGN_UP_STEP,
  BLOCK_GENERATE_OTP,
  VERIFY_BLOCK_OTP,
  IP_BLOCK,
  SIGN_UP_ERRORS,
} from './SignUp.strings';
import { AUTH_PAGE_TYPES, ROUTE_METHOD } from '../../utils/Constants';
import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import { openInNewTab, routeNavigate } from '../../utils/UtilityFunctions';
import gClasses from '../../scss/Typography.module.scss';
import { ADDITIONAL_DETAILS_STRINGS } from './additional_details/AdditionalDetails.strings';
import AuthLayout from '../../components/auth_layout/AuthLayout';
import SignUpLanding from './sign_up_landing/SignUpLanding';

function SignUp(props) {
  const { role, history, signUpClearState, signUpSetState, popOverStatus } = props;
  if (role) routeNavigate(history, ROUTE_METHOD.REPLACE, ROUTE_CONSTANTS.ADMIN_HOME);

  const getRouteMatchConst = () => {
    switch (history.location.pathname) {
      case ROUTE_CONSTANTS.SIGNUP_CREATE:
        return SIGN_UP_STEP.LANDING;
      case ROUTE_CONSTANTS.SIGNUP_CREATE_EMAIL:
        return SIGN_UP_STEP.BASIC;
      case ROUTE_CONSTANTS.SIGNUP_CREATE_OTP:
        return SIGN_UP_STEP.OTP_VERIFICATION;
      case ROUTE_CONSTANTS.SIGNUP_CREATE_ACCOUNT_DETAILS:
        return SIGN_UP_STEP.ADDITIONAL;
      default:
        break;
    }
    return null;
  };

  const { t } = useTranslation();

  useEffect(() => () => {
    signUpClearState();
  }, []);

  useEffect(() => {
    const { state } = props;
    if (state.active_step !== getRouteMatchConst() && history.location.pathname !== ROUTE_CONSTANTS.SIGNUP_CREATE_EMAIL) {
      routeNavigate(history, ROUTE_METHOD.REPLACE, ROUTE_CONSTANTS.SIGNUP_CREATE, null, null, true);
      signUpSetState({
        active_step: SIGN_UP_STEP.LANDING,
      });
    } else {
      if (history.location.pathname === ROUTE_CONSTANTS.SIGNUP_CREATE_EMAIL) {
        routeNavigate(history, ROUTE_METHOD.REPLACE, ROUTE_CONSTANTS.SIGNUP_CREATE_EMAIL, null, null, true);
        signUpSetState({
          active_step: SIGN_UP_STEP.BASIC,
        });
      }
    }
  }, [history.location.pathname]);

  const onChangeEmailButtonClicked = () => {
    routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNUP_CREATE_EMAIL, null, null, true);
    signUpSetState({
      active_step: SIGN_UP_STEP.BASIC,
    });
  };

  const setOtpExpired = (isOtpExpired) => {
    if (isOtpExpired) {
      routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNUP_CREATE_EMAIL, null, null, true);
      signUpSetState({
        active_step: SIGN_UP_STEP.BASIC,
        error_for_otp: t(SIGN_UP_ERRORS.OTP_TIMEOUT),
      });
    }
  };

  const navigateToOtp = (email, uuid, expiry_time) => {
    routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNUP_CREATE_OTP, null, null, true);
    signUpSetState({
      active_step: SIGN_UP_STEP.OTP_VERIFICATION,
      email,
      uuid,
      otp_expiration_time: expiry_time,
    });
  };

  const updateUuid = (uuid) => {
    signUpSetState({
      uuid,
    });
  };

  const navigateToAccountInfo = () => {
    routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNUP_CREATE_ACCOUNT_DETAILS, null, null, true);
    signUpSetState({
      active_step: SIGN_UP_STEP.ADDITIONAL,
    });
  };

  const updateError = (data) => {
    switch (data.type) {
      case BLOCK_GENERATE_OTP:
        routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNUP_CREATE_EMAIL, null, null, true);
        signUpSetState({
          active_step: SIGN_UP_STEP.BASIC,
          error_for_otp: t(SIGN_UP_ERRORS.BLOCK_GENERATE_OTP_ERROR),
        });
        break;
      case VERIFY_BLOCK_OTP:
        routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNUP_CREATE_EMAIL, null, null, true);
        signUpSetState({
          active_step: SIGN_UP_STEP.BASIC,
          error_for_otp: (
            <>
              {t(SIGN_UP_ERRORS.VERIFY_BLOCK_OTP_ERROR_TITLE)}
              <br />
              {t(SIGN_UP_ERRORS.VERIFY_BLOCK_OTP_ERROR_DESC)}
            </>
          ),
        });
        break;
      case IP_BLOCK:
        routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNUP_CREATE_EMAIL, null, null, true);
        signUpSetState({
          active_step: SIGN_UP_STEP.BASIC,
          error_for_otp: t(SIGN_UP_ERRORS.IP_BLOCK_ERROR),
        });
        break;
      default:
        break;
    }
  };

  const getSignUpActiveScreenComponent = (state) => {
    const { currentSignupPage } = props;
    switch (currentSignupPage) {
      // for next release
      case SIGN_UP_STEP.LANDING:
        return (
          <SignUpLanding />
        );
      case SIGN_UP_STEP.BASIC:
        return (
          <BasicDetails
            navigateToOtp={navigateToOtp}
            error_for_otp={state.error_for_otp}
            email={state.email}
          />
        );
      case SIGN_UP_STEP.OTP_VERIFICATION: {
        return (
          <OtpVerification
            uuid={state.uuid}
            navigateToAccountInfo={navigateToAccountInfo}
            updateUuid={updateUuid}
            email={state.email}
            updateError={updateError}
            otp_expiration_time={state.otp_expiration_time}
            setOtpExpired={setOtpExpired}
            onChangeEmailButtonClicked={onChangeEmailButtonClicked}
          />
        );
      }
      case SIGN_UP_STEP.ADDITIONAL:
        return <AdditionalDetails uuid={state.uuid} email={state.email} activeStep={state.active_step} signUpSetState={signUpSetState} />;
      default:
        return null;
    }
  };

  const { state } = props;
  let additionalDetailsClass = null;
  let bottomText = null;
  let alignmentClasses = null;
  let patchMargin = null;
  if (state.active_step === SIGN_UP_STEP.ADDITIONAL) {
    additionalDetailsClass = styles.AdditionalDetails;
    bottomText = (
      <div className={cx(gClasses.MT30, gClasses.FTwo12, gClasses.PB30)}>
        <span className={gClasses.White}>
          {ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.TERMS_AND_CONDITION.TEXT}
        </span>
        {/* commenting this as we do not have any terms of service page for now */}
        {/* <CustomLink
          className={gClasses.BlueV2}
          id={
            ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.TERMS_AND_CONDITION.LINK1_ID
          }
        >
          {ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.TERMS_AND_CONDITION.LINK_1}
        </CustomLink>
        <span className={gClasses.White}>
          {
            ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.TERMS_AND_CONDITION
              .CONJUNCTION
          }
        </span> */}
        <CustomLink
          className={gClasses.BlueV2}
          id={
            ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.TERMS_AND_CONDITION.LINK2_ID
          }
          onClick={() => openInNewTab(ROUTE_CONSTANTS.PRIVACY_POLICY)}
        >
          {ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.TERMS_AND_CONDITION.LINK_2}
        </CustomLink>
      </div>
    );
    alignmentClasses = gClasses.CenterV;
    patchMargin = gClasses.MT30;
  } else if (state.active_step === SIGN_UP_STEP.LANDING) {
    additionalDetailsClass = styles.LandingContainer;
  } else {
    alignmentClasses = gClasses.CenterVH;
    patchMargin = gClasses.MT15;
  }
  const signUpActivePage = getSignUpActiveScreenComponent(state);
  return (
    <AuthLayout
      navBarType={AUTH_PAGE_TYPES.SIGN_UP}
      innerContainer={signUpActivePage}
      bottomText={bottomText}
      innerContainerClasses={cx(patchMargin, additionalDetailsClass)}
      alignmentClasses={alignmentClasses}
      status={popOverStatus}
    />
  );
  // }
}

const mapStateToProps = (state) => {
  return {
    role: state.RoleReducer.role,
    state: state.SignUpReducer,
    popOverStatus: state.FormStatusPopoverReducer.formStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signUpSetState: (value) => {
      dispatch(signUpSetStateAction(value));
    },
    signUpClearState: (value) => {
      dispatch(signUpClearStateAction(value));
    },
  };
};
SignUp.defaultProps = {
  role: null,
};
SignUp.propTypes = {
  history: PropTypes.objectOf().isRequired,
  role: PropTypes.number,
  state: PropTypes.objectOf().isRequired,
  signUpSetState: PropTypes.func.isRequired,
  signUpClearState: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));
