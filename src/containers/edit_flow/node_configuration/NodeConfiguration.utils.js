import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { RESPONSE_AUTOMATED_SYSTEM_KEYS } from '../../../components/automated_systems/AutomatedSystems.constants';
import { getUserPickerOptionList } from '../../../components/user_picker/UserPicker.utils';
import { VALIDATION_CONSTANT } from '../../../server_validations/serverValidation.constant';
import { FILE_UPLOAD_STATUS, STEP_TYPE } from '../../../utils/Constants';
import { displayErrorToast } from '../../../utils/flowErrorUtils';
import { translateFunction, cloneDeep, isEmpty, set, compact, pick, isUndefined, isArray, has, get } from '../../../utils/jsUtility';
import { clearAlertPopOverStatus, getFieldLabelWithRefName, getFileNameFromServer, setPointerEvent, updateAlertPopverStatus, updatePostLoader, validate } from '../../../utils/UtilityFunctions';
import { ASSIGNEE_TYPE } from '../EditFlow.utils';
import { RESPONSE_FIELD_KEYS, REQUEST_FIELD_KEYS } from '../step_configuration/node_configurations/end_step/EndStepConfig.constants';
import { EMAIL_RECIPIENT_TYPE } from '../step_configuration/node_configurations/send_email/SendEmailConfig.constants';
import { START_NODE_RESPONSE_FIELD_KEYS } from '../step_configuration/node_configurations/start_step/StartStepConfig.constants';
import { getInactiveAssigneesList } from '../step_configuration/StepConfiguration.utils';
import { NODE_CONFIG_TABS } from './NodeConfiguration.constants';
import { NODE_VALIDATION_STRINGS } from './NodeConfiguration.strings';
import { getAssigneeValidationSchema } from './NodeConfiguration.validation.schema';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import UpdateConfirmPopover from '../../../components/update_confirm_popover/UpdateConfirmPopover';
import Trash from '../../../assets/icons/application/Trash';
import styles from './NodeConfiguration.module.scss';
import { SYSTEM_FIELD_KEYS } from '../../../utils/SystemFieldsConstants';
import { EMAIL_LABELS } from '../step_configuration/node_configurations/send_email/SendEmailConfig.string';
import { FIELD_TYPES } from '../../../components/form_builder/FormBuilder.strings';

export const updateLoaderStatus = (isLoading = false) => {
    setPointerEvent(isLoading);
    updatePostLoader(isLoading);
};

export const getRuleBasedData = (data) => {
    console.log('inputData_getRuleBasedData', data);
    const rules = cloneDeep(data);
    const rulesList = null;
    rules.forEach((eachRule) => {
        rulesList.push({
            condition_rule: eachRule?.condition_rule,
        });
    });
    console.log('rules_getRuleBasedData', rulesList);
    return rules;
};

export const saveStepCommonData = (state = {}) => {
    const stateData = cloneDeep(state);

    const dataToValidate = pick(stateData, [
        RESPONSE_FIELD_KEYS.ID,
        RESPONSE_FIELD_KEYS.STEP_NAME,
        RESPONSE_FIELD_KEYS.STEP_UUID,
        RESPONSE_FIELD_KEYS.STEP_TYPE,
        RESPONSE_FIELD_KEYS.COORDINATE_INFO,
        RESPONSE_FIELD_KEYS.COORDINATE_INFO_X,
        RESPONSE_FIELD_KEYS.COORDINATE_INFO_Y,
        RESPONSE_FIELD_KEYS.STEP_COORDINATES,
        RESPONSE_FIELD_KEYS.STEP_STATUS,
        RESPONSE_FIELD_KEYS.STEP_ORDER,
    ]);

    return dataToValidate;
};

