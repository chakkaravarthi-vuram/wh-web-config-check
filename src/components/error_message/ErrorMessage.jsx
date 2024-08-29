import { ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';

function ErrorMessage(props) {
    const { errorMessage, className } = props;
    return (
        <Text
            content={errorMessage}
            size={ETextSize.XS}
            className={cx(gClasses.RedV22, gClasses.WhiteSpaceNormal, className)}
        />
    );
}

export default ErrorMessage;
