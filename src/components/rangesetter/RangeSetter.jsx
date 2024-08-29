import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { BS } from '../../utils/UIConstants';
import { keydownOrKeypessEnterHandle } from '../../utils/UtilityFunctions';
import PlusIconBlueNew from '../../assets/icons/PlusIconBlueNew';
import DeleteIconV2 from '../../assets/icons/form_fields/DeleteIconV2';
import { EMPTY_STRING, SPACE } from '../../utils/strings/CommonStrings';
import { RANGE_SETTER_STRING } from './RangeSetter.string';
import styles from './RangeSetter.module.scss';

function RangeSetter(props) {
  const {
    onChangeHandler,
    range,
    onDeleteHandler,
    onRangeAddHandler,
    onRangeLabelChangeHandler,
    error,
  } = props;
  const { t } = useTranslation();
  const rangeList = range.map((value, index) => (
    <div key={`${value.index + index}`} className={cx(gClasses.MB10)}>
      <div className={cx(gClasses.MB5, BS.W100)}>
        <TextInput
          borderRadiusType="rounded"
          size="md"
          variant="border"
          value={value?.label}
          onChange={(event) => {
            onRangeLabelChangeHandler(index, event?.target?.value);
          }}
          placeholder={RANGE_SETTER_STRING(t).RANGE_LABEL}
          errorMessage={
            error[`${index},${RANGE_SETTER_STRING(t).LABEL}`] || EMPTY_STRING
          }
        />
      </div>
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
        <TextInput
          borderRadiusType="rounded"
          size="md"
          variant="border"
          type="number"
          value={value?.boundary[0]}
          onChange={(event) => {
            onChangeHandler(index, 0, event?.target?.value);
          }}
          placeholder={RANGE_SETTER_STRING(t).RANGE}
          errorMessage={
            error[`${index},${RANGE_SETTER_STRING(t).LEFT_RANGE_ID}`] ||
            EMPTY_STRING
          }
          inputInnerClassName={styles.NumberInput}
        />
        <div
          className={cx(
            gClasses.FTwo12GrayV2,
            gClasses.FontWeight500,
            gClasses.ML8,
            gClasses.MR8,
            gClasses.MT7,
          )}
        >
          {SPACE}
          {RANGE_SETTER_STRING(t).TO}
          {SPACE}
        </div>
        <TextInput
          borderRadiusType="rounded"
          value={value?.boundary[1]}
          size="md"
          variant="border"
          type="number"
          onChange={(event) => {
            onChangeHandler(index, 1, event?.target?.value);
          }}
          placeholder={RANGE_SETTER_STRING(t).RANGE}
          errorMessage={
            error[`${index},${RANGE_SETTER_STRING(t).RIGHT_RANGE_ID}`]
          }
          inputInnerClassName={styles.NumberInput}
        />
        <div
          onClick={() => {
            onDeleteHandler(index + 1);
          }}
          className={cx(gClasses.CursorPointer, gClasses.ML4, gClasses.MT3)}
          tabIndex={-1}
          role="button"
          onkeydown={(e) => keydownOrKeypessEnterHandle(e) && onDeleteHandler}
        >
          <DeleteIconV2 />
        </div>
      </div>
    </div>
  ));

  return (
    <div>
      <div>{range.length > 0 && rangeList}</div>
      <div
        onClick={() => {
          onRangeAddHandler();
        }}
        className={cx(
          BS.D_FLEX,
          BS.ALIGN_ITEM_CENTER,
          gClasses.FTwo13BlueV39,
          gClasses.CursorPointer,
          gClasses.MB8,
        )}
        tabIndex={-1}
        role="button"
        onkeydown={(e) => keydownOrKeypessEnterHandle(e) && onRangeAddHandler()}
      >
        <PlusIconBlueNew className={gClasses.MR3} />
        {rangeList.length > 0
          ? RANGE_SETTER_STRING(t).ADD_MORE
          : RANGE_SETTER_STRING(t).ADD_ONE}
      </div>
    </div>
  );
}
export default RangeSetter;
