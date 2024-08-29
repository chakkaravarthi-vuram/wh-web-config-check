import React, { createContext, useCallback, useContext, useReducer } from 'react';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const FLOW_ACTIONS = {
    DATA_CHANGE: 'data_change',

    UPDATE_SECURITY: 'update_security',
    SET_SECURITY: 'set_security',

    UPDATE_ADD_ON: 'update_addon',
    SET_ADD_ON: 'set_addon',

    UPDATE_RELATED_ACTIONS: 'update_related_actions',
    SET_RELATED_ACTIONS: 'set_related_actions',
};

const INITIAL_STATE = {
    id: EMPTY_STRING,
    uuid: EMPTY_STRING,
    name: EMPTY_STRING,
    description: EMPTY_STRING,
    status: EMPTY_STRING,
    hasRelatedFlows: false,
    hasAutoTrigger: false,

    publishErrors: {},

    security: {},
    addOn: {},
    relatedActions: {},
};

const reducer = (state, action) => {
  const cloneState = { ...state };
  switch (action.type) {
    case FLOW_ACTIONS.DATA_CHANGE: {
      const newState = { ...cloneState, ...action.payload };
      return newState;
    }

    case FLOW_ACTIONS.SET_SECURITY: {
      cloneState.security = action.payload;
      break;
    }
    case FLOW_ACTIONS.UPDATE_SECURITY: {
      cloneState.security = { ...cloneState.security, ...action.payload };
      break;
    }

    case FLOW_ACTIONS.SET_ADD_ON: {
      cloneState.addOn = action.payload;
      break;
    }
    case FLOW_ACTIONS.UPDATE_ADD_ON: {
      cloneState.addOn = { ...cloneState.addOn, ...action.payload };
      break;
    }

    case FLOW_ACTIONS.SET_RELATED_ACTIONS: {
      cloneState.relatedActions = action.payload;
      break;
    }
    case FLOW_ACTIONS.UPDATE_RELATED_ACTIONS: {
      cloneState.relatedActions = { ...cloneState.relatedActions, ...action.payload };
      break;
    }

    default:
      return state;
  }

  return cloneState;
};

const FlowReducerContext = createContext({
  state: {},
  dispatch: () => {},
});

export function FlowReducer({ children, initialState }) {
  const [state, dispatcher] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...initialState,
  });

  const dispatch = (type, data) => {
    dispatcher({ type, payload: data });
  };
  const contextValue = useCallback(
    {
      state,
      dispatch,
    },
    [state, dispatch],
  );

  return (
    <FlowReducerContext.Provider value={contextValue}>
      {children}
    </FlowReducerContext.Provider>
  );
}

const useFlow = () =>
  useContext(FlowReducerContext);

export default useFlow;
