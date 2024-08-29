import React, { useContext } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import {
    Button,
    Chip,
    EButtonSizeType,
    ETabVariation,
    ETitleSize,
    Modal,
    ModalSize,
    ModalStyleType,
    Tab,
    Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import styles from './ConfigurationModal.module.scss';
import ThemeContext from '../../hoc/ThemeContext';
import CloseDatalistsIcon from '../../assets/icons/datalists/CloseDatalistsIcon';

function ConfigurationModal(props) {
    const {
        isModalOpen,
        modalTitle,
        onCloseClick,
        modalBodyContent,
        // Mockdata default value to be removed
        tabOptions = [],
        currentTab = '1',
        onTabSelect,
        headerContentClassName,
        mainContentClassName,
        footerContentClassName,
        modalClassName,
        footerButton = [],
        deleteButton,
        badgeName,
    } = props;
    const { colorSchemeDefault } = useContext(ThemeContext);

    const headerContent = (
        <div className={cx(gClasses.PositionRelative, styles.HeaderContainter)}>
            <div className={cx(gClasses.CenterV, { [gClasses.MB10]: tabOptions.length === 0 })}>
                <Title content={modalTitle} size={ETitleSize.small} className={gClasses.GrayV3} />
                {badgeName && <Chip className={cx(gClasses.ML4, gClasses.PR6)} text={badgeName} backgroundColor="#FEF4E6" textColor="#F79009" />}
            </div>
            <button onClick={onCloseClick} className={styles.CloseIcon}>
                <CloseDatalistsIcon />
            </button>
            {tabOptions.length > 0 && (
            <Tab
                options={tabOptions}
                selectedTabIndex={currentTab}
                variation={ETabVariation.primary}
                bottomSelectionClass={gClasses.ActiveBar}
                onClick={onTabSelect}
                colorScheme={colorSchemeDefault}
                className={gClasses.MT16}
                textClass={cx(gClasses.MB8, gClasses.FTwo13, gClasses.FontWeight500)}
            />
            )}
        </div>
    );

    const footerContent = (
        <div className={cx(gClasses.CenterV, styles.FooterContainer, { [gClasses.JusEnd]: !deleteButton, [gClasses.JusSpaceBtw]: deleteButton })}>
            {deleteButton && deleteButton}
            <div className={gClasses.CenterV}>
                {
                    footerButton?.map((buttonData) => (
                        <Button
                            key={buttonData.buttonText}
                            type={buttonData.buttonType}
                            buttonText={buttonData.buttonText}
                            className={buttonData.buttonClassName}
                            onClickHandler={buttonData?.onButtonClick}
                            size={EButtonSizeType.MD}
                        />
                    ))
                }
            </div>
        </div>
    );

    const mainContent = (
        <div className={cx(mainContentClassName, styles.MainContent)}>
            {modalBodyContent}
        </div>
    );

    return (
        <Modal
            isModalOpen={isModalOpen}
            headerContent={headerContent}
            headerContentClassName={headerContentClassName}
            mainContent={mainContent}
            modalStyle={ModalStyleType.modal}
            className={modalClassName}
            customModalClass={styles.ModalWidth}
            modalSize={ModalSize.md}
            footerContent={footerContent}
            footerContentClassName={footerContentClassName}
        />
    );
}

export default ConfigurationModal;
