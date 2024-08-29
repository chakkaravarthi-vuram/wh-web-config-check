import { useState } from 'react';
import axios from 'axios';
import { toastPopOver, EToastType } from '@workhall-pvt-lmt/wh-ui-library';
import {
  appendFormDataArrayOrObject,
  calculateProgressPercentage,
  setPointerEvent,
  updatePostLoader,
} from '../utils/UtilityFunctions';
import { generateUuid } from '../utils/generatorUtils';
import { FILE_UPLOAD_STATUS } from '../utils/Constants';
import {
  getUploadSignedUrlAdminApi,
  getUploadSignedUrlApi,
} from '../axios/apiService/userProfile.apiService';
import {
  getDmsLinkForPreviewAndDownload,
  getFieldsForDMS,
} from '../utils/attachmentUtils';
import { cloneDeep, get } from '../utils/jsUtility';
import { EMPTY_STRING } from '../utils/strings/CommonStrings';

function useSimplifiedFileUploadHook(
  getFileData,
  onUploadFile,
  isAdminPanel,
  setFileUploadProgressStatus = () => {},
) {
  const [uploadFile, setUploadFile] = useState({});
  const [files, setFiles] = useState([]);
  const [fileUploadStatus, setFileUploadStatus] = useState({});
  const [documentDetails, setDocumentDetails] = useState({});
  const [documentEntityId, setEntityId] = useState(EMPTY_STRING);

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

  const uploadDocumentToDMS = (fileArray, docDetails) =>
    new Promise((resolve, reject) => {
      // let resData;
      const doc_details =
        docDetails && docDetails.size ? docDetails : docDetails.file;
      fileArray.forEach((data) => {
        const postData = getFieldsForDMS(
          data.upload_signed_url.fields,
          doc_details,
        );
        axios
          .post(
            data.upload_signed_url.url,
            appendFormDataArrayOrObject(postData),
            {
              onUploadProgress: (progressEvent) =>
                updateProgress(progressEvent),
            },
          )
          .then(
            () => {
              // console.log("jfkgjgfhj",response,postData,docDetails.file,data)
              setPointerEvent(false);
              updatePostLoader(false);
              const fileData = {
                progress: 100,
                status: FILE_UPLOAD_STATUS.SUCCESS,
                // eslint-disable-next-line no-restricted-globals
                url: `${getDmsLinkForPreviewAndDownload(
                  // eslint-disable-next-line no-restricted-globals
                  history,
                )}/dms/display/?id=${data._id}`,
              };
              setFileUploadProgressStatus(false);
              setFileUploadStatus({
                status: FILE_UPLOAD_STATUS.SUCCESS,
                progress: 100,
                // eslint-disable-next-line no-restricted-globals
                url: `${getDmsLinkForPreviewAndDownload(
                  // eslint-disable-next-line no-restricted-globals
                  history,
                )}/dms/display/?id=${data._id}`,
                isFileUploadInProgress: false,
              });
              // resData = response;
              resolve(fileData);
            },
            (error) => {
              const fileData = {
                progress: 0,
                status: FILE_UPLOAD_STATUS.FAILURE,
                isFileUploadInProgress: false,
              };
              setFileUploadProgressStatus(false);
              setFileUploadStatus(fileData);
              reject(error);
            },
          );
      });
    });

  const getUploadSignedUrl = async (
    file,
    file_ref_uuid,
    entityType,
    entityId,
    fileRefUuid,
    refUuid,
  ) => {
    const data = getFileData(
      file,
      file_ref_uuid,
      entityType,
      entityId || documentEntityId,
      refUuid,
    );
    const getUploadUrlFunc = isAdminPanel
      ? getUploadSignedUrlAdminApi
      : getUploadSignedUrlApi;
    try {
      const response = await getUploadUrlFunc(data);
      setEntityId(response?.entity_id);
      await uploadDocumentToDMS(
        response.file_metadata,
        file,
        data.entityId || entityId || response.entity_id,
        data.ref_uuid,
      );
      setDocumentDetails({ ...response, data: data, file: file });
      onUploadFile?.(response, data, file);
      return response;
    } catch (e) {
      setPointerEvent(false);
      updatePostLoader(false);
      console.log('xyz error', e);
      const errors = get(e, ['response', 'data', 'errors'], []);
      const err = get(errors, [0], {});
      if (err.type === 'any.only') {
        const valids = err.valids || [];
        toastPopOver({
          title: 'Invalid File Type',
          subtitle: `File type must be one of ${valids.join(',')}`,
          toastType: EToastType.error,
        });
      } else {
        toastPopOver({
          title: 'Something went wrong',
          toastType: EToastType.error,
        });
      }
      setFileUploadProgressStatus(false);
      setFileUploadStatus({
        status: FILE_UPLOAD_STATUS.FAILURE,
        progress: 0,
        isFileUploadInProgress: false,
      });
    }
    return false;
  };

  const onFileUpload = async (files, entityId, entityType, fileRefUuid) => {
    if (!files || files?.length === 0) return;
    setFiles(files);

    const responses = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i]?.file;
      const file_ref_uuid = generateUuid();

      setUploadFile({
        file,
        fileId: file_ref_uuid,
        file_ref_uuid,
      });
      setFileUploadProgressStatus(true);
      setFileUploadStatus({
        progress: 0,
        status: FILE_UPLOAD_STATUS.IN_PROGRESS,
        isFileUploadInProgress: true,
      });

      try {
        // eslint-disable-next-line no-await-in-loop
        const eachResponse = await getUploadSignedUrl(file, file_ref_uuid, entityType, entityId || cloneDeep(responses)?.[0]?.entity_id, fileRefUuid, cloneDeep(responses)?.[0]?.ref_uuid);
        responses.push(eachResponse);
      } catch (e) { /* empty */ }
    }
  };

  const onRetryFileUpload = () => {
    onFileUpload({ ...uploadFile });
  };

  return {
    files,
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

export default useSimplifiedFileUploadHook;
