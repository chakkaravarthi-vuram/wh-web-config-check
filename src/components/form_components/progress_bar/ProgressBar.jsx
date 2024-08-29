import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { useHistory } from 'react-router-dom';
import ThemeContext from '../../../hoc/ThemeContext';
import styles from './ProgressBar.module.scss';
import { ARIA_ROLES } from '../../../utils/UIConstants';
import { PERCENTAGE } from '../../../utils/strings/CommonStrings';
import gClasses from '../../../scss/Typography.module.scss';
import { isBasicUserMode } from '../../../utils/UtilityFunctions';

function ProgressBar(props) {
  const { buttonColorContext, colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const history = useHistory();
  const isBasicUser = isBasicUserMode(history);
  const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
  const [buttonColor, setButtonColor] = useState(buttonColorContext);

  useEffect(() => {
    if (buttonColorContext !== buttonColor) {
      setButtonColor(buttonColorContext);
    }
  }, [buttonColorContext, props]);

  const { progressLoaderStatus, className } = props;
  return progressLoaderStatus && progressLoaderStatus.isVisible ? (
    <div
      role={ARIA_ROLES.PROGRESS_BAR}
      className={classNames(styles.ProgressBar, className, gClasses.ZIndex152)}
      aria-valuenow={progressLoaderStatus.progressPercentage}
    >
      <div
        className={styles.Progress}
        style={{
          width: progressLoaderStatus.progressPercentage + PERCENTAGE,
          backgroundColor: colorSchema.activeColor ? colorSchema.activeColor : '#217cf5',
        }}
      />
    </div>
  ) : null;
}

const mapStateToprops = (state) => {
  return {
    progressLoaderStatus: state.PostLoaderStatusReducer.postLoaderStatus,
  };
};

export default connect(mapStateToprops, null)(ProgressBar);

ProgressBar.defaultProps = {
  className: null,
};
ProgressBar.propTypes = {
  progressLoaderStatus: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
};
