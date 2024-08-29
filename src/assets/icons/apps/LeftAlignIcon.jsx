import React from 'react';
import PropTypes from 'prop-types';

function LeftAlignIcon(props) {
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
        <path d="M11.6667 8.33301C12.4432 8.33301 12.8315 8.33301 13.1378 8.20614C13.5462 8.03698 13.8706 7.71253 14.0398 7.30415C14.1667 6.99786 14.1667 6.60958 14.1667 5.83301C14.1667 5.05644 14.1667 4.66815 14.0398 4.36187C13.8706 3.95349 13.5462 3.62903 13.1378 3.45988C12.8315 3.33301 12.4432 3.33301 11.6667 3.33301L5 3.33301C4.22343 3.33301 3.83515 3.33301 3.52886 3.45988C3.12048 3.62903 2.79602 3.95349 2.62687 4.36187C2.5 4.66815 2.5 5.05644 2.5 5.83301C2.5 6.60958 2.5 6.99786 2.62687 7.30415C2.79602 7.71253 3.12048 8.03698 3.52886 8.20614C3.83515 8.33301 4.22343 8.33301 5 8.33301L11.6667 8.33301Z" stroke="#9E9E9E" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M15 16.6663C15.7766 16.6663 16.1649 16.6663 16.4711 16.5395C16.8795 16.3703 17.204 16.0459 17.3731 15.6375C17.5 15.3312 17.5 14.9429 17.5 14.1663C17.5 13.3898 17.5 13.0015 17.3731 12.6952C17.204 12.2868 16.8795 11.9624 16.4711 11.7932C16.1649 11.6663 15.7766 11.6663 15 11.6663H5C4.22343 11.6663 3.83515 11.6663 3.52886 11.7932C3.12048 11.9624 2.79602 12.2868 2.62687 12.6952C2.5 13.0015 2.5 13.3898 2.5 14.1663C2.5 14.9429 2.5 15.3312 2.62687 15.6375C2.79602 16.0459 3.12048 16.3703 3.52886 16.5395C3.83515 16.6663 4.22343 16.6663 5 16.6663L15 16.6663Z" stroke="#9E9E9E" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />

    </svg>
  );
}
export default LeftAlignIcon;
LeftAlignIcon.defaultProps = {
  className: null,
  onClick: () => {},
  style: null,
  title: null,
  isButtonColor: false,
};
LeftAlignIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
