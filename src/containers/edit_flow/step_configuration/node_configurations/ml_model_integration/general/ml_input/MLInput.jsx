import React from 'react';
import cx from 'classnames/bind';
import { InputTreeLayout, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import styles from './MLInput.module.scss';
import RowComponent from './RowComponent';
import { ML_MODEL_INTEGRATION_STRINGS } from '../../MLModelIntegration.strings';

function MLINput() {
    const { t } = useTranslation();

    const { MODEL_DETAILS } = ML_MODEL_INTEGRATION_STRINGS(t).GENERAL;
    const { MODEL_INPUT } = MODEL_DETAILS;

    console.log('MLInput');
    return (
        <div>
            <Text
                className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3, gClasses.MT24)}
                content={MODEL_INPUT.TITLE}
            />
            <Text
                className={cx(gClasses.FontWeight500, gClasses.FTwo13GrayV3, gClasses.MB12, gClasses.MT12)}
                content={MODEL_INPUT.LABEL}
            />
            <InputTreeLayout
                tableHeaders={MODEL_INPUT.HEADERS}
                innerTableClass={styles.InputTreeRow}
                headerRowClass={cx(styles.InputTreeHeaderRow)}
                headerStyles={[
                cx(styles.ParamNameFlex, gClasses.FTwo13GrayV89),
                cx(styles.TypeFlex, gClasses.FTwo13GrayV89),
                styles.ValueNameFlex,
                ]}
                data={[
                {
                    key: 'Contract Number',
                    fieldType: 'Text',
                    value: null,
                },
                ]}
                depth={0}
                maxDepth={3}
                RowComponent={RowComponent}
                keyLabels={{
                childKey: 'child_rows',
                typeKey: 'type',
                addKey: 'add key',
                requiredKey: 'isRequired',
                addRowText: 'Add More',
                }}
                hideRootAdd={false}
            />
        </div>
    );
}

export default MLINput;
