import React from 'react';
import PropTypes from 'prop-types';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function LinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        fill="#5B6375"
        fillRule="nonzero"
        d="M6.534 4.853A4.076 4.076 0 019.643 6.23c.332.374.34.935.017 1.318l-.012.015a1.016 1.016 0 01-1.537.017 2.027 2.027 0 00-3.056.014l-.018.02-2.53 3.029a2.031 2.031 0 00.305 2.901 2.079 2.079 0 002.852-.342l1.069-1.28a1.02 1.02 0 111.566 1.309l-1.066 1.276a4.187 4.187 0 01-2.863 1.478 4.005 4.005 0 01-2.969-.958 4.092 4.092 0 01-.46-5.693l2.522-3.02a4.077 4.077 0 013.07-1.46zm1.86-3.398a4.09 4.09 0 015.683-.559l.175.15c.74.673 1.204 1.6 1.296 2.602a4.195 4.195 0 01-.946 3.08l-2.48 2.97a4.065 4.065 0 01-2.432 1.401 4.076 4.076 0 01-3.675-1.238A1.02 1.02 0 017.508 8.47a2.035 2.035 0 003.021-.052l.023-.025 2.487-2.978c.72-.848.644-2.11-.17-2.867a2.033 2.033 0 00-2.91.215L8.763 4.195a1.018 1.018 0 01-1.741-.303 1.02 1.02 0 01.175-1.005z"
      />
    </svg>
  );
}
export default LinkIcon;
LinkIcon.defaultProps = {
  className: EMPTY_STRING,
  style: null,
  title: EMPTY_STRING,
  onClick: null,
};
LinkIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  title: PropTypes.string,
};
