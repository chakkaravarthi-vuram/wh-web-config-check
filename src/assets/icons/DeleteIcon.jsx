import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import gClasses from '../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function DeleteIcon(props) {
  const { className, onClick, style, title, id, colour, tabIndex, role, onKeyDown, ariaLabel, ariaHidden } = props;
  const colourClass = colour || gClasses.RedV18;
  console.log('colourClass', colour, colourClass);
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      className={cx(className, colourClass, gClasses.OutlineNoneOnFocus)}
      onClick={onClick}
      style={style}
      id={id}
      tabIndex={tabIndex}
      role={role}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        fill="#FE6C6A"
        d="M5.995 3.009h2.001V2H5.995v1.009zM9.998 2v-.417A1.66 1.66 0 0 0 9.556.442C9.262.147 8.856 0 8.414 0H5.596c-.443 0-.849.166-1.143.442-.294.294-.442.7-.442 1.141V2L0 2.025v1.966h.983l.01 9.708C.994 14.969 2.025 16 3.297 16h7.4a2.303 2.303 0 0 0 2.303-2.301l.002-9.697L14 4l-.006-2H9.998z"
        opacity=".8"
        className={gClasses.OutlineNoneOnFocus}
      />
    </svg>
  );
}
export default DeleteIcon;

DeleteIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
DeleteIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
