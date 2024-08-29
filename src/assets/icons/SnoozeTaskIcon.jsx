import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Tooltip from 'components/tooltip/Tooltip';
import ThemeContext from '../../hoc/ThemeContext';

function SnoozeTaskIcon(props) {
  const { className, onClick, style, title, isButtonColor, role, ariaLabel, placement } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 22 22"
        className={className}
        onClick={onClick}
        role={role}
        aria-label={ariaLabel}
        style={{ ...style, fill: buttonColor }}
      >
        <path
          fill="#959BA3"
          d="M6.601 1.964L5.237.334.334 4.436l1.375 1.63 4.892-4.103zm15.05 2.484L16.748.333l-1.375 1.631 4.903 4.114 1.375-1.63zM10.993 2.614C5.695 2.614 1.4 6.91 1.4 12.207a9.587 9.587 0 009.593 9.593c5.297 0 9.593-4.295 9.593-9.593 0-5.297-4.296-9.593-9.593-9.593zm0 17.054a7.456 7.456 0 01-7.461-7.46 7.456 7.456 0 017.46-7.462 7.456 7.456 0 017.462 7.461 7.456 7.456 0 01-7.461 7.461zm-3.198-9.593h3.87l-3.87 4.477v1.919h6.395v-2.132h-3.869l3.87-4.477V7.944H7.794v2.131z"
        />
      </svg>
     <Tooltip id="snooze" content={title} placement={placement} isCustomToolTip />
    </>
  );
}
export default SnoozeTaskIcon;
SnoozeTaskIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
SnoozeTaskIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
