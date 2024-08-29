import React from 'react';
import {
  Checkbox,
  ECheckboxSize,
  ETextSize,
  Text,
  TextInput,
} from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { cloneDeep, get, has, isEmpty } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import { FEATURE_INTEGRATION_STRINGS, INTEGRATION_ERROR_STRINGS, WORKHALL_API_STRINGS } from '../../../../../Integration.strings';
import styles from './RequestBody.module.scss';
import {
  FEILD_LIST_DROPDOWN_TYPE,
  getGroupedFieldListForMapping,
} from '../../../../../../edit_flow/step_configuration/StepConfiguration.utils';
import { INTEGRATION_STRINGS } from '../../../../../Integration.utils';
import { getAllFieldsUuidList, keydownOrKeypessEnterHandle } from '../../../../../../../utils/UtilityFunctions';
import Trash from '../../../../../../../assets/icons/application/Trash';
import FieldPicker from '../../../../../../../components/field_picker/FieldPicker';
import { getCurrentSystemFields, getFieldTypeOptions, getGroupedSystemFieldListForMapping } from '../../../WorkhallApi.utils';
import { FIELD_PICKER_DROPDOWN_TYPES } from '../../../../../../../components/field_picker/FieldPicker.utils';
import { FIELD_LIST_TYPE } from '../../../../../../../utils/constants/form.constant';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';

