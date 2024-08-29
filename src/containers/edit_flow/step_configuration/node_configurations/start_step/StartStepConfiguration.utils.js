import { cloneDeep, pick, set, isEmpty } from 'utils/jsUtility';
import { get } from 'lodash';
import {
  START_NODE_REQUEST_FIELD_KEYS,
  START_NODE_RESPONSE_FIELD_KEYS,
  START_STEP_ALL_CONSTANTS,
} from './StartStepConfig.constants';
import { SCHEDULAR_CONSTANTS } from '../../../../../components/automated_systems/AutomatedSystems.constants';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { START_STEP_CONFIGURATION_STRINGS } from './StartStepConfiguration.strings';
import { parse12HrsTimeto24HoursTime } from '../../../../../utils/dateUtils';

export const startStepValidateData = (stateDataParam = {}) => {
  const stateData = cloneDeep(stateDataParam);

  const validateData = pick(stateData, [
    START_NODE_RESPONSE_FIELD_KEYS.STEP_NAME,
    START_NODE_RESPONSE_FIELD_KEYS.HAS_AUTO_TRIGGER,
    START_NODE_RESPONSE_FIELD_KEYS.INITIATORS,
    START_NODE_RESPONSE_FIELD_KEYS.CALL_BY_FLOW,
    START_NODE_RESPONSE_FIELD_KEYS.CALL_BY_API,
  ]);

  return validateData;
};

export const constructAutoTriggerDetailsPostData = (autoTriggerDetailsParam = {}) => {
  const clonedAutoTriggerDetails = cloneDeep(autoTriggerDetailsParam);
  const { schedulerDetails = {} } = clonedAutoTriggerDetails;
  const postDataTriggerDetails = {
    [START_NODE_REQUEST_FIELD_KEYS.IS_RECURSIVE]: true,
  };
  set(postDataTriggerDetails, [START_NODE_REQUEST_FIELD_KEYS.RECURSIVE_DATA, START_NODE_REQUEST_FIELD_KEYS.TIME_AT], parse12HrsTimeto24HoursTime(schedulerDetails?.[START_NODE_RESPONSE_FIELD_KEYS.TIME_AT]));
  if (schedulerDetails?.[START_NODE_RESPONSE_FIELD_KEYS.TYPE] === SCHEDULAR_CONSTANTS.TYPE.DAY) {
    set(postDataTriggerDetails, [START_NODE_REQUEST_FIELD_KEYS.RECURSIVE_DATA, START_NODE_REQUEST_FIELD_KEYS.TYPE], SCHEDULAR_CONSTANTS.TYPE.DAY);
    set(postDataTriggerDetails, [START_NODE_REQUEST_FIELD_KEYS.RECURSIVE_DATA, START_NODE_REQUEST_FIELD_KEYS.ON_DAYS], schedulerDetails?.[START_NODE_RESPONSE_FIELD_KEYS.ON_DAYS]);
  } else {
    const repeatType = get(schedulerDetails, [START_NODE_RESPONSE_FIELD_KEYS.REPEAT_TYPE], EMPTY_STRING);
    set(postDataTriggerDetails, [START_NODE_REQUEST_FIELD_KEYS.RECURSIVE_DATA, START_NODE_REQUEST_FIELD_KEYS.TYPE], SCHEDULAR_CONSTANTS.TYPE.MONTH);
    switch (repeatType) {
      case SCHEDULAR_CONSTANTS.REPEAT_TYPE.FIRST_DAY:
        set(postDataTriggerDetails, [START_NODE_REQUEST_FIELD_KEYS.RECURSIVE_DATA, START_NODE_REQUEST_FIELD_KEYS.REPEAT_TYPE], SCHEDULAR_CONSTANTS.REPEAT_TYPE.FIRST_DAY);
        break;
      case SCHEDULAR_CONSTANTS.REPEAT_TYPE.LAST_DAY:
        set(postDataTriggerDetails, [START_NODE_REQUEST_FIELD_KEYS.RECURSIVE_DATA, START_NODE_REQUEST_FIELD_KEYS.REPEAT_TYPE], SCHEDULAR_CONSTANTS.REPEAT_TYPE.LAST_DAY);
        break;
      case SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_WEEK_DAY:
        set(postDataTriggerDetails, [START_NODE_REQUEST_FIELD_KEYS.RECURSIVE_DATA, START_NODE_REQUEST_FIELD_KEYS.REPEAT_TYPE], SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_WEEK_DAY);
        set(postDataTriggerDetails, [START_NODE_REQUEST_FIELD_KEYS.RECURSIVE_DATA, START_NODE_REQUEST_FIELD_KEYS.ON_WEEK], schedulerDetails?.[START_NODE_RESPONSE_FIELD_KEYS.ON_WEEK]);
        set(postDataTriggerDetails, [START_NODE_REQUEST_FIELD_KEYS.RECURSIVE_DATA, START_NODE_REQUEST_FIELD_KEYS.ON_DAY], schedulerDetails?.[START_NODE_RESPONSE_FIELD_KEYS.ON_DAY]);
        break;
      case SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_DATE:
        set(postDataTriggerDetails, [START_NODE_REQUEST_FIELD_KEYS.RECURSIVE_DATA, START_NODE_REQUEST_FIELD_KEYS.REPEAT_TYPE], SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_DATE);
        set(postDataTriggerDetails, [START_NODE_REQUEST_FIELD_KEYS.RECURSIVE_DATA, START_NODE_REQUEST_FIELD_KEYS.ON_DATE], schedulerDetails?.[START_NODE_RESPONSE_FIELD_KEYS.ON_DATE]);
        break;
      default:
        break;
    }
  }
  return postDataTriggerDetails;
};

