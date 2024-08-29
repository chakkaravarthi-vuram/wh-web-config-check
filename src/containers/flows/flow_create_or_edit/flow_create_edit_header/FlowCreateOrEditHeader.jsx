import React, { useMemo, useRef, useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import {
  Button,
  Text,
  EButtonType,
  EButtonSizeType,
  DropdownList,
  EPopperPlacements,
  Popper,
  Tab,
  ETabVariation,
  ETextSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import styles from '../FlowCreateOrEdit.module.scss';
import ThreeDotsIcon from '../../../../assets/icons/datalists/ThreeDots';
import {
  FLOW_CREATE_EDIT_CONSTANTS,
  VALIDATE_FLOW_HEADER_KEY_MAP,
} from '../FlowCreateOrEdit.constant';
import StepperSeparatorIcon from '../../../../assets/icons/datalists/stepper/StepperSeparatorIcon';
import DiscardDraftFlows from '../../flow_landing/discard_draft_flows/DiscardDraftFlows';
import DeleteFlow from '../../flow_landing/flow_delete/FlowDelete';
import FlowEditBasicDetails from '../../flow_landing/flow_header/edit_flow/FlowEditBasicDetails';
import { ManageFlowFieldsProvider } from '../../../edit_flow/manage_flow_fields/use_manage_flow_fields_reducer/useManageFlowFieldsReducer';
import ManageFlowFields from '../../../edit_flow/manage_flow_fields/ManageFlowFields';
import { MANAGE_FLOW_FIELD_INITIAL_STATE } from '../../../edit_flow/manage_flow_fields/ManageFlowFields.constants';
import {
  truncateWithEllipsis,
  useClickOutsideDetector,
} from '../../../../utils/UtilityFunctions';
import { has, isEmpty } from '../../../../utils/jsUtility';
import { FLOW_CONSTANTS } from '../../flow_landing/FlowLanding.constant';

function FlowCreateOrEditHeader(props) {
  const {
    onTabChange,
    currentTab,
    dispatch,
    state,
    onPublish,
    metaData,
    onSaveAndClose,
    onSaveFlow, // api call function
    onDiscardDelete,
  } = props;
  const optionRef = useRef(null);
  const optionContainerRef = useRef(null);
  const [showMore, setShowMore] = useState(false);
  const [showOptions, setShowOptions] = useState(0);
  const { t } = useTranslation();
  const { TAB_STEPPER, HEADER, HEADER_POPPER_OPTIONS } =
    FLOW_CREATE_EDIT_CONSTANTS(t);
  const oncloseShowOptions = () => setShowOptions(0);
  useClickOutsideDetector(optionContainerRef, () => setShowMore(false), []);

  const stepperTabs = useMemo(() => {
    const tabs = [...TAB_STEPPER];
    const { publishErrors = {} } = state;

    Object.keys(publishErrors).forEach((key) => {
      if (has(VALIDATE_FLOW_HEADER_KEY_MAP, [key])) {
        if (key === 'dashboard') {
          publishErrors[key]?.forEach((error) => {
            if (error?.field?.includes('report')) {
              tabs[VALIDATE_FLOW_HEADER_KEY_MAP.report].hasError = true;
            } else if (error?.field?.includes('dashboard_metadata.pages')) {
              tabs[VALIDATE_FLOW_HEADER_KEY_MAP.dashboard].hasError = true;
            }
          });
        } else {
          tabs[VALIDATE_FLOW_HEADER_KEY_MAP[key]].hasError = !isEmpty(
            publishErrors[key],
          );
        }
      }
    });
    return tabs;
  }, [state.publishErrors]);

  const headerMenuOptions = useMemo(() => {
    const menuOptions = [...HEADER_POPPER_OPTIONS];
    if (!(state.status === FLOW_CONSTANTS(t).PUBLISHED || state.version > 1)) {
      menuOptions.splice(2, 1); // removing delete draft option
    }
    return menuOptions;
  }, []);

  const headerPopperOptions = (option) => {
    switch (option) {
      case 1: {
        const data = {
          name: state.name,
          description: state.description,
        };
        return (
          <FlowEditBasicDetails
            metaData={metaData}
            data={data}
            dispatch={dispatch}
            onClose={oncloseShowOptions}
            onSaveFlow={onSaveFlow}
          />
        );
      }
      case 2:
        return (
          <DiscardDraftFlows
            metaData={metaData}
            onClose={oncloseShowOptions}
            onDiscard={onDiscardDelete}
          />
        );
      case 3:
        return (
          <DeleteFlow
            metaData={metaData}
            onClose={oncloseShowOptions}
            onDelete={onDiscardDelete}
          />
        );
      case 4:
        return (
          <ManageFlowFieldsProvider
            initialState={MANAGE_FLOW_FIELD_INITIAL_STATE}
          >
            <ManageFlowFields
              onCloseClick={oncloseShowOptions}
              flowId={metaData?.flowId}
            />
          </ManageFlowFieldsProvider>
        );
      default:
        return null;
    }
  };

  return (
  <>
    {showMore && <div className={styles.EntireOverlay} />}
    <div
      className={cx(
        styles.HeaderContainer,
        gClasses.CenterV,
        gClasses.PX16,
        gClasses.JusSpaceBtw,
      )}
    >
      {headerPopperOptions(showOptions)}
      <div>
        <Text content={HEADER.EDIT_FLOW} className={gClasses.FTwo12GrayV101} />
        <Text
          content={truncateWithEllipsis(state.name, 25)}
          title={state.name}
          className={cx(
            gClasses.MT4,
            gClasses.FTwo13GrayV90,
            gClasses.FontWeight500,
            styles.FlowName,
          )}
        />
      </div>
      <Tab
        options={stepperTabs}
        selectedTabIndex={currentTab}
        variation={ETabVariation.progress}
        tabSizeVariation={ETextSize.XS}
        SeparatorIcon={StepperSeparatorIcon}
        tabDisplayCount={6}
        onClick={(tab) => onTabChange(tab)}
      />
      <div className={gClasses.CenterV}>
        <Button
          buttonText={HEADER.SAVE_CLOSE}
          className={cx(gClasses.MR16, gClasses.P0)}
          type={EButtonType.TERTIARY}
          size={EButtonSizeType.SM}
          onClickHandler={onSaveAndClose}
        />
        <Button
          buttonText={HEADER.PUBLISH}
          className={gClasses.MR8}
          type={EButtonType.PRIMARY}
          size={EButtonSizeType.SM}
          onClickHandler={onPublish}
        />
        <div ref={optionContainerRef}>
          <button ref={optionRef} onClick={() => setShowMore(true)}>
            <ThreeDotsIcon />
          </button>
            <Popper
              targetRef={optionRef}
              open={showMore}
              placement={EPopperPlacements.BOTTOM_START}
              content={
                <DropdownList
                  optionList={headerMenuOptions}
                  onClick={(value) => {
                    setShowMore(false);
                    setShowOptions(value);
                  }}
                />
              }
            />
        </div>
      </div>
    </div>
  </>
  );
}

export default FlowCreateOrEditHeader;
