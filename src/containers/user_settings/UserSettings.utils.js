import { translateFunction } from '../../utils/jsUtility';
import { API_KEY_HEADER_LABELS, API_KEY_STRINGS } from './UserSettings.strings';

export const API_KEY_VALUES = {
    NAME_INFO: 'api_key_name_info',
    EDIT_API_KEY: 'edit_api_key',
    VIEW_API_KEY: 'view_api_key',
    READ_WRITE: 'read_write',
    READ_ONLY: 'read',
    WRITE_ONLY: 'write',
    DESCRIPTIVE_NAME: 'descriptive_name',
    SCOPE: 'scope',
};

export const LAST_USED_DATE = 'last_used_date';

export const MASKED_ROW_KEY = 'xxxxxxxx';

export const API_KEY_HEADER_VAL = {
    DESCRIPTIVE_NAME: 'descriptive_name',
    API_KEY: 'api_key',
    LAST_USED: 'last_used',
    ACTIONS: 'actions',
};

export const KEY_SCOPE_LIST = (t = translateFunction) => [
    {
      label: API_KEY_STRINGS(t).READ_WRITE_LABEL,
      value: API_KEY_VALUES.READ_WRITE,
    },
    {
      label: API_KEY_STRINGS(t).WRITE_LABEL,
      value: API_KEY_VALUES.WRITE_ONLY,
    },
    {
      label: API_KEY_STRINGS(t).READ_LABEL,
      value: API_KEY_VALUES.READ_ONLY,
    },
];

export const API_KEY_HEADERS = (t = translateFunction) => [
    {
        label: API_KEY_HEADER_LABELS(t).DESCRIPTIVE_NAME,
        id: API_KEY_HEADER_VAL.DESCRIPTIVE_NAME,
        widthWeight: 35,
    },
    {
        label: API_KEY_HEADER_LABELS(t).API_KEY,
        id: API_KEY_HEADER_VAL.API_KEY,
        widthWeight: 25,
    },
    {
        label: API_KEY_HEADER_LABELS(t).LAST_USED,
        id: API_KEY_HEADER_VAL.LAST_USED,
        widthWeight: 25,
    },
    {
        label: '',
        id: API_KEY_HEADER_VAL.ACTIONS,
        widthWeight: 15,
    },
];

export const apiKeyTestData = [
    {
        _id: '65252b3ee6e58df027c514ea',
        name: 'api key 2',
        api_key: 'TgJJ1Iq84EWnS6Gh5z97T+FXtC+8phm54qfRYbklbDiw3SmIFZfS6U7ydOPc+d/C',
        scope: 'read',
        status: 1,
        expiry_on: '2023-12-09T10:45:18.018Z',
        last_used_on: '2023-10-12T06:24:16.576Z',
    },
    {
        _id: '6528e54ee11c9cad976421b9',
        name: 'api key 4',
        api_key: 'XWRWybRLSyIUxfLdXBNGzOODGEQNLFOgMYtmTwDf8+7SHCcyJA6MP9BpN/aQbXHG',
        scope: 'write',
        status: 1,
        expiry_on: '2023-12-12T06:35:58.245Z',
    },
    {
        _id: '6528e5a4e11c9cad976421bc',
        name: 'api key 4 with expiry 30',
        api_key: 'GUMGTOvVBcG2d0cFJ3ii4blDhJFcKiWJs0D1CAg51JqslI9Lcsdn7BcNJz/nl+K2',
        scope: 'write',
        status: 1,
        expiry_on: '2023-11-12T06:37:24.854Z',
    },
    {
        _id: '6528f5d9b90d0303364a0f49',
        name: 'api key 4 with expiry 90',
        api_key: 'bu1+hZWfsfv5nOxn6w5ISPoOIVSbri84w52wI1PZ3GRYUvwrTDtxDnq7DpaU2tvb',
        scope: 'write',
        status: 1,
        expiry_on: '2024-01-11T07:46:32.940Z',
    },
    {
        _id: '6528f61e53cc9ddd19cc76f9',
        name: 'api key 4 with expiry def',
        api_key: 'DZ7i7pBUYimcEyo3d9SD5Czu+62UHXjgxLSIDgyrZo5Y8VBqjUA59ifrRJmJoD+P',
        scope: 'write',
        status: 1,
        expiry_on: '2023-12-12T07:47:42.251Z',
    },
];
