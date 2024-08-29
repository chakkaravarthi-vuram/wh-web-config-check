import React, { useContext, useEffect, useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import {
    Button,
    EButtonSizeType,
    ETabVariation,
    ETitleSize,
    Modal,
    ModalSize,
    ModalStyleType,
    Tab,
    Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import styles from './ConfigModal.module.scss';
import CloseModalIcon from '../../assets/icons/flow_icons/CloseModalIcon';
import ThemeContext from '../../hoc/ThemeContext';
import { cloneDeep } from '../../utils/jsUtility';

function ConfigModal(props) {
    const {
        modalTitle,
        onCloseClick,
        modalBodyContent,
        // Mockdata default value to be removed
        tabOptions,
        currentTab = 1,
        onTabSelect,
        headerContentClassName,
        mainContentClassName,
        footerContentClassName,
        modalClassName,
        footerButton,
        footercontent,
        isModalOpen,
        customModalClass,
        hideTabs = false,
        errorTabList = [],
    } = props;

    const { colorSchemeDefault } = useContext(ThemeContext);
    const [tabOptionsList, setTabOptions] = useState(cloneDeep(tabOptions));

    console.log('currentTab', currentTab);

    const onCloseConfigModal = () => {
        if (onCloseClick) onCloseClick();
    };

    useEffect(() => {
        let formattedTabOptionList = [];
        const tabOptionsCopy = cloneDeep(tabOptions);
        if (errorTabList) {
            console.log('errorTabList', errorTabList);
            (tabOptionsCopy || []).forEach((tab) => {
                    if (errorTabList.includes(tab.tabIndex)) {
                        tab.className = cx(tab?.className, styles.ErrorTab);
                    }
                formattedTabOptionList.push({
                    ...tab,
                });
            });
        } else formattedTabOptionList = tabOptionsCopy;
        setTabOptions(cloneDeep(formattedTabOptionList));
    }, [errorTabList.length, tabOptions.length]);

    const headerContent = (
        <div className={cx(gClasses.PositionRelative, styles.HeaderContainter)}>
            <Title content={modalTitle} size={ETitleSize.small} className={gClasses.GrayV3} />
            <button
                onClick={onCloseConfigModal}
                className={styles.CloseIcon}
            >
                <CloseModalIcon />
            </button>
            {
                !hideTabs && (
                    <Tab
                        options={tabOptionsList}
                        selectedTabIndex={currentTab}
                        variation={ETabVariation.primary}
                        bottomSelectionClass={gClasses.ActiveBar}
                        onClick={onTabSelect}
                        colorScheme={colorSchemeDefault}
                        className={gClasses.MT16}
                        textClass={cx(gClasses.MB8, gClasses.FTwo13, gClasses.FontWeight500)}
                    />
                )
            }
        </div>
    );

    const footerContent = (
        <div className={cx(gClasses.CenterV, styles.FooterContainer, footercontent && gClasses.JusSpaceBtw)}>
            {footercontent}
            {
                footerButton?.map((buttonData = {}) => (
                    <Button
                        key={buttonData?.buttonText}
                        type={buttonData?.buttonType}
                        buttonText={buttonData?.buttonText}
                        className={buttonData?.buttonClassName}
                        onClickHandler={buttonData?.onButtonClick}
                        size={EButtonSizeType.LG}
                        onMouseDown={buttonData?.onMouseDown}
                    />
                ))
            }
        </div>
    );

    const mainContent = (
        <div className={cx(mainContentClassName, styles.MainContent)}>
            {modalBodyContent}
        </div>
    );

    return (
        <Modal
            id={modalTitle}
            isModalOpen={isModalOpen}
            headerContent={headerContent}
            headerContentClassName={headerContentClassName}
            mainContent={mainContent}
            modalStyle={ModalStyleType.modal}
            className={modalClassName}
            customModalClass={cx(styles.ModalWidth, customModalClass)}
            modalSize={ModalSize.lg}
            footerContent={footerContent}
            footerContentClassName={footerContentClassName}
        />
    );
}

export default ConfigModal;
