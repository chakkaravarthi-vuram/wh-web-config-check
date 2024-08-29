import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames/bind';
import moment from 'moment';
import MoonLoader from 'loaders/moon_loader/MoonLoader';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { chatCommonClassName } from 'components/form_components/modal/Modal.strings';

import { ARIA_ROLES, BS } from 'utils/UIConstants';
import CloseIcon from 'assets/icons/CloseIcon';
import UserImage from 'components/user_image/UserImage';
import { isValidEmail, keepTabFocusWithinModal, keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { CHAT_SOCKET_EVENTS } from 'utils/Constants';
import ChatReponseHandlerIcon from 'assets/icons/chat/ChatReponseHandlerIcon';

import gClasses from 'scss/Typography.module.scss';
import ChatInput from '../chat_input/ChatInput';
import AllMessages from '../all_messages/AllMessages';
import TypingBubble from '../typing_bubble/TypingBubble';

import styles from './ChatWindow.module.scss';
import { getMessagesDataThunk } from '../../../redux/actions/ChatScreen.Action';
import jsUtils from '../../../utils/jsUtility';
import GET_MESSAGES, { CHAT_SOCKET_ERROR_CODES } from './ChatWindow.string';

function ChatWindow(props) {
  const {
    data,
    data: {
      threadId,
      threadName,
      threadPic,
      firstName,
      lastName,
      isActive,
      threadType,
      threadEmail,
      userId,
      isLoadingMessages,
      isError,
      threadStatus,
      message_list,
      typing_list,
      notificationCount,
      nextPage,
      message,
      isMinimized = false,
      isFocusToggle,
    },
    index,
    profileData,
    updateSelectedChatThreadsData,
  } = props;
  const msgWindowContainerRef = useRef(null);
  const [threadIdTemp, setThreadId] = useState(threadId);
  const [disableSend, disableSendFunction] = useState(false);
  const [resetStyle, setResetStyleFlag] = useState(false);
  const [ariaLabel, setAriaLabel] = useState(`Message ${firstName} ${lastName}`);
  const windowId = `window-${index}`;

  const closeChat = (e) => {
    e.stopPropagation();
    const { closeChatWindow } = props;
    closeChatWindow(threadId);
  };

  const handleEscClick = (event) => {
    const chatClasses = document.getElementsByClassName(chatCommonClassName);
    if (
      event.key === 'Escape' &&
      event.keyCode === 27
    ) {
      const { length } = chatClasses;
      if (length && chatClasses[length - 1].id === windowId && msgWindowContainerRef && msgWindowContainerRef.current) {
        msgWindowContainerRef.current.click();
      }
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', handleEscClick);
    return () => {
      document.removeEventListener('keydown', handleEscClick);
    };
  }, [index]);

  const getMessagesFromGraphql = async (room_id) => {
    const { getMessagesApi, data: { isAuthorized, after, nextPage } } =
      props;
    const { account_id, id, account_domain } = profileData;
    console.log('getMessagesFromGraphql', isAuthorized, threadId, nextPage);
    if (threadId && nextPage) {
      // graphql get Messages
      const QUERY_VARIABLES = {
        flow_id: room_id,
        account_id,
        user_id: id,
        after,
        limit: 10, // dynamic count has to be implemented
        account_domain,
      };
      console.log('QUERY_VARIABLES', QUERY_VARIABLES);
      getMessagesApi(GET_MESSAGES, QUERY_VARIABLES, data);
    }
  };
  const initializeSocketListeners = (room_id) => {
    const { socket } = profileData;
    socket.on(CHAT_SOCKET_EVENTS.ON_EVENTS.RECONNECT, () => {
      console.log('Chat socket - reconnected');
      disableSendFunction(false);
    });

    socket.on(CHAT_SOCKET_EVENTS.ON_EVENTS.TYPING, (socketData) => {
      console.log(
        'Chat Socket - Receive Typing Message Indicator',
        threadId,
        socketData.metadata.flow_id,
        jsUtils.isEqual(threadId, socketData.metadata.threadId),
        socketData.user,
        profileData,
      );
      if (
        jsUtils.isEqual(room_id, socketData.metadata.flow_id) &&
        socketData.user !== profileData.user
      ) {
        const typingObj = {
          type: 'typing_indication',
          user: socketData.user,
          // profile_pic: socketData.metadata.threadPic,
          first_name: socketData.metadata.first_name,
          last_name: socketData.metadata.last_name,
        };
        const { updateTypingList } = props;
        updateTypingList(threadId, typingObj);
      }
    });
  };
  const joinP2PSocket = async (roomId = threadId, additionalData = {}) => {
    const { account_id, user, id, socket } = profileData;
    socket.emit(
      CHAT_SOCKET_EVENTS.EMIT_EVENTS.JOIN_P2P,
      {
        user: [
          { user, id },
          { user: threadEmail, id: userId, ...additionalData },
        ],
        metadata: {
          flow_id: roomId,
          account_id,
          type: 'p2p',
        },
      },
      async (code, error, room_id, userOnlineStatusArray) => {
        console.log(
          'Chat Socket - Joining P2P response',
          code,
          error,
          room_id,
          threadId,
        );
        if (code === CHAT_SOCKET_ERROR_CODES.NOT_AUTHORIZED) {
          updateSelectedChatThreadsData(
            threadId,
            {
              isAuthorized: false,
              isError: true,
              is_messages_loading: false,
            },
          );
        } else {
          setThreadId(room_id);
          disableSendFunction(false);
          let threadStatus = false;
          console.log('before threadId @@@@@', threadId);
          if (userOnlineStatusArray) {
            const index = userOnlineStatusArray.findIndex((userStatus) => (userStatus.user_id === userId));
            if (index > -1) {
              threadStatus = userOnlineStatusArray[index].status ? userOnlineStatusArray[index].status : false;
              const { updateUserStausInChatMenu } = props;
              updateUserStausInChatMenu(userOnlineStatusArray[index]);
            }
          }
          await updateSelectedChatThreadsData(
            threadId,
            { threadId: room_id, isAuthorized: true, threadStatus },
            true,
          );
          console.log('after threadId @@@@@', threadId, room_id);
          initializeSocketListeners(room_id);
          getMessagesFromGraphql(room_id);
        }
      },
    );
  };
  // const joinFlowTaskSocket = () => { };
  const joinChatAndGetMessages = () => {
    if (threadType === 'p2p') {
      if (isValidEmail(threadId)) {
        joinP2PSocket(EMPTY_STRING, {
          first_name: firstName,
          last_name: lastName,
          is_active: isActive,
        });
      } else {
        joinP2PSocket();
      }
    } else {
      // joinFlowTaskSocket();
    }
  };
  const markAsRead = () => {
    if (notificationCount > 0) {
      const created_date = moment.utc().format();
      const { account_id, user, socket } = profileData;
      console.log(
        'Chat Socket - Mark Messages as Read Chat Socket - Mark Messages as Read',
      );
      socket.emit(
        CHAT_SOCKET_EVENTS.EMIT_EVENTS.READ_CHAT,
        {
          user,
          metadata: {
            flow_id: threadId,
            account_id,
            last_read: created_date,
          },
        },
        (code, error) => {
          const { markMessagesAsRead } = props;
          markMessagesAsRead(threadId);
          console.log('Chat Socket - Mark Messages as Read', code, error);
        },
      );
    }
  };
  const removeSocketListeners = () => {
    // Remove socket listeners
    const { socket } = profileData;
    socket.off(CHAT_SOCKET_EVENTS.ON_EVENTS.TYPING);
    socket.off(CHAT_SOCKET_EVENTS.ON_EVENTS.RECONNECT);
  };
  useEffect(() => {
    joinChatAndGetMessages(false);
    return () => {
      removeSocketListeners();
    };
  }, []);
  useEffect(() => {
    if (notificationCount > 0) {
      markAsRead();
    }

    const checkFocusFn = (e) => keepTabFocusWithinModal(e, windowId);
    if (!isMinimized) {
      window.addEventListener('keydown', checkFocusFn, false);
    }

    return () => window.removeEventListener('keydown', checkFocusFn, false);
  }, [isMinimized]);

  const loadMore = () => {
    getMessagesFromGraphql(threadId);
  };
  const triggerTypingEvent = (value) => {
    setResetStyleFlag((flag) => { if (flag) return !flag; return flag; });
    const { updateSelectedChatThreadsData } = props;
    const { user, account_id, first_name, last_name, socket } = profileData;
    updateSelectedChatThreadsData(threadId, { message: value });
    socket.emit(
      CHAT_SOCKET_EVENTS.EMIT_EVENTS.TYPING,
      {
        user,
        to: '',
        metadata: {
          flow_id: threadIdTemp,
          account_id,
          // threadPic,
          first_name,
          last_name,
        },
      },
      (error, code) => {
        console.log('Chat Socket - Send Typing Message Indicator', error, code);
      },
    );
    if (notificationCount > 0) {
      markAsRead();
    }
  };
  const minMaxHandler = () =>
    updateSelectedChatThreadsData(
      threadId,
      {
        isMinimized: !isMinimized,
      },
    );

  const triggerMessage = (message) => {
    disableSendFunction(true);
    const { user, profile_pic, account_id, first_name, last_name, socket } =
      profileData;
    socket.emit(
      CHAT_SOCKET_EVENTS.EMIT_EVENTS.CHAT,
      {
        to: threadEmail,
        text: message.trim(),
        user,
        metadata: {
          flow_id: threadIdTemp,
          threadId,
          account_id,
          threadType,
          threadName,
          threadPic: profile_pic,
          threadStatus: 'online',
          first_name,
          last_name,
        },
      },
      (code, error) => {
        console.log('Chat Socket - Outgoing Message', code, error);
        if (code !== CHAT_SOCKET_ERROR_CODES.NOT_AUTHORIZED) {
          const { updateSelectedChatThreadsData } = props;
          updateSelectedChatThreadsData(threadId, { message: EMPTY_STRING });
          disableSendFunction(false);
          setResetStyleFlag(true);
          // Screen reader announces that the message is sent
          setAriaLabel((prevLabel) => {
            if (prevLabel === `Message ${firstName} ${lastName}`) {
              return 'Message Sent';
            } else {
              return prevLabel?.charAt(0) === prevLabel.charAt(0).toUpperCase() ? 'message sent' : 'Message Sent';
            }
          });
        }
      },
    );
  };
  let bodyContainer = null;
  let messagesList = <div style={{ height: '100px' }} />;
  let loader = null;
  let typingListComponent = null;
  let errorElement = null;
  let threadsNotLoaded = true;
  if (isLoadingMessages) {
    loader = (
      <div className={styles.Loader}>
        <MoonLoader size={20} />
      </div>
    );
  }
  // console.log('message_list', message_list.length);
  if (!jsUtils.isEmpty(message_list)) {
    threadsNotLoaded = false;
    const { user, profile_pic } = profileData;
    messagesList = (
        <AllMessages messagesList={message_list} threadPic={threadPic} userId={user} userProfilePic={profile_pic} />
    );
  } else if (!isLoadingMessages) {
    if (isError) {
      errorElement = (
        <div className={cx(gClasses.CenterVH, BS.FLEX_COLUMN, BS.H100)}>
          <ChatReponseHandlerIcon role={ARIA_ROLES.IMG} ariaLabel="Chat" />
          <div
            className={cx(
              gClasses.FTwo12GrayV3,
              gClasses.FontWeight500,
              gClasses.MT15,
              BS.TEXT_CENTER,
            )}
            style={{ opacity: 0.8 }}
          >
            Something went wrong, Try again later!
          </div>
        </div>
      );
    } else {
      threadsNotLoaded = false;
      messagesList = (
        <div
          className={cx(
            gClasses.MT30,
            gClasses.CenterV,
            BS.FLEX_COLUMN,
            styles.NoDataContainer,
            gClasses.WordBreakBreakWord,
          )}
        >
          <UserImage
            className={styles.UserImage}
            // firstName={threadName}
            firstName={firstName}
            lastName={lastName}
            src={threadPic}
          />
          <div
            className={cx(
              gClasses.FTwo12GrayV3,
              gClasses.FontWeight600,
              gClasses.MT5,
            )}
          >
            {threadName}
          </div>
          <div className={cx(gClasses.FTwo10GrayV53)}>{threadEmail}</div>
        </div>
      );
    }
  }
  if (!jsUtils.isEmpty(typing_list)) {
    typingListComponent = typing_list.map((data) => (
      <TypingBubble key={index} name={data.first_name} />
    ));
  }
  if (!isMinimized) {
    bodyContainer = (
      <div key={threadId}>
        <div className={cx(styles.OnlineStatusBar, gClasses.CenterV)}>
          <div className={cx(gClasses.CenterV)}>
            <div
              className={cx(
                threadStatus ? styles.OnlineDot : styles.OfflineDot,
                gClasses.MR5,
              )}
            />
            <div className={cx(gClasses.FTwo10GrayV3, gClasses.FontWeight600)}>
              {threadStatus ? 'Active' : 'Away'}
            </div>
          </div>
        </div>
        {loader}
        <div className={styles.ChatArea}>
          <div className={styles.ChatMessages} id={`chatContainer-${threadId}`}>
            {errorElement || (
              <InfiniteScroll
                className={styles.ChatContainer}
                dataLength={message_list.length}
                hasMore={nextPage}
                inverse
                scrollableTarget={`chatContainer-${threadId}`}
                next={loadMore}
                scrollThreshold={0.9}
              >
                {typingListComponent}
                {messagesList}
              </InfiniteScroll>
            )}
          </div>
          {!threadsNotLoaded && (
            <div className={cx(styles.ChatInputBox)}>
              <ChatInput
                triggerTypingEvent={triggerTypingEvent}
                triggerMessage={triggerMessage}
                disableSend={disableSend || threadsNotLoaded || !isActive}
                readOnly={!isActive}
                onFocusHandler={markAsRead}
                disableInput={threadsNotLoaded}
                message={message}
                isFocusToggle={isFocusToggle}
                resetHeight={resetStyle}
                ariaLabel={ariaLabel}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div id={windowId} className={cx(styles.Container, chatCommonClassName)}>
      <div
        className={cx(
          styles.TitleBar,
          gClasses.CenterV,
          BS.JC_BETWEEN,
          gClasses.CursorPointer,
        )}
        onClick={minMaxHandler}
        role="presentation"
      >
        <div
          className={cx(
            gClasses.FTwo12White,
            gClasses.FontWeight600,
            styles.Name,
            gClasses.Ellipsis,
            gClasses.CursorDefault,
            gClasses.TextTransformCap,
          )}
          title={threadName}
        >
          {threadName}
        </div>
        <div className={cx(BS.D_FLEX)}>
          <div
            className={cx(styles.Minimize, gClasses.CenterVH)}
            role="button"
            tabIndex="0"
            // onClick={minMaxHandler}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && minMaxHandler(e)}
            title={isMinimized ? 'Maximize' : 'Minimize'}
            aria-label={`Minimize Chat ${firstName} ${lastName}`}
          >
            <div
              className={cx(
                styles.MinimizeIcon,
                isMinimized ? gClasses.MB6 : gClasses.MT7,
              )}
            />
          </div>
          <div
            className={cx(
              styles.Close,
              gClasses.CenterVH,
              gClasses.CursorPointer,
            )}
            role="button"
            tabIndex="0"
            onClick={closeChat}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && closeChat(e)}
            title="Close"
            ref={msgWindowContainerRef}
            aria-label={`close Chat ${firstName} ${lastName}`}
          >
            <CloseIcon className={styles.CloseIcon} title="Close" />
          </div>
        </div>
      </div>
      {bodyContainer}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMessagesApi: (query, variables, index) => {
      dispatch(getMessagesDataThunk(query, variables, index));
    },
    dispatch,
  };
};
export default connect(null, mapDispatchToProps)(ChatWindow);
