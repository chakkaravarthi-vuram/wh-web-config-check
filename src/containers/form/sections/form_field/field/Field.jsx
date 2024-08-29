import {
  CheckboxGroup,
  EPopperPlacements,
  ETextSize,
  ETooltipPlacements,
  ETooltipType,
  ErrorVariant,
  Label,
  RadioGroup,
  RadioGroupLayout,
  SingleDropdown,
  Size,
  Text,
  TextArea,
  TextInput,
  Tooltip,
  TableVariant,
} from '@workhall-pvt-lmt/wh-ui-library';
import React, { useContext, useEffect, useRef, useState } from 'react';
import parse from 'html-react-parser';
import { useTranslation } from 'react-i18next';
import Mustache from 'mustache';
import { useHistory } from 'react-router';
import cx from 'classnames/bind';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { FORM_FIELD_STRINGS } from '../FormField.string';
import { FIELD_ACTION, FORM_TYPE } from '../../../Form.string';
import { cloneDeep, get, isBoolean, isEmpty, isFiniteNumber } from '../../../../../utils/jsUtility';
import DatalistPicker from '../../../../../components/form_components/datalist_picker/DatalistPicker';
import BarCodeScanner from '../../../../../components/qr_bar_scanner/BarCodeScanner';
import gClasses from '../../../../../scss/Typography.module.scss';
import styles from './Field.module.scss';
import ScannerIcon from '../../../../../assets/icons/ScannerIcon';
import ReadOnlyField from '../readonlyfield/ReadOnlyField';
import PhoneNumber from '../../../../../components/form_components/phone_number/PhoneNumber';
import CurrencyField from '../../../../../components/form_components/currency_field/CurrencyField';
import {
  RESPONSE_FIELD_KEYS,
  RESPONSE_VALIDATION_KEYS,
} from '../../../../../utils/constants/form/form.constant';
import DocumentUpload from '../../../../../components/form_components/file_uploader/FileUploader';
import useSimplifiedFileUploadHook from '../../../../../hooks/useSimplifiedFileUploadHook';
import {
  COMMA,
  SPACE,
  EMPTY_STRING,
  HYPHEN,
} from '../../../../../utils/strings/CommonStrings';
import { generateUuid, getExtensionFromFileName } from '../../../../../utils/generatorUtils';
import { CancelToken, getUserRoutePath, isBasicUserMode } from '../../../../../utils/UtilityFunctions';
import UserPicker from '../../../../../components/user_picker/UserPicker';
import { areDateTimeStringsEqual, getCheckboxOptions, getContextType, getDatalistValidateParamData, getDeactivatedChoiceValue, getEntity, getFieldValues, getFileDocumentTYpe, getWorkingDays, TASK_CATEGORY_FLOW_TASK } from './Field.util';
import Table from '../../../../../components/form_components/table/Table';
import { FIELD_TYPES } from '../../field_configuration/FieldConfiguration.strings';
import DateTimeWrapper from '../../../../../components/date_time_wrapper/DateTimeWrapper';
import { getDmsLinkForPreviewAndDownload } from '../../../../../utils/attachmentUtils';
import ThemeContext from '../../../../../hoc/ThemeContext';
import HelpIconV2 from '../../../../../assets/icons/HelpIconV2';
import { getRenderCustomFunctions } from '../../../../../components/information_widget/InformationWidget.utils';
import { getModuleIdByModuleType } from '../../../Form.utils';
import AnchorWrapper from '../../../../../components/form_components/anchor/AnchorWrapper';
import { KEY_CODES } from '../../../../../utils/Constants';
import { getCurrencyFromAllowedCurrencyTypesNew } from '../../../../../utils/taskContentUtils';
import { DEFAULT_CURRENCY_TYPE } from '../../../../../utils/constants/currency.constant';
import NumberField from '../../../../../components/form_components/number_field/NumberField';
import Image from '../components/image/Image';
import ActionButton from '../components/action_button/ActionButton';
import { getLinkForDataListInstance } from '../readonlyfield/ReadOnlyField.util';

const {
  FIELD_UUID,
  FIELD_TYPE: FIELD_TYPE_KEY,
  FIELD_NAME,
  REQUIRED,
  VALIDATIONS,
  INSTRUCTION,
  PLACEHOLDER,
  CHOICE_VALUES,
  HELPER_TOOLTIP,
  READ_ONLY,
  TRANSLATION_DATA,
  ALLOW_SELECT_ALL,
} = RESPONSE_FIELD_KEYS;

