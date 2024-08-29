/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import cx from 'classnames/bind';
import _remove from 'lodash/remove';
import { TableWithPagination } from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { REASSIGNED_VALUES, taskReassignmentHeaders } from '../../Flow.strings';
import jsUtility, { cloneDeep, isEmpty, set, union, removeDuplicateFromArrayOfObjects } from '../../../../utils/jsUtility';
// import Dropdown from 'components/form_components/dropdown/Dropdown';
import PlusIcon from '../../../../assets/icons/PlusIcon';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import ModalLayout from '../../../../components/form_components/modal_layout/ModalLayout';
import AddMembers from '../../../../components/member_list/add_members/AddMembers';
import TextArea from '../../../../components/form_components/text_area/TextArea';
import CheckboxGroup from '../../../../components/form_components/checkbox_group/CheckboxGroup';
import ReassignIcon from '../../../../assets/icons/reassign_task/ReassignIcon';
import WarningIcon from '../../../../assets/icons/reassign_task/WarningIcon';
import { flowDashboardDataChange, reAssignmentApiThunk } from '../../../../redux/actions/FlowDashboard.Action';
import { getReassigneeValidation, REASSIGN_MODAL, TaskReassignValidateSchema } from '../../../../components/reassign_modal/ReassignModal.strings';
import { validate, isBasicUserMode } from '../../../../utils/UtilityFunctions';
import TablePaginationRowSelection from '../../../../components/table_pagination_row_selection/TablePaginationRowSelection';
import SearchBar from '../../../../components/form_components/search_bar/SearchBar';
// import RadioGroup from '../../../../components/form_components/radio_group/RadioGroup';
import Button, {
  BUTTON_TYPE,
} from '../../../../components/form_components/button/Button';
import styles from './FlowEntryTask.module.scss';
import {
  // taskOptionList,
  tableHeaderList,
  tableHeader,
  constructTableData,
  TASK_STRINGS,
  getValidationData,
  constructReassignTaskTableData,
  // ENTRY_TASK_OPTIONS,
  // messageObject,
} from './FlowEntryTask.utils';
import gClasses from '../../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';
import ResponseHandler from '../../../../components/response_handlers/ResponseHandler';
import { ROW_COUNT_DROPDOWN } from '../../../admin_settings/user_management/UserManagement.strings';
import { FORM_PARENT_MODULE_TYPES } from '../../../../utils/constants/form.constant';
import { RESPONSE_TYPE } from '../../../../utils/Constants';
import { ARIA_LABEL, PD_MODAL_STRINGS } from '../FlowDashboard.string';
import { NON_PRIVATE_TEAMS_PARAMS } from '../../../edit_flow/EditFlow.utils';
import ThemeContext from '../../../../hoc/ThemeContext';
import { getIsReportInstanceViewer } from '../../../application/app_components/AppComponent.utils';

let cancelForReassignment;
const cancelForGetAllTask = {
  cancelToken: null,
};
export const setCancelTokenForGetAllTask = (c) => {
  cancelForGetAllTask.cancelToken = c;
};
export const getCancelTokenForTaskReassignment = (cancelToken) => {
  cancelForReassignment = cancelToken;
};

