import React, { useState, useEffect } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { TextArea, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../ModelResult.module.scss';
import CopyIcon from '../../../../../assets/icons/integration/CopyIcon';
import GreenTickIcon from '../../../../../assets/icons/form_post_operation_feedback/GreenTickIcon';
import { BS } from '../../../../../utils/UIConstants';
import DownloadIconV2 from '../../../../../assets/icons/form_fields/DownloadIconV2';

function RawDataComponent(props) {
    const { raw_data } = props;
    const jsonData = JSON.stringify(raw_data, null, 2);
    const [isCopyTickClientId, setCopyTickClientId] = useState(false);

    useEffect(() => {
        if (isCopyTickClientId) {
            const timeoutId = setTimeout(() => {
                setCopyTickClientId(false);
            }, 3000);
            return () => clearTimeout(timeoutId);
        }
        return () => { };
    }, [isCopyTickClientId]);

    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(jsonData);
            setCopyTickClientId(true);
        } catch (error) {
            console.log('copy text failed', error);
        }
      };
      const downloadJsonFile = () => {
        const jsonString = jsonData;
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

    return (
        <div>
            <div className={cx(styles.Iconcontainer, BS.D_FLEX)}>
            <DownloadIconV2 className={cx(gClasses.ML10, gClasses.MT5, styles.IconClass)} onClick={downloadJsonFile} />

            {
                        isCopyTickClientId ?
                            (<GreenTickIcon className={cx(gClasses.ML10, gClasses.MT5)} />)
                            : (
                            <CopyIcon className={cx(gClasses.ML10, gClasses.MT5, styles.IconClass)} onClick={handleCopyClick} />
                            )
                    }
            </div>
        <TextArea
                labelText="Extracted Text"
                size={ETextSize.LG}
                value={jsonData}
                inputClassName={styles.FormattedOutputText}
                inputInnerClassName={styles.FormattedOutputText}
        />
        </div>
    );
}

export default RawDataComponent;
