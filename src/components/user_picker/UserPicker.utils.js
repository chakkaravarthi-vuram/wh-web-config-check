import { UTToolTipType } from '@workhall-pvt-lmt/wh-ui-library';
import i18next from 'i18next';
import { cloneDeep, get } from 'utils/jsUtility';

export const SEARCH_PEOPLE = 'common_strings.search_people';

export const getUserPickerOptionList = (userOrTeams = [], documentUrlDetails = [], isUser = false) => {
    const optionList = [];
    userOrTeams.forEach((eachUser) => {
        const userData = {
          ...eachUser,
        };
        if (eachUser?.is_user || eachUser?.username || isUser) {
          let name = eachUser.email;
          if (eachUser.first_name) {
            name = eachUser.last_name ? `${eachUser.first_name} ${eachUser.last_name}` : eachUser.first_name;
          }
          userData.label = name;
          userData.type = UTToolTipType.user;
          userData.name = name;
          userData.id = cloneDeep(eachUser?._id);
          userData.email = cloneDeep(eachUser?.email);
          userData.avatar = null;
          userData.is_user = true;
          const userOrTeamPic = documentUrlDetails?.find(
            (eachDocument) =>
              eachDocument.document_id === userData.profile_pic ||
              eachDocument.document_id === userData.team_pic,
          );
          if (get(userOrTeamPic, ['signedurl'])) userData.avatar = userOrTeamPic.signedurl;
        } else {
          userData.label = cloneDeep(eachUser?.team_name);
          userData.name = cloneDeep(eachUser?.team_name);
          userData.id = cloneDeep(eachUser?._id);
          userData.type = UTToolTipType.team;
          userData.is_user = false;
          userData.email = i18next.t('app_strings.create_modal.team.title');
        }
        optionList.push(userData);
      });
 return optionList;
};

export const USER_PICKER_STRINGS = (t) => {
  return {
    ADD_USERS: t('common_strings.add_users'),
    ADD_TEAMS: t('common_strings.add_teams'),
    ADD_USERS_TEAMS: t('common_strings.add_user_and_teams'),
  };
};
