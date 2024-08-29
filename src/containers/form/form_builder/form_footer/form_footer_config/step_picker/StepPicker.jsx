import React, { useEffect, useState } from 'react';
import { SingleDropdown, Size, Variant } from '@workhall-pvt-lmt/wh-ui-library';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';

function StepPicker(props) {
    const {
        id = null,
        label = null,
        placeholder = null,
        stepList = [],
        selectedStep = null,
        validationMessage = null,
        variant = Variant.border,
        disabled = false,

        onChange = null,
        // onCreateStep = null,
    } = props;

    const [search, setSearch] = useState();
    const [localStepList, setLocalStepList] = useState(stepList);

    useEffect(() => {
        setLocalStepList(stepList);
    }, [stepList]);

    useEffect(() => {
        let filteredStepList = [];
        if (search) {
            filteredStepList = stepList.filter((step) => ((step?.label || EMPTY_STRING).toLowerCase())?.includes(search.toLowerCase()));
        } else {
            filteredStepList = stepList;
        }

        setLocalStepList(filteredStepList);
    }, [search]);

    // const onCreateNewStep = () => {
    //     onCreateStep?.();
    // };

    return (
        <SingleDropdown
            id={id}
            optionList={localStepList}
            selectedValue={selectedStep}
            errorMessage={validationMessage}
            onClick={(value, _label, _list, id) => onChange(id, value)}
            placeholder="Choose"
            noDataFoundMessage="No Data Found"
            dropdownViewProps={{
                size: Size.md,
                variant,
                labelName: label,
                placeholder: placeholder,
                disabled: disabled,
                selectedLabel: localStepList.find((s) => s.value === selectedStep)?.label,
            }}
            infiniteScrollProps={{
                dataLength: stepList.length,
                next: () => {},
                hasMore: false,
            }}
            searchProps={{
                searchValue: search,
                searchPlaceholder: 'Search Step',
                // showLink: isEmpty(localStepList),
                // linkLabel: 'Add',
                // onLinkClick: onCreateNewStep,
                onChangeSearch: (event) => setSearch(event?.target?.value),
            }}
        />
    );
}

export default StepPicker;
