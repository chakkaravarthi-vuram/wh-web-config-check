import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function LargeTextFieldIcon(props) {
  const { className, style, title, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="20"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <path
        fill="#5B6375"
        d="M24.785 20c.37 0 .67-.358.67-.8V.8c0-.442-.3-.8-.67-.8H.67C.3 0 0 .358 0 .8v18.4c0 .442.3.8.67.8zM24 18.545H1.455V1.455H24v17.09zm-13.66-5.909a.75.75 0 100-1.5h-1.5v-6h1.5a.75.75 0 000-1.5h-4.5a.75.75 0 000 1.5h1.5v6h-1.5a.75.75 0 000 1.5z"
      />
    </svg>
  );
}
export default LargeTextFieldIcon;
LargeTextFieldIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};
LargeTextFieldIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
