import React, { useRef, useState } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import { keydownOrKeypessEnterHandle, useClickOutsideDetector } from 'utils/UtilityFunctions';
import AutoPositioningPopper from 'components/auto_positioning_popper/AutoPositioningPopper';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import DownArrowIcon from 'assets/icons/chat/DownArrowIcon';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import UserImage from 'components/user_image/UserImage';
import { getUserPanelData } from 'redux/selectors/LandingPageSelctor';
import { connect } from 'react-redux';
import SupportIcon from 'assets/icons/SupportIcon';
import { LOGGED_IN_NAVBAR } from 'components/logged_in_nav_bar/LoggedInNavbarTranlsation.strings';
import { useTranslation } from 'react-i18next';
import gClasses from '../../scss/Typography.module.scss';
import styles from './SettingsPopper.module.scss';

function SettingsPopper(props) {
  const {
    downArrow,
    buttonIconClass,
    optionListClass,
    dropdownListContainerClass,
    menuClass,
    list,
    popperPlacement,
    first_name,
    last_name,
    email,
    profile_pic,
    username,
    isUserSettings,
    onUserProfileDropdownClickHandler,
    state,
  } = props;
  const { t } = useTranslation();
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [referencePopperElement, setReferencePopperElement] = useState(null);
  let profilePicSrc = null;

  if (state.profile_pic) {
    if (state.profile_pic.base64) {
      profilePicSrc = state.profile_pic.base64;
    } else {
      profilePicSrc = state.profile_pic;
    }
  } else {
    profilePicSrc = profile_pic;
  }

  const closeModal = () => {
    setIsPopperOpen(false);
  };

  const wrapperRef = useRef(null);
  useClickOutsideDetector(wrapperRef, closeModal);

  const onPopperBlurFunc = (e) => {
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) {
        setIsPopperOpen(false);
      }
  };

  const optionListOnClick = (link, e) => {
    if (isUserSettings) onUserProfileDropdownClickHandler(link, e);
    else window.open(link, '_blank');
  };

  const optionList = list.map((items) => {
    const link = isUserSettings ? items.INDEX : items.LINK;
    return (
    <li>
      <div
        className={cx(
          styles.anchorTag,
          gClasses.CenterV,
          gClasses.FTwo12,
          optionListClass,
          gClasses.CursorPointer,
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && optionListOnClick(link, e)}
        onClick={(e) => optionListOnClick(link, e)}
        href={items.LINK}
      >
        {items.ICON}
        {items.TEXT}
      </div>
    </li>
    );
  });

  const HeaderComponent = (
    isUserSettings && (
    <div className={cx(BS.D_FLEX, gClasses.MB10, styles.headerContainer)}>
      <UserImage
        className={cx(styles.UserIcon, gClasses.CursorDefault)}
        firstName={first_name}
        lastName={last_name}
        src={profilePicSrc}
        ariaHidden="true"
      />
      <div
        className={cx(gClasses.ML10, gClasses.Flex1, gClasses.OverflowHidden)}
      >
        <div
          className={cx(
            gClasses.NavBarUserName,
            gClasses.Ellipsis,
            gClasses.GrayV3,
          )}
          title={username}
        >
          {username}
        </div>
        <div
          className={cx(gClasses.NavBarEmail, gClasses.Ellipsis)}
          title={email}
        >
          {email}
        </div>
      </div>
    </div>
    )
  );

  const FooterComponent = (
    isUserSettings && (
      <div
        className={cx(
            gClasses.PT10,
            styles.footerComponent,
            gClasses.PB10,
            gClasses.CenterH,
        )}
        aria-label="Copyright Workhall 2023. All Rights Reserved."
      >
        {t(LOGGED_IN_NAVBAR.COPY_RIGHT)}
        {' '}
      </div>
    )
  );

  const dropdownList = (
    <div
    className={cx(
    gClasses.CenterV,
    )}
    id="settingsdropdown"
    >
      {isPopperOpen ? (
        <div ref={wrapperRef}>
          <AutoPositioningPopper
          className={cx(styles.dropdownListContainer, dropdownListContainerClass)}
          placement={popperPlacement}
          isPopperOpen={isPopperOpen}
          referenceElement={referencePopperElement}
          onPopperBlur={onPopperBlurFunc}
          onBlur={() => setIsPopperOpen(false)}
          >
            <div className={styles.popperElement}>
              {HeaderComponent}
              <ul>
                {optionList}
              </ul>
              {FooterComponent}
            </div>
          </AutoPositioningPopper>
        </div>
      ) : null}
    </div>
  );

  const buttonIcon = (
    isUserSettings ?
      <UserImage
      src={profilePicSrc}
      className={cx(styles.buttonIcon)}
      firstName={first_name}
      lastName={last_name}
      ariaHidden="true"
      ariaLabel="user profile menu"
      />
    :
      <SupportIcon
      role={ARIA_ROLES.BUTTON}
      ariaHidden="true"
      />
  );

  return (
    <div
      className={cx(
        gClasses.MR0,
        gClasses.CenterVH,
        styles.menuButton,
        menuClass,
      )}
      ref={setReferencePopperElement}
      onClick={() => setIsPopperOpen(!isPopperOpen)}
      onKeyDown={(e) =>
        keydownOrKeypessEnterHandle(e) && setIsPopperOpen(!isPopperOpen)
      }
      role="menu"
      tabIndex={0}
      aria-label={isUserSettings ? 'User Profile' : 'Support'}
      aria-labelledby={isPopperOpen ? 'settingsdropdown' : null}
    >
        <div className={cx(gClasses.CenterV, gClasses.CursorPointer)}>
          <div className={cx(buttonIconClass)}>
              {buttonIcon}
          </div>
          {downArrow && <DownArrowIcon
            className={cx(gClasses.ML8, styles.downArrowIcon)}
            isButtonColor
            role={ARIA_ROLES.IMG}
            ariaHidden="true"
          />}
        </div>
        {dropdownList}
    </div>
  );
}

SettingsPopper.defaultProps = {
    downArrow: false,
    buttonIconClass: EMPTY_STRING,
    list: [],
    optionListClass: EMPTY_STRING,
    dropdownListContainerClass: EMPTY_STRING,
    menuClass: EMPTY_STRING,
    popperPlacement: EMPTY_STRING,
    isUserSettings: false,
    onUserProfileDropdownClickHandler: () => {},
};

SettingsPopper.propTypes = {
    downArrow: PropTypes.bool,
    buttonIconClass: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.object),
    optionListClass: PropTypes.string,
    dropdownListContainerClass: PropTypes.string,
    menuClass: PropTypes.string,
    popperPlacement: PropTypes.string,
    isUserSettings: PropTypes.bool,
    onUserProfileDropdownClickHandler: PropTypes.func,

};
const mapStateToProps = ({
    RoleReducer,
    AdminProfileReducer,
    DeveloperProfileReducer,
    MemberProfileReducer,
    UserProfileReducer,
  }) => {
    return {
      state: UserProfileReducer,
      ...getUserPanelData({
        RoleReducer,
        AdminProfileReducer,
        DeveloperProfileReducer,
        MemberProfileReducer,
        UserProfileReducer,
      }),
    };
  };
export default connect(mapStateToProps)(SettingsPopper);
