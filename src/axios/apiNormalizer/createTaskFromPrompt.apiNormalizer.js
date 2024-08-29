import { reportError, hasOwn } from '../../utils/UtilityFunctions';

export const validateTaskPromptResponse = (content) => {
    console.log('validateTaskPromptResponse content', content);
    const requiredProps = ['task_name', 'due_date', 'task_description', 'sections', 'assignees'];
    const invalidData = requiredProps.some((prop) => {
        if (!hasOwn(content, prop)) {
            reportError(`validate Task Prompt Response: ${prop} missing`);
            console.log(`validate Task Prompt Response: ${prop} missing`);
            return true;
        }
        return false;
    });
    console.log('validateTaskPromptResponse content after', invalidData, content);
    if (invalidData) return null;
    return content;
};

export const validateSaveFormWithFields = (content) => {
    const requiredProps = ['sections', 'form_uuid'];
    const invalidData = requiredProps.some((prop) => {
        if (!hasOwn(content, prop)) {
            reportError(`Validate Save Form With Field Response: ${prop} missing`);
            return true;
        }
        return false;
    });
    if (invalidData) return null;
    return content;
};

export const normalizeTaskPromptResponse = (untrustedContent) => {
    console.log('untrustedContent task prompt', untrustedContent);
    const content = validateTaskPromptResponse(untrustedContent.data.result.data);
    console.log('final content', content);

    if (!content) {
        reportError('normalizeTaskPromptResponse failed');
        return null;
    }
    return content;
};

export const normalizeSaveFormWithFieldsResponse = (untrustedContent) => {
    const content = validateSaveFormWithFields(untrustedContent.data.result.data);

    if (!content) {
        reportError('normalizeTaskPromptResponse failed');
        return null;
    }
    return content;
};
