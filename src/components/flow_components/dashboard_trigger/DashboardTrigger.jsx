import React, { useRef, useState } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import {
  keydownOrKeypessEnterHandle,
  useClickOutsideDetector,
} from 'utils/UtilityFunctions';
import AutoPositioningPopper from 'components/auto_positioning_popper/AutoPositioningPopper';
import UpArrowIcon from 'assets/icons/UpArrowIcon';
import DownArrowIcon from 'assets/icons/DownArrowIcon';
import styles from './DashboardTrigger.module.scss';

function DashboardTrigger(props) {
  const { title, dropdownListContainerClass, popperPlacement, optionList, isDatalistInstance } =
    props;
  const wrapperRef = useRef(null);

  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [referencePopperElement, setReferencePopperElement] = useState(null);

  const closeModal = () => {
    setIsPopperOpen(false);
  };

  useClickOutsideDetector(wrapperRef, closeModal);

  const onPopperBlurFunc = (e) => {
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) {
      setIsPopperOpen(false);
    }
  };

  return (
    <div className={styles.Container} ref={wrapperRef}>
      <span
        ref={setReferencePopperElement}
        className={cx(styles.TitleTag, !isDatalistInstance && gClasses.MR14)}
        onClick={() => setIsPopperOpen(!isPopperOpen)}
        onKeyDown={(e) =>
          keydownOrKeypessEnterHandle(e) && setIsPopperOpen(!isPopperOpen)
        }
        role="menu"
        tabIndex={0}
      >
        {title}
        <span className={gClasses.ML4}>
          {isPopperOpen ? (
            <UpArrowIcon width={10} height={10} />
          ) : (
            <DownArrowIcon width={10} height={10} />
          )}
        </span>
      </span>
      <div>
        <AutoPositioningPopper
          className={cx(
            styles.dropdownListContainer,
            dropdownListContainerClass,
          )}
          placement={popperPlacement}
          isPopperOpen={isPopperOpen}
          referenceElement={referencePopperElement}
          onPopperBlur={onPopperBlurFunc}
          onBlur={() => setIsPopperOpen(false)}
        >
          <div className={styles.popperElement}>
            <ul>{optionList}</ul>
          </div>
        </AutoPositioningPopper>
      </div>
    </div>
  );
}

export default DashboardTrigger;
