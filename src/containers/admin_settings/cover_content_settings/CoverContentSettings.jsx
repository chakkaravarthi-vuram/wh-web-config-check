import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import { useHistory, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import FileCropPreviewComp from 'components/file_crop_preview/FileCropPreview';
import useFileUploadHook from 'hooks/useFileUploadHook';
import { DOCUMENT_TYPES, EMPTY_STRING, ENTITY, FORM_POPOVER_STRINGS } from 'utils/strings/CommonStrings';
import { getExtensionFromFileName } from 'utils/generatorUtils';
import { ACCOUNT_INFO_STRINGS } from 'containers/landing_page/account_info/AccountInfoModal.string';
import { getUpdatedDocumentUrlDetailsForAccountModal } from 'containers/landing_page/account_info/AccountInfoModal.validation.schema';
import { DATE, FORM_POPOVER_STATUS } from 'utils/Constants';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import styles from './CoverContentSettings.module.scss';
import RadioGroup from '../../../components/form_components/radio_group/RadioGroup';
import {
  COVER_IMAGE_OR_MESSAGE,
  DEFAULT_TIME_SETTINGS,
} from './CoverContentSettings.strings';
import {
  coverContentSettingsClearState,
  coverContentSettingsSetState,
  getAccountCoverDetailsApi,
  getUploadSignedUrlApiThunk,
  updateAccountCoverDetailsApi,
} from '../../../redux/actions/CoverContentSettings.Action';
import ButtonTab from '../../../components/button_tab/ButtonTab';
import DateTimeWrapper from '../../../components/date_time_wrapper/DateTimeWrapper';
import jsUtils, { nullCheck } from '../../../utils/jsUtility';
import {
  getTimeZoneLabelString,
  modifyServerError,
  onChangeHandler,
  onCoverSettingsCancelClicked,
  onCoverSettingsSaveClicked,
  validateAndCompareData,
} from './CoverContentSettings.utils';
import TextArea from '../../../components/form_components/text_area/TextArea';
import GradientPicker from '../../../components/form_components/gradient_picker/GradientPicker.';
import { mergeObjects, showToastPopover } from '../../../utils/UtilityFunctions';
import FormTitle from '../../../components/form_components/form_title/FormTitle';
import Label from '../../../components/form_components/label/Label';
import FormPostOperationFeedback from '../../../components/popovers/form_post_operation_feedback/FormPostOperationFeedback';
import { BS } from '../../../utils/UIConstants';
import { SAVE_BUTTON_COL_SIZE } from '../AdminSettings.strings';
import CustomCol from '../../../components/custom_col/CustomCol';
import Button from '../../../components/form_components/button/Button';
import { ACCOUNT_SETTINGS_FORM } from '../account_settings/AccountSettings.strings';
import { BUTTON_TYPE } from '../../../utils/Constants';
import { GRADIENT_PICKER_VARIANTS } from '../../../components/form_components/gradient_picker/GradientPicker.strings';
import gClasses from '../../../scss/Typography.module.scss';
import { ADMIN_SETTINGS_CONSTANT } from '../AdminSettings.constant';

function CoverContentSettings(props) {
  const {
    is_cover,
    cover_type,
    cover_message,
    cover_color,
    acc_cover_pic,
    setState,
    cover_duration,
    error_list,
    server_error,
    acc_cover_pic_url,
    getAccountCoverDetailsApiCall,
    coverContentSettingsClearStateAction,
    isDataLoading,
    enableButton,
    serverData,
    updateAccountCoverDetailsApiCall,
    durationType,
    cover_date_type,
    timezone,
  } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const errors = mergeObjects(error_list, modifyServerError(server_error));
  let coverPictureOrMessageView = null;
  let coverContentTypeButtonTab = null;
  let coverContentDatePicker = null;
  let saveAndCancelButtons = null;
  let isCurrentDateTimeEnabled = durationType === DEFAULT_TIME_SETTINGS.VISIBILITY.LIST[0].value;
  const [currentFileData, setCurrentFileData] = useState();
  const [showOriginal, setShowOriginalImage] = useState(false);

  let fromDateError = jsUtils.get(error_list, ['from_date'], EMPTY_STRING);
  let toDateError = jsUtils.get(error_list, ['to_date'], EMPTY_STRING);
  const setDurationError = jsUtils.get(error_list, [COVER_IMAGE_OR_MESSAGE.COVER_DURATION_TYPE.ID], EMPTY_STRING);
  const from_date = moment().tz(timezone).format(DATE.UTC_DATE_WITH_TIME_STAMP);

  if (!jsUtils.isEmpty(fromDateError) && !jsUtils.isEmpty(toDateError)) {
    if (!fromDateError.includes('valid')) fromDateError = EMPTY_STRING;
  }
  if (!jsUtils.isEmpty(toDateError)) {
    if (!toDateError.includes('valid')) {
      if (cover_date_type === COVER_IMAGE_OR_MESSAGE.DURATION.DURATION_DROPDOWN[2].value) {
        if (toDateError.includes('greater than')) {
          toDateError = t(ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.TO_DATE_ERROR_MSG);
        }
      } else if (isCurrentDateTimeEnabled) {
        toDateError = t(ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.END_DATE_ERROR_MSG);
      }
    }
    if (toDateError.includes('Date difference')) {
      toDateError = t(ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.COVER_MESSAGE_TIP);
    }
  }
  useEffect(() => {
    getAccountCoverDetailsApiCall();
    setState({
      cover_duration: { ...cover_duration, from_date },
    });
    return () => {
      coverContentSettingsClearStateAction();
    };
  }, []);

  const getFileData = (doc_details, file_ref_uuid) => {
    const fileData = {
      type: DOCUMENT_TYPES.ACCOUNT_COVER_PIC,
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
    data.entity_id = serverData._id;
    return data;
  };

  const {
    onRetryFileUpload,
    onFileUpload,
    documentDetails,
    uploadFile,
    onDeletFileUpload,
  } = useFileUploadHook(getFileData, null, false);

  const onAddFile = (fileData) => {
    setCurrentFileData(fileData);
    setShowOriginalImage(false);
    setState({
      acc_cover_pic: fileData,
      enableButton: true,
    });
  };

  const onDeleteLogoClick = () => {
    onDeletFileUpload();
    setCurrentFileData();
  };

  const handleDurationChange = (e) => {
    if (cover_date_type === COVER_IMAGE_OR_MESSAGE.DURATION.DURATION_DROPDOWN[1].value) {
      setState({
        cover_duration: { ...cover_duration, from_date },
        durationType: DEFAULT_TIME_SETTINGS.VISIBILITY.LIST[0].value,
      });
    } else if (cover_date_type === COVER_IMAGE_OR_MESSAGE.DURATION.DURATION_DROPDOWN[2].value) {
      isCurrentDateTimeEnabled = false;
      setState({
        cover_duration: { ...cover_duration, from_date },
        durationType: DEFAULT_TIME_SETTINGS.VISIBILITY.LISTS[0].value,
      });
    }
    setState({
      enableButton: true,
      cover_date_type: e.target.value,
      error_list: {},
    });
  };
  const getUpdatedData = (data) => {
    if (nullCheck(data, 'document_url_details.length', true)) {
      setShowOriginalImage(true);
    }
  };

  const apiCallWithFileUpload = () => {
    setCurrentFileData();
    updateAccountCoverDetailsApiCall(history, getUpdatedData, showOriginal);
  };

  const getEndDate = (to_date) => {
    const coverDuration = jsUtils.cloneDeep(cover_duration);
    if (cover_date_type === 'now') {
      coverDuration.from_date = moment().tz(timezone).format(DATE.UTC_DATE_WITH_TIME_STAMP);
    }
    setState({
      cover_duration: {
        ...coverDuration,
        to_date,
      },
    });
    validateAndCompareData(t);
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
      if (documentDetails.file_metadata) {
        setState({
          acc_cover_pic: documentDetails.file_metadata[0]._id,
          document_details: file_upload_details && file_upload_details.document_details,
        });
        apiCallWithFileUpload(
          documentDetails.file_metadata[0]._id,
          file_upload_details,
        );
      }
    }
  }, [
    documentDetails && documentDetails.file_metadata,
    documentDetails &&
    documentDetails.file_metadata &&
    documentDetails.file_metadata.length,
  ]);

  if (enableButton) {
    saveAndCancelButtons = (
      <Row className={cx(gClasses.MT20, BS.JC_CENTER)}>
        <CustomCol size={SAVE_BUTTON_COL_SIZE}>
          <Button
            buttonType={BUTTON_TYPE.SECONDARY}
            onClick={() => onCoverSettingsCancelClicked(setShowOriginalImage)}
            className={BS.PADDING_0}
            width100
          >
            {t(ACCOUNT_SETTINGS_FORM.CANCEL.LABEL)}
          </Button>
        </CustomCol>
        <CustomCol size={SAVE_BUTTON_COL_SIZE}>
          <Button
            buttonType={BUTTON_TYPE.PRIMARY}
            onClick={() => {
              !uploadFile?.isFileUploadInProgress && onCoverSettingsSaveClicked(history, onFileUpload, showOriginal, currentFileData, t);
              if (uploadFile?.isFileUploadInProgress) {
                showToastPopover(
                  `${t('common_strings.attachment')} ${FORM_POPOVER_STRINGS.FILE_UPLOAD_IN_PROGRESS}`,
                  EMPTY_STRING,
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
              }
            }}
            className={BS.PADDING_0}
            width100
          >
            {t(ACCOUNT_SETTINGS_FORM.SAVE.LABEL)}
          </Button>
        </CustomCol>
      </Row>
    );
  }
  if (is_cover) {
    coverContentTypeButtonTab = (
      <ButtonTab
        className={gClasses.MB15}
        id={COVER_IMAGE_OR_MESSAGE.TYPE.ID}
        tabs={COVER_IMAGE_OR_MESSAGE.OPTION_TYPE(t).TYPES}
        selectedTab={cover_type}
        setButtonTab={(id, value) => {
          if (cover_type !== value) {
            onChangeHandler({
              target: {
                id,
                value,
              },
              t,
            });
          }
        }}
        hideLabel
        isDataLoading={isDataLoading}
      />
    );
    coverContentDatePicker = (
      <>
        <Label
          content={
            cover_type === COVER_IMAGE_OR_MESSAGE.TYPE.TYPES[0].value
              ? t(COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.DURATION)
              : t(COVER_IMAGE_OR_MESSAGE.COVER_IMAGE.DURATION)
          }
          isDataLoading={isDataLoading}
          hideLabelClass
        />
        {/* <Label
          content={COVER_IMAGE_OR_MESSAGE.SUB_TITLE.LABEL}
          isDataLoading={isDataLoading}
          hideLabelClass
        /> */}
        <Dropdown
          label={t(COVER_IMAGE_OR_MESSAGE.SUB_TITLE.LABEL)}
          className={gClasses.Width150}
          id={COVER_IMAGE_OR_MESSAGE.COVER_DURATION_TYPE.ID}
          placeholder={t(ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.ADD_DURATION_PLACEHOLDER)}
          optionList={COVER_IMAGE_OR_MESSAGE.DURATION.DURATION_DROPDOWN_OPTION(t)}
          onChange={handleDurationChange}
          errorMessageClassName={styles.CoverDurationError}
          selectedValue={cover_date_type}
          isDataLoading={isDataLoading}
          isTaskDropDown
          errorMessage={setDurationError}
        />
        { cover_date_type !== EMPTY_STRING && (
        <div className={cx(BS.D_FLEX, BS.FLEX_WRAP_WRAP)}>
        <div className={cx(BS.D_FLEX, BS.FLEX_WRAP_WRAP)}>
          <div>
          { cover_date_type === COVER_IMAGE_OR_MESSAGE.DURATION.DURATION_DROPDOWN[2].value && (
          <div className={cx(BS.D_FLEX, gClasses.MR24)}>
            <DateTimeWrapper
              id={COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE.ID}
              enableTime
              label={t(COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE.LABEL)}
              helperMessageClass={styles.ErrorContentWidth}
              placeholder={t(COVER_IMAGE_OR_MESSAGE.DURATION.FROM_DATE.PLACEHOLDER)}
              date={cover_duration.from_date}
              getDate={(from_date) => {
                setState({
                  cover_duration: {
                    ...cover_duration,
                    from_date,
                  },
                });
                validateAndCompareData(t);
              }}
              isDataLoading={isDataLoading}
              errorMessage={fromDateError}
              validations={{
                allow_today: true,
                date_selection: [
                  {
                    sub_type: 'all_future',
                    type: 'future',
                  },
                ],
              }}
            />
          </div>
          )}
          </div>
        <div className={cx(BS.D_FLEX)}>
            <DateTimeWrapper
              id={COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE.ID}
              enableTime
              helperMessageClass={styles.ErrorContentWidth}
              label={cover_date_type === COVER_IMAGE_OR_MESSAGE.DURATION.DURATION_DROPDOWN[2].value ? t(COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE.LABEL) : t(COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE.LABEL_END)}
              placeholder={t(COVER_IMAGE_OR_MESSAGE.DURATION.TO_DATE.PLACEHOLDER)}
              date={cover_duration.to_date}
              getDate={getEndDate}
              isDataLoading={isDataLoading}
              errorMessage={toDateError}
              validations={{
                allow_today: true,
                date_selection: [
                  {
                    sub_type: 'all_future',
                    type: 'future',
                  },
                ],
              }}
            />
        </div>
        </div>
        </div>
        )}
        {isDataLoading ? (
          <div
            className={cx(gClasses.Height16, gClasses.Width200, gClasses.MB5)}
          >
            <Skeleton />
          </div>
        ) : (
          <div className={cx(gClasses.FTwo12GrayV53, gClasses.MB5)}>
            {getTimeZoneLabelString(t)}
          </div>
        )}
      </>
    );

    if (cover_type === COVER_IMAGE_OR_MESSAGE.TYPE.TYPES[1].value) {
      const imgSrc = jsUtils.nullCheck(acc_cover_pic, 'base64')
        ? acc_cover_pic.base64
        : acc_cover_pic_url;
      coverPictureOrMessageView = (
        <div className={gClasses.MB15}>
          <FileCropPreviewComp
            id="account_logo_id"
            imageSrc={uploadFile && uploadFile.file}
            onFileUpload={onFileUpload}
            instructionMessage={`${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_1)} ${ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.MB} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_2)} ${ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.MIN_WIDTH} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_3)} ${ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.MIN_HEIGHT} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_4)} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_5)}`}
            instructionClassName={cx(
              gClasses.FTwo12GrayV74,
            )}
            addFile={(fileData) => onAddFile(fileData)}
            errorMessage={null}
            uploadFile={uploadFile}
            onDeleteLogoClick={onDeleteLogoClick}
            onRetryFileUpload={onRetryFileUpload}
            imgSrc={imgSrc}
            showOriginal={showOriginal}
            isAdminSettings
            label={t(COVER_IMAGE_OR_MESSAGE.COVER_IMAGE.LINK)}
            maxHeight={96}
          />
        </div>
      );
    } else if (cover_type === COVER_IMAGE_OR_MESSAGE.TYPE.TYPES[0].value) {
      coverPictureOrMessageView = (
        <>
          <Row>
            <Col lg={8} sm={12}>
              <span id={`${COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID}_label`} aria-label="message" />
              <TextArea
                id={COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID}
                placeholder={t(COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.PLACEHOLDER)}
                hideLabel
                isDataLoading={isDataLoading}
                onChangeHandler={(event) => { onChangeHandler(event, t); }}
                value={cover_message}
                hideMessage={jsUtils.isEmpty(cover_message) ? jsUtils.isEmpty(
                  errors[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID],
                ) : null}
                errorMessage={!jsUtils.isEmpty(errors) ? errors[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID] : null}
                noSpellCheck
              />
            </Col>
          </Row>
          {isDataLoading ? (
            <div
              className={cx(
                gClasses.Height16,
                gClasses.Width200,
                gClasses.MT3,
                gClasses.MB15,
              )}
            >
              <Skeleton />
            </div>
          ) : (
            jsUtils.isEmpty(
              errors[COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.ID],
            ) && (
              <div
                className={cx(
                  gClasses.FOne12GrayV6,
                  gClasses.MT3,
                  gClasses.MB15,
                  // styles.CoverMessageNoteMinHeight,
                )}
              >
                {t(COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.NOTE)}
              </div>
            )
          )}
          <Row>
            <Col lg={12} sm={12}>
              <GradientPicker
                id={COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.BACKGROUND_COLOR.ID}
                label={
                  t(COVER_IMAGE_OR_MESSAGE.COVER_MESSAGE.BACKGROUND_COLOR.LABEL)
                }
                onChange={(event) => { onChangeHandler(event, t); }}
                selectedGradientObj={cover_color}
                isDataLoading={isDataLoading}
                hideColorPaletteTitle
                variant={GRADIENT_PICKER_VARIANTS.TYPE_2}
              />
            </Col>
          </Row>
        </>
      );
    }
  }
  return (
    <div className={cx(styles.CoverContentSettingsContainer)}>
      <FormTitle fontFamilyStyle={styles.FontFamilyStyle} isDataLoading={isDataLoading}>
        {t(COVER_IMAGE_OR_MESSAGE.TITLE.LABEL)}
      </FormTitle>
      <FormPostOperationFeedback id="cover_settings" />
      <RadioGroup
        id={COVER_IMAGE_OR_MESSAGE.VISIBILITY.ID}
        label={t(COVER_IMAGE_OR_MESSAGE.VISIBILITY.LABEL)}
        optionList={COVER_IMAGE_OR_MESSAGE.OPTION_VISIBILITY(t).LIST}
        onClick={(value) => {
          onChangeHandler({
            target: { id: COVER_IMAGE_OR_MESSAGE.VISIBILITY.ID, value }, t,
          });
        }}
        selectedValue={is_cover}
        isDataLoading={isDataLoading}
      />
      {coverContentTypeButtonTab}
      {coverPictureOrMessageView}
      {coverContentDatePicker}
      {saveAndCancelButtons}
    </div>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    setState: (data) => {
      dispatch(coverContentSettingsSetState(data));
    },
    getAccountCoverDetailsApiCall: () => {
      dispatch(getAccountCoverDetailsApi());
    },
    getUploadSignedUrlApiCall: (value, func, file, type) => {
      dispatch(getUploadSignedUrlApiThunk(value, func, file, type));
    },
    coverContentSettingsClearStateAction: () => {
      dispatch(coverContentSettingsClearState());
    },
    updateAccountCoverDetailsApiCall: (history, func, bool) => {
      dispatch(updateAccountCoverDetailsApi(history, func, bool));
    },
  };
};
const mapStateToprops = (state) => {
  const {
    is_cover,
    cover_type,
    cover_message,
    cover_color,
    acc_cover_pic,
    cover_duration,
    isDataLoading,
    error_list,
    server_error,
    acc_cover_pic_url,
    enableButton,
    serverData,
    durationType,
    cover_date_type,
  } = state.CoverContentSettingsReducer;
  const { pref_timezone } = state.AdminProfileReducer.adminProfile;
  return {
    is_cover,
    cover_type,
    cover_message,
    cover_color,
    acc_cover_pic,
    cover_duration,
    isDataLoading,
    error_list,
    server_error,
    acc_cover_pic_url,
    accountSettingsDataLoading: state.AccountSettingsReducer.is_data_loading,
    enableButton,
    serverData,
    durationType,
    cover_date_type,
    timezone: pref_timezone,
  };
};
export default withRouter(
  connect(mapStateToprops, mapDispatchToProps)(CoverContentSettings),
);
