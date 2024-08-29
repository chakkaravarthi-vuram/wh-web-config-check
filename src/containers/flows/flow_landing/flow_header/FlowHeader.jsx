import React, { useContext, useMemo, useRef, useState } from 'react';
import { Breadcrumb, ETitleSize, Tab, Thumbnail, Title, ETabVariation, Button, EButtonType, ETextSize, Popper, DropdownList, EPopperPlacements, Text, SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { FLOW_CONSTANTS, flowBreadCrumb } from '../FlowLanding.constant';
import style from './FlowHeader.module.scss';
import ThreeDotsIcon from '../../../../assets/icons/datalists/ThreeDots';
import ThemeContext from '../../../../hoc/ThemeContext';
import EditDatalistIcon from '../../../../assets/icons/datalists/EditDatalistIcon';
import DiscardDraftFlows from '../discard_draft_flows/DiscardDraftFlows';
import FlowStackIcon from '../../../../assets/icons/apps/FlowStackIcon';
import { getRouteLink, routeNavigate, useClickOutsideDetector } from '../../../../utils/UtilityFunctions';
import { ALL_PUBLISHED_FLOWS, EDIT_FLOW, FLOW_DASHBOARD, LIST_FLOW } from '../../../../urls/RouteConstants';
import DeleteFlow from '../flow_delete/FlowDelete';
import DraftPublishedIndicator from '../../../../components/draft_published_indicator/DraftPublishedIndicator';
import { ROUTE_METHOD } from '../../../../utils/Constants';

function FlowHeader(props) {
    const {
        currentTab,
        onToggle,
        isLoading,
        flowData,
        metaData,
    } = props;

    const { t } = useTranslation();
    const { FLOW_HEADER_TAB, EDIT, DRAFT, DRAFT_LABEL, PUBLISHED, PUBLISHED_LABEL, HEADER_OPTIONS, SHOWING } = FLOW_CONSTANTS(t);

    const history = useHistory();
    const [toggleValue, setToggleValue] = useState(PUBLISHED);
    const [showMore, setShowMore] = useState(false);
    const [showOptions, setShowOptions] = useState(0);
    const optionRef = useRef(null);
    const dropdownRef = useRef();
    const { colorScheme } = useContext(ThemeContext);
    const { colorSchemeDefault } = useContext(ThemeContext);
    const selectedTabIndex = useMemo(
      () => FLOW_HEADER_TAB.find((f) => f.value === currentTab)?.tabIndex,
      [currentTab],
    );

    useClickOutsideDetector(dropdownRef, () => setShowMore(false), []);

    const toggleOptions = [{ value: DRAFT, label: DRAFT_LABEL }, { value: PUBLISHED, label: PUBLISHED_LABEL }];
    const dropdownOptions = HEADER_OPTIONS(flowData?.hasDraft && flowData?.status === DRAFT);

    const onTabChange = (tabValue) => {
        history.push(getRouteLink(`${FLOW_DASHBOARD}/${metaData.flowUUID}/${tabValue}`));
    };

    // Header Tabs
    const headerTabs = (
        <Tab
            options={FLOW_HEADER_TAB}
            selectedTabIndex={selectedTabIndex}
            variation={ETabVariation.primary}
            bottomSelectionClass={gClasses.ActiveBar}
            textClass={cx(gClasses.FontWeight500, gClasses.FTwo13BlackV20, gClasses.MB8)}
            onClick={onTabChange}
            //   className={styles.Tab}
            colorScheme={colorSchemeDefault}
            className={style.TabContainer}
            tabContainerClass={gClasses.gap24}
        />
    );

    const oncloseShowOptions = () => {
        setShowOptions(0);
    };

    const onEditClick = () => {
        const routeObj = {
            pathname: getRouteLink(`${EDIT_FLOW}`, history),
            state: { flow_uuid: metaData.flowUUID },
        };
        history.push(routeObj);
    };

    const onDiscardDelete = (isDraft = false) => {
        if (isDraft) {
            setToggleValue(PUBLISHED);
            onToggle(PUBLISHED);
        } else {
            routeNavigate(history, ROUTE_METHOD.PUSH, `${LIST_FLOW}${ALL_PUBLISHED_FLOWS}`);
        }
    };

    return (
        <div className={cx(style.HeaderContainer, gClasses.PositionRelative, gClasses.ZIndex1)}>
            <Breadcrumb
                list={flowBreadCrumb(history, t, flowData.flowName)}
                isLoading={isLoading}
                className={gClasses.PY8}
            />
            {showOptions === 1 && <DiscardDraftFlows onClose={oncloseShowOptions} metaData={metaData} onDiscard={onDiscardDelete} />}
            {showOptions === 2 && <DeleteFlow onClose={oncloseShowOptions} metaData={metaData} onDelete={onDiscardDelete} />}
            <div className={cx(gClasses.CenterV, gClasses.PB12, gClasses.FlexJustifyBetween)}>
                <div className={gClasses.CenterV}>
                    <Thumbnail
                        showIcon
                        icon={<FlowStackIcon />}
                        backgroundColor={`${colorSchemeDefault?.activeColor}20`}
                        className={cx(style.DlThumbnail, gClasses.MR16)}
                    />
                    <Title content={flowData.flowName} className={gClasses.FTwo18GrayV3} size={ETitleSize.small} isDataLoading={isLoading} />
                    <DraftPublishedIndicator className={gClasses.ML16} metaData={flowData} />
                </div>
                <div className={cx(gClasses.CenterV)}>
                    <div className={cx(gClasses.CenterV, gClasses.MR8)}>
                        <Text
                            className={cx(style.Showing, gClasses.MR8)}
                            size={ETextSize.XS}
                            content={SHOWING}
                        />
                        <SingleDropdown
                            optionList={toggleOptions}
                            dropdownViewProps={{
                                disabled: !flowData.hasDraft,
                            }}
                            selectedValue={toggleValue}
                            onClick={(value) => { setToggleValue(value); onToggle(value); }}
                        />
                        <Button buttonText={EDIT} className={style.EditButton} type={EButtonType.SECONDARY} icon={<EditDatalistIcon />} onClickHandler={onEditClick} />
                    </div>
                    <div ref={dropdownRef}>
                        <button ref={optionRef} onClick={() => setShowMore(true)}>
                            <ThreeDotsIcon />
                        </button>
                        <Popper
                            targetRef={optionRef}
                            open={showMore}
                            placement={EPopperPlacements.BOTTOM_START}
                            className={gClasses.ZIndex1}
                            content={
                                <DropdownList
                                    optionList={dropdownOptions}
                                    onClick={(value) => {
                                        console.log('xyz value', value);
                                        setShowOptions(value);
                                        setShowMore(false);
                                    }}
                                    colorScheme={colorScheme}
                                />
                            }
                        />
                    </div>
                </div>
            </div>
            <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw)}>
                {headerTabs}
            </div>
        </div>
    );
}

export default FlowHeader;

FlowHeader.propTypes = {
    currentTab: PropTypes.number,
    onTabChange: PropTypes.func,
    landingPageData: PropTypes.object,
};