export const getErrorTabsList = (stepType, errorList = {}, mappingErrorList = {}) => {
    const errorTab = [];
    const errorKeys = Object.keys(errorList);
    console.log(errorKeys, 'errorKeys', mappingErrorList);
    if (
        errorKeys.includes(RESPONSE_FIELD_KEYS.STEP_NAME) ||
        errorKeys.includes(RESPONSE_FIELD_KEYS.STEP_STATUS)
    ) {
        errorTab.push(NODE_CONFIG_TABS.ADDITIONAL);
    }
    switch (stepType) {
        case STEP_TYPE.START_STEP:
            if (
                errorKeys.includes(START_NODE_RESPONSE_FIELD_KEYS.INITIATORS) ||
                errorKeys.includes(RESPONSE_AUTOMATED_SYSTEM_KEYS.SCHEDULER_TIME_AT) ||
                errorKeys.includes(START_NODE_RESPONSE_FIELD_KEYS.ON_DATE) ||
                errorKeys.includes(RESPONSE_AUTOMATED_SYSTEM_KEYS.ON_DAY) ||
                errorKeys.includes(RESPONSE_AUTOMATED_SYSTEM_KEYS.ON_WEEK) ||
                errorKeys.includes(RESPONSE_AUTOMATED_SYSTEM_KEYS.REPEAT_TYPE) ||
                errorKeys.includes(RESPONSE_AUTOMATED_SYSTEM_KEYS.SCHEDULER_TYPE)
            ) {
                errorTab.push(NODE_CONFIG_TABS.GENERAL);
            }
            break;
        case STEP_TYPE.WAIT_STEP:
            if (
                errorKeys.some((errorKey) => errorKey.includes('timerDetails'))
            ) {
                errorTab.push(NODE_CONFIG_TABS.GENERAL);
            }
            break;
        case STEP_TYPE.EMAIL_CONFIGURATION:
            if (
                errorKeys.some((errorKey) => errorKey.includes('emailActions')) ||
                errorKeys.some((errorKey) => errorKey.includes('recipients')) ||
                errorKeys.some((errorKey) => errorKey.includes('ccRecipients'))
            ) {
                errorTab.push(NODE_CONFIG_TABS.GENERAL);
            }
            break;
        case STEP_TYPE.SEND_DATA_TO_DATALIST:
            if (
                errorKeys.some((errorKey) => errorKey.includes('dataListMapping')) ||
                !isEmpty(mappingErrorList)
            ) {
                errorTab.push(NODE_CONFIG_TABS.GENERAL);
            }
            break;
        case STEP_TYPE.FLOW_TRIGGER:
            if (
                errorKeys.includes('childFlowUuid') ||
                errorKeys.includes('mniUuid') ||
                !isEmpty(mappingErrorList)
            ) {
                errorTab.push(NODE_CONFIG_TABS.GENERAL);
            }
            break;
        case STEP_TYPE.DOCUMENT_GENERATION:
            if (
                errorKeys.includes('fileName') ||
                errorKeys.some((errorKey) => errorKey.includes('document'))
            ) {
                errorTab.push(NODE_CONFIG_TABS.GENERAL);
            }
            break;
        case STEP_TYPE.CONDITON_PATH_SELECTOR:
        case STEP_TYPE.PARALLEL_STEP:
            if (
                errorKeys.includes('defaultSteps') ||
                errorKeys.includes('stepUuids') ||
                errorKeys.some((errorKey) => errorKey.includes('condition'))
            ) {
                errorTab.push(NODE_CONFIG_TABS.GENERAL);
            }
            break;
        case STEP_TYPE.INTEGRATION:
            if (
                errorKeys.includes('connectorUuid') ||
                errorKeys.includes('eventUuid') ||
                errorKeys.includes('responseFormat') ||
                !isEmpty(mappingErrorList)
            ) {
                errorTab.push(NODE_CONFIG_TABS.GENERAL);
            }
            if (errorKeys.some((errorKey) => errorKey.includes('retryAttempts'))) {
                errorTab.push(NODE_CONFIG_TABS.ERROR_HANDLING);
            }
            break;
        case STEP_TYPE.JOIN_STEP:
            if (errorKeys.some((errorKey) => errorKey.includes('joinConfig'))
            ) {
                errorTab.push(NODE_CONFIG_TABS.GENERAL);
            }
            break;
        case STEP_TYPE.DATA_MANIPULATOR:
            if (errorKeys.some((errorKey) => errorKey.includes('manipulationDetails'))
            ) {
                errorTab.push(NODE_CONFIG_TABS.GENERAL);
            }
            break;
        case STEP_TYPE.MANAGE_FLOW_FIELDS:
            if (errorKeys.some((errorKey) => errorKey.includes('fieldName')) ||
                errorKeys.some((errorKey) => errorKey.includes('fieldType')) ||
                errorKeys.some((errorKey) => errorKey.includes('dataListUuid')) ||
                errorKeys.some((errorKey) => errorKey.includes('displayFields')) ||
                errorKeys.some((errorKey) => errorKey.includes('customLookupId')) ||
                errorKeys.some((errorKey) => errorKey.includes('choiceValues')) ||
                errorKeys.includes('columns')
            ) {
                errorTab.push(NODE_CONFIG_TABS.GENERAL);
            }
            break;
        default:
            break;
    }
    console.log('errorTabDetails', errorTab);
    return errorTab;
};

