import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import Button from '../../../../../components/form_components/button/Button';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from '../../../../../components/form_components/helper_message/HelperMessage';
import UserAutoSuggestion from '../../../../../components/user_autosuggestion/UserAutoSuggestion';
import { AUTO_SUGGESTION_TYPES } from '../../../../../components/form_components/auto_suggestion/AutoSuggestion';
import Tag from '../../../../../components/form_components/tag/Tag';
import Label from '../../../../../components/form_components/label/Label';
import UserIcon from '../../../../../assets/icons/UserIcon';

import { BUTTON_TYPE } from '../../../../../utils/Constants';
import { BS } from '../../../../../utils/UIConstants';

import gClasses from '../../../../../scss/Typography.module.scss';
// import UserImage from '../../user_image/UserImage';
import styles from './AddMembers.module.scss';
import { ADD_MEMBERS_STRINGS } from './AddMembers.strings';
import {
  GET_USERS,
  GET_ALL_TEAMS,
  GET_ALL_USERS_OR_TEAMS,
  GET_ALL_CURRENCY_TYPES,
  GET_ALL_FILE_EXTENSIONS,
} from '../../../../../urls/ApiUrls';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';

function AddMembers(props) {
  const {
    selectedData,
    removeSelectedUser,
    errorText,
    memberSearchValue,
    hideLabel,
    label,
    isRequired,
    selectedSuggestionData,
    onUserSelectHandler,
    placeholder,
    id,
    getTeams,
    getTeamsAndUsers,
    getAllCurrencyTypes,
    getAllFileExtensions,
    setMemberSearchValue,
    onAddButtonClicked,
    className,
  } = props;
  let url = null;
  if (getTeams) {
    url = GET_ALL_TEAMS;
  } else if (getTeamsAndUsers) {
    url = GET_ALL_USERS_OR_TEAMS;
  } else if (getAllCurrencyTypes) {
    url = GET_ALL_CURRENCY_TYPES;
  } else if (getAllFileExtensions) {
    url = GET_ALL_FILE_EXTENSIONS;
  } else {
    url = GET_USERS;
  }
  let selectedList = null;
  if (selectedData && selectedData.length > 0) {
    selectedList = [];
    selectedList = selectedData.map((data) => {
      let tagValue = EMPTY_STRING;
      let tagIcon = EMPTY_STRING;
      if (data.email) {
        tagValue = data.email;
        tagIcon = <UserIcon className={styles.UserIcon} />;
      }
      if (data.team_name) {
        tagValue = data.team_name;
        tagIcon = <UserIcon />;
      }
      if (getAllCurrencyTypes || getAllFileExtensions) tagValue = data;
      return (
        <Tag
          className={cx(gClasses.MR10, gClasses.MB10, styles.SelectedOptionTag)}
          id={data._id}
          onCloseClick={
            getAllCurrencyTypes || getAllFileExtensions
              ? () => removeSelectedUser(tagValue)
              : removeSelectedUser
          }
        >
          {tagIcon}
          {tagValue}
        </Tag>
      );
    });
  }
  let inputBorder = gClasses.InputBorder;
  if (errorText) {
    inputBorder = gClasses.ErrorInputBorder;
  }
  const containerRef = createRef();
  return (
    <div className={className}>
      {hideLabel ? null : <Label content={label} isRequired={isRequired} />}
      <div
        className={cx(
          inputBorder,
          gClasses.InputBorderRadius,
          styles.Container,
          BS.D_FLEX,
          BS.P_RELATIVE,
        )}
        ref={containerRef}
      >
        <div className={cx(BS.D_FLEX, gClasses.FlexGrow1, BS.FLEX_WRAP_WRAP, BS.JC_START)}>
          {selectedList}
          <UserAutoSuggestion
            selectedData={selectedSuggestionData}
            onSelectHandler={onUserSelectHandler}
            errorText={errorText}
            placeholder={placeholder}
            id={id}
            type={AUTO_SUGGESTION_TYPES.TYPE_3}
            apiUrl={url}
            searchValue={memberSearchValue}
            setSearchValue={setMemberSearchValue}
            getAllCurrencyTypes={getAllCurrencyTypes}
            getAllFileExtensions={getAllFileExtensions}
            inputClass={cx(styles.InputClass, gClasses.ML5, gClasses.CenterV, gClasses.MB10)}
            ref={containerRef}
          />
        </div>
        {onAddButtonClicked ? (
          <Button
            id="member_add_button"
            onClick={onAddButtonClicked}
            buttonType={BUTTON_TYPE.PRIMARY}
            className={cx(styles.AddButton, BS.FLOAT_RIGHT, gClasses.MB10)}
          >
            {ADD_MEMBERS_STRINGS.ADD}
          </Button>
        ) : null}
      </div>
      <HelperMessage
        message={errorText}
        type={HELPER_MESSAGE_TYPE.ERROR}
        className={gClasses.ErrorMarginV1}
      />
    </div>
  );
}
export default AddMembers;
AddMembers.defaultProps = {
  selectedData: [],
  errorText: EMPTY_STRING,
  memberSearchValue: EMPTY_STRING,
  hideLabel: false,
  label: EMPTY_STRING,
  isRequired: false,
  selectedSuggestionData: {},
  placeholder: EMPTY_STRING,
  id: EMPTY_STRING,
  getTeams: null,
  getTeamsAndUsers: null,
  className: EMPTY_STRING,
};

AddMembers.propTypes = {
  selectedData: PropTypes.arrayOf(PropTypes.any),
  removeSelectedUser: PropTypes.func.isRequired,
  errorText: PropTypes.string,
  memberSearchValue: PropTypes.string,
  hideLabel: PropTypes.bool,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  selectedSuggestionData: PropTypes.objectOf(PropTypes.any),
  onUserSelectHandler: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  getTeams: PropTypes.string,
  getTeamsAndUsers: PropTypes.string,
  setMemberSearchValue: PropTypes.func.isRequired,
  onAddButtonClicked: PropTypes.func.isRequired,
  className: PropTypes.string,
};
