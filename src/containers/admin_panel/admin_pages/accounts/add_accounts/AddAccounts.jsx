import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useFileUploadHook from 'hooks/useFileUploadHook';
import {
  addAdminAccountDetails,
  validCheck,
  openOrCloseModal,
  modalAdminAccountDataClear,
  adminAccountDataChange,
} from 'redux/reducer/AdminAccountsReducer';
import { ACCOUNT_INFO_STRINGS } from 'containers/landing_page/account_info/AccountInfoModal.string';
import {
  ENTITY,
  DOCUMENT_TYPES,
  EMPTY_STRING,
  FILE_CROP_PREVIEW_TEXT,
} from 'utils/strings/CommonStrings';
import { getExtensionFromFileName } from 'utils/generatorUtils';
import { ACCOUNT_SETTINGS_FORM } from 'containers/admin_settings/account_settings/AccountSettings.strings';
import { validate } from 'utils/UtilityFunctions';
import FileCropPreviewComp from 'components/file_crop_preview/FileCropPreview';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { getLanguageLookupDataThunk } from 'redux/actions/LanguageLookUp.Action';
import { getTimeZoneLookUpDataThunk } from 'redux/actions/TimeZoneLookUp.Action';
import {
  getLocaleLookUpDataThunk,
  clearLocaleLookUpDataAction,
} from 'redux/actions/LocaleLookUp.Action';
import { getUpdatedDocumentUrlDetailsForAccountModal } from 'containers/landing_page/account_info/AccountInfoModal.validation.schema';
import FormTitle from 'components/form_components/form_title/FormTitle';
import Label from 'components/form_components/label/Label';
import { ADDITIONAL_DETAILS_STRINGS } from 'containers/sign_up/additional_details/AdditionalDetails.strings';
import { useTranslation } from 'react-i18next';
import { Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import CheckboxGroup from '../../../../../components/form_components/checkbox_group/CheckboxGroup';
import styles from './AddAccounts.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import Button, {
  BUTTON_TYPE,
} from '../../../../../components/form_components/button/Button';
import ADMIN_ACCOUNT_MANAGEMENT_STRINGS, { COPILOT_CONFIGURATION } from '../Accounts.strings';
import Input from '../../../../../components/form_components/input/Input';
import { BS } from '../../../../../utils/UIConstants';
import {
  addAdminAccountApiThunk,
  updateAdminAccountApiThunk,
  getIndustryListApiThunk,
  getCountryListThunk,
} from '../../../../../redux/actions/AdminAccounts.Action';
import jsUtils, {
  getDomainName,
  isEmpty,
} from '../../../../../utils/jsUtility';
import {
  addAdminAccountValidationSchema,
  editAdminAccountValidationSchema,
} from '../Accounts.validation.schema';
import {
  getAccountDetailsInitialData,
  getAccountsFormData,
  getValidationData,
  isEditedForm,
} from './AddAccounts.utils';
import { ADMIN_SETTINGS_CONSTANT } from '../../../../admin_settings/AdminSettings.constant';
import { routeNavigate } from '../../../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../../../utils/Constants';
import { ACCOUNT_DETAILS } from '../../../../../urls/RouteConstants';

