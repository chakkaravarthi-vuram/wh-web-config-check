import React, { useRef, useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import {
  DropdownList,
  Popper,
  SingleDropdown,
  Text,
  EPopperPlacements,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { language } from 'language/config';
import styles from './CallAnotherFlow.module.scss';
import NestedOverlay from '../../../../../components/nested_overlay/NestedOverlay';
import { useClickOutsideDetector } from '../../../../../utils/UtilityFunctions';
import ArrowCoverIcon from '../../../../../assets/icons/ArrowCoverIcon';
import { CALL_ANOTHER_FLOW_STRINGS, FLOW_FIELDS_DROPDOWN, VALUE_TO_BE_PASSED } from './CallAnotherFlow.strings';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';

function RowComponent() {
  const { t, i18n } = useTranslation();
  const [isFlowFieldsOpen, setIsFlowFieldsOpen] = useState(false);
  const [valueColumnOptions, setValueColumnOptions] = useState(
    VALUE_TO_BE_PASSED(t)[0].value,
  );
  const popperRef = useRef(null);
  useClickOutsideDetector(popperRef, () => setIsFlowFieldsOpen(false));

  const selectedOptionValue = VALUE_TO_BE_PASSED(t).find(
    (currentOption) => currentOption?.value === valueColumnOptions,
  );
  const secondaryComponent = (
    <div className={cx((i18n.language === language.spanish_mexico) && styles.FlowFieldsSpanish, styles.InsertDropdown, gClasses.CenterV)}>
      <button
        ref={popperRef}
        onClick={() => setIsFlowFieldsOpen(!isFlowFieldsOpen)}
        className={cx(
          gClasses.FTwo13BlueV39,
          gClasses.W100,
          gClasses.FontWeight500,
        )}
      >
        {selectedOptionValue?.label}
        <ArrowCoverIcon className={gClasses.ML4} />
      </button>
      <Popper
        open={isFlowFieldsOpen}
        targetRef={popperRef}
        placement={EPopperPlacements.BOTTOM}
        content={
          <DropdownList
            selectedValue={valueColumnOptions}
            optionList={VALUE_TO_BE_PASSED(t)}
            onClick={(value) => {
              console.log('setValueColumnOptions', value);
              setValueColumnOptions(...value);
            }}
            className={gClasses.ZIndex151}
          />
        }
      />
    </div>
  );
  return (
    <div className={cx(gClasses.CenterV, gClasses.W100)}>
      <div className={cx(styles.FieldNameColumn, gClasses.MR8)}>
        <Text content="Contact Details" fontClass={styles.FieldNameClass} />
      </div>
      <div className={cx(styles.OperationColumn, gClasses.MR8)}>
        <Text content="SingleLine Text" fontClass={styles.FieldNameClass} />
      </div>
      <NestedOverlay
        primaryComponent={
          <SingleDropdown
            className={styles.ValueDropdown}
            optionList={FLOW_FIELDS_DROPDOWN}
            getPopperContainerClassName={(isOpen) => isOpen ? gClasses.ZIndex2 : EMPTY_STRING}
            placeholder={CALL_ANOTHER_FLOW_STRINGS(t).CHOOSE_FLOW_FIELDS}
          />
        }
        secondaryComponent={secondaryComponent}
        className={styles.ValueColumn}
      />
    </div>
  );
}

export default RowComponent;
