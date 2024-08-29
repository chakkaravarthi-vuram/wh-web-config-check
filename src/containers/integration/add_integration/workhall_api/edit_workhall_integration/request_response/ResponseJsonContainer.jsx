import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import styles from './RequestResponse.module.scss';
import { BODY_ROW_ID, COMPONENTS_ID } from '../../../../Integration.constants';
import CopyIcon from '../../../../../../assets/icons/integration/CopyIcon';
import GreenTickIcon from '../../../../../../assets/icons/form_post_operation_feedback/GreenTickIcon';

const getData = (data) => {
    if (data.is_deleted) return {};
    let valueStart = EMPTY_STRING;
    let valueEnd = EMPTY_STRING;
    let valueString;
    const jsonStringArr = [];
    const component = [];
    const valueComponent = [];
    const isObject = data.keyType === 'object';
    const childJsonComponent = [];
    if (isObject) {
        valueStart = '{';
        valueEnd = '}';
        const childJsonStringArr = [];
        const columnMapping = data?.[BODY_ROW_ID.COLUMN_MAPPING] || data?.[BODY_ROW_ID.COLUMN_MAPPING_SAMPLE] || [];
        columnMapping.forEach((child) => {
            const formattedData = getData(child);
            if (formattedData?.jsonStringArr?.length > 0) {
                childJsonStringArr.push(...formattedData.jsonStringArr);
                childJsonComponent.push(formattedData.component);
            }
        });
        if (childJsonStringArr.length > 0 && childJsonStringArr[childJsonStringArr.length - 1] === ',') {
            childJsonStringArr.splice(childJsonStringArr.length - 1, 1);
            const lastItem = childJsonComponent[childJsonComponent.length - 1];
            lastItem.splice(lastItem.length - 1, 1);
            childJsonComponent[childJsonComponent.length - 1] = lastItem;
        }
        valueString = childJsonStringArr.join(EMPTY_STRING);
        valueComponent.push(
            <li className={gClasses.PL10}>
                {
                    childJsonComponent.map((item, index) => (
                        <span key={`child-${index}`} className={gClasses.DisplayBlock}>
                            {item}
                            <br />
                        </span>
                    ))
                }
            </li>,
        );
    } else {
        valueString = `"${data.keyType || EMPTY_STRING}"`;
        valueComponent.push(<span>{`"${data.keyType || EMPTY_STRING}"`}</span>);
    }
    if (data.is_multiple) {
        valueStart = `[${valueStart}`;
        valueEnd = `${valueEnd}]`;
    }
    jsonStringArr.push(`"${data.key || EMPTY_STRING}":${valueStart}${valueString}${valueEnd}`);
    jsonStringArr.push(',');

    component.push(
        <span>&quot;</span>,
        <span className={styles.ResponseKey}>{data.key}</span>,
        <span>&quot;:</span>,
        <span>{valueStart}</span>,
        valueComponent,
        <span>{valueEnd}</span>,
        <span>,</span>,
    );
    return {
        jsonStringArr,
        component,
    };
};

function ResponseJsonContainer(props) {
    const {
        title,
        responseData = [],
    } = props;
    const jsonDataComponent = [];
    const jsonStringFinal = [];
    const [isCopyTickClientId, setCopyTickClientId] = useState(false);
    jsonStringFinal.push('{');
    (responseData).forEach((data, index) => {
        const formattedData = getData(data, (index === responseData.length - 1));
        if (formattedData?.jsonStringArr?.length > 0) {
            jsonStringFinal.push(...formattedData.jsonStringArr);
            jsonDataComponent.push(formattedData.component);
        }
    });
    if (jsonStringFinal[jsonStringFinal.length - 1] === ',') {
        jsonStringFinal.splice(jsonStringFinal.length - 1, 1);
        const lastItem = jsonDataComponent[jsonDataComponent.length - 1];
        lastItem.splice(lastItem.length - 1, 1);
        jsonDataComponent[jsonDataComponent.length - 1] = lastItem;
    }

    jsonStringFinal.push('}');
    const onCopyClick = async () => {
        try {
            const jsonString = jsonStringFinal.join(EMPTY_STRING);
            const parsedString = JSON.parse(jsonString);
            console.log(jsonString, 'jsonString', parsedString);
            await navigator.clipboard.writeText(JSON.stringify(parsedString, null, 2));
            setCopyTickClientId(true);
        } catch (error) {
            console.log('copy text failed', error);
        }
    };
    useEffect(() => {
        if (isCopyTickClientId) {
            const timeoutId = setTimeout(() => {
                setCopyTickClientId(false);
            }, 3000);
            return () => clearTimeout(timeoutId);
        }
        return () => { };
    }, [isCopyTickClientId]);
    return (
        <>
            <div className={gClasses.DisplayFlex}>
                <Text content={title} size={ETextSize.LG} />
                <div className={cx(gClasses.TextAlignRight, gClasses.FlexGrow1)}>
                    {
                        isCopyTickClientId ?
                            (<GreenTickIcon />)
                            : (
                                <button id={COMPONENTS_ID.COPY.SAMPLE_BODY} onClick={onCopyClick}>
                                    <CopyIcon />
                                </button>
                            )
                    }
                </div>
            </div>
            <div className={styles.ResponseContainer}>
                <ul>
                    <li>{'{'}</li>
                    <li className={gClasses.PL10}>
                        {
                            jsonDataComponent.map((item, index) => (
                                <span key={index} className={gClasses.DisplayBlock}>
                                    {item}
                                    <br />
                                </span>
                            ))
                        }
                    </li>
                    <li>{'}'}</li>
                </ul>
            </div>
        </>
    );
}

export default ResponseJsonContainer;
