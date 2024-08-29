import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import styles from '../AppHome.module.scss';

function WelcomeMessage(props) {
    const { className, state } = props;
    const { WelcomeMessage, WorkloadMessage, isDataLoading } = state;

    return (
        !isDataLoading && (
        <div className={cx(styles.WelcomeContainer, gClasses.CenterVH, gClasses.FlexDirectionColumn, className)}>
            <div className={cx(gClasses.FTwoWhite, styles.HeaderLine, gClasses.FontWeight500)}>{WelcomeMessage}</div>
            <div className={cx(gClasses.FTwo12WhiteV4, gClasses.MT4, gClasses.LineHeightV3, styles.WorkLoadMessage)}>{WorkloadMessage}</div>
        </div>)
    );
}
const mapStateToProps = ({ WelcomeInsightReducer }) => {
    return {
        state: WelcomeInsightReducer,
    };
};

export default connect(mapStateToProps, null)(WelcomeMessage);
