import React, { useState, useRef, useEffect } from 'react';
import { Label, SingleDropdown, Size } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { cloneDeep } from '../../../../../../utils/jsUtility';
import Plus from '../../../../../../assets/icons/configuration_rule_builder/Plus';
import styles from '../BranchParallelPaths.module.scss';

function SingleStepSelection(props) {
    const {
        addStepLabel, placeholder, searchLabel,
        selectedValue, errorMessage, addButtonClass,
        toggleAddNewNodeDropdown, refId, stepsList,
        selectedLabel, onClick, label, required,
    } = props;
    const addNewStepRef = useRef(null);
    const [searchText, setSearchText] = useState();
    const [optionsList, setOptionsList] = useState(stepsList);

    useEffect(() => {
        setOptionsList(stepsList);
    }, [stepsList]);
    const onChangeSearch = (e) => {
        const { target: { value } } = e;
        const searchResults = stepsList?.filter(({ label }) => label.includes(value));
        setOptionsList(searchResults);
        setSearchText(value);
    };

    return (
        <>
            {
                label && (
                    <Label
                        labelName={label}
                        isRequired={required}
                        className={gClasses.PB5}
                    />
                )
            }
            <div className={cx(gClasses.DisplayFlex)}>
                <SingleDropdown
                    optionList={cloneDeep(optionsList)}
                    placeholder={placeholder}
                    dropdownViewProps={{
                        selectedLabel,
                    }}
                    onClick={onClick}
                    searchProps={{
                        searchLabel,
                        searchValue: searchText,
                        onChangeSearch: onChangeSearch,
                    }}
                    selectedValue={selectedValue}
                    className={cx(styles.ChooseNextStep)}
                    size={Size.md}
                    errorMessage={errorMessage}
                />
                <button
                    className={cx(styles.AddStep, addButtonClass)}
                    onClick={() => toggleAddNewNodeDropdown({ refId, ref: addNewStepRef })}
                    ref={addNewStepRef}
                >
                    <Plus className={gClasses.MR4} />
                    {addStepLabel}
                </button>
            </div>
        </>
    );
}
export default SingleStepSelection;