function Field(props) {
  const {
    fieldData,
    fieldValue,
    onChangeHandler,
    formType,
    metaData,
    moduleType,
    path,
    validationMessage = null,
    hideLabel = false,
    onEdit = null,
    documentDetails,
    formData = {},
    informationFieldFormContent,
    isEditableForm,
    onImportFieldClick,
    onImportTypeClick,
    readOnly = false,
    visibility,
    rowUUID = null,
    userProfileData = {},
    column,
    serverError = {},
    tableUUID = null,
    rowIndex = null,
    rowId = null,
  } = props;

  const history = useHistory();
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const isNormalMode = isBasicUserMode(history);

  const isSystemField = fieldData?.[RESPONSE_FIELD_KEYS.IS_SYSTEM_DEFINED] && fieldData?.[RESPONSE_FIELD_KEYS.IS_EDIT_ADD_ONLY] && fieldData?.isExistingSystemField;

  const { t } = useTranslation();
  const { FIELD } = FORM_FIELD_STRINGS(t);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [fieldValueSearch, setFieldValueSearch] = useState(EMPTY_STRING);
  const [fieldValues, setFieldValues] = useState(getFieldValues(fieldData));
  const onChange = (value, action, options = {}) => {
    const options_ = options || {};
    onChangeHandler(fieldData, value, action, options_);
  };

  const [trackedWidth, setTrackedWidth] = useState({});
  const targetRef = useRef(null);
  const searchDropdownRef = useRef();

  useEffect(() => {
    if (targetRef?.current) {
      setTrackedWidth({
        width: `${targetRef?.current?.clientWidth}px`,
      });
    }
  }, [targetRef?.current?.clientWidth]);

  const getFileData = (file, file_ref_uuid, _entityType, entityId, refUuid) => {
    const fileData = {
      context_uuid: fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID],
      type: getFileDocumentTYpe(metaData),
      file_type: getExtensionFromFileName(file.name),
      file_name: file?.name?.slice(0, -1 * (file.name.length - file.name.lastIndexOf('.'))),
      file_size: file.size,
      file_ref_id: file_ref_uuid,
    };
    const file_metadata = [];
    file_metadata.push(fileData);
    const data = {
      file_metadata,
    };
    data.entity = getEntity(metaData);
    data.entity_id = metaData.instanceId;
    if (entityId) data.entity_id = entityId;
    if (metaData.datalistUuid) data.entity_uuid = metaData.datalistUuid;
    data.context_id = metaData?.dataListId || metaData.moduleId;
    if (metaData?.taskCategory === TASK_CATEGORY_FLOW_TASK) {
      data.context_id = metaData?.flowId;
    }
    data.form_uuid = metaData.formUUID;
    data.context_entity_type = getContextType(metaData);
    data.ref_uuid = metaData?.refUuid || refUuid || generateUuid();
    return data;
  };

  const onUploadFile = (res, data, file) => {
    const fileMetaData = get(data, ['file_metadata', 0], {});
    const documentId = get(res, ['file_metadata', 0, '_id'], {});
    const _file = {
      name: file.name,
      type: fileMetaData.file_type,
      size: fileMetaData.file_size,
      url: data?.url || '',
      thumbnail: `${getDmsLinkForPreviewAndDownload(
        window,
      )}/dms/display/?id=${documentId}`,
      documentId,
      refUuid: res?.ref_uuid,
    };

    const document = {
      document_id: documentId,
      entity: res.entity,
      entity_id: res.entity_id,
      ...get(res, ['file_metadata', 0], {}),
      ref_uuid: res.ref_uuid,
    };
    onChange({ ..._file, file: _file }, FIELD_ACTION.FILE_ADD, { document });
  };

  const {
    onRetryFileUpload,
    onFileUpload,
    uploadFile,
    onDeletFileUpload,
  } = useSimplifiedFileUploadHook(getFileData, onUploadFile);

  const isReadOnlyField = fieldData[READ_ONLY] || readOnly || formType === FORM_TYPE.READ_ONLY_CREATION_FORM;
  const infoFieldRef = useRef();
  const renderedTemplate = !isEditableForm ? get(fieldData, [RESPONSE_FIELD_KEYS.INFORMATION_CONTENT, RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE], EMPTY_STRING) : get(fieldData, [RESPONSE_FIELD_KEYS.INFORMATION_CONTENT, RESPONSE_FIELD_KEYS.RENDERING_TEMPLATE], EMPTY_STRING);
  const pref_locale = localStorage.getItem('application_language');

  useEffect(() => {
    if (isEditableForm && fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.INFORMATION && !isEmpty(renderedTemplate)) {
      let renderJson = {};

      if (!isEmpty(formData)) {
        renderJson = {
          ...(formData || {}),
          ...get(informationFieldFormContent, [fieldData?.[FIELD_UUID]], {}),
          ...getRenderCustomFunctions(t),
        };
      }

      try {
        const renderer = Mustache.render(renderedTemplate, renderJson);
        if (infoFieldRef && infoFieldRef.current) infoFieldRef.current.innerHTML = renderer;
      } catch (e) {
        console.log(e);
      }
    }
  }, [formData, renderedTemplate]);

  const searchFieldValues = (searchValue, e) => {
    let searchText = EMPTY_STRING;
    const optionList = getFieldValues(fieldData);
    const { SHIFT, CAPS, BACKSPACE, TAB, ENTER } = KEY_CODES;

    if ([SHIFT, CAPS, TAB, ENTER]?.includes(e?.keyCode)) {
      searchText = fieldValueSearch;
    } else if (e?.keyCode === BACKSPACE) { // BACKSPACE
      if (!isEmpty(fieldValueSearch)) searchText = fieldValueSearch.slice(0, -1);
    } else searchText = fieldValueSearch.concat(searchValue?.toString());

    if (searchText) {
      const searchedFieldTypes = [];
      setFieldValueSearch(searchText);
      const lowerSearchText = searchText.toLowerCase();
      optionList?.forEach((field) => {
        if (
          field?.value?.toString()?.toLowerCase().includes(lowerSearchText) ||
          field?.label?.toString()?.toLowerCase().includes(lowerSearchText)) {
          searchedFieldTypes?.push(field);
        }
      });
      setFieldValues(searchedFieldTypes);
    } else {
      setFieldValueSearch(EMPTY_STRING);
      setFieldValues(optionList);
    }
  };

  const getField = () => {
    const fieldLabel = hideLabel ? null : fieldData?.[TRANSLATION_DATA]?.[pref_locale]?.[FIELD_NAME] || fieldData[FIELD_NAME];
    const fieldInstructionText = hideLabel ? null : fieldData?.[TRANSLATION_DATA]?.[pref_locale]?.[INSTRUCTION] || fieldData[INSTRUCTION];
    const fieldPlaceholder = fieldData?.[TRANSLATION_DATA]?.[pref_locale]?.[PLACEHOLDER] || fieldData[PLACEHOLDER];
    const fieldHelperTooltip = hideLabel ? null : fieldData?.[TRANSLATION_DATA]?.[pref_locale]?.[HELPER_TOOLTIP] || fieldData[HELPER_TOOLTIP];
    const fieldId = rowUUID ? `${rowUUID}_${fieldData[FIELD_UUID]}` : fieldData[FIELD_UUID];
    const pickerDisplayLimit = 1;

    const fieldInstruction = !isEmpty(fieldInstructionText) ? parse(fieldInstructionText) : null;

    // const commonFieldProps = {
    //   id: fieldId,
    //   labelText: fieldLabel,
    //   label: fieldLabel,
    //   placeholder: fieldPlaceholder,
    //   instruction: fieldInstruction,
    //   helpTooltip: fieldHelperTooltip,

    //   required: fieldLabel && fieldData[REQUIRED],
    //   referenceName: fieldData?.referenceName,

    //   errorMessage: validationMessage,
    //   validationMessage,
    //   errorVariant: ErrorVariant.direct,
    //   colorScheme: isNormalMode ? colorScheme : colorSchemeDefault,
    // };

    switch (fieldData[FIELD_TYPE_KEY]) {
      case FIELD_TYPE.SINGLE_LINE:
        return (
          <TextInput
            id={fieldId}
            labelText={fieldLabel}
            required={fieldLabel && fieldData[REQUIRED]}
            placeholder={fieldPlaceholder}
            instruction={fieldInstruction}
            value={fieldValue}
            onChange={(e) => onChange(e.target?.value)}
            size={ETextSize.MD}
            readOnly={isReadOnlyField || isSystemField}
            errorVariant={ErrorVariant.direct}
            errorMessage={validationMessage}
            helpTooltip={fieldHelperTooltip}
            className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}
            colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
            referenceName={fieldData?.referenceName}
            innerLabelClass={gClasses.Margin0}
            labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 })}
          />
        );
      case FIELD_TYPE.NUMBER: {
        return (
          <NumberField
            id={fieldId}
            labelText={fieldLabel}
            required={fieldLabel && fieldData[REQUIRED]}
            instruction={fieldInstruction}
            placeholder={fieldPlaceholder}
            value={fieldValue}
            onChange={onChange}
            readOnly={isReadOnlyField || isSystemField}
            size={ETextSize.MD}
            errorVariant={ErrorVariant.direct}
            errorMessage={validationMessage}
            helpTooltip={fieldHelperTooltip}
            className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}
            colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
            referenceName={fieldData?.referenceName}
            innerLabelClass={gClasses.Margin0}
            labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 })}
            prefLocale={pref_locale}
            isDigitFormatted={fieldData.isDigitFormatted}
            allowDecimal={fieldData?.allowDecimal}
            fieldData={fieldData}
          />
        );
      }
      case FIELD_TYPE.PARAGRAPH: {
        const value = fieldValue || EMPTY_STRING;
        return (
          <TextArea
            id={fieldId}
            labelText={fieldLabel}
            required={fieldLabel && fieldData[REQUIRED]}
            placeholder={fieldPlaceholder}
            instruction={fieldInstruction}
            value={value}
            onChange={(e) => onChange(e.target?.value)}
            size={Size.sm}
            readOnly={isReadOnlyField || isSystemField}
            errorVariant={ErrorVariant.direct}
            errorMessage={validationMessage}
            helpTooltip={fieldHelperTooltip}
            className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}
            inputInnerClassName={cx({ [gClasses.NoPointerEvent]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) }, gClasses.FontWeight400)}
            colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
            referenceName={fieldData?.referenceName}
            labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0)}
          />
        );
      }
      case FIELD_TYPE.EMAIL:
        return (
          <TextInput
            id={fieldId}
            type={FIELD_TYPE.EMAIL}
            labelText={fieldLabel}
            required={fieldLabel && fieldData[REQUIRED]}
            placeholder={fieldPlaceholder}
            instruction={fieldInstruction}
            value={fieldValue}
            onChange={(e) => onChange(e.target?.value)}
            size={ETextSize.MD}
            readOnly={isReadOnlyField || isSystemField}
            errorVariant={ErrorVariant.direct}
            errorMessage={validationMessage}
            helpTooltip={fieldHelperTooltip}
            className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}
            colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
            referenceName={fieldData?.referenceName}
            innerLabelClass={gClasses.Margin0}
            labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 })}
          />
        );

      case FIELD_TYPE.CHECKBOX: {
        const optionList = getCheckboxOptions(fieldData[CHOICE_VALUES], fieldValue, isReadOnlyField, fieldData[ALLOW_SELECT_ALL]);
        const deactivatedChioce = getDeactivatedChoiceValue(optionList, fieldValue);
        const concatDeactivateOptions = Array.isArray(deactivatedChioce) ? deactivatedChioce.join(COMMA + SPACE) : EMPTY_STRING;
        return (
          <div className={styles.DeactivatedOptionFieldConatiner}>
            <CheckboxGroup
              id={fieldId}
              labelText={fieldLabel}
              required={fieldLabel && fieldData[REQUIRED]}
              instruction={fieldInstruction}
              options={optionList || []}
              layout={RadioGroupLayout.inline}
              onClick={(value) => onChange(value)}
              disabled={isReadOnlyField || isSystemField}
              errorVariant={ErrorVariant.direct}
              errorMessage={validationMessage}
              helpTooltip={fieldHelperTooltip}
              className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}
              colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
              referenceName={fieldData?.referenceName}
              labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0)}
            />
            {(concatDeactivateOptions) && (
              <Text
                content={`${FIELD.DEACTIVATED_OPTIONS} ${concatDeactivateOptions} ${FIELD.ARE_SELECTED}`}
                className={styles.DeactivateInfo}
              />
          )}
          </div>
        );
      }
      case FIELD_TYPE.RADIO_GROUP: {
        const optionList = fieldData[CHOICE_VALUES] || [];
        const deactivatedChioce = getDeactivatedChoiceValue(optionList, [fieldValue]);
        const concatDeactivateOptions = Array.isArray(deactivatedChioce) ? deactivatedChioce.join(COMMA + SPACE) : EMPTY_STRING;
        return (
          <div className={styles.DeactivatedOptionFieldConatiner}>
            <RadioGroup
              id={fieldId}
              labelText={fieldLabel}
              required={fieldLabel && fieldData[REQUIRED]}
              instruction={fieldInstruction}
              options={optionList}
              onChange={(_e, _id, value) => onChange(value)}
              selectedValue={fieldValue}
              disabled={isReadOnlyField || isSystemField}
              errorVariant={ErrorVariant.direct}
              errorMessage={validationMessage}
              helpTooltip={fieldHelperTooltip}
              className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}
              colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
              referenceName={fieldData?.referenceName}
              labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0)}
              enableOptionDeselect
            />
            {(concatDeactivateOptions) && (
              <Text
                content={`${FIELD.DEACTIVATED_OPTIONS} ${concatDeactivateOptions} ${FIELD.ARE_SELECTED}`}
                className={styles.DeactivateInfo}
              />
            )}
          </div>
        );
      }
      case FIELD_TYPE.DROPDOWN: {
        const optionsList = fieldData[CHOICE_VALUES] || [];
        const deactivatedChioce = getDeactivatedChoiceValue(optionsList, [fieldValue]);
        const concatDeactivateOptions = Array.isArray(deactivatedChioce) ? deactivatedChioce.join(COMMA + SPACE) : EMPTY_STRING;
        return (
          <div className={styles.DeactivatedOptionFieldConatiner}>
            <div ref={targetRef}>
              <SingleDropdown
                id={fieldId}
                dropdownViewProps={{
                  labelName: fieldLabel,
                  labelClassName: cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0),
                  selectedLabel: optionsList.find((o) => o.value === fieldValue)
                    ?.label,
                  disabled: isReadOnlyField || isSystemField,
                  size: Size.md,
                  onKeyDown: (e) => searchFieldValues(e.key, e),
                  referenceName: fieldData?.referenceName,
                  colorScheme: isNormalMode ? colorScheme : colorSchemeDefault,
                }}
                helpTooltip={fieldHelperTooltip}
                placeholder={fieldPlaceholder}
                selectedValue={fieldValue}
                required={fieldLabel && fieldData[REQUIRED]}
                instruction={fieldInstruction}
                optionList={cloneDeep(fieldValues)}
                onClick={async (value) => {
                  setFieldValueSearch(EMPTY_STRING);
                  setFieldValues(fieldData?.[CHOICE_VALUES]);
                  onChange(value);
                }}
                errorVariant={ErrorVariant.direct}
                errorMessage={validationMessage}
                className={cx((formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent, hideLabel && gClasses.PositionUnset)}
                getPopperContainerClassName={(isOpen) => isOpen && gClasses.ZIndex13}
                popperStyle={trackedWidth}
                colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
                showReset
                onOutSideClick={() => {
                  searchDropdownRef?.current?.click();
              }}
              />
              <button
                  ref={searchDropdownRef}
                  className={gClasses.DisplayNone}
                  onClick={() => {
                      setFieldValueSearch(EMPTY_STRING);
                      setFieldValues(fieldData?.[CHOICE_VALUES]);
                  }}
              />
            </div>
            {(concatDeactivateOptions) && (
              <Text
                content={`${FIELD.DEACTIVATED_OPTIONS} ${concatDeactivateOptions} ${FIELD.ARE_SELECTED}`}
                className={styles.DeactivateInfo}
              />
            )}
          </div>
        );
      }
      case FIELD_TYPE.YES_NO:
        return (
          <RadioGroup
            id={fieldId}
            labelText={fieldLabel}
            required={fieldLabel && fieldData[REQUIRED]}
            instruction={fieldInstruction}
            options={FIELD.YES_OR_NO_OPTIONS}
            onChange={(_e, _id, value) => onChange(value)}
            selectedValue={fieldValue}
            disabled={isReadOnlyField || isSystemField}
            errorVariant={ErrorVariant.direct}
            errorMessage={validationMessage}
            helpTooltip={fieldHelperTooltip}
            className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}
            colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
            referenceName={fieldData?.referenceName}
            enableOptionDeselect
            labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0)}
          />
        );

      case FIELD_TYPE.DATE:
      case FIELD_TYPE.DATETIME: {
        const { allow_working_day = false, allow_non_working_day = false, allowed_day = [] } = fieldData?.originalValidationData || {};
        const workingDays = getWorkingDays(fieldData, t);

        return (
          <DateTimeWrapper
            id={fieldId}
            label={fieldLabel}
            getDate={(value) => {
              if (!areDateTimeStringsEqual(fieldValue, value)) {
                onChange(value);
              }
            }}
            date={fieldValue}
            helperTooltipMessage={fieldHelperTooltip}
            disabled={isReadOnlyField || isSystemField}
            isRequired={fieldLabel && fieldData[REQUIRED]}
            instructionMessage={fieldInstruction}
            errorMessage={validationMessage}
            enableTime={fieldData[FIELD_TYPE_KEY] === FIELD_TYPE.DATETIME}
            validations={fieldData?.originalValidationData}
            className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}
            workingDaysOnly={allow_working_day || allow_non_working_day || !isEmpty(allowed_day)}
            workingDays={workingDays}
            colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
            referenceName={fieldData?.referenceName}
            labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0)}
            innerClassName={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && styles.CreationDateStyle}
          />
        );
      }
      case FIELD_TYPE.LINK: {
        const isMultipleValidator = () => {
          if (get(fieldData, [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].IS_MULTIPLE], false)) {
            return fieldData?.validations?.maximumCount ? (fieldValue?.length || 1) < get(fieldData, [RESPONSE_FIELD_KEYS.VALIDATIONS, RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MAXIMUM_COUNT], 1) : fieldData?.allowMultiple;
          } return false;
        };
        return (
          <AnchorWrapper
            id={fieldId}
            labelText={fieldLabel}
            required={fieldLabel && fieldData[REQUIRED]}
            instruction={fieldInstruction}
            linkTextClass={styles.LinkText}
            linkURLClass={styles.LinkURL}
            value={fieldValue}
            isMultiple={!isReadOnlyField && isMultipleValidator() && !isSystemField}
            maxLength={get(
              fieldData,
              [
                RESPONSE_FIELD_KEYS.VALIDATIONS,
                RESPONSE_VALIDATION_KEYS[FIELD_TYPE.LINK].MAXIMUM_COUNT,
              ],
              1,
            )}
            onAdd={(value) => onChange(value, FIELD_ACTION.ADD)}
            onChange={(value) => onChange(value, FIELD_ACTION.EDIT)}
            placeholder={FIELD.LINK.LINK_TEXT}
            valuePlaceholder={FIELD.LINK.LINK_URL}
            readOnly={isReadOnlyField || isSystemField}
            isDelete={!isReadOnlyField || isSystemField}
            errorVariant={ErrorVariant.direct}
            errorMessage={validationMessage}
            helpTooltip={fieldHelperTooltip}
            className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}
            colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
            referenceName={fieldData?.referenceName}
            inputClassName={(formType !== FORM_TYPE.CREATION_FORM && formType !== FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.MinWidth100}
            labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0)}
          />
        );
      }
      case FIELD_TYPE.USER_TEAM_PICKER: {
        const extraParams = {
          field_uuid: fieldData[FIELD_UUID],
          ...(metaData?.flowId && metaData?.stepId
            ? { flow_id: metaData?.flowId, step_id: metaData?.stepId }
            : getModuleIdByModuleType(metaData, moduleType)),
        };
        const { allowMaximumSelection = false } = fieldData.validations || {};
        const { allowMultiple = false } = fieldData || {};
        const displayLength = column > 2 ? 15 : 30;
        const normalMaxCount = allowMultiple ? 99 : 1;
        return (
          <UserPicker
            id={fieldId}
            labelText={fieldLabel}
            required={fieldLabel && fieldData[REQUIRED]}
            instruction={fieldInstruction}
            isSearchable
            maxLimit={
              allowMaximumSelection
                ? get(fieldData, ['validations', 'maximumSelection'])
                : normalMaxCount
            }
            popperPosition={EPopperPlacements.TOP}
            selectedValue={fieldValue || {}}
            onSelect={(value) => {
              onChange(value, FIELD_ACTION.SELECT);
            }}
            onRemove={(id) => onChange(id, FIELD_ACTION.REMOVE)}
            disabled={isReadOnlyField || isSystemField}
            cancelToken={new CancelToken()}
            errorVariant={ErrorVariant.direct}
            errorMessage={validationMessage}
            helpTooltip={fieldHelperTooltip}
            className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}
            colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
            referenceName={fieldData?.referenceName}
            maxCountLimit={pickerDisplayLimit}
            hideAddText
            getPopperContainerClassName={(isOpen) =>
              isOpen ? gClasses.ZIndex13 : EMPTY_STRING}
            extraParams={extraParams}
            isForm
            noDataFoundMessage={t('common_strings.no_results_found')}
            labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0, gClasses.MB8)}
            selectedValueContainerClassName={gClasses.MT0}
            displayLength={displayLength}
          />
        );
      }
      case FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN: {
        const optionsList = fieldData?.[CHOICE_VALUES]?.map((choice) => {
          return {
            label: choice.toString(),
            value: choice,
          };
        }) || [];
        const deactivatedChioce = getDeactivatedChoiceValue(optionsList, [fieldValue]);
        const concatDeactivateOptions = Array.isArray(deactivatedChioce) ? deactivatedChioce.join(COMMA + SPACE) : EMPTY_STRING;
        return (
          <div className={styles.DeactivatedOptionFieldConatiner}>
            <div ref={targetRef}>
              <SingleDropdown
                id={fieldId}
                required={fieldLabel && fieldData[REQUIRED]}
                instruction={fieldInstruction}
                dropdownViewProps={{
                  labelName: fieldLabel,
                  labelClassName: cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0),
                  selectedLabel: optionsList.find((o) => o.value === fieldValue)
                    ?.label,
                  disabled: isReadOnlyField || isSystemField,
                  size: Size.md,
                  onKeyDown: (e) => searchFieldValues(e.key, e),
                  onBlur: (e) => {
                    if (!e?.relatedTarget) {
                      setFieldValueSearch(EMPTY_STRING);
                      setFieldValues(optionsList);
                    }
                  },
                  referenceName: fieldData?.referenceName,
                  colorScheme: isNormalMode ? colorScheme : colorSchemeDefault,
                }}
                helpTooltip={fieldHelperTooltip}
                placeholder={fieldPlaceholder}
                selectedValue={fieldValue}
                optionList={optionsList}
                onClick={(value) => {
                  setFieldValueSearch(EMPTY_STRING);
                  setFieldValues(optionsList);
                  onChange(value);
                }}
                errorVariant={ErrorVariant.direct}
                errorMessage={validationMessage}
                className={cx((formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent, hideLabel && gClasses.PositionUnset)}
                getPopperContainerClassName={(isOpen) => isOpen && gClasses.ZIndex13}
                popperStyle={trackedWidth}
                colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
                showReset
              />
            </div>
            {(concatDeactivateOptions) && (
              <Text
                content={`${FIELD.DEACTIVATED_OPTIONS} ${concatDeactivateOptions} ${FIELD.ARE_SELECTED}`}
                className={styles.DeactivateInfo}
              />
            )}
          </div>
        );
      }
      case FIELD_TYPE.FILE_UPLOAD: {
        const { allowedExtensions = [], maximumFileSize } = fieldData.validations || {};
        const { allowMultiple = false } = fieldData || {};
        const noOfFiles = (fieldValue || []).length;
        return (
          <div className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}>
            <DocumentUpload
              id={fieldId}
              label={fieldLabel}
              required={fieldLabel && fieldData[REQUIRED]}
              helperText={fieldInstruction}
              isDragDrop
              isMultiple={allowMultiple}
              onRetryClick={onRetryFileUpload}
              onDeleteClick={(index, fileId) => {
                onDeletFileUpload(index, fileId);
                onChange(index, FIELD_ACTION.FILE_REMOVE, { fileId: fileId });
              }}
              uploadedFiles={fieldValue || []}
              addFile={(files) => {
                onFileUpload(files);
              }}
              thumbnailUrls={(fieldValue || [])?.map((f) => f.url)}
              allowedExtensions={allowedExtensions || userProfileData?.allowed_extensions || ['jpg']}
              maximumFileSize={maximumFileSize || userProfileData?.maximum_file_size}
              errorVariant={ErrorVariant.direct}
              errorMessage={validationMessage}
              helpTooltip={fieldHelperTooltip}
              isLoading={uploadFile?.isFileUploadInProgress}
              referenceName={fieldData?.referenceName}
              labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0)}
              readOnly={isEditableForm ? isReadOnlyField && noOfFiles > 0 : false}
              disabled={isEditableForm ? isReadOnlyField && noOfFiles === 0 : isReadOnlyField || isSystemField}
            />
          </div>
        );
      }
      case FIELD_TYPE.DATA_LIST: {
        const datalistUUID = fieldData?.dataListDetails?.dataListUUID;
        const { maximumSelection } = fieldData.validations || {};
        const { allowMultiple = false } = fieldData || {};
        const filterParams = isEditableForm && getDatalistValidateParamData(fieldData, formData, { tableUUID, rowId, rowIndex });
        const params = {
          ...(metaData?.flowId
            ? { flow_id: metaData?.flowId }
            : getModuleIdByModuleType(metaData, moduleType)),
          field_id: fieldData[RESPONSE_FIELD_KEYS.FIELD_ID] || null,
          form_uuid: metaData?.formUUID,
          instance_id: metaData?.instanceId,
          entry_id: [],
          ...(filterParams) && {
          ...filterParams.filterFieldsData,
          entry_id: [...(filterParams.entryIds || [])],
          },
        };
        const displayLength = column > 2 ? 15 : 30;
        const onChipClick = (entry) => {
          const toPath = `${getLinkForDataListInstance(
            datalistUUID,
            entry.value,
            isNormalMode,
          )}`;
          window.open(getUserRoutePath(toPath), '_blank');
        };

        return (
          <DatalistPicker
            id={fieldId}
            labelText={fieldLabel}
            selectedValue={fieldValue || []}
            required={fieldLabel && fieldData[REQUIRED]}
            instruction={fieldInstruction}
            onChange={(value) => onChange(value, FIELD_ACTION.SELECT)}
            onRemove={(id) => onChange(id, FIELD_ACTION.REMOVE)}
            getParams={() => params}
            disabled={isReadOnlyField || isSystemField}
            errorVariant={ErrorVariant.direct}
            popperPlacement={EPopperPlacements.TOP}
            errorMessage={validationMessage}
            helpTooltip={fieldHelperTooltip}
            formType={formType}
            maxCountLimit={pickerDisplayLimit}
            maxSelectionCount={allowMultiple ? maximumSelection || 99 : 1}
            className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}
            colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
            referenceName={fieldData?.referenceName}
            getPopperContainerClassName={(isOpen) => isOpen && gClasses.ZIndex13}
            labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0)}
            choiceObj={fieldData[RESPONSE_FIELD_KEYS.CHOICE_VALUE_OBJ]}
            displayLength={displayLength}
            onChipClick={onChipClick}
          />
        );
      }
      case FIELD_TYPE.DATA_LIST_PROPERTY_PICKER: {
        if (isReadOnlyField && !isFiniteNumber(fieldValue) && !isBoolean(fieldValue) && isEmpty(fieldValue)) {
          return (
            <div>
              {
                fieldLabel && (
                <div className={gClasses.CenterV}>
                  <Label
                    id={`${fieldId}_label`}
                    labelName={fieldLabel}
                    className={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 })}
                  />
                  {fieldHelperTooltip &&
                  <Tooltip
                    className={cx(gClasses.ML10, gClasses.MB8)}
                    text={fieldHelperTooltip}
                    tooltipType={ETooltipType.INFO}
                    tooltipPlacement={ETooltipPlacements.TOP}
                    icon={<HelpIconV2 />}
                  />}
                </div>)
              }
              <Text content={isEditableForm ? HYPHEN : FIELD.DATALIST_PROPERTY_PICKER_INSTRUCTION} />
              {fieldInstruction && (
                <div className={gClasses.PT4}>
                  <Text
                    content={fieldInstruction}
                    size={ETextSize.XS}
                    className="text-black-60 font-inter whitespace-normal"
                  />
                </div>
              )}
            </div>
          );
        }
        return <ReadOnlyField fieldData={fieldData} fieldValue={fieldValue} hideLabel={hideLabel} />;
      }
      case FIELD_TYPE.USER_PROPERTY_PICKER: {
        if (isReadOnlyField && !isFiniteNumber(fieldValue) && !isBoolean(fieldValue) && isEmpty(fieldValue)) {
          return (
            <div>
              {
                fieldLabel && (
                <div className={gClasses.CenterV}>
                  <Label
                    id={`${fieldId}_label`}
                    labelName={fieldLabel}
                    className={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 })}
                  />
                  {fieldHelperTooltip &&
                  <Tooltip
                    className={cx(gClasses.ML10, gClasses.MB8)}
                    text={fieldHelperTooltip}
                    tooltipType={ETooltipType.INFO}
                    tooltipPlacement={ETooltipPlacements.TOP}
                    icon={<HelpIconV2 />}
                  />}
                </div>)
              }
              <Text content={isEditableForm ? HYPHEN : FIELD.USER_PROPERTY_PICKER_INSTRUCTION} />
              {fieldInstruction && (
                <div className={gClasses.PT4}>
                  <Text
                    content={fieldInstruction}
                    size={ETextSize.XS}
                    className="text-black-60 font-inter whitespace-normal"
                  />
                </div>
              )}
            </div>
          );
        }
        return <ReadOnlyField fieldData={fieldData} fieldValue={fieldValue} hideLabel={hideLabel} />;
      }
      case FIELD_TYPE.PHONE_NUMBER: {
        return (
          <div ref={targetRef} className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}>
            <PhoneNumber
              id={fieldId}
              label={fieldLabel}
              required={fieldLabel && fieldData[REQUIRED]}
              placeholder={fieldPlaceholder}
              instruction={fieldInstruction}
              value={fieldValue}
              onChange={(value) => onChange(value)}
              disabled={isReadOnlyField || isSystemField}
              errorVariant={ErrorVariant.direct}
              errorMessage={validationMessage}
              helpTooltip={fieldHelperTooltip}
              className={cx((formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent, hideLabel && gClasses.PositionUnset)}
              colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
              referenceName={fieldData?.referenceName}
              labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0)}
              popperClassName={gClasses.ZIndex13}
              popperStyle={trackedWidth}
              defaultCountryCode={get(
                fieldData,
                [RESPONSE_FIELD_KEYS.DEFAULT_VALUE, 'country_code'],
              ) || userProfileData.default_country_code}
            />
          </div>
        );
      }
      case FIELD_TYPE.CURRENCY: {
        return (
          <div ref={targetRef} className={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}>
            <CurrencyField
              id={fieldId}
              label={fieldLabel}
              required={fieldLabel && fieldData[REQUIRED]}
              placeholder={fieldPlaceholder}
              instruction={fieldInstruction}
              value={fieldValue}
              onChange={(value) => onChange(value)}
              optionList={get(
                fieldData,
                [
                  VALIDATIONS,
                  RESPONSE_VALIDATION_KEYS[FIELD_TYPE.CURRENCY]
                    .ALLOWED_CURRENCY_TYPES,
                ],
                userProfileData.allowed_currency_types || [],
              )}
              disabled={isReadOnlyField || isSystemField}
              errorVariant={ErrorVariant.direct}
              errorMessage={validationMessage}
              helpTooltip={fieldHelperTooltip}
              className={cx((formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent, hideLabel && gClasses.PositionUnset)}
              colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
              referenceName={fieldData?.referenceName}
              labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0)}
              popperClassName={gClasses.ZIndex13}
              popperStyle={trackedWidth}
              defaultCurrencyType={
                get(fieldData, [RESPONSE_FIELD_KEYS.DEFAULT_VALUE, 'currency_type']) ||
                getCurrencyFromAllowedCurrencyTypesNew(fieldData, userProfileData.default_currency_type) ||
                DEFAULT_CURRENCY_TYPE
              }
              allowedCurrencyTypes={userProfileData.allowed_currency_types}
              allowFormatting
              fieldData={fieldData}
            />
          </div>
        );
      }
      case FIELD_TYPE.INFORMATION:
      case FIELD_TYPE.RICH_TEXT: {
        return (
          <div style={{ backgroundColor: fieldData[RESPONSE_FIELD_KEYS.BACKGROUND_COLOR] }}>
            {
              !isEditableForm && fieldLabel &&
              (<Label
                id={`${fieldId}_label`}
                labelName={fieldLabel}
                className={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 })}
              />)
            }
            {
              isEditableForm ? (
                <div className={styles.InfoField} ref={infoFieldRef} />
              ) : (
                <div className={styles.InfoField}>{(fieldValue || renderedTemplate) && parse(fieldValue || renderedTemplate)}</div>
              )
            }
          </div>
        );
      }
      case FIELD_TYPE.SCANNER: {
        return (
          <div className={styles.ScannerField}>
            {scannerOpen && (
              <BarCodeScanner
                id={`${fieldId}_scanner`}
                setIsScannerOpen={setScannerOpen}
                onChangeHandler={(_id, value) => onChange(value)}
              />
            )}
            <TextInput
              id={fieldId}
              labelText={fieldLabel}
              required={fieldLabel && fieldData[REQUIRED]}
              placeholder={fieldPlaceholder}
              instruction={fieldInstruction}
              value={fieldValue}
              onChange={(e) => onChange(e.target.value)}
              suffixIcon={
                <ScannerIcon
                  className={gClasses.CursorPointer}
                  onClick={() => setScannerOpen(true)}
                />
              }
              size={Size.md}
              readOnly={isReadOnlyField || isSystemField}
              helpTooltip={fieldHelperTooltip}
              errorMessage={validationMessage}
              inputClassName={(formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && gClasses.NoPointerEvent}
              colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
              referenceName={fieldData?.referenceName}
              labelClassName={cx({ [styles.LabelEditableLabel]: formType === FORM_TYPE.EDITABLE_FORM, [styles.LabelCreationLabel]: (formType === FORM_TYPE.CREATION_FORM || formType === FORM_TYPE.READ_ONLY_CREATION_FORM) && fieldLabel?.length > 20 }, styles.Margin0)}
            />
          </div>
        );
      }
      case FIELD_TYPE.TABLE: {
        return (
          <Table
            fieldData={fieldData}
            fieldValue={fieldValue}
            documentDetails={documentDetails}
            onChangeHandler={onChangeHandler}
            formType={formType}
            metaData={metaData}
            moduleType={moduleType}
            validationMessage={validationMessage}
            isLoading={false}
            onEdit={onEdit}
            isFormTable
            tablePath={path}
            onImportFieldClick={onImportFieldClick}
            onImportTypeClick={onImportTypeClick}
            formData={formData}
            visibility={visibility}
            colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
            userProfileData={userProfileData}
            serverError={serverError}
            tableVariant={TableVariant.NORMAL}
          />
        );
      }
      case FIELD_TYPE.IMAGE: {
        return <Image imageId={fieldData.imageId} />;
      }
      case FIELD_TYPE.BUTTON_LINK: {
        return <ActionButton fieldDetails={fieldData} isViewOnly />;
      }
      default:
        break;
    }

    return null;
  };

  return getField();
}

export default Field;
