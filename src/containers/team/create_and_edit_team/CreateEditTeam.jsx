import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { Button, EButtonType, ETitleSize, Modal, ModalSize, ModalStyleType, Title } from '@workhall-pvt-lmt/wh-ui-library';
import CloseIconV2 from 'assets/icons/CloseIconV2';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import gClasses from '../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import { TEAMS_STRINGS } from '../teams.strings';
import BasicDetails from './basic_details/BasicDetails';
import { createEditDataChange } from '../../../redux/reducer/TeamsReducer';
import styles from './CreateEditTeam.module.scss';
import { isBasicUserMode, routeNavigate, validate } from '../../../utils/UtilityFunctions';
import { createTeamBasicDetailsValidationSchema } from '../teams.validation';
import { teamNameExistCheckAction } from '../../../redux/actions/Teams.action';
import jsUtility from '../../../utils/jsUtility';
import { TEAMS_EDIT_TEAM, TEAM_CREATE_TEAM } from '../../../urls/RouteConstants';
import ThemeContext from '../../../hoc/ThemeContext';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { ROUTE_METHOD } from '../../../utils/Constants';

function CreateEditTeam(props) {
    const {
        teamCreateEditState,
        teamCreateEditState: {
            teamName,
            teamDesc,
            errorMessage,
        },
        createEditDataChange,
        teamNameExistCheckAction,
    } = props;
    const history = useHistory();
    const { t } = useTranslation();
    const [clonedLocalState] = useState(teamCreateEditState);
    const isEditTeam = history?.location?.pathname?.includes(TEAMS_EDIT_TEAM) || history?.location?.pathname?.includes(TEAM_CREATE_TEAM);
    const { colorScheme } = useContext(ThemeContext);
    const { COMMON_STRINGS, BUTTON_TEXT } = TEAMS_STRINGS(t);
    const isNormalMode = isBasicUserMode(history);
    const URLParams = new URLSearchParams(jsUtility.get(history, ['location', 'search'], ''));

    // Switch between create/edit teams tab data
    const getCreateEditTabContent = () => {
        const currentTabComponent = (
            <BasicDetails
                createEditDataChange={createEditDataChange}
                errorMessage={errorMessage}
                teamName={teamName}
                teamCreateEditState={teamCreateEditState}
            />
        );
        return currentTabComponent;
    };

    // Called when close is triggered
    const onModalCloseClick = () => {
        const currentParams = jsUtility.get(queryString.parseUrl(history.location.pathname), [COMMON_STRINGS.QUERY], {});
        const createTeamSearchParams = new URLSearchParams(currentParams).toString();
        routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, createTeamSearchParams);
        createEditDataChange({ isBasicDetailsBlockNavigate: true });
        if (isEditTeam || history.location.pathname.includes(TEAM_CREATE_TEAM)) {
            createEditDataChange({ teamName: clonedLocalState?.teamName, teamDesc: clonedLocalState?.teamDesc, createEditTeamModalOpen: false, errorMessage: {} });
        } else {
            createEditDataChange({ teamName: EMPTY_STRING, teamDesc: EMPTY_STRING, createEditTeamModalOpen: false, errorMessage: {} });
        }
    };

    // Specifies the modal header layout content
    const modalHeaderContent = () => (
        <div className={cx(gClasses.CenterV, isEditTeam ? gClasses.JusSpaceBtw : BS.JC_END, gClasses.P24, gClasses.PB16)}>
            {isEditTeam && <Title content={history?.location?.pathname?.includes(TEAMS_EDIT_TEAM) ? COMMON_STRINGS.BASIC_DETAILS : COMMON_STRINGS.CREATE_TEAM} size={ETitleSize.small} />}
            <button onClick={() => onModalCloseClick()}>
                <CloseIconV2
                    className={cx(
                        gClasses.CursorPointer,
                    )}
                    ariaLabel={COMMON_STRINGS.CLOSE}
                    role={ARIA_ROLES.IMG}
                    height={COMMON_STRINGS.ICON_SIZE}
                    width={COMMON_STRINGS.ICON_SIZE}
                />
            </button>
        </div>
    );

    // Navigete to Next step in create Teams
    const navigateToCreateTeams = () => {
        const currentParams = jsUtility.get(queryString.parseUrl(history.location.pathname), [COMMON_STRINGS.QUERY], {});
        const routeParam = {
            pathname: TEAM_CREATE_TEAM,
            search: new URLSearchParams(currentParams).toString(),
        };
        if (isEditTeam) delete routeParam.pathname;
        routeNavigate(history, ROUTE_METHOD.PUSH, routeParam?.pathname, routeParam?.search);
        createEditDataChange({ isBasicDetailsBlockNavigate: true });
    };

    // Submit Basic Details and Check Name already exist
    const onSubmitBasicDetails = async () => {
        const errorList = validate({ teamName, teamDesc }, createTeamBasicDetailsValidationSchema(t));
        if (jsUtility.isEmpty(errorList)) {
            if (!isEditTeam) {
                teamNameExistCheckAction({ team_name: teamName }, navigateToCreateTeams, t);
            } else navigateToCreateTeams();
        } else {
            createEditDataChange({
                errorMessage: errorList,
            });
        }
    };

    // Specifies the modal body layout content
    const modalBodyContent = () => (
        <div className={!isEditTeam && gClasses.CenterH}>
            <div className={cx(gClasses.P24, gClasses.PT0, !isEditTeam && styles.CreateMaxWidth)}>
                {!isEditTeam && (
                    <Title className={gClasses.TextAlignCenterImp} content={COMMON_STRINGS.CREATE_TEAM} size={ETitleSize.small} />
                )}
                {getCreateEditTabContent()}
                {!isEditTeam && (
                    <div className={cx(gClasses.CenterV, BS.JC_END, gClasses.MT32)}>
                        <Button
                            buttonText={BUTTON_TEXT.CANCEL}
                            noBorder
                            type={EButtonType.OUTLINE_SECONDARY}
                            className={cx(gClasses.MR12, gClasses.FontWeight500, styles.CancelButton)}
                            onClickHandler={onModalCloseClick}
                        />
                        <Button
                            colorSchema={isNormalMode && colorScheme}
                            type={EButtonType.PRIMARY}
                            buttonText={BUTTON_TEXT.NEXT}
                            onClickHandler={onSubmitBasicDetails}
                        />
                    </div>
                )}
            </div>
        </div>
    );

    // Define Modal Footer Content
    const modalFooterContent = () => (
        <div className={cx(gClasses.CenterV, styles.FooterContainer, BS.JC_END)}>
            <Button
                buttonText={BUTTON_TEXT.CANCEL}
                noBorder
                className={cx(gClasses.MR24, gClasses.FontWeight500, styles.CancelButton)}
                onClickHandler={onModalCloseClick}
            />
            <Button
                colorSchema={isNormalMode && colorScheme}
                type={EButtonType.PRIMARY}
                buttonText={BUTTON_TEXT.SAVE}
                onClickHandler={onSubmitBasicDetails}
            />
        </div>
    );

    return (
        <Modal
            modalStyle={ModalStyleType.modal}
            modalSize={!isEditTeam ? ModalSize.full : ModalSize.md}
            headerContent={modalHeaderContent()}
            mainContent={modalBodyContent()}
            isModalOpen={URLParams.get('create') === 'teams'}
            footerContent={isEditTeam && modalFooterContent()}
            enableEscClickClose
            onCloseClick={onModalCloseClick}
        />
    );
}

const mapStateToProps = (state) => {
    return {
        teamCreateEditState: state.TeamsReducer.createEditTeam,
        teamDetailsState: state.TeamsReducer.teamDetails,
    };
};

const mapDispatchToProps = { createEditDataChange, teamNameExistCheckAction };

export default connect(mapStateToProps, mapDispatchToProps)(CreateEditTeam);
