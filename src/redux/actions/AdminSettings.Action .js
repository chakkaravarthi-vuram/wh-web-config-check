import { ADMIN_SETTINGS } from './ActionConstants';

export const adminSettingsApiStarted = () => {
 return {
  type: ADMIN_SETTINGS.STARTED,
};
};

export const adminSettingsApiFailure = (error) => {
 return {
  type: ADMIN_SETTINGS.FAILURE,
  payload: error,
};
};

export const adminSettingsStateChange = (data) => {
  return {
   type: ADMIN_SETTINGS.STATE_CHANGE,
   payload: data,
 };
 };

export default adminSettingsApiStarted;
