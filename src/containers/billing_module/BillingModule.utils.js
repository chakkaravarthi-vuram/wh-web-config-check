import React from 'react';
import { translate } from 'language/config';
import VisaIcon from 'assets/icons/billing_payment_icons/VisaIcon';
import GeneralCardIcon from 'assets/icons/billing_payment_icons/GeneralCardIcon';
import MasterCardIcon from 'assets/icons/billing_payment_icons/MasterCardIcon';
import AmericanExpressIcon from 'assets/icons/billing_payment_icons/AmericanExpressIcon';
import moment from 'moment';
import jsUtils, { isEmpty } from '../../utils/jsUtility';
import { DROPDOWN_CONSTANTS, EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { PAY_PROFILE, PAY_METHOD, LATEST_INVOICE, INVOICE_PERIOD, BILLING_METHOD_YEAR, getMonthDropdownArray, CVV_CHAR, CARD_TYPE, PAYMENT_ICONS, BILLING_VALIDATIONS } from './BillingModule.string';

export const getPaymentMethodData = (ResponseData) => {
  const PayMethodLabel = jsUtils.cloneDeep(PAY_METHOD);
  if (ResponseData) {
    PayMethodLabel.DETAILS = PayMethodLabel.DETAILS.map((EachItem) => {
      switch (EachItem.SUB_TITLE) {
        case 'Card Type':
          return { SUB_TITLE: EachItem.SUB_TITLE, VALUE: ResponseData && ResponseData.card && ResponseData.card.brand };
        case 'Card Number':
          return {
            ...EachItem,
            VALUE: `**** **** **** ${ResponseData && ResponseData.card && ResponseData.card.last4
            }`,
            ID: EachItem.SUB_TITLE,
          };
        case 'Expiry Month - Year':
          return {
            ...EachItem,
            VALUE: `${String(ResponseData && ResponseData.card && ResponseData.card.exp_month).length === 1 ? `0${ResponseData && ResponseData.card && ResponseData.card.exp_month}` : ResponseData && ResponseData.card && ResponseData.card.exp_month} - ${String(ResponseData && ResponseData.card && ResponseData.card.exp_year).slice(-2)}`,
            MONTH_VALUE: `${ResponseData && ResponseData.card && ResponseData.card.exp_month} - ${ResponseData && ResponseData.card && ResponseData.card.exp_year}`,
            YEAR_VALUE: ResponseData && ResponseData.card && ResponseData.card.exp_year,
          };
        case 'CVV Number':
          return {
            ...EachItem,
            VALUE: ResponseData && ResponseData.card && ResponseData.card.brand === CARD_TYPE.AMEX ? CVV_CHAR.FOUR_CVV : CVV_CHAR.THREE_CVV,
            ID: EachItem.SUB_TITLE,
          };
        case 'Card Nick Name':
          return {
            ...EachItem,
            VALUE: ResponseData && ResponseData.metadata && ResponseData.metadata.card_nick_name,
            ID: EachItem.SUB_TITLE,
          };
        case 'Card Holder Name':
          return {
            ...EachItem,
            VALUE: ResponseData && ResponseData.billing_details && ResponseData.billing_details.name,
            ID: EachItem.SUB_TITLE,
          };
        case 'Card Holder Address line 1':
        return {
          ...EachItem,
          VALUE: ResponseData && ResponseData.billing_details && ResponseData.billing_details.address.line1,
          ID: EachItem.SUB_TITLE,
        };
        case 'Card Holder Address line 2':
        return {
          ...EachItem,
          VALUE: ResponseData && ResponseData.billing_details && ResponseData.billing_details.address.line2,
          ID: EachItem.SUB_TITLE,
        };
        case 'Billing City':
        return {
          ...EachItem,
          VALUE: ResponseData && ResponseData.billing_details && ResponseData.billing_details.address.city,
          ID: EachItem.SUB_TITLE,
        };
        case 'Billing Postal Code':
        return {
          ...EachItem,
          VALUE: ResponseData && ResponseData.billing_details && ResponseData.billing_details.address.postal_code,
          ID: EachItem.SUB_TITLE,
        };
        case 'Billing State':
        return {
          ...EachItem,
          VALUE: ResponseData && ResponseData.billing_details && ResponseData.billing_details.address.state,
          ID: EachItem.SUB_TITLE,
        };
        default:
          return null;
      }
    });
    PayMethodLabel.is_verified = ResponseData && ResponseData.is_verified;
    PayMethodLabel.payment_method_id = ResponseData && ResponseData.payment_method_id;
  } else {
    PayMethodLabel.DETAILS = PayMethodLabel.DETAILS.map((EachItem) => {
      switch (EachItem.SUB_TITLE) {
        case 'Card Type':
          return { SUB_TITLE: EachItem.SUB_TITLE, VALUE: ResponseData && ResponseData.card && ResponseData.card.brand };
        case 'Card Number':
          return {
            ...EachItem,
            VALUE: EMPTY_STRING,
            ID: EachItem.SUB_TITLE,
          };
        case 'Expiry Month - Year':
          return {
            ...EachItem,
          };
        case 'CVV Number':
          return {
            ...EachItem,
            ID: EachItem.SUB_TITLE,
          };
        default:
          return null;
      }
    });
    PayMethodLabel.is_verified = ResponseData && ResponseData.is_verified;
    PayMethodLabel.payment_method_id = ResponseData && ResponseData.payment_method_id;
  }
  return PayMethodLabel;
};
export const constructCustmizeSubscriptionData = (apidata, t) => {
  let renewalDate = moment(apidata.to_date).format('DD-MMM-YYYY');
  let nextBillingData = moment(apidata.next_billing_date).format('DD-MMM-YYYY');
  let fromDate = moment(apidata.from_date).format('DD-MMM-YYYY');
  renewalDate = renewalDate.replace(/-/g, ' - ');
  fromDate = fromDate.replace(/-/g, ' - ');
  nextBillingData = nextBillingData.replace(/-/g, ' - ');
  const CustomizeSubscriptionData = {
    TITLE: t('billing_module.sub_details.title'),
    DETAILS: [
      { SUB_TITLE: t('billing_module.sub_details.subscription_name'), VALUE: apidata.subscription_name },
      {
        SUB_TITLE: t('billing_module.sub_details.current_billing_cycle'),
        VALUE: `${fromDate} ${' to '} ${renewalDate}`,
      },
      {
        SUB_TITLE: t('billing_module.sub_details.next_billing_cycle'),
        VALUE: `${nextBillingData} (${apidata.remaining_days} ${t('billing_module.sub_details.days_remaining')})`,
      },
    ],
    ACTIVE_USERS: apidata.active_users_count,
  };
  return CustomizeSubscriptionData;
};

export const getPaymentProfileCustomData = (apiData, allowAutoDebit, t) => {
  // const { tax_details } = apiData;
  const PayProfileString = jsUtils.cloneDeep(PAY_PROFILE);
  PayProfileString.DETAILS = PayProfileString.DETAILS.map((EachItem) => {
    if (EachItem.SUB_TITLE === 'Auto Debit' && !allowAutoDebit) {
      return {
        ...EachItem,
        VALUE: 'Disabled',
        FORM_VALUE: false,
        isEditable: false,
      };
    }
    switch (t(EachItem.SUB_TITLE)) {
      case t('billing_module.pay_profile.label.name'):
        return {
          ...EachItem,
          VALUE: apiData.account_name,
        };
      case t('billing_module.pay_profile.label.address1'):
        return {
          ...EachItem,
          VALUE: apiData.address.line1,
        };
      case t('billing_module.pay_profile.label.address2'):
        return {
          ...EachItem,
          VALUE: apiData.address.line2,
        };
      case t('billing_module.pay_profile.label.postal_code'):
        return {
          ...EachItem,
          VALUE: apiData.address.postal_code,
        };
      case t('billing_module.pay_profile.label.city'):
        return {
          ...EachItem,
          VALUE: apiData.address.city,
        };
      case t('billing_module.pay_profile.label.country'):
        return {
          ...EachItem,
          VALUE: apiData.country,
        };
      case t('billing_module.pay_profile.label.state'):
        return {
          ...EachItem,
          VALUE: apiData.address.state,
        };
      case t('billing_module.pay_profile.label.billing_currency'):
        return {
          ...EachItem,
          VALUE: apiData.billing_currency,
        };
      case 'Timezone':
        return {
          ...EachItem,
          VALUE: apiData.timezone,
        };
      case t('billing_module.pay_profile.label.auto_debit'):
        return {
          ...EachItem,
          VALUE: apiData.is_auto_debit ? 'Enabled' : 'Disabled',
          FORM_VALUE: apiData.is_auto_debit,
          isEditable: false,
        };
      case t('billing_module.pay_profile.label.tax_number'):
          return {
            ...EachItem,
            VALUE: apiData.tax_details && apiData.tax_details[0].value,
        };
        case t('billing_module.pay_profile.label.tax_id'):
          return {
            ...EachItem,
            VALUE: apiData.tax_details && apiData.tax_details[0].type,
        };
      // case 'PAN':
      //   return {
      //     ...EachItem,
      //     VALUE: apiData.tax_details.pan,
      //   };
      // case 'GSTIN':
      //   return {
      //     ...EachItem,
      //     VALUE: apiData.tax_details.gstin,
      //   };
      default:
        return null;
    }
  });
  return PayProfileString;
};
export const getpaymentUsersIvoiceCustomData = (apiData) => {
  const IvoiceCustomData = jsUtils.cloneDeep(LATEST_INVOICE);
  IvoiceCustomData.DETAILS = apiData.invoice_details.map((value) => {
    const Date = moment(value.created_on).format('DD-MMM-YYYY');
    return {
      ID: value.invoice_number,
      DATE: Date,
      AMOUNT: `${value.invoice_currency.toUpperCase()} ${value.final_cost_value}`,
      DOWNLOAD_PDF: value.invoice_document_url,
      PREVIEW_PDF: value.receipt_url,
      PAYMENT_URL: value.payment_url,
      IS_PAID: value.is_paid,
      FILE_NAME: value.invoice_number,
      REMAINING_DAY: value && value.payment_due_date ? moment(value.payment_due_date).diff(moment(), 'days') + 1 : 0,
      DUE_DATE: value.payment_due_date,
    };
  });
  return IvoiceCustomData;
};
export const getPaymentUsers = (apiData, t) => {
  let allowAutoDebit = false;
  if (apiData && !isEmpty(apiData.payment_methods)) {
    const filteredData = apiData.payment_methods.filter((data) => data.is_active && data.is_default && data.is_verified);
    if (filteredData && !isEmpty(filteredData)) {
      allowAutoDebit = true;
    } else allowAutoDebit = false;
  }
  console.log('vdfdafsgag', t);
  const paymentProfileCustomizedDetails = getPaymentProfileCustomData(apiData, allowAutoDebit, t);
  const paymentMethodDetails = apiData && getPaymentMethodData(apiData.payment_methods && apiData.payment_methods[0]);
   const paymentUsersIvoiceCustomData = apiData && apiData.invoice_details && getpaymentUsersIvoiceCustomData(apiData);
   console.log('dfaFSAfAF', paymentUsersIvoiceCustomData);
  const paymentUsers = {
    TITLE: t('billing_module.payment_users.title'),
    ACTION: t('billing_module.payment_users.action'),
    DETAILS: [],
  };
  const billingOwners = jsUtils.sortBy(apiData.billing_owners, (users) => !users.is_primary_contact);

  billingOwners && billingOwners.forEach((user, index) => {
    paymentUsers.DETAILS.push({
      EMAIL: user.email,
      TYPE: user.is_primary_contact ? t('billing_module.billing_role.primary') : t('billing_module.billing_role.secondary'),
      roworder: index,
      user_id: user.user_id,
      is_active: user.is_active,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  });

  return {
    paymentUsers,
    paymentProfileCustomizedDetails,
    paymentMethodDetails,
     paymentUsersIvoiceCustomData,
  };
};

export const getPaymentProfileOriginalData = (customData, t) => {
  let originalData = {};
  const address = {};
  const taxDetailsData = {};
  customData.forEach((EachItem) => {
    switch (t(EachItem.SUB_TITLE)) {
      case t('billing_module.pay_profile.label.name'):
        originalData.account_name = EachItem.VALUE;
        break;
      case t('billing_module.pay_profile.label.address1'):
        address.line1 = EachItem.VALUE;
        break;
      case t('billing_module.pay_profile.label.address2'):
        address.line2 = EachItem.VALUE;
        break;
      case t('billing_module.pay_profile.label.postal_code'):
        address.postal_code = Number(EachItem.VALUE) ? Number(EachItem.VALUE) : EMPTY_STRING;
        break;
      case t('billing_module.pay_profile.label.city'):
        address.city = EachItem.VALUE;
        break;
      case t('billing_module.pay_profile.label.state'):
        address.state = EachItem.VALUE;
        break;
      case t('billing_module.pay_profile.label.billing_currency'):
        originalData.billing_currency = EachItem.VALUE;
      break;
      case 'Timezone':
        originalData.timezone = EachItem.VALUE;
      break;
      case t('billing_module.pay_profile.label.tax_number'):
        taxDetailsData.value = EachItem.VALUE;
      break;
      case t('billing_module.pay_profile.label.tax_id'):
        taxDetailsData.type = EachItem.VALUE;
      break;
      // case 'Auto debit':
      //   originalData.is_auto_debit = EachItem.VALUE === 'Enabled' ? true : EachItem.VALUE === 'Disabled' ? false : EachItem.VALUE;
      // break;
      default:
        null;
    }
  });
  originalData = { ...originalData, address };
  return originalData;
};

export const setPaymentMethodOriginalData = (customData) => {
  let originalData = {};
  const card = {};
  card.exp_month = customData.expiryMonth && parseInt(customData.expiryMonth, 10);
  card.exp_year = customData.expiryYear && parseInt(customData.expiryYear, 10);
  card.cvc = customData.CVV;
  card.number = customData.cardNumber.replace(/ /g, '');
  originalData.type = 'card';
  originalData = { ...originalData, card };
  return { payment_methods: originalData };
};

export const expiryMonthAndYearSplit = (acquiredValue) => {
  if (acquiredValue) {
    const monthYear = jsUtils.cloneDeep(acquiredValue);
    const slashValueIndex = monthYear.lastIndexOf('-');
    return { expiryMonthValue: monthYear.substring(0, monthYear.lastIndexOf('-')), expiryYearValue: monthYear.substring(slashValueIndex + 1) };
  } else {
    return { expiryMonthValue: EMPTY_STRING, expiryYearValue: EMPTY_STRING };
  }
};

export const getPaymentMethodOriginalData = (customData) => {
  let originalData = {};
  const type = { type: 'card' };
  const card = {};
  customData.forEach((EachItem) => {
    switch (EachItem.SUB_TITLE) {
      case 'Expiry Month - Year':
        const { expiryMonthValue, expiryYearValue } = expiryMonthAndYearSplit(EachItem.VALUE);
        card.exp_month = expiryMonthValue;
        card.exp_year = expiryYearValue;
        break;
      case 'CVV Number':
        card.cvc = EachItem.VALUE;
        break;
      case 'Card Number':
        card.number = EachItem.VALUE.replace(/ /g, '');
        break;
      default:
        null;
    }
  });
  originalData = { ...originalData, card, ...type };
  return originalData;
};

export const validBillingUserRole = (paymentUsers, t) => {
  const isPrimayArray = paymentUsers.filter((value) => value.is_primary_contact);
  if (isPrimayArray.length === 1) {
    return null;
  } else if (isPrimayArray.length >= 1) {
    return t('billing_module.billing_user_error.primary_billing_error');
  } else {
    return t('billing_module.billing_user_error.one_billing_error');
  }
};

export const getFormattedBillingCurrencyDropDownList = (value) => {
  let index;
  const data = [];
  for (index = 0; index < value.length; index += 1) {
    data.push({
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: value[index],
      [DROPDOWN_CONSTANTS.VALUE]: value[index],
    });
  }
  return data;
};

export const getFormattedSaveProfileData = (value, methodData, user_details) => {
  const saveProfileData = jsUtils.cloneDeep(value);
  let saveProfileParam = {};
  const subscription_details = { wh_subscription_id: value.current_subscription_number, cost_details_id: value.cost_details_id };
  const address = { line1: saveProfileData.line1, line2: saveProfileData.line2, city: saveProfileData.city, postal_code: saveProfileData.postal_code, state: saveProfileData.state };
  const tax_details = [];
  tax_details.push({ type: saveProfileData.type, value: saveProfileData.id });
  const billing_owners = [];
  billing_owners.push({ first_name: user_details.first_name, last_name: user_details.last_name, is_primary_contact: true, email: user_details.email, user_id: user_details.id });
  saveProfileParam = { account_name: user_details.account_name, account_id: saveProfileData.account_id, address: address, timezone: saveProfileData.timezone, billing_language: saveProfileData.billing_language, subscription_details, country: saveProfileData.country, billing_currency: saveProfileData.billing_currency, ...methodData, billing_owners };
  if (saveProfileData.id && saveProfileData.type) saveProfileParam.tax_details = tax_details;
  return saveProfileParam;
};

export const getFormattedEditProfileData = (value, methodData, user_details) => {
  const saveProfileData = jsUtils.cloneDeep(value);
  let saveProfileParam = {};
  const address = { line1: saveProfileData.line1, line2: saveProfileData.line2, city: saveProfileData.city, postal_code: saveProfileData.postal_code, state: saveProfileData.state };
  const tax_details = [];
  tax_details.push({ type: saveProfileData.type, value: saveProfileData.id });
  saveProfileParam = { account_name: user_details.account_name, account_id: saveProfileData.account_id, address: address, timezone: saveProfileData.timezone, billing_language: saveProfileData.billing_language, country: saveProfileData.country, billing_currency: saveProfileData.billing_currency, ...methodData };
  if (saveProfileData.id && saveProfileData.type) saveProfileParam.tax_details = tax_details;
  return saveProfileParam;
};

export const getFormattedSetEditProfileData = (value, methodData, user_details) => {
  const saveProfileData = jsUtils.cloneDeep(value);
  let saveProfileParam = {};
  const subscription_details = { wh_subscription_id: value.current_subscription_number, cost_details_id: value.cost_details_id };
  const address = { line1: saveProfileData.line1, line2: saveProfileData.line2, city: saveProfileData.city, postal_code: saveProfileData.postal_code, state: saveProfileData.state };
  const tax_details = [];
  tax_details.push({ type: saveProfileData.type, value: saveProfileData.id });
  saveProfileParam = { account_name: user_details.account_name, address: address, country: saveProfileData.country, billing_currency: saveProfileData.billing_currency, ...methodData, subscription_details };
  if (saveProfileData.id && saveProfileData.type) saveProfileParam.tax_details = tax_details;
  return saveProfileParam;
};

export const getDate = (period) => {
  let date;
  if (period === INVOICE_PERIOD.THREE_MONTH) {
      date = moment().subtract(3, 'M');
    } else if (period === INVOICE_PERIOD.SIX_MONTH) {
      date = moment().subtract(6, 'M');
    } else {
      date = moment().subtract(1, 'Y');
    }
   const value = moment.utc(date).format('YYYY-MM-DD');
    return value;
};

export const getDropdownCountryDetails = (countryDetails) => {
  const data = [];
  countryDetails && countryDetails.forEach((details) => {
    data.push({
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: details.COUNTRY,
      [DROPDOWN_CONSTANTS.VALUE]: details.COUNTRY,
      tax_type: details.TAX_TYPE,
    });
  });
  return data;
};

export const getDropdownBillCurrency = (currencyDetails) => {
  const currencyArray = [];
  currencyDetails.forEach((details) => {
    currencyArray.push({
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: details.currency.toUpperCase(),
      [DROPDOWN_CONSTANTS.VALUE]: details.cost_details_id,
    });
  });
  return currencyArray;
};

export const getTaxDetailsDropdown = (taxDetails) => {
  const taxArray = [];
  taxDetails.forEach((details) => {
    taxArray.push({
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: details.ENUM.toUpperCase(),
      [DROPDOWN_CONSTANTS.VALUE]: details.ENUM,
      placeholder: details.EXAMPLE,
    });
  });
  taxArray.push({ [DROPDOWN_CONSTANTS.OPTION_TEXT]: translate('billing_module.set_payment_profile.form_details.tax_number_type.placeholder'), [DROPDOWN_CONSTANTS.VALUE]: 0, placeholder: translate('billing_module.set_payment_profile.form_details.tax_number.placeholder') });
  return taxArray;
};

export const validateExpiryMonthYear = (expiryMonth, expiryYear) => {
  const yearFormat = parseInt(`20${expiryYear}`, 10);
  const monthFormat = parseInt(expiryMonth, 10);
  const monthArray = getMonthDropdownArray(yearFormat);

  const yearFinder = BILLING_METHOD_YEAR.find((year) => year.value === yearFormat);
  const monthFinder = monthArray.find((month) => month.value === monthFormat);
  if (jsUtils.isEmpty(yearFinder)) {
    return 'Invalid expiry MM/YY';
  }
  if (jsUtils.isEmpty(monthFinder)) {
    return 'Invalid expiry MM/YY';
  }
  return null;
};

export const getInvoiceFormattedData = (date, remaining_day, t) => {
  if (remaining_day < 1) {
      return `${t('task_content.landing_page_translation.due')} ${moment(date).format('D MMMM YYYY').replace('-', '')}`;
  } else {
    return `Due ${moment(date).format('D MMMM YYYY').replace('-', '')} (${remaining_day} days left)`;
  }
};

export const getPaymentCardIcon = (card) => {
  switch (card) {
    case PAYMENT_ICONS.VISA:
      return <VisaIcon />;
    case PAYMENT_ICONS.MASTER_CARD:
      return <MasterCardIcon />;
    case PAYMENT_ICONS.AMERICAN_EXPRESS:
      return <AmericanExpressIcon />;
    default:
      return <GeneralCardIcon />;
  }
};

export const getAddUserValidation = (existingData, userAddData, t) => {
  const validData = {};
  existingData && existingData.forEach((userData) => {
    userAddData.forEach((data, index) => {
      if (userData.user_id === jsUtils.get(data, ['user', '_id'])) {
        validData[`${index},email`] = t(BILLING_VALIDATIONS.EMAIL_EXIST);
        validData[`${index},user`] = t(BILLING_VALIDATIONS.USER_NAME_EXIST);
      }
      if (data.userRole === 'Primary') {
        validData[`${index},userRole`] = t(BILLING_VALIDATIONS.ONE_PRIMARY);
      }
    });
  });
  const uniqueUser = [];
  userAddData.forEach((data, index) => {
    if (uniqueUser.find((user) => jsUtils.get(data, ['user', '_id']) && (jsUtils.get(user, ['user', '_id']) === jsUtils.get(data, ['user', '_id'])))) {
      validData[`${index},email`] = t(BILLING_VALIDATIONS.EMAIL_EXIST);
      validData[`${index},user`] = t(BILLING_VALIDATIONS.USER_NAME_EXIST);
      return;
    }
    uniqueUser.push(data);
  });
  return validData;
};
