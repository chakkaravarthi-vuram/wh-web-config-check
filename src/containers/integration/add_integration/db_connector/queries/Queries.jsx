import React, { useContext, useState, useEffect } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  Title,
  Text,
  Button,
  ETitleSize,
  EButtonType,
  Input,
  TableWithInfiniteScroll,
  ETextSize,
  TableScrollType,
  TableColumnWidthVariant,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { isEmpty, find } from 'utils/jsUtility';
import { EMPTY_STRING, SEARCH_LABEL } from 'utils/strings/CommonStrings';
import { getFullName } from 'utils/generatorUtils';
import { getFormattedDateFromUTC } from 'utils/dateUtils';
import SearchIcon from 'assets/icons/SearchIcon';
import CloseIconNew from 'assets/icons/CloseIconNew';
import Trash from 'assets/icons/application/Trash';
import Edit from 'assets/icons/application/EditV2';
import styles from './Queries.module.scss';
import AddQueries from './add_query/AddQuery';
import { DB_CONNECTION_QUERIES_STRINGS } from '../DBConnector.strings';
import { LIST_TITLE } from '../../../Integration.strings';
import ThemeContext from '../../../../../hoc/ThemeContext';
import { DB_CONNECTOR_HEADER } from '../DBConnector.utils';
import { HOLIDAY_DATE } from '../../../../admin_settings/language_and_calendar/holidays/holiday_table/HolidayTable.strings';
import { dbConnectorDataChange } from '../../../../../redux/reducer/IntegrationReducer';
import { FILTER_TYPE } from '../../../Integration.utils';
import {
  deleteDBConnectorQueryApiThunk,
  getDBConnectorQueryConfigurationApiThunk,
} from '../../../../../redux/actions/Integration.Action';
import TaskCard from '../../../../landing_page/to_do_task/task_card/TaskCard';
import { QUERY_ACTION_OPTIONS } from '../DBConnector.constant';
import NoQueryFound from './no_query_found/NoQueryFound';
import { CancelToken } from '../../../../../utils/UtilityFunctions';
import NoSearchResults from '../../../no_search_results/NoSearchResults';
import DeleteConfirmModal from '../delete_comfirm_modal/DeleteConfirmModal';

const cancelTokenQueryApi = new CancelToken();

