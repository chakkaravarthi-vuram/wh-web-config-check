import React from 'react';

import { FIELD_TYPES, FORM_STRINGS } from 'components/form_builder/FormBuilder.strings';
import { BS } from 'utils/UIConstants';
import EditableLabel from '../../../../../components/form_components/editable_label/EditableLabel';
import Input from '../../../../../components/form_components/input/Input';
import TextArea from '../../../../../components/form_components/text_area/TextArea';
import Dropdown from '../../../../../components/form_components/dropdown/Dropdown';
import DatePicker from '../../../../../components/form_components/date_picker/DatePicker';
import { getDropdownData } from '../../../../../utils/generatorUtils';
import RadioGroup from '../../../../../components/form_components/radio_group/RadioGroup';
import CheckBox from '../../../../../components/form_components/checkbox_group/CheckboxGroup';
import jsUtils from '../../../../../utils/jsUtility';
import { CHECKBOX_SELECT_ALL } from '../../../../../components/form_builder/FormBuilder.strings';

function UploadedRowPreview(props) {
    const { fieldDetails, className, errorMessage, onChange, onBlurHandler, workingDaysArray, rowIndex } = props;
    let { value } = props;
    const getInputFields = () => {
      const fieldType = jsUtils.get(fieldDetails, ['field_type'], null);
      if (fieldType !== FIELD_TYPES.CHECKBOX) {
        if (jsUtils.isArray(value)) [value] = value;
      }
      switch (fieldType) {
            case FIELD_TYPES.SINGLE_LINE:
            case FIELD_TYPES.NUMBER:
            case FIELD_TYPES.SCANNER:
            case FIELD_TYPES.EMAIL:
                return (
                    <Input
                        id={fieldDetails.field_uuid}
                        hideLabel
                        isRequired={fieldDetails.required}
                        className={className}
                        value={value}
                        errorMessage={errorMessage}
                        onChangeHandler={(event) => onChange(event.target.value)}
                        onBlurHandler={() => onBlurHandler()}
                    />
                );
            case FIELD_TYPES.PARAGRAPH:
                return (
                    <TextArea
                        id={fieldDetails.field_uuid}
                        hideLabel
                        className={className}
                        value={value}
                        isRequired={fieldDetails.required}
                        errorMessage={errorMessage}
                        onChangeHandler={(event) => onChange(event.target.value)}
                        onBlurHandler={() => onBlurHandler()}
                    />
                );
            case FIELD_TYPES.DROPDOWN: {
                let optionList = null;
                if (fieldDetails.values && !jsUtils.isEmpty(fieldDetails.values)) {
                    optionList = getDropdownData(fieldDetails.values);
                }
                return (
                    <Dropdown
                        id={fieldDetails.field_uuid}
                        hideLabel
                        selectedValue={value}
                        setSelectedValue
                        errorMessage={errorMessage}
                        onChange={(event) => {
                            onChange(event.target.value);
                            onBlurHandler(event.target.value);
                        }}
                        isRequired={fieldDetails.required}
                        className={className}
                        optionList={optionList}
                        isTable
                        disablePopper
                    />
                );
            }
            case FIELD_TYPES.RADIO_GROUP: {
                let optionList = null;
                if (fieldDetails.values && !jsUtils.isEmpty(fieldDetails.values)) {
                    optionList = getDropdownData(fieldDetails.values);
                }
                const option_list = [];
                if (!jsUtils.isNull(optionList)) {
                    optionList.forEach((item) => {
                        const data = {
                            label: typeof item === 'object' ? null : item,
                            value: typeof item === 'object' ? null : item,
                        };
                        typeof item === 'object' ? null : option_list.push(data);
                    });
                }
                return (
                    <RadioGroup
                        id={fieldDetails.field_uuid}
                        helperMessageId={`${fieldDetails.field_uuid}_${rowIndex}_helper_message`}
                        hideLabel
                        isRequired={fieldDetails.required}
                        selectedValue={value}
                        errorMessage={errorMessage}
                        onClick={(newValue) => {
                            onChange(newValue);
                            onBlurHandler(newValue);
                        }}
                        className={className}
                        optionList={jsUtils.isEmpty(option_list) ? optionList : option_list}
                    />
                );
            }
            case FIELD_TYPES.YES_NO: {
                return (
                    <RadioGroup
                        id={fieldDetails.field_uuid}
                        hideLabel
                        selectedValue={value}
                        errorMessage={errorMessage}
                        onClick={(value) => {
                            onChange(value);
                            onBlurHandler(value);
                        }}
                        isRequired={fieldDetails.required}
                        className={className}
                        optionList={FORM_STRINGS.YES_NO.option_list}
                    />
                );
            }
            case FIELD_TYPES.CHECKBOX: {
                let optionList = null;
                const selectedValue = value ? value.filter((eachValue) => {
                    if (fieldDetails.values && fieldDetails.values.includes(eachValue)) return true;
                    else return false;
                }) : [];
                if (fieldDetails.values && !jsUtils.isEmpty(fieldDetails.values)) {
                    optionList = getDropdownData(fieldDetails.values);
                }
                !jsUtils.isEmpty(optionList) && optionList.unshift({ label: CHECKBOX_SELECT_ALL.LABEL, value: CHECKBOX_SELECT_ALL.VALUE });
                const option_list = [];
                if (!jsUtils.isNull(optionList)) {
                    optionList.forEach((item) => {
                        const data = {
                            label: typeof item === 'object' ? null : item,
                            value: typeof item === 'object' ? null : item,
                        };
                        typeof item === 'object' ? null : option_list.push(data);
                    });
                }
                if (!jsUtils.isEmpty(optionList) && optionList?.length === ((selectedValue || []).length + 1)) {
                  selectedValue.unshift(CHECKBOX_SELECT_ALL.VALUE);
                }
                return (
                    <CheckBox
                        id={fieldDetails.field_uuid}
                        helperMessageId={`${fieldDetails.field_uuid}_${rowIndex}_helper_message`}
                        hideLabel
                        required={fieldDetails.required}
                        selectedValues={selectedValue}
                        errorMessage={errorMessage}
                        onClick={(newValue) => {
                            let values = jsUtils.isEmpty(selectedValue) ? [] : [...selectedValue];
                            if (newValue === CHECKBOX_SELECT_ALL.VALUE) {
                              const optionData = optionList.map((list) => list.value);
                              if (values.length === optionData.length) {
                                values = [];
                              } else values = optionData;
                            } else {
                              const index = values.indexOf(newValue);
                              if (index !== -1) values = values.filter((data, actualIndex) => actualIndex !== index && data !== CHECKBOX_SELECT_ALL.VALUE);
                              else values.push(newValue);
                            }
                            onChange(values);
                            onBlurHandler(values);
                        }}
                        className={className}
                        optionList={jsUtils.isEmpty(option_list) ? optionList : option_list}
                    />
                );
            }
            case FIELD_TYPES.DATE:
            case FIELD_TYPES.DATETIME: {
                const {
                    allow_working_day,
                } = fieldDetails.validations;
                return (
                    <div className={BS.P_RELATIVE}>
                    <DatePicker
                        id={fieldDetails.field_uuid}
                        hideLabel
                        isBulkUploadPreview
                        isRequired={fieldDetails.required}
                        workingDaysOnly={allow_working_day}
                        workingDays={workingDaysArray}
                        date={value}
                        className={className}
                        errorMessage={errorMessage}
                        getDate={(date) => {
                            onChange(date);
                            onBlurHandler(date);
                        }}
                        fixedStrategy
                        isTable
                        enableTime={fieldDetails.field_type === FIELD_TYPES.DATETIME}
                        validations={fieldDetails.validations}
                    />
                    </div>
                );
            }
            default:
                return (
                    <EditableLabel
                        className={className}
                        value={value}
                        onChangeHandler={(event) => onChange(event.target.value)}
                        onBlurHandler={onBlurHandler}
                        errorMessage={errorMessage}
                    />
                );
        }
    };
    return (
        getInputFields()
    );
}

