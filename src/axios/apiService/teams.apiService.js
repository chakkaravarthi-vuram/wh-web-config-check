import axios from 'axios';
import { GET_ALL_TEAMS, CHECK_TEAM_NAME, GET_TEAM_MEMBERS, GET_TEAM_BY_ID, CREATE_TEAM_API, UPDATE_TEAM_DETAILS, GET_TEAM_DETAILS_BY_ID, GET_TEAM_DEPENDENCY, DEACTIVATE_TEAM } from '../../urls/ApiUrls';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import { normalizeGetAllTeamsApiResponse, normalizeCheckTeamNameApi, normalizeGetAllUsersTeamsApi, normalizeGetMembersListApiResponse, normalizeGetTeamDetailsApiResponse, normalizeCreateTeamApi, normalizeTeamDetailsById, normalizeRemoveTeamMember, normalizeGetTeamDependency, normalizeDeactivateTeam } from '../apiNormalizer/teams.apiNormalizer';
import { normalizeIsEmpty } from '../../utils/UtilityFunctions';

const { CancelToken } = axios;
const sourceGetTeamDependency = CancelToken.source();

export const getAllTeamApiService = async (params, cancelToken) => {
  try {
    const response = await axiosGetUtils(GET_ALL_TEAMS, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelToken?.(c);
      }),
    });
    return normalizeGetAllTeamsApiResponse(response?.data?.result);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTeamMembersListApiService = async (params, cancelToken) => {
  try {
    const response = await axiosGetUtils(GET_TEAM_MEMBERS, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelToken?.(c);
      }),
    });
    return normalizeGetMembersListApiResponse(response?.data?.result);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTeamDetailsApiService = async (params, cancelToken) => {
  try {
    const response = await axiosGetUtils(GET_TEAM_BY_ID, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelToken?.(c);
      }),
    });
    return normalizeGetTeamDetailsApiResponse(response);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const checkTeamNameApi = async (teamData) => {
  try {
    const params = teamData;
    const response = await axiosGetUtils(CHECK_TEAM_NAME, { params });
    return normalizeCheckTeamNameApi(response.data.result.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSeparateUsersOrTeamsApi = async (params, URL) => {
  try {
    const response = await axiosGetUtils(URL, { params });
    return normalizeGetAllUsersTeamsApi(response?.data?.result?.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTeamsAndUsers = async (url, params, setCancelToken) => {
  try {
    const response = await axiosGetUtils(url, {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken(c);
      }),
    });
    return response?.data?.result?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const normalizeIsEmptyAsync = async (data) => new Promise((resolve, reject) => {
    normalizeIsEmpty(data, resolve, reject);
  });

export const createTeamApi = async (teamData, isEdit) => {
  try {
    const res = await axiosPostUtils(!isEdit ? CREATE_TEAM_API : UPDATE_TEAM_DETAILS, teamData);
    const normalizeData = normalizeCreateTeamApi(res.data.result.data);
    return await normalizeIsEmptyAsync(normalizeData);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const apiTeamDetailsById = async (selectedTeamId) => {
  try {
    const res = await axiosGetUtils(GET_TEAM_DETAILS_BY_ID, {
      params: { _id: selectedTeamId },
    });
    const normalizeData = normalizeTeamDetailsById(res.data.result.data);
    return await normalizeIsEmptyAsync(normalizeData);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTeamMemberApi = async (postData, url) => {
  try {
    const res = await axiosPostUtils(url, postData);
    const normalizeData = normalizeRemoveTeamMember(res.data.result.data);
    return await normalizeIsEmptyAsync(normalizeData);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTeamDependencyDetailsApi = async (params) => {
  try {
    const response = await axiosGetUtils(GET_TEAM_DEPENDENCY, {
      params,
      cancelToken: sourceGetTeamDependency.token,
    });
    return normalizeGetTeamDependency(response.data.result.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deactivateTeamApi = async (teamId) => {
  try {
    const response = await axiosPostUtils(DEACTIVATE_TEAM, { _id: teamId });
    return normalizeDeactivateTeam(response.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
