import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import ChatSearchResponseHandlerIcon from 'assets/icons/chat/ChatSearchResponseHandlerIcon';
import ChatCard from './ChatCard';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';

function ChatCardList(props) {
  const { selectedThreadId, isDataLoading, dataCountPerCall, list, onClick, onUserIconClick } =
    props;
  let listItems = null;
  if (isDataLoading) {
    listItems = Array(dataCountPerCall)
      .fill()
      .map((value) => (
        <ChatCard
          className={gClasses.NoPointerEvent}
          isDataLoading
          key={`chat_card_loader_${value}`}
          data={{}}
        />
      ));
  } else {
    if (list.length > 0) {
      listItems = list.map((data, index) => {
        const onCardClick = () => onClick(data);
        return (
          <ChatCard
            data={data}
            onClick={onCardClick}
            selectedThreadId={selectedThreadId}
            key={`chat_card_${index}`}
            onUserIconClick={onUserIconClick}
          />
        );
      });
    } else {
      listItems = (
        <div className={cx(gClasses.CenterV, BS.FLEX_COLUMN, gClasses.MT25)}>
          <ChatSearchResponseHandlerIcon ariaHidden="true" />
          <div
            className={cx(
              gClasses.MT10,
              gClasses.FTwo12GrayV53,
              gClasses.FontWeight600,
            )}
          >
            NO RESULTS
          </div>
        </div>
      );
    }
  }
  return listItems;
}

export default ChatCardList;

ChatCardList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func,
  isDataLoading: PropTypes.bool,
  selectedThreadId: PropTypes.string,
  onUserIconClick: PropTypes.func,
};
ChatCardList.defaultProps = {
  list: [],
  onClick: null,
  isDataLoading: false,
  selectedThreadId: EMPTY_STRING,
  onUserIconClick: null,
};
