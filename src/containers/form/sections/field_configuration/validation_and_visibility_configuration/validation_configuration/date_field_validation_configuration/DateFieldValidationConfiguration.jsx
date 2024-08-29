import { BorderRadiusVariant, ETextSize, MultiDropdown, Radio, RadioGroup, RadioGroupLayout, SingleDropdown, Size, Text, TextInput, Variant } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { VALIDATION_CONFIG_STRINGS } from '../ValidationConfiguration.strings';
import jsUtility, { cloneDeep, isEmpty, isNull } from '../../../../../../../utils/jsUtility';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../../../FieldConfiguration.strings';
import { DAY_LIST, getDateFieldsValidationErrorMessage } from './DateFieldValidationConfiguration.utils';
import { FIELD_LIST_TYPE, INITIAL_PAGE, MAX_PAGINATION_SIZE } from '../../../../../../../utils/constants/form.constant';
import { apiGetAllFieldsList } from '../../../../../../../axios/apiService/flow.apiService';
import { COMMA, EMPTY_STRING, SPACE } from '../../../../../../../utils/strings/CommonStrings';
import { getModuleIdByModuleType } from '../../../../../Form.utils';
import DateTimeWrapper from '../../../../../../../components/date_time_wrapper/DateTimeWrapper';
import { getLanguageAndCalendarData } from '../../../../../../../axios/apiService/languageAndCalendarAdmin.apiService';

