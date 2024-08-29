import Joi from 'joi';
import jsUtility from '../../utils/jsUtility';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { constructJoiObject, DESCRIPTION_VALIDATION, TEAM_NAME_VALIDATION } from '../../utils/ValidationConstants';
import { TEAMS_STRINGS } from './teams.strings';

export const createTeamBasicDetailsValidationSchema = (t) =>
  constructJoiObject({
    teamName: TEAM_NAME_VALIDATION(t).required(),
    teamDesc: DESCRIPTION_VALIDATION.label(
      TEAMS_STRINGS(t).LABEL_TEXT.TEAM_DESC,
    ).allow(EMPTY_STRING),
  }).unknown(true);

export const createOrEditTeamSecurityValidationSchema = (t) => Joi.object().keys({
  team_name: TEAM_NAME_VALIDATION(t).required(),
  description: DESCRIPTION_VALIDATION.label(
    TEAMS_STRINGS(t).LABEL_TEXT.TEAM_DESC,
  ).allow(EMPTY_STRING),
  team_type: Joi.number().required(),
  members: Joi.object()
    .keys({
      teams: Joi.array().items().min(1),
      users: Joi.array().items().min(1),
    }).min(1).label(TEAMS_STRINGS(t).VALIDATION_STRINGS.MEMBERS)
    .messages({ 'object.min': TEAMS_STRINGS(t).VALIDATION_STRINGS.MEMBER_REQUIRED })
    .required()
    .min(1),
  visibility: Joi.object().keys({
    team_type: Joi.optional(),
    all_users: Joi.when('team_type', {
      is: Joi.valid(1, 2),
      then: Joi.bool().required(),
      otherwise: Joi.string().allow(EMPTY_STRING, null),
    }),
    others: Joi.object()
      .keys({
        teams: Joi.array().items(),
        users: Joi.array().items(),
      })
      .label(TEAMS_STRINGS(t).VALIDATION_STRINGS.VISIBILITY_DATA)
      .optional(),
  }),
  owners: Joi.object().keys({
    team_type: Joi.optional(),
    all_developers: Joi.when('team_type', {
      is: 2,
      then: Joi.boolean().required(),
    }),
    members: Joi.when('team_type', {
      is: 3,
      then: Joi.bool().required(),
      otherwise: Joi.forbidden(),
    }),
    users: Joi.when('members', {
      is: true,
      then: Joi.forbidden(),
      otherwise: Joi.when('all_developers', {
        is: true,
        then: Joi.forbidden(),
        otherwise: Joi.array().max(10).label(TEAMS_STRINGS(t).VALIDATION_STRINGS.MANAGE_MEMBERS_SELECTION),
      }),
    }),
  }).required(),
});

export const constructCreateEditValidationData = (data, isPrivateTeam) => {
  const teamData = jsUtility.cloneDeep(data);
  const {
    currentMembersData: {
      userArray,
      teamsArray,
    },
    security: {
      owner,
      visibility,
    },
  } = teamData;
  const teamValidationData = {};
  const members = {};
  const visibilityData = {};
  const ownerData = {};
  const teamType = isPrivateTeam ? 3 : 2;
  teamValidationData.team_name = teamData?.teamName;
  teamValidationData.description = teamData?.teamDesc;
  teamValidationData.team_type = teamType;
  ownerData.team_type = teamType;
  visibilityData.team_type = teamType;
  if (!jsUtility.isEmpty(userArray)) {
    members.users = userArray;
  }
  if (!jsUtility.isEmpty(teamsArray)) {
    members.teams = teamsArray;
  }
  teamValidationData.members = members;
  if (!visibility?.allUsers) {
    const members = { users: [], teams: [] };
    if (visibility?.selectiveUsers) {
      members.users = (visibility?.others.users || [])?.map((eachUser) => eachUser._id);
      members.teams = (visibility?.others.teams || [])?.map((eachTeam) => eachTeam._id);
    }
    if (jsUtility.isEmpty(visibility?.others?.users)) {
      delete members.users;
    }
    if (jsUtility.isEmpty(visibility?.others?.teams)) {
      delete members.teams;
    }
    visibilityData.others = members;
  }
  if (!isPrivateTeam) {
    visibilityData.all_users = visibility?.allUsers;
    ownerData.all_developers = owner?.allDevelopers;
  } else {
    ownerData.members = owner?.members;
  }
  if (!owner?.allDevelopers && !owner?.members) {
    if (owner?.selectiveUsers) ownerData.users = (owner?.users || [])?.map((eachUser) => eachUser._id);
  }
  teamValidationData.owners = ownerData;
  teamValidationData.visibility = visibilityData;
  return teamValidationData;
};
