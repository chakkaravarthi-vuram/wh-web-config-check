import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import styles from './Created.module.scss';
import Header from './Header';
import Body from '../body/Body';

function Created(props) {
  const {
    isLoading,
    index,
    instanceSummary,
    instanceSummary: {
      isShow,
      task_name,
      task_type,
      instanceBodyData,
      closed_by,
      closed_on,
      translation_data,
      is_send_back_task = false,
    },
    isFirstStep,
    onHeaderClick,
    taskLogId,
    isShowTaskDetails = false,
  } = props;
  let actionHistory = '';
  if (instanceSummary.action_history) {
    actionHistory = instanceSummary.action_history.action_type;
  }

  const pref_locale = localStorage.getItem('application_language');

  let stepCardStyle = styles.greenborderCard;
  if (is_send_back_task) stepCardStyle = styles.ResentTask;
  if (task_type === 2) stepCardStyle = styles.ReviewTask;

  return (
    <div className={`card ${!isFirstStep ? stepCardStyle : styles.firstgreenborderCard}`}>
      <Header
        isSendBackTask={is_send_back_task}
        isReviewStep={task_type === 2}
        task_name={translation_data?.[pref_locale]?.task_name || task_name}
        onHeaderClick={onHeaderClick}
        isShow={isShow}
        index={index}
        closedBy={closed_by}
        closedOn={closed_on}
        isFirstStep={isFirstStep}
        action={actionHistory}
        instanceSummary={instanceSummary}
        taskLogId={taskLogId}
        borderClass={styles.Noborder}
        className={!isShowTaskDetails && gClasses.CursorDefaultImp}
      />
      {
        isShow && (
          <Body
            isLoading={isLoading}
            isShow={isShow ? 'show' : 'hide'}
            instanceBodyData={instanceBodyData}
          />
        )
      }
    </div>
  );
}

export default Created;
