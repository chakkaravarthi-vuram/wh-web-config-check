import {
  RadioGroup,
  RadioGroupLayout,
  SingleDropdown,
  TextInput,
} from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import PlusIconBlueNew from 'assets/icons/PlusIconBlueNew';
import EditDatalistShortcut from '../../../../../data_lists/data_list_landing/datalist_details/datalist_user_system_action/datalist_shortcuts/EditDatalistShortcut';
import jsUtility from '../../../../../../utils/jsUtility';
import { MODULE_TYPES } from '../../../../../../utils/Constants';
import styles from '../FieldBasicConfiguration.module.scss';
import ActionButton from '../../../form_field/components/action_button/ActionButton';
import {
  ACTION_BUTTON_STYLE_TYPE,
  BUTTON_LINK_TYPE,
  FIELD_CONFIGURATIONS_CONSTANTS,
} from '../../FieldConfiguration.constants';
import {
  DL_ACTIONS,
  useDatalistReducer,
} from '../../../../../data_lists/data_lists_create_or_edit/useDatalistReducer';
import {
  apiGetAllSystemFieldsList,
  getTriggerDetails,
} from '../../../../../../axios/apiService/flow.apiService';
import useFlow, { FLOW_ACTIONS } from '../../../../../flows/useFlow';
import {
  constructGetDataForDataList,
  getResponseTriggerDetails,
} from '../../../../../data_lists/data_lists_create_or_edit/DatalistsCreateEdit.utils';
import { formatParentTrigger } from '../../../../../flows/flow_create_or_edit/FlowCreateEdit.utils';

