import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { Text, TextArea, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import FieldVisibilityConfig from '../field_visibility_config/FieldVisibilityConfig';
import { FIELD_CONFIGURATIONS_CONSTANTS } from '../../FieldConfiguration.constants';
import { RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';
import styles from '../FieldAdditionalConfiguration.module.scss';

function DisplayFieldAdditionalConfiguration(props) {
  const { fieldDetails, setFieldDetails, moduleType, metaData } = props;

  const { t } = useTranslation();
  const {
    ADDITIONAL_CONFIG: { FIELD_GUIDANCE },
  } = FIELD_CONFIGURATIONS_CONSTANTS(t);

  const onChangeGuidance = (event) => {
    const { id, value } = event.target;
    setFieldDetails({
      ...fieldDetails,
      [id]: value,
    });
  };

  return (
    <div>
      <FieldVisibilityConfig
        fieldDetails={fieldDetails}
        setFieldDetails={setFieldDetails}
        moduleType={moduleType}
        metaData={metaData}
        isShowValueEmpty
      />
      <Text
        content={FIELD_GUIDANCE.TITLE}
        className={cx(
          gClasses.FTwo16GrayV3,
          gClasses.MT24,
          gClasses.FontWeight500,
        )}
      />
      <TextArea
        id={RESPONSE_FIELD_KEYS.INSTRUCTION}
        labelText={FIELD_GUIDANCE.FIELD_INSTRUCTION.LABEL}
        placeholder={FIELD_GUIDANCE.FIELD_INSTRUCTION.PLACEHOLDER}
        value={fieldDetails[RESPONSE_FIELD_KEYS.INSTRUCTION]}
        onChange={onChangeGuidance}
        className={cx(gClasses.MT12, styles.FieldInstructions)}
      />
      <TextInput
        id={RESPONSE_FIELD_KEYS.HELP_TEXT}
        labelText={FIELD_GUIDANCE.HELPER_TOOLTIP.LABEL}
        placeholder={FIELD_GUIDANCE.HELPER_TOOLTIP.PLACEHOLDER}
        value={fieldDetails[RESPONSE_FIELD_KEYS.HELP_TEXT]}
        onChange={onChangeGuidance}
        className={gClasses.MT12}
      />
    </div>
  );
}

export default DisplayFieldAdditionalConfiguration;
