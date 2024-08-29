import { reportError, hasOwn } from '../../utils/UtilityFunctions';

export const validateAppCreationPromptResponse = (content) => {
    console.log('validateTaskPromptResponse content', content);
    const requiredProps = ['app_name'];
    const invalidData = requiredProps.some((prop) => {
        if (!hasOwn(content, prop)) {
            reportError(`validate flow Prompt Response: ${prop} missing`);
            return true;
        }
        return false;
    });
    console.log('validateAppPromptResponse content after', invalidData, content);
    if (invalidData) return null;
    return content;
};

export const normalizeAppPromptResponse = (untrustedContent) => {
    console.log('untrustedContent app prompt', untrustedContent);
    const content = validateAppCreationPromptResponse(untrustedContent.data.result.data);
    if (!content) {
        reportError('normalizeAppPromptResponse failed');
        return null;
    }
    return content;
};
