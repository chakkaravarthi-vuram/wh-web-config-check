import jsUtility from '../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { COPILOT_STRINGS } from '../Copilot.strings';
import CHAT_STRINGS from './Chat.strings';

const onGetAnswer = (answer, status_code) => {
  const { TYPE, STATUS_CODE_TYPE } = CHAT_STRINGS;
  if (!jsUtility.isEmpty(answer) && jsUtility.isObject(answer)) {
    const {
      text,
      source_name = EMPTY_STRING,
      source_type,
      source_id,
      source_uuid,
    } = answer;
    if (text && source_uuid) {
      const objChat = {};
      objChat.type = TYPE.RECEIVER;
      objChat.text = text;
      objChat.source = {
        source_type,
        source_uuid,
        source_id,
        source_name,
      };
      if (status_code === STATUS_CODE_TYPE.SUCCESSFUL) {
        objChat.isAnswer = true;
      }
      return objChat;
    }
  }
  return null;
};

const onGetSource = (sourceList, status_code, t) => {
  const { CHAT } = COPILOT_STRINGS(t);
  const { TYPE, STATUS_CODE_TYPE } = CHAT_STRINGS;
  if (jsUtility.isArray(sourceList) && sourceList.length > 0) {
    const arrSource = [];
    sourceList.forEach((sourceData) => {
      if (!jsUtility.isEmpty(sourceData)) {
        arrSource.push(sourceData);
      }
    });
    const objChat = {};
    if (status_code === STATUS_CODE_TYPE.SUCCESSFUL) {
      objChat.text = CHAT.OTHER_SOURCE;
    } else {
      objChat.text = CHAT.CONFIRM_SOURCE;
    }
    objChat.type = TYPE.RECEIVER;
    objChat.isSource = true;
    objChat.source = arrSource;
    return objChat;
  }
  return null;
};

const getChatListByResponse = (responseData, arrChat = [], t = () => {}) => {
  if (jsUtility.isEmpty(responseData)) {
    return arrChat;
  }

  const { TYPE, STATUS_CODE_TYPE } = CHAT_STRINGS;

  const { status_code, answer, other_relevant_sources } = responseData;

  // Get Answers
  switch (status_code) {
    case STATUS_CODE_TYPE.SUCCESSFUL:
    case STATUS_CODE_TYPE.NO_ANSWER:
    case STATUS_CODE_TYPE.SOURCE_FOUND:
      if (!jsUtility.isEmpty(answer) && jsUtility.isObject(answer)) {
        const chatAnswer = onGetAnswer(answer, status_code);
        if (!jsUtility.isEmpty(chatAnswer)) {
          arrChat.push(chatAnswer);
        }
      }
      if (
        jsUtility.isArray(other_relevant_sources) &&
        other_relevant_sources.length > 0
      ) {
        const chatSource = onGetSource(other_relevant_sources, status_code, t);
        if (!jsUtility.isEmpty(chatSource)) {
          arrChat.push(chatSource);
        }
      }
      break;
    case STATUS_CODE_TYPE.NO_DATA_FOUND:
      const noDataFoundError = {
        type: TYPE.RECEIVER,
        isError: true,
        status_code: STATUS_CODE_TYPE.NO_DATA_FOUND,
      };
      arrChat.push(noDataFoundError);
      break;
    default:
      break;
  }

  return arrChat;
};

export const updateChatList = (source_name, type, arrChat = []) => {
  if (jsUtility.isEmpty(source_name)) {
    return arrChat;
  }

  const objChatData = {
    text: source_name,
    type,
  };
  arrChat.push(objChatData);

  return arrChat;
};

export default getChatListByResponse;
