import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import FlowCaptureData from './capture_data/FlowCaptureData';
import FlowCreateEditSetSecurity from './flow_security/FlowCreateEditSetSecurity';
import FlowCreateEditLanguageAndOthers from './language_and_others/LanguageAndOthers';
import {
  DashboardConfig,
  INDIVIDUAL_ENTRY_MODE,
  INDIVIDUAL_ENTRY_TYPE,
  IndividualEntry,
} from '../../../shared_container';
import { EDIT_FLOW_HEADER_TYPE } from '../FlowCreateOrEdit.constant';
import FlowCreateEditRelatedActions from './related_actions/FlowCreateEditRelatedActions';
import { apiGetAllSystemFieldsList } from '../../../../axios/apiService/flow.apiService';
import { FLOW_ACTIONS } from '../../useFlow';
import jsUtility from '../../../../utils/jsUtility';

function FlowCreateOrEditDetails(props) {
  const {
    currentTab,
    state,
    dispatch,
    metaData,
    dashboardErrors,
    onUpdateError,
  } = props;
  const [systemFields, setSystemFields] = useState({});
  useEffect(() => {
    apiGetAllSystemFieldsList()
      .then((res) => {
        setSystemFields(res);
      })
      .catch(() => setSystemFields([]));
  }, []);

  const onUpdateTabError = (error, tabType) => {
    if (jsUtility.isEmpty(error)) {
      const publishErrors = { ...(state.publishErrors || {}) };
      switch (tabType) {
        case EDIT_FLOW_HEADER_TYPE.ALL_DATA_REPORT:
          publishErrors.dashboard = [];
          break;
        case EDIT_FLOW_HEADER_TYPE.DATA_DASHBOARD:
          publishErrors.dataDashboard = [];
          break;
        default:
          break;
      }
      dispatch(FLOW_ACTIONS.DATA_CHANGE, { publishErrors });
    }
  };

  const renderComponentBasedOnTab = () => {
    switch (currentTab) {
      case EDIT_FLOW_HEADER_TYPE.DATA:
        return (
          <FlowCaptureData
            metaData={metaData}
            systemFields={systemFields?.flow_system_field}
            stepStatusList={state.stepStatuses}
            flowName={state?.name}
          />
        );
      case EDIT_FLOW_HEADER_TYPE.SECURITY:
        return (
          <FlowCreateEditSetSecurity
            metaData={metaData}
            security={state.security}
            dispatch={dispatch}
          />
        );
      case EDIT_FLOW_HEADER_TYPE.LANGUAGE:
        return (
          <FlowCreateEditLanguageAndOthers
            metaData={metaData}
            dispatch={dispatch}
            addOn={state.addOn}
          />
        );
      case EDIT_FLOW_HEADER_TYPE.ALL_DATA_REPORT:
        return (
          <DashboardConfig
            flowId={metaData?.flowId}
            name={state?.name}
            dataReportErrors={dashboardErrors?.dataReportErrors || {}}
            onUpdateError={(error) => onUpdateError((prev) => {
              onUpdateTabError(error, EDIT_FLOW_HEADER_TYPE.ALL_DATA_REPORT);
              return { ...prev, dataReportErrors: error };
            })}
          />
        );
      case EDIT_FLOW_HEADER_TYPE.DATA_DASHBOARD:
        return (
          <IndividualEntry
            mode={INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE}
            type={INDIVIDUAL_ENTRY_TYPE.FLOW}
            metaData={{
              moduleId: metaData?.flowId,
              moduleUuid: metaData?.flowUUID,
            }}
            dashboardErrors={dashboardErrors}
            individualEntryErrors={dashboardErrors?.individualEntryErrors || {}}
            onUpdateError={(error) => onUpdateError((prev) => {
              onUpdateTabError(error, EDIT_FLOW_HEADER_TYPE.DATA_DASHBOARD);
              return { ...prev, individualEntryErrors: error };
            })}
          />
        );
      case EDIT_FLOW_HEADER_TYPE.RELATED_ACTIONS:
        return (
          <FlowCreateEditRelatedActions
            metaData={metaData}
            dispatch={dispatch}
            state={state}
            relatedActions={state.relatedActions}
            systemFields={systemFields}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cx(gClasses.Flex1, gClasses.WhiteBackground)}>
      {renderComponentBasedOnTab()}
    </div>
  );
}

export default FlowCreateOrEditDetails;
