import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { ETextSize, Text, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styles from '../../DatalistsCreateEdit.module.scss';
import { LANGUAGE_AND_OTHERS } from '../../DatalistsCreateEdit.constant';
import { getErrorMessage } from '../../DatalistsCreateEdit.utils';

function TechnicalConfiguration(props) {
  const {
    shortCode,
    technicalReferenceName,
    errorList,
  } = props;

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
          value={shortCode}
          // onChange={onShortCodeNameChangeHandler}
          readOnly
          errorMessage={getErrorMessage(errorList, 'dataListShortCode')}
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
          value={technicalReferenceName}
          // onChange={onReferenceNameChangeHandler}
          readOnly
          errorMessage={getErrorMessage(errorList, 'technicalReferenceName')}
        />
      </div>
    </div>
  );
}
export default TechnicalConfiguration;

TechnicalConfiguration.propTypes = {
  shortCode: PropTypes.string,
  technicalReferenceName: PropTypes.string,
  errorList: PropTypes.object,
};
