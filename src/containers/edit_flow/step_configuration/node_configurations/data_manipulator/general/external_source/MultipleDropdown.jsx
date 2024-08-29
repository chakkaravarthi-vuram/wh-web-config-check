import React, { useRef, useState } from 'react';
import cx from 'classnames/bind';
import { DropdownList, Popper, EPopperPlacements, SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import { useClickOutsideDetector } from '../../../../../../../utils/UtilityFunctions';
import FilledExpandArrowIcon from '../../../../../../../assets/icons/flow_icons/ExpandArrowIcon';
import styles from '../../DataManipulator.module.scss';
import NestedOverlay from '../../../../../../../components/nested_overlay/NestedOverlay';

function MultipleDropdown(props) {
    console.log('adsfadsfasdfasdf');
    const { className } = props;
    const [isInsertOpen, setIsInsertOpen] = useState(false);

    const popperRef = useRef(null);
    useClickOutsideDetector(popperRef, () => setIsInsertOpen(false));

    const ACTIONS_OPTION_LIST = [
        {
            label: 'Update',
            value: 'update',
        },
        {
            label: 'Append',
            value: 'append',
        },
    ];

    const secondaryComponent = (
        <div className={cx(styles.InsertDropdown, gClasses.CenterV)}>
            <button ref={popperRef} onClick={() => setIsInsertOpen(!isInsertOpen)} className={cx(gClasses.FTwo12BlueV39, gClasses.W100, gClasses.FontWeight500)}>
                Insert field
                <FilledExpandArrowIcon className={gClasses.ML4} />
            </button>
            <Popper
                open={isInsertOpen}
                targetRef={popperRef}
                placement={EPopperPlacements.BOTTOM}
                content={
                    <DropdownList
                        optionList={ACTIONS_OPTION_LIST}
                    />
                }
            />
        </div>
    );

    const primaryComponent = (
        <SingleDropdown
            optionList={[]}
            onClick={null}
            searchProps={{
                searchPlaceholder: EMPTY_STRING,
                searchValue: EMPTY_STRING,
                onChangeSearch: null,
                searchLabel: EMPTY_STRING,
            }}
            infiniteScrollProps={{
                dataLength: 15,
                next: null,
                hasMore: false,
                scrollableId: 'idd',
                scrollThreshold: 0.8,
            }}
            dropdownViewProps={{
                labelName: EMPTY_STRING,
            }}
            getPopperContainerClassName={(isOpen) => isOpen && gClasses.ZIndex2}
        />
    );

    return (
        <NestedOverlay
            primaryComponent={primaryComponent}
            secondaryComponent={secondaryComponent}
            className={className}
        />
    );
}

export default MultipleDropdown;
