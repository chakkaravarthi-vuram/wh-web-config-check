/* eslint-disable import/extensions */
import React from 'react';
import { translateFunction } from 'utils/jsUtility';
import GoogleIcon from '../../assets/icons/GoogleIcon';
import MicrosoftIcon from '../../assets/icons/MicrosoftIcon';
import gClasses from '../../scss/Typography.module.scss';

// eslint-disable-next-line import/no-unresolved
import { translate } from '../../language/config';

export const ICON_STRINGS = {
  LOGO_SMALL: 'Workhall',
  GOOGLE_ICON: 'Google',
  MICROSOFT_ICON: 'Microsoft',
};

export const SIGN_IN_STRINGS = {
  TITLE: 'Sign In',
  AWESOME: 'Aweasome!',
  USERNAME: 'sign_in.pre_sign_in_form.user_name',
  ACCOUNT_CREATED: 'sign_in.pre_sign_in_form.account_created',
  SUB_TITLE: 'Its the onething that you need for all your software needs',
  SELECT_ACCOUNT_ERROR: 'Select an account to proceed',
  WELCOME_STRING: 'LET US MAKE THE WORLD MORE PRODUCTIVE, TOGETHER.',
  SWITCH_ACCOUNT: 'sign_in.pre_sign_in_form.switch_account',
  TRY_ANOTHER_ACCOUNT: 'sign_in.user_account_selection.try_another_account',
  CHOOSE_ACCOUNT: 'sign_in.user_account_selection.choose_account',
  WELCOME_BACK: 'sign_in.pre_sign_in_form.welcome_back',
  WELCOME: 'Welcome',
  DOMAIN_NAME: 'sign_in.pre_sign_in_form.domain_name_text',
  DOMAIN_NAME_SPA: 'sign_in.pre_sign_in_form.domain_name_text',
  GOOGLE_SIGNIN_INIT_ERROR: 'idpiframe_initialization_failed',
  PRE_SIGN_IN_STEP: 1,
  USER_ACCOUNT_SELECTION: 2,
  SIGN_IN_STEP: 3,
  MFA_SETUP_STEP: 4,
  MFA_OTP_VERFICATION_STEP: 5,
  MFA_ENFORCED_STEP: 6,
  PUBLIC_DMS_LINK: '/dms/display_to_all/?id=',
  DMS_LINK: '/dms/display/?id=',
  SOCKET_CONNECTION_ESTABLISHED: 'connection_established',
  GOOGLE_SIGNIN_ERROR: {
    TITLE: 'sign_in.pre_sign_in_form.google_sign_in_error',
    SUB_TITLE: 'please try after sometimes',
  },
  MICROSOFT_SIGNIN_ERROR: {
    TITLE: 'sign_in.pre_sign_in_form.microsoft_sign_in_error',
    SUB_TITLE: 'please try after sometimes',
  },
  INVALID_CREDENTIALS: {
    TITLE: translate('sign_in.server_errors.invalid_credentials'),
  },
  FORM_LABEL: {
    EMAIL: {
      ID: 'email',
      LABEL: 'sign_in.pre_sign_in_form.email_label',
      PLACEHOLDER: 'name@company.com',
      MESSAGE: 'Forgot your password?',
      TEST_ID: 'username-input',
      EMAIL_LABEL: 'sign_in.pre_sign_in_form.email',
    },
    GOOGLE_SIGNIN: {
      ID: 'google_signin',
      LABEL: (
        <div className={gClasses.CenterV}>
          <span style={{ marginRight: '10px' }}>
            <GoogleIcon title={ICON_STRINGS.GOOGLE_ICON} ariaHidden />
          </span>
          <span>
            {translate('sign_in.pre_sign_in_form.continue_with_google')}
          </span>
        </div>
      ),
    },
    MICROSOFT_SIGNIN: {
      ID: 'microsoft_signin',
      LABEL: (
        <div className={gClasses.CenterV}>
          <span style={{ marginRight: '10px' }}>
            <MicrosoftIcon title={ICON_STRINGS.MICROSOFT_ICON} ariaHidden />
          </span>
          <span>
            {translate('sign_in.pre_sign_in_form.continue_with_microsoft')}
          </span>
        </div>
      ),
    },
    GOOGLE_SIGNIN_2: {
      ID: 'google_signin',
      LABEL: (
        <div className={gClasses.CenterV}>
          <span style={{ marginRight: '10px' }}>
            <GoogleIcon title={ICON_STRINGS.GOOGLE_ICON} />
          </span>
          <span>Signin with Google</span>
        </div>
      ),
    },
    MICROSOFT_SIGNIN_2: {
      ID: 'microsoft_signin',
      LABEL: (
        <div className={gClasses.CenterV}>
          <span style={{ marginRight: '10px' }}>
            <MicrosoftIcon title={ICON_STRINGS.MICROSOFT_ICON} />
          </span>
          <span>Signin with Microsoft</span>
        </div>
      ),
    },
    USER_NAME: {
      ID: 'username',
      LABEL: 'sign_in.pre_sign_in_form.username',
      PLACEHOLDER: 'sign_in.pre_sign_in_form.username_placeholder',
      TEST_ID: 'user_name_id',
    },
    PASSWORD: {
      ID: 'password',
      LABEL: 'sign_in.sign_in_form.password',
      PLACEHOLDER: 'sign_in.sign_in_form.password_placeholder',
      TEST_ID: 'password-input',
    },
    FORGOT_PASSWORD: {
      LABEL: 'sign_in.sign_in_form.forget_password',
      ID: 'forgot_password ',
    },
    SIGN_IN_BUTTON: {
      LABEL: 'sign_in.sign_in_form.sign_in_button',
      ID: 'sign_in_button',
    },
    SIGN_UP_BUTTON: {
      LABEL: 'sign_in.pre_sign_in_form.sign_up_button',
      ID: 'sign_up_button',
    },
    PRE_SIGN_IN_BUTTON: {
      LABEL: 'sign_in.pre_sign_in_form.pre_sign_in_button_continue',
      ID: 'pre_sign_in_button',
    },
    SWITCH_ACCOUNT_BUTTON: {
      ID: 'switch_account',
    },
    SUB_DOMAIN: {
      ID: 'domain',
      LABEL: 'sign_in.pre_sign_in_form.sub_domain_label',
      PLACEHOLDER: 'Enter your workspace url',
    },
    DOMAIN_NAME: {
      PLACEHOLDER: 'sign_in.pre_sign_in_form.domain_name',
    },
    OR: {
      LABEL: 'sign_in.pre_sign_in_form.Or',
      ID: 'or',
    },
  },
  USER_NAME_EMAIL: {
    ID: 'username_or_email',
    LABEL: 'sign_in.pre_sign_in_form.username_or_email',
    PLACEHOLDER: 'sign_in.pre_sign_in_form.username_or_email',
    TEST_ID: 'user_name_email_id',
  },
  LOGIN_OPTIONS: {
    ID: 'is_email_signin',
    LABEL: 'sign_in.pre_sign_in_form.login_option_label',
    LOGIN_OPTIONS_LIST: [
      { label: 'sign_in.pre_sign_in_form.email', value: true },
      { label: 'sign_in.pre_sign_in_form.username', value: false },
    ],
  },
  EMAIL: 'email',
  SIGN_IN_TYPE: 'sign_in_type',
  HAS_BEEN_BLOCKED: 'has been blocked',
};

