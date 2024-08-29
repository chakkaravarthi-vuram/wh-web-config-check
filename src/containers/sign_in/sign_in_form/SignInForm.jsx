import React, { useEffect, useState, useContext } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SuccessSignupIcon from 'assets/icons/SuccessSignup';
// import PasswordEye from 'assets/icons/PasswordEye';
import jsUtility, { getDomainName } from 'utils/jsUtility';
import { evaluateAriaLabelMessage } from 'utils/UtilityFunctions';
import PasswordEyeOpen from 'assets/icons/PasswordEyeNew';
import { clearSessionDetails } from 'axios/apiService/clearSessionDetails.apiService';
import * as ROUTE_CONSTANTS from 'urls/RouteConstants';
import styles from '../../../components/auth_layout/AuthLayout.module.scss';
import Input, { INPUT_VARIANTS } from '../../../components/form_components/input/Input';
import Button from '../../../components/form_components/button/Button';
import Alert from '../../../components/form_components/alert/Alert';

import { ICON_STRINGS, SIGN_IN_STRINGS } from '../SignIn.strings';

import { BUTTON_TYPE } from '../../../utils/Constants';
import { INPUT_TYPES, BS, ARIA_ROLES, COLOR_CONSTANTS } from '../../../utils/UIConstants';

import gClasses from '../../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import Label from '../../../components/form_components/label/Label';
import { getCachedUserDetails } from '../SignIn.utils';
import { HOME } from '../../../urls/RouteConstants';
import ThemeContext from '../../../hoc/ThemeContext';
import OnethingLogo from '../../../assets/icons/OnethingLogo';
import OnethingLogoSmall from '../../../assets/icons/OneThingLogoSmall';

