import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function UserIconV2(props) {
  const { className, onClick, style, title, isButtonColor } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      className={className}
      onClick={onClick}
      style={({ fill: buttonColor }, { ...style })}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <rect
          width="36"
          height="36"
          fill="#DEE0E4"
          fillRule="nonzero"
          rx="12"
        />
        <path
          fill="#FFF"
          d="M18 8.11a4.496 4.496 0 014.51 4.509 4.496 4.496 0 01-4.51 4.51 4.496 4.496 0 01-4.51-4.51A4.496 4.496 0 0118 8.109zm6.442 18.303H11.558c-.72 0-1.25-.645-1.137-1.327l.379-2.652c.227-1.857 1.402-3.41 2.994-4.207a6.913 6.913 0 004.244 1.44c1.591 0 3.031-.53 4.244-1.44 1.592.796 2.729 2.35 2.994 4.207l.379 2.652c.038.682-.493 1.327-1.213 1.327z"
        />
      </g>
    </svg>
  );
}
export default UserIconV2;
UserIconV2.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
UserIconV2.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
