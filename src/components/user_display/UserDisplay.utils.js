import { getFullName } from 'utils/generatorUtils';
import jsUtils from '../../utils/jsUtility';

export const getTeamName = (team) => {
    if (!team || !team.team_name) return '';
   return team.team_name;
};
export const getUserCount = (userAndTeamList = [], maxCharLimit = 0, separator = ', ') => {
    const userListLength = userAndTeamList.length;
    let concatUsername = '';
    let count = 0;
    if (userListLength <= 0) return 0;

    for (let i = 0; i < userListLength; i++) {
       concatUsername = `${concatUsername}${
            (jsUtils.has(userAndTeamList[i], ['team_name'])) ?
            getTeamName(userAndTeamList[i]) :
            getFullName(userAndTeamList[i].first_name, userAndTeamList[i].last_name)
        }`;

       if (concatUsername.length > maxCharLimit) break;

       count++;

       if (i !== userListLength - 1) concatUsername = `${concatUsername}${separator}`;
    }
   if (userListLength > 0 && count === 0) return 1;

    return count;
};
