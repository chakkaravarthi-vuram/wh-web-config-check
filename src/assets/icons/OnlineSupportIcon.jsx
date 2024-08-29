import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function OnlineSupportIcon(props) {
  const {
    className, onClick, style, isButtonColor,
  } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      className={className}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
    >
      <g fill="none" fillRule="evenodd" opacity=".85">
        <g fill="#FFF" fillRule="nonzero">
          <path
            d="M96.285 732l-.006.02c.86.12 1.546.788 1.692 1.64l.029-.015v10.265c0 .658-.506 1.207-1.145 1.207H92.02l.863 2.335c.044.125.03.266-.045.376-.074.11-.193.172-.312.172h-6.069c-.119 0-.238-.063-.312-.172-.074-.11-.09-.251-.045-.376l.878-2.335h-4.834c-.624 0-1.145-.533-1.145-1.207v-10.703c0-.659.506-1.207 1.145-1.207h14.14zm-5.218 1.488h-8.624c-.045 0-.09.063-.09.157v9.325h14.279v-7.072l-.097.03V733.6H91.04l.027-.112zM90.556 739c.351.17.718.324 1.084.477.062.017.123.051.169.068.427.188.81.444.962.955.03.102.168.938.229 1.313 0 .068-.03.136-.076.17-.03.017-.046.017-.077.017h-6.69c-.03 0-.061 0-.077-.017-.06-.034-.091-.102-.076-.17.061-.393.198-1.21.229-1.313.168-.511.55-.767.962-.955.061-.034.107-.05.168-.068.352-.17.718-.324 1.085-.477.168.46.58.784 1.054.784.473 0 .886-.324 1.054-.784zm-.938-4c.833 0 1.487.8 1.368 1.714l-.193 1.127c-.12.67-.655 1.159-1.28 1.159-.624 0-1.16-.473-1.309-1.16l-.193-1.126c-.104-.898.536-1.714 1.369-1.714z"
            transform="translate(-81.000000, -732.000000)"
          />
        </g>
      </g>
    </svg>
  );
}
export default OnlineSupportIcon;

OnlineSupportIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
OnlineSupportIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
