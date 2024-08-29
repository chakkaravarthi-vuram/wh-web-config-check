import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { SingleDropdown, Size } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';
import styles from '../../DataManipulator.module.scss';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../../../node_configuration/use_node_reducer/useNodeReducer';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import { cloneDeep, isNull, isEmpty } from '../../../../../../../utils/jsUtility';
import { DATA_MANIPULATOR_STEP_CONFIGURATION } from '../../DataManipulator.strings';
import { FIELD_LIST_TYPE } from '../../../../../../../utils/constants/form.constant';
import { RESPONSE_KEYS } from '../../DataManipulator.constants';
import { validateMapping } from '../../DataManipulator.utils';
import { isArrayField } from '../flow_field/FlowFIield.utils';

function ExternalConfigurationMapping(props) {
    const { t } = useTranslation();
    const { parentData = {}, manipulatorIndex, childMappingIndex, tableColumnIndex = null, isExternalField = false, isColumn = false, fieldsList = [] } = props;

    const { HEADERS, MANIPULATION, EXTERNAL_SOURCE } = DATA_MANIPULATOR_STEP_CONFIGURATION(t);

    const { state = {}, dispatch } = useFlowNodeConfig();
    const [errorKeyIndex, setErrorKeyIndex] = useState(EMPTY_STRING);
    const [searchText, setSearchText] = useState(EMPTY_STRING);
    const [flowSearchText, setFlowSearchText] = useState(EMPTY_STRING);

    const {
        manipulationDetails = {},
        flowFields = [],
        errorList = {},
        mappingErrorList = {},
    } = state;

    const mergedErrors = { ...errorList, ...mappingErrorList };

    const {
        SOURCE_VALUE,
        CHILD_MAPPING,
        TABLE_COLUMN_MAPPING,
        SOURCE_FIELD_TYPE,
        CHILD_DATA,
        SOURCE_TYPE,
        OPERATOR,
        SAVE_TO,
        FLOW_FIELD_TYPE,
        SAVE_INTO_FIELD,
        MANIPULATION_DETAILS,
     } = RESPONSE_KEYS;

    const currentData = !isNull(tableColumnIndex) ?
    cloneDeep(manipulationDetails)?.[manipulatorIndex]?.[CHILD_MAPPING]?.[childMappingIndex]?.[TABLE_COLUMN_MAPPING][tableColumnIndex] :
    cloneDeep(manipulationDetails)?.[manipulatorIndex]?.[CHILD_MAPPING]?.[childMappingIndex];
    const setExternalList = () => {
        const currentData = !isNull(tableColumnIndex) ?
        cloneDeep(manipulationDetails)?.[manipulatorIndex]?.[CHILD_MAPPING]?.[childMappingIndex]?.[TABLE_COLUMN_MAPPING][tableColumnIndex] :
        cloneDeep(manipulationDetails)?.[manipulatorIndex]?.[CHILD_MAPPING]?.[childMappingIndex];
        if (currentData?.[TABLE_COLUMN_MAPPING]) {
            return fieldsList?.filter((eachField) =>
                (eachField?.isTableField));
        } else if (parentData?.[TABLE_COLUMN_MAPPING]) {
            return fieldsList?.filter((eachField) =>
                eachField.tableUUID && ((eachField.tableUUID === parentData?.[SOURCE_VALUE]) || (eachField.tableUUID === parentData?.[CHILD_DATA])));
        } else {
            return fieldsList?.filter((eachField) =>
                !(eachField.tableUUID));
        }
    };

    useEffect(() => {
        if (isNull(tableColumnIndex)) setErrorKeyIndex(`${MANIPULATION_DETAILS},${manipulatorIndex},${CHILD_MAPPING},${childMappingIndex}`);
        else setErrorKeyIndex(`${MANIPULATION_DETAILS},${manipulatorIndex},${CHILD_MAPPING},${childMappingIndex},${TABLE_COLUMN_MAPPING},${tableColumnIndex}`);
    }, []);

    const setFieldsList = () => {
        const currentData = !isNull(tableColumnIndex) ?
        cloneDeep(manipulationDetails)?.[manipulatorIndex]?.[CHILD_MAPPING]?.[childMappingIndex]?.[TABLE_COLUMN_MAPPING][tableColumnIndex] :
        cloneDeep(manipulationDetails)?.[manipulatorIndex]?.[CHILD_MAPPING]?.[childMappingIndex];
        if (currentData?.[TABLE_COLUMN_MAPPING]) {
            return flowFields?.filter((eachField) =>
                (eachField?.fieldType === FIELD_LIST_TYPE.TABLE));
        } else if (parentData?.[TABLE_COLUMN_MAPPING]) {
            return flowFields?.filter((eachField) =>
                eachField.tableUUID && ((eachField.tableUUID === parentData?.[SAVE_TO]) || (eachField.tableUUID === parentData?.[SAVE_INTO_FIELD])));
        } else {
            return flowFields?.filter((eachField) =>
                !(eachField.tableUUID));
        }
    };

    const [externalFieldsList, setExternalFieldsList] = useState(fieldsList);
    const [flowFieldList, setFlowFieldList] = useState(flowFields);

    const searchExternalFields = (value) => {
        setSearchText(value);
        if (isEmpty(value)) setExternalFieldsList(fieldsList);
        else {
            const searchedFieldList = externalFieldsList?.filter((eachField) => (
                eachField?.label?.toLowerCase().includes(value?.toLowerCase())
            ));
            setExternalFieldsList(searchedFieldList);
        }
    };

    const searchFlowFields = (value) => {
        setFlowSearchText(value);
        if (isEmpty(value)) setFlowFieldList(flowFields);
        else {
            const searchedFieldList = flowFields?.filter((eachField) => (
                eachField?.label?.toLowerCase().includes(value?.toLowerCase())
            ));
            setFlowFieldList(searchedFieldList);
        }
    };

    useEffect(() => {
        const externalFieldsList = setExternalList();
        setExternalFieldsList(externalFieldsList);
        const fieldsList = setFieldsList();
        setFlowFieldList(fieldsList);
    }, [fieldsList, parentData?.[SOURCE_FIELD_TYPE], parentData?.[SAVE_TO], flowFields]);
    const chooseExternalField = (value) => {
        const clonedManipulatorData = cloneDeep(manipulationDetails);
        const currentData = !isNull(tableColumnIndex) ?
        cloneDeep(manipulationDetails)?.[manipulatorIndex]?.[CHILD_MAPPING]?.[childMappingIndex]?.[TABLE_COLUMN_MAPPING][tableColumnIndex] :
        cloneDeep(manipulationDetails)?.[manipulatorIndex]?.[CHILD_MAPPING]?.[childMappingIndex];
        const selectedField = fieldsList?.find((eachField) => eachField.value === value);
        currentData[SOURCE_VALUE] = value;
        currentData.sourceField = selectedField;
        currentData[SOURCE_FIELD_TYPE] = selectedField?.type || EMPTY_STRING;
        currentData[CHILD_DATA] = value;
        if (selectedField?.isTableField) {
            currentData[TABLE_COLUMN_MAPPING] = [{
                    [SOURCE_TYPE]: currentData[SOURCE_TYPE],
                    [OPERATOR]: MANIPULATION.OPERATOR_OPTIONS(true)[0].value,
                    [SAVE_TO]: EMPTY_STRING,
                    isColumn: true,
                }];
        } else delete currentData?.[TABLE_COLUMN_MAPPING];
        if (!isNull(tableColumnIndex)) clonedManipulatorData[manipulatorIndex][CHILD_MAPPING][childMappingIndex][TABLE_COLUMN_MAPPING][tableColumnIndex] = currentData;
        else clonedManipulatorData[manipulatorIndex][CHILD_MAPPING][childMappingIndex] = currentData;
        const currentMapping = isNull(tableColumnIndex) ?
        clonedManipulatorData[manipulatorIndex][CHILD_MAPPING][childMappingIndex] :
        clonedManipulatorData[manipulatorIndex][CHILD_MAPPING][childMappingIndex][TABLE_COLUMN_MAPPING][tableColumnIndex];
        let flowField = null;
        if (currentMapping?.[SOURCE_TYPE] !== DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[0].value) {
            flowField = currentMapping?.[SAVE_TO];
        }

        const errors = (currentMapping?.[SOURCE_TYPE] !== DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[0].value) ? {
            ...validateMapping(
                value,
                flowField,
                externalFieldsList,
                flowFields,
                cloneDeep(mappingErrorList),
                errorKeyIndex,
                null,
                t,
                currentData,
            ),
        } : mappingErrorList;
        dispatch(
            nodeConfigDataChange({
              manipulationDetails: clonedManipulatorData,
              mappingErrorList: errors,
            }),
        );
    };

    const chooseFlowField = (value) => {
        const clonedManipulatorData = cloneDeep(manipulationDetails);
        const currentData = !isNull(tableColumnIndex) ?
        cloneDeep(manipulationDetails)?.[manipulatorIndex]?.[CHILD_MAPPING]?.[childMappingIndex]?.[TABLE_COLUMN_MAPPING][tableColumnIndex] :
        cloneDeep(manipulationDetails)?.[manipulatorIndex]?.[CHILD_MAPPING]?.[childMappingIndex];
        const selectedField = flowFields?.find((eachField) => eachField.value === value);
        currentData[SAVE_TO] = value;
        currentData[SAVE_INTO_FIELD] = value;
        currentData[FLOW_FIELD_TYPE] = selectedField;
        if (selectedField?.fieldType === FIELD_LIST_TYPE.TABLE) {
            currentData[TABLE_COLUMN_MAPPING] = [{
                    [SOURCE_TYPE]: currentData[SOURCE_TYPE],
                    [OPERATOR]: MANIPULATION.OPERATOR_OPTIONS(true)[0].value,
                    [SAVE_TO]: EMPTY_STRING,
                    isColumn: true,
                }];
        } else delete currentData?.[TABLE_COLUMN_MAPPING];
        if (!isNull(tableColumnIndex)) clonedManipulatorData[manipulatorIndex][CHILD_MAPPING][childMappingIndex][TABLE_COLUMN_MAPPING][tableColumnIndex] = currentData;
        else clonedManipulatorData[manipulatorIndex][CHILD_MAPPING][childMappingIndex] = currentData;
        const currentMapping = isNull(tableColumnIndex) ?
        clonedManipulatorData[manipulatorIndex][CHILD_MAPPING][childMappingIndex] :
        clonedManipulatorData[manipulatorIndex][CHILD_MAPPING][childMappingIndex][TABLE_COLUMN_MAPPING][tableColumnIndex];
        let manipulationField = currentMapping?.[SOURCE_VALUE];
        if (currentMapping?.[SOURCE_TYPE] !== DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[0].value) {
            manipulationField = currentMapping?.[SOURCE_VALUE] || currentMapping?.[CHILD_DATA];
        }
        const errors = (currentMapping?.[SOURCE_TYPE] !== DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[0].value) ? {
            ...validateMapping(
                manipulationField,
                value,
                externalFieldsList,
                flowFields,
                cloneDeep(mappingErrorList),
                errorKeyIndex,
                null,
                t,
                currentData,
            ),
        } : mappingErrorList;
        dispatch(
            nodeConfigDataChange({
              manipulationDetails: clonedManipulatorData,
              mappingErrorList: errors,
            }),
        );
    };

    const chooseOperator = (value) => {
        const clonedManipulatorData = cloneDeep(manipulationDetails);
        const currentData = !isNull(tableColumnIndex) ?
        cloneDeep(manipulationDetails)?.[manipulatorIndex]?.[CHILD_MAPPING]?.[childMappingIndex]?.[TABLE_COLUMN_MAPPING][tableColumnIndex] :
        cloneDeep(manipulationDetails)?.[manipulatorIndex]?.[CHILD_MAPPING]?.[childMappingIndex];
        currentData.operator = value;
        // currentData.source_field = selectedField;
        if (!isNull(tableColumnIndex)) clonedManipulatorData[manipulatorIndex][CHILD_MAPPING][childMappingIndex][TABLE_COLUMN_MAPPING][tableColumnIndex] = currentData;
        else clonedManipulatorData[manipulatorIndex][CHILD_MAPPING][childMappingIndex] = currentData;
        dispatch(
            nodeConfigDataChange({
              manipulationDetails: clonedManipulatorData,
            }),
        );
    };

    const modifiedExternalFields =
        cloneDeep(externalFieldsList || []).map((eachrow) => { return { ...eachrow, optionLabelClassName: cx(gClasses.Ellipsis, styles.FlowFieldOptions) }; });

    const modifiedFlowFields =
        cloneDeep(flowFieldList || []).map((eachrow) => { return { ...eachrow, optionLabelClassName: cx(gClasses.Ellipsis, styles.FlowFieldOptions) }; });

    const hasError = (!isEmpty(mergedErrors[`${errorKeyIndex},${CHILD_DATA}`]) || !isEmpty(mergedErrors?.[`${errorKeyIndex},${SOURCE_VALUE}`]) ||
    !isEmpty(mergedErrors[`${errorKeyIndex},${SAVE_TO}`]) || !isEmpty(mergedErrors?.[`${errorKeyIndex},${SAVE_INTO_FIELD}`]));

    return isExternalField ? (
        <div className={cx(hasError && styles.ErrorValueContainer, styles.ManipulatorField)}>
        <SingleDropdown
            id={`${manipulatorIndex},${childMappingIndex},${tableColumnIndex}`}
            optionList={cloneDeep(modifiedExternalFields)}
            onClick={chooseExternalField}
            selectedValue={currentData?.[CHILD_DATA] || currentData?.[SOURCE_VALUE]}
            placeholder={EXTERNAL_SOURCE.PLACEHOLDER}
            dropdownViewProps={{
                className: styles.ChooseUserField,
            }}
            searchProps={{
                searchValue: searchText,
                onChangeSearch: (event) => searchExternalFields(event?.target?.value),
            }}
            errorMessage={mergedErrors?.[`${errorKeyIndex},${CHILD_DATA}`] || mergedErrors?.[`${errorKeyIndex},${SOURCE_VALUE}`]}
            showReset
        />
        </div>
    ) : (
        <div
        className={cx(
            hasError && styles.ErrorValueContainer,
            styles.ValueContainer,
            gClasses.MR8,
            gClasses.DisplayFlex,
            gClasses.AlignCenter)}
            id={`${manipulatorIndex},${childMappingIndex},${tableColumnIndex}`}
        >
            {!isColumn && <SingleDropdown
                id={`${childMappingIndex}_${tableColumnIndex}_${HEADERS[3]}`}
                optionList={cloneDeep(MANIPULATION.OPERATOR_OPTIONS(isArrayField(cloneDeep(flowFields), currentData?.[SAVE_TO] || currentData?.[SAVE_INTO_FIELD])))}
                dropdownViewProps={{
                    size: Size.sm,
                    disabled: isColumn,
                }}
                onClick={(value) => chooseOperator(value)}
                selectedValue={currentData?.[OPERATOR]}
                errorMessage={EMPTY_STRING}
                className={styles.ValueTypeFlex}
            />}
            <SingleDropdown
                optionList={cloneDeep(modifiedFlowFields)}
                className={cx(isColumn ? gClasses.FlexBasis100 : styles.ValueFlex, styles.FlowField)}
                onClick={chooseFlowField}
                selectedValue={currentData?.[SAVE_TO] || currentData?.[SAVE_INTO_FIELD]}
                placeholder={MANIPULATION.PLACEHOLDER}
                dropdownViewProps={{
                    size: Size.sm,
                }}
                searchProps={{
                    searchValue: flowSearchText,
                    onChangeSearch: (event) => searchFlowFields(event?.target?.value),
                }}
                showReset
                errorMessage={mergedErrors[`${errorKeyIndex},${SAVE_TO}`] || mergedErrors[`${errorKeyIndex},${SAVE_INTO_FIELD}`]}
            />
        </div>
    );
}

export default ExternalConfigurationMapping;
