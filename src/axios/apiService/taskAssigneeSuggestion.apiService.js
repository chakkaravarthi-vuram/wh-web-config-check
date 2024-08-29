import axios from 'axios';

import { axiosMLGetUtils, axiosMLPostUtils } from '../AxiosMLHelper';
import { GET_TASK_ASSIGNEE_SUGGESTION } from '../../urls/ApiUrls';
import { normalizeTaskAssignee, normalizeTrackingData } from '../apiNormalizer/fieldnameAutocomplete.apiNormalizer';

const { CancelToken } = axios;
const setSource = () => CancelToken.source();
// commmon form related apis

export const getTaskAssigneeSuggestion = (params, cancelToken) => {
    console.log('task assignee suggestion api service', params);
    let apiCancelToken;
    if (cancelToken) {
        apiCancelToken = new CancelToken((c) => cancelToken(c));
    } else {
        apiCancelToken = setSource().token;
    }
    return new Promise((resolve, reject) => {
        axiosMLGetUtils(GET_TASK_ASSIGNEE_SUGGESTION, {
            params,
            cancelToken: apiCancelToken,
        })
            .then((res) => {
                console.log('ML res', res);
                resolve(normalizeTaskAssignee(res));
            })
            .catch((err) => {
                console.log('ML err', err);
                reject(err);
            });
    });
};

export const postTaskAssigneeSuggestion = (params, cancelToken) => {
    console.log('post task assignee suggestion api service', params);
    let apiCancelToken;
    if (cancelToken) {
        apiCancelToken = new CancelToken((c) => cancelToken(c));
    } else {
        apiCancelToken = setSource().token;
    }
    return new Promise((resolve, reject) => {
        axiosMLPostUtils(GET_TASK_ASSIGNEE_SUGGESTION, {
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

export default getTaskAssigneeSuggestion;
