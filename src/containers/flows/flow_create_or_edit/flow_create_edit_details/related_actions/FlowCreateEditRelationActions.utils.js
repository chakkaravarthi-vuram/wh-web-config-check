import React from 'react';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import EditDatalistIcon from '../../../../../assets/icons/datalists/EditDatalistIcon';

export const getSubFlowTableData = (data = [], isReadOnly, onEdit) => {
  const triggerDetails = [];
  data?.forEach((trigger, index) => {
    const dataObject = {};
    const compArray = [];
    dataObject.id = index + 1;
    compArray.push(
      <Text
        content={trigger.childFlowName || trigger.child_flow_name}
        className={cx(gClasses.FTwo13BlackV12, gClasses.WhiteSpaceNoWrap)}
      />,
    );
    compArray.push(
      <Text
        content={trigger.triggerName || trigger.trigger_name}
        className={cx(gClasses.FTwo13BlackV12, gClasses.WhiteSpaceNoWrap)}
      />,
    );
    if (!isReadOnly) {
      compArray.push(
        <div className={cx(gClasses.CenterVH, gClasses.WhiteSpaceNoWrap)}>
          <button
            className={cx(gClasses.CenterVH, gClasses.MR6)}
            onClick={() => onEdit(trigger)}
          >
            <EditDatalistIcon />
          </button>
        </div>,
      );
    } else compArray.push('');
    dataObject.component = compArray;
    triggerDetails.push(dataObject);
  });
  return triggerDetails;
};
