import { reportError, hasOwn } from '../../utils/UtilityFunctions';

const getAllTeamsApiKeyFormat = (key) => {
  const keyMappings = {
    team_name: 'teamName',
    total_member_users_count: 'totalMemberUsersCount',
    total_member_teams_count: 'totalMemberTeamsCount',
    team_type: 'teamType',
    is_active: 'isActive',
  };
  return keyMappings[key] || key;
};

export const normalizeGetAllTeamsApiResponse = (rawData) => {
  const { pagination_data, pagination_details } = rawData.data;
  const convertedData = {};

  const convertedPaginationDetails = pagination_details.map((details) => {
    const { total_count, ...rest } = details;
    return {
      ...rest,
      totalCount: total_count,
    };
  });

  convertedData.pagination_details = convertedPaginationDetails;

  const convertedPaginatedData = pagination_data.map((item) => {
    const requiredProps = [
      '_id',
      'team_name',
      'total_member_users_count',
      'total_member_teams_count',
      'description',
    ];

    requiredProps.forEach((prop) => {
      if (!item[prop]) {
        reportError(`validate GetAllTeams failed: ${prop} missing`);
      }
    });

    const convertedItem = Object.keys(item).reduce((acc, key) => {
      acc[getAllTeamsApiKeyFormat(key)] = item[key];
      return acc;
    }, {});

    return convertedItem;
  });
  convertedData.pagination_data = convertedPaginatedData;
  return convertedData;
};

const getTeamMembersApiKeyFormat = (key) => {
  const keyMappings = {
    member_type: 'memberType',
    is_active: 'isActive',
    user_type: 'userType',
    team_type: 'teamType',
    profile_pic: 'profilePic',
  };
  return keyMappings[key] || key;
};

export const normalizeGetMembersListApiResponse = (rawData) => {
  const { pagination_data, pagination_details } = rawData.data;
  const convertedData = {};

  const convertedPaginationDetails = pagination_details.map((details) => {
    const { total_count, ...rest } = details;
    return {
      ...rest,
      totalCount: total_count,
    };
  });

  convertedData.pagination_details = convertedPaginationDetails;

  const convertedPaginatedData = pagination_data.map((item) => {
    const requiredProps = [
      '_id',
      'member_type',
    ];

    requiredProps.forEach((prop) => {
      if (!item[prop]) {
        reportError(`validate GetTeamMembers failed: ${prop} missing`);
      }
    });

    const convertedItem = Object.keys(item).reduce((acc, key) => {
      acc[getTeamMembersApiKeyFormat(key)] = item[key];
      return acc;
    }, {});
    return convertedItem;
  });
  convertedData.pagination_data = convertedPaginatedData;
  return convertedData;
};

const getTeamDetailsApiKeyFormat = (key) => {
  const keyMappings = {
    team_name: 'teamName',
    is_active: 'isActive',
    team_type: 'teamType',
    created_on: 'createdOn',
    created_by: 'createdBy',
    is_edit_team: 'isEditTeam',
  };
  return keyMappings[key] || key;
};

export const normalizeGetTeamDetailsApiResponse = (rawData) => {
  const { data } = rawData.data.result;
  const requiredProps = ['_id', 'team_name', 'members', 'team_type', 'created_on', 'is_edit_team', 'created_by'];

  requiredProps.forEach((prop) => {
    if (!hasOwn(data, prop)) {
      reportError(`TeamDetailsApi failed: ${prop} missing`);
      return null;
    }
    return prop;
  });

  const normalizedData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      getTeamDetailsApiKeyFormat(key),
      value,
    ]),
  );

  return normalizedData;
};

const validateCheckTeamName = (data) => {
    const requiredProps = ['team_name'];
    requiredProps.forEach((prop) => {
        if (!hasOwn(data, prop)) {
            reportError(`validateCreateTeam failed: ${prop} missing`);
            return null;
        }
        return prop;
    });
    return data;
};

