import React from 'react';

function CloseIconNewSmall(props) {
  const { className, title, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      fill="none"
      viewBox="0 0 8 8"
      className={className}
      onClick={onClick}
    >
      <title>{title}</title>
      <path
        fill="#959BA3"
        d="M8 .806L7.194 0 4 3.194.806 0 0 .806 3.194 4 0 7.194.806 8 4 4.806 7.194 8 8 7.194 4.806 4 8 .806z"
      />
    </svg>
  );
}

CloseIconNewSmall.defaultProps = {
  onClick: () => {},
};

export default CloseIconNewSmall;
