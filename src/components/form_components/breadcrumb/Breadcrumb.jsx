import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { Link } from 'react-router-dom';
import { ARIA_ROLES } from 'utils/UIConstants';
import ThemeContext from '../../../hoc/ThemeContext';

import ConditionalWrapper from '../../conditional_wrapper/ConditionalWrapper';
import BreadCrumbArrowIcon from '../../../assets/icons/BreadCrumbArrowIcon';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './Breadcrumb.module.scss';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import jsUtils from '../../../utils/jsUtility';

export const BREADCRUMB_TYPE = {
  PRIMARY_TYPE: 1,
  CUSTOM_TYPE: 2,
  SECONDARY_TYPE: 3,
};
function Breadcrumb(props) {
  const { buttonColor } = useContext(ThemeContext);
  const { list, itemClassName, type, className, arrowClass } = props;
  const breadCrumbList = [];
  let currentItem = null;
  const containerClasses = (type === BREADCRUMB_TYPE.PRIMARY_TYPE) ?
    cx(styles.PrimaryType, className) : (type === BREADCRUMB_TYPE.SECONDARY_TYPE) ?
    cx(styles.SecondaryType) :
    className;
  list.forEach((option, idk) => {
    if (option.onClick) {
      currentItem = (
        <li className={cx(gClasses.FTwo13, (type === BREADCRUMB_TYPE.SECONDARY_TYPE) ? gClasses.FontWeight400 : gClasses.FontWeight500, itemClassName, (type === BREADCRUMB_TYPE.SECONDARY_TYPE) && gClasses.FTwo12GrayV3)}>
          <div id={option.text} onClick={option.onClick} role="presentation" className={cx(gClasses.FontWeight400, styles.ClickableText)} style={{ color: buttonColor }}>
            {option.text}
          </div>
        </li>
      );
    } else {
      currentItem = (
        <li className={cx(gClasses.FTwo13, (type === BREADCRUMB_TYPE.SECONDARY_TYPE) ? gClasses.FontWeight400 : gClasses.FontWeight500, itemClassName, (type === BREADCRUMB_TYPE.SECONDARY_TYPE) && gClasses.FTwo12GrayV3)} title={option.text}>
          <ConditionalWrapper
            condition={(!jsUtils.isEmpty(option.pathname))}
            wrapper={(children) => (
              <Link id={option.text} to={option.pathname} className={gClasses.FontWeight400} style={{ color: buttonColor }}>
                {children}
              </Link>
            )}
          >
            {option.text}
          </ConditionalWrapper>
        </li>
      );
    }
    if (idk > 0) breadCrumbList.push(<li className={cx(styles.Arrow, arrowClass)}>{type === BREADCRUMB_TYPE.SECONDARY_TYPE ? <div className={gClasses.FTwo12GrayV3}>/</div> : <BreadCrumbArrowIcon ariaLabel="Arrow" role={ARIA_ROLES.IMG} />}</li>, currentItem);
    else breadCrumbList.push(currentItem);
  });
  return (
    <ul className={cx(styles.Container, gClasses.CenterV, containerClasses)}>{breadCrumbList}</ul>
  );
}
export default Breadcrumb;
Breadcrumb.defaultProps = {
  className: EMPTY_STRING,
  itemClassName: EMPTY_STRING,
  type: BREADCRUMB_TYPE.PRIMARY_TYPE,
};
Breadcrumb.propTypes = {
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  type: PropTypes.number,
  list: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape({
      pathname: PropTypes.string,
      text: PropTypes.string,
    }),
    PropTypes.shape({
      text: PropTypes.string,
    }),
  ])).isRequired,
};
