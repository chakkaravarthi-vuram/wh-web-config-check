import React from 'react';
import PropTypes from 'prop-types';

function LogoSmallV2(props) {
  const { className, onClick, title } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="535"
      height="354"
      fill="none"
      viewBox="0 0 535 354"
      className={className}
      onClick={onClick}
    >
      <title>{title}</title>
      <path
        fill="#217CF5"
        fillRule="evenodd"
        d="M457.286 0l-77.677 248.336-45.745-142.583-36.646 108.006L346.671 354h65.693L535.001 0h-77.715z"
        clipRule="evenodd"
      />
      <path
        fill="#1F243D"
        fillRule="evenodd"
        d="M222.235 0l-29.574 102.732-11.998 41.693-29.924 103.911L76.428 0H0l117.405 354h62.908l33.65-101.927 13.886-42.015 32.32-97.869L297.229 0h-74.994z"
        clipRule="evenodd"
      />
    </svg>
  );
}
export default LogoSmallV2;

LogoSmallV2.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  id: null,
};
LogoSmallV2.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  id: PropTypes.string,
};
