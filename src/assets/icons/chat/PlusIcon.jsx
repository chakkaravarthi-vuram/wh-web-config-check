import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import styles from './PlusIcon.module.scss';

function PlusIcon(props) {
  const { className, onClick, style, title, ariaLabel, role, ariaHidden } = props;
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    aria-label={ariaLabel}
    role={role}
    width="12"
    height="12"
    fill="none"
    viewBox="0 0 12 12"
    className={cx(className, styles.IconSize)}
    style={style}
    onClick={onClick}
    >
    <title>{title}</title>
    <path
      fill="#fff"
      d="M12 6.75H6.75V12h-1.5V6.75H0v-1.5h5.25V0h1.5v5.25H12v1.5z"
    />
    </svg>
  );
}
export default PlusIcon;

PlusIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
};
PlusIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
};
