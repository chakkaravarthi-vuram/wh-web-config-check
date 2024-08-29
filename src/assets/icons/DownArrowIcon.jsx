import React from 'react';
import PropTypes from 'prop-types';

function DownArrowIcon(props) {
  const { width, height } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width || '16'} height={height || '16'} fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
    </svg>
  );
}
export default DownArrowIcon;

DownArrowIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
DownArrowIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
