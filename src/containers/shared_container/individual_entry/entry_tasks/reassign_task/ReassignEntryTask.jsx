import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import {
  Button,
  Checkbox,
  EButtonType,
  TableWithPagination,
  TextArea,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../../../../scss/Typography.module.scss';
import ModalLayout from '../../../../../components/form_components/modal_layout/ModalLayout';
import styles from '../EntryTasks.module.scss';
import {
  constructTaskTableData,
  getAssigneeValidation,
  tableHeaderList,
  taskReassignValidateSchema,
} from '../EntryTasks.utils';
import AddMembers from '../../../../../components/member_list/add_members/AddMembers';
import jsUtility from '../../../../../utils/jsUtility';
import { taskChanges } from '../../../../../redux/reducer/IndividualEntryReducer';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { NON_PRIVATE_TEAMS_PARAMS } from '../../../../edit_flow/EditFlow.utils';
import WarningIcon from '../../../../../assets/icons/reassign_task/WarningIcon';
import { validate } from '../../../../../utils/UtilityFunctions';
import { reassignEntryApiThunk } from '../../../../../redux/actions/IndividualEntry.Action';
import ENTRY_TASK_STRINGS from '../EntryTask.strings';
import { INDIVIDUAL_ENTRY_TYPE } from '../../IndividualEntry.strings';

function ReassignEntryTask(props) {
  const {
    onCloseModel,
    taskList,
    selectedTaskList,
    taskDocumentUrl,
    moduleUuid,
    type,
    colorScheme,
    showCreateTask,
    history,
    dispatch,
  } = props;
  const { t } = useTranslation();
  const reassignTaskList = taskList?.filter((eachTask) =>
    selectedTaskList?.includes(eachTask._id),
  );
  const { reassignTask } = useSelector(
    (state) => state.IndividualEntryReducer.tasks,
  );
  const { reassignedUsers, reassignReason, errorList } = reassignTask;
  const [memberSearchText, setMemberSearchText] = useState(EMPTY_STRING);
  const [isSendEmail, setIsSendEmail] = useState(true);

  let usersAndTeams = [];
  if (reassignedUsers?.teams) {
    usersAndTeams = jsUtility.union(usersAndTeams, reassignedUsers?.teams);
  }
  if (reassignedUsers?.users) {
    usersAndTeams = jsUtility.union(usersAndTeams, reassignedUsers?.users);
  }

  const onReassignChange = (data) => {
    const cloneReassignTask = { ...reassignTask, ...data };
    dispatch(taskChanges({ reassignTask: cloneReassignTask }));
  };

  const reassignTeamOrUserSelectHandler = (event) => {
    const selectedUser = event.target.value;
    const cloneReassignedUsers = jsUtility.cloneDeep(reassignedUsers);
    if (selectedUser?.is_user) {
      cloneReassignedUsers?.users?.push(selectedUser);
    } else cloneReassignedUsers?.teams?.push(selectedUser);
    const cloneErrorList = jsUtility.cloneDeep(errorList);
    delete cloneErrorList?.reassign_to;
    onReassignChange({
      reassignedUsers: cloneReassignedUsers,
      errorList: cloneErrorList,
    });
  };

  const teamOrUserRemoveHandler = (id) => {
    const removedUserOrTeam = usersAndTeams?.filter(
      (userOrTeam) => userOrTeam?._id === id,
    )[0];
    const cloneReassignedUsers = jsUtility.cloneDeep(reassignedUsers);
    if (removedUserOrTeam?.is_user) {
      jsUtility.remove(cloneReassignedUsers?.users, { _id: id });
    } else {
      jsUtility.remove(cloneReassignedUsers?.teams, { _id: id });
    }
    onReassignChange({
      reassignedUsers: cloneReassignedUsers,
    });
  };

  const setMemberSearchChange = (event) => {
    if (!jsUtility.isEmpty(event?.type)) {
      setMemberSearchText(event?.target?.value);
    }
  };

  const onReasonChange = (e) => {
    const { value } = e.target;
    const cloneErrorList = jsUtility.cloneDeep(errorList);
    delete cloneErrorList?.reassign_reason;
    onReassignChange({
      reassignReason: value,
      errorList: cloneErrorList,
    });
  };

  const reassignTasks = () => {
    const currentReassignData = {
      reassign_reason: reassignReason,
    };
    const errorValidation =
      validate(currentReassignData, taskReassignValidateSchema) || {};
    const getAssigneeData = {
      users: reassignedUsers?.users,
      teams: reassignedUsers?.teams,
    };
    const assigneeValidations = getAssigneeValidation(t, getAssigneeData);
    if (!jsUtility.isEmpty(assigneeValidations)) {
      errorValidation.reassign_to = assigneeValidations;
    }
    if (!jsUtility.isEmpty(errorValidation)) {
      onReassignChange({
        errorList: errorValidation,
      });
    } else {
      const postData = {
        task_log_ids: selectedTaskList,
        reassign_assignees: {
          users: reassignedUsers?.users?.map((eachUser) => eachUser?._id),
          teams: reassignedUsers?.teams?.map((eachTeam) => eachTeam?._id),
        },
        reassign_reason: reassignReason,
        is_email: isSendEmail,
      };
      if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
        postData.data_list_uuid = moduleUuid;
      } else if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
        postData.flow_uuid = moduleUuid;
      }
      if (jsUtility.isEmpty(postData?.reassign_assignees?.users)) {
        delete postData.reassign_assignees.users;
      }
      if (jsUtility.isEmpty(postData?.reassign_assignees?.teams)) {
        delete postData.reassign_assignees.teams;
      }
      if (jsUtility.isEmpty(postData?.reassign_reason)) {
        delete postData.reassign_reason;
      }
      dispatch(reassignEntryApiThunk(postData, onCloseModel, t));
    }
  };

  return (
    <ModalLayout
      id="reassign_task_DL"
      modalContainerClass={cx(styles.ContainerClass)}
      headerContent={ENTRY_TASK_STRINGS(t).REASSIGN_TASK.TITLE}
      mainContent={
        <div className={cx(gClasses.FontWeight600, styles.ModalContentStyles)}>
          <div className={cx(gClasses.FontWeight600, gClasses.PB15)}>
            {ENTRY_TASK_STRINGS(t).REASSIGN_TASK.TABLE_LABEL}
          </div>
          <div>
            <TableWithPagination
              id="entry_reassign_tasks"
              header={tableHeaderList(t)}
              data={constructTaskTableData(
                reassignTaskList,
                taskDocumentUrl,
                0,
                [],
                () => {},
                false,
                history,
                colorScheme,
                showCreateTask,
              )}
              colorScheme={colorScheme}
            />
          </div>
          <div className={cx(gClasses.PB15, gClasses.PT15)}>
            {ENTRY_TASK_STRINGS(t).REASSIGN_TASK.DETAILS}
          </div>
          <AddMembers
            id="reassign_task"
            label={ENTRY_TASK_STRINGS(t).REASSIGN_TASK.REASSIGN_TO.LABEL}
            placeholder={
              ENTRY_TASK_STRINGS(t).REASSIGN_TASK.REASSIGN_TO.PLACEHOLDER
            }
            onUserSelectHandler={reassignTeamOrUserSelectHandler}
            selectedData={usersAndTeams}
            removeSelectedUser={teamOrUserRemoveHandler}
            errorText={errorList?.reassign_to}
            hideErrorMessage={jsUtility.isEmpty(errorList?.reassign_to)}
            memberSearchValue={memberSearchText}
            setMemberSearchValue={setMemberSearchChange}
            getTeamsAndUsers
            isRequired
            isActive
            apiParams={NON_PRIVATE_TEAMS_PARAMS}
          />
          <TextArea
            id="reassign_task_reason"
            labelText={ENTRY_TASK_STRINGS(t).REASSIGN_TASK.REASON.LABEL}
            placeholder={ENTRY_TASK_STRINGS(t).REASSIGN_TASK.REASON.PLACEHOLDER}
            onChange={onReasonChange}
            value={reassignReason}
            errorMessage={errorList.reassign_reason}
            className={gClasses.MB15}
            inputInnerClassName={styles.ReasonDescription}
          />
          <div
            className={cx(
              gClasses.CenterV,
              styles.WarningTxt,
              gClasses.FontWeight500,
              gClasses.MB15,
            )}
          >
            <WarningIcon
              title={ENTRY_TASK_STRINGS(t).REASSIGN_TASK.WARNING.TITLE}
              className={cx(gClasses.MR10, gClasses.Width48)}
            />
            {ENTRY_TASK_STRINGS(t).REASSIGN_TASK.WARNING.LABEL}
          </div>
          <Checkbox
            id="send_email"
            details={{
              label: ENTRY_TASK_STRINGS(t).REASSIGN_TASK.SEND_EMAIL,
              value: 1,
            }}
            isValueSelected={isSendEmail}
            onClick={() => setIsSendEmail(!isSendEmail)}
            className={gClasses.MT5}
          />
        </div>
      }
      mainContentClassName={cx(styles.MainContentClassName, gClasses.MB0)}
      isModalOpen
      centerVH
      onCloseClick={() => onCloseModel(false)}
      headerClassName={cx(styles.HeaderClass, gClasses.FontWeight600)}
      closeIconClass={styles.IconClass}
      footerContent={
        <div
          className={cx(
            gClasses.DisplayFlex,
            gClasses.JusEnd,
            gClasses.W100,
            styles.ModalFooter,
          )}
        >
          <Button
            buttonText={ENTRY_TASK_STRINGS(t).REASSIGN_TASK.BUTTON.CANCEL}
            type={EButtonType.SECONDARY}
            noBorder
            onClickHandler={() => onCloseModel(false)}
          />
          <Button
            buttonText={ENTRY_TASK_STRINGS(t).REASSIGN_TASK.BUTTON.REASSIGN}
            type={EButtonType.PRIMARY}
            onClickHandler={reassignTasks}
          />
        </div>
      }
      footerClassName={styles.FooterCTAClass}
    />
  );
}

ReassignEntryTask.propTypes = {
  onCloseModel: PropTypes.func,
  taskList: PropTypes.array,
  selectedTaskList: PropTypes.array,
  taskDocumentUrl: PropTypes.array,
  moduleUuid: PropTypes.string,
  type: PropTypes.string,
  colorScheme: PropTypes.object,
  showCreateTask: PropTypes.bool,
  history: PropTypes.object,
  dispatch: PropTypes.object,
};

export default ReassignEntryTask;
