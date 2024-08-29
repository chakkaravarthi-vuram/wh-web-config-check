import React, { useContext } from 'react';
import cx from 'classnames/bind';
import propTypes from 'prop-types';
import {
  Checkbox,
  ECheckboxSize,
  Title,
  ETitleHeadingLevel,
} from '@workhall-pvt-lmt/wh-ui-library';
import CloseIcon from 'assets/icons/CloseIcon';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import UserPicker from 'components/user_picker/UserPicker';
import ThemeContext from 'hoc/ThemeContext';
import {
  keydownOrKeypessEnterHandle,
  isBasicUserMode,
  CancelToken,
} from 'utils/UtilityFunctions';
import { get, has, isEmpty } from '../../../utils/jsUtility';
import gClasses from '../../../scss/Typography.module.scss';
import styles from '../Filter.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import { getValidationTabUserTeamPickerSelectedData } from '../../../utils/formUtils';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { NON_PRIVATE_TEAM_TYPES } from '../../../utils/Constants';
import FILTER_STRINGS from '../Filter.strings';

function FormFieldByUserTeamPicker(props) {
  const { t } = useTranslation();
  const {
    title,
    fieldUpdateValue,
    onChangeUserTeamPicker,
    isFromMoreFilter,
    isLoggedInUser,
    onCloseCover,
    onClickLoggedInUser,
    error,
  } = props;
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const userTeamPickerCancelToken = new CancelToken();

  const {
    FIELDS: { USER_TEAM_PICKER },
  } = FILTER_STRINGS(t);
  const extraParams = {
    team_type: isNormalMode ? null : NON_PRIVATE_TEAM_TYPES,
    is_system_user: 1,
  };

  const onSelectUserOrTeam = (value) => {
    const updatedObj = {
      users: [...get(fieldUpdateValue, 'users', [])],
      teams: [...get(fieldUpdateValue, 'teams', [])],
    };
    if (value?.is_user) {
      if (!updatedObj.users.some((eachUser) => eachUser._id === value._id)) {
        updatedObj.users.push(value);
      }
    } else if (has(value, 'team_name')) {
      if (!updatedObj.teams.some((eachTeam) => eachTeam._id === value._id)) {
        updatedObj.teams.push(value);
      }
    }
    if (isEmpty(updatedObj.teams)) {
      delete updatedObj.teams;
    }
    if (isEmpty(updatedObj.users)) {
      delete updatedObj.users;
    }
    onChangeUserTeamPicker(updatedObj);
  };

  const onRemoveUserOrTeam = (valueId) => {
    const updatedObj = {
      users: [...get(fieldUpdateValue, 'users', [])],
      teams: [...get(fieldUpdateValue, 'teams', [])],
    };
    let isDeleteCompleted = false;
    updatedObj.users = updatedObj.users.filter((eachUser) => {
      isDeleteCompleted = false;
      const isNotEqual = eachUser._id !== valueId;
      if (!isNotEqual) isDeleteCompleted = true;
      return isNotEqual;
    });
    if (!isDeleteCompleted) {
      updatedObj.teams = updatedObj.teams.filter(
        (eachTeam) => eachTeam._id !== valueId,
      );
    }
    if (isEmpty(updatedObj.teams)) delete updatedObj.teams;
    if (isEmpty(updatedObj.users)) delete updatedObj.users;
    onChangeUserTeamPicker(updatedObj);
  };

  return (
    <div
      className={cx(
        gClasses.DisplayFlex,
        gClasses.FlexDirectionCol,
        gClasses.Gap8,
      )}
    >
      <div className={cx(BS.D_FLEX, isFromMoreFilter && BS.JC_BETWEEN)}>
        <Title
          id={`${title}_label`}
          content={title}
          headingLevel={ETitleHeadingLevel.h3}
          className={cx(styles.FieldTitle, gClasses.LabelStyle)}
        />
        {isFromMoreFilter && (
          <CloseIcon
            className={cx(
              styles.closeIcon,
              gClasses.ML10,
              BS.JC_END,
              gClasses.CursorPointer,
            )}
            onClick={onCloseCover}
            isButtonColor
            role={ARIA_ROLES.BUTTON}
            tabIndex={0}
            ariaLabel={`Remove ${title} filter`}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseCover()}
          />
        )}
      </div>
      <div>
        <UserPicker
          id={title}
          isSearchable
          hideLabel
          onSelect={onSelectUserOrTeam}
          onRemove={onRemoveUserOrTeam}
          selectedValue={
            (fieldUpdateValue &&
              getValidationTabUserTeamPickerSelectedData(fieldUpdateValue)) ||
            EMPTY_STRING
          }
          extraParams={extraParams}
          errorMessage={error}
          disabled={isLoggedInUser}
          cancelToken={userTeamPickerCancelToken}
          noDataFoundMessage={USER_TEAM_PICKER.NO_TEAMS_ON_SEARCH}
          colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
          selectedValueContainerClassName={styles.UserPickerSelectedValue}
        />
      </div>
      <div>
        <Checkbox
          id={`${title}_logged_user`}
          className={cx(gClasses.MB10)}
          isValueSelected={isLoggedInUser}
          details={USER_TEAM_PICKER.LOGGED_IN_USER.DETAILS}
          size={ECheckboxSize.SM}
          checkboxViewLabelClassName={cx(gClasses.MT5)}
          onClick={onClickLoggedInUser}
        />
      </div>
    </div>
  );
}

FormFieldByUserTeamPicker.propTypes = {
  title: propTypes.string,
  fieldUpdateValue: propTypes.object,
  onChangeUserTeamPicker: propTypes.func,
  isFromMoreFilter: propTypes.bool,
  isLoggedInUser: propTypes.bool,
  onCloseCover: propTypes.func,
  onClickLoggedInUser: propTypes.func,
  error: propTypes.string,
};

export default FormFieldByUserTeamPicker;
