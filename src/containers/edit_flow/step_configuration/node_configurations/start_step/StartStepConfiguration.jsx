import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { START_STEP_CONFIGURATION_STRINGS } from './StartStepConfiguration.strings';
import {
  isEmpty,
  cloneDeep,
  find,
  remove,
  get,
  set,
  unset,
} from '../../../../../utils/jsUtility';
import GeneralConfiguration from './general/GeneralConfiguration';
import ConfigModal from '../../../../../components/config_modal/ConfigModal';
import AdditionalConfiguration from './additional/AdditionalConfiguration';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { validate } from '../../../../../utils/UtilityFunctions';
import { automatedTriggerBasicSchema } from '../../../../../components/automated_systems/AutomatedSystems.schema';
import {
  constructServerValidationMessage,
  constructStartStepPostData,
  startStepValidateData,
} from './StartStepConfiguration.utils';
import { commonValidationSchema } from './StartStepConfiguration.validation.schema';
import { AUTOMATED_SYSTEMS_INITIAL_STATE, START_NODE_REQUEST_FIELD_KEYS, START_NODE_RESPONSE_FIELD_KEYS } from './StartStepConfig.constants';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';
import { saveStartStepApiThunk } from './StartStepConfiguration.action';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../node_configuration/use_node_reducer/useNodeReducer';
import { getStartStepApi } from '../../../../../axios/apiService/flow.apiService';
import { normalizer } from '../../../../../utils/normalizer.utils';
import { RESPONSE_AUTOMATED_SYSTEM_KEYS, SCHEDULAR_CONSTANTS } from '../../../../../components/automated_systems/AutomatedSystems.constants';
import NodeConfigError from '../../../node_configuration/node_config_error/NodeConfigError';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { displayErrorBasedOnActiveTab, getErrorTabsList, updateLoaderStatus } from '../../../node_configuration/NodeConfiguration.utils';
import { CONFIG_BUTTON_ARRAY } from '../end_step/EndStepConfig.constants';
import { parse24HrsTimeto12HoursTime } from '../../../../../utils/dateUtils';

