import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { SingleDropdown, Size } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import styles from '../../DataManipulator.module.scss';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';
import { DATA_MANIPULATOR_STEP_CONFIGURATION } from '../../DataManipulator.strings';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../../../node_configuration/use_node_reducer/useNodeReducer';
import { cloneDeep, isEmpty, isNull } from '../../../../../../../utils/jsUtility';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../../../../../../utils/constants/form.constant';
import { RESPONSE_KEYS } from '../../DataManipulator.constants';
import { isArrayField } from './FlowFIield.utils';
import { validateMapping } from '../../DataManipulator.utils';

function FlowField(props) {
    const { index,
        isColumn = false,
        parentIndex = null,
        parentData,
        onDataChangeHandler = null,
        isExternalSourceMapping = false,
        fieldsList = [],
        // steps
        } = props;
    const { t } = useTranslation();
    const { HEADERS, ADD_MANIPULATION, MANIPULATION } = DATA_MANIPULATOR_STEP_CONFIGURATION(t);

    const { state = {}, dispatch } = useFlowNodeConfig();

    const {
        flowFields = [],
        systemAndFlowFieldsList = [],
        manipulationDetails = [],
        errorList = {},
        mappingErrorList = {},
    } = state;

    const mergedErrors = { ...errorList, ...mappingErrorList };

    const {
        CHILD_MAPPING,
        SOURCE_FIELD_TYPE,
        STATIC_VALUE,
        SOURCE_TYPE,
        OPERATOR,
        SAVE_TO,
        SAVE_INTO_FIELD,
        MANIPULATION_DETAILS,
        SOURCE_VALUE,
     } = RESPONSE_KEYS;

    const currentData = !isNull(parentIndex) ?
    cloneDeep(manipulationDetails)?.[parentIndex]?.[CHILD_MAPPING]?.[index] :
    cloneDeep(manipulationDetails)?.[index];
    console.log('check flowsetFieldsList field', parentIndex, !isNull(parentIndex));
    const setFieldsList = () => {
        const currentData = !isNull(parentIndex) ?
        cloneDeep(manipulationDetails)?.[parentIndex]?.[CHILD_MAPPING]?.[index] :
        cloneDeep(manipulationDetails)?.[index];
        console.log('setFieldsListflow field list', currentData, parentIndex);
        if ((currentData?.[SOURCE_TYPE] === ADD_MANIPULATION.OPTIONS[0]?.[SOURCE_TYPE]) ||
        currentData?.[SOURCE_TYPE] === ADD_MANIPULATION.OPTIONS[2]?.[SOURCE_TYPE]) {
            console.log('check flowsetFieldsList field1', flowFields);
            return flowFields?.filter((eachField) =>
                (eachField.fieldType !== FIELD_LIST_TYPE.TABLE) &&
                !(eachField.tableUUID));
        } else if (!isNull(parentIndex)) {
            console.log('check flowsetFieldsList field1isNull(parentIndex)', flowFields, parentData);
            return flowFields?.filter((eachField) =>
                eachField.tableUUID && ((eachField.tableUUID === parentData?.[SAVE_TO]) ||
            (eachField.tableUUID === parentData?.[SAVE_INTO_FIELD])));
        } else if (currentData?.[CHILD_MAPPING] || (currentData?.[SOURCE_FIELD_TYPE] === FIELD_LIST_TYPE.TABLE) ||
        (currentData?.[SOURCE_FIELD_TYPE] === 'object')) {
            return flowFields?.filter((eachField) =>
                (eachField.fieldType === FIELD_LIST_TYPE.TABLE));
        } else {
            console.log('setFieldsListflow field list1', currentData, parentIndex);
            return flowFields?.filter((eachField) =>
                !(eachField.tableUUID));
        }
    };

    const [flowFieldsList, setFlowFieldsList] = useState(flowFields);

    useEffect(() => {
        const fieldsList = setFieldsList();
        setFlowFieldsList(fieldsList);
    }, [flowFields, parentData?.[SOURCE_FIELD_TYPE], parentData?.[SAVE_TO], currentData?.[SOURCE_FIELD_TYPE]]);

    const [errorKeyIndex, setErrorKeyIndex] = useState(EMPTY_STRING);

    useEffect(() => {
        if (isNull(parentIndex)) setErrorKeyIndex(`${MANIPULATION_DETAILS},${index}`);
        else setErrorKeyIndex(`${MANIPULATION_DETAILS},${parentIndex},${CHILD_MAPPING},${index}`);
    }, []);

    console.log('setFieldsList()', currentData, errorKeyIndex, errorList, parentIndex, index);

    const [searchText, setSearchText] = useState(EMPTY_STRING);

    const searchFlowFields = (value) => {
        setSearchText(value);
        if (isEmpty(value)) setFlowFieldsList(flowFields);
        else {
            const searchedFieldList = flowFields?.filter((eachField) => (
                eachField?.label?.toLowerCase().includes(value?.toLowerCase())
            ));
            setFlowFieldsList(searchedFieldList);
        }
    };

    const changeOperator = (value) => {
        const clonedManipulatorData = cloneDeep(manipulationDetails);
        const currentData = !isNull(parentIndex) ?
        cloneDeep(manipulationDetails)?.[parentIndex]?.[CHILD_MAPPING]?.[index] :
        cloneDeep(manipulationDetails)?.[index];
        currentData[OPERATOR] = value;
        if (!isNull(parentIndex)) clonedManipulatorData[parentIndex][CHILD_MAPPING][index] = currentData;
        else if (currentData?.[CHILD_MAPPING]) {
            currentData[CHILD_MAPPING] = currentData?.[CHILD_MAPPING]?.map((eachColumn) => {
                return {
                    ...eachColumn,
                    [OPERATOR]: cloneDeep(MANIPULATION.OPERATOR_OPTIONS(isArrayField(cloneDeep(flowFieldsList), currentData?.[SAVE_TO] || currentData?.[SAVE_INTO_FIELD])))?.[0]?.value,
                };
            });
            clonedManipulatorData[index] = currentData;
        } else clonedManipulatorData[index] = currentData;
        onDataChangeHandler(cloneDeep(clonedManipulatorData));
    };

    const changeSaveToFlowField = (value) => {
        console.log('get the value', value);
        const clonedManipulatorData = cloneDeep(manipulationDetails);
        const currentData = !isNull(parentIndex) ?
        cloneDeep(manipulationDetails)?.[parentIndex]?.[CHILD_MAPPING]?.[index] :
        cloneDeep(manipulationDetails)?.[index];
        const selectedField = flowFieldsList?.find((eachField) => eachField.value === value);
        currentData[SAVE_TO] = value;
        currentData[SAVE_INTO_FIELD] = value;
        currentData.saveToField = selectedField;
        console.log('selectedField tableFields', selectedField, flowFields);
        if (selectedField && selectedField.fieldType === FIELD_LIST_TYPE.TABLE) {
            const tableFields = flowFields.filter((eachField) => eachField.tableUUID === value);
            console.log('tableFields', tableFields);
            currentData[CHILD_MAPPING] = [{
                    [SOURCE_TYPE]: currentData[SOURCE_TYPE],
                    [OPERATOR]: MANIPULATION.OPERATOR_OPTIONS(true)?.[0]?.value,
                    [SAVE_TO]: EMPTY_STRING,
                    isColumn: true,
                }];
        } else if (!isExternalSourceMapping) delete currentData?.[CHILD_MAPPING];
        if (!isNull(parentIndex)) clonedManipulatorData[parentIndex][CHILD_MAPPING][index] = currentData;
        else clonedManipulatorData[index] = currentData;
        const currentMapping = isNull(parentIndex) ?
        clonedManipulatorData?.[index] :
        clonedManipulatorData[parentIndex][CHILD_MAPPING][index];
        let manipulationField = currentMapping?.[SOURCE_VALUE];
        if (currentMapping?.[SOURCE_TYPE] !== DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[0].value) {
            manipulationField = currentMapping?.[SOURCE_VALUE];
        }
        const errors =
        ((currentMapping?.[SOURCE_TYPE] !== DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[0].value) &&
        (!isExternalSourceMapping)) ? {
            ...validateMapping(
                (currentMapping?.[SOURCE_TYPE] !== DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].value) ?
                manipulationField :
                currentMapping?.[SOURCE_FIELD_TYPE],
                value,
                !isEmpty(fieldsList) ? fieldsList : [
                    ...systemAndFlowFieldsList[0]?.subMenuItems || [],
                    ...systemAndFlowFieldsList[1]?.subMenuItems || [],
                ],
                flowFieldsList,
                cloneDeep(mappingErrorList),
                errorKeyIndex,
                currentMapping?.[SOURCE_TYPE] === DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].value &&
                currentMapping[SOURCE_FIELD_TYPE],
                t,
                currentData,
            ),
        } : mappingErrorList;
        onDataChangeHandler(clonedManipulatorData);
        dispatch(
            nodeConfigDataChange({
                mappingErrorList: errors,
            }),
          );
    };

    const modifiedFlowFields =
        cloneDeep(flowFieldsList || []).map((eachrow) => { return { ...eachrow, optionLabelClassName: cx(gClasses.Ellipsis, styles.FlowFieldOptions) }; });

    const hasSourceError = (!isEmpty(mergedErrors[`${errorKeyIndex},${SAVE_TO}`]) || !isEmpty(mergedErrors?.[`${errorKeyIndex},${SOURCE_VALUE}`]));
    const isEmptyStreamSource =
    (currentData?.[SOURCE_TYPE] === DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].value) &&
    (currentData?.[SOURCE_FIELD_TYPE] === FIELD_TYPE.FILE_UPLOAD) &&
    (isEmpty(currentData?.[STATIC_VALUE]));
    const isBooleanSource =
    (currentData?.[SOURCE_TYPE] === DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].value) &&
    (currentData?.[SOURCE_FIELD_TYPE] === 'boolean');

    return (
        <div className={cx(isBooleanSource && (hasSourceError ? styles.BooleanErrorContainer : styles.ErrorValueContainer), hasSourceError && !isEmptyStreamSource && styles.ErrorValueContainer, isEmptyStreamSource && styles.EmptyStreamClass, styles.ValueContainer, gClasses.MR8, gClasses.DisplayFlex, gClasses.AlignCenter)} id={`${parentIndex},${index}`}>
            {!isColumn && <SingleDropdown
                id={`${parentIndex},${index}_${HEADERS[2]},${OPERATOR}`}
                optionList={cloneDeep(MANIPULATION.OPERATOR_OPTIONS(isArrayField(cloneDeep(flowFieldsList), currentData?.[SAVE_TO] || currentData?.[SAVE_INTO_FIELD])))}
                dropdownViewProps={{
                    size: Size.sm,
                    disabled: isColumn,
                }}
                onClick={(value) => changeOperator(value)}
                selectedValue={currentData?.[OPERATOR]}
                errorMessage={EMPTY_STRING}
                // showReset
                className={styles.ValueTypeFlex}
            />}
            <SingleDropdown
                id={`${parentIndex},${index}_${HEADERS[2]}`}
                optionList={cloneDeep(modifiedFlowFields)}
                className={cx(isColumn ? gClasses.FlexBasis100 : styles.ValueFlex, styles.FlowField)}
                onClick={changeSaveToFlowField}
                selectedValue={currentData?.[SAVE_TO] || currentData?.[SAVE_INTO_FIELD]}
                placeholder={MANIPULATION.PLACEHOLDER}
                searchProps={{
                    searchValue: searchText,
                    onChangeSearch: (event) => searchFlowFields(event?.target?.value),
                }}
                dropdownViewProps={{
                    size: Size.sm,
                }}
                showReset
                errorMessage={mergedErrors[`${errorKeyIndex},${SAVE_TO}`]}
            />
        </div>
    );
}

export default FlowField;
