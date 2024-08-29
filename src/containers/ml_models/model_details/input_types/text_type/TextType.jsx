import React from 'react';
import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import styles from '../../ModelDetails.module.scss';

function TextComponent(props) {
    const { component_name, component_value } = props;
    console.log('Sample...', props);
    return (
        <div className={cx(gClasses.MT24)}>
            <Text
                alignment="left"
                content={component_name === 'Description' ? `${component_name}: ` : `${component_name} `}
                size="lg"
                skeletonProps={{
                    height: 16,
                    width: 100,
                }}
            />
            <Text
                alignment="left"
                content={component_value}
                size="md"
                skeletonProps={{
                    height: 16,
                    width: 100,
                }}
                className={cx(styles.SampleDescriptionValue)}
            />
        </div>
    );
}

export default TextComponent;
