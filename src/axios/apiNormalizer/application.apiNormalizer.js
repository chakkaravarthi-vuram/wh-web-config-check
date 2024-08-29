const validateGetAllApps = (content) => {
    let requiredProps = ['pagination_details', 'pagination_data'];
    let invalidData = requiredProps.some((prop) => {
      if (!Object.prototype.hasOwnProperty.call(content, prop)) {
        reportError(`validate get all apps failed: ${prop} missing`);
        return true;
      }
      return false;
    });

    if (invalidData) return null;
    // check list data
    requiredProps = ['_id', 'name', 'app_uuid'];
    invalidData = content.pagination_data.some((data) => requiredProps.some((reqProp) => {
      if (!Object.prototype.hasOwnProperty.call(data, reqProp)) {
        reportError(`validate get all apps data failed: ${reqProp} missing`);
        return true;
      }
      return false;
    }));

    if (invalidData) return null;
    // check pagination details
    requiredProps = ['page', 'size', 'total_count'];
    invalidData = requiredProps.some((prop) => {
      if (!Object.prototype.hasOwnProperty.call(content.pagination_details[0], prop)) {
        reportError(`validate get all apps data failed: ${prop} missing`);
        return true;
      }
      return false;
    });
    if (invalidData) return null;

    return content;
};

const validateGetAppData = (content) => {
  const contentIsNotArray = content?.length === undefined;
  const requiredProps = ['pagination_data', 'pagination_details'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get app data failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (invalidData && contentIsNotArray) return null;
  return content;
};

export const validateGetAppCurrentVersionData = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize get version app failed');
    return null;
  }
  return content;
};

export const validateSaveApp = (content) => {
  const requiredProps = ['_id', 'app_uuid'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate save app failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validatePublishApp = (content) => {
  const requiredProps = ['_id'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate publish data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateSavePage = (content) => {
  const requiredProps = ['_id', 'page_uuid', 'app_uuid'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate save page failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateSaveComponent = (content) => {
  const requiredProps = ['_id', 'component_uuid'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate save component failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateGetComponentById = (content) => {
  const requiredProps = ['_id', 'component_uuid'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get component by id failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateVerifyWebpageEmbeddingUrl = (content) => {
  const requiredProps = ['url'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate verify webpage embedding url failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const normalizeGetAllApps = (untrustedContent) => {
  const content = validateGetAllApps(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize get all Data failed');
    return null;
  }
  return content;
};

export const normalizeGetAllAppsForRoute = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize get all Data failed');
    return null;
  }
  return content;
};

export const normalizeGetAppData = (untrustedContent) => {
  const content = validateGetAppData(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize get app data failed');
    return null;
  }
  return content;
};

export const normalizeSaveApp = (untrustedContent) => {
  const content = validateSaveApp(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize save app failed');
    return null;
  }
  return content;
};

export const normalizeDeleteApp = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize delete app failed');
    return null;
  }
  return content;
};

export const normalizeDiscardApp = (untrustedContent) => {
  const content = untrustedContent?.data?.result?.data;
  if (!content) {
    reportError('normalize discard app failed');
    return null;
  }
  return content;
};

export const normalizePublishApp = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize publish app failed');
    return null;
  }
  return content;
};

export const normalizeSavePage = (untrustedContent) => {
  const content = validateSavePage(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize save page failed');
    return null;
  }
  return content;
};

export const normalizeDeletePage = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize delete page failed');
    return null;
  }
  return content;
};

export const normalizeUpdateAppSecurity = (untrustedContent) => {
  console.log('updtae app security failed', untrustedContent);
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize update app security failed', untrustedContent);
    return null;
  }
  return content;
};

export const normalizeSaveCoordinates = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize save Coordinates failed');
    return null;
  }
  return content;
};
export const normalizeSaveComponent = (untrustedContent) => {
  const content = validateSaveComponent(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize save component failed');
    return null;
  }
  return content;
};

export const normalizeGetPages = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize save Coordinates failed');
    return null;
  }
  return content;
};

export const normalizeGetComponentById = (untrustedContent) => {
  const content = validateGetComponentById(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize get component by ID failed');
    return null;
  }
  return content;
};

export const normalizeValidateApp = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize validate app failed');
    return null;
  }
  return content;
};

export const normalizeUpdatePageOrder = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize Update Page Order failed');
    return null;
  }
  return content;
};

export const normalizeVerifyWebpageEmbedUrlApi = (untrustedContent) => {
  const content = validateVerifyWebpageEmbeddingUrl(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize verify webpage embedding url api failed');
    return null;
  }
  return content;
};
export const normalizeUpdateAppHeader = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize Update App Header failed');
    return null;
  }
  return content;
};
