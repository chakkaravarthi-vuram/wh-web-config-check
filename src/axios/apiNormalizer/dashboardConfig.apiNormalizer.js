const validateGetDefaultReport = (content) => {
  const requiredProps = ['_id', 'report', 'features'];
  const missingDashboardConfig = requiredProps.filter((prop) => {
    if (!Object.hasOwn(content, prop)) {
      reportError(`Post failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDashboardConfig.length > 0) return null;

  const requiredReportProps = ['table_columns', 'sorting'];
  const missingDashboardConfigReport = requiredReportProps.filter((prop) => {
    if (!Object.hasOwn(content.report, prop)) {
      reportError(`Post failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDashboardConfigReport.length > 0) return null;

  const requiredFeatureProps = [
    'show_task_list',
    'report_name',
    'show_download',
    'show_submit',
    'submit_button_label',
  ];
  const missingDashboardConfigFeature = requiredFeatureProps.filter((prop) => {
    if (!Object.hasOwn(content.features, prop)) {
      reportError(`Post failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDashboardConfigFeature.length > 0) return null;

  return content;
};

export const normalizeGetDefaultReportByIdApi = (untrustedContent) => {
  const content = validateGetDefaultReport(untrustedContent.data.result.data);
  if (!content) {
    reportError('get default report by id api failed');
    return null;
  }
  return content;
};

export const normalizeGetDefaultReportByUUIDApi = (untrustedContent) => {
  const content = validateGetDefaultReport(untrustedContent.data.result.data);
  if (!content) {
    reportError('get default report by uuid api failed');
    return null;
  }
  return content;
};

export const normalizeSaveDefaultReportApi = (untrustedContent) => {
  const content = validateGetDefaultReport(untrustedContent.data.result.data);
  if (!content) {
    reportError('post save default report api failed');
    return null;
  }
  return content;
};
