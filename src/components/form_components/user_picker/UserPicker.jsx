import { UserPicker as Picker } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import { get } from '../../../utils/jsUtility';
import { CancelToken } from '../../../utils/UtilityFunctions';
import { getUsersPickerDataApiThunk } from '../../../redux/actions/Teams.action';
import { ROLES } from '../../../utils/Constants';
import { getUserPickerOptionList } from './UserPicker.utils';

const cancelToken = new CancelToken();

function UserPicker(props) {
    const {
        id,
        className,
        labelClassName,
        labelText,
        required,
        hideLabel,
        errorMessage,
        instruction,
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
        onPopperOutsideClick,
        optionContentClass,
        searchInputClassName,
        remainingUsersPopperPlacement,
        disabled,
        getPopperContainerClassName,
        allowedUserType = [ROLES.ADMIN, ROLES.FLOW_CREATOR, ROLES.MEMBER],
        isActive = true,
        documentUrlDetails = [],
      } = props;
    const [searchText, setSearchText] = useState(null);
    const [assignee, setAssignee] = useState([]);

    const selectedAssignee = getUserPickerOptionList([
    ...get(selectedValue, ['users'], []),
    ...get(selectedValue, ['teams'], []),
    ...(Array.isArray(selectedValue) ? selectedValue : []),
    ], documentUrlDetails);

    useEffect(() => {
        if (cancelToken.cancelToken) cancelToken.cancelToken?.();
        const excludeUsers = [];
        const excludeTeams = [];
        get(selectedValue, ['users'], []).forEach((user) => excludeUsers.push(user._id));
        get(selectedValue, ['teams'], []).forEach((team) => excludeTeams.push(team._id));
        const userParams = {
            page: 1,
            size: 10,
            user_types: allowedUserType,
            exclude_teams: excludeTeams,
            exclude_users: excludeUsers,
            is_active: isActive ? 1 : 0,
          };
          if (searchText) userParams.search = searchText;
         getUsersPickerDataApiThunk(null, userParams, cancelToken.setCancelToken).then((assigneeData = []) => {
            setAssignee(assigneeData);
         });
    }, [searchText, JSON.stringify(selectedAssignee)]);

    const onSearchChangeHandler = (event) => {
        const value = get(event, ['target', 'value'], null);
        setSearchText(value);
    };

    const onSelectHandler = (_event, option) => onSelect?.(option);

    const onRemoveHandler = (id) => onRemove?.(id);

    return (
        <Picker
            id={id}
            className={className}
            labelClassName={labelClassName}
            labelText={labelText}
            hideLabel={hideLabel}
            required={required}
            errorMessage={errorMessage}
            instruction={instruction}
            colorScheme={colorScheme}
            selectedValue={selectedAssignee}
            optionList={assignee}
            isSearchable={isSearchable}
            searchPlaceholder={searchPlaceholder}
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
            getPopperContainerClassName={getPopperContainerClassName}
            onPopperOutsideClick={onPopperOutsideClick}
        />
    );
}

export default UserPicker;
