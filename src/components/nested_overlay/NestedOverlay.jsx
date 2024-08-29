import React from 'react';
import cx from 'classnames/bind';
import styles from './NestedOverlay.module.scss';
import gClasses from '../../scss/Typography.module.scss';

function NestedOverlay(props) {
    const { className, primaryComponent, secondaryComponent } = props;
    console.log('multiple dropdown');

    return (
        <div className={cx(styles.DropdownsContainer, className)}>
            <div className={cx(gClasses.DisplayFlex, gClasses.JusEnd, gClasses.MB4)}>
                {secondaryComponent}
            </div>
            {primaryComponent}
        </div>
    );
}

export default NestedOverlay;
