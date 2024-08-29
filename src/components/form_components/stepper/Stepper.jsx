import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { ARIA_ROLES } from 'utils/UIConstants';
import ThemeContext from '../../../hoc/ThemeContext';
import CorrectIcon from '../../../assets/icons/CorrectIcon';
import styles from './Stepper.module.scss';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import gClasses from '../../../scss/Typography.module.scss';
import HelpIcon from '../../../assets/icons/HelpIcon';

function Stepper(props) {
  const { buttonColor } = useContext(ThemeContext);
  const {
    list, currentStep, isEditView, isNewStep, className, onStepClick, isBulkUpload,
  } = props;
  const ARIA_LABEL = {
    CORRECT: 'Correct',
  };

  const stepperList = list.map((step, index) => {
    const done = index < currentStep;
    const current = index === currentStep;
    const currentClassName = current ? styles.CurrentStep : EMPTY_STRING;
    let doneClassName = EMPTY_STRING;
    let stepIndexContent = null;
    const stepIconClicked = () => onStepClick(index);
    console.log('isEditView && !current && !isNewStep', isEditView && !current && !isNewStep, done, list);
    if (isEditView && !current && !isNewStep) {
      doneClassName = styles.CompletedStep;
      stepIndexContent = <CorrectIcon role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.CORRECT} className={cx(styles.CorrectIcon)} onClick={stepIconClicked} />;
    } else if (done) {
      doneClassName = styles.CompletedStep;
      stepIndexContent = <CorrectIcon role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.CORRECT} className={cx(styles.CorrectIcon, { [gClasses.CursorPointer]: !isBulkUpload })} onClick={stepIconClicked} />;
    }
    const classes = cx(styles.Step, currentClassName, doneClassName);
    return (
      <li className={classes} key={`stepper${index}`}>
        <span className={cx(styles.StepIndex)} style={current ? { backgroundColor: 'white' } : null}>
          {stepIndexContent}
        </span>
        <div className={cx(gClasses.CenterV)}>
          <div
            className={cx(styles.StepLabel, gClasses.FTwo13, current && gClasses.FontWeight500)}
            style={current ? { color: buttonColor } : null}
          >
            {step.label}
          </div>
          {step.helperTooltipMessage ? (
            <HelpIcon
              className={cx(gClasses.ML5)}
              title={step.helperTooltipMessage}
              id={step.id}
            />
          ) : null}
        </div>
      </li>
    );
  });
  return <ul className={cx(styles.Stepper, className)}>{stepperList}</ul>;
}
Stepper.defaultProps = {
  list: [],
  isEditView: false,
  isNewStep: false,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
Stepper.propTypes = {
  list: PropTypes.arrayOf(PropTypes.any),
  isEditView: PropTypes.bool,
  isNewStep: PropTypes.bool,
  className: null,
  currentStep: PropTypes.number.isRequired,
};
export default Stepper;
