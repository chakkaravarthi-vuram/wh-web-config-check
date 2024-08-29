import { axiosMLPostUtils } from '../AxiosMLHelper';
import { CREATE_DATALIST_FROM_PROMPT } from '../../urls/ApiUrls';
import { normalizeDatalistPromptResponse } from '../apiNormalizer/createDatalistFromPrompt.apiNormalizer';
import { FLOW_PROMPT_CREATION_TIMEOUT } from '../../containers/edit_flow/EditFlow.constants';

export const postCreateDatalistFromPrompt = async (params, headersData = {}, signal) => {
  try {
    const response = await axiosMLPostUtils(
      CREATE_DATALIST_FROM_PROMPT,
      { params },
      {
        timeout: FLOW_PROMPT_CREATION_TIMEOUT,
        signal,
      },
      false,
      headersData,
    );
    return normalizeDatalistPromptResponse(response);
  } catch (error) {
    console.log(error, 'post flow failed');
    throw error;
  }
};
