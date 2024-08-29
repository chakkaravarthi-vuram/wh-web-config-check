import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../../hoc/ThemeContext';

function SettingsIcon(props) {
  const {
    className, onClick, style, title, isButtonColor, role,
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
      role={role}
    >
      <title>{title}</title>
      <g fillRule="evenodd">
        <path
          d="M339.017 321c3.3 0 5.983 2.682 5.983 5.983v16.034c0 3.3-2.682 5.983-5.983 5.983h-16.034c-3.3 0-5.983-2.682-5.983-5.983v-16.034c0-3.3 2.682-5.983 5.983-5.983zm-8.889 6.048c-.23.026-.403.224-.397.456.027.742-.41 1.422-1.096 1.706-.692.257-1.47.08-1.982-.45-.157-.172-.42-.193-.604-.05-.478.376-.912.806-1.293 1.28-.146.185-.126.45.046.61.561.503.743 1.305.453 2-.311.677-.997 1.1-1.741 1.076-.235-.015-.44.16-.461.393-.07.604-.07 1.214 0 1.818.02.234.293.394.522.394.721-.006 1.374.43 1.645 1.098.278.688.1 1.475-.446 1.977-.173.158-.195.422-.05.605.372.474.797.903 1.266 1.28.184.148.45.128.61-.046.513-.54 1.301-.72 1.998-.453.691.292 1.124.987 1.08 1.736-.012.236.16.44.394.47.306.034.614.052.922.052.294 0 .587-.016.879-.05.232-.025.405-.226.397-.459-.028-.741.408-1.421 1.093-1.706.691-.255 1.468-.076 1.977.456.157.172.42.194.604.05.478-.377.911-.806 1.293-1.28.148-.184.128-.45-.047-.61-.553-.487-.743-1.267-.477-1.955.265-.687.931-1.136 1.668-1.125h.1c.235.013.44-.16.469-.394.067-.602.067-1.21 0-1.813-.026-.225-.288-.393-.516-.393-.737.016-1.407-.43-1.677-1.116-.27-.686-.084-1.468.467-1.958.174-.158.196-.423.05-.607-.374-.473-.8-.902-1.27-1.28-.184-.147-.451-.125-.61.05-.512.54-1.3.717-1.994.45-.69-.296-1.12-.99-1.079-1.738.013-.236-.16-.44-.394-.47-.597-.068-1.2-.07-1.799-.004zm.884 5.301c1.473 0 2.668 1.195 2.668 2.668-.002 1.472-1.195 2.665-2.668 2.667-1.474 0-2.669-1.194-2.669-2.667 0-1.473 1.195-2.668 2.669-2.668z"
          transform="translate(-317 -321)"
        />
      </g>
    </svg>
  );
}
export default SettingsIcon;
SettingsIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
SettingsIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
