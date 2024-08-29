import { Label, Text } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FLOW_ADDON_STRINGS } from '../FlowAddOn.strings';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { isEmpty } from '../../../../../../utils/jsUtility';

function Identifier(props) {
    const {
        isSystemIdentifier,
        taskIdentifier = [],
        customIdentifier = {},
        categoryName = null,
        isLoading,
    } = props;

    const { t } = useTranslation();
    const { TITLE, UNIQUE_IDENTIFIER, TASK_IDENTIFIER, CUSTOM_IDENTIFER } = FLOW_ADDON_STRINGS(t).IDENTIFIER;

    const taskIdentifiers = taskIdentifier.map((field) => field?.fieldName);
    const NO_DATA = '-';

    return (
        <div>
            <Text
                content={TITLE}
                className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3, gClasses.MB16)}
                isLoading={isLoading}
            />
            {isSystemIdentifier ?
            <div>
                <Label labelName={TITLE} isLoading={isLoading} />
                <Text
                    content={UNIQUE_IDENTIFIER.SYSTEM_GENERATED.OPTIONS(isSystemIdentifier).label}
                    className={cx(gClasses.FTwo13BlackV20, gClasses.MB12)}
                    isLoading={isLoading}
                />
            </div> :
            <div>
                <Label labelName={CUSTOM_IDENTIFER.LABEL} isLoading={isLoading} />
                <Text
                    content={customIdentifier?.fieldName || NO_DATA}
                    className={cx(gClasses.FTwo13BlackV20, gClasses.MB12)}
                    isLoading={isLoading}
                />
            </div>}
            {/* Task Identifiers - Flow only */}
            <Text
                content={TASK_IDENTIFIER.LABEL}
                className={cx(gClasses.FontWeight500, gClasses.FTwo13Black, gClasses.MB8)}
                isLoading={isLoading}
            />
            <Text
                content={!isEmpty(taskIdentifiers) ? `${taskIdentifiers?.join(' ')}` : NO_DATA}
                className={cx(gClasses.FTwo13BlackV20, gClasses.MB12)}
                isLoading={isLoading}
            />
            <div>
                <Label labelName={FLOW_ADDON_STRINGS(t).CATEGORY.TITLE} isLoading={isLoading} />
                <Text
                    content={categoryName || NO_DATA}
                    className={cx(gClasses.FTwo13BlackV20, gClasses.MB24)}
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
