import React, { useContext } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../../../../hoc/ThemeContext';
import UserImage from '../../../../../../components/user_image/UserImage';

import styles from './AddData.module.scss';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { BS } from '../../../../../../utils/UIConstants';
import { FLOW_STRINGS } from '../../../../Flow.strings';
import { KEY_CODES } from '../../../../../../utils/Constants';

function AddStep(props) {
  const { onClick } = props;
  const { t } = useTranslation();
  const { ADD_NEW_DATA } = FLOW_STRINGS(t).CREATE_FLOW.SETTINGS.ADD_DATA;
  const { buttonColor } = useContext(ThemeContext);
  const onKeyDownHandler = (event) => {
    if ((event.which && event.which === KEY_CODES.ENTER) || (event.keyCode && event.keyCode === KEY_CODES.ENTER)) {
      onClick();
    }
  };

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
          {ADD_NEW_DATA}
        </div>
      </div>
      {/* <Button buttonType={BUTTON_TYPE.OUTLINE_PRIMARY} className={cx(gClasses.WidthFitContent, styles.BtnAdd)}>
        {ADD_BUTTON} // removing duplicate add button
      </Button> */}
    </div>
  );
}
export default AddStep;
