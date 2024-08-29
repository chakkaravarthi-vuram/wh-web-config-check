import { Checkbox, ECheckboxSize, ETitleSize, Size, TextInput, Title } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import styles from './ValidationConfiguration.module.scss';
import { VALIDATION_CONFIG_STRINGS } from './ValidationConfiguration.strings';
import { getFieldValidationErrorMessage } from './ValidationConfiguration.utils';
import { cloneDeep, isEmpty, isNaN } from '../../../../../../utils/jsUtility';
import { FIELD_TYPES } from '../../FieldConfiguration.strings';
import NumberValidationConfiguration from './number_validation_configuration/NumberValidationConfiguration';
import { FIELD_GROUPING } from '../../basic_configuration/BasicConfiguration.utils';
import FileUploadValidationConfiguration from './file_upload_validation_configuration/FileUploadValidationConfiguration';
import LinkFieldValidationConfiguration from './link_field_validation_configuration/LinkFieldValidationConfiguration';
import DateFieldValidationConfiguration from './date_field_validation_configuration/DateFieldValidationConfiguration';
import CurrencyValidationConfiguration from './currency_validation_configuration/CurrencyValidationConfiguration';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../utils/constants/form/form.constant';
import UserSelectorValidationConfiguration from './user_selector_validation_configuration/UserSelectorValidationConfiguration';
import DataListSelectorValidationConfiguration from './datalist_selector_validation_configuration/DataListValidationConfiguration';
import TableValidationConfiguration from './table_validation_configuration/TableValidationConfiguration';
import { FIELD_LIST_OBJECT } from '../../basic_configuration/BasicConfiguration.constants';

