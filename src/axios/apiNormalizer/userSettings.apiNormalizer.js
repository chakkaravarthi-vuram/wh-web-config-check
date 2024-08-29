export const normalizeGetApiKeys = (untrustedContent) => {
    const content = untrustedContent.data.result.data;
    if (!content) {
      reportError('get API KEY failed');
      return null;
    }
    return content;
};

export const normalizePostApiKey = (untrustedContent) => {
    const content = untrustedContent.data.result.data;
    if (!content) {
      reportError('post API key failed');
      return null;
    }
    return content;
};

export const normalizeDeleteApiKey = (untrustedContent) => {
    const content = untrustedContent.data.result.data;
    if (!content) {
      reportError('delete api key failed');
      return null;
    }
    return content;
};