export const displayErrorBasedOnActiveTab = (currentTab, stepType, errorList = {}, t = translateFunction, mappingErrorList = {}) => {
    const errorTab = getErrorTabsList(
        stepType,
        errorList,
        mappingErrorList,
    );
    const index = errorTab.findIndex((tab) => tab === currentTab);
    if (index > -1) {
        errorTab.splice(index, 1);
    }
    if (!isEmpty(errorTab)) {
        displayErrorToast({
            title: NODE_VALIDATION_STRINGS(t).TAB_CHANGE.TITLE,
            subtitle: NODE_VALIDATION_STRINGS(t).TAB_CHANGE.SUBTITLE,
        });
    }
};

export const formatAllFieldsList = (response) => response?.map((data) => {
    data.value = data.field_uuid;
    data.fieldUuid = data.field_uuid;
    return data;
});

export const formatMappingField = (response) => response?.map((data) => {
    let dataListDetails = {};
    if (data?.data_list_details) {
        dataListDetails = {
            dataListUuid: data?.data_list_details?.data_list_uuid,
            displayFields: data?.data_list_details?.display_fields,
        };
    } else if (data?.source_data_list_details?.data_list_details) {
        dataListDetails = {
            dataListUuid: data?.source_data_list_details?.data_list_details?.data_list_uuid,
            displayFields: data?.source_data_list_details?.data_list_details?.display_fields,
        };
    }
    const updatedData = {
        fieldListType: data?.field_list_type,
        fieldName: data?.field_name,
        fieldType: data?.field_type,
        fieldUuid: data?.field_uuid,
        label: data?.label,
        value: data?.field_uuid,
        referenceName: data?.reference_name,
        _id: data?._id,
        choiceValueType: data?.choice_value_type,
        dataListDetails,
        tableUuid: data?.table_uuid,
        propertyFieldType: data?.property_picker_details?.reference_field_type,
        propertyChoiceValueType: data?.property_picker_details?.reference_field_choice_value_type,
    };

    return updatedData;
});
export const formatFieldsWithTable = (response) => response?.map((data) => {
    let dataListDetails = {};
    if (data?.data_list_details) {
        dataListDetails = {
            dataListUuid: data?.data_list_details?.data_list_uuid,
            displayFields: data?.data_list_details?.display_fields,
        };
    }
    return {
        fieldListType: data?.field_list_type,
        fieldType: data?.field_type,
        fieldUuid: data?.field_uuid,
        tableUuid: data?.table_uuid,
        label: data?.label,
        _id: data?._id,
        choiceValueType: data.choice_value_type,
        choiceValues: data?.choice_values,
        dataListDetails: dataListDetails,
    };
});

