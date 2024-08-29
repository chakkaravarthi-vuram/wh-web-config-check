import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../../../form_components/input/Input';
import { FIELD_LIST_CONFIG } from '../../FormBuilder.strings';
import { FIELD_LIST_KEYS } from '../../../../utils/constants/form.constant';

function BasicConfig(props) {
  const {
    tableName,
    onTableNameChangeHandler,
    onTableNameBlurHandler,
    tableRefName,
    onTableReferenceNameChangeHandler,
    onTableReferenceNameBlurHandler,
    error_list,
    table_uuid,
    getRuleDetailsById,
  } = props;
  const { t } = useTranslation();
  const { TABLE: { BASIC_CONFIG } } = FIELD_LIST_CONFIG(t);

  useEffect(() => getRuleDetailsById(), []);
  return (
    <>
      <Input
        label={BASIC_CONFIG.TABLE_NAME.LABEL}
        placeholder={BASIC_CONFIG.TABLE_NAME.PLACEHOLDER}
        id={FIELD_LIST_KEYS.TABLE_NAME}
        onChangeHandler={onTableNameChangeHandler}
        onBlurHandler={onTableNameBlurHandler}
        // onBlurHandler={onLabelBlurHandler}
        value={tableName}
        errorMessage={error_list[FIELD_LIST_KEYS.TABLE_NAME]}
        isRequired
      />
      {/* Commented for release */}
      {/* <CheckboxGroup
        optionList={BASIC_CONFIG.ALLOW_NEW_ROW.OPTION_LIST}
        // onClick={onRequiredClickHandler}
        // selectedValues={fieldData.required ? [1] : []}
        hideLabel
      />
      <CheckboxGroup
        optionList={BASIC_CONFIG.MAKE_TABLE_READ_ONLY.OPTION_LIST}
        // onClick={onRequiredClickHandler}
        // selectedValues={fieldData.required ? [1] : []}
        hideLabel
      />
      <FormTitle type={FORM_TITLE_TYPES.TYPE_3}>{BASIC_CONFIG.PAGINATION_CONFIG.LABEL}</FormTitle>
      <RadioGroup hideMessage hideLabel optionList={BASIC_CONFIG.PAGINATION_CONFIG.OPTION_LIST_1} />
      <div className={cx(gClasses.CenterV, gClasses.MT5)}>
        <RadioGroup hideLabel optionList={BASIC_CONFIG.PAGINATION_CONFIG.OPTION_LIST_2} />
        <Input
          className={styles.PaginationRowInput}
          inputTextClasses={styles.PaginationRowInputInnerClass}
          readOnlySuffixClasses={cx(gClasses.PL5, styles.PaginationRowInputSuffix)}
          placeholder={BASIC_CONFIG.PAGINATION_CONFIG.ROWS_INPUT.PLACEHOLDER}
          readOnlySuffix={BASIC_CONFIG.PAGINATION_CONFIG.ROWS_INPUT.SUFFIX_LABEL}
          hideLabel
        />
      </div> */}
      {table_uuid ?
       (
       <Input
        label={BASIC_CONFIG.TABLE_REFERENCE_NAME.LABEL}
        placeholder={BASIC_CONFIG.TABLE_REFERENCE_NAME.PLACEHOLDER}
        id={FIELD_LIST_KEYS.TABLE_REF_NAME}
        onChangeHandler={onTableReferenceNameChangeHandler}
        onBlurHandler={onTableReferenceNameBlurHandler}
        // onBlurHandler={onLabelBlurHandler}
        value={tableRefName}
        errorMessage={error_list[FIELD_LIST_KEYS.TABLE_REF_NAME]}
        isRequired
        readOnly
       />
      ) : null
       }
    </>
  );
}

export default BasicConfig;
