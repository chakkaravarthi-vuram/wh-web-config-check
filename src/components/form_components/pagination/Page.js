import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ThemeContext from '../../../hoc/ThemeContext';
import styles from './Pagination.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import {
  STATUS_STRINGS,
  HASH,
  EMPTY_STRING,
} from '../../../utils/strings/CommonStrings';

function Page(props) {
  const { pageText, activeClass, linkClass, isActive, isDisabled, href } =
    props;

  const handleClick = (e) => {
    const { isDisabled, pageNumber, onClick } = props;
    e.preventDefault();
    if (isDisabled) {
      return;
    }
    onClick(pageNumber);
  };

  let linkCss = null;
  let cssList = null;
  linkCss = classNames(
    linkClass,
    { activeLinkClass: isActive },
    gClasses.FOne13GrayV12,
  );
  cssList = classNames(
    { [activeClass]: isActive },
    { disabledClass: isDisabled },
  );
  return (
    <li className={cssList} onClick={handleClick} role="presentation">
      <a className={linkCss} href={href}>
        {pageText}
      </a>
      <div className={styles.Box} />
    </li>
  );
}

export default Page;

Page.contextType = ThemeContext;

Page.defaultProps = {
  activeClass: STATUS_STRINGS.ACTIVE,
  linkClass: EMPTY_STRING,
  pageText: EMPTY_STRING,
  isActive: false,
  isDisabled: false,
  href: HASH,
};

Page.propTypes = {
  pageText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  pageNumber: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  activeClass: PropTypes.string,
  linkClass: PropTypes.string,
  href: PropTypes.string,
};
