import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import GreenTickRoundedIcon from 'assets/icons/GreenTickRoundedIcon';
import SideArrow from 'assets/icons/SideArrow';
import styles from './NewStepper.module.scss';

function NewStepper(props) {
  const { stepperDetails, currentProgress, className, stepIndexClass, savedProgress } = props;
  const stepperList = stepperDetails?.map((eachStep, index) => {
    console.log('neoifdkpsla;', index, savedProgress, currentProgress, stepperDetails, index - 1 <= savedProgress, index !== currentProgress);
    return (
    <div
      className={cx(
        gClasses.FOne13GrayV5,
        gClasses.FontWeight500,
        gClasses.CursorPointer,
        className,
        index !== 0 && gClasses.ML14,
      )}
    >
      {(index + 1 < savedProgress && index !== currentProgress) ?
      <GreenTickRoundedIcon className={cx(gClasses.MR12, styles.Completed)} fillColor="#2F9461" /> : index + 1 === currentProgress ?
      (
        <span
          className={cx(
            stepIndexClass,
            gClasses.MR12,
            styles.CurrentProgress,
            gClasses.FTwo14White,
            gClasses.FontWeight500,
          )}
        >
          {index + 1}
        </span>
      ) : (
        <span
          className={cx(
            stepIndexClass,
            gClasses.MR12,
            styles.OtherProgress,
            gClasses.FTwo14Gray89,
          )}
        >
          {index + 1}
        </span>
      )}
      <span
          className={cx(
            stepIndexClass,
            gClasses.FTwo14Gray89,
            gClasses.FontWeight500,
          )}
      >
      {eachStep.text}
      </span>
      {index !== stepperDetails.length - 1 && (
        <div className={cx(gClasses.ML12, stepIndexClass)}>
        <SideArrow />
        </div>
      )}
    </div>);
});
  return (
    <div>
      <div className={styles.stepper}>{stepperList}</div>
    </div>
  );
}

export default NewStepper;
