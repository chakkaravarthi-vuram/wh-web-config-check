import React from 'react';
import PropTypes from 'prop-types';

function AdhocTaskIcon(props) {
  const { className, onClick, style, title, buttonColor, id, isSelected } =
    props;
  const iconFill = isSelected ? '#1a9cd1' : '#B8BFC7';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="14"
      viewBox="0 0 12 14"
      className={className}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
      id={id}
    >
      <title>{title}</title>
      <path
        // fill="#9BA6B1"
        fillRule={iconFill}
        d="M9 0c.553 0 1 .423 1 .947v.948h3c.553 0 1 .423 1 .947v14.21c0 .525-.447.948-1 .948H1c-.553 0-1-.423-1-.947V2.843c0-.525.447-.948 1-.948h3V.947C4 .423 4.447 0 5 0zM4 3.79H2v12.315h10V3.79h-2v.948c0 .524-.447.947-1 .947H5c-.553 0-1-.423-1-.947V3.79zm4.293 5.014c.391-.37 1.024-.37 1.415 0s.391.97 0 1.34l-2.813 2.664c-.444.422-1.187.356-1.539-.144L4.178 10.99c-.307-.435-.183-1.023.277-1.314a1.035 1.035 0 011.387.263l.501.712zM8 1.894H6v1.895h2V1.895z"
      />
    </svg>
  );
}

export default AdhocTaskIcon;

AdhocTaskIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

AdhocTaskIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
