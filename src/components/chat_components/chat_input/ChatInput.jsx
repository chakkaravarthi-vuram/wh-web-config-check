import React, { useEffect, useRef } from 'react';
import cx from 'classnames/bind';

import TextArea from 'components/form_components/text_area/TextArea';
import { safeTrim } from 'utils/jsUtility';
import SendIcon from '../../../assets/icons/chat/SendIcon';

import gClasses from '../../../scss/Typography.module.scss';
import styles from './ChatInput.module.scss';
import { BS } from '../../../utils/UIConstants';

function ChatInput(props) {
  const chatInputRef = useRef(null);
  const {
    triggerTypingEvent,
    triggerMessage,
    disableSend,
    onFocusHandler,
    isFocusToggle,
    message,
    readOnly,
    resetHeight,
    ariaLabel,
  } = props;
  const onChangeHandler = (event) => {
    triggerTypingEvent(event.target.value);
  };

  useEffect(() => {
    if (chatInputRef.current) {
      chatInputRef.current.focus();
      chatInputRef.current.setSelectionRange(
        chatInputRef.current.value.length,
        chatInputRef.current.value.length,
      );
    }
  }, [isFocusToggle]);

  const onSendButtonClick = () => {
    const mesageToBeSend = message;
    if (!disableSend && mesageToBeSend && mesageToBeSend.trim()) {
      triggerMessage(mesageToBeSend);
    }
  };
  const onEnterClicked = (event) => {
    if (!event.shiftKey) {
      if (event.keyCode || event.which === 13) {
        event.preventDefault();
        onSendButtonClick();
      }
    }
  };

  return (
    <div
      className={cx(
        styles.Container,
        BS.D_FLEX,
        BS.JC_BETWEEN,
        gClasses.CenterV,
      )}
    >
      <TextArea
        className={cx(gClasses.Flex1, gClasses.PR5)}
        innerClass={cx(styles.Input, gClasses.FTwo12GrayV3, gClasses.FontWeight500)}
        placeholder="Write something..."
        onChangeHandler={onChangeHandler}
        value={message}
        hideBorder
        autoFocus
        hideLabel
        hideMessage
        onKey={onEnterClicked}
        onFocusHandler={onFocusHandler}
        inputUserRef={chatInputRef}
        rows={1}
        retainInputHeight={resetHeight}
        readOnly={readOnly}
        ariaLabel={ariaLabel}
      />
      <div className={styles.SendIconContainer}>
        <SendIcon
          className={cx(styles.SendIcon, gClasses.CursorPointer)}
          isButtonColor={!(disableSend || !safeTrim(message))}
          onClick={onSendButtonClick}
          title="Send message"
        />
      </div>
    </div>
  );
}

export default ChatInput;