export const signInOptions = (t) => {
  return {
    LOGIN_OPTIONS: {
      ID: 'is_email_signin',
      LABEL: t('sign_in.pre_sign_in_form.login_option_label'),
      LOGIN_OPTIONS_LIST: [
        { label: t('sign_in.pre_sign_in_form.email'), value: true },
        { label: t('sign_in.pre_sign_in_form.username'), value: false },
      ],
    },
    GOOGLE_SIGNIN: {
      ID: 'google_signin',
      LABEL: (
        <div className={gClasses.CenterV}>
          <span style={{ marginRight: '10px' }}>
            <GoogleIcon title={ICON_STRINGS.GOOGLE_ICON} ariaHidden />
          </span>
          <span>{t('sign_in.pre_sign_in_form.continue_with_google')}</span>
        </div>
      ),
    },
    MICROSOFT_SIGNIN: {
      ID: 'microsoft_signin',
      LABEL: (
        <div className={gClasses.CenterV}>
          <span style={{ marginRight: '10px' }}>
            <MicrosoftIcon title={ICON_STRINGS.MICROSOFT_ICON} ariaHidden />
          </span>
          <span>{t('sign_in.pre_sign_in_form.continue_with_microsoft')}</span>
        </div>
      ),
    },
  };
};

export const FORGOT_PASSWORD_STRINGS = {
  TITLE: 'sign_in.forgot_password_strings.password_title',
  SUB_TITLE: 'Its the onething that you need for all your software needs',
  SWITCH_ACCOUNT: 'Don’t have an account?',
  TRY_ANOTHER_ACCOUNT: 'Try other account',
  PRE_SIGN_IN_STEP: 1,
  SIGN_IN_STEP: 2,
  LINK_SENT: 'sign_in.forgot_password_strings.link_sent',
  LINK_SENT_TO_MAIL:
    'sign_in.forgot_password_strings.link_sent_to_mail',
  ACCOUNT_ID: 'Account id',
  FORM_LABEL: {
    EMAIL: {
      ID: 'email',
      LABEL: 'sign_in.forgot_password_strings.email_label',
      PLACEHOLDER: 'name@company.com',
      MESSAGE: 'Forgot your password?',
      TEST_ID: 'email-input',
    },
    USER_NAME: {
      ID: 'username',
      LABEL: 'Username',
      PLACEHOLDER: 'Type username here...',
      TEST_ID: 'user_name_id',
    },
    PASSWORD: {
      ID: 'password',
      LABEL: 'Password',
      PLACEHOLDER: '8+ characters…',
      TEST_ID: 'password-input',
      FORGOT_PASSWORD: 'Forgot your password?',
    },
    SIGN_IN_BUTTON: {
      LABEL: 'sign_in.forgot_password_strings.forgot_sign_in_button',
      ID: 'sign_in_button',
    },
    LANGUAGE_DROPDOWN: {
      PLACEHOLDER: 'sign_in.language_dropdown.placeholder',
    },
    SIGN_UP_BUTTON: {
      LABEL: 'sign_in.forgot_password_strings.forgot_sign_up_button',
      ID: 'sign_up_button',
    },
    GENERATE_OTP_BUTTON: {
      LABEL: 'sign_in.forgot_password_strings.generate_otp_button',
      ID: 'generate_otp_forgot_password',
    },
  },
  RESET_EMAIL_SUCCESS: {
    TITLE: 'Can’t log in?',
    MESSAGE: 'We sent a recovery link to you at',
    LOGIN_BUTTON: 'Return to Log In',
    RESEND: 'Resend Recovery Link',
  },
};

export const SIGN_IN_LAYOUT = {
  XL: { size: 5, offset: 3 },
  LG: { size: 6, offset: 3 },
  XS: { size: 10 },
  MD: { size: 10 },
};

export const SIGN_IN_PASSWORD = 'Signin Password';

export const SIGN_IN_LABELS = (t = translateFunction) => {
  return {
    [SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID]: t(SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.LABEL),
    [SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID]: t(SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.LABEL),
    [SIGN_IN_STRINGS.USER_NAME_EMAIL.ID]: t(SIGN_IN_STRINGS.USER_NAME_EMAIL.LABEL),
    [SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID]: t(SIGN_IN_STRINGS.DOMAIN_NAME),
    [SIGN_IN_STRINGS.FORM_LABEL.EMAIL.ID]: t(SIGN_IN_STRINGS.FORM_LABEL.EMAIL.EMAIL_LABEL),
  };
};

export const FORGOT_PASSWORD_LABELS = (t = translateFunction) => {
  return {
  [FORGOT_PASSWORD_STRINGS.FORM_LABEL.EMAIL.ID]: t(FORGOT_PASSWORD_STRINGS.FORM_LABEL.EMAIL.LABEL),
  };
};
