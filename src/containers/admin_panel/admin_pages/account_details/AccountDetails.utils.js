import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { cloneDeep, isEmpty } from 'utils/jsUtility';
import {
  ADMIN_ACCOUNTS_DATE,
  ADMIN_ACCOUNTS_USER_ACTIVITY_DATE,
  ADMIN_ACCOUNTS_USAGE_SUMMARY_DATE,
} from 'utils/strings/CommonStrings';
import styles from './AccountDetails.module.scss';
import { COPILOT_CONFIGURATION } from '../accounts/Accounts.strings';

const getBillingOwnersHeaders = (t) => [t && t('super_admin.account_details.billing_owners_headers.full_name'), t && t('super_admin.account_details.billing_owners_headers.type'), t && t('super_admin.account_details.billing_owners_headers.email')];
const getDiscountDetailsHeaders = (t) => [
  t && t('super_admin.account_details.discount_details_headers_object.discount_name'),
  t && t('super_admin.account_details.discount_details_headers_object.percentage_of_discount'),
  t && t('super_admin.account_details.discount_details_headers_object.total_months_to_redeem'),
  t && t('super_admin.account_details.discount_details_headers_object.remaining_months_to_redeem'),
  t && t('super_admin.account_details.discount_details_headers_object.activated_on'),
  t && t('super_admin.account_details.discount_details_headers_object.discount_status'),
  t && t('super_admin.account_details.discount_details_headers_object.de_activated_on'),
];
export const getUsageSummaryHeaders = (t) => [
  t && t('super_admin.account_details.usage_summary_headers_object.month_year'),
  t && t('super_admin.account_details.usage_summary_headers_object.flow'),
  t && t('super_admin.account_details.usage_summary_headers_object.data_list'),
  t && t('super_admin.account_details.usage_summary_headers_object.total_active_user'),
  t && t('super_admin.account_details.usage_summary_headers_object.added_this_month'),
  t && t('super_admin.account_details.usage_summary_headers_object.deleted_this_month'),
  t && t('super_admin.account_details.usage_summary_headers_object.billable_users_this_month'),
  t && t('super_admin.account_details.usage_summary_headers_object.billing_currency'),
  t && t('super_admin.account_details.usage_summary_headers_object.discount_amo'),
  t && t('super_admin.account_details.usage_summary_headers_object.tax_amo'),
  t && t('super_admin.account_details.usage_summary_headers_object.actual_amo'),
  t && t('super_admin.account_details.usage_summary_headers_object.final_amo'),
];

