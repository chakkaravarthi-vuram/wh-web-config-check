import React, { useState } from 'react';
import cx from 'classnames/bind';
import { Button, EButtonSizeType, ETextSize, SingleDropdown, Text } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import styles from './KeyValueType.module.scss';
import FieldPicker from '../field_picker/FieldPicker';
import { FIELD_LIST_OBJECT } from '../../../../../form/sections/field_configuration/basic_configuration/BasicConfiguration.constants';
import { cloneDeep, get, isEmpty, has } from '../../../../../../utils/jsUtility';
import { generateEventTargetObject } from '../../../../../../utils/generatorUtils';
import Trash from '../../../../../../assets/icons/application/Trash';
import { EMPTY_STRING, NO_DATA_FOUND, SELECT_LABEL } from '../../../../../../utils/strings/CommonStrings';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../../../../../utils/constants/form.constant';
import { getFieldsList } from '../RowComponents.utils';
import { ROW_COMPONENT_STRINGS } from '../RowComponents.strings';

function KeyValueType(props) {
  const {
    currentRow = {},
    hideSecondColumn,
    additionalRowComponentProps = {},
    onChangeHandlers,
    path,
    errorList,
    parentDetails,
    duplicateKeyRow = {},
  } = props;

  const { t } = useTranslation();
  const [searchText, setSearchText] = useState();
  const {
    keyObject: { key, isRequired, rowUuid, deleteRow, columnMappingListKey },
    keyLabels: { childKey },
    systemFieldList,
    mappingFields = [],
    isEditableKey,
    mappedData,
  } = additionalRowComponentProps;

  const { ERROR_MESSAGES } = ROW_COMPONENT_STRINGS();

  console.log(
    'DefaultRowComponent',
    mappingFields,
    currentRow,
    rowUuid,
    'hideSecondColumn',
    hideSecondColumn,
    'additionalRowComponentProps',
    additionalRowComponentProps,
    'systemFieldList',
    systemFieldList,
    errorList,
    errorList?.[`mapping,${path},value`],
    { parentDetails },
  );

  let parentKeyTableUuid = null;
  let pathArr = cloneDeep(path);

  pathArr = pathArr.split(',');
  (pathArr || []).splice(pathArr.length - 2, 2);
  parentKeyTableUuid = get(mappedData, [...pathArr, rowUuid], null);

  const isRequiredIcon = currentRow?.[isRequired] ? (
    <span className={styles.Required}>&nbsp;*</span>
  ) : null;

  const isChildRow = path.includes(childKey);
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

  let keyFieldsList = [];
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
        <div className={cx(gClasses.DisplayFlex, styles.InputColumn)}>
          {
            isEditableKey ? (
              <SingleDropdown
                dropdownViewProps={{
                  selectedLabel: currentRow?.[key],
                  onClick: () => setSearchText(),
                  onKeyDown: () => setSearchText(),
                }}
                errorMessage={keyError}
                placeholder={t(SELECT_LABEL)}
                noDataFoundMessage={t(NO_DATA_FOUND)}
                selectedValue={currentRow?.[rowUuid]}
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
            ) : (
              <>
                <Text content={currentRow?.[key]} />
                {isRequiredIcon}
              </>
            )
          }
        </div>
        <div className={cx(styles.TypeColumn, styles.TypeColumnMargin)}>
          <Text content={FIELD_LIST_OBJECT(t)?.[currentRow?.fieldType]} />
        </div>
        <div className={styles.OutputColumn}>
          <FieldPicker
            currentRow={currentRow}
            path={path}
            errorList={errorList}
            disabled={isEditableKey && isEmpty(currentRow?.[rowUuid])}
            onChangeHandlers={onChangeHandlers}
            parentDetails={parentDetails}
            additionalRowComponentProps={{
              ...additionalRowComponentProps,
              childFieldDetails: {
                field_id: currentRow?._id,
                fieldType: currentRow?.fieldType,
                choiceValues: currentRow?.choiceValues,
              },
            }}
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

export default KeyValueType;
