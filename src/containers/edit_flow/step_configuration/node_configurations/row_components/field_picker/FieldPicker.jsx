import React, { useContext, useState } from 'react';
import cx from 'classnames/bind';
import {
  DropdownList,
  NestedDropdown,
  SingleDropdown,
  Size,
  EPopperPlacements,
  Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import { isEmpty, cloneDeep, find, remove, isArray, uniqBy } from 'utils/jsUtility';
import { useSelector } from 'react-redux';
import {
  EMPTY_STRING,
  NO_DATA_FOUND,
  SELECT_LABEL,
} from '../../../../../../utils/strings/CommonStrings';
import styles from './FieldPicker.module.scss';
import { getFieldsList, getValueTypes } from '../RowComponents.utils';
import {
  FIELD_MAPPING_TABLE_TYPES,
  FIELD_VALUE_TYPES,
  MAPPING_COMPONENT_TYPES,
  ROW_COMPONENT_KEY_TYPES,
} from '../RowComponents.constants';
import StaticValue from '../../../../../../components/static_value_new/StaticValue';
import { getOptionListForStaticValue } from '../../../StepConfiguration.utils';
import { generateEventTargetObject } from '../../../../../../utils/generatorUtils';
import {
  FIELD_LIST_TYPE,
  FIELD_TYPE,
} from '../../../../../../utils/constants/form.constant';
import { FIELD_LIST_OBJECT } from '../../../../../form/sections/field_configuration/basic_configuration/BasicConfiguration.constants';

import RightMultiNavigateIcon from '../../../../../../assets/icons/RightMultiNavigateIcon';
import CheckIcon from '../../../../../../assets/icons/flow_icons/CheckIcon';
import ThemeContext from '../../../../../../hoc/ThemeContext';
import LeftDirArrowIcon from '../../../../../../assets/icons/app_builder_icons/LeftDirArrow';
import { MODULE_TYPES } from '../../../../../../utils/Constants';

function FieldPicker(props) {
  const {
    currentRow,
    additionalRowComponentProps,
    onChangeHandlers,
    path,
    errorList,
    parentDetails: { parentTableUuid, isMulitpleChild },
    disabled,
    placeholder,
  } = props;

  const [selectedStep, setSelectedStep] = useState({});
  const [searchText, setSearchText] = useState();

  const { colorSchemeDefault } = useContext(ThemeContext);
  let disableValueType = currentRow?.fieldType === FIELD_TYPE.TABLE;
  const {
    fieldDetails,
    isValueFieldsLoading,
    isIterativeFieldsLoading,
    childFieldDetails,
    keyObject,
    keyLabels: { childKey },
    keyObject: { value, valueType, valueDetails, documentDetails, keyType },
    systemFieldsList = [],
    ignoreFieldTypes = [],
    mappingComponent,
    fileUploadProps = {},
    allowedCurrencyList,
    defaultCurrencyType,
    defaultCountryCode,
    parentId,
    metaData,
    isHideStaticValue,
    documentUrlDetails,
    iterativeField = {},
    iterativeFields = [],
    fieldPickerClass = EMPTY_STRING,
    mappingVariant,
  } = additionalRowComponentProps;

  const {
    contextId,
    fileEntityId,
    fileEntity,
    fileEntityType,
    fileEntityUuid,
    maximumFileSize,
    allowedExtensions,
    isMultiple,
    refUuid,
  } = fileUploadProps || {};

  const { t } = useTranslation();
  const userDataListUUID = useSelector((state) => state?.UserProfileReducer?.user_data_list_uuid);
  let errorMessage = null;
  if (!disabled) {
    Object.keys(errorList)?.forEach((errorKey) => {
      if (
        !isEmpty(errorList?.[`${path},dataListDetails,dataListUuid`])
      ) {
        errorMessage = errorList?.[`${path},dataListDetails,dataListUuid`];
      } else if (errorKey === `${path},${value}`) {
        errorMessage = errorList?.[errorKey];
      }
    });
    if (
      !isEmpty(errorList?.[`${path},fieldType`]) ||
      !isEmpty(errorList?.[`${path},choiceValueType`])
    ) {
      const fieldType = currentRow?.fieldDetails?.propertyFieldType || currentRow?.fieldDetails?.fieldType;
      const choiceValueType = currentRow?.fieldDetails?.propertyChoiceValueType || currentRow?.fieldDetails?.choiceValueType;
      errorMessage = errorList?.[`${path},fieldType`] ||
        errorList?.[`${path},choiceValueType`];
      if (fieldType && choiceValueType) {
        errorMessage = `${errorMessage} (${FIELD_LIST_OBJECT(t)?.[fieldType]} - ${choiceValueType})`;
      } else if (fieldType) {
        errorMessage = `${errorMessage} (${FIELD_LIST_OBJECT(t)?.[fieldType]})`;
      }
    }
  }

  const isChildRow = path.includes(childKey);

  console.log(
    errorList,
    'additionalRowComponentPropsFieldPicker',
    currentRow,
    path,
    additionalRowComponentProps,
    errorMessage,
    fieldDetails,
    errorList?.[`${path},${valueDetails},propertyFieldType`],
  );

  if (isChildRow && [MAPPING_COMPONENT_TYPES.TRIGGER_ACTIONS].includes(mappingComponent)) {
    disableValueType = true;
  } else if (
    mappingVariant === FIELD_MAPPING_TABLE_TYPES.REQ_BODY_VALUE_MAPPING &&
    currentRow?.[keyObject?.isMultiple]
  ) {
    disableValueType = true;
  }
  const isIterative = currentRow?.[valueType] === FIELD_VALUE_TYPES.ITERATIVE;
  let valueFieldsList = [];
  if (currentRow?.[valueType] === FIELD_VALUE_TYPES.DYNAMIC) {
    let allowedFieldListTypes = [FIELD_LIST_TYPE.DIRECT];
    let allowedFieldTypes = (currentRow?.fieldType === FIELD_TYPE.TABLE) ? [FIELD_TYPE.TABLE] : [];
    let ignoreFieldTypesArray = ignoreFieldTypes;
    let tableUuid = parentTableUuid;
    let fieldDetailsList = fieldDetails;

    if (isChildRow) {
      ignoreFieldTypesArray = [...ignoreFieldTypesArray, FIELD_TYPE.TABLE];
      if ([MAPPING_COMPONENT_TYPES.SEND_DATA_TO_DL].includes(mappingComponent)) {
        if (parentTableUuid) {
          allowedFieldListTypes = [FIELD_LIST_TYPE.TABLE];
        } else allowedFieldListTypes = [FIELD_LIST_TYPE.DIRECT];
      } else if (mappingComponent === MAPPING_COMPONENT_TYPES.CALL_INTEGRATION) {
        if (currentRow?.[keyType] === ROW_COMPONENT_KEY_TYPES.OBJECT) {
          ignoreFieldTypesArray = ignoreFieldTypes;
          allowedFieldListTypes = [FIELD_LIST_TYPE.DIRECT];
          allowedFieldTypes = [FIELD_TYPE.TABLE];
          tableUuid = null;
        } else if (parentTableUuid) {
          allowedFieldListTypes = [FIELD_LIST_TYPE.TABLE];
        } else if (isMulitpleChild) {
          fieldDetailsList = [];
        } else {
          // do nothing
        }
      } else {
        allowedFieldListTypes = [FIELD_LIST_TYPE.TABLE];
      }
    } else if (mappingComponent === MAPPING_COMPONENT_TYPES.CALL_INTEGRATION) {
      if (currentRow?.[keyType] === ROW_COMPONENT_KEY_TYPES.OBJECT) {
        ignoreFieldTypesArray = ignoreFieldTypes;
        allowedFieldListTypes = [FIELD_LIST_TYPE.DIRECT];
        allowedFieldTypes = [FIELD_TYPE.TABLE];
        tableUuid = null;
      }
    }

    valueFieldsList = getFieldsList({
      tableUuid,
      allFields: fieldDetailsList,
      ignoreFieldTypes: ignoreFieldTypesArray,
      allowedFieldTypes,
      allowedFieldListTypes,
      selectedTableFields: isChildRow,
      searchText,
    });
  }

  const handleValueChangeHandler = (id, selectedValue) => {
    const selectedField = fieldDetails?.find(
      (eachField) => eachField?.fieldUuid === selectedValue,
    );

    let updatedData = {};

    if (valueDetails) {
      updatedData = {
        isUpdateAnotherValue: true,
        updateType: valueDetails,
        updateId: valueDetails,
        updateValue: selectedField,
      };
    }

    onChangeHandlers({
      event: generateEventTargetObject(id, selectedValue, updatedData),
      type: value,
      path,
    });
  };

  const handleStaticValueChange = (event) => {
    if (childFieldDetails?.fieldType === FIELD_TYPE.FILE_UPLOAD) {
      onChangeHandlers({
        event: generateEventTargetObject(event?.target?.id, event?.target?.value, {
          isUpdateAnotherValue: true,
          updateType: EMPTY_STRING,
          updateId: documentDetails,
          updateValue: {
            docDetails: event?.target?.docDetails,
            refUuid: event?.target?.refUuid,
          },
        }),
        type: value,
        path,
      });
    } else if (childFieldDetails?.fieldType === FIELD_TYPE.DATA_LIST) {
      let currentUpdatedValue = cloneDeep(currentRow?.[value]) || {};
      if (event?.target?.removeDlValue) {
        if (
          isArray(currentUpdatedValue) &&
          currentUpdatedValue?.find((datalistValue) => datalistValue.value === event?.target?.value)
        ) {
          remove(currentUpdatedValue, { value: event?.target?.value });
          if (isEmpty(currentUpdatedValue)) currentUpdatedValue = null;
        }
      } else {
        if (isArray(currentUpdatedValue)) {
          currentUpdatedValue = uniqBy([...currentUpdatedValue, event?.target], (value) => value.value);
        } else currentUpdatedValue = [event?.target];
      }

      onChangeHandlers({
        event: generateEventTargetObject(value, currentUpdatedValue),
        type: value,
        path,
      });
    } else if (childFieldDetails?.fieldType === FIELD_TYPE.USER_TEAM_PICKER) {
      let currentUpdatedValue = cloneDeep(currentRow?.[value]) || {};
      if (event?.target?.value) {
        if (event?.target?.removeUserValue) {
          const id = cloneDeep(event.target.value);
          if (currentUpdatedValue?.teams) {
            if (find(currentUpdatedValue?.teams, { _id: id })) {
              remove(currentUpdatedValue?.teams, { _id: id });
              if (currentUpdatedValue?.teams.length === 0) delete currentUpdatedValue?.teams;
            }
          }
          if (currentUpdatedValue?.users) {
            if (find(currentUpdatedValue?.users, { _id: id })) {
              remove(currentUpdatedValue?.users, { _id: id });
              if (currentUpdatedValue?.users?.length === 0) delete currentUpdatedValue?.users;
            }
          }
        } else {
          const team_or_user = event.target.value;
          if (!currentUpdatedValue) currentUpdatedValue = {};
          if (team_or_user.is_user) {
            if (currentUpdatedValue?.users) {
              if (!find(currentUpdatedValue?.users, { _id: team_or_user._id })) currentUpdatedValue?.users.push(team_or_user);
            } else {
              currentUpdatedValue.users = [];
              currentUpdatedValue.users.push(team_or_user);
            }
          } else if (!team_or_user.is_user) {
            if (team_or_user.user_type) {
              if (currentUpdatedValue && currentUpdatedValue?.users) {
                if (!find(currentUpdatedValue?.users, { _id: team_or_user._id })) currentUpdatedValue?.users.push(team_or_user);
              } else {
                currentUpdatedValue.users = [];
                currentUpdatedValue?.users.push(team_or_user);
              }
            } else {
              if (currentUpdatedValue && currentUpdatedValue?.teams) {
                if (!find(currentUpdatedValue?.teams, { _id: team_or_user._id })) currentUpdatedValue?.teams.push(team_or_user);
              } else {
                currentUpdatedValue.teams = [];
                currentUpdatedValue?.teams.push(team_or_user);
              }
            }
          }
        }
        onChangeHandlers({
          event: generateEventTargetObject(value, currentUpdatedValue),
          type: value,
          path,
        });
      }
    } else {
      onChangeHandlers({
        event,
        type: value,
        path,
      });
    }
  };

  const getInitialView = (onNextView, close) => (
    <div>
      <DropdownList
        optionList={cloneDeep(systemFieldsList) || []}
        selectedValue={currentRow?.[value]}
        customDropdownListView={(option) => (
          <button
            style={{
              backgroundColor:
                option?.value === currentRow?.[value]
                  ? `${colorSchemeDefault?.activeColor}10`
                  : EMPTY_STRING,
            }}
            className={cx(
              styles.ViewContainer,
              gClasses.CenterV,
              gClasses.JusSpaceBtw,
              gClasses.W100,
              gClasses.PX12,
              gClasses.PY10,
              gClasses.TextAlignLeftImp,
            )}
            onClick={() => {
              if (option?.isStep) {
                setSelectedStep(option);
                onNextView();
              } else {
                let updatedData = {};
                if (valueDetails) {
                  updatedData = {
                    isUpdateAnotherValue: true,
                    updateType: EMPTY_STRING,
                    updateId: valueDetails,
                    updateValue: option,
                  };
                }

                onChangeHandlers({
                  event: generateEventTargetObject(
                    value,
                    option.value,
                    updatedData,
                  ),
                  type: value,
                  path,
                });
                close();
              }
            }}
          >
            <div className={cx(gClasses.FTwo13, gClasses.Ellipsis, styles.FlowOrDlLabel)} title={option.label}>
              {option.label}
            </div>
            {option.isStep ? (
              <RightMultiNavigateIcon className={styles.MinWidth16} />
            ) : (
              currentRow?.[value] === option.value && <CheckIcon />
            )}
          </button>
        )}
        className={gClasses.Zindex1}
      />
    </div>
  );

  const getUserStepName = (onPreviousView, close) => (
    <div className={styles.SecondNestedView}>
      <button
        className={cx(gClasses.PX12, gClasses.W100, gClasses.PY10, gClasses.CenterV)}
        onClick={onPreviousView}
      >
        <LeftDirArrowIcon className={cx(gClasses.MR5, styles.MinWidth16)} fill="#959BA3" />
        <Text content={selectedStep.label} className={gClasses.Ellipsis} title={selectedStep.label} />
      </button>
      <DropdownList
        className={styles.Dropdown}
        optionList={cloneDeep(selectedStep?.subMenuItems) || []}
        selectedValue={currentRow?.[value]}
        customDropdownListView={(option) => (
          <button
            style={{
              backgroundColor:
                option?.value === currentRow?.[value]
                  ? `${colorSchemeDefault?.activeColor}10`
                  : EMPTY_STRING,
            }}
            className={cx(
              styles.ViewContainer,
              gClasses.CenterV,
              gClasses.JusSpaceBtw,
              gClasses.W100,
              gClasses.PX12,
              gClasses.PY10,
              gClasses.TextAlignLeftImp,
            )}
            onClick={() => {
              let updatedData = {};
              if (valueDetails) {
                updatedData = {
                  isUpdateAnotherValue: true,
                  updateType: EMPTY_STRING,
                  updateId: valueDetails,
                  updateValue: option,
                };
              }
              onChangeHandlers({
                event: generateEventTargetObject(
                  value,
                  option.value,
                  updatedData,
                ),
                type: value,
                path,
              });
              close();
            }}
          >
            <div className={cx(gClasses.FTwo13, styles.FlowOrDlLabel)}>
              {option.label}
            </div>
            {currentRow?.[value] === option.value && <CheckIcon />}
          </button>
        )}
      />
    </div>
  );

  const modifiedFields =
    (isIterative ? cloneDeep(iterativeFields) : cloneDeep(valueFieldsList)).map((eachrow) => {
      return { ...eachrow, optionLabelClassName: cx(gClasses.Ellipsis, styles.OptionMaxWidth) };
    });

  const getValueComponent = () => {
    if (currentRow?.[valueType] === FIELD_VALUE_TYPES.DYNAMIC || isIterative) {
      const disableValuePicker =
        disabled ||
        (isChildRow &&
          [MAPPING_COMPONENT_TYPES.CALL_SUB_FLOW, MAPPING_COMPONENT_TYPES.TRIGGER_ACTIONS].includes(mappingComponent) &&
          isEmpty(parentTableUuid));
      return (
        <SingleDropdown
          id={value}
          optionList={modifiedFields}
          placeholder={placeholder || t(SELECT_LABEL)}
          dropdownViewProps={{
            size: Size.md,
            selectedLabel: currentRow?.[valueDetails]?.label,
            onClick: () => setSearchText(),
            onKeyDown: () => setSearchText(),
            disabled: disableValuePicker,
            className: fieldPickerClass || styles.DropdownMaxWidth,
          }}
          searchProps={{
            searchValue: searchText,
            onChangeSearch: (event) => setSearchText(event.target.value),
          }}
          onClick={(selectedValue, _label, _list, id) =>
            handleValueChangeHandler(id, selectedValue)
          }
          errorMessage={errorMessage}
          noDataFoundMessage={t(NO_DATA_FOUND)}
          selectedValue={currentRow?.[value]}
          showReset
          className={cx(styles.ValueFlex, fieldPickerClass || styles.DropdownMaxWidth)}
          isLoadingOptions={isIterative ? isIterativeFieldsLoading : isValueFieldsLoading}
        />
      );
    } else if (currentRow?.[valueType] === FIELD_VALUE_TYPES.SYSTEM) {
      console.log('currentrowparent', currentRow);
      return (
        <NestedDropdown
          id={value}
          displayText={
            currentRow?.[valueDetails]?.parentLabel ||
            currentRow?.[valueDetails]?.label
          }
          totalViews={2}
          placeholder={t(SELECT_LABEL)}
          popperPlacement={EPopperPlacements.BOTTOM}
          errorMessage={errorMessage}
          isLoading={isValueFieldsLoading}
          dropdownViewProps={{
            disabled,
            onClearClick: () => onChangeHandlers({
              event: generateEventTargetObject(
                value,
                null,
                {
                  isUpdateAnotherValue: true,
                  updateType: EMPTY_STRING,
                  updateId: valueDetails,
                  updateValue: {},
                },
              ),
              type: value,
              path,
            }),
            showReset: true,
            className: fieldPickerClass || (currentRow?.fieldListType === FIELD_LIST_TYPE.TABLE ? styles.TableDropdownMaxWidth : styles.DropdownMaxWidth),
          }}
        >
          {({
            close,
            view,
            nextView: onNextView,
            prevView: onPreviousView,
          }) => {
            switch (view) {
              case 1:
                return getInitialView(onNextView, close);
              case 2:
                return getUserStepName(onPreviousView, close);
              default:
                return null;
            }
          }}
        </NestedDropdown>
      );
    } else if (currentRow?.[valueType] === FIELD_VALUE_TYPES.STATIC) {
      return (
        <div className={gClasses.W100}>
          <StaticValue
            childFieldDetails={childFieldDetails}
            fieldType={childFieldDetails?.fieldType || FIELD_TYPE.SINGLE_LINE}
            onStaticValueChange={handleStaticValueChange}
            staticValue={currentRow?.[value]}
            staticValueError={errorMessage}
            errorList={errorList}
            dropdownOptionList={cloneDeep(getOptionListForStaticValue(
              childFieldDetails,
              'fieldType',
              'choiceValues',
              { isIntegrationStep: mappingComponent === MAPPING_COMPONENT_TYPES.CALL_INTEGRATION },
            ))}
            parentId={parentId}
            id={value}
            path={path}
            disabled={disabled}
            fileUploadProps={{
              contextId,
              fileEntityId,
              fileEntityUuid,
              fileEntity,
              fileEntityType,
              docDetails: documentUrlDetails,
              maximumFileSize,
              allowedExtensions,
              isMultiple,
              refUuid,
            }}
            allowedCurrencyList={allowedCurrencyList}
            defaultCurrencyType={defaultCurrencyType}
            defaultCountryCode={defaultCountryCode}
            metaData={metaData}
            showReset
          />
        </div>
      );
    } else {
      // do nothing
      return null;
    }
  };

  let valueTypeOptionList = cloneDeep(getValueTypes(t)) || [];
  const childDataListUuid = currentRow?.dataListDetails?.dataListUuid;

  if (isChildRow || isEmpty(iterativeField?.fieldUuid)) {
    valueTypeOptionList = valueTypeOptionList?.filter((eachOption) => eachOption?.value !== FIELD_VALUE_TYPES.ITERATIVE);
  }

  if (isHideStaticValue) {
    valueTypeOptionList = valueTypeOptionList?.filter((eachOption) => eachOption?.value !== FIELD_VALUE_TYPES.STATIC);
  }

  if (
    metaData?.childModuleType !== MODULE_TYPES.DATA_LIST ||
    (
      isEmpty(metaData?.childModuleUuid) ||
      isEmpty(childDataListUuid) ||
      childDataListUuid !== metaData?.childModuleUuid
    )
  ) {
    valueTypeOptionList = valueTypeOptionList?.filter((eachOption) => eachOption?.value !== FIELD_VALUE_TYPES.MAP_ENTRY);
  }

  if (currentRow?.fieldType !== FIELD_TYPE.USER_TEAM_PICKER || metaData?.childModuleUuid !== userDataListUUID) {
    valueTypeOptionList = valueTypeOptionList?.filter((eachOption) => eachOption?.value !== FIELD_VALUE_TYPES.USER_ENTRY);
  }

  return (
    <div
      className={cx(
        styles.ValueContainer,
        gClasses.DisplayFlex,
        gClasses.AlignCenter,
        styles.FirstColumn,
      )}
    >
      <SingleDropdown
        id={valueType}
        optionList={valueTypeOptionList}
        dropdownViewProps={{
          size: Size.md,
          disabled: disableValueType,
        }}
        onClick={(selectedValue, _label, _list, id) =>
          onChangeHandlers({
            event: generateEventTargetObject(id, selectedValue, {
              isUpdateAnotherValue: true,
              updateType: valueType,
              updateId: value,
              updateValue: null,
            }),
            type: valueType,
            path,
          })
        }
        selectedValue={currentRow?.[valueType]}
        errorMessage={EMPTY_STRING}
        className={styles.ValueTypeFlex}
      />
      {FIELD_VALUE_TYPES.MAP_ENTRY !== currentRow?.[valueType] && getValueComponent()}
    </div>
  );
}

export default FieldPicker;
