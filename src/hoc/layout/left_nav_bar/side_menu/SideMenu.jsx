import React, { useState, useRef } from 'react';
import cx from 'classnames/bind';

import MainMenu from './main_menu/MainMenu';

import styles from '../../Layout.module.scss';

function SideMenu(props) {
  const { changeCollapseState,
    // updateIncomingMessages, updateUserStatus,
    isCollapsed } = props;
  const [isChatCollapsed,
    // setIsChatCollapsed,
  ] = useState(false);
  const listContainer = useRef(null);
  const overAllContainer = useRef(null);

  return (
    <div className={cx(styles.navBlock)} ref={overAllContainer}>
      <MainMenu changeCollapseState={changeCollapseState} isChatCollapsed={isChatCollapsed} isNavCollapsed={isCollapsed} listContainer={listContainer} />
      {/* <SpacesMenu /> */}
      {/* <ChatMenu updateIncomingMessages={updateIncomingMessages} updateUserStatus={updateUserStatus} isCollapsed={isChatCollapsed} setIsCollapsed={setIsChatCollapsed} listContainer={listContainer} overAllContainer={overAllContainer} /> */}
    </div>
  );
}

export default SideMenu;
