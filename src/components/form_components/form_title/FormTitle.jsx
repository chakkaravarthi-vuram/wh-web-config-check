import React from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';

import ChevronIcon from '../../../assets/icons/ChevronIcon';

import gClasses from '../../../scss/Typography.module.scss';
import styles from './FormTitle.module.scss';
import { BS } from '../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

export const FORM_TITLE_TYPES = {
  TYPE_1: 'FT_TYPE_1',
  TYPE_2: 'FT_TYPE_2',
  TYPE_3: 'FT_TYPE_3',
  TYPE_4: 'FT_TYPE_4',
  TYPE_5: 'FT_TYPE_5',
  TYPE_6: 'FT_TYPE_6',
  TYPE_7: 'FT_TYPE_7',
};
function FormTitle(props) {
  const {
    type = FORM_TITLE_TYPES.TYPE_1,
    isDataLoading,
    children,
    isAccordion,
    isAccordionOpen,
    onIconClick,
    className,
    fontFamilyStyle,
    categoryFontStyle,
  } = props;
  let chevron = null;
  let rotateClass = null;
  let formTitleTypeStyles = null;

  if (isAccordion) {
    if (!isAccordionOpen) {
      rotateClass = gClasses.Rotate180;
    }
    chevron = (
      <ChevronIcon
        onClick={onIconClick}
        isButtonColor
        className={cx(gClasses.Rotate180, gClasses.CursorPointer, rotateClass)}
      />
    );
  }

  switch (type) {
    case FORM_TITLE_TYPES.TYPE_1:
      formTitleTypeStyles = cx(gClasses.SectionSubTitle, fontFamilyStyle);
      // titleColor = { color: adminTitleColor };
      break;
    case FORM_TITLE_TYPES.TYPE_2:
      formTitleTypeStyles = gClasses.FTwo16;
      // titleColor = { color: primaryColor };
      break;
    case FORM_TITLE_TYPES.TYPE_3:
      formTitleTypeStyles = gClasses.FTwo13BlackV2;
      break;
    case FORM_TITLE_TYPES.TYPE_4:
      formTitleTypeStyles = cx(gClasses.ModalHeader);
      // titleColor = { color: primaryColor };
      break;
    case FORM_TITLE_TYPES.TYPE_5:
      formTitleTypeStyles = cx(gClasses.FTwo16);
      // titleColor = { color: primaryColor };
      break;
    case FORM_TITLE_TYPES.TYPE_6:
      formTitleTypeStyles = cx(gClasses.FTwo12GrayV3, gClasses.FontWeight600);
      // titleColor = { color: primaryColor };
      break;
    case FORM_TITLE_TYPES.TYPE_7:
      formTitleTypeStyles = gClasses.SectionSubTitle;
      break;
    default:
      formTitleTypeStyles = gClasses.FTwo14;
      // titleColor = { color: primaryColor };
      break;
  }

  // const bottomMargin = !noBottomMargin && gClasses.MB3;

  // const topPadding = !noTopPadding && gClasses.PT5;

  return (
    <div
      className={cx(
        formTitleTypeStyles,
        categoryFontStyle,
        styles.FormTitleMinWidth,
        gClasses.CenterV,
        type !== FORM_TITLE_TYPES.TYPE_6 && gClasses.PB10,
        BS.JC_BETWEEN,
        className,
      )}
      // style={titleColor}
    >
      {isDataLoading ? (
        <div className={cx(gClasses.Height16, gClasses.Width100)}>
          <Skeleton />
        </div>
      ) : (
        <>
          {children}
          {chevron}
        </>
      )}
    </div>
  );
}
export default FormTitle;
FormTitle.defaultProps = {
  isDataLoading: false,
  children: null,
  isAccordion: false,
  isAccordionOpen: false,
  onIconClick: null,
  className: EMPTY_STRING,
  noBottomMargin: false,
};
FormTitle.propTypes = {
  isDataLoading: PropTypes.bool,
  children: PropTypes.node,
  isAccordion: PropTypes.bool,
  isAccordionOpen: PropTypes.bool,
  onIconClick: PropTypes.func,
  className: PropTypes.string,
  noBottomMargin: PropTypes.bool,
};
