import { Button, EButtonSizeType, EButtonType, SingleDropdown, Text, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useContext } from 'react';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import ThemeContext from '../../../../hoc/ThemeContext';
import { DEFAULT_REPORT_FIELD_ACTION, METRICS } from './Metrics.strings';
import EditIconV2 from '../../../../assets/icons/form_fields/EditIconV2';
import styles from './DefaultReportField.module.scss';
import Trash from '../../../../assets/icons/application/Trash';
import { FIELD } from '../../../flow/create_data_list/settings/metrics/Metrics.strings';

function DefaultReportField(props) {
    const {
        onButtonAction,
        field,
        errorMessage,
        labelErrorMessage,
        isAllFieldsLoading,
        optionList,
        infiniteScrollProps,
        searchProps,
        onClick,
        index,
        placeholder,
        onChange,
    } = props;
    const { t } = useTranslation();
    const { colorSchemeDefault } = useContext(ThemeContext);
    const onEditClickHandler = () => onButtonAction(DEFAULT_REPORT_FIELD_ACTION.EDIT, index);

    const onDeleteClickHandler = () => onButtonAction(DEFAULT_REPORT_FIELD_ACTION.DELETE, index);
    let icons = null;
    let component = null;
    if (field.isAdd || field.isEdit) {
        const buttons = (field.isEdit) ? {
            primary: DEFAULT_REPORT_FIELD_ACTION.SAVE,
            secondary: DEFAULT_REPORT_FIELD_ACTION.DISCARD,
        } : {
            primary: DEFAULT_REPORT_FIELD_ACTION.ADD,
            secondary: DEFAULT_REPORT_FIELD_ACTION.CANCEL,
        };
        const colorSchema = colorSchemeDefault;
        component = (
            <>
                <div className={cx(styles.InputComponent, gClasses.MR16)}>
                    <SingleDropdown
                        optionList={optionList}
                        onClick={onClick}
                        dropdownViewProps={{
                            className: styles.W100Imp,
                            selectedLabel: field?.newValue?.label,
                        }}
                        isLoadingOptions={isAllFieldsLoading}
                        className={styles.W100Imp}
                        selectedValue={field?.newValue?.value}
                        errorMessage={errorMessage}
                        infiniteScrollProps={infiniteScrollProps}
                        dropdownListClassName={styles.W100Imp}
                        searchProps={searchProps}
                        placeholder={placeholder}
                    />
                </div>
                <div className={styles.InputComponent}>
                    <TextInput
                        onChange={onChange}
                        placeholder={t(FIELD.ALTERNATE_LABEL.PLACEHOLDER)}
                        inputClassName={cx(styles.InputBackground, gClasses.WidthInherit)}
                        value={field?.newValue?.customLabel}
                        errorMessage={labelErrorMessage}
                    />
                </div>
                <div className={cx(styles.ActionBtnContainer, gClasses.CenterV)}>
                <Button
                    type={EButtonType.OUTLINE_SECONDARY}
                    onClickHandler={() => onButtonAction(buttons.secondary, index)}
                    size={EButtonSizeType.SM}
                    buttonText={buttons.secondary}
                    className={cx(styles.ActionBtn, styles.SecondaryBtn)}
                    noBorder
                    colorSchema={colorSchema}
                />
                <Button
                    type={EButtonType.OUTLINE_SECONDARY}
                    onClickHandler={() => onButtonAction(buttons.primary, index)}
                    size={EButtonSizeType.SM}
                    buttonText={buttons.primary}
                    className={cx(styles.ActionBtn, styles.PrimaryBtn)}
                    noBorder
                    colorSchema={colorSchema}
                />
                </div>
            </>
        );
    } else {
        component = (
            <Text
                className={cx(gClasses.FlexGrow1, gClasses.WordBreakBreakWord)}
                content={`${field.customLabel} (Ref: ${field.reference_name})`}
            />
        );
        icons = (
            <div className={cx(gClasses.DisplayFlex, gClasses.ML15)} role="presentation">
                <button
                    className={cx(gClasses.CenterVH, gClasses.MR15)}
                    onClick={onEditClickHandler}
                    aria-label="Edit Metrics"
                >
                    <EditIconV2
                        className={cx(gClasses.CursorPointer, styles.EditIcon)}
                        title={t(METRICS.EDIT_DASHBOARD_DATA_LABEL)}
                    />
                </button>
                <button
                    className={gClasses.CenterVH}
                    onClick={onDeleteClickHandler}
                    aria-label="Delete Metrics"
                >
                    <Trash
                        className={gClasses.CursorPointer}
                        title={t(METRICS.DELETE_DASHBOARD_DATA_LABEL)}
                    />
                </button>
            </div>
        );
    }

    return (
        <div className={cx(
            styles.Container,
            gClasses.InputBorder,
            gClasses.PY10,
            gClasses.PX15,
            gClasses.CenterV,
            gClasses.W100,
            errorMessage && styles.ErrorBorder,
        )}
        >
            <div className={gClasses.MY_AUTO}>
            <div
                className={cx(
                    styles.StepNumber,
                    gClasses.CenterVH,
                    gClasses.FTwo13White,
                    gClasses.FontWeight500,
                    gClasses.FlexShrink0,
                    gClasses.MR24,
                )}
            >
                {index + 1}
            </div>
            </div>
            <div
                className={cx(
                    gClasses.CenterVSpaceBetween,
                    styles.MetricMainContent,
                )}
            >
                {component}
                {icons}
            </div>
        </div>
    );
}
export default DefaultReportField;
