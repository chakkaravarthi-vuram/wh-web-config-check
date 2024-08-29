import React from 'react';
import PropTypes from 'prop-types';

function EyeIcon(props) {
  const { className, onClick, onMouseDown, onMouseUp } = props;
  return (
    <svg
      width="20"
      height="12"
      viewBox="0 0 20 12"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <path
d="M10.004 0c2.25 0 4.694.964 7.009 2.803a18.437 18.437 0 0 1 2.85 2.78.668.668 0 0 1 0 .811C19.692 6.635 15.427 12 10.004 12c-2.25 0-4.693-.964-7.008-2.803a18.415 18.415 0 0 1-2.85-2.78.668.668 0 0 1 0-.833C.315 5.365 4.581 0 10.003 0zm0 1.533c-2.414 0-4.372 2-4.372 4.467 0 2.467 1.958 4.467 4.372 4.467 2.41-.012 4.36-2.005 4.372-4.467 0-2.467-1.957-4.467-4.372-4.467zm0 2.036c1.314 0 2.38 1.089 2.38 2.431s-1.066 2.43-2.38 2.43C8.69 8.43 7.625 7.343 7.625 6s1.065-2.43 2.38-2.43z"
        fill="#B8BFC7"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default EyeIcon;

EyeIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

EyeIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
