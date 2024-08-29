import React from 'react';
import { Card } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import PlusIconNew from '../../../../assets/icons/PlusIconV2';
import gClasses from '../../../../scss/Typography.module.scss';
import style from './AppComponentAddition.module.scss';
import { ADD_COMPONENT_LABEL } from '../AppBuilder.strings';

function AppComponentAddition(props) {
    const { t } = useTranslation();
    const { onAddComponentClick, id } = props;

    return (
        <Card
            isCustom
            id={id}
            className={cx(BS.W100, BS.H100, gClasses.CenterVH, style.AddCard)}
            customRenderer={
                <div
                    className={cx(BS.D_FLEX)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onAddComponentClick}
                    onClick={onAddComponentClick}
                >
                    <PlusIconNew />
                    <div className={cx(gClasses.ML4, gClasses.FS13, gClasses.FontWeight500)} style={{ color: '#217CF5' }}>
                        {t(ADD_COMPONENT_LABEL)}
                    </div>
                </div>
            }
        />
    );
}
export default AppComponentAddition;
