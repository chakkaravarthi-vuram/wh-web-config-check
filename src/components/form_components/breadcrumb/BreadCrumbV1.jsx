import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { Link } from 'react-router-dom';

import gClasses from '../../../scss/Typography.module.scss';
import styles from './Breadcrumb.module.scss';
import { FORWARD_SLASH } from '../../../utils/strings/CommonStrings';
import { } from '../../../utils/jsUtility';
import { BS } from '../../../utils/UIConstants';

function BreadcrumbV1(props) {
  const { list } = props;
  console.log('breadcrumb list', list);
  const breadCrumbList = [];
  let currentItem = null;
  list.forEach((option) => {
      currentItem = (
        <li>
          <div
            id={option.text}
            role="presentation"
            className={cx(
              BS.D_FLEX,
              option?.isText && styles.NoTextDecoration,
              )
            }
          >
            <div className={gClasses.MR8}>{FORWARD_SLASH}</div>
            <Link
              to={option?.route}
              className={
                cx(option?.itemClassName,
                  )}
            >
              {option?.text}
            </Link>
          </div>
        </li>
      );
    breadCrumbList.push(currentItem);
  });
  return (
    <ul className={cx(styles.ContainerV1, gClasses.CenterV)}>{breadCrumbList}</ul>
  );
}
export default BreadcrumbV1;

BreadcrumbV1.propTypes = {
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
