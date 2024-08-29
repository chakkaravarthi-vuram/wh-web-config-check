import React, { useState, useContext } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import styles from 'components/auth_layout/AuthLayout.module.scss';
import { evaluateAriaLabelMessage, evaluateFocusOnError, mergeObjects } from 'utils/UtilityFunctions';
import RadioGroup, { RADIO_GROUP_TYPE } from 'components/form_components/radio_group/RadioGroup';
import { ADDITIONAL_DETAILS_STRINGS } from 'containers/sign_up/additional_details/AdditionalDetails.strings';
import { store } from 'Store';
import { ACTION_STRINGS } from 'utils/strings/CommonStrings';
// import Cookies from 'universal-cookie';
import { getAllSearchParams } from 'utils/taskContentUtils';
import Input, { INPUT_VARIANTS } from '../../../components/form_components/input/Input';
import Button from '../../../components/form_components/button/Button';
import Alert from '../../../components/form_components/alert/Alert';
import { ICON_STRINGS, SIGN_IN_STRINGS, signInOptions } from '../SignIn.strings';

import { BUTTON_TYPE } from '../../../utils/Constants';

import gClasses from '../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS, INPUT_TYPES, COLOR_CONSTANTS } from '../../../utils/UIConstants';

import { GOOGLE_CONFIG } from '../signInUtils.constant';
import { getDomainName, getSubDomainName, isEmpty } from '../../../utils/jsUtility';
import { clearSessionDetails } from '../../../axios/apiService/clearSessionDetails.apiService';
import Tooltip from '../../../components/tooltip/Tooltip';
import { POPPER_PLACEMENTS } from '../../../components/auto_positioning_popper/AutoPositioningPopper';
import { isSatraGroup } from '../../../utils/UtilityFunctions';
import ThemeContext from '../../../hoc/ThemeContext';
import OnethingLogo from '../../../assets/icons/OnethingLogo';
import OnethingLogoSmall from '../../../assets/icons/OneThingLogoSmall';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function PreSignIn(props) {
  const {
    form_details,
    onChange,
    onNextClicked,
    errors,
    onMicrosoftSignInClickHandler,
    isSigninFromSubDomain,
    onLoginOptionSwitchHandler,
  } = props;
  const { acc_logo = EMPTY_STRING, isCustomTheme = false } = store.getState().SignInReducer;

  const { t } = useTranslation();
  const { colorScheme } = useContext(ThemeContext);

  const history = useHistory();
  const onGoogleClick = (event) => {
    event.preventDefault();
    const subDomainCheck = getSubDomainName(window.location.hostname);
    const searchParams = getAllSearchParams(
      new URLSearchParams(history.location.search),
    );
    clearSessionDetails()
      .then(() => {
        if (!isSatraGroup() && getSubDomainName(window.location.hostname)) {
          window.location = (!isEmpty(searchParams?.nextUrl)) ? `${window.location.protocol}//${getDomainName(window.location.host)}?nextUrl=${searchParams?.nextUrl}&google_domain=${subDomainCheck}` : `${window.location.protocol}//${getDomainName(window.location.host)}?google_domain=${subDomainCheck}`;
        } else {
          if (isEmpty(searchParams?.nextUrl)) {
            window.location = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CONFIG.clientId}&redirect_uri=${GOOGLE_CONFIG.redirectUri}&scope=${GOOGLE_CONFIG.scope}&prompt=select_account&response_type=${GOOGLE_CONFIG.responseType}`;
          } else {
            window.location = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CONFIG.clientId}&redirect_uri=${GOOGLE_CONFIG.redirectUri}&state=${JSON.stringify({ nextUrl: searchParams?.nextUrl })}&scope=${GOOGLE_CONFIG.scope}&prompt=select_account&response_type=${GOOGLE_CONFIG.responseType}`;
          }
        }
      });
  };
  const allFormFieldIds = [
    SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID,
    SIGN_IN_STRINGS.EMAIL,
    SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID,
    SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID,
  ];
  const [focusOnErrorFieldId, setFocusOnErrorFieldId] = useState(null);
  const [focusOnErrorRefresher, setFocusOnErrorRefresher] = useState(false);

  const handleSubmit = (event) => {
    onNextClicked(event, t);
    // if (errors[SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID]) setFocusOnErrorRefresher((refresher) => !refresher);
    setFocusOnErrorFieldId((previous_value) => {
      const { server_error, error_list } = store.getState().SignInReducer;
      const error = mergeObjects(error_list, server_error);
      const currentFocusableFieldId = evaluateFocusOnError(
        allFormFieldIds,
        error,
      );
      if (previous_value === currentFocusableFieldId) setFocusOnErrorRefresher((refresher) => !refresher);
      return currentFocusableFieldId;
    });
  };
  console.log('%^%^^^1', acc_logo, form_details.is_email_sign);
  return (
    <>
      <h1
        className={cx(
          gClasses.FTwo24GrayV3,
          BS.TEXT_CENTER,
          gClasses.FontWeight600,
          styles.SignInHeader,
        )}
      >
        {acc_logo ? (
          <div className={styles.Imageclass}>
          <img src={acc_logo} alt="" className={styles.AccountLogo} />
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
      <form className={gClasses.MT10}>
        {!isSigninFromSubDomain && (
          <div>
            <RadioGroup
              id={SIGN_IN_STRINGS.LOGIN_OPTIONS.ID}
              label={t(SIGN_IN_STRINGS.LOGIN_OPTIONS.LABEL)}
              optionList={signInOptions(t).LOGIN_OPTIONS.LOGIN_OPTIONS_LIST}
              onClick={(value) => {
                value !== null &&
                  onLoginOptionSwitchHandler(
                    SIGN_IN_STRINGS.LOGIN_OPTIONS.ID,
                    value,
                  );
              }}
              selectedValue={form_details.is_email_signin}
              type={RADIO_GROUP_TYPE.TYPE_6}
              innerClassName={gClasses.MT6}
            />
            <Input
              id={
                form_details.is_email_signin
                  ? SIGN_IN_STRINGS.EMAIL
                  : SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID
              }
              label={
                form_details.is_email_signin
                  ? t(SIGN_IN_STRINGS.FORM_LABEL.EMAIL.LABEL)
                  : t(SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.LABEL)
              }
              // labelMessage={SIGN_IN_STRINGS.FORM_LABEL.EMAIL.MESSAGE}
              placeholder={
                form_details.is_email_signin
                  ? SIGN_IN_STRINGS.FORM_LABEL.EMAIL.PLACEHOLDER
                  : t(SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.PLACEHOLDER)
              }
              value={
                form_details.is_email_signin
                  ? form_details.email
                  : form_details.username
              }
              errorMessage={
                errors[
                  form_details.is_email_signin
                    ? SIGN_IN_STRINGS.EMAIL
                    : SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID
                ]
              }
              onChangeHandler={onChange(
                form_details.is_email_signin
                  ? SIGN_IN_STRINGS.EMAIL
                  : SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID,
              )}
              inputVariant={INPUT_VARIANTS.TYPE_3}
              testId={SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.TEST_ID}
              required
              name={
                form_details.is_email_signin
                  ? SIGN_IN_STRINGS.EMAIL
                  : SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID
              }
              autoFocus
              onKeyDownHandler={(e) => {
                // on clicking enter key, it is same as clicking enter button
                if (e?.keyCode === 13) handleSubmit(e);
              }}
              focusOnError={
                focusOnErrorFieldId ===
                (form_details.is_email_signin
                  ? SIGN_IN_STRINGS.EMAIL
                  : SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID)
              }
              focusOnErrorRefresher={focusOnErrorRefresher}
              ariaLabelHelperMessage={evaluateAriaLabelMessage(
                errors[SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID],
              )}
              helperAriaHidden={
                errors[SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID] && true
              }
              type={SIGN_IN_STRINGS.EMAIL}
            />
            {!form_details.is_email_signin && (
              <div>
                <Input
                  id={SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID}
                  label={t(SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.LABEL)}
                  placeholder={t(
                    SIGN_IN_STRINGS.FORM_LABEL.DOMAIN_NAME.PLACEHOLDER,
                  )}
                  value={form_details.domain}
                  onChangeHandler={onChange(
                    SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID,
                  )}
                  readOnlySuffix={
                    ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.SUFFIX
                  }
                  readOnlyPrefix={
                    ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.PREFIX
                  }
                  readOnlySuffixClasses={styles.SuffixClass}
                  readOnlyPrefixAriaHidden="true"
                  readOnlySuffixAriaHidden="true"
                  errorMessage={
                    errors[SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID]
                  }
                  inputVariant={INPUT_VARIANTS.TYPE_3}
                  testId={SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID}
                  className={styles.InputDomainUrl}
                  inputContainerClasses={styles.InputDomainUrlInner}
                  innerClass={gClasses.PL25}
                  name={t(SIGN_IN_STRINGS.DOMAIN_NAME)}
                  hideBorder
                  ariaLabelForLabel
                  // autoFocus
                  onKeyDownHandler={(e) => {
                    // on clicking enter key, it is same as clicking enter button
                    if (e.keyCode === 13) handleSubmit(e);
                  }}
                  focusOnError={
                    focusOnErrorFieldId ===
                    SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID
                  }
                  focusOnErrorRefresher={focusOnErrorRefresher}
                  ariaLabelHelperMessage={evaluateAriaLabelMessage(
                    errors[SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID],
                  )}
                  helperAriaHidden={
                    errors[SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID] && true
                  }
                  isEnableInputTooltip
                />
              <Tooltip
              id={SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID}
              placement={POPPER_PLACEMENTS.TOP}
              isCustomToolTip
              outerClass={cx(gClasses.OpacityFull)}
              content={t(
                SIGN_IN_STRINGS.FORM_LABEL.DOMAIN_NAME.PLACEHOLDER,
              )}
              />
              </div>
            )}
          </div>
        )}
        {isSigninFromSubDomain && (
          <div>
            <Input
              id={SIGN_IN_STRINGS.USER_NAME_EMAIL.ID}
              label={t(SIGN_IN_STRINGS.USER_NAME_EMAIL.LABEL)}
              placeholder={t(SIGN_IN_STRINGS.USER_NAME_EMAIL.PLACEHOLDER)}
              value={form_details.username_or_email}
              errorMessage={errors[SIGN_IN_STRINGS.USER_NAME_EMAIL.ID]}
              onChangeHandler={onChange(SIGN_IN_STRINGS.USER_NAME_EMAIL.ID)}
              inputVariant={INPUT_VARIANTS.TYPE_3}
              testId={SIGN_IN_STRINGS.USER_NAME_EMAIL.TEST_ID}
              required
              name={SIGN_IN_STRINGS.USER_NAME_EMAIL.ID}
              autoComplete={ACTION_STRINGS.ON}
              onKeyDownHandler={(e) => {
                // on clicking enter key, it is same as clicking enter button
                if (e.keyCode === 13) handleSubmit(e);
              }}
              autoFocus
              focusOnError={
                focusOnErrorFieldId === SIGN_IN_STRINGS.USER_NAME_EMAIL.ID
              }
              focusOnErrorRefresher={focusOnErrorRefresher}
              ariaLabelHelperMessage={evaluateAriaLabelMessage(
                errors[SIGN_IN_STRINGS.USER_NAME_EMAIL.ID],
              )}
              helperAriaHidden={
                errors[SIGN_IN_STRINGS.USER_NAME_EMAIL.ID] && true
              }
            />
          </div>
        )}
        <div className={styles.HideUsername}>
          <Input
            id={SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID}
            // placeholder={t(SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.PLACEHOLDER)}
            value={form_details.password}
            name={SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID}
            type={INPUT_TYPES.PASSWORD}
          />
        </div>
        <Alert
          role={ARIA_ROLES.ALERT}
          content={form_details.common_server_error}
          className={cx(gClasses.MT5, gClasses.MB15)}
        />
        <Button
          id={SIGN_IN_STRINGS.FORM_LABEL.PRE_SIGN_IN_BUTTON.ID}
          buttonType={BUTTON_TYPE.AUTH_PRIMARY}
          onClick={handleSubmit}
          className={gClasses.MT5}
          width100
          style={{
            backgroundColor: isCustomTheme && colorScheme?.activeColor,
          }}
        >
          {t(SIGN_IN_STRINGS.FORM_LABEL.PRE_SIGN_IN_BUTTON.LABEL)}
        </Button>
        <div
          className={cx(
            BS.D_FLEX_JUSTIFY_CENTER,
            gClasses.MT20,
            gClasses.MB20,
            gClasses.FOne13GrayV5,
          )}
        >
          {t(SIGN_IN_STRINGS.FORM_LABEL.OR.LABEL)}
        </div>
        <div className={styles.ContinueButtonContainer}>
          <Button
            id={SIGN_IN_STRINGS.FORM_LABEL.GOOGLE_SIGNIN.ID}
            buttonType={BUTTON_TYPE.OUTLINE_SECONDARY}
            onClick={onGoogleClick}
            className={cx(
              styles.SignInButton,
              gClasses.PR16,
              gClasses.PL17,
              gClasses.CenterVH,
            )}
            width100
            style={{
              color: isCustomTheme && colorScheme?.activeColor,
              border: isCustomTheme && `1px solid ${colorScheme?.activeColor}`,
              backgroundColor: isCustomTheme && colorScheme?.widgetBg,
              ':hover': {
                backgroundColor: isCustomTheme && colorScheme?.activeColor,
                color: COLOR_CONSTANTS.WHITE,
              },
            }}
          >
            {signInOptions(t).GOOGLE_SIGNIN.LABEL}
          </Button>
        </div>
        <div className={styles.ContinueButtonContainer}>
          <Button
            id={SIGN_IN_STRINGS.FORM_LABEL.MICROSOFT_SIGNIN.ID}
            buttonType={BUTTON_TYPE.OUTLINE_SECONDARY}
            onClick={onMicrosoftSignInClickHandler}
            className={cx(
              styles.SignInButton,
              gClasses.PR16,
              gClasses.PL17,
              gClasses.CenterVH,
            )}
            width100
            style={{
              color: isCustomTheme && colorScheme?.activeColor,
              border: isCustomTheme && `1px solid ${colorScheme?.activeColor}`,
              backgroundColor: isCustomTheme && colorScheme?.widgetBg,
              ':hover': {
                backgroundColor: isCustomTheme && colorScheme?.activeColor,
                color: COLOR_CONSTANTS.WHITE,
              },
            }}
          >
            {signInOptions(t).MICROSOFT_SIGNIN.LABEL}
          </Button>
        </div>
      </form>
    </>
  );
}
PreSignIn.defaultProps = {
  errors: {},
  form_details: {},
};
PreSignIn.propTypes = {
  errors: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func.isRequired,
  onNextClicked: PropTypes.func.isRequired,
  form_details: PropTypes.objectOf(PropTypes.any),
  onSuccessGoogleSignin: PropTypes.func.isRequired,
  onFailureGoogleSignin: PropTypes.func.isRequired,
  onMicrosoftSignInClickHandler: PropTypes.func.isRequired,
};
export default PreSignIn;