export const constructStartStepPostData = (stateDataParam) => {
  const stateData = cloneDeep(stateDataParam);
  const postData = {};

  set(
    postData,
    [START_NODE_REQUEST_FIELD_KEYS.FLOW_ID],
    stateData?.[START_NODE_RESPONSE_FIELD_KEYS.FLOW_ID],
  );

  set(
    postData,
    [START_NODE_REQUEST_FIELD_KEYS.STEP_ID],
    stateData?.[START_NODE_RESPONSE_FIELD_KEYS.STEP_ID],
  );

  set(
    postData,
    [START_NODE_REQUEST_FIELD_KEYS.STEP_UUID],
    stateData?.[START_NODE_RESPONSE_FIELD_KEYS.STEP_UUID],
  );

  set(
    postData,
    [START_NODE_REQUEST_FIELD_KEYS.HAS_AUTO_TRIGGER],
    stateData?.[START_NODE_RESPONSE_FIELD_KEYS.HAS_AUTO_TRIGGER],
  );

  set(
    postData,
    [START_NODE_REQUEST_FIELD_KEYS.STEP_NAME],
    stateData?.[START_NODE_RESPONSE_FIELD_KEYS.STEP_NAME],
  );

  set(
    postData,
    [START_NODE_REQUEST_FIELD_KEYS.STEP_STATUS],
    stateData?.[START_NODE_RESPONSE_FIELD_KEYS.STEP_STATUS],
  );

  if (stateData?.[START_NODE_RESPONSE_FIELD_KEYS.COORINATE_INFO]?.[START_NODE_RESPONSE_FIELD_KEYS.STEP_COORDINATES]) {
    set(
      postData,
      [START_NODE_REQUEST_FIELD_KEYS.COORINATE_INFO],
      {
        [START_NODE_REQUEST_FIELD_KEYS.STEP_COORDINATES]: stateData[START_NODE_RESPONSE_FIELD_KEYS.COORINATE_INFO][START_NODE_RESPONSE_FIELD_KEYS.STEP_COORDINATES],
      },
    );
  }

  if (!isEmpty(stateData?.[START_NODE_RESPONSE_FIELD_KEYS.INITIATORS])) {
    const initiatorPostData = {};

    if (
      stateData?.[START_NODE_RESPONSE_FIELD_KEYS.INITIATORS]?.teams &&
      stateData?.[START_NODE_RESPONSE_FIELD_KEYS.INITIATORS]?.teams?.length > 0
    ) {
      initiatorPostData.teams = stateData?.initiators?.teams.map(
        (team) => team._id,
      );
    }

    if (
      stateData?.[START_NODE_RESPONSE_FIELD_KEYS.INITIATORS]?.users &&
      stateData?.[START_NODE_RESPONSE_FIELD_KEYS.INITIATORS]?.users?.length > 0
    ) {
      initiatorPostData.users = stateData?.[
        START_NODE_RESPONSE_FIELD_KEYS.INITIATORS
      ]?.users.map((user) => user._id);
    }
    set(postData, [START_NODE_REQUEST_FIELD_KEYS.INITIATORS], initiatorPostData);
  } else {
    const initiatorPostData = {
      users: [],
      teams: [],
    };

    set(postData, [START_NODE_REQUEST_FIELD_KEYS.INITIATORS], initiatorPostData);
  }

  const systemInitiation = {
    [START_NODE_REQUEST_FIELD_KEYS.CALL_BY_FLOW]:
      stateData?.[START_NODE_RESPONSE_FIELD_KEYS.CALL_BY_FLOW],
    [START_NODE_REQUEST_FIELD_KEYS.CALL_BY_API]:
      stateData?.[START_NODE_RESPONSE_FIELD_KEYS.CALL_BY_API],
  };

  set(postData, [START_NODE_REQUEST_FIELD_KEYS.SYSTEM_INITIATION], systemInitiation);

  if (stateData?.[START_NODE_RESPONSE_FIELD_KEYS.HAS_AUTO_TRIGGER]) {
    const autoTriggerDetails = constructAutoTriggerDetailsPostData(stateData?.[START_NODE_RESPONSE_FIELD_KEYS.AUTO_TRIGGER_DETAILS]);

    set(postData, [START_NODE_REQUEST_FIELD_KEYS.AUTO_TRIGGER_DETAILS], autoTriggerDetails);
  }

  return postData;
};

export const constructServerValidationMessage = (resDataParam = {}, t) => {
  const { initiators, validationMessage } = resDataParam;
  const { USERS, TEAMS } = START_STEP_ALL_CONSTANTS;

  if (!isEmpty(validationMessage)) {
    const errorList = {};
    const invalidUserTeam = [];
    const invalidUserTeamList = [];

    validationMessage?.forEach((eachMessage) => {
      if (eachMessage.field.includes(USERS) || eachMessage.field.includes(TEAMS)) {
        const userTeamIndex = eachMessage.field.split('.')[2];
        const userTeamKey = eachMessage.field.split('.')[1];

        const invalidObj = get(initiators, [userTeamKey, Number(userTeamIndex)], {});
        if (invalidObj?.first_name) {
          const name = [invalidObj?.first_name];
          if (invalidObj?.last_name) {
            name.push(invalidObj?.last_name);
          }
          invalidUserTeam.push(name.join(' '));
        } else invalidUserTeam.push(invalidObj?.email || invalidObj?.team_name);
        invalidUserTeamList.push(invalidObj);
      }
    });

    errorList.initiators = `${START_STEP_CONFIGURATION_STRINGS(t).VALIDATION_CONSTANTS.INVALID_USERS_TEAMS}: ${invalidUserTeam?.join(', ')}`;

    return { serverError: errorList, invalidUserTeamList };
  }

  return {};
};
