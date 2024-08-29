import React, { useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { isEqual, isEmpty } from 'lodash';
import { KEY_NAMES } from 'utils/Constants';

import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import styles from './GradientPicker.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import ColorPickerIcon from '../../../assets/icons/ColorPickerIcon';
import { BS, COLOR_CONSTANTS } from '../../../utils/UIConstants';
import { GRADIENT_PICKER_VARIANTS, PICKER_STRINGS } from './GradientPicker.strings';
import ThemeContext from '../../../hoc/ThemeContext';
import CorrectIcon from '../../../assets/icons/CorrectIcon';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import Label from '../label/Label';
import { getInitials } from '../../../utils/generatorUtils';

function GradientPicker(props) {
  const [isPickerVisible, setPickerVisibility] = useState(false);
  const { primaryButton } = useContext(ThemeContext);
  const { COLOR_LIST, CHOOSE, COLOR_LABELS } = PICKER_STRINGS;
  const {
    onChange,
    selectedGradientObj,
    className,
    label,
    isDataLoading,
    id,
    hideLabel,
    thumbnailText,
    displayIconOnHover,
    buttonClasses,
    hideColorPaletteTitle,
    helperTooltipMessage,
    variant,
    placement,
    labelStyles,
  } = props;
  let picker = null;
  const labelId = `${id}_label`;
  const pickerRef = useRef();
  const containerRef = useRef();
  const showPicker = () => {
    setPickerVisibility(true);
  };

  useEffect(() => {
    const fn = (e) => {
      if (e.key === KEY_NAMES.ESCAPE) {
        e.stopPropagation();
        e.preventDefault();
        setPickerVisibility(false);
      }
    };
    if (isPickerVisible) {
      containerRef.current?.addEventListener('keydown', fn);
    }
    return () => containerRef.current?.removeEventListener('keydown', fn);
  }, [isPickerVisible]);

  const hidePicker = (e) => {
    if (pickerRef.current.contains(e.relatedTarget)) return;
    setPickerVisibility(false);
  };
  const onTileClick = (colorList) => {
    onChange({ target: { id, value: colorList } });
    setPickerVisibility(false);
  };

  function handleBlur(e) {
    if (pickerRef.current.contains(e.relatedTarget)) return;
    setPickerVisibility(false);
  }

  const getGradientValue = (colorObj) =>
    `${colorObj.method}(${colorObj.degree}deg,${colorObj.hex_codes[0]} ,${colorObj.hex_codes[1]})`;
  if (isPickerVisible) {
    const tileList = COLOR_LIST.map((colorObj, index) => {
      const bgImage = getGradientValue(colorObj);
      console.log('bgImagebgImage', bgImage, selectedGradientObj, colorObj);
      const isTileSelected = isEqual(selectedGradientObj, colorObj);

      return (
        <button
          id={id}
          className={cx(styles.Tile, gClasses.MT15, gClasses.CursorPointer, gClasses.CenterVH, gClasses.ClickableElement, {
            [styles.SelectedTile]: isTileSelected,
          })}
          style={{ background: bgImage }}
          onClick={() => onTileClick(colorObj)}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onTileClick(colorObj)}
          key={`gradient_picker_color_${index}`}
          aria-label={COLOR_LABELS[index]}
        >
          <CorrectIcon className={styles.CorrectIcon} ariaHidden />
        </button>
      );
    });
    picker = (
      <div className={cx(BS.P_ABSOLUTE, styles.Picker)} ref={pickerRef} onBlur={handleBlur}>
        {!hideColorPaletteTitle && (
          <div
            className={cx(gClasses.FTwo12, gClasses.FontWeight500)}
            style={{ color: primaryButton }}
          >
            {CHOOSE}
          </div>
        )}
        <div className={cx(BS.D_FLEX, BS.FLEX_WRAP_WRAP, BS.JC_BETWEEN)}>{tileList}</div>
      </div>
    );
  }
  const pickerStyle = !isEmpty(selectedGradientObj) ? { backgroundImage: getGradientValue(selectedGradientObj) } : null;
  const thumbnailTextElement = thumbnailText ? (
    <div
      className={cx(
        gClasses.FTwo16White,
        gClasses.FontWeight500,
        styles.ThumbnailTextSecondary,
        BS.TEXT_CENTER,
        displayIconOnHover && styles.HideTextOnHover,
      )}
    >
      {getInitials(thumbnailText)}
    </div>
  ) : null;
  let gradientPicker;
  if (variant === GRADIENT_PICKER_VARIANTS.TYPE_1) {
    gradientPicker = (
      <button
        id={id}
        className={cx(
          styles.GradientSwatchPicker,
          gClasses.CenterVH,
          gClasses.CursorPointer,
          gClasses.ClickableElement,
          buttonClasses,
        )}
        onClick={showPicker}
        onBlur={hidePicker}
        style={pickerStyle}
        aria-labelledby={`${labelId}`}
      >
        {thumbnailTextElement}
        <div className={cx(BS.P_ABSOLUTE, displayIconOnHover && styles.DisplayIconOnHover, gClasses.CenterVH)}>
          <ColorPickerIcon />
        </div>
      </button>
    );
  } else if (variant === GRADIENT_PICKER_VARIANTS.TYPE_2) {
    gradientPicker = (
      <button
        id={id}
        className={cx(styles.GradientSwatchPickerV2, gClasses.CenterVH, gClasses.CursorPointer, gClasses.ClickableElement)}
        onClick={isPickerVisible ? hidePicker : showPicker}
        onBlur={hidePicker}
        aria-labelledby={`${labelId}`}
      >
        <div className={styles.InnerGradientSwatchPickerV2} style={pickerStyle} />
      </button>
    );
  }
  return (
    <div className={cx(BS.P_RELATIVE, className, styles.ContainerHover, gClasses.MB15)} ref={containerRef}>
      {!hideLabel && <Label id={labelId} labelFor={id} labelStyles={labelStyles} content={label} isDataLoading={isDataLoading} message={helperTooltipMessage} toolTipId={id} placement={placement} hideLabelClass />}
      {isDataLoading ? (
        <div
          className={cx(styles.GradientSwatchPicker, buttonClasses)}
          style={{ backgroundColor: COLOR_CONSTANTS.SKELETON_LOADER_GRAY_COLOR }}
        />
      ) : (
        <>
          {gradientPicker}
          {picker}
        </>
      )}
    </div>
  );
}
export default GradientPicker;
GradientPicker.defaultProps = {
  onChange: null,
  selectedGradientObj: {},
  className: EMPTY_STRING,
  variant: GRADIENT_PICKER_VARIANTS.TYPE_1,
  placement: EMPTY_STRING,
};
GradientPicker.propTypes = {
  onChange: PropTypes.func,
  selectedGradientObj: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  variant: PropTypes.number,
  placement: PropTypes.string,
};
