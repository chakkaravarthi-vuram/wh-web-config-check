import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { USER_AUTO_SUGGESTION_STRINGS } from 'components/user_autosuggestion/UserAutoSuggestion.strings';
import ThemeContext from '../../../../hoc/ThemeContext';
import Button, {
  BUTTON_TYPE,
} from '../../../../components/form_components/button/Button';
import UserAutoSuggestion from '../../../../components/user_autosuggestion/UserAutoSuggestion';
import UserImage from '../../../../components/user_image/UserImage';
import Dropdown from '../../../../components/form_components/dropdown/Dropdown';

import { ROLES_LIST } from '../../../../utils/Constants';
import AddIcon from '../../../../assets/icons/AddIcon';
import jsUtils from '../../../../utils/jsUtility';
import { BS } from '../../../../utils/UIConstants';
import { GET_ALL_USERS } from '../../../../urls/ApiUrls';
import { addExistingUserButton } from '../UserManagement.strings';

import styles from './AddExistingUser.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import { generateEventTargetObject } from '../../../../utils/generatorUtils';

function AddExistingUser(props) {
  const { userType, onRoleChange, className } = props;
  const { t } = useTranslation();
  const { buttonColor } = useContext(ThemeContext);
  const [isVisible, setVisibility] = useState(false);
  const [search, setSearch] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [selectedRole, setSelectedRole] = useState(userType);
  const setSearchValue = (event) => setSearch(event.target.value);
  const setSelectedValue = (event) => setSelectedUser(event.target.value);
  const onDropdownChange = (event) => setSelectedRole(event.target.value);

  const setInitialState = () => {
    setVisibility(false);
    setSearch();
    setSelectedUser();
    setSelectedRole(userType);
  };

  useEffect(() => {
    setSelectedRole(userType);
    setVisibility(false);
  }, [props.userType]);

  const onAddClicked = () => {
    console.log('selected user', selectedUser);
    if (!jsUtils.isEmpty(selectedUser)) {
      const role = jsUtils.get(selectedUser, ['user_type']);
      console.log('here add', role, selectedRole);
      if (role !== selectedRole) {
        onRoleChange(
          generateEventTargetObject(
            jsUtils.get(selectedUser, ['_id']),
            selectedRole,
          ),
        );
      }
    }
    setInitialState();
  };

  let content;
  if (isVisible) {
    content = (
      <div className={cx(className, styles.AddUser, BS.D_FLEX)}>
        {jsUtils.isObject(selectedUser) ? (
          <UserImage
            firstName={jsUtils.get(selectedUser, ['first_name'])}
            lastName={jsUtils.get(selectedUser, ['last_name'])}
            src={jsUtils.get(selectedUser, ['profilePic', 'signedurl'])}
            className={styles.UserImage}
          />
        ) : (
          <div className={cx(styles.Oval, gClasses.CenterVH)}>
            <AddIcon className={BS.M_AUTO} isButtonColor />
          </div>
        )}
        {jsUtils.isObject(selectedUser) ? (
          <>
            <div
              className={cx(gClasses.Ellipsis, gClasses.ML20, gClasses.MR5, gClasses.FTwo13GrayV3)}
              style={{ maxWidth: '300' }}
            >
              {jsUtils.get(selectedUser, ['username'])}
            </div>
            <Dropdown
              optionList={ROLES_LIST}
              className={cx(BS.ML_AUTO, BS.ALIGN_ITEM_CENTER, BS.D_FLEX)}
              innerClassName={BS.PADDING_0}
              onChange={onDropdownChange}
              selectedValue={selectedRole || userType}
              id={jsUtils.get(selectedUser, ['_id'])}
              setSelectedValue={selectedRole}
              isBorderLess
              dropdownListClasses={gClasses.WidthFitContent}
            />
          </>
        ) : (
          <div className={cx(BS.W100)}>
            <UserAutoSuggestion
              placeholder={USER_AUTO_SUGGESTION_STRINGS.PLACEHOLDER}
              hideLabel
              hideMessage
              isSingleSelect
              selectedData={selectedUser}
              onSelectHandler={setSelectedValue}
              searchValue={search}
              apiUrl={GET_ALL_USERS}
              setSearchValue={setSearchValue}
              type={3}
              isActive
              hideBorder
              lastSignin
              popperClassName={cx(gClasses.ZIndex1, styles.Popper)}
              userInputAutoFocus
            />
          </div>
        )}
        <div className={cx(BS.ML_AUTO, gClasses.MR20)}>
          <Button
            id="add"
            buttonType={BUTTON_TYPE.PRIMARY}
            className={cx(gClasses.WidthFitContent)}
            onClick={onAddClicked}
            disabled={jsUtils.isEmpty(selectedUser)}
          >
            {USER_AUTO_SUGGESTION_STRINGS.ADD}
          </Button>
        </div>
        <div>
          <Button
            id="add"
            buttonType={BUTTON_TYPE.SECONDARY}
            className={cx(gClasses.WidthFitContent)}
            onClick={setInitialState}
          >
            {USER_AUTO_SUGGESTION_STRINGS.CANCEL}
          </Button>
        </div>
      </div>
    );
  } else {
    content = (
      <div
        style={{ color: buttonColor }}
        className={cx(
          className,
          gClasses.FTwo13,
          gClasses.FontWeight500,
          gClasses.CursorPointer,
          BS.D_FLEX,
          BS.JC_END,
        )}
        onClick={() => setVisibility(true)}
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && setVisibility(true)}
        tabIndex={0}
        role="button"
      >
        {addExistingUserButton(userType, t)}
      </div>
    );
  }
  return content;
}

export default AddExistingUser;

AddExistingUser.defaultProps = {
  userType: null,
  className: null,
};

AddExistingUser.propTypes = {
  userType: PropTypes.number,
  onRoleChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};
