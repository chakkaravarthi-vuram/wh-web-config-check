import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames/bind';
import { getDomainName } from 'utils/jsUtility';
import PropTypes from 'prop-types';
import ThemeContext from '../../hoc/ThemeContext';
import PageNotFoundIcon from '../../assets/icons/PageNotFoundIcon';
import gClasses from '../../scss/Typography.module.scss';
import PAGE_NOT_FOUND_LABELS from './PageNotFound.strings';
import { FORWARD_SLASH } from '../../utils/strings/CommonStrings';
import styles from './PageNotFound.module.scss';

function PageNotFound(props) {
  const { isFromSignin } = props;
  let primaryColor = null;
  const themeContext = useContext(ThemeContext);
  if (themeContext) {
    ({ primaryColor } = themeContext);
  }
  return (
    <div className={cx(gClasses.MT100, gClasses.CenterVH, styles.BGColor)} style={{ minWidth: '50vw' }}>
      <div>
        <PageNotFoundIcon primaryColor={primaryColor} />
        <div className={cx(gClasses.MT30, gClasses.PageNotFoundTitle)}>{PAGE_NOT_FOUND_LABELS.PAGE_NOT_FOUND_LABEL}</div>
        <div className={cx(gClasses.MT5, gClasses.PageNotFoundDesc)}>
          <div>{PAGE_NOT_FOUND_LABELS.PAGE_NOT_FOUND_DESC_1}</div>
          <div className={gClasses.MT3}>
            {PAGE_NOT_FOUND_LABELS.PAGE_NOT_FOUND_DESC_2}
            {!isFromSignin ? <Link to={FORWARD_SLASH}>{PAGE_NOT_FOUND_LABELS.PAGE_NOT_FOUND_DESC_3}</Link> :
            <a href={`https://${getDomainName(window.location.hostname)}${window.location.search}`}>{PAGE_NOT_FOUND_LABELS.PAGE_NOT_FOUND_DESC_3}</a> }
            {PAGE_NOT_FOUND_LABELS.PAGE_NOT_FOUND_DESC_4}
          </div>
        </div>
      </div>
    </div>
  );
}
export default PageNotFound;
PageNotFound.prototype = {
  isFromSignin: PropTypes.bool,
};
PageNotFound.defaultProps = {
  isFromSignin: false,
};
