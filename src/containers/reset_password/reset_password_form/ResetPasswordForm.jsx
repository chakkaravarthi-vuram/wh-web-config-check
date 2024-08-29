import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import styles from 'components/auth_layout/AuthLayout.module.scss';
// import PasswordEye from 'assets/icons/PasswordEye';
import PasswordEyeOpen from 'assets/icons/PasswordEyeNew';
import PasswordHint from 'components/password_hint/PasswordHint';
import { evaluateAriaLabelMessage, evaluateFocusOnError } from 'utils/UtilityFunctions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Input, { INPUT_VARIANTS } from '../../../components/form_components/input/Input';
import Button from '../../../components/form_components/button/Button';
import Alert from '../../../components/form_components/alert/Alert';

import { ICON_STRINGS, RESET_PASSWORD_STRINGS } from '../ResetPassword.strings';

import { BUTTON_TYPE } from '../../../utils/Constants';
import { ARIA_ROLES, BS, INPUT_TYPES } from '../../../utils/UIConstants';

import gClasses from '../../../scss/Typography.module.scss';
import ThemeContext from '../../../hoc/ThemeContext';
import OnethingLogo from '../../../assets/icons/OnethingLogo';
import OnethingLogoSmall from '../../../assets/icons/OneThingLogoSmall';

