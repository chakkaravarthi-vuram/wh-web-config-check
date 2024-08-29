import React, { useEffect, useRef, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { getFormattedDateFromUTC } from 'utils/dateUtils';
import { EMPTY_STRING, FLOW_SHORTCUT, SHORTCUT_FILTER_DATE } from 'utils/strings/CommonStrings';
import SearchBar from 'components/form_components/search_bar/SearchBar';
import { FLOW_DASHBOARD } from 'urls/RouteConstants';
import jsUtility, { isEmpty } from 'utils/jsUtility';
import FilterIcon from 'assets/icons/FilterIcon';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import AutoPositioningPopper, {
  POPPER_PLACEMENTS,
} from 'components/auto_positioning_popper/AutoPositioningPopper';
import {
  keydownOrKeypessEnterHandle,
  useClickOutsideDetector,
} from 'utils/UtilityFunctions';
import ChevronIcon from 'assets/icons/ChevronIcon';
import SearchShortcutIcon from 'assets/icons/SearchShortcutIcon';
import CloseIconNewSmall from 'assets/icons/CloseIconNewSmall';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { BorderRadiusVariant, ButtonContentVaraint, PaginationButtonPlacement, TableWithPagination, TableSortOrder } from '@workhall-pvt-lmt/wh-ui-library';
import {
  ACCESS_DENIED_STRINGS,
  SHORTCUT_FILTER_KEYS,
  SHORTCUT_STRINGS,
  TRIGGER_TYPES_LABELS,
  getCurrentStatusDisplay,
  headers,
  tableHeader,
} from './ShortCut.strings';
import styles from './ShortCuts.module.scss';
import ShortcutFilterByDate from './shortcut_date_filter/ShortcutFilterByDate';
import { dateFilterValidation, getDateFilterLabel } from './Shortcut.utils';
import { isBasicUserMode, getRouteLink } from '../../../../../utils/UtilityFunctions';
import { TAB_ROUTE } from '../../../../application/app_components/dashboard/flow/Flow.strings';
import ResponseHandler from '../../../../../components/response_handlers/ResponseHandler';
import { RESPONSE_TYPE, ROWS_PER_PAGE_VALUE, SORT_BY } from '../../../../../utils/Constants';
import { getAllShortcutUsersApiThunk, getFlowShortCutsApiThunk, getAllTriggerNamesThunk } from '../../../../../redux/actions/IndividualEntry.Action';
import { systemActionChanges } from '../../../../../redux/reducer/IndividualEntryReducer';
import { INDIVIDUAL_ENTRY_MODE } from '../../IndividualEntry.strings';
import { NA } from '../../../../../utils/strings/CommonStrings';
import { getUserDisplayGroup } from '../../../../application/app_components/task_listing/TaskListing.utils';

const SIZE = 5;

function ShortCuts(props) {
  const { t } = useTranslation();
  const {
    getShortCutListData,
    shortcutsList,
    totalShortcutsCount,
    shortcutSearchValue,
    onSystemActionChanges,
    isShortcutsLoading,
    getAllShortcutUsers,
    systemActionTrigger,
    startDate,
    endDate,
    filterDateOperator,
    shortcutFilterErrors,
    allShortcutFilters,
    selectedShortcutUsers,
    appliedFilterCount,
    innerFilterCount,
    selectedShortcutNames,
    parentParams,
    triggerFlowNames = [],
    isTriggerDetailsLoading,
    isDatalist,
    filterStartDate = EMPTY_STRING,
    filterEndDate = EMPTY_STRING,
    initialDateOperator,
    getShortcutNameDetails,
    instanceSummaryError,
    mode,
  } = props;

  const history = useHistory();
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
  const {
    shortcutUserDetails,
    isShortcutsUsersLoading,
    hasMore,
    // shortcutUserPaginationDetails,
    // shortcutUserTotalCount,
  } = systemActionTrigger;
  const {
    DATE,
  } = SHORTCUT_STRINGS(t);
  const filterDataRef = useRef({});
  const [taskPaginationParams, setTaskPaginationParams] = useState({
    page: 1,
    size: SIZE,
    sort_by: EMPTY_STRING,
    sort_field: EMPTY_STRING,
  });
  const [filterPopperRef, setFilterPopperRef] = useState(null);
  const [createdonPopperRef, setCreatedonPopperRef] = useState(null);
  const [isFilterOpen, setisFilterOpen] = useState(false);
  const [isDatePopperOpen, setDatePopperOpen] = useState(false);
  const [searchText, setSearchText] = useState(EMPTY_STRING);

  const closeFilter = () => {
    setisFilterOpen(false);
    onSystemActionChanges({
      ...filterDataRef.current,
    });
  };

  useClickOutsideDetector(setFilterPopperRef, () => closeFilter());
  const dateValidation = () => {
    const selectedOperator = jsUtility.cloneDeep(filterDateOperator);
    const clonedFilterErrors = jsUtility.cloneDeep(shortcutFilterErrors);

      const {
        startDateError = EMPTY_STRING,
        endDateError = EMPTY_STRING,
      } = dateFilterValidation(
        startDate,
        endDate,
        selectedOperator,
        t,
      );
      clonedFilterErrors.startDateError = startDateError;
      clonedFilterErrors.endDateError = endDateError;
      onSystemActionChanges({ shortcutFilterErrors: clonedFilterErrors });
      return {
        startDateError,
        endDateError,
      };
  };

  const closeDatePopper = () => {
    const initialData = {
      startDate: filterStartDate,
      endDate: filterEndDate,
    };
    const dateFilterErrors = {
      startDateError: EMPTY_STRING,
      endDateError: EMPTY_STRING,
    };
    onSystemActionChanges({
      shortcutFilterDateOperator: initialDateOperator,
      shortcutDateFilterData: initialData,
      shortcutFilterErrors: dateFilterErrors,
    });
    setDatePopperOpen(false);
  };

  const getDateFilters = (startDate, endDate, selectedOperator) => {
    if (!jsUtility.isEmpty(endDate)) {
      const dateFilters = [];
      const formattedStartDate = getFormattedDateFromUTC(startDate, SHORTCUT_FILTER_DATE);
      const formattedEndDate = getFormattedDateFromUTC(endDate, SHORTCUT_FILTER_DATE);
      const dateFilterLabel = getDateFilterLabel(formattedStartDate, formattedEndDate, selectedOperator, t);

      const filterData = {
        label: dateFilterLabel,
        value: dateFilterLabel,
        displayKey: SHORTCUT_FILTER_KEYS.CREATED_ON,
      };
      dateFilters.push(filterData);
      return filterData;
    }
    return null;
  };

  const onApplyDateFilter = () => {
    const {
      startDateError = EMPTY_STRING,
      endDateError = EMPTY_STRING,
    } = dateValidation();

    if (isEmpty(startDateError) && isEmpty(endDateError)) {
      const clonedFilters = jsUtility.cloneDeep(allShortcutFilters);

      const appliedDateFilters = getDateFilters(startDate, endDate, filterDateOperator);
      const dateIndex = clonedFilters.findIndex((obj) => obj.displayKey === SHORTCUT_FILTER_KEYS.CREATED_ON);
      if (dateIndex > -1) {
        clonedFilters[dateIndex] = appliedDateFilters;
      } else {
        clonedFilters.push(appliedDateFilters);
      }

      setDatePopperOpen(false);
      onSystemActionChanges({
        filterStartDate: startDate,
        filterEndDate: endDate,
        initialDateOperator: filterDateOperator,
        allShortcutFilters: clonedFilters,
        innerFilterCount: clonedFilters.length,
      });
    }
  };

  useClickOutsideDetector(setCreatedonPopperRef, () => closeDatePopper());
  useEffect(() => {
    if (
      [
        INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE,
        INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE,
      ].includes(mode)
    ) {
    const params = {
      ...parentParams,
      size: SIZE,
      page: 1,
    };
    const userparams = {
      page: 1,
      size: 5,
      is_active: 1,
      is_last_signin: 1,
    };
    const { data_list_uuid, flow_uuid, data_list_entry_id, instance_id } = parentParams;
    const shortcutNamesParams = {
      ...(isDatalist
        ? { data_list_entry_id, data_list_uuid }
        : { instance_id, flow_uuid }),
    };
    getShortCutListData(params);
    getAllShortcutUsers(userparams);
    getShortcutNameDetails(shortcutNamesParams, isDatalist);
  }
    return () => {
      onSystemActionChanges({ shortcutSearchValue: EMPTY_STRING,
        shortcutsList: [],
        selectedShortcutUsers: [],
        selectedShortcutNames: [],
        shortcutDateFilterData: EMPTY_STRING,
        filterStartDate: EMPTY_STRING,
        filterEndDate: EMPTY_STRING,
        allShortcutFilters: [],
        appliedFilterCount: 0,
        innerFilterCount: 0,
      });
    };
  }, []);

  const onSortBasedOnColumn = (sortField, sortOrder) => {
    const _sortOrder = (sortOrder === TableSortOrder.ASC) ? SORT_BY.DESC : SORT_BY.ASC;
    const params = {
      ...parentParams,
      size: SIZE,
      page: taskPaginationParams.page,
      sort_field: sortField,
      sort_by: _sortOrder,
    };
    setTaskPaginationParams({
      page: taskPaginationParams.page,
      size: SIZE,
      sort_field: sortField,
      sort_by: _sortOrder,
    });
    getShortCutListData(params);
  };

  const getAllUsersList = () => {
    const valideUserLists = shortcutUserDetails.filter((item) => item.full_name !== '' && item.full_name !== null && typeof item.full_name !== 'undefined');
    const userDetailsArray = valideUserLists.map((eachUser) => {
      return {
          label: eachUser?.full_name,
          value: eachUser?._id,
          displayKey: SHORTCUT_FILTER_KEYS.CREATED_BY,
        };
    });
    return userDetailsArray;
  };

  const loadShortcutUsers = () => {
    const userparams = {
      page: Math.floor(shortcutUserDetails.length / 5) + 1,
      size: 5,
      is_active: 1,
      is_last_signin: 1,
      };
      if (!isEmpty(searchText)) userparams.search = searchText;
      getAllShortcutUsers(userparams);
  };

  const getAllShortcutName = () => {
    const shortcutNameDetailsArray = triggerFlowNames?.map((triggerDetail) => {
          return {
          label: triggerDetail,
          value: triggerDetail,
          displayKey: SHORTCUT_FILTER_KEYS.SHORTCUT_NAME,
          };
    });
    return shortcutNameDetailsArray;
  };

  const allUsers = getAllUsersList();
  const allShortcuts = getAllShortcutName();

  const handleShortcutNameChange = (event) => {
    const { value, label, displayKey } = event.target;
    const currentShortcutList = jsUtility.cloneDeep(selectedShortcutNames);
    let clonedFilters = jsUtility.cloneDeep(allShortcutFilters);

      if (!currentShortcutList?.includes(value)) {
        currentShortcutList.push(value);
        const currentShortcut = {
          label,
          value,
          displayKey,
        };
        clonedFilters.push(currentShortcut);
      } else {
        currentShortcutList.splice(currentShortcutList.indexOf(value), 1);
        clonedFilters = clonedFilters?.filter((eachFilter) => eachFilter.value !== value);
      }

      onSystemActionChanges({
        allShortcutFilters: clonedFilters,
        selectedShortcutNames: currentShortcutList,
        innerFilterCount: clonedFilters.length,
      });
  };

  const onUserSearchHandler = (searchText) => {
    const searchValue = searchText;
    const userparams = {
      page: 1,
      size: 5,
      is_active: 1,
      is_last_signin: 1,
    };
    if (!isEmpty(searchValue)) userparams.search = searchValue;
    setSearchText(searchValue);
    getAllShortcutUsers(userparams);
  };

  const handleUserListChange = (event) => {
    const { value, label, displayKey } = event.target;
    const currentUsersList = jsUtility.cloneDeep(selectedShortcutUsers);
    let clonedFilters = jsUtility.cloneDeep(allShortcutFilters);
      if (!currentUsersList?.includes(value)) {
        currentUsersList.push(value);
        const currentUser = {
          label,
          value,
          displayKey,
        };
        clonedFilters.push(currentUser);
      } else {
        currentUsersList.splice(currentUsersList.indexOf(value), 1);

        clonedFilters = clonedFilters?.filter((eachFilter) => eachFilter.value !== value); // same for on close filterClick
      }
      onSystemActionChanges({
        selectedShortcutUsers: currentUsersList,
        allShortcutFilters: clonedFilters,
        innerFilterCount: clonedFilters.length,
      });
  };

  const onApplyFilter = () => {
    const params = {
      ...parentParams,
      size: SIZE,
      page: 1,
    };
    if (!jsUtility.isEmpty(selectedShortcutUsers)) params.created_by = selectedShortcutUsers;
    if (!jsUtility.isEmpty(selectedShortcutNames)) params.flow_names = selectedShortcutNames;
    if (!jsUtility.isEmpty(startDate) && (filterDateOperator !== DATE.BEFORE.TYPE)) params.start_date = startDate;
    if (!jsUtility.isEmpty(endDate)) params.end_date = endDate;
    setTaskPaginationParams({ ...taskPaginationParams, page: 1 });
    setisFilterOpen(false);
    getShortCutListData(params);
    onSystemActionChanges({
      appliedFilterCount: innerFilterCount,
    });
  };

  const ShortcutNameSearchhandler = (value) => {
    const searchValue = value;
    const { data_list_uuid, flow_uuid, data_list_entry_id, instance_id } = parentParams;
    const params = {
      ...(isDatalist
        ? { data_list_entry_id, data_list_uuid }
        : { instance_id, flow_uuid }),
    };
    if (!isEmpty(searchValue)) params.search = searchValue;
    getShortcutNameDetails(params, isDatalist);
  };

  const onFilterCloseClick = (key, value) => {
    let clonedFilters = jsUtility.cloneDeep(allShortcutFilters);

    switch (key) {
      case SHORTCUT_FILTER_KEYS.SHORTCUT_NAME:
        const clonedShortcutList = jsUtility.cloneDeep(selectedShortcutNames);
        clonedShortcutList.splice(clonedShortcutList.indexOf(value), 1);
        clonedFilters = clonedFilters?.filter((eachFilter) => eachFilter.value !== value);

        onSystemActionChanges({
          selectedShortcutNames: clonedShortcutList,
          allShortcutFilters: clonedFilters,
          innerFilterCount: clonedFilters.length,
        });
        break;

      case SHORTCUT_FILTER_KEYS.CREATED_BY:
        const clonedUsersList = jsUtility.cloneDeep(selectedShortcutUsers);
        clonedUsersList.splice(clonedUsersList.indexOf(value), 1);
        clonedFilters = clonedFilters?.filter((eachFilter) => eachFilter.value !== value);

        onSystemActionChanges({
          selectedShortcutUsers: clonedUsersList,
          allShortcutFilters: clonedFilters,
          innerFilterCount: clonedFilters.length,
        });
        break;

      case SHORTCUT_FILTER_KEYS.CREATED_ON:
        const clearDateFilter = {
          startDate: EMPTY_STRING,
          endDate: EMPTY_STRING,
        };
        clonedFilters = clonedFilters?.filter((eachFilter) => eachFilter.displayKey !== SHORTCUT_FILTER_KEYS.CREATED_ON);
        onSystemActionChanges({
          shortcutDateFilterData: clearDateFilter,
          filterStartDate: clearDateFilter.startDate,
          filterEndDate: clearDateFilter.endDate,
          allShortcutFilters: clonedFilters,
          innerFilterCount: clonedFilters.length,
        });
        break;
      default: break;
    }
  };

  const appliedFilters = allShortcutFilters?.map((eachFilter) => (
      <div
        key={eachFilter.value}
        className={cx(
          gClasses.CenterVH,
          gClasses.MR10,
          gClasses.MB5,
          styles.UserTag,
        )}
      >
        <div className={cx(styles.UserName, gClasses.Ellipsis)}>
          {eachFilter?.label}
        </div>
        <div
          className={cx(BS.D_FLEX, gClasses.ML5)}
          role="button"
          tabIndex={0}
          onClick={() => onFilterCloseClick(eachFilter.displayKey, eachFilter.value)}
          onKeyDown={(e) => { keydownOrKeypessEnterHandle(e) && onFilterCloseClick(eachFilter.displayKey, eachFilter.value); }}
        >
          <CloseIconNewSmall className={cx(styles.CloseIcon, gClasses.CursorPointer)} onClick={(e) => onFilterCloseClick(e, eachFilter.displayKey)} />
        </div>
      </div>
    ),
  );

  const onSearchHandler = (value) => {
    if (
      [
        INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE,
        INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE,
      ].includes(mode)
    ) {
    const searchValue = value;
    const params = {
      ...parentParams,
      size: taskPaginationParams.size,
      page: 1,
    };
    if (!isEmpty(searchValue)) params.search = searchValue;
    if (isEmpty(taskPaginationParams.sort_field)) {
      delete params.sort_field;
      delete params.sort_by;
    }
    getShortCutListData(params);
    setTaskPaginationParams({ ...taskPaginationParams, page: 1 });
    onSystemActionChanges({ shortcutSearchValue: searchValue });
  }
  };

  const ddlRowOnChangeHandler = (selectedTableRowCount) => {
    if (selectedTableRowCount !== taskPaginationParams.size) {
      setTaskPaginationParams({
        ...taskPaginationParams,
        page: 1,
        size: selectedTableRowCount,
      });
      const taskDetailsParams = {
        ...taskPaginationParams,
        size: selectedTableRowCount,
        page: 1,
        ...parentParams,
      };
      if (isEmpty(taskPaginationParams.sort_field)) {
        delete taskDetailsParams.sort_field;
        delete taskDetailsParams.sort_by;
      }
      getShortCutListData(taskDetailsParams);
    }
  };

  const handlePageChange = (selectedPage) => {
    if (selectedPage !== taskPaginationParams.page) {
      const params = {
        ...taskPaginationParams,
        ...parentParams,
      };
      params.page = selectedPage;
      if (!isEmpty(shortcutSearchValue)) params.search = shortcutSearchValue;
      if (!jsUtility.isEmpty(selectedShortcutUsers)) params.created_by = selectedShortcutUsers;
      if (!jsUtility.isEmpty(selectedShortcutNames)) params.flow_names = selectedShortcutNames;
      if (!jsUtility.isEmpty(startDate) && (filterDateOperator !== DATE.BEFORE.TYPE)) params.start_date = startDate;
      if (!jsUtility.isEmpty(endDate)) params.end_date = endDate;
      if (isEmpty(taskPaginationParams.sort_field)) {
        delete params.sort_field;
        delete params.sort_by;
      }
      getShortCutListData(params);
      setTaskPaginationParams({ ...taskPaginationParams, page: selectedPage });
    }
  };

  const getTableDataTemplate = (data) => (
    <div
      className={cx(
        BS.D_FLEX,
        BS.FLEX_COLUMN,
        data.className,
        styles.TableData,
      )}
    >
      <div
        className={cx(gClasses.Ellipsis)}
        title={data.display_key || data.value}
      >
        {data.value}
      </div>
    </div>
  );

  const getTableRows = () => {
    const isBasicMode = isBasicUserMode(history);
    const rows = [];
    shortcutsList?.forEach((subFlow) => {
      const rowData = { component: [], id: subFlow?._id };

      const navLink = (isBasicMode) ? (
        `${FLOW_DASHBOARD}/${subFlow.flow_uuid}/${TAB_ROUTE.ALL_REQUEST}/${subFlow._id}`
      ) : (
        `${FLOW_DASHBOARD}/${subFlow.flow_uuid}/${subFlow._id}`
      );

      const subFlowRequestId = (
        <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, styles.TableData)}>
          <div className={cx(gClasses.Ellipsis)} title={subFlow.system_identifier}>
            <a
              href={getRouteLink(navLink, history)}
              target="_blank"
              rel="noreferrer"
            >
              {subFlow.system_identifier}
            </a>
          </div>
        </div>
      );

      const user = getUserDisplayGroup({ users: [subFlow.users] }, showCreateTask);

      const initiatedOn = getFormattedDateFromUTC(subFlow.initiated_on.pref_datetime_display, FLOW_SHORTCUT) || NA;

      const shortcutStatus = getTableDataTemplate({
        value: (
          <div
            className={
              subFlow.status === 'completed'
                ? cx(
                    styles.outerContainerCompleted,
                    BS.D_FLEX,
                    BS.ALIGN_ITEM_CENTER,
                  )
                : subFlow.status === 'cancelled'
                ? cx(
                    BS.D_FLEX,
                    BS.ALIGN_ITEM_CENTER,
                    styles.outerContainerCancelled,
                  )
                : cx(
                    BS.D_FLEX,
                    BS.ALIGN_ITEM_CENTER,
                    styles.outerContainerInProgress,
                  )
            }
            title={subFlow.status}
          >
            <div
              className={
                subFlow.status === 'completed'
                  ? cx(styles.CircleSuccess, BS.D_FLEX, BS.ALIGN_ITEM_CENTER)
                  : subFlow.status === 'cancelled'
                  ? cx(styles.CircleCancel, BS.D_FLEX, BS.ALIGN_ITEM_CENTER)
                  : cx(styles.CircleInProgress, BS.D_FLEX, BS.ALIGN_ITEM_CENTER)
              }
            >
              <div
                className={
                  subFlow.status === 'completed'
                    ? cx(styles.SuccessText)
                    : subFlow.status === 'cancelled'
                    ? cx(styles.CancelText)
                    : cx(styles.InprogressText)
                }
              >
                {getCurrentStatusDisplay(subFlow.status, t)}
              </div>
            </div>
          </div>
        ),
        display_key: subFlow.status,
      });

      rowData.component = [
        subFlowRequestId,
        subFlow.flow_name || NA,
        TRIGGER_TYPES_LABELS[subFlow.trigger_action],
        user || subFlow.users?.first_name || NA,
        initiatedOn,
        shortcutStatus,
      ];
      rows.push(rowData);
    });

    if (isEmpty(rows)) {
      rows.push({
        component: [t('error_popover_status.no_data_found'), ...Array(5).fill(EMPTY_STRING)],
        id: 'no-data',
      });
    }

    return rows;
  };

  const onFilterClick = () => {
    if (
      [
        INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE,
        INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE,
      ].includes(mode)
    ) {
    setisFilterOpen(true);
    const clearDateFilter = { startDate, endDate };
    filterDataRef.current = {
      selectedShortcutUsers,
      selectedShortcutNames,
      shortcutDateFilterData: clearDateFilter,
      filterStartDate: clearDateFilter.startDate,
      filterEndDate: clearDateFilter.endDate,
      filterDateOperator,
      allShortcutFilters,
    };
    }
  };

  const onCreatedOnClick = () => setDatePopperOpen(true);

  const createdOnPopper = (
    <AutoPositioningPopper
      placement={POPPER_PLACEMENTS.BOTTOM_END}
      fallbackPlacements={POPPER_PLACEMENTS.TOP_END}
      isPopperOpen={isDatePopperOpen}
      referenceElement={createdonPopperRef}
      className={cx(gClasses.ZIndex151, styles.CreatedOnPopper)}
      onBlur={closeDatePopper}
      enableOnBlur
    >
      <ShortcutFilterByDate
        shortcutDateFilterData={{
          startDate,
          endDate,
        }}
        filterDateOperator={filterDateOperator}
        shortcutFilterErrors={shortcutFilterErrors}
        onFlowDashboardDataChange={onSystemActionChanges}
        onApplyClick={onApplyDateFilter}
      />
    </AutoPositioningPopper>
  );

  const onClearAllFilters = () => {
    const clearDateFilter = {
      startDate: EMPTY_STRING,
      endDate: EMPTY_STRING,
    };
    onSystemActionChanges({
      selectedShortcutUsers: [],
      selectedShortcutNames: [],
      shortcutDateFilterData: clearDateFilter,
      filterStartDate: clearDateFilter.startDate,
      filterEndDate: clearDateFilter.endDate,
      allShortcutFilters: [],
      innerFilterCount: 0,
    });
  };

  const shortcutFilter = (
    <div className={styles.FilterComponent}>
      <div
        className={cx(
          styles.FilterContainer,
          styles.Text,
          BS.D_FLEX,
          BS.JC_START,
        )}
      >
        {SHORTCUT_STRINGS(t).FILTER_STRINGS.FILTER}
      </div>
      <hr className={styles.HorizontalLine} />
      <div className={cx(styles.FilterContent)}>
        {appliedFilters.length > 0 &&
          <div className={cx(styles.AppliedUsersContainer, BS.D_FLEX)}>
            {appliedFilters}
          </div>
        }
        <div className={cx(BS.D_FLEX, styles.DropdownShortcut)}>
          <Dropdown
            hideLabel
            placeholder={SHORTCUT_STRINGS(t).FILTER_STRINGS.SHORTCUT_NAME}
            optionList={allShortcuts}
            selectedValue={selectedShortcutNames}
            className={cx(styles.DropdownContainer)}
            customDisplay={
            <div className={cx(gClasses.FTwo13GrayV3, BS.D_FLEX)}>
              {SHORTCUT_STRINGS(t).FILTER_STRINGS.SHORTCUT_NAME}
            <div>
              <ChevronIcon className={cx(gClasses.Rotate180, styles.ChevronIcon, gClasses.ML30)} />
            </div>
            </div>
          }
            onChange={handleShortcutNameChange}
            loadingOptionList={isTriggerDetailsLoading}
            hideOptionInput
            showNoDataFoundOption
            strictlySetSelectedValue
            setSelectedValue
            enableSearch
            onSearchInputChange={(searchText) => ShortcutNameSearchhandler(searchText)}
            hideDropdownListLabel
            isRequired
            disableFocusFilter
            isMultiSelect
            disableClass={styles.DropdownText}
            dropdownArrowIcon={
              <ChevronIcon
                className={cx(gClasses.Rotate180, styles.ChevronIcon)}
              />
            }
            searchInputIcon={<SearchShortcutIcon />}
            inputContainerShortcutStyle={styles.BorderNone}
            InputContainerClassName={cx(gClasses.Padding0, styles.BorderBottom)}
            optionListClassName={styles.NoBorderBottom}
            inputTextContainerStyle={styles.TextPlaceholder}
            checkboxViewClassName={styles.OptionListContainer}
          />
          <Dropdown
            hideLabel
            optionList={allUsers}
            placeholder={SHORTCUT_STRINGS(t).FILTER_STRINGS.CREATED_BY}
            customDisplay={
            <div className={cx(gClasses.FTwo13GrayV3, BS.D_FLEX)}>
              {SHORTCUT_STRINGS(t).FILTER_STRINGS.CREATED_BY}
              <div>
                <ChevronIcon className={cx(gClasses.Rotate180, styles.ChevronIcon, gClasses.ML40)} />
              </div>
            </div>}
            selectedValue={selectedShortcutUsers}
            className={cx(styles.DropdownContainer)}
            onChange={handleUserListChange}
            onSearchInputChange={(searchText) => onUserSearchHandler(searchText)}
            showNoDataFoundOption
            strictlySetSelectedValue
            hideOptionInput
            setSelectedValue
            enableSearch
            isPaginated
            hasMore={hasMore}
            loadDataHandler={loadShortcutUsers}
            hideDropdownListLabel
            isRequired
            disableFocusFilter
            isMultiSelect
            disableClass={styles.DropdownText}
            dropdownArrowIcon={
              <ChevronIcon
                className={cx(gClasses.Rotate180, styles.ChevronIcon)}
              />
            }
            searchInputIcon={<SearchShortcutIcon />}
            inputContainerShortcutStyle={styles.BorderNone}
            InputContainerClassName={cx(gClasses.Padding0, styles.BorderBottom)}
            optionListClassName={styles.NoBorderBottom}
            inputTextContainerStyle={styles.TextPlaceholder}
            // isDataLoading={isShortcutsUsersLoading}
            loadingOptionList={isShortcutsUsersLoading}
          />
          <div
            className={cx(
              BS.D_FLEX,
              BS.ALIGN_ITEM_CENTER,
              BS.JC_CENTER,
              styles.CreatedOnContainer,
              gClasses.ClickableElementV3,
              gClasses.CursorPointer,
            )}
            ref={setCreatedonPopperRef}
            onClick={onCreatedOnClick}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCreatedOnClick}
            role="button"
            tabIndex={0}
          >
            <div className={cx(styles.DropdownText, styles.CreatedOnText)}>
              {SHORTCUT_STRINGS(t).FILTER_STRINGS.CREATED_ON}
            </div>
            <div>
              <ChevronIcon
                className={cx(gClasses.Rotate180, styles.ChevronIcon)}
              />
            </div>
          </div>
          {createdOnPopper}
        </div>
        <div
          className={cx(
            BS.D_FLEX,
            BS.JC_END,
            gClasses.MT15,
            gClasses.MR5,
          )}
        >
          <Button buttonType={BUTTON_TYPE.LIGHT} className={styles.ClearAll} onClick={onClearAllFilters}>
            {SHORTCUT_STRINGS(t).BUTTONS.CLEAR}
          </Button>
          <Button
            buttonType={BUTTON_TYPE.PRIMARY}
            className={styles.Apply}
            onClick={onApplyFilter}
          >
            {SHORTCUT_STRINGS(t).BUTTONS.APPLY}
          </Button>
        </div>
      </div>
    </div>
  );
  const shortcutFilterPopper = (
    <AutoPositioningPopper
      placement={POPPER_PLACEMENTS.BOTTOM}
      fallbackPlacements={POPPER_PLACEMENTS.TOP}
      isPopperOpen={isFilterOpen}
      referenceElement={filterPopperRef}
      className={gClasses.ZIndex151}
      onBlur={closeFilter}
      enableOnBlur
    >
      {shortcutFilter}
    </AutoPositioningPopper>
  );

  if (instanceSummaryError) {
    return (
      <ResponseHandler
        className={gClasses.MT90}
        messageObject={{
          type: RESPONSE_TYPE.SERVER_ERROR,
          title: ACCESS_DENIED_STRINGS(t).TITLE,
          subTitle: ACCESS_DENIED_STRINGS(t).SUB_TITLE,
        }}
      />
    );
  }

  return (
    <div>
      <div className={cx(BS.D_FLEX, BS.JC_END)}>
        <div className={styles.SearchContainer}>
          <SearchBar
            placeholder={SHORTCUT_STRINGS(t).SEARCH_PLACEHOLDER}
            className={cx(
              styles.SearchBar,
              styles.SearchContainer,
              gClasses.MR10,
            )}
            value={shortcutSearchValue}
            onChange={onSearchHandler}
          />
        </div>
        <div className={cx(BS.D_FLEX_JUSTIFY_END)}>
          <div
            className={cx(
              BS.D_FLEX,
              BS.ALIGN_ITEM_CENTER,
              BS.JC_CENTER,
              styles.Filter,
              gClasses.ClickableElementV3,
              gClasses.CursorPointer,
            )}
            ref={setFilterPopperRef}
            onClick={onFilterClick}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onFilterClick}
            role="button"
            tabIndex={0}
          >
            <FilterIcon className={styles.FilterIcon} />
            {appliedFilterCount > 0 && (
              <div className={cx(gClasses.centerVH, styles.FilterCount)}>
                {String(appliedFilterCount).padStart(2, '0')}
              </div>
            )}
          </div>
          {shortcutFilterPopper}
        </div>
      </div>
      <TableWithPagination
        id="sub-flows-table"
        header={tableHeader(headers, taskPaginationParams, t)}
        headerClass={cx(gClasses.FTwo12BlackV21, gClasses.FontWeight500)}
        data={getTableRows()}
        isLoading={isShortcutsLoading}
        onSortClick={onSortBasedOnColumn}
        paginationProps={{
          totalItemsCount: totalShortcutsCount,
          itemsCountPerPage: taskPaginationParams.size,
          activePage: taskPaginationParams.page,
          constructItemsCountMessage: (itemStart, itemEnd, totalCount) =>
            `Showing ${itemStart} - ${itemEnd} of ${totalCount}`,
          prevAndNextButtonContentVariant: ButtonContentVaraint.icon,
          prevAndNextButtonPlacement: PaginationButtonPlacement.connected,
          shape: BorderRadiusVariant.square,
          onChange: (_event, page) => handlePageChange(page),
          hasRowsPerPage: true,
          rowsPerPageSelectedValue: taskPaginationParams.size,
          rowsPerPageOptionList: ROWS_PER_PAGE_VALUE,
          onHasRowsPerPageClick: ddlRowOnChangeHandler,
        }}
      />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    shortcutsList: state.IndividualEntryReducer.systemActionTrigger.shortcutsList,
    totalShortcutsCount: state.IndividualEntryReducer.systemActionTrigger.totalShortcutsCount,
    shortcutSearchValue: state.IndividualEntryReducer.systemActionTrigger.shortcutSearchValue,
    isShortcutsLoading: state.IndividualEntryReducer.systemActionTrigger.isShortcutsLoading,
    systemActionTrigger: state.IndividualEntryReducer.systemActionTrigger,
    selectedShortcutUsers: state.IndividualEntryReducer.systemActionTrigger.selectedShortcutUsers,
    selectedShortcutNames: state.IndividualEntryReducer.systemActionTrigger.selectedShortcutNames,
    startDate: state.IndividualEntryReducer.systemActionTrigger.shortcutDateFilterData.startDate,
    endDate: state.IndividualEntryReducer.systemActionTrigger.shortcutDateFilterData.endDate,
    filterDateOperator: state.IndividualEntryReducer.systemActionTrigger.shortcutFilterDateOperator,
    shortcutFilterErrors: state.IndividualEntryReducer.systemActionTrigger.shortcutFilterErrors,
    allShortcutFilters: state.IndividualEntryReducer.systemActionTrigger.allShortcutFilters,
    filterStartDate: state.IndividualEntryReducer.systemActionTrigger.filterStartDate,
    filterEndDate: state.IndividualEntryReducer.systemActionTrigger.filterEndDate,
    initialDateOperator: state.IndividualEntryReducer.systemActionTrigger.initialDateOperator,
    // hasMore: state.IndividualEntryReducer.systemActionTrigger.hasMore,
    hasMoreShortcuts: state.IndividualEntryReducer.systemActionTrigger.hasMoreShortcuts,
    appliedFilterCount: state.IndividualEntryReducer.systemActionTrigger.appliedFilterCount,
    innerFilterCount: state.IndividualEntryReducer.systemActionTrigger.innerFilterCount,
    instanceSummaryError: state.IndividualEntryReducer.systemActionTrigger.instanceSummaryError,
    triggerFlowNames: state.IndividualEntryReducer.systemActionTrigger.trigger_shortcut_details,
    isTriggerDetailsLoading: state.IndividualEntryReducer.systemActionTrigger.isTriggerDetailsLoading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getShortCutListData: (params) => {
      dispatch(getFlowShortCutsApiThunk(params));
    },
    onSystemActionChanges: (params) => {
      dispatch(systemActionChanges(params));
    },
    getAllShortcutUsers: (params) => {
      dispatch(getAllShortcutUsersApiThunk(params));
    },
    getShortcutNameDetails: (...params) => {
      dispatch(getAllTriggerNamesThunk(...params), false);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShortCuts);
