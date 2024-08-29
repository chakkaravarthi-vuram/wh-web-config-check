import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { find } from 'lodash';
import styles from './FormPostOperationFeedback.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import { FORM_FEEDBACK_DEFAULT_MESSAGES, FORM_FEEDBACK_ICONS } from './FormPostOperationFeedback.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { nullCheck } from '../../../utils/jsUtility';

export const FORM_FEEDBACK_TYPES = {
  SUCCESS: 0,
  FAILURE: 1,
  WARNING: 2,
};

function FormPostOperationFeedback(props) {
  const { id, feedbacks, className } = props;
  const data = find(feedbacks, { id });
  let type = null;
  let message = EMPTY_STRING;
  let isVisible = false;

  if (nullCheck(data, 'isVisible')) {
    isVisible = data.isVisible;
    type = data.type;
    message = data.message;
  }

  let bgColorClass = null;
  if (type === FORM_FEEDBACK_TYPES.SUCCESS) {
    bgColorClass = styles.Success;
  } else if (type === FORM_FEEDBACK_TYPES.FAILURE) {
    bgColorClass = styles.Failure;
  } else if (type === FORM_FEEDBACK_TYPES.WARNING) {
    bgColorClass = styles.Warning;
  }

  return (
      isVisible && (
        <div className={cx(styles.Container, BS.W100, gClasses.CenterV, bgColorClass, gClasses.MB10, className)}>
          {FORM_FEEDBACK_ICONS[type]}
          <div className={cx(gClasses.ML10, gClasses.FOne13White)}>{message || FORM_FEEDBACK_DEFAULT_MESSAGES[type]}</div>
        </div>
      )
  );
}

const mapStateToProps = (state) => {
  return {
    feedbacks: state.FormPostOperationFeedbackReducer.feedbacks,
  };
};

export default withRouter(connect(mapStateToProps, null)(FormPostOperationFeedback));

FormPostOperationFeedback.defaultProps = {
  feedbacks: [],
};

FormPostOperationFeedback.propTypes = {
  id: PropTypes.string.isRequired,
  feedbacks: PropTypes.arrayOf(PropTypes.object),
};
