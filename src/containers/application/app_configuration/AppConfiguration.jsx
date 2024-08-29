import React, { useState } from 'react';
import cx from 'classnames';
import {
  Modal,
  ModalStyleType,
  ModalSize,
  Button,
  EButtonType,
  Text,
  ETextSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { APP_ARIA_LABELS, APP_CONFIGURATION_TYPE } from './AppConfiguration.constants';
import TaskConfiguration from './task_configuration/TaskConfiguration';
import { BS } from '../../../utils/UIConstants';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './AppConfiguration.module.scss';
import { keydownOrKeypessEnterHandle, validate } from '../../../utils/UtilityFunctions';
import TextStylingConfiguration from './text_styling_configuration/TextStylingConfiguration';
import LinkPageConfiguration from './link/page_configuration/LinkPageConfiguration';
import { applicationStateChange } from '../../../redux/reducer/ApplicationReducer';
import { deleteComponentApiThunk, getAppComponentsThunk, saveComponentApiThunk } from '../../../redux/actions/Appplication.Action';
import { linkConfigurationData } from './link/page_configuration/LinkConfiguration.utils';
import { getCompValidateConfigurationData, getPostDataForTaskComponent, saveCompValidationSchema } from '../application.validation.schema';
import jsUtility, { cloneDeep, isEmpty } from '../../../utils/jsUtility';
import ImageConfiguration from './image/ImageConfiguration';
import { imageConfigurationData } from './image/ImageConfiguration.utils';
import DeleteConfirmModal from '../delete_comfirm_modal/DeleteConfirmModal';
import { GET_APP_LIST_LABEL } from '../app_listing/AppList.constants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import ReportConfiguration from './report_configuration/ReportConfiguration';
import { APP_CONFIG_HEADERS, BUTTONS, DELETE_COMPONENT_LABEL } from './AppConfigurtion.utils';
import DashboardConfig from './dashboard_configuration/DashboardConfig';
import CloseVectorIcon from '../../../assets/icons/create_app/create_modal/CloseVectorIcon';
import WebpageEmbed from './webpage_embed/WebpageEmbed';

function AppConfiguration(props) {
  const {
     type,
     isPopperOpen,
     activeComponent,
     onSaveComponent,
     onDeleteComponent,
     onClearActiveComponent,
     onSetModalVisibility,
     getComponentsApi,
     app_id,
     current_page_id,
     isBasicUser,
     appOnChange,
     errorPerPageComp,
     isComponentError,
     componentIndex,
     pageIndex,
     activeTextComponentData,
     isEmbedUrlVerified,
    } = props;
  const { appId } = useParams();
  const [deleteStatus, setDeleteStatus] = useState(false);
  const { t } = useTranslation();
  const APP_LIST_LABEL = GET_APP_LIST_LABEL(t);
  let isEdit = false;
  if (appId) {
    isEdit = true;
  }

  const onSaveServerErrorClear = () => {
    const clonedErrorPerPageComp = cloneDeep(errorPerPageComp);
    if (!isEmpty(errorPerPageComp?.[pageIndex])) {
      clonedErrorPerPageComp[pageIndex] = clonedErrorPerPageComp?.[pageIndex]?.filter((comp) => comp.errorCompIndex !== componentIndex);
    }
    if (isEmpty(clonedErrorPerPageComp?.[pageIndex])) delete clonedErrorPerPageComp?.[pageIndex];
    appOnChange({ errorPerPageComp: clonedErrorPerPageComp });
  };

  const getComponents = () => {
    if (isComponentError) onSaveServerErrorClear();
    const params = {
      app_id: app_id,
      page_id: current_page_id,
    };
    getComponentsApi(params, isBasicUser);
  };

  let headingText = null;
  let mainContent = null;

  switch (type) {
    case APP_CONFIGURATION_TYPE.TASK:
      headingText = t(APP_CONFIG_HEADERS.TASK);
      mainContent = <TaskConfiguration />;
      break;
    case APP_CONFIGURATION_TYPE.LINK:
      headingText = t(APP_CONFIG_HEADERS.LINK);
      mainContent = (<LinkPageConfiguration />);
      break;
    case APP_CONFIGURATION_TYPE.DASHBOARDS:
      headingText = t(APP_CONFIG_HEADERS.DASHBOARD);
      mainContent = <DashboardConfig type={type} />;
      break;
    case APP_CONFIGURATION_TYPE.IMAGE:
      headingText = t(APP_CONFIG_HEADERS.IMAGE);
      mainContent = <ImageConfiguration />;
      break;
    case APP_CONFIGURATION_TYPE.TEXT_STYLE:
      headingText = t(APP_CONFIG_HEADERS.TEXT);
      mainContent = <TextStylingConfiguration type={type} />;
      break;
    case APP_CONFIGURATION_TYPE.REPORTS:
      headingText = t(APP_CONFIG_HEADERS.REPORTS);
      mainContent = <ReportConfiguration />;
      break;
    case APP_CONFIGURATION_TYPE.WEBPAGE_EMBED:
      headingText = t(APP_CONFIG_HEADERS.WEBPAGE_EMBED);
      mainContent = <WebpageEmbed />;
      break;
    default:
      return null;
  }

  const onModalClose = () => {
    onClearActiveComponent();
    onSetModalVisibility(false);
    appOnChange({
      error_list_config: {},
      activeTextCompElementText: EMPTY_STRING,
      isComponentError: false,
      pageIndex: EMPTY_STRING,
      componentIndex: EMPTY_STRING,
      isEmbedUrlVerified: false,
     });
  };

  const onSave = () => {
    let saveData = {};
    let textData = {};
    const clonedActiveComponet = jsUtility.cloneDeep(activeComponent);
    switch (type) {
      case APP_CONFIGURATION_TYPE.LINK:
        saveData = linkConfigurationData(activeComponent, t);
        break;
      case APP_CONFIGURATION_TYPE.IMAGE:
        saveData = imageConfigurationData(activeComponent);
        break;
      case APP_CONFIGURATION_TYPE.TASK:
        saveData = getPostDataForTaskComponent(clonedActiveComponet);
        break;
      case APP_CONFIGURATION_TYPE.TEXT_STYLE:
        jsUtility.unset(clonedActiveComponet, ['label']);
        saveData = clonedActiveComponet;
        textData = { component_info: { formatter: activeTextComponentData || activeComponent?.component_info?.formatter }, type: APP_CONFIGURATION_TYPE.TEXT_STYLE };
        console.log('errorlist check saveData', saveData);
        break;
      case APP_CONFIGURATION_TYPE.WEBPAGE_EMBED:
        clonedActiveComponet.component_info = { ...clonedActiveComponet.component_info, shortcut_style: 'embed_url' };
        saveData = clonedActiveComponet;
        textData = {
          component_info: { ...clonedActiveComponet.component_info },
          isEmbedUrlVerified,
          type: APP_CONFIGURATION_TYPE.WEBPAGE_EMBED,
          label: clonedActiveComponet.label,
        };
        console.log('errorlist check saveData', saveData);
        console.log('errorlist check textData', textData);
        break;
      default:
        saveData = activeComponent;
    }
    console.log('errorlist end swrtich', textData);
    const errorlist = validate(getCompValidateConfigurationData([APP_CONFIGURATION_TYPE.TEXT_STYLE, APP_CONFIGURATION_TYPE.WEBPAGE_EMBED].includes(type) ? textData : saveData), saveCompValidationSchema(t));
    console.log('errorlist after validate', errorlist);
    appOnChange({ error_list_config: errorlist });
    if (jsUtility.isEmpty(errorlist)) {
      onSaveComponent(saveData, t, isEdit, getComponents);
    }
  };

  const onDelete = () => {
    setDeleteStatus(false);
    onDeleteComponent({ _id: activeComponent?._id }, getComponents);
  };

  const getHeaderContent = () => (
    <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.W100, styles.Header)}>
      <div className={styles.HeaderTitle}>{headingText}</div>
      <button
        onClick={onModalClose}
        onKeyDown={(e) =>
          keydownOrKeypessEnterHandle(e) && onModalClose()
        }
        className={cx(BS.D_FLEX)}
      >
       <CloseVectorIcon
          className={cx(styles.CloseIcon, BS.JC_END, gClasses.CursorPointer)}
          ariaLabel={t(APP_ARIA_LABELS.CLOSE_APP_MODAL)}
       />
      </button>
    </div>
  );

  const getFooterContent = () => (
    <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
     { (activeComponent?._id) && (
      <button
        onClick={() => setDeleteStatus(true)}
        className={cx(styles.DeleteButton)}
      >
        <Text content={t(DELETE_COMPONENT_LABEL)} size={ETextSize.MD} className={cx(gClasses.red22, gClasses.WhiteSpaceNoWrap)} />
      </button>)}
      <DeleteConfirmModal
        isModalOpen={deleteStatus}
        content={APP_LIST_LABEL.DELETE_COMPONENT}
        firstLine={APP_LIST_LABEL.DELETE_COMPONENT_FIRST}
        secondLine={APP_LIST_LABEL.DELETE_COMPONENT_SECOND}
        onDelete={() => onDelete()}
        onCloseModal={() => setDeleteStatus(false)}
      />
      <div className={cx(BS.D_FLEX, BS.JC_END, BS.W100)}>
        <Button
          className={cx(styles.CancelButton)}
          buttonText={t(BUTTONS.CANCEL)}
          type={EButtonType.OUTLINE_SECONDARY}
          onClickHandler={onModalClose}
        />
        <Button
          buttonText={t(BUTTONS.SAVE)}
          type={EButtonType.PRIMARY}
          onClickHandler={onSave}
        />
      </div>
    </div>
  );

  return (
    <Modal
      id="dashboard_config_modal"
      isModalOpen={isPopperOpen}
      headerContent={getHeaderContent()}
      headerContentClassName={cx(BS.D_FLEX, styles.AppConfigHeader)}
      mainContent={mainContent}
      modalStyle={ModalStyleType.modal}
      className={styles.DashboardConfigAppModal}
      mainContentClassName={cx(BS.D_FLEX, styles.AppConfigMain)}
      modalSize={ModalSize.md}
      footerContent={getFooterContent()}
      footerContentClassName={cx(
        styles.FooterContent,
      )}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    activeComponent: state.ApplicationReducer.activeComponent,
    isEmbedUrlVerified: state.ApplicationReducer.isEmbedUrlVerified,
    activeTextComponentData: state.ApplicationReducer.activeTextCompElementText,
    current_page_id: state.ApplicationReducer.current_page_id,
    app_id: state.ApplicationReducer.activeAppData.id,
    errorPerPageComp: state.ApplicationReducer.errorPerPageComp,
    isComponentError: state.ApplicationReducer.isComponentError,
    componentIndex: state.ApplicationReducer.componentIndex,
    pageIndex: state.ApplicationReducer.pageIndex,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClearActiveComponent: () => dispatch(applicationStateChange({ activeComponent: {} })),
    onSetModalVisibility: (value) => dispatch(applicationStateChange({ isConfigurationOpen: value })),
    onDeleteComponent: (params, callback) => dispatch(deleteComponentApiThunk(params, callback)),
    onSaveComponent: (params, translate, isEdit, func) => dispatch(saveComponentApiThunk(params, translate, isEdit, func)),
    getComponentsApi: (params) => dispatch(getAppComponentsThunk(params)),
    appOnChange: (params) => dispatch(applicationStateChange(params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AppConfiguration);
