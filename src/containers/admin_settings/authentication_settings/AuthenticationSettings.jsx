import { Button, Chip, EButtonSizeType, EButtonType, Table, Text } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import React, { useState } from 'react';
import EditIcon from '../../../assets/icons/admin_settings/authentication/EditIcon';

import styles from './AuthenticationSettings.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { ldapTableHeaderData } from './Authentications.constants';
import LDAPConfiguration from './ldap_configuration/LDAPConfiguration';

function AuthenticationSettings() {
    const [isModalOpen, setModalOpen] = useState(false);

    const onEditLDAPConfiguration = () => {
        setModalOpen(true);
    };

    const getLDAPBodyData = () => [
            {
                id: 1,
                component: [
                    <Text content="10.3.133.25:389" size="md" />,
                    <Chip size="sm" text="Active" textColor="#027A48" backgroundColor="#ECFDF3" />,
                    <Text content="27-0ct-2023 at 06:00 pm" size="md" />,
                    <div className={cx([gClasses.DisplayFlex, gClasses.CenterVH])}>
                        <Button buttonText="Sync now" type={EButtonType.SECONDARY} size={EButtonSizeType.SM} noBorder onClickHandler={() => { }} />
                        <Button icon={<EditIcon />} iconOnly size={EButtonSizeType.SM} type="" onClickHandler={onEditLDAPConfiguration} />
                    </div>,
                ],
            },

        ];

    // const getSAMLBodyData = () => [
    //         {
    //             id: 1,
    //             component: [
    //                 <Text content="All administrator" size="md" />,
    //                 <Text content="Admin Team" size="md" />,
    //                 <Text content="admindev" size="md" />,

    //             ],
    //         },

    //     ];

    // const onAddSAMLClickHandler = () => {

    // };
    return (
        <>
        <LDAPConfiguration isModalOpen={isModalOpen} toggleModal={setModalOpen} />
        <div className={styles.AuthenticationContainer}>

            <Text content="LDAP Settings" size="md" className={cx([gClasses.PB20, styles.Title])} />
            <Table
                header={ldapTableHeaderData}
                data={getLDAPBodyData()}
            />

            {/* <div className={gClasses.PB20}>
                <Text content="SAML Settings" size="md" className={cx([gClasses.PB20, gClasses.MT32, styles.Title])} />
                <Table
                    header={samlTableHeaderData}
                    data={getSAMLBodyData()}
                />
                <Button icon={<AddIcon />} type={EButtonType.SECONDARY} noBorder={true} buttonText="Add Another SAML" size={EButtonSizeType.SM} onClickHandler={onAddSAMLClickHandler} />

            </div> */}
        </div>
        </>
    );
}
export default AuthenticationSettings;
