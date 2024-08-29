import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import Input from 'components/form_components/input/Input';
import { cloneDeep, get, has, isEmpty, isNaN, union } from 'utils/jsUtility';
import DatePicker from 'components/form_components/date_picker/DatePicker';
import { arryToDropdownData, getUserProfileData, keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { getAccountConfigurationDetailsApiService } from 'axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { COUNTRY_CODE, EMPTY_STRING, SERVER_ERROR_CODE_STRINGS } from 'utils/strings/CommonStrings';
import InputDropdown from 'components/form_components/input_dropdown/InputDropdown';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import LinkField from 'components/form_components/link_field/LinkField';
import TextArea from 'components/form_components/text_area/TextArea';
import MobileNumber from 'components/form_components/mobile_number/MobileNumber';
import FileUpload from 'components/form_components/file_upload/FileUpload';
import useFileUploadHook from 'hooks/useFileUploadHook';
import { generateUuid, getExtensionFromFileName } from 'utils/generatorUtils';
import { FILE_UPLOAD_STATUS, FORM_POPOVER_STATUS } from 'utils/Constants';
import { NUMBER_REGEX } from 'utils/strings/Regex';
import AddMembers from 'components/member_list/add_members/AddMembers';
import { GET_ALL_DATA_LIST_ENTRY_DETAILS_BY_FILTER } from 'urls/ApiUrls';
import DataSetIcon from 'assets/icons/DataSetIcon';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import { DATA_LIST_DASHBOARD } from 'urls/RouteConstants';
import BarCodeScanner from 'components/qr_bar_scanner/BarCodeScanner';
import ScannerIcon from 'assets/icons/ScannerIcon';
import { SERVER_ERROR_CODES } from 'utils/ServerConstants';
import InfoField from 'components/form_components/info_field/InfoField';
import AddIcon from 'assets/icons/AddIcon';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import HelperMessage, { HELPER_MESSAGE_TYPE } from 'components/form_components/helper_message/HelperMessage';
import { STATIC_VALUE_CONSANTS } from './StaticValue.constants';
import styles from './StaticValue.module.scss';
import { showToastPopover } from '../../utils/UtilityFunctions';

function StaticValue(props) {
  const { t } = useTranslation();
  const {
      fieldType,
      onStaticValueChange,
      staticValue,
      staticValueError,
      dropdownOptionList = [],
      parentId,
      entityId,
      entityUuid,
      entity,
      documentsType,
      refUuid,
      id,
      childFieldDetails,
      setFileUploadStatus,
  } = props;

  const userProfileData = getUserProfileData();
  const [allowedCurrencyList, setAllowedCurrencyList] = useState([]);
  const [defaultCurrencyType, setDefaultCurrencyType] = useState(EMPTY_STRING);
  const [allowedDocumentTypeList, setAllowedDocumentTypeList] = useState([]);
  const [configuredMaxFileSize, setConfiguredMaxFileSize] = useState(0);
  const [member_team_search_value, setMemberOrTeamSearchValue] = useState(EMPTY_STRING);
  const [dataListFieldSearch, setDataListFieldSearch] = useState('');
  const [dataListErrorMessage, setDataListErrorMessage] = useState('');
  const [isInfoModalOpen, setIsInfoModal] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [infoStaticValue, setInfoStaticValue] = useState(EMPTY_STRING);
  const [infoFieldError, setInfoFieldError] = useState(staticValueError);
  console.log('staticValueErrorlink', staticValueError);
  const getFileData = (doc_details, file_ref_uuid, _entity, entity_id, fileRefUuid) => {
    const ref_uuid = fileRefUuid || refUuid || generateUuid();
    const fileData = {
      type: documentsType,
      file_type: getExtensionFromFileName(doc_details.file.name, true),
      file_name: doc_details.file.name.slice(0, -1 * (doc_details.file.name.length - doc_details.file.name.lastIndexOf('.'))),
      file_size: doc_details.file.size,
      file_ref_id: file_ref_uuid,
    };
    const file_metadata = [];
          file_metadata.push(fileData);
      const data = {
        file_metadata,
      };
      data.entity = entity;// step subprocess static documents
      if (parentId) data.context_id = parentId;
      if (entityId || entity_id) data.entity_id = entityId || entity_id; // step id
      if (entityUuid) data.entity_uuid = entityUuid;
      data.ref_uuid = ref_uuid;
      return data;
  };

  const {
    onRetryFileUpload,
    onFileUpload,
    documentDetails,
    uploadFile,
} = useFileUploadHook(getFileData, null, null, setFileUploadStatus);

  useEffect(() => {
    if (fieldType === FIELD_TYPES.FILE_UPLOAD) {
      let updatedAttachment = staticValue || [];
      if (uploadFile.file_ref_uuid) {
        const docMetaData = {
          fileName: uploadFile.fileName,
          file: uploadFile.file,
          status: FILE_UPLOAD_STATUS.SUCCESS,
          fileId: documentDetails.file_metadata[0]._id,
          url: uploadFile.url,
          entity_id: documentDetails.entity_id,
          entity: documentDetails.entity,
          newDocument: true,
          ref_uuid: documentDetails.ref_uuid,
          type: documentDetails.file_metadata[0].type,
          upload_signed_url: documentDetails.file_metadata[0].upload_signed_url.fields.key,
        };
        updatedAttachment = [
          ...updatedAttachment || [],
          docMetaData,
        ];
      }
      console.log('uploadFileuploadFile static', updatedAttachment, uploadFile, staticValue);
      onStaticValueChange({
        target: {
          value: updatedAttachment,
          fieldType,
        },
      });
    }
  }, [documentDetails]);

  const onDeleteFile = (value) => {
    console.log('onDeleteStaticFile', value, staticValue);
    const updatedDocumentList =
    (staticValue || []).filter((fileObj) => fileObj.fileId !== value);
    onStaticValueChange({
      target: {
        value: updatedDocumentList,
        removed_doc: value,
        fieldType,
      },
    });
  };

  useEffect(() => {
      if (
        fieldType === FIELD_TYPES.CURRENCY ||
        fieldType === FIELD_TYPES.FILE_UPLOAD ||
        fieldType === FIELD_TYPES.DATA_LIST
      ) {
        getAccountConfigurationDetailsApiService().then(
          (response) => {
            console.log('responsecheckdefault', response);
            if (
              fieldType === FIELD_TYPES.CURRENCY &&
              response.allowed_currency_types
            ) {
              setAllowedCurrencyList(response.allowed_currency_types);
            }
            if (
              fieldType === FIELD_TYPES.DATA_LIST &&
              response.allowed_currency_types
            ) {
              setAllowedCurrencyList(response.allowed_currency_types);
              setDefaultCurrencyType(response.default_currency_type || '');
            }
            if (
              fieldType === FIELD_TYPES.FILE_UPLOAD &&
              response.maximum_file_size
            ) {
              setConfiguredMaxFileSize(response.maximum_file_size);
              setAllowedDocumentTypeList(response.allowed_extensions);
            }
          },
          (error) => {
            console.log(error);
          },
        );
      }
    }, []);

  const onSelectionStaticValueSelected = (event) => {
    if (fieldType === FIELD_TYPES.CHECKBOX) {
      console.log('checkboxList onSelectionStaticValueSelected', staticValue);
      const { value } = event.target;
      const checkboxList = isEmpty(staticValue)
        ? []
        : cloneDeep(staticValue);
      if (!checkboxList.includes(value)) checkboxList.push(value);
      else checkboxList.splice(checkboxList.indexOf(value), 1);
      console.log('checkboxList', checkboxList);
      const valueEvent = {
        target: {
          value: checkboxList,
          id: 'field_value',
          fieldType,
        },
      };
      onStaticValueChange(valueEvent);
    } else onStaticValueChange(event);
  };
  const getValuesField = () => {
      if (fieldType === FIELD_TYPES.NUMBER) {
          return (
            <Input
                id={id}
                inputContainerClasses={styles.Field}
                onChangeHandler={(event) => {
                    event.target.value = event.target.valueAsNumber;
                    const valueEvent = {
                    target: {
                        value: isNaN(event.target.valueAsNumber) ? '' : event.target.valueAsNumber,
                        fieldType,
                    },
                    };
                    onStaticValueChange(valueEvent);
                }
                }
                value={staticValue}
                errorMessage={staticValueError}
                type="number"
                placeholder={STATIC_VALUE_CONSANTS(t).NUMBER_PLACEHOLDER}
                hideLabel
            />
          );
      } else if (fieldType === FIELD_TYPES.DATE ||
          fieldType === FIELD_TYPES.DATETIME) {
              return (
                <div>
                  <DatePicker
                      hideLabel
                      id={id}
                      getDate={(value) => {
                      const valueEvent = {
                          target: {
                          value: value,
                          fieldType,
                          },
                      };
                      console.log('datepicker check', value);
                      onStaticValueChange(valueEvent);
                      }}
                      date={staticValue}
                      errorMessage={staticValueError}
                      enableTime={fieldType === FIELD_TYPES.DATETIME}
                      isScrollIntoView
                      popperClasses={gClasses.ZIndex5}
                  />
                </div>
              );
        } else if (fieldType === FIELD_TYPES.CURRENCY) {
              const allowedCurrenyTypes = arryToDropdownData(
              allowedCurrencyList ||
              [],
              );
              return (
                <InputDropdown
                    id={id}
                    inputDropdownClassName={cx(styles.Field, styles.FieldHeight)}
                    onChange={(event) => {
                    const valueEvent = {
                        target: {
                        fieldType,
                        value: {
                        value: event.target.value.replace(NUMBER_REGEX, ''),
                        currency_type: defaultCurrencyType,
                        },
                    },
                    };
                    onStaticValueChange(valueEvent);
                    }
                    }
                    onDropdownChange={(event) => {
                    const valueEvent = {
                        target: {
                        value: {
                        value: staticValue.value || '',
                        currency_type: event.target.value,
                        },
                        },
                    };
                    onStaticValueChange(valueEvent);
                    }
                }
                    optionList={allowedCurrenyTypes}
                    value={staticValue.value || ''}
                    strictlySetSelectedValue
                    dropdownValue={staticValue.currency_type || defaultCurrencyType}
                    errorMessage={staticValueError}
                    placeholder={STATIC_VALUE_CONSANTS(t).CURRENCY_PLACEHOLDER}
                    hideLabel
                />
              );
          } else if (fieldType === FIELD_TYPES.SINGLE_LINE || fieldType === FIELD_TYPES.EMAIL) {
            return (
              <Input
                inputContainerClasses={styles.Field}
                hideLabel
                id={id}
                onChangeHandler={onStaticValueChange}
                value={staticValue}
                errorMessage={staticValueError}
                placeholder={fieldType === FIELD_TYPES.SINGLE_LINE ?
                    STATIC_VALUE_CONSANTS(t).INPUT_PLACEHOLDER : STATIC_VALUE_CONSANTS(t).EMAIL_PLACEHOLDER}
              />
            );
            } else if (fieldType === FIELD_TYPES.DROPDOWN || fieldType === FIELD_TYPES.RADIO_GROUP ||
            fieldType === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN || fieldType === FIELD_TYPES.CHECKBOX
            || fieldType === FIELD_TYPES.YES_NO) {
            return (
              <Dropdown
                optionList={dropdownOptionList}
                innerClassName={styles.Field}
                id={id}
                onChange={(event) => onSelectionStaticValueSelected(event)}
                selectedValue={staticValue}
                errorMessage={staticValueError}
                placeholder={STATIC_VALUE_CONSANTS(t).SELECTION_PLACEHOLDER}
                hideLabel
                isMultiSelect={fieldType === FIELD_TYPES.CHECKBOX}
                showNoDataFoundOption
                optionListDropDown={styles.DropdownListClass}
              />
            );
              } else if (fieldType === FIELD_TYPES.LINK) {
                  return (
                    <LinkField
                      bgClassName={styles.Field}
                      id={id}
                      onChangeHandler={(value) => {
                        const valueEvent = {
                          target: {
                              value: value,
                          },
                          };
                          onStaticValueChange(valueEvent);
                      }}
                      links={staticValue || []}
                      errorMessage={staticValueError}
                      placeholder={STATIC_VALUE_CONSANTS(t).LINK_PLACEHOLDER}
                      hideLabel
                      isMultiple
                      readOnly={false}
                    />
                  );
                } else if (fieldType === FIELD_TYPES.PARAGRAPH) {
                    return (
                      <TextArea
                        hideLabel
                        placeholder={STATIC_VALUE_CONSANTS(t).INPUT_PLACEHOLDER}
                        innerClass={styles.Field}
                        id={id}
                        onChangeHandler={onStaticValueChange}
                        value={staticValue}
                        errorMessage={staticValueError}
                      />
                    );
                  } else if (fieldType === FIELD_TYPES.PHONE_NUMBER) {
                      return (
                        <MobileNumber
                          id={id}
                          inputDropdownClassName={styles.Field}
                          hideLabel
                          placeholder={STATIC_VALUE_CONSANTS(t).PHONE_PLACEHOLDER}
                          mobile_number={staticValue.phone_number}
                          countryCodeId={staticValue.country_code || userProfileData.default_country_code || COUNTRY_CODE.MOBILE_NUMBER_COUNTRY_CODE}
                          onChangeHandler={(event) => {
                            const valueEvent = {
                              target: {
                              value: {
                                phone_number: event.target.value,
                                country_code: staticValue.country_code || userProfileData.default_country_code || COUNTRY_CODE.MOBILE_NUMBER_COUNTRY_CODE,
                              },
                              },
                            };
                            onStaticValueChange(valueEvent);
                          }}
                          onCountryCodeChange={(event) => {
                            const valueEvent = {
                              target: {
                              value: {
                                phone_number: staticValue.phone_number,
                                country_code: event.target.value,
                              },
                              },
                            };
                            onStaticValueChange(valueEvent);
                          }}
                          errorMessage={staticValueError}
                        />
                      );
                      } else if (fieldType === FIELD_TYPES.FILE_UPLOAD) {
                        return (
                          <FileUpload
                            id={id}
                            containerClass={styles.Field}
                            addFile={(fileData, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple, currentFileIndex, fileRefUuid) => {
                              onFileUpload(fileData, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple, currentFileIndex, false, fileRefUuid);
                            }}
                            fileName={isEmpty(staticValue) ? [] : staticValue}
                            allowed_extensions={allowedDocumentTypeList}
                            maximum_file_size={configuredMaxFileSize}
                            placeholder={STATIC_VALUE_CONSANTS(t).FILE_PLACEHOLDER}
                            onDeleteClick={onDeleteFile}
                            onRetryClick={onRetryFileUpload}
                            isMultiple
                            hideLabel
                            errorMessage={staticValueError}
                          />
                        );
                        } else if (fieldType === FIELD_TYPES.USER_TEAM_PICKER) {
                          let usersAndTeams = [];

                            if (staticValue && staticValue.teams) usersAndTeams = union(usersAndTeams, staticValue.teams);
                            if (staticValue && staticValue.users) {
                              usersAndTeams = union(usersAndTeams, staticValue.users);
                            }
                            return (
                              <AddMembers
                                id={id}
                                placeholder={STATIC_VALUE_CONSANTS(t).SELECTION_PLACEHOLDER}
                                onUserSelectHandler={(event) => {
                                  onStaticValueChange(event);
                                }}
                                removeSelectedUser={(userOrTeamId) => {
                                  const removeUserEvent = {
                                    target: {
                                      value: userOrTeamId,
                                      removeUserValue: true,
                                    },
                                  };
                                  onStaticValueChange(removeUserEvent);
                                }}
                                selectedData={usersAndTeams}
                                selectedSuggestionData={usersAndTeams}
                                memberSearchValue={member_team_search_value}
                                setMemberSearchValue={(e) => setMemberOrTeamSearchValue(e?.target?.value)}
                                errorText={staticValueError}
                                isActive
                                hideErrorMessage={!staticValueError}
                                isRequired
                                hideLabel
                                getTeamsAndUsers
                                isScrollableSelectedList
                                popperFixedStrategy
                                className={cx(gClasses.MB15)}
                              />
                            );
                          } else if (fieldType === FIELD_TYPES.DATA_LIST) {
                            const onTagClickForDataListPicker = (
                              dataListUUID,
                              dataListEntryId,
                              returnLink,
                            ) => {
                              if (dataListUUID && dataListEntryId) {
                                const navLink = `${DATA_LIST_DASHBOARD}/${dataListUUID}/${dataListEntryId}`;
                                if (returnLink) return navLink;
                                window.open(navLink, '_blank');
                              }
                              return null;
                            };

                            return (
                              <AddMembers
                                hideLabel
                                id={id}
                                onUserSelectHandler={(event) => {
                                  const { value } = event.target;
                                  const label = value.display_fields.flatMap((field) =>
                                    has(value, [field]) ? [value[field]] : []);
                                  onStaticValueChange(
                                    {
                                      target:
                                      {
                                        label: label.join(get(value, 'separator') || '-'),
                                        value: value._id,
                                      },
                                    },
                                  );
                                }}
                                selectedData={staticValue}
                                removeSelectedUser={(id) => {
                                  onStaticValueChange(
                                    {
                                      target:
                                      {
                                        value: id,
                                      },
                                      remove: true,
                                    },
                                  );
                                }}
                                setErrorMessage={(errorMessage) => {
                                  if (errorMessage !== dataListErrorMessage) {
                                    if (
                                      errorMessage ===
                                      SERVER_ERROR_CODE_STRINGS[SERVER_ERROR_CODES.UNAUTHORIZED]
                                    ) {
                                      setDataListErrorMessage('Datalist access denied');
                                      showToastPopover(
                                        'Unauthorized',
                                        'Datalist unaccessible',
                                        FORM_POPOVER_STATUS.SERVER_ERROR,
                                        true,
                                      );
                                    } else {
                                      setDataListErrorMessage('');
                                    }
                                  }
                                }}
                                errorText={staticValueError}
                                selectedSuggestionData={staticValue}
                                memberSearchValue={dataListFieldSearch}
                                setMemberSearchValue={(event) => {
                                  if (event.target.value !== dataListFieldSearch) { setDataListFieldSearch(event.target.value); }
                                }}
                                apiParams={{
                                  field_id: childFieldDetails.field_id,
                                }}
                                entryIds={[]}
                                placeholder={STATIC_VALUE_CONSANTS(t).SELECTION_PLACEHOLDER}
                                apiUrl={GET_ALL_DATA_LIST_ENTRY_DETAILS_BY_FILTER}
                                getTagLabel={(data) => data && data.label}
                                getTagId={(data) => data && data.value}
                                getOption={(option, type) => {
                                  if (!option || !option._id) return null;
                                  switch (type) {
                                    case 'label': {
                                      const label = option.display_fields.flatMap((field) => has(option, [field]) ? [option[field]] : []);
                                      return !isEmpty(label)
                                        ? label.join(get(option, ['separator']) || '-')
                                        : null;
                                    }
                                    default:
                                      return option._id;
                                  }
                                }}
                                isScrollableSelectedList
                                popperFixedStrategy
                                isRequired
                                icon={(
                                  <DataSetIcon
                                    ariaLabel="data set"
                                    role={ARIA_ROLES.IMG}
                                    className={cx(
                                      gClasses.ML15,
                                      styles.DataListPickerIcon,
                                    )}
                                  />
                                )}
                                popperClassName={styles.UserPickerDropdown}
                                allowNavigationToDataList
                                dataListUUID={get(childFieldDetails, [
                                  'data_list',
                                  'data_list_uuid',
                                ])}
                                onTagClick={onTagClickForDataListPicker}
                                isDatalistField
                                isCreationField={false}
                                filterFields={null}
                              />
                            );
                          } else if (fieldType === FIELD_TYPES.SCANNER) {
                            return (
                              <>
                                {isScannerOpen &&
                                <BarCodeScanner
                                onChangeHandler={(id, value) => {
                                  console.log('scanner field onChange', id, value);
                                  onStaticValueChange({
                                    target: {
                                      value: value,
                                    },
                                  });
                                  }}
                                  setIsScannerOpen={setIsScannerOpen}
                                  id={id}
                                />}
                                <Input
                                  label={STATIC_VALUE_CONSANTS(t).SCANNER_PLACEHOLDER}
                                  id={id}
                                  onChangeHandler={(event) => {
                                    console.log('scanner field input change', event);
                                    onStaticValueChange(event);
                                  }}
                                  value={staticValue}
                                  errorMessage={staticValueError}
                                  placeholder={STATIC_VALUE_CONSANTS(t).SCANNER_PLACEHOLDER}
                                  isRequired
                                  hideLabel
                                  isTable
                                  inputContainerClasses={cx(styles.FormFieldInput, styles.Field)}
                                  scannerIconPadding={gClasses.PR32}
                                />
                                <ScannerIcon
                                  className={cx(styles.Scanner, gClasses.CursorPointer, gClasses.Bottom5, staticValueError && gClasses.Bottom30, gClasses.CenterV)}
                                  onClick={() => setIsScannerOpen(true)}
                                  onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && setIsScannerOpen(true)}
                                  tabIndex={0}
                                  role={ARIA_ROLES.BUTTON}
                                  title="Scanner"
                                />
                              </>
                              );
                            } else if (fieldType === FIELD_TYPES.INFORMATION) {
                              return (
                                <>
                                  <div className={gClasses.CenterV}>
                                  <button className={cx(gClasses.ClickableElement, styles.AddBtn)} onClick={() => setIsInfoModal(true)}>
                                      {isEmpty(staticValue) && <AddIcon className={cx(gClasses.MR3, styles.AddIcon)} />}
                                      <span className={cx(gClasses.FTwo13BlueV39, gClasses.FontWeight500)}>
                                          {isEmpty(staticValue) ? STATIC_VALUE_CONSANTS(t).INFORMATION.ADD
                                          : STATIC_VALUE_CONSANTS(t).INFORMATION.EDIT_VIEW}
                                      </span>
                                  </button>
                                  </div>
                                  <HelperMessage
                                    message={staticValueError}
                                    type={HELPER_MESSAGE_TYPE.ERROR}
                                    className={styles.ErrorContainer}
                                    noMarginBottom
                                    role={ARIA_ROLES.ALERT}
                                  />
                                </>
                              );
                            }
      return null;
  };

  return (
    <>
    {getValuesField()}
    {isInfoModalOpen &&
      <ModalLayout
        centerVH
        id={STATIC_VALUE_CONSANTS(t).INFORMATION.PLACEHOLDER}
        modalContainerClass={cx(styles.ContentModal, gClasses.ModalContentClassWithoutPadding, gClasses.ZIndex6)}
        isModalOpen={isInfoModalOpen}
        onCloseClick={() => {
          setIsInfoModal(false);
          setInfoFieldError(staticValueError || EMPTY_STRING);
        }}
        headerClassName={styles.AddIntegrationHeader}
        headerContent
        // footerClassName={modalStyles.ModalFooter}
        mainContent={(
        <InfoField
            errorMessage={infoFieldError}
            label={t('form_field_strings.form_field_constants.info_content')}
            onChangeHandler={(event) => {
              if (event?.target) {
                setInfoStaticValue(event?.target?.value || EMPTY_STRING);
                setInfoFieldError(EMPTY_STRING);
              }
            }}
            description={staticValue}
        />
          )}
        mainContentClassName={styles.MainContent}
        footerContent={
          <div className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
            <div
              className={cx(
                BS.D_FLEX,
                BS.JC_BETWEEN,
                BS.W100,
              )}
            >
                <div className={gClasses.CenterV}>
                <Button
                  buttonType={BUTTON_TYPE.SECONDARY}
                  className={cx(BS.TEXT_NO_WRAP)}
                  onClick={() => {
                    setIsInfoModal(false);
                    setInfoFieldError(staticValueError || EMPTY_STRING);
                  }}
                >
                  {STATIC_VALUE_CONSANTS(t).INFORMATION.CANCEL}
                </Button>
                </div>
                <div className={gClasses.CenterV}>
                <Button
                  buttonType={BUTTON_TYPE.PRIMARY}
                  className={cx(BS.TEXT_NO_WRAP)}
                  onClick={() => {
                    if (isEmpty(infoStaticValue)) {
                      setInfoFieldError(STATIC_VALUE_CONSANTS(t).INFORMATION.REQUIRED_ERROR);
                    } else if (infoStaticValue?.length > 10000) {
                      setInfoFieldError(STATIC_VALUE_CONSANTS(t).INFORMATION.MAX_LIMIT_ERROR);
                      } else {
                        setIsInfoModal(false);
                        setInfoFieldError(EMPTY_STRING);
                          onStaticValueChange({
                            target: {
                              value: infoStaticValue,
                            },
                          });
                        }
                  }}
                >
                  {STATIC_VALUE_CONSANTS(t).INFORMATION.SAVE}
                </Button>
                </div>
            </div>
          </div>
        }
        extraSpace={64}
      />
    }
    </>
  );
}

export default StaticValue;
