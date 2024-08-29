export const validateMLModelDetailDependency = (content) => {
  const requiredProps = ['model_code', 'events', 'samples'];
  const invalidData = requiredProps.some((prop) => {
      if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get user mfa details failed: ${prop} missing`);
      return true;
      }
      return false;
  });
  if (invalidData) return null;
  return content;
  };

const validateGetFlowList = (content) => {
  let requiredProps = ['pagination_details', 'pagination_data'];
  let invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get flow list failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (invalidData) return null;
  // check list data
  requiredProps = ['step_name', 'flow_name', 'flow_uuid'];
  invalidData = content.pagination_data.some((data) => requiredProps.some((reqProp) => {
    if (!Object.prototype.hasOwnProperty.call(data, reqProp)) {
      reportError(`validate get flow list failed: ${reqProp} missing`);
      return true;
    }
    return false;
  }));

  if (invalidData) return null;
  // check pagination details
  requiredProps = ['page', 'size', 'total_count'];
  invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content.pagination_details[0], prop)) {
      reportError(`validate get flow list failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;

  return content;
};

export const normalizeGetModelList = (untrustedContent) => {
    const content = untrustedContent.data.result.data;
    if (!content) {
      reportError('normalize get ml model list failed');
      return null;
    }
    return content;
  };

export const normalizeGetModelDetails = (untrustedContent) => {
  const content = validateMLModelDetailDependency(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize get ml model detail failed');
    return null;
  }
  return content;
};

export const normalizePostCallModelData = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize post call model failed');
    return null;
  }
  return content;
};

export const normalizeGetFlowList = (untrustedContent) => {
  const content = validateGetFlowList(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize get flow list failed');
    return null;
  }
  return content;
};
