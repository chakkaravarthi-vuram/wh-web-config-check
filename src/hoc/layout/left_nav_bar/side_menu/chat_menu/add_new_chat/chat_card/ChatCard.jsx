import React from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import gClasses from 'scss/Typography.module.scss';
import UserImage from 'components/user_image/UserImage';
import Skeleton from 'react-loading-skeleton';
import UserOrTeamToolTip from 'components/form_components/user_team_tool_tip/UserOrTeamToolTip';
import { TOOL_TIP_TYPE } from 'utils/Constants';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import UserIcon from 'assets/icons/UserIcon';
import { ARIA_ROLES } from 'utils/UIConstants';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';
import styles from './ChatCard.module.scss';

function ChatCard(props) {
  const {
    isDataLoading,
    className,
    data: { threadEmail, threadName, threadStatus, threadPic, firstName, lastName, userId },
    onClick,
  } = props;
  return (
    <div className={styles.ChatContainerClass}>
      <div
        className={cx(
          gClasses.CenterV,
          className,
          styles.Container,
          !isDataLoading && styles.ContainerHover,
        )}
        onClick={onClick}
        onKeyPress={onClick}
        role="link"
        tabIndex="0"
      >
        {isDataLoading ? (
          <Skeleton height={28} width={28} circle />
        ) : (
          <UserImage
            className={styles.UserImage}
            src={threadPic}
            firstName={firstName || threadEmail}
            lastName={lastName}
            enableOnlineStatus={threadStatus}
            online={threadStatus}
          />
        )}
        <div
          className={cx(
            gClasses.ML5,
            gClasses.OverflowHidden,
            styles.UserContainer,
          )}
        >
          {isDataLoading ? (
            <div className={styles.LoaderPatch}>
              <Skeleton height={10} width={80} />
            </div>
          ) : (
            <div
              className={cx(
                gClasses.FTwo12GrayV3,
                gClasses.FontWeight600,
                styles.UserName,
                gClasses.Ellipsis,
              )}
              title={threadName}
            >
              {threadName}
            </div>
          )}
          {isDataLoading ? (
            <div className={styles.LoaderPatch}>
              <Skeleton height={10} width={150} />
            </div>
          ) : (
            <div
              className={cx(gClasses.FTwo10GrayV53, gClasses.Ellipsis)}
              title={threadEmail}
            >
              {threadEmail}
            </div>
          )}
        </div>
      </div>

      <div id={`Usertooltip${userId}`} className={styles.UserIconClass}>
        <UserOrTeamToolTip
          id={userId}
          userOrTeam={TOOL_TIP_TYPE.PROFILE}
          popperPlacement={POPPER_PLACEMENTS.BOTTOM_START}
          fallbackPlacements={[POPPER_PLACEMENTS.BOTTOM_START, POPPER_PLACEMENTS.TOP_START]}
          isCustomInnerClass
        >
          <UserIcon
            id={userId}
            className={cx(gClasses.ML8, styles.UserIcon)}
            role={ARIA_ROLES.IMG}
            title="user icon"
          />
        </UserOrTeamToolTip>
      </div>
    </div>
  );
}

export default ChatCard;

ChatCard.propTypes = {
  data: PropTypes.objectOf(PropTypes.object),
  onClick: PropTypes.func,
  isDataLoading: PropTypes.bool,
  selectedThreadId: PropTypes.string,
};
ChatCard.defaultProps = {
  data: {
    userId: EMPTY_STRING,
    threadEmail: EMPTY_STRING,
    threadName: EMPTY_STRING,
    threadStatus: false,
    notificationCount: 0,
    threadPic: null,
  },
  onClick: null,
  isDataLoading: false,
  selectedThreadId: EMPTY_STRING,
};
