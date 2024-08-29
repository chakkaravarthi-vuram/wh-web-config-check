import React from 'react';
import UpDownArrowIcon from 'assets/icons/UpDownArrowIcon';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';

const ADMIN_ACCOUNT_STRINGS = {
  ALL_STATUS: 'super_admin.accounts.all_status',
  ALL_STATUS_PLACEHOLDER: 'super_admin.accounts.all_status_placeholder',
  SEARCH_NAME_PLACEHOLDER: 'super_admin.accounts.search_name_placeholder',
  ACTIVE: 'super_admin.accounts.active',
  DE_ACTIVE: 'super_admin.accounts.de_active',
  SUBTITLE: 'super_admin.accounts.subtitle',
  ADD_ACCOUNT: 'super_admin.accounts.add_account',
  ROW_PER_PAGE: 'super_admin.accounts.row_per_page',
  ADD_TITLE: 'super_admin.accounts.add_title',
  EDIT_TITLE: 'super_admin.accounts.edit_title',
  ADD_SUBTITLE: 'super_admin.accounts.add_subtitle',
  EDIT_SUBTITLE: 'super_admin.accounts.edit_subtitle',
  ACCOUNT_DETAIL_TITLE: 'super_admin.accounts.account_detail_title',
  ADMIN_DETAIL_TITLE: 'super_admin.accounts.admin_detail_title',
  LANGUAGE_DETAIL_TITLE: 'super_admin.accounts.language_detail_title',
  WORKHALLIC_DETAIL_TITLE: 'super_admin.accounts.workhallic_detail_title',
  ACCOUNT_NAME_LABEL: 'super_admin.accounts.account_name_label',
  ACCOUNT_NAME_LABEL_ID: 'account_name',
  ACCOUNT_DOMAIN_LABEL: 'super_admin.accounts.account_domain_label',
  ACCOUNT_DOMAIN_LABEL_ID: 'account_domain',
  ACCOUNT_FIRST_NAME_LABEL: 'super_admin.accounts.account_first_name_label',
  ACCOUNT_FIRST_NAME_LABEL_ID: 'account_first_name',
  ACCOUNT_LAST_NAME_LABEL: 'super_admin.accounts.account_last_name_label',
  ACCOUNT_LAST_NAME_LABEL_ID: 'account_last_name',
  ACCOUNT_USERNAME_LABEL: 'super_admin.accounts.account_username_label',
  ACCOUNT_USERNAME_LABEL_ID: 'account_username',
  ACCOUNT_EMAIL_LABEL: 'super_admin.accounts.account_email_label',
  ACCOUNT_EMAIL_LABEL_ID: 'account_email',
  ACCOUNT_MANAGER_LABEL: 'super_admin.accounts.account_manager_label',
  ACCOUNT_MANAGER_ID: 'account_manager',
  ACCOUNT_SOLUTION_CONSULTANT_LABEL: 'super_admin.accounts.account_solution_consultant_label',
  ACCOUNT_SOLUTION_CONSULTANT_ID: 'solution_consultant',
  ACCOUNT_INDUSTRY_TYPE_LABEL: 'super_admin.accounts.account_industry_type_label',
  ACCOUNT_INDUSTRY_TYPE_ID: 'account_industry',
  ACCOUNT_COUNTRY_LABEL: 'super_admin.accounts.account_country_label',
  ACCOUNT_COUNTRY_ID: 'account_country',
  ACCOUNT_LANGUAGE_LABEL: 'super_admin.accounts.account_language_label',
  ACCOUNT_LANGUAGE_ID: 'account_language',
  ACCOUNT_LOCALE_LABEL: 'super_admin.accounts.account_locale_label',
  ACCOUNT_LOCALE_ID: 'account_locale',
  ACCOUNT_TIMEZONE_LABEL: 'super_admin.accounts.account_timezone_label',
  ACCOUNT_TIMEZONE_ID: 'account_timezone',
  ACCOUNT_ACC_LOGO_LABEL: 'super_admin.accounts.account_acc_logo_label',
  ACCOUNT_ACC_LOGO_ID: 'acc_logo',
  UPDATE_FAILURE: {},
  PAID: 'super_admin.accounts.paid',
  NOT_PAID: 'super_admin.accounts.not_paid',
  TRIAL: 'trial',
  TRIAL_LABEL: 'super_admin.accounts.trial_label',
  SUBSCRIPTION: 'subscription',
  SUBSCRIPTION_LABEL: 'super_admin.accounts.subscription_label',
  CANCEL_BUTTON: 'super_admin.accounts.form_buttons.cancel',
  SUBMIT_BUTTON: 'super_admin.accounts.form_buttons.submit',
  EDIT_BUTTON: 'super_admin.accounts.form_buttons.edit',
  ACC_TYPE: 'super_admin.accounts.filters.acc_type',
  ACC_STATUS: 'super_admin.accounts.filters.acc_status',
  PAYMENT_STATUS: 'super_admin.accounts.filters.payment_status',
  BACK_TO_ACCOUNTS: 'super_admin.accounts.back_to_accounts',
  ACCOUNT_MANAGER: 'super_admin.accounts.account_manager',
  SOLUTION_CONSULTANT: 'super_admin.accounts.solution_consultant',
  EMAIL: 'super_admin.accounts.email',
  ROLE_IN_A_COMPANY: 'super_admin.accounts.role_in_a_company',
  INDUSTRY_TYPE: 'super_admin.accounts.industry_type',
  LOCALE: 'super_admin.accounts.locale',
  LANGUAGE: 'super_admin.accounts.language',
  COUNTRY: 'super_admin.accounts.country',
  TIME_ZONE: 'super_admin.accounts.time_zone',
  COPILOT_CONFIGURATION_TITLE: 'super_admin.copilot_configuration.copilot_configuration_title',
  ENABLE_COPILOT_FEATURE: 'super_admin.copilot_configuration.enable_copilot_feature',
  COPILOT_ENABLED: 'super_admin.copilot_configuration.copilot_feature_enabled',
  COPILOT_DISABLED: 'super_admin.copilot_configuration.copilot_feature_disabled',
};

