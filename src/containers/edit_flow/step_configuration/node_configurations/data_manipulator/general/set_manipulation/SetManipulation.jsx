import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { DropdownList, ETextSize, NestedDropdown, SingleDropdown, Text } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import { cloneDeep, isNull, isEmpty } from '../../../../../../../utils/jsUtility';
import Expression from '../expression/Expression';
import { DATA_MANIPULATOR_STEP_CONFIGURATION } from '../../DataManipulator.strings';
import styles from '../../DataManipulator.module.scss';
import { EMPTY_STRING, PLUS } from '../../../../../../../utils/strings/CommonStrings';
import SetStaticValue from '../../static_value/StaticValue';
import RightMultiNavigateIcon from '../../../../../../../assets/icons/RightMultiNavigateIcon';
import LeftDirArrowIcon from '../../../../../../../assets/icons/app_builder_icons/LeftDirArrow';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../../../node_configuration/use_node_reducer/useNodeReducer';
import { FIELD_LIST_TYPE } from '../../../../../../../utils/constants/form.constant';
import Edit from '../../../../../../../assets/icons/application/EditV2';
import { RESPONSE_KEYS } from '../../DataManipulator.constants';
import { validateMapping } from '../../DataManipulator.utils';
import { getCurrentSystemField } from '../../../generate_document/general/document_template/DocumentTemplate.utils';

