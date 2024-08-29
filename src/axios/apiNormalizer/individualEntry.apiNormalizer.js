import { reportError } from '../../utils/UtilityFunctions';

const validateGetAllDashboardPages = (content) => {
  const requiredProps = [
    '_id',
    'dashboard_id',
    'name',
    'page_uuid',
    'type',
    'order',
  ];
  const missingSearchListEntries = requiredProps.filter((prop) => {
    if (!Object.hasOwn(content, prop)) {
      reportError(`validate GetAllDashboardPages failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingSearchListEntries.length > 0) return null;
  return content;
};

const validateGetDashboardField = (content) => {
  const requiredProps = ['_id'];
  const missingSearchListEntries = requiredProps.filter((prop) => {
    if (!Object.hasOwn(content, prop)) {
      reportError(`validate dashboard field failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingSearchListEntries.length > 0) return null;
  return content;
};

export const normalizeGetAllDashboardPages = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize GetAllDashboardPages failed');
    return null;
  }
  return untrustedContent.data.result.data;
};

export const normalizeGetDashboardField = (untrustedContent) => {
  const content = validateGetDashboardField(
    untrustedContent.data.result.data[0],
  );
  if (!content) {
    reportError('normalize getdashboard fields failed');
    return null;
  }
  return untrustedContent.data.result.data;
};

export const normalizeGetDashboardPageById = (untrustedContent) => {
  const content = validateGetAllDashboardPages(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError('normalize GetAllDashboardPages failed');
    return null;
  }
  return content;
};

const validateGetDashboardPageByIdForUserMode = (content) => {
  const requiredProps = [
    'active_form_content',
    'form_metadata',
    'metadata_info',
    'responseFields',
  ];
  const missingSearchListEntries = requiredProps.filter((prop) => {
    if (!Object.hasOwn(content, prop)) {
      reportError(
        `validate GetDashboardPageByIdForUserMode failed: ${prop} missing`,
      );
      return true;
    }
    return false;
  });
  if (missingSearchListEntries.length > 0) return null;
  return content;
};
export const normalizeGetDashboardPageByIdForUserMode = (untrustedContent) => {
  const content = validateGetDashboardPageByIdForUserMode(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError('normalize GetDashboardPageByIdForUserMode failed');
    return null;
  }
  return content;
};

export const normalizeSaveDashboardPages = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('post saveDashboardPages api failed');
    return null;
  }
  return content;
};

export const normalizeEntityFormDashboardPage = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('post entity from dashboard page api failed');
    return null;
  }
  return content;
};

export const normalizeDeleteDashboardPageComponent = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('post delete dashboard page component api failed');
    return null;
  }
  return content;
};

const validateGetDashboardComponent = (content) => {
  const requiredProps = [
    'field_details',
    'data_list',
    'other_field_detail',
    'rule_details',
  ];
  const missingSearchListEntries = requiredProps.filter((prop) => {
    if (!Object.hasOwn(content, prop)) {
      reportError(`validate get dashboard component failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingSearchListEntries.length > 0) return null;
  return content;
};
export const normalizeGetDashboardComponent = (untrustedContent) => {
  const content = validateGetDashboardComponent(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError('normalize get dashboard component fields failed');
    return null;
  }
  return untrustedContent.data.result.data;
};

const validateGetInstanceDetailsByID = (content) => {
  const requiredProps = ['_id', 'identifier'];
  requiredProps.forEach((prop) => {
    if (!Object.hasOwn(content, prop)) {
      reportError(`validate apiGetInstanceDetailsByID failed: ${prop} missing`);
    }
  });
  return content;
};

export const normalizeGetInstanceDetailsByID = (untrustedContent) => {
  const content = validateGetInstanceDetailsByID(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError('normalize apiGetInstanceDetailsByID failed');
    return null;
  }
  return content;
};

const validateGetDatalistEntryBasicInfo = (content) => {
  const requiredProps = ['system_identifier', 'is_editable', 'is_deletable'];
  requiredProps.forEach((prop) => {
    if (!Object.hasOwn(content, prop)) {
      reportError(`validate GetDatalistEntryBasicInfo failed: ${prop} missing`);
    }
  });
  return content;
};

export const normalizeGetDatalistEntryBasicInfo = (untrustedContent) => {
  const content = validateGetDatalistEntryBasicInfo(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError('normalize GetDatalistEntryBasicInfo failed');
    return null;
  }
  return content;
};

export const normalizeGetDatalistHistoryByUUID = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize normalizeGetDatalistHistoryByUUID failed');
    return null;
  }
  return untrustedContent.data.result.data;
};
