import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import {
  REASSIGNED_VALUES,
  taskReassignmentHeaders,
} from 'containers/flow/Flow.strings';
import { getSignedUrlFromDocumentUrlDetails } from 'utils/profileUtils';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import {
  flowDashboardDataChange,
  reAssignmentApiThunk,
} from 'redux/actions/FlowDashboard.Action';
import { connect } from 'react-redux';
import { TASK_STRINGS, getValidationData } from 'containers/flow/flow_dashboard/flow_entry_task/FlowEntryTask.utils';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import CheckboxGroup from 'components/form_components/checkbox_group/CheckboxGroup';
import WarningIcon from 'assets/icons/reassign_task/WarningIcon';
import TextArea from 'components/form_components/text_area/TextArea';
import AddMembers from 'components/member_list/add_members/AddMembers';
import TablePagination from 'components/table_pagination/TablePagination';
import { cloneDeep, set, union } from 'lodash';
import _remove from 'lodash/remove';
import jsUtility, { isEmpty } from 'utils/jsUtility';
import { validate } from 'utils/UtilityFunctions';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { PD_MODAL_STRINGS } from 'containers/flow/flow_dashboard/FlowDashboard.string';
import { TASKS } from 'urls/RouteConstants';
import { TASK_TAB_INDEX } from 'containers/landing_page/LandingPage.strings';
import { getTaskUrl } from 'utils/taskContentUtils';
import { useHistory } from 'react-router';
import { AvatarGroup, AvatarSizeVariant, EPopperPlacements, UTToolTipType } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './ReassignedModal.module.scss';
import { getReassigneeValidation, REASSIGN_MODAL, TaskReassignValidateSchema } from './ReassignModal.strings';
import { NON_PRIVATE_TEAMS_PARAMS } from '../../containers/edit_flow/EditFlow.utils';
import { constructAvatarOrUserDisplayGroupList, getFullName, getPopperContent, isBasicUserMode } from '../../utils/UtilityFunctions';
import ThemeContext from '../../hoc/ThemeContext';

