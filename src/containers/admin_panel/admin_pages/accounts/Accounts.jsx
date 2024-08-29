import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getFormattedDateFromUTC } from 'utils/dateUtils';
import { isEmpty, cloneDeep } from 'utils/jsUtility';
import { ADMIN_ACCOUNTS_DATE, EMPTY_STRING } from 'utils/strings/CommonStrings';
import { BS } from 'utils/UIConstants';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import CloseIconNew from 'assets/icons/CloseIconNew';
import {
  openOrCloseModal,
  adminAccountDataChange,
  modalAdminAccountDataClear,
  adminAccountClearData,
  changeAdminAccountRowsPerPage,
  adminAccountSearchValueChange,
} from 'redux/reducer/AdminAccountsReducer';
import { isMobileScreen, onWindowResize } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import styles from './Accounts.module.scss';
import TablePagination from '../../../../components/table_pagination/TablePagination';
import gClasses from '../../../../scss/Typography.module.scss';
import ADMIN_ACCOUNT_STRINGS, {
  getTableHeaders,
  getTableDataTemplate,
  getPaymentStatus,
  getAccountType,
  filterInitialState,
  filterIdArray,
  getFilterAccountStatusOptionList,
  getFilterAccountTypeOptionList,
  getFilterPaymentStatusOptionList,
  getNoValuesTable,
} from './Accounts.strings';
import {
  adminAccountDataThunk,
  deleteAdminAccountApiThunk,
} from '../../../../redux/actions/AdminAccounts.Action';
import SearchIcon from '../../../../assets/icons/SearchIcon';
import Input from '../../../../components/form_components/input/Input';
import AddAccounts from './add_accounts/AddAccounts';
import { routeNavigate } from '../../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../../utils/Constants';
import { ACCOUNT_DETAILS } from '../../../../urls/RouteConstants';

let cancelForAllAccounts;

export const getCancelTokenForAllAccounts = (cancelToken) => {
  cancelForAllAccounts = cancelToken;
};

