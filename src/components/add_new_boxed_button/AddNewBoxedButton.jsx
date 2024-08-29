import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import gClasses from '../../scss/Typography.module.scss';
import styles from './AddNewBoxedButton.module.scss';

import { BS } from '../../utils/UIConstants';
import AddIcon from '../../assets/icons/AddIcon';
import CircularBadge from '../form_components/circular_badge/CircularBadge';
import ThemeContext from '../../hoc/ThemeContext';
import AutoPositioningPopper from '../auto_positioning_popper/AutoPositioningPopper';

export const ADD_NEW_BOXED_BUTTON_TYPE = {
  TYPE_1: 'ADD_NEW_BOXED_BUTTON_TYPE_1',
  TYPE_2: 'ADD_NEW_BOXED_BUTTON_TYPE_2',
};

function AddNewBoxedButton(props) {
  const [referencePopperElement, setReferencePopperElement] = useState(null);
  const { buttonColor } = useContext(ThemeContext);
  const {
    type = ADD_NEW_BOXED_BUTTON_TYPE.TYPE_1,
    name,
    className,
    onClickHandler,
    popperClasses,
    popperElement,
    popperVisibility,
    popperPlacement,
    popperFallbackPlacements,
    popperFixedStrategy,
    popperAllowedAutoPlacements,
    parentRef,
  } = props;
  let popper = null;
  let popperRef = null;

  if (popperElement) {
    popperRef = setReferencePopperElement;
    popper = popperElement ? (
      <AutoPositioningPopper
        className={popperClasses}
        placement={popperPlacement}
        fallbackPlacements={popperFallbackPlacements}
        allowedAutoPlacements={popperAllowedAutoPlacements}
        fixedStrategy={popperFixedStrategy}
        referenceElement={referencePopperElement}
        isPopperOpen={popperVisibility}
      >
        {popperElement}
      </AutoPositioningPopper>
    ) : null;
  }

  let content = null;
  let classes = null;
  if (type === ADD_NEW_BOXED_BUTTON_TYPE.TYPE_1) {
    content = (
      <>
        <CircularBadge
          className={cx(styles.CircularBadge, gClasses.FlexShrink0, gClasses.MR15)}
        >
          <AddIcon />
        </CircularBadge>
        <div
          className={cx(gClasses.FTwo12)}
          style={{ color: buttonColor }}
          ref={popperRef}
        >
          {name}
        </div>
      </>
    );
    classes = styles.Container;
  } else if (type === ADD_NEW_BOXED_BUTTON_TYPE.TYPE_2) {
    content = (
      <>
        <CircularBadge
          className={cx(styles.CircularBadge, gClasses.FlexShrink0)}
        >
          <AddIcon />
        </CircularBadge>
        <div
          className={cx(gClasses.FTwo12, gClasses.FontWeight600, gClasses.MT10)}
          style={{ color: buttonColor }}
          // ref={popperRef}
        >
          {name}
        </div>
      </>
    );
    classes = cx(gClasses.CenterVH, BS.FLEX_COLUMN);
  }

  return (
    <>
      <div
        role="button"
        className={cx(
          classes,
          className,
          gClasses.DashedBorder,
          BS.D_FLEX,
          gClasses.CenterVH,
          gClasses.CursorPointer,
        )}
        onClick={onClickHandler}
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClickHandler(e)}
        tabIndex={0}
        ref={parentRef}
      >
        {content}
      </div>
      {popper}
    </>
  );
}

AddNewBoxedButton.defaultProps = {
  name: '',
  className: null,
};

AddNewBoxedButton.propTypes = {
  name: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClickHandler: PropTypes.func.isRequired,
};

export default AddNewBoxedButton;
