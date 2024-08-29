import React from 'react';
import PropType from 'prop-types';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

function HalfDoughnut(props) {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
  );
  const { data, children, className } = props;
  const optionsData = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: 270,
    circumference: 180,
    cutout: '60%',
    borderWidth: 0,
    plugins: {
      title: false,
      subtitle: false,
      legend: {
        position: 'bottom',
      },
    },
  };
  return (
    <div className={className}>
      <Doughnut data={data} options={optionsData}>
        {children}
      </Doughnut>
    </div>
  );
}
export default HalfDoughnut;

HalfDoughnut.defaultProps = {
  className: EMPTY_STRING,
  children: null,
};
HalfDoughnut.propTypes = {
  data: PropType.object.isRequired,
  children: PropType.oneOfType([PropType.object, PropType.element]),
  className: PropType.string,
};
