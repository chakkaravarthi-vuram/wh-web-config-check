import { Label, MultiDropdown, Size, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import styles from '../ValidationConfiguration.module.scss';
import { VALIDATION_CONFIG_STRINGS } from '../ValidationConfiguration.strings';
import { getFieldValidationErrorMessage } from '../ValidationConfiguration.utils';
import jsUtility, { cloneDeep, isNaN } from '../../../../../../../utils/jsUtility';
import { getAccountConfigurationDetailsApiService } from '../../../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { FIELD_TYPES } from '../../../FieldConfiguration.strings';
import { arryToDropdownData } from '../../../../../../../utils/UtilityFunctions';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../../utils/constants/form/form.constant';
import { getSharedPropertyWarningText } from '../../../FieldConfiguration.utils';

function FileUploadValidationConfiguration(props) {
    const { setFieldDetails, fieldDetails = {} } = props;
    const { errorList = {} } = fieldDetails;
    const { t } = useTranslation();

    const [allowedExtensionsList, setAllowedExtensionsList] = useState([]);
    const [systemMaxFileSize, setSystemMaxFileSize] = useState(null);

    const onFilUploadFieldValidationChangeHandler = (value, id) => {
        const validationData = cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]);
        const validationValue = parseInt(value, 10);
        if (isNaN(validationValue)) delete validationData[id];
        setFieldDetails({
            ...fieldDetails,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
            ...validationData,
            ...(!isNaN(validationValue)) ?
            { [id]: validationValue } :
            {},
            },
        });
    };
    console.log('check the doc issue1', errorList, fieldDetails);
    useEffect(() => {
      if (fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.FILE_UPLOAD) {
        getAccountConfigurationDetailsApiService().then((response) => {
          const valData = cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] || {});
          setSystemMaxFileSize(response.maximum_file_size);
          const errorList = fieldDetails[RESPONSE_FIELD_KEYS.ERROR_LIST];
          if (response?.maximum_file_size < fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_FILE_SIZE]) {
            errorList[`${RESPONSE_VALIDATION_KEYS.VALIDATION_DATA},${VALIDATION_CONFIG_STRINGS(t).MAX_FILE_SIZE.ID}`] =
            `${t('form_field_strings.validation_config.table_validation.files_less_than_or_equal_to')} ${response?.maximum_file_size} MB.`;
          }
          console.log(errorList, 'check the doc issue2');
          setFieldDetails({
            ...fieldDetails,
            errorList,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
              ...valData,
              [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].SYSTEM_MAX_FILE_SIZE]: response.maximum_file_size,
            },
          });
          if (response.allowed_extensions) {
            let allowedExtensionsArray = [];
            if (response.allowed_extensions) {
              allowedExtensionsArray = [
                { value: null, label: 'None' },
                ...arryToDropdownData(response.allowed_extensions),
              ];
            }
            setAllowedExtensionsList(allowedExtensionsArray);
          }
        });
      }
    }, []);

    const checkLocalError = () => {
      if (!jsUtility.isEmpty(fieldDetails?.[RESPONSE_FIELD_KEYS.ERROR_LIST]) && (fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_FILE_SIZE] > systemMaxFileSize)) return ` ${systemMaxFileSize} MB`;
      return '';
    };

    const onMultipleExtensionSelectHandler = (value, label) => {
      let allowedExtensions = cloneDeep(fieldDetails)?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].ALLOWED_EXTENSIONS] || [];
      const index = allowedExtensions?.findIndex((currencyType) => currencyType === value);
      if (label === 'None') {
        allowedExtensions = [];
      } else if (index > -1) {
          allowedExtensions = allowedExtensions.slice(0, index).concat(allowedExtensions.slice(index + 1));
      } else allowedExtensions.push(value);
          setFieldDetails({
          ...fieldDetails,
          [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
              ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
              [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].ALLOWED_EXTENSIONS]: allowedExtensions,
          },
      });
    };

    return (
    <>
        {fieldDetails[RESPONSE_FIELD_KEYS.FORM_COUNT] > 1 && getSharedPropertyWarningText()}
        {fieldDetails?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].IS_MULTIPLE] &&
        <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw, gClasses.MT16)}>
          <TextInput
            id={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MINIMUM_FILE_COUNT.ID}
            className={gClasses.FlexBasis45}
            placeholder={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MINIMUM_FILE_COUNT.PLACEHOLDER}
            labelText={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MINIMUM_FILE_COUNT.LABEL}
            type="number"
            onChange={(event) => {
                onFilUploadFieldValidationChangeHandler(event?.target?.value, event?.target?.id);
            }}
            value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MINIMUM_COUNT]}
            errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).ALLOWED_MINIMUM_FILE_COUNT.ID)}
            size={Size.lg}
            inputInnerClassName={styles.TextField}
          />
          <TextInput
            id={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MAXIMUM_FILE_COUNT.ID}
            className={gClasses.FlexBasis45}
            placeholder={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MAXIMUM_FILE_COUNT.PLACEHOLDER}
            labelText={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MAXIMUM_FILE_COUNT.LABEL}
            type="number"
            onChange={(event) => {
                onFilUploadFieldValidationChangeHandler(event?.target?.value, event?.target?.id);
            }}
            value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_COUNT]}
            errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).ALLOWED_MAXIMUM_FILE_COUNT.ID)}
            inputInnerClassName={styles.TextField}
          />
        </div>}
        <div className={gClasses.MT16}>
          <Label
            labelName={VALIDATION_CONFIG_STRINGS(t).ALLOWED_FILE_EXTENSIONS.LABEL}
          />
          <MultiDropdown
            id={VALIDATION_CONFIG_STRINGS(t).ALLOWED_FILE_EXTENSIONS.ID}
            className={gClasses.FlexBasis45}
            dropdownViewProps={{
              size: Size.md,
              placeholder: VALIDATION_CONFIG_STRINGS(t).ALLOWED_FILE_EXTENSIONS.PLACEHOLDER,
              selectedLabel: fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].ALLOWED_EXTENSIONS]?.join(', ') || '',
              errorMessage: getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).ALLOWED_FILE_EXTENSIONS.ID),
            }}
            onClick={onMultipleExtensionSelectHandler}
            optionList={cloneDeep(allowedExtensionsList)}
            selectedListValue={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].ALLOWED_EXTENSIONS] || []}
          />
        </div>
        <TextInput
          id={VALIDATION_CONFIG_STRINGS(t).MAX_FILE_SIZE.ID}
          className={cx(gClasses.FlexBasis45, gClasses.MT16)}
          placeholder={VALIDATION_CONFIG_STRINGS(t).MAX_FILE_SIZE.PLACEHOLDER}
          labelText={VALIDATION_CONFIG_STRINGS(t).MAX_FILE_SIZE.LABEL}
          type="number"
          onChange={(event) => {
              onFilUploadFieldValidationChangeHandler(event?.target?.value, event?.target?.id);
          }}
          value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_FILE_SIZE]}
          errorMessage={`${!jsUtility.isEmpty(getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).MAX_FILE_SIZE.ID)) ? getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).MAX_FILE_SIZE.ID) : ''}${checkLocalError()}`}
          inputInnerClassName={styles.TextField}
          suffixIcon={<div>{VALIDATION_CONFIG_STRINGS(t).MAX_FILE_SIZE.SUFFIX}</div>}
        />
    </>
    );
}

export default FileUploadValidationConfiguration;
