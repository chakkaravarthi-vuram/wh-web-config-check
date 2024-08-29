import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames/bind';
import RemainingUsersTooltip from 'components/form_components/remainingUsers/RemainingUsersTooltip';
import { TOOL_TIP_TYPE } from 'utils/Constants';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import gClasses from '../../scss/Typography.module.scss';
import { concat, has, compact } from '../../utils/jsUtility';
import styles from './UserDisplayGroup.module.scss';
import { getUserCount, getTeamName } from './UserDisplay.utils';
import UserDisplay from './UserDisplay';

function UserDisplayGroup(props) {
    const {
        assignees,
        maxCharacterLimit,
        maxUserLimit,
        showCharacterCountBased,
        showUserCountBased,
        className,
        userDisplayClassname,
        separator,
        customItem,
        isCustomItem,
        remainingUsersClassname,
        userListClassName,
        customPlacement,
        mainDataCustomPlacement,
        hideTask,
    } = props;

  let userCount = 1;
  const userAndTeamList = !isCustomItem ?
                           concat(compact(assignees.users), compact(assignees.teams)) :
                           customItem;

  if (showUserCountBased) userCount = maxUserLimit;
  else if (showCharacterCountBased) userCount = getUserCount(userAndTeamList, maxCharacterLimit, separator);
  const consolidatedUsers = [];
  const remainingUsers = [];
  userAndTeamList
  .forEach((userOrTeam, idk) => {
      if (idk < userCount) {
      consolidatedUsers.push(
         <span className={styles.LinkStyle}>
             {
                 (has(userOrTeam, ['team_name'])) ? (
                  <UserDisplay
                  user={userOrTeam}
                  className={cx(styles.userDisplay, userDisplayClassname)}
                  containerClassName={styles.tooltipContainer}
                  teamName={getTeamName(userOrTeam)}
                  popperPlacement={mainDataCustomPlacement}
                  hideTask={hideTask}
                  />
                ) :
                (
                    <UserDisplay
                    user={userOrTeam}
                    className={cx(styles.userDisplay, userDisplayClassname)}
                    containerClassName={styles.tooltipContainer}
                    popperPlacement={mainDataCustomPlacement}
                    hideTask={hideTask}
                    />
                )
             }
             {(userAndTeamList.length > 1 && userAndTeamList.length - 1 > idk) ? separator : ''}
         </span>,
      );
      } else {
          remainingUsers.push(userOrTeam);
      }
      });
const remainingCount = userAndTeamList.length - userCount;
  const extraList = (remainingCount > 0) ? (
      <div className={cx(styles.extraList, remainingUsersClassname)}>{`+${remainingCount}`}</div>
  ) : null;

 return (
        <div className={cx(styles.UserDisplayGroup, gClasses.CenterV, className)}>
            <div className={cx(styles.userContainer, (remainingCount > 0) ? styles.maxWidth85 : styles.maxWidth100)}>{consolidatedUsers}</div>
            {remainingCount > 0 ?
            (
            <div
            role="button"
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            >
            <RemainingUsersTooltip
                userOrTeam={TOOL_TIP_TYPE.PROFILE}
                popperPlacement={customPlacement || POPPER_PLACEMENTS.RIGHT}
                remainingUsers={remainingUsers}
                userListClassName={userListClassName}
            >
             {extraList}
            </RemainingUsersTooltip>
            </div>
            ) : null}
        </div>
);
}

export default UserDisplayGroup;

UserDisplayGroup.defaultProps = {
    userAndTeamList: [],
    maxCharacterLimit: 20,
    maxUserLimit: 1,
    showCharacterCountBased: false,
    showUserCountBased: false,
    separator: ', ',
    customItem: [],
    isCustomItem: false,
};

UserDisplayGroup.propType = {
  userAndTeamList: PropType.array,
  maxCharacterLimit: PropType.number,
  maxUserLimit: PropType.number,
  showCharacterCountBased: PropType.bool,
  showUserCountBased: PropType.bool,
  separator: PropType.string,
  customItem: PropType.array,
  isCustomItem: PropType.bool,
};
