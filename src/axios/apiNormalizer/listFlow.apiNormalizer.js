import { hasOwn, reportError } from '../../utils/UtilityFunctions';
import jsUtils from '../../utils/jsUtility';

const validateGetAllDraftFlow = (data) => {
  if (!data.pagination_data || !data.pagination_details) return false;
  const requiredProps = ['version', 'flow_name', 'flow_description', 'status', 'has_published_version', 'flow_uuid', '_id'];
  return data.pagination_data.every((element) => requiredProps.every((prop) => {
    if (!Object.prototype.hasOwnProperty.call(element, prop)) {
      reportError(`validatePreSingIn failed: ${prop} missing`);
      return false;
    }
    return true;
  }));
};

const validateGetAllFlowCategoryApiService = (data) => {
  if (!data.all_flow_details) return false;
  const requiredProps = ['flows'];
  return data.all_flow_details.every((element) => requiredProps.every((prop) => {
    if (!jsUtils.isEmpty(element) && !Object.prototype.hasOwnProperty.call(element, prop)) {
      reportError(`validatePreSingIn failed: ${prop} missing`);
      return false;
    }
    return true;
  }));
};

export const normalizeGetAllDraftFlow = (rawResponse) => {
  const validatedData = validateGetAllDraftFlow(rawResponse.data.result.data);
  if (!validatedData) {
    reportError('normalize AllFieldsList failed');
    return null;
  }
  return rawResponse.data.result.data;
};

export const normalizeGetAllFlowCategoryApiService = (rawResponse) => {
  const validatedData = validateGetAllFlowCategoryApiService(rawResponse.data.result.data);
  if (!validatedData) {
    reportError('normalize AllFieldsList failed');
    return null;
  }
  return rawResponse.data.result.data;
};

export const normalizeGetAllDevFlowApi = (rawData) => {
  let missingProp = null;
  const normalizedData = {};
  const requiredProps = [
    'pagination_details',
    'pagination_data',
  ];

  requiredProps.forEach((prop) => {
    if (!hasOwn(rawData, prop)) {
      missingProp = prop;
      reportError(`validate Get All dev Flow failed: ${prop} missing`);
    }
  });
  if (missingProp) return null;
  requiredProps.forEach((prop) => {
    normalizedData[prop] = rawData[prop];
  });
  return normalizedData;
};
