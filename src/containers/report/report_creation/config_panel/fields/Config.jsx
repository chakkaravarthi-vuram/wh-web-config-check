import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import LeftIcon from 'assets/icons/LeftIcon';
import styles from './Fields.module.scss';
import Button, {
  BUTTON_TYPE,
} from '../../../../../components/form_components/button/Button';
import CONFIG_PANEL_STRINGS from '../ConfigPanel.strings';

function Config(props) {
  const {
    isBackNeeded = false,
    fieldDisplayNameSelectedValue,
    mainContent,
    onClickBackBtn,
    onClickApply,
    onClickDiscard,
  } = props;
  const { t } = useTranslation();
  const { BUTTONS } = CONFIG_PANEL_STRINGS(t);

  return (
    <div className={cx(styles.FieldConfiguration)}>
      {!isBackNeeded && (
        <>
          <button
            className={cx(
              gClasses.ClickableElement,
              styles.BackBtn,
              gClasses.MB8,
              gClasses.CenterV,
            )}
            onClick={onClickBackBtn}
          >
            <LeftIcon className={gClasses.MR10} />
            <div
              className={cx(styles.Text, gClasses.Ellipsis)}
              title={fieldDisplayNameSelectedValue}
            >
              {fieldDisplayNameSelectedValue}
            </div>
          </button>

          <div className={cx(styles.Divider, gClasses.MB16)} />
        </>
      )}

      <div className={cx(gClasses.PX24, styles.FieldContent)}>
        {mainContent}
      </div>

      <div className={cx(styles.Divider, gClasses.MB16)} />

      <div className={cx(gClasses.RightH, gClasses.PX24)}>
        <Button buttonType={BUTTON_TYPE.LIGHT} onClick={onClickDiscard}>
          {BUTTONS.DISCARD}
        </Button>
        <Button className={gClasses.ML15} onClick={onClickApply}>
          {BUTTONS.APPLY}
        </Button>
      </div>
    </div>
  );
}

Config.propTypes = {
  isBackNeeded: PropTypes.bool,
  fieldDisplayNameSelectedValue: PropTypes.string,
  mainContent: PropTypes.object,
  onClickBackBtn: PropTypes.func,
  onClickApply: PropTypes.func,
  onClickDiscard: PropTypes.func,
};

export default Config;
