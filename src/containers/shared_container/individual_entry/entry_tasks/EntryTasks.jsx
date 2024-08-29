import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import {
  ETitleHeadingLevel,
  ETitleSize,
  Input,
  Title,
  SingleDropdown,
  Button,
  EInputIconPlacement,
  EButtonType,
  TableWithPagination,
  TableColumnWidthVariant,
  BorderRadiusVariant,
} from '@workhall-pvt-lmt/wh-ui-library';
import RefreshDashboardIcon from 'assets/icons/dashboards/RefreshDashboardIcon';
import PlusIcon from 'assets/icons/PlusIcon';
import SearchIcon from 'assets/icons/SearchIcon';
import CloseIconNew from 'assets/icons/CloseIconNew';
import { cloneDeep, isEmpty } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import gClasses from '../../../../scss/Typography.module.scss';
import ThemeContext from '../../../../hoc/ThemeContext';
import {
  constructTaskTableData,
  ENTRY_TASK_OPTIONS,
  tableHeaderList,
} from './EntryTasks.utils';
import styles from './EntryTasks.module.scss';
import Warning from '../warning/Warning';
import {
  OF_TEXT,
  SEARCH_LABEL,
  SHOWING_LABEL,
} from '../../../../utils/strings/CommonStrings';
import {
  RESPONSE_TYPE,
  ROWS_PER_PAGE_VALUE,
} from '../../../../utils/Constants';
import { getEntryTaskListApi } from '../../../../redux/actions/IndividualEntry.Action';
import ReassignEntryTask from './reassign_task/ReassignEntryTask';
import ReassignIcon from '../../../../assets/icons/task/ReassignIcon';
import { ARIA_ROLES } from '../../../../utils/UIConstants';
import ENTRY_TASK_STRINGS from './EntryTask.strings';
import {
  INDIVIDUAL_ENTRY_MODE,
  INDIVIDUAL_ENTRY_TYPE,
} from '../IndividualEntry.strings';
import ResponseHandler from '../../../../components/response_handlers/ResponseHandler';
import {
  taskChanges,
  tasksLoadAndClear,
} from '../../../../redux/reducer/IndividualEntryReducer';

