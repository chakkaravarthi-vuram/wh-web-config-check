import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function MyTaskIcon(props) {
  const {
    className, onClick,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="20"
      viewBox="0 0 16 20"
      className={className}
      onClick={onClick || null}
    >
      <path
        fill="#FFF"
        fillRule="nonzero"
        d="M15 1h-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1H1a1 1 0 0 0-1 1v17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 17H2V3h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1h1v15zM5 6h6a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2zm0 4h6a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2zm0 4h6a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2z"
      />
    </svg>
  );
}
export default MyTaskIcon;

MyTaskIcon.defaultProps = {
  className: EMPTY_STRING,
  onClick: null,
};

MyTaskIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};
