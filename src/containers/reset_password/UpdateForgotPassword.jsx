import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AuthLayout from 'components/auth_layout/AuthLayout';
import { AUTH_PAGE_TYPES, ROUTE_METHOD } from 'utils/Constants';
import { useTranslation } from 'react-i18next';
import styles from 'components/auth_layout/AuthLayout.module.scss';
import PageNotFound from '../error_pages/PageNotFound';
import ResetPasswordForm from './reset_password_form/ResetPasswordForm';
import {
  RESET_PASSWORD_STRINGS,
  RESET_PASSWORD_LABELS,
} from './ResetPassword.strings';
import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import {
  consturctTheme,
  mergeObjects,
  routeNavigate,
  validate,
} from '../../utils/UtilityFunctions';
import { resetPasswordDetailsValidateSchema } from './ResetPassword.validation.schema';
import {
  generatePostServerErrorMessage,
} from '../../server_validations/ServerValidation';
import {
  resetPasswordSetStateThunk,
  resetPasswordStartedThunk,
  resetPasswordSuccessThunk,
  resetPasswordFailureThunk,
  validateForgetPasswordApiThunk,
} from '../../redux/actions/ResetPassword.Action';
import {
  cancelResetPassword,
  updateForgetPasswordApiService,
} from '../../axios/apiService/resetPassword.apiService';
import { store } from '../../Store';
import jsUtils from '../../utils/jsUtility';
import { setPointerEvent, updatePostLoader } from '../../utils/loaderUtils';
import { signInSetStateAction, verifyUrlAction } from '../../redux/actions/SignIn.Action';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { getDmsLinkForPreviewAndDownload } from '../../utils/attachmentUtils';
import { SIGN_IN_STRINGS } from '../sign_in/SignIn.strings';
import { changeLanguage } from '../../language/config';
import ThemeContext from '../../hoc/ThemeContext';

function UpdateForgotPassword(props) {
  const { i18n } = useTranslation();
  const history = useHistory();
  const { setColorScheme } = useContext(ThemeContext);

  useEffect(() => {
      const { match, validateForgetPassword, signInSetState } = props;
      if (match && match.params && match.params.pid) {
        const postData = {
          token: match.params.pid,
        };
        validateForgetPassword(postData);
        store.dispatch(verifyUrlAction(postData)).then((resData) => {
        console.log(resData, 'resData');
        if (!jsUtils.isEmpty(resData)) {
          let acc_logo = EMPTY_STRING;
          if (resData.acc_logo) {
            acc_logo = `${getDmsLinkForPreviewAndDownload(
              history,
            )}${SIGN_IN_STRINGS.PUBLIC_DMS_LINK}${resData.acc_logo}`;
          }
          const accountLocaleList = [];
          if (!jsUtils.isEmpty(resData?.acc_locale)) {
            resData.acc_locale.forEach((locale) => {
              const account_locale = {
                label: locale?.split('-')[0].toUpperCase(),
                value: locale,
              };
              accountLocaleList.push(account_locale);
            });
          }
            signInSetState({
              acc_logo: acc_logo,
              isCustomTheme: !!resData?.theme?.color,
              pref_locale: resData?.primary_locale,
              account_locale: accountLocaleList,
            });
            localStorage.setItem('application_language', resData?.pref_locale || resData?.primary_locale);
            i18n.changeLanguage(resData?.pref_locale || resData?.primary_locale);
            changeLanguage(resData?.pref_locale || resData?.primary_locale);
            setColorScheme && setColorScheme(consturctTheme(resData?.theme?.color));
        }
      });
      }
    return () => { cancelResetPassword(); };
    }, []);
  const updateForgotPasswordApi = (data) => {
    const { state, resetPasswordStarted, resetPasswordSuccess, resetPasswordFailure, history } = props;
    const { error_list } = state;
    if (jsUtils.isEmpty(error_list)) {
      resetPasswordStarted();
      setPointerEvent(true);
      updatePostLoader(true);
      updateForgetPasswordApiService(data)
        .then(() => {
          resetPasswordSuccess();
          setPointerEvent(false);
          updatePostLoader(false);
          routeNavigate(history, ROUTE_METHOD.REPLACE, ROUTE_CONSTANTS.SIGNIN, null, null, true);
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

  const getResetPasswordDetailsValidateData = (value, id) => {
    const { state, match } = props;
    const { confirm_password, new_password } = state;
    const data = {
      token: match.params.pid,
      [RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID]: confirm_password,
      [RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID]: new_password,
    };
    if (value) data[id] = value;
    return data;
  };

  const onResetPasswordClickedHandler = (event, callback) => {
    event.preventDefault();
    const data = getResetPasswordDetailsValidateData();
    const validationData = validate(data, resetPasswordDetailsValidateSchema);
    callback && callback(validationData);
    store.dispatch(
        resetPasswordSetStateThunk({
          error_list: validationData,
        }),
      );
        if (jsUtils.isEmpty(validationData)) {
          updateForgotPasswordApi(data);
        }
  };

  const onChangeHandler = (id) => async (event) => {
    store.dispatch(resetPasswordSetStateThunk({ [id]: event.target.value }));
      const { state } = props;
      const { error_list } = state;
      if (!jsUtils.isEmpty(error_list)) {
        store.dispatch(
          resetPasswordSetStateThunk({
            [id]: event.target.value,
            error_list: validate(
              getResetPasswordDetailsValidateData(event.target.value, id),
              resetPasswordDetailsValidateSchema,
            ),
          }),
        );
      }
  };
  const { state, match } = props;
  const { error_list, server_error } = state;
  let resetPasswordView = null;
  const errors = mergeObjects(error_list, server_error);
  if (match && match.params && match.params.pid && state.validLink) {
    const form = (
      <ResetPasswordForm
        errors={errors}
        formDetails={state}
        onChange={onChangeHandler}
        onResetPasswordClicked={onResetPasswordClickedHandler}
      />
    );
    resetPasswordView = (
      <AuthLayout navBarType={AUTH_PAGE_TYPES.RESET_PASSWORD} innerContainer={form} innerContainerClasses={styles.UpdatePasswordTop} />
    );
  } else if (match && match.params && match.params.pid && !state.validLink && !state.loading) {
    resetPasswordView = <h1>Link invalid or Expired</h1>;
  } else if (!state.loading) {
    resetPasswordView = <PageNotFound />;
  }
  return resetPasswordView;
}

const mapStateToProps = (state) => {
  return {
    role: state.RoleReducer.role,
    state: state.ResetPasswordReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    validateForgetPassword: (data) => {
      dispatch(validateForgetPasswordApiThunk(data));
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
    signInSetState: (value) => {
      dispatch(signInSetStateAction(value));
    },
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UpdateForgotPassword));
UpdateForgotPassword.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  state: PropTypes.objectOf(PropTypes.any).isRequired,
  resetPasswordStarted: PropTypes.func.isRequired,
  resetPasswordSuccess: PropTypes.func.isRequired,
  resetPasswordFailure: PropTypes.func.isRequired,
};