function ValidationConfiguration(props) {
  const { setFieldDetails, fieldDetails = {}, metaData = {}, moduleType, tableColumns = [] } = props;
  const { errorList = {} } = fieldDetails;
  const { t } = useTranslation();

  useEffect(() => {
    if (!isEmpty(fieldDetails?.fieldUUID) && !isEmpty(fieldDetails?.validationData?.allowedSpecialCharacters)) {
      setFieldDetails({
        ...fieldDetails,
        validationData: {
          ...fieldDetails?.validationData,
          allowSpecialCharacters: true,
        },
      });
    }
  }, [fieldDetails?.validationData?.allowedSpecialCharacters]);

  let validationConfigurationContent = (
    <>
      <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw, gClasses.Gap16)}>
        <TextInput
          id={VALIDATION_CONFIG_STRINGS(t).MINIMUM_CHARCTERS.ID}
          placeholder={VALIDATION_CONFIG_STRINGS(t).MINIMUM_CHARCTERS.PLACEHOLDER}
          className={gClasses.W50}
          labelText={VALIDATION_CONFIG_STRINGS(t).MINIMUM_CHARCTERS.LABEL}
          onChange={(event) => {
            if (event?.target?.value.includes('-') || event?.target?.value.includes('+')) return;
            const validationData = cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]);
            const validationValue = parseInt(event?.target?.value, 10);
            if (isNaN(validationValue)) delete validationData[event?.target?.id];
            if (isEmpty(validationValue)) delete validationData[event?.target?.id];
            setFieldDetails({
              ...fieldDetails,
              [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
                ...validationData,
                ...(!isNaN(validationValue)) ?
                { [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MINIMUM_CHARACTERS]: Number(validationValue) } : {},
              },
            });
          }}
          value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MINIMUM_CHARACTERS]}
          errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).MINIMUM_CHARCTERS.ID)}
          size={Size.lg}
          inputInnerClassName={styles.TextField}
        />
        <TextInput
          id={VALIDATION_CONFIG_STRINGS(t).MAXIMUM_CHARCTERS.ID}
          placeholder={VALIDATION_CONFIG_STRINGS(t).MAXIMUM_CHARCTERS.PLACEHOLDER}
          className={gClasses.W50}
          labelText={VALIDATION_CONFIG_STRINGS(t).MAXIMUM_CHARCTERS.LABEL}
          onChange={(event) => {
            if (event?.target?.value.includes('-') || event?.target?.value.includes('+')) return;
            const validationData = cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]);
            const validationValue = parseInt(event?.target?.value, 10);
            if (isNaN(validationValue)) delete validationData[event?.target?.id];
            if (isEmpty(validationValue)) delete validationData[event?.target?.id];
            setFieldDetails({
              ...fieldDetails,
              [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
                ...validationData, // write new action in reducer to update validation data
                ...(!isNaN(validationValue)) ?
                { [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MAXIMUM_CHARACTERS]: Number(validationValue) } : {},
              },
            });
          }}
          value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MAXIMUM_CHARACTERS]}
          errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).MAXIMUM_CHARCTERS.ID)}
          inputInnerClassName={styles.TextField}
        />
      </div>
      <Checkbox
        className={cx(gClasses.MT16, gClasses.CenterV)}
        isValueSelected={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOW_SPECIAL_CHARACTERS]}
        details={VALIDATION_CONFIG_STRINGS(t).ALLOW_SPECIAL_CHARACTERS.OPTION_LIST[0]}
        size={ECheckboxSize.SM}
        onClick={() => {
          const clonedValData = cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]);
          if (!clonedValData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOW_SPECIAL_CHARACTERS] === false) {
            delete clonedValData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOWED_SPECIAL_CHARACTERS];
          }
          setFieldDetails({
            ...fieldDetails,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
              ...clonedValData || {},
              [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOW_SPECIAL_CHARACTERS]: !fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOW_SPECIAL_CHARACTERS],
            },
          });
        }}
        checkboxViewLabelClassName={cx(gClasses.FTwo13BlackV20, gClasses.CheckboxClass, styles.CheckboxClass)}
      />
      {fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOW_SPECIAL_CHARACTERS] &&
        <TextInput
          className={gClasses.MT16}
          id={VALIDATION_CONFIG_STRINGS(t).ALLOW_SPECIAL_CHARACTERS.ID}
          placeholder={VALIDATION_CONFIG_STRINGS(t).ALLOW_SPECIAL_CHARACTERS.PLACEHOLDER}
          onChange={(event) =>
            setFieldDetails({
              ...fieldDetails,
              [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
                ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] || {},
                [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOWED_SPECIAL_CHARACTERS]: event?.target?.value,
              },
          })}
          value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOWED_SPECIAL_CHARACTERS]}
          errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).ALLOW_SPECIAL_CHARACTERS.ID)}
          size={Size.lg}
        />
      }
    </>
  );

  switch (fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
    case FIELD_TYPES.NUMBER:
      validationConfigurationContent =
      <NumberValidationConfiguration
        fieldDetails={fieldDetails}
        setFieldDetails={setFieldDetails}
      />;
      break;
    case FIELD_TYPES.FILE_UPLOAD:
      validationConfigurationContent =
      <FileUploadValidationConfiguration
        fieldDetails={fieldDetails}
        setFieldDetails={setFieldDetails}
      />;
      break;
    case FIELD_TYPES.LINK:
      validationConfigurationContent =
      <LinkFieldValidationConfiguration
        fieldDetails={fieldDetails}
        setFieldDetails={setFieldDetails}
      />;
      break;
    case FIELD_TYPES.DATE:
    case FIELD_TYPES.DATETIME:
      validationConfigurationContent =
      <DateFieldValidationConfiguration
        fieldDetails={fieldDetails}
        setFieldDetails={setFieldDetails}
        metaData={metaData}
        moduleType={moduleType}
      />;
      break;
    case FIELD_TYPES.CURRENCY:
      validationConfigurationContent =
      <CurrencyValidationConfiguration
        fieldDetails={fieldDetails}
        setFieldDetails={setFieldDetails}
      />;
      break;
    case FIELD_TYPES.USER_TEAM_PICKER:
      validationConfigurationContent =
      <UserSelectorValidationConfiguration
        fieldDetails={fieldDetails}
        setFieldDetails={setFieldDetails}
      />;
      break;
    case FIELD_TYPES.DATA_LIST:
      validationConfigurationContent =
      <DataListSelectorValidationConfiguration
        fieldDetails={fieldDetails}
        setFieldDetails={setFieldDetails}
        metaData={metaData}
        moduleType={moduleType}
      />;
      break;
    case FIELD_TYPES.PHONE_NUMBER:
    case FIELD_TYPES.EMAIL:
    case FIELD_TYPES.SCANNER:
    case FIELD_TYPES.YES_NO:
    case FIELD_TYPES.DATA_LIST_PROPERTY_PICKER:
    case FIELD_TYPES.USER_PROPERTY_PICKER:
    case FIELD_TYPES.INFORMATION:
      validationConfigurationContent = (
      <Title
        content={`${t('form_field_strings.validation_config.validations_not_applicable')} '${FIELD_LIST_OBJECT(t)?.[fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]]}' ${t('form_field_strings.validation_config.fields')}.`}
        className={cx(gClasses.MB16, gClasses.FontSize13)}
        size={ETitleSize.xs}
      />);
      break;
    case FIELD_TYPES.TABLE:
      validationConfigurationContent = (
        <TableValidationConfiguration
          fieldDetails={fieldDetails}
          setFieldDetails={setFieldDetails}
          tableColumns={tableColumns}
        />
      );
      break;
    default:
      if (FIELD_GROUPING.SELECTION_FIELDS.includes(fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE])) {
        validationConfigurationContent = (
          <Title
            content={`${t('form_field_strings.validation_config.validations_not_applicable')} '${FIELD_LIST_OBJECT(t)?.[fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]]}' ${t('form_field_strings.validation_config.fields')}.`}
            className={cx(gClasses.MB16, gClasses.FontSize13)}
            size={ETitleSize.xs}
          />);
      }
    break;
  }

  return validationConfigurationContent;
  }

  export default ValidationConfiguration;
