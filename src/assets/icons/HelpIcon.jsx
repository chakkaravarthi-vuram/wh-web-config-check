import React, { useContext } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import styles from './Icons.module.scss';
import { ARIA_ROLES, BS } from '../../utils/UIConstants';
import Tooltip from '../../components/tooltip/Tooltip';
import ThemeContext from '../../hoc/ThemeContext';

function HelpIcon(props) {
  const { className, onClick, style, title, id, isButtonColor, placement, fillColor, ariaLabel, StrictToolTipId = false, customInnerClasss } = props;

  let { buttonColor } = useContext(ThemeContext);
  if (!isButtonColor) {
    buttonColor = null;
  }
  const toolTipId = document.getElementById(id);

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className={cx(className, styles.HelpIcon, BS.P_RELATIVE)}
        onClick={onClick}
        style={({ ...style }, { fill: buttonColor })}
        id={id}
        role={ARIA_ROLES.IMG}
        tabIndex={-1}
        aria-label={ariaLabel}
      >
        <g fill="none" fillRule="evenodd">
          <circle cx="8" cy="8" r="8" fill={(fillColor) || '#DEE0E4'} />
          <path
            fill="#fff"
            fillRule="nonzero"
            d="M8.403 9.76c0-.368.03-.647.092-.838.061-.19.212-.391.454-.603.474-.38.866-.8 1.177-1.26.311-.459.467-.957.467-1.495 0-.804-.249-1.432-.746-1.885C9.35 3.226 8.657 3 7.768 3c-.82 0-1.49.21-2.009.632-.518.42-.771 1.008-.759 1.761l.02.038h1.485c0-.376.123-.661.368-.854.245-.192.544-.288.895-.288.41 0 .727.113.949.34.222.226.333.544.333.954 0 .356-.097.68-.292.975a5.75 5.75 0 0 1-.787.923c-.465.394-.766.72-.901.981-.136.26-.205.693-.21 1.298h1.543zm.025 2.615v-1.479H6.854v1.48h1.574z"
          />
        </g>
      </svg>
      {!StrictToolTipId ? <Tooltip id={id} content={title} placement={placement} isCustomToolTip customInnerClasss={customInnerClasss} /> : toolTipId && <Tooltip id={id} content={title} placement={placement} isCustomToolTip />}
    </>
  );
}
export default HelpIcon;

HelpIcon.defaultProps = {
  className: null,
  onClick: null,
  title: null,
  style: null,
  id: null,
  placement: EMPTY_STRING,
  fillColor: EMPTY_STRING,
};
HelpIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  style: PropTypes.objectOf(PropTypes.any),
  id: PropTypes.string,
  placement: PropTypes.string,
  fillColor: PropTypes.string,
};