const cookies = new Cookies();
function SignInForm(props) {
  const {
    errors, username, onSwitchAccountClicked, form_details, onChange, onSignInClicked, onForgotPasswordClick, unMountCallHandler, email,
  } = props;
  const [onEyeClick, setOnEyeClick] = useState(false);
  const [focusOnErrorRefresher, setFocusOnErrorRefresher] = useState(false);
  const [userNameOrEmail, setUserNameOrEmail] = useState(EMPTY_STRING);
  const { t } = useTranslation();
  const previewIconButton = () => {
    setOnEyeClick(!onEyeClick);
  };

  const { colorScheme } = useContext(ThemeContext);
  // const onMouseLeaveHandler = () => {
  //   setOnEyeClick(false);
  // };
  const getuserNameorEmail = () => {
    const isEmailSignin = cookies.get('isEmailSignin');
    const isusernameOrEmail = cookies.get('isUsernameOrEmail');
    let name;
    if (jsUtility.isEmpty(isusernameOrEmail)) {
      name = isEmailSignin === 'true' ? email : username;
    } else {
      name = isusernameOrEmail;
    }
    return name;
  };
  useEffect(() => {
    const userDetails = getCachedUserDetails();
    const cookieProps = {
      path: '/',
      domain: getDomainName(window.location.hostname),
    };
    if (userDetails.buy_now_user && (form_details && form_details.direct_from_signin && form_details.direct_from_signin !== 'true')) {
      cookies.remove('buy_now_user', cookieProps);
    }
    if (window.location.pathname !== HOME) {
      clearSessionDetails();
    }
    const cookiePropsHostName = {
      path: '/',
      domain: window.location.hostname,
    };
    cookies.remove('cet', cookiePropsHostName);
    cookies.remove('ctd', cookiePropsHostName);
    return () => {
      unMountCallHandler();
    };
  }, [form_details && form_details.direct_from_signin]);
  useEffect(() => {
    setUserNameOrEmail(getuserNameorEmail());
   }, []);
    const handleSubmit = (event) => {
      onSignInClicked(event);
      if (errors[SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID] || form_details.common_server_error) setFocusOnErrorRefresher((refresher) => !refresher);
    };
  return (
    <>
     {(form_details.direct_from_signin && form_details.direct_from_signin === 'true') ? (
     <>
      <div className={cx(gClasses.CenterH, gClasses.MB10)}>
        <SuccessSignupIcon ariaHidden="true" />
      </div>
      <h1 className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600, styles.SignInHeader, gClasses.MB5)}>
        {t(SIGN_IN_STRINGS.ACCOUNT_CREATED)}
      </h1>
      <div className={cx(gClasses.FTwo12GrayV53, BS.TEXT_CENTER)}>
        {/* <div className={gClasses.MB10}>{SIGN_IN_STRINGS.ACCOUNT_CREATED}</div> */}
        <div>
          {t(SIGN_IN_STRINGS.USERNAME)}
          {' '}
          <span className={cx(gClasses.FTwo12GrayV3, gClasses.FontWeight600)}>{`${username}.`}</span>
        </div>
      </div>
     </>
    ) : (
     <>
     <h1 className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600, styles.SignInHeader)}>
     {form_details?.acc_logo ? (
          <div className={styles.Imageclass}>
          <img src={form_details?.acc_logo} alt="" className={styles.AccountLogo} />
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
     </h1>
      <div
        className={cx(
          gClasses.FontWeight600,
          gClasses.FTwo16GrayV3,
          gClasses.MT5,
          gClasses.WordBreakBreakWord,
          BS.TEXT_CENTER,
        )}
      >
        {userNameOrEmail}
      </div>
      <div
        className={cx(gClasses.CenterH, gClasses.MT5)}
      >
        <Link
          style={{
            color: form_details?.isCustomTheme && colorScheme?.activeColor,
          }}
          className={cx(gClasses.FOne13BlueV2, gClasses.Underline, gClasses.CursorPointer, gClasses.ClickableElement, styles.TryAnotherAccount)}
          onClick={onSwitchAccountClicked}
          id={SIGN_IN_STRINGS.FORM_LABEL.SWITCH_ACCOUNT_BUTTON.ID}
          to={ROUTE_CONSTANTS.SIGNIN}
        >
          {t(SIGN_IN_STRINGS.TRY_ANOTHER_ACCOUNT)}
        </Link>
      </div>
     </>
   )}
      <form className={gClasses.MT20}>

        <div className={BS.D_FLEX}>
          <Label
          labelFor={SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID}
          content={t(SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.LABEL)}
          id={`${SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID}_label`}
          />
          <Link
            id={SIGN_IN_STRINGS.FORM_LABEL.FORGOT_PASSWORD.ID}
            className={cx(
              BS.ML_AUTO,
              gClasses.FOne13,
              gClasses.FontWeight500,
              gClasses.CursorPointer,
              gClasses.ClickableElement,
              styles.Timer,
              styles.ForgotPwd,
            )}
            style={{
              color: form_details?.isCustomTheme && colorScheme?.activeColor,
            }}
            onClick={onForgotPasswordClick}
            to="/forgot_password"
          >
            {t(SIGN_IN_STRINGS.FORM_LABEL.FORGOT_PASSWORD.LABEL)}
          </Link>
        </div>
        {/* below HideUsername div is not needed for dev environment. It is to handle saved passwords within browser */}
        <div className={styles.HideUsername}>
          <Input
            id={SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID}
            placeholder={t(SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.PLACEHOLDER)}
            value={form_details.username}
            name={SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID}
          />
        </div>
        <Input
          id={SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID}
          // placeholder={t(SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.PLACEHOLDER)}
          value={form_details.password}
          errorMessage={errors[SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID]}
          onChangeHandler={onChange(SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID)}
          inputVariant={INPUT_VARIANTS.TYPE_3}
          type={onEyeClick ? INPUT_TYPES.TEXT : INPUT_TYPES.PASSWORD}
          testId={SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.TEST_ID}
          onKeyDownHandler={(e) => { // on clicking enter key, it is same as clicking enter button
            if (e?.keyCode === 13) onSignInClicked(e);
          }}
          autoFocus
          focusOnError={errors[SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID] || form_details.common_server_error}
          hideLabel
          name={SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID}
          icon={form_details.password && (
          <PasswordEyeOpen
          // onMouseDown={previewIconButton} // changing passwordEye to a button functionality
          // onMouseUp={previewIconButton}
          className={gClasses.CursorPointer}
          // onMouseLeave={onMouseLeaveHandler}
          tabIndex={0}
          onClick={previewIconButton}
          onKeyPress={previewIconButton}
          role={ARIA_ROLES.SWITCH}
          onEyeClick={onEyeClick}
          />
        )}
          ariaLabelHelperMessage={evaluateAriaLabelMessage(errors[SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID])}
          focusOnErrorRefresher={focusOnErrorRefresher}
          helperAriaHidden={errors[SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID] && true}
          isHideTitle
        />
        <Alert
        role={ARIA_ROLES.ALERT}
        content={form_details.common_server_error}
        className={gClasses.MT20}
        // ariaLabelHelperMessage={evaluateAriaLabelMessage(form_details.common_server_error)}
        />
        {/* alert pops up on wrong credentials for eg */}
        <div className={styles.ContinueButtonContainer}>
          <Button
            id={SIGN_IN_STRINGS.FORM_LABEL.SIGN_IN_BUTTON.ID}
            buttonType={BUTTON_TYPE.AUTH_PRIMARY}
            onClick={handleSubmit}
            width100
            style={{
              backgroundColor: form_details?.isCustomTheme && colorScheme?.activeColor,
            }}
          >
            {t(SIGN_IN_STRINGS.FORM_LABEL.SIGN_IN_BUTTON.LABEL)}
          </Button>
        </div>
        <div className={cx(gClasses.CenterH, gClasses.MT10)}>
          <button
            id={SIGN_IN_STRINGS.FORM_LABEL.FORGOT_PASSWORD.ID}
            className={cx(

              gClasses.FOne13,
              gClasses.FontWeight500,
              gClasses.CursorPointer,
              gClasses.ClickableElement,
              styles.ForgotPwd1,
            )}
            onClick={onForgotPasswordClick}
            style={{
              color: form_details?.isCustomTheme && colorScheme?.activeColor,
              border: `1px solid ${form_details?.isCustomTheme && colorScheme?.activeColor}`,
              backgroundColor: form_details?.isCustomTheme && colorScheme?.appBg,
              ':hover': {
                backgroundColor: form_details?.isCustomTheme && colorScheme?.activeColor,
                color: COLOR_CONSTANTS.WHITE,
              },
            }}
          >
            {t(SIGN_IN_STRINGS.FORM_LABEL.FORGOT_PASSWORD.LABEL)}
          </button>
        </div>
      </form>
    </>
  );
}
SignInForm.defaultProps = {
  errors: {},
  form_details: {},
  username: EMPTY_STRING,
};
SignInForm.propTypes = {
  errors: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func.isRequired,
  onSignInClicked: PropTypes.func.isRequired,
  form_details: PropTypes.objectOf(PropTypes.any),
  username: PropTypes.string,
  onSwitchAccountClicked: PropTypes.func.isRequired,
  onForgotPasswordClick: PropTypes.func.isRequired,
};
export default SignInForm;
