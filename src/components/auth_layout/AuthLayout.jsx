import React, { useRef, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import EditConfirmPopover from 'components/popovers/edit_confirm_popover/EditConfirmPopover';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { useTranslation } from 'react-i18next';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { Toast } from '@workhall-pvt-lmt/wh-ui-library';
import { changeLanguage } from '../../language/config';
import FormStatusPopover from '../popovers/form_status_popover/FormStatusPopover';
import Button from '../form_components/button/Button';

import { AUTH_PAGE_TYPES, BUTTON_TYPE } from '../../utils/Constants';
import { ARIA_ROLES, BS, COLOR_CONSTANTS } from '../../utils/UIConstants';
import styles from './AuthLayout.module.scss';
import gClasses from '../../scss/Typography.module.scss';
import {
  FORGOT_PASSWORD_STRINGS,
} from '../../containers/sign_in/SignIn.strings';
import { LANGUAGE_OPTION_LIST, getNavBarDetails } from './AuthLayout.utils';
import ThemeContext from '../../hoc/ThemeContext';

function AuthLayout(props) {
  const {
    innerContainer,
    navBarType,
    history,
    innerContainerClasses,
    innerContainerStyle,
    alignmentClasses,
    status,
    state,
  } = props;
  const { colorScheme } = useContext(ThemeContext);

  const { i18n, t } = useTranslation();
  const popoverRef = useRef(null);

  const [selectedLanguage, setSelectedLanguage] = useState('es');

  useEffect(() => {
    if (state?.pref_locale) {
    setSelectedLanguage(state.pref_locale);
    }
  }, [state?.pref_locale]);
  console.log('colorScheme', colorScheme);

  const languageDropdownChange = (e) => {
    localStorage.setItem('application_language', e.target.value);
    setSelectedLanguage(e.target.value);
    i18n.changeLanguage(e.target.value);
    changeLanguage(e.target.value);
    // window.location.reload();
  };

  const navbarClasses = cx(
    styles.Header,
    BS.D_FLEX,
    BS.ALIGN_ITEM_CENTER,
    BS.JC_END,
  );
  let navBarElement;
  if (
    navBarType === AUTH_PAGE_TYPES.SIGN_UP ||
    navBarType === AUTH_PAGE_TYPES.SIGN_IN
  ) {
    const { navBarText, navBarButtonId, navBarButtonName, navBarButtonAction } =
      getNavBarDetails(navBarType, history);
    navBarElement = (
      <div
      className={navbarClasses}
      role={ARIA_ROLES.BANNER}
      >
        {/* {isDevEnv() && ( */}
          <div className={cx(gClasses.FOne13GrayV2, gClasses.MLA)}>
            {navBarText && (
            <span className={cx(styles.ExistingAcntText, gClasses.MR10)}>
              {t(navBarText)}
            </span>)
            }
            {navBarButtonName && (
            <Button
              id={navBarButtonId}
              buttonType={BUTTON_TYPE.OUTLINE_SECONDARY}
              className={cx(gClasses.ML20, styles.Button)}
              onClick={navBarButtonAction}
              ariaLabel={t(navBarButtonName)}
              style={state.isCustomTheme && colorScheme?.activeColor}
            >
              {t(navBarButtonName)}
            </Button>)
            }
          </div>
        {/* )} */}
        {/* Commenting partition style - styles.LanguageDropdown due to signup disable for this sprint */}
        <div className={gClasses.ML15}>
          <Dropdown
            id="dropdown_language_internationalization"
            optionList={state?.account_locale ? state?.account_locale : LANGUAGE_OPTION_LIST}
            label={LANGUAGE_OPTION_LIST[0].label}
            onChange={languageDropdownChange}
            selectedValue={selectedLanguage}
            customPlaceholderStyle={{ color: state.isCustomTheme && colorScheme?.activeColor }}
            placeholder={t(FORGOT_PASSWORD_STRINGS.FORM_LABEL.LANGUAGE_DROPDOWN.PLACEHOLDER)}
            setSelectedValue
            hideLabel
            isNewDropdown
            isBorderLess
            disableClass={gClasses.ML10}
            isCustomLogin
          />
        </div>
      </div>
    );
  } else if (navBarType === AUTH_PAGE_TYPES.FORGOT_PASSWORD) {
    const { navBarButtonAction1 } = getNavBarDetails(navBarType, history);
    navBarElement = (
      <div
      className={navbarClasses}
      role={ARIA_ROLES.BANNER}
      >
        <div className={cx(styles.NavList, gClasses.CenterV)}>
            <Button
              id={FORGOT_PASSWORD_STRINGS.FORM_LABEL.SIGN_IN_BUTTON.ID}
              buttonType={BUTTON_TYPE.OUTLINE_SECONDARY}
              buttonStyle={gClasses.AuthButtonSecondary}
              className={cx(
                gClasses.FTwo13BlueV2,
                styles.Button,
              )}
              style={{
                color: state?.isCustomTheme && colorScheme?.activeColor,
                border: state?.isCustomTheme && `1px solid ${colorScheme?.activeColor}`,
                ':hover': {
                  backgroundColor: state?.isCustomTheme && colorScheme?.activeColor,
                  color: COLOR_CONSTANTS.WHITE,
                },
              }}
              onClick={navBarButtonAction1}
              ariaLabel={t(FORGOT_PASSWORD_STRINGS.FORM_LABEL.SIGN_IN_BUTTON.LABEL)}
            >
              {t(FORGOT_PASSWORD_STRINGS.FORM_LABEL.SIGN_IN_BUTTON.LABEL)}
            </Button>
            {/* <Button
              id={FORGOT_PASSWORD_STRINGS.FORM_LABEL.SIGN_UP_BUTTON.ID}
              buttonType={BUTTON_TYPE.OUTLINE_SECONDARY}
              buttonStyle={gClasses.AuthButtonSecondary}
              className={cx(
                gClasses.FTwo13BlueV2,
                styles.Button,
              )}
              onClick={navBarButtonAction2}
              ariaLabel={t(FORGOT_PASSWORD_STRINGS.FORM_LABEL.SIGN_UP_BUTTON.LABEL)}
            >
              {t(FORGOT_PASSWORD_STRINGS.FORM_LABEL.SIGN_UP_BUTTON.LABEL)}
            </Button> */}
          {/* <Link
            to={ROUTE_CONSTANTS.SIGNIN}
            className={cx(
              gClasses.AuthButtonSecondary,
              gClasses.FTwo13BlueV2,
              gClasses.CursorPointer,
              gClasses.FontWeight600,
              gClasses.CenterV,
              gClasses.LetterSpacingV2,
              styles.Button,
            )}
            id={FORGOT_PASSWORD_STRINGS.FORM_LABEL.SIGN_IN_BUTTON.ID}
          >
            {FORGOT_PASSWORD_STRINGS.FORM_LABEL.SIGN_IN_BUTTON.LABEL}
          </Link> */}
          {/* {isDevEnv() && ( */}
            {/* <Link
              to={ROUTE_CONSTANTS.SIGNUP_CREATE}
              className={cx(
                gClasses.AuthButtonSecondary,
                gClasses.FTwo13BlueV2,
                gClasses.CursorPointer,
                gClasses.FontWeight600,
                gClasses.CenterV,
                gClasses.LetterSpacingV2,
                styles.Button,
              )}
              id={FORGOT_PASSWORD_STRINGS.FORM_LABEL.SIGN_UP_BUTTON.ID}
            >
              {FORGOT_PASSWORD_STRINGS.FORM_LABEL.SIGN_UP_BUTTON.LABEL}
            </Link> */}
          {/* )} */}
        </div>
      </div>
    );
  } else if (navBarType === AUTH_PAGE_TYPES.RESET_PASSWORD) {
    navBarElement = (
      <div />
    );
  } else if (navBarType === AUTH_PAGE_TYPES.MFA_OTP_VERIFICATION) {
    navBarElement = (
      <div />
    );
  }

  // const bottomTextElement = bottomText || (
  //   <div
  //     className={cx(
  //       styles.BottomText,
  //       gClasses.FTwo12White,
  //       gClasses.MT23,
  //       gClasses.MB20,
  //       BS.TEXT_CENTER,
  //       gClasses.PL30,
  //       gClasses.PR30,
  //     )}
  //   >
  //     {t(SIGN_UP_STRINGS.BOTTOM_TEXT)}
  //   </div>
  // );

  const _alignmentClasses = alignmentClasses || styles.Body;

  return (
    <div
      className={cx(
        styles.Container,
        BS.D_FLEX,
        gClasses.FlexDirectionColumn,
        gClasses.Height100Vh,
      )}
    >
      <Toast />
      {status.isVisible ? <FormStatusPopover popoverRef={popoverRef} /> : null}
      {status.isEditConfirmVisible ? <EditConfirmPopover history={history} /> : null}
      {navBarElement}
      <div
        className={cx(
          gClasses.Flex1,
          gClasses.OverflowYAuto,
          gClasses.ScrollBar,
          gClasses.ZIndex1,
          _alignmentClasses,
          gClasses.FlexDirectionColumn,
        )}
        role={ARIA_ROLES.MAIN}
      >
        <div
          className={cx(styles.InnerContainer, innerContainerClasses)}
          style={{ backgroundColor: state.isCustomTheme && colorScheme?.widgetBg, ...innerContainerStyle }}
        >
          {innerContainer}
        </div>
        {/* {bottomTextElement} */}
      </div>
      <div
        className={cx(
          BS.H100,
          BS.W100,
          gClasses.FlexDirectionColumn,
          BS.P_ABSOLUTE,
          styles.BackgroundContainer,
        )}
      >
        <div className={cx(gClasses.Flex1)} />
        <div
        style={{
            backgroundColor: state.isCustomTheme && colorScheme?.highlight,
          }}
        className={cx(styles.BottomGradientBG)}
        />
      </div>
    </div>
  );
}

AuthLayout.defaultProps = {
  innerContainer: null,
  navBarType: AUTH_PAGE_TYPES.SIGN_IN,
  bottomText: null,
  innerContainerClasses: null,
  alignmentClasses: null,
  innerContainerStyle: {},
  status: {},
  type: EMPTY_STRING,
  // navBar: null,
};

AuthLayout.propTypes = {
  innerContainer: PropTypes.element,
  navBarType: PropTypes.number,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  bottomText: PropTypes.element,
  innerContainerClasses: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  innerContainerStyle: PropTypes.objectOf(PropTypes.any),
  status: PropTypes.objectOf(PropTypes.any),
  alignmentClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  // navBar: PropTypes.element,
};

const mapStateToProps = (state) => {
  return {
    role: state.RoleReducer.role,
    state: state.SignInReducer,
  };
};

export default withRouter(
  connect(mapStateToProps, null)(AuthLayout),
);
