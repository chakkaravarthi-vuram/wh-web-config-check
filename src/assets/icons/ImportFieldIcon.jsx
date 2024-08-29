import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function ImportFieldIcon(props) {
    const { className, onClick, title } = props;

  return (
    <svg
    width="16"
    height="16"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick || null}
    className={className}
    >
        <title>{title}</title>

        <path d="M6.857 2.286v1.959H2.94a.98.98 0 0 0-.98.98v7.836c0 .541.439.98.98.98h7.837a.98.98 0 0 0 .98-.98V9.143h1.958v3.918A2.939 2.939 0 0 1 10.776 16H2.939A2.939 2.939 0 0 1 0 13.061V5.224a2.939 2.939 0 0 1 2.939-2.938h3.918zM13.905 0C15.062 0 16 .938 16 2.095v3.143a2.095 2.095 0 0 1-2.095 2.095h-3.756l-3.143 3.143h2.708v2.095H4.476a1.048 1.048 0 0 1-1.047-1.047V6.286h2.095v2.708L8.667 5.85V2.095C8.667.938 9.605 0 10.762 0zm0 2.095h-3.143v3.143h3.143V2.095z" fill="#5B6375" fillRule="nonzero" />
    </svg>
  );
}

export default ImportFieldIcon;

ImportFieldIcon.defaultProps = {
    className: null,
    onClick: null,
    style: null,
    title: null,
    id: EMPTY_STRING,
  };
ImportFieldIcon.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    title: PropTypes.string,
    id: PropTypes.string,
  };
