import React from 'react';
import cx from 'classnames/bind';
import {
  Checkbox,
  SingleDropdown,
  Size,
  Text,
  ECheckboxSize,
  RadioGroupLayout,
  ETextSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import { get, has } from 'utils/jsUtility';
import styles from './RequestBody.module.scss';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { ROW_COMPONENT_STRINGS } from '../RowComponents.strings';
import FieldPicker from '../field_picker/FieldPicker';
import {
  REQ_BODY_KEY_TYPES,
  ROW_COMPONENT_KEY_TYPES,
} from '../RowComponents.constants';
import { FIELD_TYPE } from '../../../../../../utils/constants/form.constant';

function RequestBody(props) {
  const {
    currentRow = {},
    hideSecondColumn,
    additionalRowComponentProps = {},
    path,
    onChangeHandlers,
    parentDetails,
    errorList,
  } = props;

  const { t } = useTranslation();
  const { REQUEST_BODY, KEY_TYPE, ERROR_MESSAGES } = ROW_COMPONENT_STRINGS();

  console.log(
    'DefaultRowComponent RequestBody',
    errorList,
    currentRow,
    hideSecondColumn,
    additionalRowComponentProps,
  );

  const {
    keyObject: { key, isMultiple, isRequired, keyType, columnMappingListKey },
    isMLIntegration,
  } = additionalRowComponentProps;

  const isRequiredIcon = currentRow?.[isRequired] ? (
    <span className={styles.Required}>&nbsp;*</span>
  ) : null;

  let errorComponent = null;

  if (
    has(errorList, [`${path},${columnMappingListKey}`])
  ) {
    errorComponent = (
      <Text size={ETextSize.XS} content={ERROR_MESSAGES.ROW_REQUIRED} className={cx(gClasses.red22, gClasses.MT8)} />
    );
  }

  return (
    <>
      <div className={cx(gClasses.DisplayFlex, gClasses.W100)}>
        <div
          className={cx(
            styles.InputColumn,
            gClasses.DisplayFlex,
            gClasses.JusFlexStart,
          )}
        >
          <Text content={currentRow?.[key]} />
          {isRequiredIcon}
        </div>
        <div className={cx(styles.TypeColumn)}>
          <SingleDropdown
            optionList={KEY_TYPE.OPTIONS(t)}
            dropdownViewProps={{
              size: Size.md,
              disabled: true,
            }}
            onClick={null}
            selectedValue={currentRow?.[keyType]}
            errorMessage={EMPTY_STRING}
          />
        </div>
        {!isMLIntegration && (
          <div className={cx(styles.MultipleColumn)}>
            <Checkbox
              size={ECheckboxSize.LG}
              layout={RadioGroupLayout.stack}
              isValueSelected={currentRow?.[isMultiple]}
              details={get(REQUEST_BODY.IS_MULTIPLE.OPTIONS, 0, {})}
              onClick={null}
              errorMessage={EMPTY_STRING}
              disabled
            />
          </div>
        )}
        <div className={isMLIntegration ? styles.MLOutputColumn : styles.OutputColumn}>
          {((currentRow?.[keyType] === ROW_COMPONENT_KEY_TYPES.OBJECT &&
            currentRow?.[isMultiple]) ||
            currentRow?.[keyType] !== ROW_COMPONENT_KEY_TYPES.OBJECT) && (
            <FieldPicker
              currentRow={currentRow}
              path={path}
              onChangeHandlers={onChangeHandlers}
              parentDetails={parentDetails}
              additionalRowComponentProps={{
                ...additionalRowComponentProps,
                isHideStaticValue:
                  currentRow?.[keyType] === REQ_BODY_KEY_TYPES.STREAM,
                childFieldDetails: {
                  fieldType: currentRow?.field_type,
                },
                ignoreFieldTypes: currentRow?.[keyType] !== ROW_COMPONENT_KEY_TYPES.OBJECT ? [FIELD_TYPE.TABLE] : [],
              }}
              errorList={errorList}
            />
          )}
        </div>
      </div>
      {errorComponent}
    </>
  );
}

export default RequestBody;
