import React from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import ShowMoreText from 'react-show-more-text';

import styles from './TaskResponseTableCard.module.scss';
import gClasses from '../../../scss/Typography.module.scss';

import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

const { capitalize } = require('lodash');

function taskResponseTabelCard(props) {
  const { responseData } = props;
  const userName = capitalize(`${responseData.user.first_name} ${responseData.user.last_name}`);
  return (
    <div className={cx(gClasses.InputBorder, gClasses.InputBorderRadius, gClasses.FOne13BlackV2, styles.Table)}>
      <div className={styles.Response}>
        <ShowMoreText lines={2} more="More" less="Less">{responseData.response}</ShowMoreText>
      </div>
      <div style={{ flex: 1 }} className={gClasses.Ellipsis} title={userName}>{userName}</div>
    </div>
  );
}

export default taskResponseTabelCard;

taskResponseTabelCard.propTypes = {
  responseData: PropTypes.string,
};

taskResponseTabelCard.defaultProps = {
  responseData: EMPTY_STRING,
};
