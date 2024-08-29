import React, { useEffect, useRef } from 'react';
import cx from 'classnames/bind';

import EditIcon from 'assets/icons/EditIcon';
import { ACTION_TYPE } from 'utils/constants/action.constant';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import Tab, { TAB_TYPE } from 'components/tab/Tab';
import { isEmpty } from 'utils/jsUtility';
import { BS } from 'utils/UIConstants';
import DeleteIcon from 'assets/icons/DeleteIcon';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from 'components/form_components/helper_message/HelperMessage';
import gClasses from 'scss/Typography.module.scss';
import Button, {
  BUTTON_TYPE,
} from 'components/form_components/button/Button';
import AddIcon from 'assets/icons/AddIcon';
import styles from './ConfigurationCard.module.scss';
import DependencyHandler from './dependency_handler/DependencyHandler';

function ActionCard(props) {
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
  } = props;
   const referenceFieldDependencyPopper = useRef(null);
   const dependencyPopupWrapperRef = useRef(null);
  const {
    action = '',
    actionTitle,
    actionSubTitle,
  } = data;

  useEffect(() => {
    if (!isEmpty(dependencyData)) {
      if (dependencyPopupWrapperRef && dependencyPopupWrapperRef.current) dependencyPopupWrapperRef.current.focus();
    }
  }, [dependencyData]);

  const dialogFooter = (
    <>
      <div ref={isConfigPopupVisible ? referenceFieldDependencyPopper : null}>
        <DeleteIcon
          className={cx(gClasses.CursorPointer, {
            [BS.D_NONE]: hideDeleteButton,
          })}
          onClick={onDeleteClickHandler}
        />
      </div>

      <Button onClick={onSaveClickHandler} buttonType={BUTTON_TYPE.PRIMARY}>
        Save
      </Button>
    </>
  );
  console.log('ooooooo', data);

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
          onActionDropdownSelectHandler(ACTION_TYPE.FORWARD);
        }}
      >
        <div
          className={cx(
            gClasses.FTwo13,
            gClasses.FontWeight500,
            gClasses.CenterVH,
          )}
          style={{ color: '#1a9cd1' }}
        >
          <AddIcon className={cx(styles.AddIcon, gClasses.CenterVH)} />
          Add button
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
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
            <div className={cx(gClasses.CenterV)}>
              <Button
                className={cx(
                  gClasses.Ellipsis,
                  styles.ActionButton,
                  gClasses.CursorDefaultImp,
                )}
                buttonType={
                  (!data.action_type || data.action_type === ACTION_TYPE.FORWARD || data.action_type === ACTION_TYPE.END_FLOW)
                    ? BUTTON_TYPE.PRIMARY
                    : BUTTON_TYPE.SECONDARY
                }
                primaryButtonStyle={buttonClasses}
              >
                {action}
              </Button>
              <div className={gClasses.ML15}>
                <div
                  className={cx(gClasses.FTwo12GrayV9)}
                >
                  {actionTitle}
                </div>
                <div
                  className={cx(
                    gClasses.MT1,
                    gClasses.FTwo12BlackV6,
                    gClasses.FontWeight500,
                    gClasses.Ellipsis,
                    gClasses.W148,
                  )}
                  title={actionSubTitle}
                >
                  {actionSubTitle}
                </div>
              </div>
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
                )}
                onClick={onOpenActionConfigHandler}
                title="Action Config"
              >
                <EditIcon className={styles.EditIcon} title="Action Config" />
              </button>
              <button
                className={cx(
                  styles.EditIconContainer,
                  gClasses.CenterVH,
                  gClasses.CursorPointer,
                  gClasses.ClickableElement,
                  gClasses.MR10,
                  gClasses.FlexShrink0,
                )}
                onClick={onDeleteClickHandler}
                title="Action Config"
                ref={isConfigPopupVisible ? null : referenceFieldDependencyPopper}
              >
                <DeleteIcon className={styles.DeletIcon} title="Action Config" />
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

export default ActionCard;
