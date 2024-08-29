import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function DashboardSendBackIcon(props) {
  const { className, onClick, id } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={className}
      onClick={onClick}
      id={id}
    >
      <g>
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M6.364 3.636a.75.75 0 010 1.061L4.31 6.75h9.439a4.5 4.5 0 110 9H10a.75.75 0 010-1.5h3.75a3 3 0 100-6H4.31l2.054 2.053a.75.75 0 01-1.061 1.06L1.97 8.03a.75.75 0 010-1.06l3.333-3.334a.75.75 0 011.06 0z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}
export default DashboardSendBackIcon;
DashboardSendBackIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
  id: EMPTY_STRING,
};
DashboardSendBackIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
  id: PropTypes.string,
};
