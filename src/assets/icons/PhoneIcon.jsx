import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function PhoneIcon(props) {
  const { className, onClick, style, title, isButtonColor } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={className}
      onClick={onClick}
      style={({ fill: buttonColor }, { ...style })}
    >
      <title>{title}</title>
      <path
        fill="#5B6375"
        fillRule="evenodd"
        d="M2.413.492a1.619 1.619 0 0 1 2.353.03l.102.12 1.87 2.404a1.895 1.895 0 0 1-.047 2.345l-.109.12-1.06 1.06c-.07.07-.102.229-.075.339l.023.059.07.129.03.056c.076.132.166.276.268.427.325.481.718.958 1.17 1.41.453.453.93.847 1.413 1.172.1.068.199.131.292.188l.252.144.069.036c.081.048.245.036.345-.017l.05-.036 1.06-1.06a1.897 1.897 0 0 1 2.333-.249l.132.093 2.404 1.87c.751.585.852 1.627.256 2.34l-.106.115-1.592 1.592c-1.898 1.897-7.033.325-10.226-2.869C.56 9.181-1.012 4.19.709 2.204l.112-.12L2.413.492zm1.156 1.23L2.014 3.278c-1.087 1.087.393 5.362 2.87 7.839 2.416 2.417 6.549 3.885 7.756 2.942l.083-.073 1.555-1.556-2.36-1.836c-.044-.034-.135-.036-.196-.009l-.039.026-1.06 1.06c-.584.585-1.547.743-2.292.395l-.194-.1a6.072 6.072 0 0 1-.37-.216l-.29-.188a11.288 11.288 0 0 1-1.662-1.377c-.53-.53-.99-1.09-1.376-1.66l-.098-.148-.17-.273a5.504 5.504 0 0 1-.134-.234l-.103-.2a2.085 2.085 0 0 1 .284-2.171l.11-.122 1.061-1.06c.042-.041.055-.13.037-.194l-.02-.04-1.837-2.361z"
      />
    </svg>
  );
}
export default PhoneIcon;

PhoneIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
PhoneIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
