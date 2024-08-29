import React, { useContext, useState, useEffect } from 'react';
import {
    Breadcrumb,
    Button,
    EButtonSizeType,
    EButtonType,
    EPopperPlacements,
    ETabVariation,
    ETextSize,
    SingleDropdown,
    Tab,
    Text,
    Variant,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { useHistory } from 'react-router-dom';
import styles from './Header.module.scss';
import ThemeContext from '../../hoc/ThemeContext';
import gClasses from '../../scss/Typography.module.scss';
import VerticalDot from '../../assets/icons/header/VerticalDot';
import RightArrowIcon from '../../assets/icons/header/RightIcon';
import { isEmpty, cloneDeep, truncate } from '../../utils/jsUtility';
import { isBasicUserMode, truncateWithEllipsis } from '../../utils/UtilityFunctions';

function Header(props) {
    const {
        pageTitle,
        fieldLabel,
        fieldValue,
        sourceName,
        tabOptions = [],
        errorTabList = [],
        selectedTabIndex,
        SeparatorIcon,
        variation,
        bottomSelectionClass,
        headerValueClass,
        headerLabelClass,
        breadCrumbClass,
        onTabItemClick,
        primaryCTALabel,
        primaryCTAClicked,
        secondaryCTALabel,
        secondaryCTAClicked,
        secondaryBtnClass,
        tertiaryCTALabel,
        tertiaryCTAClicked,
        tertiaryBtnClass,
        subMenuList,
        subMenuItemClicked,
        displaySecondaryActions,
        primaryCTAType,
        primaryBtnClass,
        SecondaryCTAIcon,
        isLoading,
        tabIconClassName,
        tabDisplayCount,
        className,
        tabContainerClass,
        primaryButtonDisabled = false,
        breadCrumbList,
        handleBreadCrumb,
        completedTab,
        innerTabClass,
    } = props;
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const history = useHistory();
    const isNormalMode = isBasicUserMode(history);
    const iconOnlySecondaryButton = isEmpty(secondaryCTALabel);
    const [tabOptionsList, setTabOptions] = useState(cloneDeep(tabOptions));

    useEffect(() => {
        let formattedTabOptionList = [];
        const tabOptionsCopy = cloneDeep(tabOptions);
        if (errorTabList) {
            console.log('errorTabList', errorTabList);
            (tabOptionsCopy || []).forEach((tab) => {
                if ((tab.tabIndex !== selectedTabIndex)) {
                    if (errorTabList.includes(tab.tabIndex)) {
                        tab.className = cx(tab?.className, styles.ErrorTab);
                    } else if (tab.tabIndex <= completedTab) {
                        tab.isCompleted = true;
                    }
                }
                formattedTabOptionList.push({
                    ...tab,
                });
            });
        } else formattedTabOptionList = tabOptionsCopy;
        console.log(formattedTabOptionList, selectedTabIndex, errorTabList, 'kljjlkjkljkjkl');
        setTabOptions(cloneDeep(formattedTabOptionList));
    }, [errorTabList.length, selectedTabIndex, tabOptions.length, completedTab]);

    return (
        <div className={cx(styles.HeaderWrapper, gClasses.DisplayFlex, gClasses.Gap8)} style={{ background: colorSchemeDefault?.widgetBg }}>
            <div className={styles.TitleWrapper}>
                <div className={cx(gClasses.DisplayFlex, (pageTitle || sourceName) && styles.TitleInfo)}>
                    {pageTitle &&
                        <Text
                            content={truncateWithEllipsis(sourceName ? `${pageTitle}:` : pageTitle, 50)}
                            title={sourceName ? `${pageTitle}:` : pageTitle}
                            size={ETextSize.XS}
                            className={styles.FieldValue}
                        />
                    }
                    &nbsp;
                    {sourceName &&
                        <Text
                            content={sourceName}
                            size={ETextSize.XS}
                            className={styles.FieldValue}
                        />
                    }
                </div>
                {breadCrumbList &&
                    <Breadcrumb
                        list={breadCrumbList}
                        isLoading={isLoading}
                        handleLinkClick={handleBreadCrumb}
                        preventNavigation
                        className={cx(breadCrumbClass)}
                    />
                }
                <div className={cx(gClasses.CenterV, gClasses.LineHeightNormal)}>
                    {fieldLabel && <Text content={`${fieldLabel}:`} size={ETextSize.MD} className={cx(styles.FieldLabel, gClasses.FontWeight500, headerLabelClass)} />}
                    &nbsp;
                    {fieldValue &&
                        <Text
                            content={truncate(fieldValue, { length: 28 })}
                            title={fieldValue}
                            size={ETextSize.MD}
                            className={cx(styles.FieldValue, headerValueClass, gClasses.FontWeight500)}
                            isLoading={isLoading}
                        />
                    }
                </div>
            </div>
            <Tab
                options={tabOptionsList}
                selectedTabIndex={selectedTabIndex}
                colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
                variation={variation}
                SeparatorIcon={SeparatorIcon}
                onClick={onTabItemClick}
                iconClassName={cx(styles.Icon, tabIconClassName)}
                tabContainerClass={cx(tabContainerClass, styles.TabContainer)}
                headerTabClass={cx(styles.StepperTab, innerTabClass)}
                tabDisplayCount={tabDisplayCount}
                onPopperOptionSelect={onTabItemClick}
                tabSizeVariation={ETextSize.MD}
                bottomSelectionClass={cx(styles.ActiveTab, bottomSelectionClass)}
                isLoading={isLoading}
                className={cx(className, gClasses.CenterV)}
            />
            {
                displaySecondaryActions && (
                    <div className={cx(gClasses.CenterV, gClasses.Gap8, gClasses.FlexGrow1, gClasses.JCEnd, styles.SecondaryActionWrapper)}>
                        {
                            (secondaryCTALabel || SecondaryCTAIcon) && (
                                <Button
                                    buttonText={secondaryCTALabel}
                                    type={iconOnlySecondaryButton ? EButtonType.PRIMARY : EButtonType.SECONDARY}
                                    onClickHandler={secondaryCTAClicked}
                                    size={EButtonSizeType.MD}
                                    noBorder
                                    className={cx(styles.LinkButton, secondaryBtnClass)}
                                    iconOnly={iconOnlySecondaryButton}
                                    icon={SecondaryCTAIcon && <SecondaryCTAIcon />}
                                    disabled={isLoading}
                                />
                            )
                        }
                        {
                            tertiaryCTALabel && (
                                <Button
                                    buttonText={tertiaryCTALabel}
                                    type={EButtonType.SECONDARY}
                                    onClickHandler={tertiaryCTAClicked}
                                    size={EButtonSizeType.MD}
                                    className={tertiaryBtnClass}
                                    colorSchema={isNormalMode ? colorScheme : colorSchemeDefault}
                                    disabled={isLoading}
                                />
                            )
                        }
                        {
                            primaryCTALabel && (
                                <Button
                                    buttonText={primaryCTALabel}
                                    type={primaryCTAType}
                                    className={primaryBtnClass}
                                    onClickHandler={primaryCTAClicked}
                                    size={EButtonSizeType.MD}
                                    disabled={primaryButtonDisabled || isLoading}
                                    colorSchema={isNormalMode ? colorScheme : colorSchemeDefault}
                                />
                            )
                        }
                        {
                            ((subMenuList || [])?.length > 0) && (
                                <div className={cx(styles.IconWrapper)}>
                                    <SingleDropdown
                                        optionList={subMenuList}
                                        onClick={subMenuItemClicked}
                                        dropdownViewProps={{
                                            iconOnly: true,
                                            icon: <VerticalDot />,
                                            className: styles.SubMenuLabel,
                                            variant: Variant.borderLess,
                                            disabled: isLoading,
                                        }}
                                        className={gClasses.CenterV}
                                        popperPlacement={EPopperPlacements.BOTTOM_END}
                                        colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
                                        getPopperContainerClassName={() => styles.OptionContainer}
                                        dropdownListClassName={gClasses.W100}
                                    />
                                </div>
                            )
                        }
                    </div>
                )
            }

        </div>
    );
}
Header.defaultProps = {
    SeparatorIcon: RightArrowIcon,
    displaySecondaryActions: true,
    SecondaryCTAIcon: null,
    primaryCTAType: EButtonType.PRIMARY,
    variation: ETabVariation.stepper,
};

export default Header;
