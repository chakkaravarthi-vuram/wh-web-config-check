import { axiosMLPostUtils } from '../AxiosMLHelper';
import { CREATE_APP_FROM_PROMPT } from '../../urls/ApiUrls';
import { APP_PROMPT_CREATION_TIMEOUT } from '../../containers/application/app_listing/AppList.constants';
import { normalizeAppPromptResponse } from '../apiNormalizer/appCreationFromPrompt.apiNormalizer';

export const postAppCreationPromptApiService = async (params, headersData = {}, signal) => {
    try {
        const response = await axiosMLPostUtils(
            CREATE_APP_FROM_PROMPT,
            { params },
            {
                timeout: APP_PROMPT_CREATION_TIMEOUT,
                signal,
            },
            false,
            headersData,
        );
        return ({
            ...normalizeAppPromptResponse(response),
        });
    } catch (error) {
        console.log(error, 'jhkjhjkjkj');
        throw error;
    }
};
