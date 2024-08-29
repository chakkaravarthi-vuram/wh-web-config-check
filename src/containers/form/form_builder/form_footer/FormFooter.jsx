import React from 'react';
import { Chip, EPopperPlacements, ETextSize, SingleDropdown, Text, Variant } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import FormFooterConfig from './form_footer_config/FormFooterConfig';
import useFormFooter from './useFormFooter';
import { get, isEmpty } from '../../../../utils/jsUtility';
import { FOOTER_PARAMS_ID } from './FormFooter.constant';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import PlusIconNew from '../../../../assets/icons/PlusIconV2';
import styles from './FormFooter.module.scss';
import { FORM_CONFIG_STRINGS } from '../../Form.string';
import { CREATE_FORM_STRINGS } from './FormFooter.string';
import { getButtonStyle, getEllipsesForText, getNegativeActionList, getPositiveActionList } from './FormFooter.utils';
import { STEP_TYPE } from '../../../../utils/Constants';
import Tooltip from '../../../../components/tooltip/Tooltip';

function FormFooter(props = {}) {
    const {
      metaData,
      actions = [],
      stepList = [],
      stepDetails,
      onCreateStep = null,
      onFormActionUpdate,
      errorList,
      moduleType,
      flowData,
      addNewNode,
    } = props;
    const { ACTION_UUID, ACTION_LABEL, ACTION_TYPE } = FOOTER_PARAMS_ID;

    const { t } = useTranslation();
    const { state, dispatch, onAddNew, onEdit } = useFormFooter(actions, onFormActionUpdate);

    const getAddButton = () => (
      ((moduleType === STEP_TYPE.INTEGRATION && isEmpty(state.actions)) || (moduleType !== STEP_TYPE.INTEGRATION)) &&
      <button className={cx(gClasses.CenterV, styles.AddButtonContainer, errorList.add_actions && styles.Error)} id="add_new" onClick={onAddNew}>
        <PlusIconNew className={cx(styles.PlusIcon)} />
        <Text
          size={ETextSize.SM}
          content={CREATE_FORM_STRINGS(t).FORM_BUTTON_CONFIG.ADD_BUTTON}
          className={styles.ButtonText}
        />
      </button>
    );

    const getMoreButton = (remainingActionList) => {
     const remainingCount = remainingActionList.length;
     const optionList = remainingActionList.map((action) => {
            return {
                  label: action[FOOTER_PARAMS_ID.ACTION_LABEL],
                  value: action[FOOTER_PARAMS_ID.ACTION_UUID],
                };
            });
      return (
        <SingleDropdown
          dropdownViewProps={{
            icon: (
              <button className={cx(gClasses.CenterVH, styles.MoreButton)}>
                {`+ ${remainingCount} ${CREATE_FORM_STRINGS(t).FORM_BUTTON_CONFIG.MORE}`}
              </button>),
            iconOnly: true,
            variant: Variant.borderLess,
            className: gClasses.CenterVH,
          }}
          className={gClasses.WidthFitContent}
          onClick={(value) => onEdit(value)}
          optionList={optionList}
          getClassName={(isOpen) => isOpen ? gClasses.TextNoWrap : EMPTY_STRING}
          getPopperContainerClassName={(isOpen) => isOpen ? cx(gClasses.ZIndex3, gClasses.WidthFitContent) : EMPTY_STRING}
          popperPlacement={EPopperPlacements.TOP_START}
        />
      );
    };

    const getRightPanel = () => {
      const actionList = getPositiveActionList(state.actions);
      const showCount = 2;
      const showMore = (actionList.length > showCount);
      const visibleActions = showMore ? actionList.slice(-1 * showCount) : actionList;

      return (
        <div className={styles.Panel}>
          {getAddButton()}
          {showMore && getMoreButton(actionList.slice(0, actionList.length - showCount))}
          {visibleActions.map((action, idx) => (
            <div
              className={styles.ButtonContainer}
              onClick={() => onEdit(get(action, [ACTION_UUID], EMPTY_STRING))}
              onKeyDown={() => onEdit(get(action, [ACTION_UUID], EMPTY_STRING))}
              tabIndex="0"
              role="button"
            >
              <button
                key={get(action, [ACTION_TYPE], EMPTY_STRING) + idx}
                id={get(action, [ACTION_TYPE], EMPTY_STRING) + idx}
                onClick={() => onEdit(get(action, [ACTION_UUID], EMPTY_STRING))}
                className={cx(gClasses.CenterVH, styles.Button, getButtonStyle(action[ACTION_TYPE]))}
              >
                {getEllipsesForText(get(action, [ACTION_LABEL], EMPTY_STRING))}
              </button>
              <Tooltip
                id={get(action, [ACTION_TYPE], EMPTY_STRING) + idx}
                isCustomToolTip
                content={get(action, [ACTION_LABEL], EMPTY_STRING)}
              />
            </div>
           ))}
        </div>
      );
    };

    const getLeftPanel = () => {
      const actionList = getNegativeActionList(state.actions);
      const showCount = 3;
      const showMore = (actionList.length > showCount);
      const visibleActions = showMore ? actionList.slice(0, 2) : actionList;
      return (
        <div className={styles.Panel}>
           {visibleActions.map((action, idx) => (
            <>
              <button
                key={get(action, [ACTION_TYPE], EMPTY_STRING) + idx}
                id={get(action, [ACTION_TYPE], EMPTY_STRING) + idx}
                onClick={() => onEdit(get(action, [ACTION_UUID], EMPTY_STRING))}
                className={cx(gClasses.CenterVH, styles.Button, styles.Negative)}
              >
                {getEllipsesForText(get(action, [ACTION_LABEL], EMPTY_STRING))}
              </button>
              <Tooltip
                id={get(action, [ACTION_TYPE], EMPTY_STRING) + idx}
                isCustomToolTip
                content={get(action, [ACTION_LABEL], EMPTY_STRING)}
              />
            </>
            ))}
          {showMore && getMoreButton(actionList.slice(2))}
        </div>
      );
    };

    return (
        <div>
            {(!isEmpty(state?.activeAction)) && (
              <FormFooterConfig
                metaData={metaData}
                stepList={stepList}
                stepDetails={stepDetails}
                action={state?.activeAction}
                actions={state?.actions}
                validationMessage={state?.validationMessage}
                dispatch={dispatch}
                onCreateStep={onCreateStep}
                onFormActionUpdate={onFormActionUpdate}
                flowData={flowData}
                addNewNode={addNewNode}
              />
            )}
            <div className={styles.FooterButtonsContainer}>
          {
            (moduleType !== STEP_TYPE.INTEGRATION) && (
              <Chip
                text={FORM_CONFIG_STRINGS(t).CHIP.FORM_FOOTER}
                textColor="#217CF5"
                backgroundColor="#EBF4FF"
                className={cx(styles.FormFooterChip, gClasses.CenterVH)}
              />
            )}
            {
            (moduleType !== STEP_TYPE.ML_MODELS) && (
              <Chip
                text={FORM_CONFIG_STRINGS(t).CHIP.FORM_FOOTER}
                textColor="#217CF5"
                backgroundColor="#EBF4FF"
                className={cx(styles.FormFooterChip, gClasses.CenterVH)}
              />
            )}
              <div className={styles.PanelContainer}>
                {getLeftPanel()}
                {getRightPanel()}
              </div>
            </div>
        </div>
    );
}

export default FormFooter;
