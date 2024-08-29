import React from 'react';
import { Anchor } from '@workhall-pvt-lmt/wh-ui-library';
import jsUtility from '../../../utils/jsUtility';

function AnchorWrapper(props) {
    const {
        id,
        className,
        labelText,
        value,
        isLoading,
        labelClassName,
        inputClassName,
        flexClass,
        inputInnerClassName,
        linkClassName,
        linkInnerClassName,
        valuePlaceholder,
        required,
        placeholder,
        type,
        errorMessage,
        errorVariant,
        helpTooltip,
        helpTooltipPlacement,
        icon,
        onClear,
        onChange,
        onMouseDownHandler,
        onMouseOverHandler,
        onMouseOutHandler,
        onInputKeyDownHandler,
        iconPosition,
        labelPlacement,
        instruction,
        readOnly,
        colorScheme,
        fontScheme,
        isMultiple,
        isDelete,
        size,
        referenceName,
        linkTextClass,
        linkURLClass,
    } = props;

    const onBlurHandler = (linkState, index) => {
        const linkLocal = jsUtility.cloneDeep(linkState);
        const updatedLink = linkState[index].link_url;
        if (!jsUtility.isEmpty(updatedLink) && (!(updatedLink.includes('http'))) && (!(updatedLink.includes('https'))) && (!(updatedLink.includes('://'))) && (!(updatedLink.includes(':/')))) {
            linkLocal[index].link_url = `http://${updatedLink}`;
        }
        onChange?.(linkLocal);
    };

    return (
        <Anchor
            id={id}
            flexClass={flexClass}
            className={className}
            labelText={labelText}
            value={value}
            isLoading={isLoading}
            labelClassName={labelClassName}
            inputClassName={inputClassName}
            inputInnerClassName={inputInnerClassName}
            linkClassName={linkClassName}
            linkInnerClassName={linkInnerClassName}
            valuePlaceholder={valuePlaceholder}
            required={required}
            placeholder={placeholder}
            type={type}
            errorMessage={errorMessage}
            errorVariant={errorVariant}
            helpTooltip={helpTooltip}
            helpTooltipPlacement={helpTooltipPlacement}
            icon={icon}
            onClear={onClear}
            onChange={onChange}
            onMouseDownHandler={onMouseDownHandler}
            onMouseOverHandler={onMouseOverHandler}
            onMouseOutHandler={onMouseOutHandler}
            onInputKeyDownHandler={onInputKeyDownHandler}
            onBlurHandler={onBlurHandler}
            iconPosition={iconPosition}
            labelPlacement={labelPlacement}
            instruction={instruction}
            readOnly={readOnly}
            colorScheme={colorScheme}
            fontScheme={fontScheme}
            isMultiple={isMultiple}
            isDelete={isDelete}
            size={size}
            referenceName={referenceName}
            linkTextClass={linkTextClass}
            linkURLClass={linkURLClass}
        />
    );
}

export default AnchorWrapper;
