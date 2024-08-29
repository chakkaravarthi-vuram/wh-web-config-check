import React from 'react';
import cx from 'classnames/bind';

import { getFullName } from 'utils/generatorUtils';
import UserOrTeamToolTip from 'components/form_components/user_team_tool_tip/UserOrTeamToolTip';
import { TOOL_TIP_TYPE } from 'utils/Constants';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import { useTranslation } from 'react-i18next';
import styles from './UserDisplayGroup.module.scss';

function UserDisplay({ user, className, containerClassName, teamName, popperPlacement, hideTask }) {
  const { t } = useTranslation();
  const isSystemUser = (user?.user_type === 0);
  console.log('asfdafasfasasdf', isSystemUser, user, t('system_administrator'));
  const fullName = isSystemUser ? t('system_administrator') : teamName || getFullName(user.first_name, user.last_name) || user.email;
  return !isSystemUser ? (
    <UserOrTeamToolTip id={user._id} userOrTeam={teamName ? TOOL_TIP_TYPE.TEAM : TOOL_TIP_TYPE.PROFILE} popperPlacement={popperPlacement || POPPER_PLACEMENTS.BOTTOM} fallbackPlacements={POPPER_PLACEMENTS.TOP} isTabelView className={containerClassName} user_type={user.user_type} hideTask={hideTask}>
        <div className={cx(className, styles.UserDisplayColor)}>
          {fullName}
        </div>
    </UserOrTeamToolTip>
  ) : (
      <div className={cx(className, styles.UserDisplayColor)}>
        {fullName}
      </div>
  );
}

export default UserDisplay;
