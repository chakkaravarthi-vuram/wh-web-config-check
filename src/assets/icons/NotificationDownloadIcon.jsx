import React from 'react';
import PropTypes from 'prop-types';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';

function NotificationDownloadIcon(props) {
  const { className, onClick, title, tabIndex, role } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      role={role}
      onKeyDown={(event) => keydownOrKeypessEnterHandle(event) && onClick()}
    >
      <title>{title}</title>
      <path
        fill="#6C727E"
        stroke="#6C727E"
        strokeWidth="0.2"
        d="M16.25 11.882c.206 0 .397.086.533.222a.8.8 0 01.217.54v3.548l-.007.103-.018.094a.76.76 0 01-.74.611H1.76a.759.759 0 01-.75-.676C1 16.278 1 16.238 1 16.187V12.64c0-.419.343-.757.756-.757a.758.758 0 01.755.757v2.842h12.983V12.64c0-.419.342-.757.755-.757zM9.01 1a.9.9 0 01.625.257.873.873 0 01.257.626v8.192l2.231-2.236a.887.887 0 011.25 0 .905.905 0 01-.015 1.252l-3.713 3.72c-.005.01-.015.015-.02.02a.874.874 0 01-.489.247c-.015 0-.03.005-.045.005l-.046.005H9l-.086-.005c-.015 0-.03-.005-.045-.005a.859.859 0 01-.489-.247l-.02-.02-3.713-3.72a.883.883 0 01-.257-.626c0-.227.086-.454.257-.626a.887.887 0 011.25 0l2.231 2.236V1.883c0-.484.398-.883.882-.883z"
      />
    </svg>
  );
}
export default NotificationDownloadIcon;
NotificationDownloadIcon.defaultProps = {
  className: null,
  onClick: () => {},
  title: null,
};
NotificationDownloadIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};
