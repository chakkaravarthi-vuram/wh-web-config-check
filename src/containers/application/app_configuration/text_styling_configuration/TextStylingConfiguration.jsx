import cx from 'classnames';
import React, { useContext, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useTranslation } from 'react-i18next';
import { EPopperPlacements, Label, Popper } from '@workhall-pvt-lmt/wh-ui-library';
import { useDispatch, useSelector } from 'react-redux';
import gClasses from '../../../../scss/Typography.module.scss';
import { useClickOutsideDetector, validate } from '../../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { APPLICATION_STRINGS } from '../../application.strings';
import styles from './TextStylingConfiguration.module.scss';
import { applicationStateChange } from '../../../../redux/reducer/ApplicationReducer';
import jsUtility, { isEmpty } from '../../../../utils/jsUtility';
import ThemeContext from '../../../../hoc/ThemeContext';
import { saveCompValidationSchema } from '../../application.validation.schema';
import { getComponentInfoErrorMessage } from '../AppConfigurtion.utils';
import { ARIA_ROLES, BS, COLOR_CONSTANTS } from '../../../../utils/UIConstants';
import HelperMessage, { HELPER_MESSAGE_TYPE } from '../../../../components/form_components/helper_message/HelperMessage';
import InformationWidget from '../../../../components/information_widget/InformationWidget';

function TextStylingConfiguration() {
  const { activeComponent, error_list_config } = useSelector((store) => store.ApplicationReducer);
  const [editorState, setEditorState] = useState(() => activeComponent.component_info.formatter || '');
  const dispatch = useDispatch();
  const editorRef = useRef();
  const popperRef = useRef();
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const { t } = useTranslation();
  const { TEXT_STYLING } = APPLICATION_STRINGS(t);
  const { colorScheme: { highlight, widgetBg, appBg, activeColor } } = useContext(ThemeContext);

  useClickOutsideDetector(popperRef, () => setColorPickerOpen(false));

  const onChangeHandler = (event) => {
    const editorHtml = event.target.value;
    setEditorState(editorHtml);
    const clonedActiveComponent = jsUtility.cloneDeep(activeComponent);
    const formatter = editorHtml.replace(/\r?<p>&nbsp;<\/p>/g, '</br>');
    let rawEditorContent = editorRef.current.getContent({
      format: 'text',
    });
    rawEditorContent = rawEditorContent.split('\n').join(EMPTY_STRING);
    clonedActiveComponent.component_info.formatter = rawEditorContent;
    if (!isEmpty(error_list_config)) {
      const errorlist = validate(clonedActiveComponent, saveCompValidationSchema(t));
      dispatch(applicationStateChange({ error_list_config: errorlist }));
    }
    clonedActiveComponent.component_info.formatter = formatter;
    dispatch(applicationStateChange({ activeComponent: clonedActiveComponent, activeTextCompElementText: rawEditorContent }));
    return formatter;
  };

  const onColorChange = (color) => {
    const clonedActiveComponent = jsUtility.cloneDeep(activeComponent);
    clonedActiveComponent.color = color.hex;
    dispatch(applicationStateChange({ activeComponent: clonedActiveComponent }));

    if (editorRef.current?.iframeElement) {
      editorRef.current.iframeElement.style.backgroundColor = color.hex;
    }
  };

  return (
    <div className={cx(BS.W100)}>
      <div className={gClasses.MB16}>
        <Label labelName={TEXT_STYLING.BACKGROUND_COLOR} />
        <div ref={popperRef} className={gClasses.DisplayInlineBlock}>
          <button
            onClick={() => setColorPickerOpen((p) => !p)}
            className={cx(gClasses.CursorPointer, styles.ColorBtn)}
            style={{ backgroundColor: activeComponent.color || COLOR_CONSTANTS.WHITE }}
          />
          <Popper
            targetRef={popperRef}
            open={colorPickerOpen}
            placement={EPopperPlacements.BOTTOM_START}
            className={gClasses.ZIndex22}
            content={
              <SketchPicker
                onChange={onColorChange}
                color={activeComponent.color || COLOR_CONSTANTS.WHITE}
                presetColors={[highlight, widgetBg, appBg, activeColor]}
                disableAlpha
              />
            }
          />
        </div>
      </div>

      <div className={gClasses.PositionRelative}>
        {colorPickerOpen && <div className={styles.EditorOverlay} />}
      <InformationWidget
        label={TEXT_STYLING.FORMATTER}
        onChangeHandler={onChangeHandler}
        description={editorState}
        onInit={(_evt, editor) => {
          editorRef.current = editor;
          editor.iframeElement.style.backgroundColor = activeComponent.color;
        }}
        isAppWidget
      />
      {(getComponentInfoErrorMessage(error_list_config, 'formatter') || null) && (
        <HelperMessage
          message={getComponentInfoErrorMessage(error_list_config, 'formatter')}
          type={HELPER_MESSAGE_TYPE.ERROR}
          noMarginBottom
          role={ARIA_ROLES.ALERT}
          className={gClasses.MT10}
        />
      )}
      </div>
    </div>
  );
}

export default TextStylingConfiguration;
