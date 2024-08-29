import React, { useEffect, useState, useContext } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Chip, EChipSize, EPopperPlacements, UserDisplayGroup } from '@workhall-pvt-lmt/wh-ui-library';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';
import styles from './TaskHistoryCard.module.scss';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { BS, PIXEL_CONSTANTS } from '../../../../../../utils/UIConstants';
import jsUtility, { capitalizeEachFirstLetter, get, has, intersectionWith } from '../../../../../../utils/jsUtility';
import { constructAvatarOrUserDisplayGroupList, getFlowInstanceLink, isBasicUserMode } from '../../../../../../utils/UtilityFunctions';
import ACTION_HISTORY_ACTION from './TaskHistory.strings';
import { COMMA, EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import CustomUserInfoToolTipNew from '../../../../../../components/form_components/user_team_tool_tip/custom_userinfo_tooltip/CustomUserInfoToolTipNew';
import { getActionClass, getActionDescription, getActionLabel, getFormattedDateAndTimeLabel, reassignedAssignees } from './TaskHistoryCard.utils';
import UserImage from '../../../../../../components/user_image/UserImage';
import { ACTION_TYPE, USER_ACTIONS } from '../../../../../../utils/constants/action.constant';
import FileUploadProgress from '../../../../../../components/form_components/file_upload_progress/FileUploadProgress';
import { constructFileUpload } from '../../TaskContent.utils';
import ThemeContext from '../../../../../../hoc/ThemeContext';

// lazy imports

function TaskHistoryCard(props) {
  const {
    actionHistoryData: {
      action,
      performed_on,
      performed_by,
      performed_by: { first_name, last_name, _id },
      comments,
      attachments,
      task_name,
      action_type,
      flow_uuid,
      reassigned_to,
      parent_process_details = {},
      task_content = {},
      task_metadata_uuid,
      step_name,
    },
    actionHistoryData,
    document_details,
    isLoading,
    active_task_details,
    firstEntry = false,
    lastEntry = false,
  } = props;
  let flowName = '';
  const { t } = useTranslation();
  const history = useHistory();
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
  const [documentsList, setDocumentList] = useState([]);
  const isTriggerTask = has(actionHistoryData, ['parent_process_details']);
  console.log('TaskHistoryCard', actionHistoryData, isTriggerTask, document_details);
  const pref_locale = localStorage.getItem('application_language');
  const actionHistoryType = actionHistoryData?.action_history_type;
  const isBasicUser = isBasicUserMode(history);
  const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;

  useEffect(() => {
    const documentArray = attachments
      ? intersectionWith(
          document_details,
          attachments,
          (document, attachment) => document.document_id === attachment,
        )
      : [];
    documentArray.map(async (doc) => {
      setDocumentList([...documentsList, doc]);
    });
  }, []);

  if (flow_uuid && active_task_details) {
    flowName = get(active_task_details, [
      'task_log_info',
      'translation_data',
      pref_locale,
      'task_definition',
    ], EMPTY_STRING) || active_task_details?.metadata_info?.flow_name ||
    active_task_details?.sourceName;
  }

  const chosenAction = get(active_task_details, [
    'form_metadata',
    'actions',
    'action_details',
  ], [])?.find((eacAction) => eacAction.action === action) || {};

  const taskActionComponent = (action, actionType) => {
    console.log('chosenActionCheck', chosenAction);
    const chipText = (action && action !== 'undefined') ? action : capitalizeEachFirstLetter(actionType);
    const actionClass = getActionClass(actionType, t);
    return (
      <Chip
        text={chipText}
        textColor={actionClass.textColor}
        backgroundColor={actionClass.backgroundColor}
        size={EChipSize.sm}
        className={cx(gClasses.WhiteSpaceNoWrap, gClasses.MB5, gClasses.PR6)}
        textClassName={gClasses.FTwo12}
      />
    );
  };

  const commentsComponent = (comment, actionType) => {
    const commentClass = getActionClass(actionType || actionHistoryType, t);
    const postNoteAction = (actionHistoryType === USER_ACTIONS.POST_UPDATE ||
      actionHistoryType === USER_ACTIONS.POST_NOTES);
    return (
      <Chip
        text={postNoteAction ? parse(comment) : comment}
        textClassName={cx(styles.Comments, commentClass?.textClassName)}
        textColor={commentClass.textColor}
        backgroundColor={commentClass.backgroundColor}
        size={EChipSize.lg}
        className={cx(gClasses.WhiteSpaceNoWrap, styles.ChipClass, commentClass?.className, postNoteAction && BS.W100)}
        showTitle={!postNoteAction}
      />
    );
  };

  console.log('eachDocumenteachDocument', documentsList);

  const documents = (
      <FileUploadProgress
        files={constructFileUpload(documentsList, attachments, {})}
        hideLabel
      />
  );

  const getPopperContent = (id, type, onShow, onHide) => {
    const content = (
      <CustomUserInfoToolTipNew
        id={id}
        contentClassName={gClasses.BackgroundWhite}
        type={type}
        onFocus={onShow}
        onBlur={onHide}
        onMouseEnter={onShow}
        onMouseLeave={onHide}
        isStandardUserMode={isBasicUser}
        showCreateTask={showCreateTask}
      />
    );
    return content;
  };

  const getCommentsComponent = () => {
    const actionHistoryComments = commentsComponent(comments, action_type);
    if (actionHistoryType === USER_ACTIONS.REASSIGNED) {
      return (
        <>
          <p className={cx(gClasses.FTwo12GrayV3, gClasses.MB5, gClasses.PL24)}>
            <span
              className={gClasses.FTwo13GrayV89}
            >
              {t(ACTION_HISTORY_ACTION.REASSIGNED_TO)}
            </span>
            {`${reassignedAssignees(reassigned_to)} `}
          </p>
          {comments &&
          <p className={cx(gClasses.MB5, gClasses.PL24)}>
            <span
              className={gClasses.FTwo13GrayV89}
            >
              {t(ACTION_HISTORY_ACTION.REASSIGNED_REASON)}
            </span>
            {actionHistoryComments}
          </p>
          }
        </>
      );
    } else if (actionHistoryType === USER_ACTIONS.SNOOZED && task_content?.comments) {
      return (
        <p className={cx(gClasses.FTwo12GrayV3, styles.ActionHistory, gClasses.PL24)}>
          {commentsComponent(task_content?.comments, actionHistoryType)}
        </p>
      );
    } else {
      return comments && (
        <div className={gClasses.PL24}>
          {actionHistoryComments}
        </div>
      );
    }
  };

  const getActionHistoryContent = () => {
    const actionDescription = (
      <>
        <span
          className={cx(gClasses.FTwo13GrayV89, styles.TaskActionTitle, gClasses.WhiteSpaceNoWrap, gClasses.CenterV)}
        >
          {getActionDescription(isTriggerTask, t, actionHistoryData)}
        </span>
        &nbsp;
      </>
    );

    const taskName = (
      <>
        <span
          className={cx(gClasses.FTwo13GrayV89, gClasses.FontWeight500)}
        >
          {(actionHistoryData.action_history_type === USER_ACTIONS.INTEGRATION &&
            jsUtility.capitalizeEachFirstLetter(step_name || EMPTY_STRING)
            ) ||
          ` ${jsUtility.capitalizeEachFirstLetter(task_name || EMPTY_STRING) ||
          (
            actionHistoryData.flow_uuid &&
            actionHistoryData.action_history_type === USER_ACTIONS.COMPLETED &&
            jsUtility.capitalizeEachFirstLetter(flowName || EMPTY_STRING)
          ) ||
          get(active_task_details, [
            'task_log_info',
            'translation_data',
            pref_locale,
            'task_definition',
            ], EMPTY_STRING) ||
            jsUtility.capitalizeEachFirstLetter(get(active_task_details, [
              'task_log_info',
              'task_name',
              ], EMPTY_STRING)) || jsUtility.capitalizeEachFirstLetter(flowName || EMPTY_STRING)}`}
        </span>
        &nbsp;
      </>
    );

    const actionLabel = (
      <>
        <span
              className={cx(
                gClasses.FTwo13GrayV89,
                styles.ActionHistory,
              )}
        >
          {getActionLabel(actionHistoryData, isTriggerTask, t)}
        </span>
        &nbsp;
      </>
    );

    const taskAction = action_type && (action_type !== ACTION_TYPE.CANCELLED_DUE_TO_SEND_BACK) && taskActionComponent(`${chosenAction?.translation_data?.[pref_locale]?.action_name || action}`, action_type);

    const getParentFlowLink = () => getFlowInstanceLink(history, parent_process_details?.parent_flow_uuid, parent_process_details?.parent_id);
    const actionHistoryContent = (
      <div className={cx(gClasses.PT6, styles.ActionHistoryData, gClasses.PL24, BS.D_FLEX)}>
          {!isTriggerTask && actionLabel}
          {taskName}
          {isTriggerTask && actionLabel}
          {actionDescription}
          {isTriggerTask &&
            <a
              href={getParentFlowLink()}
              className={cx(gClasses.FTwo13BlueV39, styles.link, gClasses.CursorPointer)}
              style={{ color: colorSchema?.activeColor }}
              target="_blank"
              rel="noreferrer"
            >
              {parent_process_details?.parent_system_identifier}
            </a>
          }
          {taskAction}
          {actionHistoryType === USER_ACTIONS.SNOOZED
          ? (
            <span
              className={cx(gClasses.FTwo13GrayV89, gClasses.CenterV, styles.TaskActionTitle, gClasses.WhiteSpaceNoWrap)}
            >
              {getFormattedDateAndTimeLabel(task_content?.schedule_date_time?.pref_datetime_display, t)}
            </span>
            )
          : null}
      </div>
      );

    return actionHistoryContent;
  };

  const actionHistory = () => (
    <span className={cx(styles.ActionHistoryContent, !lastEntry && cx(styles.Border, gClasses.PB16))}>
      <div className={cx(BS.D_FLEX, gClasses.PL24, BS.JC_BETWEEN)}>
      {!isLoading ? (
          <UserDisplayGroup
            id="UserDisplayGroup"
            userAndTeamList={constructAvatarOrUserDisplayGroupList({
              users: [performed_by],
            })}
            count={1}
            separator={COMMA}
            popperPlacement={EPopperPlacements.BOTTOM_START}
            getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide)}
            className={cx(styles.UserList, styles.Content, gClasses.FTwo13GrayV89, gClasses.FontWeight500)}
            colorScheme={colorSchema}
          />
        ) : (
          <Skeleton width={PIXEL_CONSTANTS.ONE_TWENTY_PIXEL} />
      )}
      {performed_on.pref_datetime_display ? (
        <span
          className={cx(
            gClasses.FTwo11GrayV104,
            gClasses.FontWeight400,
            BS.TEXT_NO_WRAP,
          )}
        >
          {getFormattedDateAndTimeLabel(performed_on.pref_datetime_display, t)}
        </span>
      ) : null}
      </div>
      {getActionHistoryContent()}
      {getCommentsComponent()}
      <p className={cx(gClasses.FTwo12GrayV3, gClasses.PL24, gClasses.PT14)}>{documents}</p>
    </span>
  );

  return !(
    actionHistoryType === USER_ACTIONS.COMPLETED &&
    task_metadata_uuid
  ) ? (
    <div className={cx(styles.Container)}>
      <div
        className={cx(
          BS.D_FLEX,
        )}
      >
        <div className={!firstEntry && gClasses.PB16}>
          <UserImage
            className={cx(styles.UserImage)}
            firstName={first_name}
            lastName={last_name}
            isDataLoading={isLoading}
            id={_id}
          />
        </div>
        {!isLoading ? (
            actionHistory()
          ) : (
            <Skeleton width={PIXEL_CONSTANTS.ONE_TWENTY_PIXEL} />
        )}
      </div>
    </div>
  ) : null;
}

export default TaskHistoryCard;

TaskHistoryCard.propTypes = {
  actionHistoryData: PropTypes.objectOf(PropTypes.any),
  isLoading: PropTypes.bool,
};
TaskHistoryCard.defaultProps = {
  actionHistoryData: {},
  isLoading: true,
};
