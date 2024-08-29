import { Anchor, BorderRadiusVariant, Button, CheckboxGroup, Chip, EButtonSizeType, EButtonType, ECheckboxSize, EChipSize, EPopperPlacements, ETitleHeadingLevel, ETitleSize, Input, Label, Modal, ModalSize, ModalStyleType, RadioGroupLayout, SingleDropdown, Size, TextInput, Title, UserPicker, Variant, colorSchemaDefaultValue } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import MappingTable from 'containers/integration/mapping_table/MappingTable';
import { LDAPStrings } from './LDAPConfiguration.strings';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';
import styles from './LDAPConfiguration.module.scss';
import { getUserProfileData, keydownOrKeypessEnterHandle } from '../../../../utils/UtilityFunctions';
import CloseIcon from '../../../../assets/icons/CloseIcon';
import { ARIA_LABELS } from '../../../landing_page/LandingPage.strings';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';

function LDAPConfiguration(props) {
    const { isModalOpen, toggleModal } = props;
    console.log('ldap');
    const { t } = useTranslation();

    const headerComponent = (
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.W100, gClasses.PT24, gClasses.PX48)}>
        <Title
            className={cx(gClasses.FTwo20GrayV3, gClasses.FontWeight500)}
            content={LDAPStrings(t).TITLE}
            headingLevel={ETitleHeadingLevel.h3}
            size={ETitleSize.medium}
        />
        <CloseIcon
          className={cx(styles.CloseIcon, BS.JC_END, gClasses.CursorPointer)}
          onClick={() => toggleModal(false)}
          role={ARIA_ROLES.BUTTON}
          tabIndex={0}
          ariaLabel={t(ARIA_LABELS.CLOSE)}
          onKeyDown={(e) =>
            keydownOrKeypessEnterHandle(e) && toggleModal(false)
          }
        />
      </div>
    );

    const ldapDetails = () => (
      <>
        <Label
          labelName={LDAPStrings(t).LDAP_DETAILS.STATUS.LABEL}
          id={LDAPStrings(t).LDAP_DETAILS.STATUS.ID}
          className={cx(gClasses.MT20, gClasses.FTwo12BlackV20)}
        />
        <Chip
            text={LDAPStrings(t).LDAP_DETAILS.STATUS.ACTIVE}
            textColor="#027A48"
            backgroundColor="#ECFDF3"
            size={EChipSize.md}
            className={cx(gClasses.WhiteSpaceNoWrap, gClasses.DisplayInlineBlock, gClasses.MT6)}
        />
        <Button
            buttonText={LDAPStrings(t).LDAP_DETAILS.STATUS.DISABLE}
            type={EButtonType.OUTLINE_SECONDARY}
            onClickHandler={() => {}}
            className={gClasses.MT16}
        />
        <Title
            className={cx(gClasses.FTwo16GrayV3, gClasses.FontWeight500, gClasses.MT40)}
            content={LDAPStrings(t).LDAP_DETAILS.TITLE}
            headingLevel={ETitleHeadingLevel.h3}
            size={ETitleSize.medium}
        />
        <Anchor
          value={[{
            link_text: 'URL - 1',
            link_url: '10.3.133.25:389',
          },
          ]}
          isLoading={false}
          size={Size.lg}
          id={LDAPStrings(t).LDAP_DETAILS.SERVERS.ID}
          labelText={LDAPStrings(t).LDAP_DETAILS.SERVERS.LABEL}
          placeholder={LDAPStrings(t).LDAP_DETAILS.SERVERS.PLACEHOLDER}
          valuePlaceholder={LDAPStrings(t).LDAP_DETAILS.SERVERS.VALUE_PLACEHOLDER}
          isMultiple
          className={gClasses.MT16}
          required
        />
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT16)}>
        <TextInput
          id={LDAPStrings(t).LDAP_DETAILS.ADMIN.USER.ID}
          value="Mathan"
          labelText={LDAPStrings(t).LDAP_DETAILS.ADMIN.USER.LABEL}
          isLoading={false}
          placeholder={LDAPStrings(t).LDAP_DETAILS.ADMIN.USER.PLACEHOLDER}
          errorMessage={EMPTY_STRING}
        />
        <TextInput
          id={LDAPStrings(t).LDAP_DETAILS.ADMIN.PASSWORD.ID}
          value={EMPTY_STRING}
          labelText={LDAPStrings(t).LDAP_DETAILS.ADMIN.PASSWORD.LABEL}
          isLoading={false}
          placeholder={LDAPStrings(t).LDAP_DETAILS.ADMIN.PASSWORD.PLACEHOLDER}
          errorMessage={EMPTY_STRING}
        />
        </div>
      </>
    );

    const userSearchInfo = () => (
      <>
         <Title
          className={cx(gClasses.FTwo16GrayV3, gClasses.MT40, gClasses.FontWeight500)}
          content={LDAPStrings(t).USER_SEARCH_INFO.TITLE}
          headingLevel={ETitleHeadingLevel.h3}
          size={ETitleSize.medium}
         />
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT16)}>
          <TextInput
            id={LDAPStrings(t).USER_SEARCH_INFO.BASE_DN.ID}
            value="Mathan"
            labelText={LDAPStrings(t).USER_SEARCH_INFO.BASE_DN.LABEL}
            isLoading={false}
            placeholder={LDAPStrings(t).USER_SEARCH_INFO.BASE_DN.PLACEHOLDER}
            errorMessage={EMPTY_STRING}
          />
          <TextInput
            id={LDAPStrings(t).USER_SEARCH_INFO.FILTERS.ID}
            value="cn=Administrator"
            labelText={LDAPStrings(t).USER_SEARCH_INFO.FILTERS.LABEL}
            isLoading={false}
            placeholder={LDAPStrings(t).USER_SEARCH_INFO.FILTERS.PLACEHOLDER}
            errorMessage={EMPTY_STRING}
          />
        </div>
      </>
    );

    const attributeMapping = () => (
      <>
        <Title
        className={cx(gClasses.FTwo16GrayV3, gClasses.MT40, gClasses.FontWeight500)}
        content={LDAPStrings(t).ATTRIBUTE_MAPPING.TITLE}
        headingLevel={ETitleHeadingLevel.h3}
        size={ETitleSize.medium}
        />
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT16)}>
        <TextInput
          id={LDAPStrings(t).ATTRIBUTE_MAPPING.USERNAME.ID}
          value="Mathan"
          labelText={LDAPStrings(t).ATTRIBUTE_MAPPING.USERNAME.LABEL}
          isLoading={false}
          placeholder={LDAPStrings(t).ATTRIBUTE_MAPPING.USERNAME.PLACEHOLDER}
          errorMessage={EMPTY_STRING}
          className={gClasses.MT10}
        />
        <TextInput
          id={LDAPStrings(t).ATTRIBUTE_MAPPING.EMAIL.ID}
          value="mathanm@workhall.com"
          labelText={LDAPStrings(t).ATTRIBUTE_MAPPING.EMAIL.LABEL}
          isLoading={false}
          placeholder={LDAPStrings(t).ATTRIBUTE_MAPPING.EMAIL.PLACEHOLDER}
          errorMessage={EMPTY_STRING}
          className={gClasses.MT10}
        />
        </div>
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT16)}>
        <TextInput
          id={LDAPStrings(t).ATTRIBUTE_MAPPING.FIRST_NAME.ID}
          value="Mathan"
          labelText={LDAPStrings(t).ATTRIBUTE_MAPPING.FIRST_NAME.LABEL}
          isLoading={false}
          placeholder={LDAPStrings(t).ATTRIBUTE_MAPPING.FIRST_NAME.PLACEHOLDER}
          errorMessage={EMPTY_STRING}
          className={gClasses.MT10}
        />
        <TextInput
          id={LDAPStrings(t).ATTRIBUTE_MAPPING.LAST_NAME.ID}
          value="Manimaran"
          labelText={LDAPStrings(t).ATTRIBUTE_MAPPING.LAST_NAME.LABEL}
          isLoading={false}
          placeholder={LDAPStrings(t).ATTRIBUTE_MAPPING.LAST_NAME.PLACEHOLDER}
          errorMessage={EMPTY_STRING}
          className={gClasses.MT10}
        />
        </div>
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT16)}>
        <TextInput
          id={LDAPStrings(t).ATTRIBUTE_MAPPING.BUISNESS_UNIT.ID}
          value="IT"
          labelText={LDAPStrings(t).ATTRIBUTE_MAPPING.BUISNESS_UNIT.LABEL}
          isLoading={false}
          placeholder={LDAPStrings(t).ATTRIBUTE_MAPPING.BUISNESS_UNIT.PLACEHOLDER}
          errorMessage={EMPTY_STRING}
          className={gClasses.MT10}
        />
        <TextInput
          id={LDAPStrings(t).ATTRIBUTE_MAPPING.ROLE.ID}
          value="Administrator"
          labelText={LDAPStrings(t).ATTRIBUTE_MAPPING.ROLE.LABEL}
          isLoading={false}
          placeholder={LDAPStrings(t).ATTRIBUTE_MAPPING.ROLE.PLACEHOLDER}
          errorMessage={EMPTY_STRING}
          className={gClasses.MT10}
        />
        </div>
      </>
    );

    const getAttributeRow = (index) => {
      console.log('getAttributeRow index', index);
      return (
        <>
        <div className={cx(styles.InputColMax, gClasses.MR24)}>
          <SingleDropdown
            id={LDAPStrings(t).OTHER_ATTRIBUTE_MAPPING.USER_FIELD.ID}
            dropdownViewProps={{
              disabled: false,
              selectedLabel: 'Team',
            }}
            placeholder={LDAPStrings(t).OTHER_ATTRIBUTE_MAPPING.USER_FIELD.PLACEHOLDER}
            optionList={[]}
            onClick={() => {}}
            selectedValue={EMPTY_STRING}
            size={Size.md}
          />
        </div>
        <div className={styles.InputColMax}>
          <Input
            content="team"
            size={Size.lg}
            id={LDAPStrings(t).OTHER_ATTRIBUTE_MAPPING.ATTRIBUTE.ID}
            placeholder={LDAPStrings(t).OTHER_ATTRIBUTE_MAPPING.ATTRIBUTE.PLACEHOLDER}
            variant={Variant.border}
            borderRadiusType={BorderRadiusVariant.rounded}
          />
        </div>
        </>
      );
    };

    const otherAttributeMapping = () => (
      <>
        <Title
          className={cx(gClasses.FTwo16GrayV3, gClasses.MT40, gClasses.FontWeight500, gClasses.MB16)}
          content={LDAPStrings(t).OTHER_ATTRIBUTE_MAPPING.TITLE}
          headingLevel={ETitleHeadingLevel.h3}
          size={ETitleSize.medium}
        />
        <MappingTable
          tblHeaders={LDAPStrings(t).OTHER_ATTRIBUTE_MAPPING.HEADERS}
          mappingList={[{
            field: EMPTY_STRING,
            attribute: EMPTY_STRING,
          }]}
          handleMappingChange={() => {}}
          mappingKey="other_attributes"
          initialRow={getAttributeRow}
          initialRowKeyValue={{
            field: EMPTY_STRING,
            attribute: EMPTY_STRING,
          }}
          headerClassName={styles.InputColHeader}
        />
      </>
    );

    const userProfileData = getUserProfileData();

    const restrictUsers = [
      {
        noDelete: true, // To restrict deleting the current user added as default admin
        _id: userProfileData?.id,
        username: userProfileData?.user_name,
        first_name: userProfileData?.first_name,
        last_name: userProfileData?.last_name,
        email: userProfileData?.email,
        is_active: true,
        is_user: true,
        label: userProfileData?.full_name,
        name: userProfileData?.full_name,
        id: userProfileData?.id,
      },
    ];

    const otherConfiguration = () => (
      <>
        <Title
        className={cx(gClasses.FTwo16GrayV3, gClasses.MT40, gClasses.FontWeight500)}
        content={LDAPStrings(t).OTHER_CONFIGURATION.TITLE}
        headingLevel={ETitleHeadingLevel.h3}
        size={ETitleSize.medium}
        />
        <div className={gClasses.MT16}>
          <CheckboxGroup
            size={ECheckboxSize.LG}
            layout={RadioGroupLayout.stack}
            options={LDAPStrings(t).OTHER_CONFIGURATION.RESTRICT_USERS.OPTIONS}
            onClick={() => {}}
            className={styles.CheckBoxStyle}
          />
          <UserPicker
            id={LDAPStrings(t).OTHER_CONFIGURATION.RESTRICT_USERS.ID}
            selectedValue={restrictUsers}
            isLoading={false}
            searchInputClassName={styles.SearchUser}
            className={cx(gClasses.MT16, gClasses.ML32)}
            onChange={() => {}}
            optionList={[]}
            onSelect={() => {}}
            onRemove={() => {}}
            isSearchable
            onSearch={() => {}}
            searchText={EMPTY_STRING}
            popperPosition={EPopperPlacements.RIGHT_END}
            maxCountLimit={3}
            onPopperOutsideClick={() => {}}
          />

        </div>
        <div className={gClasses.MT16}>
          <CheckboxGroup
            size={ECheckboxSize.LG}
            layout={RadioGroupLayout.stack}
            options={LDAPStrings(t).OTHER_CONFIGURATION.TLS.OPTIONS}
            onClick={() => {}}
            className={styles.CheckBoxStyle}
          />
          <Input
            content={EMPTY_STRING}
            size={Size.lg}
            id={LDAPStrings(t).OTHER_CONFIGURATION.TLS.ID}
            placeholder={LDAPStrings(t).OTHER_CONFIGURATION.TLS.PLACEHOLDER}
            variant={Variant.border}
            borderRadiusType={BorderRadiusVariant.rounded}
            className={cx(gClasses.MT16, gClasses.ML32)}
            suffixIcon={
              <Button
                onClickHandler={() => {}}
                type={EMPTY_STRING}
                buttonText={LDAPStrings(t).OTHER_CONFIGURATION.TLS.CHOOSE_FILE}
                colorSchema={colorSchemaDefaultValue}
                className={cx(styles.ChooseFile, gClasses.FTwo13BlueV39)}
              />
            }
          />

        </div>
      </>
    );

    const testConfiguration = () => (
      <>
         <Title
          className={cx(gClasses.FTwo16GrayV3, gClasses.MT40, gClasses.FontWeight500)}
          content={LDAPStrings(t).TEST_CONFIGURATION.TITLE}
          headingLevel={ETitleHeadingLevel.h3}
          size={ETitleSize.medium}
         />
         <div className={cx(BS.D_FLEX, BS.JC_START, gClasses.MT16)}>
            <TextInput
              id={LDAPStrings(t).ATTRIBUTE_MAPPING.USERNAME.ID}
              value="mathanm@workhall.com"
              labelText={LDAPStrings(t).ATTRIBUTE_MAPPING.USERNAME.LABEL}
              isLoading={false}
              placeholder={LDAPStrings(t).ATTRIBUTE_MAPPING.USERNAME.PLACEHOLDER}
              errorMessage={EMPTY_STRING}
            />
            <Button
              onClickHandler={() => {}}
              type={EButtonType.SECONDARY}
              buttonText={LDAPStrings(t).TEST_CONFIGURATION.TEST.LABEL}
              colorSchema={colorSchemaDefaultValue}
              className={cx(gClasses.ML16, gClasses.MT28)}
              disabled
            />
         </div>
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT16)}>
            <TextInput
              id={LDAPStrings(t).ATTRIBUTE_MAPPING.USERNAME.ID}
              value="mathanm@workhall.com"
              labelText={LDAPStrings(t).ATTRIBUTE_MAPPING.USERNAME.LABEL}
              isLoading={false}
              placeholder={LDAPStrings(t).ATTRIBUTE_MAPPING.USERNAME.PLACEHOLDER}
              errorMessage={EMPTY_STRING}
              className={gClasses.MT10}
            />
            <TextInput
              id={LDAPStrings(t).ATTRIBUTE_MAPPING.EMAIL.ID}
              value="mathanm@workhall.com"
              labelText={LDAPStrings(t).ATTRIBUTE_MAPPING.EMAIL.LABEL}
              isLoading={false}
              placeholder={LDAPStrings(t).ATTRIBUTE_MAPPING.EMAIL.PLACEHOLDER}
              errorMessage={EMPTY_STRING}
              className={gClasses.MT10}
            />
          </div>
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT16)}>
            <TextInput
              id={LDAPStrings(t).ATTRIBUTE_MAPPING.FIRST_NAME.ID}
              value="Mathan"
              labelText={LDAPStrings(t).ATTRIBUTE_MAPPING.FIRST_NAME.LABEL}
              isLoading={false}
              placeholder={LDAPStrings(t).ATTRIBUTE_MAPPING.FIRST_NAME.PLACEHOLDER}
              errorMessage={EMPTY_STRING}
              className={gClasses.MT10}
            />
            <TextInput
              id={LDAPStrings(t).ATTRIBUTE_MAPPING.LAST_NAME.ID}
              value="Manimaran"
              labelText={LDAPStrings(t).ATTRIBUTE_MAPPING.LAST_NAME.LABEL}
              isLoading={false}
              placeholder={LDAPStrings(t).ATTRIBUTE_MAPPING.LAST_NAME.PLACEHOLDER}
              errorMessage={EMPTY_STRING}
              className={gClasses.MT10}
            />
          </div>
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT16)}>
            <TextInput
              id={LDAPStrings(t).ATTRIBUTE_MAPPING.BUISNESS_UNIT.ID}
              value="IT"
              labelText={LDAPStrings(t).ATTRIBUTE_MAPPING.BUISNESS_UNIT.LABEL}
              isLoading={false}
              placeholder={LDAPStrings(t).ATTRIBUTE_MAPPING.BUISNESS_UNIT.PLACEHOLDER}
              errorMessage={EMPTY_STRING}
              className={gClasses.MT10}
            />
            <TextInput
              id={LDAPStrings(t).ATTRIBUTE_MAPPING.ROLE.ID}
              value="Administrator"
              labelText={LDAPStrings(t).ATTRIBUTE_MAPPING.ROLE.LABEL}
              isLoading={false}
              placeholder={LDAPStrings(t).ATTRIBUTE_MAPPING.ROLE.PLACEHOLDER}
              errorMessage={EMPTY_STRING}
              className={gClasses.MT10}
            />
          </div>
      </>
    );

    const mainComponent = (
      <div className={cx(gClasses.PX48, gClasses.PB50, gClasses.PT32)}>
        {ldapDetails()}
        {userSearchInfo()}
        {attributeMapping()}
        {otherAttributeMapping()}
        {otherConfiguration()}
        {testConfiguration()}
      </div>
    );

    const footerComponent = (
      <div className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER, gClasses.CenterV)}>
      <div
        className={cx(
          BS.D_FLEX,
          BS.JC_BETWEEN,
          BS.W100,
        )}
      >
          <div className={gClasses.CenterV}>
            <Button
              onClickHandler={() => {}}
              type={EMPTY_STRING}
              buttonText={LDAPStrings(t).FOOTER.DELETE}
              colorSchema={{ ...colorSchemaDefaultValue, activeColor: 'red' }}
              size={EButtonSizeType.SM}
              className={cx(gClasses.Padding0, gClasses.FTwo13Red, gClasses.FontWeight500)}
            />
          </div>
          <div className={gClasses.CenterV}>
            <Button
              onClickHandler={() => {}}
              type={EButtonType.OUTLINE_SECONDARY}
              buttonText={LDAPStrings(t).FOOTER.CANCEL}
              colorSchema={colorSchemaDefaultValue}
              size={EButtonSizeType.SM}
              className={gClasses.Padding0}
            />
            <Button
              onClickHandler={() => {}}
              type={EButtonType.PRIMARY}
              buttonText={LDAPStrings(t).FOOTER.SAVE}
              colorSchema={colorSchemaDefaultValue}
              className={cx(gClasses.ML16)}
              size={EButtonSizeType.SM}
            />
          </div>
      </div>
      </div>
    );

    return (
        <Modal
          id={LDAPStrings(t).ID}
          isModalOpen={isModalOpen}
          headerContent={headerComponent}
          headerContentClassName={cx(BS.D_FLEX)}
          mainContent={mainComponent}
          modalStyle={ModalStyleType.modal}
          className={styles.ModalClass}
          // mainContentClassName={cx(gClasses.M15, gClasses.ML30, gClasses.PB30)}
          modalSize={ModalSize.md}
          footerContent={footerComponent}
          footerContentClassName={cx(
            styles.FooterContent,
            gClasses.PX48,
          )}
        />
    );
}

export default LDAPConfiguration;
