import React from 'react';
import { hasOwn } from 'utils/UtilityFunctions';
import { BS } from 'utils/UIConstants';
import Metrics from '../metrics/Metrics';
import TriggerShortcut from './trigger/TriggerShortcut';

function DashboardSettings(props) {
  const { metrics } = props;

  return (
    <div className={BS.W50}>
      {metrics && hasOwn(metrics, 'metric_fields') && <Metrics />}
      <TriggerShortcut />
    </div>
  );
}

export default DashboardSettings;
