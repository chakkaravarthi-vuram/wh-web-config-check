import React from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import gClasses from 'scss/Typography.module.scss';
import { connect } from 'react-redux';
import { BS } from 'utils/UIConstants';
import UserImage from 'components/user_image/UserImage';
import Skeleton from 'react-loading-skeleton';
import { isMobileScreen } from 'utils/UtilityFunctions';
import NavbarStyles from '../../../LeftNavBar.module.scss';
import styles from './ChatMenuListItem.module.scss';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';

function ChatMenuItem(props) {
  const {
    isNavOpen,
    isDataLoading,
    userId,
    threadId,
    threadType,
    threadName,
    firstName,
    lastName,
    threadStatus,
    notificationCount,
    threadPic,
    threadEmail,
    onClick,
  } = props;
  const onClickHandler = () => {
    onClick({
      userId,
      threadId,
      threadType,
      threadName,
      threadStatus,
      notificationCount,
      threadPic,
      threadEmail,
      firstName,
      lastName,
    });
  };
  return (
    <li
    className={gClasses.CursorPointer}
    role="presentation"
    >
      <a
        className={cx(
          BS.FLEX_ROW,
          !isNavOpen && NavbarStyles.ChatThread,
          (isNavOpen || (isMobileScreen() && !isNavOpen)) && styles.ChatItemsExpanded,
          styles.ChatListItem,
        )}
        onClick={onClickHandler}
        onKeyPress={onClickHandler}
        tabIndex="0"
        role="button"
      >
        {isDataLoading ? (
          <Skeleton height={24} width={24} circle style={{ opacity: 0.4 }} />
        ) : (
          <UserImage
            className={cx(styles.UserImage)}
            src={threadPic}
            firstName={firstName}
            lastName={lastName}
            enableOnlineStatus={threadStatus}
            online={threadStatus}
          />
        )}
        {isDataLoading ? (
          isNavOpen ? (
            <Skeleton
              height={10}
              width={120}
              style={{ marginLeft: '10px', opacity: 0.25 }}
            />
          ) : null
        ) : (
          <>
            <span
              className={cx(
                NavbarStyles.CName,
                gClasses.TextOverflow,
                gClasses.PR15,
                gClasses.ML8,
                gClasses.TextTransformCap,
                notificationCount > 0 && gClasses.FontWeight500,
              )}
            >
              {threadName}
            </span>
            {notificationCount > 0 && (
              <span
              className={cx(NavbarStyles.MsgCounter)}
              aria-label={`${notificationCount}unread messages `}
              >
                {notificationCount}
              </span>
            )}
          </>
        )}
      </a>
    </li>
  );
}

const mapStateToProps = (state) => {
  return {
    isNavOpen: state.NavBarReducer.isNavOpen,
  };
};

export default connect(mapStateToProps, null)(ChatMenuItem);
ChatMenuItem.propTypes = {
  // data: PropTypes.objectOf(PropTypes.object),
  onClick: PropTypes.func,
  isDataLoading: PropTypes.bool,
  selectedThreadId: PropTypes.string,
  userId: PropTypes.string,
  threadId: PropTypes.string,
  threadName: PropTypes.string,
  threadStatus: PropTypes.bool,
  notificationCount: PropTypes.number,
  threadPic: PropTypes.number,
};
ChatMenuItem.defaultProps = {
  userId: EMPTY_STRING,
  threadId: EMPTY_STRING,
  threadName: EMPTY_STRING,
  threadStatus: false,
  notificationCount: 0,
  threadPic: null,
  onClick: null,
  isDataLoading: false,
  selectedThreadId: EMPTY_STRING,
};
