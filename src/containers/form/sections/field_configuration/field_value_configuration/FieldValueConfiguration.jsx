import { Checkbox, CheckboxGroup, ECheckboxSize, ETitleHeadingLevel, ETitleSize, RadioGroup, RadioGroupLayout, SingleDropdown, Size, Text, TextArea, TextInput, Title } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import PlusIconBlueNew from '../../../../../assets/icons/PlusIconBlueNew';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../utils/constants/form/form.constant';
import { RULE_TYPE } from '../../../../../utils/constants/rule/rule.constant';
import { cloneDeep, get, isEmpty, isNaN } from '../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import FieldValueRuleConfig from '../../../../form_configuration/field_value/field_value_rule_config/FieldValueRuleConfig';
import { DEFAULT_VALUE_RULE_FIELDS, TABLE_DEFAULT_VALUE_RULE_FIELDS, TABLE_EXPRESSION_RULE_FIELDS, VALUE_CONFIG_TYPES } from '../../../Form.string';
import { FIELD_TYPES } from '../FieldConfiguration.strings';
import SelectFormConfigurationRule from '../select_form_configuration_rule/SelectFormConfigurationRule';
import { DEFAULT_VALUE_FIELD_CONFIG_STRINGS } from './FieldValueConfiguration.strings';
import CurrencyDefaultValue from './currency_default_value/CurrencyDefaultValue';
import PhoneNumberDefaultValue from './phone_number_default_value/PhoneNumberDefaultValue';
import ExternalSourceSelection from '../external_source/ExternalSourceSelection';
import { MODULE_TYPES } from '../../../../../utils/Constants';
import DateTimeWrapper from '../../../../../components/date_time_wrapper/DateTimeWrapper';
import AnchorWrapper from '../../../../../components/form_components/anchor/AnchorWrapper';
import { FIELD_LIST_OBJECT } from '../basic_configuration/BasicConfiguration.constants';

