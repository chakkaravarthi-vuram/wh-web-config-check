import React, { useState, useRef, useEffect } from 'react';
import {
  Thumbnail,
  EThumbnailSize,
  Popper,
  EPopperPlacements,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import styles from './FlowNodeDropDown.module.scss';
import {
  FLOW_NODE_DROPDOWN_LIST,
  FLOW_NODE_IDS_TYPES,
  FLOW_ROUTING_STEPS_OPTIONS_LIST,
  INTEGRATION_OPTIONS_LIST,
  SYSTEM_STEPS_OPTIONS_LIST,
} from './FlowNodeDropDown.constants';
import {
  keydownOrKeypessEnterHandle, useClickOutsideDetector, validate,
} from '../../../../../utils/UtilityFunctions';
import { STEP_TYPE } from '../../../../../utils/Constants';
import {
  constructJoiObject,
  FLOW_STEP_NAME_VALIDATION,
} from '../../../../../utils/ValidationConstants';
import { isEmpty } from '../../../../../utils/jsUtility';
import AddUserStep from './AddUserStep';
import { STEP_NAME_LABEL } from '../../../../../utils/strings/CommonStrings';

function FlowNodeDropDown(props) {
  const { id, removeNode, referenceElement, addNewNode, parentId, sourcePosition, linkToParent = true, restrictedNodes = [] } = props;
  const { t } = useTranslation();
  const [subMenuOption, setSubMenuOption] = useState(null);
  const [newStepName, setNewStepName] = useState(null);
  const subMenuRefUserNode = useRef(null);
  const subMenuRefSystemNode = useRef(null);
  const subMenuRefIntegrationNode = useRef(null);
  const subMenuRefRoutingNode = useRef(null);
  const [newStepNameError, setNewStepNameError] = useState(null);
  const containerRef = useRef(null);

  let subMenuComponent = null;

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.focus();
    }
  }, [containerRef]);

  useClickOutsideDetector(containerRef, () => {
    removeNode();
  });

  const createNewStepAndConnect = async (params) => {
    const res = await addNewNode(params, linkToParent ? { linkToStep: parentId, sourcePosition } : {});
    if (res.isSuccess) {
      return removeNode();
    }
    if (res?.errors?.stepName) {
      setNewStepNameError(res?.errors?.stepName);
    }
    return false;
  };

  const optionClicked = (e, option) => {
    e.stopPropagation();
    if (!isEmpty(option.TYPE)) {
      if (option.TYPE === STEP_TYPE.END_FLOW) {
        // create end node and connect
        createNewStepAndConnect({ stepType: STEP_TYPE.END_FLOW });
      } else {
        setSubMenuOption(option.TYPE);
      }
    }
  };

  const subMenuOptionClicked = (e, option) => {
    e.stopPropagation();
    createNewStepAndConnect({ stepType: option.TYPE });
  };

  const createNewUserStep = async () => {
    const errors = validate(
      { stepName: newStepName?.trim() },
      constructJoiObject({
        stepName: FLOW_STEP_NAME_VALIDATION.label(t(STEP_NAME_LABEL)).required(),
      }),
    );
    if (isEmpty(errors)) {
      await createNewStepAndConnect({ stepType: STEP_TYPE.USER_STEP, stepName: newStepName });
    } else {
      setNewStepNameError(errors.stepName);
    }
  };

  const stepNameChangeHandler = (e, isOnBlur) => {
    let { target: { value } } = e;
    let stepNameError = null;
    setNewStepName(value);
    if (!isEmpty(newStepNameError) || isOnBlur) {
      value = value.trim();
      const errors = validate(
        { stepName: value },
        constructJoiObject({
          stepName: FLOW_STEP_NAME_VALIDATION.label(t(STEP_NAME_LABEL)).required(),
        }),
      );
      if (errors) {
        stepNameError = errors.stepName;
      }
      setNewStepNameError(stepNameError);
    }
  };
  const getSubMenuComponent = () => {
    let subMenuContainerStyles = styles.Container;
    switch (subMenuOption) {
      case FLOW_NODE_IDS_TYPES.INTEGRATION_ML:
        subMenuComponent = INTEGRATION_OPTIONS_LIST(t).map((option) => (
          <div
            id={option.ID}
            key={option.ID}
            onClick={(e) => subMenuOptionClicked(e, option)}
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) =>
              keydownOrKeypessEnterHandle(e) && subMenuOptionClicked(e, option)
            }
          >
            <div className={gClasses.CenterV}>
              <Thumbnail
                showIcon
                size={EThumbnailSize.xxs}
                className={styles.Thumbnail}
                icon={option.ICON}
                backgroundColor={option.COLOR}
              />
              <div className={cx(styles.OptionLabel, gClasses.ML10)}>
                {t(option.TITLE)}
              </div>
            </div>
          </div>
        ));
        break;
      case FLOW_NODE_IDS_TYPES.FLOW_ROUTING_STEPS:
        subMenuComponent = FLOW_ROUTING_STEPS_OPTIONS_LIST(t).map((option) => {
          const isDisabled = restrictedNodes?.includes(option.TYPE);
          return (
            <div
              id={option.ID}
              key={option.ID}
              onClick={(e) => !isDisabled && subMenuOptionClicked(e, option)}
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) =>
                !isDisabled && keydownOrKeypessEnterHandle(e) && subMenuOptionClicked(e, option)
              }
            >
              <div className={gClasses.CenterV}>
                <Thumbnail
                  showIcon
                  size={EThumbnailSize.xxs}
                  className={styles.Thumbnail}
                  icon={option.ICON}
                  backgroundColor={option.COLOR}
                />
                <div className={cx(styles.OptionLabel, gClasses.ML10, isDisabled && styles.AddNewStepLabel)}>
                  {t(option.TITLE)}
                </div>
              </div>
            </div>
          );
        });
        break;
      case FLOW_NODE_IDS_TYPES.SYSTEM_STEP:
        subMenuComponent = SYSTEM_STEPS_OPTIONS_LIST(t).map((option) => (
          <div
            id={option.ID}
            key={option.ID}
            onClick={(e) => subMenuOptionClicked(e, option)}
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) =>
              keydownOrKeypessEnterHandle(e) && subMenuOptionClicked(e, option)
            }
          >
            <div className={gClasses.CenterV}>
              <Thumbnail
                showIcon
                size={EThumbnailSize.xxs}
                icon={option.ICON}
                backgroundColor={option.COLOR}
              />
              <div className={cx(styles.OptionLabel, gClasses.ML10)}>
                {t(option.TITLE)}
              </div>
            </div>
          </div>
        ));
        break;
      case FLOW_NODE_IDS_TYPES.USER_STEP:
        subMenuContainerStyles = null;
        subMenuComponent = (
          <AddUserStep
            stepNameChangeHandler={stepNameChangeHandler}
            createNewUserStep={createNewUserStep}
            newStepNameError={newStepNameError}
            newStepName={newStepName}
          />
        );
        break;
      default:
        break;
    }
    return (
      <div
        id="flow_dropdown_sub_menu"
        className={cx(subMenuContainerStyles, styles.SubMenu)}
      >
        {subMenuComponent}
      </div>
    );
  };

  const getActiveSubMenuRef = (subMenuOption) => {
    let ref = null;
    switch (subMenuOption) {
      case STEP_TYPE.USER_STEP:
        ref = subMenuRefUserNode;
        break;
      case FLOW_NODE_IDS_TYPES.FLOW_ROUTING_STEPS:
        ref = subMenuRefRoutingNode;
        break;
      case FLOW_NODE_IDS_TYPES.INTEGRATION_ML:
        ref = subMenuRefIntegrationNode;
        break;
      case FLOW_NODE_IDS_TYPES.SYSTEM_STEP:
        ref = subMenuRefSystemNode;
        break;
      default:
        break;
    }
    return ref;
  };

  const dropdownList = FLOW_NODE_DROPDOWN_LIST(t).map((option) => {
    const addNewStep = option.ID === FLOW_NODE_IDS_TYPES.ADD_NEW_STEPS;
    const isDisabled = restrictedNodes?.includes(option.TYPE);
    const ref = getActiveSubMenuRef(option.TYPE);
    return (
      <div
        className={cx(styles.OptionContainer)}
        onClick={(e) => !isDisabled && optionClicked(e, option)}
        role="menuitem"
        tabIndex="0"
        onKeyDown={(e) =>
          !isDisabled && keydownOrKeypessEnterHandle(e) && optionClicked(e, option, ref)
        }
        id={option.ID}
        key={option.ID}
        ref={ref}
      >
        <div className={cx(gClasses.CenterV, gClasses.FlexJustifyBetween)}>
          <div className={gClasses.CenterV}>
            {!addNewStep && (
              <div className={cx(gClasses.CenterV)}>
                <Thumbnail
                  showIcon
                  size={EThumbnailSize.xxs}
                  icon={option.ICON}
                  backgroundColor={option.COLOR}
                />
              </div>
            )}
            <div
              className={cx(
                styles.OptionLabel,
                !addNewStep && gClasses.ML10,
                addNewStep && styles.AddNewStep,
                addNewStep && styles.AddNewStepLabel,
                gClasses.CenterV,
                isDisabled && styles.AddNewStepLabel,
              )}
            >
              {t(option.TITLE)}
            </div>
          </div>
          {option.RIGHT_ARROW ? <div>{option.RIGHT_ARROW}</div> : null}
        </div>
      </div>
    );
  });

  // const preventClosingOfDropdown = (e) => {
  //   const submenu = document.getElementById('flow_dropdown_sub_menu');
  //   if (submenu?.contains(e.target)) e.stopPropagation();
  //   else removeNode?.();
  // };

  return (
    <div
      role="presentation"
      id={id}
      tabIndex={-1}
      // onClick={preventClosingOfDropdown}
      ref={containerRef}
    >
      {/* <div ref={subMenuRef}>dfdfdfdf</div> */}
      <Popper
        id="flow_dd_main_menu"
        key="flow_dd_main_menu"
        targetRef={referenceElement}
        open
        className={cx(gClasses.ZIndex10, styles.MenuWrapper)}
        placement={EPopperPlacements.BOTTOM}
        // style={}
        content={(
          <div className={cx(styles.Container)}>
            {dropdownList}
          </div>
        )}
      />
      {
        subMenuOption && (
          <Popper
            id="flow_dd_sub_menu_popper"
            key="flow_dd_sub_menu"
            targetRef={getActiveSubMenuRef(subMenuOption)}
            open
            className={cx(gClasses.ZIndex13)}
            placement={EPopperPlacements.RIGHT_START}
            content={getSubMenuComponent()}
          />
        )
      }
    </div>
  );
}

export default FlowNodeDropDown;
