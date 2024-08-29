import React, { useState } from 'react';
import cx from 'classnames/bind';
import { InputTreeLayout, RadioGroup, RadioGroupLayout, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import styles from './SaveResponse.module.scss';
import RowComponent from './RowComponent';
import { ML_MODEL_INTEGRATION_STRINGS } from '../../MLModelIntegration.strings';

function SaveResponse() {
    console.log('saveResponse');
    const { t } = useTranslation();
    const [saveResponse, setSaveResponse] = useState(false);

    const { SAVE_RESPONSE } = ML_MODEL_INTEGRATION_STRINGS(t).GENERAL.MODEL_DETAILS.MODEL_INPUT;

    return (
        <div className={gClasses.MT24}>
            <Text
                className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3)}
                content={SAVE_RESPONSE.TITLE}
            />
            <RadioGroup
                labelText={SAVE_RESPONSE.IS_SAVE_RESPONSE.LABEL}
                selectedValue={saveResponse}
                options={SAVE_RESPONSE.IS_SAVE_RESPONSE.OPTIONS}
                labelClassName={cx(styles.FieldLabel, styles.RadioLabelMargin)}
                optionClassName={gClasses.BlackV12}
                layout={RadioGroupLayout.stack}
                onChange={() => setSaveResponse(!saveResponse)}
                className={cx(gClasses.MT12, gClasses.MB12)}
            />
            {saveResponse &&
                <div className={gClasses.MT12}>
                    <Text
                        className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3, gClasses.MB12)}
                        content={SAVE_RESPONSE.RESPONSE_DETAILS.TITLE}
                    />
                    <InputTreeLayout
                        tableHeaders={SAVE_RESPONSE.TABLE_HEADERS}
                        innerTableClass={styles.InputTreeRow}
                        headerRowClass={cx(styles.InputTreeHeaderRow)}
                        headerStyles={[
                        cx(styles.ColumnsFlex, gClasses.FTwo13GrayV89),
                        cx(styles.ColumnsFlex, gClasses.FTwo13GrayV89),
                        styles.ColumnsFlex,
                        styles.DeleteIcon,
                        ]}
                        data={[
                        {
                            key: 'Contract Number11111',
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
            }
        </div>
    );
}

export default SaveResponse;
