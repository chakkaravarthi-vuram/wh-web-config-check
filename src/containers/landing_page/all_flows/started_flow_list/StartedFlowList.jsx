import React, { useEffect, lazy } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ResponseHandler from '../../../../components/response_handlers/ResponseHandler';
import {
  getAllSelfInitiatedFlowsApiAction,
  clearStartedFlowListData,
} from '../../../../redux/actions/FlowListActions';
import gClasses from '../../../../scss/Typography.module.scss';
import { getServerErrorMessageObject, routeNavigate } from '../../../../utils/UtilityFunctions';
import { FLOW_DASHBOARD } from '../../../../urls/RouteConstants';
import { ROUTE_METHOD } from '../../../../utils/Constants';

// lazy imports
const StartedProcecureCard = lazy(() =>
  import('./started_flow_card/StartedFlowCard'));

function StartedFlowList(props) {
  const {
    started_flow_list,
    isDataLoading,
    dataCountForApiCall,
    infiniteScrollDataLoading,
    common_server_error,
  } = props;
  const { t } = useTranslation();
  useEffect(() => {
    const { getAllSelfInitiatedFlowsApiCall } = props;

    getAllSelfInitiatedFlowsApiCall({
      size: Math.floor(dataCountForApiCall * 1.75),
    });
    return () => {
      const { clearStartedFlowListDataFromRedux } = props;
      clearStartedFlowListDataFromRedux();
    };
  }, []);

  const onClickHandler = (flow_uuid, flow_name, flow_id) => {
    const startedFlowPathName = `${FLOW_DASHBOARD}/${flow_id}/${flow_uuid}`;
    const startedFlowState = { flow_uuid, flow_name, flow_id, flow_tab: 1 };
    routeNavigate(props.history, ROUTE_METHOD.PUSH, startedFlowPathName, null, startedFlowState);
  };

  let startedFlowList = null;
  if (isDataLoading) {
    startedFlowList = Array(dataCountForApiCall)
      .fill()
      .map(() => <StartedProcecureCard isDataLoading={isDataLoading} />);
  } else if (!isDataLoading && started_flow_list.length) {
    startedFlowList = started_flow_list.map((eachItem) => (
      <StartedProcecureCard
        {...eachItem}
        isDataLoading={isDataLoading}
        onClickHandler={onClickHandler}
      />
    ));
    if (infiniteScrollDataLoading) {
      startedFlowList.push(
        Array(1)
          .fill()
          .map(() => (
            <StartedProcecureCard isDataLoading={infiniteScrollDataLoading} />
          )),
      );
    }
  } else {
    const messageObject = getServerErrorMessageObject(
      common_server_error,
      started_flow_list,
      null,
      t,
    );
    startedFlowList = (
      <ResponseHandler
        className={gClasses.MT40}
        messageObject={messageObject}
      />
    );
  }

  return startedFlowList;
}

const mapStateToProps = (state) => {
  return {
    started_flow_list: state.FlowListReducer.started_flow_list,
    isDataLoading: state.FlowListReducer.isStartedFlowListLoading,
    infiniteScrollDataLoading:
      state.FlowListReducer.infiniteScrollDataLoading,
    common_server_error: state.FlowListReducer.common_server_error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllSelfInitiatedFlowsApiCall: (params) => {
      dispatch(getAllSelfInitiatedFlowsApiAction(params));
    },
    clearStartedFlowListDataFromRedux: () => {
      dispatch(clearStartedFlowListData());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(StartedFlowList));