function EntryTasks(props) {
  const {
    mode,
    type,
    metaData: { instanceId, moduleUuid },
    otherDetails,
  } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const showCreateTask = useSelector(
    (state) => state.RoleReducer.is_show_app_tasks,
  );
  const {
    isTaskLoading,
    taskList,
    taskDocumentUrl,
    taskListDetails,
    common_server_error,
  } = useSelector((state) => state.IndividualEntryReducer.tasks);
  const { colorScheme } = useContext(ThemeContext);

  const [searchFocus, setSearchFocus] = useState(false);
  const [searchText, setSearchText] = useState(EMPTY_STRING);
  const [taskTypeDropdown, setTaskTypeDropdown] = useState(0);
  const [selectedTaskList, setSelectedTaskList] = useState([]);
  const [isReassignModel, setIsReassignModel] = useState(false);
  const instMode = INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE === mode;
  const reportInstMode = INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE === mode;
  const isReassignCheck =
    !reportInstMode &&
    taskTypeDropdown === 0 &&
    (otherDetails?.canReassign || false);

  const getEntryTaskList = (otherParams) => {
    if (instMode || reportInstMode) {
      const params = {
        page: taskListDetails?.page,
        size: taskListDetails?.size || 5,
        search: searchText,
        is_closed: taskTypeDropdown,
        assigned_to_me: 0,
        ...otherParams,
      };
      if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
        params.data_list_uuid = moduleUuid;
        params.data_list_entry_id = instanceId;
      } else if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
        params.flow_uuid = moduleUuid;
        params.instance_id = instanceId;
      }
      if (isEmpty(params.search)) {
        delete params.search;
      }
      if (![0, 1].includes(params.is_closed)) {
        delete params.is_closed;
      }
      dispatch(getEntryTaskListApi(params));
    }
  };

  useEffect(() => {
    dispatch(tasksLoadAndClear(true));
    getEntryTaskList();
    return () => {
      dispatch(tasksLoadAndClear(false));
    };
  }, []);

  const onClearSearch = () => {
    setSearchFocus(false);
    setSearchText(EMPTY_STRING);
    getEntryTaskList({ page: 1, search: EMPTY_STRING });
  };

  const onRefreshTask = () => {
    getEntryTaskList();
  };

  const onSearchHandler = (event) => {
    const { value } = event.target;
    setSearchText(value);
    getEntryTaskList({ page: 1, search: value });
  };

  const handleTaskDropdownChange = (value) => {
    setTaskTypeDropdown(value);
    getEntryTaskList({ is_closed: value });
  };

  const getHeaderCheckboxStatus = () => {
    if (!isEmpty(taskList) && !isEmpty(selectedTaskList)) {
      let selectedCount = 0;
      taskList.forEach(({ _id }) => {
        if (selectedTaskList.includes(_id)) selectedCount++;
      });
      if (selectedCount === taskList.length) return true;
    }
    return false;
  };

  const handleHeaderCheckboxChange = () => {
    if (instMode) {
      const selectedTaskListCopy = cloneDeep(selectedTaskList);
      if (getHeaderCheckboxStatus()) {
        taskList.forEach(({ _id }) => {
          const index = selectedTaskListCopy.findIndex(
            (selectedId) => selectedId === _id,
          );
          if (index > -1) selectedTaskListCopy.splice(index, 1);
        });
        setSelectedTaskList(selectedTaskListCopy);
      } else {
        taskList.forEach(({ _id }) => {
          const index = selectedTaskListCopy.findIndex(
            (selectedId) => selectedId === _id,
          );
          if (index === -1) selectedTaskListCopy.push(_id);
        });
        setSelectedTaskList(selectedTaskListCopy);
      }
    }
  };

  const handleCheckboxChange = (value) => {
    if (instMode) {
      const temp = cloneDeep(selectedTaskList);
      if (selectedTaskList.includes(value)) {
        const removedList = temp?.filter((taskId) => taskId !== value);
        setSelectedTaskList(removedList);
      } else {
        temp.push(value);
        setSelectedTaskList(temp);
      }
    }
  };

  const onReassignModelOpen = () => {
    setIsReassignModel(true);
  };

  const onCloseReassignModel = (isTaskReassigned = false) => {
    setIsReassignModel(false);
    if (isTaskReassigned) {
      setSelectedTaskList([]);
      getEntryTaskList();
    }
    dispatch(
      taskChanges({
        reassignTask: {
          reassignedUsers: {
            teams: [],
            users: [],
          },
          reassignReason: EMPTY_STRING,
          errorList: {},
        },
      }),
    );
  };

  return (
    <>
      <div className={gClasses.P24}>
        {mode === INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE && <Warning />}
        {!isEmpty(common_server_error) ? (
          <ResponseHandler
            className={gClasses.MT90}
            messageObject={{
              type: RESPONSE_TYPE.SERVER_ERROR,
              title: ENTRY_TASK_STRINGS(t).ERROR.TITLE,
              subTitle: ENTRY_TASK_STRINGS(t).ERROR.SUB_TITLE,
            }}
          />
        ) : (
          <div className={gClasses.H100}>
            <div className={cx(gClasses.CenterVSpaceBetween, gClasses.MB16)}>
              <Title
                content={ENTRY_TASK_STRINGS(t).TITLE}
                headingLevel={ETitleHeadingLevel.h4}
                size={ETitleSize.xs}
              />
              <div className={cx(gClasses.CenterV, gClasses.Gap8)}>
                <div className={cx(gClasses.CenterV, gClasses.Gap16)}>
                  <div>
                    {searchFocus ? (
                      <Input
                        className={styles.SearchTab}
                        refCallBackFunction={(inputRef) =>
                          inputRef?.current?.focus()
                        }
                        placeholder={t(SEARCH_LABEL)}
                        content={searchText}
                        prefixIcon={<SearchIcon />}
                        onChange={onSearchHandler}
                        onBlurHandler={() => {
                          isEmpty(searchText) && setSearchFocus(false);
                        }}
                        suffixIcon={
                          !isEmpty(searchText) && (
                            <button onClick={() => onClearSearch()}>
                              <CloseIconNew />
                            </button>
                          )
                        }
                      />
                    ) : (
                      <button onClick={() => setSearchFocus(true)}>
                        <SearchIcon />
                      </button>
                    )}
                  </div>
                  <SingleDropdown
                    className={styles.TaskTypeDropdown}
                    optionList={ENTRY_TASK_OPTIONS}
                    selectedValue={taskTypeDropdown}
                    onClick={(value) => handleTaskDropdownChange(value)}
                    colorSchema={colorScheme}
                  />
                  <div>
                    <button onClick={onRefreshTask}>
                      <RefreshDashboardIcon isAppColor />
                    </button>
                  </div>
                </div>
                {!reportInstMode && (
                  <>
                    <div className={styles.Divider} />
                    <div className={gClasses.W165}>
                      {isEmpty(selectedTaskList) ? (
                        <Button
                          buttonText={ENTRY_TASK_STRINGS(t).BUTTON.CREATE_TASK}
                          icon={<PlusIcon />}
                          iconPosition={EInputIconPlacement.left}
                          type={EButtonType.PRIMARY}
                          colorSchema={colorScheme}
                          className={gClasses.W100}
                          onClickHandler={() =>
                            instMode && otherDetails?.onCreateTask?.()
                          }
                        />
                      ) : (
                        <Button
                          buttonText={
                            ENTRY_TASK_STRINGS(t).BUTTON.REASSIGN_TASK
                          }
                          onClickHandler={instMode && onReassignModelOpen}
                          icon={
                            <ReassignIcon
                              ariaHidden
                              role={ARIA_ROLES.IMG}
                              className={cx(gClasses.Stroke, styles.IconMinWidth)}
                            />
                          }
                          iconPosition={EInputIconPlacement.left}
                          type={EButtonType.SECONDARY}
                          colorSchema={colorScheme}
                          className={gClasses.W100}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <TableWithPagination
                id="individual_entry_tasks"
                isLoading={isTaskLoading}
                widthVariant={TableColumnWidthVariant.CUSTOM}
                headerClass={cx(
                  gClasses.FTwo12BlackV21,
                  gClasses.FontWeight500,
                )}
                header={tableHeaderList(
                  t,
                  getHeaderCheckboxStatus(),
                  handleHeaderCheckboxChange,
                  isReassignCheck,
                  taskTypeDropdown,
                )}
                data={constructTaskTableData(
                  taskList,
                  taskDocumentUrl,
                  taskTypeDropdown,
                  selectedTaskList,
                  handleCheckboxChange,
                  isReassignCheck,
                  history,
                  colorScheme,
                  showCreateTask,
                )}
                paginationProps={{
                  itemsCountPerPage: taskListDetails?.size,
                  totalItemsCount: taskListDetails?.totalCount,
                  activePage: taskListDetails?.page,
                  onChange: (event, page) => getEntryTaskList({ page }),
                  constructItemsCountMessage: (
                    itemStart,
                    itemEnd,
                    totalCount,
                  ) =>
                    `${t(SHOWING_LABEL)} ${itemStart} - ${itemEnd} ${t(
                      OF_TEXT,
                    )} ${totalCount}`,
                  shape: BorderRadiusVariant.square,
                  hasRowsPerPage: true,
                  rowsPerPageSelectedValue: taskListDetails?.size,
                  rowsPerPageOptionList: ROWS_PER_PAGE_VALUE,
                  onHasRowsPerPageClick: (size) =>
                    getEntryTaskList({ size, page: 1 }),
                }}
                colorScheme={colorScheme}
              />
            </div>
          </div>
        )}
      </div>
      {isReassignModel && (
        <ReassignEntryTask
          onCloseModel={onCloseReassignModel}
          taskList={taskList}
          selectedTaskList={selectedTaskList}
          taskDocumentUrl={taskDocumentUrl}
          moduleUuid={moduleUuid}
          type={type}
          colorScheme={colorScheme}
          showCreateTask={showCreateTask}
          history={history}
          dispatch={dispatch}
        />
      )}
    </>
  );
}

EntryTasks.propTypes = {
  mode: PropTypes.string,
  type: PropTypes.string,
  metaData: PropTypes.object,
  otherDetails: PropTypes.object,
};

export default EntryTasks;
