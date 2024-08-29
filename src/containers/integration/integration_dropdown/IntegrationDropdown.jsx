import React, { useRef } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import InfiniteScroll from 'react-infinite-scroll-component';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import DropdownIcon from 'assets/icons/DropdownIcon';
import { isEmpty } from 'utils/jsUtility';
import { INTEGRATION_CONSTANTS } from 'containers/edit_flow/diagramatic_flow_view/flow_component/flow_integration_configuration/FlowIntegrationConfiguration.constants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import Skeleton from 'react-loading-skeleton';
import SearchTab from 'containers/search_tab/SearchTab';
import { EPopperPlacements, Popper } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './IntegrationDropdown.module.scss';
import { FILTER_TYPE, INTEGRATION_STRINGS } from '../Integration.utils';
import NoSearchResults from '../no_search_results/NoSearchResults';
import { CONNECTOR_HEADERS } from '../Integration.strings';
import { useClickOutsideDetector } from '../../../utils/UtilityFunctions';
import IntegrationNavIcon from '../../../assets/icons/side_bar/IntegrationNavIcon';
import { ZOHO_ID } from '../Integration.constants';

function IntegrationDropdown(props) {
    const { integerationList = [], chooseIntegeration, chooseAppError = EMPTY_STRING,
        getIntegrationConnectorApi, integration_details = {}, isIntegrationContainerOpen,
        isFlow,
        clearSearch,
        setIntegrationContainerOpen, className, popperContainerClassName, customPopperElement, hasMore, onLoadMoreHandler, onInputChange,
        searchIntegrationText = EMPTY_STRING, isInfiniteScrollList, isDataLoading, onCloseClick } = props;
    const { BASIC_CONFIGURATION, INFINITE_SCROLL_DIV } = INTEGRATION_CONSTANTS;
    const { t } = useTranslation();
    let searchIntegration = null;
    const dropdownRef = useRef();
    const { ADD_INTEGRATION } = INTEGRATION_STRINGS;

    const getCategoryHeader = (headerText) => (
        <div className={styles.CategoryLabel}>
            {headerText}
        </div>
    );

    const onBlurPopper = () => {
        setIntegrationContainerOpen(false);
        if (clearSearch) clearSearch();
    };

    useClickOutsideDetector(dropdownRef, () => onBlurPopper());

    const integerationPopper = integerationList.map((eachIntegeration, index) => {
        console.log('eachIntegeration', eachIntegeration);
        const templateLogo = (eachIntegeration?.logo || eachIntegeration?.connector_logo);
        return (
            <div
                className={cx(styles.OptionContainer)}
                onClick={() => chooseIntegeration(eachIntegeration)}
                role="menuitem"
                tabIndex="0"
                onKeyDown={() => keydownOrKeypessEnterHandle(eachIntegeration) && chooseIntegeration(eachIntegeration)}
                id={eachIntegeration._id}
                key={index}
            >
                <div className={cx(gClasses.CenterV, BS.D_FLEX, styles.OptionListContent)}>
                    <div className={cx(!isFlow && templateLogo && (templateLogo?.includes(ZOHO_ID) ? styles.TemplateContainer : styles.CalendarTemplate))}>
                        {templateLogo ?
                            <img className={styles.TemplateLogo} src={templateLogo} alt="loading" />
                            :
                            <div className={cx(styles.LogoContainer, gClasses.CenterVH)}>
                                <IntegrationNavIcon className={styles.DefaultLogo} />
                            </div>
                        }
                    </div>
                    <div className={cx(gClasses.ML15, BS.TEXT_LEFT)}>
                        <div className={cx(gClasses.FTwo13GrayV3, gClasses.CenterV, gClasses.FontWeight500, styles.NameLabel)}>
                            {eachIntegeration.connector_name || eachIntegeration.name}
                        </div>
                        {
                            !isEmpty(eachIntegeration.description) && (
                                <div className={cx(styles.Description, gClasses.WordWrap, gClasses.FTwo12GrayV86, gClasses.MT5, gClasses.CenterV)}>
                                    {eachIntegeration.description}
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    });

    const searchTabInput = {
        onChange: onInputChange,
        placeholder: t(INTEGRATION_STRINGS.INTEGRATION_DROPDOWN.PLACEHOLDER),
        isVisible: true,
        id: INTEGRATION_STRINGS.INTEGRATION_DROPDOWN.SEARCH_ID,
    };

    searchIntegration = (
        <div className={cx(styles.SearchTab)}>
            <SearchTab input={searchTabInput} searchText={searchIntegrationText} />
        </div>
    );

    const appDropdownWidth = document.getElementById(BASIC_CONFIGURATION.APP.APP_ID)?.clientWidth;

    const integerationPopperElement = isIntegrationContainerOpen && (
        <div
            id={BASIC_CONFIGURATION.APP.CONTAINER}
            tabIndex={0}
            role="button"
            onBlur={(e) => {
                if (e.relatedTarget) {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIntegrationContainerOpen(false);
                        if (onCloseClick) onCloseClick();
                    }
                } else {
                    if (isIntegrationContainerOpen) {
                        const container = document.getElementById(BASIC_CONFIGURATION.APP.CONTAINER);
                        if (container) {
                            container.focus();
                        }
                    }
                }
            }}
        >
            <Popper
                placement={EPopperPlacements.BOTTOM}
                targetRef={dropdownRef}
                open={isIntegrationContainerOpen}
                className={styles.IntegrationPopper}
                content={(

                    <div className={styles.Container}>
                        {searchIntegration}
                        <div id={INFINITE_SCROLL_DIV} className={cx(popperContainerClassName, styles.ListContainer)} style={{ width: appDropdownWidth }}>
                            {!isFlow && getCategoryHeader(CONNECTOR_HEADERS.CUSTOM)}
                            {customPopperElement}
                            {!isFlow && getCategoryHeader(CONNECTOR_HEADERS.PRE_BUILD)}
                            {isEmpty(integerationList) ? !isEmpty(searchIntegrationText) && <NoSearchResults className={styles.NoResults} /> :
                                isInfiniteScrollList ? (
                                    <InfiniteScroll
                                        dataLength={integerationList.length}
                                        next={onLoadMoreHandler}
                                        hasMore={hasMore}
                                        height={145}
                                        className={cx(gClasses.ScrollBar, styles.InfiniteScrollHeight)}
                                        scrollThreshold={0.5}
                                        scrollableTarget={INFINITE_SCROLL_DIV}
                                        loader={(<Skeleton height={30} width="100%" />)}
                                    >
                                        {integerationPopper}
                                    </InfiniteScroll>
                                ) : (
                                    integerationPopper
                                )
                            }
                        </div>
                    </div>
                )}
            />
        </div>
    );

    return isDataLoading ? (
        <Skeleton height={30} />
    ) : (
        <div ref={dropdownRef}>
            <div
                id={BASIC_CONFIGURATION.APP.APP_ID}
                className={cx(
                    gClasses.ClickableElement,
                    gClasses.MT6,
                    gClasses.CursorPointer,
                    gClasses.P12,
                    styles.EventContainer,
                    BS.D_FLEX,
                    BS.JC_BETWEEN,
                    !isEmpty(chooseAppError) ?
                        cx(styles.ErrorClass, gClasses.MB2) : null,
                    className,
                )}
                onClick={() => {
                    if (!isIntegrationContainerOpen) getIntegrationConnectorApi({ postData: { page: 1, size: 1000, status: FILTER_TYPE.PUBLISHED } });
                    setIntegrationContainerOpen(!isIntegrationContainerOpen);
                }}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                    if (!isIntegrationContainerOpen) getIntegrationConnectorApi({ page: 1, size: 1000 });
                    keydownOrKeypessEnterHandle(e) && setIntegrationContainerOpen(!isIntegrationContainerOpen);
                }}
            >
                {isEmpty(integration_details) ?
                    (
                        <div
                            className={cx(gClasses.FTwo13GrayV62, gClasses.FontWeight400, gClasses.CenterV)}
                        >
                            {t(ADD_INTEGRATION.CHOOSE_CONNECTOR_HERE)}
                        </div>
                    ) :
                    (
                        <div
                            className={cx(gClasses.FTwo13GrayV3, gClasses.FontWeight500, gClasses.CenterV)}
                        >
                            {integration_details?.connector_name || integration_details?.name}
                        </div>
                    )}
                <div
                    className={cx(gClasses.CenterV)}
                >
                    <DropdownIcon />
                </div>
            </div>
            {integerationPopperElement}
        </div>
    );
}

export default IntegrationDropdown;
