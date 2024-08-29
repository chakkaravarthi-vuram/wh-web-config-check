import React from 'react';
import FileUploadDrop from 'components/file_upload_drop/FileUploadDrop';
import { getUserProfileData } from 'utils/UtilityFunctions';
import DocumentUpload from './FileUploader';

function ReadOnlyFileUploader(props) {
  // setting message
  const {
    files,
    isTable,
  } = props;

  const userProfileData = getUserProfileData();

  return (!isTable || (isTable && files?.length === 1)) ? (
    <FileUploadDrop
        files={files || []}
        userDetails={userProfileData}
        nonEditable
        limitAttachments
        previewSize
    />
  ) : (
    <DocumentUpload
        // label={label}
        isDragDrop
        isMultiple
        uploadedFiles={files || []}
        readOnly
    />
      );
}

export default ReadOnlyFileUploader;
