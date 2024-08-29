import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function LookupDropdownIcon(props) {
  const { className, style, title, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="16"
      viewBox="0 0 26 16"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <path
        fill="#5B6375"
        fillRule="nonzero"
        d="M24.785 16H.67C.3 16 0 15.642 0 15.2V.8C0 .358.3 0 .67 0h24.115c.37 0 .67.358.67.8v14.4c0 .442-.3.8-.67.8zM24 1.455H1.455v13.09H24V1.455zM17.5 11L22 5h-9l4.5 6zM4 12h2V4H4v8zm0 0h5v-2H4v2z"
      />
    </svg>
  );
}
export default LookupDropdownIcon;
LookupDropdownIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};
LookupDropdownIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
