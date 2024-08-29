import { find } from '../../../../../../utils/jsUtility';

export const getUrlFromPicId = (picId, document_url_details = []) => {
    const image = find(document_url_details, { document_id: picId });
    if (image) return image.signedurl;
    else return null;
};
