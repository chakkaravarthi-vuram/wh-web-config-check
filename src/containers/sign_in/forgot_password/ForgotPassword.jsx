// React and npm imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';

// Components
import styles from 'components/auth_layout/AuthLayout.module.scss';
import { withTranslation } from 'react-i18next';
// import ResetPasswordIcon from 'assets/icons/sign_in/ResetPasswordIcon';
import Button, { BUTTON_TYPE } from '../../../components/form_components/button/Button';
import Input, { INPUT_VARIANTS } from '../../../components/form_components/input/Input';
import Alert from '../../../components/form_components/alert/Alert';
import AuthLayout from '../../../components/auth_layout/AuthLayout';

// Assets and functions
import { evaluateAriaLabelMessage, mergeObjects, validate } from '../../../utils/UtilityFunctions';
import { forgotPasswordValidateSchema } from './ForgotPassword.validate.schema';
import jsUtils from '../../../utils/jsUtility';

// Css
import gClasses from '../../../scss/Typography.module.scss';

// Strings and constants
import { FORGOT_PASSWORD_STRINGS, ICON_STRINGS } from '../SignIn.strings';
import { BS } from '../../../utils/UIConstants';
import { getForgotPasswordCancelToken } from '../SignIn.utils';
import {
  forgotPasswordAction,
  forgotPasswordClearStateAction,
  forgotPasswordSetStateAction,
} from '../../../redux/actions/SignIn.Action';
import { AUTH_PAGE_TYPES } from '../../../utils/Constants';
import ThemeContext from '../../../hoc/ThemeContext';
import OnethingLogo from '../../../assets/icons/OnethingLogo';
import OnethingLogoSmall from '../../../assets/icons/OneThingLogoSmall';
// import { AUTH_ROUTE_CONSTANT_LIST } from 'urls/RouteConstants';

let forgotPasswordCancelToken;

export const getForgotPasswordApiCancelTokenFromUtils = () => {
  forgotPasswordCancelToken = getForgotPasswordCancelToken();
};
class ForgotPassword extends Component {
  constructor() {
    super();
    this.focusOnErrorRefresher = false;
  }

  // eslint-disable-next-line react/static-property-placement, react/sort-comp
  static contextType = ThemeContext;

  componentDidMount() {
    const { location, forgotPasswordSetState } = this.props;
    if (location && location.state && location.state.email) {
      forgotPasswordSetState({
        email: location.state.email,
        account_id: location.state.account_id,
      });
    }
  }

  componentWillUnmount() {
    const { forgotPasswordClearState } = this.props;
    if (forgotPasswordCancelToken) forgotPasswordCancelToken();
    forgotPasswordClearState();
  }

