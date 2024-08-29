import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function SmallTextFieldIcon(props) {
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
        d="M24.785 16c.37 0 .67-.358.67-.8V.8c0-.442-.3-.8-.67-.8H.67C.3 0 0 .358 0 .8v14.4c0 .442.3.8.67.8zM24 14.545H1.455V1.455H24v13.09zm-13.182-1.454c.452 0 .818-.353.818-.788 0-.435-.366-.788-.818-.788H9.182V5.212h1.636c.452 0 .818-.353.818-.788 0-.435-.366-.788-.818-.788H5.91c-.452 0-.818.353-.818.788 0 .435.366.788.818.788h1.636v6.303H5.91c-.452 0-.818.353-.818.788 0 .435.366.788.818.788z"
      />
    </svg>
  );
}
export default SmallTextFieldIcon;
SmallTextFieldIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};

SmallTextFieldIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
