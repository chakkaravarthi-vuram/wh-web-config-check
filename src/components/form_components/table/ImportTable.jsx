import { Table as LibTable, TableColumnWidthVariant, TableScrollType, Text, ETextSize, Checkbox, ECheckboxSize } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { RESPONSE_FIELD_KEYS } from '../../../utils/constants/form/form.constant';
import { isEmpty } from '../../../utils/jsUtility';
import styles from './Table.module.scss';
import { FORM_FIELD_STRINGS } from '../../../containers/form/sections/form_field/FormField.string';
import { COLUMN_SELECT_TYPE } from '../../../containers/form/import_form/ImportForm.strings';
import { constructSinglePath } from '../../../containers/form/sections/form_layout/FormLayout.utils';
import { FORM_LAYOUT_TYPE } from '../../../containers/form/Form.string';
import { COMMA } from '../../../utils/strings/CommonStrings';
import { IMPORT_READONLY_FIELD_TYPES, isAllFieldSelected } from '../../../containers/form/import_form/ImportForm.util';
import ErrorMessage from '../../error_message/ErrorMessage';

function ImportTable(props) {
  const {
    fieldData = {}, // fieldUUID, fieldName, columns
    tablePath,
    onImportTypeClick,
    onImportFieldClick,
    validationMessage,
    colorScheme,
  } = props;
  // const [selectedFields, setSelectedFields] = useState([]); // contains selected fieldUUIDs
  const { t } = useTranslation();
  const columns = fieldData?.columns || [];
  const { isImported, isAlreadyImported } = isAllFieldSelected(columns);

  const onRowSelecteHandler = (selectionType, fieldUUID, idk) => {
    if (selectionType === COLUMN_SELECT_TYPE.ALL) {
      onImportFieldClick(
        null,
        fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
        tablePath,
      );
    } else {
      const path = [tablePath, constructSinglePath(idk, FORM_LAYOUT_TYPE.FIELD)].join(COMMA);
      onImportFieldClick(
        fieldUUID,
        fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
        path,
      );
    }

    // columns.find((field) => {
    //   if (field.fieldId === rowId) {
    //     if (selectedFields.includes(rowId)) {
    //       const clonedSelectedFields = jsUtility.cloneDeep(selectedFields);
    //       delete clonedSelectedFields.splice(clonedSelectedFields.indexOf(rowId), 1);
    //       setSelectedFields(clonedSelectedFields);
    //     } else {
    //       setSelectedFields([
    //         ...selectedFields,
    //         rowId,
    //       ]);
    //     }
    //     return true;
    //   }
    //   return false;
    // });
  };

  // Table Essentials
  const getTableHeaders = () => [
      {
        label: 'Column Name',
        id: 'import_table_field_name',
        widthWeight: 3,
      },
      {
        label: 'Column Type',
        id: 'import_table_field_type',
        widthWeight: 3,
      },
      {
        label: 'Column Accessibility',
        id: 'import_table_field_accessibility',
        widthWeight: 3,
      },
      {
        label: '',
        id: 'import_table_field_selectionbox',
        widthWeight: 3,
        component: (
        <Checkbox
          className={cx(gClasses.WidthFitContent, gClasses.WhiteSpaceNoWrap)}
          size={ECheckboxSize.SM}
          details={[]}
          hideLabel
          isValueSelected={(isImported || isAlreadyImported)}
          onClick={() => onRowSelecteHandler(COLUMN_SELECT_TYPE.ALL)}
          disabled={isAlreadyImported}
        />),
      },
  ];

  const getActionButtons = (field) => {
    const isImported = field?.isImported;
    const isReadOnly = field?.isReadOnly;
    // const isUniqCol = field?.isUniqueCol;
    return (
    <div className={cx(styles.OverlayButtons, !isImported && styles.DarkOverlay)}>
      <button
        className={cx(
          styles.OverlayBtn,
          isReadOnly && styles.SelectedBtn,
        )}
        onClick={(e) => onImportTypeClick(field[RESPONSE_FIELD_KEYS.FIELD_UUID], true, e)}
        disabled={!isImported}
      >
        {FORM_FIELD_STRINGS(t).FIELD.READ_ONLY}
      </button>
      <button
        className={cx(
          styles.OverlayBtn,
          !isReadOnly && styles.SelectedBtn,
        )}
        onClick={(e) => onImportTypeClick(field[RESPONSE_FIELD_KEYS.FIELD_UUID], false, e)}
        disabled={!isImported || IMPORT_READONLY_FIELD_TYPES.includes(field[RESPONSE_FIELD_KEYS.FIELD_TYPE])}
      >
        {FORM_FIELD_STRINGS(t).FIELD.EDITABLE}
      </button>
    </div>
  );
};

  const getEachRow = (field, idk) => {
    const isImportDisabled = field?.[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED];
    const isImported = field?.isImported && !isImportDisabled;
    const fieldName = field.isUniqueCol ? `${field.fieldName} (${t('dependency_handler.dependency_error_type_labels.table_unique')})` : field.fieldName;
    return {
      id: field.fieldId,
      className: gClasses.PX12,
      component: [
        <Text
          className={cx(gClasses.Ellipsis, styles.ColumnName)}
          title={fieldName}
          content={fieldName}
          size={ETextSize.MD}
        />,
        <Text
          className={cx(gClasses.WidthFitContent, gClasses.WhiteSpaceNoWrap)}
          content={field.fieldType}
          size={ETextSize.MD}
        />,
        getActionButtons(field),
        <Checkbox
          className={cx(gClasses.WidthFitContent, gClasses.WhiteSpaceNoWrap)}
          onClick={() => onRowSelecteHandler(COLUMN_SELECT_TYPE.SINGLE, field.fieldUUID, idk)}
          size={ECheckboxSize.SM}
          isValueSelected={isImported}
          details={[]}
          hideLabel
          disabled={isImportDisabled}
        />,
      ],
    };
  };

  const getTableBody = () => {
      if (isEmpty(columns)) return [];
      return columns.map((field, idk) => getEachRow(field, idk));
  };

  const getErrorMessage = () => {
    if (!validationMessage[RESPONSE_FIELD_KEYS.FIELD_UUID]) return null;
    return (
      <ErrorMessage
        errorMessage={validationMessage[RESPONSE_FIELD_KEYS.FIELD_UUID]}
        className={cx(gClasses.MT5)}
      />
    );
  };

  return (
    <div className={styles.Table}>
      <LibTable
        id={fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID]}
        // className,
        header={getTableHeaders()}
        data={getTableBody()}
        isRowClickable={false}
        colorScheme={colorScheme}
        scrollType={TableScrollType.AUTO}
        widthVariant={TableColumnWidthVariant.AUTO}
        className={styles.CustomTableStyles}
      />
      {isAlreadyImported && (
        <Text
          size={ETextSize.XS}
          className={gClasses.MT5}
          content={t(
            'form_builder_strings.import_intruction.table_already_exists',
          )}
        />
      )}
      {getErrorMessage()}
    </div>
  );
}

export default ImportTable;
