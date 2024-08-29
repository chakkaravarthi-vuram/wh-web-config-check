import { PICKER_STRINGS } from '../../../../components/form_components/gradient_picker/GradientPicker.strings';
import { parseDateFromUTC } from '../../../../utils/dateUtils';
import { nullCheck } from '../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { STARTED_FLOW_LIST_STRINGS } from './StartedFlowList.strings';
import styles from './started_flow_card/StartedFlowCard.module.scss';

export const getStatusBoxClasses = (status) => {
  switch (status) {
    case 'inprogress':
      return styles.InProgressStatusBox;
    case 'completed':
      return styles.CompletedStatusBox;
    case 'cancelled':
      return styles.CancelledStatusBox;
    default:
      return null;
  }
};

export const getStatusTextClasses = (status) => {
  switch (status) {
    case 'inprogress':
      return styles.InProgressStatusText;
    case 'completed':
      return styles.CompletedStatusText;
    case 'cancelled':
      return styles.CancelledStatusText;
    default:
      return null;
  }
};

export const getStatusTitleString = (initiated_on, processed_on) => {
  const initiatedDisplayString = nullCheck(initiated_on, 'pref_tz_datetime')
    ? `Flow initiated on ${parseDateFromUTC(initiated_on.pref_tz_datetime)}(${initiated_on.duration_display})`
    : EMPTY_STRING;
  const processedDisplayString = nullCheck(processed_on, 'pref_tz_datetime')
    ? ` & processed on ${parseDateFromUTC(initiated_on.pref_tz_datetime)}(${processed_on.duration_display})`
    : EMPTY_STRING;
  return initiatedDisplayString + processedDisplayString;
};

const getStatusDisplayText = (status) => {
  switch (status) {
    case 'inprogress':
      return STARTED_FLOW_LIST_STRINGS.STATUS[0].LABEL;
    case 'completed':
      return STARTED_FLOW_LIST_STRINGS.STATUS[1].LABEL;
    case 'cancelled':
      return STARTED_FLOW_LIST_STRINGS.STATUS[2].LABEL;
    default:
      return null;
  }
};

export const validateAndProcessStartedFlowListData = (flowListData) => flowListData.map((eachItem) => {
    return {
      ...eachItem,
      identifier: nullCheck(eachItem, 'identifier') && eachItem.identifier.toUpperCase(),
      flow_color: eachItem.flow_color || PICKER_STRINGS.COLOR_LIST[0],
      statusDisplayText: getStatusDisplayText(eachItem.status),
    };
  });
