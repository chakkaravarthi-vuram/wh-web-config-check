import { Checkbox, TextInput, ECheckboxSize } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import { VALIDATION_CONFIG_STRINGS } from '../ValidationConfiguration.strings';
import { cloneDeep, isNaN, get, isEmpty } from '../../../../../../../utils/jsUtility';
import styles from './DataListValidationConfiguration.module.scss';
import { getFieldValidationErrorMessage } from '../ValidationConfiguration.utils';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../../../FieldConfiguration.strings';
import { FILTER_FIELD_INITIAL_STATE_OBJECT, getChoiceValuePairs } from './DataListValidationConfiguration.utils.';
import { getSharedPropertyWarningText } from '../../../FieldConfiguration.utils';
import SelectorFilterValidationConfiguration from './filter_configuration/Filter';
import { DEFAULT_VALUE_FIELD_CONFIG_STRINGS } from '../../../field_value_configuration/FieldValueConfiguration.strings';

function DataListSelectorValidationConfiguration(props) {
    const { setFieldDetails, fieldDetails = {}, metaData = {}, moduleType } = props;
    const { errorList = {} } = fieldDetails;
    console.log('UserSelectorValidationConfiguration',
    fieldDetails,
    RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST],
    fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
    fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.IS_FILTER]);
    const { t } = useTranslation();

    const addCondition = () => {
        const filters = cloneDeep(fieldDetails)?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS];
        filters.push(FILTER_FIELD_INITIAL_STATE_OBJECT);
        setFieldDetails({
            ...fieldDetails,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
                ...cloneDeep(fieldDetails)?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] || {},
                filterFields: filters,

            },
        });
    };

    const onDeleteDataListFilter = (index) => {
        let filters = cloneDeep(fieldDetails)?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS];
        filters = filters.slice(0, index).concat(filters.slice(index + 1));
        setFieldDetails({
            ...fieldDetails,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
                ...cloneDeep(fieldDetails)?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] || {},
                filterFields: filters,

            },
        });
    };

    const getDatalistFilters = () => {
        console.log('filterDatalist', fieldDetails);
        return fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS]?.map((filter, index) => (
            <SelectorFilterValidationConfiguration
                fieldDetails={fieldDetails}
                setFieldDetails={setFieldDetails}
                addCondition={addCondition}
                onDeleteDataListFilter={onDeleteDataListFilter}
                datalistId={fieldDetails?.[RESPONSE_FIELD_KEYS.SELECTED_DATALIST]?.[RESPONSE_FIELD_KEYS.DATA_LIST_ID]}
                filter={filter}
                metaData={metaData}
                moduleType={moduleType}
                filterIndex={index}
                totalFilters={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS]?.length}
            />
        ));
    };

    const allowMultiple = get(fieldDetails, [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].ALLOW_MULTIPLE], false);

    const onDatalistSelectorValidationChangeHandler = (value, id) => {
        const validationData = cloneDeep(fieldDetails)?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] || {};
        switch (id) {
            case VALIDATION_CONFIG_STRINGS(t).MIN_DATALIST_SELECTION.ID:
                if (value.includes('-') || value.includes('+')) return;
                const minValidationValue = parseInt(value, 10);
                if (isNaN(minValidationValue)) delete validationData[id];
                if (isEmpty(minValidationValue)) delete validationData[id];
                if (!isNaN(minValidationValue)) validationData.minimumSelection = Number(minValidationValue);
            break;
            case VALIDATION_CONFIG_STRINGS(t).MAX_DATALIST_SELECTION.ID:
                if (value.includes('-') || value.includes('+')) return;
                const maxValidationValue = parseInt(value, 10);
                if (isNaN(maxValidationValue)) delete validationData[id];
                if (isEmpty(maxValidationValue)) delete validationData[id];
                if (!isNaN(maxValidationValue)) validationData.maximumSelection = Number(maxValidationValue);
            break;
            case VALIDATION_CONFIG_STRINGS(t).ALLOW_MULTIPLE_DATA_LIST.ID:
                validationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].ALLOW_MULTIPLE] = !validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].ALLOW_MULTIPLE];
                if (!validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].ALLOW_MULTIPLE]) {
                    delete validationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].MINIMUM_SELECTION];
                    delete validationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].MAXIMUM_SELECTION];
                }
            break;
            case VALIDATION_CONFIG_STRINGS(t).IS_RESTRICTED.ID:
                validationData.is_restricted = !validationData?.is_restricted;
                validationData.restricted_user_team = {
                    users: [],
                    teams: [],
                };
            break;
            case VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.ID:
                validationData.isFilter = !validationData?.isFilter;
                if (!value) validationData[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS] = [];
                else validationData[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS] = [FILTER_FIELD_INITIAL_STATE_OBJECT];
            break;
            default: break;
        }
        setFieldDetails({
          ...fieldDetails,
          [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: validationData,
        });
    };

    useEffect(() => {
        const isFilter = !isEmpty(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS]);
        const constructedFilterFields = fieldDetails?.validationData?.filterFields?.map((filter) => {
            if (VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.FILTER_FIELDS.FIELD.ALLOWED_FIELD_TYPES.selectionFields.includes(filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE])) {
                const filterFieldIndex = fieldDetails?.otherFieldDetail?.findIndex((field) => field?.fieldUUID === filter?.fieldUUID);
                let constructedChoiceValues = getChoiceValuePairs(fieldDetails?.otherFieldDetail?.[filterFieldIndex]?.choiceValues);
                if (filter?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.YES_NO) {
                    constructedChoiceValues = DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.YES_NO_OPTIONS;
                }
                return {
                    ...filter,
                    choiceValues: constructedChoiceValues,
                };
            } else {
                return filter;
            }
        });
        setFieldDetails({
            ...fieldDetails,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
                ...fieldDetails?.validationData,
                isFilter: isFilter,
                filterFields: constructedFilterFields,
            },
        });
    }, []);

    return (
        <div>
            {fieldDetails[RESPONSE_FIELD_KEYS.FORM_COUNT] > 1 && getSharedPropertyWarningText()}
            {allowMultiple && (
            <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw)}>
                <TextInput
                    id={VALIDATION_CONFIG_STRINGS(t).MIN_DATALIST_SELECTION.ID}
                    labelText={VALIDATION_CONFIG_STRINGS(t).MIN_DATALIST_SELECTION.LABEL}
                    onChange={(event) =>
                        onDatalistSelectorValidationChangeHandler(
                            event?.target?.value,
                            VALIDATION_CONFIG_STRINGS(t).MIN_DATALIST_SELECTION.ID,
                        )
                    }
                    value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].MINIMUM_SELECTION]}
                    errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).MIN_USER_SELECTION.ID)}
                    className={cx(gClasses.MT16, styles.TextClass)}
                />
                <TextInput
                    id={VALIDATION_CONFIG_STRINGS(t).MAX_DATALIST_SELECTION.ID}
                    labelText={VALIDATION_CONFIG_STRINGS(t).MAX_DATALIST_SELECTION.LABEL}
                    onChange={(event) =>
                        onDatalistSelectorValidationChangeHandler(
                            event?.target?.value,
                            VALIDATION_CONFIG_STRINGS(t).MAX_DATALIST_SELECTION.ID,
                        )
                    }
                    value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].MAXIMUM_SELECTION]}
                    className={cx(gClasses.MT16, styles.TextClass)}
                    errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).MAX_USER_SELECTION.ID)}
                />
            </div>
            )}
            <Checkbox
                className={cx(gClasses.MT16, gClasses.CenterV)}
                isValueSelected={
                    fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.IS_FILTER] ||
                    !isEmpty(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS])
                }
                details={VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.OPTION_LIST[0]}
                size={ECheckboxSize.SM}
                onClick={() =>
                    onDatalistSelectorValidationChangeHandler(
                        !fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.IS_FILTER],
                        VALIDATION_CONFIG_STRINGS(t).LIMIT_DATALIST.ID,
                    )
                }
                checkboxViewLabelClassName={cx(gClasses.FTwo13BlackV20, gClasses.CheckboxClass, styles.CheckboxClass)}
            />
            {(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.IS_FILTER] || !isEmpty(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS])) &&
            getDatalistFilters()}
        </div>
    );
}

export default DataListSelectorValidationConfiguration;
