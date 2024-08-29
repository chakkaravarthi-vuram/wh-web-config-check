import React from 'react';
import PropTypes from 'prop-types';

function ViewPreviewIcon(props) {
    const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="13"
      viewBox="0 0 18 13"
      className={className}
    >
      <path
        d="M9 0c6.334 0 8.853 6.024 8.958 6.28a.589.589 0 010 .44C17.853 6.975 15.334 13 9 13S.147 6.976.042 6.72a.589.589 0 010-.44C.147 6.025 2.666 0 9 0zm0 2.364c-2.32 0-4.2 1.852-4.2 4.136s1.88 4.136 4.2 4.136c2.318-.003 4.197-1.853 4.2-4.136 0-2.284-1.88-4.136-4.2-4.136zm0 2.363c.994 0 1.8.794 1.8 1.773 0 .98-.806 1.773-1.8 1.773S7.2 7.479 7.2 6.5c0-.98.806-1.773 1.8-1.773z"
      />
    </svg>
  );
}

export default ViewPreviewIcon;

ViewPreviewIcon.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    isButtonColor: false,
  };
ViewPreviewIcon.propTypes = {
className: PropTypes.string,
onClick: PropTypes.func,
style: PropTypes.objectOf(PropTypes.any),
title: PropTypes.string,
isButtonColor: PropTypes.bool,
};
