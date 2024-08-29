import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import styles from './FormConfiguration.module.scss';

function ReadOnlyFormConfiguration() {
    const externalSources = [
        {
            name: 'Source 1',
        },
        {
            name: 'Source 2',
        },
    ];

    return (
        <div className={styles.ExternalSource}>
            <div className={cx(gClasses.FontWeight500, gClasses.FTwo12BlackV12, gClasses.MB18)}>
                External Source Data
            </div>
            {
                externalSources?.map?.((eachSource, index) =>
                    <div className={cx(styles.EachSource, index !== 0 && gClasses.MT12, gClasses.FontWeight500, gClasses.FTwo13BlackV12)}>
                        {eachSource?.name}
                    </div>,
                )
            }
        </div>
    );
}

export default ReadOnlyFormConfiguration;
