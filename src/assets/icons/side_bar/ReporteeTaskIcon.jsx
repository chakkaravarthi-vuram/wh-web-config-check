import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function ReporteeTaskIcon(props) {
  const {
    className, onClick,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="20"
      viewBox="0 0 16 20"
      className={className}
      onClick={onClick || null}
    >
      <path
        fill="#FFF"
        fillRule="nonzero"
        d="M15 1h-2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1H1a1 1 0 0 0-1 1v17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 17H2V3h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1h1v15zM8 7l3 4H5l3-4zm0 3a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1z"
      />
    </svg>
  );
}
export default ReporteeTaskIcon;

ReporteeTaskIcon.defaultProps = {
  className: EMPTY_STRING,
  onClick: null,
};

ReporteeTaskIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};