export const getAccountObject = (t) => {
 return {
  LANGUAGE_TIME: {
    TITLE: t && t('super_admin.account_details.account_object.language_time.title'),
    KEY_VALUES: [
      {
        label: t && t('super_admin.account_details.account_object.language_time.language_label'),
        value: 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.language_time.locale_label'),
        value: 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.language_time.country_label'),
        value: 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.language_time.timezone_label'),
        value: 'NA',
      },
    ],
  },
  BILLING_DETAILS: {
    TITLE: t && t('super_admin.account_details.account_object.billing_details.title'),
    KEY_VALUES: [
      {
        label: t && t('super_admin.account_details.account_object.billing_details.subscription_name_label'),
        value: 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.billing_details.subscribed_on_label'),
        value: 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.billing_details.billing_language_label'),
        value: 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.billing_details.billig_currency_label'),
        value: 'NA',
      },
    ],
    BILLING_OWNERS: {
      LABEL: t && t('super_admin.account_details.account_object.billing_details.billing_owners_label'),
      HEADERS: getBillingOwnersHeaders(t),
      DATA: [],
      HIDE_PAGINATION: false,
    },
  },
  DISCOUNT_DETAILS: {
    TITLE: t && t('super_admin.account_details.account_object.discount_details.title'),
    KEY_VALUES: [],
    DISCOUNT_DETAILS_TABLE: {
      HEADERS: getDiscountDetailsHeaders(t),
      DATA: [],
      HIDE_PAGINATION: false,
      HIDE_LABEL: true,
    },
  },
  COPILOT_CONFIGURATION: {
    TITLE: t && t('super_admin.copilot_configuration.copilot_configuration_title'),
    KEY_VALUES: [
      {
        label: t && t('super_admin.copilot_configuration.enable_copilot_feature'),
        value: 'NA',
      },
    ],
  },
  WORKHALLICS_DETAILS: {
    TITLE: t && t('super_admin.account_details.account_object.workhallics_details.title'),
    KEY_VALUES: [
      {
        label: t && t('super_admin.account_details.account_object.workhallics_details.account_manager_label'),
        value: 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.workhallics_details.soultion_consultant_label'),
        value: 'NA',
      },
    ],
  },
  USAGE_SUMMARY: {
    TITLE: t && t('super_admin.account_details.account_object.usage_summary.title'),
    KEY_VALUES: [
      {
        label: t && t('super_admin.account_details.account_object.usage_summary.last_user_activity_date_label'),
        value: 'NA',
      },
    ],
  },
  USAGE_SUMMARY_CURRENT_MONTH: {
    TITLE: t && t('super_admin.account_details.account_object.usage_summary_current_month.title'),
    SUB_TITLE: true,
    KEY_VALUES: [
      {
        label: t && t('super_admin.account_details.account_object.usage_summary_current_month.month_year_label'),
        value: 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.usage_summary_current_month.flow_label'),
        value: 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.usage_summary_current_month.datalist_label'),
        value: 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.usage_summary_current_month.total_active_user_label'),
        value: 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.usage_summary_current_month.added_this_month_label'),
        value: 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.usage_summary_current_month.deleted_this_month_label'),
        value: 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.usage_summary_current_month.billable_users_this_month_label'),
        value: 'NA',
      },
    ],
  },
};
};

const getTableDataTemplate = (data) => (
  <div className={cx(BS.D_FLEX)}>
    <div className={cx(gClasses.Ellipsis)} title={data}>
      {data}
    </div>
  </div>
);

