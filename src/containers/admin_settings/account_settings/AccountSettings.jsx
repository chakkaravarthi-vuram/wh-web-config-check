import React, { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Row } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import { useTranslation } from 'react-i18next';
import { RadioGroup, SingleDropdown, Label as LabelText, SegmentedControl, Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import FileCropPreviewComp from 'components/file_crop_preview/FileCropPreview';
import { getUpdatedDocumentUrlDetailsForAccountModal } from 'containers/landing_page/account_info/AccountInfoModal.validation.schema';
import { ACCOUNT_INFO_STRINGS } from 'containers/landing_page/account_info/AccountInfoModal.string';
import useFileUploadHook from 'hooks/useFileUploadHook';
import Label from 'components/form_components/label/Label';
import Input from '../../../components/form_components/input/Input';
import Button from '../../../components/form_components/button/Button';
import Alert from '../../../components/form_components/alert/Alert';
import FormTitle from '../../../components/form_components/form_title/FormTitle';
import CustomCol from '../../../components/custom_col/CustomCol';
import Dropdown from '../../../components/form_components/dropdown/Dropdown';
import AttachmentsIcon from '../../../assets/icons/AttachmentsIcon';

import {
  compareObjects,
  mergeObjects,
  updateErrorPopoverInRedux,
  setPointerEvent,
  keydownOrKeypessEnterHandle,
  constructThemeData,
} from '../../../utils/UtilityFunctions';
import jsUtils, { isEmpty, nullCheck } from '../../../utils/jsUtility';
import { colorCodeAction, updateAccountLogoAction, adminProfileAction } from '../../../redux/actions/Actions';
import { EMPTY_STRING, ENTITY, DOCUMENT_TYPES, FILE_CROP_PREVIEW_TEXT } from '../../../utils/strings/CommonStrings';
import {
  getUpdatedAccountDetailsData,
  getAccountDetailsCompareData,
  getAccountDetailsInitialData,
  getCompareValuesFromServer,
} from './AccountSettings.validate.schema';
import { generatePostServerErrorMessage } from '../../../server_validations/ServerValidation';
import { ADMIN_SETTINGS_LABELS, CUSTOM_LAYOUT_COL, SAVE_BUTTON_COL_SIZE } from '../AdminSettings.strings';
import { BS } from '../../../utils/UIConstants';
import { BUTTON_TYPE, KEY_CODES } from '../../../utils/Constants';
import {
  ACCOUNT_SETTINGS_FORM, ADMIN_THEME_COLORS, ADMIN_THEME_TYPE, APP_BG_SWATCHES, BUTTON_EDGE_LABEL, BUTTON_EDGE_TYPE,
  COLOR_THEME_OPTIONS, FIELD_ERRORS, FONTS_OPTION_LIST, FONT_FAMILY_LABEL, HIGHLIGHT_SWATCHES,
  INDUSTRY_TYPE, THEME_COLOR_TYPE, THEME_ID, WIDGET_BG_SWATCHES, BUTTON_SWATCHES, DEFAULT_FONT_FAMILY, DEFAULT_FIELD_EDGE,
} from './AccountSettings.strings';
import { cancelAccountDetails, cancelUpdateDetails, cancelGetIndustryListDetails } from '../../../axios/apiService/accountSettings.apiService';
import {
  accountMainDetailsApiThunk,
  updateAccountMainDetailsApiThunk,
  accountSettingSetState,
  getUploadSignedUrlApiThunk,
  accountSettingClearState,
  getIndustryListApiThunk,
} from '../../../redux/actions/AccountSettings.Action';
import FormPostOperationFeedback from '../../../components/popovers/form_post_operation_feedback/FormPostOperationFeedback';
import styles from './AccountSettings.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { getExtensionFromFileName } from '../../../utils/generatorUtils';
import ThemeContext from '../../../hoc/ThemeContext';
import ThemeColor from './admin_theme_color/ThemeColor';
import ThemeSwatchSettings from './admin_theme_color/ThemeSwatchSettings';
import { ADMIN_SETTINGS_CONSTANT } from '../AdminSettings.constant';
import FileUpload from '../../../components/form_components/file_upload/FileUpload';
import CheckboxGroup from '../../../components/form_components/checkbox_group/CheckboxGroup';

function AccountSettings(props) {
  const [currentFileData, setCurrentFileData] = useState();
  const [showOriginal, setShowOriginalImage] = useState(false);
  const [refUUID, setRefUUID] = useState('');
  const { state } = props;
  const { t } = useTranslation();
  const { colorScheme, setColorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const getFileData = (doc_details, file_ref_uuid) => {
    const { account_settings } = state;
    let ref_uuid = refUUID;
    if (isEmpty(refUUID)) {
      ref_uuid = uuidv4();
      setRefUUID(ref_uuid);
    }
    const fileData = {
        type: doc_details?.isFavicon ? DOCUMENT_TYPES.ACCOUNT_FAVICON : DOCUMENT_TYPES.ACCOUNT_LOGO,
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
    data.entity_id = account_settings._id;
    data.ref_uuid = ref_uuid;
    return data;
  };
  const {
    onRetryFileUpload,
    onFileUpload,
    documentDetails,
    uploadFile,
    onDeletFileUpload,
} = useFileUploadHook(getFileData);

  useEffect(() => {
    const { accountMainDetailsApiCall } = props;
    accountMainDetailsApiCall(colorScheme, setColorScheme);
    const { getIndustryListApiCall } = props;
    getIndustryListApiCall();
  }, []);

  useEffect(() => () => {
      const { clearState } = props;
      cancelAccountDetails();
      cancelUpdateDetails();
      cancelGetIndustryListDetails();
      clearState();
    }, []);

  const getUpdatedData = (data) => {
    const { state, setState } = props;
    const { acc_logo, acc_favicon } = state;
    if (nullCheck(data, 'document_url_details.length', true)) {
      console.log('statedtaaaa', state, data);
      if (acc_logo) {
        data.document_url_details.forEach((document) => {
          if (document.document_id === data.acc_logo) {
            setState({
              acc_logo_pic_id: acc_logo,
              acc_logo: document.signedurl,
              acc_initial_logo: document.signedurl,
            });
            const { updateAccountLogo } = props;
            updateAccountLogo(document.signedurl);
          }
        });
    }
    if (acc_favicon) {
      data.document_url_details.forEach((document) => {
        if (document.document_id === data.acc_favicon) {
          setState({
            acc_favicon: data.acc_favicon,
          });
        }
      });
  }
    }
    const account_settings = { ...state.account_settings };
    Object.keys(data).forEach((id) => {
      if (id === ACCOUNT_SETTINGS_FORM.ACCOUNT_LOGO.ID) account_settings[id] = data.document_url_details[0].signedurl;
      else account_settings[id] = data[id];
    });
    console.log(account_settings);
    onDeletFileUpload();
    setCurrentFileData();
    setShowOriginalImage(true);
    setState({ document_details: {}, accFaviconDocument: {}, acc_favicon: EMPTY_STRING });
    return account_settings;
  };

  const updateError = (error) => {
    const { state, setState } = props;
    const server_error = { ...state.server_error };
    const errors = generatePostServerErrorMessage(error, server_error, ADMIN_SETTINGS_LABELS);
    console.log('ERRORLIST UPDATE', error, errors);
    setState({
      server_error: errors.state_error ? errors.state_error : [],
      common_server_error: errors.common_server_error ? errors.common_server_error : EMPTY_STRING,
      is_data_loading: false,
    });
    if (jsUtils.isEmpty(errors.state_error)) {
      updateErrorPopoverInRedux(ACCOUNT_SETTINGS_FORM.UPDATE_FAILURE, errors.common_server_error);
    }
  };

  const updateAccountDetails = (data) => {
    console.log('UPDATE ACCOUNT DETAILS', data);
    const { updateAccountMainDetailsApiCall } = props;
    setPointerEvent(true);
    updateAccountMainDetailsApiCall(data, getUpdatedData, updateError, setColorScheme);
  };

  const updateDetails = () => {
    const { state, setState } = props;
    const { account_settings, acc_logo, enable_button, document_details } = state;
    const data = getUpdatedAccountDetailsData(getAccountDetailsInitialData(account_settings), {
      ...state,
    });
    data.industry_type = state.industry_type;

    data.is_default_theme = state.is_default_theme;
    data.is_show_app_tasks = state.is_show_app_tasks;

    const color_scheme = (state.is_default_theme) ? colorSchemeDefault : state.admin_theme;

    data.theme = {
      color: constructThemeData(color_scheme),
      field_edge_type: account_settings?.theme?.field_edge_type || DEFAULT_FIELD_EDGE,
      font_family: account_settings?.theme?.font_family || DEFAULT_FONT_FAMILY,
    };
    if (state?.accFaviconDocument?.document_details) {
      data.acc_favicon = state.acc_favicon;
      data.document_details = state.accFaviconDocument.document_details;
    }
    if (!jsUtils.isEmpty(document_details)) {
    data.acc_logo = acc_logo;
    data.document_details = document_details;
    }
    if (acc_logo?.files && acc_logo.files[0]) {
      setPointerEvent(true);
      setShowOriginalImage(false);
      onFileUpload(currentFileData);
      setState({ acc_initial_logo: currentFileData });
    } else if (enable_button) {
      updateAccountDetails(data);
    }
  };

  const compareValuesAndEnableButton = (stateToBeMerged) => {
    const { state } = props;
    const { account_settings } = state;
    const is_equal = compareObjects(
      getAccountDetailsCompareData({
        ...state,
        ...stateToBeMerged,
      }),
      getCompareValuesFromServer(account_settings),
    );
    return !is_equal;
  };

  const onIndustrySelected = (event) => {
    const { value } = event.target;
    const { state, setState } = props;
    const { industry_type } = state;
    const industryList = jsUtils.isUndefined(industry_type)
      ? []
      : jsUtils.cloneDeep(industry_type);
    if (!industryList.includes(value)) {
      industryList.push(value);
    } else {
      industryList.splice(industryList.indexOf(value), 1);
    }
    if (!isEmpty(industryList)) { state.error_list[INDUSTRY_TYPE.INDUSTRY_TYPE_ID] = null; }
    const stateToBeMerged = { industry_type: industryList };
    const enable_button = compareValuesAndEnableButton(stateToBeMerged);
    setState({ ...stateToBeMerged, enable_button });
  };

  const getAccountDetailsValidateData = () => {
    const { state } = props;
    const data = {
      [ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID]: state.account_name.trim(),
      [INDUSTRY_TYPE.INDUSTRY_TYPE_ID]: state.industry_type,
    };
    return data;
  };

  const validateData = () => {
    const { setState, state } = props;
    const { error_list, colorCodeError } = state;
    console.log('state', state, props);
    const data = getAccountDetailsValidateData();
    let errors = {};
    if (jsUtils.isEmpty(data[ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID])) errors[ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID] = FIELD_ERRORS.ACCOUNT_NAME(t).IS_EMPTY;
    else errors[ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID] = null;
    if (jsUtils.isEmpty(data[INDUSTRY_TYPE.INDUSTRY_TYPE_ID])) errors[INDUSTRY_TYPE.INDUSTRY_TYPE_ID] = FIELD_ERRORS.INDUSTRY_TYPE(t).IS_EMPTY;
    else errors[INDUSTRY_TYPE.INDUSTRY_TYPE_ID] = null;
    if (!jsUtils.isEmpty(state?.account_settings?.acc_favicon) && jsUtils.isEmpty(state.faviconDocument)) errors[ACCOUNT_SETTINGS_FORM.ACCOUNT_FAVICON.ID] = FIELD_ERRORS.ACCOUNT_FAVICON(t).IS_EMPTY;
    else errors[ACCOUNT_SETTINGS_FORM.ACCOUNT_FAVICON.ID] = null;
    errors = jsUtils.removeNilFieldsFromObject({ ...error_list, ...errors });
    setState({
      error_list: errors,
    });
    if (jsUtils.isEmpty(errors) && jsUtils.isEmpty(colorCodeError)) {
      updateDetails();
    }
  };

  const onSaveClicked = (event) => {
    event.preventDefault();
    validateData();
  };

  const onEnterKeyPressed = (event) => {
    if (event?.keyCode === KEY_CODES.ENTER) {
      validateData();
    }
  };

  const onCancelClicked = (event) => {
    const { state, setState } = props;
    const { account_settings } = state;
    event.preventDefault();
    const data = getAccountDetailsInitialData(account_settings);
    setState({
      ...data,
      enable_button: false,
      error_list: [],
      server_error: [],
      account_settings,
      acc_logo: state.acc_initial_logo,
      admin_theme: colorScheme,
      is_default_theme: state.is_default_theme_initial,
    });
    setShowOriginalImage(true);
  };

  const onChangeHandler = (id) => async (event) => {
    const { setState, state } = props;
    const { error_list } = state;
    const errors = {};
    if (jsUtils.isEmpty(event.target.value)) {
      errors[ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID] = FIELD_ERRORS.ACCOUNT_NAME.IS_EMPTY;
    } else errors[ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID] = null;
    const stateToBeMerged = {
      [id]: event.target.value,
      server_error: [],
      common_server_error: EMPTY_STRING,
      isAccountNameUnique: false,
      error_list: { ...error_list, ...errors },
    };
    const enable_button = compareValuesAndEnableButton(stateToBeMerged);
    await setState({
      ...stateToBeMerged,
      enable_button,
    });
  };

  const apiCallWithFileUpload = (acc_logo, file) => {
    const { state } = props;
    const { account_settings } = state;
    const data = getUpdatedAccountDetailsData(getAccountDetailsInitialData(account_settings), {
      ...state,
    });
    data.industry_type = state.industry_type;
    data.is_default_theme = state.is_default_theme;
    data.is_show_app_tasks = state.is_show_app_tasks;
    const color_scheme = (state.is_default_theme) ? colorSchemeDefault : state.admin_theme;
    data.theme = {
      color: constructThemeData(color_scheme),
      field_edge_type: account_settings?.theme?.field_edge_type || DEFAULT_FIELD_EDGE,
      font_family: account_settings?.theme?.font_family || DEFAULT_FONT_FAMILY,
    };
    if (!isEmpty(state?.accFaviconDocument)) {
      data.acc_favicon = state.acc_favicon;
      file.document_details.uploaded_doc_metadata = file.document_details.uploaded_doc_metadata.concat(state.accFaviconDocument.document_details.uploaded_doc_metadata);
    }
    data.acc_logo = acc_logo;
    data.document_details = file.document_details;
    updateAccountDetails(data);
  };
  const onDeleteFileUpload = () => {
    const { setState } = props;
    setState({ faviconDocument: [], accFaviconDocument: {}, enable_button: true });
  };
  useEffect(() => {
    const { setState } = props;
    if (!jsUtils.isEmpty(documentDetails.file_metadata) && !jsUtils.isEmpty(uploadFile)) {
        const file_upload_details = getUpdatedDocumentUrlDetailsForAccountModal(documentDetails, documentDetails.file_metadata[0]._id);
        if (file_upload_details?.acc_favicon) {
          setState({ acc_favicon: file_upload_details.acc_favicon, accFaviconDocument: file_upload_details, faviconDocument: [uploadFile] });
        } else {
          setState({ acc_logo: documentDetails.file_metadata[0]._id, ...file_upload_details, accLogoDocument: file_upload_details });
          apiCallWithFileUpload(documentDetails.file_metadata[0]._id, file_upload_details);
        }
    }
}, [documentDetails?.file_metadata, documentDetails?.file_metadata?.length]);

  const onDeleteLogoClick = () => {
    const { setState, state } = props;
    onDeletFileUpload();
    setCurrentFileData();
    const enable_button = compareValuesAndEnableButton();
    setState({ acc_logo: state.acc_initial_logo, enable_button });
};

  const { account_industry, industry_type } = state;
  const industryType = [...account_industry, industry_type];
  console.log('industry_type', account_industry, industry_type, industryType);
  console.log('industry_type RENDER');
  let image_url;
  if (!jsUtils.isEmpty(state.acc_logo)) {
    image_url = Object.prototype.hasOwnProperty.call(state.acc_logo, ACCOUNT_SETTINGS_FORM.ACCOUNT_LOGO.PROPERTY)
      ? state.acc_logo.base64
      : state.acc_logo;
  } else image_url = null;
  let save_and_cancel_buttons = null;
  const error_list = { ...state.error_list };
  const server_error = { ...state.server_error };
  const errors = mergeObjects(error_list, server_error);
  const isDataLoading = state.is_data_loading;

  if (state.enable_button) {
    save_and_cancel_buttons = (
      <Row className={cx(gClasses.MT20, BS.JC_CENTER)}>
        <CustomCol size={SAVE_BUTTON_COL_SIZE}>
          <Button
            id="account_settings_cancel"
            buttonType={BUTTON_TYPE.SECONDARY}
            onClick={onCancelClicked}
            className={BS.PADDING_0}
            width100
          >
            {t(ACCOUNT_SETTINGS_FORM.CANCEL.LABEL)}
          </Button>
        </CustomCol>
        <CustomCol size={SAVE_BUTTON_COL_SIZE}>
          <Button
            id="account_settings_save"
            buttonType={BUTTON_TYPE.PRIMARY}
            onClick={onSaveClicked}
            className={BS.PADDING_0}
            width100
          >
            {t(ACCOUNT_SETTINGS_FORM.SAVE.LABEL)}
          </Button>
        </CustomCol>
      </Row>
    );
  }

  const onColorSwatchSelect = (id, color) => {
    // on swatch click, redux state updated, only on clicking save button, reducer state updated to ThemeContext
    const { state, setState } = props;
    const { admin_theme } = state;
    const adminTheme = jsUtils.cloneDeep(admin_theme);

    switch (id) {
      case THEME_ID.HIGHLIGHT:
        adminTheme.highlight = color.hex;
        break;
      case THEME_ID.WIDGET:
        adminTheme.widgetBg = color.hex;
        break;
      case THEME_ID.BACKGROUND:
        adminTheme.appBg = color.hex;
        break;
      case THEME_ID.BUTTON:
        adminTheme.activeColor = color.hex;
        break;
      default: break;
    }

    const stateToBeMerged = { admin_theme: adminTheme };
    const enable_button = compareValuesAndEnableButton(stateToBeMerged);
    setState({ admin_theme: adminTheme, enable_button });
  };

  const onThemeChange = (event, id, value) => {
    const { setState } = props;
    const stateToBeMerged = { is_default_theme: value };
    const enable_button = compareValuesAndEnableButton(stateToBeMerged);
    setState({ ...stateToBeMerged, enable_button });
  };

  const onEnableTaskChangeHandler = (id, event) => {
    const { setState } = props;
    const stateToBeMerged = { is_show_app_tasks: !event };
    setState({ ...stateToBeMerged, enable_button: true });
  };

  const onAddFile = (fileData) => {
    const { setState } = props;
    setState({
      acc_logo: fileData,
      file_ref_uuid: uuidv4(),
      enable_button: true,
    });
    setCurrentFileData(fileData);
    setShowOriginalImage(false);
  };

  const getSwatchesPopper = (id) => {
    const { state } = props;
    const themeSettings = {
      activeColor: '',
      defaultColors: [],
      colorId: '',
      disableColorSlider: false,
      outerClass: EMPTY_STRING,
    };
    switch (id) {
      case THEME_ID.HIGHLIGHT:
        themeSettings.colorId = THEME_ID.HIGHLIGHT;
        themeSettings.defaultColors = HIGHLIGHT_SWATCHES;

        themeSettings.activeColor = state.admin_theme.highlight;
        break;
      case THEME_ID.WIDGET:
        themeSettings.colorId = THEME_ID.WIDGET;
        themeSettings.defaultColors = WIDGET_BG_SWATCHES;
        themeSettings.disableColorSlider = true;
        themeSettings.outerClass = styles.BlockPicker;

        themeSettings.activeColor = state.admin_theme.widgetBg;
        break;
      case THEME_ID.BACKGROUND:
        themeSettings.colorId = THEME_ID.BACKGROUND;
        themeSettings.defaultColors = APP_BG_SWATCHES;
        themeSettings.disableColorSlider = true;
        themeSettings.outerClass = styles.BlockPicker;

        themeSettings.activeColor = state.admin_theme.appBg;
        break;
      case THEME_ID.BUTTON:
        themeSettings.colorId = THEME_ID.BUTTON;
        themeSettings.defaultColors = BUTTON_SWATCHES;

        themeSettings.activeColor = state.admin_theme.activeColor;
        break;
      default: break;
    }
    return (
      <ThemeSwatchSettings
        disableColorSlider={themeSettings.disableColorSlider}
        onColorGradientPick={(color) => onColorSwatchSelect(themeSettings.colorId, color)}
        activeColor={themeSettings.activeColor}
        defaultColors={themeSettings.defaultColors}
        outerClass={themeSettings.outerClass}
      />
    );
  };

  console.log('highlightBg', state.admin_theme, 'is_default_theme', state.is_default_theme);

  return (
    <Row className={cx(styles.AccountContainer)}>
      <CustomCol size={CUSTOM_LAYOUT_COL} className={gClasses.P0}>
        <div>
          <FormTitle isDataLoading={isDataLoading} fontFamilyStyle={styles.FontFamilyStyle}>{t(ACCOUNT_SETTINGS_FORM.ACCOUNT_DETAILS)}</FormTitle>
        </div>
        <FormPostOperationFeedback className={styles.InputSize} id="account_settings" />
        <div className={styles.InputBox}>
        <Input
          id={ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID}
          label={t(ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.LABEL)}
          placeholder={t(ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.PLACEHOLDER)}
          value={state.account_name}
          onChangeHandler={onChangeHandler(ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID)}
          errorMessage={errors[ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID]}
          isDataLoading={isDataLoading}
          onKeyDownHandler={onEnterKeyPressed}
          isRequired
          inputContainerClass={styles.AccountName}
          labelClassAdmin={cx(styles.labelClass)}
        />
        <Input
          id={ACCOUNT_SETTINGS_FORM.ACCOUNT_DOMAIN.ID}
          label={t(ACCOUNT_SETTINGS_FORM.ACCOUNT_DOMAIN.LABEL)}
          placeholder={t(ACCOUNT_SETTINGS_FORM.ACCOUNT_DOMAIN.PLACEHOLDER)}
          readOnly
          value={state.account_domain}
          readOnlySuffix={ACCOUNT_SETTINGS_FORM.ACCOUNT_DOMAIN.SUFFIX}
          isDataLoading={isDataLoading}
          inputContainerClass={styles.AccountName}
          labelClassAdmin={cx(styles.labelClass)}
        />
        </div>
        <Dropdown
          id={INDUSTRY_TYPE.INDUSTRY_TYPE_ID}
          optionList={state.industry_list}
          onChange={onIndustrySelected}
          selectedValue={state.industry_type}
          setSelectedValue
          label={t(INDUSTRY_TYPE.INDUSTRY_TYPE_LABEL)}
          isMultiSelect
          isRequired
          comboboxClass={styles.dropdownWidth}
          errorMessage={state.error_list[INDUSTRY_TYPE.INDUSTRY_TYPE_ID]}
          isDataLoading={isDataLoading}
          labelClassAdmin={cx(styles.labelClass)}
          inputDropdownContainer={styles.InputSize}
          optionListDropDown={styles.OptionListDropDown}
          disablePopper
        />

        <FormTitle isDataLoading={isDataLoading} fontFamilyStyle={styles.FontFamilyStyle}>{t(ACCOUNT_SETTINGS_FORM.BRANDING_AND_THEME)}</FormTitle>
        <Label labelFor="file-upload" content={t(ACCOUNT_SETTINGS_FORM.ACCOUNT_LOGO.LABEL)} labelStyles={styles.LogoLabel} isDataLoading={isDataLoading} hideLabelClass />
        <FileCropPreviewComp
          id="file-upload"
          imageSrc={uploadFile?.file}
          onFileUpload={onFileUpload}
          instructionMessage={`${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_1)} ${ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.MB} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_2)} ${ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.MIN_WIDTH} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_3)} ${ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.MIN_HEIGHT} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_4)} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_5)}`}
          addFile={(fileData) => onAddFile(fileData)}
          errorMessage={error_list && error_list[ACCOUNT_SETTINGS_FORM.ACCOUNT_LOGO.ID]}
          uploadFile={uploadFile}
          onDeleteLogoClick={onDeleteLogoClick}
          onRetryFileUpload={onRetryFileUpload}
          imgSrc={image_url}
          showOriginal={showOriginal}
          isAdminSettings
          instructionMessageStyles={styles.InstructionMessageStyles}
          // updatedImageContainer={styles.UpdatedImageContainer}
          label={t(FILE_CROP_PREVIEW_TEXT.ADD_COMPANY_LOGO)}
        />
        <FileUpload
          id={t(ACCOUNT_SETTINGS_FORM.ACCOUNT_FAVICON.ID)}
          label={t(ACCOUNT_SETTINGS_FORM.ACCOUNT_FAVICON.LABEL)}
          addFile={(fileData, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple, currentFileIndex) => {
            console.log(fileData, 'fileData');
            const { setState } = props;
            fileData.isFavicon = true;
            setState({ enable_button: true });
            onFileUpload(fileData, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple, currentFileIndex);
          }}
          maximum_file_size={0.06}
          fileName={state.faviconDocument}
          allowed_extensions={['ico']}
          errorMessage={error_list && error_list[ACCOUNT_SETTINGS_FORM.ACCOUNT_FAVICON.ID]}
          onDeleteClick={onDeleteFileUpload}
          onRetryClick={onRetryFileUpload}
          uploadIcon={<AttachmentsIcon />}
          innerClassName={cx(gClasses.P5)}
          instructionMessageStyles={styles.InstructionMessageStyles}
          instructionMessage={ACCOUNT_SETTINGS_FORM.ACCOUNT_FAVICON.INSTRUCTION}
        />
        <div className={cx(BS.D_FLEX, BS.JC_START, gClasses.MB10)}>
        <Text
          content={t(ACCOUNT_SETTINGS_FORM.ENABLE_TASK.TITLE)}
          size={ETextSize.MD}
          className={cx(gClasses.FontWeight600)}
          isLoading={isDataLoading}
        />
        <CheckboxGroup
          id={ACCOUNT_SETTINGS_FORM.ENABLE_TASK.ENABLE_TASK_ID}
          className={cx(gClasses.ML10)}
          optionList={ACCOUNT_SETTINGS_FORM.ENABLE_TASk_OPTION}
          onClick={() => {
            onEnableTaskChangeHandler(
              ACCOUNT_SETTINGS_FORM.ENABLE_TASK.ENABLE_TASK_ID,
              state?.is_show_app_tasks,
            );
          }}
          selectedValues={state.is_show_app_tasks ? [1] : []}
          hideLabel
          isSlider
          hideOptionLabel
          isDataLoading={isDataLoading}
          sliderAriaLabel={t(ACCOUNT_SETTINGS_FORM.ENABLE_TASK.TITLE)}
        />
        </div>
        <RadioGroup
          id={ADMIN_THEME_TYPE.ID}
          labelText={ADMIN_THEME_TYPE.LABEL}
          selectedValue={state.is_default_theme}
          options={COLOR_THEME_OPTIONS}
          required
          onChange={onThemeChange}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onThemeChange}
        />
        {!state.is_default_theme ? (
          <>
            <LabelText labelName={FONT_FAMILY_LABEL} className={gClasses.MT16} />
            <SingleDropdown
              optionList={FONTS_OPTION_LIST}
              className={cx(gClasses.MB15, styles.FontDropdown)}
              dropdownViewProps={
                {
                  disabled: true,
                  selectedLabel: 'Inter',
                }
              }
            />
            <SegmentedControl
              labelText={BUTTON_EDGE_LABEL}
              options={BUTTON_EDGE_TYPE}
              selectedValue={BUTTON_EDGE_TYPE[1].value}
              disabled
            />
            <LabelText labelName={ADMIN_THEME_COLORS.LABEL} className={gClasses.MT16} />
            <div className={BS.D_FLEX}>
              <ThemeColor
                themeTypeName={THEME_COLOR_TYPE.HIGHLIGHT}
                bgColor={state.admin_theme?.highlight}
                popperContent={getSwatchesPopper(THEME_ID.HIGHLIGHT)}
              />
              <ThemeColor
                themeTypeName={THEME_COLOR_TYPE.WIDGET}
                className={gClasses.ML24}
                bgColor={state.admin_theme?.widgetBg}
                popperContent={getSwatchesPopper(THEME_ID.WIDGET)}
              />
              <ThemeColor
                themeTypeName={THEME_COLOR_TYPE.BACKGROUND}
                className={gClasses.ML24}
                bgColor={state.admin_theme?.appBg}
                popperContent={getSwatchesPopper(THEME_ID.BACKGROUND)}
              />
              <ThemeColor
                themeTypeName={THEME_COLOR_TYPE.BUTTON}
                className={gClasses.ML24}
                bgColor={state.admin_theme?.activeColor}
                popperContent={getSwatchesPopper(THEME_ID.BUTTON)}
              />
            </div>
          </>
        ) : null}
        <Alert content={state.common_server_error} className={gClasses.MT20} />
        {save_and_cancel_buttons}
      </CustomCol>
    </Row>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setColorCode: (value) => {
      dispatch(colorCodeAction(value));
    },
    updateAdminProfile: (value) => {
      dispatch(adminProfileAction(value));
    },
    updateAccountLogo: (value) => {
      dispatch(updateAccountLogoAction(value));
    },
    accountMainDetailsApiCall: (colorScheme, setColorScheme) => {
      dispatch(accountMainDetailsApiThunk(colorScheme, setColorScheme));
    },
    updateAccountMainDetailsApiCall: (value, func1, func2, setColorScheme) => {
      dispatch(updateAccountMainDetailsApiThunk(value, func1, func2, setColorScheme));
    },
    setState: (value) => {
      dispatch(accountSettingSetState(value));
    },
    getUploadSignedUrlApiCall: (value, func, file, type) => {
      dispatch(getUploadSignedUrlApiThunk(value, func, file, type));
    },
    clearState: () => {
      dispatch(accountSettingClearState());
    },
    getIndustryListApiCall: () => {
      dispatch(getIndustryListApiThunk());
    },
    dispatch,
  };
};
const mapStateToprops = (state) => {
  return {
    strings: state.LocalizationReducer.languageSettings,
    state: state.AccountSettingsReducer,
  };
};

AccountSettings.propTypes = {
  setColorCode: PropTypes.func.isRequired,
  updateAccountLogo: PropTypes.func.isRequired,
  updateAccountMainDetailsApiCall: PropTypes.func.isRequired,
  accountMainDetailsApiCall: PropTypes.func.isRequired,
  state: PropTypes.objectOf(PropTypes.any).isRequired,
  setState: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
};
export default withRouter(connect(mapStateToprops, mapDispatchToProps)(AccountSettings));
