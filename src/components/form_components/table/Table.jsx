import { ETextSize, Label, Table as LibTable, TableColumnWidthVariant, TableScrollType, TableWithPagination, Text, ETooltipType, ETooltipPlacements, Tooltip } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useRef, useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import parse from 'html-react-parser';
import { RESPONSE_FIELD_KEYS } from '../../../utils/constants/form/form.constant';
import { cloneDeep, get, isEmpty, has } from '../../../utils/jsUtility';
import { FIELD_ACTION, FORM_TYPE, ROW_IDENTIFIER } from '../../../containers/form/Form.string';
import Field from '../../../containers/form/sections/form_field/field/Field';
import EditIconV2 from '../../../assets/icons/form_fields/EditIconV2';
import styles from './Table.module.scss';
import ImportTable from './ImportTable';
import ReadOnlyField from '../../../containers/form/sections/form_field/readonlyfield/ReadOnlyField';
import Trash from '../../../assets/icons/application/Trash';
import ErrorMessage from '../../error_message/ErrorMessage';
import { getValidationMessage } from '../../../containers/form/sections/form_field/field/Field.util';
import { EMPTY_STRING, NO_DATA_FOUND_TEXT } from '../../../utils/strings/CommonStrings';
import PlusIconBlueNew from '../../../assets/icons/PlusIconBlueNew';
import HelpIconV2 from '../../../assets/icons/HelpIconV2';
import { BS } from '../../../utils/UIConstants';
import { TABLE_CONTROL_ACCESS, isEmptyChecker } from './Table.utils';
import { checkAllFieldsAreReadOnly } from '../../../containers/form/sections/field_configuration/validation_and_visibility_configuration/validation_configuration/ValidationConfiguration.utils';
import { isEntireTableDisabled } from '../../../containers/form/layout/Layout.utils';
import { FIELD_TYPE } from '../../../utils/constants/form.constant';
import { MODULE_TYPES } from '../../../utils/Constants';

