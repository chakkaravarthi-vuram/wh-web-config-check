import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { isEmpty } from 'utils/jsUtility';
import { connect } from 'react-redux';
import { BS } from 'utils/UIConstants';
import { useParams } from 'react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import FormTitle from 'components/form_components/form_title/FormTitle';
import ReadOnlyText from 'components/form_components/read_only_text/ReadOnlyText';
import {
  openOrCloseModal,
  setAccountCustomizedDetails,
  accountDetailsDataClear,
  adminAccountDataChange,
} from 'redux/reducer/AdminAccountsReducer';
import { useTranslation } from 'react-i18next';
import {
  getAdminDetailsThunk,
  getUsageSummaryThunk,
} from 'redux/actions/AdminAccounts.Action';
import { getFormattedDateFromUTC } from 'utils/dateUtils';
import TablePagination from 'components/table_pagination/TablePagination';
import AddAccounts from '../accounts/add_accounts/AddAccounts';
import AccountHeader from './AccountDetailsHeader';
import styles from './AccountDetails.module.scss';
import {
  getAccountObject,
  customiseRawData,
  getUsageSummaryHeaders,
  getAccountHeaderDetails,
  getUsageSummaryTableData,
} from './AccountDetails.utils';
import ADMIN_ACCOUNT_MANAGEMENT_STRINGS, { COPILOT_CONFIGURATION } from '../accounts/Accounts.strings';

