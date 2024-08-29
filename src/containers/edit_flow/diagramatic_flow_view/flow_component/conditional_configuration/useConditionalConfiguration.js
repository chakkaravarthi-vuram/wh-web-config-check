import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { ACTION_CONSTANTS } from './ConditionalConfiguration.constants';

const ConditionalConfigContext = createContext();

export const conditionalConfigDataChange = (data) => {
  return {
    type: ACTION_CONSTANTS.CONDITIONAL_CONFIG_DATA_CHANGE,
    payload: data,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.CONDITIONAL_CONFIG_DATA_CHANGE:
      return {
        ...state,
        ...action?.payload,
      };
    default:
      return state;
  }
};

export const INITIAL_STATE = {
  isActionLoading: true,
  forwardActions: [],
};

function ConditionalConfigProvider({ children }) {
  const [state, dispatcher] = useReducer(
    (state, action) => reducer(state, action),
    { ...INITIAL_STATE },
  );

  const dispatch = ({ type, payload }) => {
    dispatcher({ type, payload });
  };

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <ConditionalConfigContext.Provider value={contextValue}>
      {children}
    </ConditionalConfigContext.Provider>
  );
}

const useConditionalConfig = () => useContext(ConditionalConfigContext);

export { ConditionalConfigProvider, useConditionalConfig };

export default useConditionalConfig;
