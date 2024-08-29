import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { CheckboxGroup, ECheckboxSize, ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import styles from './ImportField.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { keydownOrKeypessEnterHandle } from '../../../../../utils/UtilityFunctions';
import Field from '../field/Field';
import { FORM_TYPE } from '../../../Form.string';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';
import { FORM_FIELD_STRINGS } from '../FormField.string';
import { FIELD_TYPES } from '../../field_configuration/FieldConfiguration.strings';
import { IMPORT_READONLY_FIELD_TYPES } from '../../../import_form/ImportForm.util';

function ImportField(props) {
  const {
    fieldData,
    fieldValue,
    path,
    onImportTypeClick,
    onImportFieldClick,
    validationMessage,
    userProfileData = {},
    metaData,
    moduleType,
    column,
  } = props;
  const { t } = useTranslation();
  const { FIELD } = FORM_FIELD_STRINGS();

  const onImportTypeChangeClick = (fieldUUID, isReadOnly, e) => {
    e?.stopPropagation();
    onImportTypeClick(fieldUUID, isReadOnly);
  };

  if (fieldData?.fieldType === FIELD_TYPES.TABLE) {
     return (
      <div
        className={cx(
          gClasses.P8,
          styles.ImportField,
          fieldData.isImported && styles.Imported,
        )}
      >
        <Field
          fieldData={fieldData}
          formType={FORM_TYPE.IMPORT_FROM}
          metaData={metaData}
          moduleType={moduleType}
          onChangeHandler={() => {}}
          fieldValue={fieldValue}
          path={path}
          onImportFieldClick={onImportFieldClick}
          onImportTypeClick={onImportTypeChangeClick}
          validationMessage={validationMessage}
          userProfileData={userProfileData}
          column={column}
        />
      </div>
     );
  }

  const isImportDisabled = fieldData?.[RESPONSE_FIELD_KEYS.IS_IMPORT_DISABLED];
  const isImported = fieldData?.isImported && !isImportDisabled;

  return (
    <div
      className={cx(
        gClasses.P8,
        styles.ImportField,
        isImportDisabled && styles.Disabled,
        fieldData.isImported && styles.Imported,
      )}
    >
      <Field
        fieldData={fieldData}
        formType={FORM_TYPE.IMPORT_FROM}
        onChangeHandler={() => {}}
        fieldValue={fieldValue}
        onImportFieldClick={onImportFieldClick}
        onImportTypeClick={onImportTypeClick}
        metaData={metaData}
        moduleType={moduleType}
      />
      <CheckboxGroup
        className={cx(styles.ImportFieldCheckBox)}
        id={`${fieldData.field_uuid}_checkbox`}
        options={[
          {
            label: '',
            value: '',
            selected: isImported,
            disabled: isImportDisabled,
          },
        ]}
        size={ECheckboxSize.SM}
      />
      <div
        onClick={() => !isImportDisabled && onImportFieldClick(
            fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID],
            fieldData?.[RESPONSE_FIELD_KEYS.TABLE_UUID],
            path,
          )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          keydownOrKeypessEnterHandle(e) && !isImportDisabled &&
          onImportFieldClick(
            fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID],
            fieldData?.[RESPONSE_FIELD_KEYS.TABLE_UUID],
            path,
          )
        }
        className={cx(
          styles.Overlay,
          isImportDisabled && styles.Disabled,
          fieldData.isImported && styles.Imported,
        )}
      >
        {fieldData.isImported && (
          <div className={styles.OverlayButtons}>
            <button
              className={cx(
                styles.OverlayBtn,
                fieldData.isReadOnly && styles.SelectedBtn,
              )}
              onClick={(e) => onImportTypeChangeClick(fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID], true, e)}
            >
              {FIELD.READ_ONLY}
            </button>
            {!IMPORT_READONLY_FIELD_TYPES.includes(fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE]) &&
              <button
                className={cx(
                  styles.OverlayBtn,
                  !fieldData.isReadOnly && styles.SelectedBtn,
                )}
                onClick={(e) => onImportTypeChangeClick(fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID], false, e)}
              >
                {FIELD.EDITABLE}
              </button>
            }
          </div>
        )}
      </div>
      { isImportDisabled &&
        <Text size={ETextSize.XS} className={gClasses.MT5} content={t('form_builder_strings.import_intruction.field_already_exists')} />}
    </div>
  );
}

export default ImportField;

ImportField.propTypes = {
  fieldData: PropTypes.object,
  fieldValue: PropTypes.any,
  onImportTypeClick: PropTypes.func,
  onImportFieldClick: PropTypes.func,
};

ImportField.defaultProps = {
  fieldData: {},
  fieldValue: '',
  onImportTypeClick: () => {},
  onImportFieldClick: () => {},
};
