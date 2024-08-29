import { FLOW_DASHBOARD, TEST_BED } from '../../../urls/RouteConstants';

export const getTestBedFlowLink = (uuid) => {
  if (uuid) return `${FLOW_DASHBOARD}/${TEST_BED}/${uuid}`;

  return FLOW_DASHBOARD;
};

export const TEST_BED_FLOW_STATUS = 'published_as_test_bed';
