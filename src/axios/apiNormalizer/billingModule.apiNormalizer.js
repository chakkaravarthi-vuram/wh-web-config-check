import { reportError, hasOwn } from '../../utils/UtilityFunctions';

export const normalizeSubscriptionData = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  return content;
};

export const normalizePaymentUrlData = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  return content;
};

export const normalizeAllPaymentUsers = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  return content;
};
export const normalizeUpdatePaymentData = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  const requiredProperties = [
    '_id',
    'account_id',
    'country',
    'billing_owners',
    'is_auto_debit',
    'tax_details',
    'payment_methods',
    'account_name',
    'address',
    'stripe_customer_id',
  ];
  const missingProperties = requiredProperties.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate getAllPaymentUser failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (!missingProperties) {
    return content;
  } else {
    return null;
  }
  // return content;
};
export const normalizeAllUpdatedPaymentData = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('validate getAllPaymentUsers failed');
    return null;
  }
  return content;
};
export const normalizeInvoiceListData = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  const requiredProperties = ['pagination_details', 'pagination_data'];
  const missingProperties = requiredProperties.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate getAllInvoiceList Api failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (!missingProperties) {
    return content;
  } else {
  return null;
  }
};

export const normalizeGetAllSubList = (untrustedContent) => {
  const content = untrustedContent.data.result.data[0];
  const requiredProperties = [
    '_id',
    'cost_details',

  ];
  const missingProperties = requiredProperties.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get_all_subscription_details Failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (!missingProperties) {
    return untrustedContent.data.result.data;
  } else {
    return null;
  }
};

export const normalizeGetTrialDetails = (untrustedContent) => {
  const content = untrustedContent.data.result.data[0];
  console.log('gbsdb', content);
  const requiredProperties = ['_id', 'trial_days', 'trial_description', 'trial_name'];
  const missingProperties = requiredProperties.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate getTrialDetails failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (!missingProperties) {
    return content;
  } else {
    return null;
  }
};

export const normalizeAccountSettingConfig = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('validate getAllPaymentUsers failed');
    return null;
  }
  return content;
};

export const normalizeSavePaymentProfile = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('validate getAllPaymentUsers failed');
    return null;
  }
  return content;
};

export const normalizeGetCountryTax = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate ValidateAccountDomain failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content.data.result.data;
};

export const normalizeVerifyPayment = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  return content;
};

export const normalizePaymentStatus = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate ValidateAccountDomain failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content.data.result.data;
};
