import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useHistory, withRouter } from 'react-router';
import SkeletonWrapper from 'components/skeleton_wrapper/SkeletonWrapper';
import { M_T_STRINGS } from 'containers/landing_page/LandingPage.strings';
import { NavBarDataChange } from 'redux/actions/NavBar.Action';
import { ROWS_PER_PAGE } from 'components/form_components/pagination/Pagination.strings';
import { useTranslation } from 'react-i18next';
import Dropdown from '../../../../../../components/form_components/dropdown/Dropdown';
import AddMembers from '../../../../../../components/member_list/add_members/AddMembers';
import Input, {
  INPUT_VARIANTS,
} from '../../../../../../components/form_components/input/Input';
import FormTitle, {
  FORM_TITLE_TYPES,
} from '../../../../../../components/form_components/form_title/FormTitle';
import SearchIcon from '../../../../../../assets/icons/SearchIcon';
import { BS } from '../../../../../../utils/UIConstants';
import { ADD_OR_REMOVE_ASSIGNEE_STRINGS } from './AddOrRemoveAssignee.strings';
import {
  assignTaskToParticipantsApiAction,
  clearAddOrRemoveAssigneeDataAction,
  getAllInstancesByTaskMetadataUuidApiAction,
  getTaskAssigneesApiAction,
  getTaskMetadataApiThunk,
  setAddOrRemoveAssigneeDataAction,
} from '../../../../../../redux/actions/TaskActions';
import styles from './AddOrRemoveAssignee.module.scss';
import gClasses from '../../../../../../scss/Typography.module.scss';
import AssigneeList from './assignee_list/AssigneeList';
import { nullCheck, get, isEmpty } from '../../../../../../utils/jsUtility';
import { FORM_POPOVER_STATUS, TEAM_TYPES_PARAMS } from '../../../../../../utils/Constants';
import {
  getSplittedUsersAndTeamsIdObjFromArray,
  isBasicUserMode,
  showToastPopover,
} from '../../../../../../utils/UtilityFunctions';
import Pagination from '../../../../../../components/form_components/pagination/Pagination';
import { ROW_COUNT_DROPDOWN } from '../../../../../admin_settings/user_management/UserManagement.strings';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';

let cancelForTaskMetadataActiveParticipants;

export const cancelTokenForTaskMetadataActiveParticipants = (cancelToken) => {
  cancelForTaskMetadataActiveParticipants = cancelToken;
};

