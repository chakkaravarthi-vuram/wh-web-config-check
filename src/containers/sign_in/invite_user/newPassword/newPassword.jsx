import React, { useContext, useState } from 'react';
import cx from 'classnames/bind';
import Cookies from 'universal-cookie';
import { isEmpty } from 'lodash';
import { cloneDeep, unset, getDomainName } from 'utils/jsUtility';
import { uuidv4 } from '@firebase/util';
import PasswordEyeOpen from 'assets/icons/PasswordEyeNew';
import PasswordHint from 'components/password_hint/PasswordHint';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Button, { BUTTON_TYPE } from '../../../../components/form_components/button/Button';
import Input, { INPUT_VARIANTS } from '../../../../components/form_components/input/Input';
import Alert from '../../../../components/form_components/alert/Alert';

import { updateInviteUserApi } from '../../../../axios/apiService/signIn.apiService';
import gClasses from '../../../../scss/Typography.module.scss';

import { CONFIRM_PASSWORD_ID, CONFIRM_PASSWORD_LABEL, CONFIRM_PASSWORD_PLACEHOLDER, NEW_PASSWORD_ID, NEW_PASSWORD_LABEL, NEW_PASSWORD_PLACEHOLDER, SUBMIT_BUTTON, TITLE } from './newPassword.strings';
import { expiryTimer, validate } from '../../../../utils/UtilityFunctions';
import { getPostData, getValidationData } from './newPassword.selector';
import { INVITE_USER_STEPS } from '../inviteUser.constant';
import { ARIA_ROLES, BS, INPUT_TYPES } from '../../../../utils/UIConstants';
import { newPasswordDetailsValidateSchema } from './newPassword.validation.schema';
import ThemeContext from '../../../../hoc/ThemeContext';
import OnethingLogo from '../../../../assets/icons/OnethingLogo';
import OnethingLogoSmall from '../../../../assets/icons/OneThingLogoSmall';
import { ICON_STRINGS } from '../../SignIn.strings';
import styles from '../../../../components/auth_layout/AuthLayout.module.scss';

