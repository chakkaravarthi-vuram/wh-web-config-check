import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import { Button, DialogSize, EButtonType, EPopperPlacements, ETitleAlign, ETitleHeadingLevel, ETitleSize, Label, Modal, ModalStyleType, Text, TextInput, Title, ToggleButton } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import CloseIconNew from '../../../../assets/icons/CloseIconNew';
import { ARIA_ROLES } from '../../../../utils/UIConstants';
import styles from '../IndividualEntry.module.scss';
import BlueWarningIcon from '../../../../assets/icons/datalists/BlueWarning';
import UserPicker from '../../../../components/user_picker/UserPicker';
import jsUtility from '../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { CancelToken, validate } from '../../../../utils/UtilityFunctions';
import { getSavePageDetails } from '../IndividualEntry.utils';
import { pageSettingsSchema } from '../IndividualEntry.validation.schema';
import INDIVIDUAL_ENTRY_TABS_STRINGS from '../individual_entry_tab/IndividualEntryTab.constants';

const cancelToken = new CancelToken();

function PageSettings(props) {
    const {
        showPageSettings,
        pageSettings,
        individualDashboardChange,
        onPageCloseOrCancelClick,
        dashboardId,
        newPageOrder,
        saveDashboardPageApiThunk,
        editPagesApiThunk,
        isReadOnlyMode,
    } = props;

    const { t } = useTranslation();
    const { PAGE_SETTINGS, BUTTONS } = INDIVIDUAL_ENTRY_TABS_STRINGS(t);

    const onChangeHandler = (value, id) => {
        let pageDetailsLocal = {};
        if (id === 'viewer') {
            const pageViewerLocal = jsUtility.cloneDeep(pageSettings?.pageViewers) || { teams: [], users: [] };
            if (value?.is_user) {
                if (!jsUtility.find(pageViewerLocal?.users, { _id: value?._id })) {
                    if (pageViewerLocal.users) {
                        pageViewerLocal.users = [...pageViewerLocal.users, value];
                    } else {
                        pageViewerLocal.users = [value];
                    }
                }
            } else if (!jsUtility.find(pageViewerLocal?.teams, { _id: value?._id })) {
                if (pageViewerLocal.teams) {
                    pageViewerLocal.teams = [...pageViewerLocal.teams, value];
                } else {
                    pageViewerLocal.teams = [value];
                }
            }
            pageDetailsLocal = { pageSettings: { ...pageSettings, pageViewers: pageViewerLocal } };
        } else if (id === 'pageName') {
            pageDetailsLocal = { pageSettings: { ...pageSettings, pageName: value } };
        } else if (id === 'inheritParent') {
            pageDetailsLocal = { pageSettings: { ...pageSettings, allowCustomViewers: !pageSettings.allowCustomViewers } };
        }

        if (!jsUtility.isEmpty(pageSettings?.errorList)) {
            const validData = {
                name: pageDetailsLocal?.pageSettings?.pageName,
                isInherit: pageDetailsLocal?.pageSettings?.allowCustomViewers,
            };
            if (validData.isInherit) {
                validData.viewers = pageSettings?.pageViewers;
            }
            const errorList = validate(
                validData,
                pageSettingsSchema(t),
            );
            pageDetailsLocal = { pageSettings: { ...pageDetailsLocal?.pageSettings, errorList: errorList } };
        }
        individualDashboardChange(pageDetailsLocal);
    };

    // Removes page viewers
    const onVisibilityUserRemoveHandle = (removeId) => {
        const pageViewerLocal = jsUtility.cloneDeep(pageSettings?.pageViewers);
        if (jsUtility.find(pageViewerLocal?.users, { _id: removeId })) {
            jsUtility.remove(pageViewerLocal?.users, { _id: removeId });
        }
        if (jsUtility.find(pageViewerLocal?.teams, { _id: removeId })) {
            jsUtility.remove(pageViewerLocal?.teams, { _id: removeId });
        }
        individualDashboardChange({ pageSettings: { ...pageSettings, pageViewers: pageViewerLocal } });
    };

    const onPageSave = () => {
        const validData = {
            name: pageSettings?.pageName,
            isInherit: pageSettings?.allowCustomViewers,
        };
        if (validData.isInherit) {
            let viewers = pageSettings?.pageViewers;
            if (viewers?.users?.length === 0 && viewers?.teams?.length === 0) {
                viewers = {};
            }
            validData.viewers = viewers;
        }
        const errorList = validate(
            validData,
            pageSettingsSchema(t),
        );
        individualDashboardChange({ pageSettings: { ...pageSettings, errorList } });
        const params = getSavePageDetails(pageSettings, dashboardId, pageSettings?.isEdit ? pageSettings?.order : newPageOrder, pageSettings?.isEdit);
        if (jsUtility.isEmpty(errorList)) {
            if (pageSettings?.isEdit) {
                editPagesApiThunk(params, pageSettings?.currentPageId, dashboardId, () => onPageCloseOrCancelClick());
            } else saveDashboardPageApiThunk(params, dashboardId, () => onPageCloseOrCancelClick(), isReadOnlyMode);
        }
    };

    return (
        <Modal
            id="confirmation-modal"
            modalStyle={ModalStyleType.dialog}
            dialogSize={DialogSize.sm}
            className={gClasses.CursorAuto}
            customModalClass={styles.PageSettingsContainer}
            mainContentClassName={styles.ModalMainContainer}
            isModalOpen={showPageSettings}
            mainContent={(
                <div className={cx(gClasses.MX32, gClasses.MT16)}>
                    <TextInput
                        className={gClasses.MT12}
                        labelText={PAGE_SETTINGS.PAGE_NAME.LABEL}
                        value={pageSettings?.pageName}
                        labelClassName={styles.FieldLabel}
                        inputClassName={gClasses.MT6}
                        required
                        errorMessage={pageSettings?.errorList?.name}
                        placeholder={PAGE_SETTINGS.PAGE_NAME.PLACEHOLDER}
                        onChange={(e) => onChangeHandler(e.target.value, 'pageName')}
                        readOnly={pageSettings?.pageType !== 'custom'}
                    />
                    <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.MT12)}>
                        <Label labelName={PAGE_SETTINGS.PAGE_SECURITY.LABEL} className={styles.FieldLabel} />
                        <div className={gClasses.CenterV}>
                            <Text content={PAGE_SETTINGS.PAGE_SECURITY.CUSTOMIZE} className={cx(gClasses.FTwo12BlackV21, gClasses.FontWeight500, gClasses.MR8)} />
                            <ToggleButton
                                isActive={pageSettings?.allowCustomViewers}
                                onChange={() => onChangeHandler(EMPTY_STRING, 'inheritParent')}
                            />
                        </div>
                    </div>
                    <div className={cx(gClasses.P12, gClasses.MT12, gClasses.CenterV, styles.SecurityWarning)}>
                        <BlueWarningIcon />
                        <div className={cx(gClasses.CenterV, gClasses.ML12)}>
                            <Text
                                content={
                                    <>
                                        <span className={cx(gClasses.FTwo13Black18, gClasses.FontWeight600, gClasses.MR5, gClasses.ML2)}>
                                            {PAGE_SETTINGS.PAGE_SECURITY.DESC.FIRST}
                                        </span>
                                        {PAGE_SETTINGS.PAGE_SECURITY.DESC.SECOND}
                                    </>}
                                className={cx(gClasses.FTwo13BlackV20Normal)}
                            />
                        </div>
                    </div>
                    {pageSettings?.allowCustomViewers && (
                        <UserPicker
                            isSearchable
                            required
                            selectedValue={pageSettings?.pageViewers}
                            maxCountLimit={3}
                            className={gClasses.MT12}
                            labelText={PAGE_SETTINGS.PAGE_VIEWERS}
                            labelClassName={styles.FieldLabel}
                            onSelect={(member) => onChangeHandler(member, 'viewer')}
                            onRemove={onVisibilityUserRemoveHandle}
                            errorMessage={pageSettings?.errorList?.viewers}
                            cancelToken={cancelToken}
                            popperPosition={EPopperPlacements.RIGHT}
                        />
                    )}
                </div>
            )}
            headerContent={(
                <div className={cx(gClasses.MT24, gClasses.MX32, gClasses.PositionRelative)}>
                    <Title
                        content={PAGE_SETTINGS.TITLE}
                        alignment={ETitleAlign.left}
                        headingLevel={ETitleHeadingLevel.h5}
                        size={ETitleSize.small}
                    />
                    <button className={cx(gClasses.PositionAbsolute, styles.CloseContainer)} onClick={() => onPageCloseOrCancelClick()}>
                        <CloseIconNew
                            role={ARIA_ROLES.IMG}
                            className={cx(gClasses.CursorPointer)}
                        />
                    </button>
                </div>
            )}
            footerContent={
                <div className={cx(gClasses.CenterV, gClasses.JusEnd, gClasses.P16, styles.FooterContainer)}>
                    <Button
                        buttonText={BUTTONS.CANCEL}
                        onClickHandler={() => onPageCloseOrCancelClick()}
                        type={EButtonType.OUTLINE_SECONDARY}
                        className={styles.MdCancelBtn}
                    />
                    <Button
                        buttonText={pageSettings?.isEdit ? BUTTONS.SAVE : BUTTONS.ADD_PAGE}
                        onClickHandler={() => onPageSave()}
                        type={EButtonType.PRIMARY}
                    />
                </div>
            }
        />
    );
}

PageSettings.propTypes = {
    showPageSettings: PropTypes.bool,
    pageSettings: PropTypes.object,
    individualDashboardChange: PropTypes.func,
    onPageCloseOrCancelClick: PropTypes.func,
    dashboardId: PropTypes.string,
    newPageOrder: PropTypes.number,
    saveDashboardPageApiThunk: PropTypes.func,
    editPagesApiThunk: PropTypes.func,
    isReadOnlyMode: PropTypes.bool,
};

export default PageSettings;
