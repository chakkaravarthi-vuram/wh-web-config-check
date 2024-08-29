import React from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import Dropdown from '../../../../../components/form_components/dropdown/Dropdown';
import Button from '../../../../../components/form_components/button/Button';
import UserAutoSuggestion from '../../../../../components/user_autosuggestion/UserAutoSuggestion';
import { AUTO_SUGGESTION_TYPES } from '../../../../../components/form_components/auto_suggestion/AutoSuggestion';

import { BUTTON_TYPE } from '../../../../../utils/Constants';
import { BS } from '../../../../../utils/UIConstants';

import UserImage from '../../../../../components/user_image/UserImage';
import { NEW_MEMBER_CARD_STRINGS } from './NewMemberCard.strings';
import { USER_TYPE_STRINGS, PLUS, EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { GET_USERS } from '../../../../../urls/ApiUrls';
import { ROLES_LIST } from '../../../../../components/member_list/member_card/MemberCard.strings';

import gClasses from '../../../../../scss/Typography.module.scss';
import styles from '../../../../../components/member_list/member_card/MemberCard.module.scss';

const DROP_DOWN_PLACEHOLDER = 'Change role';

function NewMemberCard(props) {
  const {
    className,
    selectedData,
    errorText,
    onUserSelectHandler,
    placeholder,
    id,
    onDropdownChange,
    onAddButtonClicked,
  } = props;
  return (
    <div
      className={cx(
        gClasses.InputBorder,
        gClasses.InputBorderRadius,
        styles.MemberListContainer,
        gClasses.CenterV,
        BS.P_RELATIVE,
        className,
      )}
    >
      <div className={cx(BS.D_FLEX, styles.UserDetailContainer)}>
        <UserImage firstName={PLUS} className={styles.UserImage} />

        <UserAutoSuggestion
          selectedData={selectedData}
          onSelectHandler={onUserSelectHandler}
          errorText={errorText}
          placeholder={placeholder}
          id={id}
          type={AUTO_SUGGESTION_TYPES.TYPE_3}
          apiUrl={GET_USERS}
          isActive
        />
      </div>
      {onDropdownChange ? (
        <Dropdown
          placeholder={DROP_DOWN_PLACEHOLDER}
          optionList={ROLES_LIST}
          selectedValue={selectedData ? USER_TYPE_STRINGS[selectedData.user_type] : null}
          onChange={onDropdownChange}
          className={cx(styles.Dropdown, gClasses.ML20)}
          rtl
          isBorderLess
        />
      ) : null}

      <Button id="new_member_add" onClick={onAddButtonClicked} buttonType={BUTTON_TYPE.PRIMARY} className={styles.AddButton}>
        {NEW_MEMBER_CARD_STRINGS.ADD}
      </Button>
    </div>
  );
}
export default NewMemberCard;
NewMemberCard.defaultProps = {
  className: EMPTY_STRING,
  errorText: EMPTY_STRING,
  placeholder: EMPTY_STRING,
  id: EMPTY_STRING,
};

NewMemberCard.propTypes = {
  onAddButtonClicked: PropTypes.func.isRequired,
  className: PropTypes.string,
  selectedData: PropTypes.objectOf(PropTypes.any).isRequired,
  onUserSelectHandler: PropTypes.func.isRequired,
  errorText: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  onDropdownChange: PropTypes.func.isRequired,
};
