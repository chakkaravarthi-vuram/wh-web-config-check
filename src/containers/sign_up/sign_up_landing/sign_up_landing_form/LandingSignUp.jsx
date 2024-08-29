import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
// import { Carousel, CarouselIndicators, CarouselCaption, CarouselItem, CarouselControl } from 'reactstrap';
import Slider1Icon from 'assets/icons/sign_up/Slider1';
import Slider2Icon from 'assets/icons/sign_up/Slider2';
import Slider3Icon from 'assets/icons/sign_up/Slider3';
import { getDomainName } from 'utils/jsUtility';
import Cookies from 'universal-cookie';
import { PRODUCTION } from 'utils/Constants';
import { Carousel } from 'react-responsive-carousel';
import { getCachedUserDetails } from 'containers/sign_in/SignIn.utils';
import { useTranslation } from 'react-i18next';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';
import SIGN_UP_LANDING_STRINGS from '../SignUpLanding.string';
import Button from '../../../../components/form_components/button/Button';
import { BUTTON_TYPE } from '../../../../utils/Constants';
import styles from '../SignUpLanding.module.scss';
// import CustomLink from '../../../../components/form_components/link/Link';
import { isMobileScreen } from '../../../../utils/UtilityFunctions';
// import * as ROUTE_CONSTANTS from '../../../../urls/RouteConstants';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
// eslint-disable-next-line import/order
import { Link } from 'react-router-dom';

const cookies = new Cookies();

function LandingSignUpForm(props) {
  const { RedirectToSignup } = props;
  const { t } = useTranslation();

  useEffect(() => {
    const userDetails = getCachedUserDetails();
    if (userDetails.buy_now_user) {
      cookies.remove('buy_now_user', {
        path: '/',
        domain: getDomainName(window.location.hostname),
      });
    }
  }, []);

  const BuyNowClick = () => {
    RedirectToSignup();
    if (process.env.NODE_ENV === PRODUCTION) {
      const cookieProps = {
      path: '/',
      domain: getDomainName(window.location.hostname),
    };
    cookies.set('buy_now_user', true, cookieProps);
    }
  };

    const term = (
        <div className={cx(BS.TEXT_CENTER, gClasses.FTwo10, styles.TermsContainer)}>
          <span className={gClasses.FTwo10GrayV2}>
            {t(SIGN_UP_LANDING_STRINGS.TERMS_AND_CONDITION.TEXT)}
          </span>
          {/* Commented since there is no page for Terms and condition for now. */}
          {/* <CustomLink
            className={cx(gClasses.BlueV2, gClasses.CursorDefault)}
            id={SIGN_UP_LANDING_STRINGS.TERMS_AND_CONDITION.LINK1_ID}
          >
            {SIGN_UP_LANDING_STRINGS.TERMS_AND_CONDITION.LINK_1}
          </CustomLink> */}
          {/* <span className={gClasses.FTwo10GrayV2}>{SIGN_UP_LANDING_STRINGS.TERMS_AND_CONDITION.CONJUNCTION}</span> */}
          <Link
            className={cx(gClasses.BlueV39, styles.PrivacyPolicy)}
            id={SIGN_UP_LANDING_STRINGS.TERMS_AND_CONDITION.LINK2_ID}
            target="__blank"
            to="/privacy_policy"
          >
            {t(SIGN_UP_LANDING_STRINGS.TERMS_AND_CONDITION.LINK_2)}
          </Link>
        </div>
      );

      const items = [
        {
            caption1: t(SIGN_UP_LANDING_STRINGS.SLIDER.CAPTION_1),
            caption2: '', // 'Get your Futuristic Virtual Workspace at just ₹1200 or $15 per user.',
            src: <Slider1Icon ariaHidden="true" />,
        },
        {
            caption1: t(SIGN_UP_LANDING_STRINGS.SLIDER.CAPTION_2),
            caption2: '',
            src: <Slider2Icon ariaHidden="true" />,
        },
        {
          caption1: t(SIGN_UP_LANDING_STRINGS.SLIDER.CAPTION_3),
          caption2: '',
          src: <Slider3Icon ariaHidden="true" />,
        },
      ];

    const carouselItemData = items.map((item) => (
          <div className={cx(gClasses.CenterVH, BS.FLEX_COLUMN)} aria-roledescription={ARIA_ROLES.SLIDE}>
            <div>{item.src}</div>
            <div className={styles.Content}>
              <div className={cx(BS.TEXT_CENTER, gClasses.FTwo13GrayV2, gClasses.FontWeight500, gClasses.MT15)}>{item.caption1}</div>
              <div className={cx(BS.TEXT_CENTER, gClasses.FTwo13GrayV2, gClasses.FontWeight500, gClasses.MT5, gClasses.MB20)}>{item.caption2}</div>
            </div>
          </div>
    ));

    return (
        <>
            <h1 className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600)}>
                {t(SIGN_UP_LANDING_STRINGS.TITLE)}
            </h1>
            <div className={cx(gClasses.CenterVH, gClasses.MT30, BS.P_RELATIVE, isMobileScreen() && BS.FLEX_COLUMN, styles.ContainHeight, isMobileScreen() && styles.DisplayInline)}>
                <div className={cx(styles.CarouselContainer, gClasses.MT15, isMobileScreen() && gClasses.MB50)} aria-roledescription={ARIA_ROLES.CAROUSEL}>
                  <Carousel
                  showArrows={false}
                  showStatus={false}
                  infiniteLoop
                  autoPlay
                  interval={7000}
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
                <div className={cx(!isMobileScreen() && styles.Divider)} />
                <div className={cx(gClasses.CenterV, !isMobileScreen() && gClasses.ML50, BS.FLEX_COLUMN)}>
                    <Button buttonType={BUTTON_TYPE.OUTLINE_PRIMARY} className={cx(styles.Button, gClasses.MB15)} onClick={() => RedirectToSignup()}>{t(SIGN_UP_LANDING_STRINGS.BUTTON.FREE_TRIAL)}</Button>
                    <div className={cx(gClasses.FOne13GrayV5, gClasses.FontWeight500, gClasses.MB15)}>{t(SIGN_UP_LANDING_STRINGS.OR)}</div>
                    <Button buttonType={BUTTON_TYPE.PRIMARY} className={cx(gClasses.MB20, styles.Button)} onClick={() => BuyNowClick()}>{t(SIGN_UP_LANDING_STRINGS.BUTTON.BUY_NOW)}</Button>
                    {term}
                </div>
            </div>
        </>
    );
}

export default LandingSignUpForm;
