import React from 'react';
import styles from './CreateAppModal.module.scss';
import AppsIcon from '../../../../assets/icons/create_app/create_modal/AppsIcon';
import TasksIcon from '../../../../assets/icons/create_app/create_modal/TasksIcon';
import FlowsIcon from '../../../../assets/icons/create_app/create_modal/FlowsIcon';
import DashboardIcon from '../../../../assets/icons/create_app/create_modal/DashboardIcon';
import DatalistIcon from '../../../../assets/icons/create_app/create_modal/DatalistIcon';
import IntegrationIcon from '../../../../assets/icons/create_app/create_modal/IntegrationIcon';
import TeamsIcon from '../../../../assets/icons/create_app/create_modal/TeamsIcon';
import UsersIcon from '../../../../assets/icons/create_app/create_modal/UsersIcon';
import { translateFunction } from '../../../../utils/jsUtility';

export const APP_HOMEPAGE_LIST = (t = translateFunction) => [
    {
        TITLE: t('app_strings.create_modal.apps.title'),
        DESCRIPTION: t('app_strings.create_modal.apps.description'),
        IMAGE: <AppsIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.task.title'),
        DESCRIPTION: t('app_strings.create_modal.task.description'),
        IMAGE: <TasksIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.flows.title'),
        DESCRIPTION: t('app_strings.create_modal.flows.description'),
        IMAGE: <FlowsIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.datalist.title'),
        DESCRIPTION: t('app_strings.create_modal.datalist.description'),
        IMAGE: <DatalistIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.report.title'),
        DESCRIPTION: t('app_strings.create_modal.report.description'),
        IMAGE: <DashboardIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.integration.title'),
        DESCRIPTION: t('app_strings.create_modal.integration.description'),
        IMAGE: <IntegrationIcon className={styles.IntegrationIcon} />,
    },
    {
        TITLE: t('app_strings.create_modal.user.title'),
        DESCRIPTION: t('app_strings.create_modal.user.description'),
        IMAGE: <UsersIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.team.title'),
        DESCRIPTION: t('app_strings.create_modal.team.description'),
        IMAGE: <TeamsIcon />,
    },
];

export const APP_HOMEPAGE_LIST_NON_USER_DATALIST = (t = translateFunction) => [
    {
        TITLE: t('app_strings.create_modal.apps.title'),
        DESCRIPTION: t('app_strings.create_modal.apps.description'),
        IMAGE: <AppsIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.task.title'),
        DESCRIPTION: t('app_strings.create_modal.task.description'),
        IMAGE: <TasksIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.flows.title'),
        DESCRIPTION: t('app_strings.create_modal.flows.description'),
        IMAGE: <FlowsIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.datalist.title'),
        DESCRIPTION: t('app_strings.create_modal.datalist.description'),
        IMAGE: <DatalistIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.report.title'),
        DESCRIPTION: t('app_strings.create_modal.report.description'),
        IMAGE: <DashboardIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.integration.title'),
        DESCRIPTION: t('app_strings.create_modal.integration.description'),
        IMAGE: <IntegrationIcon className={styles.IntegrationIcon} />,
    },
    {
        TITLE: t('app_strings.create_modal.team.title'),
        DESCRIPTION: t('app_strings.create_modal.team.description'),
        IMAGE: <TeamsIcon />,
    },
];

export const APP_LIST_NON_ADMIN = (t = translateFunction) => [
    {
        TITLE: t('app_strings.create_modal.apps.title'),
        DESCRIPTION: t('app_strings.create_modal.apps.description'),
        IMAGE: <AppsIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.task.title'),
        DESCRIPTION: t('app_strings.create_modal.task.description'),
        IMAGE: <TasksIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.flows.title'),
        DESCRIPTION: t('app_strings.create_modal.flows.description'),
        IMAGE: <FlowsIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.datalist.title'),
        DESCRIPTION: t('app_strings.create_modal.datalist.description'),
        IMAGE: <DatalistIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.report.title'),
        DESCRIPTION: t('app_strings.create_modal.report.description'),
        IMAGE: <DashboardIcon />,
    },
    {
        TITLE: t('app_strings.create_modal.integration.title'),
        DESCRIPTION: t('app_strings.create_modal.integration.description'),
        IMAGE: <IntegrationIcon className={styles.IntegrationIcon} />,
    },
    {
        TITLE: t('app_strings.create_modal.team.title'),
        DESCRIPTION: t('app_strings.create_modal.team.description'),
        IMAGE: <TeamsIcon />,
    },
];

export const CREATE_MODAL = {
    ID: 'create_modal_home',
    HEADER: 'app_strings.create_modal.header',
};
