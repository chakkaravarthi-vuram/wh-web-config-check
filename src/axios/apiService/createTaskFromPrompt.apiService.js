import { normalizeTaskPromptResponse } from 'axios/apiNormalizer/createTaskFromPrompt.apiNormalizer';
import { axiosMLPostUtils } from '../AxiosMLHelper';
import { CREATE_TASK_FROM_PROMPT, SAVE_FORM_WITH_FIELD } from '../../urls/ApiUrls';
import { axiosPostUtils } from '../AxiosHelper';
import { normalizeSaveFormWithFieldsResponse } from '../apiNormalizer/createTaskFromPrompt.apiNormalizer';

export const postCreateTaskFromPrompt = (data, signal) => new Promise((resolve, reject) => {
    axiosMLPostUtils(CREATE_TASK_FROM_PROMPT, { params: data }, { signal })
      .then((response) => {
        resolve({
          ...normalizeTaskPromptResponse(response),
          task_creation_uuid: response?.data?.task_creation_uuid,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveFormWithField = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(SAVE_FORM_WITH_FIELD, data)
   .then((response) => resolve(normalizeSaveFormWithFieldsResponse(response)))
   .catch((error) => reject(error));
});
