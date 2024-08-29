import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { Button, EButtonType, Label, SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import style from '../../AutomatedSystems.module.scss';
import UserPicker from '../../../user_picker/UserPicker';
import StepActorAddIcon from '../../../../assets/icons/StepActorAddIcon';
import { AUTOMATED_SYSTEM_CONSTANTS } from '../../AutomatedSystems.strings';

function TriggerStepActors(props) {
    const { stepActors } = props;
    const { t } = useTranslation();
    const {
        COMMON_AUTOMATED_STRINGS,
    } = AUTOMATED_SYSTEM_CONSTANTS(t);

    return (
        <div>
            <Label labelName={COMMON_AUTOMATED_STRINGS.CONFIGURE_FIRST_STEP} className={cx(style.FieldLabel, gClasses.MT24, gClasses.MB8)} />
            <div className={cx(gClasses.CenterV, style.ActorRow)}>
                <SingleDropdown
                    className={cx(style.ActorDropdownMaxWidth)}
                    optionList={stepActors}
                    selectedValue={1}
                />
                <div className={cx(style.Divider, gClasses.ML16, gClasses.MR16)} />
                <UserPicker
                    hideLabel
                />
            </div>
            <Button buttonText={COMMON_AUTOMATED_STRINGS.ADD_ACTOR_OPTION} icon={<StepActorAddIcon />} type={EButtonType.TERTIARY} className={style.StepActorButton} />
        </div>
    );
}
export default TriggerStepActors;

TriggerStepActors.propTypes = {
    stepActors: PropTypes.array,
};
