import { reportError } from '../../utils/UtilityFunctions';
import { updateLanguageStateFromResponse } from '../../containers/admin_settings/language_and_calendar/LanguagesAndCalendar.validate.schema';
import { store } from '../../Store';

const accountLanguageData = 'Account language Data';

const validateAccountLanguageData = (content) => {
  const requiredProps = [
    'acc_language',
    'acc_locale',
    'working_days',
    'working_hour_end_time',
    'working_hour_start_time',
  ];
  const missingDataList = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`${accountLanguageData} failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;
  return content;
};

export const normalizeAccountLanguageData = (unTrustedContent) => {
  const content = validateAccountLanguageData(unTrustedContent.data.result.data);
  if (!content) {
    reportError(`normalize ${accountLanguageData} failed`);
    return null;
  }
  const normalizedData = updateLanguageStateFromResponse(content);

  return normalizedData;
};

const getUpdatedData = (data) => {
  const { language_settings } = store.getState().LanguageAndCalendarAdminReducer;
  Object.keys(data).forEach((id) => {
    language_settings[id] = data[id];
  });
  return language_settings;
};

export const normalizeUserPreferenceUpdateData = (unTrustedContent) => {
  const normalizedData = getUpdatedData(unTrustedContent.data.result.data);
  return normalizedData;
};

export default normalizeAccountLanguageData;
