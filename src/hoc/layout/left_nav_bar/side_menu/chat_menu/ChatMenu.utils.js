import { getThreadsByUserSuccess } from 'redux/actions/ChatScreen.Action';
import { getProfileDataForChat } from 'utils/UtilityFunctions';
import { getThreadId } from 'axios/apiService/chatScreen.apiService';
import { GET_THREAD_ID } from 'components/chat_components/chat_window/ChatWindow.string';
import jsUtils from '../../../../../utils/jsUtility';
import { store } from '../../../../../Store';

const addSelectedChatThreadToList = (selectData) => {
  const chatScreenState = store.getState().ChatScreenReducer;
  const { selectedChatThreads } = chatScreenState;
  let newSelectedChatThreads = [];
  const isSameData =
    jsUtils.isArray(selectedChatThreads) &&
    selectedChatThreads.filter(
      (thread) => ((thread.threadId === selectData.threadId) || (thread.threadEmail === selectData.threadId)),
    ).length === 1;
  if (isSameData) {
    newSelectedChatThreads = selectedChatThreads.map((eachThread) => {
      if (
        eachThread.threadId === selectData.threadId
      ) {
        return {
          ...eachThread,
          ...(eachThread.isMinimized ? { isMinimized: false } : {}),
          isFocusToggle: !eachThread.isFocusToggle,
        };
      }
      return eachThread;
    });
  } else {
    newSelectedChatThreads.push(...selectedChatThreads);
    selectData.isLoadingMessages = true;
    selectData.nextPage = true;
    selectData.after = '';
    selectData.message_list = [];
    selectData.typing_list = [];
    selectData.isMinimized = false;
    selectData.isFocusToggle = true;
    if (
      jsUtils.isArray(selectedChatThreads) &&
      selectedChatThreads.length === 4
    ) {
      newSelectedChatThreads.splice(0, 1);
    }
    newSelectedChatThreads.push(selectData);
  }
  return newSelectedChatThreads;
};

export default addSelectedChatThreadToList;

export const onUserChatClickHandler = (data, isEmail = true) => {
  const chatScreenState = store.getState().ChatScreenReducer;

  const { selectedChatThreads, chatThreads } = chatScreenState;
  const userProfileData = getProfileDataForChat();
  const userMetaData = {
    user: userProfileData.user,
    account_id: userProfileData.account_id,
    socket: userProfileData.socket,
    id: userProfileData.id,
    account_domain: userProfileData.account_domain,
  };

  if (isEmail) {
    const { id, account_id, account_domain } = userMetaData;
    const { userId } = data;
    getThreadId(GET_THREAD_ID, {
      id1: id,
      id2: userId,
      type: 'p2p',
      account_id: account_id,
      account_domain,
    })
      .then((res) => {
        console.log('getThreadId res', res);
        if (res.userThreadIdByUserId && res.userThreadIdByUserId.flow_id) {
          const loadedChatIndex = chatThreads.findIndex((thread) => (thread.threadId === res.userThreadIdByUserId.flow_id));
          if (loadedChatIndex > -1) {
            data = chatThreads[loadedChatIndex];
          }
          const newSelectedChatThreads = addSelectedChatThreadToList({
            ...data,
            threadId: res.userThreadIdByUserId.flow_id,
          }, selectedChatThreads);
          console.log('newSelectedChatThreads @@@1', newSelectedChatThreads, data);

          store.dispatch(
            getThreadsByUserSuccess({
              ...chatScreenState,
              selectedChatThreads: newSelectedChatThreads,
              search_value: jsUtils.EMPTY_STRING,
            }),
          );
        } else {
          const newSelectedChatThreads = addSelectedChatThreadToList(data, selectedChatThreads);
          console.log('newSelectedChatThreads @@@12', newSelectedChatThreads, data);

          store.dispatch(
            getThreadsByUserSuccess({
              ...chatScreenState,
              selectedChatThreads: newSelectedChatThreads,
              search_value: jsUtils.EMPTY_STRING,
            }),
          );
        }
      })
      .catch((err) => {
        console.log('getThreadId err', err);
      });
  } else {
    const newSelectedChatThreads = addSelectedChatThreadToList(data, selectedChatThreads);
    console.log('newSelectedChatThreads @@@123', newSelectedChatThreads, data);

    store.dispatch(
      getThreadsByUserSuccess({
        ...chatScreenState,
        selectedChatThreads: newSelectedChatThreads,
        search_value: jsUtils.EMPTY_STRING,
      }),
    );
  }
};
