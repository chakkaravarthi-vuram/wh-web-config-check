import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import AddIcon from 'assets/icons/AddIcon';
import ImportSectionIcon from 'assets/icons/flow/ImportSectionIcon';

import { useTranslation } from 'react-i18next';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './AddSection.module.scss';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import { ARIA_LABEL, FORM_STRINGS } from '../FormBuilder.strings';

function AddSection(props) {
  const {
    onSectionAddButtonClick,
    showOnlyNewFormFieldsDropdown,
    onSourceSelect,
  } = props;
  const { t } = useTranslation();
  const onAddSectionClick = () => {
    const isTableSection = false;
    onSectionAddButtonClick(isTableSection);
  };

  return (
    <>
    <div className={styles.SectionBorder} />
    <div className={cx(BS.D_FLEX, gClasses, gClasses.MT12)}>
      <button className={cx(styles.BtnContainer, gClasses.CenterV)} onClick={onAddSectionClick}>
        <AddIcon className={styles.AddIcon} role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.ADD_SECTION} />
        <span className={styles.ButtonText}>
          {t(FORM_STRINGS.ADD_NEW_SECTION)}
        </span>
      </button>
      {!showOnlyNewFormFieldsDropdown && (
        <button
          className={cx(
            gClasses.ClickableElement,
            gClasses.CursorPointer,
            styles.BtnContainer,
            gClasses.CenterV,
            gClasses.ML10,
          )}
          onClick={onSourceSelect}
        >
          <ImportSectionIcon className={cx(gClasses.MR7)} />
          <span className={styles.ButtonText}>
          {t(FORM_STRINGS.IMPORT_SECTION)}
          </span>
        </button>
      )}
    </div>
    </>
  );
}
export default AddSection;
AddSection.defaultProps = {
  sectionTitle: EMPTY_STRING,
  sectionTitleError: EMPTY_STRING,
  onSectionAddButtonClick: null,
};
AddSection.propTypes = {
  onSectionAddButtonClick: PropTypes.func,
  onTextChange: PropTypes.func.isRequired,
  sectionTitle: PropTypes.string,
  sectionTitleError: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};
