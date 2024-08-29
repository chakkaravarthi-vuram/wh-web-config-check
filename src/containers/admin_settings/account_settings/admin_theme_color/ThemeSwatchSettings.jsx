import React from 'react';
import cx from 'classnames/bind';
import { SketchPicker, BlockPicker } from 'react-color';
import styles from '../AccountSettings.module.scss';

function ThemeSwatchSettings(props) {
    const {
        outerClass,
        disableColorSlider = false,
        onColorGradientPick,
        activeColor,
        defaultColors,
    } = props;

    const onColorPickerInfoChange = (color) => {
        onColorGradientPick(color);
      };

    const themeColorPicker = (
        <>
            {/* <Title content={modalTitle} className={cx(gClasses.FTwo20GrayV3, gClasses.FontWeight500, gClasses.MB30)} /> */}
            {disableColorSlider ? (
                <BlockPicker
                    color={activeColor}
                    onChangeComplete={onColorPickerInfoChange}
                    disableAlpha
                    colors={defaultColors}
                    triangle="hide"
                    width="205px"
                />
            ) : (
                <SketchPicker
                    color={activeColor}
                    onChangeComplete={onColorPickerInfoChange}
                    disableAlpha
                    presetColors={defaultColors}
                    // width="180px"
                />
            )}
        </>
    );

    return (
        <div className={cx(styles.SettingsPopper, outerClass)}>
            {themeColorPicker}
        </div>
    );
}

export default ThemeSwatchSettings;
