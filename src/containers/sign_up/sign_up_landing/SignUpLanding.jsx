import React from 'react';
import { connect } from 'react-redux';
import * as ROUTE_CONSTANTS from 'urls/RouteConstants';
import { withRouter } from 'react-router-dom';
import { signUpSetStateAction } from 'redux/actions/SignUp.Action';
import LandingSignUpForm from './sign_up_landing_form/LandingSignUp';
import { SIGN_UP_STEP } from '../SignUp.strings';
import { routeNavigate } from '../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../utils/Constants';

function SignUpLanding(props) {
  const { signUpSetState, history } = props;

  const RedirectToSignup = () => {
    routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNUP_CREATE_EMAIL, null, null, true);
    signUpSetState({
      active_step: SIGN_UP_STEP.BASIC,
    });
  };

  return (
    <LandingSignUpForm RedirectToSignup={RedirectToSignup} />
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUpSetState: (value) => {
      dispatch(signUpSetStateAction(value));
    },
  };
};

export default withRouter(connect(null, mapDispatchToProps)(SignUpLanding));
