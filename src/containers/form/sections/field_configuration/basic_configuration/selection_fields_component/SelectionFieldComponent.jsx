import { Button, ColorVariant, EButtonSizeType, ETextSize, Label, SingleDropdown, Size, Text, TextInput, Variant, toastPopOver, EToastType } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import styles from './SelectionFieldComponent.module.scss';
import { DEFAULT_OPTION_DATA, getValueTypeOptions } from './SelectionFieldComponent.constants';
import ThemeContext from '../../../../../../hoc/ThemeContext';
import { isBasicUserMode, useClickOutsideDetector } from '../../../../../../utils/UtilityFunctions';
import { cloneDeep, isEmpty, isNaN } from '../../../../../../utils/jsUtility';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from '../BasicConfiguration.strings';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';
import PlusIconNew from '../../../../../../assets/icons/PlusIconV2';
import DeleteIcon from '../../../../../../assets/icons/apps/DeleteIcon';
import { FIELD_TYPES } from '../../FieldConfiguration.strings';
import { getLookupList } from '../../../../../../axios/apiService/lookUp.apiService';
import { INITIAL_PAGE, MAX_PAGINATION_SIZE } from '../../../../../../utils/constants/form.constant';
// import DateTimeWrapper from '../../../../../../components/date_time_wrapper/DateTimeWrapper';

