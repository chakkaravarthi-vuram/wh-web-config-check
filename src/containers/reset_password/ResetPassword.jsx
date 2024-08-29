import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  adminProfileAction,
  roleAction,
  colorCodeAction,
  memberProfileAction,
  flowCreatorProfileAction,
} from '../../redux/actions/Actions';

import PageNotFound from '../error_pages/PageNotFound';
import ResetPasswordForm from './reset_password_form/ResetPasswordForm';

import { RESET_PASSWORD_STRINGS, RESET_PASSWORD_LABELS } from './ResetPassword.strings';
import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import {
  mergeObjects,
  routeNavigate,
  validate,
} from '../../utils/UtilityFunctions';
import { updatedResetPasswordDetailsValidateSchema } from './ResetPassword.validation.schema';
import { generatePostServerErrorMessage } from '../../server_validations/ServerValidation';
import { AUTH_PAGE_TYPES, ROUTE_METHOD } from '../../utils/Constants';
import {
  resetPasswordSetStateThunk,
  resetPasswordStartedThunk,
  resetPasswordSuccessThunk,
  resetPasswordFailureThunk,
} from '../../redux/actions/ResetPassword.Action';
import {
  cancelUpdatedResetPassword,
  updatedResetPassword,
} from '../../axios/apiService/resetPassword.apiService';
import { store } from '../../Store';
import { userPreferenceDataChangeAction } from '../../redux/actions/UserPreference.Action';
import AuthLayout from '../../components/auth_layout/AuthLayout';

import jsUtils from '../../utils/jsUtility';
import { setPointerEvent, updatePostLoader } from '../../utils/loaderUtils';

class ResetPassword extends Component {
  componentWillUnmount() {
    cancelUpdatedResetPassword();
  }

  render() {
    const { state, location } = this.props;
    const { error_list, server_error } = state;
    const location_state = location.state;
    let resetPasswordView = null;
    const errors = mergeObjects(error_list, server_error);
    if (location_state?.isForResetPassword) {
      const form = (
        <ResetPasswordForm
          errors={errors}
          formDetails={state}
          onChange={this.onChangeHandler}
          onResetPasswordClicked={this.onResetPasswordClickedHandler}
          username={location_state.username}
        />
      );
      resetPasswordView = (
        <AuthLayout navBarType={AUTH_PAGE_TYPES.RESET_PASSWORD} innerContainer={form} />
      );
    } else {
      resetPasswordView = <PageNotFound />;
    }
    return resetPasswordView;
  }

  onChangeHandler = (id) => async (event) => {
    store.dispatch(resetPasswordSetStateThunk({ [id]: event.target.value })).then(() => {
      const { state, t } = this.props;
      const { error_list } = state;
      if (!jsUtils.isEmpty(error_list)) {
        store.dispatch(
          resetPasswordSetStateThunk({
            error_list: validate(this.getResetPasswordDetailsValidateData(), updatedResetPasswordDetailsValidateSchema(t)),
          }),
        );
      }
    });
  };

  onResetPasswordClickedHandler = (event) => {
    const { t } = this.props;
    event.preventDefault();
    const data = this.getResetPasswordDetailsValidateData();
    store
      .dispatch(
        resetPasswordSetStateThunk({
          error_list: validate(data, updatedResetPasswordDetailsValidateSchema(t)),
        }),
      )
      .then(() => {
        const { state } = this.props;
        const { error_list } = state;
        if (jsUtils.isEmpty(error_list)) {
          this.resetPasswordAPI(data);
        }
      });
  };

  resetPasswordAPI = (data) => {
    const { state, resetPasswordStarted, resetPasswordFailure } = this.props;
    const { error_list } = state;
    const { history } = this.props;
    if (jsUtils.isEmpty(error_list)) {
      resetPasswordStarted();
      setPointerEvent(true);
      updatedResetPassword(data)
        .then(() => {
          setPointerEvent(false);
          updatePostLoader(false);
          routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNIN, null, null, true);
        })
        .catch((error) => {
          const { server_error } = state;
          setPointerEvent(false);
          updatePostLoader(false);
          const errors = generatePostServerErrorMessage(error, server_error, RESET_PASSWORD_LABELS);
          const err = errors.state_error ? errors.state_error : [];
          resetPasswordFailure(err);
        });
    }
  };

  getResetPasswordDetailsValidateData = () => {
    const { state } = this.props;
    const { confirm_password, new_password } = state;
    const data = {
      [RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID]: confirm_password,
      [RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID]: new_password,
    };
    return data;
  };
}

const mapStateToProps = (state) => {
  return {
    role: state.RoleReducer.role,
    state: state.ResetPasswordReducer,
    userState: state.SignInReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setRole: (value) => {
      dispatch(roleAction(value));
    },
    setAdminProfile: (value) => {
      dispatch(adminProfileAction(value));
    },
    setMemberProfile: (value) => {
      dispatch(memberProfileAction(value));
    },
    setFlowCreatorProfile: (value) => {
      dispatch(flowCreatorProfileAction(value));
    },
    setUserLocale: (value) => {
      dispatch(userPreferenceDataChangeAction(value));
    },
    setColorCode: (value) => {
      dispatch(colorCodeAction(value));
    },
    setState: (data) => {
      dispatch(resetPasswordSetStateThunk(data));
    },
    resetPasswordStarted: () => {
      dispatch(resetPasswordStartedThunk());
    },
    resetPasswordSuccess: () => {
      dispatch(resetPasswordSuccessThunk());
    },
    resetPasswordFailure: (error) => {
      dispatch(resetPasswordFailureThunk(error));
    },
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ResetPassword)));
ResetPassword.propTypes = {
  setRole: PropTypes.func.isRequired,
  setAdminProfile: PropTypes.func.isRequired,
  setMemberProfile: PropTypes.func.isRequired,
  setFlowCreatorProfile: PropTypes.func.isRequired,
  setUserLocale: PropTypes.func.isRequired,
  setColorCode: PropTypes.func.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  state: PropTypes.objectOf(PropTypes.any).isRequired,
  setState: PropTypes.func.isRequired,
  resetPasswordStarted: PropTypes.func.isRequired,
  resetPasswordSuccess: PropTypes.func.isRequired,
  resetPasswordFailure: PropTypes.func.isRequired,
};
