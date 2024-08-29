import React, { useContext, useState } from 'react';
import cx from 'classnames';
import { EButtonType, TextInput, Button, BorderRadiusVariant, Variant } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { isEmpty } from 'utils/jsUtility';
import SearchPrefixIcon from 'assets/icons/app_builder_icons/SearchPrefixIcon';
import SearchArrowIcon from 'assets/icons/app_builder_icons/SearchArrow';
import ThemeContext from 'hoc/ThemeContext';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import styles from './PromptInput.module.scss';

function PromptInput(props) {
    const [searchText, setSearchText] = useState(EMPTY_STRING);
    const [isFocused, setFocus] = useState(false);
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const {
        postDataToCreateSource,
        placeholder,
        wrapperClassName,
        userTheme,
    } = props;

    const onChangeHandler = (event) => {
        setSearchText(event.target.value);
    };

    const createSourceWithPromptText = async () => {
        const data = { prompt: searchText };
        const controller = new AbortController();
        await postDataToCreateSource(data, controller);
    };
    const handleInputFocus = () => setFocus(true);
    const handleInputBlur = () => setFocus(false);

    const actualColorScheme = userTheme ? colorScheme : colorSchemeDefault;

    const isEmptyText = isEmpty(searchText);
    const buttonBg = `${actualColorScheme?.activeColor}40`;
    return (
        <TextInput
            prefixIcon={<SearchPrefixIcon fillColor={buttonBg} />}
            placeholder={placeholder}
            value={searchText}
            onChange={onChangeHandler}
            onFocusHandler={handleInputFocus}
            onBlurHandler={handleInputBlur}
            className={cx(styles.InputWrapper, wrapperClassName)}
            inputClassName={cx(styles.Input, gClasses.P16)}
            colorScheme={actualColorScheme}
            variant={isFocused ? Variant.border : Variant.borderLess}
            autoComplete="off"
            borderRadiusType={BorderRadiusVariant.rounded}
            suffixIcon={(
                <Button
                    iconOnly
                    noBorder
                    disabled={isEmptyText}
                    className={isEmptyText}
                    style={{ background: (!isEmptyText || isFocused) ? buttonBg : 'transparent' }}
                    icon={(
                        <SearchArrowIcon fillColor={(!isEmptyText || isFocused) && actualColorScheme?.activeColor} className={styles.SearchIcon} />
                    )}
                    type={EButtonType.PRIMARY}
                    onClickHandler={createSourceWithPromptText}
                    colorSchema={actualColorScheme}
                />
            )}
        />
    );
}

PromptInput.defaultProps = {
    userTheme: false,
};

export default PromptInput;