function DateFieldValidationConfiguration(props) {
    const { setFieldDetails, fieldDetails = {}, metaData = {}, moduleType } = props;
    const { errorList = {} } = fieldDetails;
    const { t } = useTranslation();
    const [isFutureSelected, setIsFutureSelected] = useState(fieldDetails?.validationData?.dateSelection?.[0]?.type === 'future' || false);
    const [dateFieldsList, setDateFieldsList] = useState([]);
    const [paginationDetails, setPaginationDetails] = useState([]);
    const [searchText, setSearchText] = useState(EMPTY_STRING);
    const [workingDays, setWorkingDays] = useState([]);
    const [nonWorkingDays, setNonWorkingDays] = useState([]);

    const operatorOptions = dateFieldsList?.length > 1 ? [
      ...VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.SINGLE_FIELDS_OPTION_LIST,
      ...VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DUAL_FIELDS_OPTION_LIST,
    ] : VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.SINGLE_FIELDS_OPTION_LIST;

    const fetchDateFields = (params) => {
      const paginationData = {
        ...getModuleIdByModuleType(metaData, moduleType, false),
        // search: '',
        ...params,
        field_list_type: FIELD_LIST_TYPE.DIRECT,
        // sort_field: '',
        sort_by: 1,
        allowed_field_types: [FIELD_TYPES.DATETIME, FIELD_TYPES.DATE],
      };
      apiGetAllFieldsList(paginationData).then((res) => {
        const { paginationDetails = {}, dateFields = [] } = res;
        // if (datalistFieldsPaginationDetails?.totalCount === 0) setIsDlOptionListEmpty(true);
        console.log('getDateFields fields err', res);
        if (params?.page > 1) {
            setDateFieldsList([...dateFieldsList, ...dateFields || []]);
            setPaginationDetails(paginationDetails);
        } else {
            setDateFieldsList([...dateFields || []]);
            setPaginationDetails(paginationDetails);
        }
      }).catch((err) => {
        console.log('getDateFields fields err', err);
      });
    };

    const getSelectedOtherPreference = () => {
      if (fieldDetails?.validationData?.allowWorkingDay) {
        return 'allowWorkingDay';
      } else if (fieldDetails?.validationData?.allowNonWorkingDay) {
        return 'allowNonWorkingDay';
      } else if (fieldDetails?.validationData?.allowedDay) {
        return 'allowedDay';
      } else {
        return null;
      }
    };

    const getWorkingDaysLabel = () => {
      const daysValueArray = fieldDetails?.validationData?.allowedDay || [];
      const daysLabelArray = [];
      daysValueArray.forEach((day) => {
        VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.CUSTOM_WORKING_DAYS_OPTIONS?.forEach((eachDay) => {
          if (eachDay?.value === day) daysLabelArray.push(eachDay.label);
        });
      });
      return daysLabelArray?.toString();
    };
    // useEffect(() => {
    //   let defaultType = null;
    //   setIsFutureSelected(null);
    //   if (fieldDetails?.validationData?.dateSelection?.[0]?.type === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[1].value) {
    //     defaultType = VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_FUTURE_DATE_OPTIONS[0].value;
    //     setFieldDetails({
    //       ...fieldDetails,
    //       [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
    //         ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
    //         dateSelection: [{
    //           ...fieldDetails?.validationData?.dateSelection?.[0],
    //           subType: defaultType,
    //         }],
    //       },
    //     });
    //     setIsFutureSelected(true);
    //   } else if (fieldDetails?.validationData?.dateSelection?.[0]?.type === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[2].value) {
    //     defaultType = VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_PAST_DATE_OPTIONS[0].value;
    //     setFieldDetails({
    //       ...fieldDetails,
    //       [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
    //         ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
    //         dateSelection: [{
    //           ...fieldDetails?.validationData?.dateSelection?.[0],
    //           subType: defaultType,
    //         }],
    //       },
    //     });
    //     setIsFutureSelected(false);
    //   }
    // }, [fieldDetails?.validationData?.dateSelection?.[0]?.type]);

    // useEffect(() => {
    //   if (isFutureSelected !== null) {
    //     const clonedValData = jsUtility.cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]);
    //     delete clonedValData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DAY];
    //     delete clonedValData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DAY];
    //     delete clonedValData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE];
    //     delete clonedValData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE];
    //     setFieldDetails({
    //       ...fieldDetails,
    //       [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: clonedValData,
    //     });
    //   }
    // }, [fieldDetails?.validationData?.dateSelection?.[0]?.subType]);

    useEffect(() => {
      fetchDateFields({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
      getLanguageAndCalendarData().then((res) => {
        const workingDaysStringArray = [];
        const nonWorkingDaysStringArray = [];
        const { working_days } = res;
        DAY_LIST(t).map((day) => {
          if (working_days.some((selectedDay) => day.VALUE === selectedDay)) {
            workingDaysStringArray.push(day.SUBTITLE);
          } else nonWorkingDaysStringArray.push(day.SUBTITLE);
          return null;
        });
        const workingDaysString = workingDaysStringArray.join(COMMA + SPACE);
        const nonWorkingDaysString = nonWorkingDaysStringArray.join(COMMA + SPACE);
        setWorkingDays(workingDaysString);
        setNonWorkingDays(nonWorkingDaysString);
      });
    }, []);

    const loadMoreDateFields = () => {
      fetchDateFields({
          page: paginationDetails.page + 1,
          size: MAX_PAGINATION_SIZE,
          ...(!isEmpty(searchText)) ? { search: searchText } : null,
      });
    };

    const searchDateFields = (event) => {
      const searchText = event?.target?.value || EMPTY_STRING;
      setSearchText(searchText);
      fetchDateFields({
          page: INITIAL_PAGE,
          size: MAX_PAGINATION_SIZE,
          ...(!isEmpty(searchText)) ? { search: searchText } : null,
      });
    };

    const onCustomSelectHandler = (value) => {
      let selectedWorkingDays = jsUtility.cloneDeep(fieldDetails)?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].CUSTOM_WORKING_DAY] || [];
      const index = selectedWorkingDays?.findIndex((index) => index === value);
      if (index > -1) {
          selectedWorkingDays = selectedWorkingDays.slice(0, index).concat(selectedWorkingDays.slice(index + 1));
      } else selectedWorkingDays.push(value);
      console.log('datecustomdays', selectedWorkingDays, value);
          setFieldDetails({
          ...fieldDetails,
          [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
              ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
              [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].CUSTOM_WORKING_DAY]: selectedWorkingDays,
          },
      });
    };

    const onMainOptionChangeHandler = (value) => {
      const modifiedValidationData = jsUtility.cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]);
      delete modifiedValidationData?.dateSelection?.[0]?.subType;
      delete modifiedValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DAY];
      delete modifiedValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DAY];
      delete modifiedValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE];
      delete modifiedValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE];
      delete modifiedValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OPERATOR];
      delete modifiedValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].FIRST_FIELD_UUID];
      delete modifiedValidationData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SECOND_FIELD_UUID];

      let defaultType = null;
      if (value === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[1].value) {
        defaultType = VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_FUTURE_DATE_OPTIONS[0].value;
        setIsFutureSelected(true);
      } else if (value === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[2].value) {
        defaultType = VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_PAST_DATE_OPTIONS[0].value;
        setIsFutureSelected(false);
      }
      const param = {
        type: value,
        ...(value === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[3].value) &&
        {
          [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SUB_TYPE]: VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.BETWEEN,
          [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE]: EMPTY_STRING,
          [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE]: EMPTY_STRING,
        },
      };
      if (!isEmpty(defaultType)) param.subType = defaultType;

      setFieldDetails({
        ...fieldDetails,
        [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
          ...modifiedValidationData,
          allowToday: false,
          dateSelection: [{
            ...modifiedValidationData?.dateSelection?.[0],
            ...param,
          }],
        },
      });
    };

    const onOtherOptionChangeHandler = (value) => {
      const clonedValData = cloneDeep(fieldDetails?.validationData);
      if (isNull(value)) {
        delete clonedValData.allowWorkingDay;
        delete clonedValData.allowNonWorkingDay;
        delete clonedValData.allowedDay;
        delete clonedValData.other;
      }
      if (value !== 'allowedDay') delete clonedValData?.allowedDay;
      setFieldDetails({
        ...fieldDetails,
        [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: { ...clonedValData,
          [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OTHER]: value },
      });
    };

    const onFieldOperatorChangeHandler = (value) => {
      console.log('onDateFieldChangeHandler1', value);
      setFieldDetails({
        ...fieldDetails,
        [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]:
        {
          ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
          dateSelection: [{
            ...fieldDetails?.validationData?.dateSelection?.[0],
            [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OPERATOR]: value,
          }],
        },
      });
    };

    const onDateFieldChangeHandler = (value, id) => {
      console.log('onDateFieldChangeHandler', value, id);
      setFieldDetails({
        ...fieldDetails,
        [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]:
        { ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
          dateSelection: [{
            ...fieldDetails?.validationData?.dateSelection?.[0],
            [id]: value,
          }],
        },
      });
    };

    const onSubTypeChangeHandler = (value, allowToday = false) => {
      const clonedValData = jsUtility.cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]);
      delete clonedValData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DAY];
      delete clonedValData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DAY];
      delete clonedValData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE];
      delete clonedValData?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE];
      setFieldDetails({
        ...fieldDetails,
        [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]:
        {
          ...clonedValData,
          dateSelection: [{
            ...clonedValData?.dateSelection?.[0],
            subType: value,
          }],
          [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOW_TODAY]: allowToday,
        },
      });
    };

    const onInputChangeHandler = (key, value, isEndDay = false) => {
      const validationValue = parseInt(value, 10);
      if (!(validationValue < 0)) {
        if (!isEndDay) {
          setFieldDetails({
            ...fieldDetails,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]:
            { ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
              dateSelection: [{
                ...fieldDetails?.validationData?.dateSelection?.[0],
                subType: key,
                [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DAY]: validationValue,
              }],
            },
          });
        } else {
          setFieldDetails({
            ...fieldDetails,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
              ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
              dateSelection: [{
                ...fieldDetails?.validationData?.dateSelection?.[0],
                subType: key,
                [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DAY]: validationValue,
              }],
            },
          });
        }
      }
    };

    const onDateChangehandler = (key, value, isEndDate = false) => {
      if (!isEndDate) {
        setFieldDetails({
          ...fieldDetails,
          [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
            ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
            dateSelection: [{
              ...fieldDetails?.validationData?.dateSelection?.[0],
              subType: key,
              [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE]: value,
            }],
          },
        });
      } else {
        setFieldDetails({
          ...fieldDetails,
          [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
            ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
            dateSelection: [{
              ...fieldDetails?.validationData?.dateSelection?.[0],
              subType: key,
              [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE]: value,
            }],
          },
        });
      }
    };

    const getSubOptions = (options = []) => (
      <div className={gClasses.ML24}>
        <Radio
          id={options[0].value}
          label={options[0].label}
          checked={fieldDetails?.validationData?.dateSelection?.[0]?.subType === options[0].value && !fieldDetails?.validationData?.allowToday}
          onChange={() => onSubTypeChangeHandler(options[0].value)}
          className={gClasses.MT16}
        />
        <Radio
          id={options[1].value}
          label={options[1].label}
          checked={(fieldDetails?.validationData?.dateSelection?.[0]?.subType === options[0].value && fieldDetails?.validationData?.allowToday) || fieldDetails?.validationData?.dateSelection?.[0]?.subType === options[1].value}
          onChange={() => onSubTypeChangeHandler(options[1].value)}
          className={gClasses.MT16}
        />
        <div className={cx(gClasses.CenterV, gClasses.MT16)}>
          <Radio
            id={options[2].value}
            label={options[2].label}
            checked={fieldDetails?.validationData?.dateSelection?.[0]?.subType === options[2].value}
            onChange={() => onSubTypeChangeHandler(options[2].value, true)}
            className={gClasses.MR8}
            optionLabelClass={gClasses.WhiteSpaceNoWrap}
          />
          <TextInput
            id={isFutureSelected ? VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FUTURE_NEXT_DAY : VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.PAST_LAST_DAY}
            value={fieldDetails?.validationData?.dateSelection?.[0]?.subType === options[2].value && fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DAY]}
            onChange={(e) => onInputChangeHandler(options[2].value, e.target.value)}
            type="number"
            placeholder={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FROM_PLACEHOLDER}
            borderRadiusType={BorderRadiusVariant.rounded}
            variant={Variant.border}
            size={Size.md}
            className={gClasses.Width100}
            errorMessage={
              !(fieldDetails?.validationData?.dateSelection?.[0]?.subType !== options[2].value) &&
              getDateFieldsValidationErrorMessage(errorList, `${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION},0,${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DAY}`)}
            readOnly={fieldDetails?.validationData?.dateSelection?.[0]?.subType !== options[2].value}
          />
          <Text
            className={gClasses.ML8}
            content={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DAYS}
          />
        </div>
        <div className={cx(gClasses.CenterV, gClasses.MT16)}>
          <Radio
            id={options[3].value}
            label={options[3].label}
            checked={fieldDetails?.validationData?.dateSelection?.[0]?.subType === options[3].value}
            onChange={() => onSubTypeChangeHandler(options[3].value)}
            className={gClasses.MR8}
            optionLabelClass={gClasses.WhiteSpaceNoWrap}
          />
          <TextInput
            id={isFutureSelected ? VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FUTURE_AFTER_DAY : VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.PAST_BEFORE_DAY}
            value={fieldDetails?.validationData?.dateSelection?.[0]?.subType === options[3].value && fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DAY]}
            onChange={(e) => onInputChangeHandler(options[3].value, e.target.value)}
            type="number"
            placeholder={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FROM_PLACEHOLDER}
            borderRadiusType={BorderRadiusVariant.rounded}
            variant={Variant.border}
            size={Size.md}
            className={gClasses.Width100}
            errorMessage={
              !(fieldDetails?.validationData?.dateSelection?.[0]?.subType !== options[3].value) &&
              getDateFieldsValidationErrorMessage(errorList, `${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION},0,${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DAY}`)}
            readOnly={fieldDetails?.validationData?.dateSelection?.[0]?.subType !== options[3].value}
          />
          <Text
            className={gClasses.ML8}
            content={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DAYS}
          />
        </div>
        <div className={cx(gClasses.CenterV, gClasses.MT16)}>
          <Radio
            id={options[4].value}
            label={options[4].label}
            checked={fieldDetails?.validationData?.dateSelection?.[0]?.subType === options[4].value}
            onChange={() => onSubTypeChangeHandler(options[4].value)}
            className={gClasses.MR8}
            optionLabelClass={gClasses.WhiteSpaceNoWrap}
          />
          <TextInput
            id={isFutureSelected ? VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FUTURE_BETWEEN_START_DAY : VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.PAST_BETWEEN_START_DAY}
            value={fieldDetails?.validationData?.dateSelection?.[0]?.subType === options[4].value && fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DAY]}
            onChange={(e) => onInputChangeHandler(options[4].value, e.target.value)}
            type="number"
            placeholder={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FROM_PLACEHOLDER}
            borderRadiusType={BorderRadiusVariant.rounded}
            variant={Variant.border}
            size={Size.md}
            className={gClasses.Width100}
            errorMessage={
              !(fieldDetails?.validationData?.dateSelection?.[0]?.subType !== options[4].value) &&
              getDateFieldsValidationErrorMessage(errorList, `${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION},0,${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DAY}`)}
            readOnly={fieldDetails?.validationData?.dateSelection?.[0]?.subType !== options[4].value}
          />
          <Text
            className={cx(gClasses.ML8, gClasses.MR8)}
            content={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.TO}
          />
          <TextInput
            id={isFutureSelected ? VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FUTURE_BETWEEN_END_DAY : VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.PAST_BETWEEN_END_DAY}
            value={fieldDetails?.validationData?.dateSelection?.[0]?.subType === options[4].value && fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DAY]}
            onChange={(e) => onInputChangeHandler(options[4].value, e.target.value, true)}
            type="number"
            placeholder={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.TO_PLACEHOLDER}
            borderRadiusType={BorderRadiusVariant.rounded}
            variant={Variant.border}
            size={Size.md}
            className={gClasses.Width100}
            errorMessage={
              !(fieldDetails?.validationData?.dateSelection?.[0]?.subType !== options[4].value) &&
              getDateFieldsValidationErrorMessage(errorList, `${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION},0,${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DAY}`)}
            readOnly={fieldDetails?.validationData?.dateSelection?.[0]?.subType !== options[4].value}
          />
          <Text
            className={gClasses.ML8}
            content={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DAYS}
          />
        </div>
      </div>
    );

    const firsDatetFieldsList = dateFieldsList?.filter((field) =>
    field.value !== fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_2.ID]);
    const firstDateFieldLabel = firsDatetFieldsList?.find((eachField) => eachField.value === fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_1.ID])?.label;

    const secondDateFieldsList = dateFieldsList?.filter((field) =>
    field.value !== fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_1.ID]);
    const secondDateFieldLabel = secondDateFieldsList?.find((eachField) => eachField.value === fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_2.ID])?.label;

    const selectedOperator = operatorOptions?.find?.((eachOperator) => eachOperator.value === fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.ID])?.label;
    console.log('firstDateFIeldsList', firsDatetFieldsList, secondDateFieldsList, dateFieldsList, fieldDetails, firstDateFieldLabel, secondDateFieldLabel, fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_1.ID]);
    return (
    <>
        <Radio
          id={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[0].value}
          label={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[0].label}
          checked={fieldDetails?.validationData?.dateSelection?.[0]?.type === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[0].value}
          onChange={() => onMainOptionChangeHandler(VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[0].value)}
        />
        <Radio
          id={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[1].value}
          label={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[1].label}
          checked={fieldDetails?.validationData?.dateSelection?.[0]?.type === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[1].value}
          onChange={() => onMainOptionChangeHandler(VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[1].value)}
          className={gClasses.MT10}
        />
        {fieldDetails?.validationData?.dateSelection?.[0]?.type === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[1].value && getSubOptions(VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_FUTURE_DATE_OPTIONS)}
        <Radio
          id={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[2].value}
          label={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[2].label}
          checked={fieldDetails?.validationData?.dateSelection?.[0]?.type === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[2].value}
          onChange={() => onMainOptionChangeHandler(VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[2].value)}
          className={gClasses.MT10}
        />
        {fieldDetails?.validationData?.dateSelection?.[0]?.type === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[2].value && getSubOptions(VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_PAST_DATE_OPTIONS)}
        <Radio
          id={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[3].value}
          label={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[3].label}
          checked={fieldDetails?.validationData?.dateSelection?.[0]?.type === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[3].value}
          onChange={() => onMainOptionChangeHandler(VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[3].value)}
          className={gClasses.MT10}
        />
        {fieldDetails?.validationData?.dateSelection?.[0]?.type === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[3].value &&
        <div className={cx(gClasses.DisplayFlex, gClasses.ML24, gClasses.MT16)}>
          <DateTimeWrapper
            id={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.START_DATE.value}
            label={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.START_DATE.label}
            // validationType={ValidationType.Today}
            isRequired
            enableTime={fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE === FIELD_TYPES.DATETIME]}
            getDate={(value) => onDateChangehandler(VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.BETWEEN, value)}
            date={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE]}
            errorMessage={getDateFieldsValidationErrorMessage(errorList, `${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION},0,${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].START_DATE}`)}
          />
          <DateTimeWrapper
            className={gClasses.ML16}
            id={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.END_DATE.value}
            label={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.END_DATE.label}
            // validationType={ValidationType.Today}
            isRequired
            getDate={(value) => onDateChangehandler(VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.BETWEEN, value, true)}
            date={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE]}
            errorMessage={getDateFieldsValidationErrorMessage(errorList, `${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION},0,${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].END_DATE}`)}
          />
        </div>
        }
        {dateFieldsList?.length > 0 &&
          <Radio
            id={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FIELD_BASED_OPTIONS[0].value}
            label={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FIELD_BASED_OPTIONS[0].label}
            checked={fieldDetails?.validationData?.dateSelection?.[0]?.type === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FIELD_BASED_OPTIONS[0].value}
            onChange={() => onMainOptionChangeHandler(VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FIELD_BASED_OPTIONS[0].value)}
            className={gClasses.MT10}
          />
        }
        {fieldDetails?.validationData?.dateSelection?.[0]?.type === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.FIELD_BASED_OPTIONS[0].value &&
          <div className={gClasses.ML30}>
            <SingleDropdown
                optionList={operatorOptions}
                id={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.ID}
                placeholder={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.PLACEHOLDER}
                dropdownViewProps={{
                  labelName: `${fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_NAME]} ${VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.LABEL}`,
                  selectedLabel: selectedOperator,
                  isRequired: true,
                }}
                selectedValue={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.ID]}
                onClick={(value) => onFieldOperatorChangeHandler(value)}
                errorMessage={getDateFieldsValidationErrorMessage(errorList, `${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION},0,${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OPERATOR}`)}
            />
            {
              fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OPERATOR] && (
                <>
                  <SingleDropdown
                    id={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_1.ID}
                    optionList={firsDatetFieldsList}
                    placeholder={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_1.PLACEHOLDER}
                    selectedValue={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_1.ID]}
                    infiniteScrollProps={{
                      dataLength: dateFieldsList?.length,
                      next: loadMoreDateFields,
                      hasMore: dateFieldsList?.length < paginationDetails?.totalCount,
                      scrollableId: VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_1.ID,
                    }}
                    searchProps={{
                        searchValue: searchText,
                        onChangeSearch: searchDateFields,
                    }}
                    dropdownViewProps={{
                      labelName: VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_1.LABEL_2,
                      selectedLabel: firstDateFieldLabel,
                      isRequired: true,
                    }}
                    onClick={(value) => onDateFieldChangeHandler(value, VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_1.ID)}
                    errorMessage={getDateFieldsValidationErrorMessage(errorList, `${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION},0,${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].FIRST_FIELD_UUID}`)}

                  />
                  {/* {secondOperand} */}
                </>
              )
            }
            {
              (fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OPERATOR] ===
                VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DUAL_FIELDS_OPTION_LIST[0].value) && (
                <>
                  <SingleDropdown
                    id={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_2.ID}
                    optionList={secondDateFieldsList}
                    placeholder={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_2.PLACEHOLDER}
                    selectedValue={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.dateSelection?.[0]?.[VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_2.ID]}
                    infiniteScrollProps={{
                      dataLength: dateFieldsList?.length,
                      next: loadMoreDateFields,
                      hasMore: dateFieldsList?.length < paginationDetails?.totalCount,
                      scrollableId: VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_2.ID,
                    }}
                    searchProps={{
                        searchValue: searchText,
                        onChangeSearch: searchDateFields,
                    }}
                    dropdownViewProps={{
                      labelName: VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_2.LABEL,
                      selectedLabel: secondDateFieldLabel,
                      isRequired: true,
                    }}
                    onClick={(value) => onDateFieldChangeHandler(value, VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.DATE_FIELDS_OPERATORS.DATE_FIELDS_OPERAND_2.ID)}
                    errorMessage={getDateFieldsValidationErrorMessage(errorList, `${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION},0,${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].SECOND_FIELD_UUID}`)}

                  />
                  {/* {secondOperand} */}
                </>
              )
            }
          </div>
        }
        <Text
          content={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.OTHER_PREFERENCES}
          size={ETextSize.LG}
          className={cx(gClasses.MT16, gClasses.FontWeight500, gClasses.MB10)}
        />
        <RadioGroup
          id={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.OTHER_OPTIONS_ID}
          selectedValue={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OTHER] || getSelectedOtherPreference()}
          options={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.OTHER_OPTIONS(workingDays, nonWorkingDays)}
          onChange={(e, id, value) => onOtherOptionChangeHandler(value)}
          layout={RadioGroupLayout.stack}
          enableOptionDeselect
        />
        {((fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OTHER] === VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.OTHER_OPTIONS(workingDays, nonWorkingDays)[2].value) || !isEmpty(fieldDetails?.validationData?.allowedDay)) &&
        <div className={cx(gClasses.ML24, gClasses.MT16)}>
          <MultiDropdown
            id={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.CUSTOM_WORKING_DAYS.value}
            dropdownViewProps={{
              size: Size.md,
              placeholder: VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.CUSTOM_WORKING_DAYS.label,
              selectedLabel: getWorkingDaysLabel() || '',
              errorMessage: getDateFieldsValidationErrorMessage(errorList, `${RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].CUSTOM_WORKING_DAY}`),
            }}
            onClick={onCustomSelectHandler}
            optionList={VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.CUSTOM_WORKING_DAYS_OPTIONS}
            selectedListValue={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].CUSTOM_WORKING_DAY] || fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOWED_DAY] || []}
          />
        </div>
        }
    </>
    );
}

export default DateFieldValidationConfiguration;
