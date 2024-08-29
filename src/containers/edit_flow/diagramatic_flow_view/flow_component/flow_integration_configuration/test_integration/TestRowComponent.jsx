import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { getIntegrationMappingFields } from 'redux/actions/FlowStepConfiguration.Action';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import React from 'react';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import CheckboxGroup from 'components/form_components/checkbox_group/CheckboxGroup';
import Input from 'components/form_components/input/Input';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import { isEmpty } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import styles from '../integration_request_configuration/IntegrationRequestConfiguration.module.scss';
import { REQUEST_CONFIGURATION_STRINGS } from '../integration_request_configuration/IntegrationRequestConfiguration.utils';
import FileUpload from '../../../../../../components/form_components/file_upload/FileUpload';
import { REQ_BODY_KEY_TYPES } from '../../../../../integration/Integration.utils';
import { INTEGRATION_CONSTANTS } from '../../../../../integration/Integration.constants';

function BodyRowComponent(props) {
  const { currentRow = {}, onChangeHandlers, path, error_list = {}, flowData } = props;
  const { lstAllFields = [], testIntegrationHelperData = {} } = flowData;
  const { ADD_EVENT } = REQUEST_CONFIGURATION_STRINGS;
  const { t } = useTranslation();
  if (currentRow?.is_deleted) return null;
  const isRequired = currentRow?.is_required ? <span className={styles.Required}>*</span> : null;

  const fileHandlerFunc = async (type, fileList) => {
    onChangeHandlers({
      fileList,
      event: {
        target: {
          id: ADD_EVENT.REQUEST_BODY.TEST.ID,
        },
      },
      type: type,
      path,
    });
  };

  return (
    <>
      <div className={cx(BS.D_FLEX)} key={currentRow.key}>
        <div className={styles.ColMax}>
          <div className={cx(styles.KeyName, gClasses.ReadOnlyBg, gClasses.FTwo13GrayV3, gClasses.MR24)}>
            {currentRow?.key_name}
            {isRequired}
          </div>
        </div>
        <div className={styles.ColMed}>
          {
            ((currentRow?.key_type !== 'object') || (currentRow?.is_multiple)) && (
              <Dropdown
                optionList={lstAllFields}
                id={ADD_EVENT.REQUEST_BODY.VALUE.ID}
                showNoDataFoundOption
                selectedValue={currentRow?.type === 'expression' ? currentRow?.field_details?.field_name :
                  currentRow?.value}
                strictlySetSelectedValue
                disablePopper
                setSelectedValue
                hideDropdownListLabel
                isRequired
                disableFocusFilter
                hideLabel
                disabled
                className={cx(styles.RequestBodyFields, gClasses.MR36)}
              />
            )}
        </div>
        <div className={styles.CheckboxCol}>
          <CheckboxGroup
            id={ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.ID}
            optionList={ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.OPTIONS}
            selectedValues={currentRow?.is_multiple ? [1] : []}
            disabled
            hideLabel
            className={cx(styles.RequestBodyFields, gClasses.MR36)}
          />
        </div>
        {currentRow?.key_type !== 'object' && (
          <div className={styles.ColMax}>
            {
              (currentRow.key_type === REQ_BODY_KEY_TYPES.STREAM) ? (
                <FileUpload
                  id={`${ADD_EVENT.REQUEST_BODY.TEST.ID}-${currentRow.key_name}`}
                  hideLabel
                  addFile={(fileData, filess) => {
                    fileHandlerFunc(ADD_EVENT.REQUEST_BODY.TEST.ADD_FILE, filess);
                  }}
                  fileName={currentRow?.test_value?.fileData || []}
                  allowed_extensions={testIntegrationHelperData.allowedExtensions}
                  maximum_file_size={testIntegrationHelperData.maxFileSize}
                  errorMessage={error_list[`${path},${ADD_EVENT.REQUEST_BODY.TEST.ID}`]}
                  onDeleteClick={(fileId, index) => {
                    fileHandlerFunc(ADD_EVENT.REQUEST_BODY.TEST.DELETE_FILE, { index });
                  }}
                  onRetryClick={(fileData, index) => {
                    fileHandlerFunc(ADD_EVENT.REQUEST_BODY.TEST.RETRY_UPLOAD, { index });
                  }}
                  isMultiple={currentRow?.key_name !== INTEGRATION_CONSTANTS.ENTIRE_REQUEST}
                  isTempFile
                />
              ) : (
                <Input
                  id={ADD_EVENT.REQUEST_BODY.TEST.ID}
                  className={cx(styles.RequestBodyFields, gClasses.MR36)}
                  value={currentRow?.test_value}
                  errorMessage={error_list[`${path},${ADD_EVENT.REQUEST_BODY.TEST.ID}`]}
                  hideLabel
                  onChangeHandler={(e) =>
                    onChangeHandlers({
                      event: e,
                      type: ADD_EVENT.REQUEST_BODY.TEST.ID,
                      path,
                    })
                  }
                />
              )
            }
          </div>
        )}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFlowData: (...params) => {
      dispatch(updateFlowDataChange(...params));
    },
    onGetAllFieldsByFilter: (
      paginationData,
      setStateKey,
      mapping,
    ) => {
      dispatch(
        getIntegrationMappingFields(
          paginationData,
          setStateKey,
          mapping,
        ),
      );
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BodyRowComponent));
