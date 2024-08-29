import axios from 'axios';
import jsUtility, { isArray } from 'utils/jsUtility';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import {
  GET_USER_ROLE,
  GET_BUSINESS_UNIT,
  ADD_NEW_ROLE,
  ADD_NEW_BUSINESS_UNIT,
  ADD_NEW_MEMBER,
  VALIDATE_USER_NAME,
  VALIDATE_EMAIL,
  GET_USERS_BY_ID,
  UPDATE_USER,
} from '../../urls/ApiUrls';
import {
  normalizeGetUserRoles,
  normalizeGetBusinessUnits,
  normalizePostAddNewRole,
  normalizePostAddNewBusinessUnit,
  normalizeAddUser,
  normalizePostCheckUserNameExist,
  normalizePostCheckEmailExist,
  normalizeGetUserData,
  normalizeUpdateUser,
} from '../apiNormalizer/addMember.apiNormalizer';

const { CancelToken } = axios;
const setSource = () => CancelToken.source();

  let sourceGetBusisnessUnits;
  let sourcePostAddNewRole;
  let sourcePostAddNewBusinessUnit;
  let sourcePostAddNewUser;
  let sourcePostCheckUserNameExist;
  let sourceEditUser;
  let sourcePostCheckEmailExist;

export const getUserRoles = () => new Promise((resolve, reject) => {
    axiosGetUtils(GET_USER_ROLE)
      .then((res) => {
        resolve(normalizeGetUserRoles(res));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getUserData = (params, setCancelToken) => {
  let cancelToken;
  if (setCancelToken) {
    cancelToken = new CancelToken((c) => setCancelToken(c));
  }
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_USERS_BY_ID, { params }, { cancelToken })
      .then((res) => {
        resolve(normalizeGetUserData(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getBusinessUnits = () => {
  sourceGetBusisnessUnits = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_BUSINESS_UNIT, {
      cancelToken: sourceGetBusisnessUnits.token,
    })
      .then((res) => {
        resolve(normalizeGetBusinessUnits(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateNewRole = (data) => {
  sourcePostAddNewRole = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(ADD_NEW_ROLE, data, { cancelToken: sourcePostAddNewRole.token })
      .then((response) => {
        const normalizedData = normalizePostAddNewRole(response);
        resolve(normalizedData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateBusinessUnit = (data) => {
  sourcePostAddNewBusinessUnit = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(ADD_NEW_BUSINESS_UNIT, data, { cancelToken: sourcePostAddNewBusinessUnit.token })
      .then((response) => {
        const normalizedData = normalizePostAddNewBusinessUnit(response);
        resolve(normalizedData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const editUser = (data) => {
  sourceEditUser = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_USER, data, { cancelToken: sourceEditUser.token })
      .then((response) => {
        const normalizedData = normalizeUpdateUser(response);
        resolve(normalizedData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateUser = (data) => {
  sourcePostAddNewUser = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(ADD_NEW_MEMBER, data, { cancelToken: sourcePostAddNewUser.token })
      .then((response) => {
        const normalizedData = normalizeAddUser(response);
        resolve(normalizedData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const checkUserNameExist = (data) => {
  sourcePostCheckUserNameExist = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(VALIDATE_USER_NAME, data, { cancelToken: sourcePostCheckUserNameExist.token })
      .then((response) => {
        const normalizedData = normalizePostCheckUserNameExist(response);
        resolve(normalizedData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const checkEmailExist = (data) => {
  sourcePostCheckEmailExist = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(VALIDATE_EMAIL, data, { cancelToken: sourcePostCheckEmailExist.token })
      .then((response) => {
        const normalizedData = normalizePostCheckEmailExist(response);
        resolve(normalizedData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getDatalistValidCheckData = (apiUrl, apiParams, searchValue, selectedData, removeSelectedUser, getCancelToken, allowOnlySingleSelection = true) => {
  const params = {
    size: 1000,
    page: 1,
    ...apiParams,
  };
  if (searchValue) params.search = searchValue;
  axiosGetUtils(apiUrl,
    { params },
    {
    cancelToken: new CancelToken((c) => {
      getCancelToken(c);
    }),
  })
  .then((response) => {
    const responseData = jsUtility.get(response, ['data', 'result', 'data', 'pagination_data']);
    if (!jsUtility.isEmpty(responseData)) {
      const selectedValue = selectedData[0].value;
      if (!allowOnlySingleSelection) {
        if (!jsUtility.isEmpty(selectedData)) {
          const identicalArray = [];
          responseData.forEach((res) => {
            selectedData.forEach((selective) => {
              if (res._id === selective.value) {
                identicalArray.push(selective);
              }
            });
          });
          let selectedRows = [];
          selectedRows = selectedData.filter((selectedVal) => !identicalArray.find((e) => e.value === selectedVal.value));
          if (!jsUtility.isEmpty(selectedRows)) {
            selectedRows.forEach((data) => {
              removeSelectedUser(data.value);
            });
          }
        }
      } else {
        if (!jsUtility.isEmpty(selectedValue) && responseData && !responseData.some((value) => value._id === selectedValue)) {
          removeSelectedUser(selectedValue);
        }
      }
    } else {
      if (!allowOnlySingleSelection) {
        isArray(selectedData) && selectedData.forEach((data) => {
          removeSelectedUser(data.value);
        });
      } else {
        const selectedValue = selectedData[0].value;
        removeSelectedUser(selectedValue);
      }
    }
  })
  .catch((error) => {
    console.log(error);
  });
};

export default getUserRoles;