export const normalizeCheckTeamNameApi = (rawData) => {
    const data = validateCheckTeamName(rawData);
    if (!data) {
        reportError('normalize get team dependency failed');
        return null;
    }
    return data;
};

export const normalizeGetAllUsersTeamsApi = (rawData) => {
  let missingProp = null;
  const normalizedData = {};
  const requiredProps = [
    'pagination_details',
    'pagination_data',
  ];

  requiredProps.forEach((prop) => {
    if (!hasOwn(rawData, prop)) {
      missingProp = prop;
      reportError(`validate Get All Users or Teams failed: ${prop} missing`);
    }
  });
  if (missingProp) return null;
  requiredProps.forEach((prop) => {
    normalizedData[prop] = rawData[prop];
  });
  return normalizedData;
};

const validateCreateTeam = (content) => {
  const requiredProps = ['_id', 'team_name'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validateCreateTeam failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeCreateTeamApi = (unTrustedContent) => {
  const content = validateCreateTeam(unTrustedContent);
  if (!content) {
    reportError('normalizeCreateTeam failed');
    return null;
  }
  return content;
};

const validateTeamDetailsById = (content) => {
  const requiredProps = [
      '_id',
      'team_name',
      'description',
  ];

  requiredProps.forEach((prop) => {
      if (!hasOwn(content, prop)) {
          reportError(`TeamDetailsById failed: ${prop} missing`);
          return null;
      }
      return prop;
    });
    return content;
  };

const validateRemoveTeamMember = (content) => {
  const requiredProps = [
    '_id',
    'total_member_users_count',
    'total_member_teams_count',
  ];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validateRemoveTeamMember failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeTeamDetailsById = (unTrustedContent) => {
  const contentTeam = validateTeamDetailsById(unTrustedContent);

  if (!contentTeam) {
      reportError('normalize TeamDetailsById failed');
      return null;
  }

  const returnData = {
      _id: contentTeam?._id,
      team_name: contentTeam?.team_name,
      description: contentTeam?.description,
      owners: contentTeam?.owners?.users,
      team_type: contentTeam?.team_type,
  };
  return returnData;
};

export const normalizeRemoveTeamMember = (unTrustedContent) => {
  const content = validateRemoveTeamMember(unTrustedContent);
  if (!content) {
    reportError('normalizeRemoveTeamMember failed');
    return null;
  }
  return content;
};

const validateGetTeamDependency = (data) => {
  const requiredProps = ['dependency_list', 'is_blocker'];
  requiredProps.forEach((prop) => {
      if (!hasOwn(data, prop)) {
          reportError(`validateCreateTeam failed: ${prop} missing`);
          return null;
      }
      return prop;
  });
  return data;
};

export const normalizeGetTeamDependency = (rawData) => {
  const data = validateGetTeamDependency(rawData);
  if (!data) {
    reportError('normalize get team dependency failed');
    return null;
  }
  return data;
};

const validateDeactivateTeam = (data) => {
  if (!hasOwn(data, 'success')) {
    reportError('validateCreateTeam failed: success missing');
    return null;
  }
  if (data.success) {
    if (!hasOwn(data, 'result')) {
      reportError('validateCreateTeam failed: result missing');
      return null;
    }
    if (!hasOwn(data.result, 'data')) {
      reportError('validateCreateTeam failed: data missing');
      return null;
    }
    return data;
  }
  const requiredProps = ['errors', 'error_code'];
  let errors = false;
  requiredProps.forEach((prop) => {
    if (!hasOwn(data, prop)) {
      reportError(`validateCreateTeam failed: ${prop} missing`);
      errors = true;
    }
  });
  if (errors) return null;
  return data;
};

export const normalizeDeactivateTeam = (rawData) => {
  const data = validateDeactivateTeam(rawData);
  if (!data) {
    reportError('normalize get team dependency failed');
    return null;
  }
  return data;
};
