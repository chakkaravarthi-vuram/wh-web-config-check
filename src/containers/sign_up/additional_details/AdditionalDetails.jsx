import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateProfileInRedux } from 'utils/profileUtils';
import { removeCachedDetails } from 'containers/sign_in/SignIn.utils';
import { getAuthorizationDetailsApiAction } from 'redux/actions/SignIn.Action';
import { adminProfileAction, colorCodeAction, memberProfileAction, flowCreatorProfileAction, roleAction, setAccountCompletionStatus } from 'redux/actions/Actions';
import socketIOClient from 'socket.io-client';
import { userPreferenceDataChangeAction } from 'redux/actions/UserPreference.Action';
import { SIGN_IN_STRINGS } from 'containers/sign_in/SignIn.strings';
import {
  // CHAT_BASE_URL, CHAT_SOCKET_PATH,
  NOTIFICATION_BASE_URL, NOTIFICATION_SOCKET_PATH } from 'urls/ApiUrls';
import { FORM_POPOVER_STATUS, PRODUCTION } from 'utils/Constants';
import { withTranslation } from 'react-i18next';
import AdditionalDetailsForm from './additional_details_form/AdditionalDetailsForm';
// import FullPageLoader from '../../../assets/icons/FullPageLoader';

import { validate, setPointerEvent, getDomainFromMail, navigateToHome, mergeObjects, routeNavigate, showToastPopover } from '../../../utils/UtilityFunctions';
import { additionalDetailsValidationSchema } from './AdditionalDetails.validation.schema';
import {
  signUpAdditionalDetailsSetState,
  signUpAdditionalDetailsClearState,
  signUpApiAction,
  validateAccountDomainApiAction,
} from '../../../redux/actions/SignUp.Action';
import {
  cancelTokenForDomainNameAndClearState,
  cancelTokenForSignUpAndClearState,
} from '../../../axios/apiService/signUp.apiService';

import { KEY_CODES, ROUTE_METHOD, SIGNUP_MIN_MAX_CONSTRAINT } from '../../../utils/Constants';
import { ADDITIONAL_DETAILS_STRINGS, UUID_STRING } from './AdditionalDetails.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import * as ROUTE_CONSTANTS from '../../../urls/RouteConstants';
import jsUtils, { cloneDeep, getDomainName } from '../../../utils/jsUtility';

class AdditionalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopperOpen: false,
    };
  }

  componentDidMount() {
    const { email, setState } = this.props;
    if (email) {
      setState({
        username: email,
        account_domain: getDomainFromMail(jsUtils.cloneDeep(email || EMPTY_STRING)),
      });
    }
  }

  componentWillUnmount() {
    const { clearState, dispatch } = this.props;
    dispatch(cancelTokenForDomainNameAndClearState());
    dispatch(cancelTokenForSignUpAndClearState());
    clearState();
  }

  render() {
    const { isPopperOpen } = this.state;
    const { state, setState } = this.props;
    const additional_details_state = { ...state };
    const { email } = this.props;
    const error_list = { ...additional_details_state.error_list };
    const server_error = { ...additional_details_state.server_error };
    const errors = mergeObjects(error_list, server_error);
    const { account_domain } = additional_details_state;
    return (
      <>
        {/* <FullPageLoader
          testId={ADDITIONAL_DETAILS_STRINGS.FULL_PAGE_LOADER}
        /> */}
        <AdditionalDetailsForm
          errors={errors}
          formDetails={state}
          email={email}
          onChange={this.onChangeHandler}
          onBlur={this.onBlurHandler}
          onKeyPress={this.onEnterPressed}
          onSignUpClicked={this.onSignUpClickedHandler(errors)}
          testId={ADDITIONAL_DETAILS_STRINGS.ADDITIONAL_DETAILS_FORM}
          onClickingEditDomain={this.onClickingEditDomain}
          account_domain={account_domain}
          onIndustrySelected={this.onIndustrySelected}
          setState={setState}
          isPopperOpen={isPopperOpen}
          onFocus={this.onFocusHandler}
        />
      </>
    );
  }

  onIndustrySelected = (event) => {
    const { value } = event.target;
    const { state, setState } = this.props;
    const { role_in_company, error_list } = state;
    console.log('gsdasadfg', role_in_company, jsUtils.isUndefined(role_in_company));
    const industryList = jsUtils.isEmpty(role_in_company)
      ? []
      : role_in_company;
    if (!industryList.includes(value)) {
      industryList.push(value);
    } else industryList.splice(industryList.indexOf(value), 1);
    if (!jsUtils.isEmpty(industryList)) {
      error_list[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.ID] = null;
    }
    const stateToBeMerged = { [ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.ID]: industryList };
    // const enable_button = compareValuesAndEnableButto(stateToBeMerged);
    console.log('AdditionalDetails-124');
    setState({ ...stateToBeMerged });
  };

  onEnterPressed = (event) => {
    if (event.keyCode === KEY_CODES.ENTER) event.preventDefault();
  };

  onChangeHandler = async (id, event) => {
    const { state, setState, t } = this.props;
    const { server_error } = state;
    server_error[id] = null; // remove server error for field in onChange
    const urlEditCheck = (id === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID) ? { urlEditable: true } : undefined;
    await setState({
      [id]: event.target.value,
      server_error,
      common_server_error: EMPTY_STRING,
      ...urlEditCheck,
    });
    const { error_list } = state;
    if (!jsUtils.isEmpty(error_list)) {
      setState({
        error_list: validate(
          this.getAdditionalDetailsValidateData(),
          additionalDetailsValidationSchema(t),
        ),
      });
    }
    if (id === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.ID) {
      this.setState({ isPopperOpen: true });
    }
  };

  onFocusHandler = (id) => async () => {
    if (id === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.ID) {
      this.setState({ isPopperOpen: true });
    }
  };

  onBlurHandler = (id) => async () => {
    const { state } = this.props;
    // Check domain name is unique
    const { account_domain, error_list, uniqueDomainName } = state;
    if (
      id === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID
      && jsUtils.isEmpty(error_list[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID])
      && account_domain.length >= SIGNUP_MIN_MAX_CONSTRAINT.DOMAIN_NAME_MIN_VALUE
      && uniqueDomainName !== account_domain
    ) {
      this.checkDomainNameExistAPI();
    }
    if (id === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_NAME.ID) {
      this.setState({ isPopperOpen: false });
    }
  };

  onSignUpClickedHandler = (errors) => async (event, callback) => {
    console.log('gsadfg', errors, event);
    event.preventDefault();
    const { setState } = this.props;
    const { state, t } = this.props;
    const { error_list, isDomainNameUnique, server_error } = state;

    let evaluatedErrorList = validate(
      this.getAdditionalDetailsValidateData(),
      additionalDetailsValidationSchema(t),
    );
    await setState({
      error_list: evaluatedErrorList,
    });

    if (jsUtils.isEmpty(error_list[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID])) {
      this.checkDomainNameExistAPI(false, (local_server_error) => {
        evaluatedErrorList = { ...evaluatedErrorList, ...local_server_error };
        callback && callback(evaluatedErrorList);
      });
    } else {
      callback && callback(evaluatedErrorList);
    }

    if (error_list[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID] || errors.account_domain) {
      showToastPopover(
        error_list[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID] || errors.account_domain,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
    if (jsUtils.isEmpty(error_list)) {
      cancelTokenForDomainNameAndClearState();
      // Make api call for sign up
      if (!isDomainNameUnique) this.checkDomainNameExistAPI(true);
      else if (
        (jsUtils.isEmpty(server_error) || jsUtils.isEmpty(server_error.account_name))
        && (jsUtils.isEmpty(server_error) || jsUtils.isEmpty(server_error.account_domain))
      ) {
        this.createAdminAccountAPI();
      }
    }
  };

  onClickingEditDomain = () => {
    const { setState } = this.props;
    setState({
      urlEditable: true,
    });
  };

  socketConnection = () => {
    // this.socket = socketIOClient(CHAT_BASE_URL, {
    //   path: CHAT_SOCKET_PATH,
    //   query: {
    //     user: email,
    //     user_id: id,
    //     account_id,
    //     first_name,
    //     last_name,
    //     is_active: true,
    //     account_domain,
    //   },
    //   reconnection: true,
    //   reconnectionDelay: 1000,
    //   reconnectionDelayMax: 5000,
    //   reconnectionAttempts: Infinity,
    //   withCredentials: true,
    // });
    // this.socket.on(SIGN_IN_STRINGS.SOCKET_CONNECTION_ESTABLISHED, (socketData) => {
    //   console.log('Chat Socket - Connection Established', socketData);
    // });

    // NOTIFICATION SOCKET INITIATION
    this.notificationSocket = socketIOClient(NOTIFICATION_BASE_URL, {
      path: NOTIFICATION_SOCKET_PATH,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      withCredentials: true,
    });
    this.notificationSocket.on(SIGN_IN_STRINGS.SOCKET_CONNECTION_ESTABLISHED, (socketData) => {
      console.log('Notification Socket - Connection Established', socketData);
    });
  };

  getAuthorizationDetailsApi = (redirectLocation, account_domain) => {
    const { dispatch } = this.props;
    dispatch(getAuthorizationDetailsApiAction(cloneDeep(this.props), this.socketConnection, this.socket)).then(
      (response) => {
        removeCachedDetails();
        const {
          history, location, setFlowCreatorProfile, setMemberProfile, setAdminProfile, setRole, setIsAccountProfileCompleted,
        } = this.props;
        if (!response.is_invite_user) {
          updateProfileInRedux(
            response,
            setRole,
            null,
            this.socket,
            setAdminProfile,
            setFlowCreatorProfile,
            setMemberProfile,
            setIsAccountProfileCompleted,
            this.notificationSocket,
          );
        }
        // console.log("fasdsdd", `https://${account_domain}.${getDomainName(window.location.hostname)}${ROUTE_CONSTANTS.ADMIN_HOME}`);
        if (process.env.NODE_ENV === PRODUCTION) {
          window.location = `https://${account_domain}.${getDomainName(window.location.hostname)}${ROUTE_CONSTANTS.ADMIN_HOME}`;
        } else {
          navigateToHome(response.user_type, { isInviteUser: response.is_invite_user, username: response.username, id: response._id }, { ...history, location });
        }
      },
    );
  };

  createAdminAccountAPI = () => {
    const { uuid, signUpApi, state, history, email, t } = this.props;
    const { account_domain } = state;
    const data = this.getAdditionalDetailsValidateData();
    data[UUID_STRING] = uuid;
    data[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_NAME.ID] = account_domain;
    data[ADDITIONAL_DETAILS_STRINGS.EMAIL] = email;
    setPointerEvent(true);
    signUpApi(data, this.navigateToHome, history, this.getAuthorizationDetailsApi, t);
  };

  getAdditionalDetailsValidateData = () => {
    const { state } = this.props;
    const {
      account_domain, password, first_name, last_name, username, role_in_company,
    } = state;
    const data = {
      [ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID]: account_domain.trim(),
      [ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.ID]: password,
      [ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.ID]: first_name.trim(),
      [ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.ID]: last_name.trim(),
      [ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.ID]: username.trim(),
      [ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.ID]: role_in_company.trim(),
    };
    return data;
  };

  navigateToHome = () => {
    const { history } = this.props;
    routeNavigate(history, ROUTE_METHOD.REPLACE, ROUTE_CONSTANTS.HOME);
  };

  checkDomainNameExistAPI = (shouldNavigateToCreateAccountOnSuccess, errCallback) => {
    const { state, validateAccountDomainApi, t } = this.props;
    const { account_domain } = state;
    const data = {
      account_domain,
    };
    validateAccountDomainApi(
      data,
      shouldNavigateToCreateAccountOnSuccess,
      this.createAdminAccountAPI,
      errCallback,
      t,
    );
  };
}

const mapStateToProps = (state) => {
  return {
    state: state.SignUpAdditionalDetailsReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setState: (data) => {
      dispatch(signUpAdditionalDetailsSetState(data));
    },
    signUpApi: (data, func, obj, func2, t) => {
      dispatch(signUpApiAction(data, func, obj, func2, t));
    },
    validateAccountDomainApi: (data, bool, func, errCallback, t) => {
      dispatch(validateAccountDomainApiAction(data, bool, func, errCallback, t));
    },
    clearState: () => {
      dispatch(signUpAdditionalDetailsClearState());
    },
    setFlowCreatorProfile: (value) => {
      dispatch(flowCreatorProfileAction(value));
    },
    setMemberProfile: (value) => {
      dispatch(memberProfileAction(value));
    },
    setRole: (value) => {
      dispatch(roleAction(value));
    },
    setAdminProfile: (value) => {
      dispatch(adminProfileAction(value));
    },
    setColorCode: (value) => {
      dispatch(colorCodeAction(value));
    },
    setUserLocale: (value) => {
      dispatch(userPreferenceDataChangeAction(value));
    },
    setIsAccountProfileCompleted: (value) => {
      dispatch(setAccountCompletionStatus(value));
    },
    dispatch,
  };
};

AdditionalDetails.propTypes = {
  history: PropTypes.objectOf().isRequired,
  email: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  state: PropTypes.objectOf().isRequired,
  signUpApi: PropTypes.func.isRequired,
  validateAccountDomainApi: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
  setRole: PropTypes.func.isRequired,
  setColorCode: PropTypes.func.isRequired,
  setAdminProfile: PropTypes.func.isRequired,
  setMemberProfile: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AdditionalDetails)));
