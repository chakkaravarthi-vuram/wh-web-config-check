import {
  EMAIL_VALIDATION,
  FIRST_NAME_VALIDATION,
  LAST_NAME_VALIDATION,
  USER_NAME_VALIDATION,
  // PHONE_NUMBER_VALIDATION,
  // MOBILE_NUMBER_VALIDATION,
  // REQUIRED_VALIDATION,
  // REQUIRED_OBJECT_VALIDATION,
  NEW_ROLE_VALIDATION,
  NEW_BUSINESS_UNIT_VALIDATION,
  constructJoiObject,
  OBJECT_VALIDATION,
} from '../../../../../utils/ValidationConstants';
import { ADD_MEMBER_BASIC_DETAILS_FORM } from './add_member_basic_details/AddMemberBasicDetails.strings';
import { DROPDOWN_CONSTANTS, EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import countryCodeList from '../../../../../components/form_components/flags/countryCodeList';
import { OTHER_DETAILS_FORM } from './other_details/OtherDetails.strings';
import { ROLES } from '../../../../../utils/Constants';
import { removePlusFromCountryCode } from '../../../../../utils/generatorUtils';

export const addMemberValidationSchema = (t) => constructJoiObject({
  // Reporting manager is not required
  first_name: FIRST_NAME_VALIDATION.required().label(
    t(ADD_MEMBER_BASIC_DETAILS_FORM.FIRST_NAME.LABEL),
  ),
  last_name: LAST_NAME_VALIDATION.required().label(t(ADD_MEMBER_BASIC_DETAILS_FORM.LAST_NAME.LABEL)),
  username: USER_NAME_VALIDATION(t).required().label(t(ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.LABEL)),
  email: EMAIL_VALIDATION.required().label(t(ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.LABEL)),
  // phone_number: PHONE_NUMBER_VALIDATION.allow(null, EMPTY_STRING),
  // mobile_number: MOBILE_NUMBER_VALIDATION.allow(null, EMPTY_STRING),
  reporting_manager: OBJECT_VALIDATION.allow(null).label(t(OTHER_DETAILS_FORM.REPORTING_MANAGER.LABEL)),
});

export const addMemberValidationSchema2 = (t) => constructJoiObject({
  // Reporting manager is required
  first_name: FIRST_NAME_VALIDATION.required().label(
    t(ADD_MEMBER_BASIC_DETAILS_FORM.FIRST_NAME.LABEL),
  ),
  last_name: LAST_NAME_VALIDATION.required().label(t(ADD_MEMBER_BASIC_DETAILS_FORM.LAST_NAME.LABEL)),
  username: USER_NAME_VALIDATION(t).required().label(t(ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.LABEL)),
  email: EMAIL_VALIDATION.required().label(t(ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.LABEL)),
  // phone_number: PHONE_NUMBER_VALIDATION.allow(null, EMPTY_STRING),
  // mobile_number: MOBILE_NUMBER_VALIDATION.allow(null, EMPTY_STRING),
  reporting_manager: OBJECT_VALIDATION.required().label(t(OTHER_DETAILS_FORM.REPORTING_MANAGER.LABEL)),
});

export const addRoleValidationSchema = constructJoiObject({
  roles: NEW_ROLE_VALIDATION.allow(null, EMPTY_STRING).label(OTHER_DETAILS_FORM.ADD_ROLE.LABEL),
});

export const addBusinessUnitValidationSchema = constructJoiObject({
  business_units: NEW_BUSINESS_UNIT_VALIDATION.allow(null, EMPTY_STRING).label(
    OTHER_DETAILS_FORM.ADD_BUSINESS_UIT.LABEL,
  ),
});

export const getRolesFromResponse = (response) => {
  let index;
  const data = [];
  for (index = 0; index < response.length; index += 1) {
    data.push({
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: response[index].roles,
      [DROPDOWN_CONSTANTS.VALUE]: response[index].roles,
    });
  }
  return data;
};

export const getBusinessUnitsFromResponse = (response) => {
  let index;
  const data = [];
  for (index = 0; index < response.length; index += 1) {
    data.push({
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: response[index].business_units,
      [DROPDOWN_CONSTANTS.VALUE]: response[index].business_units,
    });
  }
  return data;
};

export const appendNewRole = (response, roleList) => {
  let index;
  const data = roleList;
  for (index = 0; index < response.length; index += 1) {
    data.push({
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: response[index],
      [DROPDOWN_CONSTANTS.VALUE]: response[index],
    });
  }

  return data;
};

export const getAddMemberDetailsData = (state) => {
  const data = {
    [ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.ID]: state.username.trim(),
    [ADD_MEMBER_BASIC_DETAILS_FORM.FIRST_NAME.ID]: state.first_name.trim(),
    [ADD_MEMBER_BASIC_DETAILS_FORM.LAST_NAME.ID]: state.last_name.trim(),
    [ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.ID]: state.email.trim(),
    [ADD_MEMBER_BASIC_DETAILS_FORM.USER_TYPE_RADIO().ID]: state.user_type,
    [ADD_MEMBER_BASIC_DETAILS_FORM.REPORTING_MANAGER_CB()[0].ID]: state.not_reporting,
  };
  if (state.reporting_manager) {
    data[OTHER_DETAILS_FORM.REPORTING_MANAGER.ID] = state.reporting_manager._id;
  }
  if (state.phone_number) {
    data[OTHER_DETAILS_FORM.PHONE_NUMBER.ID] = state.phone_number.trim();
  }
  if (state.mobile_number) {
    data[OTHER_DETAILS_FORM.MOBILE_NUMBER.ID] = state.mobile_number.trim();
    data[OTHER_DETAILS_FORM.MOBILE_NUMBER_COUNTRY_CODE.ID] = removePlusFromCountryCode(
      state.mobile_number_country_code,
    );
    data[OTHER_DETAILS_FORM.MOBILE_NUMBER_COUNTRY.ID] = state.mobile_number_country;
  }
  if (state.role) data[OTHER_DETAILS_FORM.ROLE.ID] = state.role;
  if (state.business_unit) {
    data[OTHER_DETAILS_FORM.BUSSINESS_UNIT.ID] = state.business_unit;
  }
  return data;
};

export const getAddMemberBasicDetailsValidateData = (state) => {
  const data = {
    [ADD_MEMBER_BASIC_DETAILS_FORM.FIRST_NAME.ID]: state.first_name
      ? state.first_name.trim()
      : state.first_name,
    [ADD_MEMBER_BASIC_DETAILS_FORM.LAST_NAME.ID]: state.last_name
      ? state.last_name.trim()
      : state.last_name,
    [ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.ID]: state.username
      ? state.username.trim()
      : state.username,
    [ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.ID]: state.email ? state.email.trim() : state.email,
    [OTHER_DETAILS_FORM.REPORTING_MANAGER.ID]: state.reporting_manager,
  };
  return data;
};

export const clearAddMemberState = () => {
  return {
    role: EMPTY_STRING,
    user_type: ROLES.MEMBER,
    reporting_manager: null,
    business_unit: EMPTY_STRING,
    mobile_number_country_code: countryCodeList[94].countryCodeId,
    mobile_number_country: countryCodeList[94].countryCode.toUpperCase(),
    first_name: EMPTY_STRING,
    last_name: EMPTY_STRING,
    username: EMPTY_STRING,
    email: EMPTY_STRING,
    phone_number: EMPTY_STRING,
    mobile_number: EMPTY_STRING,
    error_list: [],
    server_error: [],
    common_server_error: EMPTY_STRING,
    selectedValue: null,
    suggestionList: [],
    roles: EMPTY_STRING,
    business_units: EMPTY_STRING,
    isDataLoading: false,
    isClearClicked: true,
    reporting_manager_search_value: EMPTY_STRING,
    not_reporting: false,
  };
};
