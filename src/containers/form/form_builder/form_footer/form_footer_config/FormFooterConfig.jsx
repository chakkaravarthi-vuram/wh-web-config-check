import React, { useEffect, useMemo, useState } from 'react';
import { Modal, RadioGroup, SingleDropdown, RadioGroupLayout, ModalStyleType, ModalSize, TextInput, RadioSize, Tab, ETabVariation, EButtonType, Button, toastPopOver, EToastType, EToastPosition, NodeHandlerPosition } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styles from './FormFooterConfig.module.scss';
import { cloneDeep, get, isEmpty, set } from '../../../../../utils/jsUtility';
import { CREATE_FORM_STRINGS, RULE_DEFAULT_OBJECT } from '../FormFooter.string';
import CloseIconNew from '../../../../../assets/icons/CloseIconNew';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import NextStepRuleBuilder from './next_step_rule_builder/NextStepRuleBuilder';
import { ALLOW_COMMENTS, ALL_FOOTER_ACTION, BUTTON_COLOR_TYPES, BUTTON_POSITION_TYPES, CONTROL_TYPES, FOOTER_PARAMS_ID, FOOTER_PARAMS_POST_DATA_ID, FORM_ACTION_TYPES, GET_NEXT_STEP_CONDITION_RULE, GET_TAB_OPTIONS, TAB } from '../FormFooter.constant';
import { constructActionPostData, validateBasicConfiguration, validateVisibilityConfiguration } from './FormFooterConfig.utils';
import ActionVisibilityRuleBuilder from './action_visibility_rule_builder/ActionVisibilityRuleBuilder';
import { MODULE_TYPES, STEP_TYPE } from '../../../../../utils/Constants';
import gClasses from '../../../../../scss/Typography.module.scss';
import { deleteAction, getActionsApi } from '../../../../../axios/apiService/form.apiService';
import { getModuleIdByModuleType } from '../../../Form.utils';
import { normalizer } from '../../../../../utils/normalizer.utils';
import { getAllSteps } from '../../../../../axios/apiService/flow.apiService';
import { createNewStepApiThunk } from '../../../../../redux/actions/EditFlow.Action';
import { getConditionalRulesApi } from '../../../../../axios/apiService/rule.apiService';
import { saveActionThunk } from '../../../../../redux/actions/FlowStepConfiguration.Action';
import { calculateStepName, constructPostDataForCreateStep } from '../../../../edit_flow/EditFlow.utils';
import DependencyHandler from '../../../../../components/dependency_handler/DependencyHandler';
import { CONNECTOR_LINE_INIT_DATA, CONNECTOR_LINE_TYPE } from '../../../../edit_flow/diagramatic_flow_view/flow_component/FlowComponent.constants';
import { updateLoaderStatus } from '../../../../edit_flow/node_configuration/NodeConfiguration.utils';
import FlowNodeDropDown from '../../../../edit_flow/diagramatic_flow_view/flow_component/flow_node_dropdown/FlowNodeDropDown';
import SingleStepSelection from '../../../../edit_flow/step_configuration/node_configurations/branch_parallel_paths/general/SingleStepSelection';
import { CONDITION_PATH_ROUTER_STRINGS } from '../../../../edit_flow/step_configuration/node_configurations/branch_parallel_paths/BranchParallelPaths.strings';

