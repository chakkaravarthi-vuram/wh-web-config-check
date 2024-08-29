import React, { useContext } from 'react';
import cx from 'classnames/bind';
import ThemeContext from '../../../../../../../hoc/ThemeContext';

import DeleteIcon from '../../../../../../../assets/icons/DeleteIcon';
import Dropdown from '../../../../../../../components/form_components/dropdown/Dropdown';

import gClasses from '../../../../../../../scss/Typography.module.scss';
import styles from './MemberCard.module.scss';
import { ROLES_LIST } from '../../../../../../../components/member_list/member_card/MemberCard.strings';

const DROP_DOWN_PLACEHOLDER = ' Select role';

function MemberCard(props) {
  const {
    userEmail,
    role,
    onChangeHandler,

  } = props;
  const { buttonColor } = useContext(ThemeContext);
  return (
    <li className={cx(gClasses.InputBorderRadius, gClasses.InputBorder, styles.MemberListContainer, gClasses.CenterV)}>
      <div
        className={cx(styles.NameContainer, gClasses.CenterVH, gClasses.FTwo14, gClasses.FontWeight500)}
        style={{ color: buttonColor }}
      >
        {userEmail[0]}
      </div>
      <div className={cx(gClasses.FOne13GrayV3, gClasses.ML20, styles.UserEmail)}>{userEmail}</div>

      <Dropdown
        placeholder={DROP_DOWN_PLACEHOLDER}
        id={userEmail}
        optionList={ROLES_LIST}
        selectedValue={role}
        onChange={onChangeHandler}
        className={cx(styles.Dropdown, gClasses.ML20)}
        rtl
        isBorderLess
      />
      <DeleteIcon className={gClasses.ML30} style={{ fill: buttonColor }} />
    </li>
  );
}
export default MemberCard;

MemberCard.defaultProps = {
  userEmail: 'rajkumarj@vuram.com',
};
