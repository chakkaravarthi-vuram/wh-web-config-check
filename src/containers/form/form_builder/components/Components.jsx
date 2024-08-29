import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import gClasses from '../../../../scss/Typography.module.scss';
import COMPONENTS_STRINGS from './Components.string';
import DraggableComponent from './draggable_component/DraggableComponent';
import styles from './Components.module.scss';

function Components(props) {
  const { isDisabled = false } = props;
  const { t } = useTranslation();
  const { LIST_OPTIONS } = COMPONENTS_STRINGS(t);
  return (
    <div disabled={isDisabled} className={cx(styles.ComponentDnd, isDisabled && gClasses.DisabledField)}>
      {LIST_OPTIONS.map((component) => (
        <DraggableComponent key={component.type} componentData={component} />
      ))}
    </div>
  );
}

export default Components;