function ButtonLinkBasicConfiguration(props) {
  const { fieldDetails, setFieldDetails, metaData, errorList } = props;
  const { t } = useTranslation();
  const [isShortcutModelOpen, setIsShortcutModelOpen] = useState(false);
  const {
    state: {
      dataListName,
      trigger_details: triggerDetails,
      hasRelatedFlows: hasRelatedDatalist,
    },
    dispatch: dataListDispatch,
  } = useDatalistReducer();
  const {
    state: { name: flowName, relatedActions, hasRelatedFlows },
    dispatch: flowDispatch,
  } = useFlow();
  const [triggerList, setTriggerList] = useState([]);
  const isDatalist = !jsUtility.isEmpty(metaData?.dataListId);

  const [parentData, setParentData] = useState(
    isDatalist
      ? {
          data_list_name: dataListName,
          data_list_uuid: metaData?.dataListUUID,
          trigger_details: formatParentTrigger(triggerDetails || []),
          has_related_flows: hasRelatedDatalist,
        }
      : !jsUtility.isEmpty(metaData.flowId)
      ? {
          flow_name: flowName,
          flow_uuid: metaData?.flowUUID,
          trigger_details: formatParentTrigger(relatedActions?.triggers || []),
          has_related_flows: hasRelatedFlows,
        }
      : {},
  );
  const [systemField, setSystemField] = useState([]);
  useEffect(() => {
    apiGetAllSystemFieldsList()
      .then((res) => {
        setSystemField(res);
      })
      .catch(() => setSystemField([]));
  }, []);
  const {
    GENERAL: { BUTTON_LINK },
  } = FIELD_CONFIGURATIONS_CONSTANTS(t);

  const BUTTON_STYLE_OPTIONS_LIST = [
    {
      label: '',
      value: ACTION_BUTTON_STYLE_TYPE.LINK,
      children: (
        <ActionButton
          fieldDetails={{
            buttonName: BUTTON_LINK.ACTION_BUTTON_STYLE.OPTIONS.LINK,
            buttonStyle: ACTION_BUTTON_STYLE_TYPE.LINK,
          }}
          isViewOnly
        />
      ),
      childrenContainerClass: gClasses.W100,
    },
    {
      label: '',
      value: ACTION_BUTTON_STYLE_TYPE.BUTTON,
      children: (
        <ActionButton
          fieldDetails={{
            buttonName: BUTTON_LINK.ACTION_BUTTON_STYLE.OPTIONS.BUTTON,
            buttonStyle: ACTION_BUTTON_STYLE_TYPE.BUTTON,
          }}
          isViewOnly
        />
      ),
      childrenContainerClass: gClasses.W100,
    },
    {
      label: '',
      value: ACTION_BUTTON_STYLE_TYPE.OUTLINE,
      children: (
        <ActionButton
          fieldDetails={{
            buttonName: BUTTON_LINK.ACTION_BUTTON_STYLE.OPTIONS.OUTLINE,
            buttonStyle: ACTION_BUTTON_STYLE_TYPE.OUTLINE,
          }}
          isViewOnly
        />
      ),
      childrenContainerClass: gClasses.W100,
    },
  ];

  const getTriggerListDetails = (isNeed = false) => {
    if (!isNeed && triggerList.length !== 0) return;
    const params = {};
    if (isDatalist) {
      params.data_list_id = metaData.dataListId;
    } else if (!jsUtility.isEmpty(metaData.flowId)) {
      params.flow_id = metaData.flowId;
    }
    getTriggerDetails(params)
      .then((res) => {
        const constructedData = res?.trigger_metadata
          ?.filter((trigger) => trigger.trigger_type === 'related_actions')
          .map((trigger) => {
            return {
              triggerUUID: trigger?.trigger_uuid,
              triggerName: trigger?.trigger_name || '',
              childFlowName: trigger?.child_flow_name,
            };
          });
        setTriggerList(constructedData);
      })
      .catch((err) => {
        console.error('error get_trigger_details_by_uuid failed', err);
      });
  };
  useEffect(() => {
    if (fieldDetails.buttonActionType === BUTTON_LINK_TYPE.START_SUB_FLOW) {
      getTriggerListDetails();
    }
  }, [fieldDetails.buttonActionType]);
  const onButtonOptionChangeHandler = (value) => {
    setFieldDetails({
      ...fieldDetails,
      buttonActionType: value,
    });
  };
  const onChangeButtonStyle = (value) => {
    setFieldDetails({
      ...fieldDetails,
      buttonStyle: value,
    });
  };
  const onChangeButtonLabel = (event) => {
    const { value } = event.target;
    setFieldDetails({
      ...fieldDetails,
      buttonName: value,
    });
  };
  const onUserActionChangeHandler = (value) => {
    setFieldDetails({
      ...fieldDetails,
      triggerUUID: value,
    });
  };

  const onTriggerSave = (flowData) => {
    if (isDatalist) {
      const constructedData = constructGetDataForDataList(flowData);
      dataListDispatch(DL_ACTIONS.DATA_CHANGE, constructedData);
    } else {
      flowDispatch(FLOW_ACTIONS.UPDATE_RELATED_ACTIONS, {
        triggers: getResponseTriggerDetails(flowData.trigger_details),
      });
      flowDispatch(FLOW_ACTIONS.DATA_CHANGE, {
        hasRelatedFlows: flowData.trigger_details?.length > 0 || false,
      });
    }
    setParentData((p) => {
      return {
        ...p,
        trigger_details: jsUtility.cloneDeep(
          formatParentTrigger(
            getResponseTriggerDetails(flowData.trigger_details),
          ),
        ),
        has_related_flows: flowData.has_related_flows,
      };
    });

    onUserActionChangeHandler(flowData?.trigger_details?.[0]?.trigger_uuid);
    getTriggerListDetails(true);
    setIsShortcutModelOpen(false);
  };

  const getButtonTypeSubDropdown = (option) => {
    switch (option) {
      case BUTTON_LINK_TYPE.START_SUB_FLOW: {
        return (
          <div className={cx(gClasses.DisplayFlex, gClasses.MT12)}>
            <div className={cx(gClasses.W50)}>
              <SingleDropdown
                dropdownViewProps={{
                  labelName: BUTTON_LINK.START_SUB_FLOW.CHOOSE_ACTION,
                  labelClassName: styles.FieldLabel,
                }}
                required
                optionList={triggerList.map((details) => {
                  const data = {
                    label: details.triggerName,
                    value: details.triggerUUID,
                  };
                  return data;
                })}
                selectedValue={fieldDetails?.triggerUUID}
                onClick={(value) => onUserActionChangeHandler(value)}
                errorMessage={errorList?.triggerUUID}
              />
            </div>
            <div
              className={cx(
                gClasses.PositionRelative,
                gClasses.DisplayFlex,
                gClasses.MB8,
                gClasses.ML12,
                styles.AlignEnd,
              )}
            >
              <button
                className={cx(
                  gClasses.CenterV,
                  gClasses.ClickableElement,
                  gClasses.CursorPointer,
                  gClasses.PositionRelative,
                )}
                onClick={() => setIsShortcutModelOpen(true)}
              >
                <PlusIconBlueNew className={cx(gClasses.MR5)} />
                <div className={gClasses.FlexGrow1}>
                  <div
                    className={cx(gClasses.FTwo13, gClasses.FontWeight500)}
                    style={{ color: '#217CF5' }}
                  >
                    {BUTTON_LINK.START_SUB_FLOW.CREATE_ACTION}
                  </div>
                </div>
              </button>
            </div>
          </div>
        );
      }
      case BUTTON_LINK_TYPE.INTERNAL_EXTERNAL_LINK: {
        const onChangeLinkURL = (event) => {
          const { value } = event.target;
          setFieldDetails({
            ...fieldDetails,
            linkURL: value,
          });
        };
        return (
          <div className={cx(gClasses.W50, gClasses.MT12)}>
            <TextInput
              labelText={BUTTON_LINK.INTERNAL_EXTERNAL_LINK.LABEL}
              labelClassName={styles.FieldLabel}
              placeholder={BUTTON_LINK.INTERNAL_EXTERNAL_LINK.PLACEHOLDER}
              value={fieldDetails?.linkURL}
              onChange={onChangeLinkURL}
              required
              errorMessage={errorList?.linkURL}
            />
          </div>
        );
      }
      default:
        return null;
    }
  };
  return (
    <>
      <div className={gClasses.W50}>
        <SingleDropdown
          required
          dropdownViewProps={{
            labelName: BUTTON_LINK.BUTTON_LINK_TYPE.LABEL,
            labelClassName: styles.FieldLabel,
          }}
          optionList={BUTTON_LINK.BUTTON_LINK_TYPE.OPTIONS}
          selectedValue={fieldDetails?.buttonActionType}
          onClick={onButtonOptionChangeHandler}
          errorMessage={errorList?.buttonActionType}
        />
      </div>
      {getButtonTypeSubDropdown(fieldDetails?.buttonActionType)}
      <div className={gClasses.W50}>
        <TextInput
          labelText={BUTTON_LINK.BUTTON_LINK_LABEL}
          labelClassName={styles.FieldLabel}
          className={gClasses.MT12}
          onChange={onChangeButtonLabel}
          value={fieldDetails?.buttonName}
          placeholder="Enter Button/Link Label"
          errorMessage={errorList?.buttonName}
          required
        />
      </div>
      <RadioGroup
        required
        labelText={BUTTON_LINK.ACTION_BUTTON_STYLE.LABEL}
        labelClassName={styles.FieldLabel}
        options={BUTTON_STYLE_OPTIONS_LIST}
        layout={RadioGroupLayout.stack}
        selectedValue={fieldDetails?.buttonStyle}
        onChange={(_event, _id, value) => onChangeButtonStyle(value)}
        radioContainerStyle={gClasses.gap12}
        optionClassName={styles.StylesOption}
        className={gClasses.MT12}
        errorMessage={errorList?.buttonStyle}
      />
      {isShortcutModelOpen && (
        <EditDatalistShortcut
          triggerUUID=""
          metaData={metaData}
          moduleType={isDatalist ? MODULE_TYPES.DATA_LIST : MODULE_TYPES.FLOW}
          isModalOpen
          onCloseShortcut={() => setIsShortcutModelOpen(false)}
          parentData={parentData}
          onSave={onTriggerSave}
          isParentDatalist={isDatalist}
          systemFields={systemField}
        />
      )}
    </>
  );
}

export default ButtonLinkBasicConfiguration;
