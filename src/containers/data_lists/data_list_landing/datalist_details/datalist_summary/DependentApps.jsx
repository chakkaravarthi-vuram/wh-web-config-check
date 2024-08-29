import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ETitleSize,
  PaginationButtonPlacement,
  TableWithPagination,
  Text,
  Title,
  TableColumnWidthVariant,
  ButtonContentVaraint,
  BorderRadiusVariant,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { DATALISTS_CONSTANTS } from '../../DatalistsLanding.constant';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import style from '../DatalistDetails.module.scss';

function DependentApps() {
  const { t } = useTranslation();
  const { DATALIST_DEPENDANT_APPS_STATUS, SHOWING, OF, DATALIST_SUMMARY } = DATALISTS_CONSTANTS(t);

  const getTableRowText = (dataText) => <Text content={dataText} className={cx(gClasses.FTwo12BlackV18, gClasses.FontWeight500)} />;

  // Sample Data for Dependant Apps Tables
  const DependantData = [
    { component: [getTableRowText('Contract Management'), getTableRowText('Emily Johnson'), getTableRowText('Draft')], id: EMPTY_STRING },
    { component: [getTableRowText('Contract Management'), getTableRowText('Emily Johnson'), getTableRowText('Draft')], id: EMPTY_STRING },
  ];

  return (
    <div>
      <Title size={ETitleSize.xs} content={DATALIST_SUMMARY.DEPENDANT_APPS} className={cx(gClasses.GrayV3, gClasses.MT24, gClasses.MB12)} />
      <TableWithPagination
          tableClassName={style.TableDependantApps}
          header={[{ label: DATALIST_DEPENDANT_APPS_STATUS.APP_NAME }, { label: DATALIST_DEPENDANT_APPS_STATUS.UPDATED_BY }, { label: DATALIST_DEPENDANT_APPS_STATUS.STATUS }]}
          data={DependantData}
          widthVariant={TableColumnWidthVariant.CUSTOM}
          paginationProps={{
              totalItemsCount: 10,
              itemsCountPerPage: 3,
              activePage: 1,
              constructItemsCountMessage: (itemStart, itemEnd, totalCount) =>
              `${SHOWING} ${itemStart} - ${itemEnd} ${OF} ${totalCount}`,
              prevAndNextButtonContentVariant: ButtonContentVaraint.icon,
              prevAndNextButtonPlacement: PaginationButtonPlacement.connected,
              shape: BorderRadiusVariant.square,
          }}
      />
    </div>
  );
}

export default DependentApps;
