import { useReducer } from 'react';
import { SCHEDULAR_CONSTANTS, SCHEDULER_REDUCER_CONSTANTS } from '../AutomatedSystems.constants';
import { getAutomatedSystemCBInitialState } from '../AutomatedSystems.utils';

const INITIAL_STATE = {
    eventType: SCHEDULAR_CONSTANTS.TRIGGER_TYPE.SCHEDULER,
    monitoringField: null,
    schedulerType: SCHEDULAR_CONSTANTS.TYPE.DAY, // DAY, MONTH
    schedulerTimeAt: SCHEDULER_REDUCER_CONSTANTS.SCHEDULER_DEFAULT_TIME, // to be updated in constants
    onDays: [1, 2, 3, 4, 5], // DAYS
    repeatType: SCHEDULAR_CONSTANTS.REPEAT_TYPE.FIRST_DAY, // MONTH OPTIONS - 1,2,3,4
    onDate: SCHEDULER_REDUCER_CONSTANTS.SCHEDULER_DEFAULT_DATE,
    onWeek: SCHEDULER_REDUCER_CONSTANTS.SCHEDULER_DEFAULT_WEEK, //  1st WEEK
    onDay: null, // DAY
    offset: 0,
    conditionType: SCHEDULAR_CONSTANTS.CONDITION_TYPE.ALL,
    trigger: SCHEDULAR_CONSTANTS.TRIGGER.FLOW,
    isRecursive: true,
    isWorking: false,
    flowActions: {
        childFlowUUID: null,
        triggerMapping: [],
        mappingErrorList: {},
        fieldDetails: [],
    },
    errorList: {},
    documentDetails: {},
};

export const AUTOMATED_SYSTEM_ACTION = {
    DATA_CHANGE: 'data_change',
    SCHEDULAR_DATA_CHANGE: 'schedular_data_change',
    CONDITION_DATA_CHANGE: 'condition_data_change',
    TRIGGER_MAPPING_DATA_CHANGE: 'scheduler_data_change',
    UPDATE_ERROR_LIST: 'update_error_list',
    CLEAR_STATE: 'clear_state',
    SET_STATE: 'set_state',
};

const reducer = (state, action) => {
   const clonedState = { ...state };

   switch (action.type) {
    case AUTOMATED_SYSTEM_ACTION.DATA_CHANGE: {
        const { id, value } = action.payload || {};
        clonedState[id] = value;

        if (id === 'conditionType') {
            clonedState[id] = value;

            if (value === SCHEDULAR_CONSTANTS.CONDITION_TYPE.ALL) {
                clonedState.condition = null;
            } else {
                clonedState.condition = getAutomatedSystemCBInitialState();
            }
        }

        if (id === 'eventType') {
            return {
                ...INITIAL_STATE,
                eventUUID: clonedState.eventUUID,
                id: clonedState.id,
                eventType: value,
                flowActions: clonedState.flowActions,
                conditionType: clonedState.conditionType,
                condition: clonedState.condition,
                trigger: clonedState.trigger,
            };
        }

        return clonedState;
    }

    case AUTOMATED_SYSTEM_ACTION.TRIGGER_MAPPING_DATA_CHANGE: {
        const { id, value, options } = action.payload || {};
        const flowActions = { ...clonedState.flowActions };
        if (id === 'childFlowUUID' && value !== flowActions?.childFlowUUID) {
            flowActions.childFlowUUID = value;
            flowActions.childFlowId = options?.flowId;
            flowActions.childFlowName = options?.label;
            flowActions.triggerMapping = [];
            flowActions.serverTriggerMapping = [];
        } else if (id === 'triggerMapping') {
            const { triggerMapping = [], mappingErrorList = {}, documentDetails = {} } = value;
            flowActions.triggerMapping = triggerMapping;
            clonedState.errorList = { ...clonedState.errorList, mappingErrorList };
            clonedState.documentDetails = documentDetails || clonedState.documentDetails;
        } else {
            flowActions[id] = value;
        }

        return { ...clonedState, flowActions: flowActions };
    }

    case AUTOMATED_SYSTEM_ACTION.UPDATE_ERROR_LIST: {
        const errorList = action.payload;
        clonedState.errorList = errorList;
        return clonedState;
    }

    case AUTOMATED_SYSTEM_ACTION.SET_STATE: {
        const newState = { ...state, ...action.payload };
        return newState;
    }

    case AUTOMATED_SYSTEM_ACTION.CLEAR_STATE: {
        return INITIAL_STATE;
    }

    default: break;
   }

   return clonedState;
};

const useConfigureAutomatedSystem = () => {
    const [state, dispatcher] = useReducer(reducer, INITIAL_STATE);
    const dispatch = (type, data) => {
        dispatcher({ type, payload: data });
   };

    return { state, dispatch };
};

export default useConfigureAutomatedSystem;
