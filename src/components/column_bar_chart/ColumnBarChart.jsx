import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import { BS } from '../../utils/UIConstants';
import styles from './ColumnBarChart.module.scss';
import gClasses from '../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export default function ColumnBarChart(props) {
  const { className, barChartData } = props;

  // const barChartData = [
  //   { name: 'Apple', count: 100 },
  //   { name: 'Orange', count: 50 },
  //   { name: 'Guava', count: 10 },
  //   { name: 'Berry', count: 15 },
  //   { name: 'Jack', count: 1 },
  //   { name: 'Berry', count: 15 },
  //   { name: 'Berry', count: 15 },
  //   { name: 'Apple', count: 100 },
  //   { name: 'Orange', count: 50 },
  //   { name: 'Guava', count: 10 },
  //   { name: 'Berry', count: 15 },
  //   { name: 'Jack', count: 1 },
  //   { name: 'Berry', count: 15 },
  //   { name: 'Berry', count: 15 },
  // ];

  const barHeight = 200;
  const maxCount = barChartData.reduce((a, b) => (a.count > b.count ? a : b)).count;
  const bars = barChartData.map((eachBar) => {
    const height = eachBar.count / maxCount;
    return (
      <div
        className={cx(BS.D_FLEX, gClasses.FlexDirectionColumn, gClasses.ML30, BS.W100)}
        style={{
          minWidth: '75px',
        }}
      >
        <div className={cx(gClasses.CenterH, gClasses.FTwo11GrayV2)}>{eachBar.count}</div>
        <div className={cx(styles.Bar, gClasses.CenterVH, BS.W100)} style={{ height: `${barHeight * height}px` }} />
        <div className={cx(BS.TEXT_CENTER, gClasses.FTwo11GrayV2, gClasses.Ellipsis, gClasses.MT10)} title={eachBar.name}>
          {eachBar.name}
        </div>
      </div>
    );
  });
  return (
    <div className={cx(BS.D_FLEX, BS.P_RELATIVE, className)}>
      <div className={cx(styles.VerticalLine, BS.P_ABSOLUTE)} />
      <div
        className={cx(gClasses.OverflowXAuto, gClasses.ScrollBar, gClasses.PB10)}
        style={{ minWidth: '300px', marginTop: '32px' }}
      >
        <div className={cx(BS.D_FLEX, BS.AI_END, BS.JC_BETWEEN)}>{bars}</div>
        <div className={cx(styles.HorizontalLine, BS.P_ABSOLUTE, BS.W100)} />
      </div>
    </div>
  );
}

ColumnBarChart.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

ColumnBarChart.defaultProps = {
  className: EMPTY_STRING,
};
