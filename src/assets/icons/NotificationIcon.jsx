import React from 'react';
import PropTypes from 'prop-types';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';

function NotificationIcon(props) {
  const { className, onClick, title, tabIndex, role } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="17"
      viewBox="0 0 14 17"
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      role={role}
      onKeyDown={(event) => keydownOrKeypessEnterHandle(event) && onClick()}
    >
      <title>{title}</title>
      <path
       fill="#959BA3"
       d="M7.672 0l.1.1v1.496l.505.003a5.522 5.522 0 014.23 4.879l.016.236.006.238v1.746a6.42 6.42 0 00.52 2.507l.135.293.748 1.53a.765.765 0 01-.576 1.102l-.112.007H9.629l-.021.09a2.712 2.712 0 01-2.257 1.95l-.18.018L7 16.2a2.711 2.711 0 01-2.61-1.974l-.022-.089H.771a.765.765 0 01-.511-.19l-.078-.08-.067-.092a.765.765 0 01-.077-.642l.043-.104.732-1.53A6.42 6.42 0 001.46 9.02l.01-.323V6.953A5.455 5.455 0 015.53 1.62l.228-.056h.482V.1l.1-.1h1.331zm.499 13.92H5.843l-.092.14.059.122a1.38 1.38 0 001.196.72 1.381 1.381 0 001.257-.843l-.092-.138zM6.016 3.092a3.942 3.942 0 00-2.997 3.66l-.003.201V8.7a7.967 7.967 0 01-.658 3.143l-.151.327-.21.42h10.036l-.21-.42a7.967 7.967 0 01-.799-3.11l-.01-.36V6.95a3.942 3.942 0 00-2.82-3.807l-.19-.051-1.988-.002z"
      />
    </svg>
  );
}
export default NotificationIcon;
NotificationIcon.defaultProps = {
  className: null,
  onClick: () => {},
  title: null,
};
NotificationIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};
