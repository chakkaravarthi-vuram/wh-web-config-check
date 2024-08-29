import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Label, MultiDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import { VALIDATION_CONFIG_STRINGS } from '../ValidationConfiguration.strings';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import { getAccountConfigurationDetailsApiService } from '../../../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { FIELD_TYPES } from '../../../FieldConfiguration.strings';
import { arryToDropdownData } from '../../../../../../../utils/UtilityFunctions';
import { cloneDeep } from '../../../../../../../utils/jsUtility';
import styles from './CurrencyValidationConfiguration.module.scss';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../../utils/constants/form/form.constant';

function CurrencyValidationConfiguration(props) {
    const { setFieldDetails, fieldDetails = {} } = props;

    const { t } = useTranslation();

    const [allowedCurrencyList, setAllowedCurrencyList] = useState([]);

    useEffect(() => {
        if (fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.CURRENCY) {
          getAccountConfigurationDetailsApiService().then((response) => {
            if (response.allowed_currency_types) {
              let allowedCurrencyOptionList = [];
              if (response.allowed_currency_types) {
                allowedCurrencyOptionList = [
                  { value: null, label: 'None' },
                  ...arryToDropdownData(response.allowed_currency_types),
                ];
              }
              setAllowedCurrencyList(allowedCurrencyOptionList);
            }
          });
        }
      }, []);

    const onAllowedCurrencyTypesChangeHandler = (value, label) => {
        let allowedCurrencyTypes = cloneDeep(fieldDetails)?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.CURRENCY].ALLOWED_CURRENCY_TYPES] || [];
        if (value === fieldDetails?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.CURRENCY].CURRENCY_TYPE] && allowedCurrencyTypes.includes(value)) return;
        const index = allowedCurrencyTypes?.findIndex((currencyType) => currencyType === value);
        if (label === 'None') allowedCurrencyTypes = [];
        else if (index > -1) {
            allowedCurrencyTypes = allowedCurrencyTypes.slice(0, index).concat(allowedCurrencyTypes.slice(index + 1));
        } else allowedCurrencyTypes.push(value);
            setFieldDetails({
            ...fieldDetails,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
                ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
                [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.CURRENCY].ALLOWED_CURRENCY_TYPES]: allowedCurrencyTypes,
            },
        });
    };

    return (
        <div>
            <Label
                labelName={VALIDATION_CONFIG_STRINGS(t).ALLOWED_CURRENCY_TYPES.LABEL}
                className={styles.AllowedCurrencyTypeLabel}
            />
            <MultiDropdown
                id={VALIDATION_CONFIG_STRINGS(t).ALLOWED_CURRENCY_TYPES.ID}
                    dropdownViewProps={{
                    isRequired: true,
                    selectedLabel: fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.CURRENCY].ALLOWED_CURRENCY_TYPES]?.join(', '),
                }}
                optionList={cloneDeep(allowedCurrencyList)}
                onClick={(value, label) => onAllowedCurrencyTypesChangeHandler(value, label)}
                selectedListValue={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.CURRENCY].ALLOWED_CURRENCY_TYPES] || []}
                labelClassName={gClasses.FTwo12BlackV20}
            />
        </div>
    );
}

  export default CurrencyValidationConfiguration;
