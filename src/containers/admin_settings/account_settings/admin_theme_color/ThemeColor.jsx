import React, { useRef, useState } from 'react';
import cx from 'classnames/bind';
import { EPopperPlacements, Popper } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../AccountSettings.module.scss';
import { keydownOrKeypessEnterHandle, useClickOutsideDetector } from '../../../../utils/UtilityFunctions';

function ThemeColor(props) {
    const {
        className,
        outerClass,
        themeTypeName,
        bgColor = '#000',
        popperContent,
        id,
    } = props;
    const themeSettingsRef = useRef();
    const [isThemePickeropen, setThemePickerOpen] = useState(false);

    useClickOutsideDetector(themeSettingsRef, () => setThemePickerOpen(false));

    return (
        <div className={outerClass} ref={themeSettingsRef} id={id}>
            <div
                className={cx(styles.ColorBox, className)}
                onClick={() => setThemePickerOpen((prevOpen) => !prevOpen)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && setThemePickerOpen((prevOpen) => !prevOpen)}
            >
                <div className={styles.FillBox} style={{ background: bgColor }} />
                <div className={styles.ColorType}>
                    {themeTypeName}
                </div>
            </div>
            <Popper
                targetRef={themeSettingsRef}
                open={isThemePickeropen}
                placement={EPopperPlacements.BOTTOM_START}
                content={popperContent}
            />
        </div>
    );
}

export default ThemeColor;
