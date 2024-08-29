import React, { useEffect, useRef } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import Input from 'components/form_components/input/Input';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import ChatSearchResponseHandlerIcon from 'assets/icons/chat/ChatSearchResponseHandlerIcon';
import FrequentChatResponseHandlerIcon from 'assets/icons/chat/FrequentChatResponseHandlerIcon';
import styles from './AddNewChat.module.scss';

import ChatCardList from './chat_card/ChatCardList';

import {
  updateSearchValueThunk,
  searchChatThreadsThunk,
  clearSearchListThunk,
  chatSearchApiStarted,
} from '../../../../../../redux/actions/ChatScreen.Action';
import jsUtils, { isEmpty } from '../../../../../../utils/jsUtility';

function AddNewChat(props) {
  const {
    userMetadata,
    onClick,
    onUserIconClick,
    dispatch,
    chatScreenState: {
      selectedThreadId,
      isSearchDataLoading,
      // noDataFound,
      search_list,
      // chatThreads,
      dataCountPerCall,
      search_value,
    },
    searchChatThreadsApi,
    clearSearchList,
  } = props;

  const timeout = useRef();
  const userSelectInputFocus = useRef(null);
  userSelectInputFocus && userSelectInputFocus.current && userSelectInputFocus.current.focus();

  useEffect(() => {
      const { id } = userMetadata;
      const params = {
        // size: this.dataCountPerCall,
        // page: this.currentPage,
        sort_by: 1,
        sort_field: 'full_name',
        is_last_signin: 0,
        is_active: 1,
      };
      searchChatThreadsApi(
        params,
        id,
      );

    return () => clearSearchList();
  }, []);

  const threadSearchHandler = (search_value) => {
    if (!isSearchDataLoading) dispatch(chatSearchApiStarted());
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      const { id } = userMetadata;
      const params = {
        is_last_signin: 0,
        is_active: 1,
      };
      if (!isEmpty(search_value)) {
        params.search = search_value;
      }
      searchChatThreadsApi(
        params,
        id,
      );
    }, 300);
  };

  const onSearchChangeHandler = (value) => {
    dispatch(updateSearchValueThunk(value)).then(() => {
      threadSearchHandler(value);
      return null;
    });
  };

  const frequentList = (
    <>
      {/* <div
        className={cx(
          gClasses.FTwo10GrayV3,
          gClasses.FontWeight600,
          gClasses.MT10,
          gClasses.MB7,
        )}
      >
        FREQUENT
      </div> */}
      {/* <ChatCard isSearchDataLoading />
      <ChatCard />
      <ChatCard />
      <ChatCard /> */}
      <div className={cx(gClasses.CenterV, BS.FLEX_COLUMN, gClasses.MT10)}>
        <FrequentChatResponseHandlerIcon />
        <div
          className={cx(
            gClasses.FTwo8GrayV53,
            gClasses.FontWeight500,
            gClasses.MT5,
            BS.TEXT_CENTER,
          )}
        >
          You can search user by their first name, last name and email.
        </div>
      </div>
    </>
  );

  let ariaLabelledby = '';
  let ariaLabel = '';
  if (isSearchDataLoading) {
    ariaLabelledby = 'loadingChats';
    ariaLabel = 'loading chats';
  } else if (jsUtils.isArrayObjectsEmpty(search_list)) {
    ariaLabelledby = 'addChatNoResultsFound';
    ariaLabel = 'No Results Found';
  } else if (!jsUtils.isArrayObjectsEmpty(search_list) && search_value) {
    ariaLabelledby = 'resultsFound';
    ariaLabel = 'results found';
  }

  return (
    <div className={cx(styles.AddNewChatDropdown)}>
      <Input
        className={styles.Input}
        placeholder="Search User"
        onChangeHandler={(event) => onSearchChangeHandler(event.target.value)}
        value={search_value}
        hideBorder
        autoFocus
        hideLabel
        hideMessage
        inputUserRef={userSelectInputFocus}
        inputAriaLabelledBy={ariaLabelledby}
      />
      <div
      className={cx(styles.ResultsContainer)}
      aria-label={ariaLabel}
      id={ariaLabelledby}
      >
        {search_list ? (
          <ChatCardList
            selectedThreadId={selectedThreadId}
            isDataLoading={isSearchDataLoading}
            dataCountPerCall={dataCountPerCall}
            list={
              !jsUtils.isArrayObjectsEmpty(search_list) ? (
                search_list
              ) : (
                <div
                  className={cx(
                    gClasses.CenterV,
                    BS.FLEX_COLUMN,
                    gClasses.MT20,
                  )}
                >
                  <ChatSearchResponseHandlerIcon />
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
              )
            }
            onClick={onClick}
            onUserIconClick={onUserIconClick}
          />
        ) : (
          frequentList
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    chatScreenState: state.ChatScreenReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchChatThreadsApi: (params, userId) => {
      dispatch(searchChatThreadsThunk(params, userId));
    },
    clearSearchList: () => dispatch(clearSearchListThunk()),
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewChat);
