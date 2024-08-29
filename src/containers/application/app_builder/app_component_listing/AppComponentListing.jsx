import React, { useRef, useState } from 'react';
import { Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import AutoPositioningPopper from 'components/auto_positioning_popper/AutoPositioningPopper';
import { useClickOutsideDetector, keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { BS } from 'utils/UIConstants';
import styles from './AppComponentListing.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';

function CompListingPopper(props) {
    const {
        list,
        referencePopperElement,
        isPopperOpen,
        popperPlacement,
        closeListPopper,
        onAddClick,
        componentIndex,
    } = props;
    const [hover, setHover] = useState(-1);

    const closeModal = () => {
        closeListPopper();
    };

    const wrapperRef = useRef(null);
    useClickOutsideDetector(wrapperRef, closeModal);

    const optionList = list.map((items, index) => (
        <div
            className={cx(styles.listItem, BS.D_FLEX, gClasses.CenterV, gClasses.CursorPointer)}
            key={index}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(-1)}
            style={{
                backgroundColor: hover === index ? '#217CF530' : 'white',
            }}
            onClick={() => onAddClick(items.type, componentIndex)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => keydownOrKeypessEnterHandle(event) && onAddClick()}
        >
            <items.icon fillColor={hover === index ? '#217CF5' : '#9E9E9E'} />
            <div className={cx(gClasses.ML24)}>
                <Text size={ETextSize.MD} content={items.elementName} fontClass={gClasses.FontWeight500} />
                <Text size={ETextSize.SM} content={items.elementDesc} />
            </div>
        </div>
    ));

    return (
        <div ref={wrapperRef}>
            {console.log('fasdfgasdg', referencePopperElement)}
            <AutoPositioningPopper
                className={cx(styles.dropdownListContainer)}
                placement={popperPlacement}
                isPopperOpen={isPopperOpen}
                referenceElement={referencePopperElement}
                // onPopperBlur={onPopperBlurFunc}
                // onBlur={() => setIsPopperOpen(false)}
            >
                <div className={styles.popperElement}>
                    {optionList}
                </div>
            </AutoPositioningPopper>

        </div>
    );
}
export default CompListingPopper;
