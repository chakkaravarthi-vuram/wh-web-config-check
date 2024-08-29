import React from 'react';
import { Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import styles from '../../ModelDetails.module.scss';
import { getFormattedText } from '../../../MLModels.utils';

function TextComponent(props) {
    const { component_name, component_value } = props;
    const formattedData = getFormattedText(component_value);
    return (
        <div className={cx(gClasses.MT15)}>
            <Text
                alignment="left"
                content={component_name === 'Description' ? `${component_name}: ` : `${component_name} `}
                size={ETextSize.LG}
                skeletonProps={{
                    height: 16,
                    width: 100,
                }}
            />
            <Text
                content={formattedData.formattedText}
                size={ETextSize.MD}
                skeletonProps={{
                    height: 16,
                    width: 100,
                }}
                className={cx(styles.SampleDescriptionValue, formattedData.className)}
            />
        </div>
    );
}

export default TextComponent;
