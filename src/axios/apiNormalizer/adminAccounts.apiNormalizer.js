import {
  validatePaginationData,
  validatePaginationDetails,
} from '../../utils/apiServiceAndNormalizerUtils';
import { reportError } from '../../utils/UtilityFunctions';
import { get, isEmpty, has } from '../../utils/jsUtility';

export const normalizeGetAdminAccountApiResponse = (untrustedContent) => {
  return {
    paginationData: validatePaginationData(
      get(untrustedContent, 'data.result.data.pagination_data'),
      [
        '_id',
        'acc_type',
        'account_name',
        'account_domain',
        'is_active',
        'user_count',
        'created_on',
        'country',
        'account_manager',
        'is_paid',
      ],
      'get admin account',
    ),
    paginationDetails: validatePaginationDetails(
      get(untrustedContent, 'data.result.data.pagination_details'),
      undefined,
      'get admin account',
    ),
  };
};

export const normalizeGetAdminAccountDetailsApiResponse = (
  untrustedContent,
) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('admin account details not in proper format');
    return null;
  }
  return content;
};

export const normalizeGetUsageSummaryApiResponse = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('admin account usage summary not in proper format');
    return null;
  }
  return content;
};
export const normalizeEditAdminAccount = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('add new note fixed');
    return null;
  }
  return content;
};

export const normalizeDeleteAdminAccount = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('add new note fixed');
    return null;
  }
  return content;
};

const requiredPropsAdminAccountSummaryChartReport = [
  'chart_type',
  'x_label',
  'y_label',
  'x_value',
  'y_values',
];
export const validateAdminAccountSummaryChartReport = (
  adminAccountSummaryData,
  apiName = 'Admin Account Summary Chart Report',
  requiredProps = requiredPropsAdminAccountSummaryChartReport,
) => {
  if (!isEmpty(adminAccountSummaryData)) {
    requiredProps.forEach((requiredProp) => {
      if (!has(adminAccountSummaryData, requiredProp)) {
        reportError(
          `${apiName} Api Validation Error - Missing Required Field: ${requiredProp}`,
        );
      }
    });
  }
  return adminAccountSummaryData;
};

export const normalizeAdminAccountSummaryChartReport = (
  untrustedContent,
  apiName,
) => {
  const content = untrustedContent.data.result;
  if (!content) {
    reportError('Admin Account Summary Chart Report not in proper format');
    return null;
  }
  return validateAdminAccountSummaryChartReport(content, apiName);
};
