import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Modal, Card, ETCardSize, Title, ModalStyleType, colorSchemaDefaultValue, ModalSize } from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory } from 'react-router';
import queryString from 'query-string';
import gClasses from 'scss/Typography.module.scss';
import { get } from 'utils/jsUtility';
import { BS } from '../../../../utils/UIConstants';
import { APP_HOMEPAGE_LIST, APP_HOMEPAGE_LIST_NON_USER_DATALIST, APP_LIST_NON_ADMIN, CREATE_MODAL } from './CreateAppModal.constants';
import styles from './CreateAppModal.module.scss';
import * as ROUTE from '../../../../urls/RouteConstants';
import { ROLES, ROUTE_METHOD } from '../../../../utils/Constants';
import { PD_TAB } from '../../../data_list/data_list_dashboard/DataList.strings';
import { store } from '../../../../Store';
import jsUtility from '../../../../utils/jsUtility';
import { toggleAddDataListModalVisibility } from '../../../../redux/reducer/DataListReducer';
import CloseVectorIcon from '../../../../assets/icons/create_app/create_modal/CloseVectorIcon';
import { routeNavigate } from '../../../../utils/UtilityFunctions';
import { ENTITY } from '../../../../utils/strings/CommonStrings';
import { clearCreateEditDetails } from '../../../../redux/reducer/TeamsReducer';

function CreateAppModal(props) {
  const { t } = useTranslation();
    const {
        className,
        onCloseCreateModal,
        createModalClass,
        role,
        toggleAddDataListModalVisibilityAction,
        clearCreateEditDetailsAction,
    } = props;

    const history = useHistory();
    let createAppListing = [];
    if (role === ROLES.ADMIN) {
        createAppListing = APP_HOMEPAGE_LIST_NON_USER_DATALIST(t);
    } else {
      createAppListing = APP_LIST_NON_ADMIN(t);
    }
    const onCardClick = (title) => {
        onCloseCreateModal();
        const currentParams = queryString.parseUrl(history.location.pathname);
        let newParams = { ...get(currentParams, ['query'], {}) };
        if (title === APP_HOMEPAGE_LIST(t)[1].TITLE) {
          newParams = { ...newParams, create: 'task' };
        } else if (title === APP_HOMEPAGE_LIST(t)[2].TITLE) {
          newParams = { ...newParams, create: 'flow' };
        } else if (title === APP_HOMEPAGE_LIST(t)[3].TITLE) {
          newParams = { ...newParams, create: 'datalist' };
        } else if (title === APP_HOMEPAGE_LIST(t)[0].TITLE) {
          newParams = { ...newParams, create: 'app' };
        } else if (title === APP_HOMEPAGE_LIST(t)[5].TITLE) {
          newParams = { ...newParams, create: 'integration' };
        } else if (title === APP_HOMEPAGE_LIST(t)[4].TITLE) {
          const createReportConfigPathName = `/${ROUTE.REPORT_CONFIG}/${ROUTE.CREATE_REPORT_CONFIG}`;
          routeNavigate(history, ROUTE_METHOD.REPLACE, createReportConfigPathName, null, null);
        } else if (title === APP_HOMEPAGE_LIST(t)[7].TITLE) {
          clearCreateEditDetailsAction();
          newParams = { ...newParams, create: ENTITY.TEAMS };
        } else if (title === APP_HOMEPAGE_LIST(t)[6].TITLE) {
          const userDatalistUuid = jsUtility.cloneDeep(store.getState().UserProfileReducer.user_data_list_uuid);
          toggleAddDataListModalVisibilityAction(1);
          const datalistUsersPathName = `${ROUTE.DATALIST_USERS}/${userDatalistUuid}`;
          const datalistUsersState = { dashboardTab: PD_TAB.ALL.TAB_INDEX, modalType: 1 };
          routeNavigate(history, ROUTE_METHOD.REPLACE, datalistUsersPathName, null, datalistUsersState);
        }
        const search = new URLSearchParams(newParams).toString();
        if (history.location.pathname === ROUTE.EDIT_FLOW) {
          routeNavigate(history, ROUTE_METHOD.REPLACE, ROUTE.HOME, search, null);
        } else if ((history.location.pathname === ROUTE.EDIT_DATA_LIST) && (title === APP_HOMEPAGE_LIST(t)[3].TITLE)) {
          routeNavigate(history, ROUTE_METHOD.REPLACE, ROUTE.HOME, search, null);
        } else if (history.location.pathname === ROUTE.EDIT_DATA_LIST) {
          routeNavigate(history, ROUTE_METHOD.REPLACE, ROUTE.HOME, search, null);
        } else if (history.location.pathname === ROUTE.CREATE_APP) {
          routeNavigate(history, ROUTE_METHOD.REPLACE, ROUTE.HOME, search, null);
        } else {
          routeNavigate(history, ROUTE_METHOD.REPLACE, null, search, null);
        }
      };

        const componentsList = createAppListing.map((option) => (
      <div key={option.TITLE} className={styles.OuterCard}>
        <Card
            colorScheme={colorSchemaDefaultValue}
            image={option?.IMAGE}
            className={cx(styles.ComponentCard)}
            size={ETCardSize.sm}
            title={option.TITLE}
            iconClass={styles.CardIcon}
            description={option.DESCRIPTION}
            cardTitleClass={cx(gClasses.FTwo16, gClasses.FontWeight500, styles.CardTitle)}
            descriptionClass={styles.CardText}
            descriptionTextClass={cx(gClasses.FTwo12)}
            onClick={() => onCardClick(option.TITLE)}
        />
      </div>
    ));

    const headerContent = (
      <div className={cx(gClasses.CenterV, BS.JC_END, BS.W100)}>
        <button
            className={cx(gClasses.CenterV)}
            onClick={onCloseCreateModal}
        >
          <CloseVectorIcon />
        </button>
      </div>
    );

    const modalContent = (
        <>
            <Title
              content={t(CREATE_MODAL.HEADER)}
              className={cx(gClasses.FTwo24GrayV3, gClasses.FontWeight500, styles.MainTitle)}
            />
            <div className={styles.AppListing}>
              {componentsList}
            </div>
        </>
    );

    return (
        <Modal
            id={CREATE_MODAL.ID}
            modalStyle={ModalStyleType.modal}
            className={cx(className)}
            customModalClass={createModalClass}
            isModalOpen
            headerContent={headerContent}
            mainContent={modalContent}
            modalSize={ModalSize.full}
            enableEscClickClose
            onCloseClick={onCloseCreateModal}
        />
    );
}

const mapStateToProps = ({ RoleReducer }) => {
  return {
    role: RoleReducer.role,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAddDataListModalVisibilityAction: (data) => {
      dispatch(toggleAddDataListModalVisibility(data));
    },
    clearCreateEditDetailsAction: () => {
      dispatch(clearCreateEditDetails());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateAppModal);
