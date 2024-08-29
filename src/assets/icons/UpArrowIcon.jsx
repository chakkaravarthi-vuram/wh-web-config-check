import React from 'react';
import PropTypes from 'prop-types';

function UpArrowIcon(props) {
  const { width, height } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width || '16'} height={height || '16'} fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
    </svg>
  );
}
export default UpArrowIcon;

UpArrowIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
UpArrowIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
