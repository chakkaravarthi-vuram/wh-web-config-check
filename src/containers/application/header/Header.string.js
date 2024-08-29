import React from 'react';
import UserProfileIcon from 'assets/icons/UserProfileIcon';
import MyDownloadsIcon from 'assets/icons/MyDownloadsIcon';
import HelpCircleIcon from 'assets/icons/HelpCircleIcon';
import LogoutIcon from 'assets/icons/LogoutIcon';
import { USER_PROFILE_DROPDOWN_INDEX } from '../../../components/logged_in_nav_bar/LoggedInNavbar';

export const getHeaderProfileOptions = (PROFILE_STRINGS) => (
    [
        {
            optionLabel: PROFILE_STRINGS.VIEW_PROFILE,
            optionIcon: <UserProfileIcon />,
            id: USER_PROFILE_DROPDOWN_INDEX.LANGUAGE_TIME_ZONE,
        },
        {
            optionLabel: PROFILE_STRINGS.MY_DOWNLOADS,
            optionIcon: <MyDownloadsIcon />,
            id: USER_PROFILE_DROPDOWN_INDEX.MY_DOWNLOADS,
        },
        {
            optionLabel: PROFILE_STRINGS.SUPPORT,
            optionIcon: <HelpCircleIcon />,
            id: 'https://sites.google.com/workhall.com/helpdesk?usp=sharing',
        },
        {
            optionLabel: PROFILE_STRINGS.LOGOUT,
            optionIcon: <LogoutIcon />,
            id: USER_PROFILE_DROPDOWN_INDEX.SIGN_OUT,
        },
    ]
);

export const HEADER_TRANSLATE_STRINGS = (t) => {
    return {
        AI_POWERED_SEARCH: t('app_strings.header.ai_powered'),
        APPLICATION: t('app_strings.header.applications'),
    };
};
