import React from 'react';
import cx from 'classnames/bind';
import jsUtils, { translateFunction } from 'utils/jsUtility';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import { ARIA_ROLES } from 'utils/UIConstants';
import { ARIA_LABEL, FORM_STRINGS } from 'components/form_builder/FormBuilder.strings';
import AddIcon from 'assets/icons/AddIcon';
import styles from './CreateTable.module.scss';
import CustomLink from '../../../form_components/link/Link';

import gClasses from '../../../../scss/Typography.module.scss';

export const getAddRowButton = (onAddRowClickHandler, tableValidations = {}, isEditableForm, isReadOnlyForm, isCompletedForm, areAllTableColumnsReadOnly, isTableDisabled, t = translateFunction) => {
  const { add_new_row, read_only } = tableValidations;
  const { TABLE } = FORM_STRINGS;
  if (
      (onAddRowClickHandler !== undefined) &&
      isEditableForm &&
      !read_only &&
      !isReadOnlyForm &&
      !isCompletedForm &&
      !areAllTableColumnsReadOnly &&
      !isTableDisabled &&
      add_new_row
    ) {
    return (
      <CustomLink className={cx(styles.AddRow, gClasses.CenterV, gClasses.MT10)} onClick={onAddRowClickHandler}>
        <AddIcon role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.ADD} ariaHidden className={cx(gClasses.MR3, styles.AddIcon)} />
        {t(TABLE.ADD_ROW)}
      </CustomLink>
    );
  }
  return null;
};

export const getDeleteRowButton = (
  onRowDeleteHandler,
  tableValidations = {},
  isEditableForm,
  isReadOnlyForm,
  isCompletedForm,
  areAllTableColumnsReadOnly,
  rowId,
  ) => {
  const { read_only, allow_delete_existing } = tableValidations;
  if (
    (onRowDeleteHandler !== undefined) &&
    isEditableForm &&
    !read_only &&
    !isReadOnlyForm &&
    !isCompletedForm &&
    (!areAllTableColumnsReadOnly || (areAllTableColumnsReadOnly && allow_delete_existing))
    ) {
      if (allow_delete_existing || (!allow_delete_existing && jsUtils.isNull(rowId))) {
          return (
            <div className={styles.RowDelIconContainer}>
              <DeleteIconV2
                className={cx(gClasses.CursorPointer, styles.RowDeleteIcon)}
                tabIndex={0}
                role="button"
                ariaLabel="delete table row"
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onRowDeleteHandler()}
                onClick={onRowDeleteHandler}
              />
            </div>
          );
      }
      return null;
    }
  return null;
};

export default getAddRowButton;
