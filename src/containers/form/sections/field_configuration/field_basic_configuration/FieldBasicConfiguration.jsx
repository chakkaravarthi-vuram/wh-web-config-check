import React, { useContext, useRef, useState } from 'react';
import {
  EPopperPlacements,
  Label,
  Popper,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { SketchPicker } from 'react-color';
import cx from 'classnames/bind';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';
import jsUtility from '../../../../../utils/jsUtility';
import InformationWidget from '../../../../../components/information_widget/InformationWidget';
import ButtonLinkBasicConfiguration from './button_link_basic_configuration/ButtonLinkBasicConfiguration';
import DisplayFieldBasicConfiguration from './display_field_basic_configuration/DisplayFieldBasicConfiguration';
import ImageBasicConfiguration from './image_basic_configuration/ImageBasicConfiguration';
import gClasses from '../../../../../scss/Typography.module.scss';
import ThemeContext from '../../../../../hoc/ThemeContext';
import { useClickOutsideDetector } from '../../../../../utils/UtilityFunctions';
import { COLOR_CONSTANTS } from '../../../../../utils/UIConstants';
import styles from './FieldBasicConfiguration.module.scss';
import { FIELD_CONFIGURATIONS_CONSTANTS } from '../FieldConfiguration.constants';

function FieldBasicConfiguration(props) {
  const {
    fieldDetails,
    setFieldDetails,
    onDeleteHandler,
    metaData,
    onSaveField,
    fields,
    dispatch,
    moduleType,
  } = props;
  const { t } = useTranslation();
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const editorRef = useRef();
  const popperRef = useRef();
  const {
    colorScheme: { highlight, widgetBg, appBg, activeColor },
  } = useContext(ThemeContext);
  const {
    GENERAL: { RICH_TEXT },
  } = FIELD_CONFIGURATIONS_CONSTANTS(t);

  const onColorChange = (color) => {
    setFieldDetails({
      ...fieldDetails,
      [RESPONSE_FIELD_KEYS.BACKGROUND_COLOR]: color.hex,
    });
    if (editorRef.current?.iframeElement) {
      editorRef.current.iframeElement.style.backgroundColor = color.hex;
    }
  };
  useClickOutsideDetector(popperRef, () => setColorPickerOpen(false));

  const getCurrentBasicConfig = () => {
    switch (fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
      case FIELD_TYPE.BUTTON_LINK:
        return (
          <ButtonLinkBasicConfiguration
            fieldDetails={fieldDetails}
            setFieldDetails={setFieldDetails}
            metaData={metaData}
            errorList={fieldDetails?.errorList}
          />
        );
      case FIELD_TYPE.IMAGE:
        return (
          <ImageBasicConfiguration
            fieldDetails={fieldDetails}
            setFieldDetails={setFieldDetails}
            metaData={metaData}
            errorList={fieldDetails?.errorList}
          />
        );
      case FIELD_TYPE.RICH_TEXT: {
        const entityData = {
          entity_id: metaData?.pageId,
          entity: 'dashboard_pages',
          type: 'image_field',
        };

        const contextData = {
          context_id: metaData?.moduleId,
        };

        const addDocumentHandler = (document) => {
          const existingInsertedDocuments =
            jsUtility.cloneDeep(fieldDetails)?.[
              RESPONSE_FIELD_KEYS.INFORMATION_DATA
            ]?.[RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS] || [];
          existingInsertedDocuments.push(document);
          setFieldDetails({
            ...fieldDetails,
            isImageChange: true,
            infoFieldImageRefUUID: document.ref_uuid,
            [RESPONSE_FIELD_KEYS.INFORMATION_DATA]: {
              ...(fieldDetails?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA] || {}),
              [RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS]:
                existingInsertedDocuments,
            },
          });
        };

        return (
          <>
            <div className={gClasses.MB16}>
              <Label labelName={RICH_TEXT.BACKGROUND_COLOR} className={gClasses.MB3} />
              <div ref={popperRef} className={gClasses.DisplayInlineBlock}>
                <button
                  onClick={() => setColorPickerOpen((p) => !p)}
                  className={cx(gClasses.CursorPointer, styles.ColorBtn)}
                  style={{
                    backgroundColor:
                      fieldDetails[RESPONSE_FIELD_KEYS.BACKGROUND_COLOR] ||
                      COLOR_CONSTANTS.WHITE,
                  }}
                />
                <Popper
                  targetRef={popperRef}
                  open={colorPickerOpen}
                  placement={EPopperPlacements.BOTTOM_START}
                  className={gClasses.ZIndex22}
                  content={
                    <SketchPicker
                      onChange={onColorChange}
                      color={
                        fieldDetails[RESPONSE_FIELD_KEYS.BACKGROUND_COLOR] ||
                        COLOR_CONSTANTS.WHITE
                      }
                      presetColors={[highlight, widgetBg, appBg, activeColor]}
                      disableAlpha
                    />
                  }
                />
              </div>
            </div>
            <InformationWidget
              label={RICH_TEXT.CONTENT}
              onChangeHandler={(event, fieldIds) => {
                setFieldDetails({
                  ...fieldDetails,
                  [RESPONSE_FIELD_KEYS.INFORMATION_CONTENT]: {
                    [RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE]: event?.target?.value,
                  },
                  [RESPONSE_FIELD_KEYS.INFORMATION_DATA]: {
                    ...(fieldDetails?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA] ||
                      {}),
                    [RESPONSE_FIELD_KEYS.INSERTED_FIELDS]: fieldIds,
                  },
                });
              }}
              onInit={(_evt, editor) => {
                editorRef.current = editor;
                editor.iframeElement.style.backgroundColor =
                  fieldDetails[RESPONSE_FIELD_KEYS.BACKGROUND_COLOR];
              }}
              description={jsUtility.get(
                fieldDetails,
                [
                  RESPONSE_FIELD_KEYS.INFORMATION_CONTENT,
                  RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE,
                ],
                null,
              )}
              informationData={jsUtility.get(
                fieldDetails,
                [RESPONSE_FIELD_KEYS.INFORMATION_DATA],
                null,
              )}
              metaData={metaData}
              refUuid={fieldDetails.infoFieldImageRefUUID}
              moduleType={moduleType}
              entityData={entityData}
              contextData={contextData}
              addDocumentHandler={addDocumentHandler}
              isDesignElements
              errorMessage={
                fieldDetails?.errorList?.[
                  'informationContent,editorTemplate'
                ] || fieldDetails?.errorList?.informationContent
              }
              setColorPickerOpen={setColorPickerOpen}
            />
          </>
        );
      }
      default:
        return (
          <DisplayFieldBasicConfiguration
            fieldDetails={fieldDetails}
            setFieldDetails={setFieldDetails}
            metaData={metaData}
            onSaveField={onSaveField}
            onDeleteHandler={onDeleteHandler}
            fields={fields}
            dispatch={dispatch}
          />
        );
    }
  };

  return getCurrentBasicConfig();
}

export default FieldBasicConfiguration;
