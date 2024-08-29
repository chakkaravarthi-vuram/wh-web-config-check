import { createAction, createReducer } from '@reduxjs/toolkit';
import { ADD_NEW_FIELD_ID } from 'components/form_builder/FormBuilder.strings';
import {
    EDIT_FLOW_TAB_INDEX, FLOW_STRINGS,
} from 'containers/edit_flow/EditFlow.strings';
import { EDIT_FLOW_ACTIONS } from 'redux/actions/ActionConstants';
import { FIELD_KEYS, FIELD_LIST_KEYS } from 'utils/constants/form.constant';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { cloneDeep, isEmpty, get, set } from 'utils/jsUtility';
import { store } from 'Store';
import { POLICY_STRINGS } from '../../containers/edit_flow/security/security_policy/SecurityPolicy.strings';

const INITIATE_FLOW_DATA = {
    flow_id: null,
    flow_name: EMPTY_STRING,
    saved_flow_name: EMPTY_STRING,
    flow_description: EMPTY_STRING,
    technical_reference_name: EMPTY_STRING,
    isLoadingStepDetails: false,
    selectedNodeFromDiagram: null,
    activeStepNameEditId: null,
};

export const INITIAL_FLOW_DATA = {
    ...INITIATE_FLOW_DATA,
    serverFlowData: INITIATE_FLOW_DATA,
    confirm_test: 1,
    flow_color: {},
    flow_short_code: EMPTY_STRING,
    searchStepValue: EMPTY_STRING,
    searchResults: {},
    category: {},
    categoryData: {
      categoryCurrentPage: 1,
      categoryCountPercall: 5,
      categoryTotalCount: 1,
      categoryList: [],
      newCategoryValue: EMPTY_STRING,
      categoryValueError: EMPTY_STRING,
    },
    isConditionConfigurationModalOpen: true,
    conditionConfigurationStepId: null,
    isFlowTriggerConfigurationModalOpen: false,
    anotherFlowConfigurationStepId: null,
    isFlowListLoading: false,
    allFlowsList: [],
    flowsTotalCount: 0,
    savedStepData: {},
    isChildFlowDetailsLoading: false,
    activeTriggerData: {},
    activeIntegrationData: {},
    triggerParentId: null,
    sections: [],
    steps: [],
    rule: [],
    tabIndex: EDIT_FLOW_TAB_INDEX.BASIC_INFO,
    error_list: {},
    datalist_selector_error_list: {},
    isFlowModalDisabled: false,
    flow_trigger_type: 1,
    is_system_identifier: true,
    stepStatuses: [],
    isAllFieldsLoading: true,
    all_fields_details: {
        search: EMPTY_STRING,
        page: 1,
    },
    addFormFieldsDropdownVisibilityData: {
        id: ADD_NEW_FIELD_ID,
        isVisible: false,
        sectionIndex: 0,
        stepIndex: 0,
    },
    default_report_fields: [],
      isLanguageConfigurationModalOpen: false,
      languageTranslationError: {},
    isMlIntegrationModalOpen: false,
    activeMLIntegrationData: {},
    entityViewers: {},
    entityViewerSearchValue: EMPTY_STRING,
    entityViewerSuggestionData: {},
    isRequestLoading: false,
};

const INITIAL_STATE = {
    currentSettingsPage: 0,
    isStepInfoVisible: true,
    flowSettingsModalVisibility: false,
    isNodeConfigOpen: false,
    isEditFlowView: false,
    editFlowInitialLoading: false,
    secondaryAction: 0,
    common_server_error: EMPTY_STRING,
    server_error: {},
    flowData: INITIAL_FLOW_DATA,
    [FLOW_STRINGS.SERVER_RESPONSE.NEW_STEP_ERROR_KEYS.FROM_SYSTEM_STEP_CONFIG]: EMPTY_STRING,
};

export const toggleStepInfo = createAction(EDIT_FLOW_ACTIONS.STEP_INFO_TOGGLE);

