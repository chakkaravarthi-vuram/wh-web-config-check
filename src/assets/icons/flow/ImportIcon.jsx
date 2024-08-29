import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function CopyImportIcon(props) {
  const { className, onClick, style, title, id } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className={className}
      onClick={onClick || null}
      style={style}
      id={id}
    >
      <title>{title}</title>
      <path
        //   fill="#2295BF"
        fillRule="nonzero"
        d="M19.916 19.837a.255.255 0 010 .36l-3.73 3.73a.258.258 0 01-.193.073.254.254 0 01-.193-.073l-3.73-3.73a.255.255 0 010-.36l1.027-1.027a.255.255 0 01.36 0l1.556 1.556v-6.33c0-.14.114-.254.254-.254h1.452c.14 0 .255.114.255.254v6.33l1.555-1.556a.255.255 0 01.36 0l1.027 1.027zM9.389 15.976a.19.19 0 00.13.063h3.26v-1.732h-1.713V9.732h9.854v4.575h-1.713v1.732h3.25s.08 0 .145-.069c.051-.054.051-.13.051-.13V8.22c0-.122-.1-.221-.22-.221H9.557a.225.225 0 00-.225.225v7.633s0 .057.056.118z"
      />
    </svg>
  );
}
export default CopyImportIcon;

CopyImportIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  id: EMPTY_STRING,
};
CopyImportIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  id: PropTypes.string,
};