function SetManipulation(props) {
    const { data, index, parentIndex = null, parentData = {}, onDataChangeHandler = null } = props;
    const { t } = useTranslation();
    const { ADD_MANIPULATION, MANIPULATION } = DATA_MANIPULATOR_STEP_CONFIGURATION(t);
    const [selectedStep, setSelectedStep] = useState(EMPTY_STRING);
    const { state = {}, dispatch } = useFlowNodeConfig();

    const {
        systemAndFlowFieldsList = [],
        flowFields = [],
        manipulationDetails,
        // steps = [],
        errorList = {},
        mappingErrorList = {},
    } = state;
    console.log('getalllistshere', systemAndFlowFieldsList, flowFields);
    const mergedErrors = { ...errorList, ...mappingErrorList };

    const {
        SOURCE_VALUE,
        CHILD_MAPPING,
        SOURCE_FIELD_TYPE,
        SOURCE_TYPE,
        OPERATOR,
        SAVE_TO,
        SAVE_INTO_FIELD,
        RULE_DETAILS,
        RULE_NAME,
        MANIPULATION_DETAILS,
     } = RESPONSE_KEYS;

    const setFieldsList = () => {
        const currentData = !isNull(parentIndex) ?
        cloneDeep(manipulationDetails)?.[parentIndex]?.[CHILD_MAPPING]?.[index] :
        cloneDeep(manipulationDetails)?.[index];

        if (currentData?.[CHILD_MAPPING]) {
            return systemAndFlowFieldsList?.[0]?.subMenuItems?.filter((eachField) =>
                (eachField.fieldType === FIELD_LIST_TYPE.TABLE));
        }

        if ((currentData[SOURCE_TYPE] === ADD_MANIPULATION.OPTIONS[3][SOURCE_TYPE])) {
            console.log('manipfields', parentIndex, systemAndFlowFieldsList?.[0]?.subMenuItems, parentData);
            if (!isNull(parentIndex)) {
                return systemAndFlowFieldsList?.[0]?.subMenuItems?.filter((eachField) =>
                    eachField.tableUUID && (eachField.tableUUID === parentData?.[SOURCE_VALUE]));
            } else {
                return systemAndFlowFieldsList?.[0]?.subMenuItems?.filter((eachField) =>
                !(eachField.tableUUID));
            }
        } else if (currentData[SOURCE_TYPE] === ADD_MANIPULATION.OPTIONS[2][SOURCE_TYPE]) {
            return systemAndFlowFieldsList?.[0]?.subMenuItems?.filter((eachField) =>
                !(eachField.tableUUID));
        } else return systemAndFlowFieldsList?.[0]?.subMenuItems;
    };

    const currentData = !isNull(parentIndex) ?
    cloneDeep(manipulationDetails)?.[parentIndex]?.[CHILD_MAPPING]?.[index] :
    cloneDeep(manipulationDetails)?.[index];

    const [userFieldsList, setUserFieldsList] = useState(flowFields);
    const [errorKeyIndex, setErrorKeyIndex] = useState(EMPTY_STRING);

    useEffect(() => {
        const fieldsList = setFieldsList();
        setUserFieldsList(fieldsList);
    }, [systemAndFlowFieldsList?.[0]?.subMenuItems, parentData?.[SOURCE_FIELD_TYPE], parentData?.[SAVE_TO]]);

    const [searchText, setSearchText] = useState(EMPTY_STRING);

    const searchFlowFields = (value) => {
        setSearchText(value);
        if (isEmpty(value)) setUserFieldsList(flowFields);
        else {
            const searchedFieldList = userFieldsList?.filter((eachField) => (
                eachField?.label?.toLowerCase().includes(value?.toLowerCase())
            ));
            setUserFieldsList(searchedFieldList);
        }
    };

    useEffect(() => {
        if (isNull(parentIndex)) setErrorKeyIndex(`${MANIPULATION_DETAILS},${index}`);
        else setErrorKeyIndex(`${MANIPULATION_DETAILS},${parentIndex},${CHILD_MAPPING},${index}`);
    }, []);

    const chooseSource = (option) => {
        console.log('submeitems', option);
        const clonedManipulatorData = cloneDeep(manipulationDetails);
        const currentData = !isNull(parentIndex) ?
        cloneDeep(manipulationDetails)?.[parentIndex]?.[CHILD_MAPPING]?.[index] :
        cloneDeep(manipulationDetails)?.[index];
        currentData[SOURCE_VALUE] = option.value || option.fieldUuid;
        currentData[SOURCE_FIELD_TYPE] = option.fieldType;
        if (option.field_type) currentData[SOURCE_FIELD_TYPE] = option.field_type;
        if (option?.fieldType === FIELD_LIST_TYPE.TABLE) {
            const tableFields = systemAndFlowFieldsList?.[0]?.subMenuItems.filter((eachField) => eachField.tableUUID === option.value);
            console.log('tableFields', tableFields);
            currentData[CHILD_MAPPING] = [{
                    [SOURCE_TYPE]: currentData[SOURCE_TYPE],
                    [OPERATOR]: MANIPULATION.OPERATOR_OPTIONS(true)?.[0]?.value,
                    [SAVE_TO]: EMPTY_STRING,
                    [SOURCE_VALUE]: EMPTY_STRING, // source_field_value
                    isColumn: true,
                }];
        } else delete currentData?.[CHILD_MAPPING];
        if (!isNull(parentIndex)) {
            clonedManipulatorData[parentIndex][CHILD_MAPPING][index] = currentData;
        } else clonedManipulatorData[index] = currentData;
        const currentMapping = isNull(parentIndex) ?
        clonedManipulatorData?.[index] :
        clonedManipulatorData[parentIndex][CHILD_MAPPING][index];
        let flowField = null;
        if (currentMapping?.[SOURCE_TYPE] !== DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[0].value) {
            flowField = currentMapping?.[SAVE_TO] || currentMapping?.[SAVE_INTO_FIELD];
        }

        const errors = (currentMapping?.[SOURCE_TYPE] !== DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[0].value) ? {
            ...validateMapping(
                option.value || option.fieldUuid,
                flowField,
                [
                    ...systemAndFlowFieldsList[0]?.subMenuItems || [],
                    ...systemAndFlowFieldsList[1]?.subMenuItems || [],
                ],
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

    console.log('SetManipulation', data, flowFields, systemAndFlowFieldsList);
    let manipulationComponent = null;
    const manipulationData = cloneDeep(data);
        switch (manipulationData?.[SOURCE_TYPE]) {
            case ADD_MANIPULATION.OPTIONS[0].value:
                manipulationComponent = !isEmpty(manipulationData?.[RULE_DETAILS]) ? (
                    <Expression
                        index={index}
                        savedRuleData={manipulationData[RULE_DETAILS]}
                        onEdit={() => {
                            dispatch(
                                nodeConfigDataChange({
                                  selectedManipulator: 0,
                                  manipulatorEditIndex: index,
                                }),
                            );
                        }}
                        onDelete={() => {
                            const clonedManipulatorData = cloneDeep(manipulationDetails);
                            const currentData = {
                                ...clonedManipulatorData[index],
                                [RULE_DETAILS]: {},
                                [SOURCE_VALUE]: EMPTY_STRING,
                              };
                            clonedManipulatorData[index] = currentData;
                            dispatch(
                                nodeConfigDataChange({
                                    manipulationDetails: clonedManipulatorData,
                                }),
                            );
                        }}
                    />
                ) : (
                        <div>
                            <button
                                onClick={() => {
                                    const clonedManipulatorData = cloneDeep(manipulationDetails);
                                    dispatch(
                                        nodeConfigDataChange({
                                            manipulationDetails: clonedManipulatorData,
                                            isNewRule: true,
                                            selectedManipulator: 0,
                                            manipulatorEditIndex: index,
                                        }),
                                    );
                                    onDataChangeHandler(clonedManipulatorData);
                                }}
                                className={cx(gClasses.AlignCenter, gClasses.MT16, gClasses.FTwo12BlueV39, gClasses.DisplayFlex, gClasses.FontWeight500)}
                            >
                                {PLUS}
                                <Text
                                    content={ADD_MANIPULATION.OPTIONS[0].ADD_EXPRESSION}
                                    className={cx(gClasses.FTwo12BlueV39, gClasses.ML4, gClasses.FontWeight500)}
                                />
                            </button>
                            {errorList?.[`${MANIPULATION_DETAILS},${index},${SOURCE_VALUE}`] &&
                                <div className={gClasses.PT4}>
                                    <Text
                                        content={errorList?.[`${MANIPULATION_DETAILS},${index},${SOURCE_VALUE}`]}
                                        size={ETextSize.XS}
                                        className={gClasses.FTwo11RedV22}
                                    />
                                </div>
                            }
                        </div>
                    );
                break;
            case ADD_MANIPULATION.OPTIONS[1].value:
                manipulationComponent = (
                    <div className={cx(styles.ExternalSourceRule, gClasses.FTwo13BlueV39, gClasses.Ellipsis)}>
                        {manipulationData?.[RULE_DETAILS]?.[RULE_NAME]}
                        <button
                            className={gClasses.ML8}
                            onClick={() => {
                                dispatch(
                                    nodeConfigDataChange({
                                      selectedManipulator: 1,
                                      manipulatorEditIndex: index,
                                    }),
                                );
                            }}
                        >
                            <Edit />
                        </button>
                    </div>
                );
                break;
            case ADD_MANIPULATION.OPTIONS[2].value:

                const getFields = (onNextView, close) => {
                    const modifiedSystemFields =
                    cloneDeep(systemAndFlowFieldsList?.[1]?.subMenuItems || []).map((eachrow) => { return { ...eachrow, optionLabelClassName: cx(gClasses.Ellipsis, styles.ManipulativeOptionWidth) }; });
                    return (
                        <div className={styles.SecondNestedView}>
                            <DropdownList
                                className={styles.Dropdown}
                                optionList={cloneDeep(modifiedSystemFields)}
                                customDropdownListView={
                                    (option) => (
                                        <button
                                            className={cx(styles.ViewContainer, gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.W100, gClasses.PX12, gClasses.PY10)}
                                            onClick={() => {
                                                if (option.isStep) {
                                                    setSelectedStep(option);
                                                    onNextView();
                                                } else {
                                                    chooseSource(option);
                                                    close();
                                                }
                                            }}
                                        >
                                            <div className={cx(gClasses.FTwo13, styles.FlowOrDlLabel, gClasses.TextAlignLeft)}>{option.label}</div>
                                            {option?.isStep && <RightMultiNavigateIcon /> }
                                        </button>
                                    )
                                }
                                selectedValue={EMPTY_STRING}
                            />
                        </div>
                    );
                };

                const getStepSystemFields = (onPreviousView, close) => {
                    const modifiedStepSystemFields =
                    cloneDeep(selectedStep?.subMenuItems || []).map((eachrow) => { return { ...eachrow, optionLabelClassName: cx(gClasses.Ellipsis, styles.ManipulativeOptionWidth) }; });
                    return (
                        <div className={styles.SecondNestedView}>
                            <button className={cx(gClasses.PX12, gClasses.PY10, gClasses.CenterV)} onClick={onPreviousView}>
                                <LeftDirArrowIcon className={gClasses.MR5} fill="#959BA3" />
                                <Text content={selectedStep?.label} className={gClasses.TextAlignLeft} />
                            </button>
                            <DropdownList
                                className={styles.Dropdown}
                                optionList={cloneDeep(modifiedStepSystemFields)}
                                customDropdownListView={
                                    (option) => (
                                        <button
                                            className={cx(styles.ViewContainer, gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.W100, gClasses.PX12, gClasses.PY10)}
                                            onClick={() => {
                                                chooseSource(option);
                                                close();
                                            }}
                                        >
                                            <div className={cx(gClasses.FTwo13, styles.FlowOrDlLabel, gClasses.TextAlignLeft)}>{option.label}</div>
                                            {option?.isStep && <RightMultiNavigateIcon /> }
                                        </button>
                                    )
                                }
                                selectedValue={EMPTY_STRING}
                            />
                        </div>
                    );
                };

                const getDisplayText = () => {
                    let sourceField = systemAndFlowFieldsList?.[0]?.subMenuItems?.find((eachField) => (eachField?.fieldUuid === currentData?.[SOURCE_VALUE]));
                    if (isEmpty(sourceField)) {
                        sourceField = getCurrentSystemField({ fieldUuid: currentData?.[SOURCE_VALUE], systemFields: systemAndFlowFieldsList?.[1]?.subMenuItems || [] });
                    }
                    return sourceField?.parentLabel || sourceField?.label;
                };

                manipulationComponent = (
                    <div className={!isEmpty(mergedErrors[`${errorKeyIndex},${SAVE_TO}`]) && styles.UserFieldContainer}>
                        <NestedDropdown
                            displayText={getDisplayText()}
                            totalViews={2}
                            className={cx(gClasses.DropdownHeight, styles.ManipulativeWidth)}
                            errorMessage={mergedErrors?.[`${errorKeyIndex},${SOURCE_VALUE}`]}
                        >
                            {({ close, view, nextView: onNextView, prevView: onPreviousView }) => {
                                switch (view) {
                                    // case 1: return getInitialView(onNextView);
                                    case 1: return getFields(onNextView, close);
                                    case 2: return getStepSystemFields(onPreviousView, close);
                                    default: return null;
                                }
                            }}
                        </NestedDropdown>
                    </div>
                );
                break;
            case ADD_MANIPULATION.OPTIONS[3].value:
                console.log('user defined fieldmanipulationComponent', userFieldsList, systemAndFlowFieldsList);
                const modifiedSystemFields =
                    cloneDeep(userFieldsList || []).map((eachrow) => { return { ...eachrow, optionLabelClassName: cx(gClasses.Ellipsis, styles.ManipulativeOptionWidth) }; });
                manipulationComponent = (
                    <div className={!isEmpty(mergedErrors[`${errorKeyIndex},${SAVE_TO}`]) && styles.UserFieldContainer}>
                        <SingleDropdown
                            searchProps={{
                                searchValue: searchText,
                                onChangeSearch: (event) => searchFlowFields(event?.target?.value),
                            }}
                            optionList={cloneDeep(modifiedSystemFields)}
                            onClick={(value, _label, options) => {
                                const chosenOption = options?.find((eachOption) => eachOption.value === value);
                                chooseSource(chosenOption);
                            }}
                            errorMessage={mergedErrors?.[`${errorKeyIndex},${SOURCE_VALUE}`]}
                            selectedValue={currentData?.[SOURCE_VALUE]}
                            dropdownViewProps={{
                                className: styles.ChooseUserField,
                            }}
                        />
                    </div>
                );
            break;
            case ADD_MANIPULATION.OPTIONS[4].value:
                manipulationComponent = (
                    <SetStaticValue
                        index={index}
                        parentIndex={parentIndex}
                        onDataChangeHandler={onDataChangeHandler}
                    />
                );
                break;
            default: return null;
        }
    return manipulationComponent;
}

export default SetManipulation;
