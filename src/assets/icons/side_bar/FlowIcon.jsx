import React from 'react';
import PropTypes from 'prop-types';
import { ARIA_ROLES } from 'utils/UIConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function FlowIcon(props) {
  const {
    className,
    title,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="16"
      viewBox="0 0 14 16"
      className={className}
      role={ARIA_ROLES.IMG}
    >
      <title>{title}</title>
      <path
        fill="#FFF"
        d="M3.111 11.025h5.445V12.6H3.11v-1.575zm0-3.15h7.778V9.45H3.11V7.875zm0-3.15h7.778V6.3H3.11V4.725zm9.333-3.15h-3.25C8.866.662 8.01 0 7 0S5.133.662 4.807 1.575H1.556c-.11 0-.21.008-.312.031a1.579 1.579 0 00-1.12.937A1.533 1.533 0 000 3.15v11.025c0 .213.047.425.124.614.078.19.195.355.335.504.21.213.482.37.785.433.102.016.203.024.312.024h10.888A1.57 1.57 0 0014 14.175V3.15c0-.866-.7-1.575-1.556-1.575zM7 1.378A.591.591 0 017 2.56a.591.591 0 010-1.18zm5.444 12.797H1.556V3.15h10.888v11.025z"
      />
    </svg>
  );
}
export default FlowIcon;

FlowIcon.defaultProps = {
  className: EMPTY_STRING,
  onClick: null,
};

FlowIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};
