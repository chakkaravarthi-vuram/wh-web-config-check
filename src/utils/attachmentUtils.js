import axios from 'axios';
import { store } from 'Store';
import { DEV_BASE_URL } from 'urls/ApiUrls';
import { DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES, FORM_POPOVER_STATUS } from './Constants';
import { appendFormDataArrayOrObject, showToastPopover } from './UtilityFunctions';
import jsUtils, { translateFunction } from './jsUtility';
import { getExtensionFromFileName } from './generatorUtils';
import { EMPTY_STRING } from './strings/CommonStrings';
import { VALIDATION_CONSTANT } from './constants/validation.constant';

export const getFieldsForDMS = (fields, file) => {
  return {
    ...fields,
    file,
  };
};

export const getFileUrl = (signedUrl = {}) => signedUrl?.s3_key || signedUrl?.gcp_key;

const updateProgress = () => {
  // const progressPercentage = calculateProgressPercentage(progressEvent);
};
export const getDmsLinkForPreviewAndDownload = (history) => {
  if (history) {
  const arrPathname = window.location.href.split('/');
  console.log('setTaskReferenceAttachmentssetTaskReferenceAttachments123', arrPathname[2], window.location.href.split('/'));
  if (arrPathname[2] === 'localhost:8000') return DEV_BASE_URL;
  else if (arrPathname[2] === 'workhall.dev') return DEV_BASE_URL;
  // else return `https//:${arrPathname[2]}`;
  else return EMPTY_STRING;
} else return EMPTY_STRING;
};
const uploadDocumentToDMS = async (fileArray, file_ref_uuid, table_uuid, tableRow, doc_details, metadata, setTaskReferenceAttachments, state, locationHistory, ...args) => {
  let setFileUploadStatus = args[args.length - 1];
  const fileLengthIndex = args?.slice(-3);
  if (typeof setFileUploadStatus !== 'function') {
    setFileUploadStatus = () => { };
  }
  console.log('history check dms', setFileUploadStatus);

  fileArray.file_metadata.forEach((data, index) => {
    const postData = getFieldsForDMS(
      data.upload_signed_url.fields,
      doc_details,
    );
    const uploadFileId = data._id;
    const config = {
      onUploadProgress: (progressEvent) =>
        updateProgress(progressEvent, uploadFileId),
    };
    return new Promise((resolve) => {
    axios
    .post(
      data.upload_signed_url.url,
      appendFormDataArrayOrObject(postData),
      config,
    ).then(() => {
      const uploadFiles = [];
      if (fileLengthIndex && fileLengthIndex[0] + 1 === fileLengthIndex[1]) {
      setFileUploadStatus(false);
      }
      const { _id } = fileArray.file_metadata[index];
      console.log('dms link check', `${getDmsLinkForPreviewAndDownload(locationHistory)}/dms/display/?id=${_id}`);
      const fileObject = {
        file: {
          name: doc_details.name,
          type: metadata.file_metadata[0].file_type,
          url: `${getDmsLinkForPreviewAndDownload(locationHistory)}/dms/display/?id=${_id}`,
        },
        localFileURL: URL.createObjectURL(doc_details),
        link: `${getDmsLinkForPreviewAndDownload(locationHistory)}/dms/display/?id=${_id}`,
        size: metadata.file_metadata[0].file_size,
        id: _id,

        ...(state && !jsUtils.isEmpty(state.task_details) ? { entity_id: state.task_details._id } : { entity_id: fileArray.entity_id }),
        url: getFileUrl(fileArray.file_metadata[index]?.upload_signed_url),
      };
      uploadFiles.push(fileObject);
      if (setTaskReferenceAttachments) setTaskReferenceAttachments({ files: uploadFiles, entityId: fileArray.entity_id });
      resolve(fileArray);
      // setState({ files: uploadFiles, entity_id: fileArray.entity_id });
    }).catch((error) => {
      console.log('uploadodcumenttodmserrorr', error);
      setFileUploadStatus(false);
      // reject();
    //  if (error.response) {
    //   console.log('uploadodcumenttodmserrorr', error.response)
    //   console.log(error.response.data);
    //   console.log(error.response.status);
    //   console.log(error.response.headers);
    // }
    });
    });
});
};

export const attachmentApiCallAndGenerateData = async (
    getUploadSignedUrl,
    dispatch,
    state,
    entity_id,
    file,
    type,
    entity,
    fileRefUUID,
    file_ref_uuid = null,
    table_uuid = null,
    tableRow = null,
    userProfileData,
    ref_uuid,
    setTaskReferenceAttachments,
    locationHistory,
    setState,
    createTaskFiles,
    t = translateFunction,
    setFileUploadStatus = () => {},
    currentIndex,
    totalLegth,
    ) => {
        const { entityId, files } = store.getState().CreateTaskReducer;
        console.log('doc_detailsdoc_details utils start', entityId, entity_id, state, files);
      const file_metadata = [];
      if (!jsUtils.isEmpty(userProfileData.allowed_extensions) &&
      !jsUtils.includes(userProfileData.allowed_extensions, getExtensionFromFileName(file.name)) &&
      !jsUtils.includes(userProfileData.allowed_extensions, getExtensionFromFileName(file.name).toLowerCase())) {
          showToastPopover(
            t(VALIDATION_CONSTANT.INVALID_FILE),
            t(VALIDATION_CONSTANT.FILE_MISMATCH),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          setFileUploadStatus(false);
      } else if (file.size > userProfileData.maximum_file_size * DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES) {
        showToastPopover(
          t(VALIDATION_CONSTANT.FILE_SIZE_EXCEED),
          `${t(VALIDATION_CONSTANT.LESS_FILE_SIZE)} ${userProfileData.maximum_file_size}${t(VALIDATION_CONSTANT.MB)}`,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      } else {
      // const documentMetadata = [];
        file_metadata.push({
          type,
          file_type: getExtensionFromFileName(file.name),
          file_name: file.name.split('.')[0],
          file_size: file.size,
          file_ref_id: fileRefUUID,
        });
        const metadata = {
          ref_uuid: ref_uuid,
          file_metadata,
          entity,
          ...(state && state.task_details && state.task_details._id ? { entity_id: state.task_details._id } : !jsUtils.isNull(entity_id) ? { entity_id: entity_id } : {}),
          // ...(!jsUtils.isNull(files) ? { entity_id: files[0].entity_id } : state.task_details ? { entity_id: state.task_details._id } : {}),
        };
        setFileUploadStatus(true);
        const result = await dispatch(
          getUploadSignedUrl(
            metadata,
            uploadDocumentToDMS,
            type,
            file_ref_uuid,
            table_uuid,
            tableRow,
            file,
            metadata,
            true,
            undefined,
            null,
            currentIndex,
            totalLegth,
            null,
            undefined,
            null,
            null,
            null,
            null,
            null,
            {},
            setFileUploadStatus,
          ),
        );
        console.log('doc_detailsdoc_details utils end', result);
        await setState({ entityId: result.entity_id });
        await uploadDocumentToDMS(
          result,
          file_ref_uuid,
          table_uuid,
          tableRow,
          file,
          metadata,
          setTaskReferenceAttachments,
          state,
          locationHistory,
          createTaskFiles,
          currentIndex,
          totalLegth,
          setFileUploadStatus,
        );
        // return result;
      }
    };

export default attachmentApiCallAndGenerateData;
