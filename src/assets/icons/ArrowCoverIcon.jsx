import React from 'react';

function ArrowCoverIcon(props) {
    const { className, title, onClick } = props;
    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="7"
          height="7"
          fill="none"
          viewBox="0 0 7 5"
          className={className}
          onClick={onClick || null}
        >
            <title>{title}</title>
          <path fill="#959BA3" d="M.6.5l3.2 4L7 .5H.6z" />
        </svg>
      );
}

export default ArrowCoverIcon;
