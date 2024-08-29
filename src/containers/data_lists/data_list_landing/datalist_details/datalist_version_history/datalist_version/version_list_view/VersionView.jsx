import React from 'react';
import jsUtils from '../../../../../../../utils/jsUtility';
import VersionList from './version_list/VersionList';

function AuditView(props) {
  const {
    onDetailedViewClick,
    versionHistory,
    haMore,
    onLoadMoreCallHandler,
    isVersionHistoryLoading,
  } = props;
  console.log('propsprops', props);

  return (
    <div>
      {!jsUtils.isEmpty(versionHistory) && (
          <div>
          <VersionList
            onDetailedViewClick={onDetailedViewClick}
            versionHistory={versionHistory}
            isIntialLoading={isVersionHistoryLoading}
            hasMore={haMore}
            onLoadMoreHandler={onLoadMoreCallHandler}
          />
          </div>
      )}
    </div>
  );
}

export default AuditView;
