import React from 'react';
import PropTypes from 'prop-types';

function ClockRewindIcon(props) {
  const { className, width, height, fillColor } =
    props;
  return (
    <svg
      width={width || '24'}
      height={height || '24'}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="clock-rewind">
        <path
          id="Icon (Stroke)"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C15.7912 20 18.9664 17.3629 19.7914 13.8229L19.407 14.2072C19.0164 14.5977 18.3832 14.5976 17.9927 14.207C17.6023 13.8164 17.6024 13.1833 17.9929 12.7928L19.9935 10.7928C20.1811 10.6053 20.4355 10.5 20.7007 10.5C20.9659 10.5 21.2202 10.6054 21.4078 10.793L23.4072 12.793C23.7976 13.1836 23.7975 13.8167 23.407 14.2072C23.0164 14.5977 22.3832 14.5976 21.9927 14.207L21.7976 14.0118C20.8665 18.5704 16.8338 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.67 2 18.8771 3.97759 20.6155 6.92048C20.8964 7.39599 20.7386 8.00919 20.2631 8.29009C19.7876 8.57098 19.1744 8.41322 18.8935 7.9377C17.5 5.57869 14.9338 4 12 4ZM12 6C12.5523 6 13 6.44772 13 7V11.4648L15.5547 13.1679C16.0142 13.4743 16.1384 14.0952 15.8321 14.5547C15.5257 15.0142 14.9048 15.1384 14.4453 14.8321L11.4453 12.8321C11.1671 12.6466 11 12.3344 11 12V7C11 6.44772 11.4477 6 12 6Z"
          fill={fillColor || '#9E9E9E'}
        />
      </g>
    </svg>

  );
}

export default ClockRewindIcon;

ClockRewindIcon.defaultProps = {
  className: null,

};

ClockRewindIcon.propTypes = {
  className: PropTypes.string,
};
