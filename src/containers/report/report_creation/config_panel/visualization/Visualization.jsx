import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './Visualization.module.scss';

function Visualization(props) {
  const { visualizationTypes, onVisualizationChange } = props;
  return (
    <div className={styles.Visualization}>
      {visualizationTypes.map((visualizationType) => (
        <button
          title={visualizationType.name}
          id={`v_${visualizationType.id}`}
          key={visualizationType.id}
          className={cx(styles.VisualizationButton, {
            [styles.Selected]: visualizationType.selected,
          })}
          onClick={() => onVisualizationChange(visualizationType)}
          disabled={visualizationType.disabled}
        >
          {visualizationType.icon}
        </button>
      ))}
    </div>
  );
}

Visualization.propTypes = {
  visualizationTypes: PropTypes.arrayOf(
    PropTypes.objectOf({
      is: PropTypes.string,
      name: PropTypes.string,
      icon: PropTypes.object,
      selected: PropTypes.bool,
      disabled: PropTypes.bool,
    }),
  ),
  onVisualizationChange: PropTypes.func,
};

export default Visualization;
