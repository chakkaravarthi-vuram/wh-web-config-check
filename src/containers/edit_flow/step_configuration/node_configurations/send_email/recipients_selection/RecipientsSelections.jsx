import React, { useState, useContext, useEffect } from 'react';
import {
    Button, EButtonType,
    DropdownList,
    EPopperPlacements,
    Label,
    NestedDropdown,
    SingleDropdown,
    Text,
    TextInput,
    MultiDropdown,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import RightMultiNavigateIcon from '../../../../../../assets/icons/RightMultiNavigateIcon';
import styles from '../SendEmailConfig.module.scss';
import { EMPTY_STRING, SELECT_FIELD } from '../../../../../../utils/strings/CommonStrings';
import LeftDirArrowIcon from '../../../../../../assets/icons/app_builder_icons/LeftDirArrow';
import CheckIcon from '../../../../../../assets/icons/flow_icons/CheckIcon';
import UserPicker from '../../../../../../components/user_picker/UserPicker';
import PlusAddIcon from '../../../../../../assets/icons/PlusAddIcon';
import ThemeContext from '../../../../../../hoc/ThemeContext';
import { RECIPIENT_STRINGS, SEND_EMAIL_CONFIG_CONSTANTS } from '../SendEmailConfig.string';
import RuleBasedRecipient from '../../../../../../components/rule_based_recipient/RuleBasedRecipient';
import { EMAIL_CONSTANTS, EMAIL_RECIPIENT_TYPE } from '../SendEmailConfig.constants';
import { ROLES, TEAM_TYPES_PARAMS } from '../../../../../../utils/Constants';
import Trash from '../../../../../../assets/icons/application/Trash';
import { cloneDeep, set, get, isEmpty } from '../../../../../../utils/jsUtility';
import useApiCall from '../../../../../../hooks/useApiCall';
import { formatAllFieldsList, getRecipientsTypeOptionList } from '../../../../node_configuration/NodeConfiguration.utils';
import { INITIAL_PAGE, MAX_PAGINATION_SIZE } from '../../../../../../utils/constants/form.constant';
import { apiGetAllFieldsList } from '../../../../../../axios/apiService/flow.apiService';
import { ASSIGNEE_TYPE } from '../../../../EditFlow.utils';
import { getConditionalRulesApi } from '../../../../../../axios/apiService/rule.apiService';
import { getInactiveAssigneesList } from '../../../StepConfiguration.utils';
import { VALIDATION_CONSTANT } from '../../../../../../utils/constants/validation.constant';

function RecipientsSelection(props) {
    const { t } = useTranslation();
    const {
        GENERAL: {
            EMAIL_PLACEHOLDER,
            ADD_RECIPIENTS,
        },
        CHOOSE_FIELD,
    } = SEND_EMAIL_CONFIG_CONSTANTS(t);
    const [selectedStep, setSelectedStep] = useState(EMPTY_STRING);
    const [newlyAddedSelectedRules, setNewlyAddedSelectedRules] = useState([]);

    const {
        id,
        labelText,
        required,
        isRuleBased = false,
        addButtonLabel = ADD_RECIPIENTS,
        recipientsCancelToken,
        ruleCancelToken,
        updateRecipientsData,
        systemFieldListInitial,
        recipientsData = [],
        typeOptionsList,
        objectKeys,
        defaultApiParams,
        metaData,
        initialAssigneeData,
        ruleBasedRecipientInitData,
        errorList = {},
        containerStyles,
        dropdownClassInsideRule,
        fieldDropdownClass,
    } = props;

    const { colorSchemeDefault } = useContext(ThemeContext);
    const { DIRECT_RECIPIENT } = EMAIL_CONSTANTS;
    const maxRecipientsLimit = typeOptionsList?.length;
    const formattedTypeOptionList = getRecipientsTypeOptionList(typeOptionsList, recipientsData, objectKeys.type, isRuleBased);
    console.log('recipientsdhc_props', props, 'maxRecipientsLimit', maxRecipientsLimit, 'typeOptionsList', typeOptionsList);
    const { data: formFieldList, fetch: getAllUserRelatedFields, page: userRelatedFieldsCurrentPage, hasMore } = useApiCall({}, true, formatAllFieldsList);
    const { data: selectedRulesList, fetch: getConditionalRules, isLoading: isLoadingSelectedRules } = useApiCall({}, true);

    const getAllUserRelatedFieldsList = (params = {}) => {
        params = {
            page: INITIAL_PAGE,
            size: MAX_PAGINATION_SIZE,
            ...defaultApiParams,
            ...params,
        };
        if (isEmpty(params.search)) delete params.search;
        getAllUserRelatedFields(apiGetAllFieldsList(params));
    };

    const getAllSelectedConditionRules = (rulesData) => {
        const selectedConditionalRules = rulesData?.map((eachAssignee) => eachAssignee?.condition_rule);
        return selectedConditionalRules?.filter((eachRule) => !isEmpty(eachRule));
    };

    const getConditionalRulesList = (rulesData) => {
        const selectedRules = getAllSelectedConditionRules(rulesData);
        const params = {
            page: INITIAL_PAGE,
            size: selectedRules?.length,
            flow_id: metaData.moduleId,
            rule_uuids: selectedRules,
        };
        getConditionalRules(getConditionalRulesApi(params, ruleCancelToken));
    };

    useEffect(() => {
        if (!isRuleBased) {
            const ruleBasedAssigneeIndex = recipientsData?.findIndex((option) => option?.[objectKeys.type] === ASSIGNEE_TYPE.RULE_BASED);
            if (ruleBasedAssigneeIndex > -1 && isEmpty(selectedRulesList) && !isLoadingSelectedRules) {
                getConditionalRulesList(recipientsData[ruleBasedAssigneeIndex].rules);
            }
        }
    }, []);

    const loadMoreFields = () => {
        getAllUserRelatedFieldsList(
            { page: userRelatedFieldsCurrentPage + 1 },
        );
    };
    const onTypeChangeHandler = ({ value, index }) => {
        const recipientsDataCloned = cloneDeep(recipientsData);
        if (value === EMAIL_RECIPIENT_TYPE.RULE) {
            set(recipientsDataCloned, [index], {
                [objectKeys.type]: value,
                [objectKeys.ruleBased]: ruleBasedRecipientInitData,
            });
        } else {
            set(recipientsDataCloned, [index], { [objectKeys.type]: value });
        }
        updateRecipientsData(recipientsDataCloned);
    };

    const onDeleteRecipient = (index) => {
        const recipientsDataCloned = cloneDeep(recipientsData);
        recipientsDataCloned.splice(index, 1);
        updateRecipientsData(recipientsDataCloned);
    };

    const onAddButtonClick = () => {
        const recipientsDataCloned = cloneDeep(recipientsData);
        const data = {
            [objectKeys.type]: formattedTypeOptionList?.[0].value,
        };
        if (data[objectKeys.type] === EMAIL_RECIPIENT_TYPE.RULE) {
            data[objectKeys.ruleBased] = ruleBasedRecipientInitData;
        }
        recipientsDataCloned.push({ ...data });
        updateRecipientsData(recipientsDataCloned);
    };

    const onUserOrTeamChangeHandler = (event, index) => {
        const recipientsDataCloned = cloneDeep(recipientsData);
        const userOrTeams = get(recipientsDataCloned, [index, objectKeys.userOrTeams], {});
        if (event.target.isRemoveUser) {
            let selectedUserIndex = userOrTeams?.users?.findIndex((userOrTeam) => userOrTeam.id === event.target.data);
            if (selectedUserIndex > -1) {
                userOrTeams.users.splice(selectedUserIndex, 1);
                if (userOrTeams.users.length === 0) {
                    delete userOrTeams.users;
                }
            } else {
                selectedUserIndex = userOrTeams?.teams?.findIndex((userOrTeam) => userOrTeam.id === event.target.data);
                if (selectedUserIndex > -1) {
                    userOrTeams.teams.splice(selectedUserIndex, 1);
                    if (userOrTeams.teams.length === 0) {
                        delete userOrTeams.teams;
                    }
                }
            }
        } else {
            if (event.target.data.is_user) {
                if (isEmpty(userOrTeams.users)) {
                    userOrTeams.users = [];
                }
                userOrTeams.users.push({
                    ...event.target.data,
                });
            } else {
                if (isEmpty(userOrTeams.teams)) {
                    userOrTeams.teams = [];
                }
                userOrTeams.teams.push({
                    ...event.target.data,
                });
            }
        }
        set(recipientsDataCloned, [index, objectKeys.userOrTeams], userOrTeams);
        console.log(event, userOrTeams, 'recipientsDataCloned', recipientsDataCloned);
        updateRecipientsData(recipientsDataCloned);
    };

    const onExternalRecipientChange = (value, index) => {
        const recipientsDataCloned = cloneDeep(recipientsData);
        set(recipientsDataCloned, [index, objectKeys.external], value);
        updateRecipientsData(recipientsDataCloned);
    };

    const onRuleDataChange = (value, index, newRule) => {
        console.log('value_onRuleDataChange', value, 'index', index);
        const recipientsDataCloned = cloneDeep(recipientsData);
        set(recipientsDataCloned, index, value);
        if (!isEmpty(newRule)) {
            const selectedRulesCopy = cloneDeep(newlyAddedSelectedRules);
            selectedRulesCopy.push(newRule);
            setNewlyAddedSelectedRules(selectedRulesCopy);
        }
        updateRecipientsData(recipientsDataCloned);
    };

    const onRuleRecipientChange = (value, ruleIndex, index) => {
        const recipientsDataCloned = cloneDeep(recipientsData);
        set(recipientsDataCloned, [index, objectKeys.ruleBased, ruleIndex, objectKeys.ruleBasedRecipient], value);
        updateRecipientsData(recipientsDataCloned);
    };

    const onFormFieldChangeHandler = (params) => {
        const { value, label, parentLabel, index, key } = params;
        const actualLabel = parentLabel || label;
        const recipientsDataCloned = cloneDeep(recipientsData);
        const selectedFields = get(recipientsDataCloned, [index, key], []);
        const selectedFieldIndex = selectedFields.findIndex((field) => field === value);
        const selectedFieldLabels = get(recipientsDataCloned, [index, `${key}Labels`], []);
        if (selectedFieldIndex > -1) {
            const selectedFieldLabelIndex = selectedFieldLabels.findIndex((labelValue) => labelValue === actualLabel);
            if (selectedFieldLabelIndex > -1) {
                selectedFieldLabels.splice(selectedFieldLabelIndex, 1);
            }
            selectedFields.splice(selectedFieldIndex, 1);
        } else {
            selectedFieldLabels.push(actualLabel);
            selectedFields.push(value);
        }
        set(recipientsDataCloned, [index, key], selectedFields);
        set(recipientsDataCloned, [index, `${key}Labels`], selectedFieldLabels);
        updateRecipientsData(recipientsDataCloned);
    };

    const getInitialView = (onNextView, close, index) => (
        <div>
            <DropdownList
                optionList={systemFieldListInitial}
                selectedValue={recipientsData?.[index]?.[objectKeys.systemFields]}
                customDropdownListView={
                    (option) => (
                        <button
                            style={{ backgroundColor: option?.value === recipientsData?.[objectKeys.systemFields] ? `${colorSchemeDefault?.activeColor}10` : EMPTY_STRING }}
                            className={cx(styles.ViewContainer, gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.W100, gClasses.PX12, gClasses.PY10)}
                            onClick={() => {
                                if (option?.isStep) {
                                    setSelectedStep(option);
                                    onNextView();
                                } else {
                                    onFormFieldChangeHandler({ ...option, index, key: objectKeys.systemFields });
                                }
                            }}
                        >
                            <div className={cx(gClasses.FTwo13, styles.FlowOrDlLabel)}>{option.label}</div>
                            {
                                option.isStep ? (
                                    <RightMultiNavigateIcon />
                                ) : (
                                    recipientsData?.[index]?.[objectKeys.systemFields]?.some((field) => field === option.value) && (
                                        <CheckIcon />
                                    )
                                )
                            }
                        </button>
                    )
                }
                className={gClasses.Zindex1}
            />
        </div>
    );

    const getUserStepName = (onPreviousView, close, index) => (
        <div className={styles.SecondNestedView}>
            <button className={cx(gClasses.PX12, gClasses.PY10, gClasses.CenterV)} onClick={onPreviousView}>
                <LeftDirArrowIcon className={gClasses.MR5} fill="#959BA3" />
                <Text content={selectedStep.label} />
            </button>
            <DropdownList
                className={styles.Dropdown}
                optionList={selectedStep.subMenuItems}
                onClick={(value, label) => {
                    onFormFieldChangeHandler({ value, label, index, key: objectKeys.systemFields });
                }}
                selectedValue={recipientsData?.[index]?.[objectKeys.systemFields]}
                customDropdownListView={
                    (option) => (
                        <button
                            style={{ backgroundColor: option?.value === recipientsData?.[objectKeys.systemFields] ? `${colorSchemeDefault?.activeColor}10` : EMPTY_STRING }}
                            className={cx(styles.ViewContainer, gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.W100, gClasses.PX12, gClasses.PY10)}
                            onClick={() => {
                                onFormFieldChangeHandler({ ...option, index, key: objectKeys.systemFields });
                            }}
                        >
                            <div className={cx(gClasses.FTwo13, styles.FlowOrDlLabel)}>{option.label}</div>
                            {
                                recipientsData?.[index]?.[objectKeys.systemFields]?.some((field) => field === option.value) && (
                                    <CheckIcon />
                                )
                            }
                        </button>
                    )
                }
            />
        </div>
    );

    const getRecipientDetailsField = (data, index) => {
        switch (data?.[objectKeys.type]) {
            case EMAIL_RECIPIENT_TYPE.USERS_OR_TEAMS:
                let directAssigneeErrors = errorList?.[`${objectKeys.parentKey},${index},${objectKeys.userOrTeams}`];
                const inactiveRecipientList = getInactiveAssigneesList(data?.[objectKeys.userOrTeams]);
                if (!isEmpty(inactiveRecipientList)) {
                    directAssigneeErrors = `${t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID)}: ${inactiveRecipientList.join(', ')}`;
                }
                return (
                    <div className={isRuleBased && dropdownClassInsideRule}>
                        <UserPicker
                            id={`${id}_${DIRECT_RECIPIENT}`}
                            key={`${id}_${DIRECT_RECIPIENT}`}
                            hideLabel
                            selectedValue={data?.[objectKeys.userOrTeams]}
                            maxCountLimit={isRuleBased ? 1 : 2}
                            searchPlaceholder={RECIPIENT_STRINGS(t).SEARCH_USER_OR_TEAM}
                            errorMessage={directAssigneeErrors}
                            isSearchable
                            onSelect={(data) => {
                                const selectEvent = {
                                    target: {
                                        id,
                                        data,
                                    },
                                };
                                onUserOrTeamChangeHandler(selectEvent, index);
                            }}
                            onRemove={(data) => {
                                const removeEvent = {
                                    target: {
                                        id,
                                        data,
                                        isRemoveUser: true,
                                    },
                                };
                                onUserOrTeamChangeHandler(removeEvent, index);
                            }}
                            noDataFoundMessage={RECIPIENT_STRINGS(t).NO_USER_TEAM_FOUND}
                            cancelToken={recipientsCancelToken}
                            allowedUserType={[ROLES.ADMIN, ROLES.FLOW_CREATOR, ROLES.MEMBER]}
                            allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
                            isUserPicker
                        />
                    </div>
                );
            case EMAIL_RECIPIENT_TYPE.EMAIL_ADDRESS:
                return (
                    <div className={isRuleBased && dropdownClassInsideRule}>
                        <TextInput
                            value={data?.[objectKeys.external]}
                            onChange={(e) => onExternalRecipientChange(e?.target?.value, index)}
                            labelClassName={styles.LabelClass}
                            placeholder={EMAIL_PLACEHOLDER}
                            className={gClasses.W100}
                            errorMessage={errorList?.[`${objectKeys.parentKey},${index},${objectKeys.external}`]}
                        />
                    </div>
                );
            case EMAIL_RECIPIENT_TYPE.SYSTEM_FIELDS:
                return (
                    <NestedDropdown
                        className={cx(isRuleBased ? dropdownClassInsideRule : fieldDropdownClass, styles.MaxWidth)}
                        displayText={data?.[`${objectKeys.systemFields}Labels`]?.join(', ')}
                        totalViews={2}
                        placeholder={t(SELECT_FIELD)}
                        popperPlacement={EPopperPlacements.BOTTOM}
                        errorMessage={errorList?.[`${objectKeys.parentKey},${index},${objectKeys.systemFields}`]}
                    >
                        {({ close, view, nextView: onNextView, prevView: onPreviousView }) => {
                            switch (view) {
                                case 1: return getInitialView(onNextView, close, index);
                                case 2: return getUserStepName(onPreviousView, close, index);
                                default: return null;
                            }
                        }}
                    </NestedDropdown>
                );
            case EMAIL_RECIPIENT_TYPE.FORM_FIELDS:
                return (
                    <MultiDropdown
                        getClassName={() => styles.MaxWidth}
                        optionList={cloneDeep(formFieldList)}
                        dropdownViewProps={{
                            className: isRuleBased ? dropdownClassInsideRule : fieldDropdownClass,
                            selectedLabel: data?.[`${objectKeys.formFields}Labels`]?.join(', '),
                            placeholder: CHOOSE_FIELD,
                            errorMessage: errorList?.[`${objectKeys.parentKey},${index},${objectKeys.formFields}`],
                            onClick: () => {
                                getAllUserRelatedFieldsList();
                            },
                            onKeyDown: () => {
                                getAllUserRelatedFieldsList();
                            },
                        }}
                        onClick={(value, label) => onFormFieldChangeHandler({ value, label, index, key: objectKeys.formFields })}
                        selectedListValue={data?.[objectKeys.formFields]}
                        infiniteScrollProps={{
                            dataLength: formFieldList?.length,
                            next: loadMoreFields,
                            hasMore: hasMore,
                            scrollableId: `scrollable-${id}`,
                        }}
                        getPopperContainerClassName={(isOpen) => isOpen ? styles.FormFieldDropdown : null}
                    />
                );
            case ASSIGNEE_TYPE.FORM_REPORTING_MANAGER_ASSIGNEE:
            case EMAIL_RECIPIENT_TYPE.FORM_REPORTING_MANAGER_ASSIGNEE:
                return (
                    <MultiDropdown
                        optionList={cloneDeep(formFieldList)}
                        dropdownViewProps={{
                            className: isRuleBased ? dropdownClassInsideRule : fieldDropdownClass,
                            selectedLabel: data?.[`${objectKeys.formReportingManager}Labels`]?.join(', '),
                            placeholder: CHOOSE_FIELD,
                            errorMessage: errorList?.[`${objectKeys.parentKey},${index},${objectKeys.formReportingManager}`],
                            onClick: () => {
                                getAllUserRelatedFieldsList();
                            },
                            onKeyDown: () => {
                                getAllUserRelatedFieldsList();
                            },
                        }}
                        onClick={(value, label) => onFormFieldChangeHandler({ value, label, index, key: objectKeys.formReportingManager })}
                        selectedListValue={data?.[objectKeys.formReportingManager]}
                        infiniteScrollProps={{
                            dataLength: formFieldList?.length,
                            next: loadMoreFields,
                            hasMore: hasMore,
                            scrollableId: `scrollable-${id}`,
                        }}
                        getPopperContainerClassName={(isOpen) => isOpen ? styles.FormFieldDropdown : null}
                    />
                );
            case EMAIL_RECIPIENT_TYPE.RULE:
                return (
                    <RuleBasedRecipient
                        id={`rule-${id}`}
                        key={`rule-${id}`}
                        data={data}
                        selectedRules={[...selectedRulesList, ...newlyAddedSelectedRules]}
                        metaData={metaData}
                        assigneeKey={objectKeys.parentKey}
                        rulesKey={objectKeys.ruleBased}
                        ruleAssigneeKey={objectKeys.ruleBasedRecipient}
                        assigneeIndex={index}
                        assigneeErrorList={errorList}
                        initialAssigneeData={initialAssigneeData}
                        onDataChange={onRuleDataChange}
                        recipientsComponent={({ ruleIndex }) => (
                            <RecipientsSelection
                                systemFieldListInitial={systemFieldListInitial}
                                // recipientsCancelToken={ruleBasedRecipientsCancelToken}
                                isRuleBased
                                fieldDropdownClass={fieldDropdownClass}
                                dropdownClassInsideRule={dropdownClassInsideRule}
                                addButtonLabel={addButtonLabel}
                                objectKeys={{
                                    ...objectKeys,
                                    parentKey: `${objectKeys.parentKey},${index},${objectKeys.ruleBased},${ruleIndex},${objectKeys.ruleBasedRecipient}`,
                                }}
                                defaultApiParams={defaultApiParams}
                                typeOptionsList={typeOptionsList}
                                updateRecipientsData={(data) => onRuleRecipientChange(data, ruleIndex, index)} //
                                recipientsData={data?.[objectKeys.ruleBased][ruleIndex][objectKeys.ruleBasedRecipient]}
                                errorList={errorList}
                            />
                        )}
                    />
                );
            default: return null;
        }
    };

    return (
        <div className={!isRuleBased && gClasses.MT16}>
            <Label labelName={labelText} isRequired={required} className={cx(styles.LabelClass, gClasses.MB4)} />
            {recipientsData?.map((recipientData, index) => (
                <div
                    key={recipientData?.[objectKeys.type]}
                    className={cx(
                        !isRuleBased && styles.RecipientContainer,
                        gClasses.PB8,
                        gClasses.TopV,
                        index && gClasses.PT8)
                    }
                >
                    <div className={cx(
                        recipientData?.[objectKeys.type] !== EMAIL_RECIPIENT_TYPE.RULE && gClasses.TopV,
                        styles.RecipientDataContainer,
                        containerStyles,
                        ((!required && !isRuleBased) || (recipientsData?.length > 1)) && gClasses.MR20,
                    )}
                    >
                        <SingleDropdown
                            optionList={formattedTypeOptionList}
                            className={cx(isRuleBased ? styles.RuleTypeDropdown : styles.RecipientTypeDropdown)}
                            onClick={(value) => onTypeChangeHandler({ value, index })}
                            selectedValue={recipientData?.[objectKeys.type]}
                            dropdownViewProps={{
                                selectedLabel: typeOptionsList.find((option) => option.value === recipientData?.[objectKeys.type])?.label,
                            }}
                        />
                        {recipientData?.[objectKeys.type] !== 5 &&
                            <div className={cx(styles.Divider, gClasses.MX8)} />
                        }
                        {getRecipientDetailsField(recipientData, index)}
                    </div>
                    {(!required && !isRuleBased) || (recipientsData?.length > 1) ?
                        <button className={cx(gClasses.MT5, gClasses.FlexShrink0)} onClick={() => onDeleteRecipient(index)}>
                            <Trash />
                        </button>
                        : null}
                </div>
            ))}
            {(isRuleBased ? recipientsData?.length < (maxRecipientsLimit - 1) : recipientsData?.length < maxRecipientsLimit) &&
                <Button
                    buttonText={addButtonLabel}
                    icon={<PlusAddIcon />}
                    onClickHandler={onAddButtonClick}
                    type={EButtonType.TERTIARY}
                    className={cx(styles.AddButton, gClasses.MT8)}
                />
            }
        </div>
    );
}

export default RecipientsSelection;
