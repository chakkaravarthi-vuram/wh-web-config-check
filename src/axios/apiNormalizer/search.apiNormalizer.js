import { reportError } from '../../utils/UtilityFunctions';

const validateGetAllSearchData = (content) => {
    const requiredProps = ['flow_details', 'data_list_details', 'task_details'];
    const missingSearchListEntries = requiredProps.filter((prop) => {
        if (!Object.prototype.hasOwnProperty.call(content, prop)) {
            reportError(`validate get all search data failed: ${prop} missing`);
            return true;
        }
        return false;
    });
    if (missingSearchListEntries.length > 0) return null;
    return content;
};

export const normalizeGetAllSearchData = (untrustedContent) => {
    const content = validateGetAllSearchData(untrustedContent.data.result.data);
    if (!content) {
        reportError('normalize get all datalist Data failed');
        return null;
    }
    return content;
};
