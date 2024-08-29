import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import gClasses from '../../scss/Typography.module.scss';

function DownloadSuccessIcon(props) {
  const { className, onClick, id } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={cx(className, gClasses.CursorPointer, gClasses.ClickableElement)}
      onClick={onClick || null}
      id={id}
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0C3.58 0 0 3.58 0 8ZM11.29 5.29C11.47 5.11 11.72 5 12 5C12.55 5 13 5.45 13 6C13 6.28 12.89 6.53 12.71 6.71L7.71 11.71C7.53 11.89 7.28 12 7 12C6.72 12 6.47 11.89 6.29 11.71L3.29 8.71C3.11 8.53 3 8.28 3 8C3 7.45 3.45 7 4 7C4.28 7 4.53 7.11 4.71 7.29L7 9.59L11.29 5.29Z"
            fill="#039855"
        />

    </svg>
  );
}

export default DownloadSuccessIcon;

DownloadSuccessIcon.defaultProps = {
  className: null,
  onClick: null,
  id: EMPTY_STRING,
  isButtonColor: false,
};
DownloadSuccessIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  id: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
