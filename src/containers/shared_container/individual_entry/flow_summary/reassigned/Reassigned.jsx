import React from 'react';
import cx from 'classnames/bind';
import ResponseHandler from 'components/response_handlers/ResponseHandler';
import { TASK_CONTENT_STRINGS } from 'containers/landing_page/LandingPage.strings';
import Header from './Header';
import styles from './Reassigned.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';

function Reassigned(props) {
  const {
    index,
    instanceSummary: {
      task_name, task_status, accepted_by, accepted_on, assigned_on, document_url_details, isShow,
      assigned_users_teams, action_history, translation_data,
    },
    onHeaderClick,
    taskLogId,
    instanceSummary,
    isShowTaskDetails = false,
    is_owner_user,
    flowUuid,
  } = props;
  let dateTime = accepted_on;
  let usersTeams = accepted_by;
  let dateTimeLabel = 'Accepted On:';
  let usersTeamsLabel = 'Accepted by';

  if (task_status === 'assigned') {
    dateTime = assigned_on;
    usersTeams = assigned_users_teams;
    dateTimeLabel = 'Assigned On:';
    usersTeamsLabel = 'Assigned To:';
  }

  const pref_locale = localStorage.getItem('application_language');

  return (
    <div className={cx(`card ${styles.blueborderCard}`, gClasses.CursorDefault)}>
      <Header
        index={index}
        task_name={translation_data?.[pref_locale]?.task_name || task_name}
        dateTime={dateTime}
        usersTeams={usersTeams}
        dateTimeLabel={dateTimeLabel}
        usersTeamsLabel={usersTeamsLabel}
        taskStatus={task_status}
        document_url_details={document_url_details}
        onHeaderClick={onHeaderClick}
        isShow={isShow}
        action_history={action_history}
        instanceSummary={instanceSummary}
        taskLogId={taskLogId}
        className={!isShowTaskDetails && gClasses.CursorDefaultImp}
        is_owner_user={is_owner_user}
        flowUuid={flowUuid}
      />
      {
        isShow && (
          <ResponseHandler
            messageObject={TASK_CONTENT_STRINGS.TASK_DETAILS_NO_RESPONSE}
            className={cx(gClasses.MT70, gClasses.MB20)}
          />
        )
      }
    </div>
  );
}

export default Reassigned;