function ResetPasswordForm(props) {
  const { errors, formDetails, onChange, onResetPasswordClicked, username, signInState } = props;
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
    if (id === RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID) {
      setIsPassPopperOpen(false);
    } else if (id === RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID) {
      setIsConfirmPopperOpen(false);
    }
  };

  const onFocusHandler = (id) => {
    if (id === RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID) {
      setIsPassPopperOpen(true);
    } else if (id === RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID) {
      setIsConfirmPopperOpen(true);
    }
  };

  const allFormFieldIds = [
    RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID,
    RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID,
  ];
  const [focusOnErrorFieldId, setFocusOnErrorFieldId] = useState(null);
  const [focusOnErrorRefresher, setFocusOnErrorRefresher] = useState(false);

  const handleSubmit = (event) => {
      onResetPasswordClicked(event, (errors) => {
        setFocusOnErrorFieldId((previous_value) => {
          const currentFocusableFieldId = evaluateFocusOnError(allFormFieldIds, errors);
          if (previous_value === currentFocusableFieldId) setFocusOnErrorRefresher((refresher) => !refresher);
          return currentFocusableFieldId;
        });
      });
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
      <h1 className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600)}>
        {RESET_PASSWORD_STRINGS.TITLE}
      </h1>
      <div className={cx(gClasses.FontWeight600, gClasses.FTwo14GrayV3, gClasses.MT20)}>
        {RESET_PASSWORD_STRINGS.SUB_TITLE}
      </div>
      <form className={gClasses.MT10}>
      <div className={styles.HideUsername}>
          <Input
            id={RESET_PASSWORD_STRINGS.FORM_LABEL.USER_NAME.ID}
            placeholder={RESET_PASSWORD_STRINGS.FORM_LABEL.USER_NAME.LABEL}
            value={username}
            name={RESET_PASSWORD_STRINGS.FORM_LABEL.USER_NAME.ID}
          />
      </div>
        <div ref={setPasswordPopperReference}>
        <Input
          id={RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID}
          label={RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.LABEL}
          placeholder={RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.PLACEHOLDER}
          value={formDetails.new_password}
          errorMessage={errors[RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID]}
          onChangeHandler={onChange(RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID)}
          inputVariant={INPUT_VARIANTS.TYPE_3}
          name={RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID}
          type={currentPasswordIcon ? null : INPUT_TYPES.PASSWORD}
          icon={formDetails.new_password && (
              <PasswordEyeOpen
              // onMouseDown={previewIconButton} // changing passwordEye to a button functionality
              // onMouseUp={previewIconButton}
              className={gClasses.CursorPointer}
              // onMouseLeave={onMouseLeaveHandler}
              tabIndex={0}
              onClick={previewIconButton}
              onKeyPress={previewIconButton}
              role={ARIA_ROLES.SWITCH}
              onEyeClick={currentPasswordIcon}
              />
            )}
          onBlurHandler={() => onBlurHandler(RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID)}
          onFocusHandler={() => onFocusHandler(RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID)}
          autoFocus
          autoComplete="new-password"
          onKeyDownHandler={(e) => { // on clicking enter key, it is same as clicking enter button
            if (e.keyCode === 13) handleSubmit(e);
          }}
          focusOnError={focusOnErrorFieldId === RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID}
          focusOnErrorRefresher={focusOnErrorRefresher}
          helperAriaHidden={focusOnErrorFieldId === RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID && true}
          ariaLabelHelperMessage={evaluateAriaLabelMessage(errors[RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID])}
          isHideTitle
        />
        </div>
        <PasswordHint ariaHidden="true" role={ARIA_ROLES.ALERT} referencePopperElement={passwordPopperReference} isPopperOpen={isPassPopperOpen} passwordValue={formDetails.new_password} errorMessage={errors[RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID] || null} />
        <div ref={setConfirmReferencePopper}>
        <Input
          id={RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID}
          label={RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.LABEL}
          placeholder={RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.PLACEHOLDER}
          value={formDetails.confirm_password}
          errorMessage={errors[RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID]}
          onChangeHandler={onChange(RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID)}
          inputVariant={INPUT_VARIANTS.TYPE_3}
          type={newPasswordIcon ? null : INPUT_TYPES.PASSWORD}
          autoComplete="new-password"
          icon={formDetails.confirm_password && (
              <PasswordEyeOpen
              // onMouseDown={previewIconButton} // changing passwordEye to a button functionality
              // onMouseUp={previewIconButton}
              className={gClasses.CursorPointer}
              // onMouseLeave={onMouseLeaveHandler}
              tabIndex={0}
              onClick={newPasswordPreview}
              onKeyPress={newPasswordPreview}
              role={ARIA_ROLES.SWITCH}
              onEyeClick={newPasswordIcon}
              />
            )}
          onBlurHandler={() => onBlurHandler(RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID)}
          onFocusHandler={() => onFocusHandler(RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID)}
          onKeyDownHandler={(e) => { // on clicking enter key, it is same as clicking enter button
            if (e.keyCode === 13) handleSubmit(e);
          }}
          focusOnError={focusOnErrorFieldId === RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID}
          focusOnErrorRefresher={focusOnErrorRefresher}
          helperAriaHidden={focusOnErrorFieldId === RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID && true}
          ariaLabelHelperMessage={evaluateAriaLabelMessage(errors[RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID])}
          isHideTitle
        />
        </div>
        <PasswordHint ariaHidden="true" role={ARIA_ROLES.ALERT} referencePopperElement={confirmPopperReference} originalPasswordValue={formDetails.new_password} isPopperOpen={isConfirmPopperOpen} isConfirmPassword passwordValue={formDetails.confirm_password} errorMessage={errors[RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID] || null} />
        <Alert role={ARIA_ROLES.ALERT} content={formDetails.common_server_error} className={cx(gClasses.MT5, gClasses.MB15)} />
        <Button
          id="reset_password_button"
          buttonType={BUTTON_TYPE.AUTH_PRIMARY}
          className={cx(gClasses.MT5)}
          onClick={handleSubmit}
          width100
          style={{
            backgroundColor: signInState?.isCustomTheme && colorScheme?.activeColor,
          }}
        >
          {RESET_PASSWORD_STRINGS.FORM_LABEL.RESET_BUTTON.LABEL}
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

ResetPasswordForm.defaultProps = {
  errors: [],
  formDetails: {},
};
ResetPasswordForm.propTypes = {
  errors: PropTypes.objectOf(PropTypes.any),
  formDetails: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func.isRequired,
  onResetPasswordClicked: PropTypes.func.isRequired,
};

export default withRouter(
  connect(mapStateToProps, null)(ResetPasswordForm),
);
