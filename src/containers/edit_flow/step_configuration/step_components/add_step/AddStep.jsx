import React, { useContext } from 'react';
import cx from 'classnames/bind';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import gClasses from 'scss/Typography.module.scss';
import { Button, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import {
  FLOW_STRINGS,
} from '../../../EditFlow.strings';
import ThemeContext from '../../../../../hoc/ThemeContext';
import UserImage from '../../../../../components/user_image/UserImage';
import styles from './AddStep.module.scss';

function AddStep(props) {
  const {
    stepText,
    noAddButton,
    className,
    textClassName,
    addIconClass,
    isCustomStepIcon,
    stepIcon,
    onClick,
  } = props;

  const { ADD_NEW_STEP, ADD_BUTTON } = FLOW_STRINGS.STEPS.ADD_STEP;
  const { buttonColor } = useContext(ThemeContext);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cx(
        styles.Container,
        gClasses.DashedBorder,
        gClasses.CenterVSpaceBetween,
        gClasses.W100,
        gClasses.CursorPointer,
        gClasses.BackgroundWhite,
        className,
      )}
      onClick={onClick}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick()}
    >
      <div className={cx(gClasses.CenterV, gClasses.FlexGrow1)}>
        {isCustomStepIcon ? (
          stepIcon
        ) : (
          <UserImage add className={cx(styles.AddBadge, addIconClass)} />
        )}
        <div
          className={cx(
            gClasses.FTwo13,
            gClasses.FontWeight500,
            gClasses.ML5,
            styles.textClassName,
            textClassName,
          )}
          style={{ color: buttonColor }}
        >
          {stepText || ADD_NEW_STEP}
        </div>
      </div>
      {!noAddButton && (
        <Button
          type={EButtonType.PRIMARY}
          className={gClasses.WidthFitContent}
          onClickHandler={onClick}
          buttonText={ADD_BUTTON}
        />
      )}
    </div>
  );
}

export default AddStep;

AddStep.defaultProps = {};
AddStep.propTypes = {};