function AddAccounts(props) {
  const {
    addAdminAccountDetails,
    account_details,
    addAdminAccountApiCall,
    adminAccountId,
    editAdminAccountApiCall,
    validateAdminAccount,
    errorValidate,
    getIndustryList,
    industry_list,
    getCountryList,
    country_list,
    getLanguageLookupData,
    // languages_list,
    getLocaleLookUpData,
    locale_list,
    clearLocaleLookUpData,
    getTimeZoneLookUpData,
    timezone_list,
    toggleCloseOpen,
    modalToggle,
    eachAccountDetails,
    modalDetailsClear,
    AccountDataChange,
    primary_locale,
    account_language,
  } = props;

  const [currentFileData, setCurrentFileData] = useState();
  const [showOriginal, setShowOriginalImage] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [initialData, setInitialData] = useState(account_details);
  const [primaryLanguage, setPrimaryLanguage] = useState();
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [primaryLanguageOptions, setPrimaryLanguageOptions] = useState([]);

  const history = useHistory();
  const { t } = useTranslation();

  const { account_locale } = account_details;
  const selectedAccLocales = account_locale?.map(
    (current_locale) => current_locale?.locale || current_locale,
  );

  const getLookupForSelectedDropDown = () => {
    getLocaleLookUpData();
  };

  useEffect(() => {
    if (!isEmpty(account_locale)) {
      const primaryOptionsData = locale_list.filter((localeData) => selectedAccLocales.includes(localeData.value));
      setPrimaryLanguage(primaryOptionsData);
    }
    setSelectedLanguages(selectedAccLocales);
    console.log('rewrwerewrew45uy7ytrewUSEEFF', selectedAccLocales, AccountDataChange);
    getLookupForSelectedDropDown();
  }, [account_locale, locale_list?.length, locale_list?.length]);

  useEffect(() => {
    getIndustryList();
    getCountryList();
    getLanguageLookupData();
    getTimeZoneLookUpData();
  }, []);

  useEffect(() => {
    if (isEmpty(adminAccountId) || isEmpty(eachAccountDetails)) {
      modalDetailsClear();
      return;
    }

    const formData = getAccountsFormData(eachAccountDetails);

    let image_url = null;
    if (!jsUtils.isEmpty(formData.acc_logo)) {
      image_url = Object.prototype.hasOwnProperty.call(
        formData.acc_logo,
        ACCOUNT_SETTINGS_FORM.ACCOUNT_LOGO.PROPERTY,
      )
        ? formData.acc_logo.base64
        : formData.acc_logo;
    } else image_url = null;
    setImageUrl(image_url);

    const currentAccountValue = {
      ...account_details,
    };
    const valueToBeUpdated = {
      ...currentAccountValue,
      ...formData,
    };
    setInitialData(valueToBeUpdated);
    addAdminAccountDetails(valueToBeUpdated);
  }, [adminAccountId, eachAccountDetails, modalToggle]);

  useEffect(() => {
    if (account_details && !isEmpty(account_details.account_language)) {
      clearLocaleLookUpData();
      getLocaleLookUpData({
        language: account_details.account_language,
      });
    }
  }, [account_details && account_details.account_language]);

  const onLanguagesChange = (event) => {
    const { AccountDataChange } = props;
    const currentAccountValue = {
      ...account_details,
    };
    let updated_locale = [];
    const { value } = event.target;

    if (selectedLanguages.includes(value)) {
      setSelectedLanguages(selectedLanguages.filter((val) => val !== value));
      updated_locale = selectedLanguages.filter((val) => val !== value);
      setPrimaryLanguageOptions(
        primaryLanguageOptions.filter((option) => option.value !== value),
      );
    } else {
      setSelectedLanguages([...selectedLanguages, value]);
      updated_locale = [...selectedLanguages, value];
      const selectedOption = locale_list.find(
        (locale) => locale.value === value,
      );
      const { label, language } = selectedOption;
      const result = {
        label,
        value: selectedOption?.value,
        language,
      };
      setPrimaryLanguageOptions([...primaryLanguageOptions, result]);
    }

    updated_locale = locale_list.filter((curr_locale) =>
      updated_locale.includes(curr_locale.value),
    );
    updated_locale = updated_locale.map((curr_locale) => curr_locale.value);
    const valueToBeUpdated = {
      ...currentAccountValue,
      account_locale: updated_locale,
    };
    addAdminAccountDetails(valueToBeUpdated);
    AccountDataChange('account_locale', updated_locale);
  };

  const onPrimaryLanguageChange = (event) => {
    const { AccountDataChange } = props;
    const { value } = event.target;
    AccountDataChange('primary_locale', value);
    AccountDataChange('account_language', event.target.language);
  };

  const onChangeHandler = (event) => {
    let fieldValue = event.target.value;
    const currentAccountValue = {
      ...account_details,
    };

    if (
      ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_DOMAIN_LABEL_ID ===
        event.target.id &&
      fieldValue
    ) {
      fieldValue = fieldValue.toLowerCase();
    }

    const valueToBeUpdated = {
      ...currentAccountValue,
      [event.target.id]: fieldValue,
    };

    validateAdminAccount({
      ...errorValidate,
      [event.target.id]: EMPTY_STRING,
    });
    addAdminAccountDetails(valueToBeUpdated);
  };

  const onIndustrySelected = (event) => {
    const { value } = event.target;
    const currentAccountValue = {
      ...account_details,
    };
    const { account_industry } = currentAccountValue;
    const industryList = jsUtils.isUndefined(account_industry)
      ? []
      : jsUtils.cloneDeep(account_industry);

    if (industryList) {
      if (!industryList.includes(value)) {
        industryList.push(value);
      } else {
        industryList.splice(industryList.indexOf(value), 1);
      }
    }

    const valueToBeUpdated = {
      ...currentAccountValue,
      account_industry: industryList,
    };

    validateAdminAccount({
      ...errorValidate,
      [event.target.id]: EMPTY_STRING,
    });
    addAdminAccountDetails(valueToBeUpdated);
  };

  const getFileData = (doc_details, file_ref_uuid) => {
    const fileData = {
      type: DOCUMENT_TYPES.ACCOUNT_LOGO,
      file_type: getExtensionFromFileName(doc_details.file.name),
      file_name: doc_details.file.name.split('.')[0],
      file_size: doc_details.file.size,
      file_ref_id: file_ref_uuid,
    };
    const file_metadata = [];
    file_metadata.push(fileData);
    const data = {
      file_metadata,
    };
    data.entity = ENTITY.ACCOUNTS;
    data.entity_id = adminAccountId;
    data.account_id = adminAccountId;
    return data;
  };

  const {
    onRetryFileUpload,
    onFileUpload,
    documentDetails,
    uploadFile,
    onDeletFileUpload,
  } = useFileUploadHook(getFileData, null, true);

  const handleModalClose = () => {
    modalDetailsClear();
    setShowOriginalImage(false);
    toggleCloseOpen(false);
    onDeletFileUpload();
    if (isEmpty(adminAccountId)) {
      const superAdminAccountsPathName = ACCOUNT_DETAILS.ACCOUNT;
      routeNavigate(history, ROUTE_METHOD.PUSH, superAdminAccountsPathName, null, null);
    } else {
      const superAdminAccountIdPathName = `${ACCOUNT_DETAILS.ADMIN_ACCOUNT}${adminAccountId}`;
      routeNavigate(history, ROUTE_METHOD.PUSH, superAdminAccountIdPathName, null, null);
    }
  };

  const onAddFile = (fileData) => {
    const currentAccountValue = {
      ...account_details,
    };

    validateAdminAccount({
      ...errorValidate,
      acc_logo: EMPTY_STRING,
    });

    const valueToBeUpdated = {
      ...currentAccountValue,
      acc_logo: fileData,
      file_ref_uuid: uuidv4(),
    };
    addAdminAccountDetails(valueToBeUpdated);
    setCurrentFileData(fileData);
    setShowOriginalImage(false);
  };

  const onDeleteLogoClick = () => {
    onDeletFileUpload();
    setCurrentFileData();
    const currentAccountValue = {
      ...account_details,
    };
    const valueToBeUpdated = {
      ...currentAccountValue,
      acc_logo: account_details.acc_initial_logo,
    };
    delete valueToBeUpdated.file_ref_uuid;
    addAdminAccountDetails(valueToBeUpdated);
  };

  const onChangeToggler = (id, value) => {
    const fieldValue = !value;
    const currentAccountValue = {
      ...account_details,
    };
    const valueToBeUpdated = {
      ...currentAccountValue,
      [id]: fieldValue,
    };

    validateAdminAccount({
      ...errorValidate,
      [id]: EMPTY_STRING,
    });
    addAdminAccountDetails(valueToBeUpdated);
  };

  const onSubmit = () => {
    const validationSchema = adminAccountId
      ? editAdminAccountValidationSchema(t)
      : addAdminAccountValidationSchema(t);
    const currentAccountValue = {
      ...account_details,
    };

    const dataToBeValidated = getValidationData(currentAccountValue);

    const error_list = validate(dataToBeValidated, validationSchema) || {};

    if (!isEmpty(adminAccountId) && isEmpty(currentAccountValue.acc_logo)) {
      validateAdminAccount({
        ...error_list,
        acc_logo: 'Company Logo is required',
      });
      error_list.acc_logo = 'Company Logo is required';
    } else {
      validateAdminAccount(error_list);
    }
    console.log('error_list 226', error_list);

    const data = getAccountDetailsInitialData(account_details, primary_locale, account_locale, account_language);
    if (!jsUtils.isEmpty(currentAccountValue.document_details)) {
      data.acc_logo = currentAccountValue.acc_logo;
      data.document_details = currentAccountValue.document_details;
      data.primary_locale = primary_locale;
      data.acc_locale = account_locale;
    }

    if (jsUtils.isEmpty(error_list)) {
      if (!isEmpty(adminAccountId)) {
        if (currentAccountValue.acc_logo &&
            currentAccountValue.acc_logo.files && currentAccountValue.acc_logo.files[0] &&
            currentAccountValue.acc_logo.files[0]) {
          const valueToBeUpdated = {
            ...currentAccountValue,
            acc_initial_logo: currentFileData,
            primary_locale: primary_locale,
            acc_locale: account_locale,
          };
          onFileUpload(currentFileData);
          addAdminAccountDetails(valueToBeUpdated);
        } else {
          setCurrentFileData();
          editAdminAccountApiCall(data, handleModalClose);
        }
      } else {
        addAdminAccountApiCall(data, handleModalClose, t);
      }
    }
  };

  const apiCallWithFileUpload = (acc_logo, file) => {
    const data = getAccountDetailsInitialData(account_details);
    data.acc_logo = acc_logo;
    data.document_details = file.document_details;
    setCurrentFileData();
    editAdminAccountApiCall(data, handleModalClose);
  };

  useEffect(() => {
    if (
      !jsUtils.isEmpty(documentDetails.file_metadata) &&
      !jsUtils.isEmpty(uploadFile)
    ) {
      const file_upload_details = getUpdatedDocumentUrlDetailsForAccountModal(
        documentDetails,
        documentDetails.file_metadata[0]._id,
      );
      const currentAccountValue = {
        ...account_details,
      };

      const valueToBeUpdated = {
        ...currentAccountValue,
        acc_logo: documentDetails.file_metadata[0]._id,
        ...file_upload_details,
      };
      addAdminAccountDetails(valueToBeUpdated);
      apiCallWithFileUpload(
        documentDetails.file_metadata[0]._id,
        file_upload_details,
      );
    }
  }, [
    documentDetails && documentDetails.file_metadata,
    documentDetails &&
      documentDetails.file_metadata &&
      documentDetails.file_metadata.length,
  ]);

  return (
    <ModalLayout
      id="add-accounts-id"
      isModalOpen={modalToggle}
      onCloseClick={handleModalClose}
      headerContent={(
        <div className={modalStyles.ModalHeaderContainer}>
          <div>
            <h2 className={cx(modalStyles.PageTitle)}>
              {isEmpty(adminAccountId)
                ? t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ADD_TITLE)
                : t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.EDIT_TITLE)}
            </h2>
          </div>
        </div>
      )}
      mainContent={(
        <div>
          <div className={cx(BS.D_FLEX)}>
            <div className={styles.FormContainer}>
              <FormTitle
                className={cx(styles.SubHeadingClass, gClasses.Ellipsis)}
                noBottomMargin
                noTopPadding
              >
                {t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_DETAIL_TITLE)}
              </FormTitle>
              <Input
                label={t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_NAME_LABEL)}
                onChangeHandler={(e) => onChangeHandler(e)}
                isRequired
                value={account_details.account_name}
                id={ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_NAME_LABEL_ID}
                errorMessage={
                  errorValidate
                    ? errorValidate[
                        ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_NAME_LABEL_ID
                      ]
                    : null
                }
                hideMessage={
                  errorValidate && isEmpty(errorValidate.account_name)
                }
                className={styles.FormFields}
              />
              <Input
                label={t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_DOMAIN_LABEL)}
                onChangeHandler={(e) => onChangeHandler(e)}
                isRequired
                value={account_details.account_domain}
                id={ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_DOMAIN_LABEL_ID}
                errorMessage={
                  errorValidate
                    ? errorValidate[
                        ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_DOMAIN_LABEL_ID
                      ]
                    : null
                }
                hideMessage={
                  errorValidate && isEmpty(errorValidate.account_domain)
                }
                className={styles.FormFields}
                readOnly={!isEmpty(adminAccountId)}
                readOnlySuffix={`.${getDomainName(window.location.hostname)}`}
              />
              {adminAccountId && (
                <>
                  <Label
                    content={
                      t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_ACC_LOGO_LABEL)
                    }
                    labelStyles={styles.LogoLabel}
                    isRequired
                  />
                  <FileCropPreviewComp
                    id={ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_ACC_LOGO_ID}
                    imageSrc={uploadFile && uploadFile.file}
                    onFileUpload={onFileUpload}
                    instructionMessage={`${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_1)} ${ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.MB} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_2)} ${ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.MIN_WIDTH} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_3)} ${ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.MIN_HEIGHT} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_4)} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_5)}`}
                    instructionClassName={cx(
                      gClasses.FTwo10GrayV74,
                      styles.FileLetterSpace,
                    )}
                    addFile={(fileData) => onAddFile(fileData)}
                    errorMessage={
                      errorValidate
                        ? errorValidate[
                            ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_ACC_LOGO_ID
                          ]
                        : null
                    }
                    uploadFile={uploadFile}
                    onDeleteLogoClick={onDeleteLogoClick}
                    onRetryFileUpload={onRetryFileUpload}
                    imgSrc={imageUrl}
                    showOriginal={showOriginal}
                    isAdminSettings
                    instructionMessageStyles={styles.InstructionMessageStyles}
                    label={t(FILE_CROP_PREVIEW_TEXT.ADD_COMPANY_LOGO)}
                  />
                </>
              )}
              <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
                <Dropdown
                  id={ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_INDUSTRY_TYPE_ID}
                  optionList={industry_list}
                  onChange={onIndustrySelected}
                  selectedValue={account_details.account_industry}
                  setSelectedValue
                  label={
                    t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_INDUSTRY_TYPE_LABEL)
                  }
                  isMultiSelect
                  isRequired
                  errorMessage={
                    errorValidate
                      ? errorValidate[
                          ADMIN_ACCOUNT_MANAGEMENT_STRINGS
                            .ACCOUNT_INDUSTRY_TYPE_ID
                        ]
                      : null
                  }
                  labelClassAdmin={cx(styles.labelClass, gClasses.FOne11)}
                  className={styles.AdminFormFields}
                  optionListDropDown={styles.OptionListDropDown}
                  hideMessage={
                    errorValidate && isEmpty(errorValidate.account_industry)
                  }
                />
                <Dropdown
                  id={ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_COUNTRY_ID}
                  optionList={country_list}
                  onChange={(e) => onChangeHandler(e)}
                  selectedValue={account_details.account_country}
                 // enableSearch
                  setSelectedValue
                  label={t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_COUNTRY_LABEL)}
                  isRequired
                  errorMessage={
                    errorValidate
                      ? errorValidate[
                          ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_COUNTRY_ID
                        ]
                      : null
                  }
                  labelClassAdmin={cx(styles.labelClass, gClasses.FOne11)}
                  className={styles.AdminFormFields}
                  optionListDropDown={styles.OptionListDropDown}
                  hideMessage={
                    errorValidate && isEmpty(errorValidate.account_country)
                  }
                />
              </div>
            </div>
          </div>
          <div>
            <FormTitle
              className={cx(
                styles.SubHeadingClass,
                gClasses.Ellipsis,
                gClasses.MT20,
              )}
              noBottomMargin
              noTopPadding
            >
              {t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.LANGUAGE_DETAIL_TITLE)}
            </FormTitle>
            <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.JC_BETWEEN)}>
              <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
                <Dropdown
                  id={ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_LANGUAGE_ID}
                  optionList={locale_list}
                  onChange={onLanguagesChange}
                  selectedValue={selectedLanguages}
                  setSelectedValue
                  label={
                    t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_LANGUAGE_LABEL)
                  }
                  isRequired
                  errorMessage={
                    errorValidate
                      ? errorValidate[
                          ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_LANGUAGE_ID
                        ]
                      : null
                  }
                  labelClassAdmin={cx(styles.labelClass, gClasses.FOne11)}
                  className={styles.AdminFormFields}
                  optionListDropDown={styles.OptionListDropDown}
                  hideMessage={
                    errorValidate && isEmpty(errorValidate.account_language)
                  }
                  loadData={getLookupForSelectedDropDown}
                  isMultiSelect
                />
                <Dropdown
                  id={ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_LOCALE_ID}
                  optionList={!isEmpty(primaryLanguageOptions) ? primaryLanguageOptions : primaryLanguage}
                  onChange={onPrimaryLanguageChange}
                  selectedValue={primary_locale}
                  setSelectedValue
                  label={t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_LOCALE_LABEL)}
                  isRequired
                  errorMessage={
                    errorValidate
                      ? errorValidate[
                          ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_LOCALE_ID
                        ]
                      : null
                  }
                  labelClassAdmin={cx(styles.labelClass, gClasses.FOne11)}
                  className={styles.AdminFormFields}
                  optionListDropDown={styles.OptionListDropDown}
                  hideMessage={
                    errorValidate && isEmpty(errorValidate.account_locale)
                  }
                />
              </div>
              <Dropdown
                id={ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_TIMEZONE_ID}
                optionList={timezone_list}
                onChange={(e) => onChangeHandler(e)}
                selectedValue={account_details.account_timezone}
               // enableSearch
                setSelectedValue
                label={t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_TIMEZONE_LABEL)}
                isRequired
                errorMessage={
                  errorValidate
                    ? errorValidate[
                        ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_TIMEZONE_ID
                      ]
                    : null
                }
                labelClassAdmin={cx(styles.labelClass, gClasses.FOne11)}
                className={styles.AdminFormFields}
                optionListDropDown={styles.OptionListDropDown}
                hideMessage={
                  errorValidate && isEmpty(errorValidate.account_timezone)
                }
              />
            </div>
          </div>
          {/* copilot feature */}
          {(
            <div>
              <FormTitle
                className={cx(
                  styles.SubHeadingClass,
                  gClasses.Ellipsis,
                  gClasses.MT20,
                )}
                noBottomMargin
                noTopPadding
              >
                {t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.COPILOT_CONFIGURATION_TITLE)}
              </FormTitle>
                <div className={cx(BS.D_FLEX, BS.JC_START)}>
                <Text
                  content={t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ENABLE_COPILOT_FEATURE)}
                  size={ETextSize.MD}
                  className={cx(gClasses.MR30)}
                />
                <CheckboxGroup
                  id={COPILOT_CONFIGURATION.ENABLE_COPILOT_FEATURE_ID}
                  optionList={COPILOT_CONFIGURATION.ENABLE_COPILOT_FEATURE}
                  onClick={() => {
                    onChangeToggler(COPILOT_CONFIGURATION.ENABLE_COPILOT_FEATURE_ID, account_details.is_copilot_enabled);
                  }}
                  selectedValues={account_details.is_copilot_enabled ? [1] : []}
                  hideLabel
                  isSlider
                  hideOptionLabel
                  // sliderAriaLabel={t(OTHER_SETTINGS_FORM.PASSWORD_AGE.LABEL)}
                  sliderAriaLabel="Label"
                />
                </div>
            </div>
          )}

          {adminAccountId && (
            <div>
              <FormTitle
                className={cx(
                  styles.SubHeadingClass,
                  gClasses.Ellipsis,
                  gClasses.MT20,
                )}
                noBottomMargin
                noTopPadding
              >
                {t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.WORKHALLIC_DETAIL_TITLE)}
              </FormTitle>
              <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.JC_BETWEEN)}>
                <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
                  <Input
                    label={
                      t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_MANAGER_LABEL)
                    }
                    onChangeHandler={(e) => onChangeHandler(e)}
                    isRequired
                    value={account_details.account_manager}
                    id={ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_MANAGER_ID}
                    errorMessage={
                      errorValidate
                        ? errorValidate[
                            ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_MANAGER_ID
                          ]
                        : null
                    }
                    className={styles.AdminFormFields}
                    hideMessage={
                      errorValidate && isEmpty(errorValidate.account_manager)
                    }
                  />
                  <Input
                    label={
                      t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_SOLUTION_CONSULTANT_LABEL)
                    }
                    onChangeHandler={(e) => onChangeHandler(e)}
                    isRequired
                    value={account_details.solution_consultant}
                    id={
                      ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_SOLUTION_CONSULTANT_ID
                    }
                    errorMessage={
                      errorValidate
                        ? errorValidate[
                            ADMIN_ACCOUNT_MANAGEMENT_STRINGS
                              .ACCOUNT_SOLUTION_CONSULTANT_ID
                          ]
                        : null
                    }
                    className={styles.AdminFormFields}
                    hideMessage={
                      errorValidate &&
                      isEmpty(errorValidate.solution_consultant)
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <div className={gClasses.MB20}>
            <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.JC_BETWEEN)}>
              {!adminAccountId && (
                <div>
                  <FormTitle
                    className={cx(
                      styles.SubHeadingClass,
                      gClasses.Ellipsis,
                      gClasses.MT20,
                    )}
                    noBottomMargin
                    noTopPadding
                  >
                    {t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ADMIN_DETAIL_TITLE)}
                  </FormTitle>
                  <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
                    <Input
                      label={
                        t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_FIRST_NAME_LABEL)
                      }
                      onChangeHandler={(e) => onChangeHandler(e)}
                      isRequired
                      value={account_details.account_first_name}
                      id={
                        ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_FIRST_NAME_LABEL_ID
                      }
                      errorMessage={
                        errorValidate
                          ? errorValidate[
                              ADMIN_ACCOUNT_MANAGEMENT_STRINGS
                                .ACCOUNT_FIRST_NAME_LABEL_ID
                            ]
                          : null
                      }
                      className={styles.AdminFormFields}
                      hideMessage={
                        errorValidate &&
                        isEmpty(errorValidate.account_first_name)
                      }
                    />
                    <Input
                      label={
                        t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_LAST_NAME_LABEL)
                      }
                      onChangeHandler={(e) => onChangeHandler(e)}
                      isRequired
                      value={account_details.account_last_name}
                      id={
                        ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_LAST_NAME_LABEL_ID
                      }
                      errorMessage={
                        errorValidate
                          ? errorValidate[
                              ADMIN_ACCOUNT_MANAGEMENT_STRINGS
                                .ACCOUNT_LAST_NAME_LABEL_ID
                            ]
                          : null
                      }
                      className={styles.AdminFormFields}
                      hideMessage={
                        errorValidate &&
                        isEmpty(errorValidate.account_last_name)
                      }
                    />
                  </div>
                  <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
                    <Input
                      label={
                        t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_USERNAME_LABEL)
                      }
                      onChangeHandler={(e) => onChangeHandler(e)}
                      isRequired
                      value={account_details.account_username}
                      id={
                        ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_USERNAME_LABEL_ID
                      }
                      errorMessage={
                        errorValidate
                          ? errorValidate[
                              ADMIN_ACCOUNT_MANAGEMENT_STRINGS
                                .ACCOUNT_USERNAME_LABEL_ID
                            ]
                          : null
                      }
                      className={styles.AdminFormFields}
                      hideMessage={
                        errorValidate &&
                        isEmpty(errorValidate.account_last_name)
                      }
                    />
                    <Input
                      label={
                        t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_EMAIL_LABEL)
                      }
                      onChangeHandler={(e) => onChangeHandler(e)}
                      isRequired
                      value={account_details.account_email}
                      id={
                        ADMIN_ACCOUNT_MANAGEMENT_STRINGS.ACCOUNT_EMAIL_LABEL_ID
                      }
                      errorMessage={
                        errorValidate
                          ? errorValidate[
                              ADMIN_ACCOUNT_MANAGEMENT_STRINGS
                                .ACCOUNT_EMAIL_LABEL_ID
                            ]
                          : null
                      }
                      hideMessage={
                        errorValidate && isEmpty(errorValidate.account_email)
                      }
                      className={styles.AdminFormFields}
                    />
                  </div>
                  <Dropdown
                    id={ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.ID}
                    optionList={
                      ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.OPTIONS(t)
                    }
                    onChange={(e) => onChangeHandler(e)}
                    selectedValue={account_details.role_in_company}
                    setSelectedValue
                    label={
                      t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.LABEL)
                    }
                    isRequired
                    errorMessage={
                      errorValidate
                        ? errorValidate[
                            ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.ID
                          ]
                        : null
                    }
                    labelClassAdmin={cx(styles.labelClass, gClasses.FOne11)}
                    className={styles.AdminFormFields}
                    optionListDropDown={styles.OptionListDropDown}
                    hideMessage={
                      errorValidate && isEmpty(errorValidate.role_in_company)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      footerContent={(
        <div className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN)}>
          <Button
            buttonType={BUTTON_TYPE.SECONDARY}
            className={cx(modalStyles.SecondaryButton)}
            onClick={handleModalClose}
          >
            {t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.CANCEL_BUTTON)}
          </Button>
          <Button
            buttonType={BUTTON_TYPE.PRIMARY}
            className={cx(modalStyles.PrimaryButton)}
            onClick={onSubmit}
            disabled={!isEmpty(adminAccountId) && isEditedForm(initialData, account_details)}
          >
            {t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.SUBMIT_BUTTON)}
          </Button>
        </div>
      )}
    />
  );
}
const mapStateToProps = (state) => {
  return {
    modalToggle: state.AdminAccountsReducer.isAdminAccountModalOpen,
    account_details: state.AdminAccountsReducer.account_details,
    industry_list: state.AdminAccountsReducer.industry_list,
    country_list: state.AdminAccountsReducer.country_list,
    language_list: state.AdminAccountsReducer.language_list,
    errorValidate: state.AdminAccountsReducer.adminAccountErrorList,
    adminAccountArray: state.AdminAccountsReducer.pagination_data,
    languages_list: state.LanguageLookUpReducer.languages_list,
    timezone_list: state.TimeZoneLookUpReducer.timezone_list,
    locale_list: state.LocaleLookUpReducer.locale_list,
    primary_locale: state.AdminAccountsReducer.primary_locale,
    account_language: state.AdminAccountsReducer.account_language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAdminAccountDetails: (value) => {
      dispatch(addAdminAccountDetails(value));
    },
    AccountDataChange: (id, value) => {
      dispatch(adminAccountDataChange(id, value));
    },
    toggleCloseOpen: (value) => {
      dispatch(openOrCloseModal(value));
    },
    addAdminAccountApiCall: (value, func, t) => {
      dispatch(addAdminAccountApiThunk(value, func, t));
    },
    editAdminAccountApiCall: (value, func) => {
      dispatch(updateAdminAccountApiThunk(value, func));
    },
    validateAdminAccount: (value) => {
      dispatch(validCheck(value));
    },
    getIndustryList: () => {
      dispatch(getIndustryListApiThunk());
    },
    getCountryList: () => {
      dispatch(getCountryListThunk());
    },
    getLanguageLookupData: (params) => {
      dispatch(getLanguageLookupDataThunk(params));
    },
    getLocaleLookUpData: (params) => {
      dispatch(getLocaleLookUpDataThunk(params));
    },
    clearLocaleLookUpData: () => {
      dispatch(clearLocaleLookUpDataAction());
    },
    getTimeZoneLookUpData: (params) => {
      dispatch(getTimeZoneLookUpDataThunk(params));
    },
    modalDetailsClear: () => {
      dispatch(modalAdminAccountDataClear());
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAccounts);