function RowComponent(props) {
  const {
    currentRow = {},
    onChangeHandlers,
    path,
    allFields = [],
    isAllFieldsLoading = false,
    workhall_api_method,
    parentDetails: { parentTableUuid },
    errorList,
    readOnlyView,
    isDuplicateKeyError = false,
    duplicateKeyRow,
    reqBodyFieldDetails = [],
  } = cloneDeep(props);

  const { REQUEST_RESPONSE } = WORKHALL_API_STRINGS;
  const { ADD_EVENT } = INTEGRATION_STRINGS;
  const { t } = useTranslation();

  const fieldListDropdownType = parentTableUuid
    ? FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS
    : FEILD_LIST_DROPDOWN_TYPE.ALL;
  let dataFieldsOptionList = [];
  let fieldsList = [];
  let dataFieldsWithoutTitle = [];
  let systemFieldsWithoutTitle = [];
  let isDefaultValue = false;
  let fieldName = null;
  let keySelectedOption = {};

  const systemFields = getCurrentSystemFields(workhall_api_method, parentTableUuid, true);
  const selectedFieldsList = [];
  let parentPath = EMPTY_STRING;
  if (parentTableUuid) {
    const pathArr = (path || []).split(',');
    if (pathArr.length > 0 && pathArr[pathArr.length - 2] === REQUEST_RESPONSE.COLUMN_MAPPING) {
      pathArr.splice(pathArr.length - 1, 1);
       parentPath = pathArr.join();
    }
  }
  reqBodyFieldDetails.forEach((field) => {
    if (parentPath) {
      if (field.path.includes(parentPath)) {
        selectedFieldsList.push(field);
      }
    } else if (!field.path.includes(REQUEST_RESPONSE.COLUMN_MAPPING)) {
      selectedFieldsList.push(field);
    }
  });

  const selectedFieldsUuidList = getAllFieldsUuidList(selectedFieldsList);
  const allowedSystemFields = getGroupedSystemFieldListForMapping(systemFields, selectedFieldsUuidList);

  if (currentRow?.value_type === 'default') {
    isDefaultValue = true;
    fieldName = currentRow?.field;
    keySelectedOption = { label: currentRow?.field || currentRow?.system_field, value: currentRow?.field || currentRow?.system_field };
  } else {
    fieldName = currentRow?.is_table ? currentRow?.field_details?.table_name : currentRow?.field_details?.field_name;
  }

  fieldsList = allFields;
  dataFieldsOptionList = getGroupedFieldListForMapping(
    parentTableUuid,
    fieldsList,
    selectedFieldsUuidList,
    fieldListDropdownType,
  );

  dataFieldsWithoutTitle = dataFieldsOptionList?.filter((eachField) => eachField?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE);
  systemFieldsWithoutTitle = allowedSystemFields?.filter((eachField) => eachField?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE);

  let fieldErrorMessage = errorList[`${path},${REQUEST_RESPONSE.BODY_FIELDS.FIELD.ID}`] || errorList[`${path},${REQUEST_RESPONSE.BODY_FIELDS.SYSTEM_FIELD.ID}`];
  if (!fieldErrorMessage && errorList[`${path},field_details`]) {
    fieldErrorMessage = t(INTEGRATION_ERROR_STRINGS.DELETED_FIELDS);
  }

  if (!isDefaultValue) {
    if (currentRow?.value_type === REQUEST_RESPONSE.VALUE_TYPES.DYNAMIC) {
      if (currentRow?.field_type === FIELD_LIST_TYPE.TABLE) {
        const selectedOption = allFields?.find((eachField) => (currentRow?.field === eachField?.field_uuid));
        if (!isEmpty(selectedOption)) {
          keySelectedOption = {
            ...selectedOption,
            field_name: selectedOption.field_name,
            label: selectedOption.label,
            table_name: selectedOption.label,
            value: selectedOption.field_uuid,
          };
        }
      } else {
        keySelectedOption = allFields?.find((eachField) => (currentRow?.field === eachField?.field_uuid));
      }
    } else {
      keySelectedOption = systemFields?.find((eachField) => currentRow?.system_field === eachField?.value);
    }
  }

  let errorComponent = null;

  if (isDuplicateKeyError || has(errorList, [`${path},${REQUEST_RESPONSE.COLUMN_MAPPING}`])) {
    let rowError = t(INTEGRATION_ERROR_STRINGS.REQUIRED_TABLE_FIELD);
    if (isDuplicateKeyError) {
      rowError = t(FEATURE_INTEGRATION_STRINGS.DUPLICATE_KEY_ERROR);
    }
    errorComponent = (
      <Text size={ETextSize.XS} content={rowError} className={gClasses.red22} />
    );
  }

  const isDisabled = readOnlyView || isDefaultValue;

  if (currentRow?.isReadOnlyResponse) {
    return (
      <div className={cx(gClasses.DisplayFlex, gClasses.W100)}>
        <div className={cx(styles.ReadOnlyFieldColumn, gClasses.PR24)}>
          <Text content={currentRow?.key} />
        </div>
        <div>
          <Text content={currentRow?.keyType} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cx(gClasses.DisplayFlex, gClasses.W100)}>
        <div className={cx(styles.FieldColumn, gClasses.PR24)}>
          <FieldPicker
            id={REQUEST_RESPONSE.BODY_FIELDS.FIELD.ID}
            optionList={dataFieldsOptionList}
            systemFieldList={allowedSystemFields}
            onChange={(event) =>
              onChangeHandlers({
                event,
                type: REQUEST_RESPONSE.BODY_FIELDS.FIELD.ID,
                path,
              })
            }
            selectedValue={currentRow?.field}
            selectedLabel={fieldName}
            className={styles.RequestBodyFields}
            initialOptionList={getFieldTypeOptions({ fieldsCount: dataFieldsWithoutTitle?.length, systemFieldsCount: systemFieldsWithoutTitle?.length })}
            isFieldsLoading={isAllFieldsLoading}
            disabled={isDisabled}
            errorMessage={fieldErrorMessage}
            mappingIndex={path}
            allFields={allFields}
            selectedOption={keySelectedOption}
            excludeFieldsList={reqBodyFieldDetails}
            isDataFieldsOnly={isEmpty(systemFields)}
          />
        </div>
        <div className={cx(styles.KeyColumn, gClasses.PR24)}>
          <TextInput
            onChange={(e) =>
              onChangeHandlers({
                event: e,
                type: REQUEST_RESPONSE.BODY_FIELDS.KEY.ID,
                path,
                isDuplicateKeyError,
                duplicateKeyRow,
              })
            }
            id={REQUEST_RESPONSE.BODY_FIELDS.KEY.ID}
            className={styles.RequestBodyFields}
            value={currentRow?.key}
            readOnly={isDisabled}
            errorMessage={errorList[`${path},${REQUEST_RESPONSE.BODY_FIELDS.KEY.ID}`]}
          />
        </div>
        <div className={cx(styles.TypeColumn, gClasses.PR24)}>
          <TextInput
            className={styles.RequestBodyFields}
            value={currentRow?.keyType}
            readOnly
          />
        </div>
        <div className={cx(styles.RequiredColumn, gClasses.PR24, gClasses.CenterV)}>
          <Checkbox
            id={ADD_EVENT.REQUEST_BODY.IS_REQUIRED.ID}
            size={ECheckboxSize.LG}
            details={get(ADD_EVENT.REQUEST_BODY.IS_REQUIRED.OPTIONS, 0, {})}
            className={cx(styles.RequestBodyFields)}
            isValueSelected={currentRow?.field_details?.required}
            disabled
          />
        </div>
        <div className={cx(styles.IsMultipleColumn, gClasses.PR24, gClasses.CenterV)}>
          <Checkbox
            id={ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.ID}
            size={ECheckboxSize.LG}
            details={get(ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.OPTIONS, 0, {})}
            className={cx(styles.RequestBodyFields)}
            isValueSelected={currentRow?.is_multiple}
            disabled
          />
        </div>
        {
          !readOnlyView && (
              <div
                role="button"
                tabIndex="0"
                onClick={() =>
                  onChangeHandlers({
                    type: ADD_EVENT.REQUEST_BODY.DELETE.ID,
                    path,
                    isDuplicateKeyError,
                    duplicateKeyRow,
                  })
                }
                onKeyDown={(e) =>
                  keydownOrKeypessEnterHandle(e) &&
                  onChangeHandlers({
                    type: ADD_EVENT.REQUEST_BODY.DELETE.ID,
                    path,
                    isDuplicateKeyError,
                    duplicateKeyRow,
                  })
                }
                className={cx(styles.DeleteColumn, gClasses.CenterV)}
              >
                <Trash className={cx(styles.DeleteIcon, gClasses.MR12)} />
              </div>
          )
        }
      </div>
      {errorComponent}
    </>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    allFields: IntegrationReducer.allFields,
    isAllFieldsLoading: IntegrationReducer.isAllFieldsLoading,
    workhall_api_method: IntegrationReducer.workhall_api_method,
    reqBodyFieldDetails: IntegrationReducer.reqBodyFieldDetails,
  };
};

export default connect(mapStateToProps, null)(RowComponent);
