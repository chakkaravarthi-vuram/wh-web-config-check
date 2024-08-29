import React from 'react';
import cx from 'classnames/bind';

import jsUtils from 'utils/jsUtility';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ASSIGNEES_TYPE, NON_PRIVATE_TEAM_TYPES } from 'utils/Constants';
import Input from '../../../../../components/form_components/input/Input';
import INPUT_VARIANTS from '../../../../../components/form_components/input/Input.strings';

import { BASIC_DETAILS } from '../Task.strings';

import gClasses from '../../../../../scss/Typography.module.scss';
// eslint-disable-next-line import/no-cycle
import AddMembers from '../../../../../components/member_list/add_members/AddMembers';
import RadioGroup, { RADIO_GROUP_TYPE } from '../../../../../components/form_components/radio_group/RadioGroup';
import TextArea from '../../../../../components/form_components/text_area/TextArea';
import styles from './BasicDetails.module.scss';
import { isBasicUserMode } from '../../../../../utils/UtilityFunctions';
import DateTimeWrapper from '../../../../../components/date_time_wrapper/DateTimeWrapper';

function BasicDetails(props) {
  const {
    teamOrUserSelectHandler,
    assignees,
    member_team_search_value,
    setMemberOrTeamSearchValue,
    teamOrUserRemoveHandler,
    assigneeListUpdateHandler,
    onDueDateChangeHandler,
    dueDate,
    error_list,
    onChangeHandler,
    taskName,
    taskDescription,
    onTaskNameBlurHandler,
    taskType,
    onTaskTypeChangeHandler,
    assigneeSuggestionData,
    flowUuid,
    instanceId,
    state,
    is_participants_level_security,
  } = props;
  let usersAndTeams = [];
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const taskAssigneeParams = {
    flow_uuid: flowUuid,
    instance_id: instanceId,
    query_all_users: 1,
    is_team_included: 1,
    is_search_by_ids: 0,
    team_types: isNormalMode ? null : NON_PRIVATE_TEAM_TYPES,
  };
  if (assignees && assignees.teams) usersAndTeams = jsUtils.union(usersAndTeams, assignees.teams);
  if (assignees && assignees.users) {
    usersAndTeams = jsUtils.union(usersAndTeams, assignees.users);
  }
  const areMultipleAssignees = () => {
    if (assignees && assignees.teams && assignees.teams.length) return true;
    if (assignees && assignees.users && assignees.users.length > 1) return true;
    return false;
  };
  const setAssigneesType = (value) => {
    const isAnyone = (value === ASSIGNEES_TYPE.ANYONE);
    if (value !== isAnyone && value !== null) {
      onTaskTypeChangeHandler(isAnyone);
    }
  };
  const taskTypeRadioButton = areMultipleAssignees() && (
    <RadioGroup
      id={BASIC_DETAILS.RECEIVE_TASK.ID}
      label={BASIC_DETAILS.RECEIVE_TASK.LABEL}
      optionList={BASIC_DETAILS.RECEIVE_TASK.RADIO_BUTTON_LIST}
      onClick={setAssigneesType}
      selectedValue={(taskType ? ASSIGNEES_TYPE.ANYONE : ASSIGNEES_TYPE.ALL)}
      type={RADIO_GROUP_TYPE.TYPE_1}
      // radioButtonClasses={styles.FormFieldRadio}
      // radioSelectedStyle={styles.RadioSelectedStyle}
    />
  );

  return (
    <>
      {/* <div
        className={cx(gClasses.FTwo13PurpleV1, gClasses.FontWeight500, gClasses.MT20)}
      >
        {BASIC_DETAILS.TITLE}
      </div> */}
      <Input
        placeholder={BASIC_DETAILS.TASK_NAME.PLACEHOLDER}
        // label={TASK_STRINGS.TASK_TITLE.LABEL}
        className={cx(gClasses.MT15)}
        id={BASIC_DETAILS.TASK_NAME.ID}
        onChangeHandler={onChangeHandler}
        onBlurHandler={(event) => {
          onTaskNameBlurHandler(
            event,
            flowUuid,
            instanceId,
            'flow',
          );
        }}
        value={taskName}
        errorMessage={error_list.task_name}
        // isRequired
        hideLabel
        innerClass={styles.TaskName}
        inputVariant={INPUT_VARIANTS.TYPE_6}
        autoFocus
        // className={error_list.task_name && gClasses.ErrorInputUnderline}
      />
      <TextArea
        label={BASIC_DETAILS.TASK_DESCRIPTION.LABEL}
        placeholder={BASIC_DETAILS.TASK_DESCRIPTION.PLACEHOLDER}
        id={BASIC_DETAILS.TASK_DESCRIPTION.ID}
        onChangeHandler={onChangeHandler}
        value={taskDescription}
        errorMessage={error_list[BASIC_DETAILS.TASK_DESCRIPTION.ID]}
        className={cx(gClasses.MT30, styles.TaskDescriptionHeight)}
        innerClass={styles.TaskDescription}
      />
      <AddMembers
        id={BASIC_DETAILS.ASSIGNE_TO.ID}
        onUserSelectHandler={teamOrUserSelectHandler}
        selectedData={usersAndTeams}
        removeSelectedUser={teamOrUserRemoveHandler}
        assigneeListUpdateHandler={assigneeListUpdateHandler}
        errorText={error_list[BASIC_DETAILS.ASSIGNE_TO.ID] || jsUtils.get(error_list, [`${BASIC_DETAILS.ASSIGNE_TO.ID}.users`]) || jsUtils.get(error_list, [`${BASIC_DETAILS.ASSIGNE_TO.ID}.teams`])}
        selectedSuggestionData={usersAndTeams}
        memberSearchValue={member_team_search_value}
        setMemberSearchValue={setMemberOrTeamSearchValue}
        placeholder={BASIC_DETAILS.ASSIGNE_TO.PLACEHOLDER}
        label={BASIC_DETAILS.ASSIGNE_TO.LABEL}
        getAllowedUsersWithAlert
        isAlertDisplay={!is_participants_level_security}
        apiParams={taskAssigneeParams}
        isRequired
        suggestionData={assigneeSuggestionData}
        suggestedTaskAssignee={(state.suggestedTaskAssignee && state.suggestedTaskAssignee.data && state.suggestedTaskAssignee.data.assignee_suggestion) ? state.suggestedTaskAssignee && state.suggestedTaskAssignee.data && state.suggestedTaskAssignee.data.assignee_suggestion : null}
        suggestedTaskAssigneesProfilePicList={state?.suggestedTaskAssignee?.data?.document_url_details || []}
      />
      {taskTypeRadioButton}
      <DateTimeWrapper
        id={BASIC_DETAILS.DUE_DATE.ID}
        label={BASIC_DETAILS.DUE_DATE.LABEL}
        enableTime
        getDate={onDueDateChangeHandler}
        date={dueDate}
        errorMessage={error_list[BASIC_DETAILS.DUE_DATE.ID]}
        validations={{
          allow_today: true,
          date_selection: [
            {
              sub_type: 'all_future',
              type: 'future',
            },
          ],
        }}
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    state: state.CreateTaskReducer,
    is_participants_level_security: state.FlowDashboardReducer.is_participants_level_security,
  };
};

export default connect(mapStateToProps)(BasicDetails);
