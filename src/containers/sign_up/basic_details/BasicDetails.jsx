import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import BasicDetailsForm from './basic_details_form/BasicDetailsForm';
// import FullPageLoader from '../../../assets/icons/FullPageLoader';

import { KEY_CODES } from '../../../utils/Constants';
import { BASIC_DETAIL_STRINGS, EMAIL_CHECK_UNIQUE_CONSTRAIN } from './BasicDetails.strings';
import { mergeObjects, validate, setPointerEvent } from '../../../utils/UtilityFunctions';
import { basicDetailsValidationSchema } from './BasicDetails.validation.schema';

import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import {
  cancelTokenForGenerateOtpAndClearState,
  cancelTokenForValidateEmailAndClearState,
} from '../../../axios/apiService/signUp.apiService';
import {
  signUpBasicDetailsSetState,
  signUpBasicDetailsClearState,
  generateOtpApiAction,
  validateEmailApiAction,
  validateEmailAndDomainApiAction,
} from '../../../redux/actions/SignUp.Action';
import jsUtils, { isNull } from '../../../utils/jsUtility';

class BasicDetails extends Component {
  componentWillUnmount() {
    const { clearState, dispatch } = this.props;
    dispatch(cancelTokenForGenerateOtpAndClearState());
    dispatch(cancelTokenForValidateEmailAndClearState());
    clearState();
  }

  render() {
    const { state, error_for_otp } = this.props;
    // const { is_data_loading } =state
    const { error_list, server_error } = state;
    const errors = mergeObjects(error_list, server_error);
    return (
      <>
        {/* <FullPageLoader
          isDataLoading={is_data_loading}
          testId={BASIC_DETAIL_STRINGS.FULL_PAGE_LOADER}
        /> */}
        <BasicDetailsForm
          testId={BASIC_DETAIL_STRINGS.BASIC_DETAILS_FORM}
          errors={errors}
          formDetails={state}
          onChange={this.onChangeHandler}
          onBlur={this.onBlurHandler}
          onKeyPress={this.onEnterPressed}
          onContinueClick={this.checkEmailAndGenerateOtp}
          error_for_otp={error_for_otp}
        />
      </>
    );
  }

  onChangeHandler = (id) => async (event) => {
    const { setState, t } = this.props;
    await setState({
      [id]: event.target.value,
      server_error: [],
      common_server_error: EMPTY_STRING,
    });
    const { state } = this.props;
    const { error_list } = state;
    if (!jsUtils.isEmpty(error_list)) {
      setState({
        error_list: validate(this.getBasicDetailsValidateData(), basicDetailsValidationSchema(t)),
      });
    }
  };

  onBlurHandler = () => async () => {
    const { state, setState, t } = this.props;
    const { email, uniqueEmail } = state;
    let validationError = {};
    if (!jsUtils.isEmpty(email)) {
      validationError = validate(this.getBasicDetailsValidateData(), basicDetailsValidationSchema(t));
      setState({
        error_list: validationError,
      });
      if (
        jsUtils.isEmpty(validationError)
        && email
        && EMAIL_CHECK_UNIQUE_CONSTRAIN.some((constraint) => email.includes(constraint))
        && uniqueEmail !== email
      ) {
        this.checkEmailExistAPI();
      }
    }
  };

  onEnterPressed = (event) => {
    if (event.keyCode === KEY_CODES.ENTER) event.preventDefault();
  };

  generateOTPAPI = () => {
    const { setState, generateOtpApi, navigateToOtp, t } = this.props;
    setState({
      is_data_loading: true,
      server_error: [],
      common_server_error: EMPTY_STRING,
    });
    setPointerEvent(true);
    const postData = this.getBasicDetailsValidateData();
    generateOtpApi(postData, navigateToOtp, t);
  };

  checkEmailExistAPI = (shouldNavigateToOTPScreenOnSuccess) => {
    const { state, validateEmailDomainApi, t } = this.props;
    const { server_error } = state;
    const data = this.getBasicDetailsValidateData();
    if (jsUtils.isEmpty(server_error)) {
      validateEmailDomainApi(data, shouldNavigateToOTPScreenOnSuccess, this.generateOTPAPI, t);
    }
  };

  getBasicDetailsValidateData = () => {
    const { state } = this.props;
    const { email } = state;
    const data = {
      [BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.ID]: email ? email.trim().toLowerCase() : EMPTY_STRING,
    };
    return data;
  };

  checkEmailAndGenerateOtp = async (event) => {
    event.preventDefault();
    const { setState, t } = this.props;
    const { state } = this.props;
    const { error_list, is_email_unique, server_error } = state;
    if (jsUtils.has(error_list, ['email'], false)) {
      await setState({
        error_list: {},
      });
    }
    const new_error_list = validate(this.getBasicDetailsValidateData(), basicDetailsValidationSchema(t));
    await setState({
      error_list: new_error_list,
    });
    if (jsUtils.isEmpty(new_error_list) || isNull(new_error_list.email)) {
      cancelTokenForValidateEmailAndClearState();
      if (is_email_unique) this.generateOTPAPI();
      else if (jsUtils.isEmpty(server_error) || jsUtils.isEmpty(server_error.email)) {
        this.checkEmailExistAPI(true);
      }
    }
  };
}

const mapStateToProps = (state) => {
  return {
    state: state.SignUpBasicDetailsReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    generateOtpApi: (value, func, t) => {
      dispatch(generateOtpApiAction(value, func, t));
    },
    validateEmailApi: (value, bool, func) => {
      dispatch(validateEmailApiAction(value, bool, func));
    },
    validateEmailDomainApi: (value, bool, func, t) => {
      dispatch(validateEmailAndDomainApiAction(value, bool, func, t));
    },
    setState: (value) => {
      dispatch(signUpBasicDetailsSetState(value));
    },
    clearState: () => {
      dispatch(signUpBasicDetailsClearState());
    },
    dispatch,
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BasicDetails)));

BasicDetails.propTypes = {
  error_for_otp: PropTypes.objectOf(),
  navigateToOtp: PropTypes.func.isRequired,
  email: PropTypes.string,
  state: PropTypes.objectOf().isRequired,
  generateOtpApi: PropTypes.func.isRequired,
  validateEmailApi: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

BasicDetails.defaultProps = {
  email: EMPTY_STRING,
  error_for_otp: null,
};
