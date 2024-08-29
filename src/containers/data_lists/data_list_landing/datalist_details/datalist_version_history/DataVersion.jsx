import React from 'react';
import DataListVersion from './datalist_version/DataListVersion';

function DataVersion(props) {
  const { mode, metaData } = props;
  console.log('DataListAudit', props);
  return (
    <div>
      <DataListVersion
         dataListEntryId={metaData?.instanceId}
         dataListUuid={metaData?.moduleUuid}
         mode={mode}
      />
    </div>
  );
}

export default DataVersion;
