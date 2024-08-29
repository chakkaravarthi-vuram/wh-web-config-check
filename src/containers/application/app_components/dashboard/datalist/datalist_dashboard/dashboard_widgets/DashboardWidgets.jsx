import React, { useState } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BorderRadiusVariant, EInputIconPlacement, Input, Size, Variant } from '@workhall-pvt-lmt/wh-ui-library';
import Skeleton from 'react-loading-skeleton';
import DownloadDashboardIcon from '../../../../../../../assets/icons/dashboards/DownloadDashboardIcon';
import RefreshDashboardIcon from '../../../../../../../assets/icons/dashboards/RefreshDashboardIcon';
import SearchDashboardIcon from '../../../../../../../assets/icons/dashboards/SearchDashboardIcon';
import jsUtility from '../../../../../../../utils/jsUtility';
import Filter from '../../../../../../../components/dashboard_filter/Filter';
import { keydownOrKeypessEnterHandle } from '../../../../../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';
import { ARIA_ROLES } from '../../../../../../../utils/UIConstants';
import { ARIA_LABEL } from '../../../../../../search_tab/SearchTab.utils';
import styles from './DashboardWidgets.module.scss';
import CloseIcon from '../../../../../../../assets/icons/CloseIcon';

function DashboardWidgets(props) {
    const {
        filter,
        onSetFilter,
        onGetReportFilter,
        onRefresh,
        showDownload,
        onClickOpenOrCloseDownload,
        onChange,
        placeholderText,
        searchText,
        isLoading,
        isFlow,
        componentDimensions,
    } = props;
    const [showSearchInput, setShowSearchInput] = useState(false);

    const onChangeHandler = (e) => {
        const { value } = e.target;
        onChange(value);
    };

    return (
        <div className={cx(gClasses.CenterV, styles.DataListDashboardActions)}>
            <SearchDashboardIcon className={gClasses.CursorPointer} onClick={() => setShowSearchInput(!showSearchInput)} />
            {(componentDimensions?.w > 2 || showSearchInput) && (
                <Input
                    content={searchText || EMPTY_STRING}
                    onChange={onChangeHandler}
                    variant={Variant.borderLess}
                    iconPosition={EInputIconPlacement.left}
                    className={cx(styles.SearchInputContainer, gClasses.MR12, gClasses.ML10, componentDimensions?.w === 2 && styles.SearchWidth)}
                    placeholder={placeholderText}
                    onBlurHandler={() => jsUtility.isEmpty(searchText) && setShowSearchInput(false)}
                    suffixIcon={
                        !jsUtility.isEmpty(searchText) && (
                            <CloseIcon
                                ariaLabel={ARIA_LABEL.CLEAR_SEARCH}
                                tabIndex={0}
                                role={ARIA_ROLES.BUTTON}
                                onKeyDown={(e) =>
                                    keydownOrKeypessEnterHandle(e) && onChange(EMPTY_STRING)
                                }
                                className={cx(styles.CloseIcon, gClasses.CursorPointer)}
                                onClick={() => onChange(EMPTY_STRING)}
                            />
                        )}
                    size={Size.md}
                    borderRadiusType={BorderRadiusVariant.rounded}
                />
            )}
            {!isLoading ? (
                <>
                    {!jsUtility.isEmpty(filter) && (
                        <div className={gClasses.ML16}>
                            <Filter
                                filter={filter}
                                onSetFilterAction={onSetFilter}
                                getReportData={onGetReportFilter}
                                isAppFilter
                            />
                        </div>)}
                    <RefreshDashboardIcon
                        className={cx(gClasses.CursorPointer, gClasses.ML16)}
                        onClick={onRefresh}
                        onkeydown={(e) => keydownOrKeypessEnterHandle(e) && onRefresh()}
                    />
                    {showDownload && (
                        <DownloadDashboardIcon
                            className={cx(gClasses.CursorPointer, gClasses.ML16, gClasses.MR6)}
                            onClick={onClickOpenOrCloseDownload}
                            onkeydown={(e) => keydownOrKeypessEnterHandle(e) && onClickOpenOrCloseDownload()}
                        />
                    )}
                </>
            ) : <Skeleton width={isFlow ? 204 : 230} />}
        </div>
    );
}

export default DashboardWidgets;
