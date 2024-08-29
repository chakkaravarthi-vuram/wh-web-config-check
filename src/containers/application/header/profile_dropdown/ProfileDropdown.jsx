import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import cx from 'classnames';
import {
  Avatar,
  AvatarSizeVariant,
  EPopperPlacements,
  ETooltipPlacements,
  ETooltipType,
  Popper,
  Tooltip } from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import LogoutIcon from 'assets/icons/LogoutIcon';
import MyDownloadsIcon from 'assets/icons/MyDownloadsIcon';
// import SettingsIcon from 'assets/icons/SettingsIcon';
import UserProfileIcon from 'assets/icons/UserProfileIcon';
import { getUserPanelData } from 'redux/selectors/LandingPageSelctor';
import OpenSeparatelyIcon from '../../../../assets/icons/OpenSeparatelyIcon';
import { USER_PROFILE_DROPDOWN_INDEX } from '../../../../components/logged_in_nav_bar/LoggedInNavbar';
import { isBasicUserMode, useClickOutsideDetector } from '../../../../utils/UtilityFunctions';
import { APPLICATION_STRINGS } from '../../application.strings';
import ThemeContext from '../../../../hoc/ThemeContext';
import styles from '../Header.module.scss';
import { HEADER_STRINGS } from '../header.utils';
import { ROLES } from '../../../../utils/Constants';
import { store } from '../../../../Store';
import { updateMFAInfo } from '../../../../redux/actions/Mfa.Action';
import { EMPTY_STRING, PAC_URL_STRING } from '../../../../utils/strings/CommonStrings';
import gClasses from '../../../../scss/Typography.module.scss';
import DocumentationIcon from '../../../../assets/icons/DocumentationIcon';

