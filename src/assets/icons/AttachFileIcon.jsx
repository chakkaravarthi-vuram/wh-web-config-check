import React from 'react';
import PropTypes from 'prop-types';

function AttachFileIcon(props) {
  const { className, role, title, ariaLabel } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      role={role}
      viewBox="0 0 24 24"
      className={className}
      aria-label={ariaLabel}
    >
      <title>{title}</title>
      <path
        fill="#B8BFC7"
        d="M12 9.224c.246 0 .485.078.683.22l.014.013a.643.643 0 01.093.076c.015.011.027.024.04.036l2.808 2.818a1.172 1.172 0 01-1.66 1.654l-.803-.805.015 9.592c0 .647-.525 1.172-1.172 1.172v-.001a1.172 1.172 0 01-1.172-1.172l-.014-9.599-.81.813a1.172 1.172 0 11-1.66-1.654l2.808-2.818.04-.036a1.18 1.18 0 01.012-.01l-.052.046c.041-.041.085-.08.132-.114.006-.002.011-.006.017-.01.196-.143.435-.22.681-.22zM12 0a6.582 6.582 0 016.172 4.296A6.607 6.607 0 0124 10.856c0 3.642-2.953 6.604-6.586 6.604a1.172 1.172 0 010-2.344c2.34 0 4.242-1.91 4.242-4.26 0-2.349-1.903-4.26-4.242-4.26h-.1a1.172 1.172 0 01-1.173-.92A4.268 4.268 0 0012 2.342a4.27 4.27 0 00-4.142 3.337c-.12.548-.612.933-1.172.92h-.101c-2.338-.001-4.241 1.91-4.241 4.259 0 2.348 1.903 4.26 4.242 4.26a1.172 1.172 0 010 2.343C2.953 17.46 0 14.498 0 10.857a6.607 6.607 0 015.828-6.56A6.582 6.582 0 0112 0z"
      />
    </svg>
  );
}

export default AttachFileIcon;

AttachFileIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

AttachFileIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
