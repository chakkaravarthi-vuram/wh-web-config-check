import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import { formatBytes, keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import DownloadIconV2 from 'assets/icons/form_fields/DownloadIconV2';
import { FIELD_TYPE } from 'utils/constants/form_fields.constant';
import { formatLocale, formatter, getLocale, has } from 'utils/jsUtility';
import { store } from 'Store';
import { DATA_LIST_PROPERTY_PICKER, USER_LIST_PROPERTY_PICKER_INFO } from 'components/form_builder/section/form_fields/FormField.strings';
import { getExtensionFromFileName } from 'utils/generatorUtils';
import { Label } from '@workhall-pvt-lmt/wh-ui-library';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from '../helper_message/HelperMessage';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './ReadOnlyText.module.scss';
import { isEmpty } from '../../../utils/jsUtility';
import FilePreview from '../../file_preview/FileViewer';

import { findrowindex, isSupportedFileType } from './ReadOnlyText.utils';
import { getFileTypeForIcon } from '../file_upload_progress/FileUploadProgress.utils';

function ReadOnlyText(props) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [fileLinkUrl, setFileLinkUrl] = useState('');
  const accountLocale = formatLocale(store.getState().RoleReducer.acc_locale);

  // setting message
  let c_message = EMPTY_STRING;
  const {
    textClassName,
    errorMessage,
    message,
    value,
    id,
    label,
    isLoading,
    hideMessage,
    hideLabel,
    className,
    link,
    fileDetail,
    ContentClass,
    nonEditable,
    custom,
    removeTaskReferenceDocument,
    file,
    fileUploadHeader,
    fieldType,
    fieldUuid,
    isAuditView,
    dataListAuditfields,
    tabelfieldEditedList,
    fieldData,
    activeFormContent,
    isTable,
    tableRow,
    fileNameClassName,
    previewSize,
    labelFontClassAdmin,
    allowedDecimalPoints,
  } = props;
  useEffect(() => {
    if (!link) return;
    console.log('useEffect readonly text', link, `${link}&is_download=true`, fileDetail);
    if (has(file, ['localFileURL'])) {
      setFileLinkUrl(file.localFileURL);
    } else {
    if (getFileTypeForIcon(getExtensionFromFileName(value)) === 2 ||
        getFileTypeForIcon(getExtensionFromFileName(value)) === 3) {
            setFileLinkUrl(`${link}&is_download=false`);
    }
    }
  }, [link]);

  if (errorMessage) {
    c_message = errorMessage;
  } else if (message) {
    c_message = message;
  }
  // setting id for label and helper message
  const labelId = `${id}_label`;
  const messageId = `${id}_message`;
  let textValue = isLoading ? <Skeleton /> :
  (fileDetail ? value.replace(new RegExp(`.${fileDetail.type}$`), '') : value);
  let labelComponent = null;
  let fileSourceComponent = null;

  if (!hideLabel && fieldType !== FIELD_TYPE.INFORMATION) {
    labelComponent = (
      <Label
        labelName={label}
        labelRefer={id}
        id={labelId}
        isLoading={isLoading}
        className={gClasses.Margin0}
        innerLabelClass={labelFontClassAdmin}
      />
    );
  }

  const openPreviewModal = () => {
    if ((!has(file, ['localFileURL']))
      ) {
        setFileLinkUrl(`${link}&is_download=false`);
    }
    setIsOpenModal(true);
  };

  const downloadFile = () => {
      window.open(`${link}&is_download=true`, '_blank');
  };

  const onCloseFile = () => {
    setIsOpenModal(false);
  };
  const ModalContent = (link && !isEmpty(fileDetail)) ? (<FilePreview fileName={value} fileUrl={fileLinkUrl} fileDetail={fileDetail} isOpen={isOpenModal} filetype={fileDetail.type} isLoading={false} fileDownload={downloadFile} onCloseFile={onCloseFile} />) : null;

  if (link) {
    if (!isEmpty(fileDetail) && fileDetail && (isSupportedFileType(fileDetail.type) || custom)) {
      fileSourceComponent = (
        <div
          className={cx(styles.FileName, BS.D_FLEX, fileNameClassName, gClasses.FTwo13, gClasses.FontWeight500)}
          onClick={openPreviewModal}
          tabIndex={0}
          role="button"
          title={`${textValue}.${fileDetail?.type}`}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && openPreviewModal()}
        >
          <div
            className={cx(styles.FileName, gClasses.ML5, gClasses.MW100)}
          >
            {textValue}
          </div>
          <div className={cx(styles.FileName, gClasses.MR5)}>{`.${fileDetail.type}`}</div>
        </div>
      );
    } else {
      fileSourceComponent = (
        <a
          className={cx(gClasses.FOne13)}
          href={`${link}&is_download=true`}
          target="_blank"
          download
          rel="noreferrer"
        >
          {textValue}
        </a>
      );
    }
  } else {
    if ((fieldType === FIELD_TYPE.CURRENCY && textValue)) {
      if (textValue !== DATA_LIST_PROPERTY_PICKER.INSTRUCTION && textValue !== USER_LIST_PROPERTY_PICKER_INFO.INSTRUCTION && textValue !== '-' && textValue !== 'No values found') {
      const number = textValue.replace(/[^0-9.-]+/g, '');
      const currencyCode = textValue.replace(/[^a-z]/gi, '');
      textValue = `${formatter(number, getLocale(currencyCode))} ${currencyCode}`;
      }
    }
    fileSourceComponent = (
      <div
        className={cx(
          gClasses.FTwo13GrayV3,
          textClassName || gClasses.MinHeight16,
          ContentClass,
        )}
        id={id}
      >
        {(fieldType === FIELD_TYPE.NUMBER && fieldData.is_digit_formatted && textValue && textValue !== DATA_LIST_PROPERTY_PICKER.INSTRUCTION && textValue !== USER_LIST_PROPERTY_PICKER_INFO.INSTRUCTION && textValue !== '-' && textValue !== 'No values found') ? formatter(textValue, accountLocale, allowedDecimalPoints) : textValue}
      </div>
    );
  }
