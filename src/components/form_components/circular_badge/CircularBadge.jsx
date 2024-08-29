import React, { useContext } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import ThemeContext from '../../../hoc/ThemeContext';

import gClasses from '../../../scss/Typography.module.scss';
import styles from './CircularBadge.module.scss';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function CircularBadge(props) {
  const { buttonColor } = useContext(ThemeContext);
  const { isSelected, className, children } = props;
  let badgeStyle = null;
  let badgeClass = null;
  if (isSelected) {
    badgeStyle = { backgroundColor: buttonColor };
    badgeClass = cx(className, gClasses.FTwoWhite, gClasses.CenterVH, styles.Badge);
  } else {
    badgeStyle = { color: buttonColor, fill: buttonColor };
    badgeClass = cx(
      className,
      gClasses.FTwo,
      styles.UnselectedBadge,
      gClasses.CenterVH,
      styles.Badge,
    );
  }

  return (
    <div className={badgeClass} style={badgeStyle}>
      {children}
    </div>
  );
}
export default CircularBadge;

CircularBadge.propTypes = {
  isSelected: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  className: PropTypes.string,
};
CircularBadge.defaultProps = {
  isSelected: false,
  className: EMPTY_STRING,
};
