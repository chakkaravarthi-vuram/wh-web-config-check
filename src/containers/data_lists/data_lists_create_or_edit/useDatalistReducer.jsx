import React, { createContext, useCallback, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from '../../../utils/jsUtility';

export const DL_ACTIONS = {
  DATA_CHANGE: 'dataChange',
  SECURITY_DATA_CHANGE: 'securityDataChange',
  ADD_ON_DATA_CHANGE: 'addOnDataChange',
  BASIC_DATA_CHANGE: 'basicDataChange',
  FORM_DATA_CHANGE: 'formDataChange',
  UPDATE_ERROR_LIST: 'updateErrorList',
  UPDATE_SERVER_ERROR_LIST: 'updateServerErrorList',
  CLEAR_STATE: 'clearState',
  UPDATE_RELATED_ACTIONS: 'update_related_actions',
};

const DATALIST_INITIAL_STATE = {
  security: {
    isParticipantsLevelSecurity: true,
  },
  addOn: {
    isSystemIdentifier: true,
  },
};

const reducer = (state, action) => {
  const clonedState = cloneDeep(state);
  switch (action.type) {
    case DL_ACTIONS.DATA_CHANGE: {
      const data = action?.payload || {};
      const updatedState = {
        ...clonedState,
        ...data,
      };
      return updatedState;
    }
    case DL_ACTIONS.SECURITY_DATA_CHANGE: {
      const data = action?.payload || {};
      const updatedState = {
        ...clonedState,
        security: data,
      };
      return updatedState;
    }
    case DL_ACTIONS.ADD_ON_DATA_CHANGE: {
      const data = action?.payload || {};
      const updatedState = {
        ...clonedState,
        addOn: data,
      };
      return updatedState;
    }
    case DL_ACTIONS.BASIC_DATA_CHANGE: {
      const data = action?.payload || {};
      const updatedState = {
        ...clonedState,
        basicDetails: data,
      };
      return updatedState;
    }
    case DL_ACTIONS.FORM_DATA_CHANGE: {
      const data = action?.payload || {};
      const updatedState = {
        ...clonedState,
        formData: data,
      };
      return updatedState;
    }
    case DL_ACTIONS.UPDATE_RELATED_ACTIONS: {
      const data = action?.payload || {};
      const updatedState = {
        ...clonedState,
        relatedActions: data,
      };
      return updatedState;
    }
    case DL_ACTIONS.UPDATE_ERROR_LIST: {
      const errorList = action?.payload || {};
      const updatedState = {
        ...clonedState,
        errorList: errorList,
      };
      return updatedState;
    }
    case DL_ACTIONS.UPDATE_SERVER_ERROR_LIST: {
      const serverErrorList = action?.payload || {};
      const updatedState = {
        ...clonedState,
        serverErrorList: serverErrorList,
      };
      return updatedState;
    }
    case DL_ACTIONS.CLEAR_STATE: {
      return DATALIST_INITIAL_STATE;
    }
    default: return state;
  }
};

const DatalistReducerContext = createContext({
  state: {},
  dispatch: () => {},
});

export function DatalistReducer({ children }) {
  const [state, dispatcher] = useReducer(reducer, DATALIST_INITIAL_STATE);
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
    <DatalistReducerContext.Provider value={contextValue}>
      {children}
    </DatalistReducerContext.Provider>
  );
}

export const useDatalistReducer = () =>
  useContext(DatalistReducerContext);

DatalistReducer.propTypes = {
  children: PropTypes.any,
};
