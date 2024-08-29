import { compareObjects } from 'utils/UtilityFunctions';
import { isEmpty } from 'utils/jsUtility';
import { getSignedUrlFromDocumentUrlDetails } from 'utils/profileUtils';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

export const INITIAL_STATE = {
  account_name: false,
  account_domain: false,
  acc_logo: false,
  account_industry: false,
  account_country: false,
  account_language: false,
  account_locale: [],
  account_timezone: false,
  account_manager: false,
  solution_consultant: false,
  primary_locale: '',
};

export const getAccountDetailsInitialData = (rawData, primary_locale, account_locale, account_language) => {
    const formattedData = {
    account_name: rawData.account_name,
    industry_type: rawData.account_industry,
    acc_language: account_language,
    country: rawData.account_country,
    acc_locale: rawData.account_locale,
    acc_timezone: rawData.account_timezone,
    primary_locale: primary_locale,
    is_copilot_enabled: rawData?.is_copilot_enabled,
  };
  if (isEmpty(rawData.account_id)) {
    formattedData.account_domain = rawData.account_domain;
    formattedData.first_name = rawData.account_first_name;
    formattedData.last_name = rawData.account_last_name;
    formattedData.username = rawData.account_username;
    formattedData.email = rawData.account_email;
    formattedData.role_in_company = rawData.role_in_company;
  } else {
    formattedData.account_id = rawData.account_id;
    formattedData.account_manager = rawData.account_manager;
    formattedData.solution_consultant = rawData.solution_consultant;
  }
  return formattedData;
};

export const getAccountsFormData = (rawData) => {
  if (!rawData || isEmpty(rawData)) return {};

  const formattedData = {
    account_id: rawData._id,
    account_name: rawData.account_name || EMPTY_STRING,
    account_domain: rawData.account_domain || EMPTY_STRING,
    account_manager: rawData.account_manager || EMPTY_STRING,
    solution_consultant: rawData.solution_consultant || EMPTY_STRING,
    account_industry: rawData.industry_type || [],
    account_language: rawData.acc_language || EMPTY_STRING,
    account_country: rawData.country || EMPTY_STRING,
    account_locale: rawData.acc_locale || [],
    primary_locale: rawData.primary_locale || EMPTY_STRING,
    account_timezone: rawData.acc_timezone || EMPTY_STRING,
    acc_logo_pic_id: !isEmpty(rawData.document_url_details)
      ? rawData.document_url_details[0]._id
      : null,
    acc_logo: getSignedUrlFromDocumentUrlDetails(
      rawData.document_url_details,
      rawData.acc_logo,
    ),
    acc_initial_logo: getSignedUrlFromDocumentUrlDetails(
      rawData.document_url_details,
      rawData.acc_logo,
    ),
    // set copilot flag
    is_copilot_enabled: rawData?.is_copilot_enabled || false,
  };
  return formattedData;
};

export const getValidationData = (rawData) => {
    if (!rawData || isEmpty(rawData)) return {};

  const adminDetails = {
    account_domain: rawData.account_domain,
    account_first_name: rawData.account_first_name,
    account_last_name: rawData.account_last_name,
    account_username: rawData.account_username,
    account_email: rawData.account_email,
    role_in_company: rawData.role_in_company,
  };

  const formattedData = {
    account_name: rawData.account_name,
    account_industry: rawData.account_industry,
    // account_language: rawData.account_language,
    account_country: rawData.account_country,
    // account_locale: rawData.account_locale,
    account_timezone: rawData.account_timezone,
  };

  if (isEmpty(rawData.account_id)) {
    return {
      ...adminDetails,
      ...formattedData,
    };
  }
  formattedData.account_id = rawData.account_id;
  formattedData.account_manager = rawData.account_manager;
  formattedData.solution_consultant = rawData.solution_consultant;

  return formattedData;
};

export const isEditedForm = (initialData, newData) =>
  compareObjects(initialData, newData);
