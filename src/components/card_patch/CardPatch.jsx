import React, { useContext } from 'react';
import cx from 'classnames/bind';
import Proptypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

import gClasses from '../../scss/Typography.module.scss';
import styles from './CardPatch.module.scss';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function CardPatch(props) {
  const { buttonColor } = useContext(ThemeContext);
  const {
    isSelected, className, icon, arrowIconClasses,
  } = props;
  return isSelected ? (
    <div className={cx(styles.WhitePatch, gClasses.CenterV, className)}>
      {icon}
      <div
        className={cx(gClasses.DropdownArrow, gClasses.ML5, gClasses.Rotate270, arrowIconClasses)}
        style={{
          borderTopColor: buttonColor,
        }}
      />
    </div>
  ) : null;
}
export default CardPatch;

CardPatch.defaultProps = { isSelected: false, className: EMPTY_STRING };
CardPatch.propTypes = {
  isSelected: Proptypes.bool,
  className: Proptypes.string,
};