function ProfileDropDown(props) {
  const { onUserProfileDropdownClickHandler, profileData, userState } = props;
  const { t } = useTranslation();
  const { HEADER: { PROFILE_DROPDOWN } } = APPLICATION_STRINGS(t);
  const [open, setOpen] = useState(false);
  const profileMenuRef = useRef();
  const history = useHistory();
  const mode = isBasicUserMode(history) ? PROFILE_DROPDOWN.MODES[0].mode : PROFILE_DROPDOWN.MODES[1].mode;
  const { role } = useSelector((state) => state.RoleReducer);
  const { colorScheme } = useContext(ThemeContext);
  const isNormalUser = (role === ROLES.MEMBER);
  useClickOutsideDetector(profileMenuRef, () => setOpen(false));
  useEffect(() => () => {
    store.dispatch(updateMFAInfo({
      isShowMFADetails: true,
    }));
  }, []);

  const onDropdownOptionClick = (id, e) => {
    onUserProfileDropdownClickHandler(id, e);
    setOpen(false);
  };

  const openDocumentation = () => {
    setOpen(false);
    const domainURL = window.location.hostname.substring(
      window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.') - 1) + 1,
    );
    let documentationURL = EMPTY_STRING;
    if (domainURL.includes('localhost') ||
    domainURL.includes('workhall.dev')) {
      documentationURL = 'docs.workhall.dev';
    } else if (domainURL.includes('onething.io')) {
      documentationURL = 'docs.onething.io';
    } else if (domainURL.includes('workhall.cloud')) {
      documentationURL = 'docs.workhall.cloud';
    } else if (domainURL.includes('workhall.digital')) {
      documentationURL = 'docs.workhall.digital';
    } else if (domainURL.includes('workhall.io')) {
      documentationURL = 'docs.workhall.io';
    } else if (window.location.hostname.includes(PAC_URL_STRING)) {
      documentationURL = PAC_URL_STRING;
    }
    documentationURL = `https://${documentationURL}`;
    window.open(documentationURL, '_blank');
  };

  let profilePicSrc = null;
  if (userState?.profile_pic) {
    if (userState.profile_pic?.base64) {
      profilePicSrc = userState.profile_pic.base64;
    } else {
      profilePicSrc = userState.profile_pic;
    }
  } else {
    profilePicSrc = profileData?.profile_pic;
  }

  return (
    <div className="" ref={profileMenuRef}>
      <div id={HEADER_STRINGS.USER_PROFILE.ID}>
        <Tooltip
          text={t(HEADER_STRINGS.USER_PROFILE.LABEL)}
          tooltipType={ETooltipType.INFO}
          tooltipPlacement={ETooltipPlacements.BOTTOM}
          icon={
          <Avatar
            id={profileData.username}
            name={profileData.username}
            src={profilePicSrc}
            size={AvatarSizeVariant.sm}
            selectedLabel="Toggle"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
            colorScheme={colorScheme}
            className={styles.ProfilePic}
          />}
        />
      </div>
      <Popper
        targetRef={profileMenuRef}
        open={open}
        placement={EPopperPlacements.BOTTOM_END}
        className={styles.ProfilePopper}
        content={
          <div className={styles.Container}>
            <div className={styles.Profile}>
              <Avatar
                id={profileData.username}
                name={profileData.username}
                src={profilePicSrc}
                size={AvatarSizeVariant.md}
                showActiveRing
                colorScheme={colorScheme}
              />
              <div className={styles.ProfileRightContainer}>
                <h3 className={styles.ProfileName}>
                  {`${profileData.first_name} ${profileData.last_name}`}
                </h3>
                <p className={styles.ProfileEmail} title={profileData.email}>
                  {profileData.email}
                </p>
              </div>
            </div>

            {!isNormalUser &&
              <div className={styles.Mode}>
                <div className={styles.Title}>
                  {PROFILE_DROPDOWN.WORKSPACE}
                </div>

                {PROFILE_DROPDOWN.MODES.map((m) => (
                  <NavLink
                    className={cx(styles.ModeOption, mode === m.mode && styles.ModeActive)}
                    style={{ textDecoration: 'none' }}
                    to={m.route}
                    target="_blank"
                  >
                    <div>
                      <h3 className={styles.ModeOptionTitle}>
                        {m.title}
                      </h3>
                      <div
                        className={styles.ModeOptionSubTitle}
                      >
                        {mode === m.mode ? 'Active' : m.description}
                      </div>
                    </div>
                    {mode !== m.mode && <OpenSeparatelyIcon />}
                  </NavLink>
                ))}
              </div>
            }

           <div className={styles.ExtraOptions}>
            <button
              onClick={(e) => {
                store.dispatch(updateMFAInfo({
                  isShowMFADetails: true,
                }));
                onDropdownOptionClick(
                  USER_PROFILE_DROPDOWN_INDEX.LANGUAGE_TIME_ZONE,
                  e,
                );
              }
            }
              className={styles.EachOption}
            >
              <UserProfileIcon />
              <div className={styles.EachOptionLabel}>
                {PROFILE_DROPDOWN.VIEW_PROFILE}
              </div>
            </button>
            <button
              onClick={(e) =>
                onDropdownOptionClick(
                  USER_PROFILE_DROPDOWN_INDEX.MY_DOWNLOADS,
                  e,
                )
              }
              className={cx(styles.EachOption)}
            >
              <MyDownloadsIcon />
              <div className={styles.EachOptionLabel}>
                {PROFILE_DROPDOWN.MY_DOWNLOADS}
              </div>
            </button>
            {/* <button
              onClick={(e) =>
                onDropdownOptionClick(
                  USER_PROFILE_DROPDOWN_INDEX.ADMIN_SETTINGS,
                  e,
                )
              }
              className={styles.EachOption}
            >
              <SettingsIcon />
              <div className="text-zinc-900 text-[13px] font-normal">
                {PROFILE_DROPDOWN.SETTINGS}
              </div>
            </button> */}
            {/* Commented the support details */}
            <button
              onClick={openDocumentation}
              className={cx(styles.EachOption, styles.BorderBottom)}
            >
              <DocumentationIcon className={gClasses.ML2} />
              <div className={styles.EachOptionLabel}>
                {PROFILE_DROPDOWN.DOCUMENTATION}
              </div>
            </button>
            <button
              onClick={(e) =>
                onDropdownOptionClick(USER_PROFILE_DROPDOWN_INDEX.SIGN_OUT, e)
              }
              className={styles.EachOption}
            >
              <LogoutIcon />
              <div className={cx(styles.EachOptionLabel, styles.Logout)}>{PROFILE_DROPDOWN.LOGOUT}</div>
            </button>
           </div>
          </div>
        }
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    profileData: getUserPanelData(state),
    userState: state.UserProfileReducer,
    searchTextState: state.SearchResultsReducer.searchText,
    isSearchLoading: state.SearchResultsReducer.isSearchDataLoading,
    taskResults: state.SearchResultsReducer.taskResults,
    flowResults: state.SearchResultsReducer.flowResults,
    datalistResults: state.SearchResultsReducer.datalistResults,
    userResults: state.SearchResultsReducer.userResults,
    teamResults: state.SearchResultsReducer.teamResults,
  };
};

export default connect(mapStateToProps)(ProfileDropDown);
