import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../../AppBuilder.module.scss';
import style from '../AppBuilderTab.module.scss';
import { BS, DEFAULT_COLORS_CONSTANTS } from '../../../../../utils/UIConstants';
import TriangleDownIcon from '../../../../../assets/icons/app_builder_icons/TriangleDown';
import RightDirArrowIcon from '../../../../../assets/icons/app_builder_icons/RightDirArrow';
import { keydownOrKeypessEnterHandle } from '../../../../../utils/UtilityFunctions';
import LeftDirArrowIcon from '../../../../../assets/icons/app_builder_icons/LeftDirArrow';
import PlusTabIcon from '../../../../../assets/icons/app_builder_icons/PlusTabIcon';

function AppTabCarousel(props) {
    const {
        currentPage,
        tabData,
        onTabChange,
        current_page_id,
        totalPagesCount,
        onOptionsClick,
        addTabClick,
        nextSlide,
        prevSlide,
        currentIndex,
        tabContainerRef,
        containerRef,
    } = props;

    return (
        <div className={gClasses.CenterV}>
            <div className={cx(gClasses.CenterVH, style.IconContainer)}>
                {currentPage !== 1 && (
                    <LeftDirArrowIcon className={cx(gClasses.CursorPointer, styles.IconsStrokeHover, gClasses.ML2)} onClick={prevSlide} />)
                }
            </div>
            <div className={style.Carousel} ref={tabContainerRef}>
                <div ref={containerRef} className={cx(style.CarouselInner, BS.D_FLEX)} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {tabData?.map((tab) => (
                        <div
                            id={`tab${tab.value}`}
                            className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, BS.TEXT_CENTER, style.CarouselItem)}
                            key={tab.value}
                            tabIndex="0"
                            role="button"
                            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onTabChange(tab)}
                            onClick={() => onTabChange(tab)}
                        >
                            <div
                                className={cx(BS.P_RELATIVE, gClasses.WidthMaxContent)}
                            >
                                <Text title={tab.labelText} content={tab.labelText} className={cx(tab.value === current_page_id ? style.SelectedColor : style.UnselectedColor, gClasses.FontWeight400, gClasses.FTwo13, styles.MaxWidth120, gClasses.Ellipsis, tab.error && gClasses.red22Imp)} />
                                {tab.value === current_page_id && (
                                    <div
                                        className={cx(BS.ABSOLUTE, BS.W100, gClasses.Height4, tab.isEditable ? style.InputBottom : style.BM15)}
                                        style={{ background: DEFAULT_COLORS_CONSTANTS.BLUE_V39 }}
                                    />
                                )}
                            </div>
                            <TriangleDownIcon className={cx(gClasses.ML4, gClasses.CursorPointer, styles.IconsFillHover)} onClick={() => onOptionsClick(`tab${tab.value}`, tab.value)} />
                        </div>
                    ))}
                    {((tabData.length || 0) < 10) && (<div className={cx(gClasses.CenterVH, style.IconContainer)}><PlusTabIcon className={cx(gClasses.CursorPointer)} onClick={() => addTabClick()} /></div>)}
                </div>
            </div>
            <div className={cx(gClasses.CenterVH, style.IconContainer, gClasses.MLA)}>
                {currentPage !== totalPagesCount() && <RightDirArrowIcon className={cx(gClasses.CursorPointer, gClasses.MR2, styles.IconsStrokeHover)} onClick={nextSlide} />}
            </div>
        </div>
    );
}

export default AppTabCarousel;