export const updateFlowDataChange = createAction(EDIT_FLOW_ACTIONS.FLOW_DATA_UPDATE, (payload) => { console.log('payload new', payload); return { payload }; });

export const updatePolicyConditon = createAction(EDIT_FLOW_ACTIONS.UPDATE_POLICY_CONDITION, (payload) => { return { payload }; });

export const clearEditFlowData = createAction(EDIT_FLOW_ACTIONS.RESET_STATE);

export const clearFlowCreationPromptData = createAction(EDIT_FLOW_ACTIONS.RESET_PROMPT_DATA);

export const updateFlowStateChange = createAction(EDIT_FLOW_ACTIONS.STATE_DATA_UPDATE, (payload) => { return { payload }; });

export const getFlowDataSuccess = createAction(EDIT_FLOW_ACTIONS.GET_FLOW_DATA_SUCCESS, (payload) => { return { payload }; });

export const saveFlowApiSuccess = createAction(EDIT_FLOW_ACTIONS.SAVE_FLOW_SUCCESS, (data) => {
    const { flow_name, flow_color, flow_description } = data;
    return {
        payload: {
            flowData: data,
            serverFlowData: { flow_name, flow_color, flow_description },
        },
    };
});

export const saveRuleAction = createAction(
    EDIT_FLOW_ACTIONS.SAVE_RULE,
        (response, id, sectionIndex, fieldListIndex, fieldIndex = null) => {
            return {
            payload: {
                response,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                id,
            },
        };
    },
);

export const saveDefaultRuleAction = createAction(
    EDIT_FLOW_ACTIONS.DEFAULT_VALUE_SAVE_RULE,
    (
        response,
        sectionIndex,
        fieldListIndex,
        fieldIndex,
      ) => {
            return {
            payload: {
                response,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
            },
        };
    },
);

export const flowSetFieldListData = createAction(EDIT_FLOW_ACTIONS.FLOW_SET_FIELD_LIST, (id, value, sectionIndex, fieldListIndex, toggle = false) => {
    return {
        payload: {
            id,
            value,
            sectionIndex,
            fieldListIndex,
            toggle,
        },
    };
});

export const flowSetFieldListValidation = createAction(EDIT_FLOW_ACTIONS.FLOW_SET_FIELD_LIST_VALIDATION, (id, value, sectionIndex, fieldListIndex, toggle = false) => {
    return {
        payload: {
            id,
            value,
            sectionIndex,
            fieldListIndex,
            toggle,
        },
    };
});

export const setEntireField = createAction(EDIT_FLOW_ACTIONS.FLOW_SET_ENTIRE_FIELD, (field, sectionIndex, fieldListIndex, fieldIndex, checkErrorCb) => {
    if (checkErrorCb) {
        const { EditFlowReducer } = store.getState();
        checkErrorCb(EditFlowReducer.flowData);
    }
    return {
        payload: {
            field,
            sectionIndex,
            fieldListIndex,
            fieldIndex,
        },
    };
});

export const setFieldWithValidations = createAction(EDIT_FLOW_ACTIONS.FLOW_SET_FIELD, (
    id,
    value,
    sectionIndex,
    fieldListIndex,
    fieldIndex,
    toggle = false,
    checkErrorCb,
    ) => {
    if (checkErrorCb) {
        const { EditFlowReducer } = store.getState();
        checkErrorCb(EditFlowReducer.flowData);
    }
    return {
        payload: {
            id,
            value,
            sectionIndex,
            fieldListIndex,
            fieldIndex,
            toggle,
        },
    };
});

export const flowDefaultRuleValueAction = createAction(EDIT_FLOW_ACTIONS.FLOW_DEFAULT_RULE_VALUE, (
        id,
        value,
        sectionIndex,
        fieldListIndex,
        fieldIndex,
        toggle,
    ) => {
    return {
        payload: {
            id,
            value,
            sectionIndex,
            fieldListIndex,
            fieldIndex,
            toggle,
        },
    };
});

