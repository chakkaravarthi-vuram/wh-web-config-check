import React, { useEffect, useRef, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import { isMobileScreen, onWindowResize } from 'utils/UtilityFunctions';
import SideMenu from './side_menu/SideMenu';

import TopNavBar from './top_nav_bar/TopNavBar';
import styles from './LeftNavBar.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import {
  NavBarDataChange,
  NavToggle,
  NavToggleClose,
} from '../../../redux/actions/NavBar.Action';
import { EDIT_DATA_LIST, EDIT_FLOW } from '../../../urls/RouteConstants';

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

function LeftNavBar(props) {
  const {
    toggleFunction,
    toggleState,
    toggleCloseFunction,
    updateIncomingMessages,
    updateUserStatus,
    isNavVisible,
    isTrialDisplayed,
    navBarChange,
    // onUserProfileDropdownClickHandler,
  } = props;
  const [isMobile, setIsMobile] = useState(isMobileScreen());
  const history = useHistory();
  const windowResize = () => {
    setIsMobile(isMobileScreen());
  };
  useEffect(() => {
    console.log('isMobileisMobile', isMobile);
    onWindowResize(windowResize);
    return () => window.removeEventListener('resize', windowResize);
  }, []);
  useEffect(() => {
    console.log('useEffect dependencies', toggleState);
  }, [toggleState]);
  const closeModal = () => {
    if (isMobile) toggleCloseFunction();
  };
  const wrapperRef = useRef(null);
  useClickOutsideDetector(wrapperRef, closeModal);
  useEffect(() => {
    const mainMenuElement = document.getElementById('navMenu');
    mainMenuElement && mainMenuElement.addEventListener('scroll', () => {
      if (mainMenuElement.scrollTop === 0) {
        mainMenuElement.classList.remove('MenuShowBefore');
      } else {
        mainMenuElement.classList.add('MenuShowBefore');
      }
      return () => {
        mainMenuElement.removeEventListener();
      };
    });
  }, []);
  const Toogle = () => {
    toggleFunction({ isNavOpen: !toggleState });
  };

  useEffect(() => {
    if (history?.location?.pathname?.includes(EDIT_DATA_LIST) || history?.location?.pathname?.includes(EDIT_FLOW)) {
      navBarChange({ isNavOpen: false });
    }
  }, [history?.location?.pathname]);

  console.log('toggleStateqweqweqwe', isNavVisible, history);
  return !(isMobile && toggleState) ? (
    <div className={(styles.DashboardWrapper, BS.D_FLEX)}>
      <aside
        ref={wrapperRef}
        className={cx(
          styles.Sidebar,
          !toggleState && styles.hidden,
          gClasses.ZIndex2,
          BS.P_FIXED,
          isTrialDisplayed && styles.TrialHeight,
        )}
        role={ARIA_ROLES.NAVIGATION}
      >
        <TopNavBar isCollapsed={toggleState} changeCollapseState={Toogle} />
        <SideMenu changeCollapseState={Toogle} updateIncomingMessages={updateIncomingMessages} updateUserStatus={updateUserStatus} isCollapsed={toggleState} />
      </aside>
      <div className={styles.SideBarOverlay} />
    </div>
  ) : null;
}

const mapStateToprops = (state) => {
  return {
    toggleState: state.NavBarReducer.isNavOpen,
    isNavVisible: state.NavBarReducer.isNavVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleFunction: (data) => {
      dispatch(NavToggle(data));
    },
    toggleCloseFunction: () => {
      dispatch(NavToggleClose());
    },
    navBarChange: (data) => {
      dispatch(NavBarDataChange(data));
    },
  };
};

export default withRouter(
  connect(mapStateToprops, mapDispatchToProps)(LeftNavBar),
);
