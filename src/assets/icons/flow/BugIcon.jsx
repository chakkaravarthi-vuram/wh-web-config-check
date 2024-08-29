import React from 'react';
import PropTypes from 'prop-types';
import { ARIA_ROLES } from 'utils/UIConstants';
import { isEmpty } from '../../../utils/jsUtility';

function BugIcon(props) {
  const { className, onClick, style, title, id, isSelected, fillColor, ariaLabel, ariaHidden } = props;
  const iconFill = isEmpty(fillColor) ? (isSelected ? '#217CF5' : '#959BA3') : fillColor;
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={({ ...style })}
      id={id}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      role={ARIA_ROLES.IMG}
    >
      <title>{title}</title>
      <path
        d="M11.762 3.433a.697.697 0 0 1 1.152.325.707.707 0 0 1-.162.67L11.2 5.988v1.814h2.1a.7.7 0 0 1 .606.352.708.708 0 0 1 0 .704.7.7 0 0 1-.606.352h-2.1a4.21 4.21 0 0 1-.301 1.55c.033.02.064.04.093.064l1.981 1.992a.707.707 0 0 1-.323 1.158.697.697 0 0 1-.666-.163l-1.82-1.83A4.194 4.194 0 0 1 7.7 13.372V6.394H6.3v6.978a4.194 4.194 0 0 1-2.466-1.394l-1.82 1.83a.697.697 0 0 1-1.152-.324.707.707 0 0 1 .162-.67l1.981-1.992a.655.655 0 0 1 .094-.064 4.217 4.217 0 0 1-.299-1.55H.7a.7.7 0 0 1-.606-.353.708.708 0 0 1 0-.704A.7.7 0 0 1 .7 7.8h2.1V5.987L1.258 4.428A.707.707 0 0 1 1.58 3.27a.697.697 0 0 1 .666.163L3.507 4.7a.875.875 0 0 1 .868-.763h5.25c.448 0 .818.336.869.77zM7 0c.743 0 1.455.297 1.98.825.525.528.82 1.244.82 1.99H4.2c0-.746.295-1.462.82-1.99A2.792 2.792 0 0 1 7 0z"
        fill={iconFill}
        fillRule="evenodd"
        stroke="none"
      />
    </svg>
  );
}

export default BugIcon;

BugIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
  fillColor: '',
};

BugIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
  fillColor: PropTypes.string,
};