let auditField;
if (isAuditView) {
  let auditBackgroundColour;
  let indicatorColour;
  let isfieldEdited = false;
  let isTabelfieldAudited = false;
  let tabelFieldAction = false;
  if (isTable) {
  tabelfieldEditedList.some((data) => {
    if (data[fieldUuid]) {
          tabelFieldAction = data[fieldUuid].action;
          isTabelfieldAudited = findrowindex(data.tableUuid, data.row_id, activeFormContent, tableRow);
        }
        return isTabelfieldAudited;
  });
}

  if (fieldUuid in dataListAuditfields || isTabelfieldAudited) {
    isfieldEdited = true;
    let actionType = ((dataListAuditfields && dataListAuditfields[fieldUuid] && dataListAuditfields[fieldUuid].action) || (tabelFieldAction && tabelFieldAction));
    if (isTable) {
          actionType = tabelFieldAction;
        } else {
          actionType = dataListAuditfields && dataListAuditfields[fieldUuid] && dataListAuditfields[fieldUuid].action;
        }
    switch (actionType) {
      case 'edit':
      {
        auditBackgroundColour = styles.EditedCard;
        indicatorColour = styles.EditedBackground;
        break;
      }
      case 'delete':
        {
        auditBackgroundColour = styles.DeletedCard;
        indicatorColour = styles.DeletedBackground;
        break;
        }
      case 'add':
        {
          auditBackgroundColour = styles.AddedCard;
          indicatorColour = styles.AddedBackgroung;
          break;
        }
        default:
          break;
    }
  }
 auditField = (
<div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.CenterV, isfieldEdited && auditBackgroundColour, !hideLabel && styles.AuditCard, gClasses.WordWrap, gClasses.PT7, gClasses.PB10)}>
    <div className={cx(gClasses.ML10, BS.W75)}>
     {labelComponent}
     {ModalContent}
     {fileSourceComponent}
    </div>
     <div className={cx(styles.Indicator, indicatorColour, gClasses.MR10)} />
</div>
);
}
  return (
    <>
    {custom ? fileUploadHeader(fileDetail, openPreviewModal, fileLinkUrl) : null}
   {isAuditView && auditField}
   {!isAuditView && (
<div className={cx(className, !(!hideMessage && c_message) && gClasses.MB12)}>
      {labelComponent}
      {ModalContent}
      {fileSourceComponent}
      {!hideMessage && c_message && (
        <HelperMessage
          message={c_message}
          type={HELPER_MESSAGE_TYPE.ERROR}
          id={messageId}
        />
      )}
</div>
) }
    {custom && (!previewSize) ?
    (
    <div className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.FTwo11GrayV53, gClasses.MT3)}>
      {formatBytes(file.size)}
    </div>
    ) : null
    }

    {custom ?
      (
      <div className={gClasses.CenterVH}>
        <div className={cx(BS.D_FLEX, BS.JC_CENTER)}>
        {!nonEditable ?
        (
        <div className={cx(gClasses.CursorPointer, styles.Margin)}>
          <div className={styles.IconContainer}>
            <DeleteIconV2
              className={cx(styles.DeleteIcon)}
              tabIndex={0}
              role={ARIA_ROLES.BUTTON}
              ariaLabel="delete file"
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && removeTaskReferenceDocument()}
              onClick={() => removeTaskReferenceDocument(file.id)}
            />
          </div>
        </div>
        ) : null
        }
        <div className={!nonEditable ? cx(gClasses.ML20, styles.IconContainer) : null}>
              <DownloadIconV2
                stroke="#959BA3"
                strokeWidth="25"
                onClick={downloadFile}
                tabIndex={0}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && downloadFile()}
                className={cx(styles.DownloadIcon, gClasses.CursorPointer)}
                role={ARIA_ROLES.BUTTON}
                ariaLabel="download file"
                title="Download"
              />
        </div>
        </div>
      </div>
      ) : null
      }
    </>
  );
}

export default ReadOnlyText;

ReadOnlyText.defaultProps = {
  errorMessage: EMPTY_STRING,
  message: EMPTY_STRING,
  value: EMPTY_STRING,
  id: EMPTY_STRING,
  label: EMPTY_STRING,
  isLoading: false,
  hideLabel: false,
  className: EMPTY_STRING,
  hideMessage: false,
  ContentClass: EMPTY_STRING,
  custom: false,
  nonEditable: false,
  fileUploadHeader: EMPTY_STRING,
  removeTaskReferenceDocument: EMPTY_STRING,
};
ReadOnlyText.propTypes = {
  errorMessage: PropTypes.string,
  message: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]),
  id: PropTypes.string,
  label: PropTypes.string,
  isLoading: PropTypes.bool,
  hideLabel: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  hideMessage: PropTypes.bool,
  ContentClass: PropTypes.string,
  custom: PropTypes.bool,
  nonEditable: PropTypes.bool,
  fileUploadHeader: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  removeTaskReferenceDocument: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};