function Queries(props) {
  const {
    isQueryConfigModelOpen,
    dbConnectorDataChange,
    queryList,
    queryListSearchText,
    totalQueryCount,
    hasMoreQuery,
    isQueryListLoading,
    db_connector_uuid,
    getDBConnectorQueryConfigurationApi,
    isEditView,
    errorList,
  } = props;
  const { t } = useTranslation();
  const { colorSchemeDefault } = useContext(ThemeContext);
  const [searchFocus, setSearchFocus] = useState(false);
  const [perPageCount, setPerPageCount] = useState(15);
  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);
  const [deleteQueryUUID, setDeleteQueryUUID] = useState(null);

  const headerTotalHeight = 163;
  const singleCardHeight = 40;
  const { ADD_QUERY, QUERY_LIST, DELETE } = DB_CONNECTION_QUERIES_STRINGS(t);
  const { SHOWING, QUERY } = LIST_TITLE(t);
  const isQueryNotFound =
    !isQueryListLoading &&
    totalQueryCount === 0 &&
    isEmpty(queryListSearchText);
  const resultsText = `${SHOWING} ${totalQueryCount} ${QUERY}`;

  const openQueryConfigModel = () => {
    dbConnectorDataChange({ isQueryConfigModelOpen: true });
  };

  const loadQueryListData = async (additionalParams = {}) => {
    const apiParams = {
      page: 1,
      size: perPageCount,
      search: queryListSearchText,
      connector_uuid: db_connector_uuid,
      status: FILTER_TYPE.PUBLISHED,
      ...additionalParams,
    };
    if (isEmpty(apiParams.search)) delete apiParams.search;
    if (cancelTokenQueryApi.cancelToken) cancelTokenQueryApi.cancelToken?.();
    const initialLoad = apiParams?.page === 1;
    getDBConnectorQueryConfigurationApi(
      apiParams,
      initialLoad,
      cancelTokenQueryApi.setCancelToken,
    );
  };

  const onLoadMoreCallHandler = () => {
    const { currentPage } = props;
    if (hasMoreQuery && !isQueryListLoading) {
      const params = { page: currentPage + 1 };
      loadQueryListData(params);
    }
  };

  const closeQueryConfigModel = () => {
    dbConnectorDataChange({
      query: {},
      isQueryConfigModelOpen: false,
      db_allowed_options: {},
      table_list: [],
      table_info: [],
      query_data: [],
      query_details: [],
      error_list: {},
      field_error_list: {},
      filter_error_list: {},
    });
    loadQueryListData();
  };

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const count = Math.floor(
      (windowHeight - headerTotalHeight) / singleCardHeight,
    );
    setPerPageCount(count);
    loadQueryListData({ size: perPageCount });
  }, []);

  const onSearchHandler = (event) => {
    const searchValue = event?.target?.value;
    dbConnectorDataChange({
      queryListSearchText: searchValue,
    });
    loadQueryListData({ search: searchValue });
  };

  const onClearSearch = () => {
    dbConnectorDataChange({
      queryListSearchText: EMPTY_STRING,
    });
    loadQueryListData({ search: null });
  };

  const onCloseDeleteModel = () => {
    setIsDeleteModelOpen(false);
    setDeleteQueryUUID(null);
  };

  const onDeleteQuery = () => {
    const { deleteDBConnectorQueryApi } = props;
    const data = { db_query_uuid: deleteQueryUUID };
    deleteDBConnectorQueryApi(data).then(() => {
      loadQueryListData();
    });
    onCloseDeleteModel();
  };

  const onRowClick = (id) => {
    if (!isEditView) {
      const selectedQuery = find(queryList, { _id: id });
      dbConnectorDataChange({
        query: {
          _id: selectedQuery._id,
          db_query_uuid: selectedQuery.db_query_uuid,
        },
      });
      openQueryConfigModel();
    }
  };

  const getEachRow = (query) => {
    const name = (
      <Text
        content={query?.db_query_name}
        title={query?.db_query_name}
        size={ETextSize.MD}
      />
    );

    const queryActionTestData = find(QUERY_ACTION_OPTIONS, {
      value: query?.query_action,
    }).label;
    const queryAction = (
      <Text
        content={queryActionTestData}
        title={queryActionTestData}
        size={ETextSize.MD}
      />
    );

    const lastUpdatedBy = (
      <Text
        content={getFullName(
          query?.last_updated_by?.first_name,
          query?.last_updated_by?.last_name,
        )}
        size={ETextSize.MD}
      />
    );
    const lastUpdatedOn = (
      <Text
        content={getFormattedDateFromUTC(
          lastUpdatedBy?.last_updated_on?.utc_tz_datetime,
          HOLIDAY_DATE,
        )}
        size={ETextSize.MD}
      />
    );

    const onEditQueryDetails = () => {
      dbConnectorDataChange({
        query: { _id: query._id, db_query_uuid: query.db_query_uuid },
      });
      openQueryConfigModel();
    };
    const editQuery = isEditView && (
      <button onClick={onEditQueryDetails}>
        <Edit className={styles.EditIcon} />
      </button>
    );

    const onDeleteModelOpen = () => {
      setIsDeleteModelOpen(true);
      setDeleteQueryUUID(query.db_query_uuid);
    };
    const deleteQuery = isEditView && (
      <button className={gClasses.PR16} onClick={onDeleteModelOpen}>
        <Trash />
      </button>
    );

    const component = [name, queryAction, lastUpdatedBy, lastUpdatedOn];
    if (isEditView) {
      component.push(editQuery, deleteQuery);
    }

    return {
      id: query?._id,
      component,
    };
  };

  const getAllQueryListResult = () => {
    let containerData = null;
    if (
      !isQueryListLoading &&
      isEmpty(queryList) &&
      !isEmpty(queryListSearchText)
    ) {
      containerData = <NoSearchResults />;
    } else if (totalQueryCount || isQueryListLoading) {
      const tableBody = queryList?.map((eachItem) => getEachRow(eachItem));
      containerData = (
        <TableWithInfiniteScroll
          scrollableId={QUERY_LIST.ID}
          className={cx(styles.OverFlowInherit, gClasses.PX24)}
          tableClassName={gClasses.OverflowInitial}
          header={DB_CONNECTOR_HEADER(t, isEditView)}
          data={tableBody}
          onRowClick={onRowClick}
          isLoading={isQueryListLoading}
          loaderRowCount={4}
          onLoadMore={onLoadMoreCallHandler}
          hasMore={hasMoreQuery}
          isRowClickable
          scrollType={TableScrollType.BODY_SCROLL}
          widthVariant={TableColumnWidthVariant.CUSTOM}
        />
      );
    }
    return containerData;
  };

  return (
    <>
      {isQueryNotFound ? (
        <NoQueryFound
          isEditView={isEditView}
          openQueryConfigModel={openQueryConfigModel}
          isShowError={errorList?.query_count}
        />
      ) : (
        <div>
          <div
            className={cx(gClasses.CenterV, BS.JC_BETWEEN, styles.ListHeader)}
          >
            <Title
              content={resultsText}
              size={ETitleSize.xs}
              className={gClasses.GrayV3}
            />
            <div className={cx(gClasses.CenterV)}>
              {searchFocus ? (
                <Input
                  className={styles.SearchTab}
                  refCallBackFunction={(inputRef) => inputRef?.current?.focus()}
                  placeholder={t(SEARCH_LABEL)}
                  content={queryListSearchText}
                  prefixIcon={<SearchIcon />}
                  onChange={onSearchHandler}
                  onBlurHandler={() =>
                    isEmpty(queryListSearchText) && setSearchFocus(false)
                  }
                  suffixIcon={
                    !isEmpty(queryListSearchText) && (
                      <button onClick={onClearSearch}>
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
              {isEditView && (
                <Button
                  type={EButtonType.SECONDARY}
                  buttonText={ADD_QUERY}
                  colorSchema={colorSchemeDefault}
                  className={gClasses.ML16}
                  onClickHandler={openQueryConfigModel}
                />
              )}
            </div>
          </div>
          <div className={cx(styles.OuterTable)}>
            {getAllQueryListResult()}
            {isQueryListLoading && (
              <div className={gClasses.PX30}>
                {Array(4)
                  .fill()
                  .map((loaderIndex) => (
                    <TaskCard
                      CardContainerStyle={styles.Loader}
                      isDataLoading
                      key={loaderIndex}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
      {isQueryConfigModelOpen && (
        <AddQueries
          isModalOpen={isQueryConfigModelOpen}
          closeModel={closeQueryConfigModel}
          isEditView={isEditView}
        />
      )}
      {isDeleteModelOpen && (
        <DeleteConfirmModal
          id={DELETE.ID}
          isModalOpen={isDeleteModelOpen}
          content={DELETE.TITLE}
          deleteButton={DELETE.CONFIRM}
          cancelButton={DELETE.CANCEL}
          onDelete={onDeleteQuery}
          onCloseModal={onCloseDeleteModel}
        />
      )}
    </>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    isQueryConfigModelOpen:
      IntegrationReducer.dbConnector.isQueryConfigModelOpen,
    queryList: IntegrationReducer.dbConnector.queryList,
    queryListSearchText: IntegrationReducer.dbConnector.queryListSearchText,
    totalQueryCount: IntegrationReducer.dbConnector.totalQueryCount,
    hasMoreQuery: IntegrationReducer.dbConnector.hasMoreQuery,
    isQueryListLoading: IntegrationReducer.dbConnector.isQueryListLoading,
    db_connector_uuid: IntegrationReducer.dbConnector.db_connector_uuid,
    errorList: IntegrationReducer.dbConnector.error_list,
  };
};

const mapDispatchToProps = {
  dbConnectorDataChange,
  getDBConnectorQueryConfigurationApi: getDBConnectorQueryConfigurationApiThunk,
  deleteDBConnectorQueryApi: deleteDBConnectorQueryApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(Queries);