function NewPassword(props) {
  const { username, history, signInState } = props;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setError] = useState({});
  const [currentPasswordIcon, setCurrentPasswordIcon] = useState(false);
  const [newPasswordIcon, setNewPasswordIcon] = useState(false);
  const [confirmPopperReference, setConfirmReferencePopper] = useState(null);
  const [passwordPopperReference, setPasswordPopperReference] = useState(null);
  const [isPassPopperOpen, setIsPassPopperOpen] = useState(false);
  const [isConfirmPopperOpen, setIsConfirmPopperOpen] = useState(false);
  const { colorScheme } = useContext(ThemeContext);

  const previewIconButton = () => {
    setCurrentPasswordIcon(!currentPasswordIcon);
  };
  const newPasswordPreview = () => {
    setNewPasswordIcon(!newPasswordIcon);
  };
  const onBlurHandler = (id) => {
    if (id === NEW_PASSWORD_ID) {
      setIsPassPopperOpen(false);
    } else if (id === CONFIRM_PASSWORD_ID) {
      setIsConfirmPopperOpen(false);
    }
  };

  const onFocusHandler = (id) => {
    if (id === NEW_PASSWORD_ID) {
      setIsPassPopperOpen(true);
    } else if (id === CONFIRM_PASSWORD_ID) {
      setIsConfirmPopperOpen(true);
    }
  };

  const onChangeHandler = (value, id) => {
    if (id === NEW_PASSWORD_ID) {
      if (value !== newPassword) setNewPassword(value);
    } else if (id === CONFIRM_PASSWORD_ID) {
      if (value !== confirmPassword) setConfirmPassword(value);
    }
    const clonedError = cloneDeep(errors) || {};
    unset(clonedError, id);
    setError(clonedError);
  };

  const onSubmitClicked = (event) => {
    event.preventDefault();
    const error = validate(getValidationData(newPassword, confirmPassword), newPasswordDetailsValidateSchema);
    if (!isEmpty(error)) setError(error);
    else {
      const { id } = props;
      const postData = getPostData(newPassword, confirmPassword, id);
      let cookieProps = {
        path: '/',
        domain: getDomainName(window.location.hostname),
      };
      const cookies = new Cookies();
      if (!cookies.get('whd_id', cookieProps)) {
        cookieProps = { ...cookieProps, expires: new Date(new Date().getTime() + 2147483647 * 1000) };
        cookies.set('whd_id', uuidv4(), cookieProps);
      }
      updateInviteUserApi(postData).then(({ response, headers }) => {
        expiryTimer(response?.sessionExpiryTime, response?.currentTime, history, true, true);
        const { setInviteUserStep } = props;
        setInviteUserStep(INVITE_USER_STEPS.UPDATE_PROFILE);
        localStorage.setItem('csrf_token', headers['csrf-token']);
      }, () => { });
    }
  };

  return (
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
      <div className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600, gClasses.FontWeight600)}>
        {TITLE}
      </div>
      <div
        className={cx(
          gClasses.FontWeight600,
          gClasses.FTwo16GrayV3,
          gClasses.MT20,
          gClasses.WordBreakBreakWord,
          BS.TEXT_CENTER,
        )}
      >
        {username}
      </div>
      <form className={gClasses.MT30}>
        <div ref={setPasswordPopperReference}>
          <Input
            id={NEW_PASSWORD_ID}
            label={NEW_PASSWORD_LABEL}
            placeholder={NEW_PASSWORD_PLACEHOLDER}
            value={newPassword}
            errorMessage={errors[NEW_PASSWORD_ID]}
            onChangeHandler={(event) => onChangeHandler(event.target.value, NEW_PASSWORD_ID)}
            inputVariant={INPUT_VARIANTS.TYPE_3}
            type={currentPasswordIcon ? null : INPUT_TYPES.PASSWORD}
            icon={newPassword && (
              <PasswordEyeOpen
                className={gClasses.CursorPointer}
                tabIndex={0}
                onClick={previewIconButton}
                onKeyPress={previewIconButton}
                role={ARIA_ROLES.SWITCH}
                onEyeClick={currentPasswordIcon}
              />
            )}
            onBlurHandler={() => onBlurHandler(NEW_PASSWORD_ID)}
            onFocusHandler={() => onFocusHandler(NEW_PASSWORD_ID)}
            autoFocus
          />
        </div>
        <PasswordHint ariaHidden="true" role={ARIA_ROLES.ALERT} referencePopperElement={passwordPopperReference} isPopperOpen={isPassPopperOpen} passwordValue={newPassword} errorMessage={errors[NEW_PASSWORD_ID] || null} />
        <div ref={setConfirmReferencePopper}>
          <Input
            id={CONFIRM_PASSWORD_ID}
            label={CONFIRM_PASSWORD_LABEL}
            placeholder={CONFIRM_PASSWORD_PLACEHOLDER}
            value={confirmPassword}
            errorMessage={errors[CONFIRM_PASSWORD_ID]}
            onChangeHandler={(event) => onChangeHandler(event.target.value, CONFIRM_PASSWORD_ID)}
            inputVariant={INPUT_VARIANTS.TYPE_3}
            type={newPasswordIcon ? null : INPUT_TYPES.PASSWORD}
            icon={confirmPassword && (
              <PasswordEyeOpen
                className={gClasses.CursorPointer}
                tabIndex={0}
                onClick={newPasswordPreview}
                onKeyPress={newPasswordPreview}
                role={ARIA_ROLES.SWITCH}
                onEyeClick={newPasswordIcon}
              />
            )}
            onBlurHandler={() => onBlurHandler(CONFIRM_PASSWORD_ID)}
            onFocusHandler={() => onFocusHandler(CONFIRM_PASSWORD_ID)}
          />
        </div>
        <PasswordHint ariaHidden="true" role={ARIA_ROLES.ALERT} referencePopperElement={confirmPopperReference} originalPasswordValue={newPassword} isPopperOpen={isConfirmPopperOpen} isConfirmPassword passwordValue={confirmPassword} errorMessage={errors[CONFIRM_PASSWORD_ID] || null} />
        <Alert content={errors.common_server_error} className={cx(gClasses.MT5, gClasses.MB15)} />
        <Button
          id={SUBMIT_BUTTON.ID}
          buttonType={BUTTON_TYPE.AUTH_PRIMARY}
          onClick={onSubmitClicked}
          className={gClasses.MT5}
          width100
          style={{
            backgroundColor: signInState?.isCustomTheme && colorScheme?.activeColor,
          }}
        >
          {SUBMIT_BUTTON.LABEL}
        </Button>
      </form>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    signInState: state.SignInReducer,
  };
};

export default withRouter(
  connect(mapStateToProps, null)(NewPassword),
);
