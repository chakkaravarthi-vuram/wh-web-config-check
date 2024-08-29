import React from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import UserOrTeamToolTip from 'components/form_components/user_team_tool_tip/UserOrTeamToolTip';
import { TOOL_TIP_TYPE } from 'utils/Constants';
import RemainingUsersTooltip from 'components/form_components/remainingUsers/RemainingUsersTooltip';
import jsUtils from 'utils/jsUtility';
import UserImage from '../user_image/UserImage';
import styles from './AvatarGroup.module.scss';
import { BS } from '../../utils/UIConstants';
import gClasses from '../../scss/Typography.module.scss';

export const AVATAR_GROUP_TYPE = {
  TYPE_1: 1,
  TYPE_2: 2,
};

const AVATAR_USER_MAX_LIMIT = 3;

function AvatarGroup(props) {
  const {
    userImages,
    isDataLoading,
    className,
    enableUserOrTeamDetailToolTip,
    isToolTipRequired,
    type,
    customZIndexStart = 1,
    userImageClass = null,
    hideTask = false,
  } = props;

  // AVATAR_USER_MAX_LIMIT + 1 =>  here the 1 is for remaining users.
  const userImagesLength = userImages.length > AVATAR_USER_MAX_LIMIT ? (AVATAR_USER_MAX_LIMIT + 1) : userImages.length;
  let zIndex = -(userImagesLength + customZIndexStart);
  const remainingUsers = [];
  if (userImages.length >= userImagesLength) {
    const allUsers = jsUtils.cloneDeep(userImages);
    remainingUsers.push(...allUsers.splice(userImagesLength - 1));
  }
  const userImagesView = userImages
    .slice(0, userImagesLength)
    .map((userImage, index) => {
      let style = {};
      if (type === AVATAR_GROUP_TYPE.TYPE_1) {
        style = {
          zIndex: -(zIndex += 1),
          marginLeft: `${index === 0 ? 0 : -7}px`,
        };
      }
      const temp = (
        <div
          style={style}
          key={`avatar_group_item_${index}`}
          className={cx({ [styles.AvatarGroupType2]: type === AVATAR_GROUP_TYPE.TYPE_2 })}
        >
          {index < AVATAR_USER_MAX_LIMIT ? (
            isToolTipRequired ?
              (
                <UserOrTeamToolTip
                  id={userImage?.id || userImage?._id}
                  userOrTeam={userImage.teamName ? TOOL_TIP_TYPE.TEAM : TOOL_TIP_TYPE.PROFILE}
                  popperPlacement={POPPER_PLACEMENTS.RIGHT_END}
                  hideTask={hideTask}
                >
                  <UserImage
                    src={userImage.url}
                    className={userImageClass || styles.UserImage}
                    firstName={userImage?.firstName || userImage?.first_name}
                    lastName={userImage?.lastName || userImage?.last_name}
                    teamName={userImage?.teamName || userImage?.team_name}
                    isDataLoading={isDataLoading}
                    enableUserOrTeamDetailToolTip={enableUserOrTeamDetailToolTip}
                    id={userImage.id}
                  />
                </UserOrTeamToolTip>
              ) : (
                <UserImage
                  src={userImage.url}
                  className={styles.UserImage}
                  firstName={userImage.firstName}
                  lastName={userImage.lastName}
                  teamName={userImage.teamName}
                  isDataLoading={isDataLoading}
                  enableUserOrTeamDetailToolTip={enableUserOrTeamDetailToolTip}
                  id={userImage.id}
                />
              )
          ) : (
            <div>
            <RemainingUsersTooltip
                userOrTeam={TOOL_TIP_TYPE.PROFILE}
                popperPlacement={POPPER_PLACEMENTS.RIGHT}
                remainingUsers={remainingUsers}
            >
              <div
                className={cx(
                gClasses.CenterVH,
                styles.UserImage,
                styles.AdditionalCount,
                gClasses.FOne10GrayV2,
              )}
              >
              +
              {remainingUsers.length}
              </div>
            </RemainingUsersTooltip>
            </div>
          )}
        </div>
      );
      return temp;
    });
  return (
    <div
      className={cx(BS.D_FLEX, className, gClasses.MR10)}
      style={{ zIndex: 1 }}
    >
      {userImagesView}
    </div>
  );
}

export default AvatarGroup;

AvatarGroup.propTypes = {
  userImages: PropTypes.arrayOf(PropTypes.object),
  isDataLoading: PropTypes.bool,
  isToolTipRequired: PropTypes.bool,
  type: PropTypes.number, // Different avatar group layout
};

AvatarGroup.defaultProps = {
  userImages: [],
  isDataLoading: false,
  isToolTipRequired: false,
  type: AVATAR_GROUP_TYPE.TYPE_1,
};
