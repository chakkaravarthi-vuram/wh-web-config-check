import jsUtility from '../../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';

export const constructUserTeamPickerByClosedBy = (closedBy) => {
  const objUserTeamPicker = {
    users: [],
    teams: [],
  };
  if (jsUtility.isEmpty(closedBy) && !jsUtility.isObject(closedBy)) {
    return objUserTeamPicker;
  }

  // User&Teams
  if (!jsUtility.isEmpty(closedBy) && jsUtility.isObject(closedBy)) {
    const { first_name, last_name, user_type, _id, username } = closedBy;
    const objUserTeam = {
      _id,
      team_name: username,
      username,
      first_name,
      last_name,
      profile_pic: EMPTY_STRING,
    };
    if (user_type) {
      objUserTeamPicker.users.push(objUserTeam);
    } else {
      objUserTeamPicker.teams.push(objUserTeam);
    }
  }

  return objUserTeamPicker;
};
