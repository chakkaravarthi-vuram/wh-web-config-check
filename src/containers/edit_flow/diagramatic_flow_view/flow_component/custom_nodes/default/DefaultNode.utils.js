import React from 'react';
import { isEmpty } from '../../../../../../utils/jsUtility';
import styles from './DefaultNode.module.scss';
import { ELLIPSIS, EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { STEP_TYPE } from '../../../../../../utils/Constants';

export const getSearchMatchesCount = (string, searchText = EMPTY_STRING) => {
    if (isEmpty(searchText)) return 0;
    const parts = string.split(new RegExp(`(${searchText})`, 'gi'));
    let count = 0;

    parts.forEach((part) => {
        if (part.toLowerCase() === searchText.toLowerCase()) {
            count += 1;
        }
    });
    return count;
};

export const getHighlightedSearchText = (string, searchText = EMPTY_STRING, searchResults = {}, id = null) => {
    if (isEmpty(searchText)) return string;
    const activeSearchNode = searchResults?.data?.[searchResults?.searchIndex];
    const parts = string.split(new RegExp(`(${searchText})`, 'gi'));
    let count = 0;
    return parts.map((part, index) => {
        if (part.toLowerCase() === searchText.toLowerCase()) {
            const data = (
                <mark
                    className={(count === activeSearchNode?.strIndex && id === activeSearchNode?.id) ? styles.ActiveSearchResult
                        : styles.HighlightText}
                    key={`${id}-${index}`}
                >
                    {part}
                </mark>
            );
            count += 1;
            return data;
        }
        return part;
    });
};

const getStartIndicesOf = (searchStr, str) => {
    const searchStrLen = searchStr.length;
    if (searchStrLen === 0) {
        return [];
    }
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
    let startIndex = 0;
    const indices = [];

    let index = str.indexOf(searchStr, startIndex);

    while (index > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
        index = str.indexOf(searchStr, startIndex);
    }
    return indices;
};

export const getStepNameLimit = (stepType) => {
    let maxLimit = null;
    if (stepType === STEP_TYPE.USER_STEP) {
        // step node size xl
        maxLimit = 29;
    } else if ([STEP_TYPE.START_STEP, STEP_TYPE.END_FLOW].includes(stepType)) {
        // step node size md
        maxLimit = 10;
    } else if ([STEP_TYPE.WAIT_STEP, STEP_TYPE.CONDITON_PATH_SELECTOR,
    STEP_TYPE.JOIN_STEP, STEP_TYPE.PARALLEL_STEP].includes(stepType)) {
        // routing nodes
        maxLimit = 14;
    } else {
        // step node size lg
        maxLimit = 20;
    }
    return maxLimit;
};

export const getHighlightedSearchTextWithEllipsis = (string, searchText = EMPTY_STRING, searchResults = {}, id = null, stepType = STEP_TYPE.USER_STEP) => {
    if (isEmpty(searchText)) {
        return string;
    }
    const maxLimit = getStepNameLimit(stepType);
    if (string.length > maxLimit) {
        const startIndices = getStartIndicesOf(searchText, string);
        const displayStringLength = maxLimit - 2;
        const startIndexWithEllipsis = startIndices.find((startIndex) =>
            (startIndex > displayStringLength) || (startIndex + searchText.length > displayStringLength));
        let displayString = string.substring(0, displayStringLength);
        if (startIndexWithEllipsis && startIndexWithEllipsis + searchText.length > displayStringLength) {
            const activeSearchNode = searchResults?.data?.[searchResults?.searchIndex];
            const highlightEllipsisText = (activeSearchNode?.id === id) && (startIndices?.[activeSearchNode?.strIndex] >= startIndexWithEllipsis);
            if (startIndexWithEllipsis <= displayStringLength) {
                displayString = string.substring(0, startIndexWithEllipsis);
            }
            return (
                <>
                    {getHighlightedSearchText(displayString, searchText, searchResults, id)}
                    <mark
                        className={highlightEllipsisText ? styles.ActiveSearchResult : styles.HighlightText}
                        key={`${id}-partOfSearch`}
                    >
                        {string.substring(startIndexWithEllipsis, displayStringLength)}
                        {ELLIPSIS}
                    </mark>
                </>
            );
        }
        return (
            <>
                {getHighlightedSearchText(displayString, searchText, searchResults, id)}
                {ELLIPSIS}
            </>
        );
    } else {
        return getHighlightedSearchText(string, searchText, searchResults, id);
    }
};
