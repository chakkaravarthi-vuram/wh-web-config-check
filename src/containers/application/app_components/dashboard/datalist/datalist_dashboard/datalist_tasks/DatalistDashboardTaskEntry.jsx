import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { connect, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import _remove from 'lodash/remove';
import { TableWithPagination } from '@workhall-pvt-lmt/wh-ui-library';
import { RESPONSE_TYPE } from '../../../../../../../utils/Constants';
import jsUtility, { cloneDeep, isEmpty, set, union } from '../../../../../../../utils/jsUtility';
import { ACTION_STRINGS, EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';
import ReassignIcon from '../../../../../../../assets/icons/reassign_task/ReassignIcon';
import ModalLayout from '../../../../../../../components/form_components/modal_layout/ModalLayout';
import AddMembers from '../../../../../../../components/member_list/add_members/AddMembers';
import TextArea from '../../../../../../../components/form_components/text_area/TextArea';
import WarningIcon from '../../../../../../../assets/icons/reassign_task/WarningIcon';
import CheckboxGroup from '../../../../../../../components/form_components/checkbox_group/CheckboxGroup';
import PlusIcon from '../../../../../../../assets/icons/PlusIcon';
import { ARIA_LABEL } from '../../../../../../../components/form_builder/FormBuilder.strings';
import { reAssignmentApiThunk } from '../../../../../../../redux/actions/FlowDashboard.Action';
import { REASSIGN_MODAL, getReassigneeValidation, TaskReassignValidateSchema } from '../../../../../../../components/reassign_modal/ReassignModal.strings';
import { REASSIGNED_VALUES, taskReassignmentHeaders } from '../../../../../../flow/Flow.strings';
import { getValidationData } from '../../../../../../flow/flow_dashboard/flow_entry_task/FlowEntryTask.utils';
import TablePaginationRowSelection from '../../../../../../../components/table_pagination_row_selection/TablePaginationRowSelection';
import SearchBar from '../../../../../../../components/form_components/search_bar/SearchBar';
import Button, {
  BUTTON_TYPE,
} from '../../../../../../../components/form_components/button/Button';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../../../../../utils/UIConstants';
import {
  getDataListEntryTaskParamsSelector,
  getDataListEntryTasksListSelector,
} from '../../../../../../../redux/selectors/DataListSelector';
import {
  toggleAddDataListModalVisibility,
} from '../../../../../../../redux/reducer/DataListReducer';
import ResponseHandler from '../../../../../../../components/response_handlers/ResponseHandler';
import {
  tableHeaderList,
  tableHeader,
  constructTableData,
  DATA_LIST_ENTRY_TASK_STRING,
  reassignPopUp,
  reassignPopUpTbl,
  constructReassignTaskTableData,
} from './DataListDashboardEntryTask.utils';
import styles from './DataListDashboardEntryTask.module.scss';
import { ROW_COUNT_DROPDOWN } from '../../../../../../admin_settings/user_management/UserManagement.strings';
import { getDataListDashboardSpecificEntryTaskListApi } from '../../../../../../../redux/actions/ApplicationDashboardReport.Action';
import { setDatalistDashboardById } from '../../../../../../../redux/reducer/ApplicationDashboardReportReducer';
import { NON_PRIVATE_TEAMS_PARAMS } from '../../../../../../edit_flow/EditFlow.utils';
import { isBasicUserMode, validate } from '../../../../../../../utils/UtilityFunctions';
import ThemeContext from '../../../../../../../hoc/ThemeContext';

let cancelForGetAllDataListTask;
export const cancelTokenForGetAllDataListTask = (c) => {
  cancelForGetAllDataListTask = c;
};

function DatalistDashboardTaskEntry(props) {
  const { t } = useTranslation();
  const {
    dataListEntryTaskParams,
    getDataListEntryTaskList,
    dataListEntryTasks,
    allDatalistEntryTasks = [],
    dataListEntryId,
    dataListEntryTaskCount,
    dataListTaskEntryCountPerPage,
    searchTaskValue,
    selectedValue,
    isDataListEntryTaskPageLoading,
    toggleAddDataListModalVisibilityAction,
    isAllTask,
    dataListEntryTaskDocumentUrl,
    common_server_error,
    data_list_uuid,
    reassign_task_details,
    dataChange,
    reAssignmentApi,
    isOwnerUser,
    reassign_modal,
    datalistData,
    isNormalmodeDashboard,
  } = props;

  const containerCompRef = useRef(null);
  const headerCompRef = useRef(null);
  const currentComponentCompRef = useRef(null);
  const [taskDropdown, setTaskDropdown] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTaskList, setSelectedTaskList] = useState([]);
  const [selectedReassignTaskList, setSelectedReassignTaskList] = useState([]);
  const [reassignReason, setReassignReason] = useState();
  const [isReassignCheckBoxChecked, setIsReassignCheckBoxChecked] = useState(true);
  const [tableRowCount, setTableRowCount] = useState(5);
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const colorSchema = isNormalMode ? colorScheme : colorSchemeDefault;
  const [hover, setHover] = useState(false);
  let dataListEntryTaskDetailsParams = null;
  let modalContainer = null;
  let reAssignContent = null;
  let usersAndTeams = [];
  let downloadContent = null;
  const taskReassignmentTableHeaders = taskReassignmentHeaders.map((val) => {
    return {
      label: val,
      widthWeight: 1,
    };
  });
  const tableRowCount_ = tableRowCount;
  dataListEntryTaskDetailsParams = {
    data_list_uuid: data_list_uuid,
    is_closed: taskDropdown,
    ...dataListEntryTaskParams,
    size: tableRowCount_,
  };
  const changeAvatarVisibility = (visible) => {
    setHover(visible);
  };
  if (!isAllTask) dataListEntryTaskDetailsParams.data_list_entry_id = dataListEntryId;
  dataListEntryTaskParams.assigned_to_me = isAllTask ? 1 : 0;
  dataListEntryTaskDetailsParams.assigned_to_me = isAllTask ? 1 : 0;
  useEffect(() => {
    dataChange({
      id: data_list_uuid,
      data: {
        ...datalistData,
        itemCountPerPage: tableRowCount_,
      },
    });

    if (cancelForGetAllDataListTask) {
      cancelForGetAllDataListTask();
    }
    getDataListEntryTaskList(dataListEntryTaskDetailsParams, data_list_uuid, { itemCountPerPage: tableRowCount_ });
    return () => {
      dataChange({
        id: data_list_uuid,
        data: {
          ...datalistData,
          pdTabIndex: 1,
          searchTask: EMPTY_STRING,
          isClosed: null,
        },
      });
      if (cancelForGetAllDataListTask) {
        cancelForGetAllDataListTask();
      }
    };
  }, []);

  const handlePageChange = (selectedPage) => {
    if (selectedPage !== dataListEntryTaskParams.page) {
      const params = { ...dataListEntryTaskParams };
      params.page = selectedPage;
      if (!isAllTask) params.data_list_entry_id = dataListEntryId;
      params.data_list_uuid = data_list_uuid;
      if (searchTaskValue !== EMPTY_STRING) {
        params.search = searchTaskValue;
      }
      if (taskDropdown === 0 || taskDropdown === 1) {
        params.is_closed = taskDropdown;
      }
      if (cancelForGetAllDataListTask) {
        cancelForGetAllDataListTask();
      }
      getDataListEntryTaskList(params, data_list_uuid, { activePage: selectedPage, isDataListEntryTaskEntriesLoading: true });
      dataChange({
        id: data_list_uuid,
        data: {
          ...datalistData,
          activePage: selectedPage,
          isDataListEntryTaskEntriesLoading: true,
        },
      });
    }
  };

  const ddlRowOnChangeHandler = (e) => {
    const selectedTableRowCount = e.target.value;
    setTableRowCount(selectedTableRowCount);
    if (selectedTableRowCount !== dataListEntryTaskParams.size) {
      dataChange({
        id: data_list_uuid,
        data: {
          ...datalistData,
          itemCountPerPage: selectedTableRowCount,
        },
      });
      const dataListEntryTaskDetailsParams = {
        data_list_uuid: data_list_uuid,
        is_closed: taskDropdown,
        ...dataListEntryTaskParams,
        size: selectedTableRowCount,
        page: 1,
      };
      if (!isAllTask) dataListEntryTaskDetailsParams.data_list_entry_id = dataListEntryId;

      if (cancelForGetAllDataListTask) {
        cancelForGetAllDataListTask();
      }
      getDataListEntryTaskList(dataListEntryTaskDetailsParams, data_list_uuid, { itemCountPerPage: selectedTableRowCount });
    }
  };

  const onSearchHandler = (value) => {
    dataChange({
      id: data_list_uuid,
      data: {
        ...datalistData,
        searchTask: value,
      },
    });
    const params = { ...dataListEntryTaskParams };
    if (!isAllTask) params.data_list_entry_id = dataListEntryId;
    params.data_list_uuid = data_list_uuid;
    if (value !== EMPTY_STRING) {
      params.search = value;
    }
    if (taskDropdown === 0 || taskDropdown === 1) {
      params.is_closed = taskDropdown;
    }
    if (cancelForGetAllDataListTask) {
      cancelForGetAllDataListTask();
    }
    getDataListEntryTaskList(params, data_list_uuid);
  };

  const handleTaskDropdownChange = (e) => {
    const changeValue = e.target.value;
    setTaskDropdown(changeValue);
    dataChange({
      id: data_list_uuid,
      data: {
        ...datalistData,
        isClosed: changeValue,
      },
    });
    const params = { ...dataListEntryTaskDetailsParams };
    params.size = tableRowCount;
    if (!isAllTask) params.data_list_entry_id = dataListEntryId;
    params.data_list_uuid = data_list_uuid;
    if (searchTaskValue !== EMPTY_STRING) {
      params.search = searchTaskValue;
    }
    if (changeValue === 0 || changeValue === 1) {
      params.is_closed = changeValue;
    }
    if (cancelForGetAllDataListTask) {
      cancelForGetAllDataListTask();
    }
    getDataListEntryTaskList(params, data_list_uuid, { isClosed: changeValue });
  };

  const textAreaOnChangeHandler = (e) => {
    setReassignReason(e.target.value);
    const errorList = cloneDeep(reassign_modal?.error_list);
    delete errorList?.reassign_reason;
    dataChange({
      id: data_list_uuid,
      data: {
        ...datalistData,
        reassignModal: {
          error_list: errorList,
        },
      },
    });
  };

  const tableEntryPopupClicked = (value, id) => {
    setSelectedTaskList([id]);
    setSelectedReassignTaskList(dataListEntryTasks?.filter((eachTask) => id === eachTask._id));
    usersAndTeams = [];
    setReassignReason(EMPTY_STRING);
    setIsModalVisible(true);
  };

  const getHeaderCheckboxStatus = () => {
    if (!isEmpty(dataListEntryTasks) && !isEmpty(selectedTaskList)) {
      let selectedCount = 0;
      dataListEntryTasks.forEach(({ _id }) => { if (selectedTaskList.includes(_id)) selectedCount++; });
      if (selectedCount === dataListEntryTasks.length) return true;
    }
    return false;
  };

  const handleHeaderCheckboxChange = () => {
    const selectedTaskListCopy = cloneDeep(selectedTaskList);
    if (getHeaderCheckboxStatus()) {
      dataListEntryTasks.forEach(({ _id }) => {
        const index = selectedTaskListCopy.findIndex((selectedId) => (selectedId === _id));
        if (index > -1) selectedTaskListCopy.splice(index, 1);
      });
      setSelectedTaskList(selectedTaskListCopy);
    } else {
      dataListEntryTasks.forEach(({ _id }) => {
        const index = selectedTaskListCopy.findIndex((selectedId) => (selectedId === _id));
        if (index === -1) selectedTaskListCopy.push(_id);
      });
      setSelectedTaskList(selectedTaskListCopy);
    }
  };

  const handleCheckboxChange = (value) => {
    const temp = cloneDeep(selectedTaskList);
    if (selectedTaskList.includes(value)) {
      const removedList = temp?.filter((taskId) => taskId !== value);
      setSelectedTaskList(removedList);
    } else {
      temp.push(value);
      setSelectedTaskList(temp);
    }
  };

  const handleSendEmailCheckBox = () => {
    setIsReassignCheckBoxChecked(!isReassignCheckBoxChecked);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setReassignReason();
    dataChange({
      id: data_list_uuid,
      data: {
        ...datalistData,
        reassignTaskDetails: {
          reassignedUsers: {
            teams: [],
            users: [],
          },
          member_team_search_value: EMPTY_STRING,
        },
        reassignModal: {
          error_list: {},
        },
      },
    });
  };

  const reassignTeamOrUserSelectHandler = (event) => {
    const selectedUser = event.target.value;
    const reassignValues = cloneDeep(reassign_task_details);
    if (selectedUser?.is_user) reassignValues?.reassignedUsers?.users?.push(selectedUser);
    else reassignValues?.reassignedUsers?.teams?.push(selectedUser);
    const errorList = cloneDeep(reassign_modal?.error_list);
    delete errorList?.reassign_to;
    dataChange({
      id: data_list_uuid,
      data: {
        ...datalistData,
        reassignTaskDetails: reassignValues,
        reassignModal: {
          error_list: errorList,
        },
      },
    });
  };

  const setMemberOrTeamSearchValue = (event) => {
    if (!isEmpty(event?.type)) {
    const reassignValues = cloneDeep(reassign_task_details);
    set(reassignValues, 'member_team_search_value', event.target.value);
    dataChange({
      id: data_list_uuid,
      data: {
        ...datalistData,
        reassignTaskDetails: reassignValues,
      },
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
        id: data_list_uuid,
        data: {
          ...datalistData,
          reassignModal: {
            error_list: errorValidation,
          },
        },
      });
    } else {
        const postData = {
          task_log_ids: selectedTaskList,
          data_list_uuid: data_list_uuid,
          reassign_assignees: {
            users: reassign_task_details?.reassignedUsers?.users?.map((eachUser) => eachUser?._id),
            teams: reassign_task_details?.reassignedUsers?.teams?.map((eachTeam) => eachTeam?._id),
        },
        reassign_reason: reassignReason,
        is_email: isReassignCheckBoxChecked,
        };
        if (jsUtility.isEmpty(postData?.reassign_assignees?.users)) delete postData.reassign_assignees.users;
        if (jsUtility.isEmpty(postData?.reassign_assignees?.teams)) delete postData.reassign_assignees.teams;
        if (jsUtility.isEmpty(postData?.reassign_reason)) delete postData.reassign_reason;
        setSelectedTaskList([]);
        reAssignmentApi(postData, closeModal, t);
        getDataListEntryTaskList(dataListEntryTaskDetailsParams, data_list_uuid);
        usersAndTeams = [];
        setReassignReason(EMPTY_STRING);
      return postData;
    }
    usersAndTeams = [];
    setReassignReason(EMPTY_STRING);
    return 0;
  };

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
    const removedUserOrTeam = usersAndTeams?.filter((userOrTeam) => userOrTeam?._id === id)[0];
    const reassignValues = cloneDeep(reassign_task_details);
    if (removedUserOrTeam?.is_user) _remove(reassignValues?.reassignedUsers?.users, { _id: id });
    else _remove(reassignValues?.reassignedUsers?.teams, { _id: id });
    dataChange({
      id: data_list_uuid,
      data: {
        ...datalistData,
        reassignTaskDetails: reassignValues,
      },
    });
  };

  reAssignContent = (
    <div className={cx(gClasses.FontWeight600, styles.ModalContentStyles)}>
      <div className={cx(gClasses.FontWeight600, gClasses.PB15)}>{DATA_LIST_ENTRY_TASK_STRING(t).TASK_DETAILS}</div>
      <div className={gClasses.BorderRadius6}>
            <TableWithPagination
              id="entry_reassign_tasks"
              header={taskReassignmentTableHeaders}
              data={constructReassignTaskTableData(
                selectedReassignTaskList,
                dataListEntryTaskDocumentUrl,
                0,
                [],
                () => {},
                false,
                history,
                colorSchema,
                showCreateTask,
              )}
              colorScheme={colorSchema}
            />
      </div>
      <div className={cx(gClasses.PB15, gClasses.PT15)}>{DATA_LIST_ENTRY_TASK_STRING(t).REASSIGNMENT_DETAILS}</div>
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
        label={REASSIGN_MODAL.REASON.LABEL}
        placeholder={REASSIGN_MODAL.REASON.PLACEHOLDER}
        id="reassign_task_reason"
        onChangeHandler={textAreaOnChangeHandler}
        value={reassignReason}
        errorMessage={reassign_modal.error_list && reassign_modal.error_list.reassign_reason}
        hideMessage={reassign_modal.error_list && isEmpty(reassign_modal.error_list.reassign_reason)}
        className={gClasses.MB15}
        innerClass={styles.ReasonDescription}
      />
      <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, styles.WarningTxt, gClasses.FontWeight500, gClasses.MB15)}>
       <WarningIcon
       title="Warning Icon"
       className={cx(gClasses.MR10, gClasses.Width48)}
       />
        {DATA_LIST_ENTRY_TASK_STRING(t).WARNING_CONTENT}
      </div>
      <CheckboxGroup
        id={REASSIGNED_VALUES.SEND_EMAIL.ID}
        label="L_C_FORM.LANGUAGE_LOCALE_CB.ID"
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
  modalContainer = (
    <ModalLayout
    id="reassign_task_DL"
    modalContainerClass={cx(styles.ContainerClass)}
    headerContent={t(REASSIGN_MODAL.TITLE)}
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
          onClick={() => {
            usersAndTeams = [];
            setReassignReason(EMPTY_STRING);
            closeModal();
          }
          }
        >
          {DATA_LIST_ENTRY_TASK_STRING(t).CANCEL}
        </Button>
        <Button
          buttonType={BUTTON_TYPE.PRIMARY}
          className={cx(BS.TEXT_NO_WRAP)}
          onClick={reAssignment}
        >
          {DATA_LIST_ENTRY_TASK_STRING(t).REASSIGN}
        </Button>
      </div>
    )}
    footerClassName={styles.FooterCTAClass}
    />
  );

  const handleReassignTask = () => {
    setIsModalVisible(true);
    setSelectedReassignTaskList(allDatalistEntryTasks?.filter((eachTask) => selectedTaskList?.includes(eachTask._id)));
  };

  const reassignText = (
    <div className={gClasses.Height10}>
    <div className={cx(isAllTask ? styles.ReassignTask : styles.ReassignTaskEntry, isEmpty(selectedTaskList) && gClasses.VisibilityNone, gClasses.CursorPointer, gClasses.WidthFitContent)}>
        <Button
          buttonType={BUTTON_TYPE.SECONDARY}
          onClick={handleReassignTask}
          onKeyPress={handleReassignTask}
          className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}
        >
          <div className={cx(BS.D_FLEX, gClasses.CenterVH)}>
            <ReassignIcon ariaHidden role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.REASSIGN} className={gClasses.Stroke} />
              <div
                className={cx(gClasses.GrayV3, gClasses.ML5)}
              >
                {DATA_LIST_ENTRY_TASK_STRING(t).REASSIGN_TASK}
              </div>
          </div>
        </Button>
    </div>
    </div>
  );

  let dataListEntryTaskCountString;
  if (dataListEntryTaskCount <= 1) {
    dataListEntryTaskCountString = DATA_LIST_ENTRY_TASK_STRING(t).RESULT;
  } else {
    dataListEntryTaskCountString = DATA_LIST_ENTRY_TASK_STRING(t).RESULTS;
  }

  const addNewButton = isEmpty(selectedTaskList) && (
    <Button
    buttonType={BUTTON_TYPE.PRIMARY}
    onClick={() => toggleAddDataListModalVisibilityAction(6)}
    className={gClasses.ML10}
    >
    <PlusIcon
      className={cx(styles.PlusIconStyles, gClasses.MR8)}
    />
    {DATA_LIST_ENTRY_TASK_STRING(t).ADD_NEW_BUTTON}
    </Button>
  );

  if (!isAllTask) {
    downloadContent = isEmpty(selectedTaskList) || !isOwnerUser ? addNewButton : reassignText;
  } else {
    downloadContent = !isEmpty(selectedTaskList) && isOwnerUser ? <div>{reassignText}</div> : <div className={gClasses.DisplayNone}>{reassignText}</div>;
  }

  return !jsUtility.isEmpty(common_server_error) ? (
    <ResponseHandler
      className={gClasses.MT90}
      messageObject={{
        type: RESPONSE_TYPE.SERVER_ERROR,
        title: t('datalist.view_datalist.data_list_error_messages.authorization_error.title'),
        subTitle: t('datalist.view_datalist.data_list_error_messages.authorization_error.sub_title'),
      }}
    />
    ) : (
    <div className={cx(styles.outerContainer)} ref={containerCompRef}>
      <div ref={headerCompRef}>
        <div>
          <SearchBar
            className={cx(styles.SearchBarTop, gClasses.MR10)}
            placeholder={DATA_LIST_ENTRY_TASK_STRING(t).SEARCH_TASK_PLACEHOLDER}
            value={searchTaskValue}
            onChange={onSearchHandler}
            isDataLoading={isDataListEntryTaskPageLoading}
            ariaLabel={searchTaskValue ? isDataListEntryTaskPageLoading ? 'Searching Tasks' : `${dataListEntryTaskCount} tasks Found` : ''}
            searchIconAriaHidden
            autoComplete={ACTION_STRINGS.OFF}
            handleTaskDropdownChange={handleTaskDropdownChange}
            getTaskList={(params) => getDataListEntryTaskList(params, data_list_uuid)}
            getEntryTaskParams={dataListEntryTaskDetailsParams}
            showFullSearch
            selectedValue={taskDropdown}
            hideFilterIcon
          />
        </div>
      {isModalVisible && modalContainer}
      </div>
      <div ref={currentComponentCompRef} className={cx(gClasses.PX30, gClasses.PY5)} style={{ background: isNormalmodeDashboard && colorScheme?.widgetBg }}>
      <TablePaginationRowSelection
        ddlRowOptionList={ROW_COUNT_DROPDOWN}
        ddlRowSelectedValue={dataListEntryTaskParams.size}
        ddlRowOnChangeHandler={ddlRowOnChangeHandler}
        tblHeader={
          tableHeader(
            tableHeaderList(
              getHeaderCheckboxStatus(),
              handleHeaderCheckboxChange,
              isOwnerUser,
              taskDropdown,
            ), isAllTask, selectedValue)}
        tblData={constructTableData(
          dataListEntryTasks,
          isAllTask,
          dataListEntryTaskDocumentUrl,
          selectedValue,
          selectedTaskList,
          handleCheckboxChange,
          isOwnerUser,
          taskDropdown,
          history,
          colorSchema,
          changeAvatarVisibility,
          isNormalMode ? showCreateTask : true,
        )}
        tblLoaderColCount={3}
        tblLoaderRowCount={3}
        tblIsDataLoading={isDataListEntryTaskPageLoading}
        paginationClassName={cx(gClasses.MT20)}
        paginationActivePage={dataListEntryTaskParams.page}
        paginationItemsCountPerPage={dataListTaskEntryCountPerPage}
        paginationTotalItemsCount={dataListEntryTaskCount}
        paginationOnChange={handlePageChange}
        paginationFlowDashboardView
        paginationIsDataLoading={isDataListEntryTaskPageLoading}
        rowPaginationClass={cx(BS.JC_END)}
        data_list_uuid={data_list_uuid}
        isFixedHeader
        isReassignPopper={hover}
        tableContainerClass={cx(styles.DatalistTasksList, gClasses.MT10, (taskDropdown === 1 || !isOwnerUser) && styles.ClosedTasksTableContainer, !isAllTask ? styles.EntryTasksTableContainer : styles.AllEntryTasksTableContainer, isAllTask && styles.AllDatalistTask)}
        skeletonClass={styles.skeletonTopMargin}
        resultsCount={
        <div className={cx(styles.taskfound, gClasses.MT10)}>
          {`${DATA_LIST_ENTRY_TASK_STRING(t).FOUND} ${dataListEntryTaskCount} ${dataListEntryTaskCountString}`}
        </div>}
        downloadButton={downloadContent}
        tblEnablePopper={taskDropdown === 0 && isOwnerUser}
        tblOnPopupOptionClickHandler={tableEntryPopupClicked}
        tblPopupDropdownOptionList={reassignPopUp}
        popupDropdownOptionList={reassignPopUpTbl(t)}
        tblIsDataListEntryTable
      />
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    datalistData: state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid],
    dataListEntryTaskParams: getDataListEntryTaskParamsSelector(
      state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid],
    ),
    dataListEntryTasks: getDataListEntryTasksListSelector(
      state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid],
    ),
    allDatalistEntryTasks: state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid].allDatalistEntryTasks,
    dataListTaskEntryCountPerPage: state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid].itemCountPerPage,
    particularDataListDetails: state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid].particularDataListDetails,
    dataListEntryTaskCount: state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid].dataListEntryTaskCount,
    searchTaskValue: state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid].searchTask,
    selectedValue: state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid].isClosed,
    isDataListEntryTaskPageLoading:
    state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid].isDataListEntryTaskPageLoading,
    dataListEntryTaskDocumentUrl:
    state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid].dataListEntryTaskDocumentUrl,
    common_server_error: state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid].common_server_error,
    reassign_task_details: state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid].reassignTaskDetails,
    isOwnerUser: state.DataListReducer.particularDataListDetails.can_reassign || ownProps.isOwnerUser,
    reassign_modal: state.ApplicationDashboardReportReducer.datalistDashboard[ownProps.data_list_uuid].reassignModal,
  };
};

const mapStateToDispatch = (dispatch) => {
  return {
    dataChange: (data) => {
      dispatch(setDatalistDashboardById(data));
    },
    getDataListEntryTaskList: (params, uuid, additionalData) => {
      dispatch(getDataListDashboardSpecificEntryTaskListApi(params, uuid, additionalData));
    },
    toggleAddDataListModalVisibilityAction: (data) => {
      dispatch(toggleAddDataListModalVisibility(data));
    },
    reAssignmentApi: (data, closeModal, t) => {
      dispatch(reAssignmentApiThunk(data, closeModal, t));
    },
  };
};

export default connect(mapStateToProps, mapStateToDispatch)(DatalistDashboardTaskEntry);
