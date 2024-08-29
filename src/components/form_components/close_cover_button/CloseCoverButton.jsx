import React from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import EditIconV2 from 'assets/icons/form_fields/EditIconV2';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import CloseIcon from 'assets/icons/CloseIcon';
import { useTranslation } from 'react-i18next';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './CloseCoverButton.module.scss';
import {
  getStringAndSubString,
  keydownOrKeypessEnterHandle,
} from '../../../utils/UtilityFunctions';
import {
  allowedFieldTypesForFieldValues,
  getSelectedFieldNames,
} from '../../dashboard_filter/FilterUtils';

function CloseCoverButton(props) {
  const { t } = useTranslation();
  const {
    name,
    value,
    fieldValues,
    type,
    onCloseCover,
    isClickableLabel = false,
    isDeleteOption,
    isEditOption,
    onEdit,
    onDelete,
    isUserFilter = false,
    isCover,
  } = props;

  const { str: strName } = getStringAndSubString(name, t);
  let selectedValues = [];
  if (allowedFieldTypesForFieldValues.includes(type)) {
    selectedValues = getSelectedFieldNames(fieldValues);
  } else {
    selectedValues = value;
  }
  const { str: strValue } = getStringAndSubString(
    selectedValues,
    t,
    type,
    15,
    '...',
  );

  const ARIA_LABEL = {
    EDIT: 'Edit',
    DELETE: 'Delete',
  };
  const onLabelClick = () => {
    const { labelClicked } = props;
    isClickableLabel && labelClicked();
  };

  return isUserFilter || isCover ? (
    <div className={cx(styles.container)}>
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.W100)}>
        <button
          className={cx(
            BS.D_FLEX,
            gClasses.CenterV,
            gClasses.WhiteSpaceNoWrap,
            styles.appliedFont,
            {
              [gClasses.CursorPointer]: isClickableLabel,
            },
          )}
          onClick={onLabelClick}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onLabelClick()}
        >
          {name && (
            <span title={strName}>
              {strName}
              :&nbsp;
            </span>
          )}
          <span
            title={strValue}
            className={cx(
              gClasses.WordWrap,
              styles.MaxWidth400,
              gClasses.Ellipsis,
              gClasses.TextAlignLeft,
            )}
          >
            {strValue}
          </span>
        </button>
        <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
          {isEditOption && (
            <button
              className={cx(
                styles.IconRectangle,
                gClasses.ML10,
                BS.D_FLEX,
                BS.JC_CENTER,
                BS.ALIGN_ITEM_CENTER,
                gClasses.CursorPointer,
              )}
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onEdit()}
              aria-label={`edit ${strValue}`}
              onClick={onEdit}
            >
              <EditIconV2
                className={cx(styles.editIcon)}
                role={ARIA_ROLES.IMG}
                ariaLabel={ARIA_LABEL.EDIT}
              />
            </button>
          )}
          {isDeleteOption && (
            <button
              className={cx(
                styles.IconRectangle,
                gClasses.ML5,
                BS.D_FLEX,
                BS.JC_CENTER,
                BS.ALIGN_ITEM_CENTER,
                gClasses.CursorPointer,
              )}
              onClick={onDelete}
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onDelete()}
              aria-label={`delete ${strValue}`}
            >
              <DeleteIconV2
                className={cx(styles.deleteIcon)}
                role={ARIA_ROLES.IMG}
                ariaLabel={ARIA_LABEL.DELETE}
              />
            </button>
          )}
          {!isDeleteOption && (
            <CloseIcon
              className={cx(
                styles.closeIcon,
                gClasses.ML10,
                BS.JC_END,
                gClasses.CursorPointer,
              )}
              ariaLabel={`Remove ${strName} filter`}
              onClick={onCloseCover}
              isButtonColor
              role={ARIA_ROLES.BUTTON}
              tabIndex={0}
              onKeyDown={(e) =>
                keydownOrKeypessEnterHandle(e) && onCloseCover()
              }
            />
          )}
        </div>
      </div>
    </div>
  ) : null;
}
export default CloseCoverButton;

CloseCoverButton.propTypes = {
  name: PropTypes.any,
  value: PropTypes.any,
  fieldValues: PropTypes.any,
  type: PropTypes.string,
  onCloseCover: PropTypes.func,
  isClickableLabel: PropTypes.bool,
  isDeleteOption: PropTypes.bool,
  isEditOption: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  isUserFilter: PropTypes.bool,
  isCover: PropTypes.bool,
  labelClicked: PropTypes.func,
};
