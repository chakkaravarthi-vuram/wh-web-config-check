import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import ThemeContext from 'hoc/ThemeContext';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import styles from './DownArrowIcon.module.scss';

function DownArrowIcon(props) {
  const { className, onClick, style, title, id, isButtonColor, role, ariaHidden, ariaLabel } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="6"
      viewBox="0 0 10 6"
      className={cx(className, styles.IconSize)}
      onClick={onClick || null}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
      role={role}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    >
      <title>{title}</title>
      <path d="m5 6 5-6H0z" fillRule="evenodd" />
    </svg>
  );
}
export default DownArrowIcon;

DownArrowIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
DownArrowIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
