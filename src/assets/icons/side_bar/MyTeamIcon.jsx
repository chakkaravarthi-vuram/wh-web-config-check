import React from 'react';
import PropTypes from 'prop-types';
import { ARIA_ROLES } from 'utils/UIConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function MyTeamIcon(props) {
  const { className, title, fill } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="13"
      viewBox="0 0 17 13"
      className={className}
      role={ARIA_ROLES.IMG}
    >
      <path
        fill={fill || '#FFF'}
        d="M12.109 7.055c1.058.719 1.8 1.692 1.8 2.99v2.319H17v-2.319c0-1.684-2.759-2.68-4.891-2.99zm-1.291-.873a3.09 3.09 0 100-6.182c-.363 0-.703.077-1.028.185a4.62 4.62 0 010 5.811c.325.109.665.186 1.028.186zm-4.636 0a3.09 3.09 0 100-6.182 3.09 3.09 0 100 6.182zm0-4.637c.85 0 1.545.696 1.545 1.546a1.55 1.55 0 01-1.545 1.545 1.55 1.55 0 01-1.546-1.545c0-.85.696-1.546 1.546-1.546zm0 5.41C4.119 6.955 0 7.99 0 10.045v2.319h12.364v-2.319c0-2.055-4.119-3.09-6.182-3.09zm4.636 3.863H1.545v-.765C1.7 9.497 4.095 8.5 6.182 8.5c2.086 0 4.482.997 4.636 1.545v.773z"
      />
      <title>{title}</title>
    </svg>
  );
}
export default MyTeamIcon;

MyTeamIcon.defaultProps = {
  className: EMPTY_STRING,
  onClick: null,
};

MyTeamIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};
