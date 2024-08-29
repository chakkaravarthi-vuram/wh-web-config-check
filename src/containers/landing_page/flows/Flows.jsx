import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames/bind';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import { isEmpty, isNull } from 'utils/jsUtility';
import {
  clearFlowListData,
} from 'redux/actions/FlowListActions';
import { FLOW_STRINGS } from 'containers/flows/Flow.strings';
import {
  FLOW_DASHBOARD,
  LIST_FLOW,
  ALL_PUBLISHED_FLOWS,
} from 'urls/RouteConstants';
import { NavBarDataChange } from 'redux/actions/NavBar.Action';
import { FLOW_DROPDOWN } from 'containers/flow/listFlow/listFlow.strings';
import { BS } from 'utils/UIConstants';
import { useTranslation } from 'react-i18next';
import styles from './Flows.module.scss';
import FlowCard from './flow_card/FlowCard';
import NoDataFound from '../no_data_found/NoDataFound';
import { NO_DATA_FOUND_STRINGS } from '../no_data_found/NoDataFound.strings';
import { LANDING_PAGE_TOPICS } from '../main_header/common_header/CommonHeader.strings';
import { routeNavigate } from '../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../utils/Constants';
import { getAllDevFlowsThunk } from '../../../redux/actions/FlowListActions';

function Flows(props) {
  const history = useHistory();
  const [perPageDataCount, setPerPageDataCount] = useState(0);
  const {
    isDataLoading,
    isDataListLoading,
    isTaskDataLoading,
    flowList,
    totalCount,
    serverError,
    hasMore,
    remainingFlowsCount,
    isLoadMoreDataLoading,
    navbarChange,
  } = props;
  const { t } = useTranslation();
  const isInitialLoading =
    isDataListLoading || isTaskDataLoading || isDataLoading;
  const isLoading = isInitialLoading || isLoadMoreDataLoading;
  const containerRef = useRef();

  const pref_locale = localStorage.getItem('application_language');

  let flowListItems = null;

  useEffect(() => {
    const { onAllFlowsListApi } = props;
    const perPageDataCount_ = 10;
    setPerPageDataCount(perPageDataCount_);
    onAllFlowsListApi(
      { size: perPageDataCount_ },
      FLOW_STRINGS.FLOW_API_CALL_STRINGS.GET_FLOWS,
    );
    return () => {
      const { clearFlowListData } = props;
      clearFlowListData();
    };
  }, []);

  const onClickFlow = async (e) => {
    const flow_uuid = e.currentTarget.dataset.uuid;
    const flow_name = e.currentTarget.dataset.name;
    // const flow_id = e.currentTarget.dataset.id;
    if (flow_uuid && flow_name) {
      await navbarChange({
        commonHeader: {
          tabOptions: FLOW_DROPDOWN.OPTION_LIST(t),
          button: null,
        },
      });
      const flowPathName = `${FLOW_DASHBOARD}/${flow_uuid}`;
      const flowState = {
        flow_tab: 1,
      };
      routeNavigate(history, ROUTE_METHOD.PUSH, flowPathName, null, flowState);
    }
  };
  const loadData = () => {
    const loadDataPathName = `${LIST_FLOW}${ALL_PUBLISHED_FLOWS}`;
    routeNavigate(history, ROUTE_METHOD.PUSH, loadDataPathName, null, null);
  };
  if (isInitialLoading) {
    // common initial loading changed to individual loading
    flowListItems = Array(perPageDataCount)
      .fill()
      .map((eachCard, index) => <FlowCard index={index} isLoaderCard />);
  } else if (!isEmpty(flowList)) {
    flowListItems = flowList.map((eachFlow, index) => {
      if ((!isEmpty(eachFlow)) && !(isNull(eachFlow))) {
      const { flow_name, flow_color, _id, flow_uuid, translation_data } =
        eachFlow;
      return (
        <FlowCard
          isDataLoading={isDataLoading}
          index={index}
          flow_uuid={flow_uuid}
          flow_name={translation_data?.[pref_locale]?.flow_name || flow_name}
          flow_color={flow_color}
          _id={_id}
          onClick={onClickFlow}
        />
      );
    }
    return null;
  });
    if (isLoadMoreDataLoading) {
      flowListItems.push(
        ...Array(perPageDataCount)
          .fill()
          .map((eachCard, index) => (
            <FlowCard index={index} isLoaderCard />
          )),
      );
    }
  } else {
    if (serverError) flowListItems = <div>Something went wrong!</div>;
    else {
      flowListItems = (
        <NoDataFound
          originalLocation="Home Flows"
          dataText={NO_DATA_FOUND_STRINGS.LANDING_PAGE_FLOW_TEXT}
          linkText={NO_DATA_FOUND_STRINGS.NO_DATA_LINK_TEXT.FLOWS}
        />
      );
    }
  }
  if (hasMore && !isLoading) {
    flowListItems.push(
      <FlowCard
        isMoreCard
        onClick={loadData}
        moreCardCount={remainingFlowsCount}
      />,
    );
  }

  return (
    <>
      <h3>
      <div className={cx(gClasses.HeadingTitleV1, gClasses.MB15)} id="flowHeader">
        {t(LANDING_PAGE_TOPICS.FLOW)}
        <span className={cx(gClasses.FTwo16GrayV89, gClasses.ML4)}>
          {totalCount ? ` (${totalCount})` : null}
        </span>
      </div>
      </h3>
      <ul
        className={cx(
          styles.Flows,
          gClasses.MB24,
          BS.FLEX_WRAP_WRAP,
          !isInitialLoading && isEmpty(flowList) && styles.NoDataDisplay,
        )}
        ref={containerRef}
      >
        {flowListItems}
      </ul>
    </>
  );
}
const mapStateToProps = ({
  FlowListReducer,
  TaskReducer,
  DataListReducer,
}) => {
  return {
    isDataLoading: FlowListReducer.isLandingDataLoading,
    isTaskDataLoading: TaskReducer.isTaskDataLoading,
    isDataListLoading: DataListReducer.isLandingPageOtherDataListLoading,
    flowList: FlowListReducer.landing_flow_list,
    totalCount: FlowListReducer.total_count,
    serverError: FlowListReducer.common_server_error,
    hasMore: FlowListReducer.hasMore,
    page: FlowListReducer.page,
    remainingFlowsCount: FlowListReducer.remainingFlowsCount,
    isLoadMoreDataLoading: FlowListReducer.isLoadMoreLandingDataLoading,
  };
};
const mapDispatchToProps = {
  onAllFlowsListApi: getAllDevFlowsThunk,
  clearFlowListData: clearFlowListData,
  navbarChange: NavBarDataChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(Flows);
