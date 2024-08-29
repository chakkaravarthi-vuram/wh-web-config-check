import axios from 'axios';
import { getFieldsForDMS } from 'utils/attachmentUtils';
import { useHistory } from 'react-router-dom';
import { isEmpty } from '../utils/jsUtility';
import { getUploadSignedUrlApi } from '../axios/apiService/userProfile.apiService';
import { FILE_UPLOAD_STATUS, FORM_POPOVER_STATUS } from '../utils/Constants';
import { getExtensionFromFileName } from '../utils/generatorUtils';
import { appendFormDataArrayOrObject, showToastPopover } from '../utils/UtilityFunctions';
import { getDmsLinkForPreviewAndDownload } from '../utils/attachmentUtils';
import { EMPTY_STRING } from '../utils/strings/CommonStrings';

function useMultiFileUploadHook(entityDetails, type, strings, t, isTempFile) {
    const { history } = useHistory();
    const uploadFileToDMS = async (data, fileData = {}) => {
        const postData = getFieldsForDMS(data?.upload_signed_url?.fields, fileData?.file);
        return axios.post(data.upload_signed_url.url, appendFormDataArrayOrObject(postData))
            .then(() => {
                return ({
                    index: fileData.fileIndex,
                    path: fileData.path,
                    data: {
                        status: FILE_UPLOAD_STATUS.SUCCESS,
                        progress: 100,
                        fileId: data._id,
                        upload_signed_url: data.upload_signed_url,
                        url: `${getDmsLinkForPreviewAndDownload(history)}/dms/display/?id=${data._id}`,
                    },
                });
            })
            .catch(() => {
                return ({ index: fileData.fileIndex, path: fileData.path, data: { status: FILE_UPLOAD_STATUS.FAILURE, upload_signed_url: data.upload_signed_url, fileId: data._id } });
            });
    };
    const onMultiFileUpload = async (allFilesList) => {
        const file_metadata = [];
        const allFileData = [];
        allFilesList.forEach(({ fileData }) => {
            fileData.forEach((file, fileIndex) => {
                if (!file?.fileId) {
                    allFileData.push({
                        ...file,
                        fileIndex,
                    });
                    file_metadata.push({
                        type,
                        file_type: getExtensionFromFileName(file.file.name),
                        file_name: file.file.name.split('.')[0],
                        file_size: file.size,
                    });
                }
            });
        });
        const data = {
            file_metadata,
            ...entityDetails,
        };
        if (!isEmpty(file_metadata)) {
            return getUploadSignedUrlApi(data, true, isTempFile)
                .then(async (response) => {
                    const fileUploadResponseProgress = [];
                    const uploadFilePromiseList = [];
                    let uploadFailedCount = 0;
                    response.file_metadata.forEach(async (data, index) => {
                        uploadFilePromiseList.push(uploadFileToDMS(data, allFileData[index]));
                    });
                    const uploadResponse = await Promise.allSettled(uploadFilePromiseList);
                    uploadResponse.forEach(({ value = {} }) => {
                        if (!isEmpty(value)) {
                            if (value?.data?.status === FILE_UPLOAD_STATUS.FAILURE) {
                                uploadFailedCount++;
                            }
                            fileUploadResponseProgress.push(value);
                        }
                    });
                    return { progressResponseData: fileUploadResponseProgress, uploadFailedCount };
                })
                .catch(() => {
                    showToastPopover(
                        t(strings.FAILURE),
                        EMPTY_STRING,
                        FORM_POPOVER_STATUS.SERVER_ERROR,
                        true,
                    );
                    return { uploadFailedCount: file_metadata?.length };
                });
        }
        return { uploadFailedCount: 0 };
    };
    return {
        onMultiFileUpload,
        uploadFileToDMS,
    };
}

export default useMultiFileUploadHook;
