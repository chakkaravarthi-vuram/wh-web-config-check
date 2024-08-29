import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RESPONSE_TYPE } from '../../../../../../utils/Constants';
import jsUtility from '../../../../../../utils/jsUtility';
import ResponseHandler from '../../../../../../components/response_handlers/ResponseHandler';
import VersionView from './version_list_view/VersionView';
import styles from './DataListVersion.module.scss';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { getGetDatalistVersionHistoryByUUID } from '../../../../../../redux/actions/IndividualEntry.Action';
import { versionHistoryChanges } from '../../../../../../redux/reducer/IndividualEntryReducer';
import DetailedVersionView from './version_detailed_view/DetailedVersionView';

function DataListVersion(props) {
  const [detailedView, setDetailedView] = useState(true);
  const [selectedVersionHistory, setselectedVersionHistory] = useState('');
  const toogleDetailedView = (
    auditDetails = {},
  ) => {
    setDetailedView(!detailedView);
    setselectedVersionHistory(auditDetails);
  };

  const {
    dataListEntryId,
    dataListUuid,
    dispatch,
    common_server_error,
    versionHistory,
    onversionHistoryChanges,
    isVersionHistoryLoading,
  } = props;
  console.log('getGetDatalistVersionHistoryByUUIDparams', props);
  const sortDataListByVersion = (dataListVersion) => dataListVersion.sort((a, b) => b.version - a.version);

  const getDatalistVersion = () => {
    const params = {
      data_list_entry_id: dataListEntryId,
      data_list_uuid: dataListUuid,
    };
    console.log('getGetDatalistVersionHistoryByUUIDparams', params);
    dispatch(getGetDatalistVersionHistoryByUUID(params)).then((response) => {
      onversionHistoryChanges(sortDataListByVersion(response));
    });
  };
  useEffect(() => {
    getDatalistVersion();
  }, []);
  return !jsUtility.isEmpty(common_server_error) ? (
    <ResponseHandler
      className={gClasses.MT90}
      messageObject={{
        type: RESPONSE_TYPE.SERVER_ERROR,
        title: 'Access Denied',
        subTitle: "You don't have access to this instance",
      }}
    />
  ) : (
    <div className={styles.OuterContainer}>
      {detailedView ? (
        <VersionView
          onDetailedViewClick={toogleDetailedView}
          onDataListDataChange
          versionHistory={versionHistory}
          isVersionHistoryLoading={isVersionHistoryLoading}
        />
      ) : (
        <DetailedVersionView
          selectedVersionHistory={selectedVersionHistory}
          dataListEntryId={dataListEntryId}
          dataListUuid={dataListUuid}
          toogleDetailedView={toogleDetailedView}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    versionHistory: state.IndividualEntryReducer.datalist_version_history.versionHistory,
    isVersionHistoryLoading: state.IndividualEntryReducer.datalist_version_history.isVersionHistoryLoading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onversionHistoryChanges: (data) => {
      dispatch(versionHistoryChanges(data));
    },
    dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DataListVersion);
