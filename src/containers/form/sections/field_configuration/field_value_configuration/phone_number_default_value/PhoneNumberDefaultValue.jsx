import React from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_VALUE_FIELD_CONFIG_STRINGS } from '../FieldValueConfiguration.strings';
import PhoneNumber from '../../../../../../components/form_components/phone_number/PhoneNumber';
import { RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';
import { getUserProfileData } from '../../../../../../utils/UtilityFunctions';

function PhoneNumberDefaultValue(props) {
  const { setFieldDetails, fieldDetails = {}, errorMessage, disabled = false } = props;

  const { t } = useTranslation();
  const onPhoneDefaultValueChange = (value) => {
    setFieldDetails({
      ...fieldDetails,
      defaultValue: value,
    });
  };

  const userProfile = getUserProfileData();

  return (
    <PhoneNumber
        label={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LABEL}
        id={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.ID}
        onChange={onPhoneDefaultValueChange}
        errorMessage={errorMessage}
        noDataFoundMessage
        value={fieldDetails[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
        disabled={disabled}
        defaultCountryCode={userProfile?.default_country_code}
    />
  );
  }

  export default PhoneNumberDefaultValue;
