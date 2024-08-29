import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import {
  Title,
  Text,
  ETitleSize,
  ETitleHeadingLevel,
} from '@workhall-pvt-lmt/wh-ui-library';
import TestSuccessIcon from 'assets/icons/integration/TestSuccessIcon';
import styles from '../DBConnector.module.scss';
import { TEST_SUCCESS_STRINGS } from '../DBConnector.strings';

function TestSuccess(props) {
const { className, description } = props;
  const { t } = useTranslation();

  return (
    <div className={cx(styles.Container, className)}>
      <div>
        <TestSuccessIcon />
      </div>
      <div>
        <Title
          content={TEST_SUCCESS_STRINGS(t).TITLE}
          size={ETitleSize.xs}
          headingLevel={ETitleHeadingLevel.h4}
          className={styles.Title}
        />
        <Text content={description} />
      </div>
    </div>
  );
}

export default TestSuccess;
