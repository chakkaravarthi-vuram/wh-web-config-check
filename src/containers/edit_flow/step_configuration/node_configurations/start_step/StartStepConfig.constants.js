import { SCHEDULAR_CONSTANTS } from '../../../../../components/automated_systems/AutomatedSystems.constants';
import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';

export const START_NODE_REQUEST_FIELD_KEYS = {
  FLOW_ID: 'flow_id',
  FLOW_UUID: 'flow_uuid',
  STEP_ID: '_id',
  STEP_UUID: 'step_uuid',
  COORINATE_INFO: 'coordinate_info',
  STEP_COORDINATES: 'step_coordinates',
  CONNECTED_STEPS: 'connected_steps',
  CONNECTOR_UUID: 'connector_uuid',
  STYLE: 'style',
  LABEL: 'label',
  INITIATORS: 'initiators',
  USERS: 'users',
  TEAMS: 'teams',
  HAS_AUTO_TRIGGER: 'has_auto_trigger',
  AUTO_TRIGGER_DETAILS: 'auto_trigger_details',
  IS_RECURSIVE: 'is_recursive',
  RECURSIVE_DATA: 'recursive_data',
  TYPE: 'type',
  TIME_AT: 'time_at',
  ON_DAYS: 'on_days',
  REPEAT_TYPE: 'repeat_type',
  ON_DATE: 'on_date',
  ON_WEEK: 'on_week',
  ON_DAY: 'on_day',
  SYSTEM_INITIATION: 'system_initiation',
  CALL_BY_FLOW: 'allow_call_by_flow',
  CALL_BY_API: 'allow_call_by_api',
  STEP_STATUS: 'step_status',
  STEP_NAME: 'step_name',
  STEP_ORDER: 'step_order',
  STEP_TYPE: 'step_type',
  VALIDATION_MESSAGE: 'validation_message',
};

export const START_NODE_RESPONSE_FIELD_KEYS = {
  FLOW_ID: 'flowId',
  FLOW_UUID: 'flowUuid',
  STEP_ID: '_id',
  STEP_UUID: 'stepUuid',
  COORINATE_INFO: 'coordinateInfo',
  STEP_COORDINATES: 'stepCoordinates',
  CONNECTED_STEPS: 'connectedSteps',
  CONNECTOR_UUID: 'connectorUuid',
  STYLE: 'style',
  LABEL: 'label',
  INITIATORS: 'initiators',
  USERS: 'users',
  TEAMS: 'teams',
  HAS_AUTO_TRIGGER: 'hasAutoTrigger',
  AUTO_TRIGGER_DETAILS: 'autoTriggerDetails',
  IS_RECURSIVE: 'isRecursive',
  RECURSIVE_DATA: 'schedulerDetails',
  TYPE: 'schedulerType',
  TIME_AT: 'schedulerTimeAt',
  ON_DAYS: 'onDays',
  REPEAT_TYPE: 'repeatType',
  ON_DATE: 'onDate',
  ON_WEEK: 'onWeek',
  ON_DAY: 'onDay',
  SYSTEM_INITIATION: 'systemInitiation',
  CALL_BY_FLOW: 'allowCallByFlow',
  CALL_BY_API: 'allowCallByApi',
  STEP_STATUS: 'stepStatus',
  STEP_NAME: 'stepName',
  STEP_ORDER: 'stepOrder',
  STEP_TYPE: 'stepType',
  VALIDATION_MESSAGE: 'validationMessage',
};

export const AUTOMATED_SYSTEMS_INITIAL_STATE = {
  daySchedulerDetails: {
      eventType: SCHEDULAR_CONSTANTS.TRIGGER_TYPE.SCHEDULER,
      schedulerType: SCHEDULAR_CONSTANTS.TYPE.DAY, // DAY, MONTH
      onDays: [SCHEDULAR_CONSTANTS.DAYS.MONDAY, SCHEDULAR_CONSTANTS.DAYS.TUESDAY, SCHEDULAR_CONSTANTS.DAYS.WEDNESDAY, SCHEDULAR_CONSTANTS.DAYS.THURSDAY, SCHEDULAR_CONSTANTS.DAYS.FIRDAY], // DAYS
      schedulerTimeAt: '12:00 AM',
  },
  monthSchedulerDetails: {
    eventType: SCHEDULAR_CONSTANTS.TRIGGER_TYPE.SCHEDULER,
    schedulerType: SCHEDULAR_CONSTANTS.TYPE.MONTH, // DAY, MONTH
    repeatType: SCHEDULAR_CONSTANTS.REPEAT_TYPE.FIRST_DAY,
    schedulerTimeAt: '12:00 AM',
  },
  repeatTypeDetails: {
    eventType: SCHEDULAR_CONSTANTS.TRIGGER_TYPE.SCHEDULER,
    schedulerType: SCHEDULAR_CONSTANTS.TYPE.MONTH,
    schedulerTimeAt: '12:00 AM',
  },
  isSaveClicked: false,
};

export const START_STEP_INITIAL_STATE = {
  flowId: null,
  _id: null,
  stepUuid: null,
  hasAutoTrigger: false,
  initiators: {},
  autoTriggerDetails: {
    [START_NODE_RESPONSE_FIELD_KEYS.IS_RECURSIVE]: false,
    [START_NODE_RESPONSE_FIELD_KEYS.RECURSIVE_DATA]: AUTOMATED_SYSTEMS_INITIAL_STATE.daySchedulerDetails,
  },
  allowCallByFlow: true,
  allowCallByApi: false,
  stepStatus: DEFAULT_STEP_STATUS,
  invalidUserTeamList: [],
};

export const START_STEP_ALL_CONSTANTS = {
  USERS: 'users',
  TEAMS: 'teams',
};
