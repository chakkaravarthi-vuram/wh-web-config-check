import { isEmpty } from 'lodash';
import { clearEmailExistError, getEmail, getEmailExistError, getError, isEmailExistError, setMemberDetailsError } from './inviteMemberCard.selectors';

export const isErrorExist = (allMemberCardDetails) => allMemberCardDetails.some((memberDetails) => !isEmpty(getError(memberDetails)));

export const checkEmailUniqueError = (allMemberCardDetails) => {
  const emails = new Map();
  allMemberCardDetails.forEach((memberCardDetails) => {
    if (!isEmpty(getEmail(memberCardDetails)) && emails.has(getEmail(memberCardDetails))) emails.set(getEmail(memberCardDetails), 1);
    else emails.set(getEmail(memberCardDetails), 0);
  });
  let errorExist = false;
  const copyAllMemberCardDetails = [...allMemberCardDetails];
  return [copyAllMemberCardDetails.map((memberCardDetails) => {
    if (emails.get(getEmail(memberCardDetails)) === 1) {
      errorExist = true;
      return setMemberDetailsError(memberCardDetails, getEmailExistError());
    }
    if (isEmailExistError(memberCardDetails)) return clearEmailExistError(memberCardDetails);
    return memberCardDetails;
  }), errorExist];
};
