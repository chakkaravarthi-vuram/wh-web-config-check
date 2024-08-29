import axios from 'axios';

import { axiosMLGetUtils, axiosMLPostUtils } from '../AxiosMLHelper';
import { FIELD_TYPE_SUGGESTION } from '../../urls/ApiUrls';
import { normalizeFieldType, normalizeTrackingData } from '../apiNormalizer/fieldnameAutocomplete.apiNormalizer';
import { normalizer } from '../../utils/normalizer.utils';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../../utils/constants/form/form.constant';

const { CancelToken } = axios;
const setSource = () => CancelToken.source();
// commmon form related apis

export const getFieldTypeSuggestion = (params, cancelToken) => {
    console.log('getFieldAutocomplete api service', params);
    let apiCancelToken;
    if (cancelToken) {
        apiCancelToken = new CancelToken((c) => cancelToken(c));
    } else {
        apiCancelToken = setSource().token;
    }
    return new Promise((resolve, reject) => {
        axiosMLGetUtils(FIELD_TYPE_SUGGESTION, {
            params,
            cancelToken: apiCancelToken,
        })
            .then((res) => {
                console.log('ML res', res);
                resolve(normalizer(normalizeFieldType(res), REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS));
            })
            .catch((err) => {
                console.log('ML err', err);
                reject(err);
            });
    });
};

export const postFieldTypeSuggestion = (params, cancelToken) => {
    console.log('postFieldTypeSuggestion api service', params);
    let apiCancelToken;
    if (cancelToken) {
        apiCancelToken = new CancelToken((c) => cancelToken(c));
    } else {
        apiCancelToken = setSource().token;
    }
    return new Promise((resolve, reject) => {
        axiosMLPostUtils(FIELD_TYPE_SUGGESTION, {
            params,
            cancelToken: apiCancelToken,
        })
            .then((res) => {
                console.log('ML res', res);
                resolve(normalizeTrackingData(res));
            })
            .catch((err) => {
                console.log('ML err', err);
                reject(err);
            });
    });
};

export default getFieldTypeSuggestion;