function SelectionFieldComponent(props) {
  const { setFieldDetails, fieldDetails = {}, isLookupField } = props;
  const { errorList } = fieldDetails;
  const history = useHistory();
  const { t } = useTranslation();
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const wrapperRef = useRef(null);
  console.log('ertyuiop[]', fieldDetails, errorList?.[RESPONSE_FIELD_KEYS.VALUES]);

  const [paginationDetails, setPaginationDetails] = useState([]);
  const [searchText, setSearchText] = useState(EMPTY_STRING);

  const fetchLookupList = (params, savedField = false) => {
      getLookupList(params).then((res) => {
        const { lookupList = [], lookupPaginationDetails = {} } = res;
        console.log('getDateFields fields err', res);
        if (params?.page > 1) {
          setFieldDetails({
            ...fieldDetails,
            [RESPONSE_FIELD_KEYS.LOOKUP_LIST]: [...fieldDetails?.[RESPONSE_FIELD_KEYS.LOOKUP_LIST] || [], ...lookupList],
          });
            setPaginationDetails(lookupPaginationDetails);
        } else {
          if (savedField) {
            const selectedLookup = lookupList?.find((lookup) =>
              lookup.value === fieldDetails?.customLookupId || lookup.value === fieldDetails?.valueMetadata?.customLookupId);
            setFieldDetails({
              ...fieldDetails,
              [RESPONSE_FIELD_KEYS.LOOKUP_LIST]: [...lookupList],
              [RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_NAME]: fieldDetails?.customLookupName || fieldDetails?.valueMetadata?.customLookupName || fieldDetails?.lookup_name,
              [RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_ID]: fieldDetails?.customLookupId || fieldDetails?.valueMetadata?.customLookupId,
              [RESPONSE_FIELD_KEYS.VALUES]: selectedLookup?.[RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_OPTIONS],
            });
          } else {
            setFieldDetails({
              ...fieldDetails,
              [RESPONSE_FIELD_KEYS.LOOKUP_LIST]: [...lookupList],
            });
          }
          setPaginationDetails(lookupPaginationDetails);
        }
      }).catch((err) => {
        console.log('getDateFields fields err', err);
      });
  };

  const loadMoreLookups = () => {
    console.log('lookuphasmoreloadMoreLookups');
    fetchLookupList({
        page: paginationDetails.page + 1,
        size: MAX_PAGINATION_SIZE,
        ...(!isEmpty(searchText)) ? { search: searchText } : null,
    });
  };

  const searchLookup = (event) => {
    const searchText = event?.target?.value || EMPTY_STRING;
    setSearchText(searchText);
    fetchLookupList({
        page: INITIAL_PAGE,
        size: MAX_PAGINATION_SIZE,
        ...(!isEmpty(searchText)) ? { search: searchText } : null,
    });
  };

  useEffect(() => {
    if (fieldDetails?.fieldType === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN) {
      if (fieldDetails?.fieldUUID && fieldDetails?.lookup_name && (typeof fieldDetails.choiceValues[0] !== 'object')) {
        // fetchLookupList({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE, search: fieldDetails?.customLookupName || fieldDetails?.valueMetadata?.customLookupName || fieldDetails?.lookup_name }, true);

        // lookupValues are constructed into label-value pairs
        const constructedValues = fieldDetails?.choiceValues?.map((option) => { return { label: option.toString(), value: option }; });
        setFieldDetails({
          ...fieldDetails,
          [RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_NAME]: fieldDetails?.customLookupName || fieldDetails?.valueMetadata?.customLookupName || fieldDetails?.lookup_name,
          [RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_ID]: fieldDetails?.customLookupId || fieldDetails?.valueMetadata?.customLookupId,
          [RESPONSE_FIELD_KEYS.VALUES]: constructedValues,
        });
      } else if (!fieldDetails?.fieldUUID) {
        fetchLookupList({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
      }
      }
  }, [fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE], fieldDetails?.lookup_name]);

  const isBasicUser = isBasicUserMode(history);
  const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
  const valueOptions = getValueTypeOptions(t);

  const deleteOption = (index) => {
    const options = (cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.VALUES]) || [];

    // check if this option is used as a default value, if so show warning popup
    const defaultValue = fieldDetails?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE] || null;
    const option = options[index];
    const isOptionUsedAsDefaultValue = [defaultValue].flat(1).some((v) => option?.value === v);
    if (defaultValue && isOptionUsedAsDefaultValue) {
      const { ERRORS } = BASIC_FORM_FIELD_CONFIG_STRINGS(t);
      toastPopOver({
        title: `${ERRORS.OPTION} '${option.label}' ${ERRORS.REMOVE_DEFAULT_VALUE_TITLE}`,
        subtitle: ERRORS.REMOVE_DEFAULT_VALUE_SUBTITLE,
        toastType: EToastType.error,
      });
      return;
    }

    if (options?.[index]) {
      setFieldDetails({
        ...fieldDetails,
        [RESPONSE_FIELD_KEYS.VALUES]: [...options.slice(0, index), ...options.slice(index + 1)],
      });
    }
  };
  const onOptionLabelChange = (index, label) => {
    const options = (cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.VALUES] || []);
    if (!options[index][RESPONSE_FIELD_KEYS.VALUE_EDITED]) {
      const valueType = fieldDetails?.[RESPONSE_FIELD_KEYS.VALUE_TYPE] || fieldDetails?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE];
      switch (valueType) {
        case valueOptions[0].value:
          options[index].value = label;
        break;
        case valueOptions[1].value:
          if (!isNaN(label)) {
            options[index].value = !isEmpty(label) ? (!isNaN(Number(label)) ? Number(label) : 0) : '';
          }
        break;
        default: break;
      }
    }
    options[index].label = label;
    setFieldDetails({
      ...fieldDetails,
      [RESPONSE_FIELD_KEYS.VALUES]: options,
    });
  };

  const onOptionValueChange = (index, value) => {
    const options = (cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.VALUES] || []);
    if (!isEmpty(options)) {
      if ((fieldDetails?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] !== FIELD_TYPES.DATE) ||
        ((fieldDetails?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] === FIELD_TYPES.DATE) &&
        !(cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.VALUES]?.[index]?.value?.includes(value)))) {
          options[index].value = value;
          options[index][RESPONSE_FIELD_KEYS.VALUE_EDITED] = true;
          setFieldDetails({
            ...fieldDetails,
            [RESPONSE_FIELD_KEYS.VALUES]: options,
          });
      }
    }
  };

  const onValueTypeChange = (valueType) => {
    console.log('fieldOptionsfieldOptions', valueType);
    if (valueType === fieldDetails?.valueType) return;
    const fieldOptions = cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.VALUES]?.map((option) => {
      return {
        ...option,
        value: EMPTY_STRING,
      };
    });
    setFieldDetails({
      ...fieldDetails,
      [RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE]: valueType,
      [RESPONSE_FIELD_KEYS.VALUE_TYPE]: valueType,
      [RESPONSE_FIELD_KEYS.VALUES]: fieldOptions,
    });
  };

  useClickOutsideDetector(wrapperRef, () => setIsPopperOpen(false));

  const getSelectedLabel = () => {
    let label = '';
    valueOptions.find((option) => {
      if (option.value === (fieldDetails?.[RESPONSE_FIELD_KEYS.VALUE_TYPE]) || (option.value === fieldDetails?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE])) {
        label = option.label;
        return true;
      }
      return false;
    });
    return label;
  };

  const valueTypeOptions = () => {
    console.log('fieldOptionsfieldOptionsasdfasdfasdf', isPopperOpen);
    return (
      <SingleDropdown
        optionList={valueOptions}
        dropdownViewProps={{
            className: cx(styles.ValueType, gClasses.Scale08),
            variant: Variant.borderLess,
            colorScheme: colorSchema,
            colorVariant: ColorVariant.fill,
            size: Size.sm,
            disabled: !isEmpty(fieldDetails?.fieldUUID) || !isEmpty(fieldDetails?.fieldUuid),
            selectedLabel: getSelectedLabel(),
        }}
        selectedValue={fieldDetails?.[RESPONSE_FIELD_KEYS.VALUE_TYPE] || fieldDetails?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE]}
        className={cx(gClasses.WhiteSpaceNoWrap)}
        getPopperContainerClassName={(isOpen) => isOpen && cx(styles.ValueTypePopper)}
        onClick={onValueTypeChange}
        getClassName={(isPopperVisible) => {
              if (isPopperVisible) return gClasses.ZIndex8;
              return EMPTY_STRING;
        }}
      />
    );
  };

  const getValueComponent = (value, index) => {
    switch (fieldDetails?.valueType || fieldDetails?.choiceValueType) {
      case valueOptions[1].value:
        return (
          <TextInput
            id={BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_ID}
            value={!isLookupField ? (value?.value) : (value?.value || value)}
            onChange={(event) => {
              const { value } = event.target;
              const regex = /^-?\d*\.?\d*$/;
              if (regex.test(value)) {
                const hasMultipleNegatives = (value.match(/-/g) || []).length > 1;
                const hasMultipleDecimals = (value.match(/\./g) || []).length > 1;

                if (!hasMultipleNegatives && !hasMultipleDecimals) {
                  onOptionValueChange(index, value);
                }
              }
            }}
            errorMessage={errorList?.[`choiceValues,${index},value`]}
            readOnly={isLookupField}
            className={gClasses.W100}
          />
        );
        // case valueOptions[2].value:
        //   return (
        //     <DateTimeWrapper
        //       errorMessage={errorList?.[`choiceValues,${index},value`]}
        //       getDate={(value) => onOptionValueChange(index, value)}
        //       date={!isLookupField ? (value?.value) : (value?.value || value)}
        //       disabled={isLookupField}
        //       hideLabel
        //       innerClassName={gClasses.W100Important}
        //       className={gClasses.W100}
        //     />
        //   );
      default:
        return (
          <TextInput
            id={BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_ID}
            value={!isLookupField ? (value?.value) : (value?.value || value)}
            onChange={(event) => {
              onOptionValueChange(index, event?.target?.value);
            }}
            errorMessage={errorList?.[`choiceValues,${index},value`]}
            readOnly={isLookupField}
            className={gClasses.W100}
          />
        );
    }
  };

  const getTableData = () => {
    console.log('asdfasdfasdf');
    return cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.VALUES]?.map((value, index) => (
        <>
        <div className={cx(styles.TableRowClass, index > 0 && gClasses.MT8)}>
          <TextInput
            value={!isLookupField ? (value?.label) : (value?.label || value)}
            onChange={(event) => {
              onOptionLabelChange(index, event?.target?.value);
            }}
            errorMessage={errorList?.[`choiceValues,${index},label`]}
            readOnly={isLookupField}
            labelText={index === 0 && BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.OPTION_LABEL}
            innerLabelClass={gClasses.MB8}
            required={index === 0}
            className={cx(gClasses.W100, styles.LabelHeightClass)}
          />
          <div className={gClasses.W100}>
          {index === 0 &&
            <div className={cx(gClasses.CenterV, styles.ValueLabelGroup)}>
              <Label
                labelName={BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_LABEL}
                isRequired
                innerLabelClass={gClasses.MB8}
              />
              {!isLookupField &&
                <div className={gClasses.MB10}>
                  {valueTypeOptions()}
                </div>
              }
            </div>
          }
            <div className={gClasses.DisplayFlex}>
              {getValueComponent(value, index)}
              <div>
                {!isLookupField &&
                  <DeleteIcon className={cx(gClasses.CursorPointer, gClasses.OutlineNoneOnFocus, gClasses.AlignSelfCenter, gClasses.ML10)} onClick={() => deleteOption(index)} />
                }
              </div>
            </div>
          </div>
        </div>
        {errorList?.[`choiceValues,${index}`] &&
        <Text
          size={ETextSize.SM}
          className={styles.ErrorMessage}
          content={errorList?.[`choiceValues,${index}`]}
        />}
        </>
      ));
  };

  console.log('lookuphasmore',
  fieldDetails?.[RESPONSE_FIELD_KEYS.LOOKUP_LIST],
  paginationDetails,
  fieldDetails?.[RESPONSE_FIELD_KEYS.LOOKUP_LIST]?.length < paginationDetails?.totalCount);

  return (
    <>
    {isLookupField &&
      <>
        <Label
          labelName={BASIC_FORM_FIELD_CONFIG_STRINGS(t).LOOKUP_LIST.LABEL}
          isRequired
          className={gClasses.MT16}
        />
        <SingleDropdown
          id={BASIC_FORM_FIELD_CONFIG_STRINGS(t).LOOKUP_LIST.ID}
          optionList={fieldDetails?.[RESPONSE_FIELD_KEYS.LOOKUP_LIST] || []}
          onClick={(value, label) => {
            console.log('asdfasdfasdf', value, label);
            const selectedLookup = fieldDetails?.[RESPONSE_FIELD_KEYS.LOOKUP_LIST]?.find((lookup) =>
              lookup.value === value);
            setFieldDetails({
            ...fieldDetails,
            [RESPONSE_FIELD_KEYS.VALUES]: selectedLookup?.[RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_OPTIONS],
            [RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_NAME]: label,
            [RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_ID]: value,
          });
        }
          }
          placeholder={BASIC_FORM_FIELD_CONFIG_STRINGS(t).LOOKUP_LIST.PLACEHOLDER}
          selectedValue={fieldDetails?.[RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_ID]}
          dropdownViewProps={{
            disabled: !isEmpty(fieldDetails?.fieldUUID) || !isEmpty(fieldDetails?.fieldUuid),
            selectedLabel: fieldDetails?.[RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_NAME],
          }}
          errorMessage={errorList?.[`valueMetadata,${[RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_ID]}`]}
          className={cx(styles.LookupList)}
          infiniteScrollProps={{
            dataLength: fieldDetails?.[RESPONSE_FIELD_KEYS.LOOKUP_LIST]?.length || 0,
            next: loadMoreLookups,
            hasMore: fieldDetails?.[RESPONSE_FIELD_KEYS.LOOKUP_LIST]?.length < paginationDetails?.totalCount,
            scrollableId: 'infinite_Scroll',
          }}
          searchProps={{
              searchValue: searchText,
              onChangeSearch: searchLookup,
          }}
        />
      </>
      }
      {(!isLookupField || (isLookupField && fieldDetails?.[RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_NAME])) &&
        <div id="selection_field" className={styles.TableContainer}>
          <Label
            labelName={BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.LABEL}
            isRequired
            className={cx(styles.FieldTypeLabel, gClasses.MB8, gClasses.DisplayFlex)}
          />
          {(isEmpty(cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.VALUES])) ?
            (
              <Button
                // type={EButtonType.SECONDARY}
                onClickHandler={() => {
                  const options = (cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.VALUES] || []);
                  options.push({
                    ...DEFAULT_OPTION_DATA,
                    [RESPONSE_FIELD_KEYS.VALUE_EDITED]: false,
                  });
                  console.log('asdfasdfasdfasdfasf options', options);
                  setFieldDetails({
                    ...fieldDetails,
                    [RESPONSE_FIELD_KEYS.VALUES]: options,
                  });
                }}
                size={EButtonSizeType.SM}
                icon={<PlusIconNew />}
                buttonText="Add Option"
                className={styles.AddOptionsButton}
                noBorder
                colorSchema={colorSchema}
              />
            ) : (
            <div className={!isEmpty(cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.VALUES]) && styles.OptionsContainer}>
              {getTableData()}
              {!isLookupField && (
                <Button
                // type={EButtonType.SECONDARY}
                onClickHandler={() => {
                  const options = (cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.VALUES] || []);
                  options.push({
                    ...DEFAULT_OPTION_DATA,
                    [RESPONSE_FIELD_KEYS.VALUE_EDITED]: false,
                  });
                  setFieldDetails({
                    ...fieldDetails,
                    [RESPONSE_FIELD_KEYS.VALUES]: options,
                  });
                }}
                size={EButtonSizeType.SM}
                icon={<PlusIconNew />}
                buttonText="Add More Option"
                className={cx(styles.AddOptionsButton, gClasses.MT8)}
                noBorder
                colorSchema={colorSchema}
                />
              )}
            </div>
            )
          }
          {errorList?.[RESPONSE_FIELD_KEYS.VALUES] &&
            <Text
              content={errorList?.[RESPONSE_FIELD_KEYS.VALUES]}
              size={ETextSize.XS}
              className={cx(gClasses.RedV22, gClasses.WhiteSpaceNormal, gClasses.PT4)}
            />
            }
        </div>
      }
    </>
  );
}
export default SelectionFieldComponent;
