import { reportError } from '../../utils/UtilityFunctions';

export const normalizeAddNewLookup = (untrustedContent) => {
    const content = untrustedContent.data.result.data;
    if (!content) {
      reportError('add new note fixed');
      return null;
    }
    return content;
  };

  export const normalizeEditLookup = (untrustedContent) => {
    const content = untrustedContent.data.result.data;
    if (!content) {
      reportError('add new note fixed');
      return null;
    }
    return content;
  };

  export const normalizeGetLookup = (untrustedContent) => {
    const content = untrustedContent.data.result.data;
    if (!content) {
      reportError('add new note fixed');
      return null;
    }
    const modifiedContent = {
      ...content,
      lookupList: content?.pagination_data?.map?.((lookup) => {
        return {
          label: lookup?.lookup_name,
          value: lookup?._id,
          lookupOptions: lookup?.lookup_value?.map((lookupValue) => {
            return {
              label: lookupValue,
              value: lookupValue,
            };
          }),

        };
      }),
      lookupPaginationDetails: {
        page: content?.pagination_details?.[0]?.page || 1,
        totalCount: content?.pagination_details?.[0]?.total_count || 0,
      },
    };
    return modifiedContent;
  };

export default normalizeAddNewLookup;