export const stepAssigneesPostData = (assignees = [], objectKeys = {}, responseObjectKeys = {}) => {
    const assigneesList = [];
    assignees.forEach((assigneeData) => {
        const assignee = {
            [responseObjectKeys.type]: assigneeData?.[objectKeys.type],
        };
        switch (assigneeData?.[objectKeys.type]) {
            case ASSIGNEE_TYPE.DIRECT_ASSIGNEE:
                const allUsers = {};
                const teamsList = assigneeData[objectKeys.userOrTeams]?.teams?.map((member) => member?._id);
                const usersList = assigneeData[objectKeys.userOrTeams]?.users?.map((member) => member?._id);
                if (!isEmpty(teamsList)) allUsers.teams = teamsList;
                if (!isEmpty(usersList)) allUsers.users = usersList;
                assignee[responseObjectKeys.userOrTeams] = allUsers;
                break;
            case ASSIGNEE_TYPE.FORM_FIELDS:
                assignee[responseObjectKeys.formFields] = assigneeData[objectKeys.formFields];
                break;
            case ASSIGNEE_TYPE.FORM_REPORTING_MANAGER_ASSIGNEE:
            case EMAIL_RECIPIENT_TYPE.FORM_REPORTING_MANAGER_ASSIGNEE:
                assignee[responseObjectKeys.formReportingManager] = assigneeData[objectKeys.formReportingManager];
                break;
            case ASSIGNEE_TYPE.SYSYEM_FIELDS:
                assignee[responseObjectKeys.systemFields] = assigneeData[objectKeys.systemFields];
                break;
            case EMAIL_RECIPIENT_TYPE.EMAIL_ADDRESS:
                console.log('assigneeData_external', assigneeData[objectKeys.external]);
                const emailArray = assigneeData[objectKeys.external]?.split(',')
                    .map((eachValue) =>
                        isEmpty(eachValue.trim()) ? null : eachValue.trim(),
                    );
                assignee[responseObjectKeys.external] = compact(emailArray);
                break;
            case ASSIGNEE_TYPE.RULE_BASED:
                const rules = [];
                assigneeData[objectKeys.ruleBased]?.forEach((condition) => {
                    rules.push({
                        [responseObjectKeys.ruleBasedRecipient]: stepAssigneesPostData(
                            condition[objectKeys.ruleBasedRecipient],
                            objectKeys,
                            responseObjectKeys,
                        ),
                        condition_rule: condition.condition_rule,
                    });
                });
                assignee[responseObjectKeys.ruleBased] = rules;
                break;
            default:
                break;
        }
        assigneesList.push(assignee);
    });
    return assigneesList;
};

export const getRecipientsTypeOptionList = (optionsList, recipientsData, typeKey, isRuleBased = false) => {
    const clonedRecipients = cloneDeep(recipientsData || []);
    const formattedOptionList = [];
    optionsList.forEach((option) => {
        const isAdded = clonedRecipients.some(({ [typeKey]: type }) => (type === option.value));
        if (!isAdded) {
            if (!isRuleBased || (option.value !== 'rule')) {
                formattedOptionList.push(option);
            }
        }
    });
    return formattedOptionList;
};

