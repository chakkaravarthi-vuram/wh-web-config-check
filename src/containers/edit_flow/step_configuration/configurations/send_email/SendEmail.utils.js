import { nullCheck, find, remove, union, cloneDeep, isNull } from 'utils/jsUtility';
import { ACTION_TYPE } from '../../../../../utils/constants/action.constant';

export const computeUsersOrTeamsForEmail = (usersAndTeamsParam, team_or_user_param) => {
  const usersAndTeams = cloneDeep(usersAndTeamsParam);
  const team_or_user = cloneDeep(team_or_user_param);
    if (team_or_user.is_user) {
      if (nullCheck(usersAndTeams, 'users')) {
        if (
          !find(usersAndTeams.users, {
            _id: team_or_user._id,
          })
        ) usersAndTeams.users.push(team_or_user);
      } else {
        usersAndTeams.users = [];
        usersAndTeams.users.push(team_or_user);
      }
    } else if (!team_or_user.is_user) {
      if (nullCheck(usersAndTeams, 'teams')) {
        if (
          !find(usersAndTeams.teams, {
            _id: team_or_user._id,
          })
        ) usersAndTeams.teams.push(team_or_user);
      } else {
        usersAndTeams.teams = [];
        usersAndTeams.teams.push(team_or_user);
      }
    }
    return usersAndTeams;
};

export const removeUsersOrTeamsForEmail = (usersAndTeams_, id) => {
  const usersAndTeams = cloneDeep(usersAndTeams_);
  console.log('usersAndTeamsusersAndTeamsusersAndTeams', usersAndTeams);
    if (usersAndTeams.teams) {
        if (find(usersAndTeams.teams, { _id: id })) {
          remove(usersAndTeams.teams, { _id: id });
        }
      }
      if (usersAndTeams.users) {
        if (find(usersAndTeams.users, { _id: id })) {
          remove(usersAndTeams.users, { _id: id });
        }
      }
      if (usersAndTeams?.teams?.length === 0 || isNull(usersAndTeams?.teams)) delete usersAndTeams.teams;
      if (usersAndTeams?.users?.length === 0 || isNull(usersAndTeams?.users)) delete usersAndTeams.users;
      return usersAndTeams;
};

export const getUsersAndTeams = (emailUserAndTeams) => {
    let usersAndTeams = [];
  if (emailUserAndTeams && emailUserAndTeams.teams) usersAndTeams = union(usersAndTeams, emailUserAndTeams.teams);
  if (emailUserAndTeams && emailUserAndTeams.users) {
    usersAndTeams = union(usersAndTeams, emailUserAndTeams.users);
  }
  return usersAndTeams;
};

export const getActionsListFromUtils = (actions, is_initiation) => {
  const dropdownList = [];
  if (actions) {
    actions.map((actionData) => {
      if (actionData?.action_type !== ACTION_TYPE.CANCEL || !is_initiation) {
      dropdownList.push({
        label: actionData.action_name,
        value: actionData.action_uuid,
      });
    }
      return null;
    });
}
return dropdownList;
};

export default computeUsersOrTeamsForEmail;
