import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames/bind';
import AutoPositioningPopper, { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import { KEY_CODES } from 'utils/Constants';
import { BS } from 'utils/UIConstants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import styles from './FieldSuggestionDropdown.module.scss';

function FieldSuggestionDropdown(props) {
    const { referencePopperElement, popperValue, mainRef } = props;
    const [arrayValue, setArrayValue] = useState([]);
    const [arrayIndex, setArrayIndex] = useState(0);
    const [searchValue, setSearchValue] = useState(EMPTY_STRING);
    const referenceElement = useRef(null);

    useEffect(() => {
        setSearchValue(popperValue);
        const element = document.getElementById('ref0');
        element.focus();
    }, []);

    const FocusChangeHandle = (focussedIndex) => {
        setArrayIndex(focussedIndex);
        const array_values = arrayValue.forEach((field, index) => {
            if (focussedIndex === index) {
                field.focussed = true;
            } else field.focussed = false;
        });
        setArrayValue(array_values);
    };

    const onKeyDownHandler = (event) => {
        event.preventDefault();
        // event.stopPropagation();
        switch (event.keyCode) {
            case KEY_CODES.ENTER:
                break;
            case KEY_CODES.UP_ARROW:
                // if (index > 0) {
                //     const element = document.getElementById(`ref${index - 1}`);
                //     element.focus();
                    FocusChangeHandle(arrayIndex - 1);
                // }
                break;
            case KEY_CODES.DOWN_ARROW:
                // const elements = document.getElementById(`ref${index + 1}`);
                // elements.focus();
                FocusChangeHandle(arrayIndex + 1);
                break;
            default:
                mainRef.current.focus();
                break;
        }
    };

    const onChangeHandler = (e) => {
        setSearchValue(e.target.value);
    };

    return (
        <>
        <input
            ref={referenceElement}
            value={searchValue}
            className={cx(styles.InputElement, BS.P_RELATIVE)}
            onChange={onChangeHandler}
            onKeyDown={(e) => onKeyDownHandler(e)}
        />
        <AutoPositioningPopper
            // className={popperClasses}
            placement={POPPER_PLACEMENTS.BOTTOM}
            fallbackPlacements={[POPPER_PLACEMENTS.BOTTOM_END]}
            // allowedAutoPlacements={popperAllowedAutoPlacements}
            // fixedStrategy={popperFixedStrategy}
            referenceElement={referencePopperElement}
            isPopperOpen
            triggerUpdate
            updateValue={popperValue}
        >
            {/* // {console.log('fgadsgasdg', referencePopperElement)} */}
            <ul className={cx(styles.Container)}>
                {arrayValue.map((field, index) => (
                    <li><button className={index === arrayIndex && styles.Focus} id={`ref${index}`} onKeyDown={(event) => onKeyDownHandler(event, index)}>{field.field_name}</button></li>
                ))}
            </ul>
        </AutoPositioningPopper>
        </>
    );
}

export default FieldSuggestionDropdown;
