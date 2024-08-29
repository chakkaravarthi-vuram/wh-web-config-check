import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import HelpIcon from '../../assets/icons/HelpIcon';
import CloseIcon from '../../assets/icons/CloseIcon';
import Tab, { TAB_TYPE } from '../tab/Tab';

import styles from './DialogBox.module.scss';
import gClasses from '../../scss/Typography.module.scss';
import { BS } from '../../utils/UIConstants';
import { FIELD_VIEW_TYPE } from '../form_builder/section/form_fields/FormField.strings';

function DialogBox(props) {
  const {
    title,
    helpText,
    helpTooltipId = 'dialogBoxHelp',
    onCloseClickHandler,
    tabList,
    onTabChangeHandler,
    selectedTabIndex,
    currentTabComponent,
    className,
    footerElement,
    instructionMessage,
    isTableImported,
  } = props;

  return (
    <div className={cx(styles.Container, BS.D_FLEX, BS.FLEX_COLUMN, className)}>
      <div className={styles.Header}>
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
          <div className={gClasses.CenterV}>
            <div className={cx(gClasses.FTwo14BlackV6, gClasses.CursorPointer)}>{title}</div>
            <HelpIcon className={cx(gClasses.ML5, { [BS.D_NONE]: !helpText })} title={helpText} id={helpTooltipId} />
          </div>

          <CloseIcon className={cx(gClasses.WH16, gClasses.CursorPointer)} onClick={onCloseClickHandler} isButtonColor />
        </div>
        {(isTableImported) && (
          <p className={cx(styles.FieldTypeInstruction, gClasses.FOne12GrayV17, gClasses.Italics, gClasses.MT5)}>
            (
              {FIELD_VIEW_TYPE.IMPORTED}
              )
          </p>
        )}
        {(instructionMessage) ?
          <div className={cx(gClasses.Italics, gClasses.FOne13GrayV17, gClasses.MT5)}>{instructionMessage}</div>
          :
          null}
        <Tab
          className={cx(gClasses.MT10, { [BS.D_NONE]: tabList.length === 0 })}
          tabIList={tabList}
          setTab={onTabChangeHandler}
          selectedIndex={selectedTabIndex}
          type={TAB_TYPE.TYPE_5}
        />
      </div>
      <div className={cx(styles.Content, gClasses.ScrollBar)}>{currentTabComponent}</div>
      <div className={cx(styles.Footer, gClasses.CenterV, BS.JC_BETWEEN)}>
        {footerElement}
      </div>
    </div>
  );
}

DialogBox.defaultProps = {
  title: '',
  className: null,
  helpText: '',
  onCloseClickHandler: null,
  tabList: [],
  onTabChangeHandler: null,
  selectedTabIndex: 0,
  instructionMessage: null,
  isTableImported: false,
};

DialogBox.propTypes = {
  title: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helpText: PropTypes.string,
  onCloseClickHandler: PropTypes.func,
  tabList: PropTypes.arrayOf(PropTypes.any),
  onTabChangeHandler: PropTypes.func,
  selectedTabIndex: PropTypes.number,
  currentTabComponent: PropTypes.oneOfType(PropTypes.node, PropTypes.element).isRequired,
  isTableImported: PropTypes.bool,
  instructionMessage: PropTypes.string,
};

export default DialogBox;
