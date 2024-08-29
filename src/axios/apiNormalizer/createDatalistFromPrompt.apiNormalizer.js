import { reportError, hasOwn } from '../../utils/UtilityFunctions';

export const validateDatalistPromptResponse = (content) => {
    console.log('validateTaskPromptResponse content', content);
    const requiredProps = ['data_list_name', 'data_list_description', 'sections'];
    const invalidData = requiredProps.some((prop) => {
        if (!hasOwn(content, prop)) {
            reportError(`validate datalist Prompt Response: ${prop} missing`);
            return true;
        }
        return false;
    });
    console.log('validateDatalistPromptResponse content after 1', invalidData, content);
    if (invalidData) return null;
    return content;
};

export const normalizeDatalistPromptResponse = (untrustedContent) => {
    console.log('untrustedContent datalist prompt', untrustedContent);
    const content = validateDatalistPromptResponse(untrustedContent.data.result.data);
    console.log('final content', content);

    if (!content) {
        reportError('normalizeDatalistPromptResponse failed');
        return null;
    }
    return content;
};
