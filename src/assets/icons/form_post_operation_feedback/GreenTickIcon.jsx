import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import gClasses from '../../../scss/Typography.module.scss';

function GreenTickIcon(props) {
  const { className, onClick, id } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="13"
      viewBox="0 0 16 13"
      className={cx(className, gClasses.CursorPointer, gClasses.ClickableElement)}
      onClick={onClick || null}
      id={id}
    >
      <path
        fill="#6CCF9C"
        fillRule="nonzero"
        d="M16 2.185L13.819 0 5.531 8.302l-3.35-3.356L0 7.131l5.531 5.542z"
      />
    </svg>
  );
}

export default GreenTickIcon;

GreenTickIcon.defaultProps = {
  className: null,
  onClick: null,
  id: EMPTY_STRING,
  isButtonColor: false,
};
GreenTickIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  id: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
