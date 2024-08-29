import { InputDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import styles from './PhoneNumber.module.scss';
import { getCountryCodeDropdownList } from '../../../utils/UtilityFunctions';
// import { RESPONSE_VALIDATION_KEYS } from '../../../utils/constants/form/form.constant';
// import { FIELD_TYPES } from '../../../containers/form/sections/field_configuration/FieldConfiguration.strings';
import jsUtility from '../../../utils/jsUtility';
// import { getAccountConfigurationDetailsApiService } from '../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';

const optionList = getCountryCodeDropdownList();

function PhoneNumber(props) {
  const {
    id,
    label,
    labelClassName,
    className,
    errorMessage,
    errorVariant,
    instruction,
    placeholder,
    helpTooltip,
    hideLabel,
    required,
    onChange,
    value,
    defaultCountryCode,
    disabled,
    size,
    colorScheme,
    referenceName,
    popperClassName,
    popperStyle,
  } = props;

  // const [accountConfig, setAccountConfig] = useState({});

  // useEffect(() => {
  //   const fetchAccountConfigurationDetails = async () => {
  //     try {
  //       const response = await getAccountConfigurationDetailsApiService();
  //       setAccountConfig(response); // Update combined state
  //     } catch (error) {
  //       console.error('Error fetching account configuration details:', error);
  //       // Handle errors appropriately, e.g., display error message to user
  //     }
  //   };

  //   fetchAccountConfigurationDetails();
  // }, []);

  // const defaultCountryCode = useMemo(() => accountConfig.default_country_code, [accountConfig]);

  const countryCode = jsUtility.get(value, ['country_code'], null) || defaultCountryCode;
  const phoneNo = jsUtility.get(value, ['phone_number'], null) || '';

  const onInputChange = (e) => {
    const { value = '' } = e.target;
    if (value === '' || /^(?!0)[0-9]+$/.test(value)) {
      onChange({ phone_number: value, country_code: countryCode });
    }
  };

  const onDropdownClick = (value) => {
    onChange({ phone_number: phoneNo, country_code: value });
  };

  return (
    <InputDropdown
      id={id}
      className={className}
      labelName={label}
      labelClassName={labelClassName}
      required={required}
      placeholder={placeholder}
      helpTooltip={helpTooltip}
      hideLabel={hideLabel}
      optionList={optionList}
      inputValue={phoneNo}
      selectedValue={countryCode}
      selectedLabel={countryCode}
      onInputChange={onInputChange}
      onDropdownClick={onDropdownClick}
      dropdownMaxWidth={25}
      errorMessage={errorMessage}
      errorVariant={errorVariant}
      instruction={instruction}
      disabled={disabled}
      colorScheme={colorScheme}
      referenceName={referenceName}
      searchProps={{
        showLink: true,
      }}
      size={size}
      popperClassName={popperClassName}
      popperStyle={popperStyle}
      dropdownViewClass={styles.PhoneDropdown}
    />
  );
}

export default PhoneNumber;
