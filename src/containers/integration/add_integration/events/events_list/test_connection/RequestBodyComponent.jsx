import React from 'react';
import { BS } from 'utils/UIConstants';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import {
  Checkbox,
  ECheckboxSize,
  ETextSize,
  RadioGroup,
  Text,
  TextInput,
} from '@workhall-pvt-lmt/wh-ui-library';
import { get, isEmpty } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import { generateEventTargetObject } from 'utils/generatorUtils';
import DatePicker from 'components/form_components/date_picker/DatePicker';
import { useSelector } from 'react-redux';
import styles from './TestConnection.module.scss';
import {
  INTEGRATION_STRINGS,
  REQ_BODY_KEY_TYPES,
} from '../../../../Integration.utils';
import { TEST_INTEGRATION_STRINGS } from '../../../../Integration.strings';
import FileUpload from '../../../../../../components/form_components/file_upload/FileUpload';
import { INTEGRATION_CONSTANTS } from '../../../../Integration.constants';

function RequestBodyComponent(props) {
  const { currentRow = {}, onChangeHandlers, path, errorList = {} } = props;

  const { t } = useTranslation();

  const { ADD_EVENT } = INTEGRATION_STRINGS;
  const { testIntegrationHelperData = {} } = useSelector((store) => store.IntegrationReducer);

  const isRequired = currentRow?.is_required ? (
    <span className={styles.Required}>&nbsp;*</span>
  ) : null;

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

  const getCurrentTestValueComponent = (type) => {
    if (type === REQ_BODY_KEY_TYPES.OBJECT) return null;

    if (type === REQ_BODY_KEY_TYPES.BOOLEAN) {
      return (
        <RadioGroup
          id={ADD_EVENT.REQUEST_BODY.TEST.ID}
          className={styles.RequestBodyFields}
          selectedValue={currentRow?.test_value}
          onChange={(_event, id, value) =>
            onChangeHandlers({
              type: ADD_EVENT.REQUEST_BODY.TEST.ID,
              event: generateEventTargetObject(id, value),
              path,
            })
          }
          options={TEST_INTEGRATION_STRINGS.REQUEST_BODY.TEST_VALUE.OPTION_LIST}
          errorMessage={errorList[`${path},${ADD_EVENT.REQUEST_BODY.TEST.ID}`]}
        />
      );
    } else if (type === REQ_BODY_KEY_TYPES.DATE_AND_TIME) {
      return (
        <DatePicker
          popperClasses={gClasses.ZIndex5}
          id={ADD_EVENT.REQUEST_BODY.TEST.ID}
          getDate={(date) =>
            onChangeHandlers({
              event: generateEventTargetObject(
                ADD_EVENT.REQUEST_BODY.TEST.ID,
                date,
              ),
              path,
              type: ADD_EVENT.REQUEST_BODY.TEST.ID,
            })
          }
          date={currentRow?.test_value}
          className={styles.RequestBodyFields}
          isScrollIntoView
          errorMessage={errorList[`${path},${ADD_EVENT.REQUEST_BODY.TEST.ID}`]}
          enableTime
          hideLabel
        />
      );
    } else if ((type === REQ_BODY_KEY_TYPES.STREAM)) {
      return (
          <FileUpload
            id={`${ADD_EVENT.REQUEST_BODY.TEST.ID}-${currentRow.key}`}
            hideLabel
            addFile={(fileData, index) => {
              fileHandlerFunc(ADD_EVENT.REQUEST_BODY.TEST.ADD_FILE, index);
            }}
            fileName={currentRow?.test_value?.fileData || []}
            allowed_extensions={testIntegrationHelperData.allowedExtensions}
            maximum_file_size={testIntegrationHelperData.maxFileSize}
            errorMessage={errorList[`${path},${ADD_EVENT.REQUEST_BODY.TEST.ID}`]}
            onDeleteClick={(fileId, index) => {
              fileHandlerFunc(ADD_EVENT.REQUEST_BODY.TEST.DELETE_FILE, { index });
            }}
            onRetryClick={(fileData, index) => {
              fileHandlerFunc(ADD_EVENT.REQUEST_BODY.TEST.RETRY_UPLOAD, { index });
            }}
            isMultiple={currentRow?.key !== INTEGRATION_CONSTANTS.ENTIRE_REQUEST}
            isTempFile
          />
        );
    } else {
      return (
        <TextInput
          id={ADD_EVENT.REQUEST_BODY.TEST.ID}
          className={styles.RequestBodyFields}
          value={currentRow?.test_value}
          onChange={(event) =>
            onChangeHandlers({
              event,
              path,
              type: ADD_EVENT.REQUEST_BODY.TEST.ID,
            })
          }
          errorMessage={errorList[`${path},${ADD_EVENT.REQUEST_BODY.TEST.ID}`]}
        />
      );
    }
  };

  return (
    <>
      <div className={cx(BS.D_FLEX)}>
        <div className={styles.KeyColumn}>
          <div
            className={cx(
              styles.KeyName,
              gClasses.ReadOnlyBg,
              gClasses.FTwo13GrayV3,
              gClasses.MR24,
            )}
          >
            {currentRow?.key}
            {isRequired}
          </div>
        </div>
        <div className={styles.TypeColumn}>
          <TextInput
            className={cx(styles.RequestBodyFields)}
            value={currentRow?.type}
            readOnly
          />
        </div>
        <div className={styles.MultipleColumn}>
          <Checkbox
            id={ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.ID}
            size={ECheckboxSize.LG}
            isValueSelected={currentRow?.is_multiple}
            details={get(ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.OPTIONS, 0, {})}
            className={styles.RequestBodyFields}
            disabled
          />
        </div>
        <div className={styles.ValueColumn}>
          {getCurrentTestValueComponent(currentRow?.type)}
        </div>
      </div>
      {
        !isEmpty(errorList[`${path},child_rows`]) && (
          <Text
            size={ETextSize.SM}
            className={cx(
              gClasses.red22,
              gClasses.MB15,
            )}
            content={t(ADD_EVENT.ERROR_MESSAGES.CHILD_REQUIRED)}
          />
        )
      }
    </>
  );
}

export default RequestBodyComponent;