function AccountDetails(props) {
  const {
    isAccountDetailsLoading,
    isAccountCustomisedDetailsLoading,
    eachAccountDetails,
    setAccountCustomizedDetails,
    eachAccountCustomisedDetails,
    getUsageSummaryThunk,
    usageSummaryPaginationData,
    isUsageSummaryLoading,
    usageSummaryCurrentPage,
    usageSummaryDataCountPerPage,
    usageSummaryTotalCount,
    accountDetailsDataClear,
    toggleCloseOpen,
    adminAccountDataChange,
    dispatch,
  } = props;

  const { id, tab } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(
      getAdminDetailsThunk({
        account_id: id,
      }),
    )
      .then((response) => {
        setAccountCustomizedDetails(
          customiseRawData(response, getFormattedDateFromUTC, t),
        );
      })
      .catch(() => {
        setAccountCustomizedDetails(customiseRawData({}, getFormattedDateFromUTC, t));
      });
    const paginationData = {
      page: 1,
      size: usageSummaryDataCountPerPage,
      account_id: id,
    };
    getUsageSummaryThunk(paginationData);
    adminAccountDataChange('eachAccountCustomisedDetails', getAccountObject(t));

    return () => {
      accountDetailsDataClear();
    };
  }, []);

  useEffect(() => {
    if (isEmpty(eachAccountDetails)) return;
    setAccountCustomizedDetails(
      customiseRawData(eachAccountDetails, getFormattedDateFromUTC, t),
    );
  }, [eachAccountDetails]);

  useEffect(() => {
    if (tab === 'edit-account') {
      toggleCloseOpen(true);
    } else {
      toggleCloseOpen(false);
    }
  }, [tab]);

  const sectionComponent = (sectionObject) => (
    <>
      <FormTitle
        className={cx(
          sectionObject.SUB_TITLE ? gClasses.MT10 : gClasses.MT20,
          sectionObject.SUB_TITLE && styles.SubHeadingClass,
          gClasses.Ellipsis,
        )}
        isDataLoading={
          isAccountDetailsLoading || isAccountCustomisedDetailsLoading
        }
        noBottomMargin
        noTopPadding
      >
        {sectionObject.TITLE}
      </FormTitle>
      <div className={cx(BS.D_FLEX, BS.FLEX_WRAP_WRAP, gClasses.Ellipsis)}>
        {sectionObject.KEY_VALUES.map((keyPair) => (
          <div className={cx(BS.W50, gClasses.MB10)} title={keyPair.value}>
              <ReadOnlyText
                label={keyPair.label}
                // value={keyPair.value}
                value={keyPair.id === COPILOT_CONFIGURATION.ENABLE_COPILOT_FEATURE_ID ? keyPair.value ? t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.COPILOT_ENABLED) : t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.COPILOT_DISABLED) : keyPair.value}
                isLoading={
                  isAccountDetailsLoading || isAccountCustomisedDetailsLoading
                }
                formFieldBottomMargin
                ContentClass={cx(
                  keyPair.contentClass,
                  gClasses.Ellipsis,
                  styles.ContentClass,
                )}
                hideMessage
              />
          </div>
        ))}
      </div>
    </>
  );

  const getTablePagination = (tableData) => (
    <ReadOnlyText
      label={tableData.LABEL}
      hideLabel={tableData.HIDE_LABEL}
      value={(
        <TablePagination
          tblClassName={cx(gClasses.MB10)}
          tblRowClassName={styles.RowContainer}
          headerClassName={styles.HeaderContainer}
          bodyClassName={styles.TableBodyContainer}
          tblHeader={tableData.HEADERS}
          tblData={isEmpty(tableData.DATA) ? [['No values found']] : tableData.DATA}
          tblIsDataLoading={isAccountDetailsLoading || isAccountCustomisedDetailsLoading}
          tblLoaderRowCount={3}
          tblLoaderColCount={3}
          showItemDisplayInfoStrictly
          hidePagination={tableData.HIDE_PAGINATION}
        />
      )}
      isLoading={isAccountDetailsLoading || isAccountCustomisedDetailsLoading}
      formFieldBottomMargin
      hideMessage
    />
  );

  const usageSummaryTableData = getUsageSummaryTableData(
    usageSummaryPaginationData,
    t,
  );

  const handlePageChange = (page) => {
    const paginationData = {
      page,
      size: usageSummaryDataCountPerPage,
      account_id: id,
    };
    getUsageSummaryThunk(paginationData);
  };

  const usageSummaryTable = (
    <TablePagination
      tblClassName={cx(gClasses.MT10)}
      tblRowClassName={styles.RowContainer}
      headerClassName={styles.UsageSummaryHeader}
      tblHeader={getUsageSummaryHeaders(t)}
      tblData={usageSummaryTableData}
      paginationActivePage={usageSummaryCurrentPage}
      paginationItemsCountPerPage={usageSummaryDataCountPerPage}
      paginationTotalItemsCount={usageSummaryTotalCount}
      paginationOnChange={handlePageChange}
      paginationClassName={gClasses.MT15}
      paginationItem=" "
      tblIsDataLoading={isUsageSummaryLoading}
      paginationIsDataLoading={isUsageSummaryLoading}
      tblLoaderRowCount={usageSummaryDataCountPerPage}
      tblLoaderColCount={8}
      showItemDisplayInfoStrictly
      paginationFlowDashboardView
      pageRangeDisplayed={3}
    />
  );

  return (
    <div className={styles.OuterContainer}>
      <AddAccounts
        adminAccountId={id}
        eachAccountDetails={eachAccountDetails}
      />
      <AccountHeader
        isLoading={isAccountDetailsLoading || isAccountCustomisedDetailsLoading}
        id={id}
        company={getAccountHeaderDetails(eachAccountDetails)}
      />
      <div className={cx(styles.ScrollContainer)}>
        {
          !isEmpty(eachAccountCustomisedDetails) && (
            <div className={cx(gClasses.MT10, styles.DetailsContainer)}>
              <div className={cx(BS.W50, styles.EachSection)}>
                {sectionComponent(eachAccountCustomisedDetails.LANGUAGE_TIME)}
              </div>
              <div className={cx(BS.W50, styles.EachSection)}>
                {sectionComponent(eachAccountCustomisedDetails.BILLING_DETAILS)}
                {getTablePagination(
                  eachAccountCustomisedDetails.BILLING_DETAILS.BILLING_OWNERS,
                )}
              </div>
              <div className={cx(BS.W100, styles.EachSection)}>
                {sectionComponent(eachAccountCustomisedDetails.DISCOUNT_DETAILS)}
                {getTablePagination(
                  eachAccountCustomisedDetails.DISCOUNT_DETAILS
                    .DISCOUNT_DETAILS_TABLE,
                )}
              </div>
              <div className={cx(BS.W50, styles.EachSection)}>
                {sectionComponent(eachAccountCustomisedDetails.COPILOT_CONFIGURATION)}
              </div>
              <div className={cx(BS.W50, styles.EachSection)}>
                {sectionComponent(eachAccountCustomisedDetails.WORKHALLICS_DETAILS)}
              </div>
              <div className={cx(BS.W50, styles.EachSection)}>
                {sectionComponent(eachAccountCustomisedDetails.USAGE_SUMMARY)}
              </div>
              <div className={cx(BS.W50, styles.EachSection)}>
                {sectionComponent(
                  eachAccountCustomisedDetails.USAGE_SUMMARY_CURRENT_MONTH,
                )}
              </div>
              <FormTitle
                className={cx(
                  gClasses.MT20,
                  gClasses.Ellipsis,
                )}
                isDataLoading={
                  isAccountDetailsLoading || isAccountCustomisedDetailsLoading
                }
                noBottomMargin
                noTopPadding
              >
                Billing History
              </FormTitle>
              {usageSummaryTable}
            </div>
          )
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    eachAccountDetails: state.AdminAccountsReducer.eachAccountDetails,
    isAccountDetailsLoading: state.AdminAccountsReducer.isAccountDetailsLoading,
    eachAccountCustomisedDetails:
      state.AdminAccountsReducer.eachAccountCustomisedDetails,
    isAccountCustomisedDetailsLoading:
      state.AdminAccountsReducer.isAccountCustomisedDetailsLoading,
    isUsageSummaryLoading: state.AdminAccountsReducer.isUsageSummaryLoading,
    usageSummaryPaginationData:
      state.AdminAccountsReducer.usageSummaryPaginationData,
    usageSummaryCurrentPage: state.AdminAccountsReducer.usageSummaryCurrentPage,
    usageSummaryDataCountPerPage:
      state.AdminAccountsReducer.usageSummaryDataCountPerPage,
    usageSummaryTotalCount: state.AdminAccountsReducer.usageSummaryTotalCount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAccountCustomizedDetails: (data) => {
      dispatch(setAccountCustomizedDetails(data));
    },
    getUsageSummaryThunk: (params) => {
      dispatch(getUsageSummaryThunk(params));
    },
    accountDetailsDataClear: () => {
      dispatch(accountDetailsDataClear());
    },
    toggleCloseOpen: (value) => {
      dispatch(openOrCloseModal(value));
    },
    adminAccountDataChange: (id, value) => {
      dispatch(adminAccountDataChange(id, value));
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetails);
