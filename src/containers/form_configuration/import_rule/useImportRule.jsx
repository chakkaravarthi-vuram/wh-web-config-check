import { useEffect, useReducer } from 'react';
import { isEmpty, compact, cloneDeep } from '../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

const IMPORT_RULE_LIST_SIZE = 100;

const IMPORT_RULE_INITIAL_STATE = {
    ruleList: [],
    selectedRuleIds: [],
    searchStep: EMPTY_STRING,
    searchRule: EMPTY_STRING,
    stepOptionList: [],
    selectedStep: null,
};

const ACTION_LIST = {
    DATA_CHANGE: 'data_change',
    UPDATED_RULE_LIST: 'update_rule_list',
    CLEAR_REDUCER: 'clear',
};

const importRuleReducer = (state, action) => {
  const payload = action?.payload;
  switch (action.type) {
    case ACTION_LIST.DATA_CHANGE:
       return {
         ...state,
         ...(payload || {}),
       };
    case ACTION_LIST.UPDATED_RULE_LIST:
        const { pagination_data } = payload;
        return {
            ...state,
            ruleList: pagination_data,
        };
    case ACTION_LIST.CLEAR_REDUCER:
        return IMPORT_RULE_INITIAL_STATE;
    default: break;
  }
  return state;
};

const getStepOptionList = (stepList = [], search = EMPTY_STRING) => {
    if (isEmpty(stepList)) return [];
    const optionList = stepList.map((eachStep) => {
       if (search) {
           if ((eachStep?.step_name || EMPTY_STRING).includes(search)) {
            return {
                label: eachStep?.step_name,
                value: eachStep?.form_uuid,
            };
           } else return null;
       } else {
        return {
            label: eachStep?.step_name,
            value: eachStep?.form_uuid,
        };
       }
    });
    return compact(optionList);
};

const useImportRule = (
    stepList,
    getRuleList,
    getMetadata = () => {},
) => {
    const [state, dispatch] = useReducer(importRuleReducer, IMPORT_RULE_INITIAL_STATE);

    const loadRuleList = (page, search = EMPTY_STRING, form_uuid) => {
        const params = {
          size: IMPORT_RULE_LIST_SIZE,
          page,
          ...(getMetadata?.() || {}),
          ...(form_uuid ? { form_uuid } : {}),
          is_import: 1,
        };
                if (search) params.search = search;
        getRuleList(params, (paginatedRuleList) => dispatch({
             type: ACTION_LIST.UPDATED_RULE_LIST,
             payload: paginatedRuleList,
        }));
    };

    useEffect(() => {
        if (stepList.length === 0) return;
        dispatch({
            type: ACTION_LIST.DATA_CHANGE,
            payload: { selectedStep: stepList[0].form_uuid },
        });
    }, []);

    useEffect(() => {
        dispatch({
            type: ACTION_LIST.DATA_CHANGE,
            payload: { stepOptionList: getStepOptionList(stepList, state?.searchStep) },
        });
    }, [state?.searchStep]);

    useEffect(() => {
      if (stepList.length === 0) return;
      loadRuleList(1, state.searchRule, stepList[0].form_uuid);
    }, [state.searchRule]);

    const onSearchRule = (event) => {
       const value = event.target?.value;
       dispatch({ type: ACTION_LIST.DATA_CHANGE, payload: { searchRule: value } });
    };

    const onSearchStep = (event) => {
       const value = event.target?.value;
       dispatch({ type: ACTION_LIST.DATA_CHANGE, payload: { searchStep: value } });
    };

    const onStepClick = (form_uuid) => {
        loadRuleList(1, state.searchRule, form_uuid);
        dispatch({ type: ACTION_LIST.DATA_CHANGE, payload: { selectedStep: form_uuid } });
    };

    const onSelectAllRule = (formUUID) => {
        const ruleList = isEmpty(state.ruleList) ? [] : cloneDeep(state.ruleList);
        const preSelectedRuleIds = compact(ruleList.map((rule) => {
            if (rule.form_uuids.includes(formUUID)) return rule._id;
            return null;
        }));
        const selectedRuleIds = isEmpty(state.selectedRuleIds) ? [] : cloneDeep(state.selectedRuleIds);
        let allRuleIds = ruleList.map((eachRule) => eachRule._id);
        allRuleIds = allRuleIds.filter((ruleId) => !preSelectedRuleIds.includes(ruleId));
        dispatch({ type: ACTION_LIST.DATA_CHANGE, payload: { selectedRuleIds: selectedRuleIds.length === (ruleList.length - preSelectedRuleIds.length) ? [] : allRuleIds } });
    };

    const onSelectRule = (id, formUUID) => {
        const ruleList = isEmpty(state.ruleList) ? [] : cloneDeep(state.ruleList);
        const preSelectedRuleIds = compact(ruleList.map((rule) => {
            if (rule.form_uuids.includes(formUUID)) return rule._id;
            return null;
        }));
        const selectedRuleIds = isEmpty(state.selectedRuleIds) ? [] : cloneDeep(state.selectedRuleIds);
        let consolidatedRuleIds = [...selectedRuleIds];
        if (preSelectedRuleIds.includes(id)) return;
        if (selectedRuleIds.includes(id)) {
            consolidatedRuleIds = selectedRuleIds.filter((eachRuleId) => eachRuleId !== id);
        } else {
            consolidatedRuleIds.push(id);
        }
        dispatch({ type: ACTION_LIST.DATA_CHANGE, payload: { selectedRuleIds: consolidatedRuleIds } });
    };

    return {
        state,
        onStepClick,
        onSelectRule,
        onSelectAllRule,
        onSearchRule,
        onSearchStep,
    };
};

export default useImportRule;
