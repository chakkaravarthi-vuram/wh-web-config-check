import { reportError, hasOwn } from '../../utils/UtilityFunctions';

const normalizeEncryptionDetails = (content) => {
  const requiredProps = [
    'public_key',
    'pks_id',
  ];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`get encryption details failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};
export default normalizeEncryptionDetails;
