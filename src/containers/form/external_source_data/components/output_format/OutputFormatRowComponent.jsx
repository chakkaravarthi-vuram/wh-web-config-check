import React from 'react';
import cx from 'classnames/bind';
import { cloneDeep, isEmpty, get, has } from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import {
  Button,
  EButtonSizeType,
  ETextSize,
  SingleDropdown,
  Text,
  TextInput,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import styles from './OutputFormat.module.scss';
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
import ResponseBodyMapping from '../response_body_mapping/ResponseBodyMapping';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { SYSTEM_FIELDS } from '../../../../../utils/SystemFieldsConstants';

function OutputFormatRowComponent(props) {
  const {
    currentRow = {},
    onChangeHandlers,
    path = EMPTY_STRING,
    errorList = {},
    depth = 0,
    readOnlyView = false,
    parentDetails = {},
    parentDetails: { parentTableUuid },
    duplicateKeyRow = {},
  } = props;

  const { t } = useTranslation();

  const { state } = useExternalSource();

  const {
    selectedExternalSource,
    dlFieldList,
    isDLFieldListLoading,
    selectedEvent,
    outputFormat,
    flowId,
    queryResult,
  } = state;

  let fieldOptionList = cloneDeep(OUTPUT_FORMAT_CONSTANTS.getOptions());

  if (currentRow?.is_deleted) return null;

  if (selectedExternalSource === DATA_SOURCE_TYPES.INTEGRATION) {
    if (depth === OUTPUT_FORMAT_CONSTANTS.MAX_DEPTH) fieldOptionList.pop();
  } else if (selectedExternalSource === DATA_SOURCE_TYPES.DATA_LIST) {
    fieldOptionList = OUTPUT_FORMAT_CONSTANTS.getDataListFieldTypes();
  }

  let fieldListDropdownType;

  if (queryResult === DATA_LIST_CONSTANTS.QUERY_RESULT.MULTIPLE_VALUE) {
    fieldListDropdownType = FEILD_LIST_DROPDOWN_TYPE.DIRECT;
  } else if (parentTableUuid) {
    fieldListDropdownType = FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS;
  } else {
    fieldListDropdownType = FEILD_LIST_DROPDOWN_TYPE.ALL;
  }

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

  const isDuplicateKeyError = duplicateKeyRow?.key === currentRow?.key || duplicateKeyRow?.name === currentRow?.name;

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
    dlFieldList,
    selectedFieldValue,
    fieldListDropdownType,
    t,
  );

  const moduleId = flowId ? SYSTEM_FIELDS.FLOW_ID : SYSTEM_FIELDS.DATA_LIST_ID;
  const systemFields = [moduleId];

  const dataFieldsWithoutTitle = dataFields?.filter(
    (eachField) =>
      eachField?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE,
  );

  const formSystemFields = cloneDeep([...systemFields, ...dlFieldList]);

  let firstColumnComponent = null;

  const handleResponseBodyChange = (option) => {
    let currentValue = option?.value;
    let parentPath = EMPTY_STRING;

    if (path?.includes(OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING)) {
      let pathArr = cloneDeep(path);

      pathArr = (pathArr || []).split(',');

      if (pathArr.length > 0 && pathArr[pathArr.length - 2] === OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING) {
        pathArr.splice(pathArr.length - 2, 2);
        parentPath = pathArr;
      }

      const parentLabel = `${get(outputFormat, [...parentPath, OUTPUT_FORMAT_CONSTANTS.KEY_ID])}.`;
      currentValue = currentValue.replace(parentLabel, EMPTY_STRING);
    }

    onChangeHandlers({
      event: generateEventTargetObject(
        OUTPUT_FORMAT_CONSTANTS.KEY_ID,
        currentValue,
        {
          isResponseBody: true,
          keyTypeId: OUTPUT_FORMAT_CONSTANTS.TYPE_ID,
          keyType: option?.type,
        },
      ),
      type: OUTPUT_FORMAT_CONSTANTS.KEY_ID,
      path,
      isDuplicateKeyError,
      duplicateKeyRow,
    });
  };

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

  if (selectedExternalSource === DATA_SOURCE_TYPES.INTEGRATION) {
    if (selectedEvent?.response_body) {
      firstColumnComponent = (
        <ResponseBodyMapping
          id={OUTPUT_FORMAT_CONSTANTS.KEY_ID}
          currentRow={currentRow}
          value={currentRow?.key}
          path={path}
          errorMessage={errorList[`${path},${OUTPUT_FORMAT_CONSTANTS.KEY_ID}`]}
          onChangeHandler={handleResponseBodyChange}
          isChildMapping={parentDetails?.isObjectParent}
        />
      );
    } else {
      firstColumnComponent = (
        <TextInput
          onChange={(e) =>
            onChangeHandlers({
              event: e,
              type: OUTPUT_FORMAT_CONSTANTS.KEY_ID,
              path,
              isDuplicateKeyError,
              duplicateKeyRow,
            })
          }
          id={OUTPUT_FORMAT_CONSTANTS.KEY_ID}
          value={currentRow?.key}
          errorMessage={errorList[`${path},${OUTPUT_FORMAT_CONSTANTS.KEY_ID}`]}
          readOnly={readOnlyView}
        />
      );
    }
  } else if (selectedExternalSource === DATA_SOURCE_TYPES.DATA_LIST) {
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
        isExactPopperWidth
        onChange={(event) => handleDLFieldChange(event)}
        errorMessage={errorList[`${path},${OUTPUT_FORMAT_CONSTANTS.KEY_ID}`]}
        initialOptionList={getFieldTypeOptions({
          fieldsCount: dataFieldsWithoutTitle?.length,
        })}
        isFieldsLoading={isDLFieldListLoading}
        selectedOption={keySelectedOption}
        outerClassName={gClasses.W100}
        fieldPickerClassName={styles.MappingField}
        isDataFieldsOnly
        disabled={readOnlyView}
      />
    );
  }

  return (
    <>
      <div className={gClasses.DisplayFlex}>
        <div className={cx(gClasses.W35, gClasses.MR16)}>
          {firstColumnComponent}
        </div>
        <div className={cx(gClasses.W30, gClasses.MR16)}>
          <SingleDropdown
            id={OUTPUT_FORMAT_CONSTANTS.TYPE_ID}
            optionList={fieldOptionList}
            dropdownViewProps={{
              disabled:
                selectedExternalSource === DATA_SOURCE_TYPES.DATA_LIST ||
                readOnlyView ||
                selectedEvent?.response_body,
              className: gClasses.InputHeight36,
            }}
            onClick={(value, _label, _list, id) =>
              onChangeHandlers({
                event: generateEventTargetObject(id, value),
                type: OUTPUT_FORMAT_CONSTANTS.TYPE_ID,
                path,
              })
            }
            selectedValue={currentRow?.type}
            errorMessage={
              errorList[`${path},${OUTPUT_FORMAT_CONSTANTS.TYPE_ID}`]
            }
          />
        </div>
        <div className={cx(gClasses.W25, gClasses.MR16)}>
          <TextInput
            onChange={(e) =>
              onChangeHandlers({
                event: e,
                type: OUTPUT_FORMAT_CONSTANTS.NAME_ID,
                path,
                isDuplicateKeyError,
                duplicateKeyRow,
              })
            }
            id={OUTPUT_FORMAT_CONSTANTS.NAME_ID}
            value={currentRow?.name}
            errorMessage={
              errorList[`${path},${OUTPUT_FORMAT_CONSTANTS.NAME_ID}`]
            }
            readOnly={readOnlyView}
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

export default OutputFormatRowComponent;
