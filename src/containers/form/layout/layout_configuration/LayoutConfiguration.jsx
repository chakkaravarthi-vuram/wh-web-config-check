import React, { useRef, useState } from 'react';
import cx from 'classnames';
import {
  Button,
  EButtonType,
  ETitleSize,
  Modal,
  ModalSize,
  Popper,
  Text,
  Title,
  Label,
  EPopperPlacements,
  SingleDropdown,
  toastPopOver,
  EToastType,
} from '@workhall-pvt-lmt/wh-ui-library';
import { SketchPicker } from 'react-color';
import { useTranslation } from 'react-i18next';
import { FORM_ACTIONS, FORM_LAYOUT_TYPE, LAYOUT_CONFIGURATION_STRINGS } from '../../Form.string';
import { COLOR_CONSTANTS } from '../../../../utils/UIConstants';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from './LayoutConfiguration.module.scss';
import CloseIconNew from '../../../../assets/icons/CloseIconNew';
import { useClickOutsideDetector } from '../../../../utils/UtilityFunctions';
import { GET_BOX_LAYOUT_TEMPLATE, GET_COLUMN_LAYOUT_TEMPLATE, GET_ROW_LAYOUT_TEMPLATE } from '../Layout.constant';
import { cloneDeep, isEmpty } from '../../../../utils/jsUtility';
import { NO_OF_COLUMNS_OPTION_LIST, doesLayoutHaveValidChildren } from './LayoutConfiguration.utils';
import { COLUMN_LAYOUT } from '../../sections/form_layout/FormLayout.string';

function LayoutConfiguration(props) {
  const { activeLayout, dispatch, saveLayout, removeLayout, sections } = props;
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const colorPopperRef = useRef();
  const { t } = useTranslation();
  const { BOX_CONFIG } = LAYOUT_CONFIGURATION_STRINGS(t);

  useClickOutsideDetector(colorPopperRef, () => setColorPickerOpen(false));

  const onCloseClick = () => {
    dispatch(FORM_ACTIONS.ACTIVE_LAYOUT_CLEAR);
  };

  const onChangeHandler = (id, value) => {
    const _activeLayout = { ...activeLayout };
    _activeLayout[id] = value;
    dispatch(FORM_ACTIONS.UPDATE_ACTIVE_LAYOUT, _activeLayout);
  };

  const onSaveClick = () => {
    console.log('xyz activeLayout', activeLayout);
    let boxLayout;

    if (activeLayout.layout) { // editing an existing box layout
      boxLayout = cloneDeep(activeLayout.layout);
      boxLayout.bg_color = activeLayout.bgColor;
    } else {
      boxLayout = GET_BOX_LAYOUT_TEMPLATE(null, null, {
        number_of_columns: activeLayout.noOfColumns,
        bg_color: activeLayout.bgColor,
      });
      const rowLayout = GET_ROW_LAYOUT_TEMPLATE(boxLayout.node_uuid);
      rowLayout.order = 1;
      for (let i = 1; i <= activeLayout.noOfColumns; i++) {
        rowLayout.children.push(GET_COLUMN_LAYOUT_TEMPLATE(rowLayout.node_uuid, i));
      }
      boxLayout.children.push(rowLayout);

      // if the box is dropped on a new row
      if (activeLayout.dropType.endsWith(FORM_LAYOUT_TYPE.ROW)) {
        const section = sections.find((s) => s.section_uuid === activeLayout.sectionUUID);
        const cols = section.no_of_columns || COLUMN_LAYOUT.TWO;
        boxLayout.order = 1;
        const row = GET_ROW_LAYOUT_TEMPLATE();
        for (let i = 1; i <= cols; i++) {
          row.children.push(GET_COLUMN_LAYOUT_TEMPLATE(row.node_uuid, i));
        }
        row.children[0].children[0] = boxLayout;
        saveLayout(row);
        return;
      }
    }

    saveLayout(boxLayout);
  };

  const onDeleteClick = () => {
    const { layout } = activeLayout;

    if (doesLayoutHaveValidChildren(layout)) {
      toastPopOver({
        toastType: EToastType.warning,
        title: BOX_CONFIG.CANNOT_DELETE_TITLE,
        subtitle: BOX_CONFIG.CANNOT_DELETE_TEXT,
      });
    } else {
      removeLayout();
    }
  };

  const headerContent = (
    <>
      <Title
        content={BOX_CONFIG.MODAL_TITLE}
        size={ETitleSize.small}
      />
      <CloseIconNew
        onClick={onCloseClick}
        className={cx(styles.CloseIcon, gClasses.CursorPointer)}
      />
    </>
  );

  const mainContent = (
    <>
      <Text content={BOX_CONFIG.TITLE} className={gClasses.MB16} />
      <SingleDropdown
        optionList={NO_OF_COLUMNS_OPTION_LIST}
        dropdownViewProps={{
          labelName: BOX_CONFIG.NO_OF_COLUMNS,
          disabled: !isEmpty(activeLayout.layout),
        }}
        selectedValue={activeLayout.noOfColumns}
        onClick={(value) => onChangeHandler('noOfColumns', value)}
        className={gClasses.MB16}
      />
      <div className={gClasses.MB16}>
        <Label labelName={BOX_CONFIG.BACKGROUND_COLOR} />
        <div ref={colorPopperRef} className={gClasses.DisplayInlineBlock}>
          <button
            onClick={() => setColorPickerOpen((p) => !p)}
            className={cx(gClasses.CursorPointer, styles.BgColorBtn)}
            style={{
              backgroundColor:
                activeLayout.bgColor || COLOR_CONSTANTS.WHITE,
            }}
          />
          <Popper
            targetRef={colorPopperRef}
            open={colorPickerOpen}
            placement={EPopperPlacements.BOTTOM_START}
            className={gClasses.ZIndex22}
            content={
              <SketchPicker
                onChange={(c) => onChangeHandler('bgColor', c.hex)}
                color={activeLayout.bgColor}
                disableAlpha
              />
            }
          />
        </div>
      </div>
    </>
  );

  const footerContent = (
    <>
      <div>
        {activeLayout.layout && (
          <Button
            type={EButtonType.TERTIARY}
            buttonText={t('common_strings.delete')}
            className={styles.DeleteButton}
            onClickHandler={onDeleteClick}
          />
        )}
      </div>
      <div className={gClasses.CenterV}>
        <Button
          type={EButtonType.TERTIARY}
          buttonText={t('common_strings.cancel')}
          onClickHandler={onCloseClick}
        />
        <Button
          buttonText={t('common_strings.save')}
          onClickHandler={onSaveClick}
        />
      </div>
    </>
  );

  return (
    <Modal
      isModalOpen
      modalSize={ModalSize.md}
      headerContent={headerContent}
      headerContentClassName={cx(styles.Header, gClasses.PY24, gClasses.PX48)}
      mainContent={mainContent}
      mainContentClassName={cx(styles.Main, gClasses.PY15, gClasses.PX48)}
      footerContentClassName={cx(styles.Footer, gClasses.PY15, gClasses.PX24)}
      footerContent={footerContent}
    />
  );
}

export default LayoutConfiguration;
