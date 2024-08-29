import React from 'react';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import styles from './CompressedFormula.module.scss';

function CompressedFormula() {
    return (
        <div className={cx(styles.Container, BS.D_FLEX)}>
            <div className={cx(styles.FunctionContainer, gClasses.CenterVH)}>
                <div className={cx(styles.FunctionSymbol, gClasses.Italics)}>fx</div>
            </div>
            <div className={styles.FormulaContainer}>
                <div className={cx(gClasses.FTwo12GrayV3, gClasses.FontWeight500)}>currency ( Quantity * Price )</div>
            </div>
        </div>
    );
}
export default CompressedFormula;
