import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Text, Title } from '@workhall-pvt-lmt/wh-ui-library';
import NoDataIcon from 'assets/icons/copilot/NoDataIcon';
import DataLoadingIcon from 'assets/icons/copilot/DataLoadingIcon';
import LimitReachedIcon from 'assets/icons/copilot/LimitReachedIcon';
import gClasses from 'scss/Typography.module.scss';
import CHAT_STRINGS from '../Chat.strings';
import { COPILOT_STRINGS } from '../../Copilot.strings';
import styles from './ErrorDetails.module.scss';

function ErrorDetails(props) {
  const { status_code } = props;
  const { t } = useTranslation();
  const {
    CHAT: { ERRORS },
  } = COPILOT_STRINGS(t);
  const { STATUS_CODE_TYPE } = CHAT_STRINGS;

  let error = null;
  if ([STATUS_CODE_TYPE.NO_DATA_FOUND, STATUS_CODE_TYPE.NO_SOURCE_FOUND].includes(status_code)) {
    error = (
      <div className={styles.ErrorCard}>
        <NoDataIcon />
        <Text content={ERRORS.NO_DATA_FOUND} />
      </div>
    );
  } else if (status_code === STATUS_CODE_TYPE.API_FAILED) {
    error = (
      <div className={cx(styles.ErrorCard, styles.WaringError)}>
        <DataLoadingIcon />
        <Text content={ERRORS.DATA_LOADING_ISSUE} />
      </div>
    );
  } else if (status_code === STATUS_CODE_TYPE.QUOTA_EXCEEDED) {
    error = (
      <div className={cx(gClasses.CenterVH, gClasses.FlexDirectionColumn, gClasses.Gap16)}>
        <LimitReachedIcon />
        <div className={cx(gClasses.CenterVH, gClasses.FlexDirectionColumn, gClasses.Gap8)}>
          <Title content={ERRORS.SUBSCRIPTION_LIMIT_REACHED.TITLE} className={gClasses.FS16} />
          <Text content={ERRORS.SUBSCRIPTION_LIMIT_REACHED.DESCRIPTION} className={cx(gClasses.FTwo13GrayV98, gClasses.TextAlignCenter)} />
        </div>
      </div>
    );
  }

  return error;
}

export default ErrorDetails;