export const getAssigneesData = (assignees = [], fieldDetails = [], systemFieldsList = [], objectKeys = {}) => {
    const { type, formFields, systemFields, userOrTeams, ruleBased, ruleBasedRecipient, external, formReportingManager } = objectKeys;
    console.log('getAssigneesData_assignees', assignees);
    const assigneesCloned = cloneDeep(assignees);
    assigneesCloned.map((assigneeData) => {
        switch (assigneeData[type]) {
            case ASSIGNEE_TYPE.DIRECT_ASSIGNEE:
                const directAssignees = {};
                if (!isEmpty(assigneeData?.[userOrTeams]?.users)) {
                    directAssignees.users = getUserPickerOptionList(assigneeData[userOrTeams].users);
                }
                if (!isEmpty(assigneeData?.[userOrTeams]?.teams)) {
                    directAssignees.teams = getUserPickerOptionList(assigneeData[userOrTeams].teams);
                }
                assigneeData[userOrTeams] = directAssignees;
                break;
            case EMAIL_RECIPIENT_TYPE.EMAIL_ADDRESS:
                let emailValue = assigneeData?.[external];
                console.log('getAssigneesData_Email', assigneeData, 'emailValue', emailValue);
                if (isArray(emailValue)) {
                    emailValue = emailValue?.join();
                }
                assigneeData[external] = emailValue;
                break;
            case ASSIGNEE_TYPE.FORM_FIELDS:
                assigneeData[`${formFields}Labels`] = [];
                assigneeData?.[formFields]?.forEach((fieldUuid) => {
                    const selectedField = fieldDetails?.find((field) => field.field_uuid === fieldUuid);
                    if (selectedField?.field_name) {
                        assigneeData[`${formFields}Labels`].push(getFieldLabelWithRefName(selectedField.field_name, selectedField.reference_name));
                    }
                });
                break;
            case ASSIGNEE_TYPE.FORM_REPORTING_MANAGER_ASSIGNEE:
            case EMAIL_RECIPIENT_TYPE.FORM_REPORTING_MANAGER_ASSIGNEE:
                assigneeData[`${formReportingManager}Labels`] = [];
                assigneeData?.[formReportingManager]?.forEach((fieldUuid) => {
                    const selectedField = fieldDetails?.find((field) => field.field_uuid === fieldUuid);
                    if (selectedField?.field_name) {
                        assigneeData[`${formReportingManager}Labels`].push(getFieldLabelWithRefName(selectedField.field_name, selectedField.reference_name));
                    }
                });
                break;
            case ASSIGNEE_TYPE.SYSYEM_FIELDS:
                assigneeData[`${systemFields}Labels`] = [];
                assigneeData[systemFields]?.forEach((value) => {
                    let selectedField = {};
                    for (let i = 0; i < systemFieldsList?.length; i++) {
                        if (systemFieldsList[i].value === value) {
                            selectedField = systemFieldsList[i];
                            break;
                        }
                        const selectedSubMenu = systemFieldsList[i]?.subMenuItems?.find((subMenuItem) => subMenuItem.value === value);
                        if (!isEmpty(selectedSubMenu)) {
                            selectedField = {
                                label: selectedSubMenu.parentLabel,
                            };
                            break;
                        }
                    }
                    if (selectedField?.label) {
                        assigneeData[`${systemFields}Labels`].push(selectedField.label);
                    }
                });
                break;
            case ASSIGNEE_TYPE.RULE_BASED:
                const rules = [];
                assigneeData[ruleBased]?.forEach((condition) => {
                    rules.push({
                        [ruleBasedRecipient]: getAssigneesData(
                            condition[ruleBasedRecipient],
                            fieldDetails,
                            systemFieldsList,
                            objectKeys,
                        ),
                        condition_rule: condition.condition_rule,
                    });
                });
                assigneeData[ruleBased] = rules;
                break;
            default:
                break;
        }
        console.log('getAssigneesData_assigneesCloned', assigneesCloned);
        return assigneeData;
    });
    return assigneesCloned;
};

