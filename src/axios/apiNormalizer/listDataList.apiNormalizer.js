import { hasOwn, reportError } from '../../utils/UtilityFunctions';
import jsUtils from '../../utils/jsUtility';

const validateGetAllDraftDataList = (data) => {
  if (!data.pagination_data || !data.pagination_details) return false;
  const requiredProps = [
    'version',
    'data_list_name',
    'data_list_description',
    'status',
    'has_published_version',
    'data_list_uuid',
    '_id',
  ];
  return data.pagination_data.every((element) =>
    requiredProps.every((prop) => {
      if (!Object.prototype.hasOwnProperty.call(element, prop)) {
        reportError(`validatePreSingIn failed: ${prop} missing`);
        return false;
      }
      return true;
    }));
};

const validateGetAllDataListCategory = (data) => {
  if (!data.all_data_list_details) return false;
  const requiredProps = ['data_lists'];
  return data.all_data_list_details.every((element) => requiredProps.every((prop) => {
    if (!jsUtils.isEmpty(element) && !Object.prototype.hasOwnProperty.call(element, prop)) {
      reportError(`validate get all datalist by category failed: ${prop} missing`);
      return false;
    }
    return true;
  }));
};

export const normalizeGetAllDraftDataList = (rawResponse) => {
  const validatedData = validateGetAllDraftDataList(
    rawResponse.data.result.data,
  );
  if (!validatedData) {
    reportError('normalize AllFieldsList failed');
    return null;
  }
  return rawResponse.data.result.data;
};

export const normalizeGetAllDataListCategory = (rawResponse) => {
  const validatedData = validateGetAllDataListCategory(
    rawResponse.data.result.data,
  );
  if (!validatedData) {
    reportError('normalize AllFieldsList failed');
    return null;
  }
  return rawResponse.data.result.data;
};

export const normalizeGetAllDevDatalistApi = (rawData) => {
  let missingProp = null;
  const normalizedData = {};
  const requiredProps = [
    'pagination_details',
    'pagination_data',
  ];

  requiredProps.forEach((prop) => {
    if (!hasOwn(rawData, prop)) {
      missingProp = prop;
      reportError(`validate Get All dev datalist failed: ${prop} missing`);
    }
  });
  if (missingProp) return null;
  requiredProps.forEach((prop) => {
    normalizedData[prop] = rawData[prop];
  });
  return normalizedData;
};