function Table(props) {
  const {
    fieldData = {}, // fieldUUID, fieldName, columns
    fieldValue = [],
    documentDetails,
    formData,
    formType,
    metaData,
    moduleType,
    validationMessage,
    isLoading,
    tablePath,

    onEdit,
    onChangeHandler, // (fieldData, value, field_action, options)
    onImportFieldClick,
    onImportTypeClick,
    visibility,
    isPaginated = false,
    paginationData = {},
    minimumLimit,
    className,
    isFormTable,
    colorScheme,
    userProfileData,
    serverError = {},
    tableVariant,
  } = props;

  const { t } = useTranslation();
  const isCreationForm = formType === FORM_TYPE.CREATION_FORM;
  const isEditableForm = formType === FORM_TYPE.EDITABLE_FORM;
  const tableUUID = fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID];
  const isRemoveRowBtn = useRef(false);
  const targetRef = useRef(null);
  const [trackedWidth, setTrackedWidth] = useState({});
  const pref_locale = localStorage.getItem('application_language');

  useEffect(() => {
    if (targetRef?.current) {
      setTrackedWidth({
        width: `${targetRef?.current?.clientWidth}px`,
      });
    }
  }, [targetRef?.current?.clientWidth]);

  const columns = fieldData?.columns || [];

  const TableComponent = isPaginated ? TableWithPagination : LibTable;

  const getTableLabel = () => {
    const editButton = (isCreationForm) && (
      <button
      className={styles.Edit}
      onClick={onEdit}
      >
        <EditIconV2 />
      </button>
    );

    return (
      <div className={cx(styles.LabelContainer, gClasses.PY8)}>
        <div className={gClasses.CenterV}>
          <Label
            id={`${tableUUID}_label`}
            labelName={fieldData?.[RESPONSE_FIELD_KEYS.TRANSLATION_DATA]?.[pref_locale]?.[RESPONSE_FIELD_KEYS.FIELD_NAME] || fieldData[RESPONSE_FIELD_KEYS.FIELD_NAME]}
            isRequired={false}
          />
          {(moduleType === MODULE_TYPES.SUMMARY || formType !== FORM_TYPE.READONLY_FORM) && fieldData?.helpText &&
            // <>
            //   <HelpIconV2 id={`helper_tooltip_${fieldData?.fieldUUID}`} className={cx(gClasses.ML10, gClasses.MB8)} />
            //   <Tooltip
            //     id={`helper_tooltip_${fieldData?.fieldUUID}`}
            //     content={fieldData?.[RESPONSE_FIELD_KEYS.TRANSLATION_DATA]?.[pref_locale]?.helpText || fieldData?.helpText}
            //     placement={POPPER_PLACEMENTS.TOP}
            //     isCustomToolTip
            //     outerClass={cx(gClasses.OpacityFull)}
            //     arrowStyle={styles.TooltipArrowClass}
            //     customInnerClasss={styles.Tooltip}
            //   />
            // </>
            <Tooltip
              className={moduleType !== MODULE_TYPES.SUMMARY ? cx(gClasses.ML10, gClasses.MB8) : EMPTY_STRING}
              text={fieldData?.[RESPONSE_FIELD_KEYS.TRANSLATION_DATA]?.[pref_locale]?.helpText || fieldData?.helpText}
              tooltipType={ETooltipType.INFO}
              tooltipPlacement={ETooltipPlacements.TOP}
              icon={<HelpIconV2 />}
            />
          }
        </div>
        {editButton}
      </div>
    );
  };

  // Header
  const getTableHeaders = () => {
      if (isEmpty(columns)) return [];

      const elements = columns.map((eachColumn) => {
          const fieldInstructionText = eachColumn?.[RESPONSE_FIELD_KEYS.TRANSLATION_DATA]?.[pref_locale]?.[RESPONSE_FIELD_KEYS.INSTRUCTION] || eachColumn?.[RESPONSE_FIELD_KEYS.INSTRUCTION];
          const fieldInstruction = !isEmpty(fieldInstructionText) ? parse(fieldInstructionText) : null;
          const isLinkField = (eachColumn?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.LINK);
          return {
            id: `${eachColumn[RESPONSE_FIELD_KEYS.FIELD_UUID]}_header`,
            component: (
              <div className={cx(gClasses.DisplayFlex, gClasses.FlexDirectionColumn)}>
                <div className={gClasses.CenterV}>
                  <Label
                    innerLabelClass={gClasses.MB0}
                    id={eachColumn[RESPONSE_FIELD_KEYS.FIELD_UUID]}
                    labelName={eachColumn?.[RESPONSE_FIELD_KEYS.TRANSLATION_DATA]?.[pref_locale]?.[RESPONSE_FIELD_KEYS.FIELD_NAME] || eachColumn[RESPONSE_FIELD_KEYS.FIELD_NAME]}
                    isRequired={formType !== FORM_TYPE.READONLY_FORM && eachColumn[RESPONSE_FIELD_KEYS.REQUIRED]}
                  />
                  {(moduleType === MODULE_TYPES.SUMMARY || formType !== FORM_TYPE.READONLY_FORM) && eachColumn?.helpText &&
                  // <>
                  //   <HelpIconV2 id={`helper_tooltip_${eachColumn?.fieldUUID}`} className={cx(gClasses.ML10, gClasses.MB8)} />
                  //   <Tooltip
                  //     id={`helper_tooltip_${eachColumn?.fieldUUID}`}
                  //     content={eachColumn?.[RESPONSE_FIELD_KEYS.TRANSLATION_DATA]?.[pref_locale]?.helpText || eachColumn?.helpText}
                  //     placement={POPPER_PLACEMENTS.TOP}
                  //     isCustomToolTip
                  //     outerClass={cx(gClasses.OpacityFull)}
                  //     arrowStyle={styles.TooltipArrowClass}
                  //     customInnerClasss={styles.Tooltip}
                  //   />
                  // </>
                  <Tooltip
                    className={moduleType !== MODULE_TYPES.SUMMARY ? cx(gClasses.ML10, gClasses.MB8) : EMPTY_STRING}
                    text={eachColumn?.[RESPONSE_FIELD_KEYS.TRANSLATION_DATA]?.[pref_locale]?.helpText || eachColumn?.helpText}
                    tooltipType={ETooltipType.INFO}
                    tooltipPlacement={ETooltipPlacements.TOP}
                    icon={<HelpIconV2 />}
                  />
                  }
                </div>
                  {(moduleType === MODULE_TYPES.SUMMARY || formType !== FORM_TYPE.READONLY_FORM) && eachColumn?.instructions &&
                  <Text
                    id={`${eachColumn?.[RESPONSE_FIELD_KEYS.FIELD_UUID]}_instruction`}
                    size={ETextSize.XS}
                    className={cx('text-black-60 font-inter whitespace-normal', styles.ColumnInstruction)}
                    title={fieldInstruction}
                    content={fieldInstruction}
                    style={trackedWidth}
                  />
                  }
              </div>
            ),
            className: isLinkField && styles.LinkFieldClass,
            widthWeight: isLinkField ? 4 : 1,
          };
      });

      if (isRemoveRowBtn.current) {
        elements.push('');
      }

      return elements;
  };

  // Body
  const getRemoveRowBtn = (index) => {
    const onRemove = () => {
      let cloneValue = cloneDeep(fieldValue) || [];
      cloneValue.splice(index, 1);
      cloneValue = cloneValue.filter((row) => !row._id);
      isRemoveRowBtn.current = cloneValue.length > 0;

      onChangeHandler(fieldData, null, FIELD_ACTION.TABLE_REMOVE_ROW, {
        tableUUID,
        rowIndex: index,
        tableAction: FIELD_ACTION.TABLE_REMOVE_ROW,
      });
    };
    return (
      <button onClick={onRemove} className={styles.DeleteButton}><Trash /></button>
    );
  };

  const getEachRow = (rowData, index) => {
    if (isEmpty(columns)) return [];

    const getField = (eachColumn, value) => {
      let fieldComponent = null;
      if (isCreationForm || isEditableForm) {
        const fieldUUID = eachColumn[RESPONSE_FIELD_KEYS.FIELD_UUID];
        const errorKey = `${tableUUID},${index},${fieldUUID}`;
        // const isVisible = get(visibility?.visible_fields, [fieldUUID], false);

        const isVisibleDisable = get(visibility?.visible_fields, [fieldUUID], false) ?
        (
          has(visibility?.visible_disable_fields, [tableUUID, index, fieldUUID], false) ?
          get(visibility?.visible_disable_fields, [tableUUID, index, fieldUUID], false) :
          false
        ) : (
          has(visibility?.visible_disable_fields, [tableUUID, index, fieldUUID], false) ?
          get(visibility?.visible_disable_fields, [tableUUID, index, fieldUUID], false) :
          get(visibility?.visible_disable_fields, [fieldUUID], false)
        );

        // if (isEditableForm && (!isVisible && !isVisibleDisable)) return null;
        if (eachColumn?.hideFieldIfNull && isEmptyChecker(eachColumn, value) && isEditableForm) {
          fieldComponent = null;
        } else {
          fieldComponent = (
            <Field
              rowUUID={rowData[ROW_IDENTIFIER.TEMP_ROW_UUID]}
              fieldData={eachColumn}
              fieldValue={value}
              documentDetails={documentDetails}
              onChangeHandler={(_fieldData, value, action, options_) =>
                onChangeHandler(_fieldData, value, action, {
                  ...options_,
                  rowIndex: index,
                  [ROW_IDENTIFIER.TEMP_ROW_UUID]: rowData?.[ROW_IDENTIFIER.TEMP_ROW_UUID],
                  // tableField: eachColumn,
                  tableUUID,
                })
              }
              formType={formType}
              metaData={metaData}
              moduleType={moduleType}
              validationMessage={getValidationMessage(
                validationMessage,
                eachColumn,
                errorKey,
                formType,
              )}
              hideLabel
              tableUUID={fieldData?.fieldUUID}
              isEditableForm={isEditableForm}
              readOnly={
                (!fieldData?.validations?.allowModifyExisting && !!rowData._id) ||
                (isEditableForm && isVisibleDisable)
              }
              userProfileData={userProfileData}
              rowIndex={index}
              rowId={rowData[ROW_IDENTIFIER.ID]}
              formData={formData}
            />
          );
        }
      } else {
        if (eachColumn?.hideFieldIfNull && isEmptyChecker(eachColumn, value)) {
          fieldComponent = null;
        } else {
          fieldComponent = (
            <ReadOnlyField
              fieldData={eachColumn}
              fieldValue={value}
              documentDetails={documentDetails}
              formData={formData}
              hideLabel
              rowIndex={index}
              moduleType={moduleType}
            />
          );
        }
      }

      return (
        <div ref={targetRef} className={cx(styles.EachColumn, !isEmpty(getValidationMessage(serverError, eachColumn, EMPTY_STRING, formType)) && gClasses.ErrorInputBorder)}>
          {fieldComponent}
        </div>
      );
    };

    // row Fields
    const rowElements = columns.map((eachColumn) => {
      const fieldUUID = eachColumn?.[RESPONSE_FIELD_KEYS.FIELD_UUID];
      const value = rowData?.[fieldUUID];
      return getField(eachColumn, value);
    });

    // remove Button
    if (
      isEditableForm &&
      ((minimumLimit && fieldValue?.length <= minimumLimit) || !minimumLimit) &&
      (fieldData.validations.allowDeleteExisting || !rowData._id)
    ) {
      isRemoveRowBtn.current = true;
      rowElements.push(getRemoveRowBtn(index));
    } else if (isRemoveRowBtn.current) {
      rowElements.push('');
    }

    return rowElements;
  };

  const getTableBody = () => {
      if (isEmpty(columns)) return [];

      let rows = [];

      if (isCreationForm) {
        rows = [{}];
      } else rows = fieldValue || [];

      if (rows.length === 0) {
        const emptyFields = fieldData.columns.map(() => '');
        emptyFields.pop();
        return [
          {
            id: 'no-values-found',
            component: [<Text content={NO_DATA_FOUND_TEXT} />, ...emptyFields],
          },
        ];
      }

      return rows.map((eachRow, index) => {
        return {
          id: eachRow?.row_id || eachRow?._id || index,
          component: getEachRow(eachRow, index),
        };
      });
  };

  const getImportTable = () => (
    <ImportTable
      fieldData={fieldData}
      tablePath={tablePath}
      onImportFieldClick={onImportFieldClick}
      onImportTypeClick={onImportTypeClick}
      validationMessage={validationMessage}
      colorScheme={colorScheme}
    />
  );

  const fieldInstructionText = fieldData?.[RESPONSE_FIELD_KEYS.TRANSLATION_DATA]?.[pref_locale]?.[RESPONSE_FIELD_KEYS.INSTRUCTION] || fieldData?.[RESPONSE_FIELD_KEYS.INSTRUCTION];
  const fieldInstruction = !isEmpty(fieldInstructionText) ? parse(fieldInstructionText) : null;

 const getTable = () => (
  <div className={gClasses.PositionRelative}>
    <div className={styles.TableWrapper}>
      <TableComponent
        id={tableUUID}
        data={getTableBody()}
        header={getTableHeaders()}
        isLoading={isLoading}
        isRowClickable={false}
        colorScheme={colorScheme}
        scrollType={TableScrollType.AUTO}
        widthVariant={TableColumnWidthVariant.CUSTOM}
        paginationProps={paginationData}
        isFormTable={isFormTable}
        tableVariant={tableVariant}
      />
    </div>
    {formType !== FORM_TYPE.READONLY_FORM && fieldData?.instructions &&
      <Text
        id={`${fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID]}_instruction`}
        size={ETextSize.XS}
        className={cx('text-black-60 font-inter whitespace-normal', styles.ColumnInstruction, gClasses.PT4)}
        title={fieldInstruction}
        content={fieldInstruction}
      />
    }
  </div>
);

  // Add new row link.
