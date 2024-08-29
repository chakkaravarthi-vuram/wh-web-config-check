import React, { lazy } from 'react';
import {
  getTaskReferenceDocumentsFileObject,
  getUserProfileData,
} from '../../../../../utils/UtilityFunctions';

// lazy imports
const FileUploadDrop = lazy(() =>
  import('../../../../../components/file_upload_drop/FileUploadDrop'));

export default function TaskReferenceAttachments(props) {
  const { taskReferenceDocuments, document_url_details, fileNameClassName, hideUserImage, sortFiles } = props;
  const files = getTaskReferenceDocumentsFileObject(
    taskReferenceDocuments,
    document_url_details,
  );

  const compareObj = (a, b) => {
    try {
      if (a.file.name > b.file.name) return 1;
      if (a.file.name < b.file.name) return -1;
      return 0;
    } catch (e) {
      console.log(e);
      return 0;
    }
  };

  const sortedFiles = files.sort(compareObj);

  const userDetails = getUserProfileData();
  return (
    <FileUploadDrop
      files={sortFiles ? sortedFiles : files}
      userDetails={userDetails}
      fileNameClassName={fileNameClassName}
      nonEditable
      limitAttachments
      hideUserImage={hideUserImage}
    />
  );
}
