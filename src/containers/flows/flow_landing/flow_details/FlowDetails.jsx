import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import style from './FlowDetails.module.scss';
import FlowSummary from './flow_summary/FlowSummary';
import FlowDataContent from './flow_data_content/FlowDataContent';
import FlowSecurity from './flow_security/FlowSecurity';
import FlowAddOn from './flow_add_on/FlowAddOn';
import {
  DashboardConfig,
  INDIVIDUAL_ENTRY_MODE,
  INDIVIDUAL_ENTRY_TYPE,
  IndividualEntry,
} from '../../../shared_container';
import { FLOW_HEADER_TYPE } from '../FlowLanding.constant';
import FlowRelatedActions from './flow_related_actions/FlowRelatedActions';

function FlowDetails(props) {
  const { currentTab, metaData, flowName } = props;

  const getDetailsTabContent = () => {
    switch (currentTab) {
      case FLOW_HEADER_TYPE.SUMMARY:
        return <FlowSummary metaData={metaData} />;
      case FLOW_HEADER_TYPE.DATA:
        return <FlowDataContent metaData={metaData} />;
      case FLOW_HEADER_TYPE.SECURITY:
        return <FlowSecurity metaData={metaData} />;
      case FLOW_HEADER_TYPE.LANGUAGE:
        return <FlowAddOn metaData={metaData} />;
      case FLOW_HEADER_TYPE.ALL_DATA_REPORT:
        return <DashboardConfig isReadOnlyMode flowId={metaData.flowId} name={flowName} />;
      case FLOW_HEADER_TYPE.DATA_DASHBOARD:
        return (
          <IndividualEntry
            mode={INDIVIDUAL_ENTRY_MODE.READ_ONLY_MODE}
            type={INDIVIDUAL_ENTRY_TYPE.FLOW}
            metaData={{
              moduleId: metaData.flowId,
              moduleUuid: metaData.flowUUID,
            }}
          />
        );
      case FLOW_HEADER_TYPE.RELATED_ACTIONS:
        return <FlowRelatedActions isReadonly metaData={metaData} />;
      default:
        return null;
    }
  };

  return (
    <div className={cx(style.DetailsContainer, gClasses.PositionRelative)}>
      <div className={style.DetailsSubContainer}>{getDetailsTabContent()}</div>
    </div>
  );
}

export default FlowDetails;

FlowDetails.propTypes = {
  isBasicInfoLoading: PropTypes.bool,
  dataListID: PropTypes.string,
  currentTab: PropTypes.number,
};
