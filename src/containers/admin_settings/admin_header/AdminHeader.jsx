import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import AutoPositioningPopper, {
  POPPER_PLACEMENTS,
} from 'components/auto_positioning_popper/AutoPositioningPopper';
import { connect } from 'react-redux';
import { adminSettingsStateChange } from 'redux/actions/AdminSettings.Action ';
import { isMobileScreen } from 'utils/UtilityFunctions';
  import { useHistory } from 'react-router-dom';
  import { useTranslation } from 'react-i18next';
import { ROLES } from 'utils/Constants';
import styles from './AdminHeader.module.scss';
import { ADMIN_SETTINGS_NAVBAR_STRINGS } from '../AdminSettings.strings';
import { ACCOUNT_SETTINGS,
  USER_MANAGEMENT,
  USAGE_DASHBOARD_USAGE_SUMMARY,
  LIBRARY_MANAGEMENT,
  LANGUAGE_CALENDAR,
  OTHER_SETTINGS,
  NOTICE_BOARD_SETTINGS,
  ADMIN_SETTINGS,
  DEV_USER } from '../../../urls/RouteConstants';
import { routeNavigate } from '../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../utils/Constants';

function useClickOutsideDetector(ref, closeModal) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        closeModal();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

function AdminHeaderLayout(props) {
  const { tabChange, currentTabIndex, Role } = props;
  const { t } = useTranslation();
  const [isMobileView, setMobileView] = useState(isMobileScreen());
  const [referencePopperElement] = useState(null);
  const [toggleShow, setToggleShow] = useState(false);
  const wrapperRef = useRef(null);
  let getAdminSettingsUrl = null;
  const history = useHistory();

  const mobileViewScreen = () => {
    setMobileView(isMobileScreen());
  };

  useEffect(() => {
    window.addEventListener('resize', mobileViewScreen);
  });

  const closeDropdown = () => {
      setToggleShow(false);
  };

  useClickOutsideDetector(wrapperRef, closeDropdown);

  const onNavClick = (e, navValue) => {
    e.preventDefault();
    tabChange(navValue);
    const adminHeaderPtahName = `${ADMIN_SETTINGS}${getAdminSettingsUrl(navValue)}`;
    routeNavigate(history, ROUTE_METHOD.PUSH, adminHeaderPtahName, null, null);
  };

  getAdminSettingsUrl = (selectedCardTab) => {
    if (selectedCardTab === 2) return USER_MANAGEMENT;
    if (selectedCardTab === 3) return USAGE_DASHBOARD_USAGE_SUMMARY;
    if (selectedCardTab === 4) return LIBRARY_MANAGEMENT;
    if (selectedCardTab === 5) return LANGUAGE_CALENDAR;
    if (selectedCardTab === 6) return OTHER_SETTINGS;
    if (selectedCardTab === 7) return NOTICE_BOARD_SETTINGS;
    return ACCOUNT_SETTINGS;
  };

  const getAdminSettingsTabIndex = () => {
    const pathName = history.location.pathname;
    switch (pathName) {
      case `${DEV_USER}${ADMIN_SETTINGS}${ACCOUNT_SETTINGS}`:
        return 1;
      case `${DEV_USER}${ADMIN_SETTINGS}${USER_MANAGEMENT}`:
        return 2;
      case `${DEV_USER}${ADMIN_SETTINGS}${USAGE_DASHBOARD_USAGE_SUMMARY}`:
        return 3;
      case `${DEV_USER}${ADMIN_SETTINGS}${LIBRARY_MANAGEMENT}`:
        return 4;
      case `${DEV_USER}${ADMIN_SETTINGS}${LANGUAGE_CALENDAR}`:
        return 5;
      case `${DEV_USER}${ADMIN_SETTINGS}${OTHER_SETTINGS}`:
        return 6;
      case `${DEV_USER}${ADMIN_SETTINGS}${NOTICE_BOARD_SETTINGS}`:
        return 7;
      default: return 1;
    }
  };

  useEffect(() => {
    tabChange(getAdminSettingsTabIndex());
  }, []);

  const NavBarValues = (Role.role === ROLES.ADMIN) && (
    ADMIN_SETTINGS_NAVBAR_STRINGS.OPTION_LIST(t).map(
      (nav) =>
      (
        <button
          className={cx(
            BS.D_FLEX,
            gClasses.CenterV,
            gClasses.ClickableElement,
            gClasses.CursorPointer,
            styles.AdminConatiner,
          )}
          onClick={(e) => onNavClick(e, nav.value)}
          aria-label={nav.label}
        >
          <span
            className={cx(
              gClasses.PR15,
              gClasses.ML15,
              styles.Label,
              styles.Margin,
              ((nav.value === 4) && styles.HideLabelBorder),
              (currentTabIndex === nav.value || (nav.value === 1 && [1, 5, 6, 7].includes(currentTabIndex))) && styles.ActiveSvg,
            )}
          >
            <span className={cx(styles.Icon)}>{nav.icon}</span>
            {!isMobileView &&
              <span className={cx(gClasses.ML12, gClasses.CenterV, (currentTabIndex === nav.value || (nav.value === 1 && [1, 5, 6, 7].includes(currentTabIndex))) ? cx(gClasses.FontWeight500, gClasses.FTwo13BlueV39) : gClasses.FTwo13)}>{nav.label}</span>
            }
            <div className={(currentTabIndex === nav.value || (nav.value === 1 && [1, 5, 6, 7].includes(currentTabIndex))) && styles.Active} />
          </span>
        </button>
      ),
    )
  );

  return (
    <>
      {console.log('fsgsgd1', toggleShow)}
      {NavBarValues}
      <div ref={wrapperRef}>
        <AutoPositioningPopper
          className={cx(gClasses.ZIndex5, gClasses.MT3, styles.CreateDropDown)}
          placement={POPPER_PLACEMENTS.BOTTOM_END}
          fallbackPlacements={POPPER_PLACEMENTS.TOP_END}
          bottomEndPlacementClasses={styles.CreateDropdownBottomPlacementClass}
          referenceElement={referencePopperElement}
          isPopperOpen={toggleShow}
        />
      </div>
    </>
  );
}

const mapStateToprops = (state) => {
  return {
    currentTabIndex: state.AdminSettingsReducer.admin_setting_tab_index,
    Role: state.RoleReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tabChange: (data) => dispatch(adminSettingsStateChange(data)),
  };
};

export default connect(mapStateToprops, mapDispatchToProps)(AdminHeaderLayout);
