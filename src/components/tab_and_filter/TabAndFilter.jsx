import React from 'react';
import Tab, { TAB_TYPE } from 'components/tab/Tab';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import cx from 'classnames/bind';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import styles from './TabAndFilter.module.scss';

function TabAndFilter(props) {
    const {
        selectedTabValue,
        tabOptionList,
        tabTextClassName,
        onTabChangeHandler,
        sortOptionList,
        sortSelectedValue,
        sortOnchange,
        sortDropdownId,
        hideSort = false,
        searchComp,
        hideTab = false,
    } = props;

    return (
        <div className={cx(styles.TabSortContainer, BS.D_FLEX, BS.JC_BETWEEN)}>
            {!hideTab && (
                <Tab
                selectedIndex={selectedTabValue}
                tabIList={tabOptionList}
                type={TAB_TYPE.TYPE_7}
                tabTextClassName={tabTextClassName}
                setTab={onTabChangeHandler}
                />
            )}
            <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
              {searchComp}
            </div>
            {!hideSort && (
            <div className={cx(BS.D_FLEX)}>
                <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
                    <div className={cx(styles.SortName, gClasses.ML20, gClasses.FontWeight500)}>
                        Sort By:
                    </div>
                </div>

                <div className={cx(gClasses.ML5, BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
                    <Dropdown
                        dropdownListClasses={styles.DropdownList}
                        id={sortDropdownId}
                        optionList={sortOptionList}
                        onChange={sortOnchange}
                        selectedValue={sortSelectedValue}
                        isNewDropdown
                        isBorderLess
                        noInputPadding
                        isTaskDropDown
                        newDropdownCustomClass={styles.FilterClass}
                    />
                </div>
            </div>
            )}
        </div>
    );
}
export default TabAndFilter;
