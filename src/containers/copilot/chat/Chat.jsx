import React, { useEffect, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Text, Chip } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import styles from './Chat.module.scss';
import { COPILOT_STRINGS } from '../Copilot.strings';
import {
  DATA_LIST_DASHBOARD,
  FLOW_DASHBOARD,
} from '../../../urls/RouteConstants';
import { COLOR_CONSTANTS } from '../../../utils/UIConstants';
import FaqStackIcon from '../../../assets/icons/app_builder_icons/FaqStackIcon';
import DatalistIconNew from '../../../assets/icons/DatalistIconNew';
import { postCopilotInferenceActionThunk } from '../../../redux/actions/Copilot.Action';
import { updateChatList } from './Chat.utils';
import CHAT_STRINGS from './Chat.strings';
import jsUtility from '../../../utils/jsUtility';
import {
  clearCopilotChat,
  setCopilotChatDataChange,
} from '../../../redux/reducer/CopilotReducer';
import Loading from './loading/Loading';
import ErrorDetails from './errors_details/ErrorDetails';
import { cancelCopilotInference } from '../../../axios/apiService/copilot.apiService';

function Chat() {
  const { t } = useTranslation();
  const { CHAT } = COPILOT_STRINGS(t);
  const dispatch = useDispatch();
  const search = useSelector((store) => store.CopilotReducer.search);
  const copilotChatData = useSelector((store) => store.CopilotReducer.chat);
  const bottomRef = useRef(null);

  const {
    isLoading,
    data: {
      list,
      details: { context_uuid },
    },
    errors,
  } = copilotChatData;

  useEffect(() => {
    // Don't remove the console this is for DidMount Clear.
    console.log();
    return () => {
      cancelCopilotInference();
      dispatch(clearCopilotChat());
    };
  }, []);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [list]);

  const getSourceList = (source) => {
    const onClickSource = (source) => {
      const { source_name } = source;
      const params = {
        prompt: search,
        context_uuid,
        source,
      };

      const updatedChatList = updateChatList(
        source_name,
        CHAT_STRINGS.TYPE.SENDER,
        jsUtility.cloneDeep(list),
      );
      const clonedCopilotChatData = jsUtility.cloneDeep(copilotChatData);
      clonedCopilotChatData.data.list = updatedChatList;
      dispatch(setCopilotChatDataChange(clonedCopilotChatData));
      dispatch(postCopilotInferenceActionThunk(params, t));
    };

    return (
      <div className={cx(BS.D_FLEX, gClasses.Gap8, styles.FWrap)}>
        {source?.map((sourceData) => {
          const { source_type, source_uuid, source_name } = sourceData;
          let SourceIcon = null;
          if (source_type === CHAT_STRINGS.SOURCE_TYPE.FLOW) {
            SourceIcon = FaqStackIcon;
          } else if (source_type === CHAT_STRINGS.SOURCE_TYPE.DATA_LIST) {
            SourceIcon = DatalistIconNew;
          }

          return (
            <Chip
              key={source_uuid}
              text={source_name}
              className={gClasses.CursorPointer}
              avatar={SourceIcon && <SourceIcon className={gClasses.WH16} />}
              textColor={COLOR_CONSTANTS.BLACK}
              borderColor={COLOR_CONSTANTS.BLUE_V1}
              backgroundColor={COLOR_CONSTANTS.WHITE}
              onClick={() => onClickSource(sourceData)}
            />
          );
        })}
      </div>
    );
  };

  const getEachChatList = (data) => {
    let boxStyle = null;
    if (data.type === CHAT_STRINGS.TYPE.RECEIVER) {
      if (data.isAnswer) {
        boxStyle = styles.Answer;
      } else {
        boxStyle = styles.Receiver;
      }
    } else {
      boxStyle = styles.Sender;
    }

    let pathname = null;
    if (data.isAnswer && data.source) {
      if (data.source.source_type === CHAT_STRINGS.SOURCE_TYPE.DATA_LIST) {
        pathname = `${DATA_LIST_DASHBOARD}/${data.source.source_uuid}/allRequests`;
      } else if (data.source.source_type === CHAT_STRINGS.SOURCE_TYPE.FLOW) {
        pathname = `${FLOW_DASHBOARD}/${data.source.source_uuid}/allRequests`;
      }
    }

    return (
      <div
        key={data.text}
        className={cx(
          BS.D_FLEX,
          gClasses.FlexDirectionColumn,
          gClasses.Gap8,
          data.type === CHAT_STRINGS.TYPE.RECEIVER
            ? BS.ALIGN_ITEMS_START
            : BS.ALIGN_ITEMS_END,
        )}
      >
        {!data.isError ? (
          <>
            <div className={cx(styles.ChatBox, boxStyle)}>
              <Text content={data.text} />
              {data.isAnswer && (
                <div className={BS.D_FLEX}>
                  <Text
                    content={`${CHAT.SOURCE} : `}
                    className={gClasses.FTwo12BlackV20}
                  />
                  &nbsp;
                  <Link to={pathname} className={gClasses.FTwo12BlueV39}>
                    {data.source.source_name}
                  </Link>
                </div>
              )}
            </div>
            {data.isSource && getSourceList(data.source)}
          </>
        ) : (
          <ErrorDetails status_code={data.status_code} />
        )}
        <div ref={bottomRef} />
      </div>
    );
  };

  return (
    <div
      className={cx(
        gClasses.DisplayFlex,
        gClasses.FlexDirectionColumn,
        gClasses.Gap8,
      )}
    >
      {!jsUtility.isEmpty(errors) ? (
        <ErrorDetails status_code={errors.status_code} />
      ) : (
        <>
          {list?.map((data) => getEachChatList(data))}
          {isLoading && (
            <div className={gClasses.CenterVH}>
              <Loading />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Chat;
