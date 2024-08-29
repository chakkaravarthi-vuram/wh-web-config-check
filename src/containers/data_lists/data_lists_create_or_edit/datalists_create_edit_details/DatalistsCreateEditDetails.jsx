/* eslint-disable no-use-before-define */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import DatalistCreateEditCaptureData from './datalists_create_edit_capture_data/DatalistsCreateEditCaptureData';
import DatalistsCreateEditSetSecurity from './datalists_create_edit_set_security/DatalistsCreateEditSetSecurity';
import DatalistsCreateEditLanguageAndOthers from './datalists_create_edit_language_and_others/LanguageAndOthers';
import {
  DashboardConfig,
  IndividualEntry,
  INDIVIDUAL_ENTRY_MODE,
  INDIVIDUAL_ENTRY_TYPE,
} from '../../../shared_container';
import { EDIT_DATALIST_HEADER_TYPE, ERROR_LIST_TYPE } from '../DatalistsCreateEdit.constant';
import DatalistUserSystem from '../../data_list_landing/datalist_details/datalist_user_system_action/DatalistUserSystems';
import gClasses from '../../../../scss/Typography.module.scss';
import DataAudit from '../../../shared_container/individual_entry/data_audit/DataAudit';

function DatalistsCreateEditDetails(props) {
  const {
    currentTab,
    dataListID,
    dataListUUID,
    dataListData = {},
    dispatch,
    onDataChangeHandler,
    commonErrorList,
    onUpdateError,
  } = props;

  const getDatalistCreateEditDetails = () => {
    switch (currentTab) {
      case EDIT_DATALIST_HEADER_TYPE.DATA: {
        return (
          <DatalistCreateEditCaptureData
            metaData={{ moduleId: dataListData?.id, formUUID: dataListData?.formData?.formUUID }}
            formData={dataListData?.formData || {}}
            onDataChangeHandler={onDataChangeHandler}
            formErrors={commonErrorList?.formErrors || {}}
          />);
      }
      case EDIT_DATALIST_HEADER_TYPE.SECURITY: return <DatalistsCreateEditSetSecurity dataListID={dataListID} securityData={dataListData?.security} errorList={dataListData?.errorList?.securityError} onDataChangeHandler={onDataChangeHandler} />;
      case EDIT_DATALIST_HEADER_TYPE.ALL_DATA_REPORT: return (
        <DashboardConfig
          dataListId={dataListID}
          name={dataListData?.dataListName}
          dataReportErrors={commonErrorList?.dataReportErrors || {}}
          onUpdateError={(error) => onUpdateError(error, ERROR_LIST_TYPE.DATA_REPORT)}
        />
      );
      case EDIT_DATALIST_HEADER_TYPE.DATA_DASHBOARD: return (
        <IndividualEntry
          mode={INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE}
          type={INDIVIDUAL_ENTRY_TYPE.DATA_LIST}
          metaData={{
            moduleId: dataListID,
            moduleUuid: dataListUUID,
          }}
          individualEntryErrors={commonErrorList?.individualEntryErrors || {}}
          dashboardErrors={commonErrorList?.dashboardErrors}
          onUpdateError={(error) => onUpdateError(error, ERROR_LIST_TYPE.INDIVIDUAL_ENTRY)}
        />
      );
      case EDIT_DATALIST_HEADER_TYPE.RELATED_ACTIONS: return <DatalistUserSystem dispatch={dispatch} metaData={{ dataListId: dataListID, dataListUUID: dataListUUID, dataListName: dataListData?.dataListName, hasRelatedFlows: dataListData?.hasRelatedFlows }} className={gClasses.P24} triggerDetails={dataListData?.trigger_details} />;
      case EDIT_DATALIST_HEADER_TYPE.ADD_ON: return <DatalistsCreateEditLanguageAndOthers dataListUUID={dataListUUID} dataListID={dataListID} addOnData={dataListData?.addOn} errorList={dataListData?.errorList?.addOnError} onDataChangeHandler={onDataChangeHandler} />;
      case EDIT_DATALIST_HEADER_TYPE.DATA_AUDIT: return (
        <DataAudit
          mode={INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE}
          metaData={{
            moduleId: dataListID,
            moduleUuid: dataListUUID,
          }}
        />
      );
      default: return null;
    }
  };

  return (
    <div className={cx(gClasses.Flex1, gClasses.WhiteBackground)}>
      {getDatalistCreateEditDetails()}
    </div>
  );
}

export default DatalistsCreateEditDetails;

DatalistsCreateEditDetails.propTypes = {
  currentTab: PropTypes.number,
  dataListID: PropTypes.string,
  dataListUUID: PropTypes.string,
  dataListData: PropTypes.object,
  dispatch: PropTypes.func,
  onDataChangeHandler: PropTypes.func,
  commonErrorList: PropTypes.object,
};
