import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import styles from './PlusIcon.module.scss';

function PlusIconRoundedCorners(props) {
  const { className, onClick, style, title, ariaLabel, role, ariaHidden } = props;
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    aria-label={ariaLabel}
    role={role}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    className={cx(className, styles.IconSize)}
    style={style}
    onClick={onClick}
    >
    <title>{title}</title>
    <path
    d="M6 0a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H7v4a1 1 0 1 1-2 0V6.999L1 7a1 1 0 1 1 0-2l4-.001V1a1 1 0 0 1 1-1z"
    fill="#9091A1"
    fillRule="evenodd"
    />
    </svg>
  );
}
export default PlusIconRoundedCorners;

PlusIconRoundedCorners.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
};
PlusIconRoundedCorners.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
};
