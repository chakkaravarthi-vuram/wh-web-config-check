import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import styles from './PlusIcon.module.scss';

function PlusIconBlue(props) {
  const { className, onClick, style, outerClass } = props;
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={outerClass}
    >
      <path
        d="M8.333 0a1 1 0 0 1 1 1v5.666H15a1 1 0 0 1 1 1v.667a1 1 0 0 1-1 1H9.333V15a1 1 0 0 1-1 1h-.666a1 1 0 0 1-1-1l-.001-5.667H1a1 1 0 0 1-1-1v-.666a1 1 0 0 1 1-1l5.666-.001V1a1 1 0 0 1 1-1h.667z"
        fill="#217CF5"
        fillRule="evenodd"
        className={cx(className, styles.IconSize)}
        style={style}
        onClick={onClick}
      />
    </svg>
  );
}
export default PlusIconBlue;

PlusIconBlue.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
  outerClass: null,
};
PlusIconBlue.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  outerClass: PropTypes.string,
  id: PropTypes.string,
};
