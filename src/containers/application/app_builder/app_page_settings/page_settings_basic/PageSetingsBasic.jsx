import React from 'react';
import { Anchor, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { APP_PAGE_SETTINGS } from '../../AppBuilder.strings';
import style from '../AppPageSettings.module.scss';
import jsUtility from '../../../../../utils/jsUtility';
import { APP } from '../../../../../urls/RouteConstants';

function PageSettingsBasic(props) {
    const {
        currentPageConfig,
        currentPageConfig: {
            errorList,
        },
        appPageConfigDataChange,
        activeAppData,
    } = props;
    const { t } = useTranslation();
    const { BASIC } = APP_PAGE_SETTINGS(t);
    const appUrl = `${window.location.origin}${APP}${activeAppData?.url_path}/`;

    const onChangeBasicSettings = (e, id) => {
        const { value } = e.target;
        const errorData = jsUtility.cloneDeep(errorList);
        const currentData = {};
        currentData[id] = value;
        if (id === BASIC.PAGE_NAME.ID) {
            const url_path = jsUtility.join(jsUtility.split(value.toLowerCase(), ' '), '-');
            currentData.url_path = url_path;
            if (errorData?.[BASIC.PAGE_URL.ID]) delete errorData?.[BASIC.PAGE_URL.ID];
        }
        if (!jsUtility.isEmpty(errorData)) {
            delete errorData?.[id];
        }
        appPageConfigDataChange({ ...currentData, errorList: errorData });
    };

    return (
        <div className={cx(gClasses.MT25, gClasses.PL40, gClasses.PR40)}>
            <TextInput
                id={BASIC.PAGE_NAME.ID}
                labelText={BASIC.PAGE_NAME.LABEL}
                isLoading={false}
                placeholder={BASIC.PAGE_NAME.PLACEHOLDER}
                value={currentPageConfig?.name}
                onChange={(e) => {
                    onChangeBasicSettings(e, BASIC.PAGE_NAME.ID);
                }}
                required
                errorMessage={errorList[BASIC.PAGE_NAME.ID]}
                className={cx(gClasses.DisplayFlex, gClasses.FirstChild100)}
                labelClassName={gClasses.FTwo12BlackV20}
            />
            <Anchor
                id={BASIC.PAGE_URL.ID}
                className={cx(style.AppUrl, gClasses.PT16)}
                labelText={BASIC.PAGE_URL.LABEL}
                labelClassName={gClasses.FTwo12BlackV20}
                placeholder={appUrl}
                blockUrlPrefix
                value={[{ link_url: currentPageConfig?.url_path, link_text: appUrl }]}
                onChange={(value) => {
                    const e = { target: { value: value[0]?.link_url } };
                    onChangeBasicSettings(e, BASIC.PAGE_URL.ID);
                }}
                required
                errorMessage={[{ link_url: errorList[BASIC.PAGE_URL.ID] }]}
                inputInnerClassName={cx(style.InputInnerClass, gClasses.NoPointerEvent)}
                linkClassName={style.LinkClass}
            />
        </div>
    );
}
export default PageSettingsBasic;
