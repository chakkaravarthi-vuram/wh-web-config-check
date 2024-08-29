import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './AdminPages.module.scss';
import { ADMIN_ACCOUNTS_SUMMARY } from '../../../urls/RouteConstants';
import Accounts from './accounts/Accounts';
import AccountDetails from './account_details/AccountDetails';
import AccountsSummary from './accounts_summary/AccountsSummary';

function AdminPages() {
  const { id, tab } = useParams();

  let RenderComponent = null;

  if (id) {
    RenderComponent = <AccountDetails accountId={id} />;
  } else {
    switch (tab) {
      case ADMIN_ACCOUNTS_SUMMARY:
        RenderComponent = <AccountsSummary />;
        break;
      default:
        RenderComponent = <Accounts />;
        break;
    }
  }

  return <div className={styles.PageOuterContainer}>{RenderComponent}</div>;
}

export default AdminPages;
