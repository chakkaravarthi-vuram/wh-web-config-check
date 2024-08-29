import React from 'react';
import FullPageLoader from 'assets/icons/FullPageLoader';
import { get } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { getAllSearchParams } from 'utils/taskContentUtils';

function AuthorizeApp(props) {
    const searchParams = getAllSearchParams(new URLSearchParams(get(props, ['history', 'location', 'search'], EMPTY_STRING)));
    if (searchParams.authorizeUrl) {
        window.location = searchParams.authorizeUrl;
    }
    return (
        <FullPageLoader isDataLoading />
    );
}

export default AuthorizeApp;
