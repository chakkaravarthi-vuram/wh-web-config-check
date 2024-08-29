import React, { useEffect, useState, useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import { cloneDeep, get, isEmpty } from 'utils/jsUtility';
import { getUserProfileData } from 'utils/UtilityFunctions';
import BarCodeScanner from 'components/qr_bar_scanner/BarCodeScanner';
import ScannerIcon from 'assets/icons/ScannerIcon';
import { ErrorVariant, ETextSize, TextInput, TextArea, Size, SingleDropdown, MultiDropdown, EPopperPlacements } from '@workhall-pvt-lmt/wh-ui-library';
import { STATIC_VALUE_CONSANTS } from './StaticValue.constants';
import styles from './StaticValue.module.scss';
import PhoneNumber from '../form_components/phone_number/PhoneNumber';
import { RESPONSE_FIELD_KEYS } from '../../utils/constants/form/form.constant';
import { generateEventTargetObject, generateUuid, getExtensionFromFileName } from '../../utils/generatorUtils';
import DateTimeWrapper from '../date_time_wrapper/DateTimeWrapper';
import UserPicker from '../user_picker/UserPicker';
import { CancelToken } from '../../utils/UtilityFunctions';
import DatalistPicker from '../form_components/datalist_picker/DatalistPicker';
import AnchorWrapper from '../form_components/anchor/AnchorWrapper';
import CurrencyField from '../form_components/currency_field/CurrencyField';
import { FORM_TYPES } from '../../utils/constants/form.constant';
import { NUMBERS_DOT_COMMA_MINUS_REGEX } from '../../utils/strings/Regex';
import { KEY_NAMES, MODULE_TYPES } from '../../utils/Constants';
import { COMMA } from '../../utils/strings/CommonStrings';
import ThemeContext from '../../hoc/ThemeContext';
import DocumentUpload from '../form_components/file_uploader/FileUploader';
import useSimplifiedFileUploadHook from '../../hooks/useSimplifiedFileUploadHook';
import { getDmsLinkForPreviewAndDownload } from '../../utils/attachmentUtils';
import { getSelectedLabels } from './StaticValue.utils';

function StaticValue(props) {
  const { t } = useTranslation();
  const {
    fieldType,
    onStaticValueChange,
    staticValue,
    staticValueError,
    errorList = {},
    dropdownOptionList = [],
    id,
    path,
    childFieldDetails,
    parentId,
    allowedCurrencyList,
    defaultCurrencyType,
    defaultCountryCode,
    disabled,
    fileUploadProps: {
      contextId,
      fileEntityId,
      fileEntityUuid,
      fileEntity,
      fileEntityType,
      docDetails,
      maximumFileSize,
      allowedExtensions,
      isMultiple,
      refUuid,
    },
    metaData,
    showReset = false,
  } = props;

  const userProfileData = getUserProfileData();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [eachKeyStroke, seteachKeyStroke] = useState('');
  const { colorSchemeDefault } = useContext(ThemeContext);

  const globalKeyDownHandler = (event) => {
    if ([FIELD_TYPES.NUMBER, FIELD_TYPES.CURRENCY].includes(fieldType)) {
      seteachKeyStroke(event.key);
    }
  };

  useEffect(() => {
    if ([FIELD_TYPES.NUMBER, FIELD_TYPES.CURRENCY].includes(fieldType)) {
      document.addEventListener('keydown', globalKeyDownHandler);
      return (() => document.removeEventListener('keydown', globalKeyDownHandler));
    }
    return () => {};
  }, []);

  const onSelectionStaticValueSelected = (value) => {
    if (fieldType === FIELD_TYPES.CHECKBOX) {
      console.log('checkboxList onSelectionStaticValueSelected', staticValue);
      const checkboxList = isEmpty(staticValue)
        ? []
        : cloneDeep(staticValue);
      if (!checkboxList.includes(value)) checkboxList.push(value);
      else checkboxList.splice(checkboxList.indexOf(value), 1);
      console.log('checkboxList', checkboxList);
      const valueEvent = {
        target: {
          value: checkboxList,
          id,
          fieldType,
        },
      };
      onStaticValueChange(valueEvent);
    } else onStaticValueChange(generateEventTargetObject(id, value));
  };

  const onFieldValueChange = (value, additionalProps = {}) => {
    onStaticValueChange(generateEventTargetObject(id, value, additionalProps));
  };

  const getFileData = (file, file_ref_uuid, _entityType, entityId, responseRefUuid) => {
    const fileData = {
      type: fileEntityType,
      file_type: getExtensionFromFileName(file.name, true),
      file_name: file?.name?.slice(
        0,
        -1 * (file.name.length - file.name.lastIndexOf('.')),
      ),
      file_size: file?.size,
      file_ref_id: file_ref_uuid,
    };

    const file_metadata = [];
    file_metadata.push(fileData);
    const data = {
      file_metadata,
    };
    data.entity = fileEntity;
    data.context_id = contextId;
    data.entity_id = fileEntityId || entityId;
    if (fileEntityUuid) data.entity_uuid = fileEntityUuid;
    data.ref_uuid = refUuid || responseRefUuid || generateUuid();
    return data;
  };

  const onRemoveStaticFile = (index, fileId) => {
    const clonedData = cloneDeep(staticValue) || [];
    const clonedDocs = cloneDeep(docDetails) || {};
    let docMetadata = cloneDeep(docDetails?.uploadedDocMetadata) || [];
    const removedDocs = cloneDeep(docDetails?.removedDocList) || [];
    if (index > -1) {
        clonedData.splice(index, 1);
        docMetadata = docMetadata?.filter((eachDoc) => eachDoc?.document_id !== fileId);
        removedDocs.push(fileId);
    }
    clonedDocs.uploadedDocMetadata = docMetadata;
    clonedDocs.removedDocList = removedDocs;

    onStaticValueChange(generateEventTargetObject(id, clonedData, { docDetails: clonedDocs }));
};

  const {
    onRetryFileUpload,
    onFileUpload,
    documentDetails,
    uploadFile,
    onDeletFileUpload,
    // files,
  } = useSimplifiedFileUploadHook(getFileData, null);

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
    _file.file = _file;
    const responseMetaData = get(res, ['file_metadata', 0], {});
    const document = {
      upload_signed_url: responseMetaData?.upload_signed_url?.s3_key,
      document_id: documentId,
      type: fileMetaData?.type,
    };
    const clonedData = cloneDeep(staticValue) || [];
    const currentData = { file: { ..._file, file: _file } };

    const clonedDocuments =
      cloneDeep(docDetails?.uploadedDocMetadata) || [];
    const clonedRemovedDocList =
      cloneDeep(docDetails?.removedDocList) || [];
    clonedDocuments.push(document);

    currentData.docDetails = {
      entity: fileEntity,
      entity_id: res.entity_id,
      ref_uuid: res.ref_uuid,
      removedDocList: clonedRemovedDocList,
      uploadedDocMetadata: clonedDocuments,
    };
    clonedData.push(currentData.file);
    onStaticValueChange(generateEventTargetObject(id, clonedData, { docDetails: currentData?.docDetails, refUuid: res.ref_uuid }));
  };

  useEffect(() => {
    if (!isEmpty(documentDetails?.data)) {
        onUploadFile(documentDetails, documentDetails?.data, documentDetails?.file);
    }
}, [documentDetails?.file_metadata,
    documentDetails?.file_metadata?.length]);

  const getValuesField = () => {
    switch (fieldType) {
      case FIELD_TYPES.SINGLE_LINE:
      case FIELD_TYPES.EMAIL:
        return (
          <TextInput
            id={id}
            placeholder={fieldType === FIELD_TYPES.SINGLE_LINE ?
              STATIC_VALUE_CONSANTS(t).INPUT_PLACEHOLDER : STATIC_VALUE_CONSANTS(t).EMAIL_PLACEHOLDER}
            value={staticValue}
            onChange={onStaticValueChange}
            size={ETextSize.MD}
            errorVariant={ErrorVariant.direct}
            errorMessage={staticValueError}
            inputClassName={cx(gClasses.InputHeight36, gClasses.WhiteBackground)}
            colorScheme={colorSchemeDefault}
            readOnly={disabled}
          />
        );
      case FIELD_TYPES.NUMBER:
        return (
          <TextInput
            id={id}
            placeholder={STATIC_VALUE_CONSANTS(t).NUMBER_PLACEHOLDER}
            value={staticValue}
            onChange={(event) => {
              const { value } = event.target;
                if (
                  value &&
                  (!NUMBERS_DOT_COMMA_MINUS_REGEX.test(value))
                ) return;

                const dotOccurrences = (value.match(/\./g) || []).length;
                const minusOccurrences = (value.match(/-/g) || []).length;
                const minusPosition = value.indexOf('-');
                const lastDigit = value[value.length - 1];
                if (dotOccurrences > 1 || minusOccurrences > 1) return;
                if (minusPosition > 0) return;
                if (lastDigit === COMMA) return;

                if (value.replace(/[^0-9-]/g, '').length <= 15 || eachKeyStroke === KEY_NAMES.BACKSPACE || eachKeyStroke === KEY_NAMES.DELETE) {
                  onFieldValueChange(value);
                }
            }}
            size={ETextSize.MD}
            errorVariant={ErrorVariant.direct}
            errorMessage={staticValueError}
            colorScheme={colorSchemeDefault}
            inputClassName={gClasses.WhiteBackground}
            readOnly={disabled}
          />
        );
      case FIELD_TYPES.PHONE_NUMBER:
        return (
          <PhoneNumber
            id={id}
            placeholder={STATIC_VALUE_CONSANTS(t).PHONE_PLACEHOLDER}
            value={staticValue}
            onChange={onFieldValueChange}
            errorVariant={ErrorVariant.direct}
            errorMessage={staticValueError}
            colorScheme={colorSchemeDefault}
            popperClassName={gClasses.ZIndex13}
            disabled={disabled}
            defaultCountryCode={get(
              childFieldDetails,
              [RESPONSE_FIELD_KEYS.DEFAULT_VALUE, 'country_code'],
            ) || defaultCountryCode || userProfileData.default_country_code}
          />
        );
      case FIELD_TYPES.PARAGRAPH:
        return (
          <TextArea
            id={id}
            placeholder={STATIC_VALUE_CONSANTS(t).INPUT_PLACEHOLDER}
            value={staticValue}
            onChange={onStaticValueChange}
            size={Size.sm}
            errorVariant={ErrorVariant.direct}
            errorMessage={staticValueError}
            className={styles.bgColor}
            colorScheme={colorSchemeDefault}
            disabled={disabled}
          />
        );
      case FIELD_TYPES.DROPDOWN:
      case FIELD_TYPES.RADIO_GROUP:
      case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
      case FIELD_TYPES.YES_NO:
        return (
          <div>
            <SingleDropdown
              id={id}
              placeholder={STATIC_VALUE_CONSANTS(t).SELECTION_PLACEHOLDER}
              selectedValue={staticValue}
              optionList={dropdownOptionList}
              errorVariant={ErrorVariant.direct}
              errorMessage={staticValueError}
              onClick={(value) => onFieldValueChange(value)}
              colorScheme={colorSchemeDefault}
              showReset={showReset}
              dropdownViewProps={{
                disabled,
              }}
            />
          </div>
        );
      case FIELD_TYPES.CHECKBOX:
        return (
          <MultiDropdown
            id={id}
            dropdownViewProps={{
              selectedLabel: getSelectedLabels(dropdownOptionList, staticValue),
              placeholder: STATIC_VALUE_CONSANTS(t).SELECTION_PLACEHOLDER,
              errorMessage: staticValueError,
              disabled,
            }}
            optionList={dropdownOptionList}
            onClick={onSelectionStaticValueSelected}
            selectedListValue={staticValue}
            errorMessage={staticValueError}
            placeholder={STATIC_VALUE_CONSANTS(t).SELECTION_PLACEHOLDER}
            colorScheme={colorSchemeDefault}
          />
        );

      case FIELD_TYPES.DATE:
      case FIELD_TYPES.DATETIME:
        return (
          <DateTimeWrapper
            id={id}
            date={staticValue}
            errorMessage={staticValueError}
            enableTime={fieldType === FIELD_TYPES.DATETIME}
            getDate={(value) => {
              const valueEvent = {
                target: {
                  id,
                  value: value,
                  fieldType,
                },
              };
              onStaticValueChange(valueEvent);
            }}
            colorScheme={colorSchemeDefault}
            disabled={disabled}
          />
        );
      case FIELD_TYPES.USER_TEAM_PICKER:
        return (
          <UserPicker
            id={id}
            isSearchable
            maxLimit={99}
            popperPosition={EPopperPlacements.AUTO}
            selectedValue={staticValue}
            onSelect={onFieldValueChange}
            onRemove={(userOrTeamId) => {
              onFieldValueChange(userOrTeamId, { removeUserValue: true });
            }}
            cancelToken={new CancelToken()}
            errorVariant={ErrorVariant.direct}
            errorMessage={staticValueError}
            colorScheme={colorSchemeDefault}
            maxCountLimit={1}
            isUsers
            hideAddText
            noDataFoundMessage={t('common_strings.no_results_found')}
            disabled={disabled}
            displayLength={15}
          />
        );
      case FIELD_TYPES.CURRENCY:
        return (
            <CurrencyField
              id={id}
              placeholder={STATIC_VALUE_CONSANTS(t).CURRENCY_PLACEHOLDER}
              errorVariant={ErrorVariant.direct}
              errorMessage={staticValueError}
              defaultCurrencyType={defaultCurrencyType}
              value={staticValue || {}}
              onChange={(currencyObject) => {
                const valueEvent = {
                  target: {
                    id,
                    fieldType,
                    value: {
                      value: currencyObject?.value || '',
                      currency_type: currencyObject?.currency_type || defaultCurrencyType,
                    },
                  },
                };
                onStaticValueChange(valueEvent);
              }
              }
              optionList={allowedCurrencyList}
              allowFormatting
              colorScheme={colorSchemeDefault}
              disabled={disabled}
            />
        );
      case FIELD_TYPES.LINK:
        const getLinkError = () => {
          if (isEmpty(errorList)) return [];
          const errorPath = `${path},${id}`;
          const errorKeys = Object.keys(errorList).filter((k) => k.startsWith(errorPath));
          const n = staticValue?.length || 0;
          if (errorKeys.length === 1 && n <= 1) {
            return [{ link_text: t('common_strings.value_required_error') }];
          }

          const error = Array(n).fill(cloneDeep({}));
          errorKeys.forEach((key) => {
            const errorParts = key.split(',');
            if (errorParts?.length === 4) {
              error[Number(errorParts[2])] = { ...error[Number(errorParts[2])], [errorParts[3]]: errorList[key] };
            }
          });
          return error;
        };
        return (
          <AnchorWrapper
            id={id}
            value={staticValue || []}
            linkTextClass={styles.LinkText}
            linkURLClass={styles.LinkURL}
            inputClassName={styles.LinkClass}
            errorMessage={getLinkError(staticValueError)}
            placeholder={STATIC_VALUE_CONSANTS(t).LINK_TEXT_PLACEHOLDER}
            valuePlaceholder={STATIC_VALUE_CONSANTS(t).LINK_URL_PLACEHOLDER}
            onChange={(value) => {
              const valueEvent = {
                target: {
                  id,
                  value: value,
                },
              };
              onStaticValueChange(valueEvent);
            }}
            isDelete
            isMultiple
            errorVariant={ErrorVariant.direct}
            colorScheme={colorSchemeDefault}
            readOnly={disabled}
          />
        );
      case FIELD_TYPES.DATA_LIST:
        const params = {
          field_id: childFieldDetails?.field_id || childFieldDetails?._id || childFieldDetails?.id,
          entry_id: [],
        };

        if (!isEmpty(parentId)) {
          if (metaData?.childModuleType === MODULE_TYPES.FLOW) {
            params.flow_id = metaData?.childModuleId;
          } else if (metaData?.childModuleType === MODULE_TYPES.DATA_LIST) {
            params.data_list_id = metaData?.childModuleId;
          } else {
            params.flow_id = parentId;
          }
        }

        return (
          <DatalistPicker
            id={id}
            selectedValue={staticValue || []}
            onChange={(dlObj) => {
              onFieldValueChange(
                dlObj?.value,
                { label: dlObj?.label, value: dlObj?.value, id: dlObj?.id },
              );
            }}
            onRemove={(dlId) => {
              onFieldValueChange(
                dlId,
                { removeDlValue: true, value: dlId, id: dlId },
              );
            }}
            getParams={() => params}
            errorVariant={ErrorVariant.direct}
            popperPlacement={EPopperPlacements.AUTO}
            errorMessage={staticValueError}
            formType={FORM_TYPES.EDITABLE_FORM}
            maxCountLimit={1}
            maxSelectionCount={99}
            getPopperContainerClassName={(isOpen) => isOpen && gClasses.ZIndex13}
            choiceObj={childFieldDetails[RESPONSE_FIELD_KEYS.CHOICE_VALUE_OBJ]}
            colorScheme={colorSchemeDefault}
            disabled={disabled}
            displayLength={15}
          />
        );
      case FIELD_TYPES.SCANNER:
        return (
          <div className={styles.ScannerField}>
            {isScannerOpen && (
              <BarCodeScanner
                id={`${id}_scanner`}
                setIsScannerOpen={setIsScannerOpen}
                onChangeHandler={(_id, value) => onFieldValueChange(value)}
              />
            )}
            <TextInput
              id={id}
              value={staticValue}
              onChange={onStaticValueChange}
              suffixIcon={
                <ScannerIcon
                  className={gClasses.CursorPointer}
                  onClick={() => setIsScannerOpen(true)}
                />
              }
              size={Size.md}
              errorMessage={staticValueError}
              colorScheme={colorSchemeDefault}
              disabled={disabled}
            />
          </div>
        );
      case FIELD_TYPES.FILE_UPLOAD:
          return (
            <DocumentUpload
                isDragDrop
                isMultiple={isMultiple}
                onRetryClick={onRetryFileUpload}
                onDeleteClick={(index, fileId) => {
                    onDeletFileUpload(index, fileId);
                    onRemoveStaticFile(index, fileId);
                }}
                addFile={(files) => {
                    onFileUpload(files);
                }}
                uploadedFiles={staticValue || []}
                allowedExtensions={allowedExtensions}
                thumbnailUrls={(staticValue || [])?.map((f) => f.url)}
                errorVariant={ErrorVariant.direct}
                errorMessage={staticValueError}
                maximumFileSize={maximumFileSize || 10}
                labelClassName={styles.LabelClass}
                isLoading={uploadFile?.isFileUploadInProgress}
                fileNameClass={styles.FileNameClass}
            />
          );
      default:
        return null;
    }
  };

  return (
    <>
      {getValuesField()}
    </>
  );
}

export default StaticValue;
