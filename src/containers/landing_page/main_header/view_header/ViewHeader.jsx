import React, { useContext } from 'react';
import cx from 'classnames';
import { useHistory } from 'react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import { Breadcrumb, ETabVariation, ETextSize, Tab, Thumbnail, Title, Text } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './ViewHeader.module.scss';
import { isBasicUserMode } from '../../../../utils/UtilityFunctions';
import { BS, DEFAULT_COLORS_CONSTANTS } from '../../../../utils/UIConstants';
import ThemeContext from '../../../../hoc/ThemeContext';
// import { isEmpty } from '../../../../utils/jsUtility';

function ViewHeader(props) {
    const {
        handleBreadCrumb,
        tabOptions,
        onTabChange,
        selectedTabIndex,
        breadcrumbList,
        titleName,
        isLoading,
        thumbnailIcon,
        thumbnailClass,
        descriptionClass,
        actionButtons,
        description,
        nameClass,
        showNameTitle,
        showDescTitle,
    } = props;

    const history = useHistory();
    const isNormalMode = isBasicUserMode(history);
    const { colorScheme } = useContext(ThemeContext);

    return (
        <div className={styles.HeaderContainer}>
            <Breadcrumb
                list={breadcrumbList}
                isLoading={isLoading}
                handleLinkClick={handleBreadCrumb}
                preventNavigation
                className={cx(gClasses.PY8, styles.Breadcrumb)}
            />
            <div className={cx(gClasses.PX24, gClasses.CenterV, BS.JC_BETWEEN)}>
                <div className={gClasses.CenterV}>
                    <Thumbnail
                        showIcon
                        isDataLoading={isLoading}
                        className={cx(thumbnailClass, gClasses.MR16, styles.Thumbnail)}
                        icon={thumbnailIcon}
                        backgroundColor={
                        isNormalMode
                            ? `${colorScheme?.activeColor}20`
                            : `${DEFAULT_COLORS_CONSTANTS.BLUE_V39}20`
                        }
                    />
                    <div>
                        <div title={showNameTitle && titleName}>
                            <Title
                                isDataLoading={isLoading}
                                content={titleName}
                                className={cx(gClasses.FTwo18GrayV3, nameClass, gClasses.Ellipsis)}
                                // headingLevel={ETitleHeadingLevel.h4}
                            />
                        </div>
                        {description && (
                            <div title={showDescTitle && description}>
                                <Text className={cx(descriptionClass, gClasses.Ellipsis)} content={description} />
                            </div>
                        )}
                    </div>
                </div>
                {!isLoading ? actionButtons : null}
            </div>
            <Tab
                options={tabOptions}
                selectedTabIndex={selectedTabIndex}
                variation={ETabVariation.primary}
                onClick={onTabChange}
                className={cx(gClasses.PT15, styles.ListingTab)}
                tabSizeVariation={ETextSize.MD}
                bottomSelectionClass={styles.ActiveTab}
                textClass={styles.TabText}
            />
        </div>
    );
}

export default ViewHeader;
