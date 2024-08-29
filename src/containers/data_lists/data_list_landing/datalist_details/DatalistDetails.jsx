import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import style from './DatalistDetails.module.scss';
import DatalistSummary from './datalist_summary/DatalistSummary';
import DatalistDataContent from './datalist_data_content/DatalistDataContent';
import DatalistDataSecurity from './datalist_data_security/DatalistDataSecurity';
import DatalistUserSystem from './datalist_user_system_action/DatalistUserSystems';
import DatalistAddOn from './datalist_add_on/DatalistAddOn';
import {
  DashboardConfig,
  INDIVIDUAL_ENTRY_MODE,
  INDIVIDUAL_ENTRY_TYPE,
  IndividualEntry,
} from '../../../shared_container';
import { DATALIST_HEADER_TYPE } from '../DatalistsLanding.constant';
import { useDatalistReducer } from '../../data_lists_create_or_edit/useDatalistReducer';
import DataVersion from './datalist_version_history/DataVersion';

function DatalistDetails(props) {
  const { isBasicInfoLoading, dataListID, currentTab, dataListUUID, dataListName } = props;

  const { dispatch } = useDatalistReducer();

  const getDetailsTabContent = () => {
    switch (currentTab) {
      case DATALIST_HEADER_TYPE.SUMMARY:
        return (
          <DatalistSummary
            isBasicInfoLoading={isBasicInfoLoading}
            dataListID={dataListID}
          />
        );
      case DATALIST_HEADER_TYPE.DATA:
        return <DatalistDataContent dataListID={dataListID} />;
      case DATALIST_HEADER_TYPE.SECURITY:
        return <DatalistDataSecurity dataListID={dataListID} />;
      case DATALIST_HEADER_TYPE.LANGUAGE:
        return <DatalistAddOn dataListID={dataListID} />;
      case DATALIST_HEADER_TYPE.ALL_DATA_REPORT:
        return <DashboardConfig isReadOnlyMode dataListId={dataListID} name={dataListName} />;
      case DATALIST_HEADER_TYPE.DATA_DASHBOARD:
        return (
          <IndividualEntry
            mode={INDIVIDUAL_ENTRY_MODE.READ_ONLY_MODE}
            type={INDIVIDUAL_ENTRY_TYPE.DATA_LIST}
            metaData={{
              moduleId: dataListID,
              moduleUuid: dataListUUID,
            }}
          />
        );
      case DATALIST_HEADER_TYPE.RELATED_ACTIONS:
        return <DatalistUserSystem metaData={{ dataListId: dataListID }} isReadonly dispatch={dispatch} />;
      case DATALIST_HEADER_TYPE.ADD_ON:
        return <DatalistAddOn dataListID={dataListID} />;
      case DATALIST_HEADER_TYPE.DATA_AUDIT:
        return (
        <DataVersion
          mode={INDIVIDUAL_ENTRY_MODE.READ_ONLY_MODE}
          metaData={{
            moduleId: dataListID,
            moduleUuid: dataListUUID,
          }}
        />);
      default:
        return <DatalistSummary />;
    }
  };

  return (
    <div className={cx(style.DetailsContainer, gClasses.PositionRelative)}>
      <div className={style.DetailsSubContainer}>{getDetailsTabContent()}</div>
    </div>
  );
}

export default DatalistDetails;

DatalistDetails.propTypes = {
  isBasicInfoLoading: PropTypes.bool,
  dataListID: PropTypes.string,
  currentTab: PropTypes.number,
};
