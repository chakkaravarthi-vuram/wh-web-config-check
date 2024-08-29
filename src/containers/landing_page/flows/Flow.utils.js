import cx from 'classnames/bind';
import { LIST_TYPE } from 'components/list_headers/ListHeader';
import gClasses from 'scss/Typography.module.scss';
import jsUtility from 'utils/jsUtility';
import { BS } from 'utils/UIConstants';
import styles from './Flows.module.scss';

export const createElementAllFlow = (flowList, type) => {
    const reference = document.getElementById('flowHeader')?.clientWidth;
    const mainBlock = document.createElement('div');
    mainBlock.className = cx(BS.D_FLEX, styles.Flows, BS.D_NONE);
    flowList.forEach((flow) => {
        const block = document.createElement('div');
        block.className = cx(styles.DuplicateContainer, gClasses.FTwo13, styles.FlowCard, gClasses.Ellipsis);
        block.innerText = (type === LIST_TYPE.FLOW) ? flow.flow_name : flow.data_list_name;
        mainBlock.append(block);
    });
    document.body.appendChild(mainBlock);

    let AllChildrenWidth = 0;
    const widthArray = [];
    let moreCard = 0;
    mainBlock?.childNodes?.forEach((rowData, index) => {
      AllChildrenWidth += rowData.offsetWidth;
      if ((index + 1) !== mainBlock.childNodes.length) {
        AllChildrenWidth += 16;
      } else moreCard = rowData.offsetWidth;
      widthArray.push(AllChildrenWidth);
    });
    document.body.removeChild(mainBlock);
    let exceptMoreCardWidth;
    let closestCardWidth;
    if (!jsUtility.isEmpty(widthArray)) {
        exceptMoreCardWidth = reference - moreCard;
        const allWidth = widthArray;
        if (!jsUtility.isEmpty(allWidth)) {
          closestCardWidth = allWidth.reduce((prev, curr) =>
           Math.abs(curr - exceptMoreCardWidth) < Math.abs(prev - exceptMoreCardWidth) ? curr : prev);
        }
    }
    const projectedCardCount = widthArray.indexOf(closestCardWidth) + 1;
    if (projectedCardCount > 0) return projectedCardCount;
    return 2;
};
