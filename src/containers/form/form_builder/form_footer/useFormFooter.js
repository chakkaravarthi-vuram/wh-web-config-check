import { useReducer } from 'react';
import { ACTIVE_ACTION_INITIAL_STATE, ALL_FOOTER_ACTION, FOOTER_PARAMS_ID } from './FormFooter.constant';
import { cloneDeep, set } from '../../../../utils/jsUtility';

const INITIAL_STATE = {
    actions: [],
    activeAction: {},
    validationMessage: {},
};

const reducer = (state, action, onFormActionUpdate) => {
  switch (action?.type) {
    case ALL_FOOTER_ACTION.UPDATE_ACTIVE_ACTION: {
        const actionData = action.payload;
        const clonedState = cloneDeep(state);

        return {
           ...clonedState,
           activeAction: actionData,
        };
    }
    case ALL_FOOTER_ACTION.ACTIVE_ACTION_DATA_CHANGE: {
        const actionData = action.payload;
        const clonedState = cloneDeep(state);

        return {
           ...clonedState,
           activeAction: { ...clonedState.activeAction, ...actionData },
        };
    }
    case ALL_FOOTER_ACTION.UPDATE_NEXT_STEP_RULE_IF_LST: {
      const { ifExpression, index } = action.payload;
      const clonedActiveAction = cloneDeep(state?.activeAction);

      set(clonedActiveAction, [FOOTER_PARAMS_ID.NEXT_STEP_RULE_CONTENT, 'if', index], ifExpression);

      return {
        ...state,
        activeAction: clonedActiveAction,
     };
    }
    case ALL_FOOTER_ACTION.CLEAR_ACTIVE_ACTION: {
        return {
            ...state,
            activeAction: {},
        };
    }
    case ALL_FOOTER_ACTION.UPDATE_VALIDATION_MESSAGE: {
        const validationMessage = action?.payload || {};
        const clonedState = cloneDeep(state);

        return {
            ...clonedState,
            activeAction: {
                ...clonedState?.activeAction,
                validationMessage,
            },
        };
    }
    case ALL_FOOTER_ACTION.ADD_ACTION: {
        const clonedState = cloneDeep(state);
        const { addedAction } = action.payload;
        const actions = [...clonedState.actions, cloneDeep(addedAction)];
        onFormActionUpdate(actions, { ...action.payload });
        return {
            ...clonedState,
            actions,
        };
    }
    case ALL_FOOTER_ACTION.UPDATE_ACTION: {
        const clonedState = cloneDeep(state);
        const { updatedAction, actionUUID } = action.payload;
        const actions = clonedState.actions.map((a) => {
            if (a[FOOTER_PARAMS_ID.ACTION_UUID] === actionUUID) {
                return cloneDeep(updatedAction);
            }
            return a;
        });
        onFormActionUpdate(actions, { ...action.payload });
        return {
            ...clonedState,
            actions,
        };
    }
    case ALL_FOOTER_ACTION.DELETE_ACTION: {
        const clonedState = cloneDeep(state);
        const { removedActionUUID, removedSystemEnds = [], connectedSteps = [] } = action.payload;
        let deletedAction;
        const actions = clonedState.actions.filter(
          (a) => {
            if (a[FOOTER_PARAMS_ID.ACTION_UUID] !== removedActionUUID) return true;
            else {
                deletedAction = cloneDeep(a);
                return false;
            }
        });
        onFormActionUpdate(actions, { deletedAction, removedSystemEnds, connectedSteps });
        return {
            ...clonedState,
            actions,
        };
    }
    default: break;
  }

  return state;
};

const useFormFooter = (actions = [], onFormActionUpdate) => {
    const { ACTION_UUID } = FOOTER_PARAMS_ID;
    const [state, dispatcher] = useReducer(
      (state, action) =>
        reducer(state, action, onFormActionUpdate),
      { ...INITIAL_STATE, ...{ actions } },
    );

    const dispatch = (type, data) => {
        dispatcher({ type, payload: data });
    };

    const onEdit = (actionUUID) => {
        const action = state.actions.find((a) => a[ACTION_UUID] === actionUUID);
        dispatch(ALL_FOOTER_ACTION.UPDATE_ACTIVE_ACTION, { [ACTION_UUID]: actionUUID, ...action });
      };

    const onAddNew = () => {
        dispatch(ALL_FOOTER_ACTION.UPDATE_ACTIVE_ACTION, ACTIVE_ACTION_INITIAL_STATE);
      };

    return {
        state,
        dispatch,
        onAddNew,
        onEdit,
    };
};

export default useFormFooter;
