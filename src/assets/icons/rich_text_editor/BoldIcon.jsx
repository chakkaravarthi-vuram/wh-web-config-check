import React from 'react';
import PropTypes from 'prop-types';

function BoldIcon(props) {
  const { className, onClick, style, title } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={className}
      onClick={onClick}
      style={style}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H12V12H0z" />
        <path
          fill="#333"
          fillRule="nonzero"
          d="M5.25 6.75V9h1.125C6.996 9 7.5 8.496 7.5 7.875S6.996 6.75 6.375 6.75H5.25zm3.315-1.443c.725.619 1.185 1.54 1.185 2.568 0 1.864-1.511 3.375-3.375 3.375H3V.75h3c1.657 0 3 1.343 3 3 0 .57-.159 1.103-.435 1.557zM5.25 3v1.5H6c.414 0 .75-.336.75-.75S6.414 3 6 3h-.75z"
        />
      </g>
    </svg>

    // <svg
    //   id="Capa_1"
    //   enableBackground="new 0 0 467.765 467.765"
    //   height="512"
    //   viewBox="0 0 467.765 467.765"
    //   width="512"
    //   xmlns="http://www.w3.org/2000/svg"
    // className={className}
    // onClick={onClick}
    // style={style}
    // >
    //   <title>{title}</title>
    //   <path d="m360.345 233.882c29.835-24.139 48.949-61.04 48.949-102.324 0-72.545-59.013-131.558-131.559-131.558h-219.264v58.471h29.235v350.824h-29.235v58.471h219.265c72.546 0 131.559-59.013 131.559-131.559-.001-41.285-19.115-78.186-48.95-102.325zm-82.61 175.412h-131.559v-146.176h131.559c40.299 0 73.088 32.79 73.088 73.088s-32.789 73.088-73.088 73.088zm0-204.647h-131.559v-146.176h131.559c40.299 0 73.088 32.79 73.088 73.088s-32.789 73.088-73.088 73.088z" />
    // </svg>
  );
}
export default BoldIcon;

BoldIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
};

BoldIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
};
