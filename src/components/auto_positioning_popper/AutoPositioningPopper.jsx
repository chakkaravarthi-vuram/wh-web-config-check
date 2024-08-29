import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { usePopper } from 'react-popper';
import { KEY_CODES, KEY_NAMES } from 'utils/Constants';

import styles_ from './AutoPositioningPopper.module.scss';
import { BS } from '../../utils/UIConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import gClasses from '../../scss/Typography.module.scss';
import { nullCheck } from '../../utils/jsUtility';
import { calculateDynamicHeight } from './AutoPositioningPopper.utils';

export const POPPER_PLACEMENTS = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
  TOP_START: 'top-start',
  TOP_END: 'top-end',
  BOTTOM_START: 'bottom-start',
  BOTTOM_END: 'bottom-end',
  LEFT_START: 'left-start',
  LEFT_END: 'left-end',
  RIGHT_START: 'right-start',
  RIGHT_END: 'right-end',
  AUTO: 'auto',
};

const POPPER_STRATEGIES = {
  ABSOLUTE: 'absolute',
  FIXED: 'fixed',
};
export default function AutoPositioningPopper(props) {
  const {
    children,
    referenceElement,
    placement,
    flipVariations,
    fallbackPlacements,
    allowedAutoPlacements,
    fixedStrategy,
    className,
    onBlur,
    onMouseLeave,
    enableAutoFocus,
    isPopperOpen,
    enableOnBlur,
    style,
    showTooltip,
    topPlacementClasses,
    bottomPlacementClasses,
    rightPlacementClasses,
    topStartPlacementClasses,
    bottomStartPlacementClasses,
    bottomEndPlacementClasses,
    topEndPlacementClasses,
    rightStartPlacementClasses,
    isDynamicHeight,
    minHeight,
    maxHeight,
    onPopperBlur,
    triggerUpdate,
    updateValue,
  } = props;
  const [popperElement, setPopperElement] = useState(null);

  useEffect(() => {
    if (updateValue && popperElement) {
        document.getElementById('popper_button').click();
    }
}, [updateValue]);

  let arrowTopTooltip = null;
  let arrowBottomTooltip = null;

  useEffect(() => {
    if (isPopperOpen && enableAutoFocus) {
      setTimeout(() => {
        popperElement.focus();
      }, 100);
    }
  }, [enableAutoFocus, isPopperOpen, popperElement]);

  // close popper on Esc key
  useEffect(() => {
    const escHandleClose = (e) => {
      if (e.keyCode === KEY_CODES.ESCAPE || e.key === KEY_NAMES.ESCAPE) {
        onBlur && onBlur();
        // referenceElement?.focus({ focusVisible: true });
      }
    };

    if (onBlur) {
      document.addEventListener('keydown', escHandleClose);
    }
    return () => {
      document.removeEventListener('keydown', escHandleClose);
    };
  }, [onBlur]);

  // const [currentPlacement, setCurrentPlacement] = useState(EMPTY_STRING);
  let popperData = usePopper(referenceElement, popperElement, {
    strategy: fixedStrategy
      ? POPPER_STRATEGIES.FIXED
      : POPPER_STRATEGIES.ABSOLUTE,
    placement,
    modifiers: [
      {
        // name: 'flip',
        // options: {
        //   // altBoundary: true,
        //   fallbackPlacements,
        //   allowedAutoPlacements,
        //   flipVariations,
        // },
        name: 'preventOverflow',
      },
      {
        name: 'flip',
        options: {
          // altBoundary: true,
          fallbackPlacements,
          allowedAutoPlacements,
          flipVariations,
        },
      },
    ],
  });
  if (!nullCheck(popperData, 'state.placement')) {
    popperData = {
      ...popperData,
      state: {
        ...popperData.state,
        placement: null,
      },
    };
  }

  const getPlacementClasses = () => {
    switch (popperData.state.placement) {
      case POPPER_PLACEMENTS.TOP:
        arrowBottomTooltip = showTooltip ? (
          <div className={cx(gClasses.CenterH, styles_.ArrowBottomShadow)}>
            <div className={styles_.ArrowBottom} />
          </div>
        ) : null;
        return topPlacementClasses;
      case POPPER_PLACEMENTS.BOTTOM:
        arrowTopTooltip = showTooltip ? (
          <div className={gClasses.CenterH}>
            <div className={styles_.ArrowTop} />
          </div>
        ) : null;
        return bottomPlacementClasses;
      case POPPER_PLACEMENTS.RIGHT:
          return rightPlacementClasses;
      case POPPER_PLACEMENTS.TOP_START:
        return topStartPlacementClasses;
      case POPPER_PLACEMENTS.TOP_END:
        return topEndPlacementClasses;
      case POPPER_PLACEMENTS.BOTTOM_START:
        return bottomStartPlacementClasses;
      case POPPER_PLACEMENTS.BOTTOM_END:
        return bottomEndPlacementClasses;
      case POPPER_PLACEMENTS.RIGHT_START:
        return rightStartPlacementClasses;
      default:
        return null;
    }
  };

  const onClickUpdate = (update) => {
    update();
  };

  const dynamicHeight = isDynamicHeight
    ? {
        height: calculateDynamicHeight(
          popperData.state.placement,
          referenceElement,
          minHeight,
          maxHeight,
        ),
      }
    : null;

  const { styles, attributes, update } = popperData;
  const popperView = (
    <div
      // tabIndex={enableAutoFocus ? '0' : ''}
      // onBlur={(event) => {
      //   if (event && !event.currentTarget.contains(event.relatedTarget)) {
      //     popperViewOnBlur(event);
      //   }
      // }}
      onMouseLeave={onMouseLeave}
      ref={setPopperElement}
      className={cx(className, getPlacementClasses())}
      style={{ ...styles.popper, ...style, ...dynamicHeight }}
      {...attributes.popper}
      onBlur={(e) => {
        onPopperBlur && onPopperBlur(e, referenceElement);
      }}
    >
      {arrowTopTooltip}
      {children}
      {triggerUpdate && <button id="popper_button" className={styles_.HideButton} onClick={() => onClickUpdate(update)}>button</button>}
      {arrowBottomTooltip}
    </div>
  );

  // const currentPlacement = () => {
  //   if (state && props.currentPlacement) {
  //     props.currentPlacement(state);
  //   }
  // };
  // useEffect(() => {
  //   if (popperData.state.placement) setCurrentPlacement(popperData.state.placement);
  // }, [popperData.state.placement]);
  return (
    <>
      {enableOnBlur && isPopperOpen && (
        <button
          className={cx(
            BS.P_FIXED,
            gClasses.ClickableElement,
            gClasses.TransparentButton,
          )}
          onClick={onBlur}
          tabIndex={-1}
        />
      )}
      {isPopperOpen && popperView}
    </>
  );
}

AutoPositioningPopper.defaultProps = {
  placement: POPPER_PLACEMENTS.TOP,
  fallbackPlacements: [POPPER_PLACEMENTS.BOTTOM],
  allowedAutoPlacements: [
    POPPER_PLACEMENTS.TOP,
    POPPER_PLACEMENTS.BOTTOM,
    POPPER_PLACEMENTS.LEFT,
    POPPER_PLACEMENTS.RIGHT,
  ],
  flipVariations: true,
  className: EMPTY_STRING,
  isPopperOpen: false,
  onBlur: null,
  enableOnBlur: false,
  style: null,
  fixedStrategy: false,
  isDynamicHeight: false,
};

AutoPositioningPopper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.element])
    .isRequired,
  referenceElement: PropTypes.objectOf(PropTypes.any).isRequired,
  placement: PropTypes.string,
  fallbackPlacements: PropTypes.arrayOf(PropTypes.string),
  allowedAutoPlacements: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  flipVariations: PropTypes.bool,
  isPopperOpen: PropTypes.bool,
  onBlur: PropTypes.func,
  enableOnBlur: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  fixedStrategy: PropTypes.bool,
  isDynamicHeight: PropTypes.bool,
};
