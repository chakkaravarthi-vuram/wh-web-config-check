import { reportError } from '../../utils/UtilityFunctions';

const webpageEmbedConfigData = 'Webpage Embed Configuration';

export const validateGetAllWebpageEmbedData = (data) => {
  console.log('validateGetAllWebpageEmbedData', data);
  if (!data.pagination_data || !data.pagination_details) return false;
  const requiredProps = [
    '_id',
    'embed_url_origin',
  ];
  return data.pagination_data.every((element) =>
    requiredProps.every((prop) => {
      if (!Object.prototype.hasOwnProperty.call(element, prop)) {
        reportError(`validateGetAllWebpageEmbedData failed: ${prop} missing`);
        return false;
      }
      return true;
    }));
};

export const normalizeGetAllWebpageEmbedData = (rawResponse) => {
  const validatedData = validateGetAllWebpageEmbedData(
    rawResponse.data.result.data,
  );
  if (!validatedData) {
    reportError('normalize AllWebpageEmbed failed');
    return null;
  }
  return rawResponse.data.result.data.pagination_data;
};

export const normalizeDeleteWebpageEmbedData = (unTrustedContent) => {
  const normalizedData = unTrustedContent.data.result.data;
  return normalizedData;
};

export const validateSaveNewWebpageEmbedWhitelistData = (content) => {
  const requiredProps = ['embed_url_origin'];
  const missingDataList = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${webpageEmbedConfigData} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;
  return content;
};

export const normalizeSaveNewWebpageEmbedWhitelistData = (unTrustedContent) => {
  // console.log("unTrustedContent.data", unTrustedContent.data);
  // const normalizedData = validateSaveNewWebpageEmbedWhitelistData(unTrustedContent.data.result.data);
  // if (!normalizedData) {
  //   reportError(`normalize ${webpageEmbedConfigData} failed`);
  //   return null;
  // }
  const normalizedData = unTrustedContent.data.result.data;
  return normalizedData;
};
export const normalizeHolidayDeleteData = (unTrustedContent) => {
  const normalizedData = unTrustedContent.data.result.data;
  return normalizedData;
};
