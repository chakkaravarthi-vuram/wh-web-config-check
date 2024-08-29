import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import NoEventParamsIcon from 'assets/icons/integration/NoEventParamsIcon';
import styles from './NoRequestInputs.module.scss';

function NoRequestInputs(props) {
    const {
        className,
        noDataFoundMessage,
    } = props;

    return (
        <div className={cx(gClasses.CenterVH, styles.NoParamsContainer, className)}>
          <div className={cx(gClasses.CenterVH, BS.FLEX_COLUMN)}>
            <NoEventParamsIcon />
            <div className={cx(styles.NoDataInfo, gClasses.MT30)}>
              {noDataFoundMessage}
            </div>
          </div>
        </div>
    );
}

export default NoRequestInputs;
