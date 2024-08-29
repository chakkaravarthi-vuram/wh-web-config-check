import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Button, Popper, TextInput, ETextSize, EButtonSizeType, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useDispatch } from 'react-redux';
import { useClickOutsideDetector } from '../../../../../../../utils/UtilityFunctions';
import PlusIconBlueNew from '../../../../../../../assets/icons/PlusIconBlueNew';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import styles from './CreateStepPopover.module.scss';
import { STEP_TYPE } from '../../../../../../../utils/Constants';
import { createNewStepWithCoordinates } from '../../../../../../../redux/actions/EditFlow.Action';
import { ACTION_TYPE } from '../../../../../../../utils/constants/action.constant';

function CreateStepPopover(props) {
  const { id, className, onSuccess, errorMessage = '', metaData, currentAction = {} } = props;
  const popperRef = useRef();
  const [popperOpen, setPopperOpen] = useState(false);
  const [stepName, setStepName] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onClose = () => {
    setPopperOpen(false);
    setError('');
    setStepName('');
  };

  useClickOutsideDetector(popperRef, onClose);

  const onNameChange = (e) => {
    setStepName(e.target.value);
    if (e.target.value) setError('');
  };

  const onCreateClick = () => {
    if (!stepName) {
      setError(t('form.form_button_config.body.step_name_required'));
      return;
    }

    let stepType;

    if (currentAction?.actionType === ACTION_TYPE.END_FLOW) {
      stepType = STEP_TYPE.END_FLOW;
    } else {
      stepType = STEP_TYPE.USER_STEP;
    }

    const params = {
      flow_id: metaData.moduleId,
      flow_uuid: metaData.moduleUUID,
      step_type: stepType,
      step_name: stepName,
    };

    dispatch(createNewStepWithCoordinates({ params })).then((data) => {
      onSuccess?.(data);
      setPopperOpen(false);
      setStepName('');
      setError('');
    }).catch((err) => {
      console.log('xyz createStep err', err);
    });
  };

  return (
    <div className={className} ref={popperRef}>
      <button
        className={gClasses.BlueIconBtn}
        onClick={() => setPopperOpen(!popperOpen)}
        ref={popperRef}
      >
        <PlusIconBlueNew className={cx(gClasses.MR3)} />
        {t('form.form_button_config.body.create_step')}
      </button>
      <Popper
        open={popperOpen}
        targetRef={popperRef}
        className={cx(styles.CreateStepPopover)}
        id={`${id}_create_step`}
        key={`${id}_create_step`}
        content={
          <div>
            <Text
              content={t('form.create_step.create_new_step')}
              size={ETextSize.MD}
              className={cx(gClasses.MB8, gClasses.LabelStyle)}
            />
            <TextInput
              id="new-step-name"
              placeholder={t('form.create_step.type_step_name_here')}
              className={gClasses.MB8}
              value={stepName}
              onChange={onNameChange}
              errorMessage={error || errorMessage}
            />
            <Button
              buttonText={t('form.create_step.create')}
              onClickHandler={onCreateClick}
              size={EButtonSizeType.SM}
              className={gClasses.MLA}
            />
          </div>
        }
      />
    </div>
  );
}

export default CreateStepPopover;
