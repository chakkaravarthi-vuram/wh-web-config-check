import { getDomainName } from 'utils/jsUtility';
import { DROPDOWN_CONSTANTS } from 'utils/strings/CommonStrings';

export const ADDITIONAL_DETAILS_STRINGS = {
  TITLE: 'sign_up.additional_details.title',
  SUB_TITLE: 'sign_up.additional_details.work_email',
  FORM_LABEL: {
    ACCOUNT_NAME: {
      ID: 'account_name',
      LABEL: 'sign_up.additional_details.acc_name',
      PLACEHOLDER: 'sign_up.additional_details.acc_name_placeholder',
      TEST_ID: 'account_name_test_id',
    },
    ACCOUNT_DOMAIN: {
      ID: 'account_domain',
      LABEL: 'sign_up.additional_details.acc_domain',
      PLACEHOLDER: 'sign_up.additional_details.acc_domain_placeholder',
      SUFFIX: `.${getDomainName(window.location.hostname)}`,
      PREFIX: 'https://',
      TEST_ID: 'account_domain_test_id',
      ARIA_LABEL: 'Domain Name',
    },
    PASSWORD: {
      ID: 'password',
      LABEL: 'sign_up.additional_details.acc_password',
      PLACEHOLDER: 'sign_up.additional_details.acc_password_placeholder',
      TEST_ID: 'password_test_id',
    },
    SIGN_UP: {
      LABEL: 'sign_up.additional_details.sign_up_label',
      ID: 'account_sign_up',
    },
    TERMS_AND_CONDITION: {
      TEXT: 'sign_up.additional_details.terms_text',
      LINK_1: 'sign_up.additional_details.terms_of_service',
      LINK_2: 'sign_up.additional_details.privacy_policy',
      CONJUNCTION: 'sign_up.additional_details.conjunction',
      LINK1_ID: 'account_sign_up_tos',
      LINK2_ID: 'account_sign_up_pp',
    },
    FIRST_NAME: {
      ID: 'first_name',
      LABEL: 'sign_up.additional_details.fname',
      PLACEHOLDER: 'sign_up.additional_details.fname_placeholder',
      TEST_ID: 'first_name_id',
    },
    LAST_NAME: {
      ID: 'last_name',
      LABEL: 'sign_up.additional_details.lname',
      PLACEHOLDER: 'sign_up.additional_details.lname_placeholder',
      TEST_ID: 'last_name_id',
    },
    USER_NAME: {
      ID: 'username',
      LABEL: 'sign_up.additional_details.username',
      PLACEHOLDER: 'sign_up.additional_details.username_placeholder',
      TEST_ID: 'user_name_id',
    },
    YOUR_ROLE: {
      ID: 'role_in_company',
      LABEL: 'sign_up.additional_details.your_role',
      PLACEHOLDER: 'sign_up.additional_details.your_role_placeholder',
      TEST_ID: 'your_role_in_company',
      OPTIONS: (t) => [
        {
          [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.business_owner'),
          [DROPDOWN_CONSTANTS.VALUE]: 'Business Owner',
        },
        {
          [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.it_executive'),
          [DROPDOWN_CONSTANTS.VALUE]: 'IT Executive/Manager',
        },
        {
          [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.executive'),
          [DROPDOWN_CONSTANTS.VALUE]: 'Executive/Manager',
        },
        {
          [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.tech_consultant'),
          [DROPDOWN_CONSTANTS.VALUE]: 'Technology Consultant',
        },
        {
          [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.engineer_researcher'),
          [DROPDOWN_CONSTANTS.VALUE]: 'Engineer/Researcher',
        },
        {
          [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.soft_dev'),
          [DROPDOWN_CONSTANTS.VALUE]: 'Software Developer',
        },
        {
          [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.sys_admin'),
          [DROPDOWN_CONSTANTS.VALUE]: 'System Administrator',
        },
        {
          [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.others'),
          [DROPDOWN_CONSTANTS.VALUE]: 'Others',
        },
      ],
    },
  },
  ADDITIONAL_DETAILS_FORM: 'additional-details-form',
  FULL_PAGE_LOADER: 'full-page-loader',
  ACCOUNT_DETAILS: 'sign_up.additional_details.acc_details',
  ACCOUNT_ADMIN_DETAILS: 'sign_up.additional_details.acc_admin_details',
  CUSTOM_WORKHALL_URL: 'sign_up.additional_details.custom_workhall_url',
  CHANGE_EMAIL: 'sign_up.additional_details.change_email',
  PASSWORD_HELP: 'sign_up.additional_details.password_help',
  TRIAL_ID: 'trial_id',
  TRIAL_ID_HARD_CODED: '6239a03b71fc2e53980d79ab',
  EMAIL: 'email',
  PASSWORD_IS_REQUIRED: 'sign_up.additional_details.password_is_required',
};

export const yourRoleDropdown = (t) => {
  return {
    OPTIONS: [
      {
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.business_owner'),
        [DROPDOWN_CONSTANTS.VALUE]: 'Business Owner',
      },
      {
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.it_executive'),
        [DROPDOWN_CONSTANTS.VALUE]: 'IT Executive/Manager',
      },
      {
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.executive'),
        [DROPDOWN_CONSTANTS.VALUE]: 'Executive/Manager',
      },
      {
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.tech_consultant'),
        [DROPDOWN_CONSTANTS.VALUE]: 'Technology Consultant',
      },
      {
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.engineer_researcher'),
        [DROPDOWN_CONSTANTS.VALUE]: 'Engineer/Researcher',
      },
      {
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.soft_dev'),
        [DROPDOWN_CONSTANTS.VALUE]: 'Software Developer',
      },
      {
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.sys_admin'),
        [DROPDOWN_CONSTANTS.VALUE]: 'System Administrator',
      },
      {
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('sign_up.additional_details.options.others'),
        [DROPDOWN_CONSTANTS.VALUE]: 'Others',
      },
    ],
  };
};

export const UUID_STRING = '_id';
