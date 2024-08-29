import { BorderRadiusVariant, Chip, Title, ETitleHeadingLevel, ETitleSize, EChipSize, Button, SingleDropdown, EButtonSizeType, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../scss/Typography.module.scss';
import { get } from '../../../../../utils/jsUtility';
import { COLOR, GET_TASK_LIST_CONSTANTS, TASK_LIST_TYPE } from '../TaskList.constants';
import { getDateFieldPlacaholder, getFilterDataBasedOnTaskListType } from '../TaskListing.utils';
import styles from '../tasks/Tasks.module.scss';

function TaskFilter(props) {
  const {
    colorScheme,
    onChange,
    onClearByFilterId,
    onSave,
    onCancel,
    onClear,
    taskListType,
    filter,
    targetRef,
    setPopperVisibility,
 } = props;

 const { t } = useTranslation();
 const {
    FILTER: { TASK_TYPE, ASSIGNED_ON, DUE_ON },
    LABEL,
  } = GET_TASK_LIST_CONSTANTS(t);

  const selectedFilter = getFilterDataBasedOnTaskListType(filter, taskListType);

  function handleClickOutside(event) {
    if (targetRef.current && !targetRef.current.contains(event.target)) {
      setPopperVisibility(false);
      onCancel();
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [targetRef]);

  return (
      <div className={styles.FilterContainer}>
        <Title
          content={LABEL.FILTER}
          headingLevel={ETitleHeadingLevel.h5}
          size={ETitleSize.xs}
          className={styles.FilterTitle}
        />
        {(selectedFilter?.length > 0) && (
          <div className={styles.SelectedFilter}>
            {selectedFilter.map((filter) => (
              <Chip
                key={filter?.label}
                size={EChipSize.sm}
                textColor={COLOR.BLACK_10}
                backgroundColor={COLOR.GRAY_10}
                text={filter?.label}
                borderRadiusType={BorderRadiusVariant.circle}
                className={gClasses.WhiteSpaceNoWrap}
                onDelete={() => { onClearByFilterId(filter?.id); }}
              />
            ))}
          </div>)}
        <div className={styles.Filter}>
          {[
            TASK_LIST_TYPE.OPEN,
            TASK_LIST_TYPE.ASSIGNED_TO_OTHERS,
           ].includes(
            taskListType,
          ) && (
            <SingleDropdown
              id={TASK_TYPE.ID}
              optionList={TASK_TYPE.USER_OPTIONS}
              dropdownViewProps={{
                className: styles.Dropdown,
              }}
              placeholder={TASK_TYPE.PLACEHOLDER}
              selectedValue={get(filter, [TASK_TYPE.ID], null)}
              className={cx(gClasses.ZIndex8, gClasses.WhiteSpaceNoWrap, styles.minw178px)}
              onClick={onChange}
            />
          )}
          <SingleDropdown
            id={ASSIGNED_ON.ID}
            optionList={ASSIGNED_ON.OPTIONS}
            dropdownViewProps={{
              className: styles.Dropdown,
            }}
            placeholder={getDateFieldPlacaholder(taskListType, t) || ASSIGNED_ON.PLACEHOLDER}
            selectedValue={get(filter, [ASSIGNED_ON.ID], null)}
            className={cx(gClasses.ZIndex8, gClasses.WhiteSpaceNoWrap, styles.minw185px)}
            onClick={onChange}
          />
          {[
            TASK_LIST_TYPE.OPEN,
            TASK_LIST_TYPE.ASSIGNED_TO_OTHERS,
            TASK_LIST_TYPE.SNOOZE_TASKS,
          ].includes(taskListType) && (
            <SingleDropdown
              id={DUE_ON.ID}
              optionList={DUE_ON.OPTIONS}
              dropdownViewProps={{
                className: cx(styles.Dropdown, styles.SloveneDropdown),
              }}
              placeholder={DUE_ON.PLACEHOLDER}
              selectedValue={get(filter, [DUE_ON.ID], null)}
              className={cx(gClasses.ZIndex8, gClasses.WhiteSpaceNoWrap)}
              onClick={onChange}
            />
          )}
        </div>
        <div className={styles.FilterActions}>
          <Button
            size={EButtonSizeType.SM}
            type={EButtonType.OUTLINE_SECONDARY}
            buttonText={LABEL.CLEAR_ALL}
            onClickHandler={onClear}
            colorSchema={colorScheme}
          />
          <Button
            size={EButtonSizeType.SM}
            buttonText={LABEL.APPLY}
            onClickHandler={onSave}
            colorSchema={colorScheme}
          />
        </div>
      </div>);
}

export default React.forwardRef((props, ref) => <TaskFilter targetRef={ref} {...props} />);
