import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import gClasses from 'scss/Typography.module.scss';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import jsUtils, { isObjectFieldsEmpty, nullCheck, cloneDeep } from 'utils/jsUtility';
import UserPicker from '../../../../../../components/user_picker/UserPicker';
import { CONDITION_BASED_CONSTANTS } from '../condition_based/ConditionBased.constants';
import { FLOW_STRINGS } from '../../../../EditFlow.strings';

function ActorOrTeam(props) {
  const { assigneeIndex, assigneeErrorList = {}, onAssigneeDataChange, isRecursiveCall, recursiveIndex, parentAssigneeIndex } = props;
  const {
    data,
  } = props;

  const {
    CHILD_RULE_ASSIGNEES,
    STEP_ASSIGNEES,
    RULES,
  } = CONDITION_BASED_CONSTANTS;

  const errorMessage = isRecursiveCall ? get(assigneeErrorList, [`${STEP_ASSIGNEES},${parentAssigneeIndex},${RULES},${recursiveIndex},${CHILD_RULE_ASSIGNEES},${assigneeIndex},assignees`]) : get(assigneeErrorList, [`${STEP_ASSIGNEES},${assigneeIndex},assignees`]);
  const { t } = useTranslation();

  let usersAndTeams = [];
  const clonedData = cloneDeep(data);
  if (
    clonedData.step_assignees &&
    clonedData.step_assignees[
    assigneeIndex
    ] &&
    clonedData.step_assignees[assigneeIndex]
      .assignees &&
    clonedData.step_assignees[assigneeIndex]
      .assignees.teams
  ) {
    usersAndTeams = jsUtils.union(
      usersAndTeams,
      clonedData.step_assignees[assigneeIndex]
        .assignees.teams,
    );
  }
  console.log('usersAndTeams ACTORORTEAM', usersAndTeams, clonedData, assigneeIndex);
  if (
    clonedData.step_assignees &&
    clonedData.step_assignees[
    assigneeIndex
    ] &&
    clonedData.step_assignees[assigneeIndex]
      .assignees &&
    clonedData.step_assignees[assigneeIndex]
      .assignees.users
  ) {
    usersAndTeams = jsUtils.union(
      usersAndTeams,
      clonedData.step_assignees[assigneeIndex]
        .assignees.users,
    );
  }

  if (
    clonedData.assignees &&
    clonedData.assignees.teams
  ) {
    usersAndTeams = jsUtils.union(
      usersAndTeams,
      clonedData.assignees.teams,
    );
  }
  if (
    clonedData.assignees &&
    clonedData.assignees.users
  ) {
    usersAndTeams = jsUtils.union(
      usersAndTeams,
      clonedData.assignees.users,
    );
  }

  const onTeamOrUserSelectHandler = (event) => {
    const clonedData = cloneDeep(data);
    const team_or_user = event.target.value;
    console.log(team_or_user);
    clonedData.memberSearchValue = EMPTY_STRING;
    clonedData.selectedTeamOrUser = event.target.value;
    if (
      isObjectFieldsEmpty(
        clonedData.step_assignees[
          assigneeIndex
        ].assignees,
      )
    ) {
      clonedData.step_assignees[
        assigneeIndex
      ].assignees = {};
    }
    if (team_or_user.is_user) {
      if (
        nullCheck(
          clonedData,
          `step_assignees.${assigneeIndex}.assignees.users`,
        )
      ) {
        if (
          !jsUtils.find(
            clonedData.step_assignees[
              assigneeIndex
            ].assignees.users,
            {
              _id: team_or_user._id,
            },
          )
        ) {
          clonedData.step_assignees[
            assigneeIndex
          ].assignees.users.push(team_or_user);
        }
      } else {
        clonedData.step_assignees[
          assigneeIndex
        ].assignees.users = [];
        clonedData.step_assignees[
          assigneeIndex
        ].assignees.users.push(team_or_user);
      }
    } else if (!team_or_user.is_user) {
      if (team_or_user.user_type) {
        if (
          nullCheck(
            clonedData,
            `step_assignees.${assigneeIndex}.assignees.users`,
          )
        ) {
          if (
            !jsUtils.find(
              clonedData.step_assignees[
                assigneeIndex
              ].assignees.users,
              {
                _id: team_or_user._id,
              },
            )
          ) {
            clonedData.step_assignees[
              assigneeIndex
            ].assignees.users.push(team_or_user);
          }
        } else {
          clonedData.step_assignees[
            assigneeIndex
          ].assignees.users = [];
          clonedData.step_assignees[
            assigneeIndex
          ].assignees.users.push(team_or_user);
        }
      } else {
        if (
          nullCheck(
            clonedData,
            `step_assignees.${assigneeIndex}.assignees.teams`,
          )
        ) {
          if (
            !jsUtils.find(
              clonedData.step_assignees[
                assigneeIndex
              ].assignees.teams,
              {
                _id: team_or_user._id,
              },
            )
          ) {
            clonedData.step_assignees[
              assigneeIndex
            ].assignees.teams.push(team_or_user);
          }
        } else {
          clonedData.step_assignees[
            assigneeIndex
          ].assignees.teams = [];
          clonedData.step_assignees[
            assigneeIndex
          ].assignees.teams.push(team_or_user);
        }
      }
    }
    onAssigneeDataChange(clonedData, assigneeIndex);
  };
  const onTeamOrUserRemoveHandler = (id) => {
    const clonedData = cloneDeep(data);
    if (
      clonedData.step_assignees[assigneeIndex]
        .assignees.teams
    ) {
      if (
        jsUtils.find(
          clonedData.step_assignees[
            assigneeIndex
          ].assignees.teams,
          { _id: id },
        )
      ) {
        jsUtils.remove(
          clonedData.step_assignees[
            assigneeIndex
          ].assignees.teams,
          { _id: id },
        );
        if (
          clonedData.step_assignees[
            assigneeIndex
          ].assignees.teams.length === 0
        ) {
          delete clonedData.step_assignees[
            assigneeIndex
          ].assignees.teams;
        }
      }
    }
    if (
      clonedData.step_assignees[assigneeIndex]
        .assignees.users
    ) {
      if (
        jsUtils.find(
          clonedData.step_assignees[
            assigneeIndex
          ].assignees.users,
          { _id: id },
        )
      ) {
        jsUtils.remove(
          clonedData.step_assignees[
            assigneeIndex
          ].assignees.users,
          { _id: id },
        );
        if (
          clonedData.step_assignees[
            assigneeIndex
          ].assignees.users.length === 0
        ) {
          delete clonedData.step_assignees[
            assigneeIndex
          ].assignees.users;
        }
      }
    }
    onAssigneeDataChange(clonedData, assigneeIndex);
  };

  const selectedUsersAndTeams = () => {
    const usersAndTeamsArray = { users: [], teams: [] };
    usersAndTeams.map((u) => {
      if (u.is_user || u.username) {
        usersAndTeamsArray?.users?.push(u);
      } else if (u.team_name) {
        usersAndTeamsArray?.teams?.push(u);
      }
      return null;
    });
    return usersAndTeamsArray;
  };
  return (
    <UserPicker
      id="users"
      selectedValue={selectedUsersAndTeams()}
      errorMessage={errorMessage}
      isSearchable
      hideLabel
      className={gClasses.MT3}
      onSelect={(option) =>
        onTeamOrUserSelectHandler({ target: { value: option, id: 'users' } })
      }
      onRemove={onTeamOrUserRemoveHandler}
      noDataFoundMessage={t(FLOW_STRINGS.NO_USER_OR_TEAN_FOUND)}
    />
  );
}

export default ActorOrTeam;
ActorOrTeam.defaultProps = {};
ActorOrTeam.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  onFlowDataChange: PropTypes.func.isRequired,
};
