import { Button, EButtonSizeType, EButtonType, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { ADD_NEW_STEP_STRINGS } from './FlowNodeDropDown.constants';
import styles from './FlowNodeDropDown.module.scss';

function AddUserStep(props) {
  const {
    stepNameChangeHandler,
    createNewUserStep,
    newStepNameError,
    newStepName,
    showCancel,
    removeNode,
  } = props;
  const { t } = useTranslation();
  const strings = ADD_NEW_STEP_STRINGS(t);
  return (
    <div className={styles.SideMenu}>
      <TextInput
        labelText={strings.USER_STEP_NAME}
        labelClassName={cx(gClasses.MB8, styles.AddNewStep)}
        inputClassName={cx(styles.InputClass, styles.AddNewStep)}
        placeholder={strings.STEP_NAME_PLACEHOLDER}
        onChange={stepNameChangeHandler}
        onBlurHandler={(e) => stepNameChangeHandler(e, true)}
        value={newStepName}
        errorMessage={newStepNameError}
        suffixIcon={
          <Button
            type={EButtonType.PRIMARY}
            buttonText={strings.ADD}
            size={EButtonSizeType.SM}
            onClickHandler={createNewUserStep}
          />
        }
      />
      {
        showCancel && (
          <Button
            type={EButtonType.TERTIARY}
            buttonText={strings.CANCEL}
            size={EButtonSizeType.SM}
            onClickHandler={removeNode}
          />
        )
      }
    </div>
  );
}

export default AddUserStep;
