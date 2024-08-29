import { IGNORE_KEYS_FOR_CONDITIONAL_BUILDER } from '../../components/condition_builder/ConditionBuilder.strings';
import { hasOwn, reportError } from '../../utils/UtilityFunctions';
import { convertBeToFeKeys } from '../../utils/normalizer.utils';

export const normalizeGetSystemEvent = (res) => {
  const data = res.data?.result?.data || {};
  const requiredProps = ['_id', 'event_uuid', 'event_type'];
  let propMissing = false;

  requiredProps.forEach((prop) => {
    if (!hasOwn(data, prop)) {
        reportError(`getSystemEvent failed: ${prop} missing`);
        propMissing = true;
    }
  });

  if (propMissing) return null;
  const ignoreKeys = [...IGNORE_KEYS_FOR_CONDITIONAL_BUILDER];
  const ignoreKeysIncludingChild = ['field_metadata', 'trigger_mapping', 'document_url_details'];
  return convertBeToFeKeys(data, {}, ignoreKeys, ignoreKeysIncludingChild);
};

export const normalizeGetAllSystemEvent = (res) => {
  const data = res.data?.result?.data || {};
  let propMissing = false;

  ['pagination_data', 'pagination_details'].forEach((prop) => {
    if (!hasOwn(data, prop)) {
        reportError(`getAllSystemEvent failed: ${prop} missing`);
        propMissing = true;
    }
  });

  if (propMissing) return null;

  return convertBeToFeKeys(data);
};

export const normalizeSaveSystemEvent = (res) => {
  const data = res.data?.result?.data || {};
  return data;
};
