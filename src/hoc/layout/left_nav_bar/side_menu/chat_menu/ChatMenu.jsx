import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import DownArrowIcon from 'assets/icons/chat/DownArrowIcon';
import gClasses from 'scss/Typography.module.scss';
import AutoPositioningPopper, {
  POPPER_PLACEMENTS,
} from 'components/auto_positioning_popper/AutoPositioningPopper';
import { CHAT_SOCKET_EVENTS, ROUTE_METHOD } from 'utils/Constants';
import { getUserByIdApi } from 'axios/apiService/userProfile.apiService';
import { DATALIST_USERS } from 'urls/RouteConstants';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import PlusIconRoundedCorners from 'assets/icons/chat/PlusIconRoundedCorners';
import AddNewChat from './add_new_chat/AddNewChat';
import styles from './ChatMenu.module.scss';
import NavbarStyles from '../../LeftNavBar.module.scss';
import ChatMenuListItem from './chat_menu_list_item/ChatMenuListItem';
import { onUserChatClickHandler } from './ChatMenu.utils';
import GET_THREADS_BY_USER from './ChatMenu.string';

import { getCardCount } from '../../../../../utils/generatorUtils';
import { getProfileDataForChat, onWindowResize, keydownOrKeypessEnterHandle, isMobileScreen, routeNavigate } from '../../../../../utils/UtilityFunctions';
import {
  getThreadsByUserThunk,
  getThreadsByUserSuccess,
} from '../../../../../redux/actions/ChatScreen.Action';
import { isEmpty } from '../../../../../utils/jsUtility';

