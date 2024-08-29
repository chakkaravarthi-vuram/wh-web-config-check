import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { Button } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './NoDataComponent.module.scss';
import PlusIconNew from '../../assets/icons/PlusIconV2';
import { BS } from '../../utils/UIConstants';

function NoDataComponent(props) {
    const {
        noDataIcon,
        className,
        iconClass,
        mainTitle,
        mainTitleClass,
        subTitle,
        subTitleClass,
        createButtonText,
        onCreateButtonClick,
        innerClass,
    } = props;

    return (
        <div className={cx(gClasses.CenterVH, BS.H100, className)}>
            <div className={innerClass}>
                <div className={cx(iconClass, gClasses.MB16)}>
                    {noDataIcon}
                </div>
                <div className={cx(mainTitleClass, gClasses.MB6, styles.IconTitle)}>
                    {mainTitle}
                </div>
                <div className={cx(subTitleClass, gClasses.MB30, styles.IconSubtitle)}>
                    {subTitle}
                </div>
                {createButtonText &&
                <div className={gClasses.CenterH}>
                    <Button
                        buttonText={createButtonText}
                        icon={<PlusIconNew />}
                        onClickHandler={onCreateButtonClick}
                    />
                </div>
                }
            </div>
        </div>
    );
}

export default NoDataComponent;
