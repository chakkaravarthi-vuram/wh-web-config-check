import React, { useState } from 'react';
import cx from 'classnames/bind';
import { Button, EButtonSizeType, ETextSize, SingleDropdown, Size, Text } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import styles from './KeyValueWithUpdate.module.scss';
import FieldPicker from '../field_picker/FieldPicker';
import { FIELD_LIST_OBJECT } from '../../../../../form/sections/field_configuration/basic_configuration/BasicConfiguration.constants';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { UPDATE_TYPE_OPERATORS_OPTION_LIST, UPDATE_TYPE_OPTIONS_LIST } from '../../send_data_to_datalist/SendDataToDl.constants';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../../../../../utils/constants/form.constant';
import { generateEventTargetObject } from '../../../../../../utils/generatorUtils';
import { cloneDeep, get, isEmpty, has } from '../../../../../../utils/jsUtility';
import Trash from '../../../../../../assets/icons/application/Trash';
import { getFieldsList } from '../RowComponents.utils';
import { ROW_COMPONENT_STRINGS } from '../RowComponents.strings';

function KeyValueWithUpdate(props) {
  const {
    currentRow = {},
    hideSecondColumn,
    onChangeHandlers,
    path,
    parentDetails = {},
    additionalRowComponentProps = {},
    errorList,
    duplicateKeyRow,
  } = props;

  const { ERROR_MESSAGES } = ROW_COMPONENT_STRINGS();

  const { t } = useTranslation();
  const [searchText, setSearchText] = useState();

  const {
    keyObject: { key, updateType, rowUuid, deleteRow, childKey, columnMappingListKey },
    isEditableKey,
    mappedData,
    mappingFields = [],
  } = additionalRowComponentProps;

  console.log(
    'DefaultRowComponent',
    mappingFields,
    currentRow,
    hideSecondColumn,
    additionalRowComponentProps,
  );

  let parentKeyTableUuid = null;
  let pathArr = cloneDeep(path);
  let keyFieldsList = null;
  const isChildRow = path.includes(childKey);

  pathArr = pathArr.split(',');
  (pathArr || []).splice(pathArr.length - 2, 2);
  parentKeyTableUuid = get(mappedData, [...pathArr, rowUuid], null);

  if (isEditableKey) {
    const mappedFieldUuids = [];
    mappedData?.forEach((rowData) => {
      if (rowData?.[rowUuid] && !rowData?.is_deleted) {
        mappedFieldUuids.push(rowData?.[rowUuid]);
        rowData?.[childKey]?.forEach((childRowData) => {
          if (childRowData?.[rowUuid] && !childRowData.is_deleted) {
            mappedFieldUuids.push(childRowData?.[rowUuid]);
          }
        });
      }
    });

    keyFieldsList = getFieldsList({
      tableUuid: parentKeyTableUuid,
      allFields: mappingFields,
      mappedFieldUuids,
      allowedFieldTypes: [],
      ignoreFieldTypes: [FIELD_TYPE.INFORMATION],
      allowedFieldListTypes: isChildRow ? [FIELD_LIST_TYPE.TABLE] : [FIELD_LIST_TYPE.DIRECT],
      selectedTableFields: isChildRow,
      searchText,
    });
  }

  const isDuplicateKeyError = !isEmpty(duplicateKeyRow?.[key]) && !isEmpty(currentRow?.[key]) && duplicateKeyRow?.[key] === currentRow?.[key];

  const handleKeyChangeHandler = (id, selectedValue) => {
    const selectedField = mappingFields?.find(
      (eachField) => eachField?.fieldUuid === selectedValue,
    );
    onChangeHandlers({
      event: generateEventTargetObject(id, selectedValue, { selectedField }),
      type: key,
      path,
      isDuplicateKeyError,
      duplicateKeyRow,
    });
  };

  let errorComponent = null;

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

  let keyError = errorList?.[`${path},${rowUuid}`] || errorList?.[`${path},${key}`];
  if (currentRow?.[rowUuid] && (!currentRow?.[key])) {
    keyError = 'Field has been deleted';
  }

  return (
    <>
      <div className={cx(gClasses.DisplayFlex, gClasses.W100)}>
        {
          isEditableKey ? (
            <div className={cx(styles.InputColumn, styles.ChooseDropdown)}>
            <SingleDropdown
              dropdownViewProps={{
                selectedLabel: currentRow?.[key],
                onClick: () => setSearchText(),
                onKeyDown: () => setSearchText(),
              }}
              selectedValue={currentRow?.[rowUuid]}
              errorMessage={keyError}
              optionList={cloneDeep(keyFieldsList).map((field) => {
                field.value = field?.[rowUuid];
                return field;
              })}
              searchProps={{
                searchValue: searchText,
                onChangeSearch: (event) => setSearchText(event.target.value),
              }}
              onClick={(selectedValue) => {
                handleKeyChangeHandler(rowUuid, selectedValue);
              }}
              showReset
            />
            </div>
          ) : (
            <div className={styles.InputColumn}>
              <Text content={currentRow?.[key]} />
            </div>
          )
        }
        <div className={cx(styles.TypeColumn, styles.TypeColumnMargin)}>
          <Text content={FIELD_LIST_OBJECT(t)?.[currentRow?.fieldType]} />
        </div>
        <div className={cx(styles.UpdateColumn)}>
          <SingleDropdown
            id={updateType}
            optionList={!isChildRow && [FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY].includes(currentRow?.fieldType) ? (UPDATE_TYPE_OPERATORS_OPTION_LIST(t) || []) : (UPDATE_TYPE_OPTIONS_LIST(t) || [])}
            dropdownViewProps={{
              size: Size.md,
            }}
            onClick={(selectedValue, _label, _list, id) =>
              onChangeHandlers({
                event: generateEventTargetObject(id, selectedValue),
                type: updateType,
                path,
              })
            }
            selectedValue={currentRow?.[updateType]}
            errorMessage={EMPTY_STRING}
            className={styles.ValueFlex}
          />
        </div>
        <div className={styles.OutputColumn}>
          <FieldPicker
            currentRow={currentRow}
            path={path}
            errorList={errorList}
            additionalRowComponentProps={{
              ...additionalRowComponentProps,
              childFieldDetails: {
                field_id: currentRow?._id,
                fieldType: currentRow?.fieldType,
                choiceValues: currentRow?.choiceValues,
              },
            }}
            parentDetails={parentDetails}
            onChangeHandlers={onChangeHandlers}
          />
        </div>
        {
          isEditableKey && (
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
          )
        }
      </div>
      {errorComponent}
    </>
  );
}

export default KeyValueWithUpdate;
