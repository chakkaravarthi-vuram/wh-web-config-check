import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { Carousel } from 'react-responsive-carousel';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import { FADE } from 'utils/Constants';
import WelcomeInsights from '../welcome_insights/WelcomeInsights';
import NoticeBoard from '../notice_board/NoticeBoard';
import styles from './CarouselSlider.module.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import COMMON_WELCOME_STRINGS from './CarouselSlider.strings';

function CarouselSlider(props) {
    const { showCover, onCloseClick, isWelcomeInsightsLoading } = props;
    const items = [
        {
            caption1: COMMON_WELCOME_STRINGS.WELCOME_INSIGHTS,
            src: <WelcomeInsights />,
        },
        {
            caption2: COMMON_WELCOME_STRINGS.NOTICE_BOARD,
            src: <NoticeBoard showCover={showCover} onCloseClick={onCloseClick} />,
        },
    ];

    const carouselItemData = items.map((item) => (
        <div aria-roledescription={ARIA_ROLES.SLIDE} className={BS.TEXT_LEFT}>
          <div>{item.src}</div>
        </div>
  ));

    return (
        <div className={cx(styles.CarouselContainer, gClasses.MB16)}>
            <Carousel
                showArrows={false}
                showStatus={false}
                infiniteLoop
                autoPlay={!isWelcomeInsightsLoading}
                animationHandler={FADE}
                interval={5000}
                renderIndicator={(onClickHandler, isSelected, index, label) => {
                    const defStyle = { cursor: 'pointer', display: 'inline-flex' };
                    const style = isSelected
                    ? { ...defStyle, backgroundColor: 'linear-gradient(45deg, #72be44 0%, #00a0fd)' }
                    : { ...defStyle };
                    return (
                    <li
                    style={style}
                    key={index}
                    value={index}
                    >
                    <div
                        aria-label={`${label} ${index + 1}, ${items[index].caption1} ${items[index].caption2}`}
                        onClick={onClickHandler}
                        onKeyDown={onClickHandler}
                        role="button"
                        tabIndex={0}
                    >
                        <div
                        className={cx(styles.OvalCopy, isSelected && styles.SelectedSlide)}
                        />
                    </div>
                    </li>
                    );
                }}
            >
                {carouselItemData}
            </Carousel>
        </div>
    );
}

export default CarouselSlider;
