import React, { useContext } from 'react';
import cx from 'classnames/bind';
import { Avatar, AvatarSizeVariant, Modal, ModalSize, ModalStyleType, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { NavLink, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from '../Header.module.scss';
import { convertHexToHslBasedOnOpacity, isBasicUserMode } from '../../../../utils/UtilityFunctions';
import ThemeContext from '../../../../hoc/ThemeContext';
import { APPLICATION_STRINGS } from '../../application.strings';
import OpenSeparatelyIcon from '../../../../assets/icons/OpenSeparatelyIcon';
import { getUserPanelData } from '../../../../redux/selectors/LandingPageSelctor';
import CloseIcon from '../../../../assets/icons/task/CloseIcon';
import { getHeaderProfileOptions } from '../Header.string';
import { ROLES } from '../../../../utils/Constants';

function ResponsiveProfile(props) {
    const { profileData, userState, isPopperOpen, onCloseClick, onUserProfileDropdownClickHandler } = props;
    const { colorScheme } = useContext(ThemeContext);
    const history = useHistory();
    const { t } = useTranslation();
    const { HEADER: { PROFILE_DROPDOWN } } = APPLICATION_STRINGS(t);
    const mode = isBasicUserMode(history) ? PROFILE_DROPDOWN.MODES[0].mode : PROFILE_DROPDOWN.MODES[1].mode;
    const { role } = useSelector((state) => state.RoleReducer);
    const isNormalUser = (role === ROLES.MEMBER);
    let profilePicSrc = null;
    if (userState?.profile_pic) {
        if (userState.profile_pic?.base64) {
            profilePicSrc = userState.profile_pic.base64;
        } else {
            profilePicSrc = userState.profile_pic;
        }
    } else {
        profilePicSrc = profileData?.profile_pic;
    }

    const onOptionClick = (index, id, e) => {
        onCloseClick();
        if (index === 2) {
            window.open(id, '_blank');
        } else onUserProfileDropdownClickHandler(id, e);
    };

    const profileMainContainer = () => (
        <div>
            <Text content={PROFILE_DROPDOWN.WORKSPACE} className={cx(gClasses.FTwo12GrayV86, gClasses.MB8, gClasses.MT12, gClasses.ML24)} />
            {!isNormalUser &&
                <div className={styles.ModeContainer}>
                    {PROFILE_DROPDOWN.MODES.map((m) => (
                        <NavLink
                            className={cx(gClasses.CenterV, gClasses.PX24, gClasses.PY8, gClasses.JusSpaceBtw, mode === m.mode && styles.ModeActive)}
                            style={{ textDecoration: 'none', backgroundColor: mode === m.mode && convertHexToHslBasedOnOpacity(colorScheme.activeColor, 90) }}
                            to={m.route}
                            target="_blank"
                        >
                            <div>
                                <Text className={cx(gClasses.FTwo13BlackV12, gClasses.FontWeight500)} content={m.title} />
                                <Text className={cx(gClasses.FontWeight400, gClasses.MT4, mode === m.mode ? gClasses.FTwo12 : gClasses.FTwo12GrayV104)} content={mode === m.mode ? 'Active' : m.description} />
                            </div>
                            {mode !== m.mode && <OpenSeparatelyIcon />}
                        </NavLink>
                    ))}
                </div>
            }
            <div className={gClasses.PX16}>
                {getHeaderProfileOptions(PROFILE_DROPDOWN)?.map((profile, index) => (
                    <button
                        className={cx(styles.ProfileOptionsIndividual, gClasses.W100, gClasses.CenterV, gClasses.PX12, gClasses.PY14, index === 1 && styles.ModeContainer)}
                        onClick={(e) => onOptionClick(index, profile.id, e)}
                    >
                        {profile.optionIcon}
                        <Text className={cx(index === getHeaderProfileOptions(PROFILE_DROPDOWN).length - 1 ? gClasses.FTwo13RedV22 : gClasses.FTwo13BlackV12, gClasses.ML12)} content={profile.optionLabel} />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <Modal
            isModalOpen={isPopperOpen}
            modalStyle={ModalStyleType.modal}
            modalSize={ModalSize.sm}
            mainContentClassName={styles.OverflowYAuto}
            className={gClasses.CursorDefault}
            headerContent={
                <div className={cx(styles.HeaderContainer, gClasses.CenterV)}>
                    <div className={cx(styles.Profile, gClasses.CenterV)}>
                        <Avatar
                            id={profileData.username}
                            name={profileData.username}
                            src={profilePicSrc}
                            size={AvatarSizeVariant.md}
                            showActiveRing
                            colorScheme={colorScheme}
                        />
                        <div className={cx(styles.ProfileRightContainer, gClasses.ML12)}>
                            <Text className={cx(gClasses.FTwo16BlackV12, gClasses.FontWeight500)} content={`${profileData.first_name} ${profileData.last_name}`} />
                            <Text className={cx(gClasses.FTwo12GrayV104, gClasses.FontWeight500)} content={profileData.email} />
                        </div>
                    </div>
                    <CloseIcon onClick={() => onCloseClick()} className={cx(gClasses.CursorPointer, styles.CloseIcon)} />
                </div>
            }
            mainContent={profileMainContainer()}
        />
    );
}
const mapStateToProps = (state) => {
    return {
        profileData: getUserPanelData(state),
        userState: state.UserProfileReducer,
    };
};

export default connect(mapStateToProps)(ResponsiveProfile);
