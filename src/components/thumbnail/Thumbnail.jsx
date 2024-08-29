import React from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { FORM_PARENT_MODULE_TYPES } from 'utils/constants/form.constant';
import FlowIcon from 'assets/icons/FlowListIcon';
import TaskNewIcon from 'assets/icons/TaskNewIcon';
import { STARTED_FLOW_LIST_LOADER_COLOR_STRINGS } from 'containers/landing_page/all_flows/started_flow_list/StartedFlowList.strings';
import { ARIA_ROLES, BS } from '../../utils/UIConstants';
import gClasses from '../../scss/Typography.module.scss';
import styles from './Thumbnail.module.scss';

import { THUMBNAIL_TYPE } from '../../utils/Constants';

import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { LOADER_STRINGS } from '../../containers/landing_page/all_flows/flow_card/FlowCard.strings';
import OpenTaskIcon from '../../assets/icons/task/OpenTaskIcon';
import TestModeIcon from '../../assets/icons/TestModeIcon';
import TaskSendBackIcon from '../../assets/icons/TaskSendBackIcon';
import ReviewTaskIcon from '../../assets/icons/ReviewTaskIcon';
import DataListMenuIcon from '../../assets/icons/menu/DatalistMenuIcon';
import TeamMenuIcon from '../../assets/icons/menu/TeamsMenuIcon';

