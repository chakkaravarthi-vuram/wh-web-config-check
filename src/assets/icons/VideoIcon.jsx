import React from 'react';
import PropTypes from 'prop-types';

function VideoIcon(props) {
  const { className } = props;
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fill="#FFF"
        d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm0 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM9 7l8 4.414L9 17V7z"
      />
    </svg>
  );
}

export default VideoIcon;

VideoIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

VideoIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
