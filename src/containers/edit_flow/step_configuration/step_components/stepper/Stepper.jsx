import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import GreenTickRoundedIcon from 'assets/icons/GreenTickRoundedIcon';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import styles from './Stepper.module.scss';

function Stepper(props) {
  const { stepperDetails, currentProgress, className, stepIndexClass, savedProgress } = props;

  const stepperList = stepperDetails.map((eachStep, index) => (
    <div
      role="presentation"
      className={cx(
        styles.stepper__item,
        gClasses.FOne13GrayV5,
        gClasses.FontWeight500,
        gClasses.CursorPointer,
        index === currentProgress ? styles.current : index + 1 <= savedProgress && styles.SavedStep,
        className,
      )}
      onClick={eachStep.onClick}
      onKeyDown={keydownOrKeypessEnterHandle}
    >
      {(index + 1 <= savedProgress && index !== currentProgress) ? <GreenTickRoundedIcon className={gClasses.MR8} fillColor="#6ccf9c" /> : (
        <span
          className={cx(
            styles.StepperBadge,
            index === currentProgress && styles.ActiveBadge,
            stepIndexClass,
          )}
        >
          {index + 1}
        </span>
      )}
      {eachStep.text}
    </div>
  ));
  return (
    <div>
      <div className={styles.stepper}>{stepperList}</div>
    </div>
  );
}

export default Stepper;
