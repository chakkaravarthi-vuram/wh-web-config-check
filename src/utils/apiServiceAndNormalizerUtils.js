import { nullCheck, has, translateFunction } from './jsUtility';
import { VALIDATION_CONSTANT } from './constants/validation.constant';

const reportError = (errMessage) => console.log(errMessage);

export const validatePaginationData = (paginationData, requiredProps, apiName, t = translateFunction) => {
  if (nullCheck(paginationData, 'length', true)) {
    requiredProps.forEach((requiredProp) => {
      if (!has(paginationData[0], requiredProp)) reportError(`${apiName} ${t(VALIDATION_CONSTANT.MISSING_REQUIRED_FIELD)} ${requiredProp}`);
    });
  }
  return paginationData;
};

export const validatePaginationDetails = (paginationDetails, requiredProps = ['total_count', 'page', 'size'], apiName, t = translateFunction) => {
    if (nullCheck(paginationDetails, 'length', true)) {
      requiredProps.forEach((requiredProp) => {
        if (!has(paginationDetails[0], requiredProp)) reportError(`${apiName} ${t(VALIDATION_CONSTANT.MISSING_REQUIRED_FIELD)} ${requiredProp}`);
      });
    }
    return paginationDetails;
  };

export default validatePaginationData;
