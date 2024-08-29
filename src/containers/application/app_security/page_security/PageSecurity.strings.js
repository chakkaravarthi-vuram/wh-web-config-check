import { translateFunction } from '../../../../utils/jsUtility';

export const PAGE_SECURITY_STRINGS = (t = translateFunction) => {
    return {
        PAGE_SECURITY: 'page_security',
        PAGE_SECURITY_LABEL: t('app_strings.app_security.page_security'),
        HEADERS: [
            t('app_strings.security.page_security.headers.created_pages'),
            t('app_strings.security.page_security.headers.selected_users'),
        ],
        ROWS: {
            PAGES: {
                ID: 'pages',
            },
            VIEWERS: {
                ID: 'viewers',
                NO_DATA_FOUND: t('app_strings.security.page_security.no_data_found'),

            },
        },
    };
};
