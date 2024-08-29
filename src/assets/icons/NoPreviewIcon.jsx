import React from 'react';
import PropTypes from 'prop-types';

function EyeIcon(props) {
  const { className } = props;
  return (
    <svg
      width="20"
      height="15"
      viewBox="0 0 20 15"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
d="M14.607 8.565c0 .162.099.08 0 .242L17.551 11c1.156-.947 1.786-1.729 2.375-2.701a.75.75 0 0 0 0-.649C18.16 5.372 14.295 2 10.268 2c-1.08 0-2.286.335-3.268.66l1.613 1.26s.969-.368 1.165-.368c2.75 0 4.83 1.417 4.83 5.013zM16.6 11.4l-2.5-1.8-5.5-4.125L7.2 4.35 5 2.625 1.7.225c-.4-.3-1-.3-1.4 0-.4.3-.4.75 0 1.05L3.608 3.91C2.208 4.96.871 6.16.1 7.2c-.1.225-.1.375 0 .6 1.953 2.63 5.964 5.612 9.9 5.612 1.8 0 3.318-.52 4.818-1.27l3.482 2.633c.4.3 1 .3 1.4 0 .4-.3.4-.75 0-1.05L16.6 11.4zM6 7.152c0-.802.142-1.51.6-2.152l1.564 1.19c-.183.24-.244.642-.274.962-.149 1.605.798 2.736 2.478 2.736.366 0 .762-.27 1.128-.431L13 10.704C12.07 11.821 10.888 12 9.973 12 7.333 11.765 6 9.4 6 7.152z"
        fill="#B8BFC7"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default EyeIcon;

EyeIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  buttonColor: null,
};

EyeIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  buttonColor: PropTypes.string,
};
