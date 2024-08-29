import { ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import styles from './DraftPublishedIndicator.module.scss';
import AbsentIndicator from '../../assets/icons/AbsentIndicator';
import PresentIndicator from '../../assets/icons/PresentIndicator';
import { DATALISTS_CONSTANTS } from '../../containers/data_lists/data_list_landing/DatalistsLanding.constant';

function DraftPublishedIndicator(props) {
  const { t } = useTranslation();
  const { DRAFT_LABEL, PUBLISHED_LABEL } = DATALISTS_CONSTANTS(t);

  const { metaData, className } = props;
  const {
    hasDraft,
    // version
  } = metaData;

  const getPresent = () => <PresentIndicator className={gClasses.ML4} />;
  const getAbsent = () => <AbsentIndicator className={gClasses.ML4} />;

  return (
    <div className={cx(styles.CapsuleContainer, gClasses.CenterV, className)}>
      <div className={cx(styles.LeftContainer, gClasses.CenterV)}>
        <Text
          size={ETextSize.SM}
          content={`${DRAFT_LABEL} : `}
        />
        {hasDraft ? getPresent() : getAbsent()}
      </div>
      <div className={styles.Divider}>|</div>
      <div className={cx(styles.RightContainer, gClasses.CenterV)}>
        <Text
          size={ETextSize.SM}
          content={`${PUBLISHED_LABEL} : `}
        />
        {getPresent()}
      </div>
    </div>
  );
}

export default DraftPublishedIndicator;