let perPageDataCount;
function ChatMenu(props) {
  const {
    isNavOpen,
    chatScreenState: {
      selectedThreadId,
      isDataLoading,
      chatThreads,
      nextPage,
      after,
      dataCountPerCall,
      isError,
      reloadChatThreads,
      reloadDataCountPerPage,
    },
    getThreadsByUser,
    isCollapsed,
    setIsCollapsed,
    listContainer,
    overAllContainer,
  } = props;
  const [userMetaData, setUserMetaData] = useState(undefined);
  const [isAddNewChatDropdownVisible, setIsAddNewChatDropdownVisible] =
    useState(false);
  const [referencePopperElement, setReferencePopperElement] = useState(null);
  const [chatContainerHeight, setChatContainerHeight] = useState('auto');
  const refChatMenuListItems = useRef(null);
  const [isLocalCollapsed, setIsLocalCollapsed] = useState(isCollapsed);
  const containerId = 'chatMenuListItems';

  const userStatusHandler = (data) => {
    const { updateUserStatus } = props;
    const { user, status } = data;
    updateUserStatus({
      user,
      status: (status === 'Online'),
    });
  };
  const getThreads = (userProfileData, reload = false) => {
    const objUserMetaData = {
      user: userProfileData.user,
      account_id: userProfileData.account_id,
      socket: userProfileData.socket,
      id: userProfileData.id,
      account_domain: userProfileData.account_domain,
    };
    setUserMetaData(objUserMetaData);
    const { id, account_id, account_domain } = objUserMetaData;

    const QUERY_VARIABLES = {
      user_id: id,
      account_id,
      after: reload ? '' : after,
      limit: reload && reloadDataCountPerPage ? reloadDataCountPerPage : perPageDataCount, //  dataCountPerCall,
      account_domain,
    };
    console.log('dataCountPerCall ', dataCountPerCall);
    getThreadsByUser(GET_THREADS_BY_USER, QUERY_VARIABLES, reload);
  };
  const getAndSetUserProfileData = (userProfileData) => {
    // socket - users online status listener
    userProfileData.socket.on(CHAT_SOCKET_EVENTS.ON_EVENTS.USER_STATUS, (data) => {
      console.log('chat socket - UserStatushandler', data);
      userStatusHandler(data);
    });

    userProfileData.socket.on(
      CHAT_SOCKET_EVENTS.ON_EVENTS.CHAT,
      async (socketData) => {
        console.log('chat socket - incoming messages userProfileData.user_id', socketData, userProfileData.id);
        const messageObj = {
          chat_id: socketData.chat_id,
          user: socketData.user,
          user_id: socketData.user_id,
          text: socketData.text,
          created_date: socketData.created_date,
          first_name: socketData.metadata.first_name,
          last_name: socketData.metadata.last_name,
        };
        const { updateIncomingMessages } = props;
        updateIncomingMessages(messageObj, socketData.metadata.threadId, userProfileData.id);
      },
    );
    getThreads(userProfileData);
  };
  const loadMore = () => {
    const userProfileData = getProfileDataForChat();
    getThreads(userProfileData);
  };
  const recurseGetUserProfileData = () => {
    const userProfileData = getProfileDataForChat();
    if (userProfileData && userProfileData.user && userProfileData.socket && userProfileData.account_domain) {
      getAndSetUserProfileData(userProfileData);
    } else {
      setTimeout(recurseGetUserProfileData, 500);
    }
  };
  const removeSocketListeners = () => {
    const userProfileData = getProfileDataForChat();
    if (userProfileData && userProfileData.user && userProfileData.socket) {
      const { socket } = userProfileData;
      socket.off(
        CHAT_SOCKET_EVENTS.ON_EVENTS.CHAT,
      );
      socket.off(
        CHAT_SOCKET_EVENTS.ON_EVENTS.USER_STATUS,
      );
    }
  };

  const windowResize = () => {
    if (overAllContainer && overAllContainer.current && listContainer && listContainer.current) {
      const chatHeight = overAllContainer.current.clientHeight - listContainer.current.clientHeight - 72 - 60;
      setChatContainerHeight(chatHeight);
    }
  };

  useEffect(() => {
    windowResize();
    onWindowResize(windowResize);
  });
  useEffect(() => {
    let listHeight = null;
    if (refChatMenuListItems) {
      listHeight = overAllContainer.current.clientHeight - listContainer.current.clientHeight - 42;
    }
    listHeight = getCardCount(listHeight, 56) + 2;
    perPageDataCount = listHeight;
    console.log('getCardCount chat check chatmenu', props);
  }, [chatContainerHeight]);

  useEffect(() => {
    let listHeight = null;
    if (refChatMenuListItems) {
      listHeight = overAllContainer.current.clientHeight - listContainer.current.clientHeight - 42;
    }
    listHeight = getCardCount(listHeight, 56) + 2;
    perPageDataCount = listHeight;
    console.log('getCardCount chat check chatmenu', props);
    recurseGetUserProfileData();
    return () => {
      removeSocketListeners();
    };
  }, []);

  useEffect(() => {
    if (reloadChatThreads) {
      const userProfileData = getProfileDataForChat();
      if (userProfileData && userProfileData.user && userProfileData.socket && userProfileData.account_domain) {
        getThreads(userProfileData, true);
      }
    }
  }, [reloadChatThreads]);

  useEffect(() => {
    const userProfileData = getProfileDataForChat();
    if (userProfileData && userProfileData.user && userProfileData.socket && userProfileData.account_domain) {
      getThreads(userProfileData);
    }
  }, [dataCountPerCall]);

  const onChatClickHandler = (data) => {
    onUserChatClickHandler(data);
    setIsAddNewChatDropdownVisible(false);
  };
  const onChatMenuItemClickHandler = (data) => {
    onUserChatClickHandler(data, false);
    setIsAddNewChatDropdownVisible(false);
  };
  const history = useHistory();
  const onUserIconClick = (userId) => {
    setIsAddNewChatDropdownVisible(false);
    let datalist_info = {};
    getUserByIdApi(userId)
      .then((response) => {
        datalist_info = response.datalist_info;
        const dataListUserIdPathName = `${DATALIST_USERS}/${datalist_info.data_list_uuid}/${datalist_info.entry_id}`;
        routeNavigate(history, ROUTE_METHOD.PUSH, dataListUserIdPathName);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const toggleChatMenu = () => {
    setIsCollapsed(!isCollapsed);
    if (isCollapsed) {
      setIsLocalCollapsed(!isLocalCollapsed);
    }
  };

  const addNewChatDropdown = (
    <AutoPositioningPopper
      className={cx(styles.Popper)}
      isPopperOpen={isAddNewChatDropdownVisible}
      referenceElement={referencePopperElement}
      placement={POPPER_PLACEMENTS.RIGHT}
      fallbackPlacements={[POPPER_PLACEMENTS.RIGHT_START, POPPER_PLACEMENTS.RIGHT, POPPER_PLACEMENTS.TOP_START]}
      rightStartPlacementClasses={styles.AddNewChatRightStartPlacement}
      rightPlacementClasses={styles.AddNewChatRightStartPlacement}
      fixedStrategy
      popperViewOnBlur={() => setIsAddNewChatDropdownVisible(false)}
      onBlur={() => setIsAddNewChatDropdownVisible(false)}
      enableOnBlur
      enableAutoFocus
      onPopperBlur={(e, referenceElement) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsAddNewChatDropdownVisible(false);
          referenceElement?.focus();
        }
      }}
    >
      <AddNewChat
        userMetadata={userMetaData}
        onClick={onChatClickHandler}
        onUserIconClick={onUserIconClick}
      />
    </AutoPositioningPopper>
  );
  let dataLength = 0;
  if (!isEmpty(chatThreads)) {
    dataLength = chatThreads.length;
  }
  return (
      <ul
        className={cx(
          NavbarStyles.SidebarBodyMenu,
          NavbarStyles.ChatMenu,
          !isNavOpen && isCollapsed && gClasses.MB25,
          gClasses.H48,
        )}
        role={ARIA_ROLES.PRESENTATION}
      >
        <li role={ARIA_ROLES.PRESENTATION} className={BS.H100}>
          <a
            tabIndex={-1}
            className={cx(NavbarStyles.ShowChatBtn, styles.ShowChatButton, gClasses.CursorDefault)}
            role={ARIA_ROLES.PRESENTATION}
          >
            <DownArrowIcon
              className={cx(
                NavbarStyles.arrowDown,
                isCollapsed && styles.Rotate,
                NavbarStyles.Icon,
                gClasses.CursorPointer,
              )}
              // onClick={() => setIsCollapsed(!isCollapsed)}
              onClick={toggleChatMenu}
              isButtonColor
              role={ARIA_ROLES.IMG}
              ariaHidden="true"
            />
            {(isNavOpen || (isMobileScreen() && !isNavOpen)) &&
            (
            <span
              className={cx(gClasses.CursorPointer, styles.ChatTitle)}
              // onClick={() => setIsCollapsed(!isCollapsed)}
              onClick={toggleChatMenu}
              onKeyPress={(e) => keydownOrKeypessEnterHandle(e) && toggleChatMenu()}
              role="button"
              aria-expanded={!isCollapsed}
              tabIndex={0}
            >
              Chat
            </span>
            )}
            <span
              className={cx(
                NavbarStyles.Icon,
                NavbarStyles.Plus,
                isNavOpen && cx(styles.PlusButton, gClasses.CenterVH),
                gClasses.CursorPointer,
              )}
              ref={setReferencePopperElement}
              onClick={() =>
                setIsAddNewChatDropdownVisible(!isAddNewChatDropdownVisible)
              }
              onKeyPress={() =>
                setIsAddNewChatDropdownVisible(!isAddNewChatDropdownVisible)
              }
              role="button"
              tabIndex={0}
              aria-label="Add chat"
            >
              <PlusIconRoundedCorners ariaLabel="Add Chat" role={ARIA_ROLES.IMG} />
            </span>
          </a>
            {addNewChatDropdown}
          {!isLocalCollapsed &&
          (
          <ul
            className={cx(
              NavbarStyles.ChatSubMenu,
              gClasses.ScrollBar,
              NavbarStyles.visible,
              isCollapsed ? styles.Content : styles.Show,
              (!isNavOpen && !isMobileScreen()) && styles.ChatMenuList,
              (isNavOpen || (isMobileScreen() && !isNavOpen)) && styles.ChatMenuExpanded,
            )}
            id={containerId}
            ref={refChatMenuListItems}
            style={{ height: chatContainerHeight }}
            onTransitionEnd={() => setIsLocalCollapsed(isCollapsed)}
            role="presentation"
          >
            <InfiniteScroll
              dataLength={dataLength}
              next={loadMore}
              hasMore={nextPage}
              scrollThreshold={0.6}
              // loader={<ChatMenuListItem isDataLoading={isDataLoading} />}
              scrollableTarget={containerId}
              className={cx(
                gClasses.ScrollBar,
                styles.InfiniteScroll,
                gClasses.PB10,
                gClasses.PT2,
              )}
            >
              <ChatMenuListItem
                selectedThreadId={selectedThreadId}
                isDataLoading={isDataLoading}
                dataCountPerCall={dataCountPerCall}
                list={chatThreads}
                onClick={onChatMenuItemClickHandler}
                isError={isError}
              />
            </InfiniteScroll>
          </ul>
           )}
        </li>
      </ul>
  );
}

const mapStateToProps = (state) => {
  return {
    isNavOpen: state.NavBarReducer.isNavOpen,
    chatScreenState: state.ChatScreenReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getThreadsByUser: (query, variables, reload) => {
      dispatch(getThreadsByUserThunk(query, variables, reload));
    },
    setState: (data) => {
      dispatch(getThreadsByUserSuccess(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatMenu);
