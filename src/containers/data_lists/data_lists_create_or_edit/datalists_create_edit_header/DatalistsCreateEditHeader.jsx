import React, { useRef, useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import {
    Button,
    Text,
    EButtonType,
    EButtonSizeType,
    DropdownList,
    EPopperPlacements,
    Popper,
    Tab,
    ETabVariation,
    ETextSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styles from '../DatalistsCreateEdit.module.scss';
import ThreeDotsIcon from '../../../../assets/icons/datalists/ThreeDots';
import { DATALISTS_CREATE_EDIT_CONSTANTS } from '../DatalistsCreateEdit.constant';
import StepperSeparatorIcon from '../../../../assets/icons/datalists/stepper/StepperSeparatorIcon';
import DiscardDraftDataLists from '../../data_list_landing/discard_draft_datalists/DiscardDraftDataLists';
import DeleteDatalist from '../../data_list_landing/delete_datalists/DeleteDataLists';
import DatalistEditBasicDetails from '../../data_list_landing/datalist_header/edit_datalist/DatalistEditBasicDetails';
import { truncateWithEllipsis, useClickOutsideDetector } from '../../../../utils/UtilityFunctions';

function DatalistsCreateEditHeader(props) {
    const {
        version,
        basicDetails,
        onSaveBasicDetails,
        errorList,
        onTabChangeHandler,
        currentTab,
        onSaveAndClose,
        onPublish,
        dataListID,
        dataListUUID,
        onDiscardDelete,
        errorTabs,
        getTabWiseValidation,
        isUsersDataList,
    } = props;
    const optionRef = useRef(null);
    const popperRef = useRef(null);
    const [showMore, setShowMore] = useState(false);
    const [showOptions, setShowOptions] = useState(0);
    const { t } = useTranslation();
    const {
        TAB_STEPPER,
        HEADER: {
            EDIT_DATALIST,
            SAVE_CLOSE,
            PUBLISH,
        },
        HEADER_POPPER_OPTIONS,
    } = DATALISTS_CREATE_EDIT_CONSTANTS(t);
    const oncloseShowOptions = () => {
        setShowOptions(0);
    };

    useClickOutsideDetector(popperRef, () => setShowMore(false));

    const headerPopperOptions = (option) => {
        switch (option) {
            case 1: return <DatalistEditBasicDetails basicDetails={basicDetails} errorList={errorList?.basicDetailsError} onClose={oncloseShowOptions} onSaveBasicDetails={onSaveBasicDetails} getTabWiseValidation={getTabWiseValidation} />;
            case 2: return <DiscardDraftDataLists onClose={oncloseShowOptions} dataListID={dataListID} onDiscard={onDiscardDelete} />;
            case 3: return <DeleteDatalist onClose={oncloseShowOptions} dataListUUID={dataListUUID} onDelete={onDiscardDelete} />;
            default: return null;
        }
    };

    return (
        <div className={cx(styles.HeaderContainer, gClasses.CenterV, gClasses.PX16, gClasses.JusSpaceBtw)}>
            {headerPopperOptions(showOptions)}
            <div>
                <Text content={EDIT_DATALIST} className={gClasses.FTwo12GrayV101} />
                <Text content={truncateWithEllipsis(basicDetails?.dataListName, 25)} className={cx(gClasses.MT4, gClasses.FTwo13GrayV90, gClasses.FontWeight500, styles.DatalistName)} title={basicDetails?.dataListName} />
            </div>
            <Tab
                options={TAB_STEPPER(errorTabs)}
                selectedTabIndex={currentTab}
                variation={ETabVariation.progress}
                tabSizeVariation={ETextSize.XS}
                SeparatorIcon={StepperSeparatorIcon}
                tabDisplayCount={6}
                onClick={(tab) => onTabChangeHandler(tab)}
            />
            <div className={gClasses.CenterV}>
                <Button buttonText={SAVE_CLOSE} className={cx(gClasses.MR16, gClasses.P0)} type={EButtonType.TERTIARY} size={EButtonSizeType.SM} onClickHandler={onSaveAndClose} />
                <Button buttonText={PUBLISH} className={gClasses.MR8} type={EButtonType.PRIMARY} size={EButtonSizeType.SM} onClickHandler={onPublish} />
                <button ref={optionRef} onClick={() => setShowMore(!showMore)}>
                    <ThreeDotsIcon />
                </button>
                <div ref={popperRef}>
                    <Popper
                        targetRef={optionRef}
                        open={showMore}
                        placement={EPopperPlacements.BOTTOM_START}
                        content={
                            <DropdownList
                                optionList={HEADER_POPPER_OPTIONS(version, isUsersDataList)}
                                onClick={(value) => {
                                    setShowMore(false);
                                    setShowOptions(value);
                                }}
                            />
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default DatalistsCreateEditHeader;

DatalistsCreateEditHeader.propTypes = {
    version: PropTypes.string,
    basicDetails: PropTypes.object,
    onSaveBasicDetails: PropTypes.func,
    errorList: PropTypes.object,
    onTabChangeHandler: PropTypes.func,
    currentTab: PropTypes.number,
    onSaveAndClose: PropTypes.func,
    onPublish: PropTypes.func,
    dataListID: PropTypes.string,
    dataListUUID: PropTypes.string,
    onDiscardDelete: PropTypes.func,
    errorTabs: PropTypes.array,
    getTabWiseValidation: PropTypes.func,
};
