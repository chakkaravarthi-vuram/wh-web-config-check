import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import DataListAudit from './data_list_audit/DataListAudit';
import { INDIVIDUAL_ENTRY_MODE } from '../IndividualEntry.strings';
import Warning from '../warning/Warning';

function DataAudit(props) {
  const { mode, metaData } = props;
  return (
    <div className={gClasses.P24}>
    {mode === INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE && <Warning />}
      <DataListAudit
         dataListEntryId={metaData?.instanceId}
         dataListUuid={metaData?.moduleUuid}
         mode={mode}
      />
    </div>
  );
}

export default DataAudit;