export const validateAssigneesData = (assigneesData, objectKeys, isRequired = true, t = translateFunction) => {
    const assignees = cloneDeep(assigneesData);
    console.log('validateAssigneesData formatted', assignees, objectKeys?.parentKey, assigneesData);
    let inactiveUserOrTeams = [];
    const errorList = validate({ [objectKeys.parentKey]: assignees }, getAssigneeValidationSchema?.(objectKeys, isRequired, t));
    const userOrTeamsIndex = assignees.findIndex((assignee) => assignee[objectKeys.type] === ASSIGNEE_TYPE.DIRECT_ASSIGNEE);
    if (userOrTeamsIndex > -1 && assignees[userOrTeamsIndex]?.[objectKeys.userOrTeams]) {
        inactiveUserOrTeams = getInactiveAssigneesList(assignees[userOrTeamsIndex]?.[objectKeys.userOrTeams]);
        if (!isEmpty(inactiveUserOrTeams)) {
            set(errorList, [`${objectKeys.parentKey},${userOrTeamsIndex},${objectKeys.userOrTeams}`], `${t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID)}: ${inactiveUserOrTeams.join(', ')}`);
        }
    }
    const ruleAssigneeIndex = assignees.findIndex((assignee) => assignee[objectKeys.type] === ASSIGNEE_TYPE.RULE_BASED);
    if (ruleAssigneeIndex > -1) {
        assignees[ruleAssigneeIndex]?.rules?.forEach((ruleAssigneeObj, ruleIndex) => {
            const ruleAssignee = ruleAssigneeObj?.[objectKeys.ruleBasedRecipient] || [];
            const userOrTeamsIndexRule = ruleAssignee.findIndex((assignee) => assignee[objectKeys.type] === ASSIGNEE_TYPE.DIRECT_ASSIGNEE);
            if (userOrTeamsIndexRule > -1 && ruleAssignee[userOrTeamsIndexRule]?.[objectKeys.userOrTeams]) {
                inactiveUserOrTeams = getInactiveAssigneesList(ruleAssignee[userOrTeamsIndexRule]?.[objectKeys.userOrTeams]);
                if (!isEmpty(inactiveUserOrTeams)) {
                    set(errorList, [`${objectKeys.parentKey},${ruleAssigneeIndex},${objectKeys.ruleBased},${ruleIndex},${objectKeys.ruleBasedRecipient},${userOrTeamsIndexRule},${objectKeys.userOrTeams}`], `${t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID)}: ${inactiveUserOrTeams.join(', ')}`);
                }
            }
        });
    }
    return {
        errorList,
    };
};

export const getCommonNodePostdata = (stateData) => {
    return {
        [REQUEST_FIELD_KEYS.FLOW_ID]: stateData?.[RESPONSE_FIELD_KEYS.FLOW_ID],
        [REQUEST_FIELD_KEYS.ID]: stateData?.[RESPONSE_FIELD_KEYS.ID],
        [REQUEST_FIELD_KEYS.STEP_UUID]: stateData?.[RESPONSE_FIELD_KEYS.STEP_UUID],
        [REQUEST_FIELD_KEYS.STEP_TYPE]: stateData?.[RESPONSE_FIELD_KEYS.STEP_TYPE],
        [REQUEST_FIELD_KEYS.STEP_NAME]: stateData?.[RESPONSE_FIELD_KEYS.STEP_NAME]?.trim(),
        [REQUEST_FIELD_KEYS.STEP_ORDER]: stateData?.[RESPONSE_FIELD_KEYS.STEP_ORDER],
    };
};

export const getCommonNodeValidateData = (stateData) => pick(stateData, [
    RESPONSE_FIELD_KEYS.ID,
    RESPONSE_FIELD_KEYS.STEP_UUID,
    RESPONSE_FIELD_KEYS.STEP_NAME,
    RESPONSE_FIELD_KEYS.STEP_TYPE,
    RESPONSE_FIELD_KEYS.STEP_STATUS,
    RESPONSE_FIELD_KEYS.STEP_ORDER,
    RESPONSE_FIELD_KEYS.COORDINATE_INFO,
    RESPONSE_FIELD_KEYS.COORDINATE_INFO_X,
    RESPONSE_FIELD_KEYS.COORDINATE_INFO_Y,
    RESPONSE_FIELD_KEYS.STEP_COORDINATES,
]);

export const getStaticDocValue = (documentUrlDetails) => {
    if (isUndefined(documentUrlDetails)) return [];
    const data = cloneDeep(documentUrlDetails);
    const docList = [];
    data.forEach((file) => {
        const _file = {
            name: getFileNameFromServer(file?.original_filename),
            type: file?.original_filename?.content_type,
            size: file?.original_filename?.file_size,
            url: file?.signedurl || EMPTY_STRING,
            thumbnail: file?.signedurl || EMPTY_STRING,
            documentId: file?.document_id,
            refUuid: file?.original_filename?.ref_uuid,
        };
        _file.file = _file;
        docList.push(_file);
    });
    return docList;
};

