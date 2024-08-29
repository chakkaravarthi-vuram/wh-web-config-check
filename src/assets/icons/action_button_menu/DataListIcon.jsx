import React from 'react';
import PropTypes from 'prop-types';
import { ARIA_ROLES } from 'utils/UIConstants';

function DataListIcon(props) {
  const { className, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="16"
      viewBox="0 0 13 16"
      className={className}
      role={ARIA_ROLES.IMG}
    >
      <title>{title}</title>
      <path
        fill="#FFF"
        d="M3.111 11.2h6.222v1.6H3.111v-1.6zm0-3.2h6.222v1.6H3.111V8zm4.667-8H1.556C.7 0 0 .72 0 1.6v12.8c0 .88.692 1.6 1.548 1.6h9.34c.856 0 1.556-.72 1.556-1.6V4.8L7.778 0zm3.11 14.4H1.557V1.6H7v4h3.889v8.8z"
      />
    </svg>
  );
}

export default DataListIcon;

DataListIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
};
DataListIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
};
