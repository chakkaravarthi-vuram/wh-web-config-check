import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import jsUtils from 'utils/jsUtility';
import { ASSIGNEES_TYPE, NON_PRIVATE_TEAM_TYPES } from 'utils/Constants';
import { useHistory } from 'react-router-dom';
import Input, { INPUT_VARIANTS } from '../../../../../components/form_components/input/Input';
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
    state,
    dataListUuid,
    dataListEntryId,
    assigneeListUpdateHandler,
    datalist_state,
  } = props;
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  let usersAndTeams = [];
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
      radioLabelClass={gClasses.FTwo12BlackV13}
      radioButtonClasses={styles.FormFieldRadio}
      radioSelectedStyle={styles.RadioSelectedStyle}
    />
  );
  const taskAssigneeParams = {
    data_list_uuid: dataListUuid,
    data_list_entry_id: dataListEntryId,
    query_all_users: 1,
    is_team_included: 1,
    is_search_by_ids: 0,
    team_types: isNormalMode ? null : NON_PRIVATE_TEAM_TYPES,
  };
  return (
    <>
      <Input
        placeholder={BASIC_DETAILS.TASK_NAME.PLACEHOLDER}
        className={cx(gClasses.MT15)}
        id={BASIC_DETAILS.TASK_NAME.ID}
        onChangeHandler={onChangeHandler}
        onBlurHandler={(event) => {
          onTaskNameBlurHandler(
            event,
            dataListUuid,
            dataListEntryId,
            'datalist',
          );
        }}
        value={taskName}
        errorMessage={error_list[BASIC_DETAILS.TASK_NAME.ID]}
        isRequired
        hideLabel
        innerClass={styles.TaskName}
        inputVariant={INPUT_VARIANTS.TYPE_6}
        autoFocus
      />
      <TextArea
        label={BASIC_DETAILS.TASK_DESCRIPTION.LABEL}
        placeholder={BASIC_DETAILS.TASK_DESCRIPTION.PLACEHOLDER}
        id={BASIC_DETAILS.TASK_DESCRIPTION.ID}
        onChangeHandler={onChangeHandler}
        value={taskDescription}
        className={cx(gClasses.MT30, styles.TaskDescriptionHeight)}
        innerClass={styles.TaskDescription}
        errorMessage={error_list[BASIC_DETAILS.TASK_DESCRIPTION.ID]}
      />
      <AddMembers
        id={BASIC_DETAILS.ASSIGNE_TO.ID}
        onUserSelectHandler={teamOrUserSelectHandler}
        selectedData={usersAndTeams}
        removeSelectedUser={teamOrUserRemoveHandler}
        errorText={error_list[BASIC_DETAILS.ASSIGNE_TO.ID] || jsUtils.get(error_list, [`${BASIC_DETAILS.ASSIGNE_TO.ID}.users`]) || jsUtils.get(error_list, [`${BASIC_DETAILS.ASSIGNE_TO.ID}.teams`])}
        selectedSuggestionData={usersAndTeams}
        memberSearchValue={member_team_search_value}
        setMemberSearchValue={setMemberOrTeamSearchValue}
        placeholder={BASIC_DETAILS.ASSIGNE_TO.PLACEHOLDER}
        label={BASIC_DETAILS.ASSIGNE_TO.LABEL}
        getAllowedUsersWithAlert
        isAlertDisplay={!datalist_state?.is_participants_level_security}
        assigneeListUpdateHandler={assigneeListUpdateHandler}
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
    datalist_state: state.DataListReducer.particularDataListDetails,
  };
};

export default connect(mapStateToProps)(BasicDetails);
