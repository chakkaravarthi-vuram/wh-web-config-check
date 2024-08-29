/**
 * @author Asttle
 * @email asttlej@vuram.com
 * @create date 2019-11-20 09:24:15
 * @modify date 2019-11-20 09:24:15
 * @desc [description]
 */
import React from 'react';
import cx from 'classnames/bind';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col, Container } from 'reactstrap';
import OnethingLogoSmall from 'assets/icons/OneThingLogoSmall';
import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import { BS } from '../../utils/UIConstants';
import { get, getDomainName, isIpAddress } from '../../utils/jsUtility';
import gClasses from '../../scss/Typography.module.scss';
import OnethingLogo from '../../assets/icons/OnethingLogo';
import styles from './Home.module.scss';
import { HOME_LABELS } from './Home.strings';
import LogoSmallV2 from '../../assets/icons/LogoSmallV2';
import { routeNavigate } from '../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../utils/Constants';

function Home(props) {
  const { history } = props;
  return (
    <>
        <nav
          className={cx(
            styles.Header,
            BS.D_FLEX,
            BS.JC_BETWEEN,
            BS.ALIGN_ITEM_CENTER,
          )}
        >
          <Link to={ROUTE_CONSTANTS.HOME}>
            <OnethingLogo className={cx(gClasses.CursorPointer, styles.Logo)} />
            <OnethingLogoSmall
              className={cx(gClasses.CursorPointer, styles.SmallLogo)}
              isBlack
            />
          </Link>
          <ul className={cx(styles.NavList, gClasses.CenterV)}>
            <Link
              to={ROUTE_CONSTANTS.SIGNIN}
              className={cx(
                gClasses.OutlineSecondary,
                gClasses.FTwo13BlueV2,
                gClasses.CursorPointer,
                gClasses.FontWeight600,
                gClasses.CenterV,
                styles.Button,
              )}
              id={HOME_LABELS.SIGN_IN.ID}
              onClick={(e) => {
                e.preventDefault();
                let nextUrl = '';
                if (
                  get(history, ['location', 'pathname']) !==
                  ROUTE_CONSTANTS.HOME
                ) {
                  nextUrl = `?${new URLSearchParams({
                    nextUrl: get(history, ['location', 'pathname']),
                  })}`;
                }
                if (
                  !isIpAddress(window.location.hostname) &&
                  window.location.hostname.split('.').length > 2 &&
                  getDomainName(window.location.hostname).split('.')[0] !==
                    'xip'
                ) {
                  window.location = `${
                    window.location.protocol
                  }//${getDomainName(window.location.host)}${
                    ROUTE_CONSTANTS.SIGNIN
                  }${nextUrl}`;
                  return;
                }
                routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNIN, nextUrl, null, true);
              }}
            >
              {HOME_LABELS.SIGN_IN.LABEL}
            </Link>
              {/* <Link
                to={ROUTE_CONSTANTS.SIGNUP_CREATE}
                className={cx(
                  gClasses.OutlineSecondary,
                  gClasses.FTwo13BlueV2,
                  gClasses.CursorPointer,
                  gClasses.FontWeight600,
                  gClasses.CenterV,
                  styles.Button,
                )}
                id={HOME_LABELS.SIGN_UP.ID}
              >
                {HOME_LABELS.SIGN_UP.LABEL}
              </Link> */}
          </ul>
        </nav>
        <Container fluid className={cx(styles.Container, gClasses.CenterVH)}>
          <Row
            className={cx(styles.InnerContainer, BS.JC_BETWEEN, gClasses.MX0)}
          >
            <Col
              className={cx(gClasses.CenterV, styles.LeftContainer)}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={6}
            >
              <div>
                <div className={gClasses.HomePageTitleV1}>
                  {HOME_LABELS.LABEL1}
                </div>
                <div className={gClasses.HomePageTitleV2}>
                  {HOME_LABELS.LABEL2}
                </div>
                <div
                  className={cx(
                    gClasses.HomePageSubtitle,
                    gClasses.MT20,
                    gClasses.OnlyShowInDesktop,
                  )}
                >
                  {HOME_LABELS.LABEL3}
                </div>
                <div
                  className={cx(
                    gClasses.HomePageSubtitle,
                    gClasses.MT3,
                    gClasses.OnlyShowInDesktop,
                  )}
                >
                  {HOME_LABELS.LABEL4}
                </div>
                <div
                  className={cx(
                    gClasses.HomePageSubtitle,
                    gClasses.MT3,
                    gClasses.OnlyShowInMobile,
                  )}
                >
                  {HOME_LABELS.LABEL5}
                </div>
              </div>
            </Col>
            <Col
              className={cx(gClasses.CenterH)}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={6}
            >
              <LogoSmallV2 className={styles.BannerImage} />
            </Col>
          </Row>
        </Container>
    </>
  );
}
export default withRouter(Home);
