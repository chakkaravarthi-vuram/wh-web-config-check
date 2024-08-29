import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import LeftIcon from 'assets/icons/LeftIcon';
import styles from './Fields.module.scss';
import CONFIG_PANEL_STRINGS from '../ConfigPanel.strings';

function SystemAndData(props) {
  const {
    fieldType,
    systemFieldCount,
    dataFieldCount,
    isBackNeeded = true,
    context,
    onClickBackBtn,
    onClick,
  } = props;
  const { t } = useTranslation();
  const { DATA_FIELDS, SYSTEM_FIELDS } = CONFIG_PANEL_STRINGS(t);

  return (
    <>
      {isBackNeeded && (
        <div>
          <button
            className={cx(
              gClasses.ClickableElement,
              styles.BackBtn,
              gClasses.MB16,
              gClasses.MT16,
              gClasses.CenterV,
              gClasses.PX16,
            )}
            onClick={onClickBackBtn}
          >
            <LeftIcon className={gClasses.MR10} />
            <div
              className={cx(styles.Text, gClasses.Ellipsis)}
              title={context.context_name}
            >
              {context.context_name}
            </div>
          </button>
          <div className={cx(styles.Divider, gClasses.MB8)} />
        </div>
      )}

      <div className={styles.FieldType}>
        <button
          className={cx(
            gClasses.ClickableElement,
            styles.FieldTypeItem,
            gClasses.CursorPointer,
            BS.W100,
            {
              [styles.Selected]: fieldType === DATA_FIELDS,
            },
          )}
          onClick={() => onClick(DATA_FIELDS)}
        >
          <div className={BS.FLOAT_LEFT}>{DATA_FIELDS}</div>
          <div className={cx(BS.FLOAT_RIGHT, gClasses.CenterV)}>
            <span className={styles.Count}>{`(${dataFieldCount})`}</span>
            <LeftIcon className={gClasses.Rotate180} />
          </div>
        </button>
        <button
          className={cx(
            gClasses.ClickableElement,
            styles.FieldTypeItem,
            gClasses.CursorPointer,
            BS.D_BLOCK,
            BS.W100,
            {
              [styles.Selected]: fieldType === SYSTEM_FIELDS,
            },
          )}
          onClick={() => onClick(SYSTEM_FIELDS)}
        >
          <div className={BS.FLOAT_LEFT}>{SYSTEM_FIELDS}</div>
          <div className={cx(BS.FLOAT_RIGHT, gClasses.CenterV)}>
            <span className={styles.Count}>{`(${systemFieldCount})`}</span>
            <LeftIcon className={gClasses.Rotate180} />
          </div>
        </button>
      </div>
    </>
  );
}

SystemAndData.propTypes = {
  fieldType: PropTypes.string,
  systemFieldCount: PropTypes.number,
  dataFieldCount: PropTypes.number,
  isBackNeeded: PropTypes.bool,
  context: PropTypes.objectOf({
    context_name: PropTypes.string,
  }),
  onClickBackBtn: PropTypes.func,
  onClick: PropTypes.func,
};

export default SystemAndData;
