import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { Text, NestedDropdown, DropdownList, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { EMPTY_STRING, PLUS } from '../../../../../../utils/strings/CommonStrings';
import styles from '../DataManipulator.module.scss';
import Trash from '../../../../../../assets/icons/application/Trash';
import ExternalConfigurationMapping from './external_source/ExternalConfigurationMapping';
import { DATA_MANIPULATOR_STEP_CONFIGURATION } from '../DataManipulator.strings';
import ManipulatorConfiguration from './manipulator_configuration/ManipulatorConfiguration';
import SetManipulation from './set_manipulation/SetManipulation';
import WarningIcon from '../../../../../../assets/icons/step_configuration_icons/WarningIcon';
import { cloneDeep, isEmpty } from '../../../../../../utils/jsUtility';
import FlowField from './flow_field/FlowField';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../../node_configuration/use_node_reducer/useNodeReducer';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../../generate_document/GenerateDocument.constants';
import { apiGetAllFieldsList } from '../../../../../../axios/apiService/flow.apiService';
import { normalizer } from '../../../../../../utils/normalizer.utils';
import { IGNORED_MANIPULATOR_FIELD_TYPES, RESPONSE_KEYS } from '../DataManipulator.constants';
import { constructInsertFieldsList } from '../../../../node_configuration/NodeConfiguration.utils';
import { ALLOW_DATA_MANIPULATOR_STEP_SYSTEM_FIELDS, ALLOW_DATA_MANIPULATOR_SYSTEM_FIELDS } from '../../../../node_configuration/NodeConfiguration.constants';
import Plus from '../../../../../../assets/icons/configuration_rule_builder/Plus';
import { ManageFlowFieldsProvider } from '../../../../manage_flow_fields/use_manage_flow_fields_reducer/useManageFlowFieldsReducer';
import { MANAGE_FLOW_FIELD_INITIAL_STATE } from '../../../../manage_flow_fields/ManageFlowFields.constants';
import FieldConfiguration from '../../../../manage_flow_fields/FieldConfiguration';

function GeneralConfiguration(props) {
    const { onDataChangeHandler, allSystemFields } = props;
    const { t } = useTranslation();

    const { ADD_MANIPULATION, HEADERS, INSTRUCTION, EXTERNAL_SOURCE, ADD_MAPPING, MANIPULATION } = DATA_MANIPULATOR_STEP_CONFIGURATION(t);

    const { state, dispatch } = useFlowNodeConfig();
    const { flowData } = useSelector((state) => state.EditFlowReducer);

    const {
        selectedManipulator,
        manipulationDetails = [],
        isNewRule = false,
        errorList = {},
        mappingErrorList = {},
        manipulatorEditIndex,
        isCreateFieldModalOpen = false,
    } = state;
    console.log('errorListman', errorList);
    const {
        SOURCE_TYPE,
        TYPE,
        RULE_DETAILS,
        CHILD_MAPPING,
        IS_MULTIPLE,
        OPERATOR,
        SAVE_TO,
        TABLE_COLUMN_MAPPING,
        MANIPULATION_DETAILS,
    } = RESPONSE_KEYS;

    const getAllFields = async (key = EMPTY_STRING, allowPropertyPicker = 0) => {
        const { flow_id } = flowData;
        const paginationData = {
          page: 1,
          size: 3000,
          sort_by: 1,
          flow_id,
          ignore_field_types: IGNORED_MANIPULATOR_FIELD_TYPES,
          include_property_picker: allowPropertyPicker,
          include_source_picker_details: allowPropertyPicker,
        };
        const resFieldsList = await apiGetAllFieldsList(paginationData);

        const allFieldsRawData = normalizer(
          resFieldsList,
          REQUEST_FIELD_KEYS,
          RESPONSE_FIELD_KEYS,
        );

        if (!isEmpty(key)) {
            dispatch(
                nodeConfigDataChange({
                  [key]: allFieldsRawData?.modifiedFields,
                }),
              );
        } else {
            const allFields = allFieldsRawData?.modifiedFields;
            const systemAndFlowFieldsList = constructInsertFieldsList({
                allFields,
                steps: flowData?.steps,
                allSystemFields,
                allowedSystemFields: ALLOW_DATA_MANIPULATOR_SYSTEM_FIELDS,
                allowedStepSystemFields: ALLOW_DATA_MANIPULATOR_STEP_SYSTEM_FIELDS,
                t,
            });
            dispatch(
            nodeConfigDataChange({
                systemAndFlowFieldsList,
            }),
            );
        }
        if (isEmpty(key)) {
            getAllFields(DATA_MANIPULATOR_STEP_CONFIGURATION(t).FLOW_FIELDS_ID, 0);
        }
    };

    useEffect(() => {
        getAllFields(EMPTY_STRING, 1);
    }, []);

    const tableHeader = (
        <div className={cx(gClasses.DisplayFlex, gClasses.MT12, gClasses.PB4, gClasses.PX16, styles.TableBorder)}>
            <Text
                content={HEADERS[0]}
                className={cx(gClasses.FTwo12GrayV89, gClasses.FontWeight500, styles.ManipulationTypeBasis, gClasses.MR8)}
            />
            <Text
                content={HEADERS[1]}
                className={cx(gClasses.FTwo12GrayV89, gClasses.FontWeight500, styles.FlexBasis)}
            />
            <Text
                content={HEADERS[2]}
                className={cx(gClasses.FTwo12GrayV89, gClasses.FontWeight500, styles.FLowFlexBasis)}
            />
        </div>
    );

    const removeManipulation = (index, parentIndex = undefined, grandParentIndex) => {
        let clonedManipulatorData = cloneDeep(manipulationDetails);
        const clonedErrorList = cloneDeep(errorList);
        const clonedMappingErrorList = cloneDeep(mappingErrorList);
        if (parentIndex !== undefined) {
            if (grandParentIndex !== undefined) {
                let tableColumnMapping = cloneDeep(manipulationDetails)?.[grandParentIndex]?.[CHILD_MAPPING]?.[parentIndex]?.[TABLE_COLUMN_MAPPING];
                if (tableColumnMapping?.length > 1) {
                    tableColumnMapping = tableColumnMapping.slice(0, index).concat(tableColumnMapping.slice(index + 1));
                    clonedManipulatorData[grandParentIndex][CHILD_MAPPING][parentIndex][TABLE_COLUMN_MAPPING] = tableColumnMapping;
                    const errorKey = `${MANIPULATION_DETAILS},${grandParentIndex},${CHILD_MAPPING},${parentIndex},${TABLE_COLUMN_MAPPING},${index}`;
                    Object?.keys(clonedErrorList)?.forEach((key) => {
                        const errorKeys = key?.split(',');
                        const keyIndex = Number(errorKeys?.[5]);
                        if (key?.includes(errorKey)) {
                            clonedErrorList[key] = EMPTY_STRING;
                        } else if (keyIndex > index) {
                            errorKeys[5] = (keyIndex - 1);
                            clonedErrorList[errorKeys?.join(',')] = clonedErrorList[key];
                            delete clonedErrorList[key];
                        }
                    });
                    Object?.keys(clonedMappingErrorList)?.forEach((key) => {
                        const errorKeys = key?.split(',');
                        const keyIndex = Number(errorKeys?.[5]);
                        if (key?.includes(errorKey)) {
                            clonedMappingErrorList[key] = EMPTY_STRING;
                        } else if (keyIndex > index) {
                            errorKeys[5] = (keyIndex - 1);
                            clonedMappingErrorList[errorKeys?.join(',')] = clonedMappingErrorList[key];
                            delete clonedMappingErrorList[key];
                        }
                    });
                }
            } else {
                let childMapping = cloneDeep(manipulationDetails)?.[parentIndex]?.[CHILD_MAPPING];
                if (childMapping?.length > 1) {
                    childMapping = childMapping.slice(0, index).concat(childMapping.slice(index + 1));
                    clonedManipulatorData[parentIndex] = {
                        ...cloneDeep(manipulationDetails)[parentIndex],
                        [CHILD_MAPPING]: childMapping,
                    };
                    const errorKey = `${MANIPULATION_DETAILS},${parentIndex},${CHILD_MAPPING},${index}`;
                    Object?.keys(clonedErrorList)?.forEach((key) => {
                        const errorKeys = key?.split(',');
                        const keyIndex = Number(errorKeys?.[3]);
                        if (key?.includes(errorKey)) {
                            clonedErrorList[key] = EMPTY_STRING;
                        } else if (keyIndex > index) {
                            errorKeys[3] = (keyIndex - 1);
                            clonedErrorList[errorKeys?.join(',')] = clonedErrorList[key];
                            delete clonedErrorList[key];
                        }
                    });
                    Object?.keys(clonedMappingErrorList)?.forEach((key) => {
                        const errorKeys = key?.split(',');
                        const keyIndex = Number(errorKeys?.[3]);
                        if (key?.includes(errorKey)) {
                            clonedMappingErrorList[key] = EMPTY_STRING;
                        } else if (keyIndex > index) {
                            errorKeys[3] = (keyIndex - 1);
                            clonedMappingErrorList[errorKeys?.join(',')] = clonedMappingErrorList[key];
                            delete clonedMappingErrorList[key];
                        }
                    });
                }
            }
        } else {
            clonedManipulatorData = clonedManipulatorData.slice(0, index).concat(clonedManipulatorData.slice(index + 1));
            const errorKey = `${MANIPULATION_DETAILS},${index}`;
            Object?.keys(clonedErrorList)?.forEach((key) => {
                const errorKeys = key?.split(',');
                const keyIndex = Number(errorKeys?.[1]);
                if (key?.includes(errorKey)) {
                    clonedErrorList[key] = EMPTY_STRING;
                } else if (keyIndex > index) {
                    errorKeys[1] = (keyIndex - 1);
                    clonedErrorList[errorKeys?.join(',')] = clonedErrorList[key];
                    delete clonedErrorList[key];
                }
            });
            Object?.keys(clonedMappingErrorList)?.forEach((key) => {
                const errorKeys = key?.split(',');
                const keyIndex = Number(errorKeys?.[1]);
                if (key?.includes(errorKey)) {
                    clonedMappingErrorList[key] = EMPTY_STRING;
                } else if (keyIndex > index) {
                    errorKeys[1] = (keyIndex - 1);
                    clonedMappingErrorList[errorKeys?.join(',')] = clonedMappingErrorList[key];
                    delete clonedMappingErrorList[key];
                }
            });
        }
        console.log('get checked errors2', clonedManipulatorData, state);
        onDataChangeHandler(clonedManipulatorData);
        dispatch(nodeConfigDataChange({
            errorList: clonedErrorList,
            mappingErrorList: clonedMappingErrorList,
        }));
    };
    console.log('mandet', manipulationDetails);
    const tableBody = manipulationDetails?.map((eachValue, index) => {
        const isExternalSourceMapping = (eachValue?.[SOURCE_TYPE] === ADD_MANIPULATION.OPTIONS[1]?.[SOURCE_TYPE]);
        const manipulationData = ADD_MANIPULATION.OPTIONS?.find?.((eachOption) => (eachOption?.[SOURCE_TYPE] === eachValue?.[SOURCE_TYPE]) || (eachOption.value === eachValue?.[SOURCE_TYPE]));
        return (
            <div className={cx(gClasses.DisplayFlex, gClasses.PX16, gClasses.PY8, styles.TableBorder)}>
                <Text
                    content={manipulationData?.[TYPE]}
                    className={cx(gClasses.FTwo13BlackV18, gClasses.MR8, styles.ManipulationTypeBasis)}
                />
                <div className={isExternalSourceMapping ? styles.ColMax : styles.FlexBasis}>
                    <div className={cx(!isExternalSourceMapping && gClasses.MR16)}>
                        <div className={cx(!isExternalSourceMapping ? gClasses.FlexBasis100 : cx(gClasses.PR8, gClasses.W100), styles.Manipulation)}>
                            <SetManipulation data={eachValue} index={index} onDataChangeHandler={onDataChangeHandler} />
                            {
                                isExternalSourceMapping && !eachValue?.[RULE_DETAILS]?.[IS_MULTIPLE] && eachValue?.[CHILD_MAPPING]?.map((eachColumn, columIndex) => (
                                <div className={cx(gClasses.MT16, gClasses.ML16)}>
                                    <ExternalConfigurationMapping
                                        parentData={eachValue}
                                        manipulatorIndex={index}
                                        childMappingIndex={columIndex}
                                        isExternalField
                                        fieldsList={eachValue?.[RULE_DETAILS]?.fieldsList}
                                    />
                                    {
                                        eachColumn?.[TABLE_COLUMN_MAPPING]?.map((_eachTableColumn, tableColumnIndex) => (
                                        <div className={cx(gClasses.MT16, gClasses.ML16)}>
                                            <ExternalConfigurationMapping
                                                parentData={eachColumn}
                                                manipulatorIndex={index}
                                                childMappingIndex={columIndex}
                                                tableColumnIndex={tableColumnIndex}
                                                isExternalField
                                                fieldsList={eachValue?.[RULE_DETAILS]?.fieldsList}
                                            />
                                        </div>
                                        ))
                                    }
                                    {
                                        eachColumn?.[TABLE_COLUMN_MAPPING] &&
                                        <button
                                            onClick={() => {
                                                const clonedManipulatorData = cloneDeep(manipulationDetails);
                                                clonedManipulatorData?.[index]?.[CHILD_MAPPING]?.[columIndex]?.[TABLE_COLUMN_MAPPING].push({
                                                    [SOURCE_TYPE]: eachValue?.[SOURCE_TYPE],
                                                    [OPERATOR]: eachValue?.[OPERATOR] || MANIPULATION.OPERATOR_OPTIONS(true)?.[0]?.value,
                                                    [SAVE_TO]: EMPTY_STRING,
                                                    isColumn: true,
                                                });
                                                dispatch(
                                                    nodeConfigDataChange({
                                                      manipulationDetails: clonedManipulatorData,
                                                    }),
                                                );
                                            }}
                                            className={cx(gClasses.AlignSelfBaseline, gClasses.MT16, gClasses.FTwo12BlueV39, gClasses.DisplayFlex, gClasses.FontWeight500)}
                                        >
                                            {PLUS}
                                            <Text
                                                content={EXTERNAL_SOURCE.ADD_COLUMN_MAPPING}
                                                className={cx(gClasses.FTwo12BlueV39, gClasses.ML4, gClasses.FontWeight500)}
                                            />
                                        </button>
                                    }
                                </div>
                                ))
                            }
                            {!isExternalSourceMapping && eachValue?.[CHILD_MAPPING]?.map((eachColumn, columnIndex) => (
                                <div className={cx(gClasses.MT16, gClasses.ML16)}>
                                    <SetManipulation
                                        data={eachColumn}
                                        index={columnIndex}
                                        parentIndex={index}
                                        parentData={eachValue}
                                        onDataChangeHandler={onDataChangeHandler}
                                    />
                                </div>
                            ))}
                            {isExternalSourceMapping && eachValue?.[RULE_DETAILS]?.[IS_MULTIPLE] && eachValue?.[CHILD_MAPPING]?.map((_eachColumn, columnIndex) => (
                                <div className={cx(gClasses.MT16, gClasses.ML16)}>
                                    <ExternalConfigurationMapping
                                        parentData={eachValue}
                                        manipulatorIndex={index}
                                        childMappingIndex={columnIndex}
                                        fieldsList={eachValue?.[RULE_DETAILS]?.fieldsList}
                                        isExternalField
                                    />
                                </div>
                            ))}
                            {
                                eachValue?.[CHILD_MAPPING] &&
                                <button
                                    onClick={() => {
                                        const clonedManipulatorData = cloneDeep(manipulationDetails);
                                        clonedManipulatorData?.[index]?.[CHILD_MAPPING].push({
                                            [SOURCE_TYPE]: eachValue?.[SOURCE_TYPE],
                                            [OPERATOR]: eachValue?.[OPERATOR] || MANIPULATION.OPERATOR_OPTIONS(true)?.[0]?.value,
                                            [SAVE_TO]: EMPTY_STRING,
                                            isColumn: true,
                                        });
                                        dispatch(
                                            nodeConfigDataChange({
                                              manipulationDetails: clonedManipulatorData,
                                            }),
                                        );
                                    }}
                                    className={cx(gClasses.AlignSelfBaseline, gClasses.MT16, gClasses.FTwo12BlueV39, gClasses.DisplayFlex, gClasses.FontWeight500)}
                                >
                                    {PLUS}
                                    <Text
                                        content={ADD_MAPPING}
                                        className={cx(gClasses.FTwo12BlueV39, gClasses.ML4, gClasses.FontWeight500)}
                                    />
                                </button>
                            }
                        </div>
                    </div>
                </div>
                    <div className={cx(styles.FLowFlexBasis)}>
                        <div className={cx(gClasses.DisplayFlex)}>
                            <div className={isExternalSourceMapping && !eachValue?.[RULE_DETAILS]?.[IS_MULTIPLE] && gClasses.VisibilityNone}>
                            <FlowField manipulatorType={eachValue?.[TYPE]} index={index} onDataChangeHandler={onDataChangeHandler} isExternalSourceMapping={isExternalSourceMapping} />
                            </div>
                            <button
                                id={`${index}`}
                                onClick={() => removeManipulation(index)}
                                className={cx(gClasses.AlignSelfCenter)}
                            >
                                <Trash className={gClasses.AlignSelfCenter} />
                            </button>
                        </div>
                        {(!isExternalSourceMapping || (isExternalSourceMapping && eachValue?.[RULE_DETAILS]?.[IS_MULTIPLE])) && eachValue?.[CHILD_MAPPING]?.map((eachColumn, columnIndex) => (
                            <div className={cx(gClasses.DisplayFlex, gClasses.MT16, gClasses.ML16, isExternalSourceMapping && !eachValue?.[RULE_DETAILS]?.[IS_MULTIPLE] && gClasses.VisibilityNone)}>
                                <FlowField
                                    manipulatorType={eachColumn?.[SOURCE_TYPE]}
                                    index={columnIndex}
                                    parentIndex={index}
                                    parentData={eachValue}
                                    isColumn
                                    onDataChangeHandler={onDataChangeHandler}
                                    fieldsList={eachValue?.[RULE_DETAILS]?.fieldsList}
                                    isExternalSourceMapping={isExternalSourceMapping}
                                />
                                <button
                                id={`${index},${columnIndex}`}
                                onClick={() => removeManipulation(columnIndex, index)}
                                className={cx(gClasses.AlignSelfCenter)}
                                >
                                    <Trash className={cx(gClasses.AlignSelfCenter, (eachValue?.[CHILD_MAPPING]?.length < 2) && gClasses.VisibilityNone)} />
                                </button>
                            </div>
                        ))}
                        {
                            isExternalSourceMapping && !eachValue?.[RULE_DETAILS]?.[IS_MULTIPLE] && eachValue?.[CHILD_MAPPING]?.map((eachColumn, columIndex) => (
                            <div className={cx(gClasses.MT16, gClasses.ML16)}>
                                <div className={gClasses.DisplayFlex}>
                                    <ExternalConfigurationMapping
                                        parentData={eachValue}
                                        manipulatorIndex={index}
                                        childMappingIndex={columIndex}
                                        fieldsList={eachValue?.[RULE_DETAILS]?.fieldsList}
                                    />
                                    <button
                                    id={`${index},${columIndex}`}
                                    onClick={() => removeManipulation(columIndex, index)}
                                    className={cx(gClasses.AlignSelfCenter, (eachValue?.[CHILD_MAPPING]?.length < 2) && gClasses.VisibilityNone)}
                                    >
                                        <Trash className={gClasses.AlignSelfCenter} />
                                    </button>
                                </div>
                                {
                                    eachColumn?.[TABLE_COLUMN_MAPPING]?.map((eachTableColumn, tableColumnIndex) => (
                                    <div className={cx(gClasses.MT16, gClasses.ML16, gClasses.DisplayFlex)}>
                                        <ExternalConfigurationMapping
                                            parentData={eachColumn}
                                            manipulatorIndex={index}
                                            childMappingIndex={columIndex}
                                            tableColumnIndex={tableColumnIndex}
                                            fieldsList={eachValue?.[RULE_DETAILS]?.fieldsList}
                                        />
                                        <button
                                        id={`${tableColumnIndex}, ${index},${columIndex}`}
                                        onClick={() => removeManipulation(tableColumnIndex, columIndex, index)}
                                        className={cx(gClasses.AlignSelfCenter)}
                                        >
                                            <Trash className={cx(gClasses.AlignSelfCenter, (eachColumn?.[TABLE_COLUMN_MAPPING]?.length < 2) && gClasses.VisibilityNone)} />
                                        </button>
                                    </div>
                                    ))
                                }
                                {
                                    eachColumn?.[TABLE_COLUMN_MAPPING] &&
                                    <button
                                        onClick={() => {
                                            const clonedManipulatorData = cloneDeep(manipulationDetails);
                                            clonedManipulatorData?.[index]?.[CHILD_MAPPING]?.[columIndex]?.[TABLE_COLUMN_MAPPING].push({
                                                [SOURCE_TYPE]: eachValue?.[SOURCE_TYPE],
                                                [OPERATOR]: eachValue?.[OPERATOR] || MANIPULATION.OPERATOR_OPTIONS(true)?.[0]?.value,
                                                [SAVE_TO]: EMPTY_STRING,
                                                isColumn: true,
                                            });
                                            onDataChangeHandler(clonedManipulatorData);
                                        }}
                                        className={cx(gClasses.AlignSelfBaseline, gClasses.MT16, gClasses.FTwo12BlueV39, gClasses.DisplayFlex, gClasses.FontWeight500, gClasses.VisibilityNone)}
                                    >
                                        {PLUS}
                                        <Text
                                            content={EXTERNAL_SOURCE.ADD_COLUMN_MAPPING}
                                            className={cx(gClasses.FTwo12BlueV39, gClasses.ML4, gClasses.FontWeight500)}
                                        />
                                    </button>
                                }
                            </div>
                            ))
                        }
                    </div>
                {!isNewRule && (manipulatorEditIndex === index) &&
                    <ManipulatorConfiguration
                        chosenManipulator={selectedManipulator}
                        closeConfiguration={() => {
                            dispatch(
                                nodeConfigDataChange({
                                selectedManipulator: null,
                                }),
                            );
                        }}
                        index={manipulatorEditIndex}
                    />
                }
            </div>
        );
     });

     console.log('chosenManipulatorchosenManipulator0', selectedManipulator);

    const getInitialView = (onNextView, close) => (
        <div>
            <DropdownList
                optionList={cloneDeep(ADD_MANIPULATION.OPTIONS)}
                selectedValue={EMPTY_STRING}
                customDropdownListView={
                    (option) => (
                        <button
                            className={cx(styles.ViewContainer, gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.W100, gClasses.PX12, gClasses.PY10)}
                            onClick={() => {
                                if (option.label === ADD_MANIPULATION.OPTIONS?.[0].label ||
                                    option.label === ADD_MANIPULATION.OPTIONS?.[1].label
                                ) {
                                    onNextView();
                                    dispatch(
                                        nodeConfigDataChange({
                                          selectedManipulator: option.index,
                                          isNewRule: true,
                                        }),
                                    );
                                    close();
                                } else {
                                    const chosenOption = ADD_MANIPULATION.OPTIONS?.find?.((eachOption) => eachOption.value === option.value);
                                    console.log('chooseManipulatorOptionchooseManipulatorOption2', chosenOption);
                                    const clonedManipulatorData = cloneDeep(manipulationDetails);
                                    clonedManipulatorData.push({
                                        [SOURCE_TYPE]: chosenOption.value,
                                        [OPERATOR]: MANIPULATION.OPERATOR_OPTIONS(true)?.[0]?.value,
                                        [TYPE]: option.value,
                                    });
                                    dispatch(
                                        nodeConfigDataChange({
                                          selectedManipulator: option.index,
                                          manipulationDetails: clonedManipulatorData,
                                        }),
                                    );
                                    close();
                                }
                            }}
                        >
                            <div className={cx(gClasses.FTwo13, styles.FlowOrDlLabel)}>{option.label}</div>
                        </button>
                    )
                }
                className={gClasses.Zindex1}
            />
        </div>
    );

    const onCreateFieldClick = () => {
        dispatch(
          nodeConfigDataChange({
            isCreateFieldModalOpen: true,
          }),
        );
    };

    const onFieldCloseClick = () => {
        dispatch(
          nodeConfigDataChange({
            isCreateFieldModalOpen: false,
          }),
        );
    };

    const handleSaveFieldResponse = () => {
        getAllFields(EMPTY_STRING, 1);
      };

    return (
        <div>
            <div className={cx(gClasses.DisplayFlex, gClasses.JusEnd)}>
                <button
                    onClick={onCreateFieldClick}
                    className={cx(styles.Button)}
                >
                    <Plus />
                    {DATA_MANIPULATOR_STEP_CONFIGURATION(t).CREATE_FLOW_FIELD}
                </button>
            </div>
            <ManageFlowFieldsProvider initialState={cloneDeep(MANAGE_FLOW_FIELD_INITIAL_STATE)}>
                {isCreateFieldModalOpen && (
                <FieldConfiguration
                    metaData={{
                    moduleId: flowData?.flow_id,
                    }}
                    onCloseClick={onFieldCloseClick}
                    onSaveFieldResponse={handleSaveFieldResponse}
                    getSaveTableResponse
                />
                )}
            </ManageFlowFieldsProvider>
            {tableHeader}
            {tableBody}
            {/* {tableTree} */}
            <div className={cx(styles.InsertDropdown, gClasses.CenterV)}>
                <NestedDropdown
                    popperClass={styles.ManipulatorDropdown}
                    dropdownViewProps={{
                        iconOnly: true,
                        icon: (
                            <div className={cx(gClasses.FTwo12BlueV39, gClasses.DisplayFlex, gClasses.FontWeight500)}>
                                {PLUS}
                                <Text
                                    content={ADD_MANIPULATION.BUTTON_LABEL}
                                    className={cx(gClasses.FTwo12BlueV39, gClasses.ML4, gClasses.FontWeight500)}
                                />
                            </div>
                        ),
                    }}
                    totalViews={1}
                >
                    {({ close, view, nextView: onNextView }) => {
                        switch (view) {
                            case 1: return getInitialView(onNextView, close);
                            default: return null;
                        }
                    }}
                </NestedDropdown>
            </div>
            {errorList?.[MANIPULATION_DETAILS] &&
                <div className={gClasses.PT4}>
                    <Text
                        content={errorList?.[MANIPULATION_DETAILS]}
                        size={ETextSize.XS}
                        className={gClasses.FTwo11RedV22}
                    />
                </div>
            }
            <div className={cx(styles.MainpulationInstruction, gClasses.MT16)}>
                    <WarningIcon />
                    <Text
                        content={INSTRUCTION}
                        className={styles.MainpulationInstructionLabel}
                    />
            </div>
            {isNewRule &&
                <ManipulatorConfiguration
                    chosenManipulator={selectedManipulator}
                    closeConfiguration={() => {
                        dispatch(
                            nodeConfigDataChange({
                            selectedManipulator: null,
                            }),
                        );
                    }}
                    isNewRule
                    index={manipulatorEditIndex}
                />
            }
        </div>
    );
}

export default GeneralConfiguration;
