import React, { useState, useRef } from 'react';
import cx from 'classnames/bind';
import { Text, Picker, EPopperPlacements, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../../scss/Typography.module.scss';
import styles from '../BranchParallelPaths.module.scss';
import Plus from '../../../../../../assets/icons/configuration_rule_builder/Plus';
import { isEmpty, cloneDeep } from '../../../../../../utils/jsUtility';
import { EMPTY_STRING, NO_DATA_FOUND } from '../../../../../../utils/strings/CommonStrings';

function StepSelection(props) {
    const {
        id,
        selectedValue = [],
        configStrings,
        stepsList = [],
        onSelectValue,
        onRemoveValue,
        errorMessage,
        toggleAddNewNodeDropdown,
        refId,
    } = props;

    const { t } = useTranslation();

    const addNewStepRef = useRef(null);
    const [searchText, setSearchText] = useState();

    const selectedValueUuids = cloneDeep(selectedValue).map((step) => step.value);
    const stepsListFiltered = stepsList?.filter(({ value }) => !selectedValueUuids.includes(value));

    const onChangeSearch = (e) => {
        const { target: { value } } = e;
        setSearchText(value);
    };

    const displayAddNewNodeDropdown = () => {
        toggleAddNewNodeDropdown({
            refId,
            ref: addNewStepRef,
        });
    };

    return (
        <>
            <div className={cx(gClasses.DisplayFlex, gClasses.GAP8, gClasses.AlignCenter)} id={id}>
                <Picker
                    optionList={!isEmpty(searchText) ? stepsListFiltered?.filter(({ label }) => label?.toLowerCase().includes(searchText?.toLowerCase())) : stepsListFiltered}
                    selectedValue={selectedValue}
                    onSelect={onSelectValue}
                    onRemove={onRemoveValue}
                    dropdownSearchProps={{
                        isSearchable: true,
                        searchPlaceholder: configStrings.STEPS_DROPDOWN.SEARCH.PLACEHOLDER,
                        searchText: searchText,
                        onSearch: onChangeSearch,
                    }}
                    allLabels={{
                        ADD_BUTTON: configStrings.STEPS_DROPDOWN.CHOOSE_LABEL,
                        MAIN_POPPER_HEADING: configStrings.STEPS_DROPDOWN.SELECTED_LABEL,
                        SUGGESTION: configStrings.STEPS_DROPDOWN.SUGGESTION_LABEL,
                    }}
                    onPopperOutsideClick={() => setSearchText(EMPTY_STRING)}
                    maxSelectionCount={100}
                    getPopperContainerClassName={() => gClasses.ZIndex25}
                    displayLength={30}
                    buttonClassName={cx(styles.AddButtonClass, !isEmpty(selectedValue))}
                    popperPlacement={EPopperPlacements.AUTO}
                    hideLabel
                    noDataFoundMessage={t(NO_DATA_FOUND)}
                />
                <div>
                    <Text
                        content={configStrings.PATH.OR}
                        className={cx(gClasses.FTwo12GrayV89, gClasses.FontSize13Imp)}
                    />
                </div>
                <button
                    ref={addNewStepRef}
                    onClick={displayAddNewNodeDropdown}
                    className={styles.AddStep}
                >
                    <Plus className={gClasses.MR4} />
                    {configStrings.PATH.ADD_BRANCH}
                </button>
            </div>
            <Text
                content={errorMessage}
                size={ETextSize.XS}
                className={gClasses.red22}
            />
        </>
    );
}

export default StepSelection;
