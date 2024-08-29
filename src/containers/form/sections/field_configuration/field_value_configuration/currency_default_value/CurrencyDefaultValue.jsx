import React from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_VALUE_FIELD_CONFIG_STRINGS } from '../FieldValueConfiguration.strings';
import CurrencyField from '../../../../../../components/form_components/currency_field/CurrencyField';
import { RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';
import { getUserProfileData } from '../../../../../../utils/UtilityFunctions';

function CurrencyDefaultValue(props) {
  const { setFieldDetails, fieldDetails = {}, errorMessage, disabled = false } = props;

  const { t } = useTranslation();

  const onCurrencyDefaultValueChange = (value) => {
    setFieldDetails({
      ...fieldDetails,
      defaultValue: value,
    });
  };

  const userProfile = getUserProfileData();

  return (
    <CurrencyField
        label={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LABEL}
        id={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.ID}
        onChange={onCurrencyDefaultValueChange}
        errorMessage={errorMessage}
        noDataFoundMessage
        value={fieldDetails[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
        disabled={disabled}
        defaultCurrencyType={userProfile?.default_currency_type}
        allowedCurrencyTypes={userProfile?.allowed_currency_types}
    />
  );
  }

  export default CurrencyDefaultValue;
