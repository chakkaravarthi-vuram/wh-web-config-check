import React, { useRef, useState, useEffect } from 'react';
import {
  DropdownList,
  EPopperPlacements,
  Label,
  Popper,
  RadioGroup,
  SingleDropdown,
  Size,
  TextInput,
  Checkbox,
  ECheckboxSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from './BasicConfiguration.strings';
import styles from './BasicConfiguration.module.scss';
import { FIELD_LIST, NON_ML_SUGGESTION_FIELDS } from './BasicConfiguration.constants';
import { cloneDeep, isEmpty, get } from '../../../../../utils/jsUtility';
import { getFieldAutocomplete } from '../../../../../axios/apiService/fieldAutoComplete.apiService';
import { ALLOW_CHECKBOX_FIELDS, FIELD_GROUPING, fieldLabelSuggestionListHandler, getInitialFieldDataByFieldType } from './BasicConfiguration.utils';
import { useClickOutsideDetector } from '../../../../../utils/UtilityFunctions';
import { getFieldTypeSuggestion } from '../../../../../axios/apiService/fieldTypeSuggestion.apiService';
import { FIELD_TYPES } from '../FieldConfiguration.strings';
import SelectionFieldComponent from './selection_fields_component/SelectionFieldComponent';
import { getSharedPropertyWarningText } from '../FieldConfiguration.utils';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';
import DatalistSelectorBasicConfiguration from './datalist_selector_basic_configuration/DatalistSelectorBasicConfiguration';
import PickerBasicConfiguration from './picker_basic_configuration/PickerBasicConfiguration';
import gClasses from '../../../../../scss/Typography.module.scss';
import { EMPTY_STRING, ENTITY } from '../../../../../utils/strings/CommonStrings';
import InformationWidget from '../../../../../components/information_widget/InformationWidget';
import { MODULE_TYPES } from '../../../../../utils/Constants';
import { PROPERTY_PICKER_ARRAY } from '../../../../../utils/constants/form.constant';
import FieldTypeSuggestion from './FieldTypeSuggestion';
import { getContextType } from '../../form_field/field/Field.util';
import { VALIDATION_CONFIG_STRINGS } from '../validation_and_visibility_configuration/validation_configuration/ValidationConfiguration.strings';

let cancelForLabelSuggestion;
export const getCancelTokenForLabelSuggestion = (cancelToken) => {
  cancelForLabelSuggestion = cancelToken;
};

let cancelForFieldTypeSuggestion;
export const getCancelTokenForFieldTypeSuggestion = (cancelToken) => {
  cancelForFieldTypeSuggestion = cancelToken;
};

function BasicConfiguration(props) {
  const { setFieldDetails, fieldDetails = {}, metaData = {}, moduleType = MODULE_TYPES.FLOW, tableColumnConfig = null, isTable, isUniqueColumn } = props;
  const { errorList = {}, tableUUID } = fieldDetails;
  const [search, setSearch] = useState(EMPTY_STRING);
  const { t } = useTranslation();

  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [fieldNameSuggestion, setFieldNameSuggestion] = useState(false);
  const [fieldNameSuggestionsLoading, setFieldNameSuggestionsLoading] = useState(false);
  const [fieldTypeSearch, setFieldTypeSearch] = useState(EMPTY_STRING);
  const [fieldList, setFieldList] = useState(FIELD_LIST(t, isTable));
  const [customWidth, setCustomWidth] = useState({});

  console.log('check field type', fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]);
  useEffect(() => {
    setFieldTypeSearch(EMPTY_STRING);
    setFieldList(FIELD_LIST(t, isTable));
    if (PROPERTY_PICKER_ARRAY.includes(fieldDetails?.fieldType) || (fieldDetails?.fieldType === FIELD_TYPES.INFORMATION) || (fieldDetails?.readOnly)) {
      setFieldDetails({
        ...fieldDetails,
        required: false,
      });
    }
  }, [fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]]);

  const targetRef = useRef(null);
  const dropdownListRef = useRef(null);
  const textInputRef = useRef(null);
  useEffect(() => {
    if (textInputRef?.current) {
      setCustomWidth({
        width: `${textInputRef?.current?.clientWidth}px`,
      });
    }
  }, [textInputRef?.current?.clientWidth]);

  const isSuggestionField = !NON_ML_SUGGESTION_FIELDS.includes(RESPONSE_FIELD_KEYS.FIELD_TYPE);

  const [fieldTypeSuggestion, setFieldTypeSuggestion] = useState({
    disableFieldTypeSuggestion: false,
    isFieldSuggestionEnabled: false,
    fieldTypeData: [],
    initialFieldType: fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE],
  });

  // useEffect(() => {
  //   !isEmpty(fieldTypeSuggestion?.fieldTypeData) && setFieldDetails(
  //     getInitialFieldDataByFieldType(fieldTypeSuggestion?.fieldTypeData?.fieldType, fieldDetails, t),
  //     true,
  //   );
  // }, [fieldTypeSuggestion?.fieldTypeData]);

  const [isDlOptionListEmpty, setIsDlOptionListEmpty] = useState(false);

  const fieldType = fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE];

  useClickOutsideDetector(
    dropdownListRef,
    () => {
      setIsPopperOpen(false);
    },
  );

  const getFieldNameAndTypeSuggestion = (label) => {
    const postData = {
      text: label,
    };
    if (!isEmpty(fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE])) postData.field_type = fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE];

    if (cancelForLabelSuggestion) {
      cancelForLabelSuggestion();
    }
    if (!isEmpty(label)) {
      setFieldNameSuggestionsLoading(true);
      getFieldAutocomplete(postData, getCancelTokenForLabelSuggestion)
        .then((response) => {
          if (!isEmpty(response?.fieldNameSuggestions)) {
            setIsPopperOpen(true);
            setFieldNameSuggestion(fieldLabelSuggestionListHandler(response?.fieldNameSuggestions));
            setFieldNameSuggestionsLoading(false);
          }
        })
        .catch((err) => {
          if (err && (err.code === 'ERR_CANCELED')) return;
          setFieldNameSuggestionsLoading(false);
        });
        if (fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_NAME]?.length <= 1) {
          setFieldTypeSuggestion({ ...fieldTypeSuggestion, fieldTypeData: [] });
        }
        if (cancelForFieldTypeSuggestion) {
          cancelForFieldTypeSuggestion();
        }
        if (!(fieldTypeSuggestion.disableFieldTypeSuggestion) && (label?.length > 1) && isEmpty(fieldDetails?.fieldUUID)) {
          getFieldTypeSuggestion(postData, getCancelTokenForFieldTypeSuggestion)
            .then((fieldTypeData) => {
              if (fieldTypeData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
                setFieldTypeSuggestion({ ...fieldTypeSuggestion, fieldTypeData: fieldTypeData, isFieldSuggestionEnabled: true, initialFieldType: fieldType });
              } else {
                setFieldTypeSuggestion({ ...fieldTypeSuggestion, fieldTypeData: [], isFieldSuggestionEnabled: true, initialFieldType: fieldType });
              }
            })
            .catch((err) => {
              console.log('field type suggestion error', err);
            });
        }
    }
  };

  let customFields = null;
  switch (fieldType) {
    case FIELD_TYPES.DATA_LIST:
      customFields =
        <DatalistSelectorBasicConfiguration
          fieldDetails={fieldDetails}
          setFieldDetails={setFieldDetails}
        />;
    break;
    case FIELD_TYPES.DATA_LIST_PROPERTY_PICKER:
    case FIELD_TYPES.USER_PROPERTY_PICKER:
      customFields =
        <PickerBasicConfiguration
          fieldDetails={fieldDetails}
          setFieldDetails={setFieldDetails}
          metaData={metaData}
          setIsDlOptionListEmpty={setIsDlOptionListEmpty}
          moduleType={moduleType}
          isTable={isTable}
          tableUUID={tableUUID}
        />;
    break;
    case FIELD_TYPES.INFORMATION:
      const entityData = {
        entity_id: fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_ID] ||
        fieldDetails?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS]?.[0]?.entity_id,
        entity: ENTITY.FIELD_METADATA,
      };

      const contextData = {
        context_id: metaData?.moduleId,
        context_entity_type: getContextType(metaData, moduleType),
      };

      const addDocumentHandler = (document) => {
        console.log('add handler document', document);
        const existingInsertedDocuments = cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS] || [];
        existingInsertedDocuments.push(document);
        setFieldDetails({
          ...fieldDetails,
          infoFieldImageRefUUID: document.ref_uuid,
          [RESPONSE_FIELD_KEYS.INFORMATION_DATA]: {
            ...(fieldDetails?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA] || {}),
            [RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS]: existingInsertedDocuments,
          },
        });
      };

      customFields =
        <InformationWidget
          label={BASIC_FORM_FIELD_CONFIG_STRINGS(t).INFORMATION_FIELD.LABEL}
          onChangeHandler={(event, fieldIds) => {
            setFieldDetails({
              ...fieldDetails,
              [RESPONSE_FIELD_KEYS.INFORMATION_CONTENT]: {
                [RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE]: event?.target?.value,
              },
              [RESPONSE_FIELD_KEYS.INFORMATION_DATA]: {
                ...(fieldDetails?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA] || {}),
                [RESPONSE_FIELD_KEYS.INSERTED_FIELDS]: fieldIds,
              },
            });
          }}
          description={get(fieldDetails, [RESPONSE_FIELD_KEYS.INFORMATION_CONTENT, RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE], null)}
          informationData={get(fieldDetails, [RESPONSE_FIELD_KEYS.INFORMATION_DATA], null)}
          metaData={metaData}
          refUuid={fieldDetails.infoFieldImageRefUUID}
          moduleType={moduleType}
          entityData={entityData}
          contextData={contextData}
          addDocumentHandler={addDocumentHandler}
          errorMessage={errorList?.[RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE]}
        />;
    break;
    case FIELD_TYPES.TABLE:
      customFields = tableColumnConfig;
      break;
    default:
       if (FIELD_GROUPING.SELECTION_FIELDS.includes(fieldType)) {
          customFields = (
            <SelectionFieldComponent
            fieldDetails={fieldDetails}
            setFieldDetails={setFieldDetails}
            isLookupField={(fieldType === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN) ||
            (fieldDetails?.[RESPONSE_FIELD_KEYS.IS_SYSTEM_DEFINED] &&
              fieldDetails?.[RESPONSE_FIELD_KEYS.IS_EDIT_ADD_ONLY])}
            />
          );
       }
       break;
  }

  let readOnlyInformation = EMPTY_STRING;
  let noSelectorsInformation = EMPTY_STRING;

  switch (fieldType) {
    case FIELD_TYPES.DATA_LIST_PROPERTY_PICKER:
        readOnlyInformation = BASIC_FORM_FIELD_CONFIG_STRINGS(t).DATALIST_SELECTOR.PICKER.READ_ONLY;
        if (isTable) {
            noSelectorsInformation = BASIC_FORM_FIELD_CONFIG_STRINGS(t).DATALIST_SELECTOR.PICKER.NO_DATA_LIST_SELECTOR_TABLE_FEILD;
        } else {
            noSelectorsInformation = BASIC_FORM_FIELD_CONFIG_STRINGS(t).DATALIST_SELECTOR.PICKER.NO_DATA_LIST_SELECTOR_FORM_FEILD;
        }
        break;
    case FIELD_TYPES.USER_PROPERTY_PICKER:
        readOnlyInformation = BASIC_FORM_FIELD_CONFIG_STRINGS(t).USER_SELECTOR.PICKER.READ_ONLY;
        if (isTable) {
            noSelectorsInformation = BASIC_FORM_FIELD_CONFIG_STRINGS(t).USER_SELECTOR.PICKER.NO_DATA_LIST_PICKER_TABLE_FEILD;
        } else {
            noSelectorsInformation = BASIC_FORM_FIELD_CONFIG_STRINGS(t).USER_SELECTOR.PICKER.NO_DATA_LIST_PICKER_FORM_FEILD;
        }
        break;
    default: break;
  }

  const isPropertyPickerField = PROPERTY_PICKER_ARRAY.includes(fieldType);
  const hideReadOnlyAndRequired = isPropertyPickerField || [FIELD_TYPES.INFORMATION, FIELD_TYPES.TABLE].includes(fieldType);

  const getPropertyPickerAlert = () => {
    if (!isPropertyPickerField) return null;
    return (
      <div className={cx(gClasses.MB16)}>
        <ul
          role="alert"
          className={cx(styles.PickerInformation)}
        >
          <li className={!isDlOptionListEmpty && gClasses.CenterVImportant}>
            <span className={gClasses.FTwo10}>
              {readOnlyInformation}
            </span>
          </li>
          {isDlOptionListEmpty && (
            <li>
              <span className={gClasses.FTwo10}>
              {noSelectorsInformation}
              </span>
            </li>
          )}
        </ul>
      </div>
    );
  };

  const getSuggestionSpecific = () => {
    if (!isSuggestionField) return null;
    return (
      <>
        <div>
        { !isPropertyPickerField &&
        <div ref={textInputRef}>
          <TextInput
            labelText={BASIC_FORM_FIELD_CONFIG_STRINGS(t).LABEL}
            value={fieldDetails[RESPONSE_FIELD_KEYS.FIELD_NAME]}
            className={styles.FieldInput}
            onChange={(event) => {
              setFieldDetails({
                ...fieldDetails,
                fieldName: event?.target?.value,
              });
              if (isSuggestionField) getFieldNameAndTypeSuggestion(event?.target?.value);
            }}
            errorMessage={errorList?.[RESPONSE_FIELD_KEYS.FIELD_NAME]}
            required={fieldDetails?.fieldType !== FIELD_TYPES.INFORMATION}
            readOnly={fieldDetails?.[RESPONSE_FIELD_KEYS.IS_SYSTEM_DEFINED]}
            onBlurHandler={() => {
              cancelForLabelSuggestion?.();
            }}
          />
        </div>
        }
        {fieldDetails[RESPONSE_FIELD_KEYS.FORM_COUNT] > 1 && getSharedPropertyWarningText()}
        </div>
        <Popper
        style={customWidth}
        className={styles.FieldLabelSuggestionPopper}
        targetRef={targetRef}
        open={isPopperOpen}
        placement={EPopperPlacements.BOTTOM_START}
        content={
          <div ref={dropdownListRef}>
            <DropdownList
                onClick={(value) => {
                  setFieldDetails({
                    ...fieldDetails,
                    fieldName: value,
                  });
                  setIsPopperOpen(false);
                }}
                optionList={fieldNameSuggestion}
                isLoadingOptions={fieldNameSuggestionsLoading}
            />
          </div>
        }
        />
        <FieldTypeSuggestion
        setFieldDetails={setFieldDetails}
        fieldDetails={fieldDetails}
        fieldTypeSuggestion={fieldTypeSuggestion}
        setFieldTypeSuggestion={setFieldTypeSuggestion}
        />
      </>
    );
  };

  const searchFieldType = (searchValue, e) => {
    let searchText = EMPTY_STRING;
    if (e?.keyCode === 8) { // BACKSPACE
      if (!isEmpty(fieldTypeSearch)) searchText = fieldTypeSearch.slice(0, -1);
    } else searchText = fieldTypeSearch.concat(searchValue);
    if (searchText) {
      const searchedFieldTypes = [];
      setFieldTypeSearch(searchText);
      FIELD_LIST(t, isTable)?.forEach((field) => {
        if (
          field?.value?.toLowerCase().includes(searchText.toLowerCase()) ||
          field?.label?.toLowerCase().includes(searchText.toLowerCase())) {
            searchedFieldTypes?.push(field);
        }
      });
      setFieldList(searchedFieldTypes);
    } else {
      setFieldTypeSearch(EMPTY_STRING);
      setFieldList(FIELD_LIST(t, isTable));
    }
  };

  const getCheckBoxId = () => {
    const fieldType = fieldDetails?.fieldType;
    return (fieldType === FIELD_TYPES.NUMBER) ? 'allow_decimal_checkbox' : 'allow_multiple_checkbox';
  };

  const allowCheckboxHandler = (id) => {
    if (id === 'allow_decimal_checkbox') {
      if (fieldDetails?.validationData?.allowDecimal) delete fieldDetails?.validationData?.allowedDecimalPoints;
      setFieldDetails({
      ...fieldDetails,
      allowDecimal: !fieldDetails?.allowDecimal,
      validationData: {
          ...fieldDetails?.validationData || {},
          ...(!fieldDetails?.allowDecimal) ?
          { allowedDecimalPoints: 2 } :
          {},
      },
      });
    } else {
      setFieldDetails({
        ...fieldDetails,
        allowMultiple: !fieldDetails?.allowMultiple,
      });
    }
  };

  const getCheckBoxLabel = () => {
    switch (fieldDetails?.fieldType) {
      case FIELD_TYPES.NUMBER:
        return VALIDATION_CONFIG_STRINGS(t).ALLOW_DECIMAL.OPTION_LIST[0];
      case FIELD_TYPES.LINK:
        return VALIDATION_CONFIG_STRINGS(t).ALLOW_MULTIPLE_LINKS.OPTION_LIST[0];
      case FIELD_TYPES.FILE_UPLOAD:
        return VALIDATION_CONFIG_STRINGS(t).ALLOW_MULTIPLE_UPLOADS.OPTION_LIST[0];
      default:
        return VALIDATION_CONFIG_STRINGS(t).ALLOW_MULTIPLE_DATA_LIST.OPTION_LIST[0];
    }
  };

  return (
    <div>
      {getPropertyPickerAlert()}
      {getSuggestionSpecific()}
      <Label
        labelName={BASIC_FORM_FIELD_CONFIG_STRINGS(t).FIELD_TYPE.LABEL}
        isRequired
        className={styles.FieldTypeLabel}
      />
      <SingleDropdown
        id={BASIC_FORM_FIELD_CONFIG_STRINGS(t).FIELD_TYPE.ID}
        optionList={fieldList}
        onClick={(value) => {
          console.log('onBlurCALLED!!!');
          setIsDlOptionListEmpty(false);
          setFieldDetails(getInitialFieldDataByFieldType(value, fieldDetails, t), true);
        }
        }
        placeholder={BASIC_FORM_FIELD_CONFIG_STRINGS(t).FIELD_TYPE.PLACEHOLDER}
        selectedValue={fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE]}
        dropdownViewProps={{
          disabled: fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
          onKeyDown: (e) => searchFieldType(e.key, e),
          onBlur: (e) => {
            console.log('onBlurCALLED', e);
            if (!e?.relatedTarget) {
              setFieldTypeSearch(EMPTY_STRING);
              setFieldList(FIELD_LIST(t, isTable));
            }
          },
        }}
        searchProps={{
          searchPlaceholder: BASIC_FORM_FIELD_CONFIG_STRINGS(t).FIELD_TYPE.SEARCH_FIELD_TYPE,
          searchValue: search,
          onChangeSearch: (event) => setSearch(event?.target?.value),
          removeSearchIcon: true,
        }}
        errorMessage={errorList?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]}
        className={cx(styles.W288, gClasses.ZIndex2)}
        noDataFoundMessage={BASIC_FORM_FIELD_CONFIG_STRINGS(t).FIELD_TYPE.NO_DATA_FOUND}
        getPopperContainerClassName={() => gClasses.ZIndex2}
      />
      {/* {(!isEmpty(fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) && !fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_UUID]) && (
      <div className={styles.FieldTypeMLInstruction}>
        <InfoCircleNew />
        <span className={styles.FieldTypeInstruction}>{BASIC_FORM_FIELD_CONFIG_STRINGS(t).FIELD_TYPE.HELPER_MESSAGE}</span>
      </div>
      )
      } */}
      {customFields}
      {!hideReadOnlyAndRequired &&
        <>
          <RadioGroup
            labelText={BASIC_FORM_FIELD_CONFIG_STRINGS(t).READ_ONLY.LABEL}
            options={BASIC_FORM_FIELD_CONFIG_STRINGS(t).READ_ONLY.OPTIONS}
            selectedValue={fieldDetails[RESPONSE_FIELD_KEYS.READ_ONLY]}
            onChange={(_event, _id, value) => {
              if (value === true) {
                setFieldDetails({
                  ...fieldDetails,
                  [RESPONSE_FIELD_KEYS.READ_ONLY]: value,
                  [RESPONSE_FIELD_KEYS.REQUIRED]: false,
                  hideFieldIfNull: fieldDetails?.hideFieldIfNull || false,
                });
              } else {
                setFieldDetails({
                  ...fieldDetails,
                  [RESPONSE_FIELD_KEYS.READ_ONLY]: value,
                });
              }
            }}
            onKeyDown={(_event, _id, value) => {
              if (value === true) {
                setFieldDetails({
                  ...fieldDetails,
                  [RESPONSE_FIELD_KEYS.READ_ONLY]: value,
                  [RESPONSE_FIELD_KEYS.REQUIRED]: false,
                });
              } else {
                setFieldDetails({
                  ...fieldDetails,
                  [RESPONSE_FIELD_KEYS.READ_ONLY]: value,
                });
              }
            }}
            className={styles.FieldRequiredLabel}
            size={Size.lg}
            errorMessage={errorList?.readOnly}
            required
            disabled={isUniqueColumn}
          />
          <RadioGroup
            labelText={BASIC_FORM_FIELD_CONFIG_STRINGS(t).REQUIRED.LABEL}
            options={BASIC_FORM_FIELD_CONFIG_STRINGS(t).REQUIRED.OPTIONS}
            selectedValue={!fieldDetails?.readOnly ? fieldDetails[RESPONSE_FIELD_KEYS.REQUIRED] : null}
            onChange={(_event, _id, value) => setFieldDetails({
              ...fieldDetails,
              [RESPONSE_FIELD_KEYS.REQUIRED]: value,
            })}
            onKeyDown={(_event, _id, value) => setFieldDetails({
              ...fieldDetails,
              [RESPONSE_FIELD_KEYS.REQUIRED]: value,
            })}
            className={styles.FieldRequiredLabel}
            size={Size.lg}
            errorMessage={errorList?.required}
            disabled={fieldDetails?.readOnly}
            required
          />
          {ALLOW_CHECKBOX_FIELDS.includes(fieldDetails?.fieldType) &&
          <Checkbox
            id={getCheckBoxId()}
            className={cx(gClasses.MT16, gClasses.CenterV)}
            isValueSelected={getCheckBoxId() === 'allow_decimal_checkbox' ? fieldDetails?.allowDecimal : fieldDetails?.allowMultiple}
            details={getCheckBoxLabel()}
            size={ECheckboxSize.LG}
            onClick={() => allowCheckboxHandler(getCheckBoxId())}
            checkboxViewLabelClassName={cx(gClasses.FTwo13BlackV20, gClasses.CheckboxClass, styles.CheckboxClass)}
          />}
        </>
      }
    </div>
  );
}
export default BasicConfiguration;
