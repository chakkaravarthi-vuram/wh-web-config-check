import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { ETextSize, Text, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import styles from '../../FlowCreateOrEdit.module.scss';
import { LANGUAGE_AND_OTHERS } from '../../FlowCreateOrEdit.constant';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';

function TechnicalConfiguration(props) {
  const { shortCode, technicalReferenceName, errorList, onChange } = props;
  const { t } = useTranslation();

  return (
    <div className={gClasses.MT24}>
      <Text
        content={LANGUAGE_AND_OTHERS(t).TECHNICAL_CONFIGURATION.TITLE}
        size={ETextSize.LG}
        className={styles.TechnicalConfiguration}
      />
      <div className={cx(gClasses.W50, gClasses.MT16)}>
        <TextInput
          labelText={
            LANGUAGE_AND_OTHERS(t).TECHNICAL_CONFIGURATION.SHORT_CODE.LABEL
          }
          labelClassName={styles.ShortCodeLabel}
          value={shortCode || EMPTY_STRING}
          errorMessage={errorList.flowShortCode}
          onChange={(e) => onChange('flowShortCode', e.target.value)}
          readOnly
        />
      </div>
      <div className={cx(gClasses.W50, gClasses.MT12)}>
        <TextInput
          labelClassName={styles.ShortCodeLabel}
          instruction={
            LANGUAGE_AND_OTHERS(t).TECHNICAL_CONFIGURATION
              .TECHNICAL_REFERENCE_NAME.INSTRUCTION
          }
          labelText={
            LANGUAGE_AND_OTHERS(t).TECHNICAL_CONFIGURATION
              .TECHNICAL_REFERENCE_NAME.LABEL
          }
          value={technicalReferenceName || EMPTY_STRING}
          onChange={(e) => onChange('technicalReferenceName', e.target.value)}
          errorMessage={errorList.technicalReferenceName}
          readOnly
        />
      </div>
    </div>
  );
}
export default TechnicalConfiguration;
