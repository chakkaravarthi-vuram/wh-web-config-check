import React from 'react';
import cx from 'classnames/bind';
import styles from './AdminPanel.module.scss';
import AdminPages from './admin_pages/AdminPages';
import gClasses from '../../scss/Typography.module.scss';
import { BS } from '../../utils/UIConstants';

function AdminPanel() {
  return (
    <div className={cx(styles.AdminPanelContainer, gClasses.W100, BS.D_FLEX)}>
        <AdminPages />
    </div>
  );
}

export default AdminPanel;
