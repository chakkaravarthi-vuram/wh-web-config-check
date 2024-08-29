import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { ACTION_CONSTANTS } from './nodeReducer.contants';

const FlowNodeConfigContext = createContext();

export const nodeConfigDataChange = (data) => {
  return {
    type: ACTION_CONSTANTS.FLOW_NODE_DATA_CHANGE,
    payload: data,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.FLOW_NODE_DATA_CHANGE:
      return {
        ...state,
        ...action?.payload,
      };
    default:
      return state;
  }
};

const INITIAL_STATE = {};

function FlowNodeProvider({ children, initialState = {} }) {
  const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE, ...initialState });

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <FlowNodeConfigContext.Provider value={contextValue}>
      {children}
    </FlowNodeConfigContext.Provider>
  );
}

const useFlowNodeConfig = () => useContext(FlowNodeConfigContext);

export { FlowNodeProvider, useFlowNodeConfig };
