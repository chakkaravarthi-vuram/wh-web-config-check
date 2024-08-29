import React, { useState } from 'react';
import cx from 'classnames/bind';
import { Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { COMMA, SPACE, NA } from 'utils/strings/CommonStrings';
import { BS } from '../../../../utils/UIConstants';
import styles from '../ModelDetails.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import FormTitle from '../../../../components/form_components/form_title/FormTitle';
import { ML_MODEL_STRINGS } from '../../MLModels.strings';
import { generateContent } from '../../MLModels.utils';
import { ML_MODEL_LANGUAGE_SUPPORTED_ELLIPSIS_CHARS } from '../../MlModels.constants';

function ModelCard(props) {
    const {
        modelData,
        isModelDetailLoading,
    } = props;
    const { t } = useTranslation();
    const [showFullText, setShowFullText] = useState(false);
    const { VIEW_LESS, VIEW_MORE, MODEL_CARD } = ML_MODEL_STRINGS(t).MODEL_DETAILS;
    const toggleShowFullText = () => {
        setShowFullText(!showFullText);
    };

    const buttonText = (
        <button className={cx(gClasses.BlueV39, gClasses.ML3)} onClick={toggleShowFullText}>
            {showFullText ? VIEW_LESS : VIEW_MORE}
        </button>
    );

    return (
        modelData &&
        <div>
            <div className={gClasses.MT24}>
                <FormTitle isDataLoading={isModelDetailLoading} fontFamilyStyle={styles.FontFamilyStyle}>{MODEL_CARD.MODEL_CARD_DETAILS}</FormTitle>
            </div>
            <div className={cx(BS.D_FLEX, styles.ModelCardData, gClasses.MT16)}>
                    <div className={styles.ModelCardColumn}>
                        <Text
                            content={MODEL_CARD.LANGUAGES_SUPPORTED}
                            size={ETextSize.MD}
                            className={cx(gClasses.FontWeight500, styles.MFALabel)}
                            isLoading={isModelDetailLoading}
                        />
                        <Text
                            content={generateContent(modelData?.model_card_details?.languages_supported?.join(COMMA + SPACE), ML_MODEL_LANGUAGE_SUPPORTED_ELLIPSIS_CHARS, buttonText, showFullText)}
                            size={ETextSize.SM}
                            isLoading={isModelDetailLoading}
                        />
                    </div>
                    <div className={cx(styles.ModelCardColumn, styles.ModelCardColumnRight)}>
                        <Text
                            content={MODEL_CARD.SUPPORTED_FORMATS}
                            size={ETextSize.MD}
                            className={cx(gClasses.FontWeight500, styles.MFALabel)}
                            isLoading={isModelDetailLoading}
                        />

                        <Text
                            content={modelData?.model_card_details?.supported_file_formats?.join(COMMA + SPACE) || NA}
                            size={ETextSize.SM}
                            isLoading={isModelDetailLoading}
                        />
                    </div>
            </div>
            {/* commenting the models release data */}
            {/* <div className={cx(BS.D_FLEX, styles.ModelCardData, gClasses.MT16)}>
                <div className={cx(styles.ModelCardColumn)}>
                        <Text
                            content={MODEL_CARD.MODEL_RELEASE_DATE}
                            size={ETextSize.MD}
                            className={cx(gClasses.FontWeight500, styles.MFALabel)}
                            isLoading={isModelDetailLoading}
                        />
                        <Text
                            content={modelData?.model_card_details?.model_release_date}
                            size={ETextSize.SM}
                            isLoading={isModelDetailLoading}
                        />
                </div>
            </div> */}
            <div className={cx(styles.ModelCardTitle)}>
                <FormTitle isDataLoading={isModelDetailLoading} fontFamilyStyle={styles.FontFamilyStyle}>{MODEL_CARD.BEST_PRACTICES_LIMITATIONS}</FormTitle>
            </div>
            <div className={cx(BS.D_FLEX, styles.ModelCardData)}>
                <div className={styles.ModelCardColumn}>
                    <Text
                        content={MODEL_CARD.BEST_PRACTICES}
                        size={ETextSize.MD}
                        className={cx(gClasses.MT16, gClasses.FontWeight500, styles.MFALabel)}
                        isLoading={isModelDetailLoading}
                    />
                    <ul>
                        {modelData?.best_practices.map((item, index) => (
                            <Text
                                content={`${index + 1}. ${item}`}
                                size={ETextSize.SM}
                                isLoading={isModelDetailLoading}
                            />
                        ))}
                    </ul>
                </div>
            </div>
            <div className={cx(BS.D_FLEX, styles.ModelCardData)}>
                <div className={styles.ModelCardColumn}>
                    {modelData?.limitations.map((item) =>
                        <>
                            <Text
                                content={item.limitation_type}
                                size={ETextSize.MD}
                                className={cx(gClasses.MT16, gClasses.FontWeight500, styles.MFALabel)}
                                isLoading={isModelDetailLoading}
                            />
                            <ul>
                                {item?.description.map((desc, index) => (
                                    <Text
                                        content={`${index + 1}. ${desc}`}
                                        size={ETextSize.SM}
                                        isLoading={isModelDetailLoading}
                                    />
                                ))}
                            </ul>
                        </>,
                    )}
                </div>
            </div>
        </div>
    );
}

export default ModelCard;
