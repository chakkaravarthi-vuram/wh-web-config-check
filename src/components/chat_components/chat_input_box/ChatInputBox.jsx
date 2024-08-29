import React, { useState } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import Input from '../../form_components/input/Input';
import SendIcon from '../../../assets/icons/chat/SendIcon';

import gClasses from '../../../scss/Typography.module.scss';
import styles from './ChatInputBox.module.scss';
import { BS } from '../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { CHAT_SOCKET_EVENTS } from '../../../utils/Constants';

function ChatInputBox(props) {
  const {
    user,
    account_id,
    socket,
    placeholder,
    roomId,
    threadType,
    threadName,
    threadId,
    threadPic,
    threadStatus,
    first_name,
    last_name,
    isAuthorized,
    className,
  } = props;
  const [message, setMessage] = useState(EMPTY_STRING);
  let disableClick = false;

  const onSendButtonClickHandler = () => {
    setMessage(EMPTY_STRING);
    if (!disableClick && message && message.trim()) {
      disableClick = true;
      socket.emit(
        CHAT_SOCKET_EVENTS.EMIT_EVENTS.CHAT,
        {
          to: '',
          text: message.trim(),
          user,
          metadata: {
            flow_id: roomId,
            threadId,
            account_id,
            threadType,
            threadName,
            threadPic,
            threadStatus,
            first_name,
            last_name,
          },
        },
        (code, error) => {
          console.log('Chat Socket - Outgoing Message', code, error);
          disableClick = false;
        },
      );
    }
  };

  const onEnterClicked = (event) => {
    if (event.keyCode || event.which === 13) {
      onSendButtonClickHandler();
    }
  };

  const chatInputBox = (
    <div className={className}>
      <div className={cx(styles.OuterBox, BS.D_FLEX)}>
        <div className={cx(styles.InnerBox, BS.D_FLEX, BS.JC_BETWEEN, gClasses.CenterV)}>
          <Input
            className={styles.Input}
            placeholder={placeholder}
            value={message}
            onChangeHandler={(event) => {
              setMessage(event.target.value);
              socket.emit(CHAT_SOCKET_EVENTS.EMIT_EVENTS.TYPING, {
                user,
                to: '',
                metadata: {
                  flow_id: roomId,
                  account_id,
                  // threadPic,
                  first_name,
                  last_name,
                },
              });
            }}
            onKeyPress={onEnterClicked}
            hideBorder
            autoFocus
            hideLabel
            hideMessage
          />
          <div
            className={cx(styles.SendIcon, gClasses.CenterVH, gClasses.MR12, gClasses.CursorPointer)}
            onClick={onSendButtonClickHandler}
            onKeyPress={onEnterClicked}
            role="button"
            tabIndex="0"
          >
            <SendIcon />
          </div>
        </div>
      </div>
    </div>
  );

  const chatInputBoxView = isAuthorized && chatInputBox;
  return chatInputBoxView;
}

ChatInputBox.defaultProps = {
  user: EMPTY_STRING,
  account_id: EMPTY_STRING,
  placeholder: EMPTY_STRING,
  roomId: EMPTY_STRING,
  threadType: EMPTY_STRING,
  threadName: EMPTY_STRING,
  threadId: EMPTY_STRING,
  threadPic: EMPTY_STRING,
  threadStatus: EMPTY_STRING,
  first_name: EMPTY_STRING,
  last_name: EMPTY_STRING,
  isAuthorized: false,
  className: EMPTY_STRING,
  socket: {},
};
ChatInputBox.propTypes = {
  user: PropTypes.string,
  account_id: PropTypes.string,
  socket: PropTypes.objectOf(PropTypes.any),
  placeholder: PropTypes.string,
  roomId: PropTypes.string,
  threadType: PropTypes.string,
  threadName: PropTypes.string,
  threadId: PropTypes.string,
  threadPic: PropTypes.string,
  threadStatus: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  isAuthorized: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default ChatInputBox;
