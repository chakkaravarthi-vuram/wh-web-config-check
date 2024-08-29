import React from 'react';
import PropTypes from 'prop-types';

function CenterAlignIcon(props) {
  const { className, onClick, style, title, id } = props;
  return (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        onClick={onClick}
        id={id}
        style={{ ...style }}
        fill="none"
    >
        <title>{title}</title>
        <path d="M8.33398 15V5C8.33398 4.22343 8.33398 3.83515 8.20712 3.52886C8.03796 3.12048 7.7135 2.79602 7.30512 2.62687C6.99884 2.5 6.61055 2.5 5.83398 2.5C5.05742 2.5 4.66913 2.5 4.36285 2.62687C3.95447 2.79602 3.63001 3.12048 3.46085 3.52886C3.33398 3.83515 3.33398 4.22343 3.33398 5V15C3.33398 15.7766 3.33398 16.1649 3.46085 16.4711C3.63001 16.8795 3.95447 17.204 4.36285 17.3731C4.66913 17.5 5.05742 17.5 5.83398 17.5C6.61055 17.5 6.99884 17.5 7.30512 17.3731C7.7135 17.204 8.03796 16.8795 8.20712 16.4711C8.33398 16.1649 8.33398 15.7766 8.33398 15Z" stroke="#217CF5" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M16.6673 13.3333V6.66667C16.6673 5.8901 16.6673 5.50181 16.5405 5.19553C16.3713 4.78715 16.0468 4.46269 15.6385 4.29353C15.3322 4.16667 14.9439 4.16667 14.1673 4.16667C13.3907 4.16667 13.0025 4.16667 12.6962 4.29353C12.2878 4.46269 11.9633 4.78715 11.7942 5.19553C11.6673 5.50181 11.6673 5.8901 11.6673 6.66667V13.3333C11.6673 14.1099 11.6673 14.4982 11.7942 14.8045C11.9633 15.2129 12.2878 15.5373 12.6962 15.7065C13.0025 15.8333 13.3907 15.8333 14.1673 15.8333C14.9439 15.8333 15.3322 15.8333 15.6385 15.7065C16.0468 15.5373 16.3713 15.2129 16.5405 14.8045C16.6673 14.4982 16.6673 14.1099 16.6673 13.3333Z" stroke="#217CF5" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />

    </svg>
  );
}
export default CenterAlignIcon;
CenterAlignIcon.defaultProps = {
  className: null,
  onClick: () => {},
  style: null,
  title: null,
  isButtonColor: false,
};
CenterAlignIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
