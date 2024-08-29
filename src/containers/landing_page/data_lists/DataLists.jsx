import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { isEmpty, unset, isNull } from 'utils/jsUtility';
import {
  clearLandingPageDataListAction,
  updateSelectedDataListAction,
} from 'redux/reducer/DataListReducer';
import { dataListStateChangeAction } from 'redux/reducer/CreateDataListReducer';
import { getLandingPageDataListSchemaSelector } from 'redux/selectors/DataListSelector';
import {
  DATA_LIST_DASHBOARD,
  LIST_DATA_LIST,
  DATALIST_OVERVIEW,
} from 'urls/RouteConstants';
import { calculatePaginationDataCount } from 'utils/UtilityFunctions';
import { LIST_TYPE } from 'components/list_headers/ListHeader';
import { NO_DATA_FOUND_STRINGS } from '../no_data_found/NoDataFound.strings';
import styles from './DataLists.module.scss';
import { LANDING_PAGE_TOPICS } from '../main_header/common_header/CommonHeader.strings';
import { routeNavigate } from '../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../utils/Constants';
import { getAllDevDataListApiThunk } from '../../../redux/actions/DataListAction';

// lazy imports
const DataListCard = lazy(() => import('./data_list_card/DataListCard'));
const NoDataFound = lazy(() => import('../no_data_found/NoDataFound'));

function DataLists(props) {
  const { t } = useTranslation();
  const cardWidth = 200;
  const cardHeight = 44;
  const rowMinCount = 1;
  const colMinCount = {
    sm: 5,
    md: 2,
    lg: 5,
  };

  const containerRef = useRef(null);
  const history = useHistory();
  const [perPageDataCount, setPerPageDataCount] = useState(0);
  const {
    isDataLoading,
    clearLandingPageDataListDataFromRedux,
    totalOtherDataListCount,
    isDataListInfiniteScrollLoading,
    allDataList,
    remainingOtherDataListCount,
    otherDataListHasMore,
    serverError,
    isTaskDataLoading,
    isFlowListLoading,
  } = props;
  let listItems = null;
  const isInitialLoading =
    isTaskDataLoading || isDataLoading || isFlowListLoading;
  const isLoading = isInitialLoading || isDataListInfiniteScrollLoading;

  useEffect(() => {
    const { getAllDataList, dataListParams, dataListStateChange } = props;
    const perPageDataCount_ = calculatePaginationDataCount({
      ref: containerRef,
      cardWidth,
      cardHeight,
      rowMinCount,
      colMinCount,
    });
    setPerPageDataCount(perPageDataCount_);
    dataListStateChange(perPageDataCount_, 'otherDataListDataCountPerCall');
    dataListParams.size = 10;
    unset(dataListParams, 'search');
    getAllDataList(dataListParams, LIST_TYPE.DATA_LIST);
    return () => {
      clearLandingPageDataListDataFromRedux();
    };
  }, []);

  const updateSelectedDataList = ({ _id, data_list_uuid, isScroll }) => {
    if (isScroll) {
      routeNavigate(history, ROUTE_METHOD.PUSH, `${LIST_DATA_LIST}${DATALIST_OVERVIEW}`, null, null);
    } else {
      const { updateSelectedDataList } = props;
      const selectedDatalistPathName = `${DATA_LIST_DASHBOARD}/${data_list_uuid}`;
      const selectedDatalistState = { _id, data_list_uuid, datalist_tab: 1 };
      updateSelectedDataList({ _id, data_list_uuid });
      routeNavigate(history, ROUTE_METHOD.PUSH, selectedDatalistPathName, null, selectedDatalistState);
    }
  };

  if (isDataLoading) {
    // common initial loading changed to individual loading
    listItems = Array(perPageDataCount)
      .fill()
      .map((eachCard, index) => <DataListCard index={index} isLoaderCard />);
  } else if (!isEmpty(allDataList)) {
    listItems = allDataList.map((eachDataList, index) => {
      if (!isEmpty(eachDataList) && (!(isNull(eachDataList)))) {
      const { data_list_uuid, _id, data_list_name, data_list_color } =
        eachDataList;
      return (
        <DataListCard
          index={index}
          isDataLoading={isDataLoading}
          data_list_name={data_list_name}
          data_list_color={data_list_color}
          onClick={() => updateSelectedDataList({ _id, data_list_uuid })}
          id={_id}
        />
      );
    }
    return null;
  });
    if (isDataListInfiniteScrollLoading) {
      listItems.push(
        ...Array(perPageDataCount)
          .fill()
          .map((eachCard, index) => (
            <DataListCard index={index} isLoaderCard />
          )),
      );
    }
  } else {
    if (serverError) listItems = <div>Something went wrong!</div>;
    else {
      listItems = (
        <NoDataFound
          originalLocation="Home Datalists"
          dataText={NO_DATA_FOUND_STRINGS.LANDING_PAGE_DATALIST_TEXT}
          linkText={NO_DATA_FOUND_STRINGS.NO_DATA_LINK_TEXT.DATALISTS}
        />
      );
    }
  }

  if (otherDataListHasMore && !isLoading) {
    listItems.push(
      <DataListCard
        isMoreCard
        moreCardCount={remainingOtherDataListCount}
        onClick={() => updateSelectedDataList({ isScroll: true })}
      />,
    );
  }

  return (
    <>
      <h3>
      <div className={cx(gClasses.HeadingTitleV1, gClasses.MB15)}>
        {t(LANDING_PAGE_TOPICS.DATALIST)}
        <span className={cx(gClasses.FTwo16GrayV89, gClasses.ML4)}>
          {totalOtherDataListCount ? ` (${totalOtherDataListCount})` : null}
        </span>
      </div>
      </h3>
      <ul className={cx(styles.DataLists, 'flex-wrap')} ref={containerRef}>
        <Suspense fallback={<div>Loading...</div>}>{listItems}</Suspense>
      </ul>
    </>
  );
}
const mapStateToProps = ({
  DataListReducer,
  TaskReducer,
  FlowListReducer,
}) => {
  return {
    ...getLandingPageDataListSchemaSelector(DataListReducer),
    isTaskDataLoading: TaskReducer.isTaskDataLoading,
    isFlowListLoading: FlowListReducer.isDataLoading,
  };
};

const mapDispatchToProps = {
  getAllDataList: getAllDevDataListApiThunk,
  clearLandingPageDataListDataFromRedux: clearLandingPageDataListAction,
  dataListStateChange: dataListStateChangeAction,
  updateSelectedDataList: updateSelectedDataListAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataLists);
