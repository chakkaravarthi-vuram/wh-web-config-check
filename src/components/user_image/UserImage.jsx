import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames/bind';

import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import Image from '../form_components/image/Image';
import AddIcon from '../../assets/icons/AddIcon';

import { ARIA_ROLES, BS, DEFAULT_COLORS_CONSTANTS } from '../../utils/UIConstants';
import { EMPTY_STRING, SPACE } from '../../utils/strings/CommonStrings';
import gClasses from '../../scss/Typography.module.scss';
import styles from './UserImage.module.scss';
import jsUtils from '../../utils/jsUtility';

function UserImage(props) {
  const {
    add,
    addClass,
    src,
    firstName,
    lastName,
    readOnly,
    onClick,
    overLayText,
    className,
    id,
    isDataLoading,
    style,
    enableOnlineStatus,
    teamName,
    testId,
    enableUserOrTeamDetailToolTip,
    imageStyles,
    containerClassName,
    ariaHidden,
    overLayAriaLabel,
    ariaLabel,
    titleOverlay,
  } = props;
  const buttonColor = DEFAULT_COLORS_CONSTANTS.BLUE_V39;
  const [isImageVisible, setImageVisibility] = useState(false);
  // const key = Date.now();
  let firstInitial;
  let lastInitial;
  let displayText;
  let title;

  if (firstName) {
    title = `${jsUtils.capitalize(firstName)} ${jsUtils.capitalize(lastName)}`;
  } else {
    title = `${jsUtils.capitalize(teamName)}`;
  }
  if (add) {
    displayText = <AddIcon style={{ fill: '#217cf5' }} className={addClass} role={ARIA_ROLES.IMG} ariaLabel="Add Image" />;
  } else if (jsUtils.isEmpty(src)) {
    if (firstName) {
      firstInitial = firstName ? firstName.toString()[0] : EMPTY_STRING;
      lastInitial = lastName ? lastName.toString()[0] : EMPTY_STRING;
    } else {
      firstInitial = jsUtils.get(jsUtils.get(jsUtils.split(teamName, ' '), [0], ''), [0], '');
      lastInitial = jsUtils.get(jsUtils.get(jsUtils.split(teamName, ' '), [1], ''), [0], '');
    }
    displayText = firstInitial + lastInitial;
  }
  const onClickHandler = readOnly ? null : onClick;
  let loaderView = null;
  if (!isImageVisible) {
    loaderView = isDataLoading ? (
      <div
        className={cx(gClasses.CenterVH, gClasses.FTwo14, gClasses.FontWeight500, styles.NameContainer, BS.MB_0, className)}
      >
        <Skeleton circle />
      </div>
    ) : (
      <span
        className={cx(gClasses.CenterVH, gClasses.FTwo12, gClasses.FontWeight500, styles.NameContainer, BS.MB_0, className)}
        style={{ color: buttonColor }}
        onClick={onClickHandler}
        // tabIndex="0"
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClickHandler(e)}
        role="presentation"
        title={enableUserOrTeamDetailToolTip ? '' : titleOverlay || title}
        // aria-hidden={ariaHidden}
        // aria-label="user profile menu"
      >
        <div role="img" aria-hidden={ariaHidden} aria-label={ariaLabel || displayText || 'user display picture'}>
        {displayText}
        </div>
      </span>
    );
  }
  const onlineStatusDot = enableOnlineStatus ? <div className={styles.Online} /> : null;
  return (
    <div className={enableOnlineStatus ? cx(BS.P_RELATIVE, gClasses.ZIndex0) : null}>
      <div className={cx(styles.Container, BS.P_RELATIVE, BS.D_FLEX, containerClassName, className)}>
        {!isDataLoading && overLayText ? (
          <div
            className={cx(styles.Overlay, BS.P_ABSOLUTE, gClasses.FOne12White, gClasses.CenterVH)}
            style={{ backgroundColor: buttonColor, ...style }}
            title={titleOverlay}
            aria-label={overLayAriaLabel}
          >
            {overLayText}
          </div>
        ) : null}
        {src ? (
          <Image
            id={id}
            src={src}
            // key={key}
            // alt={key}
            getImageStatus={() => setImageVisibility(true)}
            className={cx(styles.NameContainer)}
            style={
              !isImageVisible
                ? {
                    position: BS.ABSOLUTE,
                    ...imageStyles,
                  }
                : null
            }
            onClick={onClickHandler}
            testId={testId}
            title={enableUserOrTeamDetailToolTip ? '' : titleOverlay || title}
            ariaHidden={ariaHidden}
          />
        ) : null}
        {loaderView}
        {SPACE}
      </div>
      {onlineStatusDot}
    </div>
  );
}

UserImage.defaultProps = {
  add: false,
  addClass: EMPTY_STRING,
  src: EMPTY_STRING,
  firstName: EMPTY_STRING,
  lastName: EMPTY_STRING,
  readOnly: false,
  overLayText: EMPTY_STRING,
  className: EMPTY_STRING,
  id: EMPTY_STRING,
  isDataLoading: false,
  onClick: null,
  testId: null,
  teamName: EMPTY_STRING,
  enableUserOrTeamDetailToolTip: false,
  imageStyles: EMPTY_STRING,
  ariaLabel: EMPTY_STRING,
};

UserImage.propTypes = {
  add: PropTypes.bool,
  addClass: PropTypes.string,
  src: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  readOnly: PropTypes.bool,
  onClick: PropTypes.func,
  overLayText: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  isDataLoading: PropTypes.bool,
  testId: PropTypes.string,
  teamName: PropTypes.string,
  enableUserOrTeamDetailToolTip: PropTypes.bool,
  imageStyles: PropTypes.string,
  ariaLabel: PropTypes.string,
};
export default UserImage;
