import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import gClasses from 'scss/Typography.module.scss';
import ChatReponseHandlerIcon from 'assets/icons/chat/ChatReponseHandlerIcon';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import { isEmpty } from 'utils/jsUtility';
import ChatMenuItem from './ChatMenuItem';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';

function ChatMenuListItem(props) {
  const { selectedThreadId, isDataLoading, dataCountPerCall, list, onClick, isError, isNavOpen } =
    props;
  let listItems = null;
    let loader = null;
  if (isDataLoading) {
    loader = Array(dataCountPerCall)
      .fill()
      .map((value) => (
        <ChatMenuItem
          className={gClasses.NoPointerEvent}
          isDataLoading
          key={`chat_menu_loader_${value}`}
        />
      ));
  }
  if (!isEmpty(list)) {
    listItems = list.map((data, index) => {
      const onCardClick = () => onClick(data);
      return (
      <ChatMenuItem
        {...data}
        onClick={onCardClick}
        selectedThreadId={selectedThreadId}
        key={`chat_menu_${index}`}
      />
    );
      });
  } else {
    if (!isDataLoading) {
      if (isError) {
        listItems = (
          <div className={cx(gClasses.CenterV, BS.FLEX_COLUMN, gClasses.MT25, !isNavOpen && BS.D_NONE)}>
            <ChatReponseHandlerIcon role={ARIA_ROLES.IMG} ariaLabel="Chat" />
            <div
              className={cx(
                gClasses.FTwo12GrayV87,
                gClasses.FontWeight500,
                gClasses.MT15,
                BS.TEXT_CENTER,
              )}
            >
              Something went wrong, try again later!
            </div>
          </div>
        );
      } else {
        listItems = (
          <div className={cx(gClasses.CenterV, BS.FLEX_COLUMN, gClasses.MT25, !isNavOpen && BS.D_NONE)}>
            <ChatReponseHandlerIcon role={ARIA_ROLES.IMG} ariaLabel="Chat" />
            <div
              className={cx(
                gClasses.FTwo12GrayV87,
                gClasses.FontWeight500,
                gClasses.MT15,
              )}
            >
              No conversations
            </div>
          </div>
        );
      }
    }
  }
  return (
    <>
      {listItems}
      {loader}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isNavOpen: state.NavBarReducer.isNavOpen,
  };
};

export default connect(mapStateToProps, null)(ChatMenuListItem);

ChatMenuListItem.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func,
  isDataLoading: PropTypes.bool,
  selectedThreadId: PropTypes.string,
};
ChatMenuListItem.defaultProps = {
  list: [],
  onClick: null,
  isDataLoading: false,
  selectedThreadId: EMPTY_STRING,
};
