import React from 'react';

import styles from './Resend.module.scss';
import { } from '../../../../../redux/actions/FlowDashboard.Action';
import Header from './Header';
import Body from './Body';

function Resend() {
  return (
    <div className={`card ${styles.greenborderCard}`}>
      <Header />
      <Body />
    </div>
  );
}

export default Resend;
