import axios from 'axios';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import { GET_USERS, ACTIVATE_OR_DEACTIVATE_USER, UPDATE_USER_TYPE, INVITE_USER, PASSWORD_RESET, RESET_MFA } from '../../urls/ApiUrls';
import {
  getCancelGetUserList,
  getCancelActivateOrDeactivateUser,
  getCancelUpdateUserType,
} from '../../containers/admin_settings/user_management/UserManagement';

import {
  getCancelTokenForInviteUser,
} from '../../containers/admin_settings/user_management/add_or_invite_members/invite_member/InviteMember';
import {
  normalizeUserList,
  normalizeActivateDeactivateUser,
  normalizeUserRoleChange,
} from '../apiNormalizer/userManagement.apiNormalizer';
import { generatePostServerErrorMessage } from '../../server_validations/ServerValidation';
import { MEMBER_CARD_LABELS } from '../../components/member_list/invite_member/inviteMemberCard.strings';
import { getLoaderConfig, updatePostLoader } from '../../utils/loaderUtils';

const { CancelToken } = axios;

export const getUserManagementData = (params) => new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_USERS,
      { params },
      {
        cancelToken: new CancelToken((c) => {
          getCancelGetUserList(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeUserList(response, params));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const activateOrDeactivateUser = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(ACTIVATE_OR_DEACTIVATE_USER, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        getCancelUpdateUserType(c);
      }),
    })
      .then((response) => {
        const normalizedData = normalizeActivateDeactivateUser(response);
        resolve(normalizedData);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const userRoleChange = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_USER_TYPE, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        getCancelActivateOrDeactivateUser(c);
      }),
    })
      .then((response) => {
        const normalizedData = normalizeUserRoleChange(response);
        resolve(normalizedData);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const inviteUserApiService = (userDetails) => new Promise((resolve, reject) => {
  axiosPostUtils(INVITE_USER, userDetails, {
    ...getLoaderConfig(),
    cancelToken: new CancelToken((c) => getCancelTokenForInviteUser(c)),
  }).then((response) => {
    updatePostLoader(false);
    resolve(response);
  }).catch((err) => {
    updatePostLoader(false);
    const error = generatePostServerErrorMessage(err, {}, MEMBER_CARD_LABELS, true);
    reject(error);
  });
});

export const resetPasswordApiService = (userDetails) => new Promise((resolve, reject) => {
  axiosPostUtils(PASSWORD_RESET, userDetails)
  .then((response) => {
    updatePostLoader(false);
    resolve(response);
  })
  .catch((error) => {
    reject(error);
  });
});

export const resetMfaApiService = (userDetails) => new Promise((resolve, reject) => {
  axiosPostUtils(RESET_MFA, userDetails)
  .then((response) => {
    resolve(response);
  })
  .catch((error) => {
    reject(error);
  });
});

export default getUserManagementData;
