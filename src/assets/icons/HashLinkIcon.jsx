import React from 'react';
import PropTypes from 'prop-types';

function HashLinkIcon(props) {
    const { title, ariaHidden } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 33 32"
      aria-hidden={ariaHidden}
    >
    <title>{title}</title>
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g fill="#229FD2" fillRule="nonzero" transform="translate(-903 -383)">
          <g transform="translate(903.067 383)">
            <path d="M12.206 29.91c-2.786 2.787-7.33 2.787-10.116 0-2.787-2.785-2.787-7.33 0-10.116l6.323-6.323c2.656-2.656 6.902-2.803 9.711-.386a1.347 1.347 0 01-1.748 2.046 4.43 4.43 0 00-6.066.237L3.987 21.69a4.432 4.432 0 000 6.323 4.432 4.432 0 006.323 0l6.006-6.007a1.343 1.343 0 011.91-.012 1.342 1.342 0 01-.013 1.909l-6.007 6.007zm11.381-11.38c-2.655 2.655-6.902 2.802-9.711.385a1.346 1.346 0 111.749-2.046 4.431 4.431 0 006.066-.237l6.323-6.323a4.432 4.432 0 000-6.323 4.432 4.432 0 00-6.323 0l-6.007 6.007a1.34 1.34 0 01-2.303-.944c.002-.36.149-.702.406-.953l6.007-6.006c2.786-2.787 7.33-2.787 10.116 0 2.787 2.786 2.787 7.33 0 10.116l-6.323 6.323z" />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default HashLinkIcon;
HashLinkIcon.defaultProps = {
    title: null,
    ariaHidden: false,
  };
  HashLinkIcon.propTypes = {
    title: PropTypes.string,
    ariaHidden: PropTypes.bool,
  };
