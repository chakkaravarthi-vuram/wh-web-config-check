import React from 'react';
import cx from 'classnames/bind';

import DroppableWrapper from 'components/form_builder/dnd/droppable_wrapper/DroppableWrapper';
import DraggableWrapper from 'components/form_builder/dnd/draggable_wrapper/DraggableWrapper';
import gClasses from 'scss/Typography.module.scss';
import Metric from './metrics/Metric';
import styles from './metrics/Metric.module.scss';

function MetricList(props) {
  const { list, onMetricDragEndHandler, validateMetric, onChangeHandler, onSaveHandler, onLoadMoreData, onSearchFieldData, disableDND } = props;
  console.log('getCardMainContent metricList', list);
  const metricList = list.map((metricData, index) => (
      <DraggableWrapper
        className={cx(gClasses.MB5, styles.Metric)}
        id="flow_metric"
        index={index}
        enableDragAndDrop={!disableDND}
        enableIsDragging
        role="listitem"
      >
        <Metric
          index={index}
          metricData={metricData}
          key={`flow_metric_${index}`}
          validateMetric={validateMetric}
          onChangeHandler={onChangeHandler}
          onSaveHandler={onSaveHandler}
          onLoadMoreData={onLoadMoreData}
          onSearchFieldData={onSearchFieldData}
          className={(disableDND) && gClasses.MB5}
          list={list}
        />
      </DraggableWrapper>
    ));

  return (
    <DroppableWrapper
        id="flow_metrics"
        index={0}
        onFieldDragEndHandler={onMetricDragEndHandler}
        enableDragAndDrop
        role="list"
    >
        {metricList}
    </DroppableWrapper>
  );
}
export default MetricList;
