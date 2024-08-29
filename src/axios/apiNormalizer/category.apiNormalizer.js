import { reportError } from '../../utils/UtilityFunctions';

export const normalizeEditCategory = (untrustedContent) => {
    const content = untrustedContent.data.result.data;
    if (!content) {
      reportError('add new note fixed');
      return null;
    }
    return content;
  };

export const normalizeDeleteCategory = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('add new note fixed');
    return null;
  }
  return content;
};
