import React from 'react';
import cx from 'classnames/bind';
import { ARIA_ROLES } from 'utils/UIConstants';
import HashLinkIcon from 'assets/icons/HashLinkIcon';
import gClasses from '../../scss/Typography.module.scss';
import styles from '../../components/auth_layout/AuthLayout.module.scss';

export function PRIVACY_POLICY_ELEMENT(translate) {
  return (
    <div
      className={cx(gClasses.Flex1, gClasses.OverflowYAuto, gClasses.ScrollBarV2)}
      style={{ padding: '30px 50px 50px 50px' }}
      role={ARIA_ROLES.MAIN}
    >
      <h1 className={cx(gClasses.FTwo28GrayV3, gClasses.FontWeight500, gClasses.MB10)}>
        {translate('privacy_policy_settings.workhall_privacy_policy')}
      </h1>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ color: '#848f99' }} lang="EN">
        {translate('privacy_policy_settings.effective_date')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span className="SpellE">
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
            Workhall
          </span>
        </span>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {
            translate('privacy_policy_settings.offers_a_variety')
          }
        </span>
        <span lang="EN">
          <a style={{ color: '#229FD2' }} href="https://workhall.io/" role={ARIA_ROLES.LINK}>
            <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#229FD2' }}>workhall.io</span>
          </a>
        </span>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {' '}
          {translate('privacy_policy_settings.the_websites')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.collects_and_processes')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.collects_uses')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.references_to')}
          <span className="SpellE">Workhall</span>
          {translate('privacy_policy_settings.throughout_the_policy')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.entity_that_acts_as')}
          {' '}
          <span className="SpellE">Workhall&apos;s</span>
          {' '}
          {translate('privacy_policy_settings.business')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.if_you_have_any')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.at')}
          {' '}
        </span>
        <span
          style={{ fontSize: '11.5pt', lineHeight: '150%', color: '#666666', background: 'white', msoHighlight: 'white' }}
          lang="EN"
        >
          Level 2, #185, 3rd Main Road,
          {' '}
          <span className="SpellE">Natesa</span>
          {' '}
          Nagar,
          {' '}
          <span className="SpellE">Virugambakkam,</span>
          {' '}
          <span className="SpellE">Chennai – 600 092</span>
          , Tamil Nadu, India
        </span>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.emailing_us')}
        </span>
        <a style={{ color: '#229FD2' }} href="mailto:ask@workhall.com" role={ARIA_ROLES.LINK}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#229FD2' }} lang="EN">
          ask@workhall.com
          </span>
        </a>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          .
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.privacy_policy_contains')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l26 level1 lfo22' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.what_type_of_user_what')}
          {' '}
          <span className="GramE">{translate('privacy_policy_settings.are')}</span>
          {' '}
          {translate('privacy_policy_settings.applicable_to_me')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l26 level1 lfo22' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.list_item_1')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l26 level1 lfo22' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.list_item_2')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l26 level1 lfo22' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.list_item_3')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l26 level1 lfo22' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.list_item_4')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{
          marginTop: '0cm',
          marginRight: '0cm',
          marginBottom: '0pt',
          marginLeft: '36pt',
          textIndent: '-18pt',
          lineHeight: '150%',
          msoList: 'l26 level1 lfo22',
        }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span className="SpellE">
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
            Workhall&nbsp;
          </span>
        </span>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.contact_info')}
        </span>
      </p>
      <h2
        style={{
          marginTop: '24pt',
          marginRight: '0cm',
          marginBottom: '18pt',
          marginLeft: '-21px',
          lineHeight: '150%',
          msoPagination: 'widow-orphan',
          pageBreakAfter: 'auto',
        }}
        className={styles.headingLink}
      >
        <a style={{ visibility: 'hidden', verticalAlign: 'middle' }} name="_u6gxawp2jizf" href="/privacy_policy#what-type-of-user-am-I-and-which-privacy-terms-are-applicable-to-me" role={ARIA_ROLES.LINK}>
          <HashLinkIcon ariaHidden />
        </a>
        <span style={{ marginLeft: '5px', fontSize: '11pt', lineHeight: '150%', color: '#151b26' }} lang="EN" id="what-type-of-user-am-I-and-which-privacy-terms-are-applicable-to-me">
          {'I. '}
          {translate('privacy_policy_settings.what_type_of_user_which')}
        </span>
      </h2>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span className="SpellE">
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
            Workhall&nbsp;
          </span>
        </span>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.has_three_different')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.products_used_please')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.in_different_ways')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l25 level1 lfo1' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.subscribers')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.subscription_plan')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.and_the_organization')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.is_a_data_processor')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l25 level1 lfo1' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.free_users')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.is_the_data_controller_free')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{
          marginTop: '0cm',
          marginRight: '0cm',
          marginBottom: '0pt',
          marginLeft: '36pt',
          textIndent: '-18pt',
          lineHeight: '150%',
          msoList: 'l25 level1 lfo1',
        }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.site_visitors')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          is_the_data_controller
          {' '}
          <span className="SpellE">Workhall</span>
          .
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.is_the_data_controller_site')}
        </span>
      </p>
      <h2
        style={{
          marginTop: '24pt',
          marginRight: '0cm',
          marginBottom: '18pt',
          marginLeft: '-21px',
          lineHeight: '150%',
          msoPagination: 'widow-orphan',
          pageBreakAfter: 'auto',
        }}
        className={styles.headingLink}
      >
        <a style={{ visibility: 'hidden' }} name="_ceibaqqv8jqw" href="/privacy_policy#privacy-terms-for-subscribers" role={ARIA_ROLES.LINK}>
        <HashLinkIcon ariaHidden />
        </a>
        <span style={{ marginLeft: '5px', fontSize: '11pt', lineHeight: '150%', color: '#151b26' }} lang="EN" id="privacy-terms-for-subscribers">
          {'II. '}
          {translate('privacy_policy_settings.privacy_terms_for_subscribers')}
        </span>
      </h2>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'A. '}
          {translate('privacy_policy_settings.overview')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.section_of_this_policy')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.is_the_data_processor_customer')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'B. '}
          {translate('privacy_policy_settings.collection_and_use')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.information_from_subscribers')}
        </span>
      </p>
      <ol style={{ marginTop: '0cm' }} type={1} start={1}>
        <li className="MsoNormal" style={{ lineHeight: '150%', msoList: 'l24 level1 lfo7' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
            {translate('privacy_policy_settings.is_the_data_processor_customer')}
            {' '}
            <span className="SpellE">Workhall</span>
            {' '}
            {translate('privacy_policy_settings.in_accordance_with')}
            {' '}
            <span className="SpellE">Workhall</span>
            {translate('privacy_policy_settings.determines_its_own')}
          </span>
        </li>
        <li className="MsoNormal" style={{ lineHeight: '150%', msoList: 'l24 level1 lfo7' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.account_information')}
            {' '}
            <span className="SpellE">Workhall</span>
            {' '}
            {translate('privacy_policy_settings.account_content')}
            {' '}
            <span className="SpellE">Workhall</span>
            {translate('privacy_policy_settings.stores_your_payment')}
          </span>
        </li>
        <li className="MsoNormal" style={{ lineHeight: '150%', msoList: 'l24 level1 lfo7' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.service_usage_information')}
          </span>
        </li>
      </ol>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l18 level1 lfo8' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.device_information')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l18 level1 lfo8' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.log_files_content')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l18 level1 lfo8' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.location_information_content')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l18 level1 lfo8' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.workspace_use_metadata_content')}
        </span>
      </p>
      <ol style={{ marginTop: '0cm' }} type={1} start={4}>
        <li className="MsoNormal" style={{ lineHeight: '150%', msoList: 'l23 level1 lfo14' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.other_information_content')}
            {' '}
            <span className="SpellE">Workhall</span>
            {' '}
            {translate('privacy_policy_settings.sweepstakes_contests')}
          </span>
        </li>
        <li className="MsoNormal" style={{ marginBottom: '0pt', lineHeight: '150%', msoList: 'l23 level1 lfo14' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.third_party_integrations')}
            {' '}
            <span className="SpellE">{translate('privacy_policy_settings.unito')}</span>
            ,
            {' '}
            <span className="SpellE">{translate('privacy_policy_settings.wufoo')}</span>
            {translate('privacy_policy_settings.slack_through_the_service')}
          </span>
        </li>
      </ol>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'C. '}
          {translate('privacy_policy_settings.how_does')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.use_subscriber_info')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.explanation')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.uses_info_collected')}
        </span>
      </p>
      <ol style={{ marginTop: '0cm' }} type={1} start={1}>
        <li className="MsoNormal" style={{ lineHeight: '150%', msoList: 'l9 level1 lfo23' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.workspace_content_usage')}
            {' '}
            <span className="SpellE">Workhall</span>
            {' '}
            {translate('privacy_policy_settings.may_view_and')}
          </span>
          {/* bulletin points starts */}
              <p
                className="MsoNormal"
                style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l5 level1 lfo5' }}
              >
                {/* [if !supportLists] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  <span style={{ msoList: 'Ignore' }}>
                    ●
                    <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                  </span>
                </span>
                {/* [endif] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                {translate('privacy_policy_settings.workspace_content_bullet_points.to_maintain')}
                </span>
              </p>
              <p
                className="MsoNormal"
                style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l5 level1 lfo5' }}
              >
                {/* [if !supportLists] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  <span style={{ msoList: 'Ignore' }}>
                    ●
                    <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                  </span>
                </span>
                {/* [endif] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                {translate('privacy_policy_settings.workspace_content_bullet_points.to_prevent')}
                </span>
              </p>
              <p
                className="MsoNormal"
                style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l5 level1 lfo5' }}
              >
                {/* [if !supportLists] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  <span style={{ msoList: 'Ignore' }}>
                    ●
                    <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                  </span>
                </span>
                {/* [endif] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                {translate('privacy_policy_settings.workspace_content_bullet_points.to_investigate')}
                </span>
              </p>
              <p
                className="MsoNormal"
                style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l5 level1 lfo5' }}
              >
                {/* [if !supportLists] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  <span style={{ msoList: 'Ignore' }}>
                    ●
                    <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                  </span>
                </span>
                {/* [endif] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                {translate('privacy_policy_settings.workspace_content_bullet_points.to_comply_with')}
                </span>
              </p>
              <p
                className="MsoNormal"
                style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l5 level1 lfo5' }}
              >
                {/* [if !supportLists] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  <span style={{ msoList: 'Ignore' }}>
                    ●
                    <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                  </span>
                </span>
                {/* [endif] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                {translate('privacy_policy_settings.workspace_content_bullet_points.as_otherwise_set_forth')}
                </span>
              </p>

        </li>
      {/* </ol> */}

      {/* <ol style={{ marginTop: '0cm' }} type={1} start={2}> */}
        <li className="MsoNormal" style={{ lineHeight: '150%', msoList: 'l8 level1 lfo13' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.account_information_service_usage')}
            {' '}
            <span className="SpellE">Workhall</span>
            {' '}
            {translate('privacy_policy_settings.may_use_these_categories')}
          </span>
                <p
                  className="MsoNormal"
                  style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l2 level1 lfo20' }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.account_info_bullet_points.to_maintain')}
                  </span>
                </p>
                <p
                  className="MsoNormal"
                  style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l2 level1 lfo20' }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.account_info_bullet_points.to_respond')}
                  </span>
                </p>
                <p
                  className="MsoNormal"
                  style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l2 level1 lfo20' }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.account_info_bullet_points.to_prevent')}
                  </span>
                </p>
                <p
                  className="MsoNormal"
                  style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l2 level1 lfo20' }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.account_info_bullet_points.to_investigate')}
                  </span>
                </p>
                <p
                  className="MsoNormal"
                  style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l2 level1 lfo20' }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.account_info_bullet_points.to_comply_with')}
                  </span>
                </p>
                <p
                  className="MsoNormal"
                  style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l2 level1 lfo20' }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.account_info_bullet_points.to_understand_user_interests')}
                  </span>
                </p>
                <p
                  className="MsoNormal"
                  style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l2 level1 lfo20' }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.account_info_bullet_points.to_engage_in_analysis')}
                  </span>
                </p>
                <p
                  className="MsoNormal"
                  style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l2 level1 lfo20' }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.account_info_bullet_points.to_protect_service_and_users')}
                  </span>
                </p>
                <p
                  className="MsoNormal"
                  style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l2 level1 lfo20' }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.account_info_bullet_points.to_communicate_with_users')}
                  </span>
                </p>
                <p
                  className="MsoNormal"
                  style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l2 level1 lfo20' }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.account_info_bullet_points.to_send_promotions')}
                    {' '}
                    <span className="SpellE">Workhall</span>
                    {translate('privacy_policy_settings.account_info_bullet_points.ability_to_unsubscribe')}
                  </span>
                </p>
                <p
                  className="MsoNormal"
                  style={{
                    marginTop: '16px',
                    marginRight: '0cm',
                    marginBottom: '20pt',
                    marginLeft: '20pt',
                    textIndent: '-18pt',
                    lineHeight: '150%',
                    msoList: 'l2 level1 lfo20',
                  }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.account_info_bullet_points.to_provide_cross_device_management')}
                  </span>
                  <span lang="EN">
                    <a style={{ color: '#229FD2' }} href="https://tools.google.com/dlpage/gaoptout" role={ARIA_ROLES.LINK}>
                      <span
                        style={{ fontSize: '12pt', lineHeight: '150%', color: '#229FD2', textDecoration: 'none', textUnderline: 'none' }}
                      >
                        {translate('privacy_policy_settings.here')}
                      </span>
                    </a>
                  </span>
                </p>
        </li>
      </ol>

      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'D. '}
          {translate('privacy_policy_settings.sections.sharing_of_subscriber')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.sections.in_accordance_with')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l13 level1 lfo19' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.sections.affiliates')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.sections.family_of_companies')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l13 level1 lfo19' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.sections.service_providers')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l13 level1 lfo19' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.sections.business_transactions')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.sections.will_comply_with')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{
          marginTop: '0cm',
          marginRight: '0cm',
          marginBottom: '0pt',
          marginLeft: '36pt',
          textIndent: '-18pt',
          lineHeight: '150%',
          msoList: 'l13 level1 lfo19',
        }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.sections.consistent_with')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'E. '}
          {translate('privacy_policy_settings.sections.aggregate')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.sections.we_may_aggregate')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'F. '}
          {translate('privacy_policy_settings.sections.combined_info')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.sections.we_may_combine')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'G. '}
          {translate('privacy_policy_settings.sections.data_retention')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.sections.we_will_retain')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'H. '}
          {translate('privacy_policy_settings.sections.data_subject_rights')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.sections.please_contact_your')}
        </span>
      </p>
      <h2
        style={{
          marginTop: '24pt',
          marginRight: '0cm',
          marginBottom: '18pt',
          marginLeft: '-21px',
          lineHeight: '150%',
          msoPagination: 'widow-orphan',
          pageBreakAfter: 'auto',
        }}
        className={styles.headingLink}
      >
        <a style={{ visibility: 'hidden' }} name="_s3hjsou6mjm5" href="/privacy_policy#privacy-terms-for-free-users" role={ARIA_ROLES.LINK}>
          <HashLinkIcon ariaHidden />
        </a>
        <span style={{ marginLeft: '5px', fontSize: '11pt', lineHeight: '150%', color: '#151b26' }} lang="EN" id="privacy-terms-for-free-users">
          {'III. '}
          {translate('privacy_policy_settings.privacy_terms_free_users')}
        </span>
      </h2>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'A. '}
          {translate('privacy_policy_settings.overview')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.section_three_of_the_policy')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.is_the_data_controller_personal')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'B. '}
          {translate('privacy_policy_settings.collection_and_use_of')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.this_section_explains')}
        </span>
      </p>
      <ol style={{ marginTop: '0cm' }} type={1} start={1}>
        <li className="MsoNormal" style={{ lineHeight: '150%', msoList: 'l12 level1 lfo12' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.info_you_provide')}
            {' '}
            <span className="SpellE">Workhall</span>
            .
            {' '}
            <span className="SpellE">Workhall</span>
            {translate('privacy_policy_settings.collects_the_following')}
          </span>
                <p
                  className="MsoNormal"
                  style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l16 level1 lfo3' }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.messages_attachments')}
                  </span>
                </p>
                <p
                  className="MsoNormal"
                  style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l16 level1 lfo3' }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.info_you_provide_acc')}
                    {' '}
                    <span className="SpellE">Workhall</span>
                    {translate('privacy_policy_settings.which_may_include')}
                  </span>
                </p>
                <p
                  className="MsoNormal"
                  style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l16 level1 lfo3' }}
                >
                  {/* [if !supportLists] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                    <span style={{ msoList: 'Ignore' }}>
                      ●
                      <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                  </span>
                  {/* [endif] */}
                  <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  {translate('privacy_policy_settings.info_you_provide_other')}
                    {' '}
                    <span className="SpellE">Workhall</span>
                    {' '}
                    {translate('privacy_policy_settings.sweepstakes_contests')}
                  </span>
                </p>

        </li>
      {/* </ol> */}
      {/* <ol style={{ marginTop: '0cm' }} type={1} start={2}> */}
        <li className="MsoNormal" style={{ lineHeight: '150%', msoList: 'l3 level1 lfo11' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.service_usage')}
          </span>

              <p
                className="MsoNormal"
                style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l4 level1 lfo4' }}
              >
                {/* [if !supportLists] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  <span style={{ msoList: 'Ignore' }}>
                    ●
                    <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                  </span>
                </span>
                {/* [endif] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                {translate('privacy_policy_settings.device_information')}
                </span>
              </p>
              <p
                className="MsoNormal"
                style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l4 level1 lfo4' }}
              >
                {/* [if !supportLists] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  <span style={{ msoList: 'Ignore' }}>
                    ●
                    <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                  </span>
                </span>
                {/* [endif] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                {translate('privacy_policy_settings.log_files')}
                </span>
              </p>
              <p
                className="MsoNormal"
                style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l4 level1 lfo4' }}
              >
                {/* [if !supportLists] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  <span style={{ msoList: 'Ignore' }}>
                    ●
                    <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                  </span>
                </span>
                {/* [endif] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                {translate('privacy_policy_settings.location_information_content')}
                </span>
              </p>
              <p
                className="MsoNormal"
                style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l4 level1 lfo4' }}
              >
                {/* [if !supportLists] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                  <span style={{ msoList: 'Ignore' }}>
                    ●
                    <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                  </span>
                </span>
                {/* [endif] */}
                <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                {translate('privacy_policy_settings.workspace_use_metadata')}
                </span>
              </p>
        </li>
      {/* </ol> */}
      {/* <ol style={{ marginTop: '0cm' }} type={1} start={3}> */}
        <li className="MsoNormal" style={{ lineHeight: '150%', msoList: 'l21 level1 lfo15' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.integrations')}
            {' '}
            <span className="SpellE">{translate('privacy_policy_settings.unito')}</span>
            ,
            {' '}
            <span className="SpellE">{translate('privacy_policy_settings.wufoo')}</span>
            {translate('privacy_policy_settings.slack_through')}
          </span>
        </li>
        <li className="MsoNormal" style={{ marginBottom: '0pt', lineHeight: '150%', msoList: 'l21 level1 lfo15' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.info_collected_other')}
            {' '}
            <span className="SpellE">Workhall</span>
            {' '}
            {translate('privacy_policy_settings.may_receive')}
          </span>
        </li>
      </ol>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'C. '}
          {translate('privacy_policy_settings.use_of_free_info')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span className="SpellE">
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
            Workhall
          </span>
        </span>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {' '}
          {translate('privacy_policy_settings.may_use_info_collected')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l14 level1 lfo24' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.account_info_bullet_points.to_maintain')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l14 level1 lfo24' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.account_info_bullet_points.to_respond')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l14 level1 lfo24' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.account_info_bullet_points.to_prevent')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l14 level1 lfo24' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.account_info_bullet_points.to_investigate')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l14 level1 lfo24' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.account_info_bullet_points.to_comply_with')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l14 level1 lfo24' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.account_info_bullet_points.to_understand_user_interests')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l14 level1 lfo24' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.account_info_bullet_points.to_engage_in_analysis')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l14 level1 lfo24' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.account_info_bullet_points.to_protect_service_and_users')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l14 level1 lfo24' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.account_info_bullet_points.to_communicate_with_users')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l14 level1 lfo24' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.account_info_bullet_points.to_send_promotions')}
          {' '}
          <span className="SpellE">Workhall</span>
          {translate('privacy_policy_settings.account_info_bullet_points.ability_to_unsubscribe')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{
          marginTop: '0cm',
          marginRight: '0cm',
          marginBottom: '20pt',
          marginLeft: '36pt',
          textIndent: '-18pt',
          lineHeight: '150%',
          msoList: 'l14 level1 lfo24',
        }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.account_info_bullet_points.to_provide_cross_device_management')}
        </span>
        <span lang="EN">
          <a style={{ color: '#229FD2' }} href="https://tools.google.com/dlpage/gaoptout" role={ARIA_ROLES.LINK}>
            <span
              style={{ fontSize: '12pt', lineHeight: '150%', color: '#229FD2', textDecoration: 'none', textUnderline: 'none' }}
            >
              {translate('privacy_policy_settings.here')}
            </span>
          </a>
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'D. '}
          {translate('privacy_policy_settings.legal_bases_for_use_of')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.if_you_are_located')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l15 level1 lfo27' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.where_use_of_obligations')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l15 level1 lfo27' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.where_use_of_legitimate')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l15 level1 lfo27' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.where_use_of_comply')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{
          marginTop: '0cm',
          marginRight: '0cm',
          marginBottom: '20pt',
          marginLeft: '36pt',
          textIndent: '-18pt',
          lineHeight: '150%',
          msoList: 'l15 level1 lfo27',
        }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.where_we_have_consent')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'E. '}
          {translate('privacy_policy_settings.sharing_free_user_info')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.we_share_info')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l20 level1 lfo21' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.sections.affiliates')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.sections.family_of_companies')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l20 level1 lfo21' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.sections.service_providers')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l20 level1 lfo21' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.business_transfers')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.sections.will_comply_with')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l20 level1 lfo21' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.consent')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{
          marginTop: '0cm',
          marginRight: '0cm',
          marginBottom: '20pt',
          marginLeft: '36pt',
          textIndent: '-18pt',
          lineHeight: '150%',
          msoList: 'l20 level1 lfo21',
        }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.consistent_with')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'F. '}
          {translate('privacy_policy_settings.sections.aggregate')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.we_may_aggregate_deidentify')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'G. '}
          {translate('privacy_policy_settings.sections.combined_info')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.for_the_purposes')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'H. '}
          {translate('privacy_policy_settings.sections.data_retention')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.we_will_retain_info')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'I. '}
          {translate('privacy_policy_settings.sections.data_subject_rights')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.local_legal_req')}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.contact_info_section')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l17 level1 lfo6' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.provide_access_to')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l17 level1 lfo6' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.prevent_the_processing')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l17 level1 lfo6' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.update_the_info')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l17 level1 lfo6' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.delete_certain')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l17 level1 lfo6' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.restrict_the_way')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l17 level1 lfo6' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.transfer_your')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{
          marginTop: '0cm',
          marginRight: '0cm',
          marginBottom: '0pt',
          marginLeft: '36pt',
          textIndent: '-18pt',
          lineHeight: '150%',
          msoList: 'l17 level1 lfo6',
        }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.revoke_your')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.we_will_consider')}
        </span>
      </p>
      <h2
        style={{
          marginTop: '24pt',
          marginRight: '0cm',
          marginBottom: '18pt',
          marginLeft: '-21px',
          lineHeight: '150%',
          msoPagination: 'widow-orphan',
          pageBreakAfter: 'auto',
        }}
        className={styles.headingLink}
      >
        <a style={{ visibility: 'hidden' }} name="_6z7fh02bk7k7" href="/privacy_policy#privacy-terms-for-site-visitors" role={ARIA_ROLES.LINK}>
          <HashLinkIcon ariaHidden />
        </a>
        <span style={{ marginLeft: '5px', fontSize: '11pt', lineHeight: '150%', color: '#151b26' }} lang="EN" id="privacy-terms-for-site-visitors">
          {'IV. '}
          {translate('privacy_policy_settings.privacy_terms_for_visitors')}
        </span>
      </h2>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'A. '}
          {translate('privacy_policy_settings.overview')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.section_four_of_the_policy')}
          {' '}
          <span className="SpellE">Workhall’s</span>
          {' '}
          {translate('privacy_policy_settings.websites_not_to')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.is_the_data_controller_processing')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'B. '}
          {translate('privacy_policy_settings.collection_and_use_visitor')}
        </span>
      </p>
      <ol style={{ marginTop: '0cm' }} type={1} start={1}>
        <li className="MsoNormal" style={{ lineHeight: '150%', msoList: 'l11 level1 lfo17' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.info_collected_visitors')}
            <br aria-hidden="true" />
            {translate('privacy_policy_settings.when_you_use')}
          </span>

            <p
              className="MsoNormal"
              style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l0 level1 lfo18' }}
            >
              {/* [if !supportLists] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                <span style={{ msoList: 'Ignore' }}>
                  ●
                  <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </span>
              {/* [endif] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
              {translate('privacy_policy_settings.contact_info_request')}
                {' '}
                <span className="SpellE">Workhall</span>
                {' '}
                {translate('privacy_policy_settings.sweepstakes_contest')}
              </span>
            </p>
            <p
              className="MsoNormal"
              style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l0 level1 lfo18' }}
            >
              {/* [if !supportLists] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                <span style={{ msoList: 'Ignore' }}>
                  ●
                  <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </span>
              {/* [endif] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
              {translate('privacy_policy_settings.website_usage')}
              </span>
            </p>
            <p
              className="MsoNormal"
              style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l0 level1 lfo18' }}
            >
              {/* [if !supportLists] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                <span style={{ msoList: 'Ignore' }}>
                  ●
                  <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </span>
              {/* [endif] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
              {translate('privacy_policy_settings.location_info')}
              </span>
            </p>
        </li>
      {/* </ol> */}
      {/* <ol style={{ marginTop: '0cm' }} type={1} start={2}> */}
        <li className="MsoNormal" style={{ lineHeight: '150%', marginBottom: '16px', msoList: 'l6 level1 lfo26' }}>
          <span style={{ marginTop: '16px', fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.cookies_and')}
            <br aria-hidden="true" />
            {translate('privacy_policy_settings.to_collect_the')}
            <span className="SpellE">i</span>
            {translate('privacy_policy_settings.recognize_your')}
          </span>
        </li>
        <li className="MsoNormal" style={{ lineHeight: '150%', msoList: 'l6 level1 lfo26' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
            Use of Information Collected from Site Visitors
            <br aria-hidden="true" />
            {translate('privacy_policy_settings.we_use_the_info')}
          </span>
            <p
              className="MsoNormal"
              style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l10 level1 lfo10' }}
            >
              {/* [if !supportLists] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                <span style={{ msoList: 'Ignore' }}>
                  ●
                  <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </span>
              {/* [endif] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
              {translate('privacy_policy_settings.maintain_provide')}
              </span>
            </p>
            <p
              className="MsoNormal"
              style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l10 level1 lfo10' }}
            >
              {/* [if !supportLists] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                <span style={{ msoList: 'Ignore' }}>
                  ●
                  <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </span>
              {/* [endif] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
              {translate('privacy_policy_settings.account_info_bullet_points.to_respond')}
              </span>
            </p>
            <p
              className="MsoNormal"
              style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l10 level1 lfo10' }}
            >
              {/* [if !supportLists] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                <span style={{ msoList: 'Ignore' }}>
                  ●
                  <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </span>
              {/* [endif] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
              {translate('privacy_policy_settings.account_info_bullet_points.to_send_promotions')}
                {' '}
                <span className="SpellE">Workhall</span>
                {translate('privacy_policy_settings.account_info_bullet_points.ability_to_unsubscribe')}
              </span>
            </p>
            <p
              className="MsoNormal"
              style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l10 level1 lfo10' }}
            >
              {/* [if !supportLists] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                <span style={{ msoList: 'Ignore' }}>
                  ●
                  <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </span>
              {/* [endif] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
              {translate('privacy_policy_settings.account_info_bullet_points.to_prevent')}
              </span>
            </p>
            <p
              className="MsoNormal"
              style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l10 level1 lfo10' }}
            >
              {/* [if !supportLists] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                <span style={{ msoList: 'Ignore' }}>
                  ●
                  <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </span>
              {/* [endif] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
              {translate('privacy_policy_settings.account_info_bullet_points.to_investigate')}
              </span>
            </p>
            <p
              className="MsoNormal"
              style={{ marginTop: '16px', marginLeft: '20pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l10 level1 lfo10' }}
            >
              {/* [if !supportLists] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                <span style={{ msoList: 'Ignore' }}>
                  ●
                  <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </span>
              {/* [endif] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
              {translate('privacy_policy_settings.help_us_understand')}
              </span>
            </p>
            <p
              className="MsoNormal"
              style={{
                marginTop: '16px',
                marginLeft: '20pt',
                marginRight: '0cm',
                marginBottom: '0pt',
                textIndent: '-18pt',
                lineHeight: '150%',
                msoList: 'l10 level1 lfo10',
              }}
            >
              {/* [if !supportLists] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
                <span style={{ msoList: 'Ignore' }}>
                  ●
                  <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
                </span>
              </span>
              {/* [endif] */}
              <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
              {translate('privacy_policy_settings.engage_in')}
              </span>
            </p>
        </li>
      </ol>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'C. '}
          {translate('privacy_policy_settings.legal_bases')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.if_you_are_located_eu')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l7 level1 lfo9' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.where_use_of_websites_obligations')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l7 level1 lfo9' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.where_use_of_websites_legitimate')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l7 level1 lfo9' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.where_use_of_comply')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{
          marginTop: '0cm',
          marginRight: '0cm',
          marginBottom: '0pt',
          marginLeft: '36pt',
          textIndent: '-18pt',
          lineHeight: '150%',
          msoList: 'l7 level1 lfo9',
        }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.where_we_have_consent')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'D. '}
          {translate('privacy_policy_settings.aggregate_deidentify')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.we_may_aggregate_and')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'E. '}
          {translate('privacy_policy_settings.sections.combined_info')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.you_agree_that')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'F. '}
          {translate('privacy_policy_settings.website_analytics_advertising')}
        </span>
      </p>
      <ol style={{ marginTop: '0cm' }} type={1} start={1}>
        <li className="MsoNormal" style={{ lineHeight: '150%', msoList: 'l1 level1 lfo16' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.website_analytics')}
            <br aria-hidden="true" />
            {translate('privacy_policy_settings.third_party_analytics')}
          </span>
          <span lang="EN">
            <a style={{ color: '#229FD2' }} href="https://tools.google.com/dlpage/gaoptout" role={ARIA_ROLES.LINK}>
              <span
                style={{
                  fontSize: '12pt',
                  lineHeight: '150%',
                  color: '#229FD2',
                  textDecoration: 'none',
                  textUnderline: 'none',
                }}
              >
                {translate('privacy_policy_settings.here')}
              </span>
            </a>
          </span>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
            .
          </span>
        </li>
        <li className="MsoNormal" style={{ lineHeight: '150%', msoList: 'l1 level1 lfo16' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.online_advertising')}
            <br aria-hidden="true" />
            {translate('privacy_policy_settings.the_websites_may')}
            <br aria-hidden="true" />
            {translate('privacy_policy_settings.third_parties_whose')}
            <br aria-hidden="true" />
            {translate('privacy_policy_settings.we_neither_have_access')}
          </span>
          <span lang="EN">
            <a style={{ color: '#229FD2' }} href="http://optout.networkadvertising.org/" role={ARIA_ROLES.LINK}>
              <span
                style={{
                  fontSize: '12pt',
                  lineHeight: '150%',
                  color: '#229FD2',
                  textDecoration: 'none',
                  textUnderline: 'none',
                }}
              >
                {' '}
                {translate('privacy_policy_settings.network_advertising')}
              </span>
            </a>
          </span>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.the')}
          </span>
          <span lang="EN">
            <a style={{ color: '#229FD2' }} href="http://optout.aboutads.info/" role={ARIA_ROLES.LINK}>
              <span
                style={{
                  fontSize: '12pt',
                  lineHeight: '150%',
                  color: '#229FD2',
                  textDecoration: 'none',
                  textUnderline: 'none',
                }}
              >
                {' '}
                {translate('privacy_policy_settings.digital_advertising')}
              </span>
            </a>
          </span>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.or')}
          </span>
          <span lang="EN">
            <a style={{ color: '#229FD2' }} href="http://www.youronlinechoices.eu/" role={ARIA_ROLES.LINK}>
              <span
                style={{
                  fontSize: '12pt',
                  lineHeight: '150%',
                  color: '#229FD2',
                  textDecoration: 'none',
                  textUnderline: 'none',
                }}
              >
                {' '}
                {translate('privacy_policy_settings.your_online_choices')}
              </span>
            </a>
          </span>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.to_opt_out')}
          </span>
          <span lang="EN">
            <a style={{ color: '#229FD2' }} href="https://adssettings.google.com/authenticated" role={ARIA_ROLES.LINK}>
              <span
                style={{
                  fontSize: '12pt',
                  lineHeight: '150%',
                  color: '#229FD2',
                  textDecoration: 'none',
                  textUnderline: 'none',
                }}
              >
                {' '}
                {translate('privacy_policy_settings.google_ads')}
              </span>
            </a>
          </span>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.page_we_do_not')}
          </span>
        </li>
        <li className="MsoNormal" style={{ marginBottom: '0pt', lineHeight: '150%', msoList: 'l1 level1 lfo16' }}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {translate('privacy_policy_settings.notice_concerning')}
          </span>
          <span lang="EN">
            <a style={{ color: '#229FD2' }} href="https://allaboutdnt.com/" role={ARIA_ROLES.LINK}>
              <span
                style={{
                  fontSize: '12pt',
                  lineHeight: '150%',
                  color: '#229FD2',
                  textDecoration: 'none',
                  textUnderline: 'none',
                }}
              >
                {' '}
                {translate('privacy_policy_settings.here')}
              </span>
            </a>
          </span>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
            .
          </span>
        </li>
      </ol>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'G. '}
          {translate('privacy_policy_settings.sharing_visitor_info')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.we_share_info_websites')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l22 level1 lfo2' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.sections.affiliates')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.sections.family_of_companies')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l22 level1 lfo2' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.service_providers_third_party')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l22 level1 lfo2' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.business_transfers_ownership')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.sections.will_comply_with')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l22 level1 lfo2' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.public_forums')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.community_forum')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.may_use_it_for')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.marketing_materials')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{
          marginTop: '0cm',
          marginRight: '0cm',
          marginBottom: '0pt',
          marginLeft: '36pt',
          textIndent: '-18pt',
          lineHeight: '150%',
          msoList: 'l22 level1 lfo2',
        }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.consent')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'H. '}
          {translate('privacy_policy_settings.retention_of_your_info')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.we_will_retain_info')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'I. '}
          {translate('privacy_policy_settings.sections.data_subject_rights')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.local_legal_req')}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.contact_info_section')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l19 level1 lfo25' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.provide_access_to')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l19 level1 lfo25' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.prevent_the_processing')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l19 level1 lfo25' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.update_the_info')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l19 level1 lfo25' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.delete_certain')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l19 level1 lfo25' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.restrict_the_way')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{ marginLeft: '36pt', textIndent: '-18pt', lineHeight: '150%', msoList: 'l19 level1 lfo25' }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.transfer_your')}
        </span>
      </p>
      <p
        className="MsoNormal"
        style={{
          marginTop: '0cm',
          marginRight: '0cm',
          marginBottom: '0pt',
          marginLeft: '36pt',
          textIndent: '-18pt',
          lineHeight: '150%',
          msoList: 'l19 level1 lfo25',
        }}
      >
        {/* [if !supportLists] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          <span style={{ msoList: 'Ignore' }}>
            ●
            <span style={{ font: '7pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp; </span>
          </span>
        </span>
        {/* [endif] */}
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.revoke_your')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.we_will_consider')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'J. '}
          {translate('privacy_policy_settings.third_party_links')}
          {' '}
          <span className="GramE">{translate('privacy_policy_settings.and')}</span>
          {' '}
          {translate('privacy_policy_settings.services')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.websites_may_contain')}
          {' '}
          <span className="SpellE">Workhall</span>
          ,
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.is_not_responsible')}
        </span>
      </p>
      <h2
        style={{
          marginTop: '24pt',
          marginRight: '0cm',
          marginBottom: '18pt',
          marginLeft: '-21px',
          lineHeight: '150%',
          msoPagination: 'widow-orphan',
          pageBreakAfter: 'auto',
        }}
        className={styles.headingLink}
      >
        <a style={{ visibility: 'hidden' }} name="_ce3nd8aneirw" href="/privacy_policy#additional-privacy-terms-for-all-users" role={ARIA_ROLES.LINK}>
        <HashLinkIcon ariaHidden />
        </a>
        <span style={{ marginLeft: '5px', fontSize: '11pt', lineHeight: '150%', color: '#151b26' }} lang="EN" id="additional-privacy-terms-for-all-users">
          {'V. '}
          {translate('privacy_policy_settings.additional_privacy_terms')}
        </span>
      </h2>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.the_following_additional')}
          {' '}
          <span className="SpellE">Workhall&apos;s</span>
          {' '}
          {translate('privacy_policy_settings.privacy_practices')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.subscribers_free_users')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'A. '}
          {translate('privacy_policy_settings.international_users')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span className="SpellE">
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
            Workhall
          </span>
        </span>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {' '}
          {translate('privacy_policy_settings.complies_with_the')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.has_certified')}
          {' '}
        </span>
        <span lang="EN">
          <a style={{ color: '#229FD2' }} href="https://www.privacyshield.gov/" role={ARIA_ROLES.LINK}>
            <span
              style={{ fontSize: '12pt', lineHeight: '150%', color: '#229FD2', textDecoration: 'none', textUnderline: 'none' }}
            >
              https://www.privacyshield.gov/
            </span>
          </a>
        </span>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.in_compliance_with')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.commits_to_resolve')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.at')}
          {' '}
        </span>
        <a style={{ color: '#229FD2' }} href="mailto:ask@workhall.com" role={ARIA_ROLES.LINK}>
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#229FD2' }} lang="EN">
          ask@workhall.com.
          </span>
        </a>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.has_further_committed')}
          <span className="SpellE">Workhall</span>
          {translate('privacy_policy_settings.please_visit')}
          {' '}
        </span>
        <span lang="EN">
          <a style={{ color: '#229FD2' }} href="https://www.bbb.org/EU-privacy-shield/for-eu-consumers/" role={ARIA_ROLES.LINK}>
            <span
              style={{ fontSize: '12pt', lineHeight: '150%', color: '#229FD2', textDecoration: 'none', textUnderline: 'none' }}
            >
              https://www.bbb.org/EU-privacy-shield/for-eu-consumers/
            </span>
          </a>
        </span>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {' '}
          {translate('privacy_policy_settings.for_more_info')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.is_subject_to')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.we_may_transfer')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.will_take_reasonable')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.is_potentially_liable')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'B. '}
          {translate('privacy_policy_settings.changes')}
          {' '}
          <span className="GramE">{translate('privacy_policy_settings.to')}</span>
          {' '}
          {translate('privacy_policy_settings.our_privacy_policy')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.we_reserve_the')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'C. '}
          {translate('privacy_policy_settings.how_we_protect')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span className="SpellE">
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
            Workhall
          </span>
        </span>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {' '}
          {translate('privacy_policy_settings.takes_technical')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'D. '}
          {translate('privacy_policy_settings.marketing_practices')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.if_you_receive')}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.contact_info_section_long')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          {'E. '}
          {translate('privacy_policy_settings.california_privacy')}
        </span>
      </p>
      <p className="MsoNormal" style={{ marginBottom: '18pt', lineHeight: '150%' }}>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.california_law_gives')}
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.does_not_share')}
        </span>
      </p>
      <h2
        style={{
          marginTop: '24pt',
          marginRight: '0cm',
          marginBottom: '18pt',
          marginLeft: '-21px',
          lineHeight: '150%',
          msoPagination: 'widow-orphan',
          pageBreakAfter: 'auto',
        }}
        className={styles.headingLink}
      >
        <a style={{ visibility: 'hidden' }} name="_50f98995dr27" href="/privacy_policy#workhall-contact-info" role={ARIA_ROLES.LINK}>
        <HashLinkIcon ariaHidden />
        </a>
        <span style={{ marginLeft: '5px', fontSize: '11pt', lineHeight: '150%', color: '#151b26' }} lang="EN" id="workhall-contact-info">
          VI.
          {' '}
          <span className="SpellE">Workhall</span>
          {' '}
          {translate('privacy_policy_settings.contact_info')}
        </span>
      </h2>
      <p className="MsoNormal" style={{ lineHeight: '150%' }}>
        <span className="SpellE">
          <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
            Workhall
            {' '}
          </span>
        </span>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.is_located_at')}
          {' '}
        </span>
        <span
          style={{ fontSize: '11.5pt', lineHeight: '150%', color: '#666666', background: 'white', msoHighlight: 'white' }}
          lang="EN"
        >
          Level 2, #185, 3rd Main Road,
          {' '}
          <span className="SpellE">Natesa</span>
          {' '}
          Nagar,
          {' '}
          <span className="SpellE"> Virugambakkam,</span>
          {' '}
          <span className="SpellE">Chennai – 600 092 </span>
          , Tamil Nadu, India
        </span>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
        {translate('privacy_policy_settings.if_you_wish_to')}
          {' '}
        </span>
        <a style={{ color: '#229FD2' }} href="mailto:ask@workhall.com" role={ARIA_ROLES.LINK}>
            <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#229FD2' }} lang="EN">
            ask@workhall.com
            </span>
        </a>
        <span style={{ fontSize: '12pt', lineHeight: '150%', color: '#646f79' }} lang="EN">
          .
        </span>
      </p>
      <p className="MsoNormal" style={{ lineHeight: '150%' }}>
        <span lang="EN">&nbsp;</span>
      </p>
    </div>
  );
}
export const privacy_string =
  "LAST REVISION: [07-06-2019] PLEASE READ THIS TERMS OF SERVICE AGREEMENT CAREFULLY. BY USING THIS WEBSITE OR DONATING PRODUCTS FROM THIS WEBSITE YOU AGREE TO BE BOUND BY ALL OF THE TERMS AND CONDITIONS OF THIS AGREEMENT. This Terms of Service Agreement (the Agreement) governs your use of this website, [www.thehumane.life] (the Website), [Vuram Foundation] (Vuram Foundation) offer of a donation of goods on this Website, or your purchase of products available on this Website. This Agreement includes, and incorporates by this reference, the policies and guidelines referenced below. [Vuram Foundation] reserves the right to change or revise the terms and conditions of this Agreement at any time by posting any changes or a revised Agreement on this Website. [Vuram Foundation] will alert you that changes or revisions have been made by indicating on the top of this Agreement the date it was last revised. The changed or revised Agreement will be effective immediately after it is posted on this Website. Your use of the Website following the posting any such changes or of a revised Agreement will constitute your acceptance of any such changes or revisions. [Vuram Foundation] encourages you to review this Agreement whenever you visit the Website to make sure that you understand the terms and conditions governing the use of the Website. This Agreement does not alter in any way the terms or conditions of any other written agreement you may have with [Vuram Foundation] for other products or services. If you do not agree to this Agreement (including any referenced policies or guidelines), please immediately terminate your use of the Website. If you would like to print this Agreement, please click the print button on your browser toolbar. I. DONATION OF PRODUCTS Terms of Offer. This Website offers for donation of certain products (the Donated Products). By placing an order for Donated Products through this Website, you agree to the terms set forth in this Agreement. Customer Solicitation: Unless you notify our third party call center reps or direct [Vuram Foundation] sales reps, while they are calling you, of your desire to opt out from further direct company communications and solicitations, you are agreeing to continue to receive further emails and call solicitations [Vuram Foundation] and it's designated in house or third party call team(s).Opt Out Flow: We provide 3 easy ways to opt out of from future solicitations. 1. You may use the opt out link found in any email solicitation that you may receive. 2. You may also choose to opt out, via sending your email address to: [opt-out email].3. You may send a written remove request to [Company Address].";

export default privacy_string;
