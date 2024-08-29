import React from 'react';
import PropTypes from 'prop-types';

function DeleteMappingIcon(props) {
    const { className, title, onClick } = props;
    return (
    <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        onClick={onClick}
    >
        <title>{title}</title>
        <path
            fill="#959BA3"
            d="M12.667 4.274l-.94-.94L8 7.061 4.273 3.334l-.94.94L7.06 8.001l-3.727 3.726.94.94L8 8.941l3.727 3.726.94-.94L8.94 8.001l3.727-3.727z"
        />
    </svg>
    );
}

export default DeleteMappingIcon;

DeleteMappingIcon.defaultProps = {
    className: null,
    onClick: null,
  };
  DeleteMappingIcon.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
  };