function FormFooterConfig(props) {
    const { t } = useTranslation();
    const {
        metaData,
        // stepList = [],
        action = {},
        actions = [],
        stepDetails,
        dispatch = null,
        // onCreateStep = null,
        flowData,
        addNewNode,
    } = props;
    const reduxDispatch = useDispatch();
    const configStrings = CONDITION_PATH_ROUTER_STRINGS(t).GENERAL;

    const { FORM_BUTTON_CONFIG } = CREATE_FORM_STRINGS(t);
    const [tab, setTab] = useState(TAB.BASIC);
    const [nodeDropdown, setNewNodeDropdownData] = useState({});
    const validationMessage = action?.validationMessage || {};
    const [isInitialSubmit, setIsInitialSubmit] = useState(true);
    const [steps, setSteps] = useState([]);
    const [rules, setRules] = useState({ list: [], paginationDetails: {}, loading: false });
    const [previousActionType, setPreviousActionType] = useState('');
    const [dependencyData, setDependencyData] = useState({});
    const isInitialStepCancelBtn = stepDetails.is_subsequent_step && action.actionType === FORM_ACTION_TYPES.CANCEL;
    const filteredSteps = steps.filter((s) => ![STEP_TYPE.START_STEP].includes(s.step_type));
    const actionTypes = useMemo(() => {
        const currentActionType = action?.[FOOTER_PARAMS_ID.ACTION_TYPE];
        const types = FORM_BUTTON_CONFIG.BODY.BUTTON_TYPES;
        const isSendBackButtonExists = actions.findIndex((a) => a[FOOTER_PARAMS_ID.ACTION_TYPE] === FORM_ACTION_TYPES.SEND_BACK) > -1;
        const isCancelButtonExists = actions.findIndex((a) => a[FOOTER_PARAMS_ID.ACTION_TYPE] === FORM_ACTION_TYPES.CANCEL) > -1;
        const isReviewButtonExists = actions.findIndex((a) => a[FOOTER_PARAMS_ID.ACTION_TYPE] === FORM_ACTION_TYPES.ASSIGN_REVIEW) > -1;
        types[2].disabled = currentActionType !== FORM_ACTION_TYPES.SEND_BACK && isSendBackButtonExists;
        types[3].disabled = currentActionType !== FORM_ACTION_TYPES.CANCEL && isCancelButtonExists;
        types[4].disabled = currentActionType !== FORM_ACTION_TYPES.ASSIGN_REVIEW && isReviewButtonExists;

        const _types = stepDetails.is_subsequent_step
            ? types.slice(0, 2)
            : types;
        return _types;
    }, [actions?.length]);

    const getRules = ({ page = 1, customParams = {} }) => {
        const params = {
            page,
            size: 50,
            ...(getModuleIdByModuleType(metaData, MODULE_TYPES.FLOW)),
            ...customParams,
        };
        delete params.step_id;
        setRules({ ...rules, loading: true });
        getConditionalRulesApi(params)
            .then((data) => {
                const { pagination_data = [], pagination_details = [{}] } = data;
                const list = pagination_data.map((r) => {
                    return {
                        label: r.rule_name,
                        value: r.rule_uuid,
                        ...r,
                    };
                });
                const paginationDetails = pagination_details[0];

                if (paginationDetails?.page === 1) {
                    setRules(() => {
                        return {
                            list,
                            loading: false,
                            paginationDetails,
                        };
                    });
                } else {
                    setRules(() => {
                        return {
                            list: [...rules.list, ...list],
                            loading: false,
                            paginationDetails,
                        };
                    });
                }
            })
            .catch(() => {
                setRules({ list: [], loading: false, paginationDetails: {} });
            });
    };

    useEffect(() => {
        const params = {
            flow_id: metaData.moduleId,
            current_step_id: metaData.stepId,
        };
        getAllSteps(params)
            .then((data) => {
                const { steps = [] } = data;
                const updatedSteps = steps.map((s) => {
                    return { ...s, label: s.step_name, value: s.step_uuid };
                });
                setSteps(updatedSteps);
            })
            .catch((e) => console.error('xyz Error getAllSteps', e));
    }, []);

    useEffect(() => {
        if (isEmpty(action[FOOTER_PARAMS_ID.ACTION_UUID])) return;
        const params = {
            ...getModuleIdByModuleType(metaData, MODULE_TYPES.FLOW),
            action_uuid: action[FOOTER_PARAMS_ID.ACTION_UUID],
        };
        getActionsApi(params)
            .then((data) => {
                const action = normalizer(
                    get(data, ['flow_step', 'actions'], {}),
                    FOOTER_PARAMS_POST_DATA_ID,
                    FOOTER_PARAMS_ID,
                );
                if (action[FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE]) {
                    const nextStepRuleData = get(action, ['rule_data', 0, 'rule'], {});
                    const currentStepRules = get(action, ['rule_data'], []);

                    let lstIf = get(
                        nextStepRuleData,
                        [FOOTER_PARAMS_ID.EXPRESSION, FOOTER_PARAMS_ID.IF],
                        [],
                    );

                    lstIf = lstIf?.map((currentIf = {}) => {
                        const currentIfRule = currentStepRules?.find(
                            (rule = {}) => currentIf[FOOTER_PARAMS_ID.RULE_ID] === rule?.[FOOTER_PARAMS_ID.RULE_ID],
                        );

                        return {
                            ...currentIf,
                            [FOOTER_PARAMS_ID.RULE_NAME]: currentIfRule?.[FOOTER_PARAMS_ID.RULE_NAME],
                        };
                    });

                    set(
                        nextStepRuleData,
                        [FOOTER_PARAMS_ID.EXPRESSION, FOOTER_PARAMS_ID.IF],
                        lstIf,
                    );

                    action[FOOTER_PARAMS_ID.NEXT_STEP_RULE_CONTENT] = nextStepRuleData;
                }

                if (action[FOOTER_PARAMS_ID.IS_CONDITION_RULE]) {
                    const conditionRuleData = get(action, ['rule_data', 1], {});
                    if (conditionRuleData) action[FOOTER_PARAMS_ID.CONDITION_RULE] = conditionRuleData;
                }
                setPreviousActionType(action[FOOTER_PARAMS_ID.ACTION_TYPE]);
                dispatch(ALL_FOOTER_ACTION.UPDATE_ACTIVE_ACTION, action);
            })
            .catch((e) => console.error('xyz getActionsApi', e));
    }, [action[FOOTER_PARAMS_ID.ACTION_UUID]]);

    const validate = (validationData = {}, enableRuleValidation = false) => {
        let hasValidation = false;

        const dataToValidate = isEmpty(validationData) ? action : validationData;
        switch (tab) {
            case TAB.BASIC: {
                const validatedData = validateBasicConfiguration(dataToValidate, t, enableRuleValidation);
                dispatch(ALL_FOOTER_ACTION.UPDATE_VALIDATION_MESSAGE, validatedData);
                hasValidation = !isEmpty(validatedData);
            }
                break;
            case TAB.VISIBILITY: {
                const validatedData = validateVisibilityConfiguration(dataToValidate, t) || {};
                hasValidation = hasValidation || !isEmpty(validatedData?.validatedData);
                dispatch(ALL_FOOTER_ACTION.UPDATE_VALIDATION_MESSAGE, validatedData);
            }
                break;
            default: break;
        }

        return hasValidation;
    };

    // Tab Change Handler
    const onTabChange = (tab) => {
        const cloneAction = cloneDeep(action);
        const hasValidation = validate(cloneAction, true);
        if (!hasValidation) setTab(tab);
        else setIsInitialSubmit(false);
    };

    // Change Handler
    const onChangeHandler = (id, value) => {
        const clonedAction = cloneDeep(action);
        switch (id) {
            case FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE: {
                if (value) {
                    clonedAction[FOOTER_PARAMS_ID.NEXT_STEP_RULE_CONTENT] = GET_NEXT_STEP_CONDITION_RULE();
                    delete clonedAction[FOOTER_PARAMS_ID.NEXT_STEP_UUID];
                } else {
                    delete clonedAction[FOOTER_PARAMS_ID.NEXT_STEP_RULE_CONTENT];
                    clonedAction[FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE_HAS_VALIDATION] = false;
                }
                clonedAction[FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE] = value;
                dispatch(ALL_FOOTER_ACTION.UPDATE_ACTIVE_ACTION, clonedAction);
            }
                return;
            case FOOTER_PARAMS_ID.ACTION_TYPE: {
                clonedAction[FOOTER_PARAMS_ID.BUTTON_POSITION] = BUTTON_POSITION_TYPES.RIGHT;
                if (value === FORM_ACTION_TYPES.FORWARD) {
                    clonedAction[FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE] = false;
                    clonedAction[FOOTER_PARAMS_ID.ALLOW_COMMENTS] = ALLOW_COMMENTS.OPTIONAL;
                    clonedAction[FOOTER_PARAMS_ID.ALLOW_COMMENTS] = ALLOW_COMMENTS.OPTIONAL;
                    clonedAction[FOOTER_PARAMS_ID.BUTTON_COLOR] = BUTTON_COLOR_TYPES.POSITIVE;
                } else if (value === FORM_ACTION_TYPES.SEND_BACK) {
                    clonedAction[FOOTER_PARAMS_ID.ALLOW_COMMENTS] = ALLOW_COMMENTS.REQUIRED;
                    clonedAction[FOOTER_PARAMS_ID.BUTTON_COLOR] = BUTTON_COLOR_TYPES.NEUTRAL;
                } else if (value === FORM_ACTION_TYPES.CANCEL) {
                    clonedAction[FOOTER_PARAMS_ID.ALLOW_COMMENTS] = ALLOW_COMMENTS.REQUIRED;
                    clonedAction[FOOTER_PARAMS_ID.BUTTON_COLOR] = BUTTON_COLOR_TYPES.NEGATIVE;
                    clonedAction[FOOTER_PARAMS_ID.BUTTON_POSITION] = BUTTON_POSITION_TYPES.LEFT;
                } else if (value === FORM_ACTION_TYPES.ASSIGN_REVIEW) {
                    clonedAction[FOOTER_PARAMS_ID.ALLOW_COMMENTS] = ALLOW_COMMENTS.OPTIONAL;
                    clonedAction[FOOTER_PARAMS_ID.CONTROL_TYPE] = CONTROL_TYPES.FULL_CONTROL;
                    clonedAction[FOOTER_PARAMS_ID.BUTTON_COLOR] = BUTTON_COLOR_TYPES.NEUTRAL;
                } else {
                    clonedAction[FOOTER_PARAMS_ID.ALLOW_COMMENTS] = ALLOW_COMMENTS.OPTIONAL;
                    clonedAction[FOOTER_PARAMS_ID.BUTTON_COLOR] = BUTTON_COLOR_TYPES.POSITIVE;
                }

                if (value !== FORM_ACTION_TYPES.FORWARD) {
                    delete clonedAction[FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE];
                    delete clonedAction[FOOTER_PARAMS_ID.NEXT_STEP_RULE_CONTENT];
                    delete clonedAction[FOOTER_PARAMS_ID.NEXT_STEP_UUID];
                }
                clonedAction[id] = value;
                dispatch(ALL_FOOTER_ACTION.UPDATE_ACTIVE_ACTION, clonedAction);
                break;
            }
            case FOOTER_PARAMS_ID.CONDITION_RULE: {
                if (isEmpty(value)) {
                    delete clonedAction[FOOTER_PARAMS_ID.CONDITION_RULE];
                    clonedAction[FOOTER_PARAMS_ID.IS_CONDITION_RULE] = false;
                } else {
                    clonedAction[FOOTER_PARAMS_ID.CONDITION_RULE] = { ...value };
                    clonedAction[FOOTER_PARAMS_ID.IS_CONDITION_RULE] = true;
                }
                dispatch(ALL_FOOTER_ACTION.UPDATE_ACTIVE_ACTION, clonedAction);
                break;
            }
            case FOOTER_PARAMS_ID.NEXT_STEP_UUID: {
                clonedAction[FOOTER_PARAMS_ID.NEXT_STEP_UUID] = [value];
                clonedAction[FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE] = false;
                dispatch(ALL_FOOTER_ACTION.UPDATE_ACTIVE_ACTION, clonedAction);
                break;
            }
            default:
                clonedAction[id] = value;
                dispatch(ALL_FOOTER_ACTION.ACTIVE_ACTION_DATA_CHANGE, { [id]: value });
                break;
        }
        if (!isEmpty(validationMessage)) validate(clonedAction);
    };

    // add newly created step to steps[]
    const onAddStep = (step) => {
        const { step_name, step_uuid } = step;
        setSteps((p) => [...p, { ...step, label: step_name, value: step_uuid }]);
    };

    const onCreateStepSuccess = (step, { refId, refIndex }) => {
        const { step_uuid } = step;
        let value = step_uuid;
        let id = refId;
        onAddStep(step);
        const { IF, ELSE_OUTPUT_VALUE, OUTPUT_VALUE, EXPRESSION, NEXT_STEP_RULE_CONTENT } = FOOTER_PARAMS_ID;
        if (refId === FOOTER_PARAMS_ID.NEXT_STEP_UUID) {
            onChangeHandler(FOOTER_PARAMS_ID.NEXT_STEP_UUID, step_uuid);
        } else {
            id = NEXT_STEP_RULE_CONTENT;
            const cloneRule = cloneDeep(get(action, [FOOTER_PARAMS_ID.NEXT_STEP_RULE_CONTENT], EMPTY_STRING));
            if (refId === ELSE_OUTPUT_VALUE) {
                set(cloneRule, [EXPRESSION, ELSE_OUTPUT_VALUE], [value]);
                value = cloneRule;
            } else if (refId.includes('step-picker-')) {
                set(cloneRule, [EXPRESSION, IF, refIndex, OUTPUT_VALUE], [value]);
                value = cloneRule;
            }
        }
        onChangeHandler(id, value);
        const clonedSteps = cloneDeep(steps);
        clonedSteps.push({
            ...step,
            label: step.step_name,
            value: step.step_uuid,
        });
        setSteps(clonedSteps);
    };

    // Close Config
    const onCloseAction = () => {
        dispatch(ALL_FOOTER_ACTION.UPDATE_ACTIVE_ACTION, {});
    };

    // Delete Config
    const onDeleteAction = () => {
        const data = {
            _id: metaData.stepId,
            flow_id: metaData.moduleId,
            step_uuid: metaData.stepUUID,
            action_uuid: action[FOOTER_PARAMS_ID.ACTION_UUID],
        };
        updateLoaderStatus(true);
        deleteAction(data)
            .then((res) => {
                updateLoaderStatus(false);
                dispatch(ALL_FOOTER_ACTION.DELETE_ACTION, {
                    removedActionUUID: data.action_uuid,
                    removedSystemEnds: res.removed_system_ends || [],
                    connectedSteps: res?.connected_steps,
                });
                dispatch(ALL_FOOTER_ACTION.UPDATE_ACTIVE_ACTION, {});
                toastPopOver({
                    title: t('error_popover_status.save_report'),
                    subtitle: t('form.form_button_config.body.action_deleted'),
                    toastType: EToastType.success,
                    toastPosition: EToastPosition.BOTTOM_LEFT,
                });
            })
            .catch((err) => {
                updateLoaderStatus(false);
                const error = get(err, ['response', 'data', 'errors', 0], {});
                if (error.is_blocker) {
                    setDependencyData(error);
                } else {
                    toastPopOver({
                        title: t('server_error_code_string.somthing_went_wrong'),
                        toastType: EToastType.error,
                    });
                }
            });
    };

    // Save Action Button
    const onSaveAction = async () => {
        let clonedFlowData = cloneDeep(flowData);
        const clonedAction = cloneDeep(action);
        const hasValidation = validate(clonedAction, true);
        const stepIndex = clonedFlowData.steps.findIndex((s) => s.step_uuid === stepDetails.step_uuid);
        let connectedStepsData = [];
        if (!isEmpty(clonedFlowData.steps[stepIndex]?.connected_steps)) {
            connectedStepsData = clonedFlowData.steps[stepIndex].connected_steps;
        }
        const isActionLabelExists = actions?.some(
            (a) =>
                a[FOOTER_PARAMS_ID.ACTION_LABEL]?.toLowerCase() === clonedAction[FOOTER_PARAMS_ID.ACTION_LABEL]?.toLowerCase() &&
                a[FOOTER_PARAMS_ID.ACTION_UUID] !== get(clonedAction, [FOOTER_PARAMS_ID.ACTION_UUID], null),
        );

        if (isActionLabelExists) {
            const validationData = {
                ...validationMessage,
                [FOOTER_PARAMS_ID.ACTION_LABEL]:
                    FORM_BUTTON_CONFIG.BODY.LABEL_ALREADY_EXISTS,
            };
            dispatch(ALL_FOOTER_ACTION.UPDATE_VALIDATION_MESSAGE, validationData);
            return;
        }

        if (hasValidation) {
            setIsInitialSubmit(false);
            return;
        }

        if (
            (
                action[FOOTER_PARAMS_ID.ACTION_TYPE] === FORM_ACTION_TYPES.END_FLOW &&
                (!action[FOOTER_PARAMS_ID.ACTION_UUID] || previousActionType !== FORM_ACTION_TYPES.END_FLOW)
            )
        ) {
            try {
                const newNodeParams = {
                    stepName: calculateStepName(STEP_TYPE.END_FLOW),
                    stepType: STEP_TYPE.END_FLOW,
                };
                const nodeParams = constructPostDataForCreateStep(newNodeParams);
                const { flowData: updatedFlowData, response } = await reduxDispatch(
                    createNewStepApiThunk({
                        params: {
                            flow_id: metaData.moduleId,
                            flow_uuid: metaData.moduleUUID,
                            ...nodeParams,
                        },
                    }),
                );
                clonedFlowData = cloneDeep(updatedFlowData);
                const isCancelButton = action[FOOTER_PARAMS_ID.ACTION_TYPE] === FORM_ACTION_TYPES.CANCEL;
                connectedStepsData.push({
                    ...CONNECTOR_LINE_INIT_DATA,
                    destination_step: response?.step_uuid,
                    type: isCancelButton ? CONNECTOR_LINE_TYPE.EXCEPTION : CONNECTOR_LINE_TYPE.NORMAL,
                    source_point: isCancelButton ? NodeHandlerPosition.SPECIAL : NodeHandlerPosition.BOTTOM,
                });
                action[FOOTER_PARAMS_ID.NEXT_STEP_UUID] = [response?.step_uuid];
            } catch (e) {
                return;
            }
        }

        // add new action, connectedSteps to the flowData.steps[]
        const postData = constructActionPostData(action, metaData, connectedStepsData);

        if (stepIndex > -1) {
            clonedFlowData.steps[stepIndex].actions = [...(clonedFlowData.steps[stepIndex]?.actions || []), postData.actions];
            clonedFlowData.steps[stepIndex].connected_steps = postData.connected_steps;
        }

        reduxDispatch(saveActionThunk({
            postData: {
                ...postData,
            },
            flowDataCopy: clonedFlowData,
        }))
            .then((data) => {
                const updatedAction = {
                    ...action,
                    [FOOTER_PARAMS_ID.ACTION_UUID]: data.action_uuid,
                    [FOOTER_PARAMS_ID.ACTION_TYPE]: action[FOOTER_PARAMS_ID.ACTION_TYPE],
                    [FOOTER_PARAMS_ID.ACTION_LABEL]: action[FOOTER_PARAMS_ID.ACTION_LABEL],
                    value: action[FOOTER_PARAMS_ID.ACTION_TYPE],
                    context_data: data.context_data || {}, // needed to create connected_steps for rule based actions
                };
                const connectedSteps = (data?.connected_steps || []).map((connectedStep) => {
                    connectedStep.source_step = metaData.stepUUID;
                    return connectedStep;
                });
                const options = {
                    connectedSteps: connectedSteps,
                    removedSystemEnds: data.removed_system_ends || [],
                    contextData: data.context_data || {},
                    coordinateInfo: data.coordinate_info,
                };
                if (postData.actions.action_uuid) {
                    dispatch(ALL_FOOTER_ACTION.UPDATE_ACTION, { updatedAction, actionUUID: data.action_uuid, ...options });
                } else {
                    dispatch(ALL_FOOTER_ACTION.ADD_ACTION, { addedAction: updatedAction, ...options });
                }
                dispatch(ALL_FOOTER_ACTION.UPDATE_ACTIVE_ACTION, {});
            }).catch(() => {
                toastPopOver({
                    title: t('server_error_code_string.somthing_went_wrong'),
                    toastType: EToastType.error,
                });
            });
    };

    const addNewNodeToList = async (postData) => {
        const addNewNodeResponse = await addNewNode(postData);
        const { isSuccess, response } = addNewNodeResponse;
        if (isSuccess) {
            onCreateStepSuccess(response, nodeDropdown);
        }
        return addNewNodeResponse;
    };

    const toggleAddNewNodeDropdown = (data = {}) => {
        setNewNodeDropdownData(data);
    };

    // Modal Footer
    const getHeader = () => {
        const onCloseClickHandler = () => {
            dispatch(ALL_FOOTER_ACTION.CLEAR_ACTIVE_ACTION);
        };
        let tabOptions = GET_TAB_OPTIONS(t);
        if (stepDetails.step_type === STEP_TYPE.INTEGRATION) {
            tabOptions = tabOptions.slice(0, 1);
        }
        return (
            <div className={styles.ConfigHeader}>
                <div className={styles.HeaderTitle}>
                    <h3 className={styles.Title}>
                        {FORM_BUTTON_CONFIG.HEADER.CONTENT}
                    </h3>
                    <button onClick={onCloseClickHandler} className={styles.CloseIcon}>
                        <CloseIconNew />
                    </button>
                </div>
                <div className={styles.HeaderTab}>
                    <Tab
                        options={tabOptions}
                        selectedTabIndex={tab}
                        onClick={onTabChange}
                        variation={ETabVariation.primary}
                        bottomSelectionClass={styles.SelectedTab}
                        textClass={styles.FormFieldConfigTabText}
                    />
                </div>
            </div>
        );
    };

    // Modal Content - Basic Tab
    const getBasicTabContent = () => {
        const isSendToNextStep = get(action, [FOOTER_PARAMS_ID.ACTION_TYPE]) === FORM_BUTTON_CONFIG.BODY.BUTTON_TYPES[0].value;
        return (
            <div className={styles.ConfigBody}>
                <div className={styles.ConfigBodySubContainer}>
                    {/* Button Label */}
                    <TextInput
                        id={FOOTER_PARAMS_ID.ACTION_LABEL}
                        labelText={FORM_BUTTON_CONFIG.BODY.BUTTON_LABEL}
                        placeholder={
                            FORM_BUTTON_CONFIG.BODY
                                .BUTTON_LABEL_PLACEHOLDER
                        }
                        required
                        value={get(action, [FOOTER_PARAMS_ID.ACTION_LABEL], EMPTY_STRING)}
                        onChange={(event) => onChangeHandler(event.target.id, event.target.value)}
                        errorMessage={get(validationMessage, [FOOTER_PARAMS_ID.ACTION_LABEL], EMPTY_STRING)}
                    // readOnly={isInitialStepCancelBtn}
                    />
                    {/* Action Type */}
                    <SingleDropdown
                        id={FOOTER_PARAMS_ID.ACTION_TYPE}
                        optionList={actionTypes}
                        dropdownViewProps={{
                            labelName: FORM_BUTTON_CONFIG.BODY.BUTTON_TYPE_LABEL,
                            isRequired: true,
                            disabled: isInitialStepCancelBtn,
                        }}
                        onClick={(value) => onChangeHandler(FOOTER_PARAMS_ID.ACTION_TYPE, value)}
                        selectedValue={get(action, [FOOTER_PARAMS_ID.ACTION_TYPE], EMPTY_STRING)}
                        errorMessage={get(validationMessage, [FOOTER_PARAMS_ID.ACTION_TYPE], EMPTY_STRING)}
                    />
                    {/* Comment Status */}
                    {
                        (stepDetails.step_type !== STEP_TYPE.INTEGRATION) && (
                            <RadioGroup
                                id={FOOTER_PARAMS_ID.ALLOW_COMMENTS}
                                labelText={FORM_BUTTON_CONFIG.BODY.NEED_COMMENT_STATUS_LABEL}
                                selectedValue={get(action, [FOOTER_PARAMS_ID.ALLOW_COMMENTS], EMPTY_STRING)}
                                options={FORM_BUTTON_CONFIG.BODY.ALLOW_COMMENTS_TYPES}
                                onChange={(_e, id, value) => onChangeHandler(id, value)}
                                layout={RadioGroupLayout.stack}
                                size={RadioSize.md}
                                required
                                disabled={
                                    get(action, [FOOTER_PARAMS_ID.ACTION_TYPE], EMPTY_STRING) ===
                                    FORM_ACTION_TYPES.CANCEL
                                }
                                className={styles.NeedComments}
                                errorMessage={get(validationMessage, [FOOTER_PARAMS_ID.ALLOW_COMMENTS], EMPTY_STRING)}
                            />
                        )
                    }
                    {/* Action control */}
                    {get(action, [FOOTER_PARAMS_ID.ACTION_TYPE]) === FORM_ACTION_TYPES.ASSIGN_REVIEW && (
                        <RadioGroup
                            id={FOOTER_PARAMS_ID.CONTROL_TYPE}
                            labelText={FORM_BUTTON_CONFIG.BODY.CONTROL_TYPE_LABEL}
                            selectedValue={get(action, [FOOTER_PARAMS_ID.CONTROL_TYPE], EMPTY_STRING)}
                            options={FORM_BUTTON_CONFIG.BODY.CONTROL_TYPE_OPTIONS}
                            onChange={(_event, id, value) => onChangeHandler(id, value)}
                            layout={RadioGroupLayout.stack}
                            size={RadioSize.md}
                            required
                            className={styles.NeedComments}
                            errorMessage={get(validationMessage, [FOOTER_PARAMS_ID.CONTROL_TYPE], EMPTY_STRING)}
                        />
                    )}

                    {isSendToNextStep &&
                        <>
                            {/* Next Step Config Enabler */}
                            <RadioGroup
                                id={FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE}
                                labelText={FORM_BUTTON_CONFIG.BODY.NEXT_STEP_CONFIGURATION_LABEL}
                                options={FORM_BUTTON_CONFIG.BODY.NEXT_STEP_CONFIGURATION_OPTIONS}
                                onChange={(_e, id, value) => onChangeHandler(id, value)}
                                selectedValue={get(action, [FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE], EMPTY_STRING)}
                                required
                                errorMessage={get(validationMessage, [FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE], EMPTY_STRING)}
                            />
                            {/* Choose next step conditionally or Static Next Step Chooser   */}
                            {get(action, [FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE]) ? (
                                <NextStepRuleBuilder
                                    id={FOOTER_PARAMS_ID.NEXT_STEP_RULE_CONTENT}
                                    rule={get(action, [FOOTER_PARAMS_ID.NEXT_STEP_RULE_CONTENT], EMPTY_STRING) || RULE_DEFAULT_OBJECT}
                                    enableDynamicValidation={!isInitialSubmit}
                                    metaData={metaData}
                                    stepList={filteredSteps}
                                    onAddStep={onAddStep}
                                    onChange={onChangeHandler}
                                    validationMessage={validationMessage}
                                    rules={rules}
                                    setRules={setRules}
                                    actionName={get(action, [FOOTER_PARAMS_ID.ACTION_LABEL], EMPTY_STRING)}
                                    getRules={getRules}
                                    toggleAddNewNodeDropdown={toggleAddNewNodeDropdown}
                                    configStrings={configStrings}
                                />
                            ) : (
                                <div>
                                    <div
                                        className={cx(
                                            get(validationMessage, [FOOTER_PARAMS_ID.NEXT_STEP_UUID]) ? gClasses.CenterV : gClasses.BottomV,
                                            gClasses.GAP8,
                                        )}
                                    >
                                        <SingleStepSelection
                                            label={FORM_BUTTON_CONFIG.BODY.NEXT_STEP_DROPDOWN_LABEL}
                                            addStepLabel={configStrings.PATH.ADD_STEP_LABEL}
                                            placeholder={configStrings.STEPS_DROPDOWN.PLACEHOLDER}
                                            searchLabel={configStrings.STEPS_DROPDOWN.SEARCH.PLACEHOLDER}
                                            selectedValue={get(action, [FOOTER_PARAMS_ID.NEXT_STEP_UUID, 0], EMPTY_STRING)}
                                            errorMessage={get(validationMessage, [FOOTER_PARAMS_ID.NEXT_STEP_UUID], EMPTY_STRING)}
                                            toggleAddNewNodeDropdown={toggleAddNewNodeDropdown}
                                            refId={FOOTER_PARAMS_ID.NEXT_STEP_UUID}
                                            stepsList={cloneDeep(filteredSteps)}
                                            onClick={(value) => onChangeHandler(FOOTER_PARAMS_ID.NEXT_STEP_UUID, value)}
                                            selectedLabel={steps?.find((step) =>
                                                step.value === get(action, [FOOTER_PARAMS_ID.NEXT_STEP_UUID, 0], EMPTY_STRING))?.label
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    }
                </div>
            </div>
        );
    };

    // Modal Content - Visibility Tab
    const getVisibilityTabContent = () => (
        <div className={styles.ConfigBody}>
            {/* Next Step Config Enabler */}
            <div className={styles.ConfigBodySubContainer}>
                <ActionVisibilityRuleBuilder
                    moduleType={MODULE_TYPES.FLOW}
                    metaData={metaData}
                    ruleDetails={get(action, [FOOTER_PARAMS_ID.CONDITION_RULE], {})}
                    onChangeHandler={onChangeHandler}
                    actionName={get(action, [FOOTER_PARAMS_ID.ACTION_LABEL], EMPTY_STRING)}
                />
            </div>
        </div>
    );

    const getDependencyHandler = () => {
        if (isEmpty(dependencyData)) return null;

        return (
            <DependencyHandler
                onDeleteClick={() => { }}
                onCancelDeleteClick={() => setDependencyData({})}
                dependencyHeaderTitle={FORM_BUTTON_CONFIG.BODY.ACTION}
                dependencyData={dependencyData}
                getMoreDependency={() => { }}
            />
        );
    };

    const getMainContent = () => {
        let addNodeDropodownComponent = null;
        if (nodeDropdown?.refId) {
            addNodeDropodownComponent = (
                <FlowNodeDropDown
                    parentId={nodeDropdown?.refId}
                    referenceElement={nodeDropdown.ref}
                    removeNode={() => toggleAddNewNodeDropdown({})}
                    addNewNode={addNewNodeToList}
                    linkToParent={false}
                />
            );
        }
        let tabContent = null;
        switch (tab) {
            case TAB.BASIC:
                tabContent = getBasicTabContent();
                break;
            case TAB.VISIBILITY:
                tabContent = getVisibilityTabContent();
                break;
            default:
                break;
        }
        return (
            <>
                {tabContent}
                {addNodeDropodownComponent}
            </>
        );
    };

    // Modal Footer
    const getFooter = () => (
        <div className={cx(styles.ConfigFooter, (!isInitialStepCancelBtn && action[FOOTER_PARAMS_ID.ACTION_UUID]) ? gClasses.CenterVSpaceBetween : gClasses.RightH)}>
            {!isInitialStepCancelBtn && action[FOOTER_PARAMS_ID.ACTION_UUID] &&
                <Button
                    buttonText="Delete"
                    type={EButtonType.OUTLINE_SECONDARY}
                    className={styles.Delete}
                    onClickHandler={onDeleteAction}
                />
            }
            <div className={styles.SaveAndCancel}>
                <Button
                    buttonText="Cancel"
                    type={EButtonType.OUTLINE_SECONDARY}
                    className={styles.Cancel}
                    onClickHandler={onCloseAction}
                />
                <Button
                    buttonText="Save"
                    type={EButtonType.PRIMARY}
                    onClickHandler={onSaveAction}
                />
            </div>
        </div>
    );

    return (
        <>
            <Modal
                id="button_configuration"
                isModalOpen
                headerContent={getHeader()}
                mainContent={getMainContent()}
                footerContent={getFooter()}
                modalStyle={ModalStyleType.modal}
                modalSize={ModalSize.md}
            />
            {getDependencyHandler()}
        </>
    );
}

export default FormFooterConfig;
