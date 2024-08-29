import React, { useContext } from 'react';
import cx from 'classnames/bind';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../../../hoc/ThemeContext';
import styles from './InitBulkUpload.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import INIT_BULK_UPLOAD_STRINGS from './InitBulkUpload.strings';
import { ARIA_ROLES, BS } from '../../../../../utils/UIConstants';
import jsUtils from '../../../../../utils/jsUtility';
import NotesIcon from '../../../../../assets/icons/NotesIcon';
import DownloadIcon from '../../../../../assets/icons/DownloadIcon';
import Input from '../../../../../components/form_components/input/Input';
import FileUpload from '../../../../../components/form_components/file_upload/FileUpload';

function InitBulkUpload(props) {
  const {
    sheetName,
    setSheetName,
    uploadedFile, // file_ref_uuid
    onFileUpload,
    userProfileData,
    templateDocument,
    onRetryFileUpload,
    onDeletFileUpload,
  } = props;
  const { buttonColor } = useContext(ThemeContext);

  const downloadFile = () => {
    const link = jsUtils.get(templateDocument, ['signedurl']);
    if (!link) return;
    window.open(`${link}&is_download=true`, '_blank');
  };

  const { t } = useTranslation();

  return (
    <>
      <div className={cx(gClasses.MT20, BS.TEXT_CENTER, gClasses.FOne13GrayV6)}>
        {INIT_BULK_UPLOAD_STRINGS.CONTENT}
      </div>
      <div
        className={cx(
          gClasses.FTwo13GrayV9,
          gClasses.FontWeight500,
          gClasses.MT10,
        )}
        style={{ color: buttonColor }}
      >
        {t(INIT_BULK_UPLOAD_STRINGS.DOWNLOAD_TITLE)}
      </div>
      <div className={cx(gClasses.FOne13GrayV48, gClasses.MT10)}>
        {t(INIT_BULK_UPLOAD_STRINGS.DOWNLOAD_SUB_TITLE)}
      </div>
      {templateDocument ? (
        <div
          className={cx(
            BS.D_FLEX,
            BS.JC_BETWEEN,
            styles.Template,
            gClasses.MT5,
          )}
        >
          <div className={cx(gClasses.FOne13GrayV3, gClasses.FontWeight500)}>
            <NotesIcon isButtonColor className={gClasses.MR10} role={ARIA_ROLES.IMG} ariaLabel={INIT_BULK_UPLOAD_STRINGS.ARIA_LABEL.DOCS} />
            {`${
              jsUtils.get(templateDocument, ['original_filename', 'filename'])
            }.${
              jsUtils.get(templateDocument, ['original_filename', 'content_type'])
            }`}
          </div>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && downloadFile()}
            onClick={downloadFile}
            aria-label={INIT_BULK_UPLOAD_STRINGS.ARIA_LABEL.DOWNLOAD_TEMPLATE}
          >
            <DownloadIcon
              role={ARIA_ROLES.IMG}
              ariaLabel={INIT_BULK_UPLOAD_STRINGS.ARIA_LABEL.DOWNLOAD}
              ariaHidden
              isButtonColor
              className={gClasses.CursorPointer}
            />
          </div>
        </div>
      ) : (
        <div
          className={cx(
            BS.D_FLEX,
            styles.Template,
            styles.ErrorBoundary,
            gClasses.MT5,
          )}
        >
          <div className={cx(gClasses.FOne12RedV5, gClasses.FontWeight500)}>
            <NotesIcon isButtonColor className={gClasses.MR10} role={ARIA_ROLES.IMG} ariaLabel={INIT_BULK_UPLOAD_STRINGS.ARIA_LABEL.DOCS} />
            {t(INIT_BULK_UPLOAD_STRINGS.TEMPLATE_UNAVAILABLE)}
          </div>
        </div>
      )}
      <div
        className={cx(
          gClasses.FTwo13GrayV9,
          gClasses.FontWeight500,
          gClasses.MT20,
        )}
        style={{ color: buttonColor }}
      >
        {t(INIT_BULK_UPLOAD_STRINGS.UPLOAD_TITLE)}
      </div>
      <div className={cx(gClasses.FOne13GrayV48, gClasses.MT10)}>
        {t(INIT_BULK_UPLOAD_STRINGS.UPLOAD_SUB_TITLE)}
      </div>
      <FileUpload
        addFile={(fileData, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple) => {
          onFileUpload(fileData, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple);
        }}
        label={t(INIT_BULK_UPLOAD_STRINGS.UPLOAD_BUTTON.LABEL)}
        className={gClasses.MT8}
        fileName={jsUtils.isEmpty(uploadedFile) ? [] : [uploadedFile]}
        hideMessage
        id={INIT_BULK_UPLOAD_STRINGS.UPLOAD_BUTTON.ID}
        allowed_extensions={['xls', 'xlsx', 'csv']}
        maximum_file_size={userProfileData.maximum_file_size}
        onDeleteClick={onDeletFileUpload}
        onRetryClick={onRetryFileUpload}
        isMultiple={false}
      />
      {/* <FileUploadProgress
        files={[uploadedFile]}
        onDeleteClick={onDeletFileUpload}
        onRetryClick={onRetryFileUpload}
      /> */}
      <Input
        required
        label={t(INIT_BULK_UPLOAD_STRINGS.SHEET_NAME_INPUT.LABEL)}
        id={INIT_BULK_UPLOAD_STRINGS.SHEET_NAME_INPUT.ID}
        placeholder={t(INIT_BULK_UPLOAD_STRINGS.SHEET_NAME_INPUT.PLACEHOLDER)}
        instructionMessage={
          t(INIT_BULK_UPLOAD_STRINGS.SHEET_NAME_INPUT.INSTRUCTION)
        }
        value={sheetName}
        onChangeHandler={(event) => {
          setSheetName(event.target.value);
        }}
      />
    </>
  );
}

export default InitBulkUpload;
