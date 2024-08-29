import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { has } from 'utils/jsUtility';
import { TOOL_TIP_TYPE } from 'utils/Constants';
import gClasses from 'scss/Typography.module.scss';
import EachRemainingUserTooltip from './eachRemainingUserTooltip.jsx/EachRemainingUserTooltip';
import styles from './CustomRemainingUsersTooltip.module.scss';

function CustomRemainingUsersTooltip(props) {
    const { isCustomInnerClass, remainingUsers, isText, userListClassName } = props;
  const getEachUser = (eachUser) => {
    if (isText) {
      return (
        <div
          id={eachUser.id}
          className={cx(gClasses.FTwo13BlackV6, styles.TextTooltip)}
        >
          {eachUser.label}
        </div>
      );
    } else {
      let userDetails = {};
      let teamDetails = {};
      let userOrTeam = TOOL_TIP_TYPE.USER;
      if (has(eachUser, ['team_name']) || has(eachUser, ['Teams.identifier']) || eachUser.teamName ||
        eachUser['CurrentActivityUsersTeams.CurrentActivityUserTeamsType'] === TOOL_TIP_TYPE.TEAM) {
        userOrTeam = TOOL_TIP_TYPE.TEAM;
        teamDetails = eachUser;
      } else {
        userDetails = eachUser;
      }
      return (
        <EachRemainingUserTooltip
          id={
            eachUser['Users.identifier'] ||
            eachUser['CurrentActivityUsersTeams.CurrentActivityUserTeamsValue'] ||
            eachUser._id ||
            eachUser.id ||
            eachUser['Teams.identifier']
          }
          userDetails={userDetails}
          teamDetails={teamDetails}
          isCustomInnerClass={isCustomInnerClass}
          userOrTeam={userOrTeam}
        />
      );
    }
  };
    const getToolTip = () => {
        const usersDisplay = [];
        remainingUsers && remainingUsers.forEach((eachUser) => {
            usersDisplay.push(getEachUser(eachUser));
        });
        return (
          <div className={styles.WrapperContainer}>
          <div className={cx(styles.ToolTipContainer, userListClassName)}>{usersDisplay}</div>
          </div>
        );
    };

    return (
        <>
          {getToolTip()}
        </>
    );
}

const mapStateToProps = (state) => {
    return {
      userId: state.RoleReducer.user_id,
    };
  };

  export default connect(
    mapStateToProps,
  )(withRouter(CustomRemainingUsersTooltip));
