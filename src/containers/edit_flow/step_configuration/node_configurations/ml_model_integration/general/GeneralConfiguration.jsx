import React, { useState } from 'react';
import cx from 'classnames/bind';
import { SingleDropdown, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import MLINput from './ml_input/MLInput';
import { ML_MODEL_INTEGRATION_STRINGS } from '../MLModelIntegration.strings';
import SaveResponse from './save_response/SaveResponse';

function GeneralConfiguration() {
    console.log('general');
    const { t } = useTranslation();
    const [model, setModel] = useState(EMPTY_STRING);

    const { MODEL_DETAILS } = ML_MODEL_INTEGRATION_STRINGS(t).GENERAL;
    const { CHOOSE_MODEL } = MODEL_DETAILS;

    return (
        <div>
            <Text
                className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3)}
                content={MODEL_DETAILS.TITLE}
            />
            <div className={cx(gClasses.MT12, gClasses.W40)}>
                <SingleDropdown
                    id={CHOOSE_MODEL.ID}
                    optionList={CHOOSE_MODEL.OPTIONS}
                    onClick={(value) => setModel(value)}
                    dropdownViewProps={{
                        labelName: CHOOSE_MODEL.LABEL,
                        isRequired: true,
                    }}
                    selectedValue={model}
                    errorMessage={EMPTY_STRING}
                    showReset
                />
            </div>
            {model &&
                <div>
                    <MLINput />
                    <SaveResponse />
                </div>
            }
        </div>
    );
}

export default GeneralConfiguration;