function Accounts(props) {
  const [currentSort, setCurrentSort] = useState({});
  const [currentFilter, setCurrentFilter] = useState(filterInitialState);
  const [tableDataHeight, setTableDataHeight] = useState();
  const [isMobile, setIsMobile] = useState(isMobileScreen());
  const { t } = useTranslation();

  const history = useHistory();
  const { tab } = useParams();
  const {
    getAdminAccountListData,
    adminAccountData,
    adminAccountCurrentPage,
    adminAccountTotalCount,
    isLoading,
    clear,
    isPageLoading,
    rowsCount,
    adminAccountSearchValueChange,
    accountSearchValue,
    adminAccountDataChange,
    accountTableHeaders,
    isTrialDisplayed,
    toggleCloseOpen,
  } = props;

  const adminTableData = adminAccountData;

  const tableRowDatas =
    adminTableData &&
    adminTableData.map((value) => {
      const adminAccountType = getTableDataTemplate({
        value: getAccountType(value.acc_type, t),
      });
      const adminAccountName = getTableDataTemplate({
        value: value.account_name || 'NA',
        className: styles.td100,
      });
      const adminAccountDomain = getTableDataTemplate({
        value: value.account_domain || 'NA',
        className: styles.td100,
      });
      const adminAccountUsers = getTableDataTemplate({
        value: value.user_count || 'NA',
      });
      const adminAccountStatus = getTableDataTemplate({
        value: value.is_active
          ? t(ADMIN_ACCOUNT_STRINGS.ACTIVE)
          : t(ADMIN_ACCOUNT_STRINGS.DE_ACTIVE),
      });
      const adminAccountCreatedOn = getTableDataTemplate({
        value:
          (value.created_on &&
            getFormattedDateFromUTC(value.created_on, ADMIN_ACCOUNTS_DATE)) ||
          'NA',
      });
      const adminAccountPaymentStatus = getTableDataTemplate({
        value: (
          <div
            className={
              value.acc_type &&
              value.acc === ADMIN_ACCOUNT_STRINGS.SUBSCRIPTION &&
              (value.is_paid ? styles.Active : styles.DeActive)
            }
          >
            {getPaymentStatus(value.is_paid, value.acc_type, t)}
          </div>
        ),
      });
      const adminAccountManager = getTableDataTemplate({
        value: value.account_manager || 'NA',
        className: styles.td100,
      });
      const adminAccountCountry = getTableDataTemplate({
        value: value.country || 'NA',
        className: styles.td100,
      });
      return [
        adminAccountType,
        adminAccountName,
        adminAccountDomain,
        adminAccountUsers,
        adminAccountStatus,
        adminAccountCreatedOn,
        adminAccountPaymentStatus,
        adminAccountManager,
        adminAccountCountry,
        value._id,
      ];
    });

  const windowResize = () => {
    setIsMobile(isMobileScreen());
  };

  const onClickUpDownArrow = (apiId, order) => {
    let clonedHeaders = cloneDeep(accountTableHeaders);

    const paginationData = {
      page: 1,
      size: rowsCount,
      sort_by: order,
      sort_field: apiId,
    };

    if (!isEmpty(accountSearchValue)) {
      paginationData.search = accountSearchValue;
    }
    filterIdArray.map((filterValue) => {
      if (currentFilter[filterValue] != null) {
        paginationData[filterValue] = currentFilter[filterValue];
      }
      return null;
    });

    setCurrentSort({
      sort_by: order,
      sort_field: apiId,
    });

    if (cancelForAllAccounts) {
      cancelForAllAccounts();
    }
    getAdminAccountListData(
      paginationData,
      isPageLoading,
      getCancelTokenForAllAccounts,
    );

    clonedHeaders = clonedHeaders.map((header) => {
      if (apiId === header.apiId) {
        header.order *= -1;
      }
      return header;
    });

    adminAccountDataChange('accountTableHeaders', clonedHeaders);
  };

  const handleFilterChange = (event) => {
    if (event.target.value === currentFilter) return;

    const paginationData = {
      page: 1,
      size: rowsCount,
    };

    filterIdArray.map((filterValue) => {
      if (
        filterValue !== event.target.id &&
        currentFilter[filterValue] != null
      ) {
        paginationData[filterValue] = currentFilter[filterValue];
      }
      return null;
    });

    if (event.target.value != null) {
      paginationData[event.target.id] = event.target.value;
    }

    setCurrentFilter({
      ...currentFilter,
      [event.target.id]: event.target.value,
    });

    if (!isEmpty(accountSearchValue)) {
      paginationData.search = accountSearchValue;
    }

    if (!isEmpty(currentSort)) {
      paginationData.sort_by = currentSort.sort_by;
      paginationData.sort_field = currentSort.sort_field;
    }

    if (cancelForAllAccounts) {
      cancelForAllAccounts();
    }
    getAdminAccountListData(
      paginationData,
      isPageLoading,
      getCancelTokenForAllAccounts,
    );
  };

  const tableHeaders = getTableHeaders(accountTableHeaders, onClickUpDownArrow, t);

  const handlePageChange = (page) => {
    const PaginationData = {
      page,
      size: rowsCount,
    };

    if (!isEmpty(accountSearchValue)) {
      PaginationData.search = accountSearchValue;
    }

    if (!isEmpty(currentSort)) {
      PaginationData.sort_by = currentSort.sort_by;
      PaginationData.sort_field = currentSort.sort_field;
    }

    filterIdArray.map((filterValue) => {
      if (currentFilter[filterValue] != null) {
        PaginationData[filterValue] = currentFilter[filterValue];
      }
      return null;
    });

    if (cancelForAllAccounts) {
      cancelForAllAccounts();
    }
    getAdminAccountListData(
      PaginationData,
      isPageLoading,
      getCancelTokenForAllAccounts,
    );
  };

  useEffect(() => {
    let headerTotalHeight = isTrialDisplayed ? 230 : 180;
    headerTotalHeight = isMobile ? headerTotalHeight + 60 : headerTotalHeight;
    const singleCardHeight = 65;
    const windowHeight = window.innerHeight;
    const perPageDataCount = Math.floor(
      (windowHeight - headerTotalHeight) / singleCardHeight,
    );

    const paginationData = {
      page: 1,
      size: perPageDataCount,
    };
    adminAccountDataChange('adminAccountDataCountPerPage', perPageDataCount);

    if (cancelForAllAccounts) {
      cancelForAllAccounts();
    }
    getAdminAccountListData(
      paginationData,
      isPageLoading,
      getCancelTokenForAllAccounts,
    );

    onWindowResize(windowResize);

    return () => {
      clear();
      window.removeEventListener('resize', windowResize);
      if (cancelForAllAccounts) {
        cancelForAllAccounts();
      }
    };
  }, [isTrialDisplayed]);

  useEffect(() => {
    if (!tableRowDatas) return;

    const tableHeaderHeight = 40;
    const extraHeightNeeded = 30;
    const dataHeight =
      tableHeaderHeight + extraHeightNeeded + 53 * (tableRowDatas.length || 1);

    setTableDataHeight(dataHeight);
  }, [tableRowDatas]);

  useEffect(() => {
    if (tab === 'create-account') {
      toggleCloseOpen(true);
    } else {
      toggleCloseOpen(false);
    }
  }, [tab]);

  const handleSearchValueChange = (event) => {
    const paginationData = {
      page: 1,
      size: rowsCount,
    };

    if (!isEmpty(event.target.value)) {
      paginationData.search = event.target.value;
    }
    if (!isEmpty(currentSort)) {
      paginationData.sort_by = currentSort.sort_by;
      paginationData.sort_field = currentSort.sort_field;
    }

    filterIdArray.map((filterValue) => {
      if (currentFilter[filterValue] != null) {
        paginationData[filterValue] = currentFilter[filterValue];
      }
      return null;
    });

    if (cancelForAllAccounts) {
      cancelForAllAccounts();
    }
    getAdminAccountListData(
      paginationData,
      isPageLoading,
      getCancelTokenForAllAccounts,
    );

    adminAccountSearchValueChange(event.target.value);
  };

  const handleRowClick = (id) => {
    if (isEmpty(id)) return;
    const superAdminPathName = `${ACCOUNT_DETAILS.ADMIN_ACCOUNT}${id}`;
    routeNavigate(history, ROUTE_METHOD.PUSH, superAdminPathName, null, null);
  };

  const handleSuffixClick = () => {
    const event = {
      target: { value: EMPTY_STRING },
    };
    handleSearchValueChange(event);
  };

  const tableContainerStyle = {
    height: tableDataHeight,
  };

  return (
    <div className={styles.AccountsContainer}>
      <AddAccounts />
      <div className={cx(styles.SearchSortContainer, BS.D_FLEX)}>
        <div className={cx(styles.SearchContainer, BS.W100)}>
          <Input
            onChangeHandler={handleSearchValueChange}
            hideLabel
            readOnlyPrefix={<SearchIcon />}
            readOnlySuffix={
              !isEmpty(accountSearchValue) && (
                <CloseIconNew
                  className={gClasses.CursorPointer}
                  onClick={handleSuffixClick}
                />
              )
            }
            placeholder={t(ADMIN_ACCOUNT_STRINGS.SEARCH_NAME_PLACEHOLDER)}
            className={cx(BS.W100)}
            value={accountSearchValue}
            hideBorder
            hideMessage
          />
        </div>
        <div className={styles.SortContainer}>
          <Dropdown
            dropdownListClasses={styles.DropdownList}
            className={currentFilter.type != null && gClasses.MR10}
            innerClassName={
              currentFilter.type != null
                ? styles.DropdownContainer
                : styles.DropdownLabelContainer
            }
            customContentStyle={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}
            id="type"
            placeholder={t(ADMIN_ACCOUNT_STRINGS.ACC_TYPE)}
            optionList={getFilterAccountTypeOptionList(t)}
            onChange={handleFilterChange}
            selectedValue={currentFilter.type}
            tabBased
            isNewDropdown
            isBorderLess
            noInputPadding
            isTaskDropDown
            isCustomFilterDropdown
          />
          <Dropdown
            dropdownListClasses={styles.DropdownList}
            className={currentFilter.is_active != null && gClasses.MR10}
            innerClassName={
              currentFilter.is_active != null
                ? styles.DropdownContainer
                : styles.DropdownLabelContainer
            }
            customContentStyle={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}
            id="is_active"
            placeholder={t(ADMIN_ACCOUNT_STRINGS.ACC_STATUS)}
            optionList={getFilterAccountStatusOptionList(t)}
            onChange={handleFilterChange}
            selectedValue={currentFilter.is_active}
            tabBased
            isNewDropdown
            isBorderLess
            noInputPadding
            isTaskDropDown
            isCustomFilterDropdown
          />
          <Dropdown
            dropdownListClasses={styles.DropdownList}
            className={currentFilter.is_paid != null && gClasses.MR10}
            innerClassName={
              currentFilter.is_paid != null
                ? styles.DropdownContainer
                : styles.DropdownLabelContainer
            }
            customContentStyle={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}
            id="is_paid"
            placeholder={t(ADMIN_ACCOUNT_STRINGS.PAYMENT_STATUS)}
            optionList={getFilterPaymentStatusOptionList(t)}
            onChange={handleFilterChange}
            selectedValue={currentFilter.is_paid}
            tabBased
            isNewDropdown
            isBorderLess
            noInputPadding
            isTaskDropDown
            isCustomFilterDropdown
          />
        </div>
      </div>

      <div className={cx(styles.UserDetailsContainer, gClasses.W100)}>
        <TablePagination
          tblClassName={cx(styles.Table, styles.UserDetailsTable)}
          tblRowClassName={styles.RowContainer}
          tableContainerStyle={
            !isLoading && !isEmpty(tableRowDatas) ? tableContainerStyle : {}
          }
          tblHeader={tableHeaders}
          tblData={isEmpty(tableRowDatas) ? getNoValuesTable(t) : tableRowDatas}
          tblOnRowClick={handleRowClick}
          headerClassName={styles.AccountsTableHeader}
          paginationActivePage={adminAccountCurrentPage}
          paginationItemsCountPerPage={rowsCount}
          paginationTotalItemsCount={adminAccountTotalCount}
          paginationOnChange={handlePageChange}
          ddlRowOnChangeHandler={() => {}}
          paginationInnerClass={styles.PaginationInnerClass}
          paginationClassName={cx(gClasses.MT15, styles.PaginationContainer)}
          paginationItem=" "
          tblIsDataLoading={isLoading}
          paginationIsDataLoading={isLoading}
          tblLoaderRowCount={rowsCount}
          tblLoaderColCount={2}
          showItemDisplayInfoStrictly
          paginationFlowDashboardView
          pageRangeDisplayed={3}
          tblIsRowClick={!isLoading && !isEmpty(tableRowDatas)}
          tblIsTableViewListing
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    adminAccountData: state.AdminAccountsReducer.pagination_data,
    modalToggle: state.AdminAccountsReducer.isAdminAccountModalOpen,
    adminAccountCurrentPage: state.AdminAccountsReducer.adminAccountCurrentPage,
    adminAccountDataCountPerPage:
      state.AdminAccountsReducer.adminAccountDataCountPerPage,
    adminAccountTotalCount: state.AdminAccountsReducer.adminAccountTotalCount,
    isLoading: state.AdminAccountsReducer.isAdminAccountListLoading,
    isPageLoading: state.AdminAccountsReducer.isPaginationLoading,
    rowsCount: state.AdminAccountsReducer.adminAccountDataCountPerPage,
    accountSearchValue: state.AdminAccountsReducer.accountSearchValue,
    accountTableHeaders: state.AdminAccountsReducer.accountTableHeaders,
    isTrialDisplayed: state.NavBarReducer.isTrialDisplayed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAdminAccountListData: (value, load, cancelToken) => {
      dispatch(adminAccountDataThunk(value, load, cancelToken));
    },
    toggleCloseOpen: (value) => {
      dispatch(openOrCloseModal(value));
    },
    adminAccountDataChange: (id, value) => {
      dispatch(adminAccountDataChange(id, value));
    },
    clearAdminAccountData: () => {
      dispatch(modalAdminAccountDataClear());
    },
    deleteAdminAccount: (value) => {
      dispatch(deleteAdminAccountApiThunk(value));
    },
    clear: () => {
      dispatch(adminAccountClearData());
    },
    rowChange: (value) => {
      dispatch(changeAdminAccountRowsPerPage(value));
    },
    adminAccountSearchValueChange: (value) => {
      dispatch(adminAccountSearchValueChange(value));
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
