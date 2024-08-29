import React from 'react';
import cx from 'classnames/bind';

import { dateToLocaleString } from 'utils/dateUtils';
import MessageBubble from '../message_bubble/MessageBubble';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';

const formatChatMessages = ({ messagesList, userProfilePic, threadPic, userId }) => {
  let lastMsgDate = null;
  let currentMsgDate = null;
  const todayDate = new Date().toLocaleDateString();
  let yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  yesterdayDate = yesterdayDate.toLocaleDateString();
  const data = [];
  messagesList.forEach((message, index) => {
    const profilePic = (userId === message.user) ? userProfilePic : threadPic;
    let previousUser = message.user;
    let previousDate = message.created_date;
    let dateView = null;
    let displayOnlyMessage = false;
    let displayDate;
    const time = dateToLocaleString(new Date(message.created_date));
    currentMsgDate = new Date(message.created_date).toLocaleDateString();
    if (todayDate === currentMsgDate) {
      displayDate = 'Today';
    } else if (yesterdayDate === currentMsgDate) displayDate = 'Yesterday';
    else displayDate = currentMsgDate;
    dateView = (
      <div className={cx(gClasses.FTwo10GrayV53, gClasses.FontWeight600, BS.TEXT_CENTER, gClasses.PT10)}>
        {displayDate}
      </div>
    );
    if ((lastMsgDate === currentMsgDate)) {
      if (index !== 0) data[index - 1].dateView = null;
    }
    lastMsgDate = currentMsgDate;
    if (index < (messagesList.length - 1)) {
      previousUser = messagesList[index + 1].user;
      previousDate = messagesList[index + 1].created_date;
      const createdDate = new Date(message.created_date);
      const formattedPreviousDate = new Date(previousDate);
      createdDate.setHours(0, 0, 0, 0);
      formattedPreviousDate.setHours(0, 0, 0, 0);
      const previousTime = dateToLocaleString(new Date(previousDate));
      displayOnlyMessage = (
        (formattedPreviousDate.getTime() === createdDate.getTime()) &&
        (previousUser === message.user) &&
        (previousTime === time)
      );
    }
    data.push({
      profilePic,
      dateView,
      displayOnlyMessage,
      time,
      message,
    });
  });
  return data;
};

function AllMessages(props) {
  const formattedData = formatChatMessages(props);
  return formattedData.map(({ dateView, message, time, profilePic, displayOnlyMessage }, index) => (
    <div key={index}>
      {dateView}
      <MessageBubble
        displayOnlyMessage={displayOnlyMessage}
        {...message}
        profilePic={profilePic}
        time={time}
      />
    </div>
  ));
}

export default AllMessages;
