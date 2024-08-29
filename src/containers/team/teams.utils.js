import React from 'react';
import { AvatarGroup, AvatarSizeVariant, Checkbox, Text, UTToolTipType } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import Trash from '../../assets/icons/application/Trash';
import BasicDetailsIcon from '../../assets/icons/teams/BasicDetailsIcon';
import DeleteTeamIcon from '../../assets/icons/teams/DeleteTeamIcon';
import jsUtility, { translateFunction } from '../../utils/jsUtility';
import { DROPDOWN_CONSTANTS, EMPTY_STRING, TEAM_TYPE_STRINGS, USER_TYPE_STRINGS } from '../../utils/strings/CommonStrings';
import { TEAMS_STRINGS, TEAM_MEMBER_PATH } from './teams.strings';
import { ELLIPSIS_CHARS } from '../../utils/Constants';

export const getMoreOptionTeamHeaders = (isEdit, t) => {
    const optionList = [
        {
            label: TEAMS_STRINGS(t).UTILS_CONSTANTS.EDIT_BASIC_SETTINGS,
            icon: <BasicDetailsIcon />,
            value: 'Edit Basic',
            isChecked: false,
        },
    ];
    if (isEdit) {
        optionList.push({
            label: TEAMS_STRINGS(t).UTILS_CONSTANTS.DELETE_TEAM,
            icon: <Trash />,
            value: 2,
            isChecked: false,
        });
    }
    return optionList;
};

export const teamManageMembersTab = (t, isNormalUserMode = false) => {
    const tabsData = [
        {
            labelText: TEAMS_STRINGS(t).UTILS_CONSTANTS.USERS,
            value: 1,
            tabIndex: 1,
            isEditable: false,
        },
        {
            labelText: TEAMS_STRINGS(t).UTILS_CONSTANTS.TEAMS,
            value: 2,
            tabIndex: 2,
            isEditable: false,
        },
    ];
    if (isNormalUserMode) tabsData.splice(1, 1);
    return tabsData;
};

export const getSelectedTeamMembersHeader = (isEdit, t, isUser) => {
  const teamHeader = [
    {
        id: 'members',
        label: isUser ? TEAMS_STRINGS(t).UTILS_CONSTANTS.USERS : TEAMS_STRINGS(t).UTILS_CONSTANTS.TEAMS,
        widthWeight: 7,
    },
    {
        id: 'member_type',
        label: isUser ? TEAMS_STRINGS(t).UTILS_CONSTANTS.USER_TYPE : TEAMS_STRINGS(t).UTILS_CONSTANTS.TEAM_TYPE,
        widthWeight: 3,
    },
    {
      id: EMPTY_STRING,
      label: EMPTY_STRING,
    },
  ];
  if (isEdit) {
    teamHeader.unshift({
      id: '',
      label: '',
    });
  }
  return teamHeader;
};

export const getTableMembersTeamsHeader = (isSelectAll, onSelectAllClicked, t, color, searchValue) => [
    {
      id: 'select_all',
      label: EMPTY_STRING,
      component: jsUtility.isEmpty(searchValue) ? <Checkbox color={color} onClick={() => onSelectAllClicked(isSelectAll)} isValueSelected={isSelectAll} details={{ label: '', value: '' }} /> : null,
      widthWeight: 1,
    },
    {
      id: 'member_details',
      label: TEAMS_STRINGS(t).UTILS_CONSTANTS.MEMBER_DETAILS,
      widthWeight: 9,
    },
];

const getMemberType = (memberType, isUser) => {
    if (isUser) return USER_TYPE_STRINGS[memberType];
    else return TEAM_TYPE_STRINGS[memberType];
};