function AddOrRemoveAssignee(props) {
  const {
    setAddOrRemoveAssigneeData,
    clearAddOrRemoveAssigneeData,
    assigneeList,
    getTaskAssigneesApiCall,
    taskMetadataID,
    taskMetadataUUID,
    isDataLoading,
    assignTaskToParticipantsApiCall,
    searchSelectedUsers,
    searchBarText,
    activePage,
    itemsCountPerPage,
    totalItemsCount,
    isTableLoading,
    getTaskMetadataApi,
    getAssignedTaskList,
    getAllInstancesByTaskMetadataUuidApiCall,
    respondantSummaryItemsCountPerPage,
  } = props;

  const { t } = useTranslation();
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const [assigneesCount, setAssigneesCount] = useState(totalItemsCount);

  const callGetTaskAssigneesApi = (
    page = activePage,
    searchText = searchBarText,
    size = itemsCountPerPage,
  ) => {
    const params = {
      task_metadata_uuid: taskMetadataUUID,
      page,
      size,
    };
    if (searchText) params.search = searchText;
    if (cancelForTaskMetadataActiveParticipants) {
      cancelForTaskMetadataActiveParticipants();
    }
    getTaskAssigneesApiCall(params);
  };

  const calculateAssigneesDataCount = () =>
    Math.max(Math.floor((window.innerHeight - 319.5) / 64), 5);

  useEffect(() => {
    const dataCountPerPage = calculateAssigneesDataCount();
    setAddOrRemoveAssigneeData('itemsCountPerPage', dataCountPerPage);
    callGetTaskAssigneesApi(undefined, undefined, dataCountPerPage);
    return () => {
      clearAddOrRemoveAssigneeData();
    };
  }, []);

  useEffect(() => {
    if (!assigneesCount) setAssigneesCount(totalItemsCount);
  }, [totalItemsCount]);

  const onAddOrRemoveAssigneHandler = (assigneeIds, isRemoveAction = false) => {
    if (assigneeList && assigneeList.length === 1 && isRemoveAction && assigneesCount === 1) {
      showToastPopover(
        ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).REMOVE_LAST_USER.title,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      return;
    }
    const params = {
      task_metadata_id: taskMetadataID,
    };
    if (isRemoveAction) {
      params.remove_assignees = [assigneeIds];
      setAssigneesCount(assigneesCount - 1);
    } else {
      params.add_assignees =
        getSplittedUsersAndTeamsIdObjFromArray(searchSelectedUsers);
      params.allow_cancelled_task = true;
      setAssigneesCount(assigneesCount + 1);
    }
    assignTaskToParticipantsApiCall(params, isRemoveAction, async () => {
      if (!isRemoveAction) {
        await setAddOrRemoveAssigneeData('searchSelectedUsers', []);
      }
      // if (searchBarText) await setAddOrRemoveAssigneeData('searchBarText', '');
      callGetTaskAssigneesApi();
      const taskDetailParam = {
        _id: taskMetadataID,
        resolutions: { 'assignees.users.profile_pic': 'small' },
      };
      getTaskMetadataApi(taskDetailParam);
      getAssignedTaskList(M_T_STRINGS.TASK_LIST.GET_TASK_LIST);
      const params = {
        task_metadata_uuid: taskMetadataUUID,
        sort_field: 'processed_on',
        sort_by: -1,
        page: 1,
        size: respondantSummaryItemsCountPerPage,
      };
      getAllInstancesByTaskMetadataUuidApiCall(params);
    });
  };

  const onAddOrRemoveSelectedUserHandler = (event, isRemoveAction = false) => {
    if (isRemoveAction) {
      const filterUsers = searchSelectedUsers.filter(
        (eachUser) => eachUser._id !== event,
      );
      setAddOrRemoveAssigneeData('searchSelectedUsers', filterUsers);
    } else if (nullCheck(event, 'target.value')) {
      const assigneeListAndSelectedUsers = [
        ...assigneeList,
        ...searchSelectedUsers,
      ];
      if (
        !assigneeListAndSelectedUsers.some(
          (eachUser) => eachUser._id === event.target.value._id,
        )
      ) {
        setAddOrRemoveAssigneeData('searchSelectedUsers', [
          ...searchSelectedUsers,
          event.target.value,
        ]);
      } else {
        showToastPopover(
          ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).ADDING_EXISTING_USER_ERROR,
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    }
  };
  const ariaLabel = isDataLoading ? 'results loading' : searchBarText.length > 0 ? !isEmpty(assigneeList) ? 'results found' : 'result not found' : null;

  return (
    <>
      <div
        className={cx(
          gClasses.FieldName,
          gClasses.MT20,
        )}
        id="add_assignee_label"
      >
        {ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).ADD_ASSIGNEE.LABEL}
      </div>
      <AddMembers
        id="add_assignee"
        getTeamsAndUsers
        className={cx(gClasses.MT10)}
        customClass={styles.InputContainerHeight}
        popperClassName={styles.UserPickerSuggestionList}
        placeholder={ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).ADD_ASSIGNEE.PLACEHOLDER}
        onAddButtonClicked={onAddOrRemoveAssigneHandler}
        onCancelButtonClicked={
          nullCheck(searchSelectedUsers, 'length', true)
            ? () => setAddOrRemoveAssigneeData('searchSelectedUsers', [])
            : false
        }
        onUserSelectHandler={onAddOrRemoveSelectedUserHandler}
        removeSelectedUser={(id) => onAddOrRemoveSelectedUserHandler(id, true)}
        selectedData={searchSelectedUsers}
        hideUserIcon
        hideLabel
        isActive
        isScrollableSelectedList
        popperFixedStrategy
        internalSearchValueState
        isDataLoading={isDataLoading}
        apiParams={{ team_type: isNormalMode ? TEAM_TYPES_PARAMS.ALL_TEAMS : TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS }}
      />
      <div>
        <FormTitle type={FORM_TITLE_TYPES.TYPE_7} isDataLoading={isDataLoading}>
          {ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).CURRENT_ASSIGNEES.LABEL}
        </FormTitle>
          <div className={cx(gClasses.CenterV, BS.D_FLEX, BS.JC_BETWEEN)}>
            <SkeletonWrapper isLoading={isDataLoading} height={33} width={100}>
              <div className={cx(gClasses.CenterV)}>
                <span className={cx(styles.RowsPerPage, gClasses.MR10)} id="placeholder_rows_per_page">
                {ROWS_PER_PAGE.ROW_LABEL}
                </span>
                <Dropdown
                  id="rows_per_page"
                  hideLabel
                  hideMessage
                  strictlySetSelectedValue
                  optionList={ROW_COUNT_DROPDOWN}
                  selectedValue={itemsCountPerPage}
                  onChange={(event) =>
                    callGetTaskAssigneesApi(
                      undefined,
                      undefined,
                      event.target.value,
                    )
                  }
                />
              </div>
            </SkeletonWrapper>
            <Input
              className={cx(gClasses.Flex1, styles.SearchBar)}
              inputContainerClasses={cx(gClasses.PY5)}
              placeholder={
                !searchBarText ?
                ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).CURRENT_ASSIGNEES.SEARCH_BAR
                  .PLACEHOLDER
                  : null
              }
              inputVariant={INPUT_VARIANTS.TYPE_2}
              readOnlyPrefix={<SearchIcon />}
              onChangeHandler={(event) => {
                const searchText = get(event, 'target.value', '');
                setAddOrRemoveAssigneeData('searchBarText', searchText);
                callGetTaskAssigneesApi(1, searchText);
              }}
              value={searchBarText}
              isDataLoading={isDataLoading}
              ariaLabel={ariaLabel}
            />
          </div>
        <AssigneeList
          list={assigneeList}
          isDataLoading={isDataLoading || isTableLoading}
          onDeleteAssigneeHandler={(id) =>
            onAddOrRemoveAssigneHandler(id, true)
          }
          loaderCount={itemsCountPerPage}
        />
        {(isDataLoading || nullCheck(assigneeList, 'length', true)) && (
          <Pagination
            activePage={activePage}
            itemsCountPerPage={itemsCountPerPage}
            totalItemsCount={totalItemsCount}
            onChange={(currentPage) => {
              setAddOrRemoveAssigneeData('activePage', currentPage);
              callGetTaskAssigneesApi(currentPage);
            }}
            className={gClasses.MT15}
            flowDashboardView
            isDataLoading={isDataLoading || isTableLoading}
          />
        )}
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isAddOrRemoveAssigneeModalVisible:
      state.TaskContentReducer.addOrRemoveAssignee.isModalVisible,
    assigneeList: state.TaskContentReducer.addOrRemoveAssignee.assigneeList,
    isDataLoading:
      state.TaskContentReducer.addOrRemoveAssignee.isInitialLoading,
    taskMetadataID: state.TaskContentReducer.taskMetadata._id,
    taskMetadataUUID: state.TaskContentReducer.taskMetadata.task_metadata_uuid,
    searchSelectedUsers:
      state.TaskContentReducer.addOrRemoveAssignee.searchSelectedUsers,
    searchBarText: state.TaskContentReducer.addOrRemoveAssignee.searchBarText,
    isTableLoading: state.TaskContentReducer.addOrRemoveAssignee.isTableLoading,
    activePage: state.TaskContentReducer.addOrRemoveAssignee.activePage,
    itemsCountPerPage:
      state.TaskContentReducer.addOrRemoveAssignee.itemsCountPerPage,
    totalItemsCount:
      state.TaskContentReducer.addOrRemoveAssignee.totalItemsCount,
    respondantSummaryItemsCountPerPage: state.TaskContentReducer.respondantsSummary.itemsCountPerPage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: (data) => {
      dispatch(NavBarDataChange(data));
    },
    setAddOrRemoveAssigneeData: (...params) =>
      dispatch(setAddOrRemoveAssigneeDataAction(...params)),
    clearAddOrRemoveAssigneeData: (...params) =>
      dispatch(clearAddOrRemoveAssigneeDataAction(...params)),
    getTaskAssigneesApiCall: (...params) =>
      dispatch(getTaskAssigneesApiAction(...params)),
    getAllInstancesByTaskMetadataUuidApiCall: (...params) =>
      dispatch(getAllInstancesByTaskMetadataUuidApiAction(...params)),
    assignTaskToParticipantsApiCall: (...params) =>
      dispatch(assignTaskToParticipantsApiAction(...params)),
    getTaskMetadataApi: (value) => {
      dispatch(getTaskMetadataApiThunk(value));
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddOrRemoveAssignee),
);
