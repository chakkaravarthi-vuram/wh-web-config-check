import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import EditIconV2 from 'assets/icons/form_fields/EditIconV2';
import HELPER_MESSAGE_TYPE from 'components/form_components/helper_message/HelperMessage.strings';
import HelperMessage from 'components/form_components/helper_message/HelperMessage';
import { get } from 'utils/jsUtility';
import ButtonTab, { BUTTON_TAB_TYPES } from '../../../button_tab/ButtonTab';
import CheckboxGroup from '../../../form_components/checkbox_group/CheckboxGroup';
import Table from '../../../table/Table';
import ReadOnlyIcon from '../../../../assets/icons/ReadOnlyIcon';

import { FIELD_ACCESSIBILITY_TYPES } from '../../../../utils/constants/form.constant';
import { FORM_STRINGS, IMPORT_INSTRUCTION } from '../../FormBuilder.strings';
import styles from './ImportTable.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import Label from '../../../form_components/label/Label';
import { areAllFieldListFieldsDisabled } from '../../../../utils/formUtils';

function ImportTable(props) {
  const {
    sectionIndex, fieldList: { table_name }, fieldList, fieldListIndex, onSelectFieldListHandler, onFieldSelectHandler, onFieldAccessibilityHandler, error_list,
  } = props;
  const { IMPORT_TABLE: { HEADER, FIELD_ACCESSIBILITY } } = FORM_STRINGS;
  const { t } = useTranslation();

  let allAllRowsSelected = fieldList.fields.length > 0;

  const rowData = fieldList.fields.map((eachField, eachFieldIndex) => {
    if (allAllRowsSelected && !eachField.isSelected)allAllRowsSelected = false;
    const rowData = [
      eachField.field_name,
      eachField.field_type,
      <ButtonTab
        className={cx(!eachField.isSelected && gClasses.DisabledField)}
        type={BUTTON_TAB_TYPES.TYPE_2}
        tabs={[{ icon: <EditIconV2 className={styles.EditIcon} title={FIELD_ACCESSIBILITY.BUTTON_TAB_LIST[1].title} isButtonColor />, value: FIELD_ACCESSIBILITY_TYPES.EDITABLE, title: FIELD_ACCESSIBILITY.BUTTON_TAB_LIST[1].title }, { icon: <ReadOnlyIcon className={styles.ReadOnlyIcon} title={FIELD_ACCESSIBILITY.BUTTON_TAB_LIST[0].title} isButtonColor />, value: FIELD_ACCESSIBILITY_TYPES.READ_ONLY, title: FIELD_ACCESSIBILITY.BUTTON_TAB_LIST[0].title }]}
        selectedTab={eachField.read_only ? FIELD_ACCESSIBILITY_TYPES.READ_ONLY : FIELD_ACCESSIBILITY_TYPES.EDITABLE}
        setButtonTab={(id, value) => onFieldAccessibilityHandler(value, sectionIndex, fieldListIndex, eachFieldIndex)}
        hideLabel
      />, <CheckboxGroup
        optionList={[{ label: '', value: 1 }]}
        className={cx(styles.CheckBox, styles.CheckBoxFloatRight)}
        onClick={() => (eachField.isDisabled ? null : onFieldSelectHandler(sectionIndex, fieldListIndex, eachFieldIndex))}
        selectedValues={eachField.isSelected ? [1] : []}
        hideLabel
        hideMessage
      />];
      return eachField.isDisabled ? {
        rowClass: gClasses.DisabledField,
        rowData,
      } : rowData;
  });

  const isEntireFieldListDisabled = areAllFieldListFieldsDisabled(fieldList);

  const headerData = [
    HEADER.COLUMN_NAME,
    HEADER.COLUMN_TYPE,
    HEADER.COLUMN_ACCESSBILITY,
    <CheckboxGroup
      className={cx(styles.CheckBox, styles.CheckBoxFloatRight)}
      optionList={[{ label: '', value: 1 }]}
      onClick={() => (isEntireFieldListDisabled ? null : onSelectFieldListHandler(sectionIndex, fieldListIndex))}
      selectedValues={allAllRowsSelected ? [1] : []}
      hideLabel
      hideMessage
    />];
console.log(error_list, get(error_list, [`sections,${sectionIndex},field_list,${fieldListIndex},table_validations,unique_column_uuid`]), 'kjfdhdjkghfjkdhgjkdg');
  return (
    <div className={gClasses.MB20}>
      <Label
        className={isEntireFieldListDisabled ? gClasses.DisabledField : null}
        content={table_name}
        hideLabelClass
      />
      <Table
        headerClassName={cx({ [gClasses.DisabledField]: isEntireFieldListDisabled }, gClasses.LabelStyle)}
        header={headerData}
        data={rowData}
      />
      {
        get(error_list, [`sections,${sectionIndex},field_list,${fieldListIndex},table_validations,unique_column_uuid`]) &&
        (
        <HelperMessage
        className={gClasses.MT5}
        message={t(IMPORT_INSTRUCTION.UNIQUE_COLUMN_ERROR)}
        type={HELPER_MESSAGE_TYPE.ERROR}
        />
)
      }
      {isEntireFieldListDisabled && (
        <Label
          className={cx(gClasses.MT5)}
          content={IMPORT_INSTRUCTION.TABLE_ALREADY_EXISTS}
        />
      )}
    </div>
  );
}

export default ImportTable;