export const getFormattedMemberData = (memberData, isUser, selectAllChecked = false, selectedData = [], excludeUser = [], deletedMember = {}, t) => {
  const memberDetails = jsUtility.cloneDeep(memberData);
  if (!jsUtility.isEmpty(memberDetails)) {
    const memberArray = [];
    memberDetails?.forEach((member) => {
      let checked = false;
      if (selectAllChecked && excludeUser.includes(member._id)) checked = false;
      else if (selectedData.includes(member._id)) checked = true;
      else if (selectAllChecked) checked = true;
      const memberObject = {};
      if (!jsUtility.isEmpty(deletedMember) && (deletedMember?.users?.includes(member._id) || deletedMember?.teams?.includes(member._id))) {
        memberObject.deleteChecked = true;
      } else memberObject.deleteChecked = false;
      if (isUser) {
        memberObject.id = member._id;
        memberObject.fullName = member.full_name;
        memberObject.profile = member.profile_pic;
        memberObject.email = member.email;
        memberObject.isUser = true;
        memberObject.isChecked = checked;
        memberObject.memberType = getMemberType(member?.user_type, true);
      } else {
        memberObject.memberType = getMemberType(member?.team_type, false);
        memberObject.isChecked = checked;
        memberObject.isUser = false;
        memberObject.email = `${member.total_member_teams_count + member.total_member_users_count} ${t('team.listing.table_headers.members')}`;
        memberObject.fullName = member.team_name;
        memberObject.id = member._id;
        memberObject.profile = EMPTY_STRING;
      }
      memberArray.push(memberObject);
    });
    return memberArray;
  }
  return [];
};

export const memberDetailsCard = (member, colorScheme) => {
  const userImage = [{
    name: member.fullName,
    src: '',
    id: member._id,
    type: member?.isUser ? UTToolTipType.user : UTToolTipType.team,
  }];
  return (
    <div className={gClasses.CenterV}>
      <AvatarGroup
        allAvatarData={userImage}
        size={AvatarSizeVariant.sm}
        colorScheme={colorScheme}
        className={cx(gClasses.MR12)}
      />
      <div>
        <Text content={member.fullName} />
        <Text content={member.email} className={gClasses.FTwo12GrayV86} />
      </div>
    </div>
  );
};

export const constructCreateEditPostData = (createEditState, isPrivateTeam, teamId) => {
  const { security, manageMembersData } = jsUtility.cloneDeep(createEditState);
  const visibility = {};
  const owners = {};
  const all_members = {};
  const members = {};
  visibility.members = security?.visibility?.members;
  if (!security?.visibility?.allUsers) {
    const members = { users: [], teams: [] };
    members.users = (security?.visibility?.others.users || [])?.map((eachUser) => eachUser._id);
    members.teams = (security?.visibility?.others.teams || [])?.map((eachTeam) => eachTeam._id);
    if (jsUtility.isEmpty(security?.visibility?.others?.users)) {
      delete members.users;
    }
    if (jsUtility.isEmpty(security?.visibility?.others?.teams)) {
      delete members.teams;
    }
    visibility.others = members;
  }
  if (!isPrivateTeam) {
    visibility.all_users = security?.visibility?.allUsers;
    owners.all_developers = security?.owner?.allDevelopers;
  } else {
    owners.members = security?.owner?.members;
    delete visibility?.others;
  }
  if (!security?.owner?.allDevelopers && !security?.owner?.members) {
    owners.users = (security?.owner?.users || [])?.map((eachUser) => eachUser._id);
  }
  all_members.is_all_users = manageMembersData?.selectAllUsersChecked;
  if (!isPrivateTeam) all_members.is_all_teams = manageMembersData?.selectAllTeamsChecked;
  if (manageMembersData?.selectAllUsersChecked && !jsUtility.isEmpty(manageMembersData?.excludeUsers)) all_members.excluded_users = manageMembersData?.excludeUsers;
  if (manageMembersData?.selectAllTeamsChecked && !jsUtility.isEmpty(manageMembersData?.excludeTeams)) all_members.excluded_teams = manageMembersData?.excludeTeams;
  if (!jsUtility.isEmpty(manageMembersData?.selectedUsers)) members.users = manageMembersData?.selectedUsers;
  if (!jsUtility.isEmpty(manageMembersData?.selectedTeams)) members.teams = manageMembersData?.selectedTeams;
  const postData = {
    team_name: createEditState?.teamName,
    team_type: isPrivateTeam ? 3 : 2,
    visibility,
    owners,
    all_members,
  };
  if (!jsUtility.isEmpty(members) && !teamId) {
    postData.members = members;
  }
  if (teamId) {
    delete postData.team_type;
    delete postData.all_members;
    postData._id = teamId;
    const addData = {
      members,
      all_members,
    };
    if (jsUtility.isEmpty(members)) delete addData.members;
    postData.add_members = addData;
  }
  if (!jsUtility.isEmpty(createEditState?.teamDesc)) postData.description = createEditState?.teamDesc;
  if (teamId && jsUtility.isEmpty(createEditState?.teamDesc)) postData.description = null;
  return postData;
};