function Thumbnail(props) {
  const {
    title,
    containerClassName,
    textClassName,
    type,
    notificationCount,
    isLoading,
    background,
    isIconThumbnail = false,
    is_send_back_task = false,
    isReviewTask = false,
    iconClasses,
    customLoaderHeight,
    customLoaderWidth,
    customSvgHeight,
    customSvgWidth,
    taskIcon,
    isTestBed,
    thumbNailIconClass,
  } = props;
  let containerStyle = EMPTY_STRING;
  let textStyle = EMPTY_STRING;
  let backGroundStyle = null;
  let notificationDot = null;
  let loaderWidth;
  let loaderHeight;
  let loaderBorderRadius;
  let loaderColor = LOADER_STRINGS.COLOR;
  let highlightColor = LOADER_STRINGS.HIGHLIGHT_COLOR;

  if (!isIconThumbnail) {
    if (type === THUMBNAIL_TYPE.SECONDARY) {
      loaderWidth = 54;
      loaderHeight = 54;
      loaderBorderRadius = 14;
      textStyle = cx(
        gClasses.FTwo16White,
        gClasses.FontWeight500,
        styles.ThumbnailTextSecondary,
        BS.TEXT_CENTER,
      );
      containerStyle = styles.ThumbnailSecondary;
      if (background) {
        backGroundStyle = {
          background: `linear-gradient(${background.degree}deg, ${background.hex_codes[0]}, ${background.hex_codes[1]})`,
        };
      }
    } else if (type === THUMBNAIL_TYPE.PRIMARY) {
      loaderWidth = 36;
      loaderHeight = 36;
      loaderBorderRadius = 12;
      textStyle = cx(
        gClasses.FTwo12GrayV27,
        BS.TEXT_CENTER,
        gClasses.FontWeight500,
        styles.ThumbnailTextPrimary,
      );
      containerStyle = styles.ThumbnailPrimary;
      if (notificationCount) {
        notificationDot = (
          <div className={styles.NotificationDot}>
            <div
              className={cx(
                gClasses.FOne10White,
                BS.TEXT_JUSTIFY,
                gClasses.CenterVH,
              )}
            >
              {notificationCount}
            </div>
          </div>
        );
      }
    } else if (type === THUMBNAIL_TYPE.TYPE_3) {
      loaderWidth = 48;
      loaderHeight = 48;
      loaderBorderRadius = 12;
      textStyle = cx(gClasses.FTwo12White, BS.TEXT_CENTER);
      containerStyle = styles.ThumbnailType3;
      loaderColor = STARTED_FLOW_LIST_LOADER_COLOR_STRINGS.COLOR;
      highlightColor =
        STARTED_FLOW_LIST_LOADER_COLOR_STRINGS.HIGHLIGHT_COLOR;
      if (background) {
        backGroundStyle = {
          background: `linear-gradient(${background.degree}deg, ${background.hex_codes[0]}, ${background.hex_codes[1]})`,
        };
      }
    } else {
      console.log('checking', background);
      textStyle = cx(gClasses.FontWeight600, BS.TEXT_CENTER, gClasses.FS8White);
      console.log(styles.ThumbnailSecondary.width);
      containerStyle = styles.ThumbnailWithGradient;
      if (background) {
        backGroundStyle = {
          background: `linear-gradient(${background.degree}deg, ${background.hex_codes[0]}, ${background.hex_codes[1]})`,
        };
      }
    }
  }
  let displayText = null;
  if (!isLoading && title) {
    const stringTokens = title ? title.toUpperCase().split(' ') : null;
    const firstInitial = stringTokens[0]
      ? stringTokens[0].toString()[0]
      : EMPTY_STRING;
    const lastInitial = stringTokens[1]
      ? stringTokens[1].toString()[0]
      : stringTokens[0].toString()[1];
    displayText =
      (firstInitial || EMPTY_STRING) + (lastInitial || EMPTY_STRING);
  }

  // const displayText = null;

  let displayTextOrIcon = (
    <div className={cx(textStyle, textClassName)}>{displayText}</div>
  );
  if (isIconThumbnail) {
    if (taskIcon) {
      displayTextOrIcon = taskIcon;
    } else if (type === FORM_PARENT_MODULE_TYPES.TEAM) {
      displayTextOrIcon = <TeamMenuIcon height={customSvgHeight} width={customSvgWidth} />;
    } else if (type === FORM_PARENT_MODULE_TYPES.DATA_LIST) {
      displayTextOrIcon = <DataListMenuIcon height={customSvgHeight} width={customSvgWidth} />;
    } else if (type === FORM_PARENT_MODULE_TYPES.FLOW) {
      displayTextOrIcon = <FlowIcon height={customSvgHeight} width={customSvgWidth} />;
    } else if (type === FORM_PARENT_MODULE_TYPES.TASK) {
      displayTextOrIcon = <TaskNewIcon height={customSvgHeight} width={customSvgWidth} />;
      if (is_send_back_task) displayTextOrIcon = <TaskSendBackIcon className={thumbNailIconClass} />;
      if (isReviewTask) displayTextOrIcon = <ReviewTaskIcon className={thumbNailIconClass} />;
    } else if (isTestBed) {
      containerStyle = styles.ThumbnailSecondary;
       displayTextOrIcon = (
                <>
                  <div className={cx(gClasses.CenterVH, styles.TestBedIconContainer)}>
                    <TestModeIcon />
                  </div>
                  <div>{displayText}</div>
                </>
              );
    } else {
      displayTextOrIcon = <OpenTaskIcon className={iconClasses} ariaHidden="true" role={ARIA_ROLES.IMG} />;
    }
  }

  return (
    <div
      className={BS.D_FLEX}
      aria-hidden="true"
    >
      {isLoading ? (
        <div style={{ marginTop: '-4px' }}>
          <SkeletonTheme color={loaderColor} highlightColor={highlightColor}>
            <Skeleton
              height={customLoaderHeight || loaderHeight}
              width={customLoaderWidth || loaderWidth}
              style={{ borderRadius: loaderBorderRadius }}
            />
          </SkeletonTheme>
        </div>
      ) : (
        <>
          <div
            className={cx(
              BS.P_RELATIVE,
              gClasses.CenterVH,
              containerStyle,
              containerClassName,
              isIconThumbnail && isTestBed &&
              styles.TestBedConfig,
            )}
            style={backGroundStyle}
          >
            {displayTextOrIcon}
          </div>
          {notificationDot}
        </>
      )}
    </div>
  );
}
export { THUMBNAIL_TYPE };
export default Thumbnail;

Thumbnail.propTypes = {
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  containerClassName: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  textClassName: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  type: PropTypes.string,
  notificationCount: PropTypes.number,
  isLoading: PropTypes.bool,
  background: PropTypes.shape({
    degree: PropTypes.number,
    hex_code: PropTypes.arrayOf(PropTypes.string),
  }),
  customLoaderHeight: PropTypes.number,
  customLoaderWidth: PropTypes.number,
  isTestBed: PropTypes.bool,
  thumbNailIconClass: PropTypes.string,
};
Thumbnail.defaultProps = {
  title: EMPTY_STRING,
  containerClassName: {},
  textClassName: {},
  type: EMPTY_STRING,
  notificationCount: 0,
  background: null,
  isLoading: false,
  customLoaderHeight: null,
  customLoaderWidth: null,
  isTestBed: false,
  thumbNailIconClass: EMPTY_STRING,
};
