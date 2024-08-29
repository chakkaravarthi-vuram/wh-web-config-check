import React, { useRef } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { useTranslation } from 'react-i18next';
import { FORM_ACTIONS, FORM_LAYOUT_TYPE, FORM_TYPE } from '../../Form.string';
import Field from './field/Field';
import ReadOnlyField from './readonlyfield/ReadOnlyField';
import styles from './FormFields.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import ImportField from './import_field/ImportField';
import { RESPONSE_FIELD_KEYS } from '../../../../utils/constants/form/form.constant';
import { isEmpty } from '../../../../utils/jsUtility';
import { getValidationMessage } from './field/Field.util';
import { FIELD_TYPE } from '../../../../utils/constants/form.constant';
import { FORM_FIELD_STRINGS } from './FormField.string';
import ReadOnlyIcon from '../../../../assets/icons/form_fields/ReadOnlyIcon';
import ImportedIcon from '../../../../assets/icons/form_fields/ImportedIcon';
import { FIELD_TYPES } from '../field_configuration/FieldConfiguration.strings';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { isEmptyChecker } from '../../../../components/form_components/table/Table.utils';
import { MODULE_TYPES } from '../../../../utils/Constants';

function FormField(props) {
  const {
    // Common
    layout,
    fieldData,
    formType,
    dataListAuditfields,
    sectionUUID,
    dispatch,
    metaData,
    moduleType,
    readOnly = false,
    userProfileData,

    // Creation
    path,
    // onEdit,

    // Import
    onImportTypeChange,
    onImportFieldClick,

    // Edit
    onFieldDataChange,

    // Edit, ReadOnly
    fieldValue = null,
    documentDetails,
    validationMessage = {},
    formData,
    informationFieldFormContent,
    visibility = {},
    column,
    showAllFields,
  } = props;

  const ref = useRef();
  const { t } = useTranslation();

  // Drag Layer
  const type = (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE) ?
                FORM_LAYOUT_TYPE.TABLE :
                FORM_LAYOUT_TYPE.FIELD;

  const [{ isDragging }, drag] = useDrag({
      type: type,
      canDrag: (formType === FORM_TYPE.CREATION_FORM),
      item: {
        sectionUUID,
        path,
        data: layout,
        type: type,
      },
      collect: (monitor) => {
        return {
          isDragging: monitor.isDragging(),
        };
      },
  });

  (formType === FORM_TYPE.CREATION_FORM) && drag(ref);

  const onEditClick = () => {
    dispatch?.(FORM_ACTIONS.ACTIVE_FIELD_DATA_CHANGE, { fieldData: {
        ...fieldData,
        path,
        [RESPONSE_FIELD_KEYS.NODE_UUID]: layout?.node_uuid,
        sectionUUID,
     } });
  };

  const getFieldBasedOnFormType = () => {
    if (isDragging) {
      return (
        <div className={styles.DragBG} />
      );
    }

    const isTable = fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.TABLE;
    let cloneFormType = formType;
    if (
      moduleType === MODULE_TYPES.SUMMARY &&
      formType === FORM_TYPE.CREATION_FORM &&
      ![
        FIELD_TYPE.RICH_TEXT,
        FIELD_TYPE.IMAGE,
        FORM_LAYOUT_TYPE.LAYOUT,
        FIELD_TYPE.BUTTON_LINK,
        FIELD_TYPE.INFORMATION,
      ].includes(fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE])
    ) {
      cloneFormType = FORM_TYPE.EXISTING_READONLY;
    }

    switch (cloneFormType) {
      case FORM_TYPE.READ_ONLY_CREATION_FORM:
      case FORM_TYPE.CREATION_FORM:
        return (
          <div ref={ref} className={cx(formType === FORM_TYPE.READ_ONLY_CREATION_FORM ? styles.ReadOnlyCreationField : styles.CreationField, styles.FieldBreak, (isTable) && styles.TableField, !isEmpty(getValidationMessage(validationMessage, fieldData, EMPTY_STRING, formType)) && gClasses.ErrorInputBorder)}>
            <div className={styles.IconsWrapper}>
              {fieldData.readOnly && <ReadOnlyIcon title="ReadOnly field" />}
              {fieldData.formCount > 1 && <ImportedIcon title="Imported field" />}
            </div>
            <Field
              fieldData={fieldData}
              formType={formType}
              fieldValue={fieldValue}
              onEdit={onEditClick}
              userProfileData={userProfileData}
              moduleType={moduleType}
              metaData={metaData}
              column={column}
              serverError={validationMessage}
              formData={formData}
            />
           {/* {
            (!isTable && !(fieldData?.[RESPONSE_FIELD_KEYS.IS_SYSTEM_DEFINED] && !fieldData?.[RESPONSE_FIELD_KEYS.IS_ALLOW_VALUE_UPDATE])) &&
            (<button className={cx(styles.Overlay, gClasses.CenterVH)} onClick={() => onEditClick()}>
              <FieldSettingIcon />
             </button>)
            } */}
          </div>
        );
      case FORM_TYPE.EDITABLE_FORM:
        return (
        <div className={cx(styles.FieldBreak, formType !== FORM_TYPE.CREATION_FORM && gClasses.PL0)}>
          {(fieldData?.hideFieldIfNull && isEmptyChecker(fieldData, fieldValue)) ? null :
          <Field
            fieldData={fieldData}
            metaData={metaData}
            moduleType={moduleType}
            formType={formType}
            onChangeHandler={onFieldDataChange} // params - (fieldData, value, action)
            fieldValue={fieldValue}
            documentDetails={documentDetails}
            validationMessage={getValidationMessage(validationMessage, fieldData, EMPTY_STRING, formType)}
            formData={formData}
            informationFieldFormContent={informationFieldFormContent}
            isEditableForm
            readOnly={readOnly}
            visibility={visibility}
            userProfileData={userProfileData}
            column={column}
          />
          }
        </div>
        );
      case FORM_TYPE.IMPORT_FROM:
        return (
          <ImportField
            fieldData={fieldData}
            fieldValue={fieldValue}
            onImportFieldClick={onImportFieldClick}
            onImportTypeClick={onImportTypeChange}
            path={path}
            validationMessage={getValidationMessage(validationMessage, fieldData, EMPTY_STRING, formType)}
            userProfileData={userProfileData}
            column={column}
            metaData={metaData}
          />
        );
      case FORM_TYPE.READONLY_FORM: {
        let auditBackgroundColour;
        let indicatorColour;
        const fieldUUID = fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID];
        const isFieldAudited = dataListAuditfields && (fieldUUID in dataListAuditfields);
        if (isFieldAudited) {
          const actionType = ((dataListAuditfields && dataListAuditfields[fieldUUID] && dataListAuditfields[fieldUUID].action));
          switch (actionType) {
            case FORM_FIELD_STRINGS(t).FIELD.AUDIT_TYPES.EDIT:
            {
              auditBackgroundColour = styles.EditedCard;
              indicatorColour = styles.EditedBackground;
              break;
            }
            case FORM_FIELD_STRINGS(t).FIELD.AUDIT_TYPES.DELETE:
              {
              auditBackgroundColour = styles.DeletedCard;
              indicatorColour = styles.DeletedBackground;
              break;
              }
            case FORM_FIELD_STRINGS(t).FIELD.AUDIT_TYPES.ADD:
              {
                auditBackgroundColour = styles.AddedCard;
                indicatorColour = styles.AddedBackgroung;
                break;
              }
              default:
                break;
          }
        }

        return (
          <div className={isFieldAudited && cx(auditBackgroundColour, styles.AuditedFieldContainer)}>
            {(!showAllFields && fieldData?.hideFieldIfNull && isEmptyChecker(fieldData, fieldValue)) ? null :
            <ReadOnlyField
              fieldData={fieldData}
              fieldValue={fieldValue}
              documentDetails={documentDetails}
              formData={formData}
              informationFieldFormContent={informationFieldFormContent}
              metaData={metaData}
              moduleType={moduleType}
              column={column}
            />
            }
            {isFieldAudited && <div className={cx(styles.Indicator, indicatorColour, gClasses.MR10, gClasses.MT10)} />}
          </div>
        );
      }
      case FORM_TYPE.EXISTING_READONLY: {
        return (
          <div
            ref={ref}
            className={cx(
              styles.CreationField,
              styles.FieldBreak,
              isTable && styles.TableField,
              !isEmpty(
                getValidationMessage(
                  validationMessage,
                  fieldData,
                  EMPTY_STRING,
                  formType,
                ),
              ) && gClasses.ErrorInputBorder,
            )}
          >
            <div>
              <ReadOnlyField
                fieldData={fieldData}
                fieldValue={fieldValue}
                documentDetails={documentDetails}
                formData={formData}
                informationFieldFormContent={informationFieldFormContent}
                moduleType={moduleType}
              />
            </div>
          </div>
        );
      }
      default:
        break;
    }

    return null;
  };

  return <div>{getFieldBasedOnFormType()}</div>;
}

export default FormField;

FormField.propTypes = {
  fieldData: PropTypes.object,
  formType: PropTypes.oneOf(FORM_TYPE),
  defaultFieldValues: PropTypes.any,
  onEdit: PropTypes.func,
  isHovered: PropTypes.bool,
  onImportFieldClick: PropTypes.func,
  onImportTypeChange: PropTypes.func,
  dataListAuditfields: PropTypes.object,
};

FormField.defaultProps = {
  fieldData: {},
  formType: FORM_TYPE.CREATION_FORM,
  defaultFieldValues: {},
  onEdit: null,
  isHovered: null,
  onImportFieldClick: null,
  onImportTypeChange: null,
  dataListAuditfields: {},
};