function AdhocTaskList(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const {
    getTaskList,
    entryId,
    addNewTaskClicked,
    isEntryTask, // enabled when you click any instance in dashboard and then select tasks
    type,
    uuid,
    showRecordId, // enabled when you directly click on tasks tab from flow dashboard
    location,
    reassignModalVisibility,
    reassign_task_details,
    flow_uuid,
    dataChange,
    isOwnerUser,
    isTestBed,
    reAssignmentApi,
    reassign_modal,
    isNormalmodeDashboard,
  } = props;

  const [taskPaginationParams, setTaskPaginationParams] = useState({
    page: 1,
    size: 5,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [allTasksList, setAllTasksList] = useState([]);
  const [taskDocuments, setTaskDocuments] = useState([]);
  const [taskStatus, setTaskStatus] = useState(0);
  const viewContainerRef = useRef();
  const [searchValue, onSetSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [taskDropdown, setTaskDropdown] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTaskList, setSelectedTaskList] = useState([]);
  const [selectedReassignTaskList, setSelectedReassignTaskList] = useState([]);
  const [reassignReason, setReassignReason] = useState();
  const [isReassignCheckBoxChecked, setIsReassignCheckBoxChecked] = useState(true);
  const [reassignVisible, setReassignVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const isBasicUser = isBasicUserMode(history);
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
  const isReportInstanceViewer = getIsReportInstanceViewer(history);

  let modalContainer = null;
  let reAssignContent = null;
  let usersAndTeams = [];
  const taskReassignmentTableHeaders = taskReassignmentHeaders.map((val) => {
    return {
      label: val,
      widthWeight: 1,
    };
  });
  const taskDetailsParams = {
    is_closed: taskStatus,
    ...taskPaginationParams,
    size: taskPaginationParams.size,
  };
  const changeAvatarVisibility = (visible) => {
    setHover(visible);
  };
  if (isEntryTask) {
    if (type === FORM_PARENT_MODULE_TYPES.FLOW) {
      taskDetailsParams.instance_id = entryId;
    } else if (type === FORM_PARENT_MODULE_TYPES.DATA_LIST) {
      taskDetailsParams.data_list_entry_id = entryId;
    }
  }

  const getTaskListApi = (taskDetailsParams) => {
    taskDetailsParams.assigned_to_me = isEntryTask ? 0 : 1;
    if (type === FORM_PARENT_MODULE_TYPES.FLOW) {
      taskDetailsParams.flow_uuid = uuid;
    } else if (type === FORM_PARENT_MODULE_TYPES.DATA_LIST) {
      taskDetailsParams.data_list_uuid = uuid;
    }
    if (cancelForGetAllTask.cancelToken) {
      cancelForGetAllTask.cancelToken();
    }
    setIsLoading(true);
    if (location) {
      taskDetailsParams.is_test_bed = location.pathname.includes('testBed') ? 1 : 0;
    }
    getTaskList(taskDetailsParams, setCancelTokenForGetAllTask).then(
      (response) => {
        if (response) {
          setTasks([...response.pagination_data]);
          const allTasks = [...(allTasksList || []), ...response.pagination_data];
          setAllTasksList(removeDuplicateFromArrayOfObjects(allTasks, '_id'));
          if (taskDetailsParams.page === 1) {
            setTotalCount(
              response && response.pagination_details[0].total_count,
            );
          }
          if (response.document_url_details) {
            setTaskDocuments([...response.document_url_details]);
          }
        }
        setIsLoading(false);
      },
).catch((err) => {
        if (err && (err.code === 'ERR_CANCELED')) return;
        setIsLoading(false);
      setTaskError(err);
    });
  };

  useEffect(() => {
    const visiblity = isOwnerUser && !isTestBed;
    setReassignVisible(visiblity);
  }, [isOwnerUser]);
  useEffect(() => {
    // const taskDetailsParams = {
    //   is_closed: taskStatus,
    //   ...taskPaginationParams,
    //   size: taskPaginationParams.size,
    // };
    // if (isEntryTask) {
    //   if (type === FORM_PARENT_MODULE_TYPES.FLOW) {
    //     taskDetailsParams.instance_id = entryId;
    //   } else if (type === FORM_PARENT_MODULE_TYPES.DATA_LIST) {
    //     taskDetailsParams.data_list_entry_id = entryId;
    //   }
    // }
    getTaskListApi(taskDetailsParams);
  }, []);

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

  const closeModal = () => {
    setIsModalVisible(false);
    // setSelectedTaskList([]); // ETF-11445
    setReassignReason();
    dataChange({
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
          task_log_ids: selectedTaskList,
          flow_uuid: flow_uuid || uuid,
          reassign_assignees: {
            users: reassign_task_details?.reassignedUsers?.users?.map((eachUser) => eachUser?._id),
            teams: reassign_task_details?.reassignedUsers?.teams?.map((eachTeam) => eachTeam?._id),
        },
        reassign_reason: reassignReason,
        is_email: isReassignCheckBoxChecked,
        };
        if (cancelForReassignment) cancelForReassignment();
        if (jsUtility.isEmpty(postData?.reassign_assignees?.users)) delete postData.reassign_assignees.users;
        if (jsUtility.isEmpty(postData?.reassign_assignees?.teams)) delete postData.reassign_assignees.teams;
        if (jsUtility.isEmpty(postData?.reassign_reason)) delete postData.reassign_reason;
        reAssignmentApi(postData, closeModal, t);
        getTaskListApi(taskDetailsParams);
        usersAndTeams = [];
        setReassignReason(EMPTY_STRING);
      return postData;
    }
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
      reassignTaskDetails: reassignValues,
    });
  };

  reAssignContent = (
    <div className={cx(gClasses.FontWeight600, styles.ModalContentStyles)}>
      <div className={cx(gClasses.FontWeight600, gClasses.PB15)}>{TASK_STRINGS(t).TASK_DETAILS}</div>
      <div>
        <TableWithPagination
            id="reassign_tasks"
            header={taskReassignmentTableHeaders}
            data={constructReassignTaskTableData(
              selectedReassignTaskList,
              taskDocuments,
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
      <div className={cx(gClasses.PB15, gClasses.PT15)}>{TASK_STRINGS(t).REASSIGNMENT_DETAILS}</div>
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
        isRequired
        isActive
        apiParams={!isNormalMode && NON_PRIVATE_TEAMS_PARAMS}
      />
      <TextArea
        label={TASK_STRINGS(t).REASON_LABEL}
        placeholder={TASK_STRINGS(t).REASON_PLACEHOLDER}
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
        {TASK_STRINGS(t).WARNING_CONTENT}
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
    id="reassign_task"
    modalContainerClass={cx(styles.ContainerClass)}
    headerContent={PD_MODAL_STRINGS(t).REASSIGN_THE_TASK}
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
          }}
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
  );

  const handleReassignTask = () => {
    setIsModalVisible(true);
    setSelectedReassignTaskList(allTasksList?.filter((eachTask) => selectedTaskList?.includes(eachTask._id)));
  };

  const reassignText = (
    <div className={gClasses.Height10}>
    <div className={cx(!isEntryTask ? styles.ReassignTask : styles.ReassignTaskEntry, isEmpty(selectedTaskList) && gClasses.VisibilityNone, gClasses.CursorPointer, gClasses.WidthFitContent)}>
        <Button
          buttonType={BUTTON_TYPE.SECONDARY}
          onClick={handleReassignTask}
          onKeyPress={handleReassignTask}
          className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}
        >
          <div className={cx(BS.D_FLEX, gClasses.CenterVH)}>
            <ReassignIcon ariaHidden role={ARIA_ROLES.IMG} ariaLabel={t(ARIA_LABEL.REASSIGN)} className={gClasses.Stroke} />
              <div
                className={cx(gClasses.GrayV3, gClasses.ML5)}
              >
                {TASK_STRINGS(t).REASSIGN_TASK}
              </div>
          </div>
        </Button>
    </div>
    </div>
  );

  const handlePageChange = (selectedPage) => {
    if (selectedPage !== taskPaginationParams.page) {
      const params = { ...taskPaginationParams };
      params.page = selectedPage;
      if (isEntryTask) {
        if (type === FORM_PARENT_MODULE_TYPES.FLOW) {
          params.instance_id = entryId;
        } else if (type === FORM_PARENT_MODULE_TYPES.DATA_LIST) {
          params.data_list_entry_id = entryId;
        }
      }
      if (searchValue !== '') {
        params.search = searchValue;
      }
      if (taskDropdown === 0 || taskDropdown === 1) {
        params.is_closed = taskDropdown;
      }
      getTaskListApi(params);
      setTaskPaginationParams({ ...taskPaginationParams, page: selectedPage });
    }
  };

  const tableEntryPopupClicked = (value, id) => {
    setSelectedTaskList([id]);
    setSelectedReassignTaskList(tasks?.filter((eachTask) => id === eachTask._id));
    setIsModalVisible(true);
  };

  const getHeaderCheckboxStatus = () => {
    if (!isEmpty(tasks) && !isEmpty(selectedTaskList)) {
      let selectedCount = 0;
      tasks.forEach(({ _id }) => { if (selectedTaskList.includes(_id)) selectedCount++; });
      if (selectedCount === tasks.length) return true;
    }
    return false;
  };

  const handleHeaderCheckboxChange = () => {
    const selectedTaskListCopy = cloneDeep(selectedTaskList);
    if (getHeaderCheckboxStatus()) {
      tasks.forEach(({ _id }) => {
        const index = selectedTaskListCopy.findIndex((selectedId) => (selectedId === _id));
        if (index > -1) selectedTaskListCopy.splice(index, 1);
      });
      setSelectedTaskList(selectedTaskListCopy);
    } else {
      tasks.forEach(({ _id }) => {
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

  const ddlRowOnChangeHandler = (e) => {
    const selectedTableRowCount = e.target.value;
    if (selectedTableRowCount !== taskPaginationParams.size) {
      setTaskPaginationParams({
        ...taskPaginationParams,
        page: 1,
        size: selectedTableRowCount,
      });
      const taskDetailsParams = {
        is_closed: taskStatus,
        ...taskPaginationParams,
        size: selectedTableRowCount,
        page: 1,
      };
      if (isEntryTask) {
        if (type === FORM_PARENT_MODULE_TYPES.FLOW) {
          taskDetailsParams.instance_id = entryId;
        } else if (type === FORM_PARENT_MODULE_TYPES.DATA_LIST) {
          taskDetailsParams.data_list_entry_id = entryId;
        }
      }
      getTaskListApi(taskDetailsParams);
    }
  };

  const onSearchHandler = (value) => {
    if (searchValue !== value) {
      onSetSearchValue(value);
      const params = { ...taskPaginationParams };
      if (isEntryTask) {
        if (type === FORM_PARENT_MODULE_TYPES.FLOW) {
          params.instance_id = entryId;
        } else if (type === FORM_PARENT_MODULE_TYPES.DATA_LIST) {
          params.data_list_entry_id = entryId;
        }
      }
      if (value !== '') {
        params.search = value;
      }
      if (taskDropdown === 0 || taskDropdown === 1) {
        params.is_closed = taskStatus;
      }
      // params.is_closed = taskStatus;
      getTaskListApi(params);
    }
  };

  const handleTaskDropdownChange = (e) => {
    const changeValue = e.target.value;
    setTaskDropdown(changeValue);
    setTaskStatus(changeValue);
    const params = { ...taskPaginationParams };
    // params.page = 1;
    if (isEntryTask) {
      if (type === FORM_PARENT_MODULE_TYPES.FLOW) {
        params.instance_id = entryId;
      } else if (type === FORM_PARENT_MODULE_TYPES.DATA_LIST) {
        params.data_list_entry_id = entryId;
      }
    }
    if (searchValue !== '') {
      params.search = searchValue;
    }
    if (changeValue === 0 || changeValue === 1) {
      params.is_closed = changeValue;
    }
    //  params.search = value;
    getTaskListApi(params);
  };

  let adhocTaskCountStringing;
  if (totalCount <= 1) {
    adhocTaskCountStringing = TASK_STRINGS(t).RESULT;
  } else {
    adhocTaskCountStringing = TASK_STRINGS(t).RESULTS;
  }

  // let adhocTaskOpenClose;
  // if (taskStatus) {
  //   adhocTaskOpenClose = TASK_STRINGS.ClOSED;
  // } else {
  //   adhocTaskOpenClose = TASK_STRINGS.OPEN;
  // }

  const addNewButton = isEmpty(selectedTaskList) && !isReportInstanceViewer && (
    <Button
    buttonType={BUTTON_TYPE.PRIMARY}
    onClick={() => addNewTaskClicked()}
    className={gClasses.ML10}
    >
    <PlusIcon
      className={styles.PlusIconStyles}
    />
    {TASK_STRINGS(t).ADD_NEW_BUTTON}
    </Button>
  );

  let downloadContent = null;
  if (isEntryTask) {
    downloadContent = isEmpty(selectedTaskList) || !reassignVisible ? addNewButton : reassignText;
  } else {
    downloadContent = !isEmpty(selectedTaskList) && reassignVisible ? <div>{reassignText}</div> : <div className={gClasses.DisplayNone}>{reassignText}</div>;
  }

  // let noDataFound;
  if (!isLoading && totalCount === 0) {
    // noDataFound = (
    //   <ResponseHandler
    //     messageObject={messageObject}
    //     className={cx(gClasses.MT10)}
    //   />
    // );
  }
  const ariaLabel = isLoading ? 'results loading' : searchValue.length > 0 ? totalCount > 0 ? 'results found' : 'results not found' : null;
  return !jsUtility.isEmpty(taskError) ? (
    <ResponseHandler
          className={gClasses.MT90}
          messageObject={{
            type: RESPONSE_TYPE.SERVER_ERROR,
            title: 'Access Denied',
            subTitle: 'You don\'t have access to this instance',
          }}
    />
    ) : (
    <div ref={viewContainerRef}>
      {/* {!isEntryTask && ( */}
        <div>
        <SearchBar
            className={cx(styles.SearchBarTop, gClasses.MR10, isEntryTask && gClasses.MB20)}
            placeholder={TASK_STRINGS(t).SEARCH_TASK_PLACEHOLDER}
            value={searchValue}
            onChange={onSearchHandler}
            isDataLoading={isLoading}
            getTaskListApi={getTaskListApi}
            handleTaskDropdownChange={handleTaskDropdownChange}
            getTaskList={getTaskListApi}
            getEntryTaskParams={taskDetailsParams}
            showFullSearch
            selectedValue={taskDropdown}
            ariaLabel={ariaLabel}
            hideFilterIcon
        />
        </div>
      {/* )
      } */}
      {/* {isEntryTask && (
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
          <span className={cx(gClasses.FontWeight600)}>
            {TASK_STRINGS.TASK}
          </span>
          <Button
            buttonType={BUTTON_TYPE.PRIMARY}
            onClick={() => addNewTaskClicked()}
          >
          <PlusIcon
            className={styles.PlusIconStyles}
          />
            {TASK_STRINGS.ADD_NEW_BUTTON}
          </Button>
          </div>
      )} */}
      {/* {taskDropdown === 0 && !isEntryTask && visibleReassign && reassignText} */}
      {(isModalVisible || reassignModalVisibility) && modalContainer}
      {/* <div className={cx(BS.JC_BETWEEN, gClasses.CenterV, gClasses.MT15, styles.DropdownContainer)}>
      {isEntryTask && (
        <>
        <Dropdown
        optionList={ENTRY_TASK_OPTIONS}
        optionListClassName={styles.OptionListClassName}
        onChange={handleTaskDropdownChange}
        selectedValue={taskDropdown}
        customContentStyle={styles.DropdownHeader}
        optionContainerClassName={styles.OptionContainerClassName}
        hideLabel
        comboboxClass={gClasses.MT10}
        inputDropdownContainer={styles.DropdownContainerStyles}
        optionListDropDown={styles.OptionListDropDown}
        />
        <SearchBar
          className={cx(styles.SearchBar, gClasses.MR10)}
          placeholder={TASK_STRINGS.SEARCH_TASK_PLACEHOLDER}
          value={searchValue}
          onChange={onSearchHandler}
          isDataLoading={isLoading}
          autoComplete={ACTION_STRINGS.OFF}
          ariaLabel={ariaLabel}
          isLoading={isLoading}
          isEntryTask={isEntryTask}
          taskDropdown={taskDropdown}
          selectedValue={taskDropdown}
        />
        </>
      )} */}
        {/* <RadioGroup
        hideInstructionMessage
        className={gClasses.CenterV}
          optionList={taskOptionList}
          onClick={onRadioGroupValueSelect}
          hideMessage
          hideLabel
          selectedValue={taskStatus}
          isDataLoading={isLoading}
          radioLabelClass={gClasses.FTwo12BlackV13}
          // customClass={gClasses.PT5}
        /> */}
      {/* </div> */}
      {/* </div> */}
      <div className={cx(gClasses.PX30, gClasses.PY5)} style={{ background: isNormalmodeDashboard && colorScheme?.widgetBg }}>
      <TablePaginationRowSelection
        ddlRowOptionList={ROW_COUNT_DROPDOWN}
        ddlRowSelectedValue={taskPaginationParams.size}
        ddlRowOnChangeHandler={ddlRowOnChangeHandler}
        tblHeader={tableHeader(
          tableHeaderList(
            getHeaderCheckboxStatus(),
            handleHeaderCheckboxChange,
            reassignVisible,
            taskDropdown,
          ),
          showRecordId,
          taskStatus,
        )}
        tblData={constructTableData(tasks, showRecordId, taskDocuments, taskStatus, selectedTaskList, handleCheckboxChange, reassignVisible, taskDropdown, history, colorSchema, changeAvatarVisibility, isNormalMode ? showCreateTask : true)}
        tblLoaderColCount={3}
        tblLoaderRowCount={3}
        tblIsDataLoading={isLoading}
        paginationClassName={cx(gClasses.MT20)}
        paginationActivePage={taskPaginationParams.page}
        paginationItemsCountPerPage={taskPaginationParams.size}
        paginationTotalItemsCount={totalCount}
        paginationOnChange={handlePageChange}
        paginationFlowDashboardView
        paginationIsDataLoading={isLoading}
        rowPaginationClass={cx(BS.JC_END, gClasses.MT15)}
        isFixedHeader
        isReassignPopper={hover}
        tableContainerClass={cx(
          styles.FlowTasksList,
          gClasses.MT10,
          (taskStatus === 1 || !reassignVisible) &&
            styles.ClosedTasksTableContainer,
          isEntryTask
            ? styles.EntryTasksTableContainer
            : styles.TasksTableContainer,
          !isEntryTask && styles.AllFlowTask,
        )}
        tblEnablePopper={taskDropdown === 0 && reassignVisible}
        tblOnPopupOptionClickHandler={tableEntryPopupClicked}
        tblPopupDropdownOptionList={[
          { label: TASK_STRINGS(t).REASSIGN_TASK, value: 1, icon: <ReassignIcon role={ARIA_ROLES.IMG} ariaHidden ariaLabel="Reassign Task" /> },
        ]}
        popupDropdownOptionList={[
          { label: TASK_STRINGS(t).REASSIGN_TASK, value: 1, icon: <ReassignIcon /> },
        ]}
        tblIsDataListEntryTable
        resultsCount={<div className={cx(styles.taskfound, gClasses.MT10)}>
                        {`${TASK_STRINGS(t).FOUND} ${totalCount} ${adhocTaskCountStringing}`}
                      </div>}
        downloadButton={downloadContent}
        tblIsDashboard
      />
      </div>
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

const mapStateToProps = (state, ownProps) => {
  return {
    reassign_task_details: state.FlowDashboardReducer.reassignTaskDetails,
    flow_uuid: state.FlowDashboardReducer.flow_uuid,
    isOwnerUser: state.FlowDashboardReducer.canReassign || ownProps?.isOwnerUser,
    isTestBed: state.FlowDashboardReducer.isTestBed,
    reassign_modal: state.FlowDashboardReducer.reassignModal,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdhocTaskList);
