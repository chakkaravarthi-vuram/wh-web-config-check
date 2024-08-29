import React, { useRef, useContext, useState, useEffect } from 'react';
import cx from 'classnames';
import {
  TableWithInfiniteScroll,
  TableScrollType,
  TableColumnWidthVariant,
  Title,
  SingleDropdown,
  ETitleSize,
  ETitleHeadingLevel,
  Button,
  Input,
  EInputIconPlacement,
  BorderRadiusVariant,
  Variant,
  Text,
  ETextSize,
  ETitleAlign,
  TableWithPagination,
  ButtonContentVaraint,
 PaginationButtonPlacement,
 ColorVariant,
 Skeleton,
 Chip, EChipSize, EButtonType, Popper, EPopperPlacements } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { get, isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import styles from './Tasks.module.scss';
import {
  HOME_COMPONENT,
  TABLE_ROW_COUNT,
  TASK_CREATE_NOR_ALLOWED_TYPES,
  TASK_LIST_INFINITE_SCROLL_ID,
  TASK_LIST_TYPE,
  TASK_TABLE_TYPE,
} from '../TaskList.constants';
import useTasks from './useTasks';
import { BS } from '../../../../../utils/UIConstants';
import FilterIcon from '../../../../../assets/icons/application/FilterV2';
import gClasses from '../../../../../scss/Typography.module.scss';
import {
  getTaskListHeaderBasedOnType,
  getTaskListBodyBasedOnType,
  getEmptyMessage,
} from '../TaskListing.utils';
import SearchIconNew from '../../../../../assets/icons/SearchIconNew';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import {
  CancelToken,
  isMobileScreen,
  onWindowResize,
} from '../../../../../utils/UtilityFunctions';
import ThemeContext from '../../../../../hoc/ThemeContext';
import NoTaskIcon from '../../../../../assets/icons/application/NoTaskIcon';
import RefreshIconApp from '../../../../../assets/icons/application/RefershIconApp';
import TaskFilter from '../task_filter/TaskFilter';
import { TYPE_OF_TASK_KEY } from '../../../app_configuration/task_configuration/TaskConfiguration.constants';

function Tasks(props) {
  const {
    componentId = HOME_COMPONENT,
    taskListType = TASK_LIST_TYPE.OPEN,
    dynamicColumnKeys = [],
    defaultFilters = {},
    hideFilterAndSearchBar,
    cancelToken = new CancelToken(),
    hideScroll = false,
    tableType = TASK_TABLE_TYPE.PAGINATED,
    componentInfo = {},
    currentPageName = EMPTY_STRING,
    coordinates,
  } = props;

  const { t } = useTranslation();
  const overallContainer = useRef();
  const filterPopOverTargetRef = useRef();
  const tasksRef = useRef();
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
  const [isMobileView, setMobileView] = useState(isMobileScreen());

  const windowResize = () => {
    setMobileView(isMobileScreen());
};

useEffect(() => {
    onWindowResize(windowResize);
    return () => window.removeEventListener('resize', windowResize);
  });

  const {
    TASK_LIST_CONSTANT,
    taskListReducer,
    filter,
    activeSortField,
    isSearchFocus,
    isFilterPopOverVisible,
    selectedFilterCount,
    setFilterPopOverVisibility,
    onToggleSearch,
    onSearchHandler,
    onLoadMoreTaskList,
    onFilterChangeHandler,
    onFilterSaveHandler,
    onFilterCancelHandler,
    onRowClickHandler,
    onSortHandler,
    onCreateTask,
    onPageChange,
    onAssigneToOtherTypeChange,
    onFilterClearByFilterId,
    onFilterClear,
  } = useTasks(
      componentId,
      taskListType,
      defaultFilters,
      cancelToken,
      tableType,
      tasksRef,
      componentInfo,
      coordinates,
    );

  const { colorScheme } = useContext(ThemeContext);

  const {
    FILTER: { SHOW_BY },
    LABEL,
  } = TASK_LIST_CONSTANT;

  const isTaskListEmpty = (!get(taskListReducer, ['isDataLoading'], false) && isEmpty(taskListReducer?.activeTaskList));

  const getFilterPopperContent = () => (
    <Popper
      targetRef={filterPopOverTargetRef}
      open={isFilterPopOverVisible}
      placement={EPopperPlacements.BOTTOM_END}
      className={gClasses.ZIndex10}
      content={
          <TaskFilter
            colorScheme={colorScheme}
            onChange={onFilterChangeHandler}
            onClearByFilterId={onFilterClearByFilterId}
            onSave={onFilterSaveHandler}
            onCancel={() => onFilterCancelHandler()}
            onClear={onFilterClear}
            taskListType={taskListType}
            filter={filter}
            targetRef={filterPopOverTargetRef}
            setPopperVisibility={setFilterPopOverVisibility}
          />
        }
    />
  );

  const getSearchIcon = () => (
    <SearchIconNew
      className={styles.SearchIcon}
      role="button"
      tabIndex={0}
      ariaLabel="Search"
      onClick={onToggleSearch}
      onKeyDown={onToggleSearch}
    />
  );

  const allowedRowsPerPage = filter?.size || TABLE_ROW_COUNT.PAGINATED;

  const getTable = () => {
    if (isTaskListEmpty) {
      return (
        <div
          className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, BS.JC_CENTER, BS.H100)}
        >
          <div
            className={cx(
              BS.D_FLEX,
              BS.ALIGN_ITEM_CENTER,
              BS.JC_CENTER,
              BS.FLEX_COLUMN,
            )}
          >
            <NoTaskIcon />
            <Title
              content={getEmptyMessage(taskListType, filter?.search, filter?.type)}
              alignment={ETitleAlign.middle}
              headingLevel={ETitleHeadingLevel.h5}
              size={ETitleSize.xs}
              className={cx(gClasses.MB8, styles.ResponsiveClass)}
            />
            {(!filter.search) && showCreateTask && !TASK_CREATE_NOR_ALLOWED_TYPES.includes(taskListType) && componentInfo?.type_of_task !== TYPE_OF_TASK_KEY.FLOW_OR_DATA_LIST && (
            <>
              <Text
                content={LABEL.CREATE_FIRST_TASK}
                size={ETextSize.SM}
                className={gClasses.MB24}
              />
              <Button
                buttonText={LABEL.CREATE_TASK}
                onClickHandler={onCreateTask}
                type={EButtonType.PRIMARY}
                colorSchema={colorScheme}
              />
            </>)}
          </div>
        </div>
      );
    } else if (tableType === TASK_TABLE_TYPE.INFINITE_SCROLL) {
        return (
            <TableWithInfiniteScroll
              scrollableId={TASK_LIST_INFINITE_SCROLL_ID}
              className={styles.OverFlowInherit}
              tableClassName={styles.Table}
              header={getTaskListHeaderBasedOnType(
                taskListType,
                dynamicColumnKeys,
                filter?.type,
                filter?.sort_by,
                activeSortField,
              )}
              data={getTaskListBodyBasedOnType(
                taskListType,
                taskListReducer?.activeTaskList || [],
                dynamicColumnKeys,
                filter?.type,
                showCreateTask,
                t,
              )}
              isLoading={get(taskListReducer, ['isDataLoading'], false)}
              isRowClickable
              onRowClick={(id) => onRowClickHandler(id, currentPageName)}
              onSortClick={onSortHandler}
              scrollType={TableScrollType.BODY_SCROLL}
              hasMore={get(taskListReducer, ['hasMore'], false)}
              onLoadMore={onLoadMoreTaskList}
              loaderRowCount={4}
              widthVariant={TableColumnWidthVariant.CUSTOM}
              colorScheme={colorScheme}
            />
          );
    } else {
        return (
            <TableWithPagination
                tableClassName={styles.Table}
                header={getTaskListHeaderBasedOnType(
                  taskListType,
                  dynamicColumnKeys,
                  filter?.type,
                  filter?.sort_by,
                  activeSortField,
                )}
                data={getTaskListBodyBasedOnType(
                  taskListType,
                  taskListReducer?.activeTaskList || [],
                  dynamicColumnKeys,
                  filter?.type,
                  showCreateTask,
                  t,
                )}
                subContainerClassName={get(taskListReducer, ['totalCount'], 0) < 5 && styles.TablePopperHeight}
                isLoading={get(taskListReducer, ['isDataLoading'], false)}
                isRowClickable
                onRowClick={(id) => onRowClickHandler(id, currentPageName)}
                onSortClick={onSortHandler}
                widthVariant={TableColumnWidthVariant.CUSTOM}
                colorScheme={colorScheme}
                paginationClassName={(get(taskListReducer, ['totalCount'], 0) < allowedRowsPerPage) && gClasses.DisplayNone}
                paginationProps={{
                    totalItemsCount: get(taskListReducer, ['totalCount'], 0),
                    itemsCountPerPage: filter?.size || TABLE_ROW_COUNT.PAGINATED,
                    activePage: get(taskListReducer, ['paginationDetail', 'page'], 1),
                    constructItemsCountMessage: (itemStart, itemEnd, totalCount) =>
                        `${LABEL.SHOWING} ${itemStart} - ${itemEnd} ${LABEL.OF} ${totalCount}`,
                    prevAndNextButtonContentVariant: ButtonContentVaraint.icon,
                    prevAndNextButtonPlacement: PaginationButtonPlacement.connected,
                    shape: BorderRadiusVariant.square,
                    onChange: (_event, page) => onPageChange(page),
                    totalBoxes: isMobileView ? 3 : 7,
                    breakPoint: isMobileView ? 1 : 4,
                }}
            />
        );
    }
  };

  const isDisplayFilterEmpty = selectedFilterCount <= 0;

  return (
    <div ref={overallContainer}>
      {
        (!hideFilterAndSearchBar) && (
            <div
            className={cx(BS.P_RELATIVE, styles.FilterAndSearch)}
            ref={filterPopOverTargetRef}
            >
            <div className={cx(styles.ResultsCount)}>
              {
                  (get(taskListReducer, ['isDataLoading'], false)) ?
                  (<Skeleton height={20} width={160} />) :
                  (<Title
                    content={`${LABEL.SHOWING} ${taskListReducer?.totalCount || 0} ${
                        LABEL.TASKS
                    }`}
                    size={ETitleSize.xs}
                    headingLevel={ETitleHeadingLevel.h5}
                  />)}
            </div>
            <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, styles.TaskActions)}>
                {/* Search */}
                <div>
                {(isSearchFocus || !isEmpty(filter?.search)) ? (
                    <div>
                    <Input
                        content={filter?.search || EMPTY_STRING}
                        prefixIcon={getSearchIcon()}
                        onChange={onSearchHandler}
                        iconPosition={EInputIconPlacement.left}
                        className={styles.Search}
                        placeholder={LABEL.SEARCH}
                        size="md"
                        borderRadiusType={BorderRadiusVariant.rounded}
                    />
                    </div>
                ) : (
                    getSearchIcon()
                )}
                </div>
                {/* line */}
                <div className={styles.Line} />
                {/* Show By */}
                {taskListType === TASK_LIST_TYPE.ASSIGNED_TO_OTHERS && (
                <div className={styles.ShowBy}>
                    <Text
                    content={LABEL.SHOW_BY}
                    size={ETextSize.SM}
                    className={styles.ShowByText}
                    />
                    <SingleDropdown
                    optionList={SHOW_BY.OPTIONS}
                    dropdownViewProps={{
                        className: styles.ShowByField,
                        variant: Variant.borderLess,
                        colorScheme: colorScheme,
                        colorVariant: ColorVariant.fill,
                    }}
                    selectedValue={filter.type}
                    className={cx(gClasses.WhiteSpaceNoWrap, gClasses.Scale09, styles.FilterPopper)}
                    onClick={onAssigneToOtherTypeChange}
                    getClassName={(isPopperVisible) => {
                         if (isPopperVisible) return gClasses.ZIndex8;
                         return EMPTY_STRING;
                    }}
                    />
                </div>
                )}
                {/* Filter */}
                <div>
                <button
                  className={
                    cx(
                      styles.FilterIcon,
                      !isDisplayFilterEmpty && styles.FilterIconWithCount,
                    )
                  }
                  onClick={() => setFilterPopOverVisibility((prev) => !prev)}
                >
                  <FilterIcon />
                  {!isDisplayFilterEmpty && (
                    <Chip
                      size={EChipSize.md}
                      textColor={colorScheme?.activeColor}
                      text={`0${selectedFilterCount}`}
                      borderRadiusType={BorderRadiusVariant.circle}
                      className={gClasses.WhiteSpaceNoWrap}
                    />
                  )}
                </button>
                <div className={cx(styles.TaskFilters)}>
                  {getFilterPopperContent()}
                </div>
                </div>
                {/* Refresh */}
                <div>
                <button
                    className={styles.FilterIcon}
                    onClick={() => onPageChange(1)}
                >
                    <RefreshIconApp />
                </button>
                </div>
            </div>
            </div>
        )
      }
      <div
        id={TASK_LIST_INFINITE_SCROLL_ID}
        className={cx(
          tableType === TASK_TABLE_TYPE.INFINITE_SCROLL && styles.TableInfiniteScrollContainer,
          hideScroll && gClasses.OverflowHiddenImportant,
        )}
        ref={tasksRef}
      >
        {getTable()}
      </div>
    </div>
  );
}

export default Tasks;
