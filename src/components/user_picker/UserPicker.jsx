import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { UserPicker as Picker } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import { ROLES } from 'utils/Constants';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getUserPickerOptionList, SEARCH_PEOPLE, USER_PICKER_STRINGS } from './UserPicker.utils';
import { getUsersPickerDataApiThunk } from '../../redux/actions/Teams.action';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { GET_ALL_TEAMS, GET_ALL_USERS, GET_ALL_USERS_OR_TEAMS, GET_USER_TEAM_PICKER_SUGGESTION } from '../../urls/ApiUrls';
import jsUtility, { get } from '../../utils/jsUtility';
import styles from './UserPicker.module.scss';
import { getPopperContent } from '../../utils/UtilityFunctions';

function UserPicker(props) {
    const {
        id,
        className,
        labelClassName,
        labelText,
        required,
        hideLabel,
        errorMessage,
        errorVariant,
        instruction,
        helpTooltip,
        colorScheme,
        selectedValue = {
            users: [],
            teams: [],
        },
        onRemove,
        onSelect,
        searchPlaceholder,
        isSearchable,
        isloading,
        popperPosition,
        maxCountLimit = 2,
        noDataFoundMessage,
        optionContentClass,
        searchInputClassName,
        remainingUsersPopperPlacement,
        disabled,
        getPopperContainerClassName,
        allowedUserType = [ROLES.ADMIN, ROLES.FLOW_CREATOR, ROLES.MEMBER],
        allowedTeamType,
        isActive = true,
        documentUrlDetails = [],
        isUsers,
        cancelToken,
        isTeams,
        extraParams,
        maxLimit,
        referenceName,
        isForm,
        displayLength = 30,
        selectedValueContainerClassName,
        buttonClassName,
        isUserPicker,
        addFieldText,
      } = props;

    const { t } = useTranslation();
  const getAddFieldText = () => {
    let customAddFieldText = USER_PICKER_STRINGS(t).ADD_USERS_TEAMS;
    if (isUsers && isTeams) {
      customAddFieldText = USER_PICKER_STRINGS(t).ADD_USERS_TEAMS;
    } else if (isUsers || isForm) {
      customAddFieldText = USER_PICKER_STRINGS(t).ADD_USERS;
    } else if (isTeams) {
      customAddFieldText = USER_PICKER_STRINGS(t).ADD_TEAMS;
    }
    return customAddFieldText;
  };
    const [searchText, setSearchText] = useState(EMPTY_STRING);
    const [assignee, setAssignee] = useState([]);
    const hiddenVisibilityRef = useRef(null);
    const selectedAssignee = getUserPickerOptionList([
    ...(selectedValue?.users || []),
    ...(selectedValue?.teams || []),
    ...(Array.isArray(selectedValue) ? selectedValue : []),
    ], documentUrlDetails);

    const history = useHistory();

    const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);

    useEffect(() => {
        if (disabled) return;
        if (cancelToken?.cancelToken) cancelToken.cancelToken?.();
        const excludeUsers = [];
        const excludeTeams = [];
        (selectedValue?.users || []).forEach((user) => excludeUsers.push(user._id || user.id));
        (selectedValue?.teams || []).forEach((team) => excludeTeams.push(team._id || team.id));
        let userParams = {
            page: 1,
            size: 10,
            user_types: allowedUserType,
            is_active: isActive ? 1 : 0,
          };
          if (!jsUtility.isEmpty(allowedTeamType)) {
            userParams.team_type = allowedTeamType;
            if (isTeams) userParams.user_types = [];
          }
          if (isUsers) {
            userParams.omit_users = [...new Set(excludeUsers)];
            userParams.is_last_signin = 0;
          } else if (isTeams) {
            userParams.omit_teams = [...new Set(excludeTeams)];
          } else {
            userParams.exclude_teams = [...new Set(excludeTeams)];
            userParams.exclude_users = [...new Set(excludeUsers)];
          }
          let link = GET_ALL_USERS_OR_TEAMS;
          if (isUsers) link = GET_ALL_USERS;
          else if (isTeams) link = GET_ALL_TEAMS;

          if (searchText) userParams.search = searchText;
          if (!jsUtility.isEmpty(extraParams)) userParams = { ...userParams, ...extraParams };

          if (isForm) {
            link = GET_USER_TEAM_PICKER_SUGGESTION;
            delete userParams.user_types;
            delete userParams.is_active;
            delete userParams.exclude_teams;
            delete userParams.exclude_users;
          }

         getUsersPickerDataApiThunk(link, userParams, cancelToken?.setCancelToken).then((assigneeData = []) => {
            setAssignee(assigneeData);
         });
    }, [searchText, JSON.stringify(selectedAssignee), disabled]);

    const onSearchChangeHandler = (event) => {
        const value = get(event, ['target', 'value'], null);
        setSearchText(value);
    };

    const onSelectHandler = (_event, option) => {
      onSelect?.(option);
      setSearchText(EMPTY_STRING);
    };

    const onRemoveHandler = (id) => onRemove?.(id);

    return (
        <>
        <Picker
            id={id}
            className={className}
            labelClassName={labelClassName}
            labelText={labelText}
            hideLabel={hideLabel}
            required={required}
            errorMessage={errorMessage}
            errorVariant={errorVariant}
            instruction={instruction}
            helpTooltip={helpTooltip}
            colorScheme={colorScheme}
            referenceName={referenceName}
            selectedValue={selectedAssignee}
            optionList={assignee.filter((a) => !selectedAssignee.find((sa) => sa.id === a.id))}
            isSearchable={isSearchable}
            searchPlaceholder={searchPlaceholder || t(SEARCH_PEOPLE)}
            searchText={searchText}
            searchInputClassName={searchInputClassName}
            isloading={isloading}
            onSearch={onSearchChangeHandler}
            onSelect={onSelectHandler}
            onRemove={onRemoveHandler}
            maxCountLimit={maxCountLimit}
            noDataFoundMessage={noDataFoundMessage}
            optionContentClass={optionContentClass}
            disabled={disabled}
            remainingUsersPopperPlacement={remainingUsersPopperPlacement}
            popperPosition={popperPosition}
            getPopperContainerClassName={(isPopperOpen) => cx(styles.SelectedUsersPopper, getPopperContainerClassName?.(isPopperOpen))}
            onPopperOutsideClick={() => hiddenVisibilityRef?.current?.click()}
            maxLimit={maxLimit}
            hideAddText
            selectedValueContainerClassName={cx(!isUserPicker && styles.UserSelector, selectedValueContainerClassName)}
            displayLength={displayLength}
            buttonClassName={buttonClassName}
            getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide, history, showCreateTask)}
            addFieldText={addFieldText ?? getAddFieldText()}
        />
        <button className={gClasses.DisplayNone} onClick={() => setSearchText(EMPTY_STRING)} ref={hiddenVisibilityRef} />
        </>
    );
}

export default UserPicker;
