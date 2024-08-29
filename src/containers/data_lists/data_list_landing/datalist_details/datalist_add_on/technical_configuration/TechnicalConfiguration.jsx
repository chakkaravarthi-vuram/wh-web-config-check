import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { Label, Text } from '@workhall-pvt-lmt/wh-ui-library';
import PropTypes from 'prop-types';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { DATALIST_ADDON_STRINGS } from '../DatalistAddOn.strings';

function TechnicalConfiguration(props) {
    const {
        shortCode,
        technicalReferenceName,
        isLoading,
    } = props;

    const { t } = useTranslation();
    const { TITLE, SHORT_CODE, TECHNICAL_REFERENCE_NAME } = DATALIST_ADDON_STRINGS(t).TECHNICAL_CONFIGURATION;

    return (
        <div>
            <Text
                content={TITLE}
                className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3, gClasses.MB12)}
                isLoading={isLoading}
            />
            <Label
                labelName={SHORT_CODE.LABEL}
                innerLabelClass={cx(gClasses.FTwo13Black, gClasses.FontWeight500, gClasses.MB8)}
                isLoading={isLoading}
            />
            <Text
                content={shortCode}
                className={cx(gClasses.FTwo13BlackV20, gClasses.MB16)}
                isLoading={isLoading}
            />
            <Label
                labelName={TECHNICAL_REFERENCE_NAME.LABEL}
                innerLabelClass={cx(gClasses.FTwo13Black, gClasses.FontWeight500, gClasses.MB8)}
                isLoading={isLoading}
            />
            <Text
                content={technicalReferenceName}
                className={gClasses.FTwo13BlackV20}
                isLoading={isLoading}
            />
        </div>
    );
}

export default TechnicalConfiguration;

TechnicalConfiguration.propTypes = {
    shortCode: PropTypes.string,
    technicalReferenceName: PropTypes.string,
};
