import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import { ETextSize, Text, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import { cloneDeep, set, unset } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import styles from '../RequestResponse.module.scss';
import MappingTable from '../../../../../mapping_table/MappingTable';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';
import Trash from '../../../../../../../assets/icons/application/Trash';
import FieldPicker from '../../../../../../../components/field_picker/FieldPicker';
import {
  FEILD_LIST_DROPDOWN_TYPE,
  getGroupedFieldListForMapping,
} from '../../../../../../edit_flow/step_configuration/StepConfiguration.utils';
import { WORKHALL_API_STRINGS, FEATURE_INTEGRATION_STRINGS } from '../../../../../Integration.strings';
import { getFieldTypeOptions, getGroupedSystemFieldListForMapping, getTypeKeysForFields } from '../../../WorkhallApi.utils';
import filterStyles from './FilterQuery.module.scss';
import { FIELD_PICKER_DROPDOWN_TYPES } from '../../../../../../../components/field_picker/FieldPicker.utils';
import {
  SYSTEM_FIELDS_FOR_FILTER,
  SYSTEM_FIELDS_FOR_QUERY_PARAMS,
  WORKHALL_API_FILTER_ALLOWED_FIELD_TYPES,
} from '../../../../../Integration.constants';

function FilterQuery(props) {
  const {
    tblHeaders = [],
    mappingList = [],
    error_list = {},
    mappingKey = EMPTY_STRING,
    addKeyLabel = EMPTY_STRING,
    initialRowKeyValue = {},
    isEditView = false,
    columnOneKey = EMPTY_STRING,
    columnOneSystemKey = EMPTY_STRING,
    columnTwoKey = EMPTY_STRING,
    integrationDataChange,
    state: { allFields = [], isAllFieldsLoading = false },
    selectedDirectFieldUuidList,
    selectedSystemFieldUuidList,
  } = props;

  const { REQUEST_RESPONSE } = WORKHALL_API_STRINGS;

  const { t } = useTranslation();

  const systemFields = mappingKey === REQUEST_RESPONSE.FILTER_FIELDS.ID ? SYSTEM_FIELDS_FOR_FILTER : SYSTEM_FIELDS_FOR_QUERY_PARAMS;

  const handleMappingChange = (updatedList) => {
    delete error_list[mappingKey];

    integrationDataChange({
      [mappingKey]: updatedList,
      error_list,
    });
  };

  const dataFields = getGroupedFieldListForMapping(
    null,
    allFields,
    selectedDirectFieldUuidList,
    FEILD_LIST_DROPDOWN_TYPE.DIRECT,
    t,
    WORKHALL_API_FILTER_ALLOWED_FIELD_TYPES,
  );

  const dataFieldsWithoutTitle = dataFields?.filter((eachField) => eachField?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE);

  const allowedSystemFields = getGroupedSystemFieldListForMapping(systemFields, selectedSystemFieldUuidList);
  const systemFieldsWithoutTitle = allowedSystemFields?.filter((eachField) => eachField?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE);
  const formSystemFields = cloneDeep([
    ...systemFields,
    ...dataFields,
  ]);

  const handleMappingTableChange = (e, index, key, columnKey, isDuplicateKeyError, duplicateKeyIndex) => {
    const listData = cloneDeep(mappingList);
    if (columnOneKey === columnKey) {
      const selectedField = formSystemFields?.find(
        (field) => field.value === e.target.value,
      );

      if (selectedField?.system_field_type === REQUEST_RESPONSE.SYSTEM_FIELD) {
        unset(listData, [index, columnOneKey]);
        set(listData, [index, columnOneSystemKey], e.target.value);
        set(
          listData,
          [index, 'value_type'],
          REQUEST_RESPONSE.VALUE_TYPES.SYSTEM,
        );
      } else {
        unset(listData, [index, columnOneSystemKey]);
        set(listData, [index, columnOneKey], e.target.value);
        set(
          listData,
          [index, 'value_type'],
          REQUEST_RESPONSE.VALUE_TYPES.DYNAMIC,
        );
      }
      set(listData, [index, 'field_details'], selectedField);
    } else {
      set(listData, [index, e.target.id], e.target.value);
    }
    const errorPath = `${key},${index},${e.target.id}`;
    const clonedErrorList = cloneDeep(error_list) || [];
    if (isDuplicateKeyError) {
      delete clonedErrorList[`${key},${duplicateKeyIndex}`];
    }
    delete clonedErrorList[errorPath];
    integrationDataChange({
      [key]: listData,
      error_list: clonedErrorList,
    });
  };

  const handleMappingRowDelete = (index, key, isDuplicateKeyError, duplicateKeyIndex) => {
    const listData = cloneDeep(mappingList);
    listData.splice(index, 1);
    const clonedErrorList = cloneDeep(error_list) || [];
    if (isDuplicateKeyError) {
      delete clonedErrorList[`${key},${duplicateKeyIndex}`];
    }
    Object.keys(clonedErrorList || {}).forEach((errorKey) => {
      if (errorKey.includes(`${key},${index}`)) delete clonedErrorList[errorKey];
    });
    integrationDataChange({
      [key]: listData,
      error_list: clonedErrorList,
    });
  };

  const initialRow = (index, key, isDuplicateKeyError, duplicateKeyIndex) => {
    console.log(index, key, isDuplicateKeyError, 'fjklgjlfjdklgjfkdljg');
    const keyErrorPath = `${key},${index},${columnOneKey}`;
    const valueErrorPath = `${key},${index},${columnTwoKey}`;

    const keyInputError = error_list[keyErrorPath];
    const selectedValue = mappingList[index][columnOneKey] || mappingList[index][columnOneSystemKey];

    let selectedOption = {};

    if (mappingList[index][columnOneKey]) {
      selectedOption = allFields?.find(
        (option) => selectedValue === option?.field_uuid,
      );
    } else {
      selectedOption = systemFields?.find(
        (option) => selectedValue === option?.value,
      );
    }

    const firstColumn = (
      <div className={styles.ColMid}>
        <FieldPicker
          id={columnOneKey}
          optionList={dataFields}
          systemFieldList={allowedSystemFields}
          disabled={!isEditView}
          isExactPopperWidth
          onChange={(event) =>
            handleMappingTableChange(
              event,
              index,
              key,
              columnOneKey,
            )
          }
          selectedValue={selectedValue}
          errorMessage={keyInputError}
          initialOptionList={getFieldTypeOptions({ fieldsCount: dataFieldsWithoutTitle?.length, systemFieldsCount: systemFieldsWithoutTitle?.length })}
          isFieldsLoading={isAllFieldsLoading}
          selectedOption={selectedOption}
          outerClassName={filterStyles.DropdownOuterClassName}
        />
      </div>
    );

    const secondColumn = (
      <div className={styles.ColMid}>
        <TextInput
          onChange={(e) => handleMappingTableChange(e, index, key, columnTwoKey, isDuplicateKeyError, duplicateKeyIndex)}
          id={columnTwoKey}
          className={filterStyles.KeyInput}
          value={mappingList[index][columnTwoKey]}
          errorMessage={error_list[valueErrorPath]}
          readOnly={!isEditView}
          labelClassName={styles.LabelClassName}
        />
        {
          isDuplicateKeyError &&
          (<Text content={t(FEATURE_INTEGRATION_STRINGS.DUPLICATE_KEY_ERROR)} size={ETextSize.XS} className={gClasses.red22} />)
        }
      </div>
    );

    const thirdColmn = (
      <div className={cx(styles.ColMini, gClasses.CenterV)}>
        {isEditView && (
          <Trash
            className={cx(styles.DeleteIcon, gClasses.CursorPointer)}
            onClick={() => handleMappingRowDelete(index, key, isDuplicateKeyError, duplicateKeyIndex)}
          />
        )}
      </div>
    );

    const additionalInfo = getTypeKeysForFields(selectedOption);

    const keyTypeColumn = (
      <div>
        <TextInput
          value={additionalInfo?.keyType}
          readOnly
        />
      </div>
    );

    let compArray = [];

    if (mappingKey === REQUEST_RESPONSE.QUERY_PARAMS_FIELDS.ID) {
      compArray = [firstColumn, secondColumn, keyTypeColumn, thirdColmn];
    } else {
      compArray = [firstColumn, secondColumn, thirdColmn];
    }

    return {
      id: index,
      component: compArray,
      className: cx(filterStyles.TableRow, { [filterStyles.DuplicateRowError]: isDuplicateKeyError }),
    };
  };

  return (
    <div>
      <MappingTable
        isTableUI
        tblHeaders={tblHeaders}
        outerClass={cx(gClasses.MB20)}
        mappingList={mappingList}
        handleMappingChange={handleMappingChange}
        mappingKey={mappingKey}
        initialRow={initialRow}
        initialRowKeyValue={initialRowKeyValue}
        error_list={error_list}
        addKeyLabel={addKeyLabel}
        tableClassName={filterStyles.Table}
        noAddRow={!isEditView}
      />
    </div>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    state: IntegrationReducer,
  };
};

const mapDispatchToProps = {
  integrationDataChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterQuery);