export const setEditTeamData = (teamDetails, isNormalMode) => {
  const ownerData = {};
  const visibilityData = {};
  const otherVisibility = { users: [], teams: [] };
  const common = {};
  ownerData.allDevelopers = teamDetails?.owners?.all_developers || false;
  ownerData.selectiveUsers = !teamDetails?.owners?.all_developers;
  ownerData.users = teamDetails?.owners?.users?.map((user) => { return { ...user, is_user: true, noDelete: teamDetails?.createdBy?._id === user._id }; }) || [];
  ownerData.members = teamDetails?.owners?.members || false;
  visibilityData.allUsers = teamDetails?.visibility?.all_users || false;
  visibilityData.members = teamDetails?.visibility?.members;
  common.teamName = teamDetails?.teamName || EMPTY_STRING;
  common.teamDesc = teamDetails?.description || EMPTY_STRING;
  common.createdBy = [{ ...teamDetails?.createdBy, is_user: true, noDelete: true, label: `${teamDetails?.createdBy?.first_name} ${teamDetails?.createdBy?.last_name}`, name: `${teamDetails?.createdBy?.first_name} ${teamDetails?.createdBy?.last_name}`, id: teamDetails?.createdBy?._id }];
  otherVisibility.users = teamDetails?.visibility?.others?.users?.map((user) => { return { ...user, is_user: true, noDelete: teamDetails?.createdBy?._id === user._id }; }) || [];
  otherVisibility.teams = teamDetails?.visibility?.others?.teams?.map((team) => { return { ...team, is_user: false, noDelete: false }; }) || [];
  visibilityData.selectiveUsers = !teamDetails?.visibility?.all_users;
  if (isNormalMode) {
    const createdUser = [{ ...teamDetails?.createdBy, is_user: true, noDelete: true, label: `${teamDetails?.createdBy?.first_name} ${teamDetails?.createdBy?.last_name}`, name: `${teamDetails?.createdBy?.first_name} ${teamDetails?.createdBy?.last_name}`, id: teamDetails?.createdBy?._id }];
    otherVisibility.users = createdUser;
    ownerData.users = createdUser;
  }
  visibilityData.others = otherVisibility;
  return { ownerData, visibilityData, common };
};

export const getTeamOwnerOptionsList = (t, owners, readOnlySecurity, isPrivateTeam) => {
  const otherTeams = [
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('team.create_edit_team.security.all_admin'),
      value: 1,
      description: t('team.create_edit_team.security.all_admin_description'),
      disabled: true,
      selected: true,
    },
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('team.create_edit_team.security.all_developers'),
      description: t('team.create_edit_team.security.all_developers_description'),
      value: readOnlySecurity ? EMPTY_STRING : 2,
      selected: owners?.allDevelopers,
      disabled: readOnlySecurity,
    },
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('team.create_edit_team.security.selective_developers'),
      description: t('team.create_edit_team.security.selective_developers_description'),
      value: readOnlySecurity ? EMPTY_STRING : 3,
      selected: owners?.selectiveUsers,
      disabled: readOnlySecurity,
    },
  ];
  const privteTeam = [
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('team.create_edit_team.security.all_admin'),
      value: 1,
      description: t('team.create_edit_team.security.all_admin_description'),
      disabled: true,
      selected: true,
    },
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('team.create_edit_team.security.all_team_members'),
      description: t('team.create_edit_team.security.all_team_members_description'),
      value: readOnlySecurity ? EMPTY_STRING : 5,
      disabled: readOnlySecurity,
      selected: owners?.members,
    },
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('team.create_edit_team.security.team_creator'),
      description: t('team.create_edit_team.security.team_creator_description'),
      value: readOnlySecurity ? EMPTY_STRING : 3,
      selected: owners?.selectiveUsers,
      disabled: true,
    },
  ];
  if (isPrivateTeam) return privteTeam;
  else return otherTeams;
};

