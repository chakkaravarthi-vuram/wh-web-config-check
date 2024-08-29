import { isEmpty } from 'lodash';
import { reportError } from '../../utils/UtilityFunctions';
import { store } from '../../Store';

const validateUserPreference = (content) => {
  const requiredProps = [
    'pref_language',
    'pref_locale',
    // 'allow_update_language_locale',
    // 'allow_update_timezone',
  ];
  const missingDataList = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`User preference failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;
  return content;
};

export const normalizeUserPreference = (unTrustedContent) => {
  const content = validateUserPreference(unTrustedContent.data.result.data);
  if (!content) {
    reportError('normalize User preference failed');
    return null;
  }
  const normalizedData = {
    language_settings: content,
    pref_language: !isEmpty(content.pref_language) ? content.pref_language : null,
    pref_locale: !isEmpty(content.pref_locale) ? content.pref_locale : null,
    pref_timezone: !isEmpty(content.pref_timezone) ? content.pref_timezone : null,
    allow_update_timezone: content.allow_update_timezone,
    allow_update_language_locale: content.allow_update_language_locale,
  };
  return normalizedData;
};

const getUpdatedData = (data) => {
  const { language_settings } = store.getState().UserPreferenceReducer;
  Object.keys(data).forEach((id) => {
    language_settings[id] = data[id];
  });
  return language_settings;
};

export const normalizeUserPreferenceUpdateData = (data) => {
  const normalizedData = getUpdatedData(data);
  return normalizedData;
};

export default normalizeUserPreference;
