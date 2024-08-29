import React from 'react';
import PropTypes from 'prop-types';

function EditAssigneeIcon(props) {
    const { className, title, id, ariaHidden, width, height, fillColor } =
        props;
    return (
        <svg title={title} aria-hidden={ariaHidden} className={className} width={width || '20'} height={height || '20'} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id={id}>
                <path id="Icon" d="M14.1668 17.5V15.8333C14.1668 14.9493 13.8156 14.1014 13.1905 13.4763C12.5654 12.8512 11.7176 12.5 10.8335 12.5H4.16683C3.28277 12.5 2.43493 12.8512 1.80981 13.4763C1.18469 14.1014 0.833496 14.9493 0.833496 15.8333V17.5M19.1668 17.5V15.8333C19.1663 15.0948 18.9205 14.3773 18.468 13.7936C18.0155 13.2099 17.3819 12.793 16.6668 12.6083M13.3335 2.60833C14.0505 2.79192 14.686 3.20892 15.1399 3.79359C15.5937 4.37827 15.84 5.09736 15.84 5.8375C15.84 6.57764 15.5937 7.29673 15.1399 7.88141C14.686 8.46608 14.0505 8.88308 13.3335 9.06667M10.8335 5.83333C10.8335 7.67428 9.34111 9.16667 7.50016 9.16667C5.65921 9.16667 4.16683 7.67428 4.16683 5.83333C4.16683 3.99238 5.65921 2.5 7.50016 2.5C9.34111 2.5 10.8335 3.99238 10.8335 5.83333Z" stroke={fillColor || '#959BA3'} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            </g>
        </svg>
    );
}

export default EditAssigneeIcon;

EditAssigneeIcon.defaultProps = {
    className: null,
    title: null,
};
EditAssigneeIcon.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
};
