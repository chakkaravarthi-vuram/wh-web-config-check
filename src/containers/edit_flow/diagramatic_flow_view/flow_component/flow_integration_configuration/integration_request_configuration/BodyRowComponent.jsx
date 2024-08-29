import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { getIntegrationMappingFields } from 'redux/actions/FlowStepConfiguration.Action';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import React, { useState } from 'react';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import CheckboxGroup from 'components/form_components/checkbox_group/CheckboxGroup';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import { getGroupedFieldListForMapping, FEILD_LIST_DROPDOWN_TYPE } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { isEmpty } from 'utils/jsUtility';
import { INTEGRATION_CONSTANTS } from '../FlowIntegrationConfiguration.constants';
import { REQUEST_CONFIGURATION_STRINGS } from './IntegrationRequestConfiguration.utils';
import styles from './IntegrationRequestConfiguration.module.scss';
import { REQ_BODY_KEY_TYPES } from '../../../../../integration/Integration.utils';

let cancelToken = null;
const getCancelToken = (token) => {
  cancelToken = token;
};

function BodyRowComponent(props) {
  const { t } = useTranslation();
  const { currentRow = {}, onChangeHandlers, path, error_list = {}, bodyFieldUuids = [], flowData,
    onGetAllFieldsByFilter, updateFlowData, parentTableUuid, isMulitpleChild = false, loadingMappingFields, isMLIntegration } = props;
  const { bodyLstAllFields = [], allbodyLstAllFields = [] } = flowData;
  const { REQUEST_CONFIGURATION } = INTEGRATION_CONSTANTS;
  const { ADD_EVENT } = REQUEST_CONFIGURATION_STRINGS;
  const { QUERY } = REQUEST_CONFIGURATION;
  const [inputValue, setInputValue] = useState();
  const [isForceDropDownClose, setonForceDropdownClose] = useState(false);
  const [staticValueError, setStaticValueError] = useState(EMPTY_STRING);
  if (currentRow?.is_deleted) return null;
  const getAllFieldsByFilterApi = (searchText = EMPTY_STRING, isSearch = false, table_uuid = EMPTY_STRING, keyType = null) => {
    const fieldListDropdownType = (
      ((keyType === 'object') && currentRow?.is_multiple)
        ? FEILD_LIST_DROPDOWN_TYPE.TABLES
        : (
          isMulitpleChild
            ? (parentTableUuid ? FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS : FEILD_LIST_DROPDOWN_TYPE.ALL_TABLE_FIELDS)
            : FEILD_LIST_DROPDOWN_TYPE.DIRECT
        )
    );
    setonForceDropdownClose(false);
    if (isEmpty(allbodyLstAllFields)) {
      const paginationData = {
        // search: '',
        page: 1,
        size: 1000,
        // sort_field: '',
        sort_by: 1,
        flow_id: flowData.flow_id,
        include_property_picker: 1,
        allowed_field_types: ADD_EVENT.REQUEST_ALLOWED_FIELD_TYPES,
      };
      if (isSearch && searchText) {
        paginationData.search = searchText;
      }
      if (onGetAllFieldsByFilter) {
        if (cancelToken) cancelToken();
        onGetAllFieldsByFilter(paginationData, 'bodyLstAllFields', bodyFieldUuids, fieldListDropdownType, table_uuid, getCancelToken);
      }
    } else {
      updateFlowData({
        bodyLstAllFields:
          getGroupedFieldListForMapping(table_uuid, allbodyLstAllFields, [], fieldListDropdownType, t),
      });
    }
    console.log('jkhjkhjkhkjhjkhhnkjhjk', keyType, fieldListDropdownType, currentRow?.is_multiple, (keyType === 'obejct') && currentRow?.is_multiple);
  };
  const isRequired = currentRow?.is_required ? <span className={styles.Required}>&nbsp;*</span> : null;
  return (
    <>
    <div className={cx(BS.D_FLEX)}>
      <div className={styles.ColMax}>
        <div className={cx(styles.KeyName, gClasses.ReadOnlyBg, gClasses.FTwo13GrayV3, gClasses.MR24)}>
          {isMLIntegration ? currentRow?.key : currentRow?.key_name}
          {isRequired}
        </div>
      </div>
      <div className={styles.ColMed}>
        <Dropdown
          id={ADD_EVENT.REQUEST_BODY.KEY_TYPE.ID}
          label={ADD_EVENT.REQUEST_BODY.KEY_TYPE.LABEL}
          optionList={ADD_EVENT.REQUEST_BODY.KEY_TYPE.OPTIONS}
          disabled
          selectedValue={isMLIntegration ? currentRow?.component_type : currentRow?.key_type}
          setSelectedValue
          hideLabel
          className={cx(styles.RequestBodyFields, gClasses.MR24)}
          strictlySetSelectedValue
          errorMessage={error_list[`${path},${ADD_EVENT.REQUEST_BODY.KEY_TYPE.ID}`]}
          optionListDropDown={styles.OptionListDropDown}
        />
      </div>
      {!isMLIntegration && (
        <div className={cx(styles.CheckboxCol, gClasses.CenterV)}>
        <CheckboxGroup
          id={ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.ID}
          optionList={ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.OPTIONS}
          selectedValues={currentRow?.is_multiple ? [1] : []}
          disabled
          hideLabel
          errorMessage={error_list[`${path},${ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.ID}`]}
          className={cx(styles.RequestBodyFields, gClasses.MB12)}
        />
        </div>
      )}
      {
        ((currentRow?.key_type !== 'object') || (currentRow?.is_multiple)) && (
          <div className={cx(styles.ColMax, gClasses.MR10)}>
            <Dropdown
              optionList={bodyLstAllFields}
              loadingOptionList={loadingMappingFields}
              placeholder={t(REQUEST_CONFIGURATION.QUERY.VALUE.PLACEHOLDER)}
              selectedLabelClass={((currentRow?.type === 'expression') && styles.FieldTag)}
              id={ADD_EVENT.REQUEST_BODY.VALUE.ID}
              showNoDataFoundOption
              setInitialSearchText
              showSelectedValTooltip
              initialSearchText={currentRow?.type === 'direct' ? currentRow?.value : EMPTY_STRING}
              selectedValue={currentRow?.type === 'expression' ?
                currentRow?.field_details?.label || currentRow?.field_details?.table_name :
                currentRow?.value}
              onChange={(e) =>
                onChangeHandlers({
                  event: e,
                  type: ADD_EVENT.REQUEST_BODY.VALUE.ID,
                  path,
                  value_type: QUERY.VALUE.TYPES.EXPRESSION,
                  component_uuid: isMLIntegration && currentRow?.key_uuid,
                })
              }
              strictlySetSelectedValue
              setSelectedValue
              customInputPaddingClass={styles.DropdownInput}
              errorMessage={isMLIntegration ? error_list[`request_body,${path},${ADD_EVENT.REQUEST_BODY.VALUE.ID}`] : error_list[`${path},${ADD_EVENT.REQUEST_BODY.VALUE.ID}`]}
              hideDropdownListLabel
              isRequired
              disableFocusFilter
              loadData={() => getAllFieldsByFilterApi(EMPTY_STRING, false, parentTableUuid, currentRow?.key_type)}
              hideLabel
              noDataFoundOptionLabel="No fields found"
              enableSearch
              onSearchInputChange={(search) => {
                setInputValue(search);
                setStaticValueError(EMPTY_STRING);
              }}
              isPaginated
              hasMore={false}
              // loadDataHandler={onLoadMoreExternalFields}
              onSetClicked={![REQ_BODY_KEY_TYPES.OBJECT, REQ_BODY_KEY_TYPES.STREAM].includes(currentRow?.key_type) ? (inputSetClicked) => {
                console.log('inputSetClicked', inputSetClicked);
                if (isEmpty(inputValue)) {
                  setStaticValueError('Static Value should have at least 1 character');
                } else {
                  setStaticValueError(EMPTY_STRING);
                  onChangeHandlers({
                    event: {
                      target: {
                        value: inputValue,
                      },
                    },
                    type: ADD_EVENT.REQUEST_BODY.VALUE.ID,
                    path,
                    value_type: QUERY.VALUE.TYPES.DIRECT,
                    component_uuid: isMLIntegration && currentRow?.key_uuid,
                  });
                  setonForceDropdownClose(true);
                }
              } : null}
              loadDataHandler={() => {}}
              isForceDropDownClose={isForceDropDownClose}
              setValueError={staticValueError}
              setValuePlaceholder={t(INTEGRATION_CONSTANTS.ENTER_STATIC_VALUE)}
            />
          </div>
        )
      }
    </div>
    {
      !isEmpty(error_list[`${path},child_rows`]) && (
        <div className={cx(gClasses.FTwo12RedV18, gClasses.LineHeightNormal, gClasses.MB15)}>{t(ADD_EVENT.ERROR_MESSAGES.CHILD_REQUIRED)}</div>
      )
    }
    </>
  );
}

const mapStateToProps = ({ EditFlowReducer }) => {
  return {
    flowData: EditFlowReducer.flowData,
    loadingMappingFields: EditFlowReducer.loadingMappingFields,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFlowData: (...params) => {
      dispatch(updateFlowDataChange(...params));
    },
    onGetAllFieldsByFilter: (
      paginationData,
      // currentFieldUuid,
      // fieldType,
      // noLstAllFieldsUpdate,
      setStateKey,
      mapping,
      fieldListDropdownType,
      tableUuid,
      getCancelToken,
    ) => {
      dispatch(
        getIntegrationMappingFields(
          paginationData,
          // currentFieldUuid,
          // fieldType,
          // noLstAllFieldsUpdate,
          setStateKey,
          mapping,
          fieldListDropdownType,
          tableUuid,
          getCancelToken,
        ),
      );
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BodyRowComponent));