export const getTeamSecurityVisibilityOption = (t, visibility, readOnlySecurity, isPrivateTeam = false) => {
  const securityOptions = [
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: TEAMS_STRINGS(t).UTILS_CONSTANTS.ALL_ADMIN,
      value: 1,
      description: TEAMS_STRINGS(t).UTILS_CONSTANTS.ALL_ADMIN_DESCRIPTION,
      disabled: true,
      selected: true,
    },
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: TEAMS_STRINGS(t).UTILS_CONSTANTS.ALL_DEVELOPERS,
      description: TEAMS_STRINGS(t).UTILS_CONSTANTS.ALL_DEVELOPERS_DESCRIPTION,
      value: 2,
      disabled: true,
      selected: true,
    },
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: TEAMS_STRINGS(t).UTILS_CONSTANTS.ALL_STANDARD_USERS,
      description: TEAMS_STRINGS(t).UTILS_CONSTANTS.ALL_STANDARD_USERS_DESCRIPTION,
      value: readOnlySecurity ? EMPTY_STRING : 3,
      selected: visibility?.allUsers,
      disabled: readOnlySecurity,
    },
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: TEAMS_STRINGS(t).UTILS_CONSTANTS.SELECTIVE_MEMBERS,
      description: TEAMS_STRINGS(t).UTILS_CONSTANTS.SELECTIVE_MEMBERS_DESCRIPTION,
      value: readOnlySecurity ? EMPTY_STRING : 4,
      selected: visibility?.selectiveUsers,
      disabled: readOnlySecurity,
    },
  ];

  const teamSecurityOptions = [
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: TEAMS_STRINGS(t).UTILS_CONSTANTS.ALL_ADMIN,
      value: 1,
      description: TEAMS_STRINGS(t).UTILS_CONSTANTS.ALL_ADMIN_DESCRIPTION,
      disabled: true,
      selected: true,
    },
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: TEAMS_STRINGS(t).UTILS_CONSTANTS.ALL_TEAM_MEMBERS,
      description: TEAMS_STRINGS(t).UTILS_CONSTANTS.ALL_TEAM_MEMBERS_DESCRIPTION,
      value: readOnlySecurity ? EMPTY_STRING : 2,
      disabled: readOnlySecurity,
      selected: visibility?.members,
    },
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: TEAMS_STRINGS(t).UTILS_CONSTANTS.TEAM_CREATOR,
      description: TEAMS_STRINGS(t).UTILS_CONSTANTS.TEAM_CREATOR_DESCRIPTION,
      value: readOnlySecurity ? EMPTY_STRING : 4,
      selected: visibility?.selectiveUsers,
      disabled: true,
    },
  ];
  if (isPrivateTeam) {
    return teamSecurityOptions;
  } else return securityOptions;
};

export const TEAM_TABS = {
  ORGANISATIONAL: 'public-teams',
  SYSTEM: 'system-teams',
  PRIVATE: 'private-teams',
  CREATE: 'create-team',
  EDIT: 'edit-team',
};
export const TEAMS_PUBLIC_URL = '/teams/public-teams';
export const getTeamType = (tab) => {
  if (TEAM_TABS.PRIVATE === tab) return [3];
  else if (TEAM_TABS.SYSTEM === tab) return [1];
  else return [2];
};

export const getTeamName = (tab, t) => {
  if (TEAM_TABS.SYSTEM === tab) return t(TEAM_MEMBER_PATH.SYSTEM);
  else return t(TEAM_MEMBER_PATH.ORGANISATIONAL);
};

export const getTabUrl = (currentTab) => {
  if (currentTab === '1') return '/teams/system-teams';
  else if (currentTab === '2') return '/teams/public-teams';
  else return '/';
};

