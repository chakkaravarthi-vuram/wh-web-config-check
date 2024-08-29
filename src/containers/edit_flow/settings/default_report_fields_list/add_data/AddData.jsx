import React, { useContext } from 'react';
import cx from 'classnames/bind';
import ThemeContext from 'hoc/ThemeContext';
import UserImage from 'components/user_image/UserImage';

import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { KEY_CODES } from 'utils/Constants';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { useTranslation } from 'react-i18next';
import styles from './AddData.module.scss';

function AddStep(props) {
  const { onClick } = props;
  const { ADD_NEW_DATA } = FLOW_STRINGS.SETTINGS.ADD_DATA;
  const { buttonColor } = useContext(ThemeContext);
  const onKeyDownHandler = (event) => {
    if ((event.which && event.which === KEY_CODES.ENTER) || (event.keyCode && event.keyCode === KEY_CODES.ENTER)) {
      onClick();
    }
  };
  const { t } = useTranslation();
  return (
    <div
      className={cx(
        styles.Container,
        gClasses.DashedBorder,
        gClasses.CenterV,
        BS.JC_BETWEEN,
        gClasses.ClickableElement,
        BS.W100,
        gClasses.CursorPointer,
        gClasses.MB15,
      )}
      onClick={onClick}
      onKeyDown={onKeyDownHandler}
      tabIndex="0"
      role="button"
    >
      <div className={cx(gClasses.CenterV, gClasses.FlexGrow1)}>
        <UserImage add className={styles.AddBadge} />
        <div
          className={cx(gClasses.FTwo14, gClasses.FontWeight500, gClasses.ML15)}
          style={{ color: buttonColor }}
        >
          {t(ADD_NEW_DATA)}
        </div>
      </div>
      {/* <Button buttonType={BUTTON_TYPE.OUTLINE_PRIMARY} className={cx(gClasses.WidthFitContent, styles.BtnAdd)}>
        {ADD_BUTTON} // removing duplicate add button
      </Button> */}
    </div>
  );
}
export default AddStep;
