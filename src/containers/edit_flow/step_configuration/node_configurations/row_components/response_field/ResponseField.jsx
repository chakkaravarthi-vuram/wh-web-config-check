import React, { useState } from 'react';
import cx from 'classnames/bind';
import {
  Button,
  SingleDropdown,
  Size,
  TextInput,
  EButtonSizeType,
  ETextSize,
  Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep, get, isEmpty, has } from 'utils/jsUtility';
import styles from './ResponseField.module.scss';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import ResponseBodyMapping from './ResponseBodyMapping';
import {
  ROW_COMPONENT_CONSTANTS,
  ROW_COMPONENT_KEY_TYPES,
} from '../RowComponents.constants';
import { generateEventTargetObject } from '../../../../../../utils/generatorUtils';
import {
  FIELD_LIST_TYPE,
} from '../../../../../../utils/constants/form.constant';
import Trash from '../../../../../../assets/icons/application/Trash';
import { ROW_COMPONENT_STRINGS } from '../RowComponents.strings';
import { getFieldsList } from '../RowComponents.utils';

function ResponseField(props) {
  const {
    currentRow = {},
    hideSecondColumn,
    additionalRowComponentProps = {},
    path = EMPTY_STRING,
    parentDetails = {},
    parentDetails: { parentTableUuid },
    onChangeHandlers,
    depth = 0,
    errorList = {},
    duplicateKeyRow = {},
  } = props;

  const [searchText, setSearchText] = useState();

  console.log(
    'DefaultRowComponent',
    currentRow,
    hideSecondColumn,
    additionalRowComponentProps,
  );

  const {
    fieldDetails,
    isValueFieldsLoading,
    mappedData,
    responseBody,
    keyLabels: { childKey },
    keyObject: {
      key,
      keyType,
      value,
      valueDetails,
      deleteRow,
      columnMappingListKey,
    },
  } = additionalRowComponentProps;

  const { ERROR_MESSAGES } = ROW_COMPONENT_STRINGS();

  const isChildRow = path.includes(childKey);

  const valueFieldsList = getFieldsList({
    tableUuid: parentTableUuid,
    allFields: fieldDetails,
    ignoreFieldTypes: currentRow?.[keyType] !== ROW_COMPONENT_KEY_TYPES.OBJECT ? [FIELD_LIST_TYPE.TABLE] : [],
    allowedFieldTypes: [],
    allowedFieldListTypes: isChildRow ? [FIELD_LIST_TYPE.TABLE] : [FIELD_LIST_TYPE.DIRECT],
    selectedTableFields: isChildRow,
    searchText,
  });

  let valueErrorMessage = errorList?.[`${path},${value}`];
  if (
    !isEmpty(errorList?.[`${path},${valueDetails},fieldType`])
  ) {
    valueErrorMessage =
      errorList?.[`${path},${valueDetails},fieldType`];
  }

  let errorComponent = null;

  const isDuplicateKeyError = !isEmpty(duplicateKeyRow?.[key]) && !isEmpty(currentRow?.[key]) && duplicateKeyRow?.[key] === currentRow?.[key];

  if (
    isDuplicateKeyError ||
    has(errorList, [`${path},${columnMappingListKey}`])
  ) {
    let rowError = ERROR_MESSAGES.ROW_REQUIRED;
    if (isDuplicateKeyError) {
      rowError = ERROR_MESSAGES.DUPLICATE_KEY_NAME;
    }

    errorComponent = (
      <Text size={ETextSize.XS} content={rowError} className={cx(gClasses.red22, gClasses.MT8)} />
    );
  }

  const handleResponseBodyChange = (option) => {
    let currentValue = option?.value;
    let parentPath = EMPTY_STRING;

    if (path?.includes(ROW_COMPONENT_CONSTANTS.COLUMN_MAPPING)) {
      let pathArr = cloneDeep(path);

      pathArr = (pathArr || []).split(',');

      if (
        pathArr.length > 0 &&
        pathArr[pathArr.length - 2] === ROW_COMPONENT_CONSTANTS.COLUMN_MAPPING
      ) {
        pathArr.splice(pathArr.length - 2, 2);
        parentPath = pathArr;
      }

      const parentLabel = `${get(mappedData, [...parentPath, key])}.`;
      currentValue = currentValue.replace(parentLabel, EMPTY_STRING);
    }

    onChangeHandlers({
      event: generateEventTargetObject(key, currentValue, {
        isUpdateAnotherValue: true,
        updateType:
          ROW_COMPONENT_CONSTANTS.ANOTHER_VALUE_UPDATE_TYPES.RESPONSE_BODY_TYPE,
        updateId: keyType,
        updateValue: option?.type,
      }),
      type: key,
      path,
    });
  };

  const handleValueChangeHandler = (id, selectedValue) => {
    const selectedField = fieldDetails?.find(
      (eachField) => eachField?.fieldUuid === selectedValue,
    );

    onChangeHandlers({
      event: generateEventTargetObject(id, selectedValue, {
        isUpdateAnotherValue: true,
        updateType: valueDetails,
        updateId: valueDetails,
        updateValue: selectedField,
      }),
      type: value,
      path,
      isDuplicateKeyError,
      duplicateKeyRow,
    });
  };

  let firstColumnComponent = null;

  if (!isEmpty(responseBody)) {
    firstColumnComponent = (
      <ResponseBodyMapping
        id={key}
        currentRow={currentRow}
        value={currentRow?.[key]}
        path={path}
        errorMessage={errorList?.[`${path},${key}`]}
        onChangeHandler={handleResponseBodyChange}
        isChildMapping={parentDetails?.isObjectParent}
        additionalRowComponentProps={additionalRowComponentProps}
      />
    );
  } else {
    firstColumnComponent = (
      <TextInput
        onChange={(event) =>
          onChangeHandlers({
            event,
            type: key,
            path,
          })
        }
        id={key}
        value={currentRow?.[key]}
        errorMessage={errorList?.[`${path},${key}`]}
      />
    );
  }

  let fieldOptionList = cloneDeep(
    ROW_COMPONENT_CONSTANTS.getResponseBodyOptions(),
  );

  if (depth === ROW_COMPONENT_CONSTANTS.RESPONSE_BODY_MAX_DEPTH) {
    fieldOptionList = fieldOptionList?.filter((eachFieldOption) => eachFieldOption?.value !== ROW_COMPONENT_KEY_TYPES.OBJECT);
  }

  const getModifiedValueList =
    cloneDeep(valueFieldsList).map((eachrow) => { return { ...eachrow, optionLabelClassName: cx(gClasses.Ellipsis, styles.FlexBasisMaxWidth) }; });

  return (
    <>
      <div className={cx(gClasses.DisplayFlex, gClasses.W100)}>
        <div className={cx(styles.InputColumn)}>
          {firstColumnComponent}
        </div>
        <div className={cx(styles.TypeColumn)}>
          <SingleDropdown
            id={keyType}
            optionList={fieldOptionList}
            dropdownViewProps={{
              size: Size.md,
              disabled: !isEmpty(responseBody),
            }}
            onClick={(selectedValue, _label, _list, id) =>
              onChangeHandlers({
                event: generateEventTargetObject(id, selectedValue),
                type: keyType,
                path,
              })
            }
            selectedValue={currentRow?.[keyType]}
            errorMessage={errorList?.[`${path},${keyType}`]}
            showReset
          />
        </div>
        <div className={styles.OutputColumn}>
          <SingleDropdown
            id={value}
            optionList={cloneDeep(getModifiedValueList)}
            dropdownViewProps={{
              size: Size.md,
              selectedLabel:
                currentRow?.[valueDetails]?.label ||
                currentRow?.[valueDetails]?.fieldName,
                onClick: () => setSearchText(),
                onKeyDown: () => setSearchText(),
            }}
            searchProps={{
              searchValue: searchText,
              onChangeSearch: (event) => setSearchText(event.target.value),
            }}
            onClick={(selectedValue, _label, _list, id) =>
              handleValueChangeHandler(id, selectedValue)
            }
            selectedValue={currentRow?.[value]}
            errorMessage={valueErrorMessage}
            showReset
            className={styles.FlexBasisMaxWidth}
            isLoadingOptions={isValueFieldsLoading}
          />
        </div>
        <Button
          className={cx(styles.DeleteIcon, styles.DeleteColumn)}
          iconOnly
          icon={<Trash />}
          size={EButtonSizeType.SM}
          onClickHandler={() =>
            onChangeHandlers({
              type: deleteRow,
              path,
            })
          }
          type={EMPTY_STRING}
        />
      </div>
      {errorComponent}
    </>
  );
}

export default ResponseField;
