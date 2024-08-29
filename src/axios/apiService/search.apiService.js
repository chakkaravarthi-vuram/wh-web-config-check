import axios from 'axios';
import { getCancelTokenForGlobalSearch } from 'containers/multi_category_search/MultiCategorySearch';
import { axiosGetUtils } from '../AxiosHelper';
import { GLOBAL_SEARCH, GLOBAL_SEARCH_DEV } from '../../urls/ApiUrls';
import { normalizeGetAllSearchData } from '../apiNormalizer/search.apiNormalizer';

const { CancelToken } = axios;

export const getGlobalSearchApi = (params, isNormalMode) => new Promise((resolve, reject) => {
    axiosGetUtils(
        isNormalMode ? GLOBAL_SEARCH : GLOBAL_SEARCH_DEV,
        {
            params,
            cancelToken: new CancelToken((c) => {
                getCancelTokenForGlobalSearch(c);
            }),
        },
    )
        .then((response) => {
            resolve(normalizeGetAllSearchData(response));
        })
        .catch((error) => {
            reject(error);
        });
});
