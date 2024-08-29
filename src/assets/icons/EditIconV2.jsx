import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';

function EditIconV2(props) {
  const { className, onClick, style, title } = props;
  const { buttonColor } = useContext(ThemeContext);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
      style={style}
    >
      <title>{title}</title>
      <g fill="none" fillRule="evenodd">
        <circle cx="12" cy="12" r="12" fill="#EFF1F4" />
        <path
          fill={buttonColor || '#2295BF'}
          fillRule="nonzero"
          d="M7.255 15L9 16.745l-.302.302a.812.812 0 01-.311.195l-2.232.755a.127.127 0 01-.152-.152l.755-2.232a.8.8 0 01.195-.31L7.255 15zm7.322-7.816l2.226 2.226-6.48 6.48-2.227-2.225 6.481-6.481zm.79-.846c.52-.521 1.456-.43 2.09.205.635.634.726 1.57.205 2.09L17.296 9 15 6.704z"
        />
      </g>
    </svg>
  );
}

export default EditIconV2;
EditIconV2.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
};
EditIconV2.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};
