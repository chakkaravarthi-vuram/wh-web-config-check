import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import ThemeContext from 'hoc/ThemeContext';
import {
  getFlowFiltersActionThunk,
  getFlowDetailsByUUID,
  getDefaultReportByUUIDThunk,
} from '../../../../../redux/actions/ApplicationDashboardReport.Action';
import jsUtility from '../../../../../utils/jsUtility';
import FlowDashboard from './flow_dashboard/FlowDashboard';
import FlowInstance from './flow_instance/FlowInstance';
import { CancelToken } from '../../../../../utils/UtilityFunctions';
import { getElementLabelWithMessage } from './Flow.utils';
import { ELEMENT_MESSAGE_TYPE, TAB_OPTIONS } from './Flow.strings';
import {
  clearFlowDashboard,
  setFlowDashboardLoader,
} from '../../../../../redux/reducer/ApplicationDashboardReportReducer';
import { getFlowAccessByUUID } from '../../../../../redux/actions/FlowDashboard.Action';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';

function Flow(props) {
  const {
    uuid: uuid_,
    componentId,
    componentLabel,
    cancelToken = new CancelToken(),
    currentPageName = EMPTY_STRING,
    componentContainer,
    isAppDashboard,
    componentDetails,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { colorScheme } = useContext(ThemeContext);
  const flowDashboard = useSelector(
    (store) => store.ApplicationDashboardReportReducer.flowDashboard,
  );
  const params = useParams();
  const flowUuid = uuid_ ?? flowDashboard[params?.uuid]?.flow_uuid;
  const uuid = flowUuid || params?.uuid;
  const instanceId = params?.flowInstanceId;
  const history = useHistory();
  const isTestBed = history.location.pathname.includes('testBed') ? 1 : 0;

  const getAccessData = (flowData) => {
    const tab = TAB_OPTIONS(t).find(
      (eachTab) => eachTab.route === params?.flowTab,
    );
    const clonedFlowData = jsUtility.cloneDeep(flowData);
    if (tab) {
      clonedFlowData.pdTabIndex = tab.tabIndex;
    }
    dispatch(
      getFlowAccessByUUID(
        { flow_uuid: uuid, is_test_bed: isTestBed },
        t,
        () => {
          dispatch(getDefaultReportByUUIDThunk({ flow_uuid: uuid })).then(() =>
            dispatch(setFlowDashboardLoader(false)),
          );
        },
        true,
        clonedFlowData,
      ),
    );
  };

  useEffect(() => {
    if (uuid) {
      dispatch(setFlowDashboardLoader(true));
      dispatch(getFlowDetailsByUUID(uuid, isTestBed))
        .then(() => {
          dispatch(getFlowFiltersActionThunk(uuid, cancelToken, t))
            .then((flowData) => {
              getAccessData(flowData);
            })
            .catch(() => {
              if (!jsUtility.isEmpty(flowDashboard[uuid])) {
                getAccessData(flowDashboard[uuid]);
              } else {
                dispatch(setFlowDashboardLoader(false));
              }
            });
        })
        .catch(() => dispatch(setFlowDashboardLoader(false)));
    }
    return () => uuid && dispatch(clearFlowDashboard({ id: uuid }));
  }, [uuid]);

  if (flowDashboard.isLoading || jsUtility.isEmpty(flowDashboard[uuid])) {
    return getElementLabelWithMessage(
      componentLabel,
      colorScheme,
      ELEMENT_MESSAGE_TYPE.LOADING,
      t,
    );
  }

  if (flowDashboard[uuid]?.errors?.type) {
    return getElementLabelWithMessage(
      componentLabel,
      colorScheme,
      ELEMENT_MESSAGE_TYPE.INVALID_ACCESS,
      t,
    );
  }

  if (
    !flowDashboard[uuid]?.filter ||
    flowDashboard[uuid].filter.inputFieldDetailsForFilter.length === 0
  ) {
    return getElementLabelWithMessage(
      componentLabel,
      colorScheme,
      ELEMENT_MESSAGE_TYPE.NO_DATA_FOUND,
      t,
    );
  }

  return (
    <div>
      <FlowDashboard
        flowData={flowDashboard[uuid]}
        componentLabel={componentLabel}
        componentId={componentId}
        cancelToken={cancelToken}
        currentPageName={currentPageName}
        holdFlowData={flowDashboard.isLoading}
        componentContainer={componentContainer}
        isAppDashboard={isAppDashboard}
        componentDetails={componentDetails}
      />
      {params?.uuid === flowUuid && instanceId && (
        <FlowInstance
          instanceId={instanceId}
          flowUuid={uuid}
          flowData={flowDashboard[uuid]}
          isTestBed={isTestBed}
        />
      )}
    </div>
  );
}

export default Flow;
