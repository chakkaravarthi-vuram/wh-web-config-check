/* eslint-disable import/no-named-as-default */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import Thumbnail from 'components/thumbnail/Thumbnail';
import { getInitials } from 'utils/generatorUtils';
import PICKER_STRINGS from 'components/form_components/gradient_picker/GradientPicker.strings';
import { nullCheck } from 'utils/jsUtility';
import { BeatLoader } from 'react-spinners';
import UserImage from 'components/user_image/UserImage';
import { SEARCH_CONSTANTS } from 'utils/Constants';
import SEARCH_STRINGS from 'containers/multi_category_search/MultiCategorySearch.strings';
import { FORM_PARENT_MODULE_TYPES } from 'utils/constants/form.constant';
import { useTranslation } from 'react-i18next';
import styles from './SearchResults.module.scss';

function SearchResults(props) {
    const {
        results,
        isMobileView,
        showMoreHandler,
        isSearchLoading,
        isPopper,
        // onSearchResultClick,
        onRedirectClickHandler,
        currentIndex,
        customContainerClass,
    } = props;
    const currentItemRef = useRef();
    const { t } = useTranslation();

    useEffect(() => {
        if (currentItemRef.current) {
            currentItemRef.current?.scrollIntoView({
                behaviour: 'smooth',
                block: 'center',
            });
        }
    }, [currentIndex]);

    const colorCodeStyle = (flow_color) => {
        const dataListColor = nullCheck(flow_color, 'hex_codes.0')
            ? flow_color
            : PICKER_STRINGS.COLOR_LIST[0];
        return {
            background: `linear-gradient(${dataListColor.degree}deg, ${dataListColor.hex_codes[0]}, ${dataListColor.hex_codes[1]})`,
        };
    };

    const getImageThumbnail = (type, data) => {
        switch (type) {
            case SEARCH_CONSTANTS.ALLOW_TASK_ONLY:
                return (
                    <Thumbnail
                        title={data.name}
                        containerClassName={cx(styles.Thumbnail, gClasses.MR5)}
                        textClassName={styles.ThumbnailText}
                        isIconThumbnail
                        type={FORM_PARENT_MODULE_TYPES.TASK}
                    />
                );
            case SEARCH_CONSTANTS.ALLOW_FLOW_ONLY:
                return (
                    <Thumbnail
                        ariaHidden="true"
                        type={FORM_PARENT_MODULE_TYPES.FLOW}
                        containerClassName={cx(styles.Thumbnail, gClasses.MR5)}
                        thumbNailIconClass={styles.ThumbnailIcon}
                        isIconThumbnail
                    />
                );
            case SEARCH_CONSTANTS.ALLOW_DATALIST_ONLY:
                return (
                    <Thumbnail
                        ariaHidden="true"
                        type={FORM_PARENT_MODULE_TYPES.DATA_LIST}
                        containerClassName={cx(styles.Thumbnail, gClasses.MR5)}
                        thumbNailIconClass={styles.ThumbnailIcon}
                        isIconThumbnail
                    />
                );
            case SEARCH_CONSTANTS.ALLOW_USER_ONLY:
                return (
                    <UserImage
                        firstName={data.firstName}
                        lastName={data.lastName}
                        // src={src}
                        ariaHidden="true"
                        className={cx(
                            styles.UserImageContain,
                            gClasses.CenterVH,
                            gClasses.CursorPointer,
                            gClasses.MR5,
                            gClasses.MB2,
                        )}
                    />
                );
            case SEARCH_CONSTANTS.ALLOW_TEAM_ONLY:
                return (
                    <Thumbnail
                        ariaHidden="true"
                        type={FORM_PARENT_MODULE_TYPES.TEAM}
                        containerClassName={cx(styles.Thumbnail, gClasses.MR5)}
                        thumbNailIconClass={styles.ThumbnailIcon}
                        isIconThumbnail
                    />
                );
            default:
                return (
                    <div
                        className={cx(
                            styles.initialsShow,
                            gClasses.CenterVH,
                            gClasses.CursorPointer,
                            gClasses.MR5,
                            gClasses.MB2,
                        )}
                        style={{
                            ...colorCodeStyle(data.color),
                        }}
                        aria-hidden="true"
                    >
                        <div
                            className={cx(
                                styles.FlowCardText,
                                gClasses.FTwo10White,
                                gClasses.FontWeight400,
                            )}
                        >
                            {getInitials(data.code)}
                        </div>
                    </div>
                );
        }
    };

    const searchResultListComponent = results.map((result) => {
        const showMore = result.list?.length < result.count;
        return (
            <div className={cx(gClasses.MB10)} key={t(result.title)}>
                <div className={cx(gClasses.FTwo12GrayV86, gClasses.FontWeight500)}>
                    {t(result.title)}
                    {!isSearchLoading && result.count !== undefined && `(${result.count})`}
                    {!isSearchLoading && result.count === undefined && '(0)'}
                </div>
                {
                    isSearchLoading ?
                        (
                            <div className={gClasses.CenterH}>
                                <BeatLoader size={7} color="#1f243d" loading />
                            </div>
                        ) :
                        (
                            <>
                                <ul className={styles.SearchContainer}>
                                    {
                                        result.list && result.list.map((data, index) => (
                                            <li key={index} className={currentIndex === data.index && styles.currentIndex} ref={currentIndex === data.index ? currentItemRef : null}>
                                                <div className={cx(styles.SearchList, gClasses.CursorPointer, gClasses.CenterV, gClasses.Ellipsis)} onClick={() => onRedirectClickHandler(result.type, data.uuid, data.name, data.id, data?.isPrivateTeam)}>
                                                    {getImageThumbnail(result.type, data)}
                                                    <div className={cx(gClasses.Ellipsis, styles.currentIndexText, gClasses.FTwo13GrayV3)}>{data.name}</div>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                                {
                                    result.isLoading ? (
                                        <BeatLoader size={7} color="#1f243d" loading />
                                    ) : (
                                        !isSearchLoading && showMore && (
                                            <div
                                                className={cx(styles.ShowMore, gClasses.CursorPointer)}
                                                onClick={() => showMoreHandler(result.type, result.list?.length, result.count)}
                                            >
                                                {t(SEARCH_STRINGS.SHOW_MORE)}
                                            </div>
                                        )
                                    )
                                }
                            </>

                        )
                }
            </div>
        );
    });
    return (
        <div className={cx(styles.SearchMainContainer, isMobileView && styles.MobileView, isPopper ? styles.SearchPopper : styles.SearchPopperAndModal, customContainerClass)}>
            {searchResultListComponent}
        </div>

    );
}

export default SearchResults;