export const setVisibilityData = createAction(EDIT_FLOW_ACTIONS.SET_VISIBILITY_DATA, (
    id,
    value,
    sectionIndex,
    fieldListIndex,
    fieldIndex,
    ) => {
    return {
        payload: {
            id,
            value,
            sectionIndex,
            fieldListIndex,
            fieldIndex,
        },
    };
});

export const flowOpenConfig = createAction(EDIT_FLOW_ACTIONS.FLOW_OPEN_CONFIG, (sectionIndex, fieldListIndex, fieldIndex = null) => {
    return {
        payload: {
            sectionIndex,
            fieldListIndex,
            fieldIndex,
        },
    };
});

export const flowSetStepData = createAction(
    EDIT_FLOW_ACTIONS.FLOW_SET_STEP,
    (id, value, stepIndex, toggle = false) => {
            return {
            payload: {
                id,
                value,
                stepIndex,
                toggle,
            },
        };
    },
);

export const updateNewStepName = createAction(
    EDIT_FLOW_ACTIONS.UPDATE_NEW_STEP_NAME,
    (stepName) => { return { payload: { stepName } }; },
    );

const EditFlowReducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(updateFlowDataChange, (state, { payload }) => {
            console.log('xor gate updateflowData', payload);
            state.flowData = {
                ...state.flowData,
                ...payload,
            };
        })
        .addCase(toggleStepInfo, (state) => {
            state.isStepInfoVisible = !state.isStepInfoVisible;
            console.log('isStepInfoVisible1111', state.isStepInfoVisible);
        })
        .addCase(updateFlowStateChange, (state, { payload }) => {
            console.log('xor gate update', payload);
            return {
                ...state,
                ...payload,
            };
        })
        .addCase(getFlowDataSuccess, (state, { payload }) => {
            state.flowData = {
                ...state.flowData,
                ...payload,
            };
            // state.editFlowInitialLoading = true;
        })
        .addCase(saveFlowApiSuccess, (state, { payload }) => {
            const { flowData, serverFlowData } = payload;
            state.flowData = {
                ...state.flowData,
                ...flowData,
            };
            state.serverFlowData = serverFlowData;
            state.savingFlowData = false;
        })
        .addCase(flowSetFieldListData, (state, { payload }) => {
            const {
                sectionIndex, fieldListIndex,
                id, toggle,
            } = payload;
            let { value } = payload;
            const fieldList_ = { ...state.flowData.sections[sectionIndex].field_list[fieldListIndex] };
            if (toggle) {
                value = !fieldList_[id];
                if (id === FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE && !value) {
                    delete fieldList_[FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE];
                }
            }
            fieldList_[id] = value;
            const section_ = cloneDeep(state.flowData.sections[sectionIndex]);
            section_.field_list[fieldListIndex] = fieldList_;
            const sections_ = [...state.flowData.sections];
            sections_[sectionIndex] = section_;
            return {
            ...state,
            flowData: { ...state.flowData, sections: sections_ },
            };
        })
        .addCase(flowSetFieldListValidation, (state, { payload }) => {
            const {
                sectionIndex, fieldListIndex,
            } = payload;
            const { value } = payload;
            const fieldList_ = value;
            const section_ = cloneDeep(state.flowData.sections[sectionIndex]);
            section_.field_list[fieldListIndex] = fieldList_;
            const sections_ = [...state.flowData.sections];
            sections_[sectionIndex] = section_;
            return {
            ...state,
            flowData: { ...state.flowData, sections: sections_ },
            };
        })
        .addCase(saveRuleAction, (state, { payload }) => {
            const {
                sectionIndex, fieldListIndex, fieldIndex, response, id,
            } = payload;
            const { _id } = response;
            const sections = cloneDeep(state.flowData.sections);
            if (!isEmpty(sections)) {
                const fieldData = fieldIndex !== null ? sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex] : sections[sectionIndex].field_list[fieldListIndex];
                fieldData[id] = _id;
                switch (id) {
                case FIELD_KEYS.FIELD_SHOW_WHEN_RULE:
                    fieldData[FIELD_KEYS.IS_SHOW_WHEN_RULE] = true;
                    break;
                case FIELD_KEYS.DEFAULT_VALUE_RULE:
                    fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE] = true;
                    break;
                case FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE:
                    fieldData[FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE] = true;
                    break;
                default:
                    break;
                }
                return {
                ...state,
                flowData: { ...state.flowData, sections },
              };
            }
            return { ...state };
        })
        .addCase(saveDefaultRuleAction, (state, { payload }) => {
            const {
                sectionIndex, fieldListIndex, fieldIndex, response,
            } = payload;
            const { _id } = response;
            const { sections } = state.flowData;
            sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex].field_default_value_rule = _id;
            sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex].is_field_default_value_rule = true;
            return {
                ...state,
            };
        })
        .addCase(setEntireField, (state, { payload }) => {
            const {
                sectionIndex, fieldListIndex, fieldIndex, field,
            } = payload;

            const section_ = cloneDeep(state.flowData.sections[sectionIndex]);
            section_.field_list[fieldListIndex].fields[fieldIndex] = field;
            const sections_ = [...state.flowData.sections];
            sections_[sectionIndex] = section_;

            return {
                ...state,
                flowData: { ...state.flowData, sections: sections_ },
            };
        })
        .addCase(setFieldWithValidations, (state, { payload }) => {
            const {
                sectionIndex, fieldListIndex,
                fieldIndex, id, toggle,
            } = payload;
            let { value } = payload;

            const _field = { ...state.flowData.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex] };
            if (toggle) {
                value = !_field[id];
                if (id === FIELD_KEYS.IS_SHOW_WHEN_RULE && !value) {
                    delete _field[FIELD_KEYS.FIELD_SHOW_WHEN_RULE];
                }
                if (id === FIELD_KEYS.IS_DEFAULT_VALUE_RULE && !value) {
                    delete _field[FIELD_KEYS.DEFAULT_VALUE_RULE];
                }
                // if (id === FIELD_KEYS.READ_ONLY && value) {
                //     _field[FIELD_KEYS.REQUIRED] = false;
                // } else if (id === FIELD_KEYS.REQUIRED && value) {
                //     _field[FIELD_KEYS.READ_ONLY] = false;
                // } else
                if (id === FIELD_KEYS.IS_VISIBLE && !value) {
                    delete _field[FIELD_KEYS.IS_VISIBLE];
                }
                }
                _field[id] = value;
                if (id === FIELD_KEYS.READ_ONLY) {
                if (value) {
                    _field[FIELD_KEYS.HIDE_FIELD_IF_NULL] = false;
                } else {
                    delete _field[FIELD_KEYS.HIDE_FIELD_IF_NULL];
                }
            }
            const section_ = cloneDeep(state.flowData.sections[sectionIndex]);
            section_.field_list[fieldListIndex].fields[fieldIndex] = _field;
            const sections_ = [...state.flowData.sections];
            sections_[sectionIndex] = section_;
            return {
                ...state,
                flowData: { ...state.flowData, sections: sections_ },
            };
        })
        .addCase(flowDefaultRuleValueAction, (state, { payload }) => {
            const {
                sectionIndex, fieldListIndex,
                fieldIndex, id, toggle,
            } = payload;
            let { value } = payload;

            const field_ = { ...state.flowData.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex] };
            if (toggle) {
                value = !field_.draft_default_rule[id];
                if (id === FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE && value) {
                    delete field_[FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE];
                }
                }
                let draftDefaultValueRule = cloneDeep(field_.draft_default_rule);
                if (!field_.draft_default_rule) {
                draftDefaultValueRule = {};
            }
            draftDefaultValueRule[id] = value;
            field_.draft_default_rule = draftDefaultValueRule;
            const section_ = cloneDeep(state.flowData.sections[sectionIndex]);
            section_.field_list[fieldListIndex].fields[fieldIndex] = field_;
            const sections_ = [...state.flowData.sections];
            sections_[sectionIndex] = section_;

            return {
            ...state,
            flowData: { ...state.flowData, sections: sections_ },
            };
        })
        .addCase(setVisibilityData, (state, { payload }) => {
            const {
                sectionIndex, fieldListIndex, fieldIndex, id, value,
            } = payload;
            const sections = cloneDeep(state.flowData.sections);
            const fieldData = fieldIndex === null ? sections[sectionIndex].field_list[fieldListIndex] : sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex];
            if (id === FIELD_KEYS.RULE_EXPRESSION) {
                fieldData[id] = value;
            }
            return {
                ...state,
                flowData: { ...state.flowData, sections },
            };
        })
        .addCase(flowOpenConfig, (state, { payload }) => {
            const {
                sectionIndex, fieldListIndex, fieldIndex,
            } = payload;
            const sections = cloneDeep(state.flowData.sections);
            if (fieldIndex === null) {
            sections.forEach((_section, eachSectionIndex) => {
                if (_section.field_list) {
                _section.field_list.forEach((eachFieldList, eachFieldListIndex) => {
                    if (eachFieldList[FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN]) {
                    sections[eachSectionIndex].field_list[eachFieldListIndex][FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN] = false;
                    }
                    if (eachFieldList.fields) {
                    eachFieldList.fields.forEach((eachFields, eachFieldsIndex) => {
                        if (eachFields[FIELD_KEYS.IS_CONFIG_OPEN]) {
                        sections[eachSectionIndex].field_list[eachFieldListIndex].fields[eachFieldsIndex][FIELD_KEYS.IS_CONFIG_OPEN] = false;
                        }
                    });
                    }
                });
                }
            });
            sections[sectionIndex].field_list[fieldListIndex][FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN] = true;
            } else {
            sections.forEach((_section, eachSectionIndex) => {
                if (_section.field_list) {
                _section.field_list.forEach((eachFieldList, eachFieldListIndex) => {
                    if (eachFieldList[FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN]) {
                    sections[eachSectionIndex].field_list[eachFieldListIndex][FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN] = false;
                    }
                    if (eachFieldList.fields) {
                    eachFieldList.fields.forEach((eachFields, eachFieldsIndex) => {
                        if (eachFields[FIELD_KEYS.IS_CONFIG_OPEN]) {
                        sections[eachSectionIndex].field_list[eachFieldListIndex].fields[eachFieldsIndex][FIELD_KEYS.IS_CONFIG_OPEN] = false;
                        }
                    });
                    }
                });
                }
            });
            sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex][FIELD_KEYS.IS_CONFIG_OPEN] = true;
            }
            return {
            ...state,
            flowData: { ...state.flowData, sections },
            };
        })
        .addCase(flowSetStepData, (state, { payload }) => {
            const _steps = [...state.flowData.steps];
            const { stepIndex, id, toggle } = payload;
            let { value } = payload;
            if (toggle) value = !_steps[stepIndex][id];
            _steps[stepIndex] = { ..._steps[stepIndex], [id]: value };

            return {
                ...state,
                flowData: { ...state.flowData, steps: _steps },
            };
        })
        .addCase(clearEditFlowData, () => {
            return { ...INITIAL_STATE, flowData: { ...INITIAL_FLOW_DATA, steps: [] } };
        })
        .addCase(updateNewStepName, (state, { payload: { stepName } }) => {
           state.flowData.new_step_name = stepName;
           return state;
        })
        .addCase(clearFlowCreationPromptData, (state) => {
            return { ...state, isFromPromptCreation: false, promptStepsData: [] };
        })
        .addCase(updatePolicyConditon, (state, { payload }) => {
            const clonedState = cloneDeep(state);
            const { expression, policyUUID } = payload;
            const clonedPolicies = get(clonedState, ['flowData', 'policyList'], []);
            const policyIndex = clonedPolicies.findIndex((eachPolicy) => eachPolicy?.[POLICY_STRINGS.REQUEST_KEYS.POLICY_UUID] === policyUUID);

            if (policyIndex > -1) {
                set(clonedState, ['flowData', 'policyList', policyIndex, POLICY_STRINGS.REQUEST_KEYS.POLICY], expression);
            }
            return clonedState;
        });
});

export default EditFlowReducer;
