import React, { useEffect } from 'react';
import {
    BorderRadiusVariant,
    Chip,
    Title,
    ETitleHeadingLevel,
    ETitleSize,
    EChipSize,
    Button,
    SingleDropdown,
    EButtonSizeType,
    EButtonType,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import { COLOR } from '../../application/app_components/task_listing/TaskList.constants';
import styles from './LandingPageFilter.module.scss';

function LandingPageFilter(props) {
    const {
        filterTitle,
        colorScheme,
        onClearByFilterId,
        onSave,
        onCancel,
        onClear,
        targetRef,
        setPopperVisibility,
        selectedFilter,
        formatAppliedFilterLabel,
        filterDropdownList = [],
    } = props;

    function handleClickOutside(event) {
        if (targetRef.current && !targetRef.current.contains(event.target)) {
            setPopperVisibility(false);
            onCancel();
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [targetRef]);

    return (
        <div className={styles.FilterContainer}>
            <Title
                content={filterTitle}
                headingLevel={ETitleHeadingLevel.h5}
                size={ETitleSize.xs}
                className={cx(gClasses.BlackV20, styles.FilterTitle)}
            />
            {(selectedFilter?.length > 0) && (
                <div className={styles.SelectedFilter}>
                    {selectedFilter.map((filter) => (
                        <Chip
                            key={filter?.value}
                            size={EChipSize.sm}
                            textColor={COLOR.BLACK_10}
                            backgroundColor={COLOR.GRAY_10}
                            text={formatAppliedFilterLabel ? formatAppliedFilterLabel?.(filter?.value, filter?.label) : filter?.label}
                            borderRadiusType={BorderRadiusVariant.circle}
                            className={gClasses.WhiteSpaceNoWrap}
                            onDelete={() => { onClearByFilterId(filter); }}
                        />
                    ))}
                </div>)}
            <div className={cx(styles.Filter, gClasses.CenterV, gClasses.Gap16)}>
                {filterDropdownList.map((filter) => (
                    <SingleDropdown
                        id={filter?.id}
                        key={filter?.label}
                        optionList={filter?.optionList}
                        dropdownViewProps={{
                            className: styles.Dropdown,
                        }}
                        placeholder={filter?.label}
                        selectedValue={filter?.selectedValue}
                        className={cx(gClasses.ZIndex8, gClasses.WhiteSpaceNoWrap, styles.minw178px)}
                        onClick={filter?.onChange}
                    />
                ))}
            </div>
            <div className={styles.FilterActions}>
                <Button
                    size={EButtonSizeType.SM}
                    type={EButtonType.TERTIARY}
                    buttonText="Clear all"
                    onClickHandler={onClear}
                    colorSchema={colorScheme}
                    className={gClasses.P0}
                />
                <Button
                    size={EButtonSizeType.SM}
                    buttonText="Apply"
                    onClickHandler={onSave}
                    colorSchema={colorScheme}
                />
            </div>
        </div>
    );
}

export default React.forwardRef((props, ref) => <LandingPageFilter targetRef={ref} {...props} />);
