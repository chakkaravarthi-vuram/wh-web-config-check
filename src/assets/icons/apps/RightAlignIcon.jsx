import React from 'react';
import PropTypes from 'prop-types';

function RightAlignIcon(props) {
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
        <path d="M15 8.33301C15.7766 8.33301 16.1649 8.33301 16.4711 8.20614C16.8795 8.03698 17.204 7.71253 17.3731 7.30415C17.5 6.99786 17.5 6.60958 17.5 5.83301C17.5 5.05644 17.5 4.66815 17.3731 4.36187C17.204 3.95349 16.8795 3.62903 16.4711 3.45988C16.1649 3.33301 15.7766 3.33301 15 3.33301L8.33333 3.33301C7.55676 3.33301 7.16848 3.33301 6.86219 3.45988C6.45381 3.62903 6.12936 3.95349 5.9602 4.36187C5.83333 4.66815 5.83333 5.05644 5.83333 5.83301C5.83333 6.60958 5.83333 6.99786 5.9602 7.30415C6.12936 7.71253 6.45381 8.03698 6.86219 8.20614C7.16848 8.33301 7.55676 8.33301 8.33333 8.33301L15 8.33301Z" stroke="#9E9E9E" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M15 16.6663C15.7766 16.6663 16.1649 16.6663 16.4711 16.5395C16.8795 16.3703 17.204 16.0459 17.3731 15.6375C17.5 15.3312 17.5 14.9429 17.5 14.1663C17.5 13.3898 17.5 13.0015 17.3731 12.6952C17.204 12.2868 16.8795 11.9624 16.4711 11.7932C16.1649 11.6663 15.7766 11.6663 15 11.6663H5C4.22343 11.6663 3.83515 11.6663 3.52886 11.7932C3.12048 11.9624 2.79602 12.2868 2.62687 12.6952C2.5 13.0015 2.5 13.3898 2.5 14.1663C2.5 14.9429 2.5 15.3312 2.62687 15.6375C2.79602 16.0459 3.12048 16.3703 3.52886 16.5395C3.83515 16.6663 4.22343 16.6663 5 16.6663L15 16.6663Z" stroke="#9E9E9E" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />

    </svg>
  );
}
export default RightAlignIcon;
RightAlignIcon.defaultProps = {
  className: null,
  onClick: () => {},
  style: null,
  title: null,
  isButtonColor: false,
};
RightAlignIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isButtonColor: PropTypes.bool,
};