const getAddButton = () => {
  const isAllColumnsReadonly = columns.every((f) => f[RESPONSE_FIELD_KEYS.READ_ONLY]);
  if (
    !isEditableForm ||
    !fieldData.validations.addNewRow ||
    isAllColumnsReadonly ||
    isEntireTableDisabled(visibility?.visible_disable_fields, visibility?.visible_fields, fieldData)
  ) return null;

    const onAddClick = () => {
      isRemoveRowBtn.current = true;
      onChangeHandler(fieldData, null, FIELD_ACTION.TABLE_ADD_ROW, {
        tableUUID,
        tableAction: FIELD_ACTION.TABLE_ADD_ROW,
      });
    };
    const disabled = (fieldData.validations.isMaximumRow && fieldValue.length >= fieldData.validations.maximumRow);
    return (
      <button style={{ color: colorScheme?.activeColor }} className={cx(gClasses.BlueIconBtn, styles.AddRowBtn)} disabled={disabled} onClick={onAddClick}>
        <PlusIconBlueNew fillColor={colorScheme?.activeColor} />
        Add Row
      </button>
    );
  };

  // Error Message.
  const getErrorMessage = () => {
    if (!validationMessage?.[tableUUID]) return null;
    return (
      <ErrorMessage
        errorMessage={
          validationMessage[tableUUID]
        }
        className={cx(gClasses.MT5)}
      />
    );
  };

  // Edge case warning.
  const getWarning = () => {
    if (formType !== FORM_TYPE.CREATION_FORM) return null;

    const isAllColumnReadOnly = checkAllFieldsAreReadOnly(columns);
    if (!isAllColumnReadOnly) return null;

    return (
          <div className={cx(BS.ALERT, BS.ALERT_WARNING, gClasses.FTwo11, gClasses.MT8)}>
          {TABLE_CONTROL_ACCESS(t).REVOKE_ADD_AND_EDIT_INFO}
          </div>
    );
 };

  return (
    <div className={cx(styles.Table, className)}>
      {getTableLabel()}
      {formType === FORM_TYPE.IMPORT_FROM ? getImportTable() : getTable()}
      {getErrorMessage()}
      {getAddButton()}
      {getWarning()}
    </div>
  );
}

export default Table;
