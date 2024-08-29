import i18next from 'i18next';
import { cloneDeep, get } from '../../../utils/jsUtility';

export const getUserPickerOptionList = (userOrTeams = [], documentUrlDetails = []) => {
    const optionList = [];
    userOrTeams.forEach((eachUser) => {
        const userData = {
          ...eachUser,
        };
        if (eachUser.is_user || 'username' in eachUser) {
          userData.label = `${cloneDeep(eachUser.first_name)} ${cloneDeep(eachUser.last_name)}`;
          userData.name = `${cloneDeep(eachUser.first_name)} ${cloneDeep(eachUser.last_name)}`;
          userData.id = cloneDeep(eachUser._id);
          userData.email = cloneDeep(eachUser.email);
          userData.avatar = null;
          const userOrTeamPic = documentUrlDetails?.find(
            (eachDocument) =>
              eachDocument.document_id === userData.profile_pic ||
              eachDocument.document_id === userData.team_pic,
          );
          if (get(userOrTeamPic, ['signedurl'])) userData.avatar = userOrTeamPic.signedurl;
        } else {
          userData.label = cloneDeep(eachUser.team_name);
          userData.name = cloneDeep(eachUser.team_name);
          userData.id = cloneDeep(eachUser._id);
          userData.email = i18next.t('app_strings.create_modal.team.title');
        }
        optionList.push(userData);
      });
 return optionList;
};
