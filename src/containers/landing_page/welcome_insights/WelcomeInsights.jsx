import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import Skeleton from 'react-loading-skeleton';
import styles from './WelcomeInsights.module.scss';

function WelcomeInsights(props) {
    const { state, className } = props;
    const { WelcomeMessage, WorkloadMessage, isDataLoading } = state;

    return (
        isDataLoading ?
        <Skeleton height={96} className={className} /> :
        <div className={cx(styles.WelcomeContainer, className)}>
            <div className={cx(gClasses.FTwoWhite, styles.HeaderLine, gClasses.FontWeight600, gClasses.LineHeightV4)}>{WelcomeMessage}</div>
            <div className={cx(gClasses.FTwo12WhiteV4, gClasses.MT4, gClasses.LineHeightV3, styles.WorkLoadMessage)}>{WorkloadMessage}</div>
        </div>
    );
}

const mapStateToProps = ({ WelcomeInsightReducer }) => {
    return {
        state: WelcomeInsightReducer,
    };
  };

export default connect(mapStateToProps, null)(WelcomeInsights);
