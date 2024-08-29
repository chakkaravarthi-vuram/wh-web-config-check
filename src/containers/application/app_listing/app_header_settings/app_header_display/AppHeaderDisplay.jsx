import { Radio } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { APP_HEADER_SETTINGS } from '../AppHeaderSettings.string';
import style from '../AppHeaderSettings.module.scss';
import { keydownOrKeypessEnterHandle } from '../../../../../utils/UtilityFunctions';

function AppHeaderDisplay(props) {
  const { headerType, setHeaderType } = props;
  const { t } = useTranslation();
  const { DISPLAY_SETTINGS } = APP_HEADER_SETTINGS(t);

  const onChangeHeaderDisplay = (value) => {
    setHeaderType(value);
  };

  return (
    <div className={gClasses.PR30}>
      {DISPLAY_SETTINGS.OPTIONS.map((option, index) => {
        const { value, label, image } = option;
        const id = `${DISPLAY_SETTINGS.ID}_${index}`;
        return (
            <div
              key={label}
              role="button"
              tabIndex={0}
              onClick={() => {
                onChangeHeaderDisplay(value);
              }}
              onKeyDown={(e) => {
                keydownOrKeypessEnterHandle(e) && onChangeHeaderDisplay(value);
              }}
              className={cx(style.RadioContainer, gClasses.P8, gClasses.MT15)}
            >
              <Radio
                id={id}
                name={label}
                label={label}
                checked={value === headerType}
                className={style.HeaderSpace}
              />
              <div className={gClasses.ML30}>{image}</div>
            </div>
        );
      })}
    </div>
  );
}

export default AppHeaderDisplay;