function ReassignModal(props) {
  const { t } = useTranslation();
  const {
    instanceSummary,
    dataChange,
    flow_uuid,
    reassign_task_details,
    taskLogId,
    reAssignmentApi,
    closeModal,
    reassign_modal,
    flowUuid,
  } = props;
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const { colorScheme } = useContext(ThemeContext);
  const [reassignReason, setReassignReason] = useState();
  const [isReassignCheckBoxChecked, setIsReassignCheckBoxChecked] =
    useState(true);
  let reAssignContent = null;
  let reAssignmentDetailsTable = null;
  let usersAndTeams = [];
  const taskReassignmentTableHeaders = taskReassignmentHeaders.map(
    (val) => val,
  );

  const getTaskData = (eachTask) => {
    let taskName;
    if (eachTask.is_task_accessible) {
      taskName = (
        <a
          href={`${TASKS}/${
            eachTask.task_status === 'completed'
              ? getTaskUrl(TASK_TAB_INDEX.COMPLETED)
              : getTaskUrl(TASK_TAB_INDEX.OPEN)
          }/${eachTask._id}`}
          target="_blank"
          rel="noreferrer"
        >
          {eachTask.task_name}
        </a>
      );
    } else {
      taskName = (
        <span>
          {eachTask.task_name}
        </span>
      );
    }
    return taskName;
  };

  const getProfileData = (assigned_users_teams, accepted_by) => {
    let userImage = [];
    assigned_users_teams?.users?.forEach((user) => {
      userImage.push({
        name: getFullName(user.first_name, user.last_name),
        src: getSignedUrlFromDocumentUrlDetails(user.profile_pic),
        id: user._id,
        type: UTToolTipType.user,
      });
    });
    assigned_users_teams?.teams?.forEach((team) => {
      userImage.push({
        name: team.team_name,
        src: getSignedUrlFromDocumentUrlDetails(team.team_name),
        id: team._id,
        type: UTToolTipType.team,
      });
    });
    if (!jsUtility.isEmpty(accepted_by)) {
      userImage = [{ ...accepted_by,
        src: getSignedUrlFromDocumentUrlDetails(
        accepted_by.profile_pic,
        ),
        name: getFullName(accepted_by.first_name, accepted_by.last_name),
        id: accepted_by._id,
        type: UTToolTipType.user,
      }];
    }
    const avatarGroup = (
      <AvatarGroup
        userImages={userImage}
        colorScheme={colorScheme}
        size={AvatarSizeVariant.sm}
        allAvatarData={constructAvatarOrUserDisplayGroupList({ users: userImage })}
        popperPlacement={EPopperPlacements.TOP_START}
        getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide, history, false)}
        className={cx(gClasses.ZIndex2, gClasses.PositionRelative)}
      />
    );
    return avatarGroup;
  };

  const taskReassignmentTableRowData = () => {
    const taskName = (
      <div className={cx(BS.D_FLEX)}>
        <div className={cx(gClasses.Ellipsis, gClasses.Width150)}>
          {getTaskData(instanceSummary)}
        </div>
      </div>
    );
    const openWith = (
      <div className={cx(BS.D_FLEX)}>
        <div className={cx(gClasses.Ellipsis, gClasses.Width120)}>
          {getProfileData(instanceSummary?.assigned_users_teams, instanceSummary?.accepted_by)}
        </div>
      </div>
    );
    const pendingSince = (
      <div className={cx(BS.D_FLEX)}>
        <div className={cx(gClasses.Ellipsis, gClasses.Width120)}>
          {instanceSummary?.assigned_on?.duration_display}
        </div>
      </div>
    );
    return [[taskName, openWith, pendingSince]];
  };

  const textAreaOnChangeHandler = (e) => {
    setReassignReason(e.target.value);
    const errorList = cloneDeep(reassign_modal?.error_list);
    delete errorList?.reassign_reason;
    dataChange({
      reassignModal: {
        error_list: errorList,
      },
    });
  };

  const handleSendEmailCheckBox = () => {
    setIsReassignCheckBoxChecked(!isReassignCheckBoxChecked);
  };

  const reassignTeamOrUserSelectHandler = (event) => {
    const selectedUser = event.target.value;
    const reassignValues = cloneDeep(reassign_task_details);
    if (selectedUser?.is_user) reassignValues?.reassignedUsers?.users?.push(selectedUser);
    else reassignValues?.reassignedUsers?.teams?.push(selectedUser);
    const errorList = cloneDeep(reassign_modal?.error_list);
    delete errorList?.reassign_to;
    dataChange({
      reassignTaskDetails: reassignValues,
      reassignModal: {
        error_list: errorList,
      },
    });
  };

  const setMemberOrTeamSearchValue = (event) => {
    if (!isEmpty(event?.type)) {
    const reassignValues = cloneDeep(reassign_task_details);
    set(reassignValues, 'member_team_search_value', event.target.value);
    dataChange({
      reassignTaskDetails: reassignValues,
    });
  }
  };

  const reAssignment = () => {
    let errorValidation = EMPTY_STRING;
    const currentReassignData = {
      reassignReason,
    };
    const dataToBeValidated = getValidationData(currentReassignData);
    if (!isEmpty(dataToBeValidated)) errorValidation = validate(dataToBeValidated, TaskReassignValidateSchema) || {};
    const reassignValues = cloneDeep(reassign_task_details);
    const getvalidationForReassignee = {
      users: reassignValues?.reassignedUsers?.users,
      teams: reassignValues?.reassignedUsers?.teams,
    };
    const reassigneeValidations = getReassigneeValidation(t, getvalidationForReassignee);
    if (reassigneeValidations?.length > 0) errorValidation.reassign_to = reassigneeValidations;
    if (!isEmpty(errorValidation)) {
      dataChange({
        reassignModal: {
          error_list: errorValidation,
        },
      });
    } else {
    const postData = {
      task_log_ids: [taskLogId],
      flow_uuid: flow_uuid || flowUuid,
      reassign_assignees: {
        users: reassign_task_details?.reassignedUsers?.users?.map(
          (eachUser) => eachUser?._id,
        ),
        teams: reassign_task_details?.reassignedUsers?.teams?.map(
          (eachTeam) => eachTeam?._id,
        ),
      },
      reassign_reason: reassignReason,
      is_email: isReassignCheckBoxChecked,
    };
    if (jsUtility.isEmpty(postData?.reassign_assignees?.users)) delete postData.reassign_assignees.users;
    if (jsUtility.isEmpty(postData?.reassign_assignees?.teams)) delete postData.reassign_assignees.teams;
    if (jsUtility.isEmpty(postData?.reassign_reason)) delete postData.reassign_reason;
    reAssignmentApi(postData, closeModal, t);
    return postData;
  }
  return null;
  };

  reAssignmentDetailsTable = (
    <div>
      <div>
        <TablePagination
          tblClassName={cx(styles.Table)}
          tblRowClassName={cx(styles.RowContainerTable, gClasses.FontWeight500)}
          headerClassName={cx(styles.HeaderContainer, gClasses.ZIndex2)}
          bodyClassName={styles.TableBodyContainer}
          tblHeader={taskReassignmentTableHeaders}
          tblData={taskReassignmentTableRowData()}
          tblLoaderRowCount={3}
          tblLoaderColCount={3}
          showItemDisplayInfoStrictly
          hidePagination
          tableContainerClass={cx(styles.ReassignedFlowTasks)}
        />
      </div>
    </div>
  );

  if (reassign_task_details?.reassignedUsers?.teams) {
    usersAndTeams = union(
      usersAndTeams,
      reassign_task_details?.reassignedUsers?.teams,
    );
  }
  if (reassign_task_details?.reassignedUsers?.users) {
    usersAndTeams = union(
      usersAndTeams,
      reassign_task_details?.reassignedUsers?.users,
    );
  }
  const teamOrUserRemoveHandler = (id) => {
    const removedUserOrTeam = usersAndTeams?.filter(
      (userOrTeam) => userOrTeam?._id === id,
    )[0];
    const reassignValues = cloneDeep(reassign_task_details);
    if (removedUserOrTeam?.is_user) _remove(reassignValues?.reassignedUsers?.users, { _id: id });
    else _remove(reassignValues?.reassignedUsers?.teams, { _id: id });
    dataChange({
      reassignTaskDetails: reassignValues,
    });
  };

  reAssignContent = (
    <div className={cx(gClasses.FontWeight600, styles.ModalContentStyles)}>
      <div className={gClasses.FontWeight600}>{TASK_STRINGS(t).TASK_DETAILS}</div>
      <div>{reAssignmentDetailsTable}</div>
      <div className={cx(gClasses.PB15, gClasses.PT15)}>
        {TASK_STRINGS(t).REASSIGNMENT_DETAILS}
      </div>
      <AddMembers
        id="reassign_task"
        onUserSelectHandler={reassignTeamOrUserSelectHandler}
        selectedData={usersAndTeams}
        removeSelectedUser={teamOrUserRemoveHandler}
        errorText={reassign_modal.error_list && reassign_modal.error_list.reassign_to}
        hideErrorMessage={reassign_modal.error_list && isEmpty(reassign_modal.error_list.reassign_to)}
        memberSearchValue={reassign_task_details.member_team_search_value}
        setMemberSearchValue={setMemberOrTeamSearchValue}
        placeholder={REASSIGN_MODAL.ADD_MEMBERS.PLACEHOLDER}
        label={REASSIGN_MODAL.ADD_MEMBERS.LABEL}
        getTeamsAndUsers
        apiParams={!isNormalMode && NON_PRIVATE_TEAMS_PARAMS}
        isRequired
        isActive
      />
      <TextArea
        label={TASK_STRINGS(t).REASON_LABEL}
        placeholder={TASK_STRINGS(t).REASON_PLACEHOLDER}
        id="reassign_task_reason"
        onChangeHandler={textAreaOnChangeHandler}
        value={reassignReason}
        className={cx(gClasses.MB15, styles.TaskDescriptionHeight)}
        errorMessage={reassign_modal.error_list && reassign_modal.error_list.reassign_reason}
        hideMessage={reassign_modal.error_list && isEmpty(reassign_modal.error_list.reassign_reason)}
      />
      <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, styles.WarningTxt, gClasses.FontWeight500, gClasses.MB15)}>
       <WarningIcon
       title="Warning Icon"
       className={cx(gClasses.MR10, gClasses.Width48)}
       />
        {TASK_STRINGS(t).WARNING_CONTENT}
      </div>
      <CheckboxGroup
        id={REASSIGNED_VALUES.SEND_EMAIL.ID}
        optionList={REASSIGNED_VALUES.SEND_EMAIL.OPTION_LIST}
        onClick={handleSendEmailCheckBox}
        selectedValues={isReassignCheckBoxChecked ? [1] : []}
        hideLabel
        key="language_details_cb1"
        className={cx(gClasses.MT5, styles.TextContent)}
        hideMessage
      />
    </div>
  );

  return (
    <div>
        <ModalLayout
          id="reassign_task"
          modalContainerClass={cx(styles.ContainerClass)}
          headerContent={(PD_MODAL_STRINGS(t).REASSIGN_THE_TASK)}
          mainContent={reAssignContent}
          mainContentClassName={cx(styles.MainContentClassName, gClasses.MB0)}
          isModalOpen
          centerVH
          onCloseClick={closeModal}
          headerClassName={cx(styles.HeaderClass, gClasses.FontWeight600)}
          closeIconClass={styles.IconClass}
          footerContent={(
            <div
              className={cx(
                BS.D_FLEX,
                BS.W100,
                BS.JC_END,
                styles.ModalFooter,
              )}
            >
        <Button
          buttonType={BUTTON_TYPE.LIGHT}
          className={cx(BS.TEXT_NO_WRAP)}
          onClick={() => closeModal()}
        >
          {TASK_STRINGS(t).CANCEL}
        </Button>
        <Button
          buttonType={BUTTON_TYPE.PRIMARY}
          className={cx(BS.TEXT_NO_WRAP)}
          onClick={reAssignment}
        >
          {TASK_STRINGS(t).REASSIGN}
        </Button>
            </div>
          )}
          footerClassName={styles.FooterCTAClass}
        />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    dataChange: (data) => {
      dispatch(flowDashboardDataChange(data));
    },
    reAssignmentApi: (data, closeModal, t) => {
      dispatch(reAssignmentApiThunk(data, closeModal, t));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    reassign_task_details: state.FlowDashboardReducer.reassignTaskDetails,
    flow_uuid: state.FlowDashboardReducer.flow_uuid,
    reassign_modal: state.FlowDashboardReducer.reassignModal,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReassignModal);
