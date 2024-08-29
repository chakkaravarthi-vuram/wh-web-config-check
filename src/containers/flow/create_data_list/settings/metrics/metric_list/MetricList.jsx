import React from 'react';
import cx from 'classnames/bind';

import DroppableWrapper from '../../../../../../components/form_builder/dnd/droppable_wrapper/DroppableWrapper';
import DraggableWrapper from '../../../../../../components/form_builder/dnd/draggable_wrapper/DraggableWrapper';
import Metric from './metrics/Metric';

import styles from './metrics/Metric.module.scss';
import gClasses from '../../../../../../scss/Typography.module.scss';

function MetricList(props) {
  const { list, onMetricDragEndHandler, validateMetric, onChangeHandler, onSaveHandler, onLoadMoreData, onSearchFieldData, disableDND } = props;
  const metricList = list.map((metricData, index) => (
      <DraggableWrapper
        className={cx(gClasses.MB5, styles.Metric)}
        id="datalist_metric"
        index={index}
        enableDragAndDrop={!disableDND}
        enableIsDragging
        role="listitem"
      >
        <Metric
          index={index}
          list={list}
          metricData={metricData}
          key={`datalist_metric_${index}`}
          validateMetric={validateMetric}
          onChangeHandler={onChangeHandler}
          onSaveHandler={onSaveHandler}
          onLoadMoreData={onLoadMoreData}
          onSearchFieldData={onSearchFieldData}
        />
      </DraggableWrapper>
    ));
  return (
    <DroppableWrapper
        id="datalist_metrics"
        index={0}
        onFieldDragEndHandler={onMetricDragEndHandler}
        enableDragAndDrop
    >
        {metricList}
    </DroppableWrapper>
  );
}
export default MetricList;
