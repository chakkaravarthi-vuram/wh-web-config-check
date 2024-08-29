import React from 'react';
import PropTypes from 'prop-types';

function FlagIcon(props) {
  const { className, title } = props;
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="16"
    viewBox="0 0 13 16"
    className={className}
    >
    <title>{title}</title>
    <path
      fill="#FF665F"
      fillRule="evenodd"
      d="M.839 16C.335 16 0 15.653 0 15.134V.866C0 .346.335 0 .839 0H12.16c.504 0 .839.347.839.866 0 .174-.084.347-.168.52l-2.6 3.552 2.6 4.072c.252.433.168.953-.251 1.213-.168.086-.336.173-.42.173H1.677v4.738c0 .433-.335.866-.838.866z"
    />
    </svg>
  );
}
export default FlagIcon;
FlagIcon.defaultProps = {
  className: null,
  onClick: () => {},
  title: null,
};
FlagIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
};
