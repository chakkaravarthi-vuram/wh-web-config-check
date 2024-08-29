import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { ACTION_CONSTANTS } from './manageFlowFieldsReducer.constants';

const ManageFlowFieldContext = createContext();

export const manageFlowFieldsConfigDataChange = (data) => {
  return {
    type: ACTION_CONSTANTS.MANAGE_FLOW_FIELDS_DATA_CHANGE,
    payload: data,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.MANAGE_FLOW_FIELDS_DATA_CHANGE:
      return {
        ...state,
        ...action?.payload,
      };
    default:
      return state;
  }
};

const INITIAL_STATE = {};

function ManageFlowFieldsProvider({ children, initialState = {} }) {
  const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE, ...initialState });

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <ManageFlowFieldContext.Provider value={contextValue}>
      {children}
    </ManageFlowFieldContext.Provider>
  );
}

const useManageFlowFieldsConfig = () => useContext(ManageFlowFieldContext);

export { ManageFlowFieldsProvider, useManageFlowFieldsConfig };
