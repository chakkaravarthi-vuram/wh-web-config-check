import { UTToolTipType } from '@workhall-pvt-lmt/wh-ui-library';
import i18next from 'i18next';
import { ALL_REQUESTS, DATA_LIST_DASHBOARD } from '../../../../../urls/RouteConstants';
import { get, isEmpty } from '../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { PROPERTY_PICKER_ARRAY } from '../../../../../utils/constants/form.constant';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';

export const getUserTeamList = (userTeamData) => {
  if (isEmpty(userTeamData)) return null;

  const allAvatarData = [];
  [...(userTeamData?.users || []), ...(userTeamData?.teams || [])].forEach(
    (userTeam) => {
      const userData = {
        id: userTeam?._id,
        src: userTeam?.profile_pic || EMPTY_STRING,
      };
      if (userTeam.is_user || 'username' in userTeam) {
        userData.name = `${userTeam?.first_name} ${userTeam?.last_name}`;
        userData.email = userTeam.email;
        userData.type = UTToolTipType.user;
      } else {
        userData.name = userTeam.team_name;
        userData.email = i18next.t('app_strings.create_modal.team.title');
        userData.type = UTToolTipType.team;
      }
      allAvatarData.push(userData);
    },
  );

  return allAvatarData;
};

export const getLinkForDataListInstance = (
  dataListUUID,
  dataListEntryId,
) => {
  if (dataListUUID && dataListEntryId) {
    const navLink = `${DATA_LIST_DASHBOARD}/${dataListUUID}/${ALL_REQUESTS}/${dataListEntryId}`;
    return navLink;
  }
  return null;
};

export const getFieldType = (field) => {
  if (PROPERTY_PICKER_ARRAY.includes(get(field, [RESPONSE_FIELD_KEYS.FIELD_TYPE], null))) {
    return get(field, [RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS, RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE], null);
  }
  return get(field, [RESPONSE_FIELD_KEYS.FIELD_TYPE], null);
};
