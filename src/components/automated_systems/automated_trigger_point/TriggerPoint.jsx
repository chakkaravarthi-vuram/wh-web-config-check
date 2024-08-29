import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { ButtonContentVaraint, Label, RadioGroup, RadioGroupLayout, SegmentedControl, SingleDropdown, Text, Variant } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
    AUTOMATED_SELECTED_WEEK,
    AUTOMATED_TRIGGER_TIME,
    DL_FIELD_TYPES_FOR_AUTOMATED_SYSTEMS,
    RESPONSE_AUTOMATED_SYSTEM_KEYS,
    SCHEDULAR_CONSTANTS,
} from '../AutomatedSystems.constants';
import style from '../AutomatedSystems.module.scss';
import { DAY_DROPDOWN, EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import {
    cloneDeep,
    get,
    isEmpty,
} from '../../../utils/jsUtility';
import { getErrorMessage } from '../AutomatedSystems.utils';
import { MODULE_TYPES } from '../../../utils/Constants';
import { DIRECT_FIELD_LIST_TYPE } from '../../../utils/ValidationConstants';
import { setOperators } from '../../../redux/actions/Visibility.Action';
import { getAllFieldsByFilterAndUpdateOnVisibilityReducer } from '../../../redux/actions/EditFlow.Action';
import { getVisibilityExternalFieldsDropdownListByChoiceValueType } from '../../../redux/reducer';
import useRuleCondition from '../../../hooks/useRuleCondition';
import { getModuleIdByType } from '../../../containers/edit_flow/security/policy_builder/PolicyBuilder.utils';
import { POLICY_BUILDER_ALLOWED_FIELDS, POLICY_BUILDER_OPERATOR_LIST } from '../../../containers/edit_flow/security/security_policy/SecurityPolicy.strings';
import SingleGroupConditionBuilder from '../../condition_builder/single_group_condition_builder/SingleGroupConditionBuilder';
import { POLICY_BUILDER_STRINGS } from '../../../containers/edit_flow/security/policy_builder/PolicyBuilder.strings';
import { getAllDataListFields } from '../../../axios/apiService/form.apiService';
import { CancelToken } from '../../../utils/UtilityFunctions';
import { AUTOMATED_SYSTEM_CONSTANTS } from '../AutomatedSystems.strings';

const dLFieldCancelToken = new CancelToken();
const SIZE = 100;
const DL_FIELD_INITIAL_DATA = { loading: false, data: [], hasMore: false, totalCount: 0, page: 1 };

function AutomatedTriggerType(props) {
    const {
        metaData = {},
        onChangeHandler,
        automatedSystemsState,
        isStartStep = false,
        dynamicValidation,
        fieldOptionList,
        onGetAllFieldsByFilter,
        externalFieldListData,
        onInitialLoadOperators,
    } = props;
    const { t } = useTranslation();
    const [dLField, setDLField] = useState(DL_FIELD_INITIAL_DATA);
    const [dLSearchText, setDLSearchText] = useState('');
    const {
        COMMON_AUTOMATED_STRINGS,
        TRIGGER_TYPE,
        TRIGGER_DATA,
        REPEAT_ON,
        DAYS_OPTIONS,
        DAY_OR_MONTH,
        TRIGGER_DETAILS,
    } = AUTOMATED_SYSTEM_CONSTANTS(t);

    const {
        ON_DATE,
        ON_WEEK,
        ON_DAY,
    } = RESPONSE_AUTOMATED_SYSTEM_KEYS;

    const errorList = automatedSystemsState?.errorList;
    const { TYPE: TYPE_VALUE, CONDITION_TYPE: QUERY_BY_VALUE } = SCHEDULAR_CONSTANTS;
    const [triggerFieldLabel, setTriggerFieldLabel] = useState('');

    const expression = automatedSystemsState?.condition || {};

    const ruleProps = {
        parentData: {},
        moduleProps: getModuleIdByType(metaData.dataListId, MODULE_TYPES.DATA_LIST),
        onGetAllFieldsByFilter,
        externalFieldsDropdownData: externalFieldListData,
        expectedFieldPagination: {
            allowed_field_types: POLICY_BUILDER_ALLOWED_FIELDS,
            include_property_picker: undefined,
            allowed_choice_value_types: ['text', 'number'],
            field_list_type: DIRECT_FIELD_LIST_TYPE,
        },
    };

    const {
        onLoadMoreCallHandler: onLoadMoreFields,
        getAllFieldsByFilterApi,
        onSearchHandler: onSearchFields,
    } = useRuleCondition(ruleProps);

    const fetchDataListFieldsApiCall = (page = 1, search = EMPTY_STRING) => {
        dLFieldCancelToken.cancelToken?.();
        setDLField((p) => { return { ...p, loading: true }; });

        const params = {
            page,
            size: SIZE,
            data_list_id: metaData.dataListId,
            allowed_field_types: DL_FIELD_TYPES_FOR_AUTOMATED_SYSTEMS,
            field_list_type: DIRECT_FIELD_LIST_TYPE,
        };
        if (search) params.search = search;

        getAllDataListFields(params, dLFieldCancelToken?.setCancelToken).then((res) => {
            const { datalistFieldsPaginationDetails = {}, datalistFields = [] } = res;
            setDLField((p) => {
                return {
                    loading: false,
                    data: (page > 1) ? [...p.data, ...datalistFields] : datalistFields,
                    hasMore: page * SIZE < datalistFieldsPaginationDetails.totalCount,
                    totalCount: datalistFieldsPaginationDetails.totalCount,
                    page,
                };
            });
        }).catch((res) => {
            setDLField((p) => { return { ...p, loading: false }; });
            console.error('xyz dl fields err', res);
        });
    };

    useEffect(() => {
        if (automatedSystemsState.eventType === SCHEDULAR_CONSTANTS.TRIGGER_TYPE.FIELD_VALUE_CHANGE) {
            fetchDataListFieldsApiCall(1, dLSearchText);
        }
    }, [automatedSystemsState.eventType, dLSearchText]);

    useEffect(() => {
        if (automatedSystemsState.conditionType === QUERY_BY_VALUE.CONDITION) {
            onInitialLoadOperators(POLICY_BUILDER_OPERATOR_LIST);
            getAllFieldsByFilterApi();
        }
    }, [automatedSystemsState.conditionType]);

    useEffect(() => {
        if (isEmpty(triggerFieldLabel)) {
            setTriggerFieldLabel(dLField.data.find((f) => f.value === automatedSystemsState?.monitoringField)?.label);
        }
    }, [dLField]);

    const onTriggerNameChangeHanadler = (label) => {
        setTriggerFieldLabel(label);
    };

    const onLoadMoreDLFields = () => {
        fetchDataListFieldsApiCall(dLField.page + 1, dLSearchText);
    };

    // Month repeat on element
    const getRepeatOnElement = () => REPEAT_ON.REPEAT_ON_OPTIONS.map((repeatConfig) => {
        switch (repeatConfig?.value) {
            case SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_WEEK_DAY:
                return {
                    ...repeatConfig,
                    customElement: (
                    <div className={getErrorMessage(errorList, 'onDay') ? gClasses.DisplayFlex : gClasses.CenterV}>
                        <SingleDropdown
                            className={cx(style.WeekDropdown)}
                            optionList={AUTOMATED_SELECTED_WEEK(t)}
                            selectedValue={get(automatedSystemsState, 'onWeek', null)}
                            onClick={(value) => onChangeHandler('onWeek', value)}
                            dropdownViewProps={{
                                disabled: (get(automatedSystemsState, 'repeatType', null) !== SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_WEEK_DAY),
                            }}
                            errorMessage={getErrorMessage(errorList, ON_WEEK)}
                        />
                        <Text content={COMMON_AUTOMATED_STRINGS.OF} className={cx(gClasses.ML12, gClasses.MR12, gClasses.AlignSelfCenter, getErrorMessage(errorList, 'onDay') && gClasses.MB28)} />
                        <SegmentedControl
                            options={DAYS_OPTIONS}
                            hideLabel
                            required
                            buttonContentVariant={ButtonContentVaraint.both}
                            variant={Variant.border}
                            className={gClasses.BlackV12}
                            segementGroupClassName={style.SelectDay}
                            selectedValue={get(automatedSystemsState, 'onDay', null)}
                            onClick={(event, value) => onChangeHandler('onDay', value)}
                            errorMessage={getErrorMessage(errorList, ON_DAY)}
                        />
                    </div>),
                };
            case SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_DATE:
                return {
                    ...repeatConfig,
                    customElement: (
                        <SingleDropdown
                            optionList={cloneDeep(DAY_DROPDOWN)}
                            selectedValue={get(automatedSystemsState, 'onDate', null)}
                            onClick={(value) => onChangeHandler('onDate', value)}
                            dropdownViewProps={{
                                className: cx(style.DayDropdown),
                                disabled: (get(automatedSystemsState, 'repeatType', null) !== SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_DATE),
                            }}
                            errorMessage={getErrorMessage(errorList, ON_DATE)}
                            getPopperContainerClassName={(isOpen) => isOpen && style.DayDropdown}
                        />
                    ),
                };
            default: return { ...repeatConfig };
        }
    });

    return (
        <div>
            {
                !isStartStep && (
                    <>
                        <Text className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3)} content={COMMON_AUTOMATED_STRINGS.SUB_HEADER} />
                        <RadioGroup
                            labelText={TRIGGER_TYPE.TRIGGER_HEADER}
                            selectedValue={automatedSystemsState?.eventType}
                            options={TRIGGER_TYPE.TRIGGER_OPTION}
                            labelClassName={cx(style.FieldLabel, style.RadioLabelMargin, style.RadioLabelFont)}
                            optionClassName={gClasses.BlackV12}
                            onChange={(_event, _id, value) => value !== automatedSystemsState?.eventType && onChangeHandler('eventType', value)}
                            layout={RadioGroupLayout.inline}
                            className={cx(gClasses.MT16, gClasses.MB16)}
                            required
                        />
                    </>
                )
            }
            {automatedSystemsState?.eventType === SCHEDULAR_CONSTANTS.TRIGGER_TYPE.FIELD_VALUE_CHANGE ? (
                <SingleDropdown
                    id="monitoringField"
                    className={cx(style.DropdownMaxWidth)}
                    selectedValue={automatedSystemsState?.monitoringField}
                    optionList={dLField.data}
                    isLoadingOptions={dLField.loading}
                    placeholder={COMMON_AUTOMATED_STRINGS.SELECT}
                    dropdownViewProps={
                        {
                            labelName: TRIGGER_TYPE.TRIGGER_FIELD,
                            labelClassName: style.FieldLabel,
                            selectedLabel: triggerFieldLabel,
                        }
                    }
                    infiniteScrollProps={{
                        dataLength: dLField.data.length,
                        hasMore: dLField.hasMore,
                        next: onLoadMoreDLFields,
                        scrollableId: 'dl-field-scroll',
                    }}
                    searchProps={{
                        searchValue: dLSearchText,
                        onChangeSearch: (e) => {
                            setDLSearchText(e.target.value || EMPTY_STRING);
                        },
                    }}
                    onClick={(value, label) => { onChangeHandler('monitoringField', value); onTriggerNameChangeHanadler(label); }}
                    errorMessage={getErrorMessage(errorList, 'monitoringField')}
                    onOutSideClick={() => {
                        setDLSearchText(EMPTY_STRING);
                    }}
                    required
                />
            ) :
            <>
            <Label
                labelName={TRIGGER_DETAILS}
                className={cx(gClasses.FTwo15GrayV3, gClasses.MB10)}
            />
            <div className={style.SchedulerContainer}>
                    <SingleDropdown
                        className={cx(style.DropdownMaxWidth)}
                        optionList={DAY_OR_MONTH}
                        selectedValue={get(automatedSystemsState, 'schedulerType', null)}
                        dropdownViewProps={
                            {
                                labelName: TRIGGER_TYPE.FREQUENCY_TRIGGER_REPEAT,
                                labelClassName: cx(style.FieldLabel, style.FreqTriggerLabel),
                            }
                        }
                        onClick={(value) => onChangeHandler('schedulerType', value)}
                        errorMessage={getErrorMessage(errorList, 'schedulerType')}
                        required
                    />
                    {get(automatedSystemsState, 'schedulerType', null) === TYPE_VALUE.DAY ? (
                        <SegmentedControl
                            options={DAYS_OPTIONS}
                            labelText={COMMON_AUTOMATED_STRINGS.ON_DAYS}
                            required
                            isMultiple
                            buttonContentVariant={ButtonContentVaraint.both}
                            variant={Variant.border}
                            className={cx(gClasses.MT16, gClasses.MB16)}
                            selectedValueList={get(automatedSystemsState, 'onDays', [])}
                            onClick={(event, value) => onChangeHandler('onDays', value)}
                            segementGroupClassName={style.SelectDay}
                            errorMessage={getErrorMessage(errorList, 'onDays')}
                        />
                    ) : (
                        <RadioGroup
                            labelText={REPEAT_ON.REPEAT_ON_HEADER}
                            selectedValue={get(automatedSystemsState, 'repeatType', null)}
                            options={getRepeatOnElement()}
                            labelClassName={cx(style.FieldLabel, style.RadioLabelMargin)}
                            optionClassName={gClasses.BlackV12}
                            onChange={(_event, _id, value) => onChangeHandler('repeatType', value)}
                            layout={RadioGroupLayout.stack}
                            radioContainerStyle={style.Gap8Imp}
                            className={cx(gClasses.MT16, gClasses.MB16)}
                            errorMessage={getErrorMessage(errorList, 'repeatType')}
                            required
                        />
                    )}
                    <SingleDropdown
                        className={cx(style.DropdownMaxWidth)}
                        required
                        selectedValue={get(automatedSystemsState, 'schedulerTimeAt', null)}
                        optionList={AUTOMATED_TRIGGER_TIME}
                        dropdownViewProps={
                            {
                                labelName: REPEAT_ON.TIME_START_TRIGGER,
                                labelClassName: style.FieldLabel,
                            }
                        }
                    onClick={(value) => onChangeHandler('schedulerTimeAt', value)}
                    errorMessage={getErrorMessage(errorList, 'schedulerTimeAt')}
                    />
            </div>
            </>
            }
            {
                !isStartStep && (
                    <>
                        <RadioGroup
                            labelText={TRIGGER_DATA.TRIGGER_DATA_HEADER}
                            selectedValue={get(automatedSystemsState, 'conditionType', null)}
                            onChange={(_event, _id, value) => value !== automatedSystemsState?.conditionType && onChangeHandler('conditionType', value)}
                            options={TRIGGER_DATA.TRIGGER_DATA_OPTIONS}
                            labelClassName={cx(style.FieldLabel, style.RadioLabelMargin)}
                            optionClassName={gClasses.BlackV12}
                            layout={RadioGroupLayout.inline}
                            className={cx(gClasses.MT16, gClasses.MB16)}
                            required
                        />
                        {
                            get(automatedSystemsState, 'conditionType', null) === QUERY_BY_VALUE.CONDITION && (
                                <div className={gClasses.MB16}>
                                    <SingleGroupConditionBuilder
                                        id={expression.expressionUUID}
                                        rule={expression}
                                        hasValidation={errorList.hasValidation || dynamicValidation}
                                        lstAllFields={fieldOptionList}
                                        onLoadMoreExternalFields={onLoadMoreFields}
                                        onSearchExternalFields={onSearchFields}
                                        updateExpressionInReduxFn={(expression) => onChangeHandler('condition', expression)}
                                        isDeletable={false}
                                        noFieldsFoundMsg={POLICY_BUILDER_STRINGS(t).DATA_NOT_FOUND.FIELDS_NOT_FOUND}
                                        choiceValueTypeBased
                                    />
                                </div>
                            )
                        }
                    </>
                )
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        fieldOptionList: getVisibilityExternalFieldsDropdownListByChoiceValueType(state, null, false),
        externalFieldListData: state.VisibilityReducer.externalFieldReducer.externalFields,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onGetAllFieldsByFilter: (paginationData, currentFieldUuid, fieldType, noLstAllFieldsUpdate) => {
            dispatch(
                getAllFieldsByFilterAndUpdateOnVisibilityReducer(
                    paginationData,
                    currentFieldUuid,
                    fieldType,
                    noLstAllFieldsUpdate,
                ),
            );
        },
        onInitialLoadOperators: (operators = {}) => dispatch(setOperators([], operators)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AutomatedTriggerType);
AutomatedTriggerType.propTypes = {
    metaData: PropTypes.shape({
        dataListId: PropTypes.string.isRequired,
    }),
    onChangeHandler: PropTypes.func.isRequired,
    automatedSystemsState: PropTypes.shape({
        eventType: PropTypes.string,
        conditionType: PropTypes.string,
        errorList: PropTypes.object,
        condition: PropTypes.object,
        monitoringField: PropTypes.string,
    }),
    dynamicValidation: PropTypes.bool,
    fieldOptionList: PropTypes.arrayOf(PropTypes.object),
    onGetAllFieldsByFilter: PropTypes.func.isRequired,
    externalFieldListData: PropTypes.arrayOf(PropTypes.object),
    onInitialLoadOperators: PropTypes.func.isRequired,
};
