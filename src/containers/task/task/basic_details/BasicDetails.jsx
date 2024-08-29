import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ASSIGNEES_TYPE } from 'utils/Constants';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Input from '../../../../components/form_components/input/Input';
import INPUT_VARIANTS from '../../../../components/form_components/input/Input.strings';
import TextArea from '../../../../components/form_components/text_area/TextArea';
import styles from './BasicDetails.module.scss';
import { ACTORS, TASK_STRINGS } from '../Task.strings';
import { NON_PRIVATE_TEAMS_PARAMS } from '../../../edit_flow/EditFlow.utils';
import gClasses from '../../../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import RadioGroup, { RADIO_GROUP_TYPE } from '../../../../components/form_components/radio_group/RadioGroup';
// eslint-disable-next-line import/no-cycle
import AddMembers from '../../../../components/member_list/add_members/AddMembers';
import jsUtils from '../../../../utils/jsUtility';
import { isBasicUserMode } from '../../../../utils/UtilityFunctions';
import DateTimeWrapper from '../../../../components/date_time_wrapper/DateTimeWrapper';

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
    isActive,
    assigneeSuggestionData,
    state,
  } = props;
  const { MEMBER_OR_TEAM } = ACTORS;
  let usersAndTeams = [];
  const { t } = useTranslation();
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);

  if (assignees && assignees.teams) usersAndTeams = jsUtils.union(usersAndTeams, assignees.teams);
  if (assignees && assignees.users) {
    usersAndTeams = jsUtils.union(usersAndTeams, assignees.users);
  }

  const areMultipleAssignees = () => {
    if (assignees && assignees.teams && assignees.teams.length > 0) return true;
    else if (assignees && assignees.users && assignees.users.length > 1) return true;
    else return false;
  };
  const setAssigneesType = (value) => {
    const isAnyone = (value === ASSIGNEES_TYPE.ANYONE);
    if (value !== isAnyone && value !== null) {
      onTaskTypeChangeHandler(isAnyone);
    }
  };
  const taskTypeRadioButton = areMultipleAssignees() && (
    <RadioGroup
      id={TASK_STRINGS.TASK_TYPES.ID}
      label={TASK_STRINGS.TASK_TYPES.LABEL}
      optionList={TASK_STRINGS.TASK_TYPES.OPTION_LIST}
      onClick={setAssigneesType}
      selectedValue={(taskType ? ASSIGNEES_TYPE.ANYONE : ASSIGNEES_TYPE.ALL)}
      type={RADIO_GROUP_TYPE.TYPE_1}
      radioLabelClass={gClasses.FTwo12BlackV13}
      radioButtonClasses={styles.FormFieldRadio}
      radioSelectedStyle={styles.RadioSelectedStyle}
    />
  );

  return (
    <div>
      <Input
        placeholder={t(TASK_STRINGS.TASK_TITLE.PLACEHOLDER)}
        // label={TASK_STRINGS.TASK_TITLE.LABEL}
        id={TASK_STRINGS.TASK_TITLE.ID}
        onChangeHandler={onChangeHandler}
        onBlurHandler={onTaskNameBlurHandler}
        value={taskName}
        errorMessage={error_list.task_name}
        isRequired
        hideLabel
        innerClass={styles.TaskName}
        inputVariant={INPUT_VARIANTS.TYPE_6}
        autoFocus
      // className={error_list.task_name && gClasses.ErrorInputUnderline}
      />
      <TextArea
        label={t(TASK_STRINGS.TASK_DESCRIPTION.LABEL)}
        placeholder={t(TASK_STRINGS.TASK_DESCRIPTION.PLACEHOLDER)}
        id={TASK_STRINGS.TASK_DESCRIPTION.ID}
        onChangeHandler={onChangeHandler}
        value={taskDescription}
        errorMessage={error_list.task_description}
        className={cx(gClasses.MT30, styles.TaskDescriptionHeight)}
        innerClass={styles.TaskDescription}
        // labelClass={gClasses.FTwo12BlackV13}
      />
      <AddMembers
        id={MEMBER_OR_TEAM.ASSIGN_TO.ID}
        onUserSelectHandler={teamOrUserSelectHandler}
        selectedData={usersAndTeams}
        removeSelectedUser={teamOrUserRemoveHandler}
        errorText={error_list[MEMBER_OR_TEAM.ASSIGN_TO.ID] || jsUtils.get(error_list, [`${MEMBER_OR_TEAM.ASSIGN_TO.ID}.users`]) || jsUtils.get(error_list, [`${MEMBER_OR_TEAM.ASSIGN_TO.ID}.teams`])}
        selectedSuggestionData={usersAndTeams}
        memberSearchValue={member_team_search_value}
        setMemberSearchValue={setMemberOrTeamSearchValue}
        placeholder={t(MEMBER_OR_TEAM.ASSIGN_TO.PLACEHOLDER)}
        label={t(MEMBER_OR_TEAM.ASSIGN_TO.LABEL)}
        getTeamsAndUsers
        isRequired
        isActive={isActive}
        suggestionData={assigneeSuggestionData}
        customClass={styles.AssignTo}// Assign to form placeholder
        suggestedTaskAssignee={(state.suggestedTaskAssignee && state.suggestedTaskAssignee.data && state.suggestedTaskAssignee.data.assignee_suggestion) ? state.suggestedTaskAssignee && state.suggestedTaskAssignee.data && state.suggestedTaskAssignee.data.assignee_suggestion : null}
        suggestedTaskAssigneesProfilePicList={state?.suggestedTaskAssignee?.data?.document_url_details || []}
        apiParams={!isNormalMode && NON_PRIVATE_TEAMS_PARAMS}
      />
      {taskTypeRadioButton}
      <DateTimeWrapper
        label={t(MEMBER_OR_TEAM.DUE_DATE.LABEL)}
        enableTime
        getDate={onDueDateChangeHandler}
        date={dueDate}
        errorMessage={error_list[MEMBER_OR_TEAM.DUE_DATE.ID]}
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
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    state: state.CreateTaskReducer,
  };
};

export default connect(mapStateToProps)(BasicDetails);
BasicDetails.defaultProps = {
  assignees: {},
  member_team_search_value: EMPTY_STRING,
  error_list: {},
  dueDate: EMPTY_STRING,
  taskType: true,
  isActive: false,
};
BasicDetails.propTypes = {
  teamOrUserSelectHandler: PropTypes.func.isRequired,
  assignees: PropTypes.objectOf(),
  member_team_search_value: PropTypes.string,
  setMemberOrTeamSearchValue: PropTypes.func.isRequired,
  teamOrUserRemoveHandler: PropTypes.func.isRequired,
  error_list: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onDueDateChangeHandler: PropTypes.func.isRequired,
  dueDate: PropTypes.string,
  taskType: PropTypes.bool,
  onTaskTypeChangeHandler: PropTypes.func.isRequired,
  onTaskNameBlurHandler: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};