function FieldValueConfiguration(props) {
  const { setFieldDetails, fieldDetails = {}, metaData = {}, moduleType, removedRuleUUID,
  setRemovedRuleUUID, tableUUID, isTableField, tableExternalRule = {}, tableData = {} } = props;
  const [isDefaultValueModalOpen, setDefaultValueModalOpen] = useState(false);
  const [fieldValueSearch, setFieldValueSearch] = useState(EMPTY_STRING);
  const [fieldList, setFieldList] = useState(fieldDetails?.[RESPONSE_FIELD_KEYS.VALUES] || []);
  const [isExternalSourceModalopen, setIsExternalSourceModalopen] = useState(false);
  const { errorList = {} } = fieldDetails;
  const { t } = useTranslation();
  const [selectedRuleName, setSelectedRuleName] = useState('');

  useEffect(() => {
    const { AUTO_FILL, RULE_DETAILS, RULE_NAME, RULE_UUID, SOURCE } = RESPONSE_FIELD_KEYS;
    const autoFill = get(fieldDetails, [AUTO_FILL]);
    const tableRuleUUID = get(tableData, [AUTO_FILL], {})?.[SOURCE] || get(tableData, [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA, RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_RULE_UUID], EMPTY_STRING);
    const ruleDetails = get(fieldDetails, [RULE_DETAILS], []);
    if (isEmpty(autoFill) || isEmpty(ruleDetails)) return;
    const rule = ruleDetails.find((r) =>
    (r[RULE_UUID] === autoFill[SOURCE] ||
      (r[RULE_UUID] === tableRuleUUID)));
    if (rule) setSelectedRuleName(rule[RULE_NAME] || '');
  }, [fieldDetails[RESPONSE_FIELD_KEYS.AUTO_FILL]]);

  useEffect(() => {
    if (fieldDetails?.fieldType === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN && !isEmpty(fieldDetails?.choiceValues) && (typeof fieldDetails.choiceValues[0] !== 'object')) {
      const constructedValues = fieldDetails?.choiceValues?.map((option) => { return { label: option.toString(), value: option }; });
      setFieldDetails({
        ...fieldDetails,
        choiceValues: constructedValues,
      });
      setFieldList(constructedValues);
    }
  }, []);

  const isStaticDefaultValueDisabled = get(fieldDetails, [RESPONSE_FIELD_KEYS.AUTO_FILL, RESPONSE_FIELD_KEYS.SOURCE]) &&
  (get(fieldDetails, [RESPONSE_FIELD_KEYS.AUTO_FILL, RESPONSE_FIELD_KEYS.TYPE]) === VALUE_CONFIG_TYPES.CALCULATIVE_RULE);

  const onDefaultValueChangeHandler = (value) => {
    let defaultValue = EMPTY_STRING;
    switch (fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
      case FIELD_TYPES.NUMBER:
        if (!isNaN(defaultValue)) {
          defaultValue = value;
        }
        break;
      default:
        defaultValue = value;
        break;
    }
    setFieldDetails({
      ...fieldDetails,
      defaultValue: defaultValue,
    });
    return defaultValue;
  };

  const searchDefaultValue = (searchValue, e) => {
    let searchText = EMPTY_STRING;
    if (e?.keyCode === 8) { // BACKSPACE
      if (!isEmpty(fieldValueSearch)) searchText = fieldValueSearch.slice(0, -1);
    } else searchText = fieldValueSearch.concat(searchValue);
    if (searchText) {
      const searchedFieldTypes = [];
      setFieldValueSearch(searchText);
      fieldDetails?.[RESPONSE_FIELD_KEYS.VALUES]?.forEach((field) => {
        if (
          field?.value?.toLowerCase().includes(searchText.toLowerCase()) ||
          field?.label?.toLowerCase().includes(searchText.toLowerCase())) {
            searchedFieldTypes?.push(field);
        }
      });
      setFieldList(searchedFieldTypes);
    } else {
      setFieldValueSearch(EMPTY_STRING);
      setFieldList(fieldDetails?.[RESPONSE_FIELD_KEYS.VALUES]);
    }
  };

  let defaultValueContent = (
      <TextInput
        id={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.ID}
        labelText={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LABEL}
        instruction={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.INSTRUCTION}
        placeholder={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.PLACEHOLDER}
        onChange={(event) => onDefaultValueChangeHandler(event?.target?.value)}
        value={fieldDetails[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
        size={Size.lg}
        readOnly={isStaticDefaultValueDisabled}
        errorMessage={errorList[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
        type={(fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.NUMBER) && FIELD_TYPES.NUMBER}
      />
  );
  switch (fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
    case FIELD_TYPES.PARAGRAPH:
      defaultValueContent = <TextArea
        id={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.ID}
        value={fieldDetails[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
        readOnly={isStaticDefaultValueDisabled}
        labelText={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LABEL}
        placeholder={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.PLACEHOLDER}
        instruction={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.INSTRUCTION}
        onChange={(event) => onDefaultValueChangeHandler(event?.target?.value)}
        errorMessage={errorList[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
        size={Size.sm}
      />;
      break;
    case FIELD_TYPES.NUMBER:
      defaultValueContent =
      <div>
        <Checkbox
          className={cx(gClasses.CenterV, gClasses.MB16)}
          isValueSelected={fieldDetails[RESPONSE_FIELD_KEYS.IS_DIGIT_FORMATTED]}
          details={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.VALUE_FORMATER.OPTION_LIST[0]}
          size={ECheckboxSize.SM}
          onClick={() =>
              setFieldDetails({
              ...fieldDetails,
              [RESPONSE_FIELD_KEYS.IS_DIGIT_FORMATTED]: !fieldDetails[RESPONSE_FIELD_KEYS.IS_DIGIT_FORMATTED],
          })}
          checkboxViewLabelClassName={cx(gClasses.FTwo13BlackV20, gClasses.CheckboxClass)}
          errorMessage={errorList[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
        />
        {defaultValueContent}
      </div>;
      break;
    case FIELD_TYPES.DROPDOWN:
    case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
      defaultValueContent =
        <SingleDropdown
          optionList={fieldList}
          onClick={(value) => {
            setFieldValueSearch(EMPTY_STRING);
            setFieldList(fieldDetails?.[RESPONSE_FIELD_KEYS.VALUES]);
            setFieldDetails({
              ...fieldDetails,
              defaultValue: value,
            });
          }}
          selectedValue={fieldDetails[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
          dropdownViewProps={{
            disabled: isStaticDefaultValueDisabled,
            labelName: DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LABEL,
            onKeyDown: (e) => searchDefaultValue(e.key, e),
            onBlur: (e) => {
              if (!e?.relatedTarget) {
                setFieldValueSearch(EMPTY_STRING);
                setFieldList(fieldDetails?.[RESPONSE_FIELD_KEYS.VALUES]);
              }
            },
            selectedLabel: fieldDetails?.defaultValue || '',
          }}
          errorMessage={errorList[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
          showReset
        />;
    break;
    case FIELD_TYPES.CHECKBOX:
      // if (tableUUID) {
      //   defaultValueContent = null;
      //   break;
      // }
      const getCheckboxOptions = () => {
        const defaultValues = cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE] || [];
        const options = cloneDeep(fieldDetails?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES]) || [];
        const modifiedOptions = options?.map((option) => {
          if (defaultValues?.includes(option?.value)) return { label: option?.label, value: option?.value, selected: true };
          else return option;
        });
        return modifiedOptions;
      };
      const onCheckboxDefaultValueChangeHandler = (value) => {
        let defaultValues = cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE] || [];
        const options = getCheckboxOptions();
        const index = options?.findIndex((option) => option?.value === value);
        options[index].selected = !options[index].selected;
        const selectedIndex = defaultValues?.findIndex((eachValue) => eachValue === value);
        if (selectedIndex > -1) defaultValues = defaultValues.slice(0, selectedIndex).concat(defaultValues.slice(selectedIndex + 1));
        else defaultValues.push(value);
        setFieldDetails({
          ...fieldDetails,
          [RESPONSE_FIELD_KEYS.VALUES]: options,
          [RESPONSE_FIELD_KEYS.DEFAULT_VALUE]: defaultValues,
        });
      };
      defaultValueContent = (
        <>
        <CheckboxGroup
          labelText={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LABEL}
          options={getCheckboxOptions()}
          onClick={(value) => onCheckboxDefaultValueChangeHandler(value)}
          layout={RadioGroupLayout.inline}
          size={ECheckboxSize.SM}
          className={gClasses.W100}
          readOnly={isStaticDefaultValueDisabled}
          errorMessage={errorList[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
        />
        <RadioGroup
          id={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.CHECKBOX.SELECT_ALL.ID}
          labelText={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.CHECKBOX.SELECT_ALL.LABEL}
          selectedValue={fieldDetails[RESPONSE_FIELD_KEYS.ALLOW_SELECT_ALL] || false}
          options={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.CHECKBOX.SELECT_ALL.OPTION_LIST}
          onChange={(_event, _id, value) => setFieldDetails({
            ...fieldDetails,
            [RESPONSE_FIELD_KEYS.ALLOW_SELECT_ALL]: value,
          })}
          layout={RadioGroupLayout.inline}
          errorMessage={errorList[RESPONSE_FIELD_KEYS.ALLOW_SELECT_ALL]}
          required
          className={gClasses.MT16}
          // enableOptionDeselect
        />
        </>
    );
    break;
    case FIELD_TYPES.RADIO_GROUP:
      defaultValueContent =
      <RadioGroup
        labelText={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LABEL}
        selectedValue={fieldDetails[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
        options={fieldDetails[RESPONSE_FIELD_KEYS.VALUES]}
        onChange={(_event, _id, value) => setFieldDetails({
          ...fieldDetails,
          defaultValue: value,
        })}
        disabled={isStaticDefaultValueDisabled}
        layout={RadioGroupLayout.inline}
        errorMessage={errorList[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
        enableOptionDeselect
      />;
      break;
    case FIELD_TYPES.YES_NO:
    defaultValueContent =
    <RadioGroup
      labelText={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LABEL}
      selectedValue={fieldDetails[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
      options={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.YES_NO_OPTIONS}
      onChange={(_event, _id, value) => setFieldDetails({
        ...fieldDetails,
        defaultValue: value,
      })}
      disabled={isStaticDefaultValueDisabled}
      layout={RadioGroupLayout.inline}
      errorMessage={errorList[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
      enableOptionDeselect
    />;
    break;
    case FIELD_TYPES.LINK:
      const errorMessageGenerator = (errorList) => {
        const errorMessage = [];
        Object.keys(errorList).forEach((error) => {
          const errorParts = error.split(',');
          errorMessage[errorParts[1]] = { ...errorMessage[errorParts[1]], [errorParts[2]]: errorList[error] };
        });
        return errorMessage;
      };
      const isMultipleValidator = () => {
        if (get(fieldDetails, [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].IS_MULTIPLE], false)) {
          return fieldDetails?.validationData?.maximumCount ? (fieldDetails[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.length || 1) < get(fieldDetails, [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA, RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MAXIMUM_COUNT], 1) : fieldDetails?.allowMultiple;
        } return false;
      };
      defaultValueContent =
      <AnchorWrapper
        id={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.ID}
        labelText={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LABEL}
        value={fieldDetails[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
        isMultiple={isMultipleValidator()}
        onAdd={(links) => {
          setFieldDetails({
            ...fieldDetails,
            defaultValue: links,
          });
        }}
        onChange={(links) => {
          if (links.length === 1 && isEmpty(links[0]?.link_text) && isEmpty(links[0]?.link_url)) {
            setFieldDetails({
              ...fieldDetails,
              defaultValue: '',
            });
          } else {
            setFieldDetails({
              ...fieldDetails,
              defaultValue: links,
            });
          }
        }}
        readOnly={isStaticDefaultValueDisabled}
        isDelete
        placeholder={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LINK.L_PLACEHOLDER}
        valuePlaceholder={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LINK.R_PLACEHOLDER}
        errorMessage={errorMessageGenerator(errorList)}
      />;
    break;
    case FIELD_TYPES.DATE:
    case FIELD_TYPES.DATETIME:
      defaultValueContent =
      <DateTimeWrapper
        label={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LABEL}
        enableTime={fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DATETIME}
        getDate={(value) => setFieldDetails({
              ...fieldDetails,
              defaultValue: value,
            })}
        disabled={isStaticDefaultValueDisabled}
        date={fieldDetails[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
        errorMessage={errorList[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
      />;
    break;
    case FIELD_TYPES.CURRENCY:
      defaultValueContent =
        <CurrencyDefaultValue
          fieldDetails={fieldDetails}
          setFieldDetails={setFieldDetails}
          errorMessage={errorList[`${RESPONSE_FIELD_KEYS.DEFAULT_VALUE},value`]}
          disabled={isStaticDefaultValueDisabled}
        />;
      break;
    case FIELD_TYPES.PHONE_NUMBER:
      defaultValueContent =
        <PhoneNumberDefaultValue
          fieldDetails={fieldDetails}
          setFieldDetails={setFieldDetails}
          errorMessage={errorList[`${RESPONSE_FIELD_KEYS.DEFAULT_VALUE},phone_number`]}
          disabled={isStaticDefaultValueDisabled}
        />;
      break;
    case FIELD_TYPES.USER_TEAM_PICKER:
        defaultValueContent = (
          <>
            <SingleDropdown
              id={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.ID}
              optionList={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.USER_SELECTOR.DEFAULT_VALUE_OPTION_LIST}
              onClick={(value) => setFieldDetails({
                ...fieldDetails,
                [RESPONSE_FIELD_KEYS.DEFAULT_VALUE]: {
                  ...fieldDetails?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE],
                  [RESPONSE_FIELD_KEYS.SYSTEM_FIELD]: value,
                },
              })}
              selectedValue={fieldDetails?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_FIELD_KEYS.SYSTEM_FIELD]}
              dropdownViewProps={{
                disabled: isStaticDefaultValueDisabled,
                labelName: DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LABEL,
              }}
              errorMessage={errorList[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_FIELD_KEYS.SYSTEM_FIELD]}
              showReset
            />
            {fieldDetails?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_FIELD_KEYS.SYSTEM_FIELD] &&
              <RadioGroup
                selectedValue={fieldDetails?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_FIELD_KEYS.OPERATION]}
                options={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.USER_SELECTOR.OPERATIONS(fieldDetails?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.ALLOW_MULTIPLE])}
                onChange={(_event, _id, value) => setFieldDetails({
                  ...fieldDetails,
                  [RESPONSE_FIELD_KEYS.DEFAULT_VALUE]: {
                    ...fieldDetails?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE],
                    [RESPONSE_FIELD_KEYS.OPERATION]: value,
                  },
                })}
                disabled={isStaticDefaultValueDisabled}
                layout={RadioGroupLayout.inline}
                errorMessage={errorList?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_FIELD_KEYS.OPERATION]}
                className={gClasses.MT16}
                enableOptionDeselect
              />
            }
          </>
        );
      break;
    case FIELD_TYPES.DATA_LIST:
      // empty div to except fields that have external source only
      defaultValueContent = (<div />);
      break;
    case FIELD_TYPES.FILE_UPLOAD:
    case FIELD_TYPES.DATA_LIST_PROPERTY_PICKER:
    case FIELD_TYPES.USER_PROPERTY_PICKER:
    case FIELD_TYPES.INFORMATION:
    case FIELD_TYPES.SCANNER:
      defaultValueContent = null;
      break;
    default: break;
  }

  const onSaveAutoFill = (rule, type, childData = null, parentData = null) => {
    const { AUTO_FILL, SOURCE, TYPE, RULE_DETAILS, RULE_UUID, RULE_NAME, CHILD_DATA } = RESPONSE_FIELD_KEYS;
    const autoFill = {
      [TYPE]: type,
      ...(isTableField && (type === VALUE_CONFIG_TYPES.EXTERNAL_DATA)) && {
        is_inherit_from_parent: true,
      },
        [SOURCE]: rule.ruleUUID,
    };
    if (type === VALUE_CONFIG_TYPES.EXTERNAL_DATA) {
      if (parentData) {
        autoFill[CHILD_DATA] = [parentData, childData].join('.');
      } else {
        autoFill[CHILD_DATA] = childData;
      }
    }

    let ruleDetails = [...get(fieldDetails, [RULE_DETAILS], [])];
    ruleDetails = ruleDetails.filter((r) => r[TYPE] === VALUE_CONFIG_TYPES.EXTERNAL_DATA || r[RULE_UUID] !== rule.ruleUUID);
    ruleDetails.push({ [RULE_UUID]: rule.ruleUUID, [RULE_NAME]: rule.ruleName });

    setFieldDetails({
      ...fieldDetails,
      [AUTO_FILL]: autoFill,
      [RULE_DETAILS]: ruleDetails,
    });
  };

  const onRemoveAutoFill = () => {
    const clonedFieldDetails = cloneDeep(fieldDetails);
    const { AUTO_FILL, SOURCE, RULE_DETAILS, RULE_UUID } = RESPONSE_FIELD_KEYS;
    const source = get(fieldDetails, [AUTO_FILL, SOURCE], '');
    setRemovedRuleUUID(source);
    delete clonedFieldDetails[AUTO_FILL];
    clonedFieldDetails[RULE_DETAILS] = get(fieldDetails, [RULE_DETAILS], []).filter((r) => r[RULE_UUID] !== source);
    setFieldDetails(clonedFieldDetails);
  };

  // Util
  const isDefaultValueRulePossible = () => {
    if (isTableField) {
      return TABLE_DEFAULT_VALUE_RULE_FIELDS.includes(fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE]);
    }
    return DEFAULT_VALUE_RULE_FIELDS.includes(fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE]);
  };

  const isExternalRulePossible = () => {
    if (moduleType === MODULE_TYPES.TASK) return false;
    if (!isTableField) return true;
    else {
      return !!tableExternalRule?.[RESPONSE_FIELD_KEYS.SOURCE];
    }
  };

  // Components
  const getValueRuleConfigModal = () => {
    if (!isDefaultValueModalOpen) return null;

     const onClose = () => {
      setDefaultValueModalOpen(false);
    };

    const onSave = (rule) => {
      onSaveAutoFill({ ruleUUID: rule.rule_uuid, ruleName: rule.rule_name }, VALUE_CONFIG_TYPES.CALCULATIVE_RULE);
      setSelectedRuleName(rule.rule_name);
    };

    return (
      <FieldValueRuleConfig
        ruleUUID={get(fieldDetails, [RESPONSE_FIELD_KEYS.AUTO_FILL, RESPONSE_FIELD_KEYS.SOURCE])}
        metaData={metaData}
        moduleType={moduleType}
        isModalOpen={isDefaultValueModalOpen}
        setIsModalOpen={setDefaultValueModalOpen}
        onClose={onClose}
        onSave={onSave}
        field={fieldDetails}
        ruleType={RULE_TYPE.DEFAULT_VALUE}
        removedRuleUUID={removedRuleUUID}
        tableUUID={tableUUID}
        ruleNameGenerate={fieldDetails?.fieldName}
      />
    );
  };

  const getAddDefaultRuleButton = () => (
    <div className={cx(gClasses.MR12)}>
      <button
        onClick={() => setDefaultValueModalOpen(true)}
        className={cx(
          gClasses.P0,
          gClasses.MT10,
          gClasses.MR12,
          gClasses.CenterV,
        )}
      >
        <PlusIconBlueNew />
        <Text className={cx(gClasses.BlueIconBtn, gClasses.ML12, gClasses.FTwo13Important)} content={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.EXPRESSION.BUTTON} />
      </button>
    </div>
  );

  const getExternalSource = (isEditMode = false) => {
    if (moduleType === MODULE_TYPES.TASK) return null;

    const onSave = (selectedRule, childData, parentData = null) => {
      if (!isEmpty(selectedRule) && !isEmpty(childData)) {
        onSaveAutoFill({ ruleUUID: selectedRule.rule_uuid, ruleName: selectedRule.rule_name }, VALUE_CONFIG_TYPES.EXTERNAL_DATA, childData, parentData);
      }
    };

    return (
    <ExternalSourceSelection
      onSave={onSave}
      fieldDetails={fieldDetails}
      tableUUID={tableUUID}
      ruleData={fieldDetails?.autoFill || tableData?.autoFill}
      tableExternalRule={tableExternalRule}
      metaData={metaData}
      moduleType={moduleType}
      isModalOpen={isExternalSourceModalopen}
      setIsModalOpen={setIsExternalSourceModalopen}
      isEditMode={isEditMode}
      isTableField={isTableField}
    />);
  };

  const getSelectedRule = () => (
    <>
      <SelectFormConfigurationRule
        onDelete={onRemoveAutoFill}
        onEdit={() => {
          if (fieldDetails?.autoFill?.type === VALUE_CONFIG_TYPES.EXTERNAL_DATA) setIsExternalSourceModalopen(true);
          else setDefaultValueModalOpen(true);
        }}
        type={fieldDetails?.autoFill?.type}
        savedRuleData={{
          ruleUUID: get(fieldDetails, [
            RESPONSE_FIELD_KEYS.AUTO_FILL,
            RESPONSE_FIELD_KEYS.SOURCE,
          ]),
          ruleName: selectedRuleName,
        }}
      />
      {isExternalSourceModalopen && getExternalSource(true)}
    </>
  );

  const isExpressionRulePossible = () => {
    if (isTableField) {
      return TABLE_EXPRESSION_RULE_FIELDS.includes(fieldDetails?.fieldType);
    }
    return fieldDetails?.fieldType !== FIELD_TYPES.DATA_LIST;
  };

  return (
    <>
      {isDefaultValueRulePossible() &&
        <>
          {(isExternalRulePossible() || isExpressionRulePossible()) && <Title
            content={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.EXPRESSION.TITLE}
            headingLevel={ETitleHeadingLevel.h4}
            className={cx(gClasses.MB16, gClasses.LabelStyle, gClasses.MB8)}
            size={ETitleSize.xs}
          />}

          <div className={cx(isEmpty(fieldDetails[RESPONSE_FIELD_KEYS.AUTO_FILL]) && gClasses.DisplayFlex, gClasses.MB16)}>
            {isEmpty(fieldDetails[RESPONSE_FIELD_KEYS.AUTO_FILL]) ?
              <>
                {isExpressionRulePossible() && getAddDefaultRuleButton()}
                {isExternalRulePossible() && (
                  <>
                    {isExpressionRulePossible() && (<Text className={cx(gClasses.MR20, gClasses.MT10, gClasses.FTwo13BlackV20)} content={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.OR} />)}
                    {getExternalSource()}
                  </>
                )}
              </>
              : getSelectedRule()}
          </div>
          {getValueRuleConfigModal()}
        </>}
        {!isEmpty(defaultValueContent) ? null :
        ((!isExternalRulePossible() && !isExpressionRulePossible()) || isEmpty(defaultValueContent)) &&
          <Title
            content={`${t('form_field_strings.validation_config.default_value_not_applicable')} '${FIELD_LIST_OBJECT(t)?.[fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]]}' ${t('form_field_strings.validation_config.fields')}.`}
            className={cx(gClasses.MB16, gClasses.FontSize13)}
            size={ETitleSize.xs}
          />
        }
      {defaultValueContent}
    </>
  );
  }

  export default FieldValueConfiguration;
