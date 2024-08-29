import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function UserIconAddMembers(props) {
  const { className, onClick, style, title, isButtonColor, ariaLabel, role } = props;
  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={className}
      aria-label={ariaLabel}
      role={role}
      onClick={onClick}
      style={({ ...style }, { fill: buttonColor })}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <path
          fill="#B8BFC7"
          d="M10.124 7c1.356.68 2.325 2.01 2.551 3.597l.323 2.269c.033.583-.42 1.134-1.033 1.134H.982a.98.98 0 01-.969-1.134l.323-2.269A4.676 4.676 0 012.888 7a5.88 5.88 0 003.618 1.231c1.356 0 2.584-.453 3.618-1.231zM6.5 0c2.003 0 3.611 1.559 3.611 3.5S8.503 7 6.5 7 2.889 5.441 2.889 3.5 4.497 0 6.5 0z"
        />
        <g transform="translate(8 8)">
          <circle cx="6" cy="6" r="5.5" fill="#B8BFC7" stroke="#FFF" />
          <path
            fill="#FFF"
            d="M6 3a.5.5 0 01.5.5v2h2a.5.5 0 010 1h-2v2a.5.5 0 01-1 0v-2h-2a.5.5 0 010-1h2v-2A.5.5 0 016 3z"
          />
        </g>
      </g>
    </svg>
  );
}
export default UserIconAddMembers;
UserIconAddMembers.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isButtonColor: false,
};
UserIconAddMembers.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