export const customiseRawData = (rawData, getFormattedDateFromUTC, t) => {
  const accountObject = cloneDeep(getAccountObject(t));
  if (!rawData || isEmpty(rawData)) return accountObject;

  accountObject.LANGUAGE_TIME.KEY_VALUES = [
    {
      label: t && t('super_admin.account_details.account_object.language_time.language_label'),
      value: rawData.acc_language || 'NA',
    },
    {
      label: t && t('super_admin.account_details.account_object.language_time.locale_label'),
      value: rawData.acc_locale || 'NA',
    },
    {
      label: t && t('super_admin.account_details.account_object.language_time.country_label'),
      value: rawData.country || 'NA',
    },
    {
      label: t && t('super_admin.account_details.account_object.language_time.timezone_label'),
      value: rawData.acc_timezone || 'NA',
    },
  ];

  if (rawData.billing_details) {
    accountObject.BILLING_DETAILS.KEY_VALUES = [
      {
        label: t && t('super_admin.account_details.account_object.billing_details.subscription_name_label'),
        value:
          (rawData.billing_details.subscription_details &&
            rawData.billing_details.subscription_details.sub_name) ||
          'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.billing_details.subscribed_on_label'),
        value:
          (rawData.billing_details.subscription_details &&
            getFormattedDateFromUTC(
              rawData.billing_details.subscription_details.added_on,
              ADMIN_ACCOUNTS_DATE,
            )) ||
          'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.billing_details.billing_language_label'),
        value: rawData.billing_details.billing_language || 'NA',
      },
      {
        label: t && t('super_admin.account_details.account_object.billing_details.billing_currency_label'),
        value: rawData.billing_details.billing_currency || 'NA',
      },
    ];
    const tableRowData =
      rawData.billing_details.billing_owners &&
      rawData.billing_details.billing_owners.map((value) => {
        const fullName = getTableDataTemplate(
          `${value.first_name} ${value.last_name}`,
        );
        const type = getTableDataTemplate(
          value.is_primary_contact ? t && t('super_admin.account_details.primary') : t && t('super_admin.account_details.secondary'),
        );
        const email = getTableDataTemplate(value.email);
        return [fullName, type, email];
      });
    accountObject.BILLING_DETAILS.BILLING_OWNERS.DATA =
      isEmpty(tableRowData) && !tableRowData
        ? [[t && t('super_admin.accounts.no_values_found')]]
        : tableRowData;

    const discountTableRowData =
      rawData.billing_details.discount_details &&
      rawData.billing_details.discount_details.map((value) => {
        const discountName = getTableDataTemplate(value.discount_name);
        const discountPercent = getTableDataTemplate(
          value.percentage_of_discount,
        );
        const discountDuration = getTableDataTemplate(
          `${value.no_of_times_to_redeem}`,
        );
        const remainingDicountedInvoice = getTableDataTemplate(
          `${value.remaining_discounted_invoice}`,
        );
        const discountActivated = getTableDataTemplate(
          (value.activated_on &&
            getFormattedDateFromUTC(value.activated_on, ADMIN_ACCOUNTS_DATE)) ||
            'NA',
        );
        const discountStatus = getTableDataTemplate(
          value.is_active ? t && t('super_admin.accounts.active_label') : t && t('super_admin.accounts.inactive_label'),
        );
        const discountDeactivated = getTableDataTemplate(
          (value.deactivated_on &&
            getFormattedDateFromUTC(value.deactivated_on, ADMIN_ACCOUNTS_DATE)) ||
            'NA',
        );
        return [
          discountName,
          discountPercent,
          discountDuration,
          remainingDicountedInvoice,
          discountActivated,
          discountStatus,
          discountDeactivated,
        ];
      });
    accountObject.DISCOUNT_DETAILS.DISCOUNT_DETAILS_TABLE.DATA =
      isEmpty(discountTableRowData) && !tableRowData
        ? [[t && t('super_admin.accounts.no_values_found')]]
        : discountTableRowData;
  }
  if (rawData.last_user_activity) {
    accountObject.USAGE_SUMMARY.KEY_VALUES = [
      {
        label: t && t('super_admin.account_details.account_object.usage_summary.last_user_activity_date_label'),
        value:
          getFormattedDateFromUTC(
            rawData.last_user_activity,
            ADMIN_ACCOUNTS_USER_ACTIVITY_DATE,
          ) || 'NA',
      },
    ];
  }
  accountObject.COPILOT_CONFIGURATION.KEY_VALUES = [
    {
      label: t && t('super_admin.copilot_configuration.enable_copilot_feature'),
      value: rawData?.is_copilot_enabled,
      id: COPILOT_CONFIGURATION.ENABLE_COPILOT_FEATURE_ID,
    },
  ];
  accountObject.WORKHALLICS_DETAILS.KEY_VALUES = [
    {
      label: t && t('super_admin.account_details.account_object.workhallics_details.account_manager_label'),
      value: rawData.account_manager || 'NA',
    },
    {
      label: t && t('super_admin.account_details.account_object.workhallics_details.soultion_consultant_label'),
      value: rawData.solution_consultant || 'NA',
    },
  ];
  const dateNow = new Date();

  accountObject.USAGE_SUMMARY_CURRENT_MONTH.KEY_VALUES = [
    {
      label: t && t('super_admin.account_details.account_object.usage_summary_current_month.month_year_label'),
      value: getFormattedDateFromUTC(
        dateNow,
        ADMIN_ACCOUNTS_USAGE_SUMMARY_DATE,
      ) || 'NA',
    },
    {
      label: t && t('super_admin.account_details.account_object.usage_summary_current_month.flow_label'),
      value: (rawData.flow_count === 0 || rawData.flow_count) ? rawData.flow_count : 'NA',
    },
    {
      label: t && t('super_admin.account_details.account_object.usage_summary_current_month.datalist_label'),
      value: (rawData.data_list_count === 0 || rawData.data_list_count) ? rawData.data_list_count : 'NA',
    },
    {
      label: t && t('super_admin.account_details.account_object.usage_summary_current_month.total_active_user_label'),
      value: (rawData.active_users_count === 0 || rawData.active_users_count) ? rawData.active_users_count : 'NA',
    },
    {
      label: t && t('super_admin.account_details.account_object.usage_summary_current_month.added_this_month_label'),
      value: (rawData.activated_users_count === 0 || rawData.activated_users_count) ? rawData.activated_users_count : 'NA',
    },
    {
      label: t && t('super_admin.account_details.account_object.usage_summary_current_month.deleted_this_month_label'),
      value: (rawData.deactivated_users_count === 0 || rawData.deactivated_users_count) ? rawData.deactivated_users_count : 'NA',
    },
    {
      label: t && t('super_admin.account_details.account_object.usage_summary_current_month.billable_users_this_month_label'),
      value: (rawData.billable_users_count === 0 || rawData.billable_users_count) ? rawData.billable_users_count : 'NA',
    },
  ];

  return accountObject;
};

