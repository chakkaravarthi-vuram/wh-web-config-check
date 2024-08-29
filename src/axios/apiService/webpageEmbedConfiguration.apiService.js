import axios from 'axios';

import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import { DELETE_WEBPAGE_EMBED_WHITELIST_URL, GET_WEBPAGE_EMBED_WHITELIST_URL, SAVE_WEBPAGE_EMBED_WHITELIST_URL } from '../../urls/ApiUrls';
import { getLoaderConfig } from '../../utils/UtilityFunctions';
import { normalizeDeleteWebpageEmbedData, normalizeGetAllWebpageEmbedData, normalizeSaveNewWebpageEmbedWhitelistData } from '../apiNormalizer/webpageEmbedConfig.apiNormalizer';
import { getCancelTokenDeleteEmbedUrl, getCancelTokenGetEmbedUrl, getCancelTokenAddEmbedUrl } from '../../containers/admin_settings/other_settings/webpage_embed_settings/WebpageEmbedSettings';

const { CancelToken } = axios;

export const getWebpageWhitelist = (params) => new Promise((resolve, reject) => {
    axiosGetUtils(
        GET_WEBPAGE_EMBED_WHITELIST_URL,
        { params },
        {
            cancelToken: new CancelToken((c) => {
                getCancelTokenGetEmbedUrl(c);
            }),
        },
    )
        .then((response) => {
            resolve(normalizeGetAllWebpageEmbedData(response));
        })
        .catch((error) => {
            reject(error);
        });
});

export const saveNewWebpageEmbedWhitelistData = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_WEBPAGE_EMBED_WHITELIST_URL, data, {
        ...getLoaderConfig(),
        cancelToken: new CancelToken((c) => {
            getCancelTokenAddEmbedUrl(c);
        }),
    })
        .then((response) => {
            console.log('unTrustedContent.data 0', response);
            const normalizedData = normalizeSaveNewWebpageEmbedWhitelistData(response);
            resolve(normalizedData);
        })
        .catch((error) => {
            reject(error);
        });
});

export const deleteWebpagefromWhitelist = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_WEBPAGE_EMBED_WHITELIST_URL, data, {
        ...getLoaderConfig(),
        cancelToken: new CancelToken((c) => {
            getCancelTokenDeleteEmbedUrl(c);
        }),
    })
        .then((response) => {
            const normalizedData = normalizeDeleteWebpageEmbedData(response);
            resolve(normalizedData);
        })
        .catch((error) => {
            reject(error);
        });
});
