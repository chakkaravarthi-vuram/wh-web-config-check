import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { useSwipeable } from 'react-swipeable';
import { withRouter } from 'react-router-dom';

import gClasses from '../../scss/Typography.module.scss';
import { BS } from '../../utils/UIConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import styles from './ListAndDetailLayout.module.scss';
import CloseIcon from '../../assets/icons/CloseIcon';
import { isMobileScreen, onWindowResize, onSwipedUpOrDown, routeNavigate } from '../../utils/UtilityFunctions';
import ConditionalWrapper from '../conditional_wrapper/ConditionalWrapper';
import { ROUTE_METHOD } from '../../utils/Constants';

function ListAndDetailLayout(props) {
  const { className, listComponent, detailComponent, showDetails, onCloseClick, hideListComponent, isListFlow } = props;
  const [isMobileScreenView, setMobileScreenView] = useState(isMobileScreen());

  const windowResize = () => {
    setMobileScreenView(isMobileScreen());
  };

  useEffect(() => {
    onWindowResize(windowResize);
    return () => window.removeEventListener('resize', windowResize);
  });

  let containerCompRef = null;
  const containerRef = (element) => {
    containerCompRef = element;
  };

  const onSwiped = (event) => {
    if (containerCompRef) {
      const top = onSwipedUpOrDown(event);
      containerCompRef.style.top = `${top}px`;
    }
  };

  const redirectToPrevLocation = () => {
    const { history } = props;
    routeNavigate(history, ROUTE_METHOD.GO_BACK, null, null, null);
  };

  const onCloseIconClick = () => {
    let doRedirectToPrevLocation = false;
    if (onCloseClick) {
      doRedirectToPrevLocation = onCloseClick();
    } else {
      return redirectToPrevLocation();
    }
    if (doRedirectToPrevLocation) {
      return redirectToPrevLocation();
    }
    return null;
  };

  let detailComponentView = null;
  const containerClass = [];
  let rightContainerWidth;
  if (isListFlow) {
    rightContainerWidth = {
      width: '55vw',
    };
  }
  if (showDetails) {
    detailComponentView = (
      <div
        className={cx(gClasses.RightContainer, hideListComponent && styles.RightContainerWidthWithoutList)}
        style={rightContainerWidth}
      >
        <CloseIcon className={cx(styles.CloseIcon, BS.P_ABSOLUTE, gClasses.WH16)} onClick={onCloseIconClick} isButtonColor />
        {detailComponent}
      </div>
    );
    containerClass.push(gClasses.ShowDetailsLCContainer);
  }

  const handlers = useSwipeable({
    onSwipedUp: (event) => onSwiped(event),
    onSwipedDown: (event) => onSwiped(event),
    onSwiping: (event) => onSwiped(event),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <div
      className={cx(gClasses.LCContainer, className, BS.H100, containerClass, {
        // [gClasses.ZIndex6]: !isHomeLayout,
      })}
      ref={containerRef}
    >
      {!hideListComponent && (
        <div className={gClasses.LeftContainer}>
          <ConditionalWrapper
            condition={isMobileScreenView}
            wrapper={(children) => (
              <div style={{ width: '400px', height: '30px', cursor: 'pointer', display: 'none' }} {...handlers}>
                <div className={cx(styles.SwipeIndicatorContainer, BS.W100, BS.P_ABSOLUTE)}>
                  {children}
                </div>
              </div>
            )}
          >
            <div className={cx(gClasses.SwipeIndicatorBar, gClasses.SwipeIndicatorBarPosition)} />
          </ConditionalWrapper>
          {listComponent}
        </div>
      )}

      {detailComponentView}
    </div>
  );
}
export default withRouter(ListAndDetailLayout);
ListAndDetailLayout.defaultProps = {
  className: EMPTY_STRING,
  listComponent: null,
  detailComponent: null,
  showDetails: false,
  isHomeLayout: false,
};
ListAndDetailLayout.propTypes = {
  className: PropTypes.string,
  listComponent: PropTypes.node,
  detailComponent: PropTypes.node,
  showDetails: PropTypes.bool,
  isHomeLayout: PropTypes.bool,
};