export const dataLossAlertPopover = ({ title, subTitle, onYesHandlerAdditionalFunc }) => {
    updateAlertPopverStatus({
        isVisible: true,
        customElement: (
            <UpdateConfirmPopover
                alertIcon={
                    <div className={styles.DataLossClass}>
                        <Trash />
                    </div>
                }
                titleStyle={cx(gClasses.FTwo16BlackV3, gClasses.FontWeight600)}
                subtitleStyle={gClasses.FTwo12GrayV87}
                onYesHandler={async () => {
                    clearAlertPopOverStatus();
                    onYesHandlerAdditionalFunc();
                }}
                onNoHandler={() => clearAlertPopOverStatus()}
                title={title}
                subTitle={subTitle}
            />
        ),
    });
};

export const getStepSystemFieldsList = (stepsList = [], stepRelatedSystemFields = []) => {
    const userSteps = stepsList?.filter(
        (eachStep = {}) => eachStep?.step_type === STEP_TYPE.USER_STEP,
    );

    return userSteps?.map((eachStep) => {
        const subMenuItems = [];
        stepRelatedSystemFields?.forEach((field) => {
            subMenuItems.push({
                ...field,
                parentLabel: `${eachStep.step_name} > ${field.label}`,
                value: `step.${eachStep?.step_uuid}.${field.value}`,
                deleteTagId: `step-${eachStep?._id}-${field.value}`, // this value is used as field tag
            });
        });
        return {
            label: eachStep?.step_name,
            value: eachStep?.step_uuid,
            subMenuItems,
            isStep: true,
            type: 'system',
            isExpandMenu: true,
            system_field_type: 'system_field',
        };
    });
};

export const getSystemFieldsList = ({ allSystemFields = {}, allowedSystemFields = [], steps = [], allowedStepSystemFields = [], ignoreStep }) => {
    const systemFieldsList = [];
    const isAllowAllFields = isEmpty(allowedSystemFields);
    const isAllowAllStepFields = isEmpty(allowedStepSystemFields);
    const stepFieldsList = [];
    let stepsCloned = cloneDeep(steps);
    Object.keys(allSystemFields || {})?.forEach((key) => {
        if (
            (key !== SYSTEM_FIELD_KEYS.STEP_FIELDS) &&
            (isAllowAllFields || allowedSystemFields.includes(key))
        ) {
            systemFieldsList.push({
                ...allSystemFields[key],
                fieldType: allSystemFields[key]?.field_type,
                type: 'system',
            });
        }
        if (key === SYSTEM_FIELD_KEYS.STEP_FIELDS) {
            const stepFieldsObj = allSystemFields[key]?.data || {};
            Object.keys(stepFieldsObj)?.forEach((stepFieldKey) => {
                if (isAllowAllStepFields || allowedStepSystemFields.includes(stepFieldKey)) {
                    stepFieldsList.push({
                        ...stepFieldsObj[stepFieldKey],
                        fieldType: stepFieldsObj[stepFieldKey]?.field_type,
                        type: 'system',
                    });
                }
            });
        }
    });
    if (ignoreStep) {
        stepsCloned = stepsCloned.filter((step) => step.step_uuid !== ignoreStep);
    }
    if (!isEmpty(stepsCloned) && !isEmpty(stepFieldsList)) {
        systemFieldsList.push(...getStepSystemFieldsList(stepsCloned, stepFieldsList));
    }
    return systemFieldsList;
};

export const constructInsertFieldsList = ({
    allFields = [],
    allSystemFields = {},
    allowedSystemFields = [],
    steps = [],
    allowedStepSystemFields = [],
    t = translateFunction,
}) => {
    const modifiedFieldsList = [
        {
            label: EMAIL_LABELS(t).FORM_FIELDS,
            isExpandMenu: true,
            subMenuItems: allFields,
        },
        {
            label: EMAIL_LABELS(t).SYSTEM_FIELDS,
            isExpandMenu: true,
            subMenuItems: getSystemFieldsList({
                allSystemFields,
                allowedSystemFields,
                steps,
                allowedStepSystemFields,
            }),
        },
    ];
    return modifiedFieldsList;
};

