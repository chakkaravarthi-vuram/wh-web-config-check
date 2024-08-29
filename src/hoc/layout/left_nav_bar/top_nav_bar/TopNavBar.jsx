import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import MenuIcon from 'assets/icons/MenuIcon';
import { isMobileScreen, routeNavigate } from 'utils/UtilityFunctions';
import { getUserPanelData } from 'redux/selectors/LandingPageSelctor';
import PlusIcon from 'assets/icons/chat/PlusIcon';
import { BUTTON_TYPE, MODULE_TYPES, ALL_ACTIONS, ROLES, ROUTE_METHOD } from 'utils/Constants';
import Button from 'components/form_components/button/Button';
import { get } from 'utils/jsUtility';
import { LANDING_PAGE_TOPICS, SIDE_NAV_BAR } from 'containers/landing_page/main_header/common_header/CommonHeader.strings';
import gClasses from '../../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';
import Navbarstyles from '../LeftNavBar.module.scss';
import { HOME } from '../../../../urls/RouteConstants';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';

function TopNavBar(props) {
  const { t } = useTranslation();
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
  const history = useHistory();
  const { changeCollapseState, isCollapsed, isNavOpen, role, acc_logo } = props;
  function onclickHandler() {
    changeCollapseState();
  }
  const [toggleShow, setToggleShow] = useState(false);
  const wrapperRef = useRef(null);
  const closeCreateDropdown = () => {
    setToggleShow(false);
  };
  useClickOutsideDetector(wrapperRef, closeCreateDropdown);
  const getLable = (role) => {
    if (role === 3 || role === 1) {
      return t(SIDE_NAV_BAR.CREATE);
    }
    return t(LANDING_PAGE_TOPICS.CREATE_TASK);
  };

  const createButtonClicked = () => {
    if (role === ROLES.ADMIN || role === ROLES.FLOW_CREATOR) {
      const currentParams = queryString.parseUrl(history.location.pathname);
      let newParams = { ...get(currentParams, ['query'], {}) };
      newParams = { ...newParams, create: ALL_ACTIONS };
      const search = new URLSearchParams(newParams).toString();
      routeNavigate(history, ROUTE_METHOD.REPLACE, HOME, search);
      setToggleShow(!toggleShow);
    } else {
      const currentParams = queryString.parseUrl(history.location.pathname);
      const newParams = { ...get(currentParams, ['query'], {}), create: MODULE_TYPES.TASK };
      const navBarSearchParams = new URLSearchParams(newParams).toString();
      routeNavigate(history, ROUTE_METHOD.REPLACE, EMPTY_STRING, navBarSearchParams);
    }
  };

  return (
<div>
    <div className={cx(Navbarstyles.SidebarHead, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER, BS.FLEX_WRAP_WRAP)}>
       {(isNavOpen || (isMobileScreen() && !isNavOpen)) &&
       (
        <div className={cx(Navbarstyles.ImagePlaceholder)}>
        <div className={cx(Navbarstyles.ImageContainer)} aria-hidden="true">
            {acc_logo && (
                <img src={acc_logo} alt="" />
            )}
        </div>
        </div>
       )
    }
      <div className={gClasses.CenterV}>
       <button
        className={cx(Navbarstyles.SidebarToggle, isCollapsed && Navbarstyles.rotated, Navbarstyles.TransparentBtn)}
        // title="Menu"
        // type="button"
        onClick={onclickHandler}
        aria-expanded={isMobileScreen() ? !isCollapsed : isCollapsed}
        aria-label="Main menu"
       >
        <MenuIcon ariaHidden role={ARIA_ROLES.IMG} title={t(SIDE_NAV_BAR.MENU_LABEL)} className={cx(Navbarstyles.Icon, gClasses.CursorPointer)} />
       </button>
      </div>
    </div>
  <div className={cx(BS.W100, Navbarstyles.CreateButtonWrapper, (!isNavOpen && !isMobileScreen()) && Navbarstyles.CreateButtonWrapperNavClosed)}>
    <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, BS.W100)}>
        <Button
          onClick={() => createButtonClicked()}
          className={cx(BS.TEXT_NO_WRAP, gClasses.PL15, (isNavOpen || isMobileScreen()) && Navbarstyles.CreateButton, (!isNavOpen && !isMobileScreen()) && Navbarstyles.CreateButtonNavClose)}
          buttonType={BUTTON_TYPE.PRIMARY}
          // buttonRef={setReferencePopperElement}
        >
          <div className={gClasses.CenterVH}>
          <PlusIcon
            id="createTaskButtonId"
            className={cx(Navbarstyles.PlusIcon, (!isNavOpen && !isMobileScreen()) && Navbarstyles.PlusIconNavClose)}
            // onClick={() => createButtonClicked()}
            // role={ARIA_ROLES.IMG}
            ariaHidden="true"
          />
         {(isNavOpen || isMobileScreen()) &&
         <span>
          {getLable(role)}
         </span>}
          </div>
        </Button>
    </div>
  </div>
</div>
  );
}
const mapStateToProps = ({
  RoleReducer,
  AdminProfileReducer,
  DeveloperProfileReducer,
  MemberProfileReducer,
  UserProfileReducer,
  NavBarReducer,
}) => {
  return {
   isNavOpen: NavBarReducer.isNavOpen,
    ...getUserPanelData({
    RoleReducer,
    AdminProfileReducer,
    DeveloperProfileReducer,
    MemberProfileReducer,
    UserProfileReducer,
  }),
  };
};
export default connect(mapStateToProps)(TopNavBar);
