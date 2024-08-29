import React from 'react';
import PropType from 'prop-types';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line as LineChart } from 'react-chartjs-2';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

function Line(props) {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineController,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );
  const { data, children, className } = props;
  return (
    <div className={className}>
      <LineChart data={data}>{children}</LineChart>
    </div>
  );
}
export default Line;

Line.defaultProps = {
  className: EMPTY_STRING,
  children: null,
};
Line.propTypes = {
  data: PropType.object.isRequired,
  children: PropType.oneOfType([PropType.object, PropType.element]),
  className: PropType.string,
};