  render() {
    const { state, t, signInState } = this.props;
    const { email, common_server_error, error_list, server_error } = state;
    const errors = mergeObjects(error_list, server_error);
    const { colorScheme } = this.context;
    let container = null;
    console.log('colorSchemecolorScheme', colorScheme);

    // switch (page) {
    // case 1:
    container = (
      <>
        <div className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600, styles.SignInHeader)}>
          {signInState?.acc_logo ? (
            <div className={styles.Imageclass}>
              <img src={signInState?.acc_logo} alt="" className={styles.AccountLogo} />
            </div>
          ) : (
            <div>
              <OnethingLogo className={cx(styles.Logo)} title={ICON_STRINGS.LOGO_SMALL} />
              <OnethingLogoSmall
                className={cx(gClasses.CursorPointer, styles.SmallLogo)}
                isBlack
                title={ICON_STRINGS.LOGO_SMALL}
              />
            </div>
          )}
        </div>
        <h1 className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600, styles.ForgotPasswordHeader)}>
          {t(FORGOT_PASSWORD_STRINGS.TITLE)}
        </h1>
        <form className={gClasses.MT15} onSubmit={() => false}>
          <Input
            id={FORGOT_PASSWORD_STRINGS.FORM_LABEL.EMAIL.ID}
            label={t(FORGOT_PASSWORD_STRINGS.FORM_LABEL.EMAIL.LABEL)}
            placeholder={FORGOT_PASSWORD_STRINGS.FORM_LABEL.EMAIL.PLACEHOLDER}
            value={email}
            focusOnError
            focusOnErrorRefresher={this.focusOnErrorRefresher}
            errorMessage={errors[FORGOT_PASSWORD_STRINGS.FORM_LABEL.EMAIL.ID]}
            onChangeHandler={this.onChangeHandler(FORGOT_PASSWORD_STRINGS.FORM_LABEL.EMAIL.ID)}
            inputVariant={INPUT_VARIANTS.TYPE_3}
            autoFocus
            ariaLabelHelperMessage={evaluateAriaLabelMessage(errors[FORGOT_PASSWORD_STRINGS.FORM_LABEL.EMAIL.ID])}
            helperAriaHidden={errors[FORGOT_PASSWORD_STRINGS.FORM_LABEL.EMAIL.ID] && true}
          />
          <Alert
            content={common_server_error}
            className={cx(gClasses.MT5, gClasses.MB15)}
          // ariaLabelHelperMessage={evaluateAriaLabelMessage(errors[FORGOT_PASSWORD_STRINGS.FORM_LABEL.EMAIL.ID])}
          />
          <Button
            id={FORGOT_PASSWORD_STRINGS.FORM_LABEL.GENERATE_OTP_BUTTON.ID}
            buttonType={BUTTON_TYPE.AUTH_PRIMARY}
            onClick={
              (e) => {
                this.onForgotPasswordClicked(e);
                if (errors[FORGOT_PASSWORD_STRINGS.FORM_LABEL.EMAIL.ID] || common_server_error) this.focusOnErrorRefresher = !this.focusOnErrorRefresher;
              }}
            style={{
              backgroundColor: signInState?.isCustomTheme && colorScheme?.activeColor,
            }}
            className={gClasses.MT5}
            width100
          >
            {t(FORGOT_PASSWORD_STRINGS.FORM_LABEL.GENERATE_OTP_BUTTON.LABEL)}
          </Button>
        </form>
      </>
    );
    // break;
    // reset password page - mani
    // case 2:
    //     container = (
    //     <>
    //       <h1 className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600, gClasses.MB30)}>{FORGOT_PASSWORD_STRINGS.RESET_EMAIL_SUCCESS.TITLE}</h1>
    //       <ResetPasswordIcon className={cx(gClasses.DisplayFlex, styles.emailSvg)} />
    //       <p className={cx(gClasses.FTwo12GrayV2, gClasses.MT30)}>
    //         {FORGOT_PASSWORD_STRINGS.RESET_EMAIL_SUCCESS.MESSAGE}
    //       <div className={gClasses.FontWeight600}>
    //         {email}
    //       </div>
    //       </p>
    //       <div className={cx(styles.horizontalLine, gClasses.MB20, gClasses.MT20)} />
    //       <Button
    //       onClick={() => {
    //         routeNavigate(history, ROUTE_METHOD.REPLACE, AUTH_ROUTE_CONSTANT_LIST[1]);
    //       }}
    //       buttonType={BUTTON_TYPE.AUTH_PRIMARY}
    //       width100
    //       className={cx(gClasses.MB15, gClasses.DisplayBlock)}
    //       >
    //         {FORGOT_PASSWORD_STRINGS.RESET_EMAIL_SUCCESS.LOGIN_BUTTON}
    //       </Button>
    //       <Button
    //       onClick={this.onResendResetPasswordClicked}
    //       buttonType={BUTTON_TYPE.AUTH_SECONDARY}
    //       width100
    //       className={cx(gClasses.DisplayBlock)}
    //       >
    //         {FORGOT_PASSWORD_STRINGS.RESET_EMAIL_SUCCESS.RESEND}
    //       </Button>
    //     </>
    //     );
    //   break;

    //   default:
    //     container = null;
    // }

    return (
      <AuthLayout navBarType={AUTH_PAGE_TYPES.FORGOT_PASSWORD} innerContainer={container} innerContainerClasses={styles.ForgotPasswordTop} />
    );
  }

  onChangeHandler = (id) => async (event) => {
    const { state, forgotPasswordSetState, dispatch, t } = this.props;
    const { error_list } = state;
    dispatch(forgotPasswordSetStateAction({ [id]: event.target.value })).then(() => {
      if (!jsUtils.isEmpty(error_list)) {
        forgotPasswordSetState({
          error_list: validate(this.getForgotPasswordValidateData(), forgotPasswordValidateSchema(t)),
        });
      }
    });
  };

  // reset password page - mani
  // onResendResetPasswordClicked = () => {
  //   const { dispatch } = this.props;
  //   dispatch(forgotPasswordSetStateAction({ page: 1 }));
  // };

  onForgotPasswordClicked = (event) => {
    event.preventDefault();
    const { dispatch, t } = this.props;
    dispatch(
      forgotPasswordSetStateAction({
        error_list: validate(this.getForgotPasswordValidateData(), forgotPasswordValidateSchema(t)),
      }),
    ).then(() => {
      const { state } = this.props;
      const { error_list } = state;
      if (jsUtils.isEmpty(error_list)) this.forgotPasswordApi(this.getForgotPasswordValidateData());
    });
  };

  getForgotPasswordValidateData = () => {
    const { state } = this.props;
    const { email, account_id } = state;
    return {
      email,
      account_id,
    };
  };

  forgotPasswordApi = (data) => {
    const { history, forgotPasswordApiCall, t } = this.props;
    forgotPasswordApiCall(data, history, t);
  };
}

const mapStateToProps = (state) => {
  return {
    state: state.ForgotPasswordReducer,
    signInState: state.SignInReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    forgotPasswordApiCall: (data, history, t) => {
      dispatch(forgotPasswordAction(data, history, t));
    },
    forgotPasswordSetState: (data) => {
      dispatch(forgotPasswordSetStateAction(data));
    },
    forgotPasswordClearState: () => {
      dispatch(forgotPasswordClearStateAction());
    },
    dispatch,
  };
};

ForgotPassword.defaultProps = {
  location: {},
  state: {},
};

ForgotPassword.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any),
  forgotPasswordApiCall: PropTypes.func.isRequired,
  forgotPasswordSetState: PropTypes.func.isRequired,
  forgotPasswordClearState: PropTypes.func.isRequired,
  state: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ForgotPassword)));
