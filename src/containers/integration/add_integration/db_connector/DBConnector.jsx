import React from 'react';
import cx from 'classnames';
import styles from './DBConnector.module.scss';
import { EDIT_VIEW_INTEGRATION_TABS } from '../../Integration.utils';
import Authentication from './authentication/Authentication';
import Queries from './queries/Queries';

function DBConnector(props) {
  const { integrationEditTab, isEditView } = props;

  let tabComponent = null;

  if (integrationEditTab === EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION) {
    tabComponent = <Authentication isEditView={isEditView} />;
  } else {
    tabComponent = <Queries isEditView={isEditView} />;
  }

  return (
    <div
      className={cx(styles.MainContainer, {
        [styles.ViewModeContainer]: !isEditView,
      })}
    >
      {tabComponent}
    </div>
  );
}

export default DBConnector;
