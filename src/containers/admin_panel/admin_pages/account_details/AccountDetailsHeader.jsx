import React from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import DefaultLogo from 'assets/img/admin_panel/default_company.png';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import BackIcon from 'assets/icons/BackIcon';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { isArray, isEmpty } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import styles from './AccountDetails.module.scss';
import ADMIN_ACCOUNT_MANAGEMENT_STRINGS from '../accounts/Accounts.strings';
import { routeNavigate } from '../../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../../utils/Constants';
import { ACCOUNT_DETAILS } from '../../../../urls/RouteConstants';

function AccountDetailsHeader(props) {
  const { isLoading, id, company } = props;

  const history = useHistory();
  const { t } = useTranslation();

  const getCompanyType = (industryType) =>
    industryType && isArray(industryType)
      ? industryType.slice(0, 2).join(', ')
      : '';

  const getCompanyTypeDropdown = (industryType) => {
    if (industryType && isArray(industryType)) {
      const industryOptions = industryType
        .slice(2, industryType.length)
        .map((type) => {
          return {
            label: type,
            value: type,
          };
        });

      if (isEmpty(industryOptions)) return null;
      return (
        <div>
          <Dropdown
            dropdownListClasses={styles.DropdownList}
            optionListClassName={styles.OptionList}
            id="admin-header-id"
            optionList={industryOptions}
            viewComponent={(
              <div
                className={cx(
                  styles.PlusButton,
                  BS.D_FLEX_JUSTIFY_CENTER,
                  BS.ALIGN_ITEM_CENTER,
                )}
              >
                {industryOptions && `+${industryOptions.length}`}
              </div>
            )}
            onChange={() => {}}
            tabBased
            isNewDropdown
            isBorderLess
            noInputPadding
            isTaskDropDown
            isSortDropdown
            isViewDropdown
          />
        </div>
      );
    }
    return null;
  };

  const handleBackClick = () => {
    const superAdminPathName = ACCOUNT_DETAILS.ACCOUNT;
    routeNavigate(history, ROUTE_METHOD.PUSH, superAdminPathName, null, null);
  };

  const onEditClick = () => {
    if (isEmpty(id)) return;
    const editAccountPathName = `${ACCOUNT_DETAILS.EDIT_ACCOUNT_ID}${id}`;
    routeNavigate(history, ROUTE_METHOD.PUSH, editAccountPathName, null, null);
  };

  return (
    <div className={styles.HeaderOuterDiv}>
      <div className={cx(BS.D_FLEX, styles.BackToAccounts)}>
        {isLoading ? (
          <Skeleton width={200} height={10} />
        ) : (
          <span
            className={cx(gClasses.CursorPointer, BS.D_FLEX)}
            onClick={handleBackClick}
            role="presentation"
          >
            <BackIcon className={styles.BackIcon} />
            <h2 className={styles.BackToAccountsTxt}>{t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.BACK_TO_ACCOUNTS)}</h2>
          </span>
        )}
      </div>
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
        <div className={cx(BS.D_FLEX, styles.DetailsOuterDiv)}>
          <div className={styles.CompanyLogoDiv}>
            {isLoading ? (
              <Skeleton width={100} height={50} />
            ) : (
              <img
                src={company.companyLogo || DefaultLogo}
                alt={company.CompanyName}
                className={styles.CompanyLogo}
              />
            )}
          </div>
          <div className={styles.CompanyDetails}>
            {isLoading ? (
              <Skeleton width={300} height={50} />
            ) : (
              <>
                <div
                  className={cx(
                    BS.D_FLEX,
                    BS.ALIGN_ITEM_CENTER,
                    styles.BasicDetails,
                  )}
                >
                  <div className={cx(styles.CompanyName)}>
                    {company.companyName || 'NA'}
                  </div>
                  <div className={styles.BorderRight} />
                  <div className={cx(styles.CompanyUrl)}>
                    <a
                      href={company.companyUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {company.companyUrl || 'NA'}
                    </a>
                  </div>
                  {company.companyType && (
                    <div className={styles.BorderRight} />
                  )}
                  <div className={styles.CompanyType}>
                    {getCompanyType(company.companyType)}
                    {getCompanyTypeDropdown(company.companyType)}
                  </div>
                </div>
                <div className={styles.CompanyAddress}>
                  {company.companyAddress || 'NA'}
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.SecondaryButtonDiv}>
          <Button
            buttonType={BUTTON_TYPE.OUTLINE_PRIMARY}
            className={cx(
              BS.TEXT_NO_WRAP,
              gClasses.PL15,
              styles.OutlinePrimaryButton,
            )}
            onClick={onEditClick}
          >
            {t(ADMIN_ACCOUNT_MANAGEMENT_STRINGS.EDIT_BUTTON)}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AccountDetailsHeader;
