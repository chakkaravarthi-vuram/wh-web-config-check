import React from 'react';
import cx from 'classnames';
import { ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../scss/Typography.module.scss';
import styles from './ReadOnlyField.module.scss';

function ReadOnlyField(props) {
    const {
        title,
        subTitle,
        className,
    } = props;
    return (
        <div className={cx(className, gClasses.MR16)}>
            <Text
                content={title}
                size={ETextSize.SM}
                className={cx(styles.Title, gClasses.FontWeight500)}
            />
            <Text
                content={subTitle}
                size={ETextSize.MD}
                className={cx(styles.SubTitle, gClasses.MB16)}
            />
        </div>
    );
}

export default ReadOnlyField;