export const getInputField = (value, data, fieldDetails, className, errorMessage, onChangeCell, onBlur, workingDaysArray) => {
    switch (fieldDetails.field_type) {
      case FIELD_TYPES.SINGLE_LINE:
      case FIELD_TYPES.NUMBER:
      case FIELD_TYPES.EMAIL:
        return (
          <Input
            id={fieldDetails.field_uuid}
            hideLabel
            isRequired={fieldDetails.required}
            className={className}
            value={value}
            errorMessage={errorMessage}
            onChangeHandler={(event) => onChangeCell(event.target.value)}
            onBlurHandler={() => onBlur()}
          />
        );
      case FIELD_TYPES.PARAGRAPH:
        return (
          <TextArea
            id={fieldDetails.field_uuid}
            hideLabel
            className={className}
            value={value}
            isRequired={fieldDetails.required}
            errorMessage={errorMessage}
            onChangeHandler={(event) => onChangeCell(event.target.value)}
            onBlurHandler={() => onBlur()}
          />
        );
      case FIELD_TYPES.DROPDOWN: {
        let optionList = null;
        if (fieldDetails.values && !jsUtils.isEmpty(fieldDetails.values)) {
          optionList = getDropdownData(fieldDetails.values);
        }
        return (
          <Dropdown
            id={fieldDetails.field_uuid}
            hideLabel
            selectedValue={value}
            setSelectedValue
            errorMessage={errorMessage}
            onChange={(event) => {
              onChangeCell(event.target.value);
              onBlur(event.target.value);
            }}
            isRequired={fieldDetails.required}
            className={className}
            optionList={optionList}
            isTable
            disablePopper
          />
        );
      }
      case FIELD_TYPES.RADIO_GROUP: {
        let optionList = null;
        if (fieldDetails.values && !jsUtils.isEmpty(fieldDetails.values)) {
          optionList = getDropdownData(fieldDetails.values);
        }
        const option_list = [];
        if (!jsUtils.isNull(optionList)) {
          optionList.forEach((item) => {
            const data = {
              label: typeof item === 'object' ? null : item,
              value: typeof item === 'object' ? null : item,
            };
            typeof item === 'object' ? null : option_list.push(data);
          });
        }
        return (
          <RadioGroup
            id={fieldDetails.field_uuid}
            hideLabel
            isRequired={fieldDetails.required}
            selectedValue={value}
            errorMessage={errorMessage}
            onClick={(newValue) => {
              onChangeCell(newValue);
              onBlur(newValue);
            }}
            className={className}
            optionList={jsUtils.isEmpty(option_list) ? optionList : option_list}
          />
        );
      }
      case FIELD_TYPES.YES_NO: {
        return (
          <RadioGroup
            id={fieldDetails.field_uuid}
            hideLabel
            selectedValue={value}
            errorMessage={errorMessage}
            onClick={(value) => {
              onChangeCell(value);
              onBlur(value);
            }}
            isRequired={fieldDetails.required}
            className={className}
            optionList={FORM_STRINGS.YES_NO.option_list}
          />
        );
      }
      case FIELD_TYPES.CHECKBOX: {
        let optionList = null;
        const selectedValue = value ? value.filter((eachValue) => {
          if (fieldDetails.values && fieldDetails.values.includes(eachValue)) return true;
          else return false;
        }) : [];
        if (fieldDetails.values && !jsUtils.isEmpty(fieldDetails.values)) {
          optionList = getDropdownData(fieldDetails.values);
        }
        const option_list = [];
        if (!jsUtils.isNull(optionList)) {
          optionList.forEach((item) => {
            const data = {
              label: typeof item === 'object' ? null : item,
              value: typeof item === 'object' ? null : item,
            };
            typeof item === 'object' ? null : option_list.push(data);
          });
        }
        return (
          <CheckBox
            id={fieldDetails.field_uuid}
            hideLabel
            required={fieldDetails.required}
            selectedValues={selectedValue}
            errorMessage={errorMessage}
            onClick={(newValue) => {
              const values = jsUtils.isEmpty(selectedValue) ? [] : [...selectedValue];
              const index = values.indexOf(newValue);
              if (index !== -1) values.splice(index, 1);
              else values.push(newValue);
              onChangeCell(values);
              onBlur(values);
            }}
            className={className}
            optionList={jsUtils.isEmpty(option_list) ? optionList : option_list}
          />
        );
      }
      case FIELD_TYPES.DATE:
      case FIELD_TYPES.DATETIME: {
        const {
          allow_working_day,
        } = fieldDetails.validations;
        return (
          // <div className={BS.P_RELATIVE}>
          <DatePicker
            hideLabel
            isRequired={fieldDetails.required}
            workingDaysOnly={allow_working_day}
            workingDays={workingDaysArray}
            date={value}
            className={className}
            errorMessage={errorMessage}
            getDate={(date) => {
                onChangeCell(date);
                onBlur(date);
            }}
            fixedStrategy
            enableTime={fieldDetails.field_type === FIELD_TYPES.DATETIME}
            validations={fieldDetails.validations}
          />
          // </div>
        );
      }
      default:
        return (
          <EditableLabel
            className={className}
            value={value}
            onChangeHandler={(event) => onChangeCell(event.target.value)}
            onBlurHandler={onBlur}
            errorMessage={errorMessage}
          />
        );
    }
  };

export default UploadedRowPreview;
