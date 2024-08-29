import React from 'react';
import { SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function CreateDropdown(props) {
    const {
        id,
        className = EMPTY_STRING,
        optionList = [],
        onClick = null,
        createProps = {},
        errorMessage = EMPTY_STRING,
        selectedValue = EMPTY_STRING,
        infiniteScrollProps = {},
        searchProps = {},
        dropdownViewProps = {},
        instruction = EMPTY_STRING,
        onOutSideClick,
        showReset,
        isLoadingOptions,
    } = props;

    console.log('createDropdown');
    return (
        <SingleDropdown
            id={id}
            className={className}
            optionList={optionList}
            onClick={onClick}
            selectedValue={selectedValue}
            instruction={instruction}
            errorMessage={errorMessage}
            infiniteScrollProps={infiniteScrollProps}
            searchProps={searchProps}
            createProps={createProps}
            dropdownViewProps={dropdownViewProps}
            onOutSideClick={onOutSideClick}
            showReset={showReset}
            isLoadingOptions={isLoadingOptions}
        />
    );
}

CreateDropdown.defaultProps = {
    infiniteScrollProps: {
        dataLength: 0,
        next: null,
        hasMore: false,
    },
};

export default CreateDropdown;
