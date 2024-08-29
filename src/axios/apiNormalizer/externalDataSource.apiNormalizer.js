export const normalizeIntegrationRuleApi = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('save integration rule api dependency failed');
    return null;
  }
  return content;
};

export const normalizeDataListQueryRuleApi = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('save datalist rule api dependency failed');
    return null;
  }
  return content;
};

export const normalizeDeleteDataRuleApi = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('data data rule api dependency failed');
    return null;
  }
  return content;
};

export const normalizeRuleDetailsById = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize RuleDetailsById failed');
    return null;
  }
  return content;
};
