import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function CurrencyIcon(props) {
  const { className, style, title, onClick } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={className}
      onClick={onClick || null}
      style={style}
    >
      <title>{title}</title>
      <path
        fill="#5B6375"
        fillRule="nonzero"
        d="M12.3 7.89c-.08 0-.16.003-.24.006V2.738C12.06.941 9.025 0 6.03 0 3.033 0 0 .94 0 2.738v9.322h.005c.112 1.732 3.085 2.638 6.025 2.638.504 0 1.009-.029 1.5-.082A5.063 5.063 0 0 0 12.3 18a5.06 5.06 0 0 0 5.055-5.055A5.06 5.06 0 0 0 12.3 7.89zM6.03 1.398c3.008 0 4.631.951 4.631 1.34 0 .39-1.623 1.34-4.631 1.34-3.009 0-4.631-.95-4.631-1.34 0-.389 1.622-1.34 4.63-1.34zM1.399 4.553c1.163.61 2.903.924 4.63.924 1.73 0 3.468-.314 4.632-.924v1.31c0 .389-1.623 1.34-4.631 1.34-3.009 0-4.631-.951-4.631-1.34v-1.31zm0 3.125c1.163.61 2.903.923 4.63.923 1.73 0 3.468-.314 4.632-.923v.487A5.078 5.078 0 0 0 8.202 9.99a11.91 11.91 0 0 1-2.172.189c-3.009 0-4.631-.95-4.631-1.34V7.678zm4.63 5.622c-3.008 0-4.63-.951-4.63-1.34v-1.305c1.163.61 2.903.924 4.63.924.48 0 .959-.027 1.427-.075a5.036 5.036 0 0 0-.201 1.738c-.38.036-.785.058-1.225.058zm6.271 3.302a3.66 3.66 0 0 1-3.656-3.657A3.66 3.66 0 0 1 12.3 9.29a3.66 3.66 0 0 1 3.657 3.656 3.66 3.66 0 0 1-3.657 3.657z"
      />
      <title>{title}</title>
    </svg>
  );
}
export default CurrencyIcon;
CurrencyIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};
CurrencyIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
