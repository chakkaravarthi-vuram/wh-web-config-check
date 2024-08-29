import React from 'react';
import styles from './Resend.module.scss';

function Body() {
  return (
    <div id="headingThree" className="collapse show">
      <div className="card-body">
        <div className="row">
          <div className={styles.AccsummaryCircle} />
          <div className="col-11">
            <div className="row">
              <div className="col-6 mb-3">
                <div className="d-flex flex-row">
                  <div className="mr-3">
                    <span className={styles.Acclabel}>Start Date</span>
                    <span className={styles.Accbindtxt}>1-NOV-2019</span>
                  </div>
                  <div className="mr-3">
                    <span className={styles.Acclabel}>End Date</span>
                    <span className={styles.Accbindtxt}>1-NOV-2019</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Body;
