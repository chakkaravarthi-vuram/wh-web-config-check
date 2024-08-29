import { EMAIL_ADDRESS_ID, MEMBER_CARD_LABELS, REPORTING_MANAGER_ID, USER_PERMISSION_ID } from '../../../../../components/member_list/invite_member/inviteMemberCard.strings';
import { cleanObject, get, isEmpty, pick, set, unset } from '../../../../../utils/jsUtility';

export const getEmail = (memberDetails) => memberDetails[EMAIL_ADDRESS_ID];
export const getPermission = (memberDetails) => memberDetails[USER_PERMISSION_ID];
export const getReportee = (memberDetails) => memberDetails[REPORTING_MANAGER_ID];
export const getReporteeId = (memberDetails) => get(memberDetails, [REPORTING_MANAGER_ID, '_id'], null);
export const getReporteeSearchText = (memberDetails) => memberDetails.reportingManagerSearchText;
export const getError = (memberDetails) => memberDetails.error;
export const getInitialUserDetails = () => {
  return {
    [EMAIL_ADDRESS_ID]: '', [USER_PERMISSION_ID]: 1, [REPORTING_MANAGER_ID]: {}, reportingManagerSearchText: '', error: {},
  };
};

export const getMemberDetailsByIndex = (allMemberCardDetails, index) => get(allMemberCardDetails, index, null);
export const getMemberValidationDetailsByIndex = (allMemberCardDetails, index) => pick(get(allMemberCardDetails, index, null), [EMAIL_ADDRESS_ID, USER_PERMISSION_ID, REPORTING_MANAGER_ID]);
export const getMembersValidationDetails = (allMemberCardDetails) => allMemberCardDetails.map((memberDetails) => pick(memberDetails, [EMAIL_ADDRESS_ID, USER_PERMISSION_ID, REPORTING_MANAGER_ID]));
export const setReporteSearchText = (memberDetails, searchText) => {
  const newMemberDetails = { ...memberDetails };
  newMemberDetails.reportingManagerSearchText = searchText;
  return newMemberDetails;
};

export const getEmailExistError = () => { return { [EMAIL_ADDRESS_ID]: 'email already exist' }; };

export const getDataForApi = (allMemberCardDetails) => {
  const postData = [];
  allMemberCardDetails.forEach((memberDetails) => {
    if (getEmail(memberDetails)) postData.push(cleanObject({ email: getEmail(memberDetails), user_type: getPermission(memberDetails), reporting_manager: getReporteeId(memberDetails) }));
  });
  return { invite_users: postData };
};

export const isEmailExistError = (memberCardDetails) => {
  if (getError(memberCardDetails)[EMAIL_ADDRESS_ID] === 'email already exist') return true;
  return false;
};

export const clearEmailExistError = (memberCardDetails) => {
  const copyMemberDetails = { ...memberCardDetails };
  unset(copyMemberDetails, ['error', EMAIL_ADDRESS_ID]);
  return copyMemberDetails;
};

export const setReportee = (memberDetails, reportingManager) => {
  const newMemberDetails = { ...memberDetails };
  newMemberDetails[REPORTING_MANAGER_ID] = reportingManager;
  return newMemberDetails;
};

export const setEmail = (memberDetails, email) => {
  const newMemberDetails = { ...memberDetails };
  newMemberDetails[EMAIL_ADDRESS_ID] = email;
  return newMemberDetails;
};

export const setPermission = (memberDetails, userPermission) => {
  const newMemberDetails = { ...memberDetails };
  newMemberDetails[USER_PERMISSION_ID] = userPermission;
  return newMemberDetails;
};

export const setMemberCardDetailsByIndex = (allMemberCardDetails, index, newValue) => {
  const copyAllMemberCardDetails = [...allMemberCardDetails];
  set(copyAllMemberCardDetails, index, newValue);
  return copyAllMemberCardDetails;
};

export const setMemberDetailsError = (memberDetails, error) => {
  const newMemberDetails = { ...memberDetails };
  newMemberDetails.error = { ...error };
  return newMemberDetails;
};

export const setMemberCardError = (memberCardDetails, error) => {
  const copyMemberDetails = { ...memberCardDetails };
  set(copyMemberDetails, ['error'], { ...error });
  return copyMemberDetails;
};

export const setError = (allMemberCardDetails, error) => {
  const errorKeys = Object.keys(error);
  const copyAllMemberCardDetails = [...allMemberCardDetails];
  errorKeys.forEach((errorKey) => {
    const [indexStr, id] = errorKey.split(',');
    const index = Number(indexStr);
    const memberDetails = getMemberDetailsByIndex(copyAllMemberCardDetails, index);
    if (memberDetails) {
      const copyMemberDetails = { ...memberDetails };
      set(copyMemberDetails, ['error', id], error[`${index},${id}`]);
      copyAllMemberCardDetails[index] = copyMemberDetails;
    }
  });
  return copyAllMemberCardDetails;
};

export const setServerError = (allMemberCardDetails, serverError) => {
  if (serverError.state_error) {
    const errorKeys = Object.keys(serverError.state_error);
    const copyAllMemberCardDetails = [...allMemberCardDetails];
    errorKeys.forEach((errorKey) => {
      const [baseObj, indexStr, id] = errorKey.split('.');
      const index = Number(indexStr);
      const memberDetails = getMemberDetailsByIndex(copyAllMemberCardDetails, index);
      if (memberDetails) {
        const copyMemberDetails = { ...memberDetails };
        set(copyMemberDetails, ['error', [MEMBER_CARD_LABELS[id]]], serverError.state_error[`${baseObj}.${index}.${id}`]);
        copyAllMemberCardDetails[index] = copyMemberDetails;
      }
    });
    return copyAllMemberCardDetails;
  }
  return allMemberCardDetails;
};

export const setErrorByIndex = (allMemberCardDetails, index, error) => {
  const memberDetails = getMemberDetailsByIndex(allMemberCardDetails, index);
  if (memberDetails) {
    const copyMemberDetails = { ...memberDetails };
    set(copyMemberDetails, ['error'], { ...error });
    return setMemberCardDetailsByIndex(allMemberCardDetails, index, copyMemberDetails);
  }
  return false;
};

export const clearErrorByIndex = (allMemberCardDetails, index) => {
  const memberDetails = getMemberDetailsByIndex(allMemberCardDetails, index);
  if (memberDetails) {
    const copyMemberDetails = { ...memberDetails };
    set(copyMemberDetails, ['error'], { });
    return setMemberCardDetailsByIndex(allMemberCardDetails, index, copyMemberDetails);
  }
  return false;
};

export const clearReporteeByIndex = (allMemberCardDetails, index) => {
  const memberDetails = getMemberDetailsByIndex(allMemberCardDetails, index);
  if (memberDetails) {
    const updatedMemberDetails = setReportee(memberDetails, {});
    return setMemberCardDetailsByIndex(allMemberCardDetails, index, updatedMemberDetails);
  }
  return false;
};

export const deleteMemberCardByIndex = (allMemberCardDetails, _index) => allMemberCardDetails.filter((value, index) => index !== _index);

export const addNewMemberCardToList = (oldList) => [...oldList, getInitialUserDetails()];

export const isErrorExist = (allMemberCardDetails) => allMemberCardDetails.some((memberDetails) => !isEmpty(getError(memberDetails)));
