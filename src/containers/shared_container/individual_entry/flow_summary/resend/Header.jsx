import React from 'react';
import cx from 'classnames/bind';

import styles from './Resend.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import CorrectIcon from '../../../../../assets/icons/CorrectIcon';

function Header() {
  const circleTextClass = cx(
    gClasses.FTwo12BlackV10,
    gClasses.FontWeight500,
    gClasses.CenterVH,
  );

  return (
    <div className={`card-header ${styles.cardheaderbg}`} id="headingOne">
      <div className="row">
        <div className="col-9">
          <div className={cx(styles.Circle1, styles.CreatedBG, circleTextClass, styles.AccsummaryCircle)}>
            <CorrectIcon className={styles.CorrectIcon} />
          </div>
          <span className={styles.AccTitle}>Created a leave request</span>
        </div>
        <div className="col-3">
          <span className={styles.AccCreatedtxt}>Re Send</span>
          {/* <span className={styles.Accdate}>On:09 Jan 2020</span> */}
        </div>
        {/* <div class="col-1">
          <UserImage firstName={"Lenin"} lastName={"Joy"} className={cx(styles.Bitmap, styles.mt2, styles.Thumbnail)}
          />
        </div> */}
      </div>
    </div>
  );
}

export default Header;
