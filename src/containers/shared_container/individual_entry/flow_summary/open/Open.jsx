import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import ResponseHandler from 'components/response_handlers/ResponseHandler';
import { TASK_CONTENT_STRINGS } from 'containers/landing_page/LandingPage.strings';
import { PD_SUMMARY_STRINGS } from 'containers/flow/flow_dashboard/FlowDashboard.string';
import Header from './Header';

import styles from './Open.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';

function Open(props) {
  const { t } = useTranslation();
  const {
    index,
    instanceSummary: {
      task_name, task_status, accepted_by, accepted_on, assigned_on, document_url_details, isShow, assigned_users_teams,
      is_test_bed_task, accepted_as, test_assignees, translation_data, task_type,
    },
    onHeaderClick,
    taskLogId,
    instanceSummary,
    isShowTaskDetails = false,
    is_owner_user,
    flowUuid,
  } = props;
  let dateTime = accepted_on;
  let usersTeams = (is_test_bed_task) ? accepted_as : accepted_by;
  let dateTimeLabel = 'Accepted On:';
  let usersTeamsLabel = PD_SUMMARY_STRINGS(t).ACCEPTED_BY;

  if (task_status === 'assigned') {
    dateTime = assigned_on;
    usersTeams = (is_test_bed_task) ? test_assignees : assigned_users_teams;
    dateTimeLabel = 'Assigned On:';
    usersTeamsLabel = 'Assigned To:';
  }

  const pref_locale = localStorage.getItem('application_language');

  return (
    <div className={cx(`card ${styles.blueborderCard}`, gClasses.CursorDefault)}>
      <Header
        isReviewStep={task_type === 2}
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
        taskLogId={taskLogId}
        instanceSummary={instanceSummary}
        className={!isShowTaskDetails && gClasses.CursorDefaultImp}
        is_owner_user={is_owner_user}
        flowUuid={flowUuid}
      />
      {
        isShow && (<ResponseHandler
          messageObject={TASK_CONTENT_STRINGS.TASK_DETAILS_NO_RESPONSE}
          className={cx(gClasses.MT70, gClasses.MB20)}
        />
        )
      }
    </div>
  );
}

export default Open;