export const headers = [
  {
    displayKey: 'super_admin.accounts.headers.type',
    apiId: 'acc_type',
    order: -1,
    isSort: false,
  },
  {
    displayKey: 'super_admin.accounts.headers.name',
    apiId: 'account_name',
    order: -1,
    isSort: true,
  },
  {
    displayKey: 'super_admin.accounts.headers.domain',
    apiId: 'account_domain',
    order: -1,
    isSort: true,
  },
  {
    displayKey: 'super_admin.accounts.headers.active_users',
    apiId: 'user_count',
    order: -1,
    isSort: true,
  },
  {
    displayKey: 'super_admin.accounts.headers.status',
    apiId: 'is_active',
    order: -1,
    isSort: false,
  },
  {
    displayKey: 'super_admin.accounts.headers.created_on',
    apiId: 'created_on',
    order: -1,
    isSort: true,
  },
  {
    displayKey: 'super_admin.accounts.headers.payment_status',
    apiId: 'is_paid',
    order: -1,
    isSort: false,
  },
  {
    displayKey: 'super_admin.accounts.headers.account_manager',
    apiId: 'account_manager',
    order: -1,
    isSort: true,
  },
  {
    displayKey: 'super_admin.accounts.headers.country',
    apiId: 'country',
    order: -1,
    isSort: true,
  },
];
export const getAccountType = (type, t) => {
  if (!type) return 'NA';
  if (type === ADMIN_ACCOUNT_STRINGS.TRIAL) {
    return t && t(ADMIN_ACCOUNT_STRINGS.TRIAL_LABEL);
  } else {
    return t && t(ADMIN_ACCOUNT_STRINGS.SUBSCRIPTION_LABEL);
  }
};

export const getPaymentStatus = (isPaid, type, t) => {
  if (isPaid) {
    return t && t(ADMIN_ACCOUNT_STRINGS.PAID);
  } else if (type === ADMIN_ACCOUNT_STRINGS.SUBSCRIPTION) {
    return t && t(ADMIN_ACCOUNT_STRINGS.NOT_PAID);
  } else {
    return 'NA';
  }
};

export const getTableDataTemplate = (data) => (
  <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, data.className)}>
    <div className={cx(gClasses.Ellipsis)} title={data.value}>
      {data.value}
    </div>
  </div>
);

export const getTableHeaders = (accountTableHeaders, onClickUpDownArrow, t) =>
  accountTableHeaders.map((headerData) => {
    const { displayKey, apiId, order, isSort } = headerData;

    const upDownArrowIcon = (
      <div className={cx(gClasses.MT3, gClasses.ML5, BS.D_FLEX)}>
        <UpDownArrowIcon
          className={cx(gClasses.CursorPointer)}
          onClick={() => onClickUpDownArrow(apiId, order)}
        />
      </div>
    );

    const divContainer = (
      <div
        className={cx(isSort && gClasses.CursorPointer, BS.D_FLEX)}
        onClick={() => isSort && onClickUpDownArrow(apiId, order)}
        onKeyPress={() => isSort && onClickUpDownArrow(apiId, order)}
        role="link"
        tabIndex="0"
      >
        {t && t(displayKey)}
        {isSort && upDownArrowIcon}
      </div>
    );

    return [divContainer];
  });

export const ROW_COUNT_DROPDOWN = [
  {
    label: 5,
    value: 5,
  },
  {
    label: 10,
    value: 10,
  },
  {
    label: 25,
    value: 25,
  },
];

export const getNoValuesTable = (t) => [
  [t && t('super_admin.accounts.no_values_found'), '', '', '', '', '', '', '', '', ''],
];

export const getFilterPaymentStatusOptionList = (t) => [
  {
    label: t && t('super_admin.accounts.paid_label'),
    value: 1,
  },
  {
    label: t && t('super_admin.accounts.not_paid'),
    value: 0,
  },
];

export const getFilterAccountTypeOptionList = (t) => [
  {
    label: t && t('super_admin.accounts.trial_label'),
    value: 'trial',
  },
  {
    label: t && t('super_admin.accounts.subscription_label'),
    value: 'subscription',
  },
];

export const getFilterAccountStatusOptionList = (t) => [
  {
    label: t && t('super_admin.accounts.active_label'),
    value: 1,
  },
  {
    label: t && t('super_admin.accounts.inactive_label'),
    value: 0,
  },
];

export const filterInitialState = {
  type: null,
  is_active: null,
  is_paid: null,
};

export const filterIdArray = ['type', 'is_active', 'is_paid'];

export const COPILOT_CONFIGURATION = {
  ENABLE_COPILOT_FEATURE_ID: 'is_copilot_enabled',
  ENABLE_COPILOT_FEATURE: [{ label: 'Enable', value: 1 }],
};

export default ADMIN_ACCOUNT_STRINGS;
