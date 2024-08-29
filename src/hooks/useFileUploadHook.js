import axios from 'axios';
import { useState } from 'react';
import { getDmsLinkForPreviewAndDownload, getFieldsForDMS } from 'utils/attachmentUtils';
import { getUploadSignedUrlApi, getUploadSignedUrlAdminApi } from '../axios/apiService/userProfile.apiService';
import { FILE_UPLOAD_STATUS, FORM_POPOVER_STATUS } from '../utils/Constants';
import { generateUuid } from '../utils/generatorUtils';
import { isEmpty } from '../utils/jsUtility';
import { EMPTY_STRING } from '../utils/strings/CommonStrings';
import { appendFormDataArrayOrObject, calculateProgressPercentage, setPointerEvent, showToastPopover, updatePostLoader } from '../utils/UtilityFunctions';

function useFileUploadHook(getFileData, entityType, isAdminPanel, setFileUploadProgressStatus = () => {}, isTempFile) {
  const [uploadFile, setUploadFile] = useState({});
  const [fileUploadStatus, setFileUploadStatus] = useState({});
  const [documentDetails, setDocumentDetails] = useState({});
  const updateProgress = (progressEvent) => {
    const progressPercentage = calculateProgressPercentage(progressEvent);
    const fileData = {
      progress: progressPercentage,
      isFileUploadInProgress: true,
    };
    setFileUploadStatus(fileData);
  };
  const onDeletFileUpload = () => {
    setUploadFile({});
    setFileUploadStatus({});
  };

  const uploadDocumentToDMS = (
    fileArray,
    docDetails,
    filess,
    currentIndex,
    totalLength,
    recursiveFunc,
    entityId,
    currentFilesLength,
    invalidFileType,
    invalidFileSize,
    isMultiple,
    currentFileIndex,
    fileRefUuid,
    ) => new Promise((resolve, reject) => {
    // let resData;
    const doc_details = docDetails && docDetails.size ? docDetails : docDetails.file;
    fileArray.forEach((data) => {
      const postData = getFieldsForDMS(data.upload_signed_url.fields, doc_details);
      axios.post(data.upload_signed_url.url, appendFormDataArrayOrObject(postData), { onUploadProgress: (progressEvent) => updateProgress(progressEvent) }).then(() => {
        // console.log("jfkgjgfhj",response,postData,docDetails.file,data)
        const fileData = {
          progress: 100,
          status: FILE_UPLOAD_STATUS.SUCCESS,
          // eslint-disable-next-line no-restricted-globals
          url: `${getDmsLinkForPreviewAndDownload(history)}/dms/display/?id=${data._id}`,
        };
        setFileUploadProgressStatus(false);
        setFileUploadStatus({
          status: FILE_UPLOAD_STATUS.SUCCESS,
          progress: 100,
          // eslint-disable-next-line no-restricted-globals
          url: `${getDmsLinkForPreviewAndDownload(history)}/dms/display/?id=${data._id}`,
          isFileUploadInProgress: false,
        });
        if (recursiveFunc && (isMultiple || (!isMultiple && filess.length === 1))) {
          recursiveFunc(
            filess,
            currentIndex + 1,
            totalLength,
            entityId,
            currentFilesLength,
            invalidFileType,
            invalidFileSize,
            !isEmpty(invalidFileType) || !isEmpty(invalidFileSize),
            isMultiple,
            currentFileIndex + 1,
            fileRefUuid,
          );
          }
        // resData = response;
        resolve(fileData);
      }, (error) => {
        const fileData = {
          progress: 0,
          status: FILE_UPLOAD_STATUS.FAILURE,
          isFileUploadInProgress: false,
        };
        setFileUploadProgressStatus(false);
        setFileUploadStatus(fileData);
        reject(error);
      });
    });
  });

  const getUploadSignedUrl = (
    doc_details,
    file_ref_uuid,
    entity,
    filess,
    currentIndex,
    totalLength,
    recursiveFunc,
    entityId,
    currentFilesLength,
    invalidFileType,
    invalidFileSize,
    isMultiple,
    currentFileIndex,
    hidePostLoader = false,
    fileRefUuid,
    setLoaderFunction,
    fileData,
    ) => {
    if (fileData.isFavicon) {
      doc_details.isFavicon = true;
    }
    const data = getFileData(doc_details, file_ref_uuid, entity, entityId, fileRefUuid);
    const getUploadUrlFunc = isAdminPanel ? getUploadSignedUrlAdminApi : getUploadSignedUrlApi;
    setLoaderFunction?.(1);
    getUploadUrlFunc(data, hidePostLoader, isTempFile).then((response) => {
      setLoaderFunction?.(2);
      console.log('recursiveFuncrecursiveFunc', recursiveFunc);
      uploadDocumentToDMS(
        response.file_metadata,
        doc_details,
        filess,
        currentIndex,
        totalLength,
        recursiveFunc,
        data.entityId || entityId || response.entity_id,
        currentFilesLength,
        invalidFileType,
        invalidFileSize,
        isMultiple,
        currentFileIndex,
        data.ref_uuid,
      )
      .then(() => {
        setLoaderFunction?.(3);
        setDocumentDetails({ ...response });
        setPointerEvent(false);
        updatePostLoader(false);
      }).catch(() => {
        setLoaderFunction?.(0);
        setPointerEvent(false);
        updatePostLoader(false);
      });
    }, (error) => {
      const errorsList = error?.response?.data?.errors?.[0];
      setLoaderFunction?.(0);
      let errorTitle = 'Something went wrong';
      if (
        errorsList?.type === 'any.only' &&
        errorsList?.field?.includes('file_metadata') &&
        errorsList?.field?.includes('file_type')
      ) {
        errorTitle = `Please use this extension files ${errorsList?.valids?.join(
          ', ',
        )}`;
      }
      showToastPopover(
        errorTitle,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      setFileUploadProgressStatus(false);
      setFileUploadStatus({
        status: FILE_UPLOAD_STATUS.FAILURE,
        progress: 0,
        isFileUploadInProgress: false,
        // url: `${getDmsLinkForPreviewAndDownload(history)}/dms/download/?id=${response.file_metadata[0]._id}`
      });
      setPointerEvent(false);
      updatePostLoader(false);
    });
  };
  const onFileUpload = async (
    fileData,
    filess,
    currentIndex,
    totalLength,
    recursiveFunc,
    entityId,
    currentFilesLength,
    invalidFileType,
    invalidFileSize,
    isMultiple,
    currentFileIndex,
    hidePostLoader = false,
    fileRefUuid,
    setLoaderFunction,
    ) => {
    const file_ref_uuid = generateUuid();
    console.log('onFileUploadhook', fileData);
    setUploadFile({
      ...fileData.files[0],
      fileId: file_ref_uuid,
      file_ref_uuid,
    });
    setFileUploadProgressStatus(true);
    setFileUploadStatus({
      progress: 0,
      status: FILE_UPLOAD_STATUS.IN_PROGRESS,
      isFileUploadInProgress: true,
    });
    getUploadSignedUrl(
      fileData.files[0],
      file_ref_uuid,
      entityType,
      filess,
      currentIndex,
      totalLength,
      recursiveFunc,
      entityId,
      currentFilesLength,
      invalidFileType,
      invalidFileSize,
      isMultiple,
      currentFileIndex,
      hidePostLoader,
      fileRefUuid,
      setLoaderFunction,
      fileData,
    );
  };
  const onRetryFileUpload = () => {
    onFileUpload({ ...uploadFile });
  };

  return {
    uploadFile: {
      ...uploadFile,
      ...fileUploadStatus,
    },
    onDeletFileUpload,
    onRetryFileUpload,
    documentDetails,
    onFileUpload,
  };
}

export default useFileUploadHook;
