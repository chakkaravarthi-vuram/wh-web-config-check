import { axiosMLPostUtils } from '../AxiosMLHelper';
import { CREATE_FLOW_FROM_PROMPT } from '../../urls/ApiUrls';
import { normalizeFlowPromptResponse } from '../apiNormalizer/flowCreationWithPrompt.apiNormalizer';
import { FLOW_PROMPT_CREATION_TIMEOUT } from '../../containers/edit_flow/EditFlow.constants';

export const postFlowCreationPrompt = async (params, headersData = {}, signal) => {
  try {
    const response = await axiosMLPostUtils(
      CREATE_FLOW_FROM_PROMPT,
      { params },
      {
        timeout: FLOW_PROMPT_CREATION_TIMEOUT,
        signal,
      },
      false,
      headersData,
    );
    return normalizeFlowPromptResponse(response);
  } catch (error) {
    console.log(error, 'post flow failed');
    throw error;
  }
};
