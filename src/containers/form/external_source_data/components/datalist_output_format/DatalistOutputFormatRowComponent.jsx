/* eslint-disable no-unused-vars */
import React from 'react';
import cx from 'classnames/bind';
import { cloneDeep, isEmpty, get, has } from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import {
  Button,
  EButtonSizeType,
  ETextSize,
  Text,
  TextInput,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styles from './DatalistOutputFormat.module.scss';
import { DATA_LIST_CONSTANTS, OUTPUT_FORMAT_CONSTANTS } from '../../ExternalSource.constants';
import { generateEventTargetObject } from '../../../../../utils/generatorUtils';
import { getAllFieldsUuidList } from '../../../../../utils/UtilityFunctions';
import Trash from '../../../../../assets/icons/application/Trash';
import { useExternalSource } from '../../useExternalSource';
import {
  DATA_SOURCE_TYPES,
  ERROR_MESSAGES,
} from '../../ExternalSource.strings';
import FieldPicker from '../../../../../components/field_picker/FieldPicker';
import { getFieldTypeOptions } from '../../ExternalSource.utils';
import {
  FEILD_LIST_DROPDOWN_TYPE,
  getGroupedFieldListForMapping,
} from '../../../../edit_flow/step_configuration/StepConfiguration.utils';
import { FIELD_PICKER_DROPDOWN_TYPES } from '../../../../../components/field_picker/FieldPicker.utils';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { FIELD_LIST_OBJECT } from '../../../sections/field_configuration/basic_configuration/BasicConfiguration.constants';

function DatalistOutputFormatRowComponent(props) {
  const {
    currentRow = {},
    onChangeHandlers,
    path = EMPTY_STRING,
    errorList = {},
    readOnlyView = false,
    parentDetails: { parentTableUuid },
    duplicateKeyRow = {},
  } = props;

  const { t } = useTranslation();

  const { state } = useExternalSource();

  const {
    dlFieldList,
    fieldListForTableSubQuery,
    isDLFieldListLoading,
    outputFormat,
    type,
    systemFields: statesystemFields = {},
  } = state;

  const isEachEntryView = state?.pageId;
  const isSubTableQuery = type === DATA_LIST_CONSTANTS.QUERY_TYPE.SUB_TABLE_QUERY;
  const fieldList = (isSubTableQuery) ? fieldListForTableSubQuery : dlFieldList;

  if (currentRow?.is_deleted) return null;

  const fieldListDropdownType = () => {
    if (parentTableUuid) {
      return FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS;
    } else if (isSubTableQuery) {
      return FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS_AND_DIRECT;
    } else {
      return FEILD_LIST_DROPDOWN_TYPE.ALL;
    }
  };

  let parentPath = EMPTY_STRING;

  if (parentTableUuid) {
    const pathArr = (path || []).split(',');
    if (
      pathArr.length > 0 &&
      pathArr[pathArr.length - 2] === OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING
    ) {
      pathArr.splice(pathArr.length - 1, 1);
      parentPath = pathArr;
    }
  }

  let errorComponent = null;

  const isDuplicateKeyError = duplicateKeyRow?.key === currentRow?.key;

  if (isDuplicateKeyError || has(errorList, [`${path},${OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING}`])) {
    let rowError = ERROR_MESSAGES.ROW_REQUIRED;
    if (isDuplicateKeyError) {
      rowError = ERROR_MESSAGES.DUPLICATE_KEY_NAME;
    }

    errorComponent = (
      <Text
        size={ETextSize.XS}
        content={rowError}
        className={gClasses.red22}
      />
    );
  }

  let currentLevelList = parentTableUuid
    ? get(outputFormat, parentPath, [])
    : outputFormat;

  currentLevelList = currentLevelList?.filter((eachRow) => !eachRow?.is_deleted);

  const selectedFieldValue = getAllFieldsUuidList(
    currentLevelList,
    OUTPUT_FORMAT_CONSTANTS.KEY_ID,
  );

  const dataFields = getGroupedFieldListForMapping(
    parentTableUuid,
    fieldList,
    selectedFieldValue,
    fieldListDropdownType(),
    t,
  );

const systemFields = [
  ...((isEachEntryView) ? [] : [statesystemFields?.datalist_system_field?.data_list_entry_id]),
  statesystemFields?.datalist_system_field?.data_list_link,
];
  const dataFieldsWithoutTitle = dataFields?.filter(
    (eachField) =>
      eachField?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE,
  );

  const systemFieldsWithoutTite = systemFields?.filter(
    (eachField) =>
      eachField?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE,
  );

  const formSystemFields = cloneDeep([...systemFields, ...fieldList]);

  let firstColumnComponent = null;

  const handleDLFieldChange = (event) => {
    let keySelectedOption = formSystemFields?.find(
      (option) =>
        event?.target?.value === option?.value,
    );

    if (
      !parentTableUuid &&
      !isEmpty(keySelectedOption) &&
      keySelectedOption?.field_type === FIELD_TYPE.TABLE
    ) {
      keySelectedOption = {
        field_name: keySelectedOption.label,
        label: keySelectedOption.label,
        table_name: keySelectedOption.label,
        table_uuid: keySelectedOption.field_uuid,
        value: keySelectedOption.value,
        field_type: FIELD_TYPE.TABLE,
      };
    }

    onChangeHandlers({
      event: generateEventTargetObject(
        OUTPUT_FORMAT_CONSTANTS.KEY_ID,
        keySelectedOption?.value,
        {
          isResponseBody: true,
          keyTypeId: OUTPUT_FORMAT_CONSTANTS.TYPE_ID,
          keyType:
            keySelectedOption?.system_field_type ||
            keySelectedOption?.field_type ||
            keySelectedOption?.field_list_type,
          keyFieldDetails: keySelectedOption,
        },
      ),
      type: OUTPUT_FORMAT_CONSTANTS.KEY_ID,
      path,
    });
  };

    let keySelectedOption = formSystemFields?.find(
      (eachField) => currentRow?.key === eachField?.value,
    );

    if (currentRow?.type === FIELD_TYPE.TABLE) {
      const selectedOption = formSystemFields?.find(
        (eachField) => currentRow?.key === eachField?.field_uuid,
      );
      if (!isEmpty(selectedOption)) {
        keySelectedOption = {
          ...selectedOption,
          field_name: selectedOption.label,
          label: selectedOption.label,
          table_name: selectedOption.label,
          value: selectedOption.value,
        };
      }
    }

    firstColumnComponent = (
      <FieldPicker
        id={OUTPUT_FORMAT_CONSTANTS.KEY_ID}
        optionList={dataFields}
        systemFieldList={systemFields}
        isExactPopperWidth
        onChange={(event) => handleDLFieldChange(event)}
        errorMessage={errorList[`${path},${OUTPUT_FORMAT_CONSTANTS.KEY_ID}`]}
        initialOptionList={getFieldTypeOptions({
          fieldsCount: dataFieldsWithoutTitle?.length,
          systemFieldsCount: systemFieldsWithoutTite?.length,
        })}
        isFieldsLoading={isDLFieldListLoading}
        selectedOption={keySelectedOption}
        outerClassName={gClasses.W100}
        fieldPickerClassName={styles.MappingField}
        disabled={readOnlyView}
        enableSearch
      />
    );
  // }

  return (
    <>
      <div className={cx(gClasses.DisplayFlex, gClasses.AlignCenter)}>
        <div className={cx(gClasses.W45, gClasses.MR16)}>
          {firstColumnComponent}
        </div>
        <div className={cx(gClasses.W25, gClasses.MR16)}>
          <Text
            content={FIELD_LIST_OBJECT(t)[currentRow?.type] || '-'}
            className={cx(gClasses.FontWeight500, gClasses.FTwo13GrayV3)}
          />
        </div>
        <div className={gClasses.W30}>
          <TextInput
            id={OUTPUT_FORMAT_CONSTANTS.NAME_ID}
            value={currentRow[OUTPUT_FORMAT_CONSTANTS.NAME_ID]}
            errorMessage={errorList[`${path},${OUTPUT_FORMAT_CONSTANTS.NAME_ID}`]}
            onChange={(e) => {
              onChangeHandlers({
                event: generateEventTargetObject(
                  OUTPUT_FORMAT_CONSTANTS.NAME_ID,
                  e.target.value,
                ),
                type: OUTPUT_FORMAT_CONSTANTS.NAME_ID,
                path,
              });
            }}
          />
        </div>
        {!readOnlyView && (
          <Button
            className={cx(styles.DeleteIcon)}
            iconOnly
            icon={<Trash />}
            size={EButtonSizeType.SM}
            onClickHandler={() =>
              onChangeHandlers({
                type: OUTPUT_FORMAT_CONSTANTS.DELETE_ID,
                path,
                isDuplicateKeyError,
                duplicateKeyRow,
              })
            }
            type={EMPTY_STRING}
          />
        )}
      </div>
      {errorComponent}
    </>
  );
}

export default DatalistOutputFormatRowComponent;

DatalistOutputFormatRowComponent.propTypes = {
  currentRow: PropTypes.object,
  onChangeHandlers: PropTypes.func,
  path: PropTypes.string,
  errorList: PropTypes.object,
  depth: PropTypes.number,
  readOnlyView: PropTypes.bool,
  parentDetails: PropTypes.objectOf({
    parentTableUuid: PropTypes.string,
  }),
  duplicateKeyRow: PropTypes.object,
};
