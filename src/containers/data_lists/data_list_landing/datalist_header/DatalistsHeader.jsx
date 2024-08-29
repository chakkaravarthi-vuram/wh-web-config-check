import React, { useContext, useMemo, useRef, useState } from 'react';
import { Breadcrumb, ETitleSize, Tab, Thumbnail, Title, ETabVariation, Button, EButtonType, Popper, DropdownList, EPopperPlacements, SingleDropdown, Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { datalistBreadCrumb, DATALISTS_CONSTANTS } from '../DatalistsLanding.constant';
import style from './DatalistsHeader.module.scss';
import ThreeDotsIcon from '../../../../assets/icons/datalists/ThreeDots';
import DatalistStackIcon from '../../../../assets/icons/datalists/DatalistStackIcon';
import ThemeContext from '../../../../hoc/ThemeContext';
import EditDatalistIcon from '../../../../assets/icons/datalists/EditDatalistIcon';
import DiscardDraftDataLists from '../discard_draft_datalists/DiscardDraftDataLists';
import DeleteDatalist from '../delete_datalists/DeleteDataLists';
import { getRouteLink, routeNavigate, useClickOutsideDetector } from '../../../../utils/UtilityFunctions';
import { DATALIST_OVERVIEW, DATALIST_USERS, DATA_LIST_DASHBOARD, EDIT_DATA_LIST, LIST_DATA_LIST } from '../../../../urls/RouteConstants';
import DraftPublishedIndicator from '../../../../components/draft_published_indicator/DraftPublishedIndicator';
import { ROUTE_METHOD } from '../../../../utils/Constants';
import { isEmpty } from '../../../../utils/jsUtility';

function DatalistHeader(props) {
    const {
        currentTab,
        landingPageData,
        onToggle,
        isBasicInfoLoading,
    } = props;

    const { t } = useTranslation();
    const { dataListName, dataListUUID, hasDraft, id, status } = landingPageData;
    const { DATALIST_HEADER_TAB, EDIT, DRAFT, DRAFT_LABEL, PUBLISHED, PUBLISHED_LABEL, HEADER_OPTIONS, SHOWING } = DATALISTS_CONSTANTS(t);

    const kebabMenuOptions = HEADER_OPTIONS(hasDraft && status === DRAFT, landingPageData?.isSystemDefined);

    const history = useHistory();
    const dropdownRef = useRef();
    const [toggleValue, setToggleValue] = useState(PUBLISHED);
    const [showMore, setShowMore] = useState(false);
    const optionRef = useRef(null);
    const { colorSchemeDefault } = useContext(ThemeContext);
    const [showOptions, setShowOptions] = useState(0);
    const isUserDatalist = history.location.pathname.includes(DATALIST_USERS);
    const selectedTabIndex = useMemo(
        () => DATALIST_HEADER_TAB.find((f) => f.value === currentTab)?.tabIndex,
        [currentTab],
      );

    const onTabChangeHandler = (tabValue) => {
        let readonlyDatalistPathName = `${DATA_LIST_DASHBOARD}/${dataListUUID}/${tabValue}`;
        if (history.location.pathname.includes(DATALIST_USERS)) {
            readonlyDatalistPathName = `${DATALIST_USERS}/${dataListUUID}/${tabValue}`;
        }
        history.push(getRouteLink(readonlyDatalistPathName));
    };
    useClickOutsideDetector(dropdownRef, () => setShowMore(false), []);

    // Header Tabs
    const headerTabs = (
        <Tab
            options={DATALIST_HEADER_TAB}
            selectedTabIndex={selectedTabIndex}
            variation={ETabVariation.primary}
            bottomSelectionClass={style.ActiveBar}
            textClass={cx(gClasses.FontWeight500, gClasses.FTwo13BlackV20, gClasses.MB8)}
            onClick={onTabChangeHandler}
            //   className={styles.Tab}
            colorScheme={colorSchemeDefault}
            className={style.TabContainer}
            tabContainerClass={gClasses.gap24}
        />
    );
    const oncloseShowOptions = () => {
        setShowOptions(0);
    };

    const onDiscardDelete = (isDraft = false) => {
        if (isDraft) {
            setToggleValue(PUBLISHED);
            onToggle(PUBLISHED);
        } else {
            routeNavigate(history, ROUTE_METHOD.PUSH, `${LIST_DATA_LIST}${DATALIST_OVERVIEW}`);
        }
    };

    const onEditClick = () => {
        const routeObj = {
            pathname: getRouteLink(`${EDIT_DATA_LIST}`, history),
            state: { data_list_uuid: dataListUUID },
        };
        history.push(routeObj);
    };

    const headerPopperOptions = (option) => {
        switch (option) {
            case 1: return <DiscardDraftDataLists onClose={oncloseShowOptions} dataListID={id} onDiscard={onDiscardDelete} />;
            case 2: return <DeleteDatalist onClose={oncloseShowOptions} dataListUUID={dataListUUID} onDelete={onDiscardDelete} />;
            default: return null;
        }
    };

    return (
        <div className={cx(style.HeaderContainer, gClasses.PositionRelative, gClasses.ZIndex1)}>
            {headerPopperOptions(showOptions)}
            {!isUserDatalist && (
            <Breadcrumb
                list={datalistBreadCrumb(history, t, dataListName)}
                isLoading={isBasicInfoLoading}
                className={gClasses.PY8}
            />)}
            <div className={cx(gClasses.CenterV, { [gClasses.PT12]: isUserDatalist }, gClasses.PB12, gClasses.FlexJustifyBetween)}>
                <div className={gClasses.CenterV}>
                    <Thumbnail
                        showIcon
                        icon={<DatalistStackIcon />}
                        backgroundColor={`${colorSchemeDefault?.activeColor}20`}
                        className={cx(style.DlThumbnail, gClasses.MR16)}
                    />
                    <Title content={dataListName} className={gClasses.FTwo18GrayV3} size={ETitleSize.small} isDataLoading={isBasicInfoLoading} />
                    <DraftPublishedIndicator className={gClasses.ML16} metaData={landingPageData} />
                    {/* Datalist name to be given from API */}
                </div>
                <div className={cx(gClasses.CenterV)}>
                    <div className={gClasses.CenterV}>
                        <Text
                            className={cx(style.Showing, gClasses.MR8)}
                            size={ETextSize.XS}
                            content={SHOWING}
                        />
                        <SingleDropdown
                            optionList={[{ value: DRAFT, label: DRAFT_LABEL }, { value: PUBLISHED, label: PUBLISHED_LABEL }]}
                            dropdownViewProps={{
                                disabled: !hasDraft,
                            }}
                            selectedValue={toggleValue}
                            onClick={(value) => { setToggleValue(value); onToggle(value); }}
                        />
                        <Button buttonText={EDIT} className={style.EditButton} type={EButtonType.SECONDARY} icon={<EditDatalistIcon />} onClickHandler={onEditClick} />
                    </div>
                    {(!isEmpty(kebabMenuOptions)) &&
                    <div ref={dropdownRef}>
                    <button ref={optionRef} onClick={() => setShowMore(!showMore)}>
                        <ThreeDotsIcon />
                    </button>
                    <Popper
                        targetRef={optionRef}
                        open={showMore}
                        placement={EPopperPlacements.BOTTOM_START}
                        style={{ zIndex: 10 }}
                        content={
                            <DropdownList
                                optionList={kebabMenuOptions}
                                onClick={(value) => {
                                    setShowOptions(value);
                                    setShowMore(false);
                                }}
                            />
                        }
                    />
                    </div>}
                </div>
            </div>
            <div className={cx(gClasses.CenterV)}>
                {headerTabs}
            </div>
        </div>
    );
}

export default DatalistHeader;

DatalistHeader.propTypes = {
    currentTab: PropTypes.string,
    onTabChange: PropTypes.func,
    landingPageData: PropTypes.object,
};