export const getCurrentTeamLabel = (teamType, t) => {
  let currentTeamLabel;
  if (teamType === 1) currentTeamLabel = t(TEAM_MEMBER_PATH.SYSTEM);
  else if (teamType === 2) currentTeamLabel = t(TEAM_MEMBER_PATH.ORGANISATIONAL);
  else currentTeamLabel = t(TEAM_MEMBER_PATH.PRIVATE);
  return currentTeamLabel;
};

export const getBreadcrumbData = (teamName, teamType, t, isBasicUser) => [
  { text: TEAMS_STRINGS(t).TEAMS_LISTING.HOME, className: gClasses.FontSize12 },
  { text: getCurrentTeamLabel(teamType, t), className: gClasses.FontSize12, isText: isBasicUser },
  { text: teamName, isText: true, className: gClasses.FontSize12 },
];

export const SettingsDropdown = (t) => [
  {
    icon: <BasicDetailsIcon />,
    title: TEAMS_STRINGS(t).UTILS_CONSTANTS.EDIT_TEAM,
    value: 1,
  },
  {
    icon: <DeleteTeamIcon />,
    title: TEAMS_STRINGS(t).UTILS_CONSTANTS.DELETED_TEAM,
    value: 2,
  },
];

export const getTableTeamsHeader = (t = translateFunction) => [
  {
    id: 'members',
    label: TEAMS_STRINGS(t).UTILS_CONSTANTS.MEMBER,
    widthWeight: 9,
    sortBy: 'name',
    sortOrder: 'asc',
    active: true,
    bodyStyleConfig: { isChangeIconColorOnHover: true },
  },
  {
    id: 'member_type',
    label: TEAMS_STRINGS(t).UTILS_CONSTANTS.MEMBERS_TYPE,
    widthWeight: 1,
    sortBy: 'user_type',
    sortOrder: 'desc',
    bodyStyleConfig: { isChangeIconColorOnHover: true },
  },
];

export const getTeamlistUrl = (selectedCardTab) => {
  if (selectedCardTab === 1) return TEAM_TABS.PUBLIC;
  if (selectedCardTab === 2) return TEAM_TABS.SYSTEM;
  if (selectedCardTab === 3) return TEAM_TABS.PRIVATE;
  return null;
};

export const getTeamButtonTitleText = (isUser, TEAMS_STRINGS) => {
  const { ADD_USERS, ADD_TEAMS } = TEAMS_STRINGS;
  let displayText = EMPTY_STRING;
  if (isUser) displayText = ADD_USERS;
  else displayText = ADD_TEAMS;
  return displayText;
};

export const isManageMembersButtonDeactivated = (stateData, isUser) => {
  let isDisabled = true;
  if (isUser) {
    if (!jsUtility.isEmpty(stateData?.selectedUsers) || stateData?.selectAllUsersChecked) {
      isDisabled = false;
    }
  } else if (!jsUtility.isEmpty(stateData?.selectedTeams) || stateData?.selectAllTeamsChecked) {
    isDisabled = false;
  }
  return isDisabled;
};

export const isCreateVisible = (tab) => Number(tab) === 2;

export const constructAddTask = ({
  createdBy,
  createdOn,
  teamName,
  isActive,
  teamType,
  isEditTeam,
  ...otherTeamDetails
}) => {
  return {
    created_by: createdBy,
    created_on: createdOn,
    team_name: teamName,
    team_type: teamType,
    is_active: isActive,
    is_edit_team: isEditTeam,
    ...otherTeamDetails,
  };
};

export const generateContent = (teamDesc, buttonText, showFullText) => {
  if (teamDesc.length <= ELLIPSIS_CHARS.MAX) {
    return teamDesc;
  } else if (teamDesc.length > ELLIPSIS_CHARS.MAX && !showFullText) {
    return (
      <div>
        {`${teamDesc.slice(0, ELLIPSIS_CHARS.MAX)}...`}
        {buttonText}
      </div>
    );
  } else {
    return (
      <div>
        {teamDesc}
        {buttonText}
      </div>
    );
  }
};
