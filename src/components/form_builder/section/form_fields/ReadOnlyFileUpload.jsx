import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import Label from 'components/form_components/label/Label';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from 'components/form_components/helper_message/HelperMessage';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import jsUtils from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import FileUploadProgress from 'components/form_components/file_upload_progress/FileUploadProgress';
import FileUploadDrop from 'components/file_upload_drop/FileUploadDrop';
import { getUserProfileData } from 'utils/UtilityFunctions';
import { getFileTypeForIcon } from 'components/file_upload_drop/FileUploadDropUtils';
import { FORM_TYPES, PROPERTY_PICKER_ARRAY } from 'utils/constants/form.constant';
import styles from './ReadOnlyFileUpload.module.scss';

function ReadOnlyFileUpload(props) {
  // setting message
  let c_message = EMPTY_STRING;
  const {
    errorMessage,
    message,
    id,
    label,
    isLoading,
    hideLabel,
    className,
    formFieldBottomMargin,
    fileDetail,
    isTable,
    fieldType,
    value,
    formType,
  } = props;

  if (errorMessage) {
    c_message = errorMessage;
  } else if (message) {
    c_message = message;
  }
  // setting id for label and helper message
  const labelId = `${id}_label`;
  const messageId = `${id}_message`;
  const userDetails = getUserProfileData();
  let labelComponent = null;
  const isImage = fileDetail && fileDetail[0] && fileDetail[0].file && getFileTypeForIcon(fileDetail[0].file.type);
  if (!hideLabel) {
    labelComponent = (
      <Label
        content={label}
        labelFor={id}
        id={labelId}
        isDataLoading={isLoading}
        formFieldBottomMargin={formFieldBottomMargin}
        className={BS.MARGIN_0}
        hideLabelClass
        // labelFontClass={gClasses.FTwo12GrayV53}
      />
    );
  }
  const readOnlyFiles = [];
  fileDetail && jsUtils.isArray(fileDetail) && fileDetail.forEach((eachFile) => {
    readOnlyFiles.push(
      <div className={styles.ExistingFile}>
      <FileUploadProgress
      files={[eachFile]}
      hideLabel
      />
      </div>,
      );
  });

  if (
       (
         [FORM_TYPES.CREATION_FORM, FORM_TYPES.IMPORTABLE_FORM].includes(formType) &&
         PROPERTY_PICKER_ARRAY.includes(fieldType)
        ) || (
          formType === FORM_TYPES.EDITABLE_FORM &&
          fileDetail ? jsUtils.isEmpty(fileDetail) : false
        )
   ) {
    return (
      <div className={cx(gClasses.MB12, gClasses.MT5)}>
          <div
          id={id}
          className={cx(
              gClasses.FTwo13GrayV3,
              gClasses.MinHeight16,
            )}
          >
            {labelComponent}
            {value}
          </div>
      </div>
    );
  }

  return (
    <div className={cx(className)}>
      {labelComponent}
      {(isTable && fileDetail.length === 1 && isImage === 2) || !isTable ? (
      <FileUploadDrop
      id={id}
      files={fileDetail}
      userDetails={userDetails}
      nonEditable
      limitAttachments
      previewSize
      />
      )
      : readOnlyFiles
      }
      <HelperMessage
          message={c_message}
          type={HELPER_MESSAGE_TYPE.ERROR}
          id={messageId}
      />
    </div>
  );
}

export default ReadOnlyFileUpload;

ReadOnlyFileUpload.defaultProps = {
  errorMessage: EMPTY_STRING,
  message: EMPTY_STRING,
  value: EMPTY_STRING,
  id: EMPTY_STRING,
  label: EMPTY_STRING,
  isLoading: false,
  hideLabel: false,
  className: EMPTY_STRING,
  formFieldBottomMargin: false,
  hideMessage: false,
  ContentClass: EMPTY_STRING,
  custom: false,
  nonEditable: false,
  fileUploadHeader: EMPTY_STRING,
  removeTaskReferenceDocument: EMPTY_STRING,
};
ReadOnlyFileUpload.propTypes = {
  errorMessage: PropTypes.string,
  message: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]),
  id: PropTypes.string,
  label: PropTypes.string,
  isLoading: PropTypes.bool,
  hideLabel: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  formFieldBottomMargin: PropTypes.bool,
  hideMessage: PropTypes.bool,
  ContentClass: PropTypes.string,
  custom: PropTypes.bool,
  nonEditable: PropTypes.bool,
  fileUploadHeader: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  removeTaskReferenceDocument: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};