function StartStepConfiguration(props) {
  const { activeStepId, updateFlowStateChange } = props;
  const { t } = useTranslation();
  const { state, dispatch } = useFlowNodeConfig();
  const [tabIndex, setTabIndex] = useState(NODE_CONFIG_TABS.GENERAL);

  const {
    initiators,
    errorList = {},
    triggerErrorList = {},
    autoTriggerDetails,
    hasAutoTrigger,
    isLoadingNodeDetails,
    isErrorInLoadingNodeDetails,
    serverError,
    invalidUserTeamList,
  } = state;

  let currentTabDetails = null;

  const getStartNodeDetails = async () => {
    try {
      dispatch(
        nodeConfigDataChange({
          isLoadingNodeDetails: true,
          isErrorInLoadingNodeDetails: false,
        }),
      );
      updateLoaderStatus(true);
      const response = await getStartStepApi({ _id: activeStepId });
      let stateData = normalizer(
        response,
        START_NODE_REQUEST_FIELD_KEYS,
        START_NODE_RESPONSE_FIELD_KEYS,
      );
      if (stateData?.initiators) {
        if (isEmpty(stateData?.initiators?.users)) {
          delete stateData?.initiators?.users;
        }
        if (isEmpty(stateData?.initiators?.teams)) {
          delete stateData?.initiators?.teams;
        }
        if (isEmpty(stateData?.initiators)) delete stateData?.initiators;
      }
      const { serverError, invalidUserTeamList } = constructServerValidationMessage(stateData, t);

      if (stateData?.[START_NODE_RESPONSE_FIELD_KEYS.AUTO_TRIGGER_DETAILS]?.[START_NODE_RESPONSE_FIELD_KEYS.IS_RECURSIVE]) {
        const schedulerTimeAt = get(stateData, [START_NODE_RESPONSE_FIELD_KEYS.AUTO_TRIGGER_DETAILS, START_NODE_RESPONSE_FIELD_KEYS.RECURSIVE_DATA, START_NODE_RESPONSE_FIELD_KEYS.TIME_AT]);
        set(stateData, [START_NODE_RESPONSE_FIELD_KEYS.AUTO_TRIGGER_DETAILS, START_NODE_RESPONSE_FIELD_KEYS.RECURSIVE_DATA, START_NODE_RESPONSE_FIELD_KEYS.TIME_AT], parse24HrsTimeto12HoursTime(schedulerTimeAt));
      }

      stateData = {
        ...stateData,
        ...stateData?.systemInitiation,
        serverError,
        invalidUserTeamList,
      };
      console.log('getStartStepApiThunk', stateData);
      updateLoaderStatus(false);
      dispatch(
        nodeConfigDataChange({
          ...stateData,
          isLoadingNodeDetails: false,
        }),
      );
    } catch (e) {
      console.log(e, 'error in loading');
      updateLoaderStatus(false);
      dispatch(
        nodeConfigDataChange({
          isLoadingNodeDetails: false,
          isErrorInLoadingNodeDetails: true,
        }),
      );
    }
  };

  useEffect(() => {
    if (!isEmpty(activeStepId)) {
      getStartNodeDetails();
    }
  }, [activeStepId]);

  const validatedData = (updatedData) => {
    const commonDataTobeValidated = startStepValidateData(updatedData);
    const commonErrorList = validate(
      commonDataTobeValidated,
      constructJoiObject(commonValidationSchema(t)),
    );
    let triggerErrorList = {};

    if (hasAutoTrigger) {
      triggerErrorList = validate({
        ...(updatedData?.autoTriggerDetails?.schedulerDetails || {}),
      },
        constructJoiObject(automatedTriggerBasicSchema(t)));
    }
    console.log('triggerErrorList', triggerErrorList, 'dataToValidate', updatedData?.autoTriggerDetails?.schedulerDetails || {});

    return {
      commonErrorList,
      triggerErrorList,
    };
  };

  const onStatusChangeHandler = (id, value) => {
    dispatch(
      nodeConfigDataChange({
        [id]: value,
      }),
    );
  };

  const onChangeHandler = (
    id,
    value,
  ) => {
    const clonedAutoTriggerDetails = cloneDeep(autoTriggerDetails);
    const clonedTriggerErrorList = cloneDeep(triggerErrorList);
    set(clonedAutoTriggerDetails, [START_NODE_RESPONSE_FIELD_KEYS.RECURSIVE_DATA, id], value);
    const { TYPE } = SCHEDULAR_CONSTANTS;
    const { SCHEDULER_DETAILS, SCHEDULER_TYPE, REPEAT_TYPE, ON_DATE, ON_WEEK, ON_DAY, SCHEDULER_TIME_AT, ON_DAYS } = RESPONSE_AUTOMATED_SYSTEM_KEYS;
    const schedulerDetails = get(clonedAutoTriggerDetails, [SCHEDULER_DETAILS], {});
    console.log('onChangeStartStep_id', id, 'value', value, 'schedulerDetails', schedulerDetails);

    if (id === SCHEDULER_TYPE) {
      if (get(clonedAutoTriggerDetails, [SCHEDULER_DETAILS, SCHEDULER_TYPE], EMPTY_STRING) === TYPE.DAY) {
        set(clonedAutoTriggerDetails, [SCHEDULER_DETAILS], AUTOMATED_SYSTEMS_INITIAL_STATE.daySchedulerDetails);
      } else {
        set(clonedAutoTriggerDetails, [SCHEDULER_DETAILS], AUTOMATED_SYSTEMS_INITIAL_STATE.monthSchedulerDetails);
      }
    }

    if (id === REPEAT_TYPE) {
      if (get(clonedAutoTriggerDetails, [SCHEDULER_DETAILS, SCHEDULER_TYPE], EMPTY_STRING) === TYPE.MONTH) {
        const repeatTypeDetails = cloneDeep(AUTOMATED_SYSTEMS_INITIAL_STATE.repeatTypeDetails);
        repeatTypeDetails.repeatType = value;
        if (value === SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_WEEK_DAY) {
          repeatTypeDetails.onWeek = 1;
          repeatTypeDetails.onDay = 1;
        } else if (value === SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_DATE) {
          repeatTypeDetails.onDate = 1;
        }
        set(clonedAutoTriggerDetails, [SCHEDULER_DETAILS], repeatTypeDetails);
        console.log('REPEAT_TYPE-month', 'repeatTypeDetails', repeatTypeDetails, 'clonedAutoTriggerDetails', clonedAutoTriggerDetails);
      }
      unset(clonedTriggerErrorList, [ON_DATE]);
      unset(clonedTriggerErrorList, [ON_DAY]);
      unset(clonedTriggerErrorList, [ON_WEEK]);
    }

    if (schedulerDetails?.[SCHEDULER_TYPE] === TYPE.DAY) {
      unset(clonedTriggerErrorList, [REPEAT_TYPE]);
      unset(clonedTriggerErrorList, [ON_DATE]);
      unset(clonedTriggerErrorList, [ON_DAY]);
      unset(clonedTriggerErrorList, [ON_WEEK]);
      unset(clonedTriggerErrorList, [SCHEDULER_TIME_AT]);
    } else if (schedulerDetails?.[SCHEDULER_TYPE] === TYPE.MONTH) {
      unset(clonedTriggerErrorList, [ON_DAYS]);
      unset(clonedTriggerErrorList, [SCHEDULER_TIME_AT]);
    }

    unset(clonedTriggerErrorList, [id]);

    dispatch(
      nodeConfigDataChange({
        autoTriggerDetails: clonedAutoTriggerDetails,
        triggerErrorList: clonedTriggerErrorList,
      }),
    );
  };

  const onRadioChangeHandler = (_event, id, value) => {
    dispatch(
      nodeConfigDataChange({
        [id]: value,
        errorList: {},
      }),
    );
  };

  const onCheckChangeHandler = (_value, id) => {
    dispatch(
      nodeConfigDataChange({
        [id]: !get(state, [id], false),
      }),
    );
  };

  const onUserSelectHandler = (event) => {
    const team_or_user = event.target.value;

    let clonedInitiators = cloneDeep(initiators);

    const clonedErrorList = cloneDeep(errorList);
    const clonedServerError = cloneDeep(serverError);
    const clonedInvalidUserTeamList = cloneDeep(invalidUserTeamList);
    if (event?.target?.removeUserValue) {
      const id = cloneDeep(event.target.value);
      const currentInvalidIndex = clonedInvalidUserTeamList?.findIndex((invalidUserTeamObj) => invalidUserTeamObj?._id === id);
      if (currentInvalidIndex > -1) {
        clonedInvalidUserTeamList.splice(currentInvalidIndex, 1);

        if (isEmpty(clonedInvalidUserTeamList)) {
          delete clonedServerError?.[START_NODE_RESPONSE_FIELD_KEYS.INITIATORS];
        } else {
          const invalidUserTeam = clonedInvalidUserTeamList?.map((currentUserTeam) => currentUserTeam?.email || currentUserTeam?.team_name);
          clonedServerError[START_NODE_RESPONSE_FIELD_KEYS.INITIATORS] = `${START_STEP_CONFIGURATION_STRINGS(t).VALIDATION_CONSTANTS.INVALID_USERS_TEAMS}: ${invalidUserTeam?.join(', ')}`;
        }
      }
      if (clonedInitiators?.teams) {
        if (find(clonedInitiators.teams, { _id: id })) {
          remove(clonedInitiators.teams, { _id: id });
          if (clonedInitiators.teams.length === 0) {
            delete clonedInitiators.teams;
          }
        }
      }
      if (clonedInitiators?.users) {
        if (find(clonedInitiators.users, { _id: id })) {
          remove(clonedInitiators.users, { _id: id });
          if (clonedInitiators.users.length === 0) {
            delete clonedInitiators.users;
          }
        }
      }
    } else {
      if (!clonedInitiators) clonedInitiators = {};
      if (team_or_user.is_user) {
        if (clonedInitiators?.users) {
          if (
            !find(clonedInitiators.users, {
              _id: team_or_user._id,
            })
          ) {
            clonedInitiators.users.push(team_or_user);
          }
        } else {
          clonedInitiators.users = [];
          clonedInitiators.users.push(team_or_user);
        }
      } else if (!team_or_user.is_user) {
        if (team_or_user.user_type) {
          if (clonedInitiators?.users) {
            if (
              !find(clonedInitiators?.users, {
                _id: team_or_user._id,
              })
            ) {
              clonedInitiators.users.push(team_or_user);
            }
          } else {
            clonedInitiators.users = [];
            clonedInitiators.users.push(team_or_user);
          }
        } else {
          if (clonedInitiators?.teams) {
            if (
              !find(clonedInitiators?.teams, {
                _id: team_or_user._id,
              })
            ) {
              clonedInitiators?.teams.push(team_or_user);
            }
          } else {
            clonedInitiators.teams = [];
            clonedInitiators.teams.push(team_or_user);
          }
        }
      }
    }
    delete clonedErrorList?.[START_NODE_RESPONSE_FIELD_KEYS.INITIATORS];
    const updatedData = {
      errorList: clonedErrorList,
      serverError: clonedServerError,
      invalidUserTeamList: clonedInvalidUserTeamList,
    };
    if (!isEmpty(clonedInitiators)) {
      updatedData[event.target.id] = clonedInitiators;
    } else {
      updatedData[event.target.id] = null;
    }
    dispatch(
      nodeConfigDataChange(updatedData),
    );
  };

  const closeStartConfiguration = () => {
    updateFlowStateChange({
      selectedStepType: null,
      activeStepId: null,
    });
  };

  const handleErrors = (errorList) => {
    dispatch(nodeConfigDataChange({
      errorList,
    }));
  };

  const onSaveClicked = () => {
    const { commonErrorList, triggerErrorList } = validatedData(state);
    if (isEmpty(serverError) && isEmpty(commonErrorList) && isEmpty(triggerErrorList)) {
      const postData = constructStartStepPostData(state);
      console.log('onSaveClicked postData', postData);
      saveStartStepApiThunk({ data: postData, updateFlowStateChange, dispatch, handleErrors, stateData: state, t });
    } else {
      displayErrorBasedOnActiveTab(tabIndex, state?.stepType, { ...commonErrorList, ...triggerErrorList, ...serverError }, t);
    }
    dispatch(
      nodeConfigDataChange({
        errorList: commonErrorList,
        triggerErrorList,
        isSaveClicked: true,
      }),
    );
  };

  const onTabChange = (value) => {
    setTabIndex(value);
  };

  const onStepNameChangeHandler = (e, isOnBlur) => {
    const { target: { id } } = e;
    let { target: { value } } = e;
    let errors = {};
    const { errorList = {} } = cloneDeep(state);
    if (isOnBlur) {
      value = value?.trim?.();
    }
    if (errorList?.[id] || isOnBlur) {
      errors = validate({ stepName: value?.trim?.() }, constructJoiObject({ [id]: basicNodeValidationSchema(t)?.[id] }));
    }
    if (isEmpty(errors)) {
      delete errorList?.[id];
    }
    dispatch(
      nodeConfigDataChange({
        [id]: value,
        errorList: {
          ...errorList,
          ...errors,
        },
      }),
    );
  };

  if (!isLoadingNodeDetails) {
    if (isErrorInLoadingNodeDetails) {
      currentTabDetails = (
        <NodeConfigError />
      );
    } else {
      if (tabIndex === NODE_CONFIG_TABS.GENERAL) {
        currentTabDetails = (
          <GeneralConfiguration
            onChangeHandler={onChangeHandler}
            onRadioChangeHandler={onRadioChangeHandler}
            errorList={errorList}
            triggerErrorList={triggerErrorList}
            onUserSelectHandler={onUserSelectHandler}
          />
        );
      } else {
        currentTabDetails = (
          <AdditionalConfiguration
            onCheckChangeHandler={onCheckChangeHandler}
            onStatusChangeHandler={onStatusChangeHandler}
            onStepNameChangeHandler={onStepNameChangeHandler}
          />
        );
      }
    }
  }

  return (
    <ConfigModal
      isModalOpen
      errorTabList={state?.isSaveClicked && getErrorTabsList(
        state?.stepType,
        state?.errorList,
      )}
      onCloseClick={closeStartConfiguration}
      tabOptions={START_STEP_CONFIGURATION_STRINGS(t).GENERAL.getTabOptions()}
      modalBodyContent={currentTabDetails}
      modalTitle={START_STEP_CONFIGURATION_STRINGS(t).TITLE}
      currentTab={tabIndex}
      onTabSelect={onTabChange}
      footerButton={CONFIG_BUTTON_ARRAY(onSaveClicked, closeStartConfiguration, t)}
    />
  );
}
export default StartStepConfiguration;