export const getDataListPickerFieldFromActiveForm = (activeFormPickerField, field = {}, fieldList = []) => {
    const displayFieldsUUIDS = get(field, ['data_list_details', 'display_fields'], []) || get(field, ['dataListDetails', 'displayFields'], []);
    const choiceObj = {};
    displayFieldsUUIDS.forEach((uuid) => {
        const displayField = fieldList?.find((eachField) => (eachField?.field_uuid === uuid) || (eachField?.fieldUuid === uuid));
        if (displayField) {
            const choiceValues = get(displayField, ['choice_values'], []) || get(displayField, ['choiceValues'], []);
            const _choiceObj = {};
            choiceValues.forEach((c) => {
                _choiceObj[c.value.toString()] = c.label;
            });
            if (!isEmpty(_choiceObj)) choiceObj[uuid] = _choiceObj;
        }
    });

    if (isArray(activeFormPickerField)) {
        return activeFormPickerField;
    }
    console.log('getDataListPickerFieldFromActiveForm', { activeFormPickerField, field, fieldList, choiceObj });
    if (
        has(activeFormPickerField, 'entry_details') &&
        !isEmpty(activeFormPickerField.entry_details)
    ) {
        const fieldValue = activeFormPickerField.entry_details.flatMap(
            (eachEntry) => {
                const eachValue = (activeFormPickerField?.display_fields || activeFormPickerField?.displayFields || []).flatMap(
                    (displayField) => has(eachEntry, [displayField]) ? [eachEntry[displayField]] : []);
                if (eachValue !== null) {
                    const label = eachValue.join(
                        get(activeFormPickerField, 'separator') || '-',
                    );
                    if (!isEmpty(label)) return [{ label, value: eachEntry._id || eachEntry.id, id: eachEntry._id || eachEntry.id, datalistUUID: activeFormPickerField.data_list_uuid || activeFormPickerField.dataListUuid }];
                }
                return [];
            },
        );
        return fieldValue;
    }
    return [];
};

export const constructStaticValues = (value, fieldType, documentUrlDetails, parentId, entity, type, additionalConfig = {}) => {
    if (fieldType === FIELD_TYPES.FILE_UPLOAD && value && value.doc_ids && isArray(value.doc_ids) &&
        value.doc_ids[0] && typeof value.doc_ids[0] === 'string') {
        const document = [];
        documentUrlDetails && documentUrlDetails.forEach((eachDocument) => {
            if (value && value.doc_ids && value.doc_ids.includes(eachDocument.document_id)) {
                document.push(eachDocument);
            }
        });
        const documentFieldValue = [];
        document.forEach((eachDocument) => {
            if (eachDocument && eachDocument.original_filename) {
                documentFieldValue.push(
                    {
                        ref_uuid: eachDocument.original_filename.ref_uuid,
                        fileName: getFileNameFromServer(eachDocument.original_filename),
                        link: eachDocument.signedurl,
                        id: eachDocument.document_id,
                        documentId: eachDocument.document_id,
                        file: {
                            name: getFileNameFromServer(eachDocument.original_filename),
                            type: eachDocument.original_filename.content_type,
                            url: eachDocument.signedurl,
                            size: eachDocument.original_filename.file_size,
                        },
                        url: eachDocument.signedurl,
                        status: FILE_UPLOAD_STATUS.SUCCESS,
                        fileId: eachDocument.document_id,
                        entity_id: parentId,
                        entity: entity,
                        newDocument: false,
                        type: type,
                        thumbnail: eachDocument.signedurl,
                        upload_signed_url: eachDocument.signedurl,
                    },
                );
            }
        });
        return documentFieldValue;
    } else if (fieldType === FIELD_TYPES.DATA_LIST) {
        return getDataListPickerFieldFromActiveForm(value);
    } else if (fieldType === FIELD_TYPES.NUMBER && additionalConfig?.isParseNumber) {
        return String(value);
    } else {
        return value;
    }
};
