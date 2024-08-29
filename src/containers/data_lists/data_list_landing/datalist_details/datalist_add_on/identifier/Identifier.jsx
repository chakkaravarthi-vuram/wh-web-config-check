import { Label, Text } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { DATALIST_ADDON_STRINGS } from '../DatalistAddOn.strings';
import gClasses from '../../../../../../scss/Typography.module.scss';

function Identifier(props) {
    const {
        dataListAddOnInfo: {
            isSystemIdentifier,
            customIdentifier = {},
            uniqueField,
            categoryName,
        },
        isLoading,
    } = props;

    const NO_DATA = '-';
    const { t } = useTranslation();
    const { TITLE, UNIQUE_IDENTIFIER, UNIQUE_FIELD, CUSTOM_IDENTIFER } = DATALIST_ADDON_STRINGS(t).IDENTIFIER;

    const getUniqueIdentifier = () => {
        let label = null;
        let content = null;
        if (isSystemIdentifier) {
            label = TITLE;
            content = UNIQUE_IDENTIFIER.SYSTEM_GENERATED.OPTIONS(isSystemIdentifier).label;
        } else {
            label = CUSTOM_IDENTIFER.LABEL;
            content = customIdentifier?.fieldName;
        }
        return (
            <div>
                <Label labelName={label} isLoading={isLoading} />
                <Text
                    content={content}
                    className={cx(gClasses.FTwo13BlackV20, gClasses.MB16)}
                    isLoading={isLoading}
                />
            </div>
        );
    };

    return (
        <div className={gClasses.MB24}>
            <Text
                content={TITLE}
                className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3, gClasses.MB12)}
                isLoading={isLoading}
            />
            {getUniqueIdentifier()}
            <div>
                <Label labelName={UNIQUE_FIELD.LABEL} isLoading={isLoading} />
                <Text
                    content={uniqueField?.fieldName || NO_DATA}
                    className={cx(gClasses.FTwo13BlackV20, gClasses.MB16)}
                    isLoading={isLoading}
                />
            </div>
            <div>
                <Label labelName={DATALIST_ADDON_STRINGS(t).CATEGORY.TITLE} isLoading={isLoading} />
                <Text
                    content={categoryName || NO_DATA}
                    className={cx(gClasses.FTwo13BlackV20, gClasses.MB16)}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}

export default Identifier;

Identifier.propTypes = {
    isSystemIdentifier: PropTypes.bool,
    taskIdentifier: PropTypes.array,
    customIdentifier: PropTypes.object,
};
