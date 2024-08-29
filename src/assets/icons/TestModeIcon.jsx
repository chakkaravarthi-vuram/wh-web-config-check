import React from 'react';
import PropTypes from 'prop-types';

function TestModeIcon(props) {
  const { className, id, style, onClick, iconColor } = props;
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
      style={({ ...style }, { fill: iconColor })}
      id={id}
    >
      <path
        d="M8.946 0a.416.416 0 0 1 .39.32l.358 1.92c.401.118.789.28 1.156.48l1.63-1.12a.414.414 0 0 1 .5.04l1.374 1.374a.414.414 0 0 1 .046.506l-1.102 1.63c.192.357.347.732.462 1.12l1.92.364c.184.04.314.205.312.393V8.97a.416.416 0 0 1-.32.393l-1.92.363c-.12.394-.278.775-.472 1.138l1.094 1.616a.411.411 0 0 1-.04.502l-1.374 1.375a.414.414 0 0 1-.512.043l-1.62-1.102a6.027 6.027 0 0 1-1.138.462l-.36 1.92a.41.41 0 0 1-.39.32H6.994a.416.416 0 0 1-.39-.32l-.365-1.942a6.002 6.002 0 0 1-1.088-.458l-1.606 1.098a.41.41 0 0 1-.506-.047l-1.371-1.37a.415.415 0 0 1-.063-.524l1.096-1.6a6.032 6.032 0 0 1-.462-1.12L.32 9.354A.416.416 0 0 1 0 8.96V7.024a.421.421 0 0 1 .347-.394l1.92-.363c.113-.382.265-.751.453-1.102l-1.11-1.62a.415.415 0 0 1 .046-.505L3.03 1.666a.414.414 0 0 1 .506-.047l1.61 1.101c.351-.188.72-.341 1.102-.458L6.611.32a.411.411 0 0 1 .39-.32zM9 10H7v2h2v-2zm0-6H7v5h2V4z"
        fill="#FFF"
        fillRule="evenodd"
      />
    </svg>
  );
}
export default TestModeIcon;

TestModeIcon.defaultProps = {
  className: null,
  style: null,
  onClick: null,
  iconColor: null,
};
TestModeIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  iconColor: PropTypes.string,
};
