import React from 'react';
import {
  POPPER_PLACEMENTS,
} from 'components/auto_positioning_popper/AutoPositioningPopper';
import FeedbackIcon from 'assets/icons/FeedbackIcon';
import HelpGearIcon from 'assets/icons/HelpGearIcon';
import SettingsPopper from 'components/usersettings_popper/SettingsPopper';
import { LOGGED_IN_NAVBAR_STRINGS } from 'components/logged_in_nav_bar/LoggedInNavbar';
import cx from 'classnames/bind';
import { LOGGED_IN_NAVBAR } from 'components/logged_in_nav_bar/LoggedInNavbarTranlsation.strings';
import { useTranslation } from 'react-i18next';
import Navbarstyles from '../LeftNavBar.module.scss';
import { ARIA_ROLES } from '../../../../utils/UIConstants';
import styles from './BottomUserBar.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';

function BottomUserBar(props) {
  const { t } = useTranslation();
  const {
    onUserProfileDropdownClickHandler,
  } = props;
  const list = [
    {
      TEXT: t(LOGGED_IN_NAVBAR.FEEDBACK),
      ICON: <FeedbackIcon role={ARIA_ROLES.IMG} title={t(LOGGED_IN_NAVBAR.FEEDBACK)} />,
      LINK: 'https://workhall.atlassian.net/servicedesk/customer/portal/1',
    },
    {
      TEXT: t(LOGGED_IN_NAVBAR.USER_GUIDE),
      ICON: <HelpGearIcon role={ARIA_ROLES.IMG} title={t(LOGGED_IN_NAVBAR.USERGUIDE_ICON)} />,
      LINK: 'https://workhall-user-guides.s3.ap-south-1.amazonaws.com/Workhall+User+Guide+-+New.pdf',
    },
  ];
  return (
      <div className={Navbarstyles.SidebarFooter}>
        <div className={Navbarstyles.SidebarUser}>
          <SettingsPopper
            popperPlacement={POPPER_PLACEMENTS.TOP}
            list={LOGGED_IN_NAVBAR_STRINGS(t).NON_ADMIN_USER_PROFILE_DROPDOWN}
            isUserSettings
            onUserProfileDropdownClickHandler={
              onUserProfileDropdownClickHandler
            }
            downArrow
            optionListClass={styles.optionList}
            dropdownListContainerClass={cx(styles.userPopperContainer, Navbarstyles.userPopperContainer)}
          />
          <SettingsPopper
            list={list}
            popperPlacement={POPPER_PLACEMENTS.TOP}
            buttonIconClass={styles.supportIcon}
            optionListClass={gClasses.FontWeight500}
            menuClass={cx(styles.supportmenu, Navbarstyles.supportmenu)}
            dropdownListContainerClass={styles.supportPopperContainer}
          />
        </div>
      </div>
  );
}

export default BottomUserBar;