export const getUsageSummaryTableData = (rawData, t) => {
  const tableRowData =
    rawData &&
    rawData.map((value) => {
      const monthYear = getTableDataTemplate(value.month_and_year || 'NA');
      const flow = getTableDataTemplate(
        value.flow_count || value.flow_count === 0
          ? value.flow_count
          : 'NA',
      );
      const datalist = getTableDataTemplate(
        value.datalist_count || value.datalist_count === 0
          ? value.datalist_count
          : 'NA',
      );
      const activeUsers = getTableDataTemplate(
        value.active_user_count || value.active_user_count === 0
          ? value.active_user_count
          : 'NA',
      );
      const addedThisMonth = getTableDataTemplate(
        value.created_user_count || value.created_user_count === 0
          ? value.created_user_count
          : 'NA',
      );
      const deletedThisMonth = getTableDataTemplate(
        value.deactivated_user_count || value.deactivated_user_count === 0
          ? value.deactivated_user_count
          : 'NA',
      );
      const billableUsers = getTableDataTemplate(
        value.billable_user_count || value.billable_user_count === 0
          ? value.billable_user_count
          : 'NA',
      );
      const billingCurrency = getTableDataTemplate(
        value.billing_currency ? value.billing_currency.toUpperCase() : 'NA',
      );
      const discountAmount = getTableDataTemplate(
        value.discount_cost_value || value.discount_cost_value === 0
          ? `₹ ${value.discount_cost_value}`
          : 'NA',
      );
      const taxAmount = getTableDataTemplate(
        value.tax_cost_value || value.tax_cost_value === 0
          ? `₹ ${value.tax_cost_value}`
          : 'NA',
      );
      const actualAmount = getTableDataTemplate(
        value.actual_cost_value || value.actual_cost_value === 0
          ? `₹ ${value.actual_cost_value}`
          : 'NA',
      );
      const finalAmount = getTableDataTemplate(
        value.final_cost_value || value.final_cost_value === 0
          ? `₹ ${value.final_cost_value}`
          : 'NA',
      );
      return [
        monthYear,
        flow,
        datalist,
        activeUsers,
        addedThisMonth,
        deletedThisMonth,
        billableUsers,
        billingCurrency,
        discountAmount,
        taxAmount,
        actualAmount,
        finalAmount,
      ];
    });
  return isEmpty(tableRowData)
    ? [[<div className={styles.NoValuesTable}>{t && t('super_admin.accounts.no_values_found')}</div>]]
    : tableRowData;
};

const getProfileDetails = (acc_logo, document) => {
  let logo_src = null;
  acc_logo &&
    document &&
    document.forEach((doc) => {
      if (doc.document_id === acc_logo) logo_src = doc.signedurl;
    });
  return logo_src;
};

export const getAccountHeaderDetails = (rawData) => {
  if (!rawData || isEmpty(rawData)) return {};
  let address = '';
  if (rawData.billing_details && rawData.billing_details.address) {
    const addrObj = rawData.billing_details.address;
    address = `${addrObj.line1}, ${addrObj.line2}, ${addrObj.city}, ${addrObj.state} - ${addrObj.postal_code}`;
  }
  const companyHeaderDetails = {
    companyName: rawData.account_name,
    companyAddress: address,
    companyLogo: getProfileDetails(
      rawData.acc_logo,
      rawData.document_url_details,
    ),
    companyUrl: rawData.domain_url,
    companyType: rawData.industry_type,
  };
  return companyHeaderDetails;
};

export default getAccountObject;
