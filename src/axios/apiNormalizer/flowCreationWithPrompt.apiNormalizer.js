import { reportError, hasOwn } from '../../utils/UtilityFunctions';

export const validateFlowCreationPromptResponse = (content) => {
    console.log('validateFlowPromptResponse content', content);
    const requiredProps = ['flow_name'];
    const invalidData = requiredProps.some((prop) => {
        if (!hasOwn(content, prop)) {
            reportError(`validate flow Prompt Response: ${prop} missing`);
            return true;
        }
        return false;
    });
    console.log('validateFlowPromptResponse content after', invalidData, content);
    if (invalidData) return null;
    return content;
};

export const normalizeFlowPromptResponse = (untrustedContent) => {
    console.log('untrustedContent flow prompt', untrustedContent);
    const content = validateFlowCreationPromptResponse(untrustedContent.data.result.data);
    if (!content) {
        reportError('normalizeFlowPromptResponse failed');
        return null;
    }
    return content;
};
