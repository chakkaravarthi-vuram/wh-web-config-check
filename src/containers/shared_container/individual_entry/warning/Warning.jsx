import React from 'react';
import { Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import WarningTriangleIcon from '../../../../assets/icons/WarningTriangleIcon';
import styles from './Warning.module.scss';

function Warning() {
  const { t } = useTranslation();
  const warningMessage = t('individual_entry.warning_message');

  return (
    <div className={styles.WarningText}>
      <WarningTriangleIcon />
      <Text content={warningMessage} size={ETextSize.SM} />
    </div>
  );
}

export default Warning;
