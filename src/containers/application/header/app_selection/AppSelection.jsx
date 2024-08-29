import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { Modal, ModalSize, ModalStyleType, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory } from 'react-router-dom';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from '../Header.module.scss';
import CloseIcon from '../../../../assets/icons/task/CloseIcon';
import OpenAppIcon from '../../../../assets/icons/OpenAppIcon';
import { HEADER_STRINGS } from '../header.utils';
import { routeNavigate } from '../../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../../utils/Constants';
import { HEADER_TRANSLATE_STRINGS } from '../Header.string';

function AppSelection(props) {
    const { appDetails, profile, isPopperOpen, onCloseClick } = props;
    const { BRAND_LOGO_ALT_TEXT } = HEADER_STRINGS;
    const history = useHistory();
    const { t } = useTranslation();
    const { APPLICATION } = HEADER_TRANSLATE_STRINGS(t);

    const onAppClick = (appData) => {
        routeNavigate(history, ROUTE_METHOD.PUSH, appData.value, null, null);
        onCloseClick();
    };
    console.log('fgadsgasdgdsag', appDetails);

    return (
        <Modal
            isModalOpen={isPopperOpen}
            modalStyle={ModalStyleType.modal}
            modalSize={ModalSize.sm}
            mainContentClassName={styles.OverflowYAuto}
            className={gClasses.CursorDefault}
            headerContent={
                <div className={cx(styles.AppSelectionHeader, gClasses.CenterV)}>
                    <div className={cx(styles.AppSelectionLogo, gClasses.CenterV)}>
                        <img src={profile?.acc_logo} className={styles.Logo} alt={BRAND_LOGO_ALT_TEXT} />
                    </div>
                    <CloseIcon onClick={() => onCloseClick()} className={gClasses.CursorPointer} />
                </div>
            }
            mainContent={
                <div className={styles.AppSelectionMainContainer}>
                    <Text content={APPLICATION} className={cx(gClasses.FTwo12GrayV86, gClasses.MB10, gClasses.ML24)} />
                    <div className={cx(gClasses.OverflowYAuto, styles.AppSelectionMainSubContainer)}>
                        {appDetails?.map((appData) => (
                            <div
                                className={cx(gClasses.CursorPointer, styles.AppList, gClasses.CenterV)}
                                onClick={() => onAppClick(appData)}
                                onKeyDown={() => onAppClick(appData)}
                                role="button"
                                tabindex="0"
                            >
                                <Text content={appData.label} className={gClasses.FTwo13Black18} />
                                <OpenAppIcon />
                            </div>
                        ))}
                    </div>
                </div>
            }
        />
    );
}
export default AppSelection;
