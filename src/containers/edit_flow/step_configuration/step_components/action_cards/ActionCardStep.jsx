import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { ACTION_TYPE } from 'utils/constants/action.constant';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import Tab, { TAB_TYPE } from 'components/tab/Tab';
import { isEmpty } from 'utils/jsUtility';
import { BS } from 'utils/UIConstants';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from 'components/form_components/helper_message/HelperMessage';
import gClasses from 'scss/Typography.module.scss';
import Button, {
  BUTTON_TYPE,
} from 'components/form_components/button/Button';
import AddIcon from 'assets/icons/AddIcon';
import EditIconV2 from 'assets/icons/form_fields/EditIconV2';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import { STEP_CARD_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import styles from './ActionCard.module.scss';
import DependencyHandler from '../../../../../components/dependency_handler/DependencyHandler';

function ActionCard(props) {
  const { t } = useTranslation();
  const {
    className,
    data,
    onOpenActionConfigHandler,
    isConfigPopupVisible,
    errorMessage,
    tabList,
    currentTabComponent,
    selectedTabIndex,
    onCloseClickHandler,
    onDeleteClickHandler,
    dialogBoxTitle,
    hideDeleteButton,
    onSaveClickHandler,
    dependencyData,
    dependencyName,
    dependencyConfigCloseHandler,
    onDeleteFormButtonDependencyConfig,
    isAddNewBtn,
    onActionDropdownSelectHandler,
    setTab,
    isNavOpen,
  } = props;
   const referenceFieldDependencyPopper = useRef(null);
   const dependencyPopupWrapperRef = useRef(null);
  const {
    action = '',
  } = data;

  console.log('isNavOpen1213', isNavOpen);

  const dialogFooter = (
    <>
      <div ref={isConfigPopupVisible ? referenceFieldDependencyPopper : null}>
          <Button
            buttonType={BUTTON_TYPE.SECONDARY}
            onClick={onCloseClickHandler}
          >
            { STEP_CARD_STRINGS(t).CANCEL_BUTTON}
          </Button>
          <Button
            buttonType={BUTTON_TYPE.DELETE}
            className={cx(BS.TEXT_NO_WRAP, {
              [BS.D_NONE]: hideDeleteButton,
            })}
            onClick={onDeleteClickHandler}
          >
            {STEP_CARD_STRINGS(t).DELETE_BUTTON}
          </Button>
      </div>

      <Button onClick={onSaveClickHandler} buttonType={BUTTON_TYPE.PRIMARY}>
        {STEP_CARD_STRINGS(t).SAVE_BUTTON}
      </Button>
    </>
  );

  const header = (
    <div className={cx(styles.header)}>
      <div className={cx(BS.D_FLEX, BS.FLEX_ROW, BS.JC_BETWEEN)}>
        <div className={gClasses.CenterV}>
          <div className={cx(gClasses.ModalHeader, gClasses.CursorPointer)}>
            {dialogBoxTitle}
          </div>
        </div>
      </div>
      <Tab
        className={cx(gClasses.MT5)}
        tabIList={tabList}
        selectedIndex={selectedTabIndex}
        type={TAB_TYPE.TYPE_5}
        setTab={setTab}
      />
    </div>
  );

  const dependencyPopup = !isEmpty(dependencyData) && (
    <DependencyHandler
      onDeleteClick={onDeleteFormButtonDependencyConfig}
      onCancelDeleteClick={dependencyConfigCloseHandler}
      dependencyHeaderTitle={dependencyName}
      dependencyData={dependencyData}
    />
  );

  let buttonClasses = null;
  if (!(!data.action_type || data.action_type === ACTION_TYPE.FORWARD || data.action_type === ACTION_TYPE.END_FLOW)) {
    buttonClasses = styles.PrimaryButtonStyle;
  }

  if (isAddNewBtn) {
    return (
      <button
        id="add_form_field"
        className={cx(
          styles.AddBtnWidth,
          gClasses.CenterVH,
          gClasses.ClickableElement,
          gClasses.CursorPointer,
          gClasses.DashedBorder,
        )}
        onClick={() => {
          onActionDropdownSelectHandler();
        }}
      >
        <div
          className={cx(
            gClasses.FTwo13BlueV39,
            gClasses.FontWeight500,
            gClasses.CenterVH,
          )}
        >
          <AddIcon className={cx(styles.AddIcon, gClasses.CenterVH)} />
          {STEP_CARD_STRINGS(t).ADD_BUTTON}
        </div>
      </button>
    );
} else {
    return (
      <div className={className}>
        <div
          className={cx(
            styles.Container,
            BS.P_RELATIVE,
            gClasses.CenterH,
            BS.FLEX_COLUMN,
            !!errorMessage && styles.ErrorBorder,
            gClasses.MB16,
          )}
        >
          <ModalLayout
            id="flow-action-card"
            modalContainerClass={styles.ModalContainerClass}
            headerContent={header}
            headerClassName={gClasses.PB0}
            footerContent={dialogFooter}
            isModalOpen={isConfigPopupVisible}
            mainContent={(
              <>
              {currentTabComponent}
              <div className={BS.P_ABSOLUTE}>
              {dependencyPopup}
              </div>
              </>
            )}
            onCloseClick={onCloseClickHandler}
          />
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
            <div className={cx(gClasses.CenterV)} title={action}>
              <Button
                className={cx(
                  gClasses.Ellipsis,
                  isNavOpen ? styles.ActionButtonNavOpen : styles.ActionButton,
                  gClasses.CursorDefaultImp,
                )}
                buttonType={
                  (!data.action_type || data.action_type === ACTION_TYPE.FORWARD || data.action_type === ACTION_TYPE.END_FLOW)
                    ? BUTTON_TYPE.PRIMARY
                    : BUTTON_TYPE.SECONDARY
                }
                primaryButtonStyle={buttonClasses}
                disabled
              >
                {action}
              </Button>
            </div>
            <div className={cx(BS.D_FLEX, gClasses.ML20)}>
              <button
                className={cx(
                  styles.EditIconContainer,
                  gClasses.CenterVH,
                  gClasses.CursorPointer,
                  gClasses.ClickableElement,
                  gClasses.MR7,
                  gClasses.FlexShrink0,
                  styles.EditContainer,
                  )}
                onClick={onOpenActionConfigHandler}
                title="Action Config"
              >
                <EditIconV2 className={styles.EditIcon} title="Action Config" />
              </button>
              <button
                className={cx(
                  styles.EditIconContainer,
                  gClasses.CenterVH,
                  gClasses.CursorPointer,
                  gClasses.ClickableElement,
                  gClasses.FlexShrink0,
                  styles.DeleteContainer,
                )}
                onClick={onDeleteClickHandler}
                title="Action Config"
                ref={isConfigPopupVisible ? null : referenceFieldDependencyPopper}
              >
                <DeleteIconV2 className={styles.DeletIcon} title="Action Config" />
              </button>
            </div>
          </div>
          {
            !isConfigPopupVisible && (
                <div tabIndex={-1} onBlur={dependencyConfigCloseHandler} ref={dependencyPopupWrapperRef}>
                  {dependencyPopup}
                </div>
              )
            }
        </div>
        <HelperMessage
          className={cx(gClasses.MT4, {
            [BS.D_NONE]: !errorMessage,
          })}
          type={HELPER_MESSAGE_TYPE.ERROR}
          message={errorMessage}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isNavOpen: state.NavBarReducer.isNavOpen,
  };
};

export default connect(mapStateToProps)(ActionCard);
