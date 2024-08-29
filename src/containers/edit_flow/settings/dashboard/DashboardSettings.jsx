import React from 'react';
import { BS } from 'utils/UIConstants';
import DefaultReportFields from '../default_report_fields_list/DefaultReportFields';
import TriggerShortcut from './trigger/TriggerShortcut';

function DashboardSettings() {
  return (
    <div className={BS.W50}>
      <DefaultReportFields />
      <TriggerShortcut />
    </div>
  );
}

export default DashboardSettings;
