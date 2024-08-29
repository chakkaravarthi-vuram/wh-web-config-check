import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../../hoc/ThemeContext';

function AccountSettingsIcon(props) {
  const {
    className, onClick, style, title, isButtonColor,
  } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      className={className}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
    >
      <title>{title}</title>
      <g fillRule="evenodd">
        <path
          d="M339.017 152h-16.034c-3.3 0-5.983 2.682-5.983 5.983v16.034c0 3.3 2.682 5.983 5.983 5.983h16.034c3.3 0 5.983-2.682 5.983-5.983v-16.034c0-3.3-2.682-5.983-5.983-5.983zM331 157c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12.133c0 .49-.405.867-.878.867h-10.244c-.495 0-.878-.4-.878-.867V167.4c0-.267.135-.511.338-.689 1.283-1.044 3.354-1.711 5.65-1.711 2.32 0 4.368.667 5.674 1.711.203.178.338.422.338.689v1.733zM325 173h12v2h-12v-2z"
          transform="translate(-317 -152)"
        />
      </g>
    </svg>
  );
}
export default AccountSettingsIcon;
AccountSettingsIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
AccountSettingsIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
